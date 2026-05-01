---
title: Mining My Own Mind
publishDate: 2026-04-30
published: false
excerpt: "Two weeks of Claude Code transcripts produced 17 rules about how I actually want the agent to work. The first attempt — heuristic regex detectors — got zero clusters. Letting an LLM read the raw segments produced the goods. Here's what came out, and the principle that drove it."
tags:
  - tech
  - ai
---

**"don't want to deal with this crap, how do I install nvim 0.11."** **"actually, this is taking too long. let's leave this and come back when I sign up for Apple developer."** **"no, fix the trigger word first."**

Three of the things I said to Claude in the last two weeks. Not the "wait, the regex is wrong" stuff — those are bugs. The other kind. Each of those is a piece of taste, pretty obvious in hindsight, harder to remember in the next session.

The transcripts were already sitting there. Claude Code dumps every session as JSONL under `~/.claude/projects/`. 45 files, 17MB, two weeks of work. The data was already collected. The question was whether I could turn it into something a future Claude session could actually use.

## The first attempt that didn't work

Initial design: write heuristic detectors. **redirect** when a user message starts with "no" or "actually" or "stop." **edit-after-edit** when the same file gets touched multiple times in a row. **friction** when the same tool keeps failing. Cluster the resulting moments by activity bucket (debugging, planning, implementation) and turn the recurring ones into rules.

The detectors ran cleanly. They produced 181 moments across 218 segments. **Zero clusters cleared the precision threshold.**

The problem: regexes are narrow. The shapes I'd encoded didn't recur often enough at a 2-week corpus size. Nuanced signals like "user lays out a product vision and invites iteration" or "user pasted an error trace, that means start with diagnosis" don't fit any of the four shapes. The heuristics caught the loud signal and missed the actual taste.

## The pivot

Drop the heuristics. Have an LLM read each session segment directly and emit candidate patterns — anything taste-revealing, in any shape, with a verbatim quote and one-sentence rationale.

```
For each segment:
  Render it as a readable transcript chunk
  Ask Claude: "What taste signals do you see? Empty array if there's
              nothing — empty is the correct answer for most segments."

For all candidate patterns together:
  Ask Claude: "Group by theme. Drop anything that doesn't recur across
              ≥2 distinct segments. Drop generic stuff."
```

Same input. Same 218 segments. **17 clusters this time.** Implementation 8, planning 4, brainstorming 2, debugging 2, exploration 1.

## A few of the rules

**Verify in real environment before declaring done.** Five segments. The model noticed I kept coming back with "still the same" or "overly confident to commit" after Claude had said the bug was fixed. Tests passing isn't proof.

**Present numbered options with an explicit recommended lean.** Four segments. I reply tersely to A/B/C lists ("option B," "1+2," "C for now"). I don't engage well with neutral "which would you prefer?"

**State diagnosis first; don't change code on debug requests.** AGENTS.md rule 9 says this literally — but it took two segments of me redirecting before it surfaced as a pattern.

**Disown your own framing when challenged; converge by attrition not artifact** — for brainstorming. Four segments. When I push back on a premise, the right move is to retract the framing, not defend it. And don't write up an issue file before the design has collapsed to its honest shape. **Premature artifact creation is a signal you stopped thinking.**

That last one stung a bit, in a useful way.

## The shape of the system

Five activity-typed sub-skills: `introspect-implementation`, `introspect-debugging`, `introspect-planning`, `introspect-brainstorming`, `introspect-exploration`. Each one's description names the trigger signals — "auto-load on error pastes, 'help me debug', repeated tool failures" for debugging — and Claude Code's skill discovery pulls them in when those signals appear in a new session.

The whole pipeline is text-on-stdout building blocks. The LLM invocation is one env var you can swap from `claude` to `codex` to `gemini` without touching anything else. **UNIX-kit shape, not a monolith.** Postmortem runs are biweekly, cost isn't a constraint, and every model judgment surfaces to me before disk writes. The whole point is to capture *my* taste, not the model's.

## The principle

One thing I told the orchestrating Claude midway through, and asked it to remember: **recall is never the goal. precision is.** Better to leave half the segments uncategorized than to force-fit them into a bucket that produces a bad rule. A smaller, trusted corpus produces better extracted artifacts than a larger noisy one.

That generalizes beyond this exercise. The temptation to claim coverage is strong. But every false-positive in your training set becomes a rule that fires when it shouldn't, and the cost of removing a bad rule later is much higher than the cost of leaving a real signal undetected for one cycle.

## What it's doing for me

Right now: not much yet. The skills exist, they auto-load, and the next time I'm debugging or planning the relevant rules will be in context. Whether they actually shape behavior is something I'll know in a few weeks.

The by-products of the run, on the other hand, were immediately useful:

- A list of the things I redirect on. A to-do for tooling and prompt cleanup, even if no rule ever fires.
- An honest accounting of how I spent two weeks. 70 implementation segments, 28 debugging, 28 planning. I would have guessed differently.
- Pattern recognition I didn't have before. I now know I have a "premature-artifact-creation when pushed back on" pattern. Whether the rule helps a future Claude or not, *I* am going to think about that one.

Re-run every couple of weeks. Watch which rules earn their keep. Retire the ones that don't.

------

## The 17 rules, in full

For the curious. One line per rule.

### Implementation (8)

1. **Verify in real environment before declaring done.** Tests passing isn't proof. Commit only after empirical confirmation, ideally with the user re-running the failing scenario.
2. **Mandatory post-milestone fresh-eyes review with triaged fixups.** Dispatch a code-review subagent at every milestone boundary, triage findings, address Critical+Important before moving on, log the outcome.
3. **Present numbered options with an explicit recommended lean.** A/B/C with tradeoffs and a recommendation, not neutral "which do you prefer?"
4. **Write scripts to disk; don't fight bash quoting or inline heredocs.** Anything non-trivial in shell goes to a file in `$TMPDIR` or `workshop/` first.
5. **Hand off commands that need interactive prompts or GUI dialogs.** Keychain dialogs, OAuth flows, TCC prompts, hardened-runtime installs — give the literal command and step back.
6. **Verify provider/platform/API behavior before coding against it.** Probe the real API once before encoding assumptions. `GET /v1/organization` doesn't exist; `fdesetup status` errors on Tahoe; SO_PEERPID isn't available for TCP loopback.
7. **Pair every bug fix with a regression test for the exact failure mode.** The bar for "fixed" is code change plus targeted test, not just code change.
8. **Use until-loops or background runs, not chained sleeps.** The Claude Code runtime blocks `sleep N && check` deliberately. Use `until <check>; do sleep 2; done` or run the command in the background.

### Planning (4)

9. **Defer schema fields and abstractions until use justifies them.** No discriminator fields, audience tags, or extra dimensions speculatively. Flattest single-list shape that works.
10. **Make data formats grep-friendly; treat tooling discoverability as first-class.** Distinctive tokens that don't collide with prose; embed worked search recipes in the type definition.
11. **Resist type/name proliferation; survey existing inventory before creating new.** List what's already registered. Prefer single-word distinctive names. "Project" has too many meanings.
12. **Pause for sign-off with concrete numbered design questions before writing.** Surface 3–7 decisions as a numbered list with options and a recommendation, then stop.

### Brainstorming (2)

13. **Disown your own framing when challenged; converge by attrition not artifact.** Retract the framing rather than defend. Don't write up an issue file until the design has collapsed to its honest shape.
14. **Push toward minimum mechanism; reject mechanism proliferation.** Lean on existing primitives and trust humans to coordinate verbally. Introduce mechanism only when concrete pain demands it.

### Debugging (2)

15. **State diagnosis first; don't change code on debug requests.** Questions get answers, not edits. End with an explicit choice question rather than a fix.
16. **Don't run destructive diagnostics; prefer non-destructive probes.** Don't `rm -rf` or wipe state to test removal. Use file copies, namespace probes, sha256 checks.

### Exploration (1)

17. **State hypothesis before launching tool calls; don't broaden silently.** Announce what you're testing before firing tools. If the first search comes back empty, pause rather than auto-broaden — the user will inject ground truth you couldn't infer.
