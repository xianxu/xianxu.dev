---
title: Building Blocks of AI Coding
publishDate: 2026-10-01
published: false
excerpt: "AI coding is all the rage; what are the basic building blocks? How should we think about its future? This is the first installation of a series of 5 posts" 
tags:
  - tech
  - ai
---

In the [previous post](parley-nvim-v1.md), I announced `Parley` the app, which is constructed 100% with agentic coding. I didn't even know the `Neovim` programming environment, or `lua` the programming language of that environment. I still don't know them well today, but have acquired some intuition of their capabilities and mechanisms. Here I would like to talk about the stack I created to do this along the way. 

I'm thinking of organizing this into a series of posts, roughly:

1. the 5-month journey of building the workflow that created `Parley`.
2. reflection on how to leverage AI in software product development.
3. `couch` and `pair`, the coding environment I use daily.
4. `ariadne`, the skills and binaries that supported my workflow.
5. and lastly, where to go from here.

---

In this first post, I'd like to take a historical view on how this "AI native" development stack was built conservatively from the ground up (reverse of [Gas Town](https://steve-yegge.medium.com/welcome-to-gas-town-4f25ee16dd04)), and came into its current shape. The key philosophy I follow in its design:

1. Keep all state in a single repository, in text format. This allows AI to access not only code, but design documents, issue history, past roadmap etc., everything, using the standard set of Unix tools.
2. Construct a "hard deterministic shell" to constrain LLM's "soft stochastic core". Ground often.
3. Human attention is scarce and single-threaded and it is diametrically opposed to what machines are good at. This AI native stack tries to find that evolving contour of where, when, and how to leverage human's limited attention span.

We will talk more about this in the next post.

---

Now, quick history recap. I took the anti-`Gas Town` approach and started very conservatively. I needed to know how building blocks work, and how well they work, before moving to construct more things on top of those building blocks. What's extremely rewarding is that with AI, you can generally understand and change software that you didn't think possible before. Over the last 5 months, this [overall journey](5-month-coding-stats.md) produced about **1M** lines of code, **1M** lines of supporting documentation (issues, plans, reviews etc.).

1. At the start, I was basically using the plain old coding agent. `Claude Code`, `Codex` are the main players, but there are plenty of other companies also trying (I used `agy`, `muse`, `qoder`). You type a prompt, and hope for the best, frequently back and forth in a really crappy editor. Those were the early days of my vibe coding, but AI showed great potential. I didn't use too many agent skills except `superpowers`. The reason being, if I don't know how those skills work, and how well they work, I can't trust them. Thus it seemed logical to limit how many of those I'd use. You can check my early notes [here](ai-coding-take-2.md) and [here](reflection-on-ai-coding.md).

2. One of the early choices I made was that all state should be in a single repository, the issues, the plans, the projects, the roadmaps. All those should be text files in a repository so that changing them is more like "coding" tasks. This stayed true in the whole journey, with later addition to use git to maintain multiple lineages of history, so that certain workflows can run smoother. 

3. And then, to manage those local text files, I used AI to make tools for me, e.g. a neovim plugin to list all open issue files, to open one of them nicely formatted, and to jump to interlinked issue IDs, among other things. While I still use those today, I find I tend to just ask the agent about the state of things, and to do things for me. But this is consistent with my philosophy that human operator must always have firm grasp of the state of the system they are working on. The details that matter are what type of state is understandable by human with limited brain power ;) (no pun intended), how and when to surface those details, and how to design overall process that human and machine work in harmony and address the pretty much fundamental impedance mismatches of human speed vs machine speed. 

4. Soon, I realized it's painful to use `claude` or `codex` really, the tiny input box, without mouse support, or any other editor goodies. I wanted something closer to a text editor, than a command line prompt. This led me to create [pair](https://github.com/xianxu/pair), which is a TTY terminal wrapper around any TUI program, but coding agents in particular, and gives you an input pane backed by nvim. With that, you get mouse support, all nvim goodies, spelling checks, auto completion of not only what you had typed, but also what agent highlighted in their response. You get full nvim style search of the transcript and many other things. Think of `pair` as a coding agent wrapper that gives you much more control over how you organize your thought. Another fundamental benefit is to allow you to use any coding agent without changing the user interface you are familiar with. This, along with the next point, forms my agent agnostic development flow. While at the beginning being agent agnostic was just an idea, frequent `claude` outages surely motivated me to actually commit to it. 

5. With the process documents (issues, projects, roadmaps etc. whatever you need to run a company's product/engineering department) managed in the same repository, the other part is to get agent to operate the processes embedded in those documents. This means a bunch of agent skills at the beginning. I have evolved this system quite a lot, with the goal of creating a more deterministic "hard shell", around the LLM's intelligent but "soft core". This resulted in a pattern I called "[skill binaries](skill-binary-and-dynamic-skill.md)", which operates around two intuitions: 1/ to move as many operations as possible to deterministic code; 2/ that deterministic code can also administer the skill prose. The result's refreshing: the `sdlc` process (software development life cycle) is just a Golang binary, with `sdlc --help` being what the agent needs to read and understand. This basically converts an agent skill into just another local tool, just another `grep`, `rg` etc. Other extensions involve the ability to dynamically customize skill content based on repository state, for example, I used it to construct a meta skill to instruct agent how to use the ever growing `datatype` defined in different `ariadne` base layers (see point 6). 

6. I called my AI native workflow [ariadne](https://github.com/xianxu/ariadne), which is a provider of `base layers`. `ariadne`, the base layer, provides basic process around software development. There are other base layers, for example, I have a `nous` base layer that is layered on top of `ariadne` as a personal gateway to private information, imagine a repository full of your gmail downloaded, but with credential guarded by the "hard shell"; `metis` which provides essentially what typical ML infra is about, organizing data, algorithms, experiments, to provide a reproducible workflow. Base layers like `ariadne`, `metis`, `nous` are meant to be used as follows: you start with your repository, and if you want to leverage AI's capability in a base layer, you invoke `weave link ../ariadne`, or `weave link ../metis` in the repository root, then `weave compile` from there. That's all you need. What do those two commands provide you? Two things: 1/ agent skills to manage some processes; 2/ binary "hard shell" that makes those processes work. I created `metis` and `nous` not quite for fun, but as validation of this construct of base layers, in very different domains. For example, got a Kaggle silver medal with `metis` in some oil drilling competition that I didn't have any experience in.

7. After I created `pair`, the TTY wrapper, I used to use iTerm2, then Ghostty, and later cmux. None of them were satisfactory, because those environments don't provide support of working on many threads at the same time. I often got lost about where I was in the many threads going on. That's why I created `couch`, a single program that supervises many `pair` programs. One way to think of `couch` is just the many tabs and panes in your favorite terminal emulators. `couch` does that, and provides many shortcuts you need in agentic environment, that get your human attention at the right place at the right time, such as managing the different worktrees for you, showing status of those worktrees. `couch` also provides a protocol that different coding agents can talk to each other, so that you can work with `claude` in a slot triaging issues in a repository, and then just say "schedule it", and `couch` will find a free slot (worktree), talk with the agent there, so that the free agent starts handling the task. After the agent's done, it will send a smoke-test notification if needed, so operator can go take a look to accept or not. I think part of this is going Gas Town, but I'm building this conservatively, one step at a time, letting autonomy in only when I feel comfortable that the foundation's solid. The terminal multiplexer part of `couch` is pretty usable now; the autonomous agent coordinator aspect is still being tested out.

---

And it's on this stack that I find myself increasingly comfortable and confident to take on ever more complex software projects. That's all for the long history rehash. In the next post, I'll air some hot takes on what AI is good for, and how we can best leverage it.
