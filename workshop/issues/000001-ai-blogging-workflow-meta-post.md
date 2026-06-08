---
id: 000001
status: working
deps: []
github_issue:
created: 2026-06-08
updated: 2026-06-08
estimate_hours: 4
---

# AI blogging-workflow meta post

> **▶ To resume:** the work lives on branch **`review/a-blogging-workflow`** (a `docflow` / `xx-fix` session, pushed to origin). Run `git switch review/a-blogging-workflow` and continue the docflow rounds. This issue sits on `main` purely as the findable pointer.

## Problem

Write a meta blog post — `src/data/post/a-blogging-workflow.md`, working title *"A Nice Research Workbench"* — documenting the human+AI workflow used to write [the space data center post](../../src/data/post/the-case-for-space-data-center.md). It's meant as a concrete demonstration of knowledge work done *with* AI properly: human owns intent and the through-line; AI does facts/math/drafting/mechanics; a deterministic shell (git-journaled rounds, fresh-context fact-checks, build gates) keeps it honest.

## Spec

Eight sections mapping the operator's seven evidence items, each seeded with real quotes from the session:
1. It started as a conversation, not a writing task (physics-question opener + pushback)
2. From conversation to a first draft (the "write a blog post based on this discussion" trigger; it was draft-from-chat, not skeleton-first)
3. Co-authoring in the document, turn by turn (🤖 marker convention + git-journaled docflow rounds)
4. The substrate: xianxu.dev as an Ariadne repo (xx-fix + docflow symlinks)
5. Teaching the tool as we went (explicit triggers so free-form chat ≠ review; reading frontier)
6. Trust but verify (fresh-context 2nd/3rd-agent review — codex + agy; the rejected hallucination)
7. Craft details (hand-authored SVG; KaTeX/footnote/mobile rendering; 42shots mirror)
8. Closing thesis (knowledge work + AI; tie to excerpt)

Companion post `the-case-for-space-data-center.md` is **published** already.

## Done when

- Post fleshed out in the operator's voice (skeleton/prose hybrid → finished essay).
- The two open `🤖{}` flags resolved: draft-vs-skeleton framing, and the "became an Ariadne repo" story.
- The exact-quote `🤖[find exact question / prompt]` markers filled from the transcript.
- Build green; then `docflow ship` and flip `published: true`.

## Plan

- [ ] Resolve open `🤖` markers (exact quotes + the two `{}` questions)
- [ ] Expand remaining skeleton bullets into prose
- [ ] Final fresh-context review pass (optional)
- [ ] `docflow ship` + publish

## Log

### 2026-06-08

- Opened a `docflow` session on **`review/a-blogging-workflow`** (base `main`); drafted the skeleton (agent r1) mapping the 7 evidence items; operator expanded several sections into prose (human r1).
- **Parked the work:** committed the in-progress doc (human r1), pushed `review/a-blogging-workflow` to origin, created this issue on `main` as the resume pointer, and switched back to `main`.
- Next session: `git switch review/a-blogging-workflow` and continue.
