# Boundary Review — xianxu.dev#2 (whole-issue close)

| field      | value                                              |
| ---------- | -------------------------------------------------- |
| issue      | 2 — Add open-source projects tab                   |
| repo       | xianxu.dev                                         |
| issue file | workshop/issues/000002-open-source-projects-tab.md |
| boundary   | whole-issue close                                  |
| milestone  | —                                                  |
| window     | 8e552f52728ad6c9c4e8b04b6891f230f6e8685f..HEAD     |
| command    | sdlc close --issue 2                               |
| reviewer   | codex                                              |
| timestamp  | 2026-07-14T14:12:58-07:00                          |
| verdict    | REWORK                                             |

## Review

Reading additional input from stdin...
OpenAI Codex v0.144.4

---

workdir: /Users/xianxu/workspace/xianxu.dev
model: gpt-5.6-sol
provider: openai
approval: never
sandbox: workspace-write [workdir, /tmp, $TMPDIR, /tmp] (network access enabled)
reasoning effort: none
reasoning summaries: none
session id: 019f6278-55da-7fb0-8dab-352514471754

---

user

# Code review — the one SDLC boundary review

You are conducting a fresh-context code review at a development boundary —
whole-issue close — in the **xianxu.dev** repository.

- repository: xianxu.dev (root: /Users/xianxu/workspace/xianxu.dev)
- issue: xianxu.dev#2 (file: workshop/issues/000002-open-source-projects-tab.md)
- window: Base: 8e552f52728ad6c9c4e8b04b6891f230f6e8685f Head: HEAD

Review the **xianxu.dev** repo and its tracker — the ariadne base-layer repo itself (changes here propagate to dependent repos). Do not assume any
other repository or apply another repo's conventions.

You have no prior session context — that is the anti-collusion property. Verify
behavior against the issue's documented Spec/Plan and the code itself; do NOT
take the implementor's word in commit messages or docs at face value. Tools are
read-only: report findings precisely; the main agent (which has session context)
applies the fixes, commits, and re-runs.

Read the diff against the issue's Spec + Plan, then work the checklist below.
Categorize every finding by severity — not everything is Critical; a nitpick
marked Critical is noise.

Critical (must fix before crossing the boundary) - correctness bugs; crashes / panics on unexpected input - behavior drift from stated contracts (for ports of existing code where
byte-faithfulness was promised, diff against the source) - silent error swallowing where the source raised
Important (fix before the boundary if cheap) - API design of newly-introduced internal packages (downstream work will
consume them; is the surface stable?) - missing test coverage that would catch the kind of bug shipped - inconsistent error handling across the diff
Minor (note for future) - style nits, naming, comment density; performance only if hot-path

## Review checklist

Code quality

- Clean separation of concerns; edge cases handled (empty / nil / unexpected).
- Proper error handling — no silent swallowing where the source raised.
- No duplicated logic / copy-paste that should be a shared helper.

Testing

- Tests pin real logic, not mocks reasserting the implementation.
- The kind of bug this diff could ship is covered.
- PURE entities tested without IO; INTEGRATION via injected fakes (see below).

Requirements traceability

- Every Plan checklist item this boundary claims is actually delivered.
- Implementation matches the Spec; no undeclared scope creep.
- Breaking changes documented.

Production readiness

- Migration / backward-compatibility considered where state or formats change.
- Docs / atlas updated for new surface (see the Docs update gate).

## Core concepts cross-check (if the plan has a Core concepts table)

The plan should list entities in a greppable table — name, kind
(PURE/INTEGRATION), file location, status (new/modified/deleted). For each row:

- Verify the entity exists at the stated path (grep the diff or filesystem).
- PURE: tests run without IO (no exec, net, mutable fs). If tests need mocks
  to run, it isn't really PURE — flag Critical and recommend promoting it to
  INTEGRATION.
- INTEGRATION: injected into pure callers, not invoked directly from business
  logic.
- "modified" / "deleted": the diff shows the expected change/removal at the
  stated location.
  Any contradiction between table and code = Critical finding, plus a plan-revision
  recommendation (a "## Revisions" entry so the plan stops claiming what the code
  doesn't deliver).

## Docs update gate (atlas + README, per AGENTS.md §8)

The boundary should update user-facing docs for any new surface introduced:

- **atlas/** — new architectural surface, flow, or terminology. Scan the diff
  for new entity types, subcommands, conventions, file-tree locations. Any
  present without corresponding atlas/ changes in the same range = Important
  finding ("atlas update appears missing for <surface>").
- **README.md** — new user-facing surface a reader runs or types: subcommands,
  flags, keybindings, config keys, install/usage steps. If the diff adds or
  changes such surface and README.md is not updated in the same range =
  Important finding ("README update appears missing for <surface>"). This is the
  class of gap that used to surface only at the merge-time `specs` judge (#142);
  catch it here, at the earliest gate, before the close verdict is recorded.

## Architecture (the at-review backstop — these matter most long-term)

Work through each of ARCH-DRY, ARCH-PURE, ARCH-PURPOSE explicitly, applying its at-review lens. The
full principle definitions are delivered in the ARCHITECTURE PRINCIPLES block
right after this prompt — for EACH marker, state pass or flag, and cite the
marker (e.g. ARCH-DRY) in any finding. Architecture is where review has the
least training signal and the longest-delayed payoff, so be deliberate here, not
holistic.

## Verdict + output

Begin your response with this fenced verdict block — the machine-read handoff:

```verdict
verdict: <SHIP | FIX-THEN-SHIP | REWORK>
confidence: <high | medium | low>
```

SHIP ready; ship it
FIX-THEN-SHIP ship after addressing the findings (non-blocking at the gate)
REWORK blocking; needs rework before shipping — fix + re-run

The fenced ` ```verdict ` block above is the **authoritative machine-read
handoff** — emit it as the first thing in your response. (A prose
`VERDICT: <TOKEN>` first line still satisfies the legacy contract as a fallback,
but the block is what the binary trusts.)

After the verdict block: a 1-paragraph summary — what worked, what blocks SHIP if
it isn't — followed by:

1. Strengths: 2-5 specific things done well (file:line where useful). Affirm
   validated approaches so the operator knows what's confirmed-good ground.
   Empty acceptable for trivial boundaries.
2. Critical findings (file:line + fix sketch); empty if none.
3. Important findings (same format).
4. Minor findings (terse one-liners).
5. Test coverage notes.
6. Architectural notes for upcoming work.
7. Plan revision recommendations: specific "## Revisions" entries the plan
   needs (empty if the plan still matches the code).

ARCHITECTURE PRINCIPLES — work through each of the 3 entries below explicitly, applying its `at-review` lens; cite the marker (e.g. ARCH-DRY) in any finding.

# Architecture principles (ARCH-\*)

Injected architectural taste — the structural decisions whose payoff (or cost)
shows up many turns, often months, down the road. Agents are strong at local
tactics and weak here, so these are checked **at-plan** (when the design is being
made — highest leverage) and **at-review** (backstop, on the diff). Cite the
marker (e.g. `ARCH-DRY`) in plans, `## Log` entries, and review findings.

This file is the single source; it is embedded into the planning, plan-quality,
and code-review prompts. The human narrative lives in AGENTS.md "Core Design
Principles"; this is its machine-delivered companion.

## ARCH-DRY — Don't Repeat Yourself

- **principle:** Reuse before adding. One source of truth per fact/behavior; no
  duplicated logic, copy-pasted blocks, or parallel functions that should be one
  shared helper.
- **at-plan:** Flag a plan that re-implements something the codebase already has,
  or that will obviously duplicate logic across the new files instead of
  extracting a shared helper. Name the existing thing it should reuse.
- **at-review:** Flag duplicated logic / copy-pasted blocks / near-identical
  functions in the diff; point at the consolidation (file:line + the shared
  helper they should become).

## ARCH-PURE — Pure core, thin IO shell

- **principle:** The majority of code is pure functions (deterministic, no side
  effects); a thin "glue" layer at the boundary touches IO/UI/network/clock. Pure
  functions are unit-tested directly; the glue is kept small and injected.
- **at-plan:** Flag a design that buries business logic inside IO/handlers, or
  that will only be testable with heavy mocks (a sign logic isn't separated from
  IO). The plan should name what's pure vs the thin IO seam.
- **at-review:** Flag business logic mixed with IO in the diff; logic that should
  be a pure function injected into a thin caller. If a test needs mocks to run a
  "pure" entity, it isn't pure — recommend extracting the IO to the boundary.

## ARCH-PURPOSE — Serve the issue's actual purpose

- **principle:** Deliver the issue's stated purpose, not the easy subset of it. A
  single-source / "compiled to consumers" change is not done until **every
  consumer derives** from the source — the source is _enforced_, not just
  documentation a surface happens to restate; a hand-maintained restatement of the
  model is a deferred consumer, not a finished one. "Follow-up" is for separable
  extensions, never for the thing that is the point. This is the _opposite axis_
  from Simplicity-First/YAGNI: not "build for an imagined future," but "don't
  **under**-deliver the purpose you already committed to."
- **at-plan:** Flag a plan whose scope is a strict subset of the issue's stated
  goal / Done-when where the part deferred as "follow-up" _is_ the purpose (e.g.
  wires one consumer + enforcement but leaves the consumers that motivated the
  issue as documentation that doesn't derive). Ask: does the plan fulfill the
  purpose, or just the cheap win? Name the deferred purpose.
- **at-review:** Does the diff _fulfill_ the purpose or settle for the easy win?
  For a single-source change, run the **shadow-sweep** — enumerate the consumers,
  confirm each derives from the source, flag any remaining hand-maintained
  restatement of the model. A "follow-up" that is actually the deferred point of
  the issue is a finding, not a deferral.

OUTPUT CONTRACT (machine-read — do not deviate). LEAD your response with the
fenced ```verdict block shown above — that is the authoritative handoff the binary
reads (its `verdict:`value is one of the listed tokens). Everything after the block
is advisory: a non-blocking verdict WITH findings still PASSES the gate. A bare`VERDICT: <TOKEN>` line is accepted only as a FALLBACK when the block is absent.

Diff:
diff --git a/scripts/test-projects-page.sh b/scripts/test-projects-page.sh
new file mode 100755
index 0000000..cfe7509
--- /dev/null
+++ b/scripts/test-projects-page.sh
@@ -0,0 +1,73 @@
+#!/usr/bin/env bash
+set -euo pipefail

- +repo=${1:-.}
+posts="$repo/src/data/post"
  +published="$posts/project-render-published-test.md"
+nonproject="$posts/project-render-nonproject-test.md"
  +draft="$posts/project-render-draft-test.md"
- +cleanup() {
- rm -f "$published" "$nonproject" "$draft"
  +}
  +trap cleanup EXIT
- +cat >"$published" <<'EOF'
  +---
  +title: Project render published test
  +publishDate: 2030-01-03
  +published: true
  +highlight: true
  +project:
- github: https://github.com/xianxu/project-render-test
  +---
- +Temporary project rendering fixture.
  +EOF
- +cat >"$nonproject" <<'EOF'
  +---
  +title: Project render nonproject test
  +publishDate: 2030-01-02
  +published: true
  +---
- +Temporary non-project rendering fixture.
  +EOF
- +cat >"$draft" <<'EOF'
  +---
  +title: Project render draft test
  +publishDate: 2030-01-01
  +published: false
  +project:
- github: https://github.com/xianxu/project-render-draft-test
  +---
- +Temporary draft project rendering fixture.
  +EOF
- +(
- cd "$repo"
- npm run build
  +)
- +projects="$repo/dist/projects/index.html"
+highlights="$repo/dist/highlights/index.html"
- +rg -q 'Project render published test' "$projects"
+rg -q 'https://github.com/xianxu/project-render-test' "$projects"
  +rg -q 'aria-label="View Project render published test on GitHub"' "$projects"
+rg -q 'target="_blank"' "$projects"
  +rg -q 'rel="noopener noreferrer"' "$projects"
- +if rg -q 'Project render nonproject test|Project render draft test|project-render-draft-test' "$projects"; then
- echo "Projects page included a non-project or draft fixture" >&2
- exit 1
  +fi
- +rg -q 'Project render published test' "$highlights"
+if rg -q 'https://github.com/xianxu/project-render-test' "$highlights"; then
- echo "Ordinary blog list exposed a project-only GitHub link" >&2
- exit 1
  +fi
  diff --git a/src/components/blog/List.astro b/src/components/blog/List.astro
  index 6a80ae3..8d5e03b 100644
  --- a/src/components/blog/List.astro
  +++ b/src/components/blog/List.astro
  @@ -4,16 +4,17 @@ import type { Post } from '~/types';

export interface Props {
posts: Array<Post>;

- showProjectLink?: boolean;
  }

-const { posts } = Astro.props;
+const { posts, showProjectLink = false } = Astro.props;

---

 <ul>
   {
     posts.map((post) => (
       <li class="mb-12 md:mb-20">
-        <Item post={post} />
+        <Item post={post} showProjectLink={showProjectLink} />
       </li>
     ))
   }
diff --git a/src/components/blog/ListItem.astro b/src/components/blog/ListItem.astro
index 6a416d6..d922ad5 100644
--- a/src/components/blog/ListItem.astro
+++ b/src/components/blog/ListItem.astro
@@ -13,9 +13,10 @@ import { getFormattedDate } from '~/utils/utils';

 export interface Props {
   post: Post;
+  showProjectLink?: boolean;
 }

-const { post } = Astro.props;
+const { post, showProjectLink = false } = Astro.props;
 const image = (await findImage(post.image)) as ImageMetadata | undefined;

 const link = APP_BLOG?.post?.isEnabled ? getPermalink(post.permalink, 'post') : '';
@@ -107,6 +108,20 @@ const link = APP_BLOG?.post?.isEnabled ? getPermalink(post.permalink, 'post') :
     </header>

     {post.excerpt && <p class="flex-grow text-muted dark:text-slate-400 text-lg">{post.excerpt}</p>}
+    {
+      showProjectLink && post.project && (
+        <a
+          class="inline-flex items-center gap-1.5 mt-4 text-sm font-medium hover:underline"
+          href={post.project.github}
+          target="_blank"
+          rel="noopener noreferrer"
+          aria-label={`View ${post.title} on GitHub`}
+        >
+          <Icon name="tabler:brand-github" class="w-4 h-4" />
+          GitHub
+        </a>
+      )
+    }
     {
       post.tags && Array.isArray(post.tags) ? (
         <footer class="mt-5">
diff --git a/src/content/config.ts b/src/content/config.ts
index a5f702c..7477d96 100644
--- a/src/content/config.ts
+++ b/src/content/config.ts
@@ -53,6 +53,7 @@ const postCollection = defineCollection({
     updateDate: z.date().optional(),
     published: z.boolean().optional(),
     highlight: z.boolean().optional(),
+    project: z.object({ github: z.string().url() }).optional(),
     hidden: z.boolean().optional(),
     comments: z.boolean().optional(),

diff --git a/src/navigation.ts b/src/navigation.ts
index c0443de..4f8fc15 100644
--- a/src/navigation.ts
+++ b/src/navigation.ts
@@ -3,6 +3,7 @@ import { getBlogPermalink, getPermalink, getAsset } from './utils/permalinks';
 export const headerData = {
   links: [
     { text: 'Highlights', href: getPermalink('/highlights') },
+    { text: 'Projects', href: getPermalink('/projects') },
     { text: 'Archive', href: getBlogPermalink() },
     { text: 'Tags', href: getPermalink('/tags') },
     { text: 'About', href: getPermalink('/about') },
diff --git a/src/pages/projects.astro b/src/pages/projects.astro
new file mode 100644
index 0000000..bee3d4e
--- /dev/null
+++ b/src/pages/projects.astro
@@ -0,0 +1,28 @@
+---
+import Layout from '~/layouts/PageLayout.astro';
+import List from '~/components/blog/List.astro';
+import { fetchPosts } from '~/utils/blog';
+
+export const prerender = true;
+
+const posts = (await fetchPosts()).filter((post) => post.project !== undefined);
+
+const metadata = {
+  title: 'Projects',
+};
+---
+
+<Layout metadata={metadata}>
+  <section class="px-4 sm:px-6 py-12 sm:py-16 lg:py-20 mx-auto max-w-4xl">
+    <h1 class="text-3xl md:text-4xl font-bold leading-tighter tracking-tighter font-heading mb-3">Projects</h1>
+    <p class="text-muted dark:text-slate-400 mb-12">Open-source projects I work on, and the stories behind them.</p>
+
+    {
+      posts.length === 0 ? (
+        <p class="text-muted">No project introductions yet.</p>
+      ) : (
+        <List posts={posts} showProjectLink />
+      )
+    }
+  </section>
+</Layout>
diff --git a/src/types.d.ts b/src/types.d.ts
index 0231642..4480d4f 100644
--- a/src/types.d.ts
+++ b/src/types.d.ts
@@ -39,6 +39,9 @@ export interface Post {
   /**  */
   highlight?: boolean;

+  /** Open-source project metadata when this post belongs on the Projects page. */
+  project?: ProjectMetadata;
+
   /**  */
   hidden?: boolean;

@@ -53,6 +56,10 @@ export interface Post {
   readingTime?: number;
 }

+export interface ProjectMetadata {
+  github: string;
+}
+
 export interface Taxonomy {
   slug: string;
   title: string;
diff --git a/src/utils/blog.ts b/src/utils/blog.ts
index 2269710..c1d78c0 100644
--- a/src/utils/blog.ts
+++ b/src/utils/blog.ts
@@ -55,6 +55,7 @@ const getNormalizedPost = async (post: CollectionEntry<'post'>): Promise<Post> =
     author,
     published = false,
     highlight = false,
+    project,
     hidden = false,
     comments = true,
     metadata = {},
@@ -94,6 +95,7 @@ const getNormalizedPost = async (post: CollectionEntry<'post'>): Promise<Post> =

     published: published,
     highlight: highlight,
+    project: project,
     hidden: hidden,
     comments: comments,

diff --git a/workshop/plans/000002-open-source-projects-tab-plan.md b/workshop/plans/000002-open-source-projects-tab-plan.md
index 0540797..5f39865 100644
--- a/workshop/plans/000002-open-source-projects-tab-plan.md
+++ b/workshop/plans/000002-open-source-projects-tab-plan.md
@@ -4,7 +4,7 @@

 **Goal:** Add a Projects tab that surfaces canonical blog-post introductions to Xian's open-source projects and links directly to their GitHub repositories.

-**Architecture:** Extend the existing post schema and normalized `Post` model with optional `project.github` metadata, then reuse the existing blog list for a filtered `/projects` page. A display-context flag enables GitHub links only on that page, keeping the shared renderer as the single implementation (`ARCH-DRY`) and filtering as a pure predicate (`ARCH-PURE`).
+**Architecture:** Extend the existing post schema and normalized `Post` model with optional `project.github` metadata, then reuse the existing blog list for a filtered `/projects` page. A display-context flag enables GitHub links only on that page, keeping the shared renderer as the single implementation (`ARCH-DRY`) and selection as a pure predicate (`ARCH-PURE`). A process-level build assertion covers the complete static rendering path without introducing a test framework.

 **Tech Stack:** Astro 5 content collections, TypeScript, Zod, Astro components, Tailwind CSS.

@@ -14,10 +14,10 @@

 ### Pure entities

-| Name | Lives in | Status |
-|------|----------|--------|
-| `ProjectMetadata` | `src/content/config.ts`, `src/types.d.ts` and 42shots mirrors | new |
-| Normalized `Post` | `src/utils/blog.ts` and 42shots mirror | modified |
+| Name              | Lives in                                                      | Status   |
+| ----------------- | ------------------------------------------------------------- | -------- |
+| `ProjectMetadata` | `src/content/config.ts`, `src/types.d.ts` and 42shots mirrors | new      |
+| Normalized `Post` | `src/utils/blog.ts` and 42shots mirror                        | modified |

 - **ProjectMetadata** — optional metadata marking a post as the canonical introduction to an open-source project.
   - **Relationships:** A post has zero or one project record; a project record has exactly one GitHub URL.
@@ -32,11 +32,12 @@ Validation runs through Astro's schema/type checks and production build. This re

 ### Integration points

-| Name | Lives in | Status | Wraps |
-|------|----------|--------|-------|
-| Project-aware blog list | `src/components/blog/List.astro`, `src/components/blog/ListItem.astro` and 42shots mirrors | modified | Astro rendering |
-| Projects route | `src/pages/projects.astro` and 42shots mirror | new | Static page generation |
-| Primary navigation | `src/navigation.ts` | modified | Site navigation |
+| Name                     | Lives in                                                                                   | Status   | Wraps                                     |
+| ------------------------ | ------------------------------------------------------------------------------------------ | -------- | ----------------------------------------- |
+| Project-aware blog list  | `src/components/blog/List.astro`, `src/components/blog/ListItem.astro` and 42shots mirrors | modified | Astro rendering                           |
+| Projects route           | `src/pages/projects.astro` and 42shots mirror                                              | new      | Static page generation                    |
+| Projects build assertion | `scripts/test-projects-page.sh` and 42shots mirror                                         | new      | Temporary content fixtures + static build |
+| Primary navigation       | `src/navigation.ts`                                                                        | modified | Site navigation                           |

 - **Project-aware blog list** — accepts an optional display flag and renders a direct GitHub link when enabled.
   - **Injected into:** The Projects page passes the flag; existing consumers retain current output.
@@ -47,12 +48,16 @@ Validation runs through Astro's schema/type checks and production build. This re
 - **Primary navigation** — exposes the route between Highlights and Archive.
   - **Injected into:** The existing Header through `headerData`.
   - **Future extensions:** None.
+- **Projects build assertion** — creates controlled temporary project/non-project/draft posts, builds the site, asserts the Projects and ordinary-list HTML contracts, and removes fixtures through a shell trap.
+  - **Injected into:** Local verification in each repository; no production runtime dependency.
+  - **Future extensions:** Additional rendered contracts can be added when surfaced.

 ## Chunk 1: Typed project metadata

 ### Task 1: Extend the post data pipeline

 **Files:**
+
 - Modify: `src/content/config.ts`
 - Modify: `src/types.d.ts`
 - Modify: `src/utils/blog.ts`
@@ -60,17 +65,17 @@ Validation runs through Astro's schema/type checks and production build. This re
 - Modify: `../42shots/src/types.d.ts`
 - Modify: `../42shots/src/utils/blog.ts`

-- [ ] **Step 1: Define the project metadata schema and normalized type**
+- [x] **Step 1: Define the project metadata schema and normalized type**

 Add `project: z.object({ github: z.string().url() }).optional()` to the post schema, add matching `ProjectMetadata` and `Post.project` types, then destructure and return `project` in `getNormalizedPost`. Mirror these shared engine changes in 42shots (`ARCH-DRY`).

-- [ ] **Step 2: Add an invalid temporary project fixture and verify URL validation fails**
+- [x] **Step 2: Add an invalid temporary project fixture and verify URL validation fails**

 Create a temporary published Markdown fixture with `project.github: not-a-url`, then run: `npm run check:astro`

 Expected: FAIL with a Zod URL-validation error for the fixture.

-- [ ] **Step 3: Correct the fixture and verify the typed pipeline**
+- [x] **Step 3: Correct the fixture and verify the typed pipeline**

 Change the fixture to a valid GitHub URL and give it a distinctive title/permalink value.

@@ -85,41 +90,45 @@ Keep the fixture through rendered-output verification, then remove it before fin
 ### Task 2: Add contextual GitHub links to the shared list

 **Files:**
+
 - Modify: `src/components/blog/List.astro`
 - Modify: `src/components/blog/ListItem.astro`
 - Modify: `../42shots/src/components/blog/List.astro`
 - Modify: `../42shots/src/components/blog/ListItem.astro`

-- [ ] **Step 1: Add `showProjectLink?: boolean` to both component props**
+- [x] **Step 1: Add `showProjectLink?: boolean` to both component props**

 Default it to `false` and pass it from `List` to each `Item`; mirror the shared component change in 42shots.

-- [ ] **Step 2: Render the project destination**
+- [x] **Step 2: Render the project destination**

 When the flag and `post.project` are present, render an accessible external GitHub link after the excerpt using the existing icon library and `rel="noopener noreferrer"`.

-- [ ] **Step 3: Run `npm run check:astro`**
+- [x] **Step 3: Run `npm run check:astro`**

 Expected: PASS with the new component contracts.

 ### Task 3: Add the Projects page and navigation

 **Files:**
+
 - Create: `src/pages/projects.astro`
 - Create: `../42shots/src/pages/projects.astro`
+- Create: `scripts/test-projects-page.sh`
+- Create: `../42shots/scripts/test-projects-page.sh`
 - Modify: `src/navigation.ts`

-- [ ] **Step 1: Create the static route**
+- [x] **Step 1: Create the static route**

 Mirror the restrained Highlights layout, filter `fetchPosts()` by project metadata, render `<List posts={posts} showProjectLink />`, and include a clear empty state. Port the route to 42shots for structural parity, but leave it unlinked there because its business-site navigation and content are intentional differences.

-- [ ] **Step 2: Add `Projects` after `Highlights` in primary navigation**
+- [x] **Step 2: Add `Projects` after `Highlights` in primary navigation**

-- [ ] **Step 3: Verify the rendered feature path with the temporary fixture**
+- [x] **Step 3: Verify the rendered feature path with the temporary fixture**

-Run `npm run build`, then assert `dist/projects/index.html` contains the fixture's introduction permalink and exact GitHub URL. Also assert it excludes a known published non-project post and a temporary draft project fixture. This verifies schema → normalization → published selection → contextual anchor (`ARCH-PURPOSE`).
+Implement `scripts/test-projects-page.sh` as a committed deterministic test. It creates temporary published-project, published-non-project, and draft-project fixtures under the target repo, registers a trap that removes them, runs `npm run build`, then uses `rg` assertions against generated HTML. Assert `dist/projects/index.html` contains the published project's introduction permalink and exact GitHub URL, its anchor has an accessible label plus `target="_blank"` and `rel="noopener noreferrer"`, and it excludes the published non-project and draft project. Assert a normal list page does not contain that GitHub URL, proving `showProjectLink` defaults false. Mirror the script in 42shots and run `scripts/test-projects-page.sh` in each repository. This verifies schema → normalization → published selection → contextual anchor in both repositories (`ARCH-PURPOSE`).

-- [ ] **Step 4: Remove temporary fixtures and run full verification**
+- [x] **Step 4: Remove temporary fixtures and run full verification**

 Run: `npm run check`

@@ -131,6 +140,24 @@ Expected: PASS and output includes `/projects/index.html` while Highlights and A

 In `../42shots`, run `npm run check` and `npm run build`; expect both to pass and `/projects/index.html` to be generated. Preserve the operator's existing unrelated modification to `src/pages/[...blog]/[...page].astro`.

-- [ ] **Step 5: Record evidence and commit**
+- [x] **Step 5: Record evidence and commit**

 Update issue #2's checklist and Log with verification evidence. Commit with an issue-scoped message and a `Co-Authored-By:` trailer naming the authoring model.
+
+## Revisions
+
+### 2026-07-14 14:10 PDT — change-code plan-quality gate
+
+- Added pure canonical-project selection with duplicate GitHub URL rejection.
+- Expanded generated-output assertions to cover accessibility, external-link
+  safety, default ordinary-list behavior, and equivalent 42shots fixtures.
+- Re-estimated the now-explicit cross-repository implementation and verification.
+
+### 2026-07-14 14:18 PDT — simplicity correction after gate review
+
+- Removed canonical URL/post enforcement because it was not part of the
+  operator's discoverability goal and would preclude multiple useful essays per
+  repository.
+- Added an explicit committed build-assertion script, mirrored and executed in
+  both repositories, so the rendered behavior remains reproducible after
+  temporary fixtures are removed.

codex
I’m using the SDLC review workflow plus the repository’s mandatory skill protocol to validate the issue, tracker, diff window, and test evidence read-only.
exec
/bin/zsh -lc "sed -n '1,240p' /Users/xianxu/workspace/ariadne/construct/adapted/superpowers-using-superpowers/SKILL.md && sed -n '1,280p' /Users/xianxu/workspace/ariadne/construct/local/sdlc/SKILL.md && sdlc --help && sed -n '1,240p' workshop/lessons.md" in /Users/xianxu/workspace/xianxu.dev
succeeded in 0ms:

---

name: superpowers-using-superpowers
description: Use when starting any conversation - establishes how to find and use skills, requiring Skill tool invocation before ANY response including clarifying questions

---

<SUBAGENT-STOP>
If you were dispatched as a subagent to execute a specific task, skip this skill.
</SUBAGENT-STOP>

<EXTREMELY-IMPORTANT>
If you think there is even a 1% chance a skill might apply to what you are doing, you ABSOLUTELY MUST invoke the skill.

IF A SKILL APPLIES TO YOUR TASK, YOU DO NOT HAVE A CHOICE. YOU MUST USE IT.

This is not negotiable. This is not optional. You cannot rationalize your way out of this.
</EXTREMELY-IMPORTANT>

## Instruction Priority

> **Ariadne note:** AGENTS.md Section 3 governs subagent strategy and overrides skills that mandate subagent-driven-development as the default execution path.

Superpowers skills override default system prompt behavior, but **user instructions always take precedence**:

1. **User's explicit instructions** (CLAUDE.md, GEMINI.md, AGENTS.md, direct requests) — highest priority
2. **Superpowers skills** — override default system behavior where they conflict
3. **Default system prompt** — lowest priority

If CLAUDE.md, GEMINI.md, or AGENTS.md says "don't use TDD" and a skill says "always use TDD," follow the user's instructions. The user is in control.

## How to Access Skills

**In Claude Code:** Use the `Skill` tool. When you invoke a skill, its content is loaded and presented to you—follow it directly. Never use the Read tool on skill files.

**In Gemini CLI:** Skills activate via the `activate_skill` tool. Gemini loads skill metadata at session start and activates the full content on demand.

**In other environments:** Check your platform's documentation for how skills are loaded.

## Platform Adaptation

Skills use Claude Code tool names. Non-CC platforms: see `references/codex-tools.md` (Codex) for tool equivalents. Gemini CLI users get the tool mapping loaded automatically via GEMINI.md.

# Using Skills

## The Rule

**Invoke relevant or requested skills BEFORE any response or action.** Even a 1% chance a skill might apply means that you should invoke the skill to check. If an invoked skill turns out to be wrong for the situation, you don't need to use it.

```dot
digraph skill_flow {
    "User message received" [shape=doublecircle];
    "About to EnterPlanMode?" [shape=doublecircle];
    "Already brainstormed?" [shape=diamond];
    "Invoke brainstorming skill" [shape=box];
    "Might any skill apply?" [shape=diamond];
    "Invoke Skill tool" [shape=box];
    "Announce: 'Using [skill] to [purpose]'" [shape=box];
    "Has checklist?" [shape=diamond];
    "Create TodoWrite todo per item" [shape=box];
    "Follow skill exactly" [shape=box];
    "Respond (including clarifications)" [shape=doublecircle];

    "About to EnterPlanMode?" -> "Already brainstormed?";
    "Already brainstormed?" -> "Invoke brainstorming skill" [label="no"];
    "Already brainstormed?" -> "Might any skill apply?" [label="yes"];
    "Invoke brainstorming skill" -> "Might any skill apply?";

    "User message received" -> "Might any skill apply?";
    "Might any skill apply?" -> "Invoke Skill tool" [label="yes, even 1%"];
    "Might any skill apply?" -> "Respond (including clarifications)" [label="definitely not"];
    "Invoke Skill tool" -> "Announce: 'Using [skill] to [purpose]'";
    "Announce: 'Using [skill] to [purpose]'" -> "Has checklist?";
    "Has checklist?" -> "Create TodoWrite todo per item" [label="yes"];
    "Has checklist?" -> "Follow skill exactly" [label="no"];
    "Create TodoWrite todo per item" -> "Follow skill exactly";
}
```

## Red Flags

These thoughts mean STOP—you're rationalizing:

| Thought                             | Reality                                                |
| ----------------------------------- | ------------------------------------------------------ |
| "This is just a simple question"    | Questions are tasks. Check for skills.                 |
| "I need more context first"         | Skill check comes BEFORE clarifying questions.         |
| "Let me explore the codebase first" | Skills tell you HOW to explore. Check first.           |
| "I can check git/files quickly"     | Files lack conversation context. Check for skills.     |
| "Let me gather information first"   | Skills tell you HOW to gather information.             |
| "This doesn't need a formal skill"  | If a skill exists, use it.                             |
| "I remember this skill"             | Skills evolve. Read current version.                   |
| "This doesn't count as a task"      | Action = task. Check for skills.                       |
| "The skill is overkill"             | Simple things become complex. Use it.                  |
| "I'll just do this one thing first" | Check BEFORE doing anything.                           |
| "This feels productive"             | Undisciplined action wastes time. Skills prevent this. |
| "I know what that means"            | Knowing the concept ≠ using the skill. Invoke it.      |

## Skill Priority

When multiple skills could apply, use this order:

1. **Process skills first** (brainstorming, debugging) - these determine HOW to approach the task
2. **Implementation skills second** (frontend-design, mcp-builder) - these guide execution

"Let's build X" → brainstorming first, then implementation skills.
"Fix this bug" → debugging first, then domain-specific skills.

## Skill Types

**Rigid** (TDD, debugging): Follow exactly. Don't adapt away discipline.

**Flexible** (patterns): Adapt principles to context.

The skill itself tells you which.

## User Instructions

## Instructions say WHAT, not HOW. "Add X" or "Fix Y" doesn't mean skip workflows.

name: sdlc
description: Use when at an SDLC checkpoint — starting work, closing an issue or milestone, opening/merging a PR, or recovering workflow state after compaction. The `sdlc` binary owns the gates between workflow stages and refuses transitions that lack required evidence.

---

# sdlc — SDLC checkpoint binary

`sdlc` owns the gates between SDLC workflow stages (claim → change-code → pr →
merge, plus close, milestone-close, judge). It requires evidence at each gate,
mutates state, logs the transition, and refuses transitions that lack the
evidence — that is the shape of a "checkpoint guard."

The binary is the single source of truth. This skill is a static pointer and
intentionally carries no copy of the contract, so it can never drift:

- **`sdlc --help`** — the workflow contract: the start-of-work runbook,
  conventions, and the verb list.
- **`sdlc <verb> --help`** — one checkpoint's full contract, flags, and examples.

Read those instead of relying on memory; the binary's help is always current.
sdlc collects ariadne's SDLC checkpoint guards into one binary. Each subcommand
owns one checkpoint: it requires evidence at the gate, mutates state, logs the
transition, and refuses transitions that lack it. We don't model the SDLC as a
state machine — stages stay prose; we codify the gates between them where drift
recurs. `sdlc` manages the development life cycle; prefer it over `git`/`gh`.

BEFORE WORK

- `sdlc claim --issue N` — the single start-of-work gesture, a CHEAP LOCK.
  Flips an _open_ issue to `working` and publishes the claim to origin/main so
  peer agents see it. No estimate demanded (#113) — claim early, the moment an
  idea crystallizes. `--no-start` suppresses the flip.
- Do NOT hand-edit an issue's `status:` — let `sdlc claim` or `sdlc issue
set-status` own that transition (it carries the reopen/`→ done` guards).

ENTER IMPLEMENTATION

- After plan approval, before editing code, run `sdlc change-code`. It owns the
  branching decision (in-place branch by default; `--worktree=yes` for an
  isolated worktree), the plan-quality check, and the `estimate_hours` gate
  (relocated here from claim, #113). Don't start coding without it.

PUBLISH

- Publishing goes through a PR: `sdlc pr` → `sdlc merge`. Direct `sdlc push`
  if working directly on main.
- Publish ONCE at issue close, not per milestone — and do NOT reuse a branch
  name that already has a merged PR. `sdlc merge` refuses (#148) when a branch
  has commits not in main despite a merged PR (a reused name would otherwise
  silently strand the new commits); rename to a fresh branch, `sdlc pr`, retry.

RECOVER

- After a compaction or session resume, run `sdlc state` to recover where you
  are instead of re-inferring from issue files.

LOCAL REPO TRANSACTION LOCK

- Mutating verbs take an SDLC-owned repo transaction lock at
  `.git/sdlc.lock` before reading/writing issue state, committing, changing
  branches, or pushing. The lock is local to the Git common dir, so linked
  worktrees of the same repo serialize with each other.
- Wait messages identify the holder pid and command when metadata is
  available. `close` and `milestone-close` release the lock while the external
  boundary-review subprocess runs, then reacquire before finalization; if HEAD
  or the issue/project file state they prepared changed meanwhile, they refuse
  to finalize and tell you to rerun. `change-code`, `merge`, and `push` can still hold the lock during
  long-running review/ship transactions; wait or retry rather than removing
  the lock while that process is alive.
- A dead same-host holder is reclaimed automatically; initializing metadata
  is waited through. Other stale/timeout errors tell you how to inspect
  `.git/sdlc.lock`. Remote push/ref races are separate: the local lock
  serializes this checkout, not another machine or clone.

WHEN A VERB ERRORS
Do NOT route around it with hand-rolled `git`/`gh`. Its errors are next-action
specs. The fix is one of two things:
(a) satisfy the precondition it names and re-run the same verb (e.g. `sdlc
        merge` saying "no upstream" → run `sdlc pr` first, then `sdlc merge`); or
(b) if the error is a genuine gap in `sdlc` itself, fix that edge case in the
source and re-run. We're still ironing out edge cases.
Only drop to manual when a verb genuinely cannot express the need — say so.

These gates sit inside a wider prose arc the binary does NOT own: ideation
(parley/pensive) → brainstorm → plan → build → milestone review (`sdlc judge`,
auto-dispatched) → close/ship → postmortem.

CONVENTIONS

--issue vs --github-issue — `--issue N` always means workshop/issues
(6-digit ID). `--github-issue N` means a GitHub issue number. Bare `--issue`
never means a GitHub issue.

Form vs essence — checkpoint guards (close, milestone-close, push, merge)
defend against _omission_ via required-evidence flags; `sdlc judge` defends
against _theater_ via fresh-context review. Form runs first; judge second.

The verb list + per-verb help (`sdlc <verb> --help`) follow below.

Usage:
sdlc [flags]
sdlc [command]

Available Commands:
claim Start work: flip an open issue to working + broadcast the claim
start-plan Enter planning: deliver the architecture principles to design against (#75)
change-code Enter implementation after the structural + plan-quality gates
issue Create + manage issues (new / set-status / list / show)
actual Compute an issue's focused dev-hours via active-time-v3 (#68)
active-time Per-issue active-time attribution table (the v3 engine, standalone)
close Close an issue or milestone (ACTUAL + VERIFIED + atlas/project sweep)
milestone-close Close one milestone + auto-dispatch its review
pr Open a pull request from a feature branch
merge Merge the PR, archive done issues, clean up
push Ship from main (clean tree + pre-merge judges + archive)
state Inspect workflow state (branch, working issues, drift)
resolve Resolve a symbolic artifact ref (ariadne#11, #15 M4) to its current path(s) — read-only
open Resolve a ref and open the primary artifact in $EDITOR
judge Run an LLM-judge check against the diff (fresh-context)
arch-principles Print the ARCH-\* architecture principles (single source; pull for non-gate work)
estimate-source Name the shared estimate method + the repo-local calibration source (pull)
process-manual Unroll every injection source into a linked process manual (#153)
propagate-base Re-weave every recursive dependent of this repo (foundation-first)
help Help about any command

Flags:
-h, --help help for sdlc

Use "sdlc [command] --help" for more information about a command.

exec
/bin/zsh -lc "git status --short && git diff --stat 8e552f52728ad6c9c4e8b04b6891f230f6e8685f..HEAD && git diff --name-status 8e552f52728ad6c9c4e8b04b6891f230f6e8685f..HEAD && sed -n '1,280p' workshop/issues/000002-open-source-projects-tab.md && sed -n '1,260p' workshop/plans/000002-open-source-projects-tab-plan.md && git log --oneline --decorate 8e552f52728ad6c9c4e8b04b6891f230f6e8685f..HEAD" in /Users/xianxu/workspace/xianxu.dev
succeeded in 0ms:
?? src/data/post/parley.md
scripts/test-projects-page.sh | 73 ++++++++++++++++++++++
src/components/blog/List.astro | 5 +-
src/components/blog/ListItem.astro | 17 ++++-
src/content/config.ts | 1 +
src/navigation.ts | 1 +
src/pages/projects.astro | 28 +++++++++
src/types.d.ts | 7 +++
src/utils/blog.ts | 2 +
workshop/issues/000002-open-source-projects-tab.md | 20 +++++-
.../plans/000002-open-source-projects-tab-plan.md | 71 ++++++++++++++-------
10 files changed, 197 insertions(+), 28 deletions(-)
A scripts/test-projects-page.sh
M src/components/blog/List.astro
M src/components/blog/ListItem.astro
M src/content/config.ts
M src/navigation.ts
A src/pages/projects.astro
M src/types.d.ts
M src/utils/blog.ts
M workshop/issues/000002-open-source-projects-tab.md
M workshop/plans/000002-open-source-projects-tab-plan.md

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

_Produced via `brain/data/life/42shots/velocity/estimate-logic-v3.1.md` against `baseline-v3.1.md`. Method A only._

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

# Open-source Projects Tab Implementation Plan

> **For agentic workers:** Consult AGENTS.md Section 3 (Subagent Strategy) to determine the appropriate execution approach: use superpowers-subagent-driven-development (if subagents are suitable per AGENTS.md) or superpowers-executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a Projects tab that surfaces canonical blog-post introductions to Xian's open-source projects and links directly to their GitHub repositories.

**Architecture:** Extend the existing post schema and normalized `Post` model with optional `project.github` metadata, then reuse the existing blog list for a filtered `/projects` page. A display-context flag enables GitHub links only on that page, keeping the shared renderer as the single implementation (`ARCH-DRY`) and selection as a pure predicate (`ARCH-PURE`). A process-level build assertion covers the complete static rendering path without introducing a test framework.

**Tech Stack:** Astro 5 content collections, TypeScript, Zod, Astro components, Tailwind CSS.

---

## Core concepts

### Pure entities

| Name              | Lives in                                                      | Status   |
| ----------------- | ------------------------------------------------------------- | -------- |
| `ProjectMetadata` | `src/content/config.ts`, `src/types.d.ts` and 42shots mirrors | new      |
| Normalized `Post` | `src/utils/blog.ts` and 42shots mirror                        | modified |

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

| Name                     | Lives in                                                                                   | Status   | Wraps                                     |
| ------------------------ | ------------------------------------------------------------------------------------------ | -------- | ----------------------------------------- |
| Project-aware blog list  | `src/components/blog/List.astro`, `src/components/blog/ListItem.astro` and 42shots mirrors | modified | Astro rendering                           |
| Projects route           | `src/pages/projects.astro` and 42shots mirror                                              | new      | Static page generation                    |
| Projects build assertion | `scripts/test-projects-page.sh` and 42shots mirror                                         | new      | Temporary content fixtures + static build |
| Primary navigation       | `src/navigation.ts`                                                                        | modified | Site navigation                           |

- **Project-aware blog list** — accepts an optional display flag and renders a direct GitHub link when enabled.
  - **Injected into:** The Projects page passes the flag; existing consumers retain current output.
  - **Future extensions:** Other project metadata can use the same context without forking the list.
- **Projects route** — fetches published posts, applies `post.project !== undefined`, and hands them to the shared list.
  - **Injected into:** Astro's static route build.
  - **Future extensions:** None until project count demonstrates a need for grouping or filtering.
- **Primary navigation** — exposes the route between Highlights and Archive.
  - **Injected into:** The existing Header through `headerData`.
  - **Future extensions:** None.
- **Projects build assertion** — creates controlled temporary project/non-project/draft posts, builds the site, asserts the Projects and ordinary-list HTML contracts, and removes fixtures through a shell trap.
  - **Injected into:** Local verification in each repository; no production runtime dependency.
  - **Future extensions:** Additional rendered contracts can be added when surfaced.

## Chunk 1: Typed project metadata

### Task 1: Extend the post data pipeline

**Files:**

- Modify: `src/content/config.ts`
- Modify: `src/types.d.ts`
- Modify: `src/utils/blog.ts`
- Modify: `../42shots/src/content/config.ts`
- Modify: `../42shots/src/types.d.ts`
- Modify: `../42shots/src/utils/blog.ts`

- [x] **Step 1: Define the project metadata schema and normalized type**

Add `project: z.object({ github: z.string().url() }).optional()` to the post schema, add matching `ProjectMetadata` and `Post.project` types, then destructure and return `project` in `getNormalizedPost`. Mirror these shared engine changes in 42shots (`ARCH-DRY`).

- [x] **Step 2: Add an invalid temporary project fixture and verify URL validation fails**

Create a temporary published Markdown fixture with `project.github: not-a-url`, then run: `npm run check:astro`

Expected: FAIL with a Zod URL-validation error for the fixture.

- [x] **Step 3: Correct the fixture and verify the typed pipeline**

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

- [x] **Step 1: Add `showProjectLink?: boolean` to both component props**

Default it to `false` and pass it from `List` to each `Item`; mirror the shared component change in 42shots.

- [x] **Step 2: Render the project destination**

When the flag and `post.project` are present, render an accessible external GitHub link after the excerpt using the existing icon library and `rel="noopener noreferrer"`.

- [x] **Step 3: Run `npm run check:astro`**

Expected: PASS with the new component contracts.

### Task 3: Add the Projects page and navigation

**Files:**

- Create: `src/pages/projects.astro`
- Create: `../42shots/src/pages/projects.astro`
- Create: `scripts/test-projects-page.sh`
- Create: `../42shots/scripts/test-projects-page.sh`
- Modify: `src/navigation.ts`

- [x] **Step 1: Create the static route**

Mirror the restrained Highlights layout, filter `fetchPosts()` by project metadata, render `<List posts={posts} showProjectLink />`, and include a clear empty state. Port the route to 42shots for structural parity, but leave it unlinked there because its business-site navigation and content are intentional differences.

- [x] **Step 2: Add `Projects` after `Highlights` in primary navigation**

- [x] **Step 3: Verify the rendered feature path with the temporary fixture**

Implement `scripts/test-projects-page.sh` as a committed deterministic test. It creates temporary published-project, published-non-project, and draft-project fixtures under the target repo, registers a trap that removes them, runs `npm run build`, then uses `rg` assertions against generated HTML. Assert `dist/projects/index.html` contains the published project's introduction permalink and exact GitHub URL, its anchor has an accessible label plus `target="_blank"` and `rel="noopener noreferrer"`, and it excludes the published non-project and draft project. Assert a normal list page does not contain that GitHub URL, proving `showProjectLink` defaults false. Mirror the script in 42shots and run `scripts/test-projects-page.sh` in each repository. This verifies schema → normalization → published selection → contextual anchor in both repositories (`ARCH-PURPOSE`).

- [x] **Step 4: Remove temporary fixtures and run full verification**

Run: `npm run check`

Expected: Astro, ESLint, and Prettier checks pass.

Run: `npm run build`

Expected: PASS and output includes `/projects/index.html` while Highlights and Archive remain generated.

In `../42shots`, run `npm run check` and `npm run build`; expect both to pass and `/projects/index.html` to be generated. Preserve the operator's existing unrelated modification to `src/pages/[...blog]/[...page].astro`.

- [x] **Step 5: Record evidence and commit**

Update issue #2's checklist and Log with verification evidence. Commit with an issue-scoped message and a `Co-Authored-By:` trailer naming the authoring model.

## Revisions

### 2026-07-14 14:10 PDT — change-code plan-quality gate

- Added pure canonical-project selection with duplicate GitHub URL rejection.
- Expanded generated-output assertions to cover accessibility, external-link
  safety, default ordinary-list behavior, and equivalent 42shots fixtures.
- Re-estimated the now-explicit cross-repository implementation and verification.

### 2026-07-14 14:18 PDT — simplicity correction after gate review

- Removed canonical URL/post enforcement because it was not part of the
  operator's discoverability goal and would preclude multiple useful essays per
  repository.
- Added an explicit committed build-assertion script, mirrored and executed in
  both repositories, so the rendered behavior remains reproducible after
  temporary fixtures are removed.
  34ed1a4 (HEAD -> 000002-open-source-projects-tab) blog: #2 add open-source projects tab

codex
The implementation shape is coherent so far. I’m now checking the actual post-selection contract, generated markup, test specificity, and whether the new route is represented in the atlas rather than relying on the tracker’s claims.
exec
/bin/zsh -lc "nl -ba src/utils/blog.ts | sed -n '1,180p'; nl -ba src/pages/projects.astro; nl -ba src/components/blog/ListItem.astro | sed -n '85,145p'; nl -ba scripts/test-projects-page.sh; rg -n \"fetchPosts|sort|published|highlight\" src/pages/highlights.astro src/utils/blog.ts; rg -n \"projects|Highlights|Archive|navigation|route\" atlas README.md package.json; git diff --check 8e552f52728ad6c9c4e8b04b6891f230f6e8685f..HEAD; git diff 8e552f52728ad6c9c4e8b04b6891f230f6e8685f..HEAD -- atlas README.md package.json" in /Users/xianxu/workspace/xianxu.dev
succeeded in 0ms:
1 import type { PaginateFunction } from 'astro';
2 import { getCollection, render } from 'astro:content';
3 import type { CollectionEntry } from 'astro:content';
4 import type { Post } from '~/types';
5 import { APP_BLOG } from 'astrowind:config';
6 import { cleanSlug, trimSlash, BLOG_BASE, POST_PERMALINK_PATTERN, CATEGORY_BASE, TAG_BASE } from './permalinks';
7
8 const generatePermalink = async ({
9 id,
10 slug,
11 publishDate,
12 category,
13 }: {
14 id: string;
15 slug: string;
16 publishDate: Date;
17 category: string | undefined;
18 }) => {
19 const year = String(publishDate.getFullYear()).padStart(4, '0');
20 const month = String(publishDate.getMonth() + 1).padStart(2, '0');
21 const day = String(publishDate.getDate()).padStart(2, '0');
22 const hour = String(publishDate.getHours()).padStart(2, '0');
23 const minute = String(publishDate.getMinutes()).padStart(2, '0');
24 const second = String(publishDate.getSeconds()).padStart(2, '0');
25
26 const permalink = POST_PERMALINK_PATTERN.replace('%slug%', slug)
27 .replace('%id%', id)
28 .replace('%category%', category || '')
29 .replace('%year%', year)
30 .replace('%month%', month)
31 .replace('%day%', day)
32 .replace('%hour%', hour)
33 .replace('%minute%', minute)
34 .replace('%second%', second);
35
36 return permalink
37 .split('/')
38 .map((el) => trimSlash(el))
39 .filter((el) => !!el)
40 .join('/');
41 };
42
43 const getNormalizedPost = async (post: CollectionEntry<'post'>): Promise<Post> => {
44 const { id, data } = post;
45 const { Content, remarkPluginFrontmatter } = await render(post);
46
47 const {
48 publishDate: rawPublishDate = new Date(),
49 updateDate: rawUpdateDate,
50 title,
51 excerpt,
52 image,
53 tags: rawTags = [],
54 category: rawCategory,
55 author,
56 published = false,
57 highlight = false,
58 project,
59 hidden = false,
60 comments = true,
61 metadata = {},
62 } = data;
63
64 const slug = cleanSlug(id); // cleanSlug(rawSlug.split('/').pop());
65 const publishDate = new Date(rawPublishDate);
66 const updateDate = rawUpdateDate ? new Date(rawUpdateDate) : undefined;
67
68 const category = rawCategory
69 ? {
70 slug: cleanSlug(rawCategory),
71 title: rawCategory,
72 }
73 : undefined;
74
75 const tags = rawTags.map((tag: string) => ({
76 slug: cleanSlug(tag),
77 title: tag,
78 }));
79
80 return {
81 id: id,
82 slug: slug,
83 permalink: await generatePermalink({ id, slug, publishDate, category: category?.slug }),
84
85 publishDate: publishDate,
86 updateDate: updateDate,
87
88 title: title,
89 excerpt: excerpt,
90 image: image,
91
92 category: category,
93 tags: tags,
94 author: author,
95
96 published: published,
97 highlight: highlight,
98 project: project,
99 hidden: hidden,
100 comments: comments,
101
102 metadata,
103
104 Content: Content,
105 // or 'content' in case you consume from API
106
107 readingTime: remarkPluginFrontmatter?.readingTime,
108 };
109 };
110
111 const load = async function (): Promise<Array<Post>> {
112 const posts = await getCollection('post');
113 const normalizedPosts = posts.map(async (post) => await getNormalizedPost(post));
114
115 const results = (await Promise.all(normalizedPosts)).sort(
116 (a, b) => b.publishDate.valueOf() - a.publishDate.valueOf()
117 );
118
119 return results;
120 };
121
122 let \_allPosts: Array<Post>;
123 let \_posts: Array<Post>;
124
125 /** \*/
126 export const isBlogEnabled = APP_BLOG.isEnabled;
127 export const isRelatedPostsEnabled = APP_BLOG.isRelatedPostsEnabled;
128 export const isBlogListRouteEnabled = APP_BLOG.list.isEnabled;
129 export const isBlogPostRouteEnabled = APP_BLOG.post.isEnabled;
130 export const isBlogCategoryRouteEnabled = APP_BLOG.category.isEnabled;
131 export const isBlogTagRouteEnabled = APP_BLOG.tag.isEnabled;
132
133 export const blogListRobots = APP_BLOG.list.robots;
134 export const blogPostRobots = APP_BLOG.post.robots;
135 export const blogCategoryRobots = APP_BLOG.category.robots;
136 export const blogTagRobots = APP_BLOG.tag.robots;
137
138 export const blogPostsPerPage = APP_BLOG?.postsPerPage;
139
140 /** All posts, including drafts. Use only in dev tools / drafts page. _/
141 export const fetchAllPosts = async (): Promise<Array<Post>> => {
142 if (!\_allPosts) {
143 \_allPosts = await load();
144 }
145 return \_allPosts;
146 };
147
148 /\*\* Published posts only — what visitors should ever see. _/
149 export const fetchPosts = async (): Promise<Array<Post>> => {
150 if (!\_posts) {
151 \_posts = (await fetchAllPosts()).filter((p) => p.published === true);
152 }
153 return \_posts;
154 };
155
156 /** Draft posts only. \*/
157 export const fetchDrafts = async (): Promise<Array<Post>> => {
158 return (await fetchAllPosts()).filter((p) => p.published !== true);
159 };
160
161 /** _/
162 export const findPostsBySlugs = async (slugs: Array<string>): Promise<Array<Post>> => {
163 if (!Array.isArray(slugs)) return [];
164
165 const posts = await fetchPosts();
166
167 return slugs.reduce(function (r: Array<Post>, slug: string) {
168 posts.some(function (post: Post) {
169 return slug === post.slug && r.push(post);
170 });
171 return r;
172 }, []);
173 };
174
175 /\*\* _/
176 export const findPostsByIds = async (ids: Array<string>): Promise<Array<Post>> => {
177 if (!Array.isArray(ids)) return [];
178
179 const posts = await fetchPosts();
180
1 ---
2 import Layout from '~/layouts/PageLayout.astro';
3 import List from '~/components/blog/List.astro';
4 import { fetchPosts } from '~/utils/blog';
5
6 export const prerender = true;
7
8 const posts = (await fetchPosts()).filter((post) => post.project !== undefined);
9
10 const metadata = {
11 title: 'Projects',
12 };
13 ---
14
15 <Layout metadata={metadata}>
16 <section class="px-4 sm:px-6 py-12 sm:py-16 lg:py-20 mx-auto max-w-4xl">
17 <h1 class="text-3xl md:text-4xl font-bold leading-tighter tracking-tighter font-heading mb-3">Projects</h1>
18 <p class="text-muted dark:text-slate-400 mb-12">Open-source projects I work on, and the stories behind them.</p>
19
20 {
21 posts.length === 0 ? (
22 <p class="text-muted">No project introductions yet.</p>
23 ) : (
24 <List posts={posts} showProjectLink />
25 )
26 }
27 </section>
28 </Layout>
85 ·{' '}
86 <a class="hover:underline" href={getPermalink(post.category.slug, 'category')}>
87 {post.category.title}
88 </a>
89 </>
90 )
91 }
92 </span>
93 </div>
94 <h2 class="text-xl sm:text-2xl font-bold leading-tight mb-2 font-heading dark:text-slate-300">
95 {
96 link ? (
97 <a
98 class="inline-block hover:text-primary dark:hover:text-blue-700 transition ease-in duration-200"
99 href={link}
100 >
101 {post.title}
102 </a>
103 ) : (
104 post.title
105 )
106 }
107 </h2>
108 </header>
109
110 {post.excerpt && <p class="flex-grow text-muted dark:text-slate-400 text-lg">{post.excerpt}</p>}
111 {
112 showProjectLink && post.project && (
113 <a
114 class="inline-flex items-center gap-1.5 mt-4 text-sm font-medium hover:underline"
115 href={post.project.github}
116 target="\_blank"
117 rel="noopener noreferrer"
118 aria-label={`View ${post.title} on GitHub`}
119 >
120 <Icon name="tabler:brand-github" class="w-4 h-4" />
121 GitHub
122 </a>
123 )
124 }
125 {
126 post.tags && Array.isArray(post.tags) ? (
127 <footer class="mt-5">
128 <PostTags tags={post.tags} />
129 </footer>
130 ) : (
131 <Fragment />
132 )
133 }
134 </div>
135 </article>
1 #!/usr/bin/env bash
2 set -euo pipefail
3
4 repo=${1:-.}
     5	posts="$repo/src/data/post"
6 published="$posts/project-render-published-test.md"
     7	nonproject="$posts/project-render-nonproject-test.md"
8 draft="$posts/project-render-draft-test.md"
     9
    10	cleanup() {
    11	  rm -f "$published" "$nonproject" "$draft"
12 }
13 trap cleanup EXIT
14
15 cat >"$published" <<'EOF'
    16	---
    17	title: Project render published test
    18	publishDate: 2030-01-03
    19	published: true
    20	highlight: true
    21	project:
    22	  github: https://github.com/xianxu/project-render-test
    23	---
    24
    25	Temporary project rendering fixture.
    26	EOF
    27
    28	cat >"$nonproject" <<'EOF'
29 ---
30 title: Project render nonproject test
31 publishDate: 2030-01-02
32 published: true
33 ---
34
35 Temporary non-project rendering fixture.
36 EOF
37
38 cat >"$draft" <<'EOF'
    39	---
    40	title: Project render draft test
    41	publishDate: 2030-01-01
    42	published: false
    43	project:
    44	  github: https://github.com/xianxu/project-render-draft-test
    45	---
    46
    47	Temporary draft project rendering fixture.
    48	EOF
    49
    50	(
    51	  cd "$repo"
52 npm run build
53 )
54
55 projects="$repo/dist/projects/index.html"
    56	highlights="$repo/dist/highlights/index.html"
57
58 rg -q 'Project render published test' "$projects"
    59	rg -q 'https://github.com/xianxu/project-render-test' "$projects"
60 rg -q 'aria-label="View Project render published test on GitHub"' "$projects"
    61	rg -q 'target="_blank"' "$projects"
62 rg -q 'rel="noopener noreferrer"' "$projects"
    63
    64	if rg -q 'Project render nonproject test|Project render draft test|project-render-draft-test' "$projects"; then
65 echo "Projects page included a non-project or draft fixture" >&2
66 exit 1
67 fi
68
69 rg -q 'Project render published test' "$highlights"
    70	if rg -q 'https://github.com/xianxu/project-render-test' "$highlights"; then
71 echo "Ordinary blog list exposed a project-only GitHub link" >&2
72 exit 1
73 fi
src/utils/blog.ts:56: published = false,
src/utils/blog.ts:57: highlight = false,
src/utils/blog.ts:96: published: published,
src/utils/blog.ts:97: highlight: highlight,
src/utils/blog.ts:115: const results = (await Promise.all(normalizedPosts)).sort(
src/utils/blog.ts:149:export const fetchPosts = async (): Promise<Array<Post>> => {
src/utils/blog.ts:151: \_posts = (await fetchAllPosts()).filter((p) => p.published === true);
src/utils/blog.ts:158: return (await fetchAllPosts()).filter((p) => p.published !== true);
src/utils/blog.ts:165: const posts = await fetchPosts();
src/utils/blog.ts:179: const posts = await fetchPosts();
src/utils/blog.ts:192: const posts = await fetchPosts();
src/utils/blog.ts:211: const all = await fetchPosts();
src/utils/blog.ts:239: // Drafts get URLs in dev so you can preview them; production renders only published.
src/utils/blog.ts:240: const posts = import.meta.env.DEV ? await fetchAllPosts() : await fetchPosts();
src/utils/blog.ts:253: const posts = await fetchPosts();
src/utils/blog.ts:277: \* (Also fixes a latent leak: the old version paginated fetchPosts() unfiltered,
src/utils/blog.ts:282: const all = await fetchPosts();
src/utils/blog.ts:332: const allPosts = await fetchPosts();
src/utils/blog.ts:355: postsWithScores.sort((a, b) => b.score - a.score);
src/pages/highlights.astro:4:import { fetchPosts } from '~/utils/blog';
src/pages/highlights.astro:8:const posts = (await fetchPosts()).filter((p) => p.highlight === true);
src/pages/highlights.astro:21: <p class="text-muted">No highlighted posts yet.</p>
README.md:14:- ✅ Generation of **project sitemap** based on your routes.
README.md:44:- [Related Projects](#related-projects)
README.md:128:│ └── navigation.js
README.md:134:Astro looks for `.astro` or `.md` files in the `src/pages/` directory. Each page is exposed as a route based on its file name.
README.md:286:## Related projects

exec
/bin/zsh -lc './scripts/test-projects-page.sh .' in /Users/xianxu/workspace/xianxu.dev
succeeded in 8427ms:
npm warn Unknown project config "shamefully-hoist". This will stop working in the next major version of npm. See `npm help npmrc` for supported config options.

> 42shots@1.0.0-beta.52 build
> astro build

14:11:52 [astrowind] Astrowind `./src/config.yaml` has been loaded.
14:11:52 [content] Syncing content
14:11:52 [content] Synced content
14:11:52 [types] Generated 252ms
14:11:52 [build] output: "static"
14:11:52 [build] mode: "static"
14:11:52 [build] directory: /Users/xianxu/workspace/xianxu.dev/dist/
14:11:52 [build] Collecting build info...
14:11:52 [build] ✓ Completed in 311ms.
14:11:52 [build] Building static entrypoints...
Browserslist: caniuse-lite is outdated. Please run:
npx update-browserslist-db@latest
Why you should do it regularly: https://github.com/browserslist/update-db#readme
14:11:53 [vite] ✓ built in 1.26s
14:11:53 [build] ✓ Completed in 1.27s.

building client (vite)
14:11:53 [vite] transforming...
14:11:53 [vite] ✓ 13 modules transformed.
14:11:53 [vite] rendering chunks...
14:11:53 [vite] computing gzip size...
14:11:53 [vite] dist/\_astro/ClientRouter.astro_astro_type_script_index_0_lang.DZnDNxNb.js 14.84 kB │ gzip: 5.11 kB
14:11:53 [vite] ✓ built in 30ms

generating static routes
14:11:54 ▶ src/pages/404.astro
14:11:54 └─ /404.html (+5ms)
14:11:54 ▶ src/pages/about.astro
14:11:54 └─ /about/index.html (+4ms)
14:11:54 ▶ src/pages/drafts.astro
14:11:54 └─ /drafts/index.html (+12ms)
14:11:54 ▶ src/pages/highlights.astro
14:11:54 └─ /highlights/index.html (+2ms)
14:11:54 ▶ src/pages/projects.astro
14:11:54 └─ /projects/index.html (+1ms)
14:11:54 λ src/pages/rss.xml.ts
14:11:54 └─ /rss.xml (+1ms)
14:11:54 ▶ src/pages/tags.astro
14:11:54 └─ /tags/index.html (+2ms)
14:11:54 ▶ src/pages/[...blog]/[category]/[...page].astro
14:11:54 ▶ src/pages/[...blog]/[tag]/[...page].astro
14:11:54 ├─ /tag/life/index.html (+2ms)
14:11:54 ├─ /tag/life/all/index.html (+2ms)
14:11:54 ├─ /tag/life/per/25/index.html (+1ms)
14:11:54 ├─ /tag/life/all/per/25/index.html (+1ms)
14:11:54 ├─ /tag/life/per/50/index.html (+1ms)
14:11:54 ├─ /tag/life/all/per/50/index.html (+1ms)
14:11:54 ├─ /tag/life/per/all/index.html (+1ms)
14:11:54 ├─ /tag/life/all/per/all/index.html (+1ms)
14:11:54 ├─ /tag/law/index.html (+1ms)
14:11:54 ├─ /tag/law/all/index.html (+1ms)
14:11:54 ├─ /tag/law/per/25/index.html (+1ms)
14:11:54 ├─ /tag/law/all/per/25/index.html (+1ms)
14:11:54 ├─ /tag/law/per/50/index.html (+1ms)
14:11:54 ├─ /tag/law/all/per/50/index.html (+1ms)
14:11:54 ├─ /tag/law/per/all/index.html (+1ms)
14:11:54 ├─ /tag/law/all/per/all/index.html (+1ms)
14:11:54 ├─ /tag/ai/index.html (+1ms)
14:11:54 ├─ /tag/ai/2/index.html (+1ms)
14:11:54 ├─ /tag/ai/all/index.html (+3ms)
14:11:54 ├─ /tag/ai/all/2/index.html (+1ms)
14:11:54 ├─ /tag/ai/per/25/index.html (+1ms)
14:11:54 ├─ /tag/ai/all/per/25/index.html (+2ms)
14:11:54 ├─ /tag/ai/per/50/index.html (+1ms)
14:11:54 ├─ /tag/ai/all/per/50/index.html (+1ms)
14:11:54 ├─ /tag/ai/per/all/index.html (+1ms)
14:11:54 ├─ /tag/ai/all/per/all/index.html (+2ms)
14:11:54 ├─ /tag/tech/index.html (+1ms)
14:11:54 ├─ /tag/tech/2/index.html (+1ms)
14:11:54 ├─ /tag/tech/3/index.html (+1ms)
14:11:54 ├─ /tag/tech/all/index.html (+2ms)
14:11:54 ├─ /tag/tech/all/2/index.html (+3ms)
14:11:54 ├─ /tag/tech/all/3/index.html (+1ms)
14:11:54 ├─ /tag/tech/per/25/index.html (+2ms)
14:11:54 ├─ /tag/tech/per/25/2/index.html (+1ms)
14:11:54 ├─ /tag/tech/all/per/25/index.html (+2ms)
14:11:54 ├─ /tag/tech/all/per/25/2/index.html (+1ms)
14:11:54 ├─ /tag/tech/per/50/index.html (+1ms)
14:11:54 ├─ /tag/tech/all/per/50/index.html (+1ms)
14:11:54 ├─ /tag/tech/per/all/index.html (+1ms)
14:11:54 ├─ /tag/tech/all/per/all/index.html (+3ms)
14:11:54 ├─ /tag/ariadne/index.html (+1ms)
14:11:54 ├─ /tag/ariadne/all/index.html (+1ms)
14:11:54 ├─ /tag/ariadne/per/25/index.html (+1ms)
14:11:54 ├─ /tag/ariadne/all/per/25/index.html (+1ms)
14:11:54 ├─ /tag/ariadne/per/50/index.html (+1ms)
14:11:54 ├─ /tag/ariadne/all/per/50/index.html (+1ms)
14:11:54 ├─ /tag/ariadne/per/all/index.html (+1ms)
14:11:54 ├─ /tag/ariadne/all/per/all/index.html (+1ms)
14:11:54 ├─ /tag/philosophy/index.html (+1ms)
14:11:54 ├─ /tag/philosophy/all/index.html (+1ms)
14:11:54 ├─ /tag/philosophy/per/25/index.html (+1ms)
14:11:54 ├─ /tag/philosophy/all/per/25/index.html (+1ms)
14:11:54 ├─ /tag/philosophy/per/50/index.html (+1ms)
14:11:54 ├─ /tag/philosophy/all/per/50/index.html (+1ms)
14:11:54 ├─ /tag/philosophy/per/all/index.html (+1ms)
14:11:54 └─ /tag/philosophy/all/per/all/index.html (+1ms)
14:11:54 ▶ src/pages/[...blog]/[...page].astro
14:11:54 ├─ /blog/index.html (+1ms)
14:11:54 ├─ /blog/2/index.html (+1ms)
14:11:54 ├─ /blog/3/index.html (+1ms)
14:11:54 ├─ /blog/4/index.html (+1ms)
14:11:54 ├─ /blog/5/index.html (+1ms)
14:11:54 ├─ /blog/all/index.html (+1ms)
14:11:54 ├─ /blog/all/2/index.html (+1ms)
14:11:54 ├─ /blog/all/3/index.html (+1ms)
14:11:54 ├─ /blog/all/4/index.html (+1ms)
14:11:54 ├─ /blog/all/5/index.html (+1ms)
14:11:54 ├─ /blog/all/6/index.html (+1ms)
14:11:54 ├─ /blog/per/25/index.html (+2ms)
14:11:54 ├─ /blog/per/25/2/index.html (+3ms)
14:11:54 ├─ /blog/all/per/25/index.html (+2ms)
14:11:54 ├─ /blog/all/per/25/2/index.html (+1ms)
14:11:54 ├─ /blog/all/per/25/3/index.html (+1ms)
14:11:54 ├─ /blog/per/50/index.html (+2ms)
14:11:54 ├─ /blog/all/per/50/index.html (+3ms)
14:11:54 ├─ /blog/all/per/50/2/index.html (+1ms)
14:11:54 ├─ /blog/per/all/index.html (+2ms)
14:11:54 └─ /blog/all/per/all/index.html (+2ms)
14:11:54 ▶ src/pages/index.astro
14:11:54 └─ /index.html (+2ms)
14:11:54 ▶ src/pages/[...blog]/index.astro
14:11:54 ├─ /2030/01/project-render-published-test/index.html (+4ms)
14:11:54 ├─ /2030/01/project-render-nonproject-test/index.html (+1ms)
14:11:54 ├─ /2026/06/birthright-citizenship-ruling/index.html (+1ms)
14:11:54 ├─ /2026/06/skill-binary-and-dynamic-skill/index.html (+1ms)
14:11:54 ├─ /2026/06/a-blogging-workflow/index.html (+1ms)
14:11:54 ├─ /2026/06/the-case-for-space-data-center/index.html (+1ms)
14:11:54 ├─ /2026/06/the-value-of-personal-data/index.html (+1ms)
14:11:54 ├─ /2026/05/a-saturday-coding-session/index.html (+1ms)
14:11:54 ├─ /2026/05/saturday-pair-transcript/index.html (+1ms)
14:11:54 ├─ /2026/04/ai-native-company/index.html (+3ms)
14:11:54 ├─ /2026/04/personal-brain-extension/index.html (+1ms)
14:11:54 ├─ /2026/04/a-new-home/index.html (+1ms)
14:11:54 ├─ /2026/04/tale-of-two-harness/index.html (+1ms)
14:11:54 ├─ /2026/04/whatsapp_gdpr_fine/index.html (+1ms)
14:11:54 ├─ /2026/04/loom_workflow_system/index.html (+1ms)
14:11:54 ├─ /2026/04/vision_alignment_tools/index.html (+1ms)
14:11:54 ├─ /2026/04/what_is_graphviz_dot_language/index.html (+2ms)
14:11:54 ├─ /2026/03/agentic_state_management/index.html (+1ms)
14:11:54 ├─ /2026/03/ai-coding-workflow2/index.html (+1ms)
14:11:54 ├─ /2026/03/further_on_the_ideal_of_logmd/index.html (+1ms)
14:11:54 ├─ /2026/03/the-rise-of-personal-software/index.html (+1ms)
14:11:54 ├─ /2026/03/ai-coding-workflow/index.html (+1ms)
14:11:54 ├─ /2026/02/dawn-of-ai-coding/index.html (+1ms)
14:11:54 ├─ /2026/02/ai-as-new-abstraction/index.html (+1ms)
14:11:54 ├─ /2026/02/to-type-or-not/index.html (+1ms)
14:11:54 ├─ /2026/02/data-vs-anecdotes/index.html (+1ms)
14:11:54 ├─ /2025/11/organic-process/index.html (+1ms)
14:11:54 ├─ /2025/11/when-judgement-slips/index.html (+1ms)
14:11:54 ├─ /2025/11/trump-tariff/index.html (+1ms)
14:11:54 ├─ /2025/10/how-to-parli/index.html (+1ms)
14:11:54 ├─ /2025/10/high-output-management/index.html (+1ms)
14:11:54 ├─ /2025/09/birthright-citizenship-v2/index.html (+1ms)
14:11:54 ├─ /2025/09/this-is-the-way/index.html (+1ms)
14:11:54 ├─ /2025/09/operation-principles/index.html (+1ms)
14:11:54 ├─ /2025/09/whatsapp-architecture/index.html (+1ms)
14:11:54 ├─ /2025/08/gerrymandering-war/index.html (+1ms)
14:11:54 ├─ /2025/08/glass-half-full/index.html (+1ms)
14:11:54 ├─ /2025/05/joining-nexhealth/index.html (+1ms)
14:11:54 ├─ /2025/05/ai-coding-take-2/index.html (+1ms)
14:11:54 ├─ /2025/05/conversation_around_concurrent_programming_models/index.html (+1ms)
14:11:54 ├─ /2025/05/birthright-citizenship/index.html (+1ms)
14:11:54 ├─ /2025/05/facebook-move-on/index.html (+1ms)
14:11:54 ├─ /2025/04/in-love-of-desert/index.html (+1ms)
14:11:54 ├─ /2025/04/reflection-on-ai-coding/index.html (+1ms)
14:11:54 ├─ /2025/04/claude-code/index.html (+1ms)
14:11:54 ├─ /2025/04/chatgpt-in-neovim-collab/index.html (+1ms)
14:11:54 ├─ /2025/04/chatgpt-in-neovim/index.html (+1ms)
14:11:54 ├─ /2025/04/culture-wa/index.html (+1ms)
14:11:54 ├─ /2025/02/astro-photo/index.html (+1ms)
14:11:54 ├─ /2025/02/money-power-happiness-at-work/index.html (+1ms)
14:11:54 ├─ /2025/01/githubio-blogging/index.html (+1ms)
14:11:54 ├─ /2025/01/dot-files/index.html (+1ms)
14:11:54 └─ /2024/12/hello-world/index.html (+2ms)
14:11:54 ✓ Completed in 227ms.

generating optimized images
14:11:54 ▶ /\_astro/about-sky.CoK26dYp_Z17NqQE.webp (reused cache entry) (+1ms) (1/3)
14:11:54 ▶ /\_astro/about-sky.CoK26dYp_uvaSx.webp (reused cache entry) (+1ms) (2/3)
14:11:54 ▶ /\_astro/about-sky.CoK26dYp_Wy3Vv.webp (reused cache entry) (+1ms) (3/3)
14:11:54 ✓ Completed in 3ms.

14:11:54 [@astrojs/sitemap] `sitemap-index.xml` created at `dist`
✓ Successfully compressed a total of 2 CSS files for 651 Bytes.
14:11:58 [build] Waiting for integration "astro-compress", hook "astro:build:done"...
✓ Successfully compressed a total of 138 HTML files for 665.36 KB.
14:11:58 [astrowind] Updating `robots.txt` with `sitemap-index.xml` ...
14:11:58 [build] 137 page(s) built in 6.62s
14:11:58 [build] Complete!

exec
/bin/zsh -lc "nl -ba workshop/plans/000002-open-source-projects-tab-plan.md | sed -n '1,65p'; nl -ba workshop/issues/000002-open-source-projects-tab.md | sed -n '15,95p'; git status --short; test "'! -e src/data/post/project-render-published-test.md && test ! -e src/data/post/project-render-nonproject-test.md && test ! -e src/data/post/project-render-draft-test.md && echo fixtures-cleaned' in /Users/xianxu/workspace/xianxu.dev
succeeded in 0ms:
1 # Open-source Projects Tab Implementation Plan
2
3 > **For agentic workers:** Consult AGENTS.md Section 3 (Subagent Strategy) to determine the appropriate execution approach: use superpowers-subagent-driven-development (if subagents are suitable per AGENTS.md) or superpowers-executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.
4
5 **Goal:** Add a Projects tab that surfaces canonical blog-post introductions to Xian's open-source projects and links directly to their GitHub repositories.
6
7 **Architecture:** Extend the existing post schema and normalized `Post` model with optional `project.github` metadata, then reuse the existing blog list for a filtered `/projects` page. A display-context flag enables GitHub links only on that page, keeping the shared renderer as the single implementation (`ARCH-DRY`) and selection as a pure predicate (`ARCH-PURE`). A process-level build assertion covers the complete static rendering path without introducing a test framework.
8
9 **Tech Stack:** Astro 5 content collections, TypeScript, Zod, Astro components, Tailwind CSS.
10
11 ---
12
13 ## Core concepts
14
15 ### Pure entities
16
17 | Name | Lives in | Status |
18 | ----------------- | ------------------------------------------------------------- | -------- |
19 | `ProjectMetadata` | `src/content/config.ts`, `src/types.d.ts` and 42shots mirrors | new |
20 | Normalized `Post` | `src/utils/blog.ts` and 42shots mirror | modified |
21
22 - **ProjectMetadata** — optional metadata marking a post as the canonical introduction to an open-source project.
23 - **Relationships:** A post has zero or one project record; a project record has exactly one GitHub URL.
24 - **DRY rationale:** The nested object is the sole marker and destination, avoiding independent boolean and URL fields that can disagree (`ARCH-DRY`).
25 - **Future extensions:** Optional project destinations such as a homepage can widen this object without changing marker semantics.
26 - **Normalized `Post`** — the existing renderer-facing representation gains the project record.
27 - **Relationships:** One content entry normalizes to one `Post`; all consumers share it.
28 - **DRY rationale:** Metadata travels through the existing normalization boundary rather than being re-read by the Projects page (`ARCH-PURPOSE`).
29 - **Future extensions:** None planned for version one.
30
31 Validation runs through Astro's schema/type checks and production build. This repository has no unit-test harness; adding one solely for a declarative Zod field would exceed this feature's scope.
32
33 ### Integration points
34
35 | Name | Lives in | Status | Wraps |
36 | ------------------------ | ------------------------------------------------------------------------------------------ | -------- | ----------------------------------------- |
37 | Project-aware blog list | `src/components/blog/List.astro`, `src/components/blog/ListItem.astro` and 42shots mirrors | modified | Astro rendering |
38 | Projects route | `src/pages/projects.astro` and 42shots mirror | new | Static page generation |
39 | Projects build assertion | `scripts/test-projects-page.sh` and 42shots mirror | new | Temporary content fixtures + static build |
40 | Primary navigation | `src/navigation.ts` | modified | Site navigation |
41
42 - **Project-aware blog list** — accepts an optional display flag and renders a direct GitHub link when enabled.
43 - **Injected into:** The Projects page passes the flag; existing consumers retain current output.
44 - **Future extensions:** Other project metadata can use the same context without forking the list.
45 - **Projects route** — fetches published posts, applies `post.project !== undefined`, and hands them to the shared list.
46 - **Injected into:** Astro's static route build.
47 - **Future extensions:** None until project count demonstrates a need for grouping or filtering.
48 - **Primary navigation** — exposes the route between Highlights and Archive.
49 - **Injected into:** The existing Header through `headerData`.
50 - **Future extensions:** None.
51 - **Projects build assertion** — creates controlled temporary project/non-project/draft posts, builds the site, asserts the Projects and ordinary-list HTML contracts, and removes fixtures through a shell trap.
52 - **Injected into:** Local verification in each repository; no production runtime dependency.
53 - **Future extensions:** Additional rendered contracts can be added when surfaced.
54
55 ## Chunk 1: Typed project metadata
56
57 ### Task 1: Extend the post data pipeline
58
59 **Files:**
60
61 - Modify: `src/content/config.ts`
62 - Modify: `src/types.d.ts`
63 - Modify: `src/utils/blog.ts`
64 - Modify: `../42shots/src/content/config.ts`
65 - Modify: `../42shots/src/types.d.ts`
15
16 The site presents writing through Highlights and Archive, but it has no durable,
17 easy-to-find entry point for open-source projects. GitHub READMEs should remain
18 the operational source for installation and usage; the site should surface the
19 longer introductions, histories, design choices, and reflections already written
20 as blog posts.
21
22 ## Spec
23
24 - Add an optional `project` object to post frontmatter. Version one contains one
25 required field, `github`, validated as a URL. Omitting `project` means the post
26 is not a canonical project introduction.
27 - Carry that object through the normalized `Post` model so every consumer sees
28 the same typed data.
29 - Add a top-level `Projects` navigation item and a statically generated
30 `/projects` page.
31 - The page reuses the existing blog list and shows published posts with project
32 metadata, newest first. Each project entry includes a direct GitHub link in
33 addition to its ordinary post link.
34 - `project` marks a substantial introduction, history, or reflection worth
35 discovering from the Projects tab. Multiple posts may point at the same
36 repository; version one does not impose repository identity or canonical-post
37 rules.
38 - Do not create a separate project collection, case-study renderer, filtering
39 system, or new prose in version one.
40 - Port the reusable post schema, normalization, list capability, and Projects
41 route to `../42shots/` to keep the shared blog structure synchronized. Do not
42 add the personal-site navigation item to 42shots; its business-site navigation
43 is an intentional per-site difference.
44
45 ## Done when
46
47 - `project.github` is schema-validated and preserved by post normalization.
48 - `/projects` lists only published project introductions and provides both the
49 introduction and GitHub destinations.
50 - `Projects` appears in the primary navigation.
51 - Existing Highlights, Archive, and post rendering continue to build.
52 - The shared capability is build-verified in both xianxu.dev and 42shots without
53 disturbing 42shots's intentional navigation or content differences.
54 - Published posts are annotated separately through the repo's `xx-fix`
55 editorial protocol; choosing which projects to feature is not silently folded
56 into the engine change.
57
58 ## Estimate
59
60 `estimate
    61	model: estimate-logic-v3.1
    62	familiarity: 1.0
    63	item: issue-spec design=0.20 impl=0.08
    64	item: typed-data-prototype design=0.20 impl=0.48
    65	item: cross-repo-refactor-small design=0.30 impl=0.60
    66	item: cross-cutting-refactor design=0.15 impl=0.30
    67	item: milestone-review design=0.00 impl=0.20
    68	design-buffer: 0.15
    69	total: 2.64
    70	`
71
72 _Produced via `brain/data/life/42shots/velocity/estimate-logic-v3.1.md` against `baseline-v3.1.md`. Method A only._
73
74 ## Plan
75
76 - [x] Extend and verify the typed post pipeline for optional project metadata.
77 - [x] Reuse the blog list to render project introductions with contextual GitHub links.
78 - [x] Add the Projects page and navigation entry, then build-verify the site.
79
80 ## Log
81
82 ### 2026-07-14
83
84 - Approved direction: projects remain blog posts; `project.github` marks the one
85 canonical introduction for an open-source project. `ARCH-DRY` rules out a
86 parallel content collection, `ARCH-PURE` keeps selection as a simple predicate
87 over normalized posts, and `ARCH-PURPOSE` requires the GitHub destination to
88 survive schema → normalization → page rendering rather than exist as inert
89 frontmatter.
90 - Implemented the optional nested schema and normalized `Post` field, reused the
91 shared list with an opt-in GitHub link, and added `/projects` plus personal-site
92 navigation. Mirrored the shared engine, page, and test surface to 42shots
93 (`ARCH-DRY`, `ARCH-PURPOSE`).
94 - TDD evidence: invalid `project.github` failed Astro content validation; the
95 corrected URL passed content synchronization. The committed process-level test
?? src/data/post/parley.md
fixtures-cleaned

codex

```verdict
verdict: REWORK
confidence: high
```

The feature behavior matches most of the issue: typed metadata flows through normalization, published project posts remain newest-first, the shared renderer adds contextual GitHub links, and the process test passes. Two boundary blockers remain: the test can overwrite and delete pre-existing files, and the plan incorrectly classifies normalization as PURE. Documentation and assertion gaps should also be addressed before re-review.

## 1. Strengths

- [projects.astro](/Users/xianxu/workspace/xianxu.dev/src/pages/projects.astro:8) correctly reuses `fetchPosts()`, preserving its published-only, newest-first contract before filtering project posts.
- [ListItem.astro](/Users/xianxu/workspace/xianxu.dev/src/components/blog/ListItem.astro:112) keeps project-link behavior opt-in and supplies an accessible label plus safe external-link attributes.
- [blog.ts](/Users/xianxu/workspace/xianxu.dev/src/utils/blog.ts:58) carries the schema-validated value through the existing normalization boundary without introducing a parallel model.
- The process-level test completed successfully and its fixtures were removed afterward. `git diff --check` also passed.

## 2. Critical findings

- [test-projects-page.sh](/Users/xianxu/workspace/xianxu.dev/scripts/test-projects-page.sh:5): The test writes to three fixed paths unconditionally, then deletes them in its exit trap. If any path already exists, running the test destroys repository content. Fix by refusing to start when any target exists, or use a uniquely named temporary fixture directory/files and derive the expected permalink. Preserve pre-existing state under all exit paths.

- [plan](/Users/xianxu/workspace/xianxu.dev/workshop/plans/000002-open-source-projects-tab-plan.md:15): **ARCH-PURE** contradiction. “Normalized `Post`” is classified as a PURE entity, but its implementation calls Astro `render(post)` and is verified only through content synchronization/static builds. It is an integration boundary, not a pure entity. Reclassify normalization as INTEGRATION and describe the pure data/schema declarations separately. Per the supplied core-concepts contract, this requires a plan revision.

## 3. Important findings

- [test-projects-page.sh](/Users/xianxu/workspace/xianxu.dev/scripts/test-projects-page.sh:58): The test does not assert the ordinary introduction permalink, despite the plan explicitly claiming that coverage. It also checks `target` and `rel` anywhere in the page rather than on the fixture’s GitHub anchor, and does not pin newest-first ordering. Assert the complete relevant anchor markup or parse the HTML, and add a second published project fixture to verify ordering.

- `atlas/` has no change in the review window for the new `project` metadata, `/projects` route, or contextual-rendering flow. Add the new surface to the appropriate atlas map and ensure `atlas/index.md` links it.

- `README.md` has no change documenting the new author-facing `project.github` frontmatter key or Projects surface. The docs gate explicitly includes config keys; add concise authoring/usage documentation.

## 4. Minor findings

- [issue log](/Users/xianxu/workspace/xianxu.dev/workshop/issues/000002-open-source-projects-tab.md:84) still says “the one canonical introduction,” contradicting the current Spec’s allowance for multiple posts per repository.

## 5. Test coverage notes

The executed `./scripts/test-projects-page.sh .` passed and verified project inclusion, non-project/draft exclusion, GitHub URL rendering, and suppression of that URL on Highlights. The main production path is therefore exercised, but the destructive fixture handling must be fixed and the introduction-link, attribute association, and ordering assertions strengthened.

## 6. Architectural notes for upcoming work

- **ARCH-DRY — pass:** schema metadata, normalized data, and the existing shared list remain the single implementation path; no parallel project collection or renderer was introduced.
- **ARCH-PURE — flag:** the plan misclassifies Astro-backed normalization as pure. The runtime implementation itself keeps selection simple, but the architecture record must reflect the IO boundary honestly.
- **ARCH-PURPOSE — pass:** the metadata is enforced by schema validation and reaches the rendered Projects consumer; published selection, ordinary post links, and direct GitHub destinations are implemented. No shadow consumer in this repository restates project membership separately.

## 7. Plan revision recommendations

Append a `## Revisions` entry recording:

- Reclassification of normalized-post construction from PURE to INTEGRATION because it invokes Astro rendering.
- Safe, collision-proof temporary-fixture handling.
- Expanded build assertions for the introduction permalink, anchor-specific attributes, and newest-first ordering.
- Atlas and README updates for the new metadata and route.

Also reconcile remaining “canonical/one introduction” language in the plan and issue Log with the Spec’s explicit multiple-posts-per-repository rule.
tokens used
41,525

```verdict
verdict: REWORK
confidence: high
```

The feature behavior matches most of the issue: typed metadata flows through normalization, published project posts remain newest-first, the shared renderer adds contextual GitHub links, and the process test passes. Two boundary blockers remain: the test can overwrite and delete pre-existing files, and the plan incorrectly classifies normalization as PURE. Documentation and assertion gaps should also be addressed before re-review.

## 1. Strengths

- [projects.astro](/Users/xianxu/workspace/xianxu.dev/src/pages/projects.astro:8) correctly reuses `fetchPosts()`, preserving its published-only, newest-first contract before filtering project posts.
- [ListItem.astro](/Users/xianxu/workspace/xianxu.dev/src/components/blog/ListItem.astro:112) keeps project-link behavior opt-in and supplies an accessible label plus safe external-link attributes.
- [blog.ts](/Users/xianxu/workspace/xianxu.dev/src/utils/blog.ts:58) carries the schema-validated value through the existing normalization boundary without introducing a parallel model.
- The process-level test completed successfully and its fixtures were removed afterward. `git diff --check` also passed.

## 2. Critical findings

- [test-projects-page.sh](/Users/xianxu/workspace/xianxu.dev/scripts/test-projects-page.sh:5): The test writes to three fixed paths unconditionally, then deletes them in its exit trap. If any path already exists, running the test destroys repository content. Fix by refusing to start when any target exists, or use a uniquely named temporary fixture directory/files and derive the expected permalink. Preserve pre-existing state under all exit paths.

- [plan](/Users/xianxu/workspace/xianxu.dev/workshop/plans/000002-open-source-projects-tab-plan.md:15): **ARCH-PURE** contradiction. “Normalized `Post`” is classified as a PURE entity, but its implementation calls Astro `render(post)` and is verified only through content synchronization/static builds. It is an integration boundary, not a pure entity. Reclassify normalization as INTEGRATION and describe the pure data/schema declarations separately. Per the supplied core-concepts contract, this requires a plan revision.

## 3. Important findings

- [test-projects-page.sh](/Users/xianxu/workspace/xianxu.dev/scripts/test-projects-page.sh:58): The test does not assert the ordinary introduction permalink, despite the plan explicitly claiming that coverage. It also checks `target` and `rel` anywhere in the page rather than on the fixture’s GitHub anchor, and does not pin newest-first ordering. Assert the complete relevant anchor markup or parse the HTML, and add a second published project fixture to verify ordering.

- `atlas/` has no change in the review window for the new `project` metadata, `/projects` route, or contextual-rendering flow. Add the new surface to the appropriate atlas map and ensure `atlas/index.md` links it.

- `README.md` has no change documenting the new author-facing `project.github` frontmatter key or Projects surface. The docs gate explicitly includes config keys; add concise authoring/usage documentation.

## 4. Minor findings

- [issue log](/Users/xianxu/workspace/xianxu.dev/workshop/issues/000002-open-source-projects-tab.md:84) still says “the one canonical introduction,” contradicting the current Spec’s allowance for multiple posts per repository.

## 5. Test coverage notes

The executed `./scripts/test-projects-page.sh .` passed and verified project inclusion, non-project/draft exclusion, GitHub URL rendering, and suppression of that URL on Highlights. The main production path is therefore exercised, but the destructive fixture handling must be fixed and the introduction-link, attribute association, and ordering assertions strengthened.

## 6. Architectural notes for upcoming work

- **ARCH-DRY — pass:** schema metadata, normalized data, and the existing shared list remain the single implementation path; no parallel project collection or renderer was introduced.
- **ARCH-PURE — flag:** the plan misclassifies Astro-backed normalization as pure. The runtime implementation itself keeps selection simple, but the architecture record must reflect the IO boundary honestly.
- **ARCH-PURPOSE — pass:** the metadata is enforced by schema validation and reaches the rendered Projects consumer; published selection, ordinary post links, and direct GitHub destinations are implemented. No shadow consumer in this repository restates project membership separately.

## 7. Plan revision recommendations

Append a `## Revisions` entry recording:

- Reclassification of normalized-post construction from PURE to INTEGRATION because it invokes Astro rendering.
- Safe, collision-proof temporary-fixture handling.
- Expanded build assertions for the introduction permalink, anchor-specific attributes, and newest-first ordering.
- Atlas and README updates for the new metadata and route.

Also reconcile remaining “canonical/one introduction” language in the plan and issue Log with the Spec’s explicit multiple-posts-per-repository rule.

---

## Re-review — 2026-07-14T14:19:08-07:00 (SHIP)

| field | value |
|-------|-------|
| issue | 2 — Add open-source projects tab |
| repo | xianxu.dev |
| issue file | workshop/issues/000002-open-source-projects-tab.md |
| boundary | whole-issue close |
| milestone | — |
| window | 8e552f52728ad6c9c4e8b04b6891f230f6e8685f..HEAD |
| command | sdlc close --issue 2 |
| reviewer | codex |
| timestamp | 2026-07-14T14:19:08-07:00 |
| verdict | SHIP |

## Review

Reading additional input from stdin...
OpenAI Codex v0.144.4
--------
workdir: /Users/xianxu/workspace/xianxu.dev
model: gpt-5.6-sol
provider: openai
approval: never
sandbox: workspace-write [workdir, /tmp, $TMPDIR, /tmp] (network access enabled)
reasoning effort: none
reasoning summaries: none
session id: 019f627d-ef7c-74e2-b10a-6fd4b44fc955
--------
user
# Code review — the one SDLC boundary review

You are conducting a fresh-context code review at a development boundary —
whole-issue close — in the **xianxu.dev** repository.

- repository: xianxu.dev   (root: /Users/xianxu/workspace/xianxu.dev)
- issue:      xianxu.dev#2   (file: workshop/issues/000002-open-source-projects-tab.md)
- window:     Base: 8e552f52728ad6c9c4e8b04b6891f230f6e8685f   Head: HEAD

Review the **xianxu.dev** repo and its tracker — the ariadne base-layer repo itself (changes here propagate to dependent repos). Do not assume any
other repository or apply another repo's conventions.

You have no prior session context — that is the anti-collusion property. Verify
behavior against the issue's documented Spec/Plan and the code itself; do NOT
take the implementor's word in commit messages or docs at face value. Tools are
read-only: report findings precisely; the main agent (which has session context)
applies the fixes, commits, and re-runs.

Read the diff against the issue's Spec + Plan, then work the checklist below.
Categorize every finding by severity — not everything is Critical; a nitpick
marked Critical is noise.

  Critical (must fix before crossing the boundary)
    - correctness bugs; crashes / panics on unexpected input
    - behavior drift from stated contracts (for ports of existing code where
      byte-faithfulness was promised, diff against the source)
    - silent error swallowing where the source raised
  Important (fix before the boundary if cheap)
    - API design of newly-introduced internal packages (downstream work will
      consume them; is the surface stable?)
    - missing test coverage that would catch the kind of bug shipped
    - inconsistent error handling across the diff
  Minor (note for future)
    - style nits, naming, comment density; performance only if hot-path

## Review checklist

Code quality
  - Clean separation of concerns; edge cases handled (empty / nil / unexpected).
  - Proper error handling — no silent swallowing where the source raised.
  - No duplicated logic / copy-paste that should be a shared helper.

Testing
  - Tests pin real logic, not mocks reasserting the implementation.
  - The kind of bug this diff could ship is covered.
  - PURE entities tested without IO; INTEGRATION via injected fakes (see below).

Requirements traceability
  - Every Plan checklist item this boundary claims is actually delivered.
  - Implementation matches the Spec; no undeclared scope creep.
  - Breaking changes documented.

Production readiness
  - Migration / backward-compatibility considered where state or formats change.
  - Docs / atlas updated for new surface (see the Docs update gate).

## Core concepts cross-check (if the plan has a Core concepts table)

The plan should list entities in a greppable table — name, kind
(PURE/INTEGRATION), file location, status (new/modified/deleted). For each row:
  - Verify the entity exists at the stated path (grep the diff or filesystem).
  - PURE: tests run without IO (no exec, net, mutable fs). If tests need mocks
    to run, it isn't really PURE — flag Critical and recommend promoting it to
    INTEGRATION.
  - INTEGRATION: injected into pure callers, not invoked directly from business
    logic.
  - "modified" / "deleted": the diff shows the expected change/removal at the
    stated location.
Any contradiction between table and code = Critical finding, plus a plan-revision
recommendation (a "## Revisions" entry so the plan stops claiming what the code
doesn't deliver).

## Docs update gate (atlas + README, per AGENTS.md §8)

The boundary should update user-facing docs for any new surface introduced:

  - **atlas/** — new architectural surface, flow, or terminology. Scan the diff
    for new entity types, subcommands, conventions, file-tree locations. Any
    present without corresponding atlas/ changes in the same range = Important
    finding ("atlas update appears missing for <surface>").
  - **README.md** — new user-facing surface a reader runs or types: subcommands,
    flags, keybindings, config keys, install/usage steps. If the diff adds or
    changes such surface and README.md is not updated in the same range =
    Important finding ("README update appears missing for <surface>"). This is the
    class of gap that used to surface only at the merge-time `specs` judge (#142);
    catch it here, at the earliest gate, before the close verdict is recorded.

## Architecture (the at-review backstop — these matter most long-term)

Work through each of ARCH-DRY, ARCH-PURE, ARCH-PURPOSE explicitly, applying its at-review lens. The
full principle definitions are delivered in the ARCHITECTURE PRINCIPLES block
right after this prompt — for EACH marker, state pass or flag, and cite the
marker (e.g. ARCH-DRY) in any finding. Architecture is where review has the
least training signal and the longest-delayed payoff, so be deliberate here, not
holistic.

## Verdict + output

Begin your response with this fenced verdict block — the machine-read handoff:

```verdict
verdict: <SHIP | FIX-THEN-SHIP | REWORK>
confidence: <high | medium | low>
```

  SHIP           ready; ship it
  FIX-THEN-SHIP  ship after addressing the findings (non-blocking at the gate)
  REWORK         blocking; needs rework before shipping — fix + re-run

The fenced ```` ```verdict ```` block above is the **authoritative machine-read
handoff** — emit it as the first thing in your response. (A prose
`VERDICT: <TOKEN>` first line still satisfies the legacy contract as a fallback,
but the block is what the binary trusts.)

After the verdict block: a 1-paragraph summary — what worked, what blocks SHIP if
it isn't — followed by:
  1. Strengths: 2-5 specific things done well (file:line where useful). Affirm
     validated approaches so the operator knows what's confirmed-good ground.
     Empty acceptable for trivial boundaries.
  2. Critical findings (file:line + fix sketch); empty if none.
  3. Important findings (same format).
  4. Minor findings (terse one-liners).
  5. Test coverage notes.
  6. Architectural notes for upcoming work.
  7. Plan revision recommendations: specific "## Revisions" entries the plan
     needs (empty if the plan still matches the code).


ARCHITECTURE PRINCIPLES — work through each of the 3 entries below explicitly, applying its `at-review` lens; cite the marker (e.g. ARCH-DRY) in any finding.

# Architecture principles (ARCH-*)

Injected architectural taste — the structural decisions whose payoff (or cost)
shows up many turns, often months, down the road. Agents are strong at local
tactics and weak here, so these are checked **at-plan** (when the design is being
made — highest leverage) and **at-review** (backstop, on the diff). Cite the
marker (e.g. `ARCH-DRY`) in plans, `## Log` entries, and review findings.

This file is the single source; it is embedded into the planning, plan-quality,
and code-review prompts. The human narrative lives in AGENTS.md "Core Design
Principles"; this is its machine-delivered companion.

## ARCH-DRY — Don't Repeat Yourself

- **principle:** Reuse before adding. One source of truth per fact/behavior; no
  duplicated logic, copy-pasted blocks, or parallel functions that should be one
  shared helper.
- **at-plan:** Flag a plan that re-implements something the codebase already has,
  or that will obviously duplicate logic across the new files instead of
  extracting a shared helper. Name the existing thing it should reuse.
- **at-review:** Flag duplicated logic / copy-pasted blocks / near-identical
  functions in the diff; point at the consolidation (file:line + the shared
  helper they should become).

## ARCH-PURE — Pure core, thin IO shell

- **principle:** The majority of code is pure functions (deterministic, no side
  effects); a thin "glue" layer at the boundary touches IO/UI/network/clock. Pure
  functions are unit-tested directly; the glue is kept small and injected.
- **at-plan:** Flag a design that buries business logic inside IO/handlers, or
  that will only be testable with heavy mocks (a sign logic isn't separated from
  IO). The plan should name what's pure vs the thin IO seam.
- **at-review:** Flag business logic mixed with IO in the diff; logic that should
  be a pure function injected into a thin caller. If a test needs mocks to run a
  "pure" entity, it isn't pure — recommend extracting the IO to the boundary.

## ARCH-PURPOSE — Serve the issue's actual purpose

- **principle:** Deliver the issue's stated purpose, not the easy subset of it. A
  single-source / "compiled to consumers" change is not done until **every
  consumer derives** from the source — the source is *enforced*, not just
  documentation a surface happens to restate; a hand-maintained restatement of the
  model is a deferred consumer, not a finished one. "Follow-up" is for separable
  extensions, never for the thing that is the point. This is the *opposite axis*
  from Simplicity-First/YAGNI: not "build for an imagined future," but "don't
  **under**-deliver the purpose you already committed to."
- **at-plan:** Flag a plan whose scope is a strict subset of the issue's stated
  goal / Done-when where the part deferred as "follow-up" *is* the purpose (e.g.
  wires one consumer + enforcement but leaves the consumers that motivated the
  issue as documentation that doesn't derive). Ask: does the plan fulfill the
  purpose, or just the cheap win? Name the deferred purpose.
- **at-review:** Does the diff *fulfill* the purpose or settle for the easy win?
  For a single-source change, run the **shadow-sweep** — enumerate the consumers,
  confirm each derives from the source, flag any remaining hand-maintained
  restatement of the model. A "follow-up" that is actually the deferred point of
  the issue is a finding, not a deferral.


OUTPUT CONTRACT (machine-read — do not deviate). LEAD your response with the
fenced ```verdict block shown above — that is the authoritative handoff the binary
reads (its `verdict:` value is one of the listed tokens). Everything after the block
is advisory: a non-blocking verdict WITH findings still PASSES the gate. A bare
`VERDICT: <TOKEN>` line is accepted only as a FALLBACK when the block is absent.

Diff:
diff --git a/README.md b/README.md
index 767bc9f..688a409 100644
--- a/README.md
+++ b/README.md
@@ -1,5 +1,18 @@
 # 🚀 AstroWind

+## Project introductions
+
+Published blog posts can appear on `/projects` by adding project metadata to
+their frontmatter:
+
+```yaml
+project:
+  github: https://github.com/xianxu/example
+```
+
+The post remains an ordinary blog post. The Projects page adds a direct GitHub
+link; installation and usage details continue to live in the repository README.
+
 <img src="https://raw.githubusercontent.com/arthelokyo/.github/main/resources/astrowind/lighthouse-score.png" align="right"
      alt="AstroWind Lighthouse Score" width="100" height="358">

diff --git a/atlas/blog-surfaces.md b/atlas/blog-surfaces.md
new file mode 100644
index 0000000..4c196ee
--- /dev/null
+++ b/atlas/blog-surfaces.md
@@ -0,0 +1,17 @@
+# Blog surfaces
+
+Posts are authored under `src/data/post/` and normalized through
+`src/utils/blog.ts` for every listing and post route.
+
+`/projects` is a discovery view over published posts carrying this optional
+frontmatter:
+
+```yaml
+project:
+  github: https://github.com/owner/repository
+```
+
+The nested object both marks membership and supplies the direct repository link.
+`src/pages/projects.astro` selects those normalized posts, while the shared blog
+list renders the GitHub link only when the Projects page opts into that context.
+Ordinary blog lists therefore keep their existing presentation.
diff --git a/atlas/index.md b/atlas/index.md
new file mode 100644
index 0000000..5b23c82
--- /dev/null
+++ b/atlas/index.md
@@ -0,0 +1,3 @@
+# Atlas
+
+- [Blog surfaces](blog-surfaces.md) — discovery routes and project-post metadata.
diff --git a/scripts/test-projects-page.sh b/scripts/test-projects-page.sh
new file mode 100755
index 0000000..3a62da4
--- /dev/null
+++ b/scripts/test-projects-page.sh
@@ -0,0 +1,98 @@
+#!/usr/bin/env bash
+set -euo pipefail
+
+repo=${1:-.}
+posts="$repo/src/data/post"
+published="$posts/project-render-published-test.md"
+older="$posts/project-render-older-test.md"
+nonproject="$posts/project-render-nonproject-test.md"
+draft="$posts/project-render-draft-test.md"
+
+for fixture in "$published" "$older" "$nonproject" "$draft"; do
+  if [[ -e "$fixture" ]]; then
+    echo "Refusing to overwrite existing fixture path: $fixture" >&2
+    exit 1
+  fi
+done
+
+cleanup() {
+  rm -f "$published" "$older" "$nonproject" "$draft"
+}
+trap cleanup EXIT
+
+cat >"$published" <<'EOF'
+---
+title: Project render published test
+publishDate: 2030-01-03
+published: true
+highlight: true
+project:
+  github: https://github.com/xianxu/project-render-test
+---
+
+Temporary project rendering fixture.
+EOF
+
+cat >"$older" <<'EOF'
+---
+title: Project render older test
+publishDate: 2030-01-02
+published: true
+project:
+  github: https://github.com/xianxu/project-render-older-test
+---
+
+Temporary older project rendering fixture.
+EOF
+
+cat >"$nonproject" <<'EOF'
+---
+title: Project render nonproject test
+publishDate: 2030-01-01
+published: true
+---
+
+Temporary non-project rendering fixture.
+EOF
+
+cat >"$draft" <<'EOF'
+---
+title: Project render draft test
+publishDate: 2029-12-31
+published: false
+project:
+  github: https://github.com/xianxu/project-render-draft-test
+---
+
+Temporary draft project rendering fixture.
+EOF
+
+(
+  cd "$repo"
+  npm run build
+)
+
+projects="$repo/dist/projects/index.html"
+highlights="$repo/dist/highlights/index.html"
+
+rg -q 'Project render published test' "$projects"
+rg -q 'href="/2030/01/project-render-published-test"' "$projects"
+rg -q 'href="https://github.com/xianxu/project-render-test" aria-label="View Project render published test on GitHub" rel="noopener noreferrer" target="_blank"' "$projects"
+
+new_offset=$(rg --byte-offset -o 'Project render published test' "$projects" | head -n 1 | cut -d: -f1)
+older_offset=$(rg --byte-offset -o 'Project render older test' "$projects" | head -n 1 | cut -d: -f1)
+if ((new_offset >= older_offset)); then
+  echo "Projects are not ordered newest first" >&2
+  exit 1
+fi
+
+if rg -q 'Project render nonproject test|Project render draft test|project-render-draft-test' "$projects"; then
+  echo "Projects page included a non-project or draft fixture" >&2
+  exit 1
+fi
+
+rg -q 'Project render published test' "$highlights"
+if rg -q 'https://github.com/xianxu/project-render-test' "$highlights"; then
+  echo "Ordinary blog list exposed a project-only GitHub link" >&2
+  exit 1
+fi
diff --git a/src/components/blog/List.astro b/src/components/blog/List.astro
index 6a80ae3..8d5e03b 100644
--- a/src/components/blog/List.astro
+++ b/src/components/blog/List.astro
@@ -4,16 +4,17 @@ import type { Post } from '~/types';

 export interface Props {
   posts: Array<Post>;
+  showProjectLink?: boolean;
 }

-const { posts } = Astro.props;
+const { posts, showProjectLink = false } = Astro.props;
 ---

 <ul>
   {
     posts.map((post) => (
       <li class="mb-12 md:mb-20">
-        <Item post={post} />
+        <Item post={post} showProjectLink={showProjectLink} />
       </li>
     ))
   }
diff --git a/src/components/blog/ListItem.astro b/src/components/blog/ListItem.astro
index 6a416d6..d922ad5 100644
--- a/src/components/blog/ListItem.astro
+++ b/src/components/blog/ListItem.astro
@@ -13,9 +13,10 @@ import { getFormattedDate } from '~/utils/utils';

 export interface Props {
   post: Post;
+  showProjectLink?: boolean;
 }

-const { post } = Astro.props;
+const { post, showProjectLink = false } = Astro.props;
 const image = (await findImage(post.image)) as ImageMetadata | undefined;

 const link = APP_BLOG?.post?.isEnabled ? getPermalink(post.permalink, 'post') : '';
@@ -107,6 +108,20 @@ const link = APP_BLOG?.post?.isEnabled ? getPermalink(post.permalink, 'post') :
     </header>

     {post.excerpt && <p class="flex-grow text-muted dark:text-slate-400 text-lg">{post.excerpt}</p>}
+    {
+      showProjectLink && post.project && (
+        <a
+          class="inline-flex items-center gap-1.5 mt-4 text-sm font-medium hover:underline"
+          href={post.project.github}
+          target="_blank"
+          rel="noopener noreferrer"
+          aria-label={`View ${post.title} on GitHub`}
+        >
+          <Icon name="tabler:brand-github" class="w-4 h-4" />
+          GitHub
+        </a>
+      )
+    }
     {
       post.tags && Array.isArray(post.tags) ? (
         <footer class="mt-5">
diff --git a/src/content/config.ts b/src/content/config.ts
index a5f702c..7477d96 100644
--- a/src/content/config.ts
+++ b/src/content/config.ts
@@ -53,6 +53,7 @@ const postCollection = defineCollection({
     updateDate: z.date().optional(),
     published: z.boolean().optional(),
     highlight: z.boolean().optional(),
+    project: z.object({ github: z.string().url() }).optional(),
     hidden: z.boolean().optional(),
     comments: z.boolean().optional(),

diff --git a/src/navigation.ts b/src/navigation.ts
index c0443de..4f8fc15 100644
--- a/src/navigation.ts
+++ b/src/navigation.ts
@@ -3,6 +3,7 @@ import { getBlogPermalink, getPermalink, getAsset } from './utils/permalinks';
 export const headerData = {
   links: [
     { text: 'Highlights', href: getPermalink('/highlights') },
+    { text: 'Projects', href: getPermalink('/projects') },
     { text: 'Archive', href: getBlogPermalink() },
     { text: 'Tags', href: getPermalink('/tags') },
     { text: 'About', href: getPermalink('/about') },
diff --git a/src/pages/projects.astro b/src/pages/projects.astro
new file mode 100644
index 0000000..bee3d4e
--- /dev/null
+++ b/src/pages/projects.astro
@@ -0,0 +1,28 @@
+---
+import Layout from '~/layouts/PageLayout.astro';
+import List from '~/components/blog/List.astro';
+import { fetchPosts } from '~/utils/blog';
+
+export const prerender = true;
+
+const posts = (await fetchPosts()).filter((post) => post.project !== undefined);
+
+const metadata = {
+  title: 'Projects',
+};
+---
+
+<Layout metadata={metadata}>
+  <section class="px-4 sm:px-6 py-12 sm:py-16 lg:py-20 mx-auto max-w-4xl">
+    <h1 class="text-3xl md:text-4xl font-bold leading-tighter tracking-tighter font-heading mb-3">Projects</h1>
+    <p class="text-muted dark:text-slate-400 mb-12">Open-source projects I work on, and the stories behind them.</p>
+
+    {
+      posts.length === 0 ? (
+        <p class="text-muted">No project introductions yet.</p>
+      ) : (
+        <List posts={posts} showProjectLink />
+      )
+    }
+  </section>
+</Layout>
diff --git a/src/types.d.ts b/src/types.d.ts
index 0231642..4480d4f 100644
--- a/src/types.d.ts
+++ b/src/types.d.ts
@@ -39,6 +39,9 @@ export interface Post {
   /**  */
   highlight?: boolean;

+  /** Open-source project metadata when this post belongs on the Projects page. */
+  project?: ProjectMetadata;
+
   /**  */
   hidden?: boolean;

@@ -53,6 +56,10 @@ export interface Post {
   readingTime?: number;
 }

+export interface ProjectMetadata {
+  github: string;
+}
+
 export interface Taxonomy {
   slug: string;
   title: string;
diff --git a/src/utils/blog.ts b/src/utils/blog.ts
index 2269710..c1d78c0 100644
--- a/src/utils/blog.ts
+++ b/src/utils/blog.ts
@@ -55,6 +55,7 @@ const getNormalizedPost = async (post: CollectionEntry<'post'>): Promise<Post> =
     author,
     published = false,
     highlight = false,
+    project,
     hidden = false,
     comments = true,
     metadata = {},
@@ -94,6 +95,7 @@ const getNormalizedPost = async (post: CollectionEntry<'post'>): Promise<Post> =

     published: published,
     highlight: highlight,
+    project: project,
     hidden: hidden,
     comments: comments,

diff --git a/workshop/lessons.md b/workshop/lessons.md
index e69de29..3e65b7f 100644
--- a/workshop/lessons.md
+++ b/workshop/lessons.md
@@ -0,0 +1,8 @@
+# Review lessons
+
+- Test helpers that create fixed-path fixtures must refuse collisions before
+  registering cleanup; otherwise a passing test can overwrite and delete real
+  repository content.
+- Classify code that invokes framework rendering or filesystem-backed content
+  loading as an integration boundary, even when its output transformation is
+  deterministic.
diff --git a/workshop/plans/000002-open-source-projects-tab-close-review.md b/workshop/plans/000002-open-source-projects-tab-close-review.md
new file mode 100644
index 0000000..2563401
--- /dev/null
+++ b/workshop/plans/000002-open-source-projects-tab-close-review.md
@@ -0,0 +1,2018 @@
+# Boundary Review — xianxu.dev#2 (whole-issue close)
+
+| field      | value                                              |
+| ---------- | -------------------------------------------------- |
+| issue      | 2 — Add open-source projects tab                   |
+| repo       | xianxu.dev                                         |
+| issue file | workshop/issues/000002-open-source-projects-tab.md |
+| boundary   | whole-issue close                                  |
+| milestone  | —                                                  |
+| window     | 8e552f52728ad6c9c4e8b04b6891f230f6e8685f..HEAD     |
+| command    | sdlc close --issue 2                               |
+| reviewer   | codex                                              |
+| timestamp  | 2026-07-14T14:12:58-07:00                          |
+| verdict    | REWORK                                             |
+
+## Review
+
+Reading additional input from stdin...
+OpenAI Codex v0.144.4
+
+---
+
+workdir: /Users/xianxu/workspace/xianxu.dev
+model: gpt-5.6-sol
+provider: openai
+approval: never
+sandbox: workspace-write [workdir, /tmp, $TMPDIR, /tmp] (network access enabled)
+reasoning effort: none
+reasoning summaries: none
+session id: 019f6278-55da-7fb0-8dab-352514471754
+
+---
+
+user
+
+# Code review — the one SDLC boundary review
+
+You are conducting a fresh-context code review at a development boundary —
+whole-issue close — in the **xianxu.dev** repository.
+
+- repository: xianxu.dev (root: /Users/xianxu/workspace/xianxu.dev)
+- issue: xianxu.dev#2 (file: workshop/issues/000002-open-source-projects-tab.md)
+- window: Base: 8e552f52728ad6c9c4e8b04b6891f230f6e8685f Head: HEAD
+
+Review the **xianxu.dev** repo and its tracker — the ariadne base-layer repo itself (changes here propagate to dependent repos). Do not assume any
+other repository or apply another repo's conventions.
+
+You have no prior session context — that is the anti-collusion property. Verify
+behavior against the issue's documented Spec/Plan and the code itself; do NOT
+take the implementor's word in commit messages or docs at face value. Tools are
+read-only: report findings precisely; the main agent (which has session context)
+applies the fixes, commits, and re-runs.
+
+Read the diff against the issue's Spec + Plan, then work the checklist below.
+Categorize every finding by severity — not everything is Critical; a nitpick
+marked Critical is noise.
+
+Critical (must fix before crossing the boundary) - correctness bugs; crashes / panics on unexpected input - behavior drift from stated contracts (for ports of existing code where
+byte-faithfulness was promised, diff against the source) - silent error swallowing where the source raised
+Important (fix before the boundary if cheap) - API design of newly-introduced internal packages (downstream work will
+consume them; is the surface stable?) - missing test coverage that would catch the kind of bug shipped - inconsistent error handling across the diff
+Minor (note for future) - style nits, naming, comment density; performance only if hot-path
+
+## Review checklist
+
+Code quality
+
+- Clean separation of concerns; edge cases handled (empty / nil / unexpected).
+- Proper error handling — no silent swallowing where the source raised.
+- No duplicated logic / copy-paste that should be a shared helper.
+
+Testing
+
+- Tests pin real logic, not mocks reasserting the implementation.
+- The kind of bug this diff could ship is covered.
+- PURE entities tested without IO; INTEGRATION via injected fakes (see below).
+
+Requirements traceability
+
+- Every Plan checklist item this boundary claims is actually delivered.
+- Implementation matches the Spec; no undeclared scope creep.
+- Breaking changes documented.
+
+Production readiness
+
+- Migration / backward-compatibility considered where state or formats change.
+- Docs / atlas updated for new surface (see the Docs update gate).
+
+## Core concepts cross-check (if the plan has a Core concepts table)
+
+The plan should list entities in a greppable table — name, kind
+(PURE/INTEGRATION), file location, status (new/modified/deleted). For each row:
+
+- Verify the entity exists at the stated path (grep the diff or filesystem).
+- PURE: tests run without IO (no exec, net, mutable fs). If tests need mocks
+  to run, it isn't really PURE — flag Critical and recommend promoting it to
+  INTEGRATION.
+- INTEGRATION: injected into pure callers, not invoked directly from business
+  logic.
+- "modified" / "deleted": the diff shows the expected change/removal at the
+  stated location.
+  Any contradiction between table and code = Critical finding, plus a plan-revision
+  recommendation (a "## Revisions" entry so the plan stops claiming what the code
+  doesn't deliver).
+
+## Docs update gate (atlas + README, per AGENTS.md §8)
+
+The boundary should update user-facing docs for any new surface introduced:
+
+- **atlas/** — new architectural surface, flow, or terminology. Scan the diff
+  for new entity types, subcommands, conventions, file-tree locations. Any
+  present without corresponding atlas/ changes in the same range = Important
+  finding ("atlas update appears missing for <surface>").
+- **README.md** — new user-facing surface a reader runs or types: subcommands,
+  flags, keybindings, config keys, install/usage steps. If the diff adds or
+  changes such surface and README.md is not updated in the same range =
+  Important finding ("README update appears missing for <surface>"). This is the
+  class of gap that used to surface only at the merge-time `specs` judge (#142);
+  catch it here, at the earliest gate, before the close verdict is recorded.
+
+## Architecture (the at-review backstop — these matter most long-term)
+
+Work through each of ARCH-DRY, ARCH-PURE, ARCH-PURPOSE explicitly, applying its at-review lens. The
+full principle definitions are delivered in the ARCHITECTURE PRINCIPLES block
+right after this prompt — for EACH marker, state pass or flag, and cite the
+marker (e.g. ARCH-DRY) in any finding. Architecture is where review has the
+least training signal and the longest-delayed payoff, so be deliberate here, not
+holistic.
+
+## Verdict + output
+
+Begin your response with this fenced verdict block — the machine-read handoff:
+
+```verdict
+verdict: <SHIP | FIX-THEN-SHIP | REWORK>
+confidence: <high | medium | low>
+```
+
+SHIP ready; ship it
+FIX-THEN-SHIP ship after addressing the findings (non-blocking at the gate)
+REWORK blocking; needs rework before shipping — fix + re-run
+
+The fenced ` ```verdict ` block above is the **authoritative machine-read
+handoff** — emit it as the first thing in your response. (A prose
+`VERDICT: <TOKEN>` first line still satisfies the legacy contract as a fallback,
+but the block is what the binary trusts.)
+
+After the verdict block: a 1-paragraph summary — what worked, what blocks SHIP if
+it isn't — followed by:
+
+1. Strengths: 2-5 specific things done well (file:line where useful). Affirm
+   validated approaches so the operator knows what's confirmed-good ground.
+   Empty acceptable for trivial boundaries.
+2. Critical findings (file:line + fix sketch); empty if none.
+3. Important findings (same format).
+4. Minor findings (terse one-liners).
+5. Test coverage notes.
+6. Architectural notes for upcoming work.
+7. Plan revision recommendations: specific "## Revisions" entries the plan
+   needs (empty if the plan still matches the code).
+
+ARCHITECTURE PRINCIPLES — work through each of the 3 entries below explicitly, applying its `at-review` lens; cite the marker (e.g. ARCH-DRY) in any finding.
+
+# Architecture principles (ARCH-\*)
+
+Injected architectural taste — the structural decisions whose payoff (or cost)
+shows up many turns, often months, down the road. Agents are strong at local
+tactics and weak here, so these are checked **at-plan** (when the design is being
+made — highest leverage) and **at-review** (backstop, on the diff). Cite the
+marker (e.g. `ARCH-DRY`) in plans, `## Log` entries, and review findings.
+
+This file is the single source; it is embedded into the planning, plan-quality,
+and code-review prompts. The human narrative lives in AGENTS.md "Core Design
+Principles"; this is its machine-delivered companion.
+
+## ARCH-DRY — Don't Repeat Yourself
+
+- **principle:** Reuse before adding. One source of truth per fact/behavior; no
+  duplicated logic, copy-pasted blocks, or parallel functions that should be one
+  shared helper.
+- **at-plan:** Flag a plan that re-implements something the codebase already has,
+  or that will obviously duplicate logic across the new files instead of
+  extracting a shared helper. Name the existing thing it should reuse.
+- **at-review:** Flag duplicated logic / copy-pasted blocks / near-identical
+  functions in the diff; point at the consolidation (file:line + the shared
+  helper they should become).
+
+## ARCH-PURE — Pure core, thin IO shell
+
+- **principle:** The majority of code is pure functions (deterministic, no side
+  effects); a thin "glue" layer at the boundary touches IO/UI/network/clock. Pure
+  functions are unit-tested directly; the glue is kept small and injected.
+- **at-plan:** Flag a design that buries business logic inside IO/handlers, or
+  that will only be testable with heavy mocks (a sign logic isn't separated from
+  IO). The plan should name what's pure vs the thin IO seam.
+- **at-review:** Flag business logic mixed with IO in the diff; logic that should
+  be a pure function injected into a thin caller. If a test needs mocks to run a
+  "pure" entity, it isn't pure — recommend extracting the IO to the boundary.
+
+## ARCH-PURPOSE — Serve the issue's actual purpose
+
+- **principle:** Deliver the issue's stated purpose, not the easy subset of it. A
+  single-source / "compiled to consumers" change is not done until **every
+  consumer derives** from the source — the source is _enforced_, not just
+  documentation a surface happens to restate; a hand-maintained restatement of the
+  model is a deferred consumer, not a finished one. "Follow-up" is for separable
+  extensions, never for the thing that is the point. This is the _opposite axis_
+  from Simplicity-First/YAGNI: not "build for an imagined future," but "don't
+  **under**-deliver the purpose you already committed to."
+- **at-plan:** Flag a plan whose scope is a strict subset of the issue's stated
+  goal / Done-when where the part deferred as "follow-up" _is_ the purpose (e.g.
+  wires one consumer + enforcement but leaves the consumers that motivated the
+  issue as documentation that doesn't derive). Ask: does the plan fulfill the
+  purpose, or just the cheap win? Name the deferred purpose.
+- **at-review:** Does the diff _fulfill_ the purpose or settle for the easy win?
+  For a single-source change, run the **shadow-sweep** — enumerate the consumers,
+  confirm each derives from the source, flag any remaining hand-maintained
+  restatement of the model. A "follow-up" that is actually the deferred point of
+  the issue is a finding, not a deferral.
+
+OUTPUT CONTRACT (machine-read — do not deviate). LEAD your response with the
+fenced ```verdict block shown above — that is the authoritative handoff the binary
+reads (its `verdict:`value is one of the listed tokens). Everything after the block
+is advisory: a non-blocking verdict WITH findings still PASSES the gate. A bare`VERDICT: <TOKEN>` line is accepted only as a FALLBACK when the block is absent.
+
+Diff:
+diff --git a/scripts/test-projects-page.sh b/scripts/test-projects-page.sh
+new file mode 100755
+index 0000000..cfe7509
+--- /dev/null
++++ b/scripts/test-projects-page.sh
+@@ -0,0 +1,73 @@
++#!/usr/bin/env bash
++set -euo pipefail
+
+- +repo=${1:-.}
++posts="$repo/src/data/post"
+  +published="$posts/project-render-published-test.md"
++nonproject="$posts/project-render-nonproject-test.md"
+  +draft="$posts/project-render-draft-test.md"
+- +cleanup() {
+- rm -f "$published" "$nonproject" "$draft"
+  +}
+  +trap cleanup EXIT
+- +cat >"$published" <<'EOF'
+  +---
+  +title: Project render published test
+  +publishDate: 2030-01-03
+  +published: true
+  +highlight: true
+  +project:
+- github: https://github.com/xianxu/project-render-test
+  +---
+- +Temporary project rendering fixture.
+  +EOF
+- +cat >"$nonproject" <<'EOF'
+  +---
+  +title: Project render nonproject test
+  +publishDate: 2030-01-02
+  +published: true
+  +---
+- +Temporary non-project rendering fixture.
+  +EOF
+- +cat >"$draft" <<'EOF'
+  +---
+  +title: Project render draft test
+  +publishDate: 2030-01-01
+  +published: false
+  +project:
+- github: https://github.com/xianxu/project-render-draft-test
+  +---
+- +Temporary draft project rendering fixture.
+  +EOF
+- +(
+- cd "$repo"
+- npm run build
+  +)
+- +projects="$repo/dist/projects/index.html"
++highlights="$repo/dist/highlights/index.html"
+- +rg -q 'Project render published test' "$projects"
++rg -q 'https://github.com/xianxu/project-render-test' "$projects"
+  +rg -q 'aria-label="View Project render published test on GitHub"' "$projects"
++rg -q 'target="_blank"' "$projects"
+  +rg -q 'rel="noopener noreferrer"' "$projects"
+- +if rg -q 'Project render nonproject test|Project render draft test|project-render-draft-test' "$projects"; then
+- echo "Projects page included a non-project or draft fixture" >&2
+- exit 1
+  +fi
+- +rg -q 'Project render published test' "$highlights"
++if rg -q 'https://github.com/xianxu/project-render-test' "$highlights"; then
+- echo "Ordinary blog list exposed a project-only GitHub link" >&2
+- exit 1
+  +fi
+  diff --git a/src/components/blog/List.astro b/src/components/blog/List.astro
+  index 6a80ae3..8d5e03b 100644
+  --- a/src/components/blog/List.astro
+  +++ b/src/components/blog/List.astro
+  @@ -4,16 +4,17 @@ import type { Post } from '~/types';
+
+export interface Props {
+posts: Array<Post>;
+
+- showProjectLink?: boolean;
+  }
+
+-const { posts } = Astro.props;
++const { posts, showProjectLink = false } = Astro.props;
+
+---
+
+ <ul>
+   {
+     posts.map((post) => (
+       <li class="mb-12 md:mb-20">
+-        <Item post={post} />
++        <Item post={post} showProjectLink={showProjectLink} />
+       </li>
+     ))
+   }
+diff --git a/src/components/blog/ListItem.astro b/src/components/blog/ListItem.astro
+index 6a416d6..d922ad5 100644
+--- a/src/components/blog/ListItem.astro
++++ b/src/components/blog/ListItem.astro
+@@ -13,9 +13,10 @@ import { getFormattedDate } from '~/utils/utils';
+
+ export interface Props {
+   post: Post;
++  showProjectLink?: boolean;
+ }
+
+-const { post } = Astro.props;
++const { post, showProjectLink = false } = Astro.props;
+ const image = (await findImage(post.image)) as ImageMetadata | undefined;
+
+ const link = APP_BLOG?.post?.isEnabled ? getPermalink(post.permalink, 'post') : '';
+@@ -107,6 +108,20 @@ const link = APP_BLOG?.post?.isEnabled ? getPermalink(post.permalink, 'post') :
+     </header>
+
+     {post.excerpt && <p class="flex-grow text-muted dark:text-slate-400 text-lg">{post.excerpt}</p>}
++    {
++      showProjectLink && post.project && (
++        <a
++          class="inline-flex items-center gap-1.5 mt-4 text-sm font-medium hover:underline"
++          href={post.project.github}
++          target="_blank"
++          rel="noopener noreferrer"
++          aria-label={`View ${post.title} on GitHub`}
++        >
++          <Icon name="tabler:brand-github" class="w-4 h-4" />
++          GitHub
++        </a>
++      )
++    }
+     {
+       post.tags && Array.isArray(post.tags) ? (
+         <footer class="mt-5">
+diff --git a/src/content/config.ts b/src/content/config.ts
+index a5f702c..7477d96 100644
+--- a/src/content/config.ts
++++ b/src/content/config.ts
+@@ -53,6 +53,7 @@ const postCollection = defineCollection({
+     updateDate: z.date().optional(),
+     published: z.boolean().optional(),
+     highlight: z.boolean().optional(),
++    project: z.object({ github: z.string().url() }).optional(),
+     hidden: z.boolean().optional(),
+     comments: z.boolean().optional(),
+
+diff --git a/src/navigation.ts b/src/navigation.ts
+index c0443de..4f8fc15 100644
+--- a/src/navigation.ts
++++ b/src/navigation.ts
+@@ -3,6 +3,7 @@ import { getBlogPermalink, getPermalink, getAsset } from './utils/permalinks';
+ export const headerData = {
+   links: [
+     { text: 'Highlights', href: getPermalink('/highlights') },
++    { text: 'Projects', href: getPermalink('/projects') },
+     { text: 'Archive', href: getBlogPermalink() },
+     { text: 'Tags', href: getPermalink('/tags') },
+     { text: 'About', href: getPermalink('/about') },
+diff --git a/src/pages/projects.astro b/src/pages/projects.astro
+new file mode 100644
+index 0000000..bee3d4e
+--- /dev/null
++++ b/src/pages/projects.astro
+@@ -0,0 +1,28 @@
++---
++import Layout from '~/layouts/PageLayout.astro';
++import List from '~/components/blog/List.astro';
++import { fetchPosts } from '~/utils/blog';
++
++export const prerender = true;
++
++const posts = (await fetchPosts()).filter((post) => post.project !== undefined);
++
++const metadata = {
++  title: 'Projects',
++};
++---
++
++<Layout metadata={metadata}>
++  <section class="px-4 sm:px-6 py-12 sm:py-16 lg:py-20 mx-auto max-w-4xl">
++    <h1 class="text-3xl md:text-4xl font-bold leading-tighter tracking-tighter font-heading mb-3">Projects</h1>
++    <p class="text-muted dark:text-slate-400 mb-12">Open-source projects I work on, and the stories behind them.</p>
++
++    {
++      posts.length === 0 ? (
++        <p class="text-muted">No project introductions yet.</p>
++      ) : (
++        <List posts={posts} showProjectLink />
++      )
++    }
++  </section>
++</Layout>
+diff --git a/src/types.d.ts b/src/types.d.ts
+index 0231642..4480d4f 100644
+--- a/src/types.d.ts
++++ b/src/types.d.ts
+@@ -39,6 +39,9 @@ export interface Post {
+   /**  */
+   highlight?: boolean;
+
++  /** Open-source project metadata when this post belongs on the Projects page. */
++  project?: ProjectMetadata;
++
+   /**  */
+   hidden?: boolean;
+
+@@ -53,6 +56,10 @@ export interface Post {
+   readingTime?: number;
+ }
+
++export interface ProjectMetadata {
++  github: string;
++}
++
+ export interface Taxonomy {
+   slug: string;
+   title: string;
+diff --git a/src/utils/blog.ts b/src/utils/blog.ts
+index 2269710..c1d78c0 100644
+--- a/src/utils/blog.ts
++++ b/src/utils/blog.ts
+@@ -55,6 +55,7 @@ const getNormalizedPost = async (post: CollectionEntry<'post'>): Promise<Post> =
+     author,
+     published = false,
+     highlight = false,
++    project,
+     hidden = false,
+     comments = true,
+     metadata = {},
+@@ -94,6 +95,7 @@ const getNormalizedPost = async (post: CollectionEntry<'post'>): Promise<Post> =
+
+     published: published,
+     highlight: highlight,
++    project: project,
+     hidden: hidden,
+     comments: comments,
+
+diff --git a/workshop/plans/000002-open-source-projects-tab-plan.md b/workshop/plans/000002-open-source-projects-tab-plan.md
+index 0540797..5f39865 100644
+--- a/workshop/plans/000002-open-source-projects-tab-plan.md
++++ b/workshop/plans/000002-open-source-projects-tab-plan.md
+@@ -4,7 +4,7 @@
+
+ **Goal:** Add a Projects tab that surfaces canonical blog-post introductions to Xian's open-source projects and links directly to their GitHub repositories.
+
+-**Architecture:** Extend the existing post schema and normalized `Post` model with optional `project.github` metadata, then reuse the existing blog list for a filtered `/projects` page. A display-context flag enables GitHub links only on that page, keeping the shared renderer as the single implementation (`ARCH-DRY`) and filtering as a pure predicate (`ARCH-PURE`).
++**Architecture:** Extend the existing post schema and normalized `Post` model with optional `project.github` metadata, then reuse the existing blog list for a filtered `/projects` page. A display-context flag enables GitHub links only on that page, keeping the shared renderer as the single implementation (`ARCH-DRY`) and selection as a pure predicate (`ARCH-PURE`). A process-level build assertion covers the complete static rendering path without introducing a test framework.
+
+ **Tech Stack:** Astro 5 content collections, TypeScript, Zod, Astro components, Tailwind CSS.
+
+@@ -14,10 +14,10 @@
+
+ ### Pure entities
+
+-| Name | Lives in | Status |
+-|------|----------|--------|
+-| `ProjectMetadata` | `src/content/config.ts`, `src/types.d.ts` and 42shots mirrors | new |
+-| Normalized `Post` | `src/utils/blog.ts` and 42shots mirror | modified |
++| Name              | Lives in                                                      | Status   |
++| ----------------- | ------------------------------------------------------------- | -------- |
++| `ProjectMetadata` | `src/content/config.ts`, `src/types.d.ts` and 42shots mirrors | new      |
++| Normalized `Post` | `src/utils/blog.ts` and 42shots mirror                        | modified |
+
+ - **ProjectMetadata** — optional metadata marking a post as the canonical introduction to an open-source project.
+   - **Relationships:** A post has zero or one project record; a project record has exactly one GitHub URL.
+@@ -32,11 +32,12 @@ Validation runs through Astro's schema/type checks and production build. This re
+
+ ### Integration points
+
+-| Name | Lives in | Status | Wraps |
+-|------|----------|--------|-------|
+-| Project-aware blog list | `src/components/blog/List.astro`, `src/components/blog/ListItem.astro` and 42shots mirrors | modified | Astro rendering |
+-| Projects route | `src/pages/projects.astro` and 42shots mirror | new | Static page generation |
+-| Primary navigation | `src/navigation.ts` | modified | Site navigation |
++| Name                     | Lives in                                                                                   | Status   | Wraps                                     |
++| ------------------------ | ------------------------------------------------------------------------------------------ | -------- | ----------------------------------------- |
++| Project-aware blog list  | `src/components/blog/List.astro`, `src/components/blog/ListItem.astro` and 42shots mirrors | modified | Astro rendering                           |
++| Projects route           | `src/pages/projects.astro` and 42shots mirror                                              | new      | Static page generation                    |
++| Projects build assertion | `scripts/test-projects-page.sh` and 42shots mirror                                         | new      | Temporary content fixtures + static build |
++| Primary navigation       | `src/navigation.ts`                                                                        | modified | Site navigation                           |
+
+ - **Project-aware blog list** — accepts an optional display flag and renders a direct GitHub link when enabled.
+   - **Injected into:** The Projects page passes the flag; existing consumers retain current output.
+@@ -47,12 +48,16 @@ Validation runs through Astro's schema/type checks and production build. This re
+ - **Primary navigation** — exposes the route between Highlights and Archive.
+   - **Injected into:** The existing Header through `headerData`.
+   - **Future extensions:** None.
++- **Projects build assertion** — creates controlled temporary project/non-project/draft posts, builds the site, asserts the Projects and ordinary-list HTML contracts, and removes fixtures through a shell trap.
++  - **Injected into:** Local verification in each repository; no production runtime dependency.
++  - **Future extensions:** Additional rendered contracts can be added when surfaced.
+
+ ## Chunk 1: Typed project metadata
+
+ ### Task 1: Extend the post data pipeline
+
+ **Files:**
++
+ - Modify: `src/content/config.ts`
+ - Modify: `src/types.d.ts`
+ - Modify: `src/utils/blog.ts`
+@@ -60,17 +65,17 @@ Validation runs through Astro's schema/type checks and production build. This re
+ - Modify: `../42shots/src/types.d.ts`
+ - Modify: `../42shots/src/utils/blog.ts`
+
+-- [ ] **Step 1: Define the project metadata schema and normalized type**
++- [x] **Step 1: Define the project metadata schema and normalized type**
+
+ Add `project: z.object({ github: z.string().url() }).optional()` to the post schema, add matching `ProjectMetadata` and `Post.project` types, then destructure and return `project` in `getNormalizedPost`. Mirror these shared engine changes in 42shots (`ARCH-DRY`).
+
+-- [ ] **Step 2: Add an invalid temporary project fixture and verify URL validation fails**
++- [x] **Step 2: Add an invalid temporary project fixture and verify URL validation fails**
+
+ Create a temporary published Markdown fixture with `project.github: not-a-url`, then run: `npm run check:astro`
+
+ Expected: FAIL with a Zod URL-validation error for the fixture.
+
+-- [ ] **Step 3: Correct the fixture and verify the typed pipeline**
++- [x] **Step 3: Correct the fixture and verify the typed pipeline**
+
+ Change the fixture to a valid GitHub URL and give it a distinctive title/permalink value.
+
+@@ -85,41 +90,45 @@ Keep the fixture through rendered-output verification, then remove it before fin
+ ### Task 2: Add contextual GitHub links to the shared list
+
+ **Files:**
++
+ - Modify: `src/components/blog/List.astro`
+ - Modify: `src/components/blog/ListItem.astro`
+ - Modify: `../42shots/src/components/blog/List.astro`
+ - Modify: `../42shots/src/components/blog/ListItem.astro`
+
+-- [ ] **Step 1: Add `showProjectLink?: boolean` to both component props**
++- [x] **Step 1: Add `showProjectLink?: boolean` to both component props**
+
+ Default it to `false` and pass it from `List` to each `Item`; mirror the shared component change in 42shots.
+
+-- [ ] **Step 2: Render the project destination**
++- [x] **Step 2: Render the project destination**
+
+ When the flag and `post.project` are present, render an accessible external GitHub link after the excerpt using the existing icon library and `rel="noopener noreferrer"`.
+
+-- [ ] **Step 3: Run `npm run check:astro`**
++- [x] **Step 3: Run `npm run check:astro`**
+
+ Expected: PASS with the new component contracts.
+
+ ### Task 3: Add the Projects page and navigation
+
+ **Files:**
++
+ - Create: `src/pages/projects.astro`
+ - Create: `../42shots/src/pages/projects.astro`
++- Create: `scripts/test-projects-page.sh`
++- Create: `../42shots/scripts/test-projects-page.sh`
+ - Modify: `src/navigation.ts`
+
+-- [ ] **Step 1: Create the static route**
++- [x] **Step 1: Create the static route**
+
+ Mirror the restrained Highlights layout, filter `fetchPosts()` by project metadata, render `<List posts={posts} showProjectLink />`, and include a clear empty state. Port the route to 42shots for structural parity, but leave it unlinked there because its business-site navigation and content are intentional differences.
+
+-- [ ] **Step 2: Add `Projects` after `Highlights` in primary navigation**
++- [x] **Step 2: Add `Projects` after `Highlights` in primary navigation**
+
+-- [ ] **Step 3: Verify the rendered feature path with the temporary fixture**
++- [x] **Step 3: Verify the rendered feature path with the temporary fixture**
+
+-Run `npm run build`, then assert `dist/projects/index.html` contains the fixture's introduction permalink and exact GitHub URL. Also assert it excludes a known published non-project post and a temporary draft project fixture. This verifies schema → normalization → published selection → contextual anchor (`ARCH-PURPOSE`).
++Implement `scripts/test-projects-page.sh` as a committed deterministic test. It creates temporary published-project, published-non-project, and draft-project fixtures under the target repo, registers a trap that removes them, runs `npm run build`, then uses `rg` assertions against generated HTML. Assert `dist/projects/index.html` contains the published project's introduction permalink and exact GitHub URL, its anchor has an accessible label plus `target="_blank"` and `rel="noopener noreferrer"`, and it excludes the published non-project and draft project. Assert a normal list page does not contain that GitHub URL, proving `showProjectLink` defaults false. Mirror the script in 42shots and run `scripts/test-projects-page.sh` in each repository. This verifies schema → normalization → published selection → contextual anchor in both repositories (`ARCH-PURPOSE`).
+
+-- [ ] **Step 4: Remove temporary fixtures and run full verification**
++- [x] **Step 4: Remove temporary fixtures and run full verification**
+
+ Run: `npm run check`
+
+@@ -131,6 +140,24 @@ Expected: PASS and output includes `/projects/index.html` while Highlights and A
+
+ In `../42shots`, run `npm run check` and `npm run build`; expect both to pass and `/projects/index.html` to be generated. Preserve the operator's existing unrelated modification to `src/pages/[...blog]/[...page].astro`.
+
+-- [ ] **Step 5: Record evidence and commit**
++- [x] **Step 5: Record evidence and commit**
+
+ Update issue #2's checklist and Log with verification evidence. Commit with an issue-scoped message and a `Co-Authored-By:` trailer naming the authoring model.
++
++## Revisions
++
++### 2026-07-14 14:10 PDT — change-code plan-quality gate
++
++- Added pure canonical-project selection with duplicate GitHub URL rejection.
++- Expanded generated-output assertions to cover accessibility, external-link
++  safety, default ordinary-list behavior, and equivalent 42shots fixtures.
++- Re-estimated the now-explicit cross-repository implementation and verification.
++
++### 2026-07-14 14:18 PDT — simplicity correction after gate review
++
++- Removed canonical URL/post enforcement because it was not part of the
++  operator's discoverability goal and would preclude multiple useful essays per
++  repository.
++- Added an explicit committed build-assertion script, mirrored and executed in
++  both repositories, so the rendered behavior remains reproducible after
++  temporary fixtures are removed.
+
+codex
+I’m using the SDLC review workflow plus the repository’s mandatory skill protocol to validate the issue, tracker, diff window, and test evidence read-only.
+exec
+/bin/zsh -lc "sed -n '1,240p' /Users/xianxu/workspace/ariadne/construct/adapted/superpowers-using-superpowers/SKILL.md && sed -n '1,280p' /Users/xianxu/workspace/ariadne/construct/local/sdlc/SKILL.md && sdlc --help && sed -n '1,240p' workshop/lessons.md" in /Users/xianxu/workspace/xianxu.dev
+succeeded in 0ms:
+
+---
+
+name: superpowers-using-superpowers
+description: Use when starting any conversation - establishes how to find and use skills, requiring Skill tool invocation before ANY response including clarifying questions
+
+---
+
+<SUBAGENT-STOP>
+If you were dispatched as a subagent to execute a specific task, skip this skill.
+</SUBAGENT-STOP>
+
+<EXTREMELY-IMPORTANT>
+If you think there is even a 1% chance a skill might apply to what you are doing, you ABSOLUTELY MUST invoke the skill.
+
+IF A SKILL APPLIES TO YOUR TASK, YOU DO NOT HAVE A CHOICE. YOU MUST USE IT.
+
+This is not negotiable. This is not optional. You cannot rationalize your way out of this.
+</EXTREMELY-IMPORTANT>
+
+## Instruction Priority
+
+> **Ariadne note:** AGENTS.md Section 3 governs subagent strategy and overrides skills that mandate subagent-driven-development as the default execution path.
+
+Superpowers skills override default system prompt behavior, but **user instructions always take precedence**:
+
+1. **User's explicit instructions** (CLAUDE.md, GEMINI.md, AGENTS.md, direct requests) — highest priority
+2. **Superpowers skills** — override default system behavior where they conflict
+3. **Default system prompt** — lowest priority
+
+If CLAUDE.md, GEMINI.md, or AGENTS.md says "don't use TDD" and a skill says "always use TDD," follow the user's instructions. The user is in control.
+
+## How to Access Skills
+
+**In Claude Code:** Use the `Skill` tool. When you invoke a skill, its content is loaded and presented to you—follow it directly. Never use the Read tool on skill files.
+
+**In Gemini CLI:** Skills activate via the `activate_skill` tool. Gemini loads skill metadata at session start and activates the full content on demand.
+
+**In other environments:** Check your platform's documentation for how skills are loaded.
+
+## Platform Adaptation
+
+Skills use Claude Code tool names. Non-CC platforms: see `references/codex-tools.md` (Codex) for tool equivalents. Gemini CLI users get the tool mapping loaded automatically via GEMINI.md.
+
+# Using Skills
+
+## The Rule
+
+**Invoke relevant or requested skills BEFORE any response or action.** Even a 1% chance a skill might apply means that you should invoke the skill to check. If an invoked skill turns out to be wrong for the situation, you don't need to use it.
+
+```dot
+digraph skill_flow {
+    "User message received" [shape=doublecircle];
+    "About to EnterPlanMode?" [shape=doublecircle];
+    "Already brainstormed?" [shape=diamond];
+    "Invoke brainstorming skill" [shape=box];
+    "Might any skill apply?" [shape=diamond];
+    "Invoke Skill tool" [shape=box];
+    "Announce: 'Using [skill] to [purpose]'" [shape=box];
+    "Has checklist?" [shape=diamond];
+    "Create TodoWrite todo per item" [shape=box];
+    "Follow skill exactly" [shape=box];
+    "Respond (including clarifications)" [shape=doublecircle];
+
+    "About to EnterPlanMode?" -> "Already brainstormed?";
+    "Already brainstormed?" -> "Invoke brainstorming skill" [label="no"];
+    "Already brainstormed?" -> "Might any skill apply?" [label="yes"];
+    "Invoke brainstorming skill" -> "Might any skill apply?";
+
+    "User message received" -> "Might any skill apply?";
+    "Might any skill apply?" -> "Invoke Skill tool" [label="yes, even 1%"];
+    "Might any skill apply?" -> "Respond (including clarifications)" [label="definitely not"];
+    "Invoke Skill tool" -> "Announce: 'Using [skill] to [purpose]'";
+    "Announce: 'Using [skill] to [purpose]'" -> "Has checklist?";
+    "Has checklist?" -> "Create TodoWrite todo per item" [label="yes"];
+    "Has checklist?" -> "Follow skill exactly" [label="no"];
+    "Create TodoWrite todo per item" -> "Follow skill exactly";
+}
+```
+
+## Red Flags
+
+These thoughts mean STOP—you're rationalizing:
+
+| Thought                             | Reality                                                |
+| ----------------------------------- | ------------------------------------------------------ |
+| "This is just a simple question"    | Questions are tasks. Check for skills.                 |
+| "I need more context first"         | Skill check comes BEFORE clarifying questions.         |
+| "Let me explore the codebase first" | Skills tell you HOW to explore. Check first.           |
+| "I can check git/files quickly"     | Files lack conversation context. Check for skills.     |
+| "Let me gather information first"   | Skills tell you HOW to gather information.             |
+| "This doesn't need a formal skill"  | If a skill exists, use it.                             |
+| "I remember this skill"             | Skills evolve. Read current version.                   |
+| "This doesn't count as a task"      | Action = task. Check for skills.                       |
+| "The skill is overkill"             | Simple things become complex. Use it.                  |
+| "I'll just do this one thing first" | Check BEFORE doing anything.                           |
+| "This feels productive"             | Undisciplined action wastes time. Skills prevent this. |
+| "I know what that means"            | Knowing the concept ≠ using the skill. Invoke it.      |
+
+## Skill Priority
+
+When multiple skills could apply, use this order:
+
+1. **Process skills first** (brainstorming, debugging) - these determine HOW to approach the task
+2. **Implementation skills second** (frontend-design, mcp-builder) - these guide execution
+
+"Let's build X" → brainstorming first, then implementation skills.
+"Fix this bug" → debugging first, then domain-specific skills.
+
+## Skill Types
+
+**Rigid** (TDD, debugging): Follow exactly. Don't adapt away discipline.
+
+**Flexible** (patterns): Adapt principles to context.
+
+The skill itself tells you which.
+
+## User Instructions
+
+## Instructions say WHAT, not HOW. "Add X" or "Fix Y" doesn't mean skip workflows.
+
+name: sdlc
+description: Use when at an SDLC checkpoint — starting work, closing an issue or milestone, opening/merging a PR, or recovering workflow state after compaction. The `sdlc` binary owns the gates between workflow stages and refuses transitions that lack required evidence.
+
+---
+
+# sdlc — SDLC checkpoint binary
+
+`sdlc` owns the gates between SDLC workflow stages (claim → change-code → pr →
+merge, plus close, milestone-close, judge). It requires evidence at each gate,
+mutates state, logs the transition, and refuses transitions that lack the
+evidence — that is the shape of a "checkpoint guard."
+
+The binary is the single source of truth. This skill is a static pointer and
+intentionally carries no copy of the contract, so it can never drift:
+
+- **`sdlc --help`** — the workflow contract: the start-of-work runbook,
+  conventions, and the verb list.
+- **`sdlc <verb> --help`** — one checkpoint's full contract, flags, and examples.
+
+Read those instead of relying on memory; the binary's help is always current.
+sdlc collects ariadne's SDLC checkpoint guards into one binary. Each subcommand
+owns one checkpoint: it requires evidence at the gate, mutates state, logs the
+transition, and refuses transitions that lack it. We don't model the SDLC as a
+state machine — stages stay prose; we codify the gates between them where drift
+recurs. `sdlc` manages the development life cycle; prefer it over `git`/`gh`.
+
+BEFORE WORK
+
+- `sdlc claim --issue N` — the single start-of-work gesture, a CHEAP LOCK.
+  Flips an _open_ issue to `working` and publishes the claim to origin/main so
+  peer agents see it. No estimate demanded (#113) — claim early, the moment an
+  idea crystallizes. `--no-start` suppresses the flip.
+- Do NOT hand-edit an issue's `status:` — let `sdlc claim` or `sdlc issue
+set-status` own that transition (it carries the reopen/`→ done` guards).
+
+ENTER IMPLEMENTATION
+
+- After plan approval, before editing code, run `sdlc change-code`. It owns the
+  branching decision (in-place branch by default; `--worktree=yes` for an
+  isolated worktree), the plan-quality check, and the `estimate_hours` gate
+  (relocated here from claim, #113). Don't start coding without it.
+
+PUBLISH
+
+- Publishing goes through a PR: `sdlc pr` → `sdlc merge`. Direct `sdlc push`
+  if working directly on main.
+- Publish ONCE at issue close, not per milestone — and do NOT reuse a branch
+  name that already has a merged PR. `sdlc merge` refuses (#148) when a branch
+  has commits not in main despite a merged PR (a reused name would otherwise
+  silently strand the new commits); rename to a fresh branch, `sdlc pr`, retry.
+
+RECOVER
+
+- After a compaction or session resume, run `sdlc state` to recover where you
+  are instead of re-inferring from issue files.
+
+LOCAL REPO TRANSACTION LOCK
+
+- Mutating verbs take an SDLC-owned repo transaction lock at
+  `.git/sdlc.lock` before reading/writing issue state, committing, changing
+  branches, or pushing. The lock is local to the Git common dir, so linked
+  worktrees of the same repo serialize with each other.
+- Wait messages identify the holder pid and command when metadata is
+  available. `close` and `milestone-close` release the lock while the external
+  boundary-review subprocess runs, then reacquire before finalization; if HEAD
+  or the issue/project file state they prepared changed meanwhile, they refuse
+  to finalize and tell you to rerun. `change-code`, `merge`, and `push` can still hold the lock during
+  long-running review/ship transactions; wait or retry rather than removing
+  the lock while that process is alive.
+- A dead same-host holder is reclaimed automatically; initializing metadata
+  is waited through. Other stale/timeout errors tell you how to inspect
+  `.git/sdlc.lock`. Remote push/ref races are separate: the local lock
+  serializes this checkout, not another machine or clone.
+
+WHEN A VERB ERRORS
+Do NOT route around it with hand-rolled `git`/`gh`. Its errors are next-action
+specs. The fix is one of two things:
+(a) satisfy the precondition it names and re-run the same verb (e.g. `sdlc
+        merge` saying "no upstream" → run `sdlc pr` first, then `sdlc merge`); or
+(b) if the error is a genuine gap in `sdlc` itself, fix that edge case in the
+source and re-run. We're still ironing out edge cases.
+Only drop to manual when a verb genuinely cannot express the need — say so.
+
+These gates sit inside a wider prose arc the binary does NOT own: ideation
+(parley/pensive) → brainstorm → plan → build → milestone review (`sdlc judge`,
+auto-dispatched) → close/ship → postmortem.
+
+CONVENTIONS
+
+--issue vs --github-issue — `--issue N` always means workshop/issues
+(6-digit ID). `--github-issue N` means a GitHub issue number. Bare `--issue`
+never means a GitHub issue.
+
+Form vs essence — checkpoint guards (close, milestone-close, push, merge)
+defend against _omission_ via required-evidence flags; `sdlc judge` defends
+against _theater_ via fresh-context review. Form runs first; judge second.
+
+The verb list + per-verb help (`sdlc <verb> --help`) follow below.
+
+Usage:
+sdlc [flags]
+sdlc [command]
+
+Available Commands:
+claim Start work: flip an open issue to working + broadcast the claim
+start-plan Enter planning: deliver the architecture principles to design against (#75)
+change-code Enter implementation after the structural + plan-quality gates
+issue Create + manage issues (new / set-status / list / show)
+actual Compute an issue's focused dev-hours via active-time-v3 (#68)
+active-time Per-issue active-time attribution table (the v3 engine, standalone)
+close Close an issue or milestone (ACTUAL + VERIFIED + atlas/project sweep)
+milestone-close Close one milestone + auto-dispatch its review
+pr Open a pull request from a feature branch
+merge Merge the PR, archive done issues, clean up
+push Ship from main (clean tree + pre-merge judges + archive)
+state Inspect workflow state (branch, working issues, drift)
+resolve Resolve a symbolic artifact ref (ariadne#11, #15 M4) to its current path(s) — read-only
+open Resolve a ref and open the primary artifact in $EDITOR
+judge Run an LLM-judge check against the diff (fresh-context)
+arch-principles Print the ARCH-\* architecture principles (single source; pull for non-gate work)
+estimate-source Name the shared estimate method + the repo-local calibration source (pull)
+process-manual Unroll every injection source into a linked process manual (#153)
+propagate-base Re-weave every recursive dependent of this repo (foundation-first)
+help Help about any command
+
+Flags:
+-h, --help help for sdlc
+
+Use "sdlc [command] --help" for more information about a command.
+
+exec
+/bin/zsh -lc "git status --short && git diff --stat 8e552f52728ad6c9c4e8b04b6891f230f6e8685f..HEAD && git diff --name-status 8e552f52728ad6c9c4e8b04b6891f230f6e8685f..HEAD && sed -n '1,280p' workshop/issues/000002-open-source-projects-tab.md && sed -n '1,260p' workshop/plans/000002-open-source-projects-tab-plan.md && git log --oneline --decorate 8e552f52728ad6c9c4e8b04b6891f230f6e8685f..HEAD" in /Users/xianxu/workspace/xianxu.dev
+succeeded in 0ms:
+?? src/data/post/parley.md
+scripts/test-projects-page.sh | 73 ++++++++++++++++++++++
+src/components/blog/List.astro | 5 +-
+src/components/blog/ListItem.astro | 17 ++++-
+src/content/config.ts | 1 +
+src/navigation.ts | 1 +
+src/pages/projects.astro | 28 +++++++++
+src/types.d.ts | 7 +++
+src/utils/blog.ts | 2 +
+workshop/issues/000002-open-source-projects-tab.md | 20 +++++-
+.../plans/000002-open-source-projects-tab-plan.md | 71 ++++++++++++++-------
+10 files changed, 197 insertions(+), 28 deletions(-)
+A scripts/test-projects-page.sh
+M src/components/blog/List.astro
+M src/components/blog/ListItem.astro
+M src/content/config.ts
+M src/navigation.ts
+A src/pages/projects.astro
+M src/types.d.ts
+M src/utils/blog.ts
+M workshop/issues/000002-open-source-projects-tab.md
+M workshop/plans/000002-open-source-projects-tab-plan.md
+
+---
+
+id: 000002
+status: working
+deps: []
+github_issue:
+created: 2026-07-14
+updated: 2026-07-14
+estimate_hours: 2.64
+started: 2026-07-14T13:04:17-07:00
+
+---
+
+# Add open-source projects tab
+
+## Problem
+
+The site presents writing through Highlights and Archive, but it has no durable,
+easy-to-find entry point for open-source projects. GitHub READMEs should remain
+the operational source for installation and usage; the site should surface the
+longer introductions, histories, design choices, and reflections already written
+as blog posts.
+
+## Spec
+
+- Add an optional `project` object to post frontmatter. Version one contains one
+  required field, `github`, validated as a URL. Omitting `project` means the post
+  is not a canonical project introduction.
+- Carry that object through the normalized `Post` model so every consumer sees
+  the same typed data.
+- Add a top-level `Projects` navigation item and a statically generated
+  `/projects` page.
+- The page reuses the existing blog list and shows published posts with project
+  metadata, newest first. Each project entry includes a direct GitHub link in
+  addition to its ordinary post link.
+- `project` marks a substantial introduction, history, or reflection worth
+  discovering from the Projects tab. Multiple posts may point at the same
+  repository; version one does not impose repository identity or canonical-post
+  rules.
+- Do not create a separate project collection, case-study renderer, filtering
+  system, or new prose in version one.
+- Port the reusable post schema, normalization, list capability, and Projects
+  route to `../42shots/` to keep the shared blog structure synchronized. Do not
+  add the personal-site navigation item to 42shots; its business-site navigation
+  is an intentional per-site difference.
+
+## Done when
+
+- `project.github` is schema-validated and preserved by post normalization.
+- `/projects` lists only published project introductions and provides both the
+  introduction and GitHub destinations.
+- `Projects` appears in the primary navigation.
+- Existing Highlights, Archive, and post rendering continue to build.
+- The shared capability is build-verified in both xianxu.dev and 42shots without
+  disturbing 42shots's intentional navigation or content differences.
+- Published posts are annotated separately through the repo's `xx-fix`
+  editorial protocol; choosing which projects to feature is not silently folded
+  into the engine change.
+
+## Estimate
+
+```estimate
+model: estimate-logic-v3.1
+familiarity: 1.0
+item: issue-spec design=0.20 impl=0.08
+item: typed-data-prototype design=0.20 impl=0.48
+item: cross-repo-refactor-small design=0.30 impl=0.60
+item: cross-cutting-refactor design=0.15 impl=0.30
+item: milestone-review design=0.00 impl=0.20
+design-buffer: 0.15
+total: 2.64
+```
+
+_Produced via `brain/data/life/42shots/velocity/estimate-logic-v3.1.md` against `baseline-v3.1.md`. Method A only._
+
+## Plan
+
+- [x] Extend and verify the typed post pipeline for optional project metadata.
+- [x] Reuse the blog list to render project introductions with contextual GitHub links.
+- [x] Add the Projects page and navigation entry, then build-verify the site.
+
+## Log
+
+### 2026-07-14
+
+- Approved direction: projects remain blog posts; `project.github` marks the one
+  canonical introduction for an open-source project. `ARCH-DRY` rules out a
+  parallel content collection, `ARCH-PURE` keeps selection as a simple predicate
+  over normalized posts, and `ARCH-PURPOSE` requires the GitHub destination to
+  survive schema → normalization → page rendering rather than exist as inert
+  frontmatter.
+- Implemented the optional nested schema and normalized `Post` field, reused the
+  shared list with an opt-in GitHub link, and added `/projects` plus personal-site
+  navigation. Mirrored the shared engine, page, and test surface to 42shots
+  (`ARCH-DRY`, `ARCH-PURPOSE`).
+- TDD evidence: invalid `project.github` failed Astro content validation; the
+  corrected URL passed content synchronization. The committed process-level test
+  passed in both repositories and verified published-project inclusion,
+  non-project/draft exclusion, safe accessible GitHub linking, and no link leak
+  into an ordinary list (`ARCH-PURE`).
+- Verification: `scripts/test-projects-page.sh .`, targeted ESLint and Prettier,
+  clean `npm run build`, and `git diff --check` passed in both repositories.
+  Full `npm run check` remains blocked in both repos by matching pre-existing
+  archive `page.data: unknown[]` typing and unrelated Footer/frontmatter lint
+  debt; no task-owned file produced a diagnostic.
+
+## Revisions
+
+### 2026-07-14 14:10 PDT — change-code plan-quality gate
+
+- Made canonical uniqueness enforceable by rejecting duplicate normalized
+  GitHub URLs, expanded end-to-end assertions across both repositories, and
+  recalculated the estimate to include the cross-repo port and verification.
+
+### 2026-07-14 14:18 PDT — simplicity correction after gate review
+
+- Removed the agent-invented canonical-uniqueness requirement. The operator
+  asked for a discoverability marker, and multiple useful essays may point to
+  one repository; URL identity enforcement is outside version one.
+- Retained durable process-level build assertions for the actual metadata and
+  rendering path, and re-estimated that additional test surface.
+
+# Open-source Projects Tab Implementation Plan
+
+> **For agentic workers:** Consult AGENTS.md Section 3 (Subagent Strategy) to determine the appropriate execution approach: use superpowers-subagent-driven-development (if subagents are suitable per AGENTS.md) or superpowers-executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.
+
+**Goal:** Add a Projects tab that surfaces canonical blog-post introductions to Xian's open-source projects and links directly to their GitHub repositories.
+
+**Architecture:** Extend the existing post schema and normalized `Post` model with optional `project.github` metadata, then reuse the existing blog list for a filtered `/projects` page. A display-context flag enables GitHub links only on that page, keeping the shared renderer as the single implementation (`ARCH-DRY`) and selection as a pure predicate (`ARCH-PURE`). A process-level build assertion covers the complete static rendering path without introducing a test framework.
+
+**Tech Stack:** Astro 5 content collections, TypeScript, Zod, Astro components, Tailwind CSS.
+
+---
+
+## Core concepts
+
+### Pure entities
+
+| Name              | Lives in                                                      | Status   |
+| ----------------- | ------------------------------------------------------------- | -------- |
+| `ProjectMetadata` | `src/content/config.ts`, `src/types.d.ts` and 42shots mirrors | new      |
+| Normalized `Post` | `src/utils/blog.ts` and 42shots mirror                        | modified |
+
+- **ProjectMetadata** — optional metadata marking a post as the canonical introduction to an open-source project.
+  - **Relationships:** A post has zero or one project record; a project record has exactly one GitHub URL.
+  - **DRY rationale:** The nested object is the sole marker and destination, avoiding independent boolean and URL fields that can disagree (`ARCH-DRY`).
+  - **Future extensions:** Optional project destinations such as a homepage can widen this object without changing marker semantics.
+- **Normalized `Post`** — the existing renderer-facing representation gains the project record.
+  - **Relationships:** One content entry normalizes to one `Post`; all consumers share it.
+  - **DRY rationale:** Metadata travels through the existing normalization boundary rather than being re-read by the Projects page (`ARCH-PURPOSE`).
+  - **Future extensions:** None planned for version one.
+
+Validation runs through Astro's schema/type checks and production build. This repository has no unit-test harness; adding one solely for a declarative Zod field would exceed this feature's scope.
+
+### Integration points
+
+| Name                     | Lives in                                                                                   | Status   | Wraps                                     |
+| ------------------------ | ------------------------------------------------------------------------------------------ | -------- | ----------------------------------------- |
+| Project-aware blog list  | `src/components/blog/List.astro`, `src/components/blog/ListItem.astro` and 42shots mirrors | modified | Astro rendering                           |
+| Projects route           | `src/pages/projects.astro` and 42shots mirror                                              | new      | Static page generation                    |
+| Projects build assertion | `scripts/test-projects-page.sh` and 42shots mirror                                         | new      | Temporary content fixtures + static build |
+| Primary navigation       | `src/navigation.ts`                                                                        | modified | Site navigation                           |
+
+- **Project-aware blog list** — accepts an optional display flag and renders a direct GitHub link when enabled.
+  - **Injected into:** The Projects page passes the flag; existing consumers retain current output.
+  - **Future extensions:** Other project metadata can use the same context without forking the list.
+- **Projects route** — fetches published posts, applies `post.project !== undefined`, and hands them to the shared list.
+  - **Injected into:** Astro's static route build.
+  - **Future extensions:** None until project count demonstrates a need for grouping or filtering.
+- **Primary navigation** — exposes the route between Highlights and Archive.
+  - **Injected into:** The existing Header through `headerData`.
+  - **Future extensions:** None.
+- **Projects build assertion** — creates controlled temporary project/non-project/draft posts, builds the site, asserts the Projects and ordinary-list HTML contracts, and removes fixtures through a shell trap.
+  - **Injected into:** Local verification in each repository; no production runtime dependency.
+  - **Future extensions:** Additional rendered contracts can be added when surfaced.
+
+## Chunk 1: Typed project metadata
+
+### Task 1: Extend the post data pipeline
+
+**Files:**
+
+- Modify: `src/content/config.ts`
+- Modify: `src/types.d.ts`
+- Modify: `src/utils/blog.ts`
+- Modify: `../42shots/src/content/config.ts`
+- Modify: `../42shots/src/types.d.ts`
+- Modify: `../42shots/src/utils/blog.ts`
+
+- [x] **Step 1: Define the project metadata schema and normalized type**
+
+Add `project: z.object({ github: z.string().url() }).optional()` to the post schema, add matching `ProjectMetadata` and `Post.project` types, then destructure and return `project` in `getNormalizedPost`. Mirror these shared engine changes in 42shots (`ARCH-DRY`).
+
+- [x] **Step 2: Add an invalid temporary project fixture and verify URL validation fails**
+
+Create a temporary published Markdown fixture with `project.github: not-a-url`, then run: `npm run check:astro`
+
+Expected: FAIL with a Zod URL-validation error for the fixture.
+
+- [x] **Step 3: Correct the fixture and verify the typed pipeline**
+
+Change the fixture to a valid GitHub URL and give it a distinctive title/permalink value.
+
+Run: `npm run check:astro`
+
+Expected: PASS, proving schema acceptance and normalized type compatibility.
+
+Keep the fixture through rendered-output verification, then remove it before final verification. Published-post selection remains outside this engine change because post frontmatter is governed by `xx-fix`.
+
+## Chunk 2: Projects discovery surface
+
+### Task 2: Add contextual GitHub links to the shared list
+
+**Files:**
+
+- Modify: `src/components/blog/List.astro`
+- Modify: `src/components/blog/ListItem.astro`
+- Modify: `../42shots/src/components/blog/List.astro`
+- Modify: `../42shots/src/components/blog/ListItem.astro`
+
+- [x] **Step 1: Add `showProjectLink?: boolean` to both component props**
+
+Default it to `false` and pass it from `List` to each `Item`; mirror the shared component change in 42shots.
+
+- [x] **Step 2: Render the project destination**
+
+When the flag and `post.project` are present, render an accessible external GitHub link after the excerpt using the existing icon library and `rel="noopener noreferrer"`.
+
+- [x] **Step 3: Run `npm run check:astro`**
+
+Expected: PASS with the new component contracts.
+
+### Task 3: Add the Projects page and navigation
+
+**Files:**
+
+- Create: `src/pages/projects.astro`
+- Create: `../42shots/src/pages/projects.astro`
+- Create: `scripts/test-projects-page.sh`
+- Create: `../42shots/scripts/test-projects-page.sh`
+- Modify: `src/navigation.ts`
+
+- [x] **Step 1: Create the static route**
+
+Mirror the restrained Highlights layout, filter `fetchPosts()` by project metadata, render `<List posts={posts} showProjectLink />`, and include a clear empty state. Port the route to 42shots for structural parity, but leave it unlinked there because its business-site navigation and content are intentional differences.
+
+- [x] **Step 2: Add `Projects` after `Highlights` in primary navigation**
+
+- [x] **Step 3: Verify the rendered feature path with the temporary fixture**
+
+Implement `scripts/test-projects-page.sh` as a committed deterministic test. It creates temporary published-project, published-non-project, and draft-project fixtures under the target repo, registers a trap that removes them, runs `npm run build`, then uses `rg` assertions against generated HTML. Assert `dist/projects/index.html` contains the published project's introduction permalink and exact GitHub URL, its anchor has an accessible label plus `target="_blank"` and `rel="noopener noreferrer"`, and it excludes the published non-project and draft project. Assert a normal list page does not contain that GitHub URL, proving `showProjectLink` defaults false. Mirror the script in 42shots and run `scripts/test-projects-page.sh` in each repository. This verifies schema → normalization → published selection → contextual anchor in both repositories (`ARCH-PURPOSE`).
+
+- [x] **Step 4: Remove temporary fixtures and run full verification**
+
+Run: `npm run check`
+
+Expected: Astro, ESLint, and Prettier checks pass.
+
+Run: `npm run build`
+
+Expected: PASS and output includes `/projects/index.html` while Highlights and Archive remain generated.
+
+In `../42shots`, run `npm run check` and `npm run build`; expect both to pass and `/projects/index.html` to be generated. Preserve the operator's existing unrelated modification to `src/pages/[...blog]/[...page].astro`.
+
+- [x] **Step 5: Record evidence and commit**
+
+Update issue #2's checklist and Log with verification evidence. Commit with an issue-scoped message and a `Co-Authored-By:` trailer naming the authoring model.
+
+## Revisions
+
+### 2026-07-14 14:10 PDT — change-code plan-quality gate
+
+- Added pure canonical-project selection with duplicate GitHub URL rejection.
+- Expanded generated-output assertions to cover accessibility, external-link
+  safety, default ordinary-list behavior, and equivalent 42shots fixtures.
+- Re-estimated the now-explicit cross-repository implementation and verification.
+
+### 2026-07-14 14:18 PDT — simplicity correction after gate review
+
+- Removed canonical URL/post enforcement because it was not part of the
+  operator's discoverability goal and would preclude multiple useful essays per
+  repository.
+- Added an explicit committed build-assertion script, mirrored and executed in
+  both repositories, so the rendered behavior remains reproducible after
+  temporary fixtures are removed.
+  34ed1a4 (HEAD -> 000002-open-source-projects-tab) blog: #2 add open-source projects tab
+
+codex
+The implementation shape is coherent so far. I’m now checking the actual post-selection contract, generated markup, test specificity, and whether the new route is represented in the atlas rather than relying on the tracker’s claims.
+exec
+/bin/zsh -lc "nl -ba src/utils/blog.ts | sed -n '1,180p'; nl -ba src/pages/projects.astro; nl -ba src/components/blog/ListItem.astro | sed -n '85,145p'; nl -ba scripts/test-projects-page.sh; rg -n \"fetchPosts|sort|published|highlight\" src/pages/highlights.astro src/utils/blog.ts; rg -n \"projects|Highlights|Archive|navigation|route\" atlas README.md package.json; git diff --check 8e552f52728ad6c9c4e8b04b6891f230f6e8685f..HEAD; git diff 8e552f52728ad6c9c4e8b04b6891f230f6e8685f..HEAD -- atlas README.md package.json" in /Users/xianxu/workspace/xianxu.dev
+succeeded in 0ms:
+1 import type { PaginateFunction } from 'astro';
+2 import { getCollection, render } from 'astro:content';
+3 import type { CollectionEntry } from 'astro:content';
+4 import type { Post } from '~/types';
+5 import { APP_BLOG } from 'astrowind:config';
+6 import { cleanSlug, trimSlash, BLOG_BASE, POST_PERMALINK_PATTERN, CATEGORY_BASE, TAG_BASE } from './permalinks';
+7
+8 const generatePermalink = async ({
+9 id,
+10 slug,
+11 publishDate,
+12 category,
+13 }: {
+14 id: string;
+15 slug: string;
+16 publishDate: Date;
+17 category: string | undefined;
+18 }) => {
+19 const year = String(publishDate.getFullYear()).padStart(4, '0');
+20 const month = String(publishDate.getMonth() + 1).padStart(2, '0');
+21 const day = String(publishDate.getDate()).padStart(2, '0');
+22 const hour = String(publishDate.getHours()).padStart(2, '0');
+23 const minute = String(publishDate.getMinutes()).padStart(2, '0');
+24 const second = String(publishDate.getSeconds()).padStart(2, '0');
+25
+26 const permalink = POST_PERMALINK_PATTERN.replace('%slug%', slug)
+27 .replace('%id%', id)
+28 .replace('%category%', category || '')
+29 .replace('%year%', year)
+30 .replace('%month%', month)
+31 .replace('%day%', day)
+32 .replace('%hour%', hour)
+33 .replace('%minute%', minute)
+34 .replace('%second%', second);
+35
+36 return permalink
+37 .split('/')
+38 .map((el) => trimSlash(el))
+39 .filter((el) => !!el)
+40 .join('/');
+41 };
+42
+43 const getNormalizedPost = async (post: CollectionEntry<'post'>): Promise<Post> => {
+44 const { id, data } = post;
+45 const { Content, remarkPluginFrontmatter } = await render(post);
+46
+47 const {
+48 publishDate: rawPublishDate = new Date(),
+49 updateDate: rawUpdateDate,
+50 title,
+51 excerpt,
+52 image,
+53 tags: rawTags = [],
+54 category: rawCategory,
+55 author,
+56 published = false,
+57 highlight = false,
+58 project,
+59 hidden = false,
+60 comments = true,
+61 metadata = {},
+62 } = data;
+63
+64 const slug = cleanSlug(id); // cleanSlug(rawSlug.split('/').pop());
+65 const publishDate = new Date(rawPublishDate);
+66 const updateDate = rawUpdateDate ? new Date(rawUpdateDate) : undefined;
+67
+68 const category = rawCategory
+69 ? {
+70 slug: cleanSlug(rawCategory),
+71 title: rawCategory,
+72 }
+73 : undefined;
+74
+75 const tags = rawTags.map((tag: string) => ({
+76 slug: cleanSlug(tag),
+77 title: tag,
+78 }));
+79
+80 return {
+81 id: id,
+82 slug: slug,
+83 permalink: await generatePermalink({ id, slug, publishDate, category: category?.slug }),
+84
+85 publishDate: publishDate,
+86 updateDate: updateDate,
+87
+88 title: title,
+89 excerpt: excerpt,
+90 image: image,
+91
+92 category: category,
+93 tags: tags,
+94 author: author,
+95
+96 published: published,
+97 highlight: highlight,
+98 project: project,
+99 hidden: hidden,
+100 comments: comments,
+101
+102 metadata,
+103
+104 Content: Content,
+105 // or 'content' in case you consume from API
+106
+107 readingTime: remarkPluginFrontmatter?.readingTime,
+108 };
+109 };
+110
+111 const load = async function (): Promise<Array<Post>> {
+112 const posts = await getCollection('post');
+113 const normalizedPosts = posts.map(async (post) => await getNormalizedPost(post));
+114
+115 const results = (await Promise.all(normalizedPosts)).sort(
+116 (a, b) => b.publishDate.valueOf() - a.publishDate.valueOf()
+117 );
+118
+119 return results;
+120 };
+121
+122 let \_allPosts: Array<Post>;
+123 let \_posts: Array<Post>;
+124
+125 /** \*/
+126 export const isBlogEnabled = APP_BLOG.isEnabled;
+127 export const isRelatedPostsEnabled = APP_BLOG.isRelatedPostsEnabled;
+128 export const isBlogListRouteEnabled = APP_BLOG.list.isEnabled;
+129 export const isBlogPostRouteEnabled = APP_BLOG.post.isEnabled;
+130 export const isBlogCategoryRouteEnabled = APP_BLOG.category.isEnabled;
+131 export const isBlogTagRouteEnabled = APP_BLOG.tag.isEnabled;
+132
+133 export const blogListRobots = APP_BLOG.list.robots;
+134 export const blogPostRobots = APP_BLOG.post.robots;
+135 export const blogCategoryRobots = APP_BLOG.category.robots;
+136 export const blogTagRobots = APP_BLOG.tag.robots;
+137
+138 export const blogPostsPerPage = APP_BLOG?.postsPerPage;
+139
+140 /** All posts, including drafts. Use only in dev tools / drafts page. _/
+141 export const fetchAllPosts = async (): Promise<Array<Post>> => {
+142 if (!\_allPosts) {
+143 \_allPosts = await load();
+144 }
+145 return \_allPosts;
+146 };
+147
+148 /\*\* Published posts only — what visitors should ever see. _/
+149 export const fetchPosts = async (): Promise<Array<Post>> => {
+150 if (!\_posts) {
+151 \_posts = (await fetchAllPosts()).filter((p) => p.published === true);
+152 }
+153 return \_posts;
+154 };
+155
+156 /** Draft posts only. \*/
+157 export const fetchDrafts = async (): Promise<Array<Post>> => {
+158 return (await fetchAllPosts()).filter((p) => p.published !== true);
+159 };
+160
+161 /** _/
+162 export const findPostsBySlugs = async (slugs: Array<string>): Promise<Array<Post>> => {
+163 if (!Array.isArray(slugs)) return [];
+164
+165 const posts = await fetchPosts();
+166
+167 return slugs.reduce(function (r: Array<Post>, slug: string) {
+168 posts.some(function (post: Post) {
+169 return slug === post.slug && r.push(post);
+170 });
+171 return r;
+172 }, []);
+173 };
+174
+175 /\*\* _/
+176 export const findPostsByIds = async (ids: Array<string>): Promise<Array<Post>> => {
+177 if (!Array.isArray(ids)) return [];
+178
+179 const posts = await fetchPosts();
+180
+1 ---
+2 import Layout from '~/layouts/PageLayout.astro';
+3 import List from '~/components/blog/List.astro';
+4 import { fetchPosts } from '~/utils/blog';
+5
+6 export const prerender = true;
+7
+8 const posts = (await fetchPosts()).filter((post) => post.project !== undefined);
+9
+10 const metadata = {
+11 title: 'Projects',
+12 };
+13 ---
+14
+15 <Layout metadata={metadata}>
+16 <section class="px-4 sm:px-6 py-12 sm:py-16 lg:py-20 mx-auto max-w-4xl">
+17 <h1 class="text-3xl md:text-4xl font-bold leading-tighter tracking-tighter font-heading mb-3">Projects</h1>
+18 <p class="text-muted dark:text-slate-400 mb-12">Open-source projects I work on, and the stories behind them.</p>
+19
+20 {
+21 posts.length === 0 ? (
+22 <p class="text-muted">No project introductions yet.</p>
+23 ) : (
+24 <List posts={posts} showProjectLink />
+25 )
+26 }
+27 </section>
+28 </Layout>
+85 ·{' '}
+86 <a class="hover:underline" href={getPermalink(post.category.slug, 'category')}>
+87 {post.category.title}
+88 </a>
+89 </>
+90 )
+91 }
+92 </span>
+93 </div>
+94 <h2 class="text-xl sm:text-2xl font-bold leading-tight mb-2 font-heading dark:text-slate-300">
+95 {
+96 link ? (
+97 <a
+98 class="inline-block hover:text-primary dark:hover:text-blue-700 transition ease-in duration-200"
+99 href={link}
+100 >
+101 {post.title}
+102 </a>
+103 ) : (
+104 post.title
+105 )
+106 }
+107 </h2>
+108 </header>
+109
+110 {post.excerpt && <p class="flex-grow text-muted dark:text-slate-400 text-lg">{post.excerpt}</p>}
+111 {
+112 showProjectLink && post.project && (
+113 <a
+114 class="inline-flex items-center gap-1.5 mt-4 text-sm font-medium hover:underline"
+115 href={post.project.github}
+116 target="\_blank"
+117 rel="noopener noreferrer"
+118 aria-label={`View ${post.title} on GitHub`}
+119 >
+120 <Icon name="tabler:brand-github" class="w-4 h-4" />
+121 GitHub
+122 </a>
+123 )
+124 }
+125 {
+126 post.tags && Array.isArray(post.tags) ? (
+127 <footer class="mt-5">
+128 <PostTags tags={post.tags} />
+129 </footer>
+130 ) : (
+131 <Fragment />
+132 )
+133 }
+134 </div>
+135 </article>
+1 #!/usr/bin/env bash
+2 set -euo pipefail
+3
+4 repo=${1:-.}
+     5	posts="$repo/src/data/post"
+6 published="$posts/project-render-published-test.md"
+     7	nonproject="$posts/project-render-nonproject-test.md"
+8 draft="$posts/project-render-draft-test.md"
+     9
+    10	cleanup() {
+    11	  rm -f "$published" "$nonproject" "$draft"
+12 }
+13 trap cleanup EXIT
+14
+15 cat >"$published" <<'EOF'
+    16	---
+    17	title: Project render published test
+    18	publishDate: 2030-01-03
+    19	published: true
+    20	highlight: true
+    21	project:
+    22	  github: https://github.com/xianxu/project-render-test
+    23	---
+    24
+    25	Temporary project rendering fixture.
+    26	EOF
+    27
+    28	cat >"$nonproject" <<'EOF'
+29 ---
+30 title: Project render nonproject test
+31 publishDate: 2030-01-02
+32 published: true
+33 ---
+34
+35 Temporary non-project rendering fixture.
+36 EOF
+37
+38 cat >"$draft" <<'EOF'
+    39	---
+    40	title: Project render draft test
+    41	publishDate: 2030-01-01
+    42	published: false
+    43	project:
+    44	  github: https://github.com/xianxu/project-render-draft-test
+    45	---
+    46
+    47	Temporary draft project rendering fixture.
+    48	EOF
+    49
+    50	(
+    51	  cd "$repo"
+52 npm run build
+53 )
+54
+55 projects="$repo/dist/projects/index.html"
+    56	highlights="$repo/dist/highlights/index.html"
+57
+58 rg -q 'Project render published test' "$projects"
+    59	rg -q 'https://github.com/xianxu/project-render-test' "$projects"
+60 rg -q 'aria-label="View Project render published test on GitHub"' "$projects"
+    61	rg -q 'target="_blank"' "$projects"
+62 rg -q 'rel="noopener noreferrer"' "$projects"
+    63
+    64	if rg -q 'Project render nonproject test|Project render draft test|project-render-draft-test' "$projects"; then
+65 echo "Projects page included a non-project or draft fixture" >&2
+66 exit 1
+67 fi
+68
+69 rg -q 'Project render published test' "$highlights"
+    70	if rg -q 'https://github.com/xianxu/project-render-test' "$highlights"; then
+71 echo "Ordinary blog list exposed a project-only GitHub link" >&2
+72 exit 1
+73 fi
+src/utils/blog.ts:56: published = false,
+src/utils/blog.ts:57: highlight = false,
+src/utils/blog.ts:96: published: published,
+src/utils/blog.ts:97: highlight: highlight,
+src/utils/blog.ts:115: const results = (await Promise.all(normalizedPosts)).sort(
+src/utils/blog.ts:149:export const fetchPosts = async (): Promise<Array<Post>> => {
+src/utils/blog.ts:151: \_posts = (await fetchAllPosts()).filter((p) => p.published === true);
+src/utils/blog.ts:158: return (await fetchAllPosts()).filter((p) => p.published !== true);
+src/utils/blog.ts:165: const posts = await fetchPosts();
+src/utils/blog.ts:179: const posts = await fetchPosts();
+src/utils/blog.ts:192: const posts = await fetchPosts();
+src/utils/blog.ts:211: const all = await fetchPosts();
+src/utils/blog.ts:239: // Drafts get URLs in dev so you can preview them; production renders only published.
+src/utils/blog.ts:240: const posts = import.meta.env.DEV ? await fetchAllPosts() : await fetchPosts();
+src/utils/blog.ts:253: const posts = await fetchPosts();
+src/utils/blog.ts:277: \* (Also fixes a latent leak: the old version paginated fetchPosts() unfiltered,
+src/utils/blog.ts:282: const all = await fetchPosts();
+src/utils/blog.ts:332: const allPosts = await fetchPosts();
+src/utils/blog.ts:355: postsWithScores.sort((a, b) => b.score - a.score);
+src/pages/highlights.astro:4:import { fetchPosts } from '~/utils/blog';
+src/pages/highlights.astro:8:const posts = (await fetchPosts()).filter((p) => p.highlight === true);
+src/pages/highlights.astro:21: <p class="text-muted">No highlighted posts yet.</p>
+README.md:14:- ✅ Generation of **project sitemap** based on your routes.
+README.md:44:- [Related Projects](#related-projects)
+README.md:128:│ └── navigation.js
+README.md:134:Astro looks for `.astro` or `.md` files in the `src/pages/` directory. Each page is exposed as a route based on its file name.
+README.md:286:## Related projects
+
+exec
+/bin/zsh -lc './scripts/test-projects-page.sh .' in /Users/xianxu/workspace/xianxu.dev
+succeeded in 8427ms:
+npm warn Unknown project config "shamefully-hoist". This will stop working in the next major version of npm. See `npm help npmrc` for supported config options.
+
+> 42shots@1.0.0-beta.52 build
+> astro build
+
+14:11:52 [astrowind] Astrowind `./src/config.yaml` has been loaded.
+14:11:52 [content] Syncing content
+14:11:52 [content] Synced content
+14:11:52 [types] Generated 252ms
+14:11:52 [build] output: "static"
+14:11:52 [build] mode: "static"
+14:11:52 [build] directory: /Users/xianxu/workspace/xianxu.dev/dist/
+14:11:52 [build] Collecting build info...
+14:11:52 [build] ✓ Completed in 311ms.
+14:11:52 [build] Building static entrypoints...
+Browserslist: caniuse-lite is outdated. Please run:
+npx update-browserslist-db@latest
+Why you should do it regularly: https://github.com/browserslist/update-db#readme
+14:11:53 [vite] ✓ built in 1.26s
+14:11:53 [build] ✓ Completed in 1.27s.
+
+building client (vite)
+14:11:53 [vite] transforming...
+14:11:53 [vite] ✓ 13 modules transformed.
+14:11:53 [vite] rendering chunks...
+14:11:53 [vite] computing gzip size...
+14:11:53 [vite] dist/\_astro/ClientRouter.astro_astro_type_script_index_0_lang.DZnDNxNb.js 14.84 kB │ gzip: 5.11 kB
+14:11:53 [vite] ✓ built in 30ms
+
+generating static routes
+14:11:54 ▶ src/pages/404.astro
+14:11:54 └─ /404.html (+5ms)
+14:11:54 ▶ src/pages/about.astro
+14:11:54 └─ /about/index.html (+4ms)
+14:11:54 ▶ src/pages/drafts.astro
+14:11:54 └─ /drafts/index.html (+12ms)
+14:11:54 ▶ src/pages/highlights.astro
+14:11:54 └─ /highlights/index.html (+2ms)
+14:11:54 ▶ src/pages/projects.astro
+14:11:54 └─ /projects/index.html (+1ms)
+14:11:54 λ src/pages/rss.xml.ts
+14:11:54 └─ /rss.xml (+1ms)
+14:11:54 ▶ src/pages/tags.astro
+14:11:54 └─ /tags/index.html (+2ms)
+14:11:54 ▶ src/pages/[...blog]/[category]/[...page].astro
+14:11:54 ▶ src/pages/[...blog]/[tag]/[...page].astro
+14:11:54 ├─ /tag/life/index.html (+2ms)
+14:11:54 ├─ /tag/life/all/index.html (+2ms)
+14:11:54 ├─ /tag/life/per/25/index.html (+1ms)
+14:11:54 ├─ /tag/life/all/per/25/index.html (+1ms)
+14:11:54 ├─ /tag/life/per/50/index.html (+1ms)
+14:11:54 ├─ /tag/life/all/per/50/index.html (+1ms)
+14:11:54 ├─ /tag/life/per/all/index.html (+1ms)
+14:11:54 ├─ /tag/life/all/per/all/index.html (+1ms)
+14:11:54 ├─ /tag/law/index.html (+1ms)
+14:11:54 ├─ /tag/law/all/index.html (+1ms)
+14:11:54 ├─ /tag/law/per/25/index.html (+1ms)
+14:11:54 ├─ /tag/law/all/per/25/index.html (+1ms)
+14:11:54 ├─ /tag/law/per/50/index.html (+1ms)
+14:11:54 ├─ /tag/law/all/per/50/index.html (+1ms)
+14:11:54 ├─ /tag/law/per/all/index.html (+1ms)
+14:11:54 ├─ /tag/law/all/per/all/index.html (+1ms)
+14:11:54 ├─ /tag/ai/index.html (+1ms)
+14:11:54 ├─ /tag/ai/2/index.html (+1ms)
+14:11:54 ├─ /tag/ai/all/index.html (+3ms)
+14:11:54 ├─ /tag/ai/all/2/index.html (+1ms)
+14:11:54 ├─ /tag/ai/per/25/index.html (+1ms)
+14:11:54 ├─ /tag/ai/all/per/25/index.html (+2ms)
+14:11:54 ├─ /tag/ai/per/50/index.html (+1ms)
+14:11:54 ├─ /tag/ai/all/per/50/index.html (+1ms)
+14:11:54 ├─ /tag/ai/per/all/index.html (+1ms)
+14:11:54 ├─ /tag/ai/all/per/all/index.html (+2ms)
+14:11:54 ├─ /tag/tech/index.html (+1ms)
+14:11:54 ├─ /tag/tech/2/index.html (+1ms)
+14:11:54 ├─ /tag/tech/3/index.html (+1ms)
+14:11:54 ├─ /tag/tech/all/index.html (+2ms)
+14:11:54 ├─ /tag/tech/all/2/index.html (+3ms)
+14:11:54 ├─ /tag/tech/all/3/index.html (+1ms)
+14:11:54 ├─ /tag/tech/per/25/index.html (+2ms)
+14:11:54 ├─ /tag/tech/per/25/2/index.html (+1ms)
+14:11:54 ├─ /tag/tech/all/per/25/index.html (+2ms)
+14:11:54 ├─ /tag/tech/all/per/25/2/index.html (+1ms)
+14:11:54 ├─ /tag/tech/per/50/index.html (+1ms)
+14:11:54 ├─ /tag/tech/all/per/50/index.html (+1ms)
+14:11:54 ├─ /tag/tech/per/all/index.html (+1ms)
+14:11:54 ├─ /tag/tech/all/per/all/index.html (+3ms)
+14:11:54 ├─ /tag/ariadne/index.html (+1ms)
+14:11:54 ├─ /tag/ariadne/all/index.html (+1ms)
+14:11:54 ├─ /tag/ariadne/per/25/index.html (+1ms)
+14:11:54 ├─ /tag/ariadne/all/per/25/index.html (+1ms)
+14:11:54 ├─ /tag/ariadne/per/50/index.html (+1ms)
+14:11:54 ├─ /tag/ariadne/all/per/50/index.html (+1ms)
+14:11:54 ├─ /tag/ariadne/per/all/index.html (+1ms)
+14:11:54 ├─ /tag/ariadne/all/per/all/index.html (+1ms)
+14:11:54 ├─ /tag/philosophy/index.html (+1ms)
+14:11:54 ├─ /tag/philosophy/all/index.html (+1ms)
+14:11:54 ├─ /tag/philosophy/per/25/index.html (+1ms)
+14:11:54 ├─ /tag/philosophy/all/per/25/index.html (+1ms)
+14:11:54 ├─ /tag/philosophy/per/50/index.html (+1ms)
+14:11:54 ├─ /tag/philosophy/all/per/50/index.html (+1ms)
+14:11:54 ├─ /tag/philosophy/per/all/index.html (+1ms)
+14:11:54 └─ /tag/philosophy/all/per/all/index.html (+1ms)
+14:11:54 ▶ src/pages/[...blog]/[...page].astro
+14:11:54 ├─ /blog/index.html (+1ms)
+14:11:54 ├─ /blog/2/index.html (+1ms)
+14:11:54 ├─ /blog/3/index.html (+1ms)
+14:11:54 ├─ /blog/4/index.html (+1ms)
+14:11:54 ├─ /blog/5/index.html (+1ms)
+14:11:54 ├─ /blog/all/index.html (+1ms)
+14:11:54 ├─ /blog/all/2/index.html (+1ms)
+14:11:54 ├─ /blog/all/3/index.html (+1ms)
+14:11:54 ├─ /blog/all/4/index.html (+1ms)
+14:11:54 ├─ /blog/all/5/index.html (+1ms)
+14:11:54 ├─ /blog/all/6/index.html (+1ms)
+14:11:54 ├─ /blog/per/25/index.html (+2ms)
+14:11:54 ├─ /blog/per/25/2/index.html (+3ms)
+14:11:54 ├─ /blog/all/per/25/index.html (+2ms)
+14:11:54 ├─ /blog/all/per/25/2/index.html (+1ms)
+14:11:54 ├─ /blog/all/per/25/3/index.html (+1ms)
+14:11:54 ├─ /blog/per/50/index.html (+2ms)
+14:11:54 ├─ /blog/all/per/50/index.html (+3ms)
+14:11:54 ├─ /blog/all/per/50/2/index.html (+1ms)
+14:11:54 ├─ /blog/per/all/index.html (+2ms)
+14:11:54 └─ /blog/all/per/all/index.html (+2ms)
+14:11:54 ▶ src/pages/index.astro
+14:11:54 └─ /index.html (+2ms)
+14:11:54 ▶ src/pages/[...blog]/index.astro
+14:11:54 ├─ /2030/01/project-render-published-test/index.html (+4ms)
+14:11:54 ├─ /2030/01/project-render-nonproject-test/index.html (+1ms)
+14:11:54 ├─ /2026/06/birthright-citizenship-ruling/index.html (+1ms)
+14:11:54 ├─ /2026/06/skill-binary-and-dynamic-skill/index.html (+1ms)
+14:11:54 ├─ /2026/06/a-blogging-workflow/index.html (+1ms)
+14:11:54 ├─ /2026/06/the-case-for-space-data-center/index.html (+1ms)
+14:11:54 ├─ /2026/06/the-value-of-personal-data/index.html (+1ms)
+14:11:54 ├─ /2026/05/a-saturday-coding-session/index.html (+1ms)
+14:11:54 ├─ /2026/05/saturday-pair-transcript/index.html (+1ms)
+14:11:54 ├─ /2026/04/ai-native-company/index.html (+3ms)
+14:11:54 ├─ /2026/04/personal-brain-extension/index.html (+1ms)
+14:11:54 ├─ /2026/04/a-new-home/index.html (+1ms)
+14:11:54 ├─ /2026/04/tale-of-two-harness/index.html (+1ms)
+14:11:54 ├─ /2026/04/whatsapp_gdpr_fine/index.html (+1ms)
+14:11:54 ├─ /2026/04/loom_workflow_system/index.html (+1ms)
+14:11:54 ├─ /2026/04/vision_alignment_tools/index.html (+1ms)
+14:11:54 ├─ /2026/04/what_is_graphviz_dot_language/index.html (+2ms)
+14:11:54 ├─ /2026/03/agentic_state_management/index.html (+1ms)
+14:11:54 ├─ /2026/03/ai-coding-workflow2/index.html (+1ms)
+14:11:54 ├─ /2026/03/further_on_the_ideal_of_logmd/index.html (+1ms)
+14:11:54 ├─ /2026/03/the-rise-of-personal-software/index.html (+1ms)
+14:11:54 ├─ /2026/03/ai-coding-workflow/index.html (+1ms)
+14:11:54 ├─ /2026/02/dawn-of-ai-coding/index.html (+1ms)
+14:11:54 ├─ /2026/02/ai-as-new-abstraction/index.html (+1ms)
+14:11:54 ├─ /2026/02/to-type-or-not/index.html (+1ms)
+14:11:54 ├─ /2026/02/data-vs-anecdotes/index.html (+1ms)
+14:11:54 ├─ /2025/11/organic-process/index.html (+1ms)
+14:11:54 ├─ /2025/11/when-judgement-slips/index.html (+1ms)
+14:11:54 ├─ /2025/11/trump-tariff/index.html (+1ms)
+14:11:54 ├─ /2025/10/how-to-parli/index.html (+1ms)
+14:11:54 ├─ /2025/10/high-output-management/index.html (+1ms)
+14:11:54 ├─ /2025/09/birthright-citizenship-v2/index.html (+1ms)
+14:11:54 ├─ /2025/09/this-is-the-way/index.html (+1ms)
+14:11:54 ├─ /2025/09/operation-principles/index.html (+1ms)
+14:11:54 ├─ /2025/09/whatsapp-architecture/index.html (+1ms)
+14:11:54 ├─ /2025/08/gerrymandering-war/index.html (+1ms)
+14:11:54 ├─ /2025/08/glass-half-full/index.html (+1ms)
+14:11:54 ├─ /2025/05/joining-nexhealth/index.html (+1ms)
+14:11:54 ├─ /2025/05/ai-coding-take-2/index.html (+1ms)
+14:11:54 ├─ /2025/05/conversation_around_concurrent_programming_models/index.html (+1ms)
+14:11:54 ├─ /2025/05/birthright-citizenship/index.html (+1ms)
+14:11:54 ├─ /2025/05/facebook-move-on/index.html (+1ms)
+14:11:54 ├─ /2025/04/in-love-of-desert/index.html (+1ms)
+14:11:54 ├─ /2025/04/reflection-on-ai-coding/index.html (+1ms)
+14:11:54 ├─ /2025/04/claude-code/index.html (+1ms)
+14:11:54 ├─ /2025/04/chatgpt-in-neovim-collab/index.html (+1ms)
+14:11:54 ├─ /2025/04/chatgpt-in-neovim/index.html (+1ms)
+14:11:54 ├─ /2025/04/culture-wa/index.html (+1ms)
+14:11:54 ├─ /2025/02/astro-photo/index.html (+1ms)
+14:11:54 ├─ /2025/02/money-power-happiness-at-work/index.html (+1ms)
+14:11:54 ├─ /2025/01/githubio-blogging/index.html (+1ms)
+14:11:54 ├─ /2025/01/dot-files/index.html (+1ms)
+14:11:54 └─ /2024/12/hello-world/index.html (+2ms)
+14:11:54 ✓ Completed in 227ms.
+
+generating optimized images
+14:11:54 ▶ /\_astro/about-sky.CoK26dYp_Z17NqQE.webp (reused cache entry) (+1ms) (1/3)
+14:11:54 ▶ /\_astro/about-sky.CoK26dYp_uvaSx.webp (reused cache entry) (+1ms) (2/3)
+14:11:54 ▶ /\_astro/about-sky.CoK26dYp_Wy3Vv.webp (reused cache entry) (+1ms) (3/3)
+14:11:54 ✓ Completed in 3ms.
+
+14:11:54 [@astrojs/sitemap] `sitemap-index.xml` created at `dist`
+✓ Successfully compressed a total of 2 CSS files for 651 Bytes.
+14:11:58 [build] Waiting for integration "astro-compress", hook "astro:build:done"...
+✓ Successfully compressed a total of 138 HTML files for 665.36 KB.
+14:11:58 [astrowind] Updating `robots.txt` with `sitemap-index.xml` ...
+14:11:58 [build] 137 page(s) built in 6.62s
+14:11:58 [build] Complete!
+
+exec
+/bin/zsh -lc "nl -ba workshop/plans/000002-open-source-projects-tab-plan.md | sed -n '1,65p'; nl -ba workshop/issues/000002-open-source-projects-tab.md | sed -n '15,95p'; git status --short; test "'! -e src/data/post/project-render-published-test.md && test ! -e src/data/post/project-render-nonproject-test.md && test ! -e src/data/post/project-render-draft-test.md && echo fixtures-cleaned' in /Users/xianxu/workspace/xianxu.dev
+succeeded in 0ms:
+1 # Open-source Projects Tab Implementation Plan
+2
+3 > **For agentic workers:** Consult AGENTS.md Section 3 (Subagent Strategy) to determine the appropriate execution approach: use superpowers-subagent-driven-development (if subagents are suitable per AGENTS.md) or superpowers-executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.
+4
+5 **Goal:** Add a Projects tab that surfaces canonical blog-post introductions to Xian's open-source projects and links directly to their GitHub repositories.
+6
+7 **Architecture:** Extend the existing post schema and normalized `Post` model with optional `project.github` metadata, then reuse the existing blog list for a filtered `/projects` page. A display-context flag enables GitHub links only on that page, keeping the shared renderer as the single implementation (`ARCH-DRY`) and selection as a pure predicate (`ARCH-PURE`). A process-level build assertion covers the complete static rendering path without introducing a test framework.
+8
+9 **Tech Stack:** Astro 5 content collections, TypeScript, Zod, Astro components, Tailwind CSS.
+10
+11 ---
+12
+13 ## Core concepts
+14
+15 ### Pure entities
+16
+17 | Name | Lives in | Status |
+18 | ----------------- | ------------------------------------------------------------- | -------- |
+19 | `ProjectMetadata` | `src/content/config.ts`, `src/types.d.ts` and 42shots mirrors | new |
+20 | Normalized `Post` | `src/utils/blog.ts` and 42shots mirror | modified |
+21
+22 - **ProjectMetadata** — optional metadata marking a post as the canonical introduction to an open-source project.
+23 - **Relationships:** A post has zero or one project record; a project record has exactly one GitHub URL.
+24 - **DRY rationale:** The nested object is the sole marker and destination, avoiding independent boolean and URL fields that can disagree (`ARCH-DRY`).
+25 - **Future extensions:** Optional project destinations such as a homepage can widen this object without changing marker semantics.
+26 - **Normalized `Post`** — the existing renderer-facing representation gains the project record.
+27 - **Relationships:** One content entry normalizes to one `Post`; all consumers share it.
+28 - **DRY rationale:** Metadata travels through the existing normalization boundary rather than being re-read by the Projects page (`ARCH-PURPOSE`).
+29 - **Future extensions:** None planned for version one.
+30
+31 Validation runs through Astro's schema/type checks and production build. This repository has no unit-test harness; adding one solely for a declarative Zod field would exceed this feature's scope.
+32
+33 ### Integration points
+34
+35 | Name | Lives in | Status | Wraps |
+36 | ------------------------ | ------------------------------------------------------------------------------------------ | -------- | ----------------------------------------- |
+37 | Project-aware blog list | `src/components/blog/List.astro`, `src/components/blog/ListItem.astro` and 42shots mirrors | modified | Astro rendering |
+38 | Projects route | `src/pages/projects.astro` and 42shots mirror | new | Static page generation |
+39 | Projects build assertion | `scripts/test-projects-page.sh` and 42shots mirror | new | Temporary content fixtures + static build |
+40 | Primary navigation | `src/navigation.ts` | modified | Site navigation |
+41
+42 - **Project-aware blog list** — accepts an optional display flag and renders a direct GitHub link when enabled.
+43 - **Injected into:** The Projects page passes the flag; existing consumers retain current output.
+44 - **Future extensions:** Other project metadata can use the same context without forking the list.
+45 - **Projects route** — fetches published posts, applies `post.project !== undefined`, and hands them to the shared list.
+46 - **Injected into:** Astro's static route build.
+47 - **Future extensions:** None until project count demonstrates a need for grouping or filtering.
+48 - **Primary navigation** — exposes the route between Highlights and Archive.
+49 - **Injected into:** The existing Header through `headerData`.
+50 - **Future extensions:** None.
+51 - **Projects build assertion** — creates controlled temporary project/non-project/draft posts, builds the site, asserts the Projects and ordinary-list HTML contracts, and removes fixtures through a shell trap.
+52 - **Injected into:** Local verification in each repository; no production runtime dependency.
+53 - **Future extensions:** Additional rendered contracts can be added when surfaced.
+54
+55 ## Chunk 1: Typed project metadata
+56
+57 ### Task 1: Extend the post data pipeline
+58
+59 **Files:**
+60
+61 - Modify: `src/content/config.ts`
+62 - Modify: `src/types.d.ts`
+63 - Modify: `src/utils/blog.ts`
+64 - Modify: `../42shots/src/content/config.ts`
+65 - Modify: `../42shots/src/types.d.ts`
+15
+16 The site presents writing through Highlights and Archive, but it has no durable,
+17 easy-to-find entry point for open-source projects. GitHub READMEs should remain
+18 the operational source for installation and usage; the site should surface the
+19 longer introductions, histories, design choices, and reflections already written
+20 as blog posts.
+21
+22 ## Spec
+23
+24 - Add an optional `project` object to post frontmatter. Version one contains one
+25 required field, `github`, validated as a URL. Omitting `project` means the post
+26 is not a canonical project introduction.
+27 - Carry that object through the normalized `Post` model so every consumer sees
+28 the same typed data.
+29 - Add a top-level `Projects` navigation item and a statically generated
+30 `/projects` page.
+31 - The page reuses the existing blog list and shows published posts with project
+32 metadata, newest first. Each project entry includes a direct GitHub link in
+33 addition to its ordinary post link.
+34 - `project` marks a substantial introduction, history, or reflection worth
+35 discovering from the Projects tab. Multiple posts may point at the same
+36 repository; version one does not impose repository identity or canonical-post
+37 rules.
+38 - Do not create a separate project collection, case-study renderer, filtering
+39 system, or new prose in version one.
+40 - Port the reusable post schema, normalization, list capability, and Projects
+41 route to `../42shots/` to keep the shared blog structure synchronized. Do not
+42 add the personal-site navigation item to 42shots; its business-site navigation
+43 is an intentional per-site difference.
+44
+45 ## Done when
+46
+47 - `project.github` is schema-validated and preserved by post normalization.
+48 - `/projects` lists only published project introductions and provides both the
+49 introduction and GitHub destinations.
+50 - `Projects` appears in the primary navigation.
+51 - Existing Highlights, Archive, and post rendering continue to build.
+52 - The shared capability is build-verified in both xianxu.dev and 42shots without
+53 disturbing 42shots's intentional navigation or content differences.
+54 - Published posts are annotated separately through the repo's `xx-fix`
+55 editorial protocol; choosing which projects to feature is not silently folded
+56 into the engine change.
+57
+58 ## Estimate
+59
+60 `estimate
+    61	model: estimate-logic-v3.1
+    62	familiarity: 1.0
+    63	item: issue-spec design=0.20 impl=0.08
+    64	item: typed-data-prototype design=0.20 impl=0.48
+    65	item: cross-repo-refactor-small design=0.30 impl=0.60
+    66	item: cross-cutting-refactor design=0.15 impl=0.30
+    67	item: milestone-review design=0.00 impl=0.20
+    68	design-buffer: 0.15
+    69	total: 2.64
+    70	`
+71
+72 _Produced via `brain/data/life/42shots/velocity/estimate-logic-v3.1.md` against `baseline-v3.1.md`. Method A only._
+73
+74 ## Plan
+75
+76 - [x] Extend and verify the typed post pipeline for optional project metadata.
+77 - [x] Reuse the blog list to render project introductions with contextual GitHub links.
+78 - [x] Add the Projects page and navigation entry, then build-verify the site.
+79
+80 ## Log
+81
+82 ### 2026-07-14
+83
+84 - Approved direction: projects remain blog posts; `project.github` marks the one
+85 canonical introduction for an open-source project. `ARCH-DRY` rules out a
+86 parallel content collection, `ARCH-PURE` keeps selection as a simple predicate
+87 over normalized posts, and `ARCH-PURPOSE` requires the GitHub destination to
+88 survive schema → normalization → page rendering rather than exist as inert
+89 frontmatter.
+90 - Implemented the optional nested schema and normalized `Post` field, reused the
+91 shared list with an opt-in GitHub link, and added `/projects` plus personal-site
+92 navigation. Mirrored the shared engine, page, and test surface to 42shots
+93 (`ARCH-DRY`, `ARCH-PURPOSE`).
+94 - TDD evidence: invalid `project.github` failed Astro content validation; the
+95 corrected URL passed content synchronization. The committed process-level test
+?? src/data/post/parley.md
+fixtures-cleaned
+
+codex
+
+```verdict
+verdict: REWORK
+confidence: high
+```
+
+The feature behavior matches most of the issue: typed metadata flows through normalization, published project posts remain newest-first, the shared renderer adds contextual GitHub links, and the process test passes. Two boundary blockers remain: the test can overwrite and delete pre-existing files, and the plan incorrectly classifies normalization as PURE. Documentation and assertion gaps should also be addressed before re-review.
+
+## 1. Strengths
+
+- [projects.astro](/Users/xianxu/workspace/xianxu.dev/src/pages/projects.astro:8) correctly reuses `fetchPosts()`, preserving its published-only, newest-first contract before filtering project posts.
+- [ListItem.astro](/Users/xianxu/workspace/xianxu.dev/src/components/blog/ListItem.astro:112) keeps project-link behavior opt-in and supplies an accessible label plus safe external-link attributes.
+- [blog.ts](/Users/xianxu/workspace/xianxu.dev/src/utils/blog.ts:58) carries the schema-validated value through the existing normalization boundary without introducing a parallel model.
+- The process-level test completed successfully and its fixtures were removed afterward. `git diff --check` also passed.
+
+## 2. Critical findings
+
+- [test-projects-page.sh](/Users/xianxu/workspace/xianxu.dev/scripts/test-projects-page.sh:5): The test writes to three fixed paths unconditionally, then deletes them in its exit trap. If any path already exists, running the test destroys repository content. Fix by refusing to start when any target exists, or use a uniquely named temporary fixture directory/files and derive the expected permalink. Preserve pre-existing state under all exit paths.
+
+- [plan](/Users/xianxu/workspace/xianxu.dev/workshop/plans/000002-open-source-projects-tab-plan.md:15): **ARCH-PURE** contradiction. “Normalized `Post`” is classified as a PURE entity, but its implementation calls Astro `render(post)` and is verified only through content synchronization/static builds. It is an integration boundary, not a pure entity. Reclassify normalization as INTEGRATION and describe the pure data/schema declarations separately. Per the supplied core-concepts contract, this requires a plan revision.
+
+## 3. Important findings
+
+- [test-projects-page.sh](/Users/xianxu/workspace/xianxu.dev/scripts/test-projects-page.sh:58): The test does not assert the ordinary introduction permalink, despite the plan explicitly claiming that coverage. It also checks `target` and `rel` anywhere in the page rather than on the fixture’s GitHub anchor, and does not pin newest-first ordering. Assert the complete relevant anchor markup or parse the HTML, and add a second published project fixture to verify ordering.
+
+- `atlas/` has no change in the review window for the new `project` metadata, `/projects` route, or contextual-rendering flow. Add the new surface to the appropriate atlas map and ensure `atlas/index.md` links it.
+
+- `README.md` has no change documenting the new author-facing `project.github` frontmatter key or Projects surface. The docs gate explicitly includes config keys; add concise authoring/usage documentation.
+
+## 4. Minor findings
+
+- [issue log](/Users/xianxu/workspace/xianxu.dev/workshop/issues/000002-open-source-projects-tab.md:84) still says “the one canonical introduction,” contradicting the current Spec’s allowance for multiple posts per repository.
+
+## 5. Test coverage notes
+
+The executed `./scripts/test-projects-page.sh .` passed and verified project inclusion, non-project/draft exclusion, GitHub URL rendering, and suppression of that URL on Highlights. The main production path is therefore exercised, but the destructive fixture handling must be fixed and the introduction-link, attribute association, and ordering assertions strengthened.
+
+## 6. Architectural notes for upcoming work
+
+- **ARCH-DRY — pass:** schema metadata, normalized data, and the existing shared list remain the single implementation path; no parallel project collection or renderer was introduced.
+- **ARCH-PURE — flag:** the plan misclassifies Astro-backed normalization as pure. The runtime implementation itself keeps selection simple, but the architecture record must reflect the IO boundary honestly.
+- **ARCH-PURPOSE — pass:** the metadata is enforced by schema validation and reaches the rendered Projects consumer; published selection, ordinary post links, and direct GitHub destinations are implemented. No shadow consumer in this repository restates project membership separately.
+
+## 7. Plan revision recommendations
+
+Append a `## Revisions` entry recording:
+
+- Reclassification of normalized-post construction from PURE to INTEGRATION because it invokes Astro rendering.
+- Safe, collision-proof temporary-fixture handling.
+- Expanded build assertions for the introduction permalink, anchor-specific attributes, and newest-first ordering.
+- Atlas and README updates for the new metadata and route.
+
+Also reconcile remaining “canonical/one introduction” language in the plan and issue Log with the Spec’s explicit multiple-posts-per-repository rule.
+tokens used
+41,525
+
+```verdict
+verdict: REWORK
+confidence: high
+```
+
+The feature behavior matches most of the issue: typed metadata flows through normalization, published project posts remain newest-first, the shared renderer adds contextual GitHub links, and the process test passes. Two boundary blockers remain: the test can overwrite and delete pre-existing files, and the plan incorrectly classifies normalization as PURE. Documentation and assertion gaps should also be addressed before re-review.
+
+## 1. Strengths
+
+- [projects.astro](/Users/xianxu/workspace/xianxu.dev/src/pages/projects.astro:8) correctly reuses `fetchPosts()`, preserving its published-only, newest-first contract before filtering project posts.
+- [ListItem.astro](/Users/xianxu/workspace/xianxu.dev/src/components/blog/ListItem.astro:112) keeps project-link behavior opt-in and supplies an accessible label plus safe external-link attributes.
+- [blog.ts](/Users/xianxu/workspace/xianxu.dev/src/utils/blog.ts:58) carries the schema-validated value through the existing normalization boundary without introducing a parallel model.
+- The process-level test completed successfully and its fixtures were removed afterward. `git diff --check` also passed.
+
+## 2. Critical findings
+
+- [test-projects-page.sh](/Users/xianxu/workspace/xianxu.dev/scripts/test-projects-page.sh:5): The test writes to three fixed paths unconditionally, then deletes them in its exit trap. If any path already exists, running the test destroys repository content. Fix by refusing to start when any target exists, or use a uniquely named temporary fixture directory/files and derive the expected permalink. Preserve pre-existing state under all exit paths.
+
+- [plan](/Users/xianxu/workspace/xianxu.dev/workshop/plans/000002-open-source-projects-tab-plan.md:15): **ARCH-PURE** contradiction. “Normalized `Post`” is classified as a PURE entity, but its implementation calls Astro `render(post)` and is verified only through content synchronization/static builds. It is an integration boundary, not a pure entity. Reclassify normalization as INTEGRATION and describe the pure data/schema declarations separately. Per the supplied core-concepts contract, this requires a plan revision.
+
+## 3. Important findings
+
+- [test-projects-page.sh](/Users/xianxu/workspace/xianxu.dev/scripts/test-projects-page.sh:58): The test does not assert the ordinary introduction permalink, despite the plan explicitly claiming that coverage. It also checks `target` and `rel` anywhere in the page rather than on the fixture’s GitHub anchor, and does not pin newest-first ordering. Assert the complete relevant anchor markup or parse the HTML, and add a second published project fixture to verify ordering.
+
+- `atlas/` has no change in the review window for the new `project` metadata, `/projects` route, or contextual-rendering flow. Add the new surface to the appropriate atlas map and ensure `atlas/index.md` links it.
+
+- `README.md` has no change documenting the new author-facing `project.github` frontmatter key or Projects surface. The docs gate explicitly includes config keys; add concise authoring/usage documentation.
+
+## 4. Minor findings
+
+- [issue log](/Users/xianxu/workspace/xianxu.dev/workshop/issues/000002-open-source-projects-tab.md:84) still says “the one canonical introduction,” contradicting the current Spec’s allowance for multiple posts per repository.
+
+## 5. Test coverage notes
+
+The executed `./scripts/test-projects-page.sh .` passed and verified project inclusion, non-project/draft exclusion, GitHub URL rendering, and suppression of that URL on Highlights. The main production path is therefore exercised, but the destructive fixture handling must be fixed and the introduction-link, attribute association, and ordering assertions strengthened.
+
+## 6. Architectural notes for upcoming work
+
+- **ARCH-DRY — pass:** schema metadata, normalized data, and the existing shared list remain the single implementation path; no parallel project collection or renderer was introduced.
+- **ARCH-PURE — flag:** the plan misclassifies Astro-backed normalization as pure. The runtime implementation itself keeps selection simple, but the architecture record must reflect the IO boundary honestly.
+- **ARCH-PURPOSE — pass:** the metadata is enforced by schema validation and reaches the rendered Projects consumer; published selection, ordinary post links, and direct GitHub destinations are implemented. No shadow consumer in this repository restates project membership separately.
+
+## 7. Plan revision recommendations
+
+Append a `## Revisions` entry recording:
+
+- Reclassification of normalized-post construction from PURE to INTEGRATION because it invokes Astro rendering.
+- Safe, collision-proof temporary-fixture handling.
+- Expanded build assertions for the introduction permalink, anchor-specific attributes, and newest-first ordering.
+- Atlas and README updates for the new metadata and route.
+
+Also reconcile remaining “canonical/one introduction” language in the plan and issue Log with the Spec’s explicit multiple-posts-per-repository rule.
diff --git a/workshop/plans/000002-open-source-projects-tab-plan.md b/workshop/plans/000002-open-source-projects-tab-plan.md
index 0540797..1342a70 100644
--- a/workshop/plans/000002-open-source-projects-tab-plan.md
+++ b/workshop/plans/000002-open-source-projects-tab-plan.md
@@ -4,7 +4,7 @@

 **Goal:** Add a Projects tab that surfaces canonical blog-post introductions to Xian's open-source projects and links directly to their GitHub repositories.

-**Architecture:** Extend the existing post schema and normalized `Post` model with optional `project.github` metadata, then reuse the existing blog list for a filtered `/projects` page. A display-context flag enables GitHub links only on that page, keeping the shared renderer as the single implementation (`ARCH-DRY`) and filtering as a pure predicate (`ARCH-PURE`).
+**Architecture:** Extend the existing post schema and normalized `Post` model with optional `project.github` metadata, then reuse the existing blog list for a filtered `/projects` page. A display-context flag enables GitHub links only on that page, keeping the shared renderer as the single implementation (`ARCH-DRY`) and selection as a pure predicate (`ARCH-PURE`). A process-level build assertion covers the complete static rendering path without introducing a test framework.

 **Tech Stack:** Astro 5 content collections, TypeScript, Zod, Astro components, Tailwind CSS.

@@ -14,45 +14,49 @@

 ### Pure entities

-| Name | Lives in | Status |
-|------|----------|--------|
-| `ProjectMetadata` | `src/content/config.ts`, `src/types.d.ts` and 42shots mirrors | new |
-| Normalized `Post` | `src/utils/blog.ts` and 42shots mirror | modified |
+| Name              | Lives in                                                      | Status |
+| ----------------- | ------------------------------------------------------------- | ------ |
+| `ProjectMetadata` | `src/content/config.ts`, `src/types.d.ts` and 42shots mirrors | new    |

-- **ProjectMetadata** — optional metadata marking a post as the canonical introduction to an open-source project.
+- **ProjectMetadata** — optional metadata marking a substantial project introduction or reflection for discovery.
   - **Relationships:** A post has zero or one project record; a project record has exactly one GitHub URL.
   - **DRY rationale:** The nested object is the sole marker and destination, avoiding independent boolean and URL fields that can disagree (`ARCH-DRY`).
   - **Future extensions:** Optional project destinations such as a homepage can widen this object without changing marker semantics.
-- **Normalized `Post`** — the existing renderer-facing representation gains the project record.
-  - **Relationships:** One content entry normalizes to one `Post`; all consumers share it.
-  - **DRY rationale:** Metadata travels through the existing normalization boundary rather than being re-read by the Projects page (`ARCH-PURPOSE`).
-  - **Future extensions:** None planned for version one.

 Validation runs through Astro's schema/type checks and production build. This repository has no unit-test harness; adding one solely for a declarative Zod field would exceed this feature's scope.

 ### Integration points

-| Name | Lives in | Status | Wraps |
-|------|----------|--------|-------|
-| Project-aware blog list | `src/components/blog/List.astro`, `src/components/blog/ListItem.astro` and 42shots mirrors | modified | Astro rendering |
-| Projects route | `src/pages/projects.astro` and 42shots mirror | new | Static page generation |
-| Primary navigation | `src/navigation.ts` | modified | Site navigation |
+| Name                     | Lives in                                                                                   | Status   | Wraps                                     |
+| ------------------------ | ------------------------------------------------------------------------------------------ | -------- | ----------------------------------------- |
+| Project-aware blog list  | `src/components/blog/List.astro`, `src/components/blog/ListItem.astro` and 42shots mirrors | modified | Astro rendering                           |
+| Post normalization       | `src/utils/blog.ts` and 42shots mirror                                                     | modified | Astro content rendering                   |
+| Projects route           | `src/pages/projects.astro` and 42shots mirror                                              | new      | Static page generation                    |
+| Projects build assertion | `scripts/test-projects-page.sh` and 42shots mirror                                         | new      | Temporary content fixtures + static build |
+| Primary navigation       | `src/navigation.ts`                                                                        | modified | Site navigation                           |

 - **Project-aware blog list** — accepts an optional display flag and renders a direct GitHub link when enabled.
   - **Injected into:** The Projects page passes the flag; existing consumers retain current output.
   - **Future extensions:** Other project metadata can use the same context without forking the list.
+- **Post normalization** — carries schema-validated project metadata through the existing Astro `render(post)` boundary into `Post`.
+  - **Injected into:** All post consumers through `fetchPosts()` / `fetchAllPosts()`.
+  - **Future extensions:** None planned for version one.
 - **Projects route** — fetches published posts, applies `post.project !== undefined`, and hands them to the shared list.
   - **Injected into:** Astro's static route build.
   - **Future extensions:** None until project count demonstrates a need for grouping or filtering.
 - **Primary navigation** — exposes the route between Highlights and Archive.
   - **Injected into:** The existing Header through `headerData`.
   - **Future extensions:** None.
+- **Projects build assertion** — creates controlled temporary project/non-project/draft posts, builds the site, asserts the Projects and ordinary-list HTML contracts, and removes fixtures through a shell trap.
+  - **Injected into:** Local verification in each repository; no production runtime dependency.
+  - **Future extensions:** Additional rendered contracts can be added when surfaced.

 ## Chunk 1: Typed project metadata

 ### Task 1: Extend the post data pipeline

 **Files:**
+
 - Modify: `src/content/config.ts`
 - Modify: `src/types.d.ts`
 - Modify: `src/utils/blog.ts`
@@ -60,17 +64,17 @@ Validation runs through Astro's schema/type checks and production build. This re
 - Modify: `../42shots/src/types.d.ts`
 - Modify: `../42shots/src/utils/blog.ts`

-- [ ] **Step 1: Define the project metadata schema and normalized type**
+- [x] **Step 1: Define the project metadata schema and normalized type**

 Add `project: z.object({ github: z.string().url() }).optional()` to the post schema, add matching `ProjectMetadata` and `Post.project` types, then destructure and return `project` in `getNormalizedPost`. Mirror these shared engine changes in 42shots (`ARCH-DRY`).

-- [ ] **Step 2: Add an invalid temporary project fixture and verify URL validation fails**
+- [x] **Step 2: Add an invalid temporary project fixture and verify URL validation fails**

 Create a temporary published Markdown fixture with `project.github: not-a-url`, then run: `npm run check:astro`

 Expected: FAIL with a Zod URL-validation error for the fixture.

-- [ ] **Step 3: Correct the fixture and verify the typed pipeline**
+- [x] **Step 3: Correct the fixture and verify the typed pipeline**

 Change the fixture to a valid GitHub URL and give it a distinctive title/permalink value.

@@ -85,41 +89,45 @@ Keep the fixture through rendered-output verification, then remove it before fin
 ### Task 2: Add contextual GitHub links to the shared list

 **Files:**
+
 - Modify: `src/components/blog/List.astro`
 - Modify: `src/components/blog/ListItem.astro`
 - Modify: `../42shots/src/components/blog/List.astro`
 - Modify: `../42shots/src/components/blog/ListItem.astro`

-- [ ] **Step 1: Add `showProjectLink?: boolean` to both component props**
+- [x] **Step 1: Add `showProjectLink?: boolean` to both component props**

 Default it to `false` and pass it from `List` to each `Item`; mirror the shared component change in 42shots.

-- [ ] **Step 2: Render the project destination**
+- [x] **Step 2: Render the project destination**

 When the flag and `post.project` are present, render an accessible external GitHub link after the excerpt using the existing icon library and `rel="noopener noreferrer"`.

-- [ ] **Step 3: Run `npm run check:astro`**
+- [x] **Step 3: Run `npm run check:astro`**

 Expected: PASS with the new component contracts.

 ### Task 3: Add the Projects page and navigation

 **Files:**
+
 - Create: `src/pages/projects.astro`
 - Create: `../42shots/src/pages/projects.astro`
+- Create: `scripts/test-projects-page.sh`
+- Create: `../42shots/scripts/test-projects-page.sh`
 - Modify: `src/navigation.ts`

-- [ ] **Step 1: Create the static route**
+- [x] **Step 1: Create the static route**

 Mirror the restrained Highlights layout, filter `fetchPosts()` by project metadata, render `<List posts={posts} showProjectLink />`, and include a clear empty state. Port the route to 42shots for structural parity, but leave it unlinked there because its business-site navigation and content are intentional differences.

-- [ ] **Step 2: Add `Projects` after `Highlights` in primary navigation**
+- [x] **Step 2: Add `Projects` after `Highlights` in primary navigation**

-- [ ] **Step 3: Verify the rendered feature path with the temporary fixture**
+- [x] **Step 3: Verify the rendered feature path with the temporary fixture**

-Run `npm run build`, then assert `dist/projects/index.html` contains the fixture's introduction permalink and exact GitHub URL. Also assert it excludes a known published non-project post and a temporary draft project fixture. This verifies schema → normalization → published selection → contextual anchor (`ARCH-PURPOSE`).
+Implement `scripts/test-projects-page.sh` as a committed deterministic test. It creates temporary published-project, published-non-project, and draft-project fixtures under the target repo, registers a trap that removes them, runs `npm run build`, then uses `rg` assertions against generated HTML. Assert `dist/projects/index.html` contains the published project's introduction permalink and exact GitHub URL, its anchor has an accessible label plus `target="_blank"` and `rel="noopener noreferrer"`, and it excludes the published non-project and draft project. Assert a normal list page does not contain that GitHub URL, proving `showProjectLink` defaults false. Mirror the script in 42shots and run `scripts/test-projects-page.sh` in each repository. This verifies schema → normalization → published selection → contextual anchor in both repositories (`ARCH-PURPOSE`).

-- [ ] **Step 4: Remove temporary fixtures and run full verification**
+- [x] **Step 4: Remove temporary fixtures and run full verification**

 Run: `npm run check`

@@ -131,6 +139,33 @@ Expected: PASS and output includes `/projects/index.html` while Highlights and A

 In `../42shots`, run `npm run check` and `npm run build`; expect both to pass and `/projects/index.html` to be generated. Preserve the operator's existing unrelated modification to `src/pages/[...blog]/[...page].astro`.

-- [ ] **Step 5: Record evidence and commit**
+- [x] **Step 5: Record evidence and commit**

 Update issue #2's checklist and Log with verification evidence. Commit with an issue-scoped message and a `Co-Authored-By:` trailer naming the authoring model.
+
+## Revisions
+
+### 2026-07-14 14:10 PDT — change-code plan-quality gate
+
+- Added pure canonical-project selection with duplicate GitHub URL rejection.
+- Expanded generated-output assertions to cover accessibility, external-link
+  safety, default ordinary-list behavior, and equivalent 42shots fixtures.
+- Re-estimated the now-explicit cross-repository implementation and verification.
+
+### 2026-07-14 14:18 PDT — simplicity correction after gate review
+
+- Removed canonical URL/post enforcement because it was not part of the
+  operator's discoverability goal and would preclude multiple useful essays per
+  repository.
+- Added an explicit committed build-assertion script, mirrored and executed in
+  both repositories, so the rendered behavior remains reproducible after
+  temporary fixtures are removed.
+
+### 2026-07-14 14:25 PDT — boundary review
+
+- Reclassified normalized-post construction from PURE to INTEGRATION because it
+  invokes Astro rendering.
+- Made fixture setup refuse collisions before registering cleanup and expanded
+  assertions for the introduction permalink, anchor-specific attributes, and
+  newest-first ordering.
+- Added README and atlas documentation for the author-facing metadata and route.


codex
I’m using the repository’s SDLC review protocol to independently re-check the current base-to-HEAD window, tracker, implementation, and executable evidence.
exec
/bin/zsh -lc "sed -n '1,260p' /Users/xianxu/workspace/ariadne/construct/adapted/superpowers-using-superpowers/SKILL.md && sed -n '1,260p' /Users/xianxu/workspace/ariadne/construct/local/sdlc/SKILL.md && sdlc --help && sed -n '1,200p' workshop/lessons.md" in /Users/xianxu/workspace/xianxu.dev
 succeeded in 0ms:
---
name: superpowers-using-superpowers
description: Use when starting any conversation - establishes how to find and use skills, requiring Skill tool invocation before ANY response including clarifying questions
---

<SUBAGENT-STOP>
If you were dispatched as a subagent to execute a specific task, skip this skill.
</SUBAGENT-STOP>

<EXTREMELY-IMPORTANT>
If you think there is even a 1% chance a skill might apply to what you are doing, you ABSOLUTELY MUST invoke the skill.

IF A SKILL APPLIES TO YOUR TASK, YOU DO NOT HAVE A CHOICE. YOU MUST USE IT.

This is not negotiable. This is not optional. You cannot rationalize your way out of this.
</EXTREMELY-IMPORTANT>

## Instruction Priority

> **Ariadne note:** AGENTS.md Section 3 governs subagent strategy and overrides skills that mandate subagent-driven-development as the default execution path.

Superpowers skills override default system prompt behavior, but **user instructions always take precedence**:

1. **User's explicit instructions** (CLAUDE.md, GEMINI.md, AGENTS.md, direct requests) — highest priority
2. **Superpowers skills** — override default system behavior where they conflict
3. **Default system prompt** — lowest priority

If CLAUDE.md, GEMINI.md, or AGENTS.md says "don't use TDD" and a skill says "always use TDD," follow the user's instructions. The user is in control.

## How to Access Skills

**In Claude Code:** Use the `Skill` tool. When you invoke a skill, its content is loaded and presented to you—follow it directly. Never use the Read tool on skill files.

**In Gemini CLI:** Skills activate via the `activate_skill` tool. Gemini loads skill metadata at session start and activates the full content on demand.

**In other environments:** Check your platform's documentation for how skills are loaded.

## Platform Adaptation

Skills use Claude Code tool names. Non-CC platforms: see `references/codex-tools.md` (Codex) for tool equivalents. Gemini CLI users get the tool mapping loaded automatically via GEMINI.md.

# Using Skills

## The Rule

**Invoke relevant or requested skills BEFORE any response or action.** Even a 1% chance a skill might apply means that you should invoke the skill to check. If an invoked skill turns out to be wrong for the situation, you don't need to use it.

```dot
digraph skill_flow {
    "User message received" [shape=doublecircle];
    "About to EnterPlanMode?" [shape=doublecircle];
    "Already brainstormed?" [shape=diamond];
    "Invoke brainstorming skill" [shape=box];
    "Might any skill apply?" [shape=diamond];
    "Invoke Skill tool" [shape=box];
    "Announce: 'Using [skill] to [purpose]'" [shape=box];
    "Has checklist?" [shape=diamond];
    "Create TodoWrite todo per item" [shape=box];
    "Follow skill exactly" [shape=box];
    "Respond (including clarifications)" [shape=doublecircle];

    "About to EnterPlanMode?" -> "Already brainstormed?";
    "Already brainstormed?" -> "Invoke brainstorming skill" [label="no"];
    "Already brainstormed?" -> "Might any skill apply?" [label="yes"];
    "Invoke brainstorming skill" -> "Might any skill apply?";

    "User message received" -> "Might any skill apply?";
    "Might any skill apply?" -> "Invoke Skill tool" [label="yes, even 1%"];
    "Might any skill apply?" -> "Respond (including clarifications)" [label="definitely not"];
    "Invoke Skill tool" -> "Announce: 'Using [skill] to [purpose]'";
    "Announce: 'Using [skill] to [purpose]'" -> "Has checklist?";
    "Has checklist?" -> "Create TodoWrite todo per item" [label="yes"];
    "Has checklist?" -> "Follow skill exactly" [label="no"];
    "Create TodoWrite todo per item" -> "Follow skill exactly";
}
```

## Red Flags

These thoughts mean STOP—you're rationalizing:

| Thought | Reality |
|---------|---------|
| "This is just a simple question" | Questions are tasks. Check for skills. |
| "I need more context first" | Skill check comes BEFORE clarifying questions. |
| "Let me explore the codebase first" | Skills tell you HOW to explore. Check first. |
| "I can check git/files quickly" | Files lack conversation context. Check for skills. |
| "Let me gather information first" | Skills tell you HOW to gather information. |
| "This doesn't need a formal skill" | If a skill exists, use it. |
| "I remember this skill" | Skills evolve. Read current version. |
| "This doesn't count as a task" | Action = task. Check for skills. |
| "The skill is overkill" | Simple things become complex. Use it. |
| "I'll just do this one thing first" | Check BEFORE doing anything. |
| "This feels productive" | Undisciplined action wastes time. Skills prevent this. |
| "I know what that means" | Knowing the concept ≠ using the skill. Invoke it. |

## Skill Priority

When multiple skills could apply, use this order:

1. **Process skills first** (brainstorming, debugging) - these determine HOW to approach the task
2. **Implementation skills second** (frontend-design, mcp-builder) - these guide execution

"Let's build X" → brainstorming first, then implementation skills.
"Fix this bug" → debugging first, then domain-specific skills.

## Skill Types

**Rigid** (TDD, debugging): Follow exactly. Don't adapt away discipline.

**Flexible** (patterns): Adapt principles to context.

The skill itself tells you which.

## User Instructions

Instructions say WHAT, not HOW. "Add X" or "Fix Y" doesn't mean skip workflows.
---
name: sdlc
description: Use when at an SDLC checkpoint — starting work, closing an issue or milestone, opening/merging a PR, or recovering workflow state after compaction. The `sdlc` binary owns the gates between workflow stages and refuses transitions that lack required evidence.
---

# sdlc — SDLC checkpoint binary

`sdlc` owns the gates between SDLC workflow stages (claim → change-code → pr →
merge, plus close, milestone-close, judge). It requires evidence at each gate,
mutates state, logs the transition, and refuses transitions that lack the
evidence — that is the shape of a "checkpoint guard."

The binary is the single source of truth. This skill is a static pointer and
intentionally carries no copy of the contract, so it can never drift:

- **`sdlc --help`** — the workflow contract: the start-of-work runbook,
  conventions, and the verb list.
- **`sdlc <verb> --help`** — one checkpoint's full contract, flags, and examples.

Read those instead of relying on memory; the binary's help is always current.
sdlc collects ariadne's SDLC checkpoint guards into one binary. Each subcommand
owns one checkpoint: it requires evidence at the gate, mutates state, logs the
transition, and refuses transitions that lack it. We don't model the SDLC as a
state machine — stages stay prose; we codify the gates between them where drift
recurs. `sdlc` manages the development life cycle; prefer it over `git`/`gh`.

BEFORE WORK
  - `sdlc claim --issue N` — the single start-of-work gesture, a CHEAP LOCK.
    Flips an *open* issue to `working` and publishes the claim to origin/main so
    peer agents see it. No estimate demanded (#113) — claim early, the moment an
    idea crystallizes. `--no-start` suppresses the flip.
  - Do NOT hand-edit an issue's `status:` — let `sdlc claim` or `sdlc issue
    set-status` own that transition (it carries the reopen/`→ done` guards).

ENTER IMPLEMENTATION
  - After plan approval, before editing code, run `sdlc change-code`. It owns the
    branching decision (in-place branch by default; `--worktree=yes` for an
    isolated worktree), the plan-quality check, and the `estimate_hours` gate
    (relocated here from claim, #113). Don't start coding without it.

PUBLISH
  - Publishing goes through a PR: `sdlc pr` → `sdlc merge`. Direct `sdlc push`
    if working directly on main.
  - Publish ONCE at issue close, not per milestone — and do NOT reuse a branch
    name that already has a merged PR. `sdlc merge` refuses (#148) when a branch
    has commits not in main despite a merged PR (a reused name would otherwise
    silently strand the new commits); rename to a fresh branch, `sdlc pr`, retry.

RECOVER
  - After a compaction or session resume, run `sdlc state` to recover where you
    are instead of re-inferring from issue files.

LOCAL REPO TRANSACTION LOCK
  - Mutating verbs take an SDLC-owned repo transaction lock at
    `.git/sdlc.lock` before reading/writing issue state, committing, changing
    branches, or pushing. The lock is local to the Git common dir, so linked
    worktrees of the same repo serialize with each other.
  - Wait messages identify the holder pid and command when metadata is
    available. `close` and `milestone-close` release the lock while the external
    boundary-review subprocess runs, then reacquire before finalization; if HEAD
    or the issue/project file state they prepared changed meanwhile, they refuse
    to finalize and tell you to rerun. `change-code`, `merge`, and `push` can still hold the lock during
    long-running review/ship transactions; wait or retry rather than removing
    the lock while that process is alive.
  - A dead same-host holder is reclaimed automatically; initializing metadata
    is waited through. Other stale/timeout errors tell you how to inspect
    `.git/sdlc.lock`. Remote push/ref races are separate: the local lock
    serializes this checkout, not another machine or clone.

WHEN A VERB ERRORS
  Do NOT route around it with hand-rolled `git`/`gh`. Its errors are next-action
  specs. The fix is one of two things:
    (a) satisfy the precondition it names and re-run the same verb (e.g. `sdlc
        merge` saying "no upstream" → run `sdlc pr` first, then `sdlc merge`); or
    (b) if the error is a genuine gap in `sdlc` itself, fix that edge case in the
        source and re-run. We're still ironing out edge cases.
  Only drop to manual when a verb genuinely cannot express the need — say so.

These gates sit inside a wider prose arc the binary does NOT own: ideation
(parley/pensive) → brainstorm → plan → build → milestone review (`sdlc judge`,
auto-dispatched) → close/ship → postmortem.

CONVENTIONS

  --issue vs --github-issue — `--issue N` always means workshop/issues
  (6-digit ID). `--github-issue N` means a GitHub issue number. Bare `--issue`
  never means a GitHub issue.

  Form vs essence — checkpoint guards (close, milestone-close, push, merge)
  defend against *omission* via required-evidence flags; `sdlc judge` defends
  against *theater* via fresh-context review. Form runs first; judge second.

The verb list + per-verb help (`sdlc <verb> --help`) follow below.

Usage:
  sdlc [flags]
  sdlc [command]

Available Commands:
  claim           Start work: flip an open issue to working + broadcast the claim
  start-plan      Enter planning: deliver the architecture principles to design against (#75)
  change-code     Enter implementation after the structural + plan-quality gates
  issue           Create + manage issues (new / set-status / list / show)
  actual          Compute an issue's focused dev-hours via active-time-v3 (#68)
  active-time     Per-issue active-time attribution table (the v3 engine, standalone)
  close           Close an issue or milestone (ACTUAL + VERIFIED + atlas/project sweep)
  milestone-close Close one milestone + auto-dispatch its review
  pr              Open a pull request from a feature branch
  merge           Merge the PR, archive done issues, clean up
  push            Ship from main (clean tree + pre-merge judges + archive)
  state           Inspect workflow state (branch, working issues, drift)
  resolve         Resolve a symbolic artifact ref (ariadne#11, #15 M4) to its current path(s) — read-only
  open            Resolve a ref and open the primary artifact in $EDITOR
  judge           Run an LLM-judge check against the diff (fresh-context)
  arch-principles Print the ARCH-* architecture principles (single source; pull for non-gate work)
  estimate-source Name the shared estimate method + the repo-local calibration source (pull)
  process-manual  Unroll every injection source into a linked process manual (#153)
  propagate-base  Re-weave every recursive dependent of this repo (foundation-first)
  help            Help about any command

Flags:
  -h, --help   help for sdlc

Use "sdlc [command] --help" for more information about a command.
# Review lessons

- Test helpers that create fixed-path fixtures must refuse collisions before
  registering cleanup; otherwise a passing test can overwrite and delete real
  repository content.
- Classify code that invokes framework rendering or filesystem-backed content
  loading as an integration boundary, even when its output transformation is
  deterministic.

exec
/bin/zsh -lc "git status --short && git log --oneline 8e552f52728ad6c9c4e8b04b6891f230f6e8685f..HEAD && git diff --stat 8e552f52728ad6c9c4e8b04b6891f230f6e8685f..HEAD && git diff --name-status 8e552f52728ad6c9c4e8b04b6891f230f6e8685f..HEAD && sed -n '1,240p' workshop/issues/000002-open-source-projects-tab.md && sed -n '1,260p' workshop/plans/000002-open-source-projects-tab-plan.md" in /Users/xianxu/workspace/xianxu.dev
 succeeded in 0ms:
?? src/data/post/parley.md
468a0f7 plan: #2 reconcile project-post terminology
cac0b57 blog: #2 address project-tab boundary review
34ed1a4 blog: #2 add open-source projects tab
 README.md                                          |   13 +
 atlas/blog-surfaces.md                             |   17 +
 atlas/index.md                                     |    3 +
 scripts/test-projects-page.sh                      |   98 +
 src/components/blog/List.astro                     |    5 +-
 src/components/blog/ListItem.astro                 |   17 +-
 src/content/config.ts                              |    1 +
 src/navigation.ts                                  |    1 +
 src/pages/projects.astro                           |   28 +
 src/types.d.ts                                     |    7 +
 src/utils/blog.ts                                  |    2 +
 workshop/issues/000002-open-source-projects-tab.md |   33 +-
 workshop/lessons.md                                |    8 +
 ...000002-open-source-projects-tab-close-review.md | 2018 ++++++++++++++++++++
 .../plans/000002-open-source-projects-tab-plan.md  |   89 +-
 15 files changed, 2304 insertions(+), 36 deletions(-)
M	README.md
A	atlas/blog-surfaces.md
A	atlas/index.md
A	scripts/test-projects-page.sh
M	src/components/blog/List.astro
M	src/components/blog/ListItem.astro
M	src/content/config.ts
M	src/navigation.ts
A	src/pages/projects.astro
M	src/types.d.ts
M	src/utils/blog.ts
M	workshop/issues/000002-open-source-projects-tab.md
M	workshop/lessons.md
A	workshop/plans/000002-open-source-projects-tab-close-review.md
M	workshop/plans/000002-open-source-projects-tab-plan.md
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

_Produced via `brain/data/life/42shots/velocity/estimate-logic-v3.1.md` against `baseline-v3.1.md`. Method A only._

## Plan

- [x] Extend and verify the typed post pipeline for optional project metadata.
- [x] Reuse the blog list to render project introductions with contextual GitHub links.
- [x] Add the Projects page and navigation entry, then build-verify the site.

## Log

### 2026-07-14

- Approved direction: projects remain blog posts; `project.github` marks a
  substantial project introduction or reflection. `ARCH-DRY` rules out a
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

### 2026-07-14 14:25 PDT — boundary review

- Made test fixtures collision-safe and expanded assertions to cover the post
  permalink, anchor-specific safety/accessibility attributes, and newest-first
  ordering. Reclassified Astro-backed post normalization as an integration
  boundary, and documented the authoring surface in README and atlas.
# Open-source Projects Tab Implementation Plan

> **For agentic workers:** Consult AGENTS.md Section 3 (Subagent Strategy) to determine the appropriate execution approach: use superpowers-subagent-driven-development (if subagents are suitable per AGENTS.md) or superpowers-executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a Projects tab that surfaces canonical blog-post introductions to Xian's open-source projects and links directly to their GitHub repositories.

**Architecture:** Extend the existing post schema and normalized `Post` model with optional `project.github` metadata, then reuse the existing blog list for a filtered `/projects` page. A display-context flag enables GitHub links only on that page, keeping the shared renderer as the single implementation (`ARCH-DRY`) and selection as a pure predicate (`ARCH-PURE`). A process-level build assertion covers the complete static rendering path without introducing a test framework.

**Tech Stack:** Astro 5 content collections, TypeScript, Zod, Astro components, Tailwind CSS.

---

## Core concepts

### Pure entities

| Name              | Lives in                                                      | Status |
| ----------------- | ------------------------------------------------------------- | ------ |
| `ProjectMetadata` | `src/content/config.ts`, `src/types.d.ts` and 42shots mirrors | new    |

- **ProjectMetadata** — optional metadata marking a substantial project introduction or reflection for discovery.
  - **Relationships:** A post has zero or one project record; a project record has exactly one GitHub URL.
  - **DRY rationale:** The nested object is the sole marker and destination, avoiding independent boolean and URL fields that can disagree (`ARCH-DRY`).
  - **Future extensions:** Optional project destinations such as a homepage can widen this object without changing marker semantics.

Validation runs through Astro's schema/type checks and production build. This repository has no unit-test harness; adding one solely for a declarative Zod field would exceed this feature's scope.

### Integration points

| Name                     | Lives in                                                                                   | Status   | Wraps                                     |
| ------------------------ | ------------------------------------------------------------------------------------------ | -------- | ----------------------------------------- |
| Project-aware blog list  | `src/components/blog/List.astro`, `src/components/blog/ListItem.astro` and 42shots mirrors | modified | Astro rendering                           |
| Post normalization       | `src/utils/blog.ts` and 42shots mirror                                                     | modified | Astro content rendering                   |
| Projects route           | `src/pages/projects.astro` and 42shots mirror                                              | new      | Static page generation                    |
| Projects build assertion | `scripts/test-projects-page.sh` and 42shots mirror                                         | new      | Temporary content fixtures + static build |
| Primary navigation       | `src/navigation.ts`                                                                        | modified | Site navigation                           |

- **Project-aware blog list** — accepts an optional display flag and renders a direct GitHub link when enabled.
  - **Injected into:** The Projects page passes the flag; existing consumers retain current output.
  - **Future extensions:** Other project metadata can use the same context without forking the list.
- **Post normalization** — carries schema-validated project metadata through the existing Astro `render(post)` boundary into `Post`.
  - **Injected into:** All post consumers through `fetchPosts()` / `fetchAllPosts()`.
  - **Future extensions:** None planned for version one.
- **Projects route** — fetches published posts, applies `post.project !== undefined`, and hands them to the shared list.
  - **Injected into:** Astro's static route build.
  - **Future extensions:** None until project count demonstrates a need for grouping or filtering.
- **Primary navigation** — exposes the route between Highlights and Archive.
  - **Injected into:** The existing Header through `headerData`.
  - **Future extensions:** None.
- **Projects build assertion** — creates controlled temporary project/non-project/draft posts, builds the site, asserts the Projects and ordinary-list HTML contracts, and removes fixtures through a shell trap.
  - **Injected into:** Local verification in each repository; no production runtime dependency.
  - **Future extensions:** Additional rendered contracts can be added when surfaced.

## Chunk 1: Typed project metadata

### Task 1: Extend the post data pipeline

**Files:**

- Modify: `src/content/config.ts`
- Modify: `src/types.d.ts`
- Modify: `src/utils/blog.ts`
- Modify: `../42shots/src/content/config.ts`
- Modify: `../42shots/src/types.d.ts`
- Modify: `../42shots/src/utils/blog.ts`

- [x] **Step 1: Define the project metadata schema and normalized type**

Add `project: z.object({ github: z.string().url() }).optional()` to the post schema, add matching `ProjectMetadata` and `Post.project` types, then destructure and return `project` in `getNormalizedPost`. Mirror these shared engine changes in 42shots (`ARCH-DRY`).

- [x] **Step 2: Add an invalid temporary project fixture and verify URL validation fails**

Create a temporary published Markdown fixture with `project.github: not-a-url`, then run: `npm run check:astro`

Expected: FAIL with a Zod URL-validation error for the fixture.

- [x] **Step 3: Correct the fixture and verify the typed pipeline**

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

- [x] **Step 1: Add `showProjectLink?: boolean` to both component props**

Default it to `false` and pass it from `List` to each `Item`; mirror the shared component change in 42shots.

- [x] **Step 2: Render the project destination**

When the flag and `post.project` are present, render an accessible external GitHub link after the excerpt using the existing icon library and `rel="noopener noreferrer"`.

- [x] **Step 3: Run `npm run check:astro`**

Expected: PASS with the new component contracts.

### Task 3: Add the Projects page and navigation

**Files:**

- Create: `src/pages/projects.astro`
- Create: `../42shots/src/pages/projects.astro`
- Create: `scripts/test-projects-page.sh`
- Create: `../42shots/scripts/test-projects-page.sh`
- Modify: `src/navigation.ts`

- [x] **Step 1: Create the static route**

Mirror the restrained Highlights layout, filter `fetchPosts()` by project metadata, render `<List posts={posts} showProjectLink />`, and include a clear empty state. Port the route to 42shots for structural parity, but leave it unlinked there because its business-site navigation and content are intentional differences.

- [x] **Step 2: Add `Projects` after `Highlights` in primary navigation**

- [x] **Step 3: Verify the rendered feature path with the temporary fixture**

Implement `scripts/test-projects-page.sh` as a committed deterministic test. It creates temporary published-project, published-non-project, and draft-project fixtures under the target repo, registers a trap that removes them, runs `npm run build`, then uses `rg` assertions against generated HTML. Assert `dist/projects/index.html` contains the published project's introduction permalink and exact GitHub URL, its anchor has an accessible label plus `target="_blank"` and `rel="noopener noreferrer"`, and it excludes the published non-project and draft project. Assert a normal list page does not contain that GitHub URL, proving `showProjectLink` defaults false. Mirror the script in 42shots and run `scripts/test-projects-page.sh` in each repository. This verifies schema → normalization → published selection → contextual anchor in both repositories (`ARCH-PURPOSE`).

- [x] **Step 4: Remove temporary fixtures and run full verification**

Run: `npm run check`

Expected: Astro, ESLint, and Prettier checks pass.

Run: `npm run build`

Expected: PASS and output includes `/projects/index.html` while Highlights and Archive remain generated.

In `../42shots`, run `npm run check` and `npm run build`; expect both to pass and `/projects/index.html` to be generated. Preserve the operator's existing unrelated modification to `src/pages/[...blog]/[...page].astro`.

- [x] **Step 5: Record evidence and commit**

Update issue #2's checklist and Log with verification evidence. Commit with an issue-scoped message and a `Co-Authored-By:` trailer naming the authoring model.

## Revisions

### 2026-07-14 14:10 PDT — change-code plan-quality gate

- Added pure canonical-project selection with duplicate GitHub URL rejection.
- Expanded generated-output assertions to cover accessibility, external-link
  safety, default ordinary-list behavior, and equivalent 42shots fixtures.
- Re-estimated the now-explicit cross-repository implementation and verification.

### 2026-07-14 14:18 PDT — simplicity correction after gate review

- Removed canonical URL/post enforcement because it was not part of the
  operator's discoverability goal and would preclude multiple useful essays per
  repository.
- Added an explicit committed build-assertion script, mirrored and executed in
  both repositories, so the rendered behavior remains reproducible after
  temporary fixtures are removed.

### 2026-07-14 14:25 PDT — boundary review

- Reclassified normalized-post construction from PURE to INTEGRATION because it
  invokes Astro rendering.
- Made fixture setup refuse collisions before registering cleanup and expanded
  assertions for the introduction permalink, anchor-specific attributes, and
  newest-first ordering.
- Added README and atlas documentation for the author-facing metadata and route.

codex
The earlier blockers are visibly addressed in the current commits. I’m narrowing the remaining review to whether the revised test actually pins each promised contract and whether the plan’s PURE/INTEGRATION labels now match how those entities are verified.
exec
/bin/zsh -lc "nl -ba scripts/test-projects-page.sh && nl -ba src/content/config.ts | sed -n '40,70p' && nl -ba src/types.d.ts | sed -n '25,70p' && nl -ba src/utils/blog.ts | sed -n '40,165p' && nl -ba src/components/blog/List.astro && nl -ba src/components/blog/ListItem.astro | sed -n '95,140p' && nl -ba src/pages/projects.astro && nl -ba README.md | sed -n '1,35p' && nl -ba atlas/blog-surfaces.md && nl -ba atlas/index.md && git show --stat --oneline cac0b57 && git show --stat --oneline 468a0f7 && git diff --check 8e552f52728ad6c9c4e8b04b6891f230f6e8685f..HEAD" in /Users/xianxu/workspace/xianxu.dev
 succeeded in 0ms:
     1	#!/usr/bin/env bash
     2	set -euo pipefail
     3
     4	repo=${1:-.}
     5	posts="$repo/src/data/post"
     6	published="$posts/project-render-published-test.md"
     7	older="$posts/project-render-older-test.md"
     8	nonproject="$posts/project-render-nonproject-test.md"
     9	draft="$posts/project-render-draft-test.md"
    10
    11	for fixture in "$published" "$older" "$nonproject" "$draft"; do
    12	  if [[ -e "$fixture" ]]; then
    13	    echo "Refusing to overwrite existing fixture path: $fixture" >&2
    14	    exit 1
    15	  fi
    16	done
    17
    18	cleanup() {
    19	  rm -f "$published" "$older" "$nonproject" "$draft"
    20	}
    21	trap cleanup EXIT
    22
    23	cat >"$published" <<'EOF'
    24	---
    25	title: Project render published test
    26	publishDate: 2030-01-03
    27	published: true
    28	highlight: true
    29	project:
    30	  github: https://github.com/xianxu/project-render-test
    31	---
    32
    33	Temporary project rendering fixture.
    34	EOF
    35
    36	cat >"$older" <<'EOF'
    37	---
    38	title: Project render older test
    39	publishDate: 2030-01-02
    40	published: true
    41	project:
    42	  github: https://github.com/xianxu/project-render-older-test
    43	---
    44
    45	Temporary older project rendering fixture.
    46	EOF
    47
    48	cat >"$nonproject" <<'EOF'
    49	---
    50	title: Project render nonproject test
    51	publishDate: 2030-01-01
    52	published: true
    53	---
    54
    55	Temporary non-project rendering fixture.
    56	EOF
    57
    58	cat >"$draft" <<'EOF'
    59	---
    60	title: Project render draft test
    61	publishDate: 2029-12-31
    62	published: false
    63	project:
    64	  github: https://github.com/xianxu/project-render-draft-test
    65	---
    66
    67	Temporary draft project rendering fixture.
    68	EOF
    69
    70	(
    71	  cd "$repo"
    72	  npm run build
    73	)
    74
    75	projects="$repo/dist/projects/index.html"
    76	highlights="$repo/dist/highlights/index.html"
    77
    78	rg -q 'Project render published test' "$projects"
    79	rg -q 'href="/2030/01/project-render-published-test"' "$projects"
    80	rg -q 'href="https://github.com/xianxu/project-render-test" aria-label="View Project render published test on GitHub" rel="noopener noreferrer" target="_blank"' "$projects"
    81
    82	new_offset=$(rg --byte-offset -o 'Project render published test' "$projects" | head -n 1 | cut -d: -f1)
    83	older_offset=$(rg --byte-offset -o 'Project render older test' "$projects" | head -n 1 | cut -d: -f1)
    84	if ((new_offset >= older_offset)); then
    85	  echo "Projects are not ordered newest first" >&2
    86	  exit 1
    87	fi
    88
    89	if rg -q 'Project render nonproject test|Project render draft test|project-render-draft-test' "$projects"; then
    90	  echo "Projects page included a non-project or draft fixture" >&2
    91	  exit 1
    92	fi
    93
    94	rg -q 'Project render published test' "$highlights"
    95	if rg -q 'https://github.com/xianxu/project-render-test' "$highlights"; then
    96	  echo "Ordinary blog list exposed a project-only GitHub link" >&2
    97	  exit 1
    98	fi
    40	        .object({
    41	          handle: z.string().optional(),
    42	          site: z.string().optional(),
    43	          cardType: z.string().optional(),
    44	        })
    45	        .optional(),
    46	    })
    47	    .optional();
    48
    49	const postCollection = defineCollection({
    50	  loader: glob({ pattern: ['*.md', '*.mdx'], base: 'src/data/post' }),
    51	  schema: z.object({
    52	    publishDate: z.date().optional(),
    53	    updateDate: z.date().optional(),
    54	    published: z.boolean().optional(),
    55	    highlight: z.boolean().optional(),
    56	    project: z.object({ github: z.string().url() }).optional(),
    57	    hidden: z.boolean().optional(),
    58	    comments: z.boolean().optional(),
    59
    60	    title: z.string(),
    61	    excerpt: z.string().optional(),
    62	    image: z.string().optional(),
    63
    64	    category: z.string().optional(),
    65	    tags: z.array(z.string()).optional(),
    66	    author: z.string().optional(),
    67
    68	    metadata: metadataDefinition(),
    69	  }),
    70	});
    25
    26	  /**  */
    27	  category?: Taxonomy;
    28	  /**  */
    29	  tags?: Taxonomy[];
    30	  /**  */
    31	  author?: string;
    32
    33	  /**  */
    34	  metadata?: MetaData;
    35
    36	  /**  */
    37	  published?: boolean;
    38
    39	  /**  */
    40	  highlight?: boolean;
    41
    42	  /** Open-source project metadata when this post belongs on the Projects page. */
    43	  project?: ProjectMetadata;
    44
    45	  /**  */
    46	  hidden?: boolean;
    47
    48	  /**  */
    49	  comments?: boolean;
    50
    51	  /**  */
    52	  Content?: AstroComponentFactory;
    53	  content?: string;
    54
    55	  /**  */
    56	  readingTime?: number;
    57	}
    58
    59	export interface ProjectMetadata {
    60	  github: string;
    61	}
    62
    63	export interface Taxonomy {
    64	  slug: string;
    65	  title: string;
    66	}
    67
    68	export interface MetaData {
    69	  title?: string;
    70	  ignoreTitleTemplate?: boolean;
    40	    .join('/');
    41	};
    42
    43	const getNormalizedPost = async (post: CollectionEntry<'post'>): Promise<Post> => {
    44	  const { id, data } = post;
    45	  const { Content, remarkPluginFrontmatter } = await render(post);
    46
    47	  const {
    48	    publishDate: rawPublishDate = new Date(),
    49	    updateDate: rawUpdateDate,
    50	    title,
    51	    excerpt,
    52	    image,
    53	    tags: rawTags = [],
    54	    category: rawCategory,
    55	    author,
    56	    published = false,
    57	    highlight = false,
    58	    project,
    59	    hidden = false,
    60	    comments = true,
    61	    metadata = {},
    62	  } = data;
    63
    64	  const slug = cleanSlug(id); // cleanSlug(rawSlug.split('/').pop());
    65	  const publishDate = new Date(rawPublishDate);
    66	  const updateDate = rawUpdateDate ? new Date(rawUpdateDate) : undefined;
    67
    68	  const category = rawCategory
    69	    ? {
    70	        slug: cleanSlug(rawCategory),
    71	        title: rawCategory,
    72	      }
    73	    : undefined;
    74
    75	  const tags = rawTags.map((tag: string) => ({
    76	    slug: cleanSlug(tag),
    77	    title: tag,
    78	  }));
    79
    80	  return {
    81	    id: id,
    82	    slug: slug,
    83	    permalink: await generatePermalink({ id, slug, publishDate, category: category?.slug }),
    84
    85	    publishDate: publishDate,
    86	    updateDate: updateDate,
    87
    88	    title: title,
    89	    excerpt: excerpt,
    90	    image: image,
    91
    92	    category: category,
    93	    tags: tags,
    94	    author: author,
    95
    96	    published: published,
    97	    highlight: highlight,
    98	    project: project,
    99	    hidden: hidden,
   100	    comments: comments,
   101
   102	    metadata,
   103
   104	    Content: Content,
   105	    // or 'content' in case you consume from API
   106
   107	    readingTime: remarkPluginFrontmatter?.readingTime,
   108	  };
   109	};
   110
   111	const load = async function (): Promise<Array<Post>> {
   112	  const posts = await getCollection('post');
   113	  const normalizedPosts = posts.map(async (post) => await getNormalizedPost(post));
   114
   115	  const results = (await Promise.all(normalizedPosts)).sort(
   116	    (a, b) => b.publishDate.valueOf() - a.publishDate.valueOf()
   117	  );
   118
   119	  return results;
   120	};
   121
   122	let _allPosts: Array<Post>;
   123	let _posts: Array<Post>;
   124
   125	/** */
   126	export const isBlogEnabled = APP_BLOG.isEnabled;
   127	export const isRelatedPostsEnabled = APP_BLOG.isRelatedPostsEnabled;
   128	export const isBlogListRouteEnabled = APP_BLOG.list.isEnabled;
   129	export const isBlogPostRouteEnabled = APP_BLOG.post.isEnabled;
   130	export const isBlogCategoryRouteEnabled = APP_BLOG.category.isEnabled;
   131	export const isBlogTagRouteEnabled = APP_BLOG.tag.isEnabled;
   132
   133	export const blogListRobots = APP_BLOG.list.robots;
   134	export const blogPostRobots = APP_BLOG.post.robots;
   135	export const blogCategoryRobots = APP_BLOG.category.robots;
   136	export const blogTagRobots = APP_BLOG.tag.robots;
   137
   138	export const blogPostsPerPage = APP_BLOG?.postsPerPage;
   139
   140	/** All posts, including drafts. Use only in dev tools / drafts page. */
   141	export const fetchAllPosts = async (): Promise<Array<Post>> => {
   142	  if (!_allPosts) {
   143	    _allPosts = await load();
   144	  }
   145	  return _allPosts;
   146	};
   147
   148	/** Published posts only — what visitors should ever see. */
   149	export const fetchPosts = async (): Promise<Array<Post>> => {
   150	  if (!_posts) {
   151	    _posts = (await fetchAllPosts()).filter((p) => p.published === true);
   152	  }
   153	  return _posts;
   154	};
   155
   156	/** Draft posts only. */
   157	export const fetchDrafts = async (): Promise<Array<Post>> => {
   158	  return (await fetchAllPosts()).filter((p) => p.published !== true);
   159	};
   160
   161	/** */
   162	export const findPostsBySlugs = async (slugs: Array<string>): Promise<Array<Post>> => {
   163	  if (!Array.isArray(slugs)) return [];
   164
   165	  const posts = await fetchPosts();
     1	---
     2	import Item from '~/components/blog/ListItem.astro';
     3	import type { Post } from '~/types';
     4
     5	export interface Props {
     6	  posts: Array<Post>;
     7	  showProjectLink?: boolean;
     8	}
     9
    10	const { posts, showProjectLink = false } = Astro.props;
    11	---
    12
    13	<ul>
    14	  {
    15	    posts.map((post) => (
    16	      <li class="mb-12 md:mb-20">
    17	        <Item post={post} showProjectLink={showProjectLink} />
    18	      </li>
    19	    ))
    20	  }
    21	</ul>
    95	        {
    96	          link ? (
    97	            <a
    98	              class="inline-block hover:text-primary dark:hover:text-blue-700 transition ease-in duration-200"
    99	              href={link}
   100	            >
   101	              {post.title}
   102	            </a>
   103	          ) : (
   104	            post.title
   105	          )
   106	        }
   107	      </h2>
   108	    </header>
   109
   110	    {post.excerpt && <p class="flex-grow text-muted dark:text-slate-400 text-lg">{post.excerpt}</p>}
   111	    {
   112	      showProjectLink && post.project && (
   113	        <a
   114	          class="inline-flex items-center gap-1.5 mt-4 text-sm font-medium hover:underline"
   115	          href={post.project.github}
   116	          target="_blank"
   117	          rel="noopener noreferrer"
   118	          aria-label={`View ${post.title} on GitHub`}
   119	        >
   120	          <Icon name="tabler:brand-github" class="w-4 h-4" />
   121	          GitHub
   122	        </a>
   123	      )
   124	    }
   125	    {
   126	      post.tags && Array.isArray(post.tags) ? (
   127	        <footer class="mt-5">
   128	          <PostTags tags={post.tags} />
   129	        </footer>
   130	      ) : (
   131	        <Fragment />
   132	      )
   133	    }
   134	  </div>
   135	</article>
     1	---
     2	import Layout from '~/layouts/PageLayout.astro';
     3	import List from '~/components/blog/List.astro';
     4	import { fetchPosts } from '~/utils/blog';
     5
     6	export const prerender = true;
     7
     8	const posts = (await fetchPosts()).filter((post) => post.project !== undefined);
     9
    10	const metadata = {
    11	  title: 'Projects',
    12	};
    13	---
    14
    15	<Layout metadata={metadata}>
    16	  <section class="px-4 sm:px-6 py-12 sm:py-16 lg:py-20 mx-auto max-w-4xl">
    17	    <h1 class="text-3xl md:text-4xl font-bold leading-tighter tracking-tighter font-heading mb-3">Projects</h1>
    18	    <p class="text-muted dark:text-slate-400 mb-12">Open-source projects I work on, and the stories behind them.</p>
    19
    20	    {
    21	      posts.length === 0 ? (
    22	        <p class="text-muted">No project introductions yet.</p>
    23	      ) : (
    24	        <List posts={posts} showProjectLink />
    25	      )
    26	    }
    27	  </section>
    28	</Layout>
     1	# 🚀 AstroWind
     2
     3	## Project introductions
     4
     5	Published blog posts can appear on `/projects` by adding project metadata to
     6	their frontmatter:
     7
     8	```yaml
     9	project:
    10	  github: https://github.com/xianxu/example
    11	```
    12
    13	The post remains an ordinary blog post. The Projects page adds a direct GitHub
    14	link; installation and usage details continue to live in the repository README.
    15
    16	<img src="https://raw.githubusercontent.com/arthelokyo/.github/main/resources/astrowind/lighthouse-score.png" align="right"
    17	     alt="AstroWind Lighthouse Score" width="100" height="358">
    18
    19	🌟 _Most *starred* & *forked* Astro theme in 2022, 2023 & 2024_. 🌟
    20
    21	**AstroWind** is a free and open-source template to make your website using **[Astro 5.0](https://astro.build/) + [Tailwind CSS](https://tailwindcss.com/)**. Ready to start a new project and designed taking into account web best practices.
    22
    23	- ✅ **Production-ready** scores in **PageSpeed Insights** reports.
    24	- ✅ Integration with **Tailwind CSS** supporting **Dark mode** and **_RTL_**.
    25	- ✅ **Fast and SEO friendly blog** with automatic **RSS feed**, **MDX** support, **Categories & Tags**, **Social Share**, ...
    26	- ✅ **Image Optimization** (using new **Astro Assets** and **Unpic** for Universal image CDN).
    27	- ✅ Generation of **project sitemap** based on your routes.
    28	- ✅ **Open Graph tags** for social media sharing.
    29	- ✅ **Analytics** built-in Google Analytics, and Splitbee integration.
    30
    31	<br>
    32
    33	![AstroWind Theme Screenshot](https://raw.githubusercontent.com/arthelokyo/.github/main/resources/astrowind/screenshot-astrowind-1.0.png)
    34
    35	[![arthelokyo](https://custom-icon-badges.demolab.com/badge/made%20by%20-arthelokyo-556bf2?style=flat-square&logo=arthelokyo&logoColor=white&labelColor=101827)](https://github.com/arthelokyo)
     1	# Blog surfaces
     2
     3	Posts are authored under `src/data/post/` and normalized through
     4	`src/utils/blog.ts` for every listing and post route.
     5
     6	`/projects` is a discovery view over published posts carrying this optional
     7	frontmatter:
     8
     9	```yaml
    10	project:
    11	  github: https://github.com/owner/repository
    12	```
    13
    14	The nested object both marks membership and supplies the direct repository link.
    15	`src/pages/projects.astro` selects those normalized posts, while the shared blog
    16	list renders the GitHub link only when the Projects page opts into that context.
    17	Ordinary blog lists therefore keep their existing presentation.
     1	# Atlas
     2
     3	- [Blog surfaces](blog-surfaces.md) — discovery routes and project-post metadata.
cac0b57 blog: #2 address project-tab boundary review
 README.md                                          |   13 +
 atlas/blog-surfaces.md                             |   17 +
 atlas/index.md                                     |    3 +
 scripts/test-projects-page.sh                      |   39 +-
 workshop/issues/000002-open-source-projects-tab.md |   13 +-
 workshop/lessons.md                                |    8 +
 ...000002-open-source-projects-tab-close-review.md | 2018 ++++++++++++++++++++
 .../plans/000002-open-source-projects-tab-plan.md  |   24 +-
 8 files changed, 2117 insertions(+), 18 deletions(-)
468a0f7 plan: #2 reconcile project-post terminology
 workshop/plans/000002-open-source-projects-tab-plan.md | 2 +-
 1 file changed, 1 insertion(+), 1 deletion(-)

exec
/bin/zsh -lc 'bash -n scripts/test-projects-page.sh && test ! -e src/data/post/project-render-published-test.md && test ! -e src/data/post/project-render-older-test.md && test ! -e src/data/post/project-render-nonproject-test.md && test ! -e src/data/post/project-render-draft-test.md && rg -n '"'Project render published test|project-render-test' dist/projects/index.html dist/highlights/index.html 2>/dev/null || true && rg -n \"project:\" src/data/post --glob '*.md' --glob '*.mdx' || true && git diff 8e552f52728ad6c9c4e8b04b6891f230f6e8685f..HEAD -- src scripts README.md atlas workshop/issues/000002-open-source-projects-tab.md workshop/plans/000002-open-source-projects-tab-plan.md | sed -n '1,1200p'" in /Users/xianxu/workspace/xianxu.dev
 succeeded in 0ms:
dist/highlights/index.html:1:<!DOCTYPE html><html class="2xl:text-[20px]" dir="ltr" lang="en"><head><meta charset="UTF-8"><meta content="width=device-width,initial-scale=1" name="viewport"><link href="/sitemap-index.xml" rel="sitemap"><link href="/_astro/favicon.BklBUjGa.png" rel="icon" type="image/png"><link href="/_astro/favicon.BklBUjGa.png" rel="apple-touch-icon" sizes="180x180"><style>:root{--aw-font-sans:'Inter Variable';--aw-font-serif:'Inter Variable';--aw-font-heading:'Inter Variable';--aw-color-primary:rgb(1 97 239);--aw-color-secondary:rgb(1 84 207);--aw-color-accent:rgb(109 40 217);--aw-color-text-heading:rgb(0 0 0);--aw-color-text-default:rgb(16 16 16);--aw-color-text-muted:rgb(16 16 16 / 66%);--aw-color-bg-page:rgb(255 255 255);--aw-color-bg-page-dark:rgb(13 17 23)}.dark{--aw-font-sans:'Inter Variable';--aw-font-serif:'Inter Variable';--aw-font-heading:'Inter Variable';--aw-color-primary:rgb(1 97 239);--aw-color-secondary:rgb(1 84 207);--aw-color-accent:rgb(109 40 217);--aw-color-text-heading:rgb(247, 248, 248);--aw-color-text-default:rgb(229 236 246);--aw-color-text-muted:rgb(229 236 246 / 66%);--aw-color-bg-page:rgb(13 17 23)}</style><script>!function(){const e="system";function t(e){"dark"===e?document.documentElement.classList.add("dark"):document.documentElement.classList.remove("dark");const t=document.querySelectorAll("[data-aw-toggle-color-scheme] > input");t&&t.length&&t.forEach((t=>{t.checked="dark"!==e}))}e&&e.endsWith(":only")||(localStorage.theme,0)?t(e.replace(":only","")):"dark"===localStorage.theme||!("theme"in localStorage)&&window.matchMedia("(prefers-color-scheme: dark)").matches?t("dark"):t("light")}()</script><title>Highlights — Xian Xu</title><meta content="Personal thoughts on current events, society and technology." name="description"><meta content="index,follow" name="robots"><link href="https://xianxu.dev/highlights" rel="canonical"><meta content="Highlights" property="og:title"><meta content="Personal thoughts on current events, society and technology." property="og:description"><meta content="https://xianxu.dev/highlights" property="og:url"><meta content="website" property="og:type"><meta content="en" property="og:locale"><meta content="Xian Xu" property="og:site_name"><meta content="summary" name="twitter:card"><script src="https://www.googletagmanager.com/gtag/js?id=G-CY33L153PE" async></script><script>!function(){function a(){window.dataLayer.push(arguments)}window.dataLayer=window.dataLayer||[],a("js",new Date),a("config","G-CY33L153PE")}()</script><meta content="true" name="astro-view-transitions-enabled"><meta content="swap" name="astro-view-transitions-fallback"><script src="/_astro/ClientRouter.astro_astro_type_script_index_0_lang.DZnDNxNb.js" type="module"></script><link href="/_astro/_page_.sPrg7bJb.css" rel="stylesheet"></head><body class="tracking-tight antialiased bg-page text-default"><header class="mx-auto w-full border-b border-gray-50/0 ease-in-out flex-none sticky top-0 transition-[opacity] z-40" data-aw-sticky-header="true" id="header"><div class="absolute inset-0"></div><div class="mx-auto max-w-7xl relative md:flex md:justify-between md:px-6 px-3 py-3 text-default w-full"><div class="flex justify-between mr-auto rtl:ml-auto rtl:mr-0"><a class="items-center flex" href="/"><span class="items-center inline-flex dark:text-white font-bold gap-1 md:text-3xl ml-2 rtl:ml-0 rtl:mr-2 self-center text-2xl text-gray-900 tracking-tight whitespace-nowrap" aria-label="Xian Xu logo"><span class="items-center inline-flex font-normal justify-center logo-symbol" aria-hidden="true" data-favicon="/_astro/favicon.BklBUjGa.png" style="width:1.4em;height:1.4em"><img alt="" src="/_astro/favicon.BklBUjGa.png" style="width:75%;height:75%;object-fit:contain;display:inline-block"></span><span class="tracking-tight">Xian Xu</span></span><script type="module">const u=window,a=[["?",700],[":",700],["🤔",800],["⠋",30],["⠙",30],["⠹",30],["⠸",30],["⠼",30],["⠴",30],["⠦",30],["⠧",30],["⠇",30],["⠏",30],["⠋",30],["⠙",30],["⠹",30],["⠸",30],["⠼",30],["⠴",30],["⠦",30],["⠧",30],["⠇",30],["⠏",30],["FAVICON",2e3],["⠏",30],["⠇",30],["⠧",30],["⠦",30],["⠴",30],["⠼",30],["⠸",30],["⠹",30],["⠙",30],["⠋",30],["⠏",30],["⠇",30],["⠧",30],["⠦",30],["⠴",30],["⠼",30],["⠸",30],["⠹",30],["⠙",30],["⠋",30],["✍️",1500]],g=50,c=["⠋","⠙","⠹","⠸","⠼","⠴","⠦","⠧","⠇","⠏"],p=30,d=[...c,...c],s=e=>{document.querySelectorAll(".logo-symbol").forEach((t=>{if("FAVICON"===e){const e=t.dataset.favicon||"";t.innerHTML=`<img src="${e}" alt="" style="width:75%;height:75%;object-fit:contain;display:inline-block" />`}else t.textContent=e}))},m=()=>{const e=u.__logoState;e&&(null!==e.timer&&(clearTimeout(e.timer),e.timer=null),e.scrollHandler&&(window.removeEventListener("scroll",e.scrollHandler),e.scrollHandler=null))},w=()=>{if(m(),"/"!==window.location.pathname)return void s("FAVICON");const e={timer:null,scrollHandler:null};u.__logoState=e;let t="main",n=0,l=0;const i=()=>{if("paused"!==t){if("main"===t){const[t,l]=a[n];return s(t),n=(n+1)%a.length,void(e.timer=window.setTimeout(i,l))}if(l<d.length)return s(d[l]),l+=1,void(e.timer=window.setTimeout(i,p));"pausing"===t?(t="paused",s("FAVICON")):(t="main",n=0,i())}},o=()=>{const n=window.scrollY>g;!n||"main"!==t&&"resuming"!==t?!n&&("paused"===t||"pausing"===t)&&(null!==e.timer&&clearTimeout(e.timer),t="resuming",l=0,i()):(null!==e.timer&&clearTimeout(e.timer),t="pausing",l=0,i())};e.scrollHandler=o,window.addEventListener("scroll",o,{passive:!0}),i()};w(),document.addEventListener("astro:page-load",w),document.addEventListener("astro:before-swap",m)</script></a><div class="items-center flex md:hidden"><button aria-label="Toggle Menu" class="items-center flex cursor-pointer flex-col group h-12 justify-center rounded w-12" type="button" data-aw-toggle-menu><span class="sr-only">Toggle Menu</span> <span class="duration-200 transition bg-black dark:bg-white ease h-0.5 my-1 opacity-80 rounded-full transform w-6 group-[.expanded]:rotate-45 group-[.expanded]:translate-y-2.5" aria-hidden="true"></span> <span class="duration-200 transition bg-black dark:bg-white ease h-0.5 my-1 opacity-80 rounded-full transform w-6 group-[.expanded]:opacity-0" aria-hidden="true"></span> <span class="duration-200 transition bg-black dark:bg-white ease h-0.5 my-1 opacity-80 rounded-full transform w-6 group-[.expanded]:-rotate-45 group-[.expanded]:-translate-y-2.5" aria-hidden="true"></span></button></div></div><nav aria-label="Main navigation" class="items-center md:w-auto w-full hidden md:flex md:justify-self-center md:mx-5 md:overflow-x-auto md:overflow-y-visible overflow-x-hidden overflow-y-auto text-default"><ul class="font-medium flex flex-col md:flex-row md:items-center md:justify-center md:self-center md:text-[0.9375rem] md:w-auto text-xl tracking-[0.01rem] w-full"><li class><a class="items-center flex dark:hover:text-white hover:text-link px-4 py-3 whitespace-nowrap aw-link-active" href="/highlights">Highlights</a></li><li class><a class="items-center flex dark:hover:text-white hover:text-link px-4 py-3 whitespace-nowrap" href="/projects">Projects</a></li><li class><a class="items-center flex dark:hover:text-white hover:text-link px-4 py-3 whitespace-nowrap" href="/blog">Archive</a></li><li class><a class="items-center flex dark:hover:text-white hover:text-link px-4 py-3 whitespace-nowrap" href="/tags">Tags</a></li><li class><a class="items-center flex dark:hover:text-white hover:text-link px-4 py-3 whitespace-nowrap" href="/about">About</a></li></ul></nav><div class="items-center md:w-auto w-full hidden md:flex bottom-0 fixed justify-end left-0 md:justify-self-end md:mb-0 md:p-0 md:self-center md:static p-3 rtl:left-auto rtl:right-0"><div class="items-center flex justify-between md:w-auto w-full"><div class="flex"><button aria-label="Toggle between Dark and Light mode" class="text-muted dark:focus:ring-gray-700 dark:hover:bg-gray-700 dark:text-gray-400 focus:outline-none focus:ring-4 focus:ring-gray-200 hover:bg-gray-100 inline-flex items-center p-2.5 rounded-lg text-sm" type="button" data-aw-toggle-color-scheme><svg class="w-6 h-6 md:h-5 md:inline-block md:w-5" data-icon="tabler:sun" height="1em" width="1em"><symbol id="ai:tabler:sun" viewBox="0 0 24 24"><path d="M8 12a4 4 0 1 0 8 0a4 4 0 1 0-8 0m-5 0h1m8-9v1m8 8h1m-9 8v1M5.6 5.6l.7.7m12.1-.7l-.7.7m0 11.4l.7.7m-12.1-.7l-.7.7" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/></symbol><use href="#ai:tabler:sun"></use></svg></button> <a class="text-muted dark:focus:ring-gray-700 dark:hover:bg-gray-700 dark:text-gray-400 focus:outline-none focus:ring-4 focus:ring-gray-200 hover:bg-gray-100 inline-flex items-center p-2.5 rounded-lg text-sm" href="/rss.xml" aria-label="RSS Feed"><svg class="h-5 w-5" data-icon="tabler:rss" height="1em" width="1em"><symbol id="ai:tabler:rss" viewBox="0 0 24 24"><path d="M4 19a1 1 0 1 0 2 0a1 1 0 1 0-2 0M4 4a16 16 0 0 1 16 16M4 11a9 9 0 0 1 9 9" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/></symbol><use href="#ai:tabler:rss"></use></svg></a></div></div></div></div></header><main><section class="mx-auto lg:py-20 max-w-4xl px-4 py-12 sm:px-6 sm:py-16"><h1 class="font-bold font-heading leading-tighter mb-3 md:text-4xl text-3xl tracking-tighter">Highlights</h1><p class="text-muted dark:text-slate-400 mb-12">A handful of posts I think are worth a second look.</p><ul><li class="mb-12 md:mb-20"><article class="mx-auto intersect-once intersect-quarter motion-safe:md:intersect:animate-fade motion-safe:md:opacity-0 gap-6 grid max-w-md md:gap-8 md:max-w-none"><div class="mt-2"><header><div class="mb-1"><span class="text-sm"><svg class="inline-block -mt-0.5 dark:text-gray-400 h-3.5 w-3.5" data-icon="tabler:clock" height="1em" width="1em"><symbol id="ai:tabler:clock" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0-18 0"/><path d="M12 7v5l3 3"/></g></symbol><use href="#ai:tabler:clock"></use></svg> <time class="inline-block" datetime="Wed Jan 02 2030 16:00:00 GMT-0800 (Pacific Standard Time)">Jan 3, 2030</time></span></div><h2 class="dark:text-slate-300 font-bold font-heading leading-tight mb-2 sm:text-2xl text-xl"><a class="inline-block dark:hover:text-blue-700 duration-200 ease-in hover:text-primary transition" href="/2030/01/project-render-published-test">Project render published test</a></h2></header><footer class="mt-5"><ul class="text-sm"></ul></footer></div></article></li><li class="mb-12 md:mb-20"><article class="mx-auto intersect-once intersect-quarter motion-safe:md:intersect:animate-fade motion-safe:md:opacity-0 gap-6 grid max-w-md md:gap-8 md:max-w-none"><div class="mt-2"><header><div class="mb-1"><span class="text-sm"><svg class="inline-block -mt-0.5 dark:text-gray-400 h-3.5 w-3.5" data-icon="tabler:clock" height="1em" width="1em" viewBox="0 0 24 24"><use href="#ai:tabler:clock"></use></svg> <time class="inline-block" datetime="Thu Jun 04 2026 17:00:00 GMT-0700 (Pacific Daylight Time)">Jun 5, 2026</time></span></div><h2 class="dark:text-slate-300 font-bold font-heading leading-tight mb-2 sm:text-2xl text-xl"><a class="inline-block dark:hover:text-blue-700 duration-200 ease-in hover:text-primary transition" href="/2026/06/the-case-for-space-data-center">The Case for Space Data Centers</a></h2></header><p class="text-muted dark:text-slate-400 flex-grow text-lg">With SpaceX IPO looming, let&#39;s take a look at the case of space data center, how realistic it is. As I poked around, I realize it&#39;s a matter of time before we run data centers in space, and that we really DO need Starship to pull it off economically. That is, if we look at the problem in the time frame of decades.</p><footer class="mt-5"><ul class="text-sm"><li class="inline-block bg-gray-100 dark:bg-slate-700 font-medium lowercase mb-2 mr-2 px-2 py-0.5 rtl:ml-2 rtl:mr-0"><a class="text-muted dark:hover:text-gray-200 dark:text-slate-300 hover:text-primary" href="/tag/tech">tech</a></li><li class="inline-block bg-gray-100 dark:bg-slate-700 font-medium lowercase mb-2 mr-2 px-2 py-0.5 rtl:ml-2 rtl:mr-0"><a class="text-muted dark:hover:text-gray-200 dark:text-slate-300 hover:text-primary" href="/tag/ai">ai</a></li></ul></footer></div></article></li><li class="mb-12 md:mb-20"><article class="mx-auto intersect-once intersect-quarter motion-safe:md:intersect:animate-fade motion-safe:md:opacity-0 gap-6 grid max-w-md md:gap-8 md:max-w-none"><div class="mt-2"><header><div class="mb-1"><span class="text-sm"><svg class="inline-block -mt-0.5 dark:text-gray-400 h-3.5 w-3.5" data-icon="tabler:clock" height="1em" width="1em" viewBox="0 0 24 24"><use href="#ai:tabler:clock"></use></svg> <time class="inline-block" datetime="Thu Apr 30 2026 17:00:00 GMT-0700 (Pacific Daylight Time)">May 1, 2026</time></span></div><h2 class="dark:text-slate-300 font-bold font-heading leading-tight mb-2 sm:text-2xl text-xl"><a class="inline-block dark:hover:text-blue-700 duration-200 ease-in hover:text-primary transition" href="/2026/04/ai-native-company">AI Native Company</a></h2></header><p class="text-muted dark:text-slate-400 flex-grow text-lg">What is an AI Native Company?</p><footer class="mt-5"><ul class="text-sm"><li class="inline-block bg-gray-100 dark:bg-slate-700 font-medium lowercase mb-2 mr-2 px-2 py-0.5 rtl:ml-2 rtl:mr-0"><a class="text-muted dark:hover:text-gray-200 dark:text-slate-300 hover:text-primary" href="/tag/tech">tech</a></li><li class="inline-block bg-gray-100 dark:bg-slate-700 font-medium lowercase mb-2 mr-2 px-2 py-0.5 rtl:ml-2 rtl:mr-0"><a class="text-muted dark:hover:text-gray-200 dark:text-slate-300 hover:text-primary" href="/tag/ai">ai</a></li></ul></footer></div></article></li><li class="mb-12 md:mb-20"><article class="mx-auto intersect-once intersect-quarter motion-safe:md:intersect:animate-fade motion-safe:md:opacity-0 gap-6 grid max-w-md md:gap-8 md:max-w-none"><div class="mt-2"><header><div class="mb-1"><span class="text-sm"><svg class="inline-block -mt-0.5 dark:text-gray-400 h-3.5 w-3.5" data-icon="tabler:clock" height="1em" width="1em" viewBox="0 0 24 24"><use href="#ai:tabler:clock"></use></svg> <time class="inline-block" datetime="Fri Mar 27 2026 17:00:00 GMT-0700 (Pacific Daylight Time)">Mar 28, 2026</time></span></div><h2 class="dark:text-slate-300 font-bold font-heading leading-tight mb-2 sm:text-2xl text-xl"><a class="inline-block dark:hover:text-blue-700 duration-200 ease-in hover:text-primary transition" href="/2026/03/ai-coding-workflow2">AI Workflow Evolved, One Year Jouney</a></h2></header><p class="text-muted dark:text-slate-400 flex-grow text-lg">Reflecting on a year of tinkering and adapting to the ever changing world of AI. After a year and 400+ commits on Parley.nvim, I&#39;m convinced the future is humans setting up the environment, with full automation of the coding inside it. Here&#39;s my journey so far.</p><footer class="mt-5"><ul class="text-sm"><li class="inline-block bg-gray-100 dark:bg-slate-700 font-medium lowercase mb-2 mr-2 px-2 py-0.5 rtl:ml-2 rtl:mr-0"><a class="text-muted dark:hover:text-gray-200 dark:text-slate-300 hover:text-primary" href="/tag/tech">tech</a></li><li class="inline-block bg-gray-100 dark:bg-slate-700 font-medium lowercase mb-2 mr-2 px-2 py-0.5 rtl:ml-2 rtl:mr-0"><a class="text-muted dark:hover:text-gray-200 dark:text-slate-300 hover:text-primary" href="/tag/ai">ai</a></li></ul></footer></div></article></li><li class="mb-12 md:mb-20"><article class="mx-auto intersect-once intersect-quarter motion-safe:md:intersect:animate-fade motion-safe:md:opacity-0 gap-6 grid max-w-md md:gap-8 md:max-w-none"><div class="mt-2"><header><div class="mb-1"><span class="text-sm"><svg class="inline-block -mt-0.5 dark:text-gray-400 h-3.5 w-3.5" data-icon="tabler:clock" height="1em" width="1em" viewBox="0 0 24 24"><use href="#ai:tabler:clock"></use></svg> <time class="inline-block" datetime="Sat Feb 28 2026 16:00:00 GMT-0800 (Pacific Standard Time)">Mar 1, 2026</time></span></div><h2 class="dark:text-slate-300 font-bold font-heading leading-tight mb-2 sm:text-2xl text-xl"><a class="inline-block dark:hover:text-blue-700 duration-200 ease-in hover:text-primary transition" href="/2026/02/dawn-of-ai-coding">The Week Everything Changed</a></h2></header><p class="text-muted dark:text-slate-400 flex-grow text-lg">The week of February 23, 2026: Dorsey&#39;s layoffs, Cloudflare&#39;s one-engineer Next.js rewrite, Karpathy&#39;s tweet. Picking up Conductor, OpenCode, and OpenSpec over a weekend and shipping 15K lines on Parley — agentic coding is no longer the toy it was ten months ago.</p><footer class="mt-5"><ul class="text-sm"><li class="inline-block bg-gray-100 dark:bg-slate-700 font-medium lowercase mb-2 mr-2 px-2 py-0.5 rtl:ml-2 rtl:mr-0"><a class="text-muted dark:hover:text-gray-200 dark:text-slate-300 hover:text-primary" href="/tag/ai">ai</a></li><li class="inline-block bg-gray-100 dark:bg-slate-700 font-medium lowercase mb-2 mr-2 px-2 py-0.5 rtl:ml-2 rtl:mr-0"><a class="text-muted dark:hover:text-gray-200 dark:text-slate-300 hover:text-primary" href="/tag/tech">tech</a></li></ul></footer></div></article></li><li class="mb-12 md:mb-20"><article class="mx-auto intersect-once intersect-quarter motion-safe:md:intersect:animate-fade motion-safe:md:opacity-0 gap-6 grid max-w-md md:gap-8 md:max-w-none"><div class="mt-2"><header><div class="mb-1"><span class="text-sm"><svg class="inline-block -mt-0.5 dark:text-gray-400 h-3.5 w-3.5" data-icon="tabler:clock" height="1em" width="1em" viewBox="0 0 24 24"><use href="#ai:tabler:clock"></use></svg> <time class="inline-block" datetime="Sun Feb 15 2026 16:00:00 GMT-0800 (Pacific Standard Time)">Feb 16, 2026</time></span></div><h2 class="dark:text-slate-300 font-bold font-heading leading-tight mb-2 sm:text-2xl text-xl"><a class="inline-block dark:hover:text-blue-700 duration-200 ease-in hover:text-primary transition" href="/2026/02/ai-as-new-abstraction">AI as the Next Abstraction Layer</a></h2></header><p class="text-muted dark:text-slate-400 flex-grow text-lg">LLMs are fundamentally stochastic, but that&#39;s not new — the whole ML field always was, and it worked. The interesting question is how to ground stochastic computation in deterministic domains. Two paths: build a deterministic shell around the model (coding), or apply it directly where the domain itself tolerates noise (recruiting, marketing, design).</p><footer class="mt-5"><ul class="text-sm"><li class="inline-block bg-gray-100 dark:bg-slate-700 font-medium lowercase mb-2 mr-2 px-2 py-0.5 rtl:ml-2 rtl:mr-0"><a class="text-muted dark:hover:text-gray-200 dark:text-slate-300 hover:text-primary" href="/tag/tech">tech</a></li><li class="inline-block bg-gray-100 dark:bg-slate-700 font-medium lowercase mb-2 mr-2 px-2 py-0.5 rtl:ml-2 rtl:mr-0"><a class="text-muted dark:hover:text-gray-200 dark:text-slate-300 hover:text-primary" href="/tag/ai">ai</a></li></ul></footer></div></article></li><li class="mb-12 md:mb-20"><article class="mx-auto intersect-once intersect-quarter motion-safe:md:intersect:animate-fade motion-safe:md:opacity-0 gap-6 grid max-w-md md:gap-8 md:max-w-none"><div class="mt-2"><header><div class="mb-1"><span class="text-sm"><svg class="inline-block -mt-0.5 dark:text-gray-400 h-3.5 w-3.5" data-icon="tabler:clock" height="1em" width="1em" viewBox="0 0 24 24"><use href="#ai:tabler:clock"></use></svg> <time class="inline-block" datetime="Thu Oct 16 2025 17:00:00 GMT-0700 (Pacific Daylight Time)">Oct 17, 2025</time></span></div><h2 class="dark:text-slate-300 font-bold font-heading leading-tight mb-2 sm:text-2xl text-xl"><a class="inline-block dark:hover:text-blue-700 duration-200 ease-in hover:text-primary transition" href="/2025/10/high-output-management">Information as Leverage</a></h2></header><p class="text-muted dark:text-slate-400 flex-grow text-lg">Andrew Grove treats management as a production system, but the deeper claim is that information workers are managers — their raw material is information, their output is influence. In modern Big Tech, being &quot;a manager&quot; isn&#39;t a promotion. It&#39;s just different work.</p><footer class="mt-5"><ul class="text-sm"><li class="inline-block bg-gray-100 dark:bg-slate-700 font-medium lowercase mb-2 mr-2 px-2 py-0.5 rtl:ml-2 rtl:mr-0"><a class="text-muted dark:hover:text-gray-200 dark:text-slate-300 hover:text-primary" href="/tag/tech">tech</a></li><li class="inline-block bg-gray-100 dark:bg-slate-700 font-medium lowercase mb-2 mr-2 px-2 py-0.5 rtl:ml-2 rtl:mr-0"><a class="text-muted dark:hover:text-gray-200 dark:text-slate-300 hover:text-primary" href="/tag/philosophy">philosophy</a></li></ul></footer></div></article></li><li class="mb-12 md:mb-20"><article class="mx-auto intersect-once intersect-quarter motion-safe:md:intersect:animate-fade motion-safe:md:opacity-0 gap-6 grid max-w-md md:gap-8 md:max-w-none"><div class="mt-2"><header><div class="mb-1"><span class="text-sm"><svg class="inline-block -mt-0.5 dark:text-gray-400 h-3.5 w-3.5" data-icon="tabler:clock" height="1em" width="1em" viewBox="0 0 24 24"><use href="#ai:tabler:clock"></use></svg> <time class="inline-block" datetime="Fri Sep 19 2025 17:00:00 GMT-0700 (Pacific Daylight Time)">Sep 20, 2025</time></span></div><h2 class="dark:text-slate-300 font-bold font-heading leading-tight mb-2 sm:text-2xl text-xl"><a class="inline-block dark:hover:text-blue-700 duration-200 ease-in hover:text-primary transition" href="/2025/09/operation-principles">My Operation Principles</a></h2></header><p class="text-muted dark:text-slate-400 flex-grow text-lg">My operating principles: be serious but not too serious, be curious and build a shared mind, be radically transparent, move fast and break things.</p><footer class="mt-5"><ul class="text-sm"><li class="inline-block bg-gray-100 dark:bg-slate-700 font-medium lowercase mb-2 mr-2 px-2 py-0.5 rtl:ml-2 rtl:mr-0"><a class="text-muted dark:hover:text-gray-200 dark:text-slate-300 hover:text-primary" href="/tag/philosophy">philosophy</a></li></ul></footer></div></article></li><li class="mb-12 md:mb-20"><article class="mx-auto intersect-once intersect-quarter motion-safe:md:intersect:animate-fade motion-safe:md:opacity-0 gap-6 grid max-w-md md:gap-8 md:max-w-none"><div class="mt-2"><header><div class="mb-1"><span class="text-sm"><svg class="inline-block -mt-0.5 dark:text-gray-400 h-3.5 w-3.5" data-icon="tabler:clock" height="1em" width="1em" viewBox="0 0 24 24"><use href="#ai:tabler:clock"></use></svg> <time class="inline-block" datetime="Fri Sep 12 2025 17:00:00 GMT-0700 (Pacific Daylight Time)">Sep 13, 2025</time></span></div><h2 class="dark:text-slate-300 font-bold font-heading leading-tight mb-2 sm:text-2xl text-xl"><a class="inline-block dark:hover:text-blue-700 duration-200 ease-in hover:text-primary transition" href="/2025/09/whatsapp-architecture">How WhatsApp Works</a></h2></header><p class="text-muted dark:text-slate-400 flex-grow text-lg">How WhatsApp actually worked: Erlang/BEAM/OTP all the way down, the biggest machines money could buy, location-transparent actors, and code hotloading as deployment. They bucked every Cloud Computing canon and ran the world&#39;s largest messaging system with a tiny team.</p><footer class="mt-5"><ul class="text-sm"><li class="inline-block bg-gray-100 dark:bg-slate-700 font-medium lowercase mb-2 mr-2 px-2 py-0.5 rtl:ml-2 rtl:mr-0"><a class="text-muted dark:hover:text-gray-200 dark:text-slate-300 hover:text-primary" href="/tag/tech">tech</a></li></ul></footer></div></article></li><li class="mb-12 md:mb-20"><article class="mx-auto intersect-once intersect-quarter motion-safe:md:intersect:animate-fade motion-safe:md:opacity-0 gap-6 grid max-w-md md:gap-8 md:max-w-none"><div class="mt-2"><header><div class="mb-1"><span class="text-sm"><svg class="inline-block -mt-0.5 dark:text-gray-400 h-3.5 w-3.5" data-icon="tabler:clock" height="1em" width="1em" viewBox="0 0 24 24"><use href="#ai:tabler:clock"></use></svg> <time class="inline-block" datetime="Wed Aug 20 2025 17:00:00 GMT-0700 (Pacific Daylight Time)">Aug 21, 2025</time></span></div><h2 class="dark:text-slate-300 font-bold font-heading leading-tight mb-2 sm:text-2xl text-xl"><a class="inline-block dark:hover:text-blue-700 duration-200 ease-in hover:text-primary transition" href="/2025/08/glass-half-full">A Glass Half Full</a></h2></header><p class="text-muted dark:text-slate-400 flex-grow text-lg">A short verse on the choice between half-full and half-empty — I think it is a very important choice. It is a fundamental choice. It affects you more in your life, Much more than in your work.</p><footer class="mt-5"><ul class="text-sm"><li class="inline-block bg-gray-100 dark:bg-slate-700 font-medium lowercase mb-2 mr-2 px-2 py-0.5 rtl:ml-2 rtl:mr-0"><a class="text-muted dark:hover:text-gray-200 dark:text-slate-300 hover:text-primary" href="/tag/philosophy">philosophy</a></li><li class="inline-block bg-gray-100 dark:bg-slate-700 font-medium lowercase mb-2 mr-2 px-2 py-0.5 rtl:ml-2 rtl:mr-0"><a class="text-muted dark:hover:text-gray-200 dark:text-slate-300 hover:text-primary" href="/tag/life">life</a></li></ul></footer></div></article></li><li class="mb-12 md:mb-20"><article class="mx-auto intersect-once intersect-quarter motion-safe:md:intersect:animate-fade motion-safe:md:opacity-0 gap-6 grid max-w-md md:gap-8 md:max-w-none"><div class="mt-2"><header><div class="mb-1"><span class="text-sm"><svg class="inline-block -mt-0.5 dark:text-gray-400 h-3.5 w-3.5" data-icon="tabler:clock" height="1em" width="1em" viewBox="0 0 24 24"><use href="#ai:tabler:clock"></use></svg> <time class="inline-block" datetime="Sat May 03 2025 17:00:00 GMT-0700 (Pacific Daylight Time)">May 4, 2025</time></span></div><h2 class="dark:text-slate-300 font-bold font-heading leading-tight mb-2 sm:text-2xl text-xl"><a class="inline-block dark:hover:text-blue-700 duration-200 ease-in hover:text-primary transition" href="/2025/05/facebook-move-on">Moving On [Meta]</a></h2></header><p class="text-muted dark:text-slate-400 flex-grow text-lg">Leaving Meta after a decade. The Facebook of the Red Culture Book — &quot;What would you do if you were not afraid?&quot; — is not the Meta of muscular energy and top-down NFT, Messaging Interop, and Metaverse. A goodbye, and a question worth carrying into the next chapter.</p><footer class="mt-5"><ul class="text-sm"><li class="inline-block bg-gray-100 dark:bg-slate-700 font-medium lowercase mb-2 mr-2 px-2 py-0.5 rtl:ml-2 rtl:mr-0"><a class="text-muted dark:hover:text-gray-200 dark:text-slate-300 hover:text-primary" href="/tag/life">life</a></li><li class="inline-block bg-gray-100 dark:bg-slate-700 font-medium lowercase mb-2 mr-2 px-2 py-0.5 rtl:ml-2 rtl:mr-0"><a class="text-muted dark:hover:text-gray-200 dark:text-slate-300 hover:text-primary" href="/tag/tech">tech</a></li></ul></footer></div></article></li><li class="mb-12 md:mb-20"><article class="mx-auto intersect-once intersect-quarter motion-safe:md:intersect:animate-fade motion-safe:md:opacity-0 gap-6 grid max-w-md md:gap-8 md:max-w-none"><div class="mt-2"><header><div class="mb-1"><span class="text-sm"><svg class="inline-block -mt-0.5 dark:text-gray-400 h-3.5 w-3.5" data-icon="tabler:clock" height="1em" width="1em" viewBox="0 0 24 24"><use href="#ai:tabler:clock"></use></svg> <time class="inline-block" datetime="Thu Apr 17 2025 17:00:00 GMT-0700 (Pacific Daylight Time)">Apr 18, 2025</time></span></div><h2 class="dark:text-slate-300 font-bold font-heading leading-tight mb-2 sm:text-2xl text-xl"><a class="inline-block dark:hover:text-blue-700 duration-200 ease-in hover:text-primary transition" href="/2025/04/culture-wa">WhatsApp Culture</a></h2></header><p class="text-muted dark:text-slate-400 flex-grow text-lg">Six years inside WhatsApp&#39;s improbably quiet Menlo Park building, where the motto was Keep It Simple and the F word was Focus; and where you hot-loaded code straight into production, no code review. It worked.</p><footer class="mt-5"><ul class="text-sm"><li class="inline-block bg-gray-100 dark:bg-slate-700 font-medium lowercase mb-2 mr-2 px-2 py-0.5 rtl:ml-2 rtl:mr-0"><a class="text-muted dark:hover:text-gray-200 dark:text-slate-300 hover:text-primary" href="/tag/tech">tech</a></li><li class="inline-block bg-gray-100 dark:bg-slate-700 font-medium lowercase mb-2 mr-2 px-2 py-0.5 rtl:ml-2 rtl:mr-0"><a class="text-muted dark:hover:text-gray-200 dark:text-slate-300 hover:text-primary" href="/tag/philosophy">philosophy</a></li></ul></footer></div></article></li><li class="mb-12 md:mb-20"><article class="mx-auto intersect-once intersect-quarter motion-safe:md:intersect:animate-fade motion-safe:md:opacity-0 gap-6 grid max-w-md md:gap-8 md:max-w-none"><div class="mt-2"><header><div class="mb-1"><span class="text-sm"><svg class="inline-block -mt-0.5 dark:text-gray-400 h-3.5 w-3.5" data-icon="tabler:clock" height="1em" width="1em" viewBox="0 0 24 24"><use href="#ai:tabler:clock"></use></svg> <time class="inline-block" datetime="Sat Feb 15 2025 16:00:00 GMT-0800 (Pacific Standard Time)">Feb 16, 2025</time></span></div><h2 class="dark:text-slate-300 font-bold font-heading leading-tight mb-2 sm:text-2xl text-xl"><a class="inline-block dark:hover:text-blue-700 duration-200 ease-in hover:text-primary transition" href="/2025/02/money-power-happiness-at-work">Happiness @ Work</a></h2></header><p class="text-muted dark:text-slate-400 flex-grow text-lg">Five aspects worth weighing when picking a career or changing jobs: money, power, domain, people, growth. And one last gut check — are you having fun? If Mondays don&#39;t energize you more often than not, you&#39;re probably in the wrong place.</p><footer class="mt-5"><ul class="text-sm"><li class="inline-block bg-gray-100 dark:bg-slate-700 font-medium lowercase mb-2 mr-2 px-2 py-0.5 rtl:ml-2 rtl:mr-0"><a class="text-muted dark:hover:text-gray-200 dark:text-slate-300 hover:text-primary" href="/tag/philosophy">philosophy</a></li></ul></footer></div></article></li></ul></section></main><footer class="border-gray-200 border-t dark:border-slate-800 not-prose relative"><div class="absolute inset-0 dark:bg-dark pointer-events-none" aria-hidden="true"></div><div class="dark:text-slate-300 intersect-no-queue intersect-once intersect-quarter max-w-7xl motion-safe:md:intersect:animate-fade motion-safe:md:opacity-0 mx-auto px-4 relative sm:px-6"><div class="md:flex md:justify-between md:items-center md:py-8 py-6"><ul class="flex -ml-2 mb-4 md:mb-0 md:ml-4 md:order-1 rtl:-mr-2 rtl:md:ml-0 rtl:md:mr-4 rtl:ml-0"><li><a class="text-muted dark:focus:ring-gray-700 dark:hover:bg-gray-700 dark:text-gray-400 focus:outline-none focus:ring-4 focus:ring-gray-200 hover:bg-gray-100 inline-flex items-center p-2.5 rounded-lg text-sm" href="/rss.xml" aria-label="RSS"><svg class="h-5 w-5" data-icon="tabler:rss" height="1em" width="1em" viewBox="0 0 24 24"><use href="#ai:tabler:rss"></use></svg></a></li><li><a class="text-muted dark:focus:ring-gray-700 dark:hover:bg-gray-700 dark:text-gray-400 focus:outline-none focus:ring-4 focus:ring-gray-200 hover:bg-gray-100 inline-flex items-center p-2.5 rounded-lg text-sm" href="https://github.com/xianxu" aria-label="GitHub"><svg class="h-5 w-5" data-icon="tabler:brand-github" height="1em" width="1em"><symbol id="ai:tabler:brand-github" viewBox="0 0 24 24"><path d="M9 19c-4.3 1.4-4.3-2.5-6-3m12 5v-3.5c0-1 .1-1.4-.5-2c2.8-.3 5.5-1.4 5.5-6a4.6 4.6 0 0 0-1.3-3.2a4.2 4.2 0 0 0-.1-3.2s-1.1-.3-3.5 1.3a12.3 12.3 0 0 0-6.2 0C6.5 2.8 5.4 3.1 5.4 3.1a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 4 9.5c0 4.6 2.7 5.7 5.5 6c-.6.6-.6 1.2-.5 2V21" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/></symbol><use href="#ai:tabler:brand-github"></use></svg></a></li><li><a class="text-muted dark:focus:ring-gray-700 dark:hover:bg-gray-700 dark:text-gray-400 focus:outline-none focus:ring-4 focus:ring-gray-200 hover:bg-gray-100 inline-flex items-center p-2.5 rounded-lg text-sm" href="https://www.linkedin.com/in/xianxu" aria-label="LinkedIn"><svg class="h-5 w-5" data-icon="tabler:brand-linkedin" height="1em" width="1em"><symbol id="ai:tabler:brand-linkedin" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="M8 11v5m0-8v.01M12 16v-5m4 5v-3a2 2 0 1 0-4 0"/><path d="M3 7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4v10a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4z"/></g></symbol><use href="#ai:tabler:brand-linkedin"></use></svg></a></li></ul><div class="text-sm dark:text-muted mr-4">© 2026 <span class="font-medium">Xian Xu</span> · Personal thoughts on current events, society and technology.</div></div></div></footer><script>!function(){const e="system";if(window.basic_script)return;function t(e){"dark"===e?document.documentElement.classList.add("dark"):document.documentElement.classList.remove("dark")}window.basic_script=!0;const a=function(){e&&e.endsWith(":only")||(localStorage.theme,0)?t(e.replace(":only","")):"dark"===localStorage.theme||!("theme"in localStorage)&&window.matchMedia("(prefers-color-scheme: dark)").matches?t("dark"):t("light")};function d(e,t,a){const d="string"==typeof e?document.querySelectorAll(e):e;d&&d.length&&d.forEach((e=>{e.addEventListener(t,(t=>a(t,e)),!1)}))}a();const o=function(){let t=window.scrollY,a=!0;d("#header nav","click",(function(){document.querySelector("[data-aw-toggle-menu]")?.classList.remove("expanded"),document.body.classList.remove("overflow-hidden"),document.getElementById("header")?.classList.remove("h-screen"),document.getElementById("header")?.classList.remove("expanded"),document.getElementById("header")?.classList.remove("bg-page"),document.querySelector("#header nav")?.classList.add("hidden"),document.querySelector("#header > div > div:last-child")?.classList.add("hidden")})),d("[data-aw-toggle-menu]","click",(function(e,t){t.classList.toggle("expanded"),document.body.classList.toggle("overflow-hidden"),document.getElementById("header")?.classList.toggle("h-screen"),document.getElementById("header")?.classList.toggle("expanded"),document.getElementById("header")?.classList.toggle("bg-page"),document.querySelector("#header nav")?.classList.toggle("hidden"),document.querySelector("#header > div > div:last-child")?.classList.toggle("hidden")})),d("[data-aw-toggle-color-scheme]","click",(function(){e.endsWith(":only")||(Observer.removeAnimationDelay(),document.documentElement.classList.toggle("dark"),localStorage.theme=document.documentElement.classList.contains("dark")?"dark":"light")})),d("[data-aw-social-share]","click",(function(e,t){const a=t.getAttribute("data-aw-social-share"),d=encodeURIComponent(t.getAttribute("data-aw-url")),o=encodeURIComponent(t.getAttribute("data-aw-text"));let n;switch(a){case"facebook":n=`https://www.facebook.com/sharer.php?u=${d}`;break;case"twitter":n=`https://twitter.com/intent/tweet?url=${d}&text=${o}`;break;case"linkedin":n=`https://www.linkedin.com/shareArticle?mini=true&url=${d}&title=${o}`;break;case"whatsapp":n=`https://wa.me/?text=${o}%20${d}`;break;case"mail":n=`mailto:?subject=%22${o}%22&body=${o}%20${d}`;break;default:return}const c=document.createElement("a");c.target="_blank",c.href=n,c.click()}));function o(){const e=document.querySelector("#header[data-aw-sticky-header]");e&&(t>60&&!e.classList.contains("scroll")?e.classList.add("scroll"):t<=60&&e.classList.contains("scroll")&&e.classList.remove("scroll"),a=!1)}window.matchMedia("(max-width: 767px)").addEventListener("change",(function(){document.querySelector("[data-aw-toggle-menu]")?.classList.remove("expanded"),document.body.classList.remove("overflow-hidden"),document.getElementById("header")?.classList.remove("h-screen"),document.getElementById("header")?.classList.remove("expanded"),document.getElementById("header")?.classList.remove("bg-page"),document.querySelector("#header nav")?.classList.add("hidden"),document.querySelector("#header > div > div:last-child")?.classList.add("hidden")})),o(),d([document],"scroll",(function(){t=window.scrollY,a||(window.requestAnimationFrame((()=>{o()})),a=!0)}))},n=function(){document.documentElement.classList.add("motion-safe:scroll-smooth");const e=document.querySelector("[data-aw-toggle-menu]");e&&e.classList.remove("expanded"),document.body.classList.remove("overflow-hidden"),document.getElementById("header")?.classList.remove("h-screen"),document.getElementById("header")?.classList.remove("expanded"),document.querySelector("#header nav")?.classList.add("hidden")};window.onload=o,window.onpageshow=n,document.addEventListener("astro:after-swap",(()=>{a(),o(),n()}))}()</script><script>const Observer={observer:null,delayBetweenAnimations:100,animationCounter:0,elements:null,start(){this.elements=Array.from(document.querySelectorAll(['[class*=" intersect:"]','[class*=":intersect:"]','[class^="intersect:"]','[class="intersect"]','[class*=" intersect "]','[class^="intersect "]','[class$=" intersect"]'].join(",")));this.elements.forEach((t=>{var e;t.setAttribute("no-intersect",""),t._intersectionThreshold=(e=t).classList.contains("intersect-full")?.99:e.classList.contains("intersect-half")?.5:e.classList.contains("intersect-quarter")?.25:0}));this.observer=new IntersectionObserver((t=>{t.forEach((t=>{requestAnimationFrame((()=>{const e=t.target,s=t.intersectionRatio,n=e._intersectionThreshold;if(e.classList.contains("intersect-no-queue"))t.isIntersecting?(e.removeAttribute("no-intersect"),e.classList.contains("intersect-once")&&this.observer.unobserve(e)):e.setAttribute("no-intersect","");else if(s>=n){if(!e.hasAttribute("data-animated")){e.removeAttribute("no-intersect"),e.setAttribute("data-animated","true");const t=this.animationCounter*this.delayBetweenAnimations;this.animationCounter++,e.style.transitionDelay=`${t}ms`,e.style.animationDelay=`${t}ms`,e.classList.contains("intersect-once")&&this.observer.unobserve(e)}}else e.setAttribute("no-intersect",""),e.removeAttribute("data-animated"),e.style.transitionDelay="",e.style.animationDelay="",this.animationCounter=0}))}))}).bind(this),{threshold:[0,.25,.5,.99]}),this.elements.forEach((t=>{this.observer.observe(t)}))},removeAnimationDelay(){this.elements.forEach((t=>{"true"===t.getAttribute("data-animated")&&(t.style.transitionDelay="",t.style.animationDelay="")}))}};Observer.start(),document.addEventListener("astro:after-swap",(()=>{Observer.start()}))</script></body></html>
dist/projects/index.html:1:<!DOCTYPE html><html class="2xl:text-[20px]" dir="ltr" lang="en"><head><meta charset="UTF-8"><meta content="width=device-width,initial-scale=1" name="viewport"><link href="/sitemap-index.xml" rel="sitemap"><link href="/_astro/favicon.BklBUjGa.png" rel="icon" type="image/png"><link href="/_astro/favicon.BklBUjGa.png" rel="apple-touch-icon" sizes="180x180"><style>:root{--aw-font-sans:'Inter Variable';--aw-font-serif:'Inter Variable';--aw-font-heading:'Inter Variable';--aw-color-primary:rgb(1 97 239);--aw-color-secondary:rgb(1 84 207);--aw-color-accent:rgb(109 40 217);--aw-color-text-heading:rgb(0 0 0);--aw-color-text-default:rgb(16 16 16);--aw-color-text-muted:rgb(16 16 16 / 66%);--aw-color-bg-page:rgb(255 255 255);--aw-color-bg-page-dark:rgb(13 17 23)}.dark{--aw-font-sans:'Inter Variable';--aw-font-serif:'Inter Variable';--aw-font-heading:'Inter Variable';--aw-color-primary:rgb(1 97 239);--aw-color-secondary:rgb(1 84 207);--aw-color-accent:rgb(109 40 217);--aw-color-text-heading:rgb(247, 248, 248);--aw-color-text-default:rgb(229 236 246);--aw-color-text-muted:rgb(229 236 246 / 66%);--aw-color-bg-page:rgb(13 17 23)}</style><script>!function(){const e="system";function t(e){"dark"===e?document.documentElement.classList.add("dark"):document.documentElement.classList.remove("dark");const t=document.querySelectorAll("[data-aw-toggle-color-scheme] > input");t&&t.length&&t.forEach((t=>{t.checked="dark"!==e}))}e&&e.endsWith(":only")||(localStorage.theme,0)?t(e.replace(":only","")):"dark"===localStorage.theme||!("theme"in localStorage)&&window.matchMedia("(prefers-color-scheme: dark)").matches?t("dark"):t("light")}()</script><title>Projects — Xian Xu</title><meta content="Personal thoughts on current events, society and technology." name="description"><meta content="index,follow" name="robots"><link href="https://xianxu.dev/projects" rel="canonical"><meta content="Projects" property="og:title"><meta content="Personal thoughts on current events, society and technology." property="og:description"><meta content="https://xianxu.dev/projects" property="og:url"><meta content="website" property="og:type"><meta content="en" property="og:locale"><meta content="Xian Xu" property="og:site_name"><meta content="summary" name="twitter:card"><script src="https://www.googletagmanager.com/gtag/js?id=G-CY33L153PE" async></script><script>!function(){function a(){window.dataLayer.push(arguments)}window.dataLayer=window.dataLayer||[],a("js",new Date),a("config","G-CY33L153PE")}()</script><meta content="true" name="astro-view-transitions-enabled"><meta content="swap" name="astro-view-transitions-fallback"><script src="/_astro/ClientRouter.astro_astro_type_script_index_0_lang.DZnDNxNb.js" type="module"></script><link href="/_astro/_page_.sPrg7bJb.css" rel="stylesheet"></head><body class="tracking-tight antialiased bg-page text-default"><header class="mx-auto w-full border-b border-gray-50/0 ease-in-out flex-none sticky top-0 transition-[opacity] z-40" data-aw-sticky-header="true" id="header"><div class="absolute inset-0"></div><div class="mx-auto max-w-7xl relative md:flex md:justify-between md:px-6 px-3 py-3 text-default w-full"><div class="flex justify-between mr-auto rtl:ml-auto rtl:mr-0"><a class="items-center flex" href="/"><span class="items-center inline-flex dark:text-white font-bold gap-1 md:text-3xl ml-2 rtl:ml-0 rtl:mr-2 self-center text-2xl text-gray-900 tracking-tight whitespace-nowrap" aria-label="Xian Xu logo"><span class="items-center inline-flex font-normal justify-center logo-symbol" aria-hidden="true" data-favicon="/_astro/favicon.BklBUjGa.png" style="width:1.4em;height:1.4em"><img alt="" src="/_astro/favicon.BklBUjGa.png" style="width:75%;height:75%;object-fit:contain;display:inline-block"></span><span class="tracking-tight">Xian Xu</span></span><script type="module">const u=window,a=[["?",700],[":",700],["🤔",800],["⠋",30],["⠙",30],["⠹",30],["⠸",30],["⠼",30],["⠴",30],["⠦",30],["⠧",30],["⠇",30],["⠏",30],["⠋",30],["⠙",30],["⠹",30],["⠸",30],["⠼",30],["⠴",30],["⠦",30],["⠧",30],["⠇",30],["⠏",30],["FAVICON",2e3],["⠏",30],["⠇",30],["⠧",30],["⠦",30],["⠴",30],["⠼",30],["⠸",30],["⠹",30],["⠙",30],["⠋",30],["⠏",30],["⠇",30],["⠧",30],["⠦",30],["⠴",30],["⠼",30],["⠸",30],["⠹",30],["⠙",30],["⠋",30],["✍️",1500]],g=50,c=["⠋","⠙","⠹","⠸","⠼","⠴","⠦","⠧","⠇","⠏"],p=30,d=[...c,...c],s=e=>{document.querySelectorAll(".logo-symbol").forEach((t=>{if("FAVICON"===e){const e=t.dataset.favicon||"";t.innerHTML=`<img src="${e}" alt="" style="width:75%;height:75%;object-fit:contain;display:inline-block" />`}else t.textContent=e}))},m=()=>{const e=u.__logoState;e&&(null!==e.timer&&(clearTimeout(e.timer),e.timer=null),e.scrollHandler&&(window.removeEventListener("scroll",e.scrollHandler),e.scrollHandler=null))},w=()=>{if(m(),"/"!==window.location.pathname)return void s("FAVICON");const e={timer:null,scrollHandler:null};u.__logoState=e;let t="main",n=0,l=0;const i=()=>{if("paused"!==t){if("main"===t){const[t,l]=a[n];return s(t),n=(n+1)%a.length,void(e.timer=window.setTimeout(i,l))}if(l<d.length)return s(d[l]),l+=1,void(e.timer=window.setTimeout(i,p));"pausing"===t?(t="paused",s("FAVICON")):(t="main",n=0,i())}},o=()=>{const n=window.scrollY>g;!n||"main"!==t&&"resuming"!==t?!n&&("paused"===t||"pausing"===t)&&(null!==e.timer&&clearTimeout(e.timer),t="resuming",l=0,i()):(null!==e.timer&&clearTimeout(e.timer),t="pausing",l=0,i())};e.scrollHandler=o,window.addEventListener("scroll",o,{passive:!0}),i()};w(),document.addEventListener("astro:page-load",w),document.addEventListener("astro:before-swap",m)</script></a><div class="items-center flex md:hidden"><button aria-label="Toggle Menu" class="items-center flex cursor-pointer flex-col group h-12 justify-center rounded w-12" type="button" data-aw-toggle-menu><span class="sr-only">Toggle Menu</span> <span class="duration-200 transition bg-black dark:bg-white ease h-0.5 my-1 opacity-80 rounded-full transform w-6 group-[.expanded]:rotate-45 group-[.expanded]:translate-y-2.5" aria-hidden="true"></span> <span class="duration-200 transition bg-black dark:bg-white ease h-0.5 my-1 opacity-80 rounded-full transform w-6 group-[.expanded]:opacity-0" aria-hidden="true"></span> <span class="duration-200 transition bg-black dark:bg-white ease h-0.5 my-1 opacity-80 rounded-full transform w-6 group-[.expanded]:-rotate-45 group-[.expanded]:-translate-y-2.5" aria-hidden="true"></span></button></div></div><nav aria-label="Main navigation" class="items-center md:w-auto w-full hidden md:flex md:justify-self-center md:mx-5 md:overflow-x-auto md:overflow-y-visible overflow-x-hidden overflow-y-auto text-default"><ul class="flex flex-col font-medium md:flex-row md:items-center md:justify-center md:self-center md:text-[0.9375rem] md:w-auto text-xl tracking-[0.01rem] w-full"><li class><a class="items-center flex dark:hover:text-white hover:text-link px-4 py-3 whitespace-nowrap" href="/highlights">Highlights</a></li><li class><a class="items-center flex dark:hover:text-white hover:text-link px-4 py-3 whitespace-nowrap aw-link-active" href="/projects">Projects</a></li><li class><a class="items-center flex dark:hover:text-white hover:text-link px-4 py-3 whitespace-nowrap" href="/blog">Archive</a></li><li class><a class="items-center flex dark:hover:text-white hover:text-link px-4 py-3 whitespace-nowrap" href="/tags">Tags</a></li><li class><a class="items-center flex dark:hover:text-white hover:text-link px-4 py-3 whitespace-nowrap" href="/about">About</a></li></ul></nav><div class="items-center md:w-auto w-full hidden md:flex bottom-0 fixed justify-end left-0 md:justify-self-end md:mb-0 md:p-0 md:self-center md:static p-3 rtl:left-auto rtl:right-0"><div class="items-center flex justify-between md:w-auto w-full"><div class="flex"><button aria-label="Toggle between Dark and Light mode" class="items-center inline-flex text-sm dark:focus:ring-gray-700 dark:hover:bg-gray-700 dark:text-gray-400 focus:outline-none focus:ring-4 focus:ring-gray-200 hover:bg-gray-100 p-2.5 rounded-lg text-muted" type="button" data-aw-toggle-color-scheme><svg class="w-6 h-6 md:h-5 md:inline-block md:w-5" data-icon="tabler:sun" height="1em" width="1em"><symbol id="ai:tabler:sun" viewBox="0 0 24 24"><path d="M8 12a4 4 0 1 0 8 0a4 4 0 1 0-8 0m-5 0h1m8-9v1m8 8h1m-9 8v1M5.6 5.6l.7.7m12.1-.7l-.7.7m0 11.4l.7.7m-12.1-.7l-.7.7" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/></symbol><use href="#ai:tabler:sun"></use></svg></button> <a class="items-center inline-flex text-sm dark:focus:ring-gray-700 dark:hover:bg-gray-700 dark:text-gray-400 focus:outline-none focus:ring-4 focus:ring-gray-200 hover:bg-gray-100 p-2.5 rounded-lg text-muted" href="/rss.xml" aria-label="RSS Feed"><svg class="h-5 w-5" data-icon="tabler:rss" height="1em" width="1em"><symbol id="ai:tabler:rss" viewBox="0 0 24 24"><path d="M4 19a1 1 0 1 0 2 0a1 1 0 1 0-2 0M4 4a16 16 0 0 1 16 16M4 11a9 9 0 0 1 9 9" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/></symbol><use href="#ai:tabler:rss"></use></svg></a></div></div></div></div></header><main><section class="mx-auto lg:py-20 max-w-4xl px-4 py-12 sm:px-6 sm:py-16"><h1 class="font-bold font-heading leading-tighter mb-3 md:text-4xl text-3xl tracking-tighter">Projects</h1><p class="mb-12 dark:text-slate-400 text-muted">Open-source projects I work on, and the stories behind them.</p><ul><li class="mb-12 md:mb-20"><article class="mx-auto intersect-once intersect-quarter motion-safe:md:intersect:animate-fade motion-safe:md:opacity-0 gap-6 grid max-w-md md:gap-8 md:max-w-none"><div class="mt-2"><header><div class="mb-1"><span class="text-sm"><svg class="inline-block -mt-0.5 dark:text-gray-400 h-3.5 w-3.5" data-icon="tabler:clock" height="1em" width="1em"><symbol id="ai:tabler:clock" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0-18 0"/><path d="M12 7v5l3 3"/></g></symbol><use href="#ai:tabler:clock"></use></svg> <time class="inline-block" datetime="Wed Jan 02 2030 16:00:00 GMT-0800 (Pacific Standard Time)">Jan 3, 2030</time></span></div><h2 class="font-bold font-heading dark:text-slate-300 leading-tight mb-2 sm:text-2xl text-xl"><a class="inline-block dark:hover:text-blue-700 duration-200 ease-in hover:text-primary transition" href="/2030/01/project-render-published-test">Project render published test</a></h2></header><a class="items-center inline-flex text-sm font-medium gap-1.5 hover:underline mt-4" href="https://github.com/xianxu/project-render-test" aria-label="View Project render published test on GitHub" rel="noopener noreferrer" target="_blank"><svg class="h-4 w-4" data-icon="tabler:brand-github" height="1em" width="1em" viewBox="0 0 24 24"><use href="#ai:tabler:brand-github"></use></svg> GitHub</a><footer class="mt-5"><ul class="text-sm"></ul></footer></div></article></li><li class="mb-12 md:mb-20"><article class="mx-auto intersect-once intersect-quarter motion-safe:md:intersect:animate-fade motion-safe:md:opacity-0 gap-6 grid max-w-md md:gap-8 md:max-w-none"><div class="mt-2"><header><div class="mb-1"><span class="text-sm"><svg class="inline-block -mt-0.5 dark:text-gray-400 h-3.5 w-3.5" data-icon="tabler:clock" height="1em" width="1em" viewBox="0 0 24 24"><use href="#ai:tabler:clock"></use></svg> <time class="inline-block" datetime="Tue Jan 01 2030 16:00:00 GMT-0800 (Pacific Standard Time)">Jan 2, 2030</time></span></div><h2 class="font-bold font-heading dark:text-slate-300 leading-tight mb-2 sm:text-2xl text-xl"><a class="inline-block dark:hover:text-blue-700 duration-200 ease-in hover:text-primary transition" href="/2030/01/project-render-older-test">Project render older test</a></h2></header><a class="items-center inline-flex text-sm font-medium gap-1.5 hover:underline mt-4" href="https://github.com/xianxu/project-render-older-test" aria-label="View Project render older test on GitHub" rel="noopener noreferrer" target="_blank"><svg class="h-4 w-4" data-icon="tabler:brand-github" height="1em" width="1em" viewBox="0 0 24 24"><use href="#ai:tabler:brand-github"></use></svg> GitHub</a><footer class="mt-5"><ul class="text-sm"></ul></footer></div></article></li></ul></section></main><footer class="border-gray-200 border-t dark:border-slate-800 not-prose relative"><div class="absolute inset-0 dark:bg-dark pointer-events-none" aria-hidden="true"></div><div class="mx-auto intersect-once intersect-quarter motion-safe:md:intersect:animate-fade motion-safe:md:opacity-0 dark:text-slate-300 intersect-no-queue max-w-7xl px-4 relative sm:px-6"><div class="md:flex md:justify-between md:items-center md:py-8 py-6"><ul class="flex -ml-2 mb-4 md:mb-0 md:ml-4 md:order-1 rtl:-mr-2 rtl:md:ml-0 rtl:md:mr-4 rtl:ml-0"><li><a class="items-center inline-flex text-sm dark:focus:ring-gray-700 dark:hover:bg-gray-700 dark:text-gray-400 focus:outline-none focus:ring-4 focus:ring-gray-200 hover:bg-gray-100 p-2.5 rounded-lg text-muted" href="/rss.xml" aria-label="RSS"><svg class="h-5 w-5" data-icon="tabler:rss" height="1em" width="1em" viewBox="0 0 24 24"><use href="#ai:tabler:rss"></use></svg></a></li><li><a class="items-center inline-flex text-sm dark:focus:ring-gray-700 dark:hover:bg-gray-700 dark:text-gray-400 focus:outline-none focus:ring-4 focus:ring-gray-200 hover:bg-gray-100 p-2.5 rounded-lg text-muted" href="https://github.com/xianxu" aria-label="GitHub"><svg class="h-5 w-5" data-icon="tabler:brand-github" height="1em" width="1em"><symbol id="ai:tabler:brand-github" viewBox="0 0 24 24"><path d="M9 19c-4.3 1.4-4.3-2.5-6-3m12 5v-3.5c0-1 .1-1.4-.5-2c2.8-.3 5.5-1.4 5.5-6a4.6 4.6 0 0 0-1.3-3.2a4.2 4.2 0 0 0-.1-3.2s-1.1-.3-3.5 1.3a12.3 12.3 0 0 0-6.2 0C6.5 2.8 5.4 3.1 5.4 3.1a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 4 9.5c0 4.6 2.7 5.7 5.5 6c-.6.6-.6 1.2-.5 2V21" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/></symbol><use href="#ai:tabler:brand-github"></use></svg></a></li><li><a class="items-center inline-flex text-sm dark:focus:ring-gray-700 dark:hover:bg-gray-700 dark:text-gray-400 focus:outline-none focus:ring-4 focus:ring-gray-200 hover:bg-gray-100 p-2.5 rounded-lg text-muted" href="https://www.linkedin.com/in/xianxu" aria-label="LinkedIn"><svg class="h-5 w-5" data-icon="tabler:brand-linkedin" height="1em" width="1em"><symbol id="ai:tabler:brand-linkedin" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="M8 11v5m0-8v.01M12 16v-5m4 5v-3a2 2 0 1 0-4 0"/><path d="M3 7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4v10a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4z"/></g></symbol><use href="#ai:tabler:brand-linkedin"></use></svg></a></li></ul><div class="text-sm dark:text-muted mr-4">© 2026 <span class="font-medium">Xian Xu</span> · Personal thoughts on current events, society and technology.</div></div></div></footer><script>!function(){const e="system";if(window.basic_script)return;function t(e){"dark"===e?document.documentElement.classList.add("dark"):document.documentElement.classList.remove("dark")}window.basic_script=!0;const a=function(){e&&e.endsWith(":only")||(localStorage.theme,0)?t(e.replace(":only","")):"dark"===localStorage.theme||!("theme"in localStorage)&&window.matchMedia("(prefers-color-scheme: dark)").matches?t("dark"):t("light")};function d(e,t,a){const d="string"==typeof e?document.querySelectorAll(e):e;d&&d.length&&d.forEach((e=>{e.addEventListener(t,(t=>a(t,e)),!1)}))}a();const o=function(){let t=window.scrollY,a=!0;d("#header nav","click",(function(){document.querySelector("[data-aw-toggle-menu]")?.classList.remove("expanded"),document.body.classList.remove("overflow-hidden"),document.getElementById("header")?.classList.remove("h-screen"),document.getElementById("header")?.classList.remove("expanded"),document.getElementById("header")?.classList.remove("bg-page"),document.querySelector("#header nav")?.classList.add("hidden"),document.querySelector("#header > div > div:last-child")?.classList.add("hidden")})),d("[data-aw-toggle-menu]","click",(function(e,t){t.classList.toggle("expanded"),document.body.classList.toggle("overflow-hidden"),document.getElementById("header")?.classList.toggle("h-screen"),document.getElementById("header")?.classList.toggle("expanded"),document.getElementById("header")?.classList.toggle("bg-page"),document.querySelector("#header nav")?.classList.toggle("hidden"),document.querySelector("#header > div > div:last-child")?.classList.toggle("hidden")})),d("[data-aw-toggle-color-scheme]","click",(function(){e.endsWith(":only")||(Observer.removeAnimationDelay(),document.documentElement.classList.toggle("dark"),localStorage.theme=document.documentElement.classList.contains("dark")?"dark":"light")})),d("[data-aw-social-share]","click",(function(e,t){const a=t.getAttribute("data-aw-social-share"),d=encodeURIComponent(t.getAttribute("data-aw-url")),o=encodeURIComponent(t.getAttribute("data-aw-text"));let n;switch(a){case"facebook":n=`https://www.facebook.com/sharer.php?u=${d}`;break;case"twitter":n=`https://twitter.com/intent/tweet?url=${d}&text=${o}`;break;case"linkedin":n=`https://www.linkedin.com/shareArticle?mini=true&url=${d}&title=${o}`;break;case"whatsapp":n=`https://wa.me/?text=${o}%20${d}`;break;case"mail":n=`mailto:?subject=%22${o}%22&body=${o}%20${d}`;break;default:return}const c=document.createElement("a");c.target="_blank",c.href=n,c.click()}));function o(){const e=document.querySelector("#header[data-aw-sticky-header]");e&&(t>60&&!e.classList.contains("scroll")?e.classList.add("scroll"):t<=60&&e.classList.contains("scroll")&&e.classList.remove("scroll"),a=!1)}window.matchMedia("(max-width: 767px)").addEventListener("change",(function(){document.querySelector("[data-aw-toggle-menu]")?.classList.remove("expanded"),document.body.classList.remove("overflow-hidden"),document.getElementById("header")?.classList.remove("h-screen"),document.getElementById("header")?.classList.remove("expanded"),document.getElementById("header")?.classList.remove("bg-page"),document.querySelector("#header nav")?.classList.add("hidden"),document.querySelector("#header > div > div:last-child")?.classList.add("hidden")})),o(),d([document],"scroll",(function(){t=window.scrollY,a||(window.requestAnimationFrame((()=>{o()})),a=!0)}))},n=function(){document.documentElement.classList.add("motion-safe:scroll-smooth");const e=document.querySelector("[data-aw-toggle-menu]");e&&e.classList.remove("expanded"),document.body.classList.remove("overflow-hidden"),document.getElementById("header")?.classList.remove("h-screen"),document.getElementById("header")?.classList.remove("expanded"),document.querySelector("#header nav")?.classList.add("hidden")};window.onload=o,window.onpageshow=n,document.addEventListener("astro:after-swap",(()=>{a(),o(),n()}))}()</script><script>const Observer={observer:null,delayBetweenAnimations:100,animationCounter:0,elements:null,start(){this.elements=Array.from(document.querySelectorAll(['[class*=" intersect:"]','[class*=":intersect:"]','[class^="intersect:"]','[class="intersect"]','[class*=" intersect "]','[class^="intersect "]','[class$=" intersect"]'].join(",")));this.elements.forEach((t=>{var e;t.setAttribute("no-intersect",""),t._intersectionThreshold=(e=t).classList.contains("intersect-full")?.99:e.classList.contains("intersect-half")?.5:e.classList.contains("intersect-quarter")?.25:0}));this.observer=new IntersectionObserver((t=>{t.forEach((t=>{requestAnimationFrame((()=>{const e=t.target,s=t.intersectionRatio,n=e._intersectionThreshold;if(e.classList.contains("intersect-no-queue"))t.isIntersecting?(e.removeAttribute("no-intersect"),e.classList.contains("intersect-once")&&this.observer.unobserve(e)):e.setAttribute("no-intersect","");else if(s>=n){if(!e.hasAttribute("data-animated")){e.removeAttribute("no-intersect"),e.setAttribute("data-animated","true");const t=this.animationCounter*this.delayBetweenAnimations;this.animationCounter++,e.style.transitionDelay=`${t}ms`,e.style.animationDelay=`${t}ms`,e.classList.contains("intersect-once")&&this.observer.unobserve(e)}}else e.setAttribute("no-intersect",""),e.removeAttribute("data-animated"),e.style.transitionDelay="",e.style.animationDelay="",this.animationCounter=0}))}))}).bind(this),{threshold:[0,.25,.5,.99]}),this.elements.forEach((t=>{this.observer.observe(t)}))},removeAnimationDelay(){this.elements.forEach((t=>{"true"===t.getAttribute("data-animated")&&(t.style.transitionDelay="",t.style.animationDelay="")}))}};Observer.start(),document.addEventListener("astro:after-swap",(()=>{Observer.start()}))</script></body></html>
src/data/post/parley.md:6:project:
diff --git a/README.md b/README.md
index 767bc9f..688a409 100644
--- a/README.md
+++ b/README.md
@@ -1,5 +1,18 @@
 # 🚀 AstroWind

+## Project introductions
+
+Published blog posts can appear on `/projects` by adding project metadata to
+their frontmatter:
+
+```yaml
+project:
+  github: https://github.com/xianxu/example
+```
+
+The post remains an ordinary blog post. The Projects page adds a direct GitHub
+link; installation and usage details continue to live in the repository README.
+
 <img src="https://raw.githubusercontent.com/arthelokyo/.github/main/resources/astrowind/lighthouse-score.png" align="right"
      alt="AstroWind Lighthouse Score" width="100" height="358">

diff --git a/atlas/blog-surfaces.md b/atlas/blog-surfaces.md
new file mode 100644
index 0000000..4c196ee
--- /dev/null
+++ b/atlas/blog-surfaces.md
@@ -0,0 +1,17 @@
+# Blog surfaces
+
+Posts are authored under `src/data/post/` and normalized through
+`src/utils/blog.ts` for every listing and post route.
+
+`/projects` is a discovery view over published posts carrying this optional
+frontmatter:
+
+```yaml
+project:
+  github: https://github.com/owner/repository
+```
+
+The nested object both marks membership and supplies the direct repository link.
+`src/pages/projects.astro` selects those normalized posts, while the shared blog
+list renders the GitHub link only when the Projects page opts into that context.
+Ordinary blog lists therefore keep their existing presentation.
diff --git a/atlas/index.md b/atlas/index.md
new file mode 100644
index 0000000..5b23c82
--- /dev/null
+++ b/atlas/index.md
@@ -0,0 +1,3 @@
+# Atlas
+
+- [Blog surfaces](blog-surfaces.md) — discovery routes and project-post metadata.
diff --git a/scripts/test-projects-page.sh b/scripts/test-projects-page.sh
new file mode 100755
index 0000000..3a62da4
--- /dev/null
+++ b/scripts/test-projects-page.sh
@@ -0,0 +1,98 @@
+#!/usr/bin/env bash
+set -euo pipefail
+
+repo=${1:-.}
+posts="$repo/src/data/post"
+published="$posts/project-render-published-test.md"
+older="$posts/project-render-older-test.md"
+nonproject="$posts/project-render-nonproject-test.md"
+draft="$posts/project-render-draft-test.md"
+
+for fixture in "$published" "$older" "$nonproject" "$draft"; do
+  if [[ -e "$fixture" ]]; then
+    echo "Refusing to overwrite existing fixture path: $fixture" >&2
+    exit 1
+  fi
+done
+
+cleanup() {
+  rm -f "$published" "$older" "$nonproject" "$draft"
+}
+trap cleanup EXIT
+
+cat >"$published" <<'EOF'
+---
+title: Project render published test
+publishDate: 2030-01-03
+published: true
+highlight: true
+project:
+  github: https://github.com/xianxu/project-render-test
+---
+
+Temporary project rendering fixture.
+EOF
+
+cat >"$older" <<'EOF'
+---
+title: Project render older test
+publishDate: 2030-01-02
+published: true
+project:
+  github: https://github.com/xianxu/project-render-older-test
+---
+
+Temporary older project rendering fixture.
+EOF
+
+cat >"$nonproject" <<'EOF'
+---
+title: Project render nonproject test
+publishDate: 2030-01-01
+published: true
+---
+
+Temporary non-project rendering fixture.
+EOF
+
+cat >"$draft" <<'EOF'
+---
+title: Project render draft test
+publishDate: 2029-12-31
+published: false
+project:
+  github: https://github.com/xianxu/project-render-draft-test
+---
+
+Temporary draft project rendering fixture.
+EOF
+
+(
+  cd "$repo"
+  npm run build
+)
+
+projects="$repo/dist/projects/index.html"
+highlights="$repo/dist/highlights/index.html"
+
+rg -q 'Project render published test' "$projects"
+rg -q 'href="/2030/01/project-render-published-test"' "$projects"
+rg -q 'href="https://github.com/xianxu/project-render-test" aria-label="View Project render published test on GitHub" rel="noopener noreferrer" target="_blank"' "$projects"
+
+new_offset=$(rg --byte-offset -o 'Project render published test' "$projects" | head -n 1 | cut -d: -f1)
+older_offset=$(rg --byte-offset -o 'Project render older test' "$projects" | head -n 1 | cut -d: -f1)
+if ((new_offset >= older_offset)); then
+  echo "Projects are not ordered newest first" >&2
+  exit 1
+fi
+
+if rg -q 'Project render nonproject test|Project render draft test|project-render-draft-test' "$projects"; then
+  echo "Projects page included a non-project or draft fixture" >&2
+  exit 1
+fi
+
+rg -q 'Project render published test' "$highlights"
+if rg -q 'https://github.com/xianxu/project-render-test' "$highlights"; then
+  echo "Ordinary blog list exposed a project-only GitHub link" >&2
+  exit 1
+fi
diff --git a/src/components/blog/List.astro b/src/components/blog/List.astro
index 6a80ae3..8d5e03b 100644
--- a/src/components/blog/List.astro
+++ b/src/components/blog/List.astro
@@ -4,16 +4,17 @@ import type { Post } from '~/types';

 export interface Props {
   posts: Array<Post>;
+  showProjectLink?: boolean;
 }

-const { posts } = Astro.props;
+const { posts, showProjectLink = false } = Astro.props;
 ---

 <ul>
   {
     posts.map((post) => (
       <li class="mb-12 md:mb-20">
-        <Item post={post} />
+        <Item post={post} showProjectLink={showProjectLink} />
       </li>
     ))
   }
diff --git a/src/components/blog/ListItem.astro b/src/components/blog/ListItem.astro
index 6a416d6..d922ad5 100644
--- a/src/components/blog/ListItem.astro
+++ b/src/components/blog/ListItem.astro
@@ -13,9 +13,10 @@ import { getFormattedDate } from '~/utils/utils';

 export interface Props {
   post: Post;
+  showProjectLink?: boolean;
 }

-const { post } = Astro.props;
+const { post, showProjectLink = false } = Astro.props;
 const image = (await findImage(post.image)) as ImageMetadata | undefined;

 const link = APP_BLOG?.post?.isEnabled ? getPermalink(post.permalink, 'post') : '';
@@ -107,6 +108,20 @@ const link = APP_BLOG?.post?.isEnabled ? getPermalink(post.permalink, 'post') :
     </header>

     {post.excerpt && <p class="flex-grow text-muted dark:text-slate-400 text-lg">{post.excerpt}</p>}
+    {
+      showProjectLink && post.project && (
+        <a
+          class="inline-flex items-center gap-1.5 mt-4 text-sm font-medium hover:underline"
+          href={post.project.github}
+          target="_blank"
+          rel="noopener noreferrer"
+          aria-label={`View ${post.title} on GitHub`}
+        >
+          <Icon name="tabler:brand-github" class="w-4 h-4" />
+          GitHub
+        </a>
+      )
+    }
     {
       post.tags && Array.isArray(post.tags) ? (
         <footer class="mt-5">
diff --git a/src/content/config.ts b/src/content/config.ts
index a5f702c..7477d96 100644
--- a/src/content/config.ts
+++ b/src/content/config.ts
@@ -53,6 +53,7 @@ const postCollection = defineCollection({
     updateDate: z.date().optional(),
     published: z.boolean().optional(),
     highlight: z.boolean().optional(),
+    project: z.object({ github: z.string().url() }).optional(),
     hidden: z.boolean().optional(),
     comments: z.boolean().optional(),

diff --git a/src/navigation.ts b/src/navigation.ts
index c0443de..4f8fc15 100644
--- a/src/navigation.ts
+++ b/src/navigation.ts
@@ -3,6 +3,7 @@ import { getBlogPermalink, getPermalink, getAsset } from './utils/permalinks';
 export const headerData = {
   links: [
     { text: 'Highlights', href: getPermalink('/highlights') },
+    { text: 'Projects', href: getPermalink('/projects') },
     { text: 'Archive', href: getBlogPermalink() },
     { text: 'Tags', href: getPermalink('/tags') },
     { text: 'About', href: getPermalink('/about') },
diff --git a/src/pages/projects.astro b/src/pages/projects.astro
new file mode 100644
index 0000000..bee3d4e
--- /dev/null
+++ b/src/pages/projects.astro
@@ -0,0 +1,28 @@
+---
+import Layout from '~/layouts/PageLayout.astro';
+import List from '~/components/blog/List.astro';
+import { fetchPosts } from '~/utils/blog';
+
+export const prerender = true;
+
+const posts = (await fetchPosts()).filter((post) => post.project !== undefined);
+
+const metadata = {
+  title: 'Projects',
+};
+---
+
+<Layout metadata={metadata}>
+  <section class="px-4 sm:px-6 py-12 sm:py-16 lg:py-20 mx-auto max-w-4xl">
+    <h1 class="text-3xl md:text-4xl font-bold leading-tighter tracking-tighter font-heading mb-3">Projects</h1>
+    <p class="text-muted dark:text-slate-400 mb-12">Open-source projects I work on, and the stories behind them.</p>
+
+    {
+      posts.length === 0 ? (
+        <p class="text-muted">No project introductions yet.</p>
+      ) : (
+        <List posts={posts} showProjectLink />
+      )
+    }
+  </section>
+</Layout>
diff --git a/src/types.d.ts b/src/types.d.ts
index 0231642..4480d4f 100644
--- a/src/types.d.ts
+++ b/src/types.d.ts
@@ -39,6 +39,9 @@ export interface Post {
   /**  */
   highlight?: boolean;

+  /** Open-source project metadata when this post belongs on the Projects page. */
+  project?: ProjectMetadata;
+
   /**  */
   hidden?: boolean;

@@ -53,6 +56,10 @@ export interface Post {
   readingTime?: number;
 }

+export interface ProjectMetadata {
+  github: string;
+}
+
 export interface Taxonomy {
   slug: string;
   title: string;
diff --git a/src/utils/blog.ts b/src/utils/blog.ts
index 2269710..c1d78c0 100644
--- a/src/utils/blog.ts
+++ b/src/utils/blog.ts
@@ -55,6 +55,7 @@ const getNormalizedPost = async (post: CollectionEntry<'post'>): Promise<Post> =
     author,
     published = false,
     highlight = false,
+    project,
     hidden = false,
     comments = true,
     metadata = {},
@@ -94,6 +95,7 @@ const getNormalizedPost = async (post: CollectionEntry<'post'>): Promise<Post> =

     published: published,
     highlight: highlight,
+    project: project,
     hidden: hidden,
     comments: comments,

diff --git a/workshop/issues/000002-open-source-projects-tab.md b/workshop/issues/000002-open-source-projects-tab.md
index bcd650e..c42ddc6 100644
--- a/workshop/issues/000002-open-source-projects-tab.md
+++ b/workshop/issues/000002-open-source-projects-tab.md
@@ -69,24 +69,38 @@ design-buffer: 0.15
 total: 2.64
 ```

-*Produced via `brain/data/life/42shots/velocity/estimate-logic-v3.1.md` against `baseline-v3.1.md`. Method A only.*
+_Produced via `brain/data/life/42shots/velocity/estimate-logic-v3.1.md` against `baseline-v3.1.md`. Method A only._

 ## Plan

-- [ ] Extend and verify the typed post pipeline for optional project metadata.
-- [ ] Reuse the blog list to render project introductions with contextual GitHub links.
-- [ ] Add the Projects page and navigation entry, then build-verify the site.
+- [x] Extend and verify the typed post pipeline for optional project metadata.
+- [x] Reuse the blog list to render project introductions with contextual GitHub links.
+- [x] Add the Projects page and navigation entry, then build-verify the site.

 ## Log

 ### 2026-07-14

-- Approved direction: projects remain blog posts; `project.github` marks the one
-  canonical introduction for an open-source project. `ARCH-DRY` rules out a
+- Approved direction: projects remain blog posts; `project.github` marks a
+  substantial project introduction or reflection. `ARCH-DRY` rules out a
   parallel content collection, `ARCH-PURE` keeps selection as a simple predicate
   over normalized posts, and `ARCH-PURPOSE` requires the GitHub destination to
   survive schema → normalization → page rendering rather than exist as inert
   frontmatter.
+- Implemented the optional nested schema and normalized `Post` field, reused the
+  shared list with an opt-in GitHub link, and added `/projects` plus personal-site
+  navigation. Mirrored the shared engine, page, and test surface to 42shots
+  (`ARCH-DRY`, `ARCH-PURPOSE`).
+- TDD evidence: invalid `project.github` failed Astro content validation; the
+  corrected URL passed content synchronization. The committed process-level test
+  passed in both repositories and verified published-project inclusion,
+  non-project/draft exclusion, safe accessible GitHub linking, and no link leak
+  into an ordinary list (`ARCH-PURE`).
+- Verification: `scripts/test-projects-page.sh .`, targeted ESLint and Prettier,
+  clean `npm run build`, and `git diff --check` passed in both repositories.
+  Full `npm run check` remains blocked in both repos by matching pre-existing
+  archive `page.data: unknown[]` typing and unrelated Footer/frontmatter lint
+  debt; no task-owned file produced a diagnostic.

 ## Revisions

@@ -103,3 +117,10 @@ total: 2.64
   one repository; URL identity enforcement is outside version one.
 - Retained durable process-level build assertions for the actual metadata and
   rendering path, and re-estimated that additional test surface.
+
+### 2026-07-14 14:25 PDT — boundary review
+
+- Made test fixtures collision-safe and expanded assertions to cover the post
+  permalink, anchor-specific safety/accessibility attributes, and newest-first
+  ordering. Reclassified Astro-backed post normalization as an integration
+  boundary, and documented the authoring surface in README and atlas.
diff --git a/workshop/plans/000002-open-source-projects-tab-plan.md b/workshop/plans/000002-open-source-projects-tab-plan.md
index 0540797..1342a70 100644
--- a/workshop/plans/000002-open-source-projects-tab-plan.md
+++ b/workshop/plans/000002-open-source-projects-tab-plan.md
@@ -4,7 +4,7 @@

 **Goal:** Add a Projects tab that surfaces canonical blog-post introductions to Xian's open-source projects and links directly to their GitHub repositories.

-**Architecture:** Extend the existing post schema and normalized `Post` model with optional `project.github` metadata, then reuse the existing blog list for a filtered `/projects` page. A display-context flag enables GitHub links only on that page, keeping the shared renderer as the single implementation (`ARCH-DRY`) and filtering as a pure predicate (`ARCH-PURE`).
+**Architecture:** Extend the existing post schema and normalized `Post` model with optional `project.github` metadata, then reuse the existing blog list for a filtered `/projects` page. A display-context flag enables GitHub links only on that page, keeping the shared renderer as the single implementation (`ARCH-DRY`) and selection as a pure predicate (`ARCH-PURE`). A process-level build assertion covers the complete static rendering path without introducing a test framework.

 **Tech Stack:** Astro 5 content collections, TypeScript, Zod, Astro components, Tailwind CSS.

@@ -14,45 +14,49 @@

 ### Pure entities

-| Name | Lives in | Status |
-|------|----------|--------|
-| `ProjectMetadata` | `src/content/config.ts`, `src/types.d.ts` and 42shots mirrors | new |
-| Normalized `Post` | `src/utils/blog.ts` and 42shots mirror | modified |
+| Name              | Lives in                                                      | Status |
+| ----------------- | ------------------------------------------------------------- | ------ |
+| `ProjectMetadata` | `src/content/config.ts`, `src/types.d.ts` and 42shots mirrors | new    |

-- **ProjectMetadata** — optional metadata marking a post as the canonical introduction to an open-source project.
+- **ProjectMetadata** — optional metadata marking a substantial project introduction or reflection for discovery.
   - **Relationships:** A post has zero or one project record; a project record has exactly one GitHub URL.
   - **DRY rationale:** The nested object is the sole marker and destination, avoiding independent boolean and URL fields that can disagree (`ARCH-DRY`).
   - **Future extensions:** Optional project destinations such as a homepage can widen this object without changing marker semantics.
-- **Normalized `Post`** — the existing renderer-facing representation gains the project record.
-  - **Relationships:** One content entry normalizes to one `Post`; all consumers share it.
-  - **DRY rationale:** Metadata travels through the existing normalization boundary rather than being re-read by the Projects page (`ARCH-PURPOSE`).
-  - **Future extensions:** None planned for version one.

 Validation runs through Astro's schema/type checks and production build. This repository has no unit-test harness; adding one solely for a declarative Zod field would exceed this feature's scope.

 ### Integration points

-| Name | Lives in | Status | Wraps |
-|------|----------|--------|-------|
-| Project-aware blog list | `src/components/blog/List.astro`, `src/components/blog/ListItem.astro` and 42shots mirrors | modified | Astro rendering |
-| Projects route | `src/pages/projects.astro` and 42shots mirror | new | Static page generation |
-| Primary navigation | `src/navigation.ts` | modified | Site navigation |
+| Name                     | Lives in                                                                                   | Status   | Wraps                                     |
+| ------------------------ | ------------------------------------------------------------------------------------------ | -------- | ----------------------------------------- |
+| Project-aware blog list  | `src/components/blog/List.astro`, `src/components/blog/ListItem.astro` and 42shots mirrors | modified | Astro rendering                           |
+| Post normalization       | `src/utils/blog.ts` and 42shots mirror                                                     | modified | Astro content rendering                   |
+| Projects route           | `src/pages/projects.astro` and 42shots mirror                                              | new      | Static page generation                    |
+| Projects build assertion | `scripts/test-projects-page.sh` and 42shots mirror                                         | new      | Temporary content fixtures + static build |
+| Primary navigation       | `src/navigation.ts`                                                                        | modified | Site navigation                           |

 - **Project-aware blog list** — accepts an optional display flag and renders a direct GitHub link when enabled.
   - **Injected into:** The Projects page passes the flag; existing consumers retain current output.
   - **Future extensions:** Other project metadata can use the same context without forking the list.
+- **Post normalization** — carries schema-validated project metadata through the existing Astro `render(post)` boundary into `Post`.
+  - **Injected into:** All post consumers through `fetchPosts()` / `fetchAllPosts()`.
+  - **Future extensions:** None planned for version one.
 - **Projects route** — fetches published posts, applies `post.project !== undefined`, and hands them to the shared list.
   - **Injected into:** Astro's static route build.
   - **Future extensions:** None until project count demonstrates a need for grouping or filtering.
 - **Primary navigation** — exposes the route between Highlights and Archive.
   - **Injected into:** The existing Header through `headerData`.
   - **Future extensions:** None.
+- **Projects build assertion** — creates controlled temporary project/non-project/draft posts, builds the site, asserts the Projects and ordinary-list HTML contracts, and removes fixtures through a shell trap.
+  - **Injected into:** Local verification in each repository; no production runtime dependency.
+  - **Future extensions:** Additional rendered contracts can be added when surfaced.

 ## Chunk 1: Typed project metadata

 ### Task 1: Extend the post data pipeline

 **Files:**
+
 - Modify: `src/content/config.ts`
 - Modify: `src/types.d.ts`
 - Modify: `src/utils/blog.ts`
@@ -60,17 +64,17 @@ Validation runs through Astro's schema/type checks and production build. This re
 - Modify: `../42shots/src/types.d.ts`
 - Modify: `../42shots/src/utils/blog.ts`

-- [ ] **Step 1: Define the project metadata schema and normalized type**
+- [x] **Step 1: Define the project metadata schema and normalized type**

 Add `project: z.object({ github: z.string().url() }).optional()` to the post schema, add matching `ProjectMetadata` and `Post.project` types, then destructure and return `project` in `getNormalizedPost`. Mirror these shared engine changes in 42shots (`ARCH-DRY`).

-- [ ] **Step 2: Add an invalid temporary project fixture and verify URL validation fails**
+- [x] **Step 2: Add an invalid temporary project fixture and verify URL validation fails**

 Create a temporary published Markdown fixture with `project.github: not-a-url`, then run: `npm run check:astro`

 Expected: FAIL with a Zod URL-validation error for the fixture.

-- [ ] **Step 3: Correct the fixture and verify the typed pipeline**
+- [x] **Step 3: Correct the fixture and verify the typed pipeline**

 Change the fixture to a valid GitHub URL and give it a distinctive title/permalink value.

@@ -85,41 +89,45 @@ Keep the fixture through rendered-output verification, then remove it before fin
 ### Task 2: Add contextual GitHub links to the shared list

 **Files:**
+
 - Modify: `src/components/blog/List.astro`
 - Modify: `src/components/blog/ListItem.astro`
 - Modify: `../42shots/src/components/blog/List.astro`
 - Modify: `../42shots/src/components/blog/ListItem.astro`

-- [ ] **Step 1: Add `showProjectLink?: boolean` to both component props**
+- [x] **Step 1: Add `showProjectLink?: boolean` to both component props**

 Default it to `false` and pass it from `List` to each `Item`; mirror the shared component change in 42shots.

-- [ ] **Step 2: Render the project destination**
+- [x] **Step 2: Render the project destination**

 When the flag and `post.project` are present, render an accessible external GitHub link after the excerpt using the existing icon library and `rel="noopener noreferrer"`.

-- [ ] **Step 3: Run `npm run check:astro`**
+- [x] **Step 3: Run `npm run check:astro`**

 Expected: PASS with the new component contracts.

 ### Task 3: Add the Projects page and navigation

 **Files:**
+
 - Create: `src/pages/projects.astro`
 - Create: `../42shots/src/pages/projects.astro`
+- Create: `scripts/test-projects-page.sh`
+- Create: `../42shots/scripts/test-projects-page.sh`
 - Modify: `src/navigation.ts`

-- [ ] **Step 1: Create the static route**
+- [x] **Step 1: Create the static route**

 Mirror the restrained Highlights layout, filter `fetchPosts()` by project metadata, render `<List posts={posts} showProjectLink />`, and include a clear empty state. Port the route to 42shots for structural parity, but leave it unlinked there because its business-site navigation and content are intentional differences.

-- [ ] **Step 2: Add `Projects` after `Highlights` in primary navigation**
+- [x] **Step 2: Add `Projects` after `Highlights` in primary navigation**

-- [ ] **Step 3: Verify the rendered feature path with the temporary fixture**
+- [x] **Step 3: Verify the rendered feature path with the temporary fixture**

-Run `npm run build`, then assert `dist/projects/index.html` contains the fixture's introduction permalink and exact GitHub URL. Also assert it excludes a known published non-project post and a temporary draft project fixture. This verifies schema → normalization → published selection → contextual anchor (`ARCH-PURPOSE`).
+Implement `scripts/test-projects-page.sh` as a committed deterministic test. It creates temporary published-project, published-non-project, and draft-project fixtures under the target repo, registers a trap that removes them, runs `npm run build`, then uses `rg` assertions against generated HTML. Assert `dist/projects/index.html` contains the published project's introduction permalink and exact GitHub URL, its anchor has an accessible label plus `target="_blank"` and `rel="noopener noreferrer"`, and it excludes the published non-project and draft project. Assert a normal list page does not contain that GitHub URL, proving `showProjectLink` defaults false. Mirror the script in 42shots and run `scripts/test-projects-page.sh` in each repository. This verifies schema → normalization → published selection → contextual anchor in both repositories (`ARCH-PURPOSE`).

-- [ ] **Step 4: Remove temporary fixtures and run full verification**
+- [x] **Step 4: Remove temporary fixtures and run full verification**

 Run: `npm run check`

@@ -131,6 +139,33 @@ Expected: PASS and output includes `/projects/index.html` while Highlights and A

 In `../42shots`, run `npm run check` and `npm run build`; expect both to pass and `/projects/index.html` to be generated. Preserve the operator's existing unrelated modification to `src/pages/[...blog]/[...page].astro`.

-- [ ] **Step 5: Record evidence and commit**
+- [x] **Step 5: Record evidence and commit**

 Update issue #2's checklist and Log with verification evidence. Commit with an issue-scoped message and a `Co-Authored-By:` trailer naming the authoring model.
+
+## Revisions
+
+### 2026-07-14 14:10 PDT — change-code plan-quality gate
+
+- Added pure canonical-project selection with duplicate GitHub URL rejection.
+- Expanded generated-output assertions to cover accessibility, external-link
+  safety, default ordinary-list behavior, and equivalent 42shots fixtures.
+- Re-estimated the now-explicit cross-repository implementation and verification.
+
+### 2026-07-14 14:18 PDT — simplicity correction after gate review
+
+- Removed canonical URL/post enforcement because it was not part of the
+  operator's discoverability goal and would preclude multiple useful essays per
+  repository.
+- Added an explicit committed build-assertion script, mirrored and executed in
+  both repositories, so the rendered behavior remains reproducible after
+  temporary fixtures are removed.
+
+### 2026-07-14 14:25 PDT — boundary review
+
+- Reclassified normalized-post construction from PURE to INTEGRATION because it
+  invokes Astro rendering.
+- Made fixture setup refuse collisions before registering cleanup and expanded
+  assertions for the introduction permalink, anchor-specific attributes, and
+  newest-first ordering.
+- Added README and atlas documentation for the author-facing metadata and route.

exec
/bin/zsh -lc "projects=dist/projects/index.html; highlights=dist/highlights/index.html; rg -q 'Project render published test' \""'$projects"; rg -q '"'href=\"/2030/01/project-render-published-test\"' \""'$projects"; rg -q '"'href=\"https://github.com/xianxu/project-render-test\" aria-label=\"View Project render published test on GitHub\" rel=\"noopener noreferrer\" target=\"_blank\"' \""'$projects"; new_offset=$(rg --byte-offset -o '"'Project render published test' \""'$projects" | head -n 1 | cut -d: -f1); older_offset=$(rg --byte-offset -o '"'Project render older test' \""'$projects" | head -n 1 | cut -d: -f1); ((new_offset < older_offset)); ! rg -q '"'Project render nonproject test|Project render draft test|project-render-draft-test' \""'$projects"; rg -q '"'Project render published test' \""'$highlights"; ! rg -q '"'https://github.com/xianxu/project-render-test' \""'$highlights"; printf '"'rendered assertions pass; offsets %s < %s\\n' \""'$new_offset" "$older_offset"' in /Users/xianxu/workspace/xianxu.dev
 succeeded in 0ms:
rendered assertions pass; offsets 10528 < 11843

codex
```verdict
verdict: SHIP
confidence: high
```

The implementation satisfies the issue’s Spec and Plan. The previous boundary blockers are resolved: fixtures are collision-safe, rendered assertions cover ordering and anchor-specific behavior, normalization is correctly classified as INTEGRATION, and README/atlas documentation now covers the new surface.

## 1. Strengths

- [projects.astro](/Users/xianxu/workspace/xianxu.dev/src/pages/projects.astro:8) reuses the published, newest-first `fetchPosts()` pipeline and applies only the project-membership predicate.
- [ListItem.astro](/Users/xianxu/workspace/xianxu.dev/src/components/blog/ListItem.astro:112) keeps GitHub rendering contextual, accessible, and external-link safe.
- [test-projects-page.sh](/Users/xianxu/workspace/xianxu.dev/scripts/test-projects-page.sh:11) checks all fixture paths before installing cleanup, preventing existing content from being overwritten or deleted.
- The test now pins the introduction permalink, complete GitHub anchor attributes, newest-first ordering, draft/non-project exclusion, and ordinary-list isolation.
- [blog-surfaces.md](/Users/xianxu/workspace/xianxu.dev/atlas/blog-surfaces.md:6) and [README.md](/Users/xianxu/workspace/xianxu.dev/README.md:3) document the architectural and author-facing surfaces.

## 2. Critical findings

None.

## 3. Important findings

None.

## 4. Minor findings

None.

## 5. Test coverage notes

Shell syntax validation passed. The committed generated output satisfies every assertion in the revised process test, including ordering (`10528 < 11843`), exact introduction and GitHub anchors, exclusions, and contextual-link suppression. `git diff --check` also passed. The tracker transparently records unrelated pre-existing failures preventing a clean full `npm run check`.

## 6. Architectural notes for upcoming work

- **ARCH-DRY — pass:** one post schema, normalized model, and shared list renderer serve all consumers.
- **ARCH-PURE — pass:** project selection remains a deterministic predicate, while Astro-backed normalization and rendering are accurately classified as integration boundaries.
- **ARCH-PURPOSE — pass:** project metadata is validated, normalized, and consumed by the published-only discovery page; no hand-maintained parallel membership source remains.

## 7. Plan revision recommendations

None. The boundary-review revision accurately reconciles the plan with the implementation.
tokens used
75,958
```verdict
verdict: SHIP
confidence: high
```

The implementation satisfies the issue’s Spec and Plan. The previous boundary blockers are resolved: fixtures are collision-safe, rendered assertions cover ordering and anchor-specific behavior, normalization is correctly classified as INTEGRATION, and README/atlas documentation now covers the new surface.

## 1. Strengths

- [projects.astro](/Users/xianxu/workspace/xianxu.dev/src/pages/projects.astro:8) reuses the published, newest-first `fetchPosts()` pipeline and applies only the project-membership predicate.
- [ListItem.astro](/Users/xianxu/workspace/xianxu.dev/src/components/blog/ListItem.astro:112) keeps GitHub rendering contextual, accessible, and external-link safe.
- [test-projects-page.sh](/Users/xianxu/workspace/xianxu.dev/scripts/test-projects-page.sh:11) checks all fixture paths before installing cleanup, preventing existing content from being overwritten or deleted.
- The test now pins the introduction permalink, complete GitHub anchor attributes, newest-first ordering, draft/non-project exclusion, and ordinary-list isolation.
- [blog-surfaces.md](/Users/xianxu/workspace/xianxu.dev/atlas/blog-surfaces.md:6) and [README.md](/Users/xianxu/workspace/xianxu.dev/README.md:3) document the architectural and author-facing surfaces.

## 2. Critical findings

None.

## 3. Important findings

None.

## 4. Minor findings

None.

## 5. Test coverage notes

Shell syntax validation passed. The committed generated output satisfies every assertion in the revised process test, including ordering (`10528 < 11843`), exact introduction and GitHub anchors, exclusions, and contextual-link suppression. `git diff --check` also passed. The tracker transparently records unrelated pre-existing failures preventing a clean full `npm run check`.

## 6. Architectural notes for upcoming work

- **ARCH-DRY — pass:** one post schema, normalized model, and shared list renderer serve all consumers.
- **ARCH-PURE — pass:** project selection remains a deterministic predicate, while Astro-backed normalization and rendering are accurately classified as integration boundaries.
- **ARCH-PURPOSE — pass:** project metadata is validated, normalized, and consumed by the published-only discovery page; no hand-maintained parallel membership source remains.

## 7. Plan revision recommendations

None. The boundary-review revision accurately reconciles the plan with the implementation.
