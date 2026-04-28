---
title: AI Workflow Evolved, One Year Jouney
publishDate: 2026-03-28
published: true
excerpt: "Reflecting on a year of tinkering and adapting to the ever changing world of AI. After a year and 400+ commits on Parley.nvim, I'm convinced the future is humans setting up the environment, with full automation of the coding inside it. Here's my journey so far."
tags:
  - tech
  - ai
highlight: true
---
It's been about a year since I've been vibe coding on [Parley.nvim](https://github.com/xianxu/parley.nvim). It has also been three weeks since my last post on [AI coding workflow](/2026/03/ai-coding-workflow). So many things have changed, both my understanding of such workflows and the world around it. For example, Nvidia open sourced [OpenShell](https://github.com/NVIDIA/OpenShell). Let's take a look at my evolution, I think this might be useful for people new to the space.

1. Archaic time, a year ago, where I just used coding agent like `claude` directly, sending prompt directly inside its cli. It's a fun but flaky workflow. You can read it [here](/2025/04/reflection-on-ai-coding) and [here](/2025/05/ai-coding-take-2).

2. Using workflow management like [Conductor](https://www.conductor.build/), or [Vibe Kanban](https://vibekanban.com/), that's when I was when I wrote [this](/2026/03/ai-coding-workflow). OpenAI also open sourced [Symphony](https://github.com/openai/symphony) which pushed boundary of such "workflow management" software.

3. Made my own little workflow, both because of my realization that there isn't that much those "workflows" provide, and my desire to learn what's under the hood. This resulted in a simple `Makefile` based flow, where I use `make issue 42` to download github issue to a well-known-to-AGENTS.md location, and more diligently shaping the workflow in the AGENTS.md. I had two modes, either working on a branch in `worktree`, or working directly on `main`. After all, I'm a single guy tweaking Parley. It's just a [Makefile](https://github.com/xianxu/parley.nvim/blob/01576b1cfed48477ad3f15e0a3ce418238096b82/Makefile.workflow).

4. I kept tinkering this workflow, adding some archive function, to back up `issue.md` and `todo.md` after each feature was done to `history/`. This made it easier to continue tweaking key files, such as `AGENTS.md`, `lessons.md` and `specs`. Between things, accumulated 400+ commits in [Parley.nvim](https://github.com/xianxu/parley.nvim).

5. [OpenShell](https://github.com/NVIDIA/OpenShell) was open sourced, and you can take a look at their workflow, which was expressed as a set of [agent skills](https://github.com/NVIDIA/OpenShell/tree/main/.agents/skills). Roughly, you can describe what I did in my `Makefile` using plain English and get agent to do it. I'm not very sure what's the point to make such very deterministic workflow agentic; but either way, my `Makefile` was totally written by agents, so in a sense, my `Makefile` based workflow is just a compiled version of agentic `skills`. 

6. As I worked with my workflow in `3.`, one problem I notice is that the issues, the code, the plan to implement issues in the codebase, and incremental state of that implementation scattered in several different places, and have different life cycles. In [Conversation: agentic state management](https://xianxu.github.io/2026/03/28/agentic_state_management.html) I wondered why not just use repo to manage issue tracking. This resulted in me just putting issues in a structured way in `issues/` in the repo itself, and the creation of simple `Parley` function to [manage those issues](https://github.com/xianxu/parley.nvim/blob/main/specs/issues/issue-management.md). This made my "single developer" workflow supercharged. This will also break down when there are more people operated in a repo, need to figure out how to evolve in that type of world.

7. Then I integrated with [OpenShell](https://github.com/NVIDIA/OpenShell), basically replicating what I did in `6.` within an `OpenShell` Docker container for isolation. I just "chatted" about [what I wanted](https://github.com/xianxu/parley.nvim/blob/main/design/2026-03-28.18-37-34.270.md) in `Parley`, committed it to repo, and asked Claude to [make a plan](https://github.com/xianxu/parley.nvim/blob/main/history/000010-introducing-openshell.md) based on that chat. Some minor back and forth later, now I have a hermetic-enough sandboxed agentic environment. Agentic coding made setting this up really a bliss, mostly I did was: "go create an OpenShell environment based on my Mac setup in `~/.config/nvim`, `~/.zshrc` and `~/settings/brewfile`". Well, almost, there's a big gotcha during this process, I'll talk about that in a separate post.

8. Agents will eventually forget about instructions, based on intuition described in `5.`, I decided to start `lifting` what's previously described as principles in `AGENTS.md`, into actual code. This resulted in [pre-merge-checks.sh](https://github.com/xianxu/parley.nvim/blob/1fb21e41b1fc22ff986e2f8a28627d28084136f8/scripts/pre-merge-checks.sh#L122), which essentially are "subagents" invoked deterministically. Further, I put in Claude hooks, that are automatically triggered when size of the diff cross some threshold. Really, just like how human would evolve code. `Claude` happily piled on a lot of `sh` script, I have the distinctive feeling at some point we'd need to rewrite this portion properly. 

All of those tinkering is to get a real sense of the shifting ground of software development. It is very evident that agentic coding allow you to customize your environment, just like I mentioned in [Peronalized Software](/2026/03/the-rise-of-personal-software). Your development environment is also ripe of opportunities for customization to your hearts content, just like what I did during the development of `Parley`.

What's next? I firmly believe that the future is **human setting up the environment, allowing full automation of coding**. `Parley` is not able to achieve this, as I'm not yet familiar with UI test automation, nor with Neovim's UI testing frameworks. I don't believe human can be in the loop to review most of what agents write, it will be such a big bottleneck, and no fun job. Then the million dollar question, is how would we be comfortable agent is doing the right thing, not exposing your private key, not doing <span>$O(n^2)$</span> algorithm when <span>$O(n)$</span> algorithm is available? 

I don't know, but intend to tinker and find out. 

