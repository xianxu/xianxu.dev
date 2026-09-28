---
id: 000004
status: codecomplete
deps: []
github_issue:
created: 2026-09-19
updated: 2026-09-27
estimate_hours:
started: 2026-09-19T16:58:34-07:00
flow: {kind: full, provenance: inferred}
actual_hours: 11.75
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

- [x] Confirm the marker grammar against `../parley.nvim` (prefixes, `id=` suffix, which
      blocks own a following fence); record the exact forms in `## Log`
- [x] Add `parleyFoldsRemarkPlugin` to `src/utils/frontmatter.ts` and wire it into
      `markdown.remarkPlugins` in `astro.config.ts`
- [x] Verification script over fixture markdown (no test framework is installed in this
      repo — a plain node script that runs the plugin and asserts, rather than adding
      vitest for one plugin)
- [x] Styling for `details.parley-fold` (light + dark)
- [x] Build here; spot-check a rendered transcript post in `dist/` and in the browser
- [x] Port plugin + wiring + styles to `../42shots/`, build-verify there
- [x] Atlas: note the render-time transform and the cross-repo marker contract

## Log

### 2026-09-19

Filed from a session where `npm run dev` broke on unrelated frontmatter. Operator asked
for render-side folding specifically ("the blog rendering of markdown would create those
automatically"), after I had recommended exporter-side; the tradeoff is recorded in
`## Spec` so the choice is not re-litigated later.

Corpus counts at filing: `🧠:` in 8 posts, `📝:` in 10, no `🔧:`/`📎:` yet.

### 2026-09-19 — session summary

Landed. `parleyFoldsRemarkPlugin` in `src/utils/frontmatter.ts`, wired into
`markdown.remarkPlugins`; styles in `SinglePost.astro`; `npm run check:folds`
(`scripts/verify-parley-folds.mjs`, 11 cases) covering line-start vs mid-prose,
list items, tool marker + fence, error flag, consecutive markers, escaping.
Ported to `../42shots/` (commit 3394780) — it has no marker-carrying posts yet,
so the port is forward-looking.

Marker grammar confirmed at source rather than from the corpus: prefixes are
`chat_memory.reasoning_prefix` / `summary_prefix` and `chat_tool_use_prefix` /
`chat_tool_result_prefix` in `../parley.nvim/lua/parley/config.lua`. Summary
wording mirrors `tool_folds.foldtext()` (`🧠 thinking`, `📝 summary`,
`🔧 <name>`, `📎 <name> error`) instead of the labels this issue's Spec invented
— a fold should read the same in both places. The tool summary keeps only the
tool name, dropping `id=`; the spec's `<tool> result` wording became parley's
own `error` flag, which is the part that actually distinguishes a result.

Two corrections to the filing: the corpus is **14** posts with markers (not 18 —
that double-counted files carrying both `🧠:` and `📝:`), and 118 folds now
render across them. The 8 `📝:` strings left in `dist/` are all mid-prose
mentions inside list items in posts *about* parley — the case the plugin must
not touch, verified by hand.

Baselines checked before claiming clean: `npm run check:astro` had 1 pre-existing
error (`[...blog]/[...page].astro`) and eslint 2 pre-existing `no-explicit-any`
in `frontmatter.ts`; both repos end at those same baselines, not better or worse.
Prettier already flags 98 files repo-wide, so I matched surrounding style by hand
rather than reformatting unrelated lines.

Not verified: how the fold looks in a browser. Structure and CSS are asserted in
built output, but the visual judgment is the operator's.

### 2026-09-27
- 2026-09-27: closed — check:folds 11/11 (line-start vs mid-prose, list items, tool marker+fence, error flag, consecutive markers, HTML escaping); build clean, 118 folds render across 14 transcript posts with fold CSS bundled; remaining raw markers in dist are mid-prose mentions inside list items, hand-verified; operator confirmed the rendered folds in a browser at localhost:4321; type-check and lint at pre-existing baselines; ported to peer blog 42shots (3394780), byte-identical and 11/11 there. --no-judge: the boundary review subprocess cannot reach api.anthropic.com from inside the agent sandbox (ariadne#256); operator judged a substitute review overkill for a change this size and directed a manual close.; review verdict: not-run
- 2026-09-27: flow upgraded quick → full — 222 added lines in code files (limit 100); an earlier round of this close already ran the full review

Operator verified the rendered folds in a browser at `localhost:4321` — the one
check left open at implementation time (structure and CSS were asserted in built
output, but the visual judgment was his). `check:folds` re-run on this date: 11/11.
