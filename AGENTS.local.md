# Local Extensions

## Repo-specific rules

<!-- Add repo-specific workflow rules, conventions, or overrides here. -->
<!-- This file is referenced by AGENTS.md via @AGENTS.local.md -->

- **Reviewing/editing posts (`src/data/post/*.md`):** route through the `xx-fix` skill protocol rather than hand-authoring markers. Write review findings and proposed edits as inline `🤖` markers (per `workshop/targets/review-convention.md`), and apply existing markers via `/xx-fix <path>`. This is the default for these prose files — don't rewrite unmarked text; the operator accepts/rejects each marker.

- **Prose voice — copy-edit, don't ghostwrite.** The operator owns the voice of his posts. AI-flavored "structured rhetoric" — parallel triads, aphoristic em-dash one-liners, cold-open scene hooks, "notice what it isn't" framings — reads machine-written and undercuts the human-at-the-center point the writing is *about*. So: copy-editing (spelling, grammar, agreement, articles, broken sentences) is welcome and acted on readily; generating *new* prose — hooks, endings, rephrasings "in his voice" — is not. When asked to brainstorm, give terse concrete directions, not finished rhetorical paragraphs; offer at most one plain option and let him write it. Never silently rewrite his phrasing for "flow"; leave verbatim quotes untouched.

- **Math in posts:** write formulas as proper LaTeX math — inline `$...$` and display `$$...$$` — which renders via KaTeX (`remark-math` + `rehype-katex`, wired in `astro.config.ts` with the stylesheet imported in `src/components/blog/SinglePost.astro`). Don't fall back to Unicode-in-code-blocks for equations.

- **This repo is the reference blog; keep `../42shots/` in sync.** The peer site `../42shots/` is the same AstroWind-based blog and should track this repo's **structure and style** (blog engine in `src/utils/blog.ts`, listing/tag/archive pages under `src/pages/`, components, and visual styling). When you improve this repo's blog structure or style, **port the same change to `../42shots/`** in the same session (build-verify there too) — they have drifted to byte-identical engine code before, so a one-sided change is drift, not divergence. Intentional per-site differences are expected and should NOT be flattened: e.g. 42shots's homepage is a "Coming soon" hero (not a Latest-posts list) and its blog lives at `/blog`. Content (posts) is per-site; only the engine/layout/style tracks. (Per the peer-repo convention, 42shots carries its own `AGENTS.local.md` + `MEMORY.md` — read those when working there.)
