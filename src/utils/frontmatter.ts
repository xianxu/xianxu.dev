import fs from 'node:fs';
import path from 'node:path';
import getReadingTime from 'reading-time';
import { toString } from 'mdast-util-to-string';
import { visit } from 'unist-util-visit';
import yaml from 'js-yaml';
import limax from 'limax';
import type { RehypePlugin, RemarkPlugin } from '@astrojs/markdown-remark';

export const readingTimeRemarkPlugin: RemarkPlugin = () => {
  return function (tree, file) {
    const textOnPage = toString(tree);
    const readingTime = Math.ceil(getReadingTime(textOnPage).minutes);

    if (typeof file?.data?.astro?.frontmatter !== 'undefined') {
      file.data.astro.frontmatter.readingTime = readingTime;
    }
  };
};

const trimSlash = (s: string) => s.replace(/^\/+|\/+$/g, '');

const loadPostPermalinkPattern = (): string => {
  const cfg = yaml.load(fs.readFileSync(path.resolve('./src/config.yaml'), 'utf-8')) as {
    apps?: { blog?: { post?: { permalink?: string } } };
  };
  return trimSlash(cfg?.apps?.blog?.post?.permalink || '/%slug%');
};

const renderPermalink = (pattern: string, slug: string, publishDate: Date): string => {
  const pad = (n: number) => String(n).padStart(2, '0');
  return (
    '/' +
    pattern
      .replace('%slug%', slug)
      .replace('%year%', String(publishDate.getFullYear()))
      .replace('%month%', pad(publishDate.getMonth() + 1))
      .replace('%day%', pad(publishDate.getDate()))
      .replace('%hour%', pad(publishDate.getHours()))
      .replace('%minute%', pad(publishDate.getMinutes()))
      .replace('%second%', pad(publishDate.getSeconds()))
      .replace('%category%', '')
  );
};

// Cache parsed frontmatter per absolute path so we don't re-read the same file
// repeatedly during a build.
const frontmatterCache = new Map<string, { publishDate: Date } | null>();
const readPostFrontmatter = (absPath: string): { publishDate: Date } | null => {
  if (frontmatterCache.has(absPath)) return frontmatterCache.get(absPath)!;
  let result: { publishDate: Date } | null = null;
  try {
    const raw = fs.readFileSync(absPath, 'utf-8');
    const match = raw.match(/^---\n([\s\S]*?)\n---/);
    if (match) {
      const fm = yaml.load(match[1]) as { publishDate?: string | Date };
      if (fm?.publishDate) result = { publishDate: new Date(fm.publishDate) };
    }
  } catch {
    result = null;
  }
  frontmatterCache.set(absPath, result);
  return result;
};

// Rewrites relative `.md` links between posts (e.g. `./mining-my-own-mind.md`)
// to the post's actual permalink computed from its frontmatter and the global
// permalink pattern. Lets posts cross-link in a way that's also navigable as
// raw markdown (in editors, on GitHub, etc.).
export const relativePostLinksRemarkPlugin: RemarkPlugin = () => {
  const pattern = loadPostPermalinkPattern();
  return (tree, file) => {
    const sourcePath = file.history?.[0] || file.path;
    if (!sourcePath) return;
    const sourceDir = path.dirname(sourcePath);

    visit(tree, 'link', (node: { url: string }) => {
      const url = node.url;
      if (!url || !/^\.\.?\//.test(url)) return;
      const [pathPart, hash = ''] = url.split('#');
      if (!/\.md$/i.test(pathPart)) return;

      const targetAbs = path.resolve(sourceDir, pathPart);
      const fm = readPostFrontmatter(targetAbs);
      if (!fm) return;

      const slug = path.basename(targetAbs, path.extname(targetAbs));
      const permalink = renderPermalink(pattern, slug, fm.publishDate);
      node.url = hash ? `${permalink}#${hash}` : permalink;
    });
  };
};

export const responsiveTablesRehypePlugin: RehypePlugin = () => {
  return function (tree) {
    if (!tree.children) return;

    for (let i = 0; i < tree.children.length; i++) {
      const child = tree.children[i];

      if (child.type === 'element' && child.tagName === 'table') {
        tree.children[i] = {
          type: 'element',
          tagName: 'div',
          properties: {
            style: 'overflow:auto',
          },
          children: [child],
        };

        i++;
      }
    }
  };
};

export const lazyImagesRehypePlugin: RehypePlugin = () => {
  return function (tree) {
    if (!tree.children) return;

    visit(tree, 'element', function (node) {
      if (node.tagName === 'img') {
        node.properties.loading = 'lazy';
      }
    });
  };
};

const hastToText = (node: any): string => {
  if (!node) return '';
  if (node.type === 'text') return node.value || '';
  if (Array.isArray(node.children)) return node.children.map(hastToText).join('');
  return '';
};

const makeAnchor = (id: string, label: string) => ({
  type: 'element',
  tagName: 'a',
  properties: {
    href: `#${id}`,
    className: ['anchor-link'],
    'aria-label': label,
  },
  children: [{ type: 'text', value: '#' }],
});

// Adds stable ids to headings (h1-h6) and paragraphs, plus a hover-revealed
// "#" link so any block can be deep-linked. Heading ids come from slugified
// text; paragraph ids are position-based (p-1, p-2, ...) per document.
export const anchorLinksRehypePlugin: RehypePlugin = () => {
  return function (tree) {
    const used = new Set<string>();
    const ensureUnique = (base: string) => {
      let id = base || 'section';
      let i = 2;
      while (used.has(id)) id = `${base}-${i++}`;
      used.add(id);
      return id;
    };

    let pIndex = 0;
    visit(tree, 'element', (node: any) => {
      const tag = node.tagName;
      const props = (node.properties = node.properties || {});

      if (/^h[1-6]$/.test(tag)) {
        if (!props.id) {
          const slug = limax(hastToText(node), { tone: false }) || 'section';
          props.id = ensureUnique(slug);
        } else {
          used.add(String(props.id));
        }
        // Skip if last child is already our anchor (idempotent)
        const last = node.children?.[node.children.length - 1];
        if (!(last && last.type === 'element' && last.properties?.className?.includes?.('anchor-link'))) {
          node.children = node.children || [];
          node.children.push({ type: 'text', value: ' ' });
          node.children.push(makeAnchor(String(props.id), `Link to ${tag}`));
        }
      } else if (tag === 'p') {
        // Skip paragraphs that are just images (those have their own concerns)
        const onlyImage =
          node.children?.length === 1 &&
          node.children[0].type === 'element' &&
          node.children[0].tagName === 'img';
        if (onlyImage) return;
        pIndex += 1;
        if (!props.id) props.id = ensureUnique(`p-${pIndex}`);
        else used.add(String(props.id));
        const last = node.children?.[node.children.length - 1];
        if (!(last && last.type === 'element' && last.properties?.className?.includes?.('anchor-link'))) {
          node.children = node.children || [];
          node.children.push(makeAnchor(String(props.id), 'Link to paragraph'));
        }
      }
    });
  };
};
