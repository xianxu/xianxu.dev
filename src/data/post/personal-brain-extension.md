---
title: "Building A Personal Brain Extension, A Teaser"
publishDate: 2026-05-01
published: true
excerpt: "Two weeks of building the substrate underneath an AI-native personal workflow: a base agentic development environment, a personal data access layer, a credential gateway, and a private canvas where ideas form, collide, and grow. Not ready for release yet — here's a sneak peek."
tags:
  - tech
  - ai
---

The last two weeks I've been building toward an agentic environment that I can use daily, for a variety of tasks — coding, planning trips, organizing email, getting reminders. Everything. I've been living inside rough early versions of it for a while now, while building toward something cleaner.

AI is powerful; humans bring purpose. We're in the age of figuring out how to harness one with the other. The first useful place to put AI, for me, is as an extension of my ability to organize, learn, and create.

This environment manifests as a few pieces: a base agentic development workflow that manages everything inside a repository (`Ariadne`); a personal data access layer that lets agents read your email and calendar, your Apple notes, and call out to other AI tools (`Nous`); a credential gateway that hides private credentials from those agents (`Charon`); a deterministic editor experience for inspecting and steering AI artifacts (`Parley`); and a private canvas where ideas form, collide, and grow (`Brain`). It's not a product. It's the base layer that future products in the personal-assistant space will live on. Most importantly, the whole stack is AI-native.

By "AI-native" I mean three things: (1) agentic coding is the *main* coder, often the *sole* coder; (2) every process gets rethought to run at AI speed — ideas, roadmaps, projects, issues are all just artifacts inside git-controlled repositories, managed either by the AI or by deterministic code the AI writes; (3) scaffolding holds quality high — skills, plans, post-milestone code review, many many tests. Everything else inherits from this `Ariadne` base layer.

## What this looks like in practice

The credential gateway — call it `Charon` — went from idea to working end-to-end in about a week of focused work. Agents make HTTPS calls; Charon swaps in the right secret; the agent never sees it. Charon also ships with a simple terminal UI for managing credentials, and the security boundary got careful threat modeling along the way. The development loop is iterative on purpose: don't over-spec, ship a thin slice, see what breaks, fix, repeat. Plenty wasn't anticipated, including API drift at the providers Charon talks to. This generation of AI carries enormous world knowledge — over-specifying just dumbs it down. Provide enough sketch to guide it, then let it do the research alongside you.

## Building the tools that build the tools

It's not just about building a proxy service. Quickly you realize you're also building the tools that *support* building it: an issue tracker, a project-management view, a lessons log. Why build those instead of reaching for a SaaS? Local artifacts can be manipulated by the AI directly, and that turns out to be extremely powerful. So you start building the tool that builds the tool that builds the service you want to build.

At some point I noticed several of those workflow tools were structurally the same — semi-schematized markdown files. So I built an agent skill called `datatype` whose job is to help you create new data types, each one a semi-schematized markdown file with both a shape for the data and a process for how that data evolves and how related artifacts should change with it. Yes, an oxymoron — markdown with structure, where the structure is held by the agent, not by code. This pattern works surprisingly well with `Claude`.

## Two side projects, same shape

Two side projects from the same two weeks hint at the same pattern. Both came together on the side of Charon, in roughly half a day of wall time each:

- **Mining My Own Mind** — can two weeks of Claude Code transcripts surface my own taste back to me, to serve as future guidance for agents? Yes, it seems so — ended up with 17 rules that read like best practice.

- **Project Time Estimator** — can a structured procedure get me better at estimating how long features take, with a feedback loop wired in? First calibration cycle: estimated a feature at 41–78 hours, shipped it in five.

What surprised me wasn't that any of these worked. It was how cheap it was to find out — when the scaffolding is there, trying a thing costs almost nothing. What's left is imagination, and **the willingness to think differently**.

## Why I think this generalizes

Two weeks isn't long enough to know whether this particular stack will hold up. I'd guess at least another month before any of it is ready to share. So I don't know for sure.

But the velocity I've felt building it is, I think, the more important signal. Not because AGI is around the corner — but because the current generation of agentic AI is already a serious extension of knowledge work, and most companies haven't begun to organize around that fact. Knowledge work that runs at AI speed needs different processes, different artifacts, different feedback loops than knowledge work that runs at human-typing speed. That's the thesis `Ariadne` was founded on, and the last two weeks have made me more confident in it, not less.

More to come as the pieces release.
