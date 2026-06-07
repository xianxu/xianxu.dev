---
title: A Nice Research Workbench
publishDate: 2026-06-07
published: false
excerpt: "AI is powerful, but it is not an oracle. It does not have a magic wand to know what you want. You need to know the tools and how to properly work with AI, to further your knowledge and create new things. Here's an example how I wrote the blog about space data center. "
tags:
  - tech
  - ai
---

<!-- SKELETON — bullets are evidence/quotes gathered from the session; write the prose in your voice. 🤖{} marks where I need you. -->

I just published [The Case for Space Data Centers](./the-case-for-space-data-center.md). The post is fine — but *how* it got written is the part I actually want to show you. It's a worked example of a knowledge worker using AI **properly**: not "AI, write me a blog," but a research workbench where I keep the intent and the through-line, AI does the facts, math, drafting and mechanics, and a deterministic shell (git-journaled rounds, fresh-context fact-checks, build gates) keeps the whole thing honest.

## It started as a conversation, not a writing task

- I didn't open with "write a post." I opened with a *physics question*: > "I'm thinking about space data center… help me compute something… what's the temperature of the device need to be, to break even?"
- We did back-of-envelope calcs and I kept **pushing back**, which is where the thesis actually came from: the front absorbs the unconverted 70% → *"I don't think this is a problem"*; *"you don't repair, just deorbit"*; *"ship a disk to space"*; *"LEO is closer to users → it's edge computing."*
- The argument *emerged through investigation* — many shots, not one. (Tie to: AI as brain-extension that accumulates, not a one-shot oracle.)
- **Division of labor:** I own the questions and the pushback; AI supplies the math and surfaces the option space.

## From conversation to a first draft

- The trigger: > "ok, based on this discussion, write a blog post on the thesis… debunk lazy talking points… put it in `the-case-for-space-data-center.md`."
- 🤖{You asked about this: it was *not* a skeleton-first flow. You asked me to draft from our discussion — I wrote the first full draft from the conversation, after reading your existing posts to match your frontmatter + voice. You'd shaped all the *content* through the brainstorm, but the initial prose was AI-drafted. Confirm that's how you want to tell it.}
- The draft was a **starting point, not the product**.

## Co-authoring in the document, turn by turn

- The protocol I proposed: > "we will start co-author… use /xx-fix format… turn based commit… I'll add my questions in the doc, and you answer in the doc, and also here."
- The **🤖 marker convention**: `[human]` / `{agent}` sections alternate in the doc; `~old~{new}` for copy-edit *replacement proposals* I accept/reject in my editor.
- **Git-journaled rounds** (`docflow`): a review branch, a human commit at each turn-start, an agent commit at turn-end, ~16 rounds preserved in `git log`; plus the rule "if the doc changes mid-edit, yield — don't interleave."
- The **document is the shared workspace; chat is the side-channel.**

## The substrate: xianxu.dev as an Ariadne repo

- The whole thing worked because this blog is an *Ariadne-styled* repo — the `/xx-fix` skill (symlinked from `ariadne/construct/local/fix`) and `docflow` (`ariadne/scripts`) were already available here. > "the /xx-fix lives in all ariadne repos… let's use the one symlinked from xianxu.dev."
- 🤖{Item 4 on your list — "xianxu.dev *became* an ariadne repo." In our session it was *already* set up that way (the symlinks existed when we started); I don't have the conversion moment. If you converted it earlier/separately, you have that story — tell me and I'll fold it in.}
- (Tie to your themes: the deterministic shell, git as the only state, skills as portable procedure — what turns "AI helps me write" into a *governed process*.)

## Teaching the tool as we went

- The key refinement, in your words: > "when I ask them here, doesn't mean… you should go review… I would use 'review' as the keyword."
- So we **codified explicit triggers** into the skill *while using it*: free-form chat changes nothing; review rounds run only on "go review" / "update the doc"; a session opens on "start a docflow"; and a **reading-frontier** rule (text above the first open marker is settled).
- This is the crux of *leveraging AI properly*: I can **interrogate freely** (build intuition, check facts) **and** drive **precise edits** — without the two modes colliding. The collaboration produced its own tooling.

## Trust but verify: a fresh-context second agent

- The ask: > "do a fresh context review with codex… only report issues and reference found… codify such fresh context 2nd agent review."
- **Codified it:** an external, read-only, *cross-model* agent (codex / GPT-5.5, then a third pass with `agy` / Gemini) audits the doc for facts + citations and **never edits**; I triage the report.
- The cross-check **earned its keep**: agy claimed a footnote link was a dead 404 and offered a "fix" — a `WebFetch` showed the original was live, so I **rejected the hallucinated correction**. Net result: every quantitative claim footnoted (14 references), fact-checked by two independent models *and* me.
- **Why fresh context:** the co-author carries confirmation bias — a separate agent with no history catches what you both missed.

## The craft details (AI as a capable IC)

- A hand-authored **inline SVG** of a sun-synchronous orbit (you asked: *"good ways to draw SVG… draw this sun-synchronous orbit"*) — math diagram, dark-mode aware, no dependencies.
- **Rendering plumbing:** wired up KaTeX for the equations; restyled footnotes (subdued, auto-revealed heading); fixed mobile equation overflow with a visible scroll affordance — all build-verified, and **mirrored to the sibling blog** so both engines stay in lockstep.
- The fiddly engineering — pipelines, CSS, cross-repo sync — is exactly where AI-as-IC shines, freeing me for intent and taste.

## What this says about knowledge work + AI

- **Not an oracle.** AI doesn't know what I want; I bring the intent, the through-line, the taste, and the pushback. (Tie to the excerpt.)
- **The division of labor:** human = questions, long-range logical consistency, intent, judgment; AI = facts, math, drafting, mechanics, fresh-eyes verification.
- **The shell makes it trustworthy:** git-journaled rounds, explicit triggers, fresh-context fact-checks, build gates — determinism wrapped around a probabilistic core.
- **The result:** a post I couldn't have produced alone at this quality and speed — with a complete audit trail of how every claim and every sentence got there.

🤖{Skeleton done. Two open questions for you flagged above (draft-vs-skeleton framing; the "became an Ariadne repo" story). Tell me which sections to expand first and I'll draft prose in your voice — or you write and I review.}
