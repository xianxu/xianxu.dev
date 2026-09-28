// Verifies parleyFoldsRemarkPlugin against the marker shapes parley actually
// emits. Run: node scripts/verify-parley-folds.mjs
//
// A plain script rather than a test framework: this repo installs no test
// runner, and one plugin doesn't justify adding one. Node runs the TypeScript
// import directly (type stripping, Node >= 23.6).
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';

import { parleyFoldsRemarkPlugin } from '../src/utils/frontmatter.ts';

const render = (md) =>
  unified()
    .use(remarkParse)
    .use(parleyFoldsRemarkPlugin)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeStringify, { allowDangerousHtml: true })
    .processSync(md)
    .toString();

const TOOL_CALL = '🔧: read_file id=a1\n```json\n{"path":"init.lua"}\n```\n';

const cases = [
  {
    name: 'reasoning line folds, prefix moves to the summary',
    md: '🧠: The user is asking about state management.\n',
    want: ['<details class="parley-fold">', '<summary>🧠 thinking</summary>', 'The user is asking'],
    reject: ['🧠:'],
  },
  {
    name: 'summary line folds',
    md: '📝: You asked X, I answered Y.\n',
    want: ['<summary>📝 summary</summary>', 'You asked X'],
    reject: ['📝:'],
  },
  {
    name: 'tool call folds the fence that follows, marker line becomes the summary',
    md: TOOL_CALL,
    want: ['<summary>🔧 read_file</summary>', '<code class="language-json">', 'init.lua', '</details>'],
    reject: ['🔧:', 'id=a1'],
  },
  {
    name: 'tool result carries the error flag into the summary',
    md: '📎: read_file id=a1 error=true\n```\nENOENT\n```\n',
    want: ['<summary>📎 read_file error</summary>', 'ENOENT'],
    reject: ['📎:'],
  },
  {
    name: 'a marker glyph mid-prose is prose, not a fold',
    md: 'The assistant outputs one 🧠: line per answer, and a 📝: line too.\n',
    want: ['🧠: line'],
    reject: ['<details'],
  },
  {
    name: 'a marker inside a list item is prose, not a fold',
    md: '1. Lines starting with 🧠: are grayed out.\n',
    reject: ['<details'],
  },
  {
    name: 'consecutive markers each get their own fold',
    md: '🧠: first\n\n📝: second\n',
    want: ['<summary>🧠 thinking</summary>', '<summary>📝 summary</summary>'],
    count: { '<details class="parley-fold">': 2, '</details>': 2 },
  },
  {
    name: 'ordinary prose is untouched',
    md: 'Just a paragraph about parley.\n\n## A heading\n',
    reject: ['<details'],
  },
  {
    // The summary is built as raw HTML, so anything carried over from the
    // marker line has to be escaped on the way in. `&` and `<3` survive the
    // markdown parser as literal text; a real tag (`<script>`) never reaches
    // here — remark makes it an inline HTML node and the tool branch drops the
    // marker line wholesale. Both paths are checked.
    name: 'summary text is HTML-escaped',
    md: '🔧: a&b<3 id=x\n```\nx\n```\n',
    want: ['<summary>🔧 a&amp;b&lt;3</summary>'],
  },
  {
    name: 'an inline tag on a marker line never reaches the summary',
    md: '🔧: <script>alert(1)</script> id=x\n```\nx\n```\n',
    reject: ['<script>', 'alert(1)'],
  },
  {
    name: 'a tool marker without a following fence still folds its own line',
    md: '🔧: read_file id=a1\n',
    want: ['<summary>🔧 read_file</summary>'],
    reject: ['🔧:'],
  },
];

let failed = 0;
for (const c of cases) {
  const html = render(c.md);
  const problems = [];
  for (const w of c.want || []) if (!html.includes(w)) problems.push(`missing ${JSON.stringify(w)}`);
  for (const r of c.reject || []) if (html.includes(r)) problems.push(`should not contain ${JSON.stringify(r)}`);
  for (const [needle, n] of Object.entries(c.count || {})) {
    const got = html.split(needle).length - 1;
    if (got !== n) problems.push(`expected ${n}x ${JSON.stringify(needle)}, got ${got}`);
  }
  if (problems.length) {
    failed++;
    console.error(`FAIL  ${c.name}`);
    for (const p of problems) console.error(`      ${p}`);
    console.error(`      got: ${html.replace(/\n/g, ' ')}`);
  } else {
    console.log(`ok    ${c.name}`);
  }
}

console.log(`\n${cases.length - failed}/${cases.length} passed`);
process.exit(failed ? 1 : 0);
