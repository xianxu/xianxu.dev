---
title: Reflecting on AI Coding
publishDate: 2025-04-29
published: true
excerpt: "Five days, ten thousand lines of Lua, no prior experience with the language. Claude Code is not auto-complete — it's a giant pattern-matching machine that needs grounding through tests and architecture. The 25x figure is cheeky, but the shift is real."
tags:
  - tech
  - ai
---
I have some time switching jobs, so I picked up AI coding tools and worked on a real project. The journey was a bit fortuitous but a pretty interesting and revealing experience. Here's my recount of it. Am I a Prompt Engineer now? Am I an AI engineer now? ¯\\\_(ツ)\_/¯

## About Me

First, some background about myself, to give you some context to evaluate this blog and the capabilities of `Claude Code`.

I consider myself pretty technical. While I haven't written code for 5 years after moving into management, I was still thinking about architectural designs. I'm still the same language polymath, still like to learn new programming languages (latest being [Julia](https://julialang.org/)). I still maintain my good old [Neovim/terminal setup](/2025/01/dot-files). It's just my fancy that I will pick it up again in time. 

I've been fascinated by LLMs, just like everyone else. In the last two years, I gradually updated my outdated ML knowledge, completed many online courses, mostly on Coursera, and books, e.g., [LLM from scratch](https://github.com/rasbt/LLMs-from-scratch). My last gig at Meta forced me to go into GPU programming-related topics. 

I'm an avid user of ChatGPT, have also tried many other chatbots, but often found that ChatGPT fits my conversational style better. I use ChatGPT to learn new things, and bounce off the full spectrum of ideas, often in random domains.

## LLM the Statistical Machine

I have gradually settled my view on LLMs. They are a new class of `statistical computers` (without a better name for it), with a new human-machine interface, which is natural language. Now the task for me is to figure out how to leverage it best. **Don't fight its imprecise nature; work with it**. This was an evolution from my earlier thought, where I viewed LLMs mostly as an encyclopedia, with a very natural interface (just talk to it!).

Now, with the AI coding assistants booming, I also view it as a giant and capable pattern-matching machine that gives you a good signal if something _sounds about right_. That ability of sounding about right, paired with some grounding mechanism, such as running a test, compiling the code, or simply a human code review, doesn't feel that different from how human code. After all, no one can claim they can write 1000 lines of code without trying to see if the compiler agrees with them or not. So why would we insist that LLM can magically get things right in one go? There needs to be a process to ground LLMs in reality. And in coding, it's linting, compiling, and running tests. 

## The Project

### How it Started

Given that I'm a very active user of ChatGPT, the stock app shows various limitations. One of my typical use of ChatGPT is researching new things. Research conducted in a chat interface is not very organized. It's tough to take notes so you can revisit later to refresh your memory and learn. It's hard to find previous information or tweak questions. In particular, I like the idea that **a chat transcript should be something durable, and something you can continue to curate and change**, your scratch paper, your research notebook. At some point last week, an epiphany hit me: Neovim provides a great way of writing code to manipulate text and is great at navigation among big pieces of text. That sounds like an excellent test bed for this `live transcript` thing I want. A quick Google search showed that [gp.nvim](https://github.com/Robitx/gp.nvim) is the current best, so I figured I could work to extend it. Except I have no idea how to program in `lua` besides coding some fishing bot 20 years ago in `World of Warcraft`. And I do not know Neovim's programming model, plugin architecture, APIs, etc. 

My first dabble was extending various configurations to make [gp.nvim](https://github.com/Robitx/gp.nvim) more palpable to my use case, changing the system prompt to ask the assistant to `reason` and create `memory` (well, fancy words, but also apt words), different syntax highlighting, and better key bindings. I tinkered around until another epiphany. Let me try [Claude Code](https://docs.anthropic.com/en/docs/agents-and-tools/claude-code/overview)! I've heard great things about it from people I trust. Now let me get real and see if `Claude Code` can help me learn a new programming language, in a new code base, and create features I need while having fun.  

The code base is small, ~5K LOC, in hindsight, a good starting point.

### What is the Project, Exactly?

I envisioned a `live transcript` between User and Assistant, a transcript that the user can arbitrarily update just like a text file, while easily pulling additional answers in from the Assistant. I started with the vision of a tree of text, not unlike [Google Wave](https://en.wikipedia.org/wiki/Google_Wave) back in the day. It would have similar functionality to `ChatGPT` or `Claude` Mac app, but exposes the full transcript to be freely editable. It also offers a peek at the inner workings of the world of prompt engineering, memory management, prefix cache management, etc., as we build on top of a stateless API.

### What I Accomplished in Five Days

Welcome to [Parley.nvim](https://github.com/xianxu/parley.nvim). It's a hard fork from `gp.nvim` to focus on live chat transcript experience, not providing an assistant for some coding session in Neovim. It's made mainly through `Claude Code` and a bit of my guidance on component design, fixing issues, testing, and helping with debugging. And most importantly, I'm the **Uber PM** to dictate how features should work, and how different features interact and combine. Together, we made ~ 10K LOC in those 5 days (a week), so averaging 2K LOC a day. Compared to maybe 10K LOC a half at some Big Tech, which would be considered above average. Right, this setup is about `25x` faster. Well, beats your `10x` engineer! Of course, I'm a bit cheeky here; there are caveats, so read on. 

So what did Claude and I do in those 5 days? Some highlights from [README.md](https://github.com/xianxu/parley.nvim/blob/main/README.md).

1. Your Markdown file is the transcript between `You` and your `Assistant`.
2. You alternate questions and answers, marked with 💬: and 🤖: in the text file. 
3. You can update anywhere in the document, so long as you maintain those markers to delineate the alternating conversation.
4. You can insert new questions in the middle of the document to ask further clarification questions. Proper context will be constructed with the exchange up to that point. 
5. You can refresh any question. You can refresh all previous exchanges leading to your current questions, or choose to use exchanges recorded in the transcript and only send in the last question. 
6. You can even edit the `Assistant`'s answers. For example, as part of your prompt engineering strategy, you can format the first couple of answers the way you like, which will influence how `Assistant` answers future questions. 
7. You can attach local text files, which are prefix-cached to make repeated questions about them cheap. You can include recursively all files in a directory with e.g. `@@/path/to/parley.nvim/**/*.lua`. It's actually a great way to understand the code base itself. 
8. Your long chat in a thread is automatically compacted to save on API expenses, using a summary (📝:) returned for each chat exchange.
9. You can talk to `Claude`, `ChatGPT`, `Gemini`, and locally hosted models through `Ollama`. I enjoy Claude 3.7 Sonnet the best. This was a departure from my preference for the ChatGPT app.
    1. You can also ask different questions to different chatbots, though I haven't found a good use case for that yet.
10. There are various small features, like integration with `lualine` to show LLM prefix caching behavior, and integration with `telescope` for a table of contents to navigate to different questions. There are also different colorings for questions (💬:), reasoning output (🧠:), summary output (📝:), etc.
11. And the transcript can easily be published, as it's just a markdown file! 

I used `Parley`, over Anthropic's `Claude 3.7 Sonnet`, to review some legal document 100 pages long, 200+K words, in a transcript with tens of questions around the 17 articles of the document, sprinkled with questions about legal terms I don't understand. Exactly how I wanted it to be!

I also used it to criticize this post. 😃

## The Learning

### The Good

`Claude Code` is not your typical auto-complete. It can plan out and write a whole new feature, across a couple of files, all on its own, based merely on a plain English description of the problem. I was positively wowed when it implemented the first feature correctly on the first try. One thing that is very clear from this experience is that a large portion of programming is about dealing with the incidental complexities of the programming language, code structures, build systems, and the list goes on and on. They have nothing to do with the core of algorithmic/business logic. I can see `Claude Code` in time will be able to remove all those barriers. 

Don't let this short section fool you. AI coding is real and it's coming! It makes working code with some minor help. 

### The Bad

`Claude Code` often would make localized fixes. For example, when it tries fixing some nil object bug, it adds nil checks to make the problem disappear. That's at a very entry-level programmer's style of programming. I had to ask it often to figure out the root cause of why that object is nil, to identify the root cause. `Claude Code` otherwise would eagerly sprinkle checks for nils and types everywhere. 

I often need to stop it and ask it to focus on a certain area of the code, or give it some examples of what I want to happen, some basic structure, or tell it observations that I think are relevant. `Claude Code` often makes very complicated fixes or designs, not considering generalization and simplification of logic. There are a lot of copy/paste patterns, and they fit what a pattern-matching machine would do, I suppose. For example, it kept looping through lines in the vim buffer over and over for each feature it added, where some planning can use a single loop while keeping track of the running state. I ended up describing that it should use one loop to extract chat exchanges in the file, and each exchange has a bunch of lines of questions and answers, one line of reasoning, and one line of summary. For another example, it would happily copy and paste code to read from a file and format in a couple of places, when all those places share the same logic, I needed to ask it to use the other implementation, instead of copying/pasting the same thing to another location. 

What's impressive though is that once so prompted, `Claude Code` always happily churns out good code for implementation. This surely feels like a gap to improve upon, but also doesn't seem too complicated to address. 

There were cases where I got antsy and interrupted it, thinking, dam, I can write that in 1 minute, just those three lines in those two places. Well, I'll admit I often overestimated my fluency in the language and environment! I usually found myself bogged down in "mundane details". Right, Mundane details are exactly what Claude is great for! Do remember I'm a very rusty programmer, who hasn't coded in Neovim or Lua before. I do think a competent programmer can beat `Claude Code` to make small changes across a bunch of places faster. 

### Is That Just Pattern Recognition?

I think that's likely the case. It can be viewed as a natural progression of IDEs (I know, I belittled IDE at the beginning of this post). From the `show properties of an object` and select, to auto-complete a function based on description, then to writing features, is essentially auto-completion across a bunch of files, at the proper location. It feels like the natural progression of increasingly sophisticated statistical models. And there's nothing wrong with having a very capable pattern matcher on your side, you know! 

With this experience, I also hypothesized that it's easier for LLMs to write features than to fix bugs. I theorized that, for one, there are plenty of training examples for feature development, just use all public GitHub repos. Bug fixes seem more subtle, as you need to trace through a call chain, which is often not localized in one portion of a file. The bigger issue might be that there is much less training data for debugging things, as those tend to be locked in the developers' minds. No one's going to document their debugging glory, right 💡?!

As you can see, this project is haphazardly conceived and coded. I can envision a more well-prepared code base for `Claude Code` to be much more effective. 

### Ending Thoughts

1. AI coding is here, like it or not. Organizations need to adapt. 
2. It's _just_ big fancy pattern recognition. Properly used, it can make your workflow much faster.
3. I can also see many improper usages. If you are not careful, you will end up with an inconsistent bloated code base that doesn't work in many edge cases, that no one understands. 
4. **Maybe what humans can do is ground LLMs in reality**.
    1. Setting up the right and fast testing infrastructure.
    2. Invest in better architecture to guide LLMs to make changes accordingly, with well-designed architectural patterns. 
    3. Invest in consistent coding practices to make LLMs' pattern matcher work even better.
