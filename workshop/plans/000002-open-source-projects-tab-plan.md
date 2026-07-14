# Open-source Projects Tab Implementation Plan

> **For agentic workers:** Consult AGENTS.md Section 3 (Subagent Strategy) to determine the appropriate execution approach: use superpowers-subagent-driven-development (if subagents are suitable per AGENTS.md) or superpowers-executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a Projects tab that surfaces canonical blog-post introductions to Xian's open-source projects and links directly to their GitHub repositories.

**Architecture:** Extend the existing post schema and normalized `Post` model with optional `project.github` metadata, then reuse the existing blog list for a filtered `/projects` page. A display-context flag enables GitHub links only on that page, keeping the shared renderer as the single implementation (`ARCH-DRY`) and filtering as a pure predicate (`ARCH-PURE`).

**Tech Stack:** Astro 5 content collections, TypeScript, Zod, Astro components, Tailwind CSS.

---

## Core concepts

### Pure entities

| Name | Lives in | Status |
|------|----------|--------|
| `ProjectMetadata` | `src/content/config.ts`, `src/types.d.ts` and 42shots mirrors | new |
| Normalized `Post` | `src/utils/blog.ts` and 42shots mirror | modified |

- **ProjectMetadata** — optional metadata marking a post as the canonical introduction to an open-source project.
  - **Relationships:** A post has zero or one project record; a project record has exactly one GitHub URL.
  - **DRY rationale:** The nested object is the sole marker and destination, avoiding independent boolean and URL fields that can disagree (`ARCH-DRY`).
  - **Future extensions:** Optional project destinations such as a homepage can widen this object without changing marker semantics.
- **Normalized `Post`** — the existing renderer-facing representation gains the project record.
  - **Relationships:** One content entry normalizes to one `Post`; all consumers share it.
  - **DRY rationale:** Metadata travels through the existing normalization boundary rather than being re-read by the Projects page (`ARCH-PURPOSE`).
  - **Future extensions:** None planned for version one.

Validation runs through Astro's schema/type checks and production build. This repository has no unit-test harness; adding one solely for a declarative Zod field would exceed this feature's scope.

### Integration points

| Name | Lives in | Status | Wraps |
|------|----------|--------|-------|
| Project-aware blog list | `src/components/blog/List.astro`, `src/components/blog/ListItem.astro` and 42shots mirrors | modified | Astro rendering |
| Projects route | `src/pages/projects.astro` and 42shots mirror | new | Static page generation |
| Primary navigation | `src/navigation.ts` | modified | Site navigation |

- **Project-aware blog list** — accepts an optional display flag and renders a direct GitHub link when enabled.
  - **Injected into:** The Projects page passes the flag; existing consumers retain current output.
  - **Future extensions:** Other project metadata can use the same context without forking the list.
- **Projects route** — fetches published posts, applies `post.project !== undefined`, and hands them to the shared list.
  - **Injected into:** Astro's static route build.
  - **Future extensions:** None until project count demonstrates a need for grouping or filtering.
- **Primary navigation** — exposes the route between Highlights and Archive.
  - **Injected into:** The existing Header through `headerData`.
  - **Future extensions:** None.

## Chunk 1: Typed project metadata

### Task 1: Extend the post data pipeline

**Files:**
- Modify: `src/content/config.ts`
- Modify: `src/types.d.ts`
- Modify: `src/utils/blog.ts`
- Modify: `../42shots/src/content/config.ts`
- Modify: `../42shots/src/types.d.ts`
- Modify: `../42shots/src/utils/blog.ts`

- [ ] **Step 1: Define the project metadata schema and normalized type**

Add `project: z.object({ github: z.string().url() }).optional()` to the post schema, add matching `ProjectMetadata` and `Post.project` types, then destructure and return `project` in `getNormalizedPost`. Mirror these shared engine changes in 42shots (`ARCH-DRY`).

- [ ] **Step 2: Add an invalid temporary project fixture and verify URL validation fails**

Create a temporary published Markdown fixture with `project.github: not-a-url`, then run: `npm run check:astro`

Expected: FAIL with a Zod URL-validation error for the fixture.

- [ ] **Step 3: Correct the fixture and verify the typed pipeline**

Change the fixture to a valid GitHub URL and give it a distinctive title/permalink value.

Run: `npm run check:astro`

Expected: PASS, proving schema acceptance and normalized type compatibility.

Keep the fixture through rendered-output verification, then remove it before final verification. Published-post selection remains outside this engine change because post frontmatter is governed by `xx-fix`.

## Chunk 2: Projects discovery surface

### Task 2: Add contextual GitHub links to the shared list

**Files:**
- Modify: `src/components/blog/List.astro`
- Modify: `src/components/blog/ListItem.astro`
- Modify: `../42shots/src/components/blog/List.astro`
- Modify: `../42shots/src/components/blog/ListItem.astro`

- [ ] **Step 1: Add `showProjectLink?: boolean` to both component props**

Default it to `false` and pass it from `List` to each `Item`; mirror the shared component change in 42shots.

- [ ] **Step 2: Render the project destination**

When the flag and `post.project` are present, render an accessible external GitHub link after the excerpt using the existing icon library and `rel="noopener noreferrer"`.

- [ ] **Step 3: Run `npm run check:astro`**

Expected: PASS with the new component contracts.

### Task 3: Add the Projects page and navigation

**Files:**
- Create: `src/pages/projects.astro`
- Create: `../42shots/src/pages/projects.astro`
- Modify: `src/navigation.ts`

- [ ] **Step 1: Create the static route**

Mirror the restrained Highlights layout, filter `fetchPosts()` by project metadata, render `<List posts={posts} showProjectLink />`, and include a clear empty state. Port the route to 42shots for structural parity, but leave it unlinked there because its business-site navigation and content are intentional differences.

- [ ] **Step 2: Add `Projects` after `Highlights` in primary navigation**

- [ ] **Step 3: Verify the rendered feature path with the temporary fixture**

Run `npm run build`, then assert `dist/projects/index.html` contains the fixture's introduction permalink and exact GitHub URL. Also assert it excludes a known published non-project post and a temporary draft project fixture. This verifies schema → normalization → published selection → contextual anchor (`ARCH-PURPOSE`).

- [ ] **Step 4: Remove temporary fixtures and run full verification**

Run: `npm run check`

Expected: Astro, ESLint, and Prettier checks pass.

Run: `npm run build`

Expected: PASS and output includes `/projects/index.html` while Highlights and Archive remain generated.

In `../42shots`, run `npm run check` and `npm run build`; expect both to pass and `/projects/index.html` to be generated. Preserve the operator's existing unrelated modification to `src/pages/[...blog]/[...page].astro`.

- [ ] **Step 5: Record evidence and commit**

Update issue #2's checklist and Log with verification evidence. Commit with an issue-scoped message and a `Co-Authored-By:` trailer naming the authoring model.
