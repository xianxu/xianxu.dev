---
title: AI as My Research Workbench
publishDate: 2026-06-07
published: false
excerpt: "AI is powerful, but it is not an oracle. It does not have a magic wand to create what you want exactly. You own the possibilities, and leverage AI to help at many different altitudes. Here's a concrete example how I wrote the blog about space data center. AI is the MATLAB, the Wikipedia, the Excel, the search engine, all packaged into a single tool that you can customize and extend. The capability is there; the human/AI interaction is still being sorted out."
tags:
  - tech
  - ai
---

I just published [The Case for Space Data Centers](./the-case-for-space-data-center.md) and hope you find it interesting. I went to write about it, not only because it's interesting, but also it is a good test for one of the workflow I'm tinkering with. It's a working example of what I see as knowledge worker's AI assisted workflow: not the "AI, write me a blog, and earn me quick bucks", but a research workbench where I keep exploring area I don't know, learn facts, some maths, connecting other dots. AI helps along the way, checking the facts, the math, drafting prose, debate importance of certain angles, managing a deterministic workflow (git-journaled rounds, fresh-context fact-checks, build gates) and keeping the whole thing honest (through fresh context reviews, fact checks). Human is there at the center, as the driver that knows where we want to head to and what we want to learn about; AI is the rocket to help us getting wherever we want to do, much faster. 

## It started as a conversation, not a writing task

The starting point of this post was my curiosity around the concept of space data center, particularly as SpaceX is nearing IPO. I opened the session with a physics question: *> "I'm thinking about space data center… help me compute something… what's the temperature of the device need to be, to break even?"*.

I chatted in the `claude code` window about the equilibrium temperature of an object in space, and didn't initially have any idea of the geometry of this space computer. Later after back and forth, I settled on a simple model of just a rectangular slab, which in hindsight, look just like newer Starlink satellite that went up in Starship launch 12. And once I had a mental picture of that geometry, I felt the conversation went far enough and interesting enough to write something about it. 

## From conversation to a first draft

So at some point, I asked: *"ok, based on this discussion, write a blog post on the thesis… put it in `the-case-for-space-data-center.md`"*. 

I had created the initial draft of /xx-fix tool as a review workflow for AI to check my writing for me. The workflow is based on my experience, but haven't quite being battle tested on a blog post from scratch, so there ended up some building the airplane while flying it aspect to it. I ended up incrementally improve upon the tool as I wrote out the blog post. I believe this is one aspect of this AI era, that "everyone" needs to have a tool builder mindset. I touched about this with a [personalized software](./a-saturday-coding-session.md) framing previously as well.

## Co-authoring in a stable document, turn by turn

My central thesis when it comes to human AI interaction, is that whatever workflow we end up in AI era, it needs to be structured in a way human can understand it. Human needs to understand the stem of the work, so that they can steer at the right time, and at the right altitude. LLM-based AI essentially has a single transcript that contains all the information. It's often hard for human to keep track of all the details. If we consider blog writing task, there are several things going on at the same time: 

1. that human may ask AI about things to further their understanding in an area, and the goal of such turns is not to generate any outward visible artifact, but updating their brain's neurons with knowledge and information. 

2. and occasionally, they have some good prose they want to capture. And those prose are still fractured, not a whole essay. 

3. and sometimes they are in a spur of inspiration that portion of the document is laid out. 

How do you adapt such different modes of operation into a coherent workflow? The setup I end up creating, in hindsight, works a lot like how a human would collaborate with another human. 

1. there's a thread of free form consultation. That's the chatbot experience, and in this case, I'm using `claude code` as it gives me a lot of customization opportunities (skills etc.). It's actually infinitely extensible as you can ask it to write additional code to do whatever you want as part of your workflow [^ariadne]. We will see part of that power a bit clearer later. 

2. a work surface for the artifact to evolve. Here, the artifact is a blog post manifested as a markdown file. The way human is able to communicate with their smart colleague about the artifact is contextual, that you ask question about that artifact, in the context of some part of that artifact, alas: comment in that document. This is what `nvim` with `parley.nvim` does, that the human directly insert comments inside that markdown document under review using some simple markup conventions, and the paired agent skill in `claude code` [^xx-fix] that is able to interpret such markup, effectively creating paralleled sub-conversations inside those markups within the hosting document. This setup conveniently solved the mental load for human to specify context precisely: context is already clear around where the markups are inserted. Even when there are many of such "comments" thus form many sub-conversations, human's still able to mentally keep track of them with localized context, as it is not too unfamiliar compared to how human interact with other humans in a collaborative document comment and review process. 

3. and to keep track of things, if not, for posterity, `/xx-fix` skill is instructed to interpret the changes in the artifact as signals for a turn. Whenever a turn happens in the conversational thread, AI will figure out if the turn means to update the document, or means to be free form. And if it decides the turn means to update the document, it will create a git commit on behalf of human first, then update the document, then make another commit after AI finishes editing [^history].

## Building and improving the tool continuously

And as I wrote the space data center [post](./the-case-for-space-data-center.md), I also kept improving tooling around it. Some are agent skills (essentially prompts), to name a few:

1. establishing turns, and commits. When agent should commit on behalf of human (when human left document changed and asked for review or `flow the doc`).
2. eventually lifted some portion of such workflow [into binary](https://github.com/xianxu/ariadne/blob/main/scripts/docflow.sh) that skill prose would call [^poem].

I feel this long range of changes while I'm writing a blog post, to not only writing a blog post, but construct and improve the environment to make writing a post with AI easier, is how AI going to dramatically change how we work.

## Learning facts and math from AI

By now no one would be arguing that AI doesn't have world's knowledge. They do. When they are less sure, they can always do a search and summarize. So part of this writing about space data center, is also my journey of learning about this topics. 

AI pulled in theories, formula of thermodynamics, which I have no previous exposure of. I think it's a much quicker ways of learning, as it's targeted to a particular problem at hand. I bet it is much easier for human to remember facts in adjacent areas when human is in the driver seat, with a concrete issue at hand, compared to the traditional indiscriminate dumping of information, sort of self-guided progressive learning? I think it is a very interesting angle to explore how to leverage this in education. What would learning be, when everyone can afford access to the world's best professors.

## How do you know if AI is not making things up?

The truth is you don't know for sure, but there are ways to improve your confidence. This is what I'd call part of **AI literacy**. Just like you can't just trust information on the Internet, you should treat what AI tells you with a giant grain of salt. Human always needs to construct a consistent mental picture based on new information gained from AI. There are also the typical ways to work with AI: 

1. human to establish a consistent logical framing. Does what AI tell you makes sense based on your other understandings. 
2. is AI self-consistent. 
3. ask AI for reference to source of fact, and check the source [^you-decide]. 
4. Leverage AI from different vendor, to double check with different/fresh context. [^you-decide].

## Closing

It had been a very empowering experience. And to close on this post, I kept doing the above as I wrote this, for example, improved the `docflow` workflow, with save context and later recovery as I decided to work on some other things mid-way through this post. I'm confident that all those little improvement of the workflow, embedded in the repo itself, will help me work increasingly efficient: like riding on a rocket ship!

---

[^ariadne]: See ariadne's `construct`, which forms the base workflow-embedded-in-repo pattern I'm applying everywhere.
[^xx-fix]: See the fix skill [in ariadne](https://github.com/xianxu/ariadne/blob/main/construct/local/fix/SKILL.md).
[^history]: See the [history](https://github.com/xianxu/xianxu.dev/commits/main/src/data/post/the-case-for-space-data-center.md)  established while the space center post's authored.
[^poem]: I remember in some blog I mentioned "I write poem now", which means to write prose to constrain LLM. It's not that I only write prose, but that tends to be a more flexible place to start. The pattern I observed, inevitably resulted in later `lifing` some of prose into binary, for determinism.
[^you-decide]: In [you-decide](https://github.com/xianxu/you-decide), I went a dramatical length asking AI to give reference for all fact claims, and asked another AIs (codex and Google's antigravity in that case) to check those facts and sources. 
