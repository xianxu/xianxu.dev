---
title: "A AI Based Project Time Estimator"
publishDate: 2026-04-30
published: false
excerpt: "Estimated a feature at 41–78 hours; shipped it in five. The ratio is fun; the shape of the miss is what told me what to fix in my estimation skill."
tags:
  - tech
  - ai
---
Two weeks ago I estimated a feature at 41–78 hours. I shipped it last Wednesday in about five.

The ratio is fun; the lesson is more interesting. The estimate wasn't lazy — I had a calibrated primitive table, a 10-day baseline of my own measured throughput, and a documented algorithm I'd been refining for a week. It still missed by an order of magnitude. And **the shape of the miss told me exactly what to fix**.

## The setup

I've been building a personal credential proxy ([charon](https://github.com/xianxu/charon)) — a small Go service that intercepts HTTPS calls from agents on my Mac, swaps in the right OAuth token or API key from the keychain, and forwards. Boring infrastructure, but it cleans up a real mess: agents shouldn't see my credentials, and I shouldn't have to plumb env vars per command.

To stay honest about how long things take, I authored a "velocity" skill in my [brain repo](https://github.com/xianxu/brain) — a procedure for converting a project description into a dev-hour range. The skill had:

- A **primitive table**: chunks like "Greenfield Go service module (single concern)" → 8–14 hr; "Smaller Go module" → 2–4 hr; "API integration with batch + retry + tests" → 16–30 hr. About a dozen primitives, anchored against a 10-day baseline I'd measured (~30 commits/day, ~9k mixed lines/day, ~91 Claude prompts/day).
- A **method**: decompose the project into primitives, sum the hour ranges, apply familiarity multipliers (×1.0, ×1.5, ×2.5), add a 20% buffer for unknown unknowns.
- A **validation log**: a table at the bottom for recording actual vs. estimated. The only feedback loop I built in.

I used this to estimate four upcoming charon issues: #13 (OpenAI/Anthropic API-key providers, ~55 hr), #14 (Google AI access, ~25 hr), #15 (long-tail provider catalog, ~45 hr), #16 (runtime consent + macOS UI, ~85 hr). Total: ~210 hours. Roughly three weeks of focused work.

Then I shipped #13.

## What actually happened

Five focused hours, including lunch and a side errand on another repo. Twenty-six commits. About 10,000 net lines of code + tests + docs. End-to-end working: agent makes an HTTPS call, charon swaps in the right `sk-...`, OpenAI generates an image, agent never sees the secret.

Not a hack. Real production paths, real tests, real macOS Keychain ACL pinned to a code-signed binary, a [thorough threat model amendment](https://github.com/xianxu/charon/blob/main/docs/threat-model.md), and two rounds of code review (dispatched to subagent reviewers — more on that below).

If the velocity skill had said "this'll take 5 hours," I'd have been mildly skeptical. Instead it said 41–78 hours. **A 10× miss.** Beyond the ±50% draft-error budget I'd documented for first estimates. Way beyond.

## The shape of the miss

I went back to the commit timestamps and reconstructed approximately how long each milestone took:

| Milestone | Estimated | Actual | Off by |
|---|---|---|---|
| TUI design sketch | 1–2 hr | 0.5 hr | ~2–4× |
| M1 — provider interface (Smaller Go module) | 2–4 hr | 0.2 hr | ~10–20× |
| M2 — OpenAI provider impl (Greenfield Go module) | 10–16 hr | 0.2 hr | ~50–80× |
| M3 — Anthropic mirror | 4–8 hr | 0.15 hr | ~25–50× |
| M4 — TUI flows (Greenfield Go, 3 phases) | 8–14 hr | 1.5 hr | ~5–9× |
| M5 — Proxy routing (Smaller Go) | 4–8 hr | 0.25 hr | ~16–32× |
| M6 — Account-level rm refactor | 2–4 hr | 0.5 hr | ~4–8× |
| M7 — Docs (atlas/agent-protocol/threat-model) | 1–3 hr | 0.25 hr | ~4–12× |
| Code review × 2 chunks | 2–6 hr | 0.4 hr | ~5–14× |

The misses weren't uniform. Pure-code primitives — M1, M2, M3, M5 — over-estimated **10–80×**. When the design was already settled (a plan doc with concrete schemas, endpoint maps, locked decisions), implementation was effectively constant-time. A few minutes for any well-specified Go module, tests included.

The TUI work — M4 — was the closest to estimate, off by 5–9×. That was iteration with myself on naming, layout, breadcrumb shape. Time spent making decisions, not typing.

Process overhead — code review — over-estimated 5–14×. Subagent reviewers dispatch in seconds, return findings in a few minutes, and addressing each finding is fast.

The pattern is clean: **the more "decide" the work, the closer to estimate. The more "type" the work, the more wildly the estimate over-shot.**

## Why my v1 didn't see this

The primitive table mashed both modes into one range. "Greenfield Go service module: 8–14 hr" was a number that reflected, in the original baseline, whatever fraction of design and implementation that primitive typically required, averaged. It was a single bucket for what turned out to be two phenomena.

Two things changed since I authored that table:

1. **Claude Code Opus 4.7 + the SDK loop got materially better.** When the agent can plan, write code, run tests, dispatch sub-agents for review, fix findings, and commit — all without me in the typing loop — the implementation portion of any primitive collapses 5–15×. My measured throughput on this run was about 2,200 LOC/hour, against a baseline of 210 LOC/hour. A 10× delta in roughly a month.

2. **Charon's codebase had matured.** #13 added a parallel `internal/providers/openai/` package mirroring the existing `internal/oauth/google/` layout. "Greenfield" was a misnomer — I was *mirroring* established conventions. The "smaller Go module" primitive matched better than the greenfield one, and even that under-counted the mirror discount.

Neither of these is a bug in v1. They're the calibration drifting under me, which is what calibrations do.

## v2

The fix is structural, not numerical. I split every primitive into two columns:

| Primitive | Design (hr) | Impl (hr) |
|---|---|---|
| Smaller Go module (well-specced) | 0 – 0.3 | 0.2 – 0.5 |
| Greenfield Go module (single concern) | 0.5 – 2 | 0.3 – 0.8 |
| TUI screen + state machine + tests | 0.5 – 2 | 0.3 – 1 |
| API integration | 1 – 3 | 0.5 – 1.5 |
| Code review chunk (subagent + findings) | 0 – 0.2 | 0.2 – 0.5 |
| Atlas / docs maintenance | 0.05 – 0.2 | 0.05 – 0.2 |
| ... | | |

The estimator picks both per primitive, sums design and impl separately, then:

1. **Spec quality discount on design.** If the issue's plan doc already pre-resolves most decisions for that primitive, multiply design hours by ×0.2. The work has already happened during issue authoring; the estimator is just reading. (The discount also applies when mirroring established codebase patterns — *the existing code is the spec*.)

2. **Familiarity multiplier on impl only.** Novel-but-bounded stack: ×1.5. Truly exploratory: ×2.5. Design hours don't get this multiplier — design density is governed by decision count and spec quality, not by stack familiarity.

3. **Buffer on design subtotal, not the project total.** +30% on the design column. Implementation is much more deterministic now and doesn't need padding. Surprises that grow the project come from design — mid-flight scope pivots, user-driven UX iteration, concept mismatches. The buffer should sit where the surprises actually accumulate.

I also added three primitives that v1 didn't have:

- **Real-API discovery budget per external API.** Charon's #13 hit two real surprises with OpenAI: the documented `/v1/organization` endpoint doesn't actually exist (org context comes through a response header instead), and project API keys can't be created directly — you go through service accounts. Each cost ~10–15 minutes of debugging the wire shape. Budget 0.3–0.6 hr per external API. The catalog issue (#15) integrates 13 providers; it gets allocated about 3 expected surprises.

- **Mid-flight scope pivot.** During #13, Anthropic got demoted to the catalog issue when I discovered their Admin API doesn't actually let you create new keys programmatically. That kind of discovery and re-planning is real work the original primitive table didn't budget for.

- **User-driven UX rename round.** I had to rename "+ new project" to "+ new key" mid-issue when the language got confusing — cosmetic on the surface, but a few decisions about terminology that propagated through the entity-list, mint flow, and detail screen.

## The re-estimate

Applying v2 retroactively to #13's actuals: the new range is 5.5–17 hr, vs v1's 41–78 hr. Still a little high relative to the actual 5 hr — I want to be conservative with one calibration data point — but in the same order of magnitude. That's progress.

Forward-looking: re-estimating the remaining three issues:

| Issue | v1 best | v2 best | v2 range |
|---|---|---|---|
| #14 — Google AI access | 25 hr | 5 hr | 2.4 – 7.6 |
| #15 — Provider catalog | 45 hr | 12 hr | 6.1 – 18.5 |
| #16 — Runtime consent + Mac UI | 85 hr | 20 hr | 11 – 34 |

Total remaining: ~37 hours best-guess, vs ~155 hr at v1 best-guesses. The reduction is least aggressive on #16 — it's the only one with genuine novelty (Mac UI, AppKit, CGo proc syscalls). Mac UI will be the first non-Go primitive I get actuals for, and v2 still has it extrapolated. That's where I expect v3 to need the most refinement.

## The bigger picture

I think the implementation-collapse story isn't specific to charon, or to Go, or to my particular stack. The shape of it is:

**Spec quality is the primary cost driver now.** The hours that survive AI-paired execution are the hours you spend deciding what to build and how. Once decisions are written down — schema, API surface, file layout — the typing is pretty cheap. A thorough plan doc is maybe the highest-leverage artifact you can produce before starting.

**The bottleneck is your roundtrip rate, not your typing rate.** You're co-designing with the agent. The clock runs on how fast you can answer "should this be a method on X or a function?" — not on how fast Go compiles. If you want to be fast, get faster at deciding.

**Real-API discovery is the new "unknown unknown."** Documentation lies sometimes. Wire shapes change. Endpoints that "should exist" return 404. Budget for it explicitly. (And use a sub-agent to investigate the wire shape against the real API before you commit to it, when the cost is bounded.)

**Code review with sub-agents is faster than you think.** Dispatch + findings + addressing them ran me ~25 minutes total across two chunks of substantial review on #13. v1 budgeted 2–6 hours. The leverage is enormous — and the sub-agent gives you fresh eyes that you don't get from re-reading your own work an hour after writing it.

On the other hand, **good design takes about as long as it always did**. The TUI work on #13 was the slowest milestone for a reason. None of it compresses with AI in the loop. If anything it benefits *less* from AI because the bottleneck is human taste — what does the user see, what verbs map to what intuitions, where does the cursor land after a back-navigation. AI can offer options; you have to pick.

So the velocity story isn't "AI 10× everything." It's **"AI 10× the parts that were typing."** Which means the parts that were design now look bigger relative to the whole project. Investing in design density before you start coding has a higher payoff than it used to.

## The validation log is the thing

The #13 actuals went into the v1 validation log as the data point that triggered v2. The v2 algorithm is now live in the brain repo, paired with a baseline-v2 doc that documents the new calibration anchors. Each of #14/#15/#16's issue files has a v2 estimate alongside the v1 prior, frontmatter trace included. Next is shipping #14 and #15 and seeing if v2 holds up. If they come in within ±50% of v2 best-guess, the algorithm earns its keep. If they miss in some new pattern, that's signal for v3.

Without the validation log I'd be calibrating blind. **An estimation skill isn't useful unless you wire in the feedback loop and actually fill it.**

And one more thing. I started this skill thinking of it as a productivity tool — "let me get better at estimating my work." After one full calibration cycle, it's mostly a tool for noticing **what kind of work I'm actually doing**. The two-column primitive table is a forced clarification. Every primitive now costs you a small decision: how much of this is design, how much is impl? You can't fudge it. And once you can't fudge it, you start to see your project for what it is.

Pretty interesting outcome for ~5 hours of work.
