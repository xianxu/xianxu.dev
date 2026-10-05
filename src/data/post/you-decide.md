---
title: "You Decide: An AI-Assisted Voter Guide Built On Your Own Values"
publishDate: 2026-10-05
published: false
excerpt: "you-decide helps a voter work out how to vote according to what they actually care about, in the couple of hours most of us can spare. How it's structured, and how privacy, research accuracy, and full transparency drive the design."
tags:
  - tech
  - ai
  - politics
---

## The goal

The goal of `you-decide` is to help a voter research how they should vote. Everyone is busy. My guess is the average voter spends less than two hours on an entire ballot. A California general election ballot has dozens of contests: candidates from governor down to school board, judicial retention votes, and more than a dozen state and local measures. So the real question is how someone can vote the way they care about within that time budget.

The traditional shortcut is to vote a party line. But trust in both parties is breaking down. Recent elections showed the reshuffling of old aliances of electorals. Picking a team now doesn't tell you much about whether a specific candidate or measure matches what you believe, especially at more local level.

It seems to me AI can readily help to automate this process. So I went to test it out during the 2026 primary season. Now with the 2026 general election coming, I tried again, and it worked like a charm.

## How it works

From the user's point of view, `you-decide` runs in a few steps. You run the you-decide agent skill with your "coding" agent. Yep, a coding agent can do many things beyond traditional coding tasks. 

1. **Capture what you believe.** A first-time user answers a short survey: five headline questions, with optional deeper rounds, drawn from live controversies from this election cycle. The free-form answers become a plain-language "philosophy" file, written in the voter's own words. 
2. **Resolve the ballot.** From an address, find the districts and the exact list of contests that voter will see. The user interface is a full coding agent, so you can also just put a sample ballot PDF somewhere and point the coding agent at it. 
3. **Research the candidates and measures.** AI agents collect background, stated positions, record, endorsements and donors, and controversies. Every decisive claim carries its source. Sources are organized by their objectivity and only trusted sources are used.
4. **Score each candidate against your philosophy.** Each relevant axis (for example housing, fiscal policy, institutional respect, public safety) gets a score from −2 to +2 in philosophical alignment with the voter. Each office has a template that weights axes by what the office can actually do. 
5. **Ask when your values are silent.** If a contest turns on something the philosophy file doesn't cover, the system asks a focused question instead of guessing. The answer gets written back into the philosophy file.
6. **Argue with it.** When you do not understand or disagree with a score, that correction becomes a small written rule (a "calibration skill") that applies to every future read. The system learns how you weigh things, through use rather than an extensive upfront survey. 
7. **Get a guide, then optionally record how you actually voted.** This triggers a realignment loop for the system to learn your reasoning.

The voter guide offers recommendations based on your philosophy, explains the key turning points in the scoring, and the perceived risks of each candidate. In a two-candidate race you're usually choosing between imperfect options, and the useful thing is to see the trade-off clearly.

## The structure, and why it's built this way

This is a sensitive topic from several angles, and the design follows from that. 

### Privacy: how you vote is private

How someone votes, and why, is very private information. So the system is split in two:

- **A public fact layer**: the "code", candidate research, election manifests, ballot measures, source lists, and review records. None of it contains anyone's preferences. It lives in a public `you-decide` repository so anyone can inspect and reuse it.
- **A private inference layer**: your philosophy file, your calibration rules, the analysis of candidates according to your rubric, your per-candidate scores, your guide, and what you actually voted. This lives in your own private directory, outside the public repository, so publishing the code can't leak it.

### Accuracy: candidate research has to be right

A wrong fact about a candidate can swing a vote, so the research layer has rules like the following to address it:

- **Sources are tiered.** Official sources and established nonpartisan outlets are trusted for decisive claims; campaign sites are trusted only for what the campaign says; low-tier sites are leads, not evidence.
- **Claims are bound to sources one by one.** Only claims from reputable sources are used.
- **A different AI reviews the work.** Research written by one AI model is checked by a model from a different company. For my use, I often use `claude` as the main agent and use OpenAI's `codex` and Google's `agy` to cross-check reference materials.
- **Positions get dated.** Candidates change their stated positions mid-campaign, so each quote carries the date it was said.

### Using AI at all: full transparency

Using AI to help people decide how to vote will be controversial, and it should be. The answer I've landed on is full transparency:

- The code, the algorithm, the office templates, the shared calibration rules, and all the candidate research are public at [github.com/xianxu/you-decide](https://github.com/xianxu/you-decide).
- Every score shows its arithmetic and the source behind each axis.
- The system never decides whose values are right. It applies yours, and when it doesn't know them, it asks.
- Neutral facts and personal judgment are kept in separate layers, so you can audit the facts without seeing anyone's preferences, and change your preferences without touching the facts.

## Future improvements

I want to integrate with web archives, so that we can have a cached version of the evidence we used; or just create our own caching layer for things we fetched. Without this, links resolved during research may become inaccessible later. 


