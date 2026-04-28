---
title: Personalized Software
publishDate: 2026-03-19
published: true
excerpt: "When agentic coding lets a vim user write a custom mouse-aware floating picker because Telescope couldn't do that. The implication for SaaS: programmability stops being a nice-to-have, it becomes the moat."
tags:
  - ai
  - tech
---
The recent surge in the quality of agentic coding opens up the endless possibility that more people will be coding and creating software to their hearts content. For example, I'm a command line and vim user. For years, I learn about new plugins, and figure out how do they improve my workflow. More recently though, I started creating an nvim plugin directly to suit my workflow, resulting in [parley.nvim](https://github.com/xianxu/parley.nvim). At the beginning, my tinkering is limited, and a bit timid, as I didn't know the capability of agentic coding, and I didn't know much of lua, or nvim. But after 400 commits all human guided but AI driven, I got better at agentic workflow, and the capability of coding agents also improved by leap and bounds. Now I find myself almost freely guiding the plugin to whatever direction I want. 

The latest example is that when I wanted mouse to work with type-a-head search interface and the all powerful telescope doesn't support mouse well, I end up just getting the agent to write from scratch [a floating pop-up](https://github.com/xianxu/parley.nvim/blob/main/lua/parley/float_picker.lua) that supports mouse, and the search behavior exactly I like! 

Software development is rapidly merging with product management. The winner's going to be whoever can both visualize the product, understand key internal states and subtle user interactions, and able to guide coding agents just enough to implement it. I suspect this is going to be the direction of software, a lot of personalize software, created just for a small number of users. That is, if human still use computer, manually, i.e. the knowledge workers still exist. What are the implications in such a world? 

In that a world, it seems software systems need to be more programmable. We need not only great user interfaces geared towards end users, but also great programmability for coding agents to create customized workflows and user interfaces. The venerable vim/emacs are good examples of this. Extending this line of thoughts, it means for SaaS products, they need programming environments such that users can configure their own workflows. Few of them today do this today, wonder if this is going to be a trend in the future.

It seems we still need strong foundational software, like neovim, Emacs, or Google Sheets, to provide that programmable canvas. It's unclear there are space for commercial software in such space. It just feels such software fitting the open source model better. It seems at minimal, SaaS products need to head into the direction of programmability, both in API form, but also in programmable user interfaces. 
