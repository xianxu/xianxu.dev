---
title: Claude Code
publishDate: 2025-04-24
published: true
excerpt: "First real run with Claude Code: 500 lines of Lua changes from someone who hadn't written a line of it before. Not AGI, not a junior engineer replacement — a powerful, imprecise statistical machine that makes knowledge workers dramatically more effective."
tags:
  - tech
---
I've heard of `Claude Code` and today I tried. WOW, it is fantastic! It doesn't yet write error-free code, and I'm working on a pretty small repository (about 5K LOC). But it enables me to make significant changes to [gp.nvim](https://github.com/Robitx/gp.nvim). My update's about 500 lines of changes, so not trivial. I implemented two features, one of which was to introduce summarization of earlier chats, serving as chat's memory, to save on tokens for long chats. The second feature allows the resubmission of questions (from another engine, or for updated questions) and the insertion of questions in the middle of the transcript. 

I'm able to accomplish this as a guy who hasn't coded in `lua` at all (well, I lied, I did code some World of Warcraft fishing bot 20 years ago…) and hasn't coded in 5 years in whatever language, as my focus shifted to management. I think this clearly demonstrates the power of AI, not `AGI`, not the ability to replace mid-level engineers fully, but rather as a **powerful yet imprecise statistical machine** that makes knowledge workers much more efficient and effective. This is the new paradigm of "programming", how to leverage such imprecise computational devices. I can't help but feel excited that startups equipped with those tools will be even more effective competing with behemoths!

On the con side, well, it doesn't generate full error-free code, and sometimes gets stuck in a mode to make things more complex. For example, in one instance, when I asked it to fix some nil issue, it just started checking for nil, instead of taking a step back, inspecting the wider context to understand why the nils are there to begin with. I needed to guide it through, providing more context and eventually fixing the issue. Compared to a real human developer, a human would ask more questions, less readily jumping into coding things up. Humans are still much better at detecting imprecise instructions from other humans, requesting clarification, and additional information. 

It also doesn't seem to first try to identify the root cause of a bug before attempting to fix it. This probably shows more of its origin, where it is used to generate a whole new feature. I guess when developing new features, you have plenty of training examples, just train on all public GitHub repos! On the other hand, debugging and fixing issues are potentially harder for LLMs, as they need a lot more reasoning, and we have a lot less training data for bug fixes. Just my guesses. 

With those caveats in mind, Claude Code is a competent tool everyone should leverage! Now I get a good sense of what it can do, and pitfalls, I feel I can leverage it to quickly create things. The [Parley](https://github.com/xianxu/parley.nvim) is a great example of it. 

PS, code is [here](https://github.com/Robitx/gp.nvim/compare/main...xianxu:gp.nvim:feature?expand=1). It's more just for my own use as explained [here](/2025/04/chatgpt-in-neovim-collab). 
PPS, yes, it does cost an arm and a leg. 
PPPS, yes, it even has VIM mode! 

