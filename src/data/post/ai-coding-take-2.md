---
title: "Claude Code: Take 2"
publishDate: 2025-05-14
excerpt: "After more time pair-coding with Claude Code, the awe wears off. It's an overly eager junior with raw smarts and no taste — fast, useful for onboarding, but prone to ridiculous code that you'd reject from a new grad."
tags:
  - tech
  - ai
---

As [previously mentioned](/2025/04/reflection-on-ai-coding), I've been using `Claude Code`, an AI tool that assists coding, to create an `nvim` plugin called [Parley.nvim](https://github.com/xianxu/parley.nvim) that provides a live transcript to chat with LLMs from different providers. The tool is handy, and I've used it for many things since its creation. Now that I have more time under my belt working with `Claude Code` (and `OpenAI Codex`), I have a better understanding of them; thus, this is a take-2 on my experiences. Besides `Parley`, I also tinkered with AugmentCode's [vim plugin](https://github.com/augmentcode/augment.vim) and tried to convert it to `lua`, which is somewhat successful but not fully featured yet. 

## Experience Updated
Overall, after more pair coding with `Claude Code,` my initial awe wore off, and I now have a clearer view of its strengths and weaknesses. Let's start with the overall experience, then some concrete examples, to give you some concrete examples to evaluate its capability. 

### The Good

1. I went from not knowing `lua` to being able to review and identify issues in generated code pretty fast. I guess humans are good at learning from a few examples and generalizing. Human experts' general knowledge and experience allow them to cut through the chase easily. So at this level, **AI is very good at helping experienced programmers onboarding onto a new codebase/domain**. It does so in two aspects at least:
    1. First, as pointers to where change should be made. Claude Code clearly explains what it is doing, and those steps look logical, mimicking somewhat how a human would gain insights into a code base. 
    2. Second, it provides a lot of scaffolding for what I would call incidental complexity. Those incidental complexities are merely artifact of the crappy tools (mainly programming language) we have. 

### The Bad

1. Things are much less rosy as I gained more experience and put more of a "can I use this in real production" hat on. **You can even say that Claude Code's generated code is sometimes ridiculous.** It works, but it is ridiculously complex and redundant. In terms of code quality, it's below the hiring bar for entry-level college new grads. So the 25x efficiency gain I cheekily declared in the [first post](/2025/04/reflection-on-ai-coding) must be adjusted. 
2. I also took on one task to treat "diff review" round as real: I'm not willing to turn a blind eye to something ugly, but it's working. The main sin of `Claude Code` is code repetition, in one extreme, leaving over useless old code when the output of a function is assigned to a variable that is never used. This process is a lot slower than just letting AI write crappy but working code. 

### Examples of The Bad

If you are in a hurry, you can skip those examples, but they gave you a more concrete sense of what works and what doesn't.

#### Integrating Telescope + Frequency (failed)

I want to integrate `Telescope`'s `Frequency` extension as a file picker for a `Note` feature in `Parley`. `Note`'s nothing but markdown files organized in a particular folder structure. The initial implementation used only `Telescope`. Later, I wanted to use frequency as a sort order, so Claude made the plausible change to access the `Frequency`'s frequency score. But you probably need to use Frequency's main entry, which perhaps wraps around the `Telescope` for other functionalities, so that the scores can be populated correctly (my hypothesis, according to how `Frequency` is otherwise used). 

This request led `Claude` into some wild goose hunt, with deeply nested ifs, fors, etc., so deep that at some point, it misplaced some `end` keyword, causing a syntax error (it rarely does so btw). And most importantly, the code didn't work. After several rounds of prompting for fixes, and my inability to reason about the increasingly super convoluted code it spat out, I gave up. I decided to stay true to the goal of being minimal and use `Frequency` + `Telescope` directly to explore Notes. 

I think this is the first case where `Claude` was stuck. Granted, there were some of close cases, but once I took a look, I was able to guide it out of the quagmire it created for itself. But this time, its code has just too many nested levels for me to be willing to spend time on it. While I don't know how to make what I want, I'm pretty sure the proposed, super complex, and not-working solution is not the right way to go. 

#### Fixing Empty System Message Bug, Where Manual Fix Was Faster

`Parley` implements LLM caching, which means cache-control in the system messages in Anthropic. The way Parley implemented this was by default, if a user question has files attached with @@ syntax, this question will be represented as two messages to Anthropic, one system message containing the file content, which can be cached, and the other is a user message referring to that file by name. 

This worked until one day I decided to comment out the @@ file syntax, for reasons. And this broke the file inclusion code. By now, I have read enough `Parley` code to be able to quickly root cause this to the way `Parley` determines if there's file content in a question. `Parley` uses a regex pattern to search in the full multi-line question string of @@, which is incorrect, as @@ needs to be at the start of the line to be treated as a file name. We should extract if an exchange's question has file content in the initial pass of parsing raw text lines, then use that information later to decide if to generate the system message. 

Well, Claude's fix was to skip empty system messages, which is an accidental but effective local fix in this scenario. But it smells as we are essentially marking questions without file inclusion as having it, only to ignore a message when later we couldn't find a file to include. Such an incorrect state might come to bite us in the future. This shows that Claude doesn't really have "taste". I constructed detailed instructions about why this is not good, and we should change to extract more information in the earlier loop. `Claude Code` obliged and made the correct change. 

During the review of the proposed change, I noticed further repetitions of how files and directories are handled. This time I chose to just go do it myself, took maybe 10 minutes to dramatically simplify, and make the code a lot more consistent. And my change worked on the first revision. 

#### The One ChatGPT o4-mini-high Came to Rescue
One feature needs a function that computes the week number of a date string in the format YYYY-MM-DD. Claude's initial implementation was plausible; I encountered no issues during manual testing. I noticed this bug later as I used `Parley` and worked with Claude to fix it. It was torturous. Claude kept piling more code, and when I gave a test case using 2025-05-04, it started to special-case the year 2025 in the code! It was almost comical. Remember the joke about AI where you try to stop it from doing stupid things, but inadvertently get it into even more ridiculous things? That was how I felt. 

That's why I stopped and decided to ask ChatGPT (in Mac App). I picked o4-mini-high, used the same prompt I used for Claude. And wala, it gave back perfect code, that I can actually read and understand. 

So, the capability of the foundation model is essential. 

## Thinking about Best Practices

So should you, and if yes, how should you work with AI coding assistants like `Claude Code` or OpenAI's `Codex`? I think organizations need to invest in understanding the current frontier and prepare for adoption. I believe this process will probably play out in the next 10 years, inducing industry-wide reshuffles. This only assumes incremental progress in advancing AI technologies (aka LLM as a good pattern-matching machine), and does not even consider AGI or the singularity (which I believe its just hype anyway). 

1. As it stands now, working with `Claude Code` is like working with an overly eager junior engineer who didn't have enough engineering best practice training, but they have the raw smarts, can mimic code, and do so very fast. A junior programmer will quickly grow out of this mode, but how `Claude Code` progresses remains to be seen. So the usual advice of working with junior engineers applies: **be specific; split bigger tasks into small steps for them to follow; check results often and closely**. I do confess that I did mess up `Parley` code quality initially by more blindly vibe coding it; so maybe if I paid attention to structural and code quality initially and on an ongoing basis, `Claude Code` might have performed better. 

2. I suspect **keeping the file small helps**, making giving LLM the proper context easier. If you look at the sequence of Claude Code's execution, there's a stage where you guess key relevant phrases and then use `grep` to find the surrounding code near those phrases. This goes several rounds until it decides to have enough information for a task. I suspect keeping the feature names descriptive is essential. Here we may use code comments for this purpose, writing both for human consumption and for machines to locate relevant code.

3. I suspect **making code modularized helps**, so only a small portion needs to be inspected and changed. I also suspect test-driven development works, particularly if a big program is decomposed into many pure functions, where they can be tested easily.

4. This also raises an interesting question regarding how well this works in the larger code base and in languages where the exact string may mean many different things in different places, where comments might be out of sync with code. Engineering best practices are even more critical here, to keep the code understandable by AI. 

5. I suspect some languages and modularly organized code would benefit a lot more from AI coding than other legacy code bases, potentially giving big advantages to new companies whose code bases are organized around the principle of making AI assistants more efficient. 

6. LLMs need to be grounded, and exposing **more tests, faster tests, particularly later-stage tests**, would speed up this development/test loop. If your developers are complaining about your dev tools now, chances are they won't be able to keep up with the speed at which AI can iterate.

7. Abstractions are probably hard for LLMs, I think, mainly because there's no good ground truth of what is a useful abstraction in a business domain. When humans create abstractions, we have business goals and future extensibility in mind to make informed, sometimes implicit, tradeoffs, more of an art than a science. So here is when humans can potentially help. **Design documents about the architecture and the code's main structure** should help as prompts. For example, in the case of "many passes over text file", it should help to explain that in `Parley`'s `init.lua`:
    1. "The main submission code is structured to loop through each line in the file once, extracting information needed to construct a request to LLM, and the extracted information is organized as a table of exchange, where a single exchange having a question, answer, file references mentioned in question, reasoning steps and summary lines from assistant's response. Then a 2nd pass through the extracted exchanges to construct API requests to LLMs. The first loop should be LLM provider agnostic, while the second loop needs to adapt to each provider's API." 
    2. I suspect that if each LLM had access to those instructions, it would avoid starting yet another loop. Based on how `Claude Code` works, those instructions probably need to go into the `CLAUDE.md` rather than inline comments in the code, as it seems Claude doesn't read the whole file (there are also context token limits) but only surgically greps a small portion of a file.

8. Always have **a well-known state you can revert to**. It's interesting how to integrate checkpointing into AI coding practices and how to deal with the effect of a revert on the internal state of the LLM. Conceptually, if we follow the `Parley` abstraction, where we basically have the full state in the transcript file, then reverting to the previous state is as simple as re-asking some previously asked chain of questions, up to the checkpoint location. It also seems trivial to integrate with local git, to always commit after each agent's change, as a way to keep a list of **well-known states**.

9. In the end, I suspect enabling AI in the software development process would become one necessary discipline, much like the study of the software development life cycle.

Interesting times! 
