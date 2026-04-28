---
title: My AI Coding Workflow
publishDate: 2026-03-08
excerpt: "An iterative spec flow built on a small Makefile and a handful of markdown files — issue, todo, lessons, specs — cuts through the opaque magic of workflow tools. The trick is treating specs as sketches that bound the agent's search space, not exact behavior to confine it."
tags:
  - ai
  - tech
---

*I used to write code; now I write poems...* - so to speak

Previously, I introduced my thoughts that [AI is the new abstraction layer](/2026/02/ai-as-new-abstraction), and marveled at how far [AI coding has matured](/2026/03/dawn-of-ai-coding). So I went in a big way into tinkering in [parley.nvim](https://github.com/xianxu/parley.nvim) and would love to share the experience and the workflow I follow. If you remember my post [10 months ago](/2025/05/ai-coding-take-2#examples-of-the-bad), I got stuck in some semi-complex features. This round, it was easy to power through them, I haven't found anything that I wanted to create that I couldn't get the agent to do it for me!

## The workflow orchestration space

I was initially impressed with tool like [Conductor](https://www.conductor.build/). In hindsight, it was a matter of the typical AI shock and awe. It turns out there are plenty of tools in this workflow orchestration space, such as [Vibe-Kanban](https://vibekanban.com/), and OpenAI just released [Symphony](https://github.com/openai/symphony). 

When we take a closer look at those tools, you realize the core capability of such workflow came from the model and the system prompts. So I went ahead and built a simple workflow that suits my needs, mostly as a way to learn those intricacies. Part of that is to cut the middle-man's opaque magic. Well, it turns out there aren't too much of such magic anyway. This is similar to the days where I [tweaked my dotfiles](/2025/01/dot-files) to fit my workflow, just super charged with AI capabilities.

I tweaked the workflow based on my belief of how medium scale development would be in the immediate future to take advantage of current AI capabilities. Maybe once I run this enough, I would be more comfortable with a flow further away from terminal and code.

## The workflow around git and github

First is a set of tools to manage multiple git worktrees. It turns out with AI coding, it's pretty simple, just ask `Claude` to do it. I choose to have targets like the following in Makefile:

1. `make issue 42` to create a new worktree for github issue 42. It also dumps issues into `tasks/issue.md`, such that when I'm in the worktree folder, and start AI coding agent, I just need to say: "go work", and it will pick up `tasks/issue.md` and start working on it. The fact they should use `tasks/issue.md` is in the system prompt.

2. `make pull-request` to submit current worktree as a pull request.

3. `make merge` to merge the current pull request, and clean up local worktree and branch, close associated github issue.

You get the point, just ask `Claude` to make a Makefile target for your workflow. Those are just conventional stuff, but with AI, everyone can tweak their workflow to their heart's desire.

I also reserve a simpler workflow, directly work on `main` and push to `main` when done, fine for small personal project.

## The workflow around AI agent

You may recall previously I expressed [slight unease](/2026/03/dawn-of-ai-coding#para-as-to-openspec-im-still-learning-to-use-it-one-h) with `OpenSpec` during my learning, as I couldn't picture mentally how the various levels of specs stay synchronized with each other and with the code. You only get a promise from AI that it would be so. Plus, it is often very hard to understand a problem space fully upfront, and using the imprecise human language to specify all the details is hard. I went through an instance of this, when trying to create oauth flow for `parley.nvim`, and realize it is much more complicated than I initially understood it to be. There would be no way for me, who only know oauth as a user, to understand all those nuances upfront.

Instead, I have constructed the following workflow, which I would call: **Iterative Spec Flow**. The key premise is to let go full specification upfront, with the rationale that coding itself uncovers edge cases and details. The spec in this flow, is the spec of boundaries to constrain an agent's search space, not all the exact details to follow. And as coding continues, the spec evolves with new discoveries. In this flow, human has a couple of definitive places to review and verify.

### Files involved

1. **Orchestration glue**: [`AGENTS.md`](https://github.com/xianxu/parley.nvim/blob/main/AGENTS.md). This is the main system prompt file. It explains and ties several other markdown files agent should maintain.

2. **Project definition**: `tasks/issue.md`. The work for each worktree. This is user provided, for example, `make issue 42` will populate this from GitHub issue 42.

3. **Agent state**: 

    1. `tasks/todo.md`: this is the agent's planning space and encodes agreement with the user within this session. I instructed agent to insert checkpoints for human manual review in their checklist. At end of session (pull request merged), `tasks/todo.md` is cleaned up, its states merged to `specs/` files.

    2. [`tasks/lessons.md`](https://github.com/xianxu/parley.nvim/blob/main/tasks/lessons.md): agent is instructed to record their learning as session goes on. Currently this file is committed so it survives across different feature development. This represents repo specific knowledge that agent has learned, a soft version of system prompt. I believe it is worth checking this file occasionally to keep it concise.

4. **Shared knowledge base**:
    1. The [`specs/`](https://github.com/xianxu/parley.nvim/tree/main/specs): this is where agent put spec files. Those are not formal specs, rather sketches of specs to limit agent's search space. I instruct agent to always keep this updated as they change code. I even have `make test-changed` that drive testing based on which spec files changed. You can think those `specs/*` files encode sketches of what was the user request in `tasks/issue.md`, and second level details in `tasks/todo.md`.

        1. There's [`specs/index.md`](https://github.com/xianxu/parley.nvim/blob/main/specs/index.md) as an indexing file, the hope is that agent can progressively discover specs, like how [agent skills](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview) is processed.

        2. There's [`specs/traceability.yaml`](https://github.com/xianxu/parley.nvim/blob/main/specs/traceability.yaml) as a mapping between specs and tests needing to run. The goal is to cut down time for agent to ground itself (running test). 

        3. All the files in `specs/` are retrofit from code and previous `README.md` file, with lightweight human review. Treating this as scaffold for agent to build on.

With those files, they are managed by instructions in [`AGENTS.md`](https://github.com/xianxu/parley.nvim/blob/main/AGENTS.md) and [`tasks/lessons.md`](https://github.com/xianxu/parley.nvim/blob/main/tasks/lessons.md). 

### The workflow looks like

1. `make issue 42` to create a new worktree for the issue.

2. `claude` or `codex`, then ask it to "go work". System prompt [^go_work] is strong enough for agent to pick up `tasks/issue.md` and start working on it. This typically involves creating `tasks/todo.md` and updating `specs/` files. 

3. System prompt instructed agent to insert manual verification steps, this is often when I discover spec issues. Back and forth with agent ensues. Occasionally agent update `tasks/lessons.md` to reflect on their learning. 

4. More often than not, after a pivot, I need to prod them to update `tasks/todo.md` with new plan. It seems they only remember to do it at the start of a session.

5. I still manually commit code when I think it's in stable enough state. I suspect it would be easy to instruct agent to do so directly, but I still want more control and predictability.

6. When a pull request is ready, I have another agent to code review. I'm using the [superpowers](https://github.com/obra/superpowers) agent skills library for that. Unfortunately I haven't dive deep enough to see what it does yet.

## Learnings and Thoughts

1. **Don't over specify**: treat the specs for AI as sketches to reduce AI search space, not exacts to confine AI's creativity. Don't over specify desired behavior. I believe specifying too much using the very imprecise human language is counter productive anyway. 

2. **Always verify**: I found asking model to insert manual verification step a good practice to uncover assumptions I didn't agree with. 

3. **Always keep stable state**: git is your friend! Commit good state often. 

4. **Ground the agent**: I believe that it's on human to properly ground agent, through tests, ideally automated. Ask the agent to write a lot of tests! I went from having 0 tests to have 600+ tests (unit tests + integration test) and linting rules. I event created a `make test-changed` target that runs tests based on which spec files changed, so that agent can run it to verify their code change faster.

    1. Eventually, lessons loosely held (in `tasks/lessons.md`) should migrate to some predictable framework, like linting rules. 

    2. Figure out a way to run end to end test directly against the UI would be interesting. For example, the [Tidewave](https://dashbit.co/blog/the-path-to-tidewave) represents a very interesting approach where AI agent have direct access to the UI state, paving way of much shorter feedback loop. 

    3. OpenAI wrote about [harness engineering](https://openai.com/index/harness-engineering/) where they ask coding agent to proof of work and use Chrome DevTool Protocol to access to DOM state directly.  

6. **Local log files** are very useful to have agent reading local log files, so that it can correlate my usage with the log.

7. **My job** is review and evolve specs, the `todo.md`, and help manual verification steps. I haven't found it useful to review code itself, as I'm not good at lua. But sometimes I can identify code not DRY enough, and would guide agent to refactor.

8. **Still missing**: need to have tests on performance of agent produced code.

As I use AI to construct more complex features, I find this workflow is pretty effective. It's not perfect, but it's dramatically better than what I had 10 months ago. It is already very usable for my personal project now. Looking forward to leverage AI fully at work, in a similar vein what [OpenAI did](https://openai.com/index/harness-engineering/).

[^go_work]: The following is in AGENTS.md: "Work for you is in tasks/issue.md, you MUST make plan in tasks/todo.md"

