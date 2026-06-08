---
title: A Nice Research Workbench
publishDate: 2026-06-07
published: false
excerpt: "AI is powerful, but it is not an oracle. It does not have a magic wand to create what you want exactly. You need to know the possibilities, and leverage AI to work at different altitudes: building workflows, tools, changing styling and presentations in a website, researching content, crunch math, helping with editorial touchups, all of which are handled in a single consistent flow. Here's a concrete example how I wrote the blog about space data center, which I hope offers a glimpse of that future. AI is the Matlat, the Wikipedia, the Excel, the search engine, all packaged into a single tool. The capability is there; the human/AI interaction is still being sorted out. "
tags:
  - tech
  - ai
---

I just published [The Case for Space Data Centers](./the-case-for-space-data-center.md) and hope you find it interesting. But more interesting to me is to show you how it got written. It's a working example of what I see as knowledge worker's AI assisted workflow: not the "AI, write me a blog, and earn me quick bucks", but a research workbench where I keep explore area I don't know, learn facts and math, connecting other dots. AI helps along the way, checking the facts, the math, drafting prose, and managing a deterministic workflow (git-journaled rounds, fresh-context fact-checks, build gates) keeps the whole thing honest. Human is there at the center, the driver that knows where we want to head to; AI is the rocket to help us getting there faster. 

## It started as a conversation, not a writing task

The starting point of this post was my curiosity around the concept of space data center, particularly as SpaceX is nearing IPO. I opened the session with a *physics question*: > "I'm thinking about space data center… help me compute something… what's the temperature of the device need to be, to break even?".  🤖[can you find the exact question I asked?]

I chatted in the `claude code` window about the equilibrium temperature of an object in space, and didn't initially have any idea of the geometry of this space computer. Later after back and forth, I settled on a simple model of just a rectangular slab, which in hindsight, look just like a Starlink satellite. And once I had a mental picture of that geometry, I felt the conversation went far enough and interesting enough to write something about it. 

## From conversation to a first draft

So at some point, I asked: "ok, based on this discussion, write a blog post on the thesis… debunk lazy talking points… put it in `the-case-for-space-data-center.md`." 🤖[find the exact prompt I used]. 

I had created the initial draft of /xx-fix tool as a review workflow for AI to check my writing for me. The workflow is based on my experience, but haven't quite being battle tested on a blog post from scratch, so there ended up some building the airplane while you fly it. I ended up incrementally improve upon the tool as I wrote out the blog post. 

## Co-authoring in the document, turn by turn

One of my central thesis when it comes to human AI interaction, is that the workflow will need to be structured in a way human understand it. Human needs to understand the stem of the work, so that they can pivot at the right time. LLM based AI essentially has a single transcript that contains all the information. It's often hard for human to keep track of all the details. If we consider blog writing task, there are several things going on at the same time: 

1. that human may ask AI about things to further their understanding in an area, and the goal is not to generate any outward visible artifact, but updating their brain's neurons with knowledge and information. 

2. and occasionally, they have some good prose they want to capture. And those prose are still fractured, not a whole essay. 

3. and sometimes they are in a spur of inspiration that portion of the document is laid out. 

How do you adapt such different modes into a coherent workflow? The setup I end up creating, in hindsight, works a lot like how a human would collaborate with another colleague. 

1. there's a thread of free form consultation. That's the chatbot experience, and in this case, I'm using `claude code` as it gives me a lot of customization opportunities. It's actually infinitely extensible as you can ask it to write additional code to do whatever you want as part of your workflow. We will see part of that power a bit clearer later. 

2. a work surface for the artifact to evolve. Here, the artifact is a blog post manifested as a markdown file. The way human is able to communicate with their smart colleague about the artifact is contextual, that you ask question about that artifact, in the context of some part of that artifact. What I used in my workflow is `nvim` with `parley.nvim` extension, that the human directly insert comments inside the document under review using markup conventions, and the paired agent skill in `claude code` that is able to interpret such markup, effectively creating paralleled sub-conversations inside those markups within the host document. This setup conveniently solved the mental load for human to specify context precisely: context is already clear around where the markups are inserted. Even when there are many of such "comments" thus form many sub-conversations, human's still able to mentally keep track of them, as it is not too unfamiliar compared to how human interact with other humans in a collaborative document review process. 

3. and to keep track of things, if not, for posterity, /xx-fix skill is instructed to interpret the changes in the artifact as signals for a turn. Whenever a turn happens in the conversational thread, AI will figure out if the turn means to update the document, or means to be free form, and if it decides the turn means to update the document, it will create a git commit on behalf of human first, then update the document, then make another commit after AI finishes editing. 

## Building and improving the tool continuously

And as I wrote the space data center [post](./the-case-for-space-data-center.md), I also kept improving tooling around it. Some are agent skills (essentially prompts) to institute turn

- The key refinement, in your words: > "when I ask them here, doesn't mean… you should go review… I would use 'review' as the keyword."
- So we **codified explicit triggers** into the skill *while using it*: free-form chat changes nothing; review rounds run only on "go review" / "update the doc"; a session opens on "start a docflow"; and a **reading-frontier** rule (text above the first open marker is settled).
- This is the crux of *leveraging AI properly*: I can **interrogate freely** (build intuition, check facts) **and** drive **precise edits** — without the two modes colliding. The collaboration produced its own tooling.
- Separately, improved parley.nvim's review tool, so that it's mechanism to resolve AI remarks in the document is animated, offer user visual clue of the change applied. 

## Learning facts and math from AI

By now no one would be arguing that AI doesn't have world's knowledge. They do. When they are less sure, they can always do a search and summarize. So part of this writing about space data center, is also my journey of learning about this topics. 

AI pulled in theories, formula of thermodynamics, which I have no previous exposure of. I think it's a much quicker ways of learning, as it's targeted to a particular problem at hand. I bet it is much easier for human to remember facts in adjacent areas when human is in the driver seat, mapping it out, compared to the traditional indiscriminate dumping of information, sort of self-guided progressive disclosure? I think it is a very interesting angle to explore in education. 

## How do you know if AI is giving the right information?

This is what I'd call part of AI literacy. Just like you can't just trust information on the Internet, you should treat what AI tells you with a grain of salt. Human always needs to construct a consistent mental picture based on new information gained from AI. There are also the typical ways to improve AI accuracy:

1. human to establish a consistent logical framing. 
2. AI to be self consistent. 
3. Reference to source of fact, and check the source. 
4. Leverage AI from different vendor. 
5. Fresh context for fact checking agent runs.

## What this says about knowledge work + AI

- **Not an oracle.** AI doesn't know what I want; I bring the intent, the through-line, the taste, and the pushback. (Tie to the excerpt.)
- **The division of labor:** human = questions, long-range logical consistency, intent, judgment; AI = facts, math, drafting, mechanics, fresh-eyes verification.
- **The shell makes it trustworthy:** git-journaled rounds, explicit triggers, fresh-context fact-checks, build gates — determinism wrapped around a probabilistic core.
- **The result:** a post I couldn't have produced alone at this quality and speed — with a complete audit trail of how every claim and every sentence got there.


