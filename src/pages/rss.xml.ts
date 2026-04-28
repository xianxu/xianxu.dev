import { SITE, METADATA, APP_BLOG } from 'astrowind:config';
import { fetchPosts } from '~/utils/blog';
import { getPermalink } from '~/utils/permalinks';

const escapeXml = (s: string) =>
  s.replace(/[<>&'"]/g, (c) =>
    ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;' })[c] as string
  );

export const GET = async () => {
  if (!APP_BLOG.isEnabled) {
    return new Response(null, { status: 404, statusText: 'Not found' });
  }

  const site = (import.meta.env.SITE || SITE.site || '').replace(/\/$/, '');
  const posts = await fetchPosts();

  const items = posts
    .map((post) => {
      const link = `${site}${getPermalink(post.permalink, 'post')}`;
      const guid = `urn:xianxu:personal:${post.slug}`;
      return `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${escapeXml(link)}</link>
      <guid isPermaLink="false">${escapeXml(guid)}</guid>
      <description>${escapeXml(post.excerpt || '')}</description>
      <pubDate>${post.publishDate.toUTCString()}</pubDate>
    </item>`;
    })
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(`${SITE.name}’s Blog`)}</title>
    <description>${escapeXml(METADATA?.description || '')}</description>
    <link>${escapeXml(site)}</link>
    <atom:link href="${escapeXml(site + '/rss.xml')}" rel="self" type="application/rss+xml" />
    <language>en</language>
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml' },
  });
};
