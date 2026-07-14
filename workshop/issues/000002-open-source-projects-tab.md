---
id: 000002
status: working
deps: []
github_issue:
created: 2026-07-14
updated: 2026-07-14
estimate_hours: 2.64
started: 2026-07-14T13:04:17-07:00
---

# Add open-source projects tab

## Problem

The site presents writing through Highlights and Archive, but it has no durable,
easy-to-find entry point for open-source projects. GitHub READMEs should remain
the operational source for installation and usage; the site should surface the
longer introductions, histories, design choices, and reflections already written
as blog posts.

## Spec

- Add an optional `project` object to post frontmatter. Version one contains one
  required field, `github`, validated as a URL. Omitting `project` means the post
  is not a canonical project introduction.
- Carry that object through the normalized `Post` model so every consumer sees
  the same typed data.
- Add a top-level `Projects` navigation item and a statically generated
  `/projects` page.
- The page reuses the existing blog list and shows published posts with project
  metadata, newest first. Each project entry includes a direct GitHub link in
  addition to its ordinary post link.
- `project` marks a substantial introduction, history, or reflection worth
  discovering from the Projects tab. Multiple posts may point at the same
  repository; version one does not impose repository identity or canonical-post
  rules.
- Do not create a separate project collection, case-study renderer, filtering
  system, or new prose in version one.
- Port the reusable post schema, normalization, list capability, and Projects
  route to `../42shots/` to keep the shared blog structure synchronized. Do not
  add the personal-site navigation item to 42shots; its business-site navigation
  is an intentional per-site difference.

## Done when

- `project.github` is schema-validated and preserved by post normalization.
- `/projects` lists only published project introductions and provides both the
  introduction and GitHub destinations.
- `Projects` appears in the primary navigation.
- Existing Highlights, Archive, and post rendering continue to build.
- The shared capability is build-verified in both xianxu.dev and 42shots without
  disturbing 42shots's intentional navigation or content differences.
- Published posts are annotated separately through the repo's `xx-fix`
  editorial protocol; choosing which projects to feature is not silently folded
  into the engine change.

## Estimate

```estimate
model: estimate-logic-v3.1
familiarity: 1.0
item: issue-spec design=0.20 impl=0.08
item: typed-data-prototype design=0.20 impl=0.48
item: cross-repo-refactor-small design=0.30 impl=0.60
item: cross-cutting-refactor design=0.15 impl=0.30
item: milestone-review design=0.00 impl=0.20
design-buffer: 0.15
total: 2.64
```

*Produced via `brain/data/life/42shots/velocity/estimate-logic-v3.1.md` against `baseline-v3.1.md`. Method A only.*

## Plan

- [x] Extend and verify the typed post pipeline for optional project metadata.
- [x] Reuse the blog list to render project introductions with contextual GitHub links.
- [x] Add the Projects page and navigation entry, then build-verify the site.

## Log

### 2026-07-14

- Approved direction: projects remain blog posts; `project.github` marks the one
  canonical introduction for an open-source project. `ARCH-DRY` rules out a
  parallel content collection, `ARCH-PURE` keeps selection as a simple predicate
  over normalized posts, and `ARCH-PURPOSE` requires the GitHub destination to
  survive schema → normalization → page rendering rather than exist as inert
  frontmatter.
- Implemented the optional nested schema and normalized `Post` field, reused the
  shared list with an opt-in GitHub link, and added `/projects` plus personal-site
  navigation. Mirrored the shared engine, page, and test surface to 42shots
  (`ARCH-DRY`, `ARCH-PURPOSE`).
- TDD evidence: invalid `project.github` failed Astro content validation; the
  corrected URL passed content synchronization. The committed process-level test
  passed in both repositories and verified published-project inclusion,
  non-project/draft exclusion, safe accessible GitHub linking, and no link leak
  into an ordinary list (`ARCH-PURE`).
- Verification: `scripts/test-projects-page.sh .`, targeted ESLint and Prettier,
  clean `npm run build`, and `git diff --check` passed in both repositories.
  Full `npm run check` remains blocked in both repos by matching pre-existing
  archive `page.data: unknown[]` typing and unrelated Footer/frontmatter lint
  debt; no task-owned file produced a diagnostic.

## Revisions

### 2026-07-14 14:10 PDT — change-code plan-quality gate

- Made canonical uniqueness enforceable by rejecting duplicate normalized
  GitHub URLs, expanded end-to-end assertions across both repositories, and
  recalculated the estimate to include the cross-repo port and verification.

### 2026-07-14 14:18 PDT — simplicity correction after gate review

- Removed the agent-invented canonical-uniqueness requirement. The operator
  asked for a discoverability marker, and multiple useful essays may point to
  one repository; URL identity enforcement is outside version one.
- Retained durable process-level build assertions for the actual metadata and
  rendering path, and re-estimated that additional test surface.
