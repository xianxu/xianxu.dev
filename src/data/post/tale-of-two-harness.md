---
title: A Tale of Two Harnesses
publishDate: 2026-04-16
excerpt: "Adding tool calls to Parley on a flight, watching Claude make a mess, then drawing the architecture by hand and watching it execute flawlessly within those lines. The eureka: Claude Code is the convergent execution harness, Parley the divergent thinking one — both running on the same shared filesystem state."
tags:
  - ai
  - tech
---

I've been building a Neovim plugin called [Parley](https://github.com/xianxu/parley.nvim) for the past year, mostly as a way to understand what this vibe coding is about, while making some tools I like to use in nvim. 29K lines of Lua, 700+ commits, all written by AI agents, steered by me. It started as a chat environment — a way to have AI conversations inside my editor without the limitations of ChatGPT's UI, a humble beginning. It has by now grown into a workbench/harness that forms a power tool for how I work.

What happened in the past week in particular surprised me. I set out to build some rather complex feature: an AI harness in nvim, and ended up stumbling on the pattern of **one repo, multiple harnesses**.

## The Flight Hack

On a flight from Pittsburgh to SF, I started adding tool call support to Parley. Basic stuff: let the AI read and write files, list directories, search content. About 7K lines of change. The goal was simple — if Parley can touch the filesystem, it can do more than just talk.

This was Parley's first step from "conversation tool" toward something I'd later call a **harness** — an environment that doesn't just chat with AI, but runs structured AI loops in a directory.

## The Struggle That Ensued

Tool calls introduced a multiplexed stream — AI responses now interleaved with tool calls and their results. And here's where things got interesting. The AI (Claude Code, building Parley) made a huge mess of it. It kept packing the new stream handling on top of old code that assumed a single insertion point in a buffer. Patch on top of patch, and well, it didn't know it needed to stop. And it took me some time to get it to finally stop and not revert to that old habit. I also needed to abort the tool call feature, to refactor this portion of code first, to dig myself out of the AI tech debt, so to speak.

I had to stop the AI and impose the architecture myself. There was already an abstraction of an intermediate model of [{question, answer}] that represents what's in a nvim buffer, all we needed to do was enforce 1) represent more free-style tool call blocks in that structure and 2) use relative positioning to simplify the math. It took me quite some time to convince the AI to follow this to the letter, including various false starts when I forced it to print out state which showed it was not following that architecture choice.

This was the most intensive human intervention in my memory with AI coding. It took another 7K lines of change and 31 commits to refactor all code into this new model. 

In hindsight, this was one of the most important moments of the week. Not because of what got built, but because of what it demonstrated: **the human provides the structure, the AI provides the labor.** When the AI couldn't see the right architecture, iteration alone wasn't converging. I had to draw the boundary. Once I did, and in this case, painfully, the AI executed successfully within it.

Another interesting aspect of this is that all this "steering", I still don't know how to write `lua` — though I've learned to read and audit it. This illustrates two things to me: that humans can provide value at a higher plane than coding, and that coding agents are mature enough to execute reliably within a well-defined architecture. A new era is really upon us.

## Parley Becomes a Harness

The real reason I wanted tool calls was to build an inline review system for my writing. And this is where Parley stopped being a chat tool and became something different.

The review system works like this: I write a document in markdown, and anywhere I want feedback, I drop an inline marker:

```
㊷[this paragraph is too vague, find some examples from ./somewhere/in/the/file/system/markdown.md]
```

An AI agent reads the document, finds the markers, and rewrites the marked sections. If it needs clarification, it can ask back:

```
㊷[too vague]{do you mean the technical details or the business framing?}
```

To which, I can respond inline, and the conversation continues — all inside the document itself. The document IS the conversation.

The integration with Neovim was pretty natural. Changes show up with diff highlighting. Edits needing human attention land in Neovim's quickfix list, so I can navigate feedback like I navigate compiler errors. Editorial notes display through the diagnostics system. The editor's native machinery, repurposed for human-AI collaboration on prose.

Here's the thing I noticed: this is a fundamentally different kind of AI loop from what Claude Code runs. Claude Code takes a task and drives toward implementation — write code, run tests, iterate until it passes. 

The review loop is different. The human writes. The AI comments. The human responds to comments. The AI adjusts. It's collaborative and document-centric. The transcript matters. 

Two different loops. Two different interaction models. Both useful. Both operating on the same files.

## Starting a repo for agent skills

After finishing up the parley review tool, I started a repo to accumulate agent skills — reusable workflows that encode how I want AI to participate in specific tasks. A **voice adaptation** skill that learns my writing style from 40 blog posts and rewrites AI drafts to sound like me. An **interview feedback** skill that turns my lightweight interview notes (Parley's interview mode) into structured hiring feedback, with policies baked in (gender-neutral pronouns, no names, generic TC — habits from my Meta days). A **critique mode** that has AI leave adversarial comments on a document, which I then address through the same `㊷[]` review loop.

Building these, I accidentally decomposed writing into AI-operable stages. If I wrote a document to near-publishable quality, AI does surgical edits in review mode. If AI generated the first draft from my rough ideas, applying my voice becomes the critical step — otherwise it reads like AI slop. Same underlying tools, different starting positions, different emphasis. These aren't separate features. They're stages in an editorial process — drafting, critiquing, revising, polishing — and what I'd been doing was converting each stage into a human-steered, AI-powered workflow. That pattern feels like it generalizes well beyond writing.

## The Construct: Meta-Programming in a Stochastic World

Then I built something stranger: `/construct`, a meta-tool for evolving skills across repositories. The problem it solves: you have upstream skills (like a community-maintained set of development practices, e.g. `superpowers`), and you have your own philosophy (your `AGENTS.md`, your workflow preferences etc.). How do you combine them?

Text merging doesn't work — skills aren't code, they're instructions for a stochastic machine. You can't `git merge` them. So I experimented with what I started calling "semantic merge": store the intent (the conversation that produced the adaptation), not the patch itself. When the upstream changes, you replay your intent against the new version. The AI does the merge, guided by your recorded reasoning. There are even verification steps for each of those adaptation rules. And I plan to keep tweaking such adapters — as I use `superpowers` during coding, the aspects I don't like go to the adaptation layer.

This was the start of a repo — a workbench for building, adapting, evolving and sharing skills across harnesses. After building the Construct, I adapted a set of development practice skills into the Parley repo, making them work harmoniously with Parley's design philosophy. The Construct made this possible in a structured, repeatable way.

## The Eureka

Somewhere around this point, building a tool in one UX, then accessing the spirit of that tool from another UX, I had the realization that should have been obvious from the start:

It's just **two harnesses on the same state.**

- **Claude Code** is the execution harness. Convergent. It takes a spec and drives toward implementation. Write code, run tests, iterate. Disposable conversations. The human cares more about the output feature, not the actual code. Well, I know this point might be controversial.
- **Parley** is the thinking harness. Divergent. It's where I explore, branch, change my mind, annotate, critique, and shape ideas. The human is firmly in the driver seat, checking both the final artifact but also the intermediates. The human does the work, AI assists.
- **The file system** is the shared state. In my case, several repos I typically operate in. Both harnesses read and write the same set of files. And you use the best harness to transform them into what you want. 

The state is the integration layer. No bridges. No APIs. No copy-pasting between apps. A file written by one harness is immediately available to the other, because they share the state, the full state. 

Most people think of AI tools as standalone applications. You use Cursor for coding. You use ChatGPT for questions. You use Notion AI for docs. Each tool has its own state, its own context, its own AI. What if they all operated on the same file system? That's what I did in developing `parley` — vision, roadmap, brainstorming, issues, documentation, code, tests, everything in that single repo. And the result is liberating. At least for a solo developer.

The insight is that **the state — your files, your repo, your accumulated context — is the real workspace.** The harnesses are just specialized lenses and transformers on it. You pick the right tool for the job. And because they share state, work done in one is immediately available in the other.

## Where This Leads To

I started thinking about what this means beyond coding. If the pattern is right — shared state, specialized harnesses that provide the right UX for human steering — then it's not just a developer workflow. It's a knowledge work workflow. And more importantly, figuring out how non-coders can continuously improve upon their harnesses on that shared state, making their workflows hyper-charged.

That's the topic for my next post.
