---
id: 000004
status: working
deps: []
github_issue:
created: 2026-09-19
updated: 2026-09-19
estimate_hours:
started: 2026-09-19T16:58:34-07:00
flow: {kind: quick, provenance: inferred, spec: "b4fcab35", done: "0e0c2431"}
---

# Collapse parley tool and thinking blocks at render

## Problem

Published parley transcripts carry lines that are *folded by default in nvim* because
they are data, not reader-facing prose: the reasoning line (`🧠:`), the summary line
(`📝:`), and the tool call / tool result blocks (`🔧:` / `📎:`, each followed by a
fenced code block). The blog renders them inline and fully expanded, so a transcript
post reads as a wall of machine bookkeeping between the human-interesting parts.

Present in the corpus today: 8 posts with `🧠:` lines, 10 with `📝:` lines. No `🔧:`/
`📎:` blocks are published yet, but parley emits them (`tests/fixtures/fold_tool_transcript.md`
in `../parley.nvim`) and they are the worst offenders when they land.

## Spec

Fold them at **blog render time** — a remark plugin in this repo's markdown pipeline —
so the effect is automatic for every post, including the ones already published, with
no re-export and no edits to post source.

**Rejected alternative:** do the wrapping in parley's exporter (`../parley.nvim`,
`lua/parley/exporter.lua:write_markdown_file`), which is where the fold structure is
already known and would avoid re-implementing marker parsing (ARCH-DRY). Operator chose
render-side because it applies retroactively to the 18 already-published posts and keeps
publishing a plain-markdown step. Accepted cost: this plugin re-implements a narrow slice
of parley's marker syntax and will drift if parley changes its prefixes.

**Transform.** Each marker becomes a `<details>` element, collapsed by default:

````html
<details class="parley-fold">
<summary>🔧 read_file</summary>

```json
{"path":"init.lua"}
```

</details>
````

- `🧠:` → summary label `🧠 Thinking`
- `📝:` → summary label `📝 Summary`
- `🔧: <tool> id=<id>` → `🔧 <tool>`, folding the marker line *and* the fenced block that follows it
- `📎: <tool> id=<id>` → `📎 <tool> result`, same

**Implementation notes.**

- Wrap by inserting raw `html` nodes before and after the existing mdast nodes — do not
  re-serialize the content. The children keep rendering as markdown (code fences, links,
  KaTeX), and the blank-line requirement around `<details>` is moot since we are past
  the markdown parser.
- A marker counts only at the **start of a paragraph/line**. A glyph appearing mid-prose
  in a post *about* parley (this blog writes about parley often) must not fold anything.
- Keep the prefix list in one named constant. Parley treats them as configurable
  (`chat_memory.summary_prefix` / `reasoning_prefix` in `lua/parley/config.lua`), so they
  are a contract between two repos, not a literal to scatter.
- Consecutive markers each get their own fold; do not merge them.
- No JavaScript. `<details>` is native, and browser in-page search still opens closed
  folds to reveal a match.

**Styling.** Muted and small enough to recede: the summary row should read as apparatus,
not as content. Must work in both light and dark themes.

**Peer sync.** Per `AGENTS.md` local extensions, `../42shots/` tracks this repo's engine
and style — port the plugin, its wiring, and the styling there in the same session and
build-verify both.

## Done when

- A post containing `🧠:`, `📝:`, `🔧:`, `📎:` renders each as a collapsed `<details>`,
  expandable on click, with no JavaScript added to the page.
- Markdown *inside* a fold still renders (code fence with highlighting, links).
- Prose containing those glyphs mid-sentence is left untouched.
- The 18 existing transcript posts render folded, verified in built output.
- `npm run build` passes here and in `../42shots/`, with the plugin ported.
- A checked-in verification script asserts the transform's output on fixture markdown
  (covering: marker at line start, glyph mid-prose, tool marker + fence, consecutive
  markers).

## Plan

- [ ] Confirm the marker grammar against `../parley.nvim` (prefixes, `id=` suffix, which
      blocks own a following fence); record the exact forms in `## Log`
- [ ] Add `parleyFoldsRemarkPlugin` to `src/utils/frontmatter.ts` and wire it into
      `markdown.remarkPlugins` in `astro.config.ts`
- [ ] Verification script over fixture markdown (no test framework is installed in this
      repo — a plain node script that runs the plugin and asserts, rather than adding
      vitest for one plugin)
- [ ] Styling for `details.parley-fold` (light + dark)
- [ ] Build here; spot-check a rendered transcript post in `dist/` and in the browser
- [ ] Port plugin + wiring + styles to `../42shots/`, build-verify there
- [ ] Atlas: note the render-time transform and the cross-repo marker contract

## Log

### 2026-09-19

Filed from a session where `npm run dev` broke on unrelated frontmatter. Operator asked
for render-side folding specifically ("the blog rendering of markdown would create those
automatically"), after I had recommended exporter-side; the tradeoff is recorded in
`## Spec` so the choice is not re-litigated later.

Corpus counts at filing: `🧠:` in 8 posts, `📝:` in 10, no `🔧:`/`📎:` yet.
