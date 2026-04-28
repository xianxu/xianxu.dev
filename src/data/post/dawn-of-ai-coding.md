---
title: The Week Everything Changed
publishDate: 2026-03-01
published: true
excerpt: "The week of February 23, 2026: Dorsey's layoffs, Cloudflare's one-engineer Next.js rewrite, Karpathy's tweet. Picking up Conductor, OpenCode, and OpenSpec over a weekend and shipping 15K lines on Parley — agentic coding is no longer the toy it was ten months ago."
tags:
  - ai
  - tech
highlight: true
---
Previously, I wrote about my understanding of current AI wave as [a new abstraction](/2026/02/ai-as-new-abstraction). Over last weekend, I picked up the current generation of agentic coding, and I'm thoroughly impressed. My thinking had obviously evolved since the first time I tried `Claude Code` for something real, from [the initial shock and awe](/2025/04/reflection-on-ai-coding), to a later, [more nuanced view](/2025/05/ai-coding-take-2). That was in May 2025, and the field of AI coding has matured at astonishing speed since then. 

## A week full of news

This weekend, I picked up the latest generation of agentic coding tools, to tinker on my personal project [parley.nvim](https://github.com/xianxu/parley.nvim). This was triggered by the news cycle, where in the week of February 23rd:

1. Jack Dorsey, Block's CEO and co-founder of Twitter, [laid off 40% of the company](https://x.com/jack/status/2027129697092731343), claiming in part to prepare for the AI coding future;
2. Cloudflare's Steve Faulkner published a [blog post](https://blog.cloudflare.com/vinext/) on their use of AI to rewrite Next.js from scratch, a significant endeavor, by a single Engineering Manager, in a week;
3. Andrej Karpathy, founding member of OpenAI and who coined the phrase vibe-coding, [tweeted](https://x.com/karpathy/status/2026731645169185220) about the astonishing speed of evolution of AI coding,
4. Ahmad Al-Dahle, VP of Meta's GenAI org, wrote in [Medium post](https://medium.com/@ahmad.al.dahle/the-future-of-software-engineering-isnt-what-you-think-96abb293d70a) on the future of software programming

This was a week that surely made you feel like the week the world forever changed.

## The new generation of agentic coding tools

So, during the weekend, I checked out a bunch of tools Steve Faulkner mentioned ([OpenCode](https://opencode.ai/)), along side what we started using at NexHealth ([OpenSpec](https://openspec.dev/)), and one thing I picked up randomly ([Conductor](https://www.conductor.build/)). And of course the usual big three (`Claude Code`, `Codex`, and `Gemini CLI`). Compared to my experience with `Claude Code` 10 months ago, the improvement was night and day. At the agent level, the models, along with the LLM harness, were able to plan and execute complex tasks independently with minimal human input.

`OpenCode` is pretty neat, organized in two different modes, plan and build. The plan mode will make plans without changing anything. And once plan was made, the execution was spot on, rarely had issues. This is on a very small code base (16K lines of lua code). However, I had created 10+ features in two days, first retrofitting many tests, so that I felt more comfortable changing the vibe-coded repo. Each of such endeavors was largely successful without any of my intervention, besides slightly tweaking of the prompts on the shape of feature I wanted to create. `OpenCode` feels more natural compared to `Claude Code` or `Codex`, but not fundamentally different. Even the old vanguard would largely pause to ask you for confirmation before execution.

Then, the `Conductor` was a whole different beast. It was created as the new "software development workbench" over a group of capable agents (and sub-agents), thus the `Conductor` naming. It manages different environments on a single repo through `git worktree`, allowing each feature to be developed in isolation in its own workspace. I opened 3 workspaces, and could barely keep up reading and confirming what needs to happen. I later also tried to use github issues as a way to track what needs to be built, instead of writing instructions directly in a chat session or as a temporary file on disk. This workflow worked pretty well with `Conductor`. `Conductor` also has integration with [Linear](https://linear.app/) project management system, but I haven't tried yet. 

As to `OpenSpec`, I'm still learning to use it. One hurdle I still need to get over is that in the world of spec driven development, there are few ways you can ground things to reality at the beginning. There's no tests, and spec files are just plain English files. It is hard for me to picture how to use the progressively detailed spec (proposal to design to task) to drive development. At least for the personal project, it is likely an overkill. I'd love to see it in action in larger code base. 

Over 2 days, I pretty much reorganized and rewrote the entire code base with about 15K line changes, dramatically improved test coverage, made several features work more consistently across three big chatbot vendors. 

## The future of software development

Several of my original hunch still hold up.

1. It's very important to [ground LLM to reality](https://xianxu.github.io/2025/04/29/reflection-on-ai-coding.html#item-maybe-what-humans-can-do-is-ground-llms-in-reali).
2. It's very important to have [more and faster tests](https://xianxu.github.io/2025/05/14/ai-coding-take-2.html#item-llms-need-to-be-grounded-and-exposing-more-tests).
3. And AI assisted development going to become [new software development discipline](https://xianxu.github.io/2025/05/14/ai-coding-take-2.html#item-in-the-end-i-suspect-enabling-ai-in-the-software)

Immediate implications to the industry? 

1. There will be a lot of disruptions. It seems a perfect storm favoring the bold to rethink all aspects of business and software development. 
2. AI coding is officially here. It changes several dimensions of software development in dramatic fashion by changing the cost factor. Once upon time, keeping codebase clean was a luxury to be traded off against shipping faster. Now, with AI coding, in order for the AI to be more effective, you need to keep the code base well tested, well documented and well organized. 
3. Big migration project is going to be much less daunting as migration largely involves a lot of copy paste and pattern matching, almost a perfect fit for AI. 
4. I suspect many times, it is worth to rewrite entire system from scratch, remove years of historical baggage, and also remove a couple of abstraction layers in between. Those systems are in domains that are well understood over the years, and the agentic speed of writing software from scratch, and the meticulous nature of AI makes it a lot more appealing of a rewrite.
5. Maybe changing programming languages is going to be a lot more common, as I suspect rewriting from one language to another is going to be a lot easier with AI coding.
6. Languages that are lean, with plenty of open source examples for training AI models, and have lightweight and fast compilation/testing setup is going to be a lot more suitable to AI coding. I suspect Typescript, Python will become startups' language of choice in this AI era. Maybe Go as well, as a system level language with good performance. 
7. When the speed of writing code is increased by 100x, the speed and types of the test harness (aka grounding mechanisms) need to be created and sped up accordingly to reap the benefits. Fundamentally, we will need to be in a world where our confidence of agentic coding does not anchor on human code reviews. 

Last but not least, it's such a fun time to be in this trade! 

---

P.S. 3K lines to build Google OAuth flow, `Conductor` broke it down to 9 tasks, completed with some of my help in manual testing, and clarification of feature requirements.
