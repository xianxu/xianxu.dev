---
title: Pair — A Better Claude Input Interface
publishDate: 2026-05-02
published: true
excerpt: "Saturday morning, before exercise, I asked Claude one stray question. By afternoon there was a new repo, a pensive, four issues, and a working tool I'm using to write this post."
tags:
  - tech
  - ai
highlight: true
---

Saturday morning, before exercise, I asked Claude:

> is there a way for external process to inject text into TUI (say claude code's input window)?

This started the creation of [pair](https://github.com/xianxu/pair), a small tool that makes Claude Code's input box better. It actually works for any TUI program. Writing this down for people curious about what "agentic coding" is. Full transcript of this coding session is available [here](./saturday-pair-transcript.md), extracted by the same process that created `pair` and wrote the initial draft of this blog post. It's *recursion* all the way down!

## How it started

Pure curiosity. Claude Code's input box had been irritating me for a while now:

- **Not a real editor.** Yes, you can do `Ctrl-g` to bring up `nvim`, but returning to Claude often messes up previous printed lines. You can't search in that buffer, no mouse support either. Plus, you can't see the history anymore while in the editor, a huge drawback.
- **Accident-prone.** Easy to accidentally hit `Return` and send the prompt prematurely, particularly when you copy-paste from somewhere.
- **Copy from Claude gives hard wraps.** Select a paragraph from Claude's output and your clipboard has `\n` baked in at every terminal column. Paste it anywhere that respects soft-wrap and it looks mangled. I often do this, with a leading `>`, so I can indicate what I'm referring to.

I want to make my workflow better.

By the afternoon there was a new repo named `pair`, a [pensive](https://github.com/xianxu/brain) committed to my notes, four issues filed, a `lessons.md` entry, an `atlas/architecture.md`, and a working tool I'm using to type this post.

This is the story of how that happened, and an example of how far personalized software can go.

## The wall is shorter than it looks

The first half hour was just back-and-forth on terminal mechanics with Claude, mostly the agent giving me ideas of what was possible.

> `tmux send-keys` works. zellij has `zellij action write-chars`. TIOCSTI is dying (Linux moved it behind a flag, OpenBSD removed it). OSC52 is mostly write-only. The pieces are there if you compose them right.

About 90 minutes in, the design had assembled itself in my head and the agent's context:

- Run `zellij` with a horizontal split.
- Top pane: `claude` (or `codex`, or `gemini` — same plumbing works for any TUI agent).
- Bottom pane: `nvim` editing a persistent draft file.
- A keybind in nvim that takes the buffer, types it into the agent pane via `zellij action write-chars`, then clears the draft.
- A keybind in the agent pane that grabs whatever the user has selected and dumps it into nvim, quoted with a `>` prefix.

Nothing exotic.

## From chat to artifact

I stopped and asked Claude to "make a pensive out of this." A pensive is what I call a thinking-out-loud note that lives under `docs/vision/` in what I would call **brain** repo. It's just a staging ground of persisted memory and discussion I had with the agent, continuously being organized. Pensive itself is not a spec, not a plan, just the moment when the thought happened, in my voice, with the open questions still open. In my "agentic workbench" called `ariadne`, I have a meta skill called `datatype`, and `pensive` is merely one kind of semi-typed markdown file.

I didn't write the pensive myself. Claude distills the conversation into prose, picks a slug, places the file at the right location. I copied it over to the [pair repo](https://github.com/xianxu/pair/blob/main/docs/vision/2026-05-02-01-pensive-nvim-as-input-field-for-tui-coding-agents.md) for your reference.

## Issue, then a new repo

Once the pensive was in, I filed an issue against `brain/workshop/issues/`. Halfway through writing it I changed my mind: this isn't a `brain` thing — it's its own thing. So, new repo.

The bootstrap was one command:

```sh
cd ../pair && ../ariadne/construct/setup --vendor
```

`Ariadne` is my base layer for "AI-assisted single-developer workflow" — `AGENTS.md`, `Makefile.workflow`, the `workshop/` folder structure, the `atlas/` map, a set of `xx-*` skills for typed documents and issue management. `--vendor` copies all of it into the new repo so it's self-contained, no symlink dependency on my home checkout. From an empty directory to fully scaffolded in about a second.

I moved the issue from `brain` to [pair/workshop/issues/000001-pair-nvim-driven-tui-agent-setup.md](https://github.com/xianxu/pair/blob/main/workshop/history/000001-pair-nvim-driven-tui-agent-setup.md). Renumbered, updated the pensive cross-reference path, ran `make issue-sync` to push the renumbered issue to GitHub. That is the entire "starting a new project" overhead. I am pretty amazed every time.

## Building it

The build itself was Claude doing the typing and me doing the testing and steering. `pair` took shape very fast. Well, there wasn't that much code to write; rather, you need a plethora of knowledge in several rather arcane areas, and AI is perfect for that.

Normal back-and-forth: test what's implemented, notice ergonomics that can be improved, rinse and repeat.

## The side issues

This is the part I want to point at.

While building issue `#000001`, several side concerns surfaced. Each became its own issue:

- **[#000002](https://github.com/xianxu/pair/blob/main/workshop/history/000002-each-pair-session-may-have-a-name.md)** — each pair session may have a name. Started as a `-n NAME` flag idea. Iterating in conversation, the design settled on an interactive prompt with the auto-generated name as the default. Implemented same session.
- **[#000003](https://github.com/xianxu/pair/blob/main/workshop/issues/000003-make-a-blog-post.md)** — make a blog post (this one).
- **[#000004](https://github.com/xianxu/pair/blob/main/workshop/history/000004-always-picker-no-auto-attach.md)** — *Claude filed this one on its own*, while I was complaining that the auto-attach behavior was surprising in a long-lived-session world. The agent recognized the design change was non-trivial enough to deserve its own issue, filed it, set it to `working`, ran `make issue-sync`, and then implemented the rewrite. I did not ask for the bookkeeping. I would not have remembered to do it.

As you can see, AI is great at tracking things, if you give it some structure for how things should be tracked. All of that is in the `ariadne` layer. You might wonder why I put all these processes inside a single repo. This design originated from my strong desire to remove the chrome, the incidental complexities. Everything is a file (with processes around it), carrying its full history, in a uniform way. Plain and simple.

## The shape of this kind of work

A few hours, a few breaks. Artifacts:

- One pensive.
- A new repo `pair` with seven files of code and config, a README, an architecture atlas, four issues, a `lessons.md` entry, ~30 commits to main.
- A working tool that's `homebrew` installable, by the time of this writing.

Most of those artifacts I would not have produced on my own. I have no idea about those terminals and how they behave. But I have a clear view of what I want, and this vision gave the AI its purpose. The result's quite magical.

This is the magic of "agentic coding"!
