---
title: Binary Skill and Dynamic Skill
publishDate: 2026-06-20
published: false
excerpt: "The key 🤖<role of human>{role of the human} in agentic coding is to set up what I would call the deterministic shell 🤖<in more places such that>{in more places so that} human intention can be enforced. Agent skill is the main way 🤖<current generation of harness use>{the current generation of harnesses uses} to stitch together 🤖<static set of prose>{a static set of prose}, potentially with embedded scripts. Here, I demonstrate two patterns I used in ariadne to make such prose fragments 🤖<easier to maintain and dynamic>{easier to maintain and regenerate dynamically}."
tags:
  - ai
  - tech
---

In the context of agentic coding, 🤖<in the end of the day>{at the end of the day}, you assemble some system prompts to prime how an 🤖<LLM based intelligent agent work>{LLM-based intelligent agent works} in a session. **That's the mechanism for using the LLM -- the new stochastic computer.** And the current generation of 🤖<LLM based agents>{LLM-based agents} 🤖<use [agent skill](https://agentskills.io/home) convention>{use the [agent skill](https://agentskills.io/home) convention} for constructing 🤖<such prompt>{such prompts} (aka context). The convention works roughly as follows: there is a folder with the name of the skill, and within that folder a file named `SKILL.md` serves as the entry point. `SKILL.md` contains a 🤖<front-matter formatted meta-data>{frontmatter-formatted metadata} section at the top. The body is prose describing what the agent is supposed to do. One front-matter field is of particular interest: `description`, which is always loaded into the agent's context at startup. The rest of the document is pulled into context later in the session -- 🤖<by the agent's own determination>{at the agent's own discretion}, based on that description.

The skill's main prose acts as a user manual. It may reference scripts that live alongside it in the skill folder -- scripts that encode deterministic behavior and spare the LLM from re-deriving the same logic every time. Additional markdown files can also sit in the skill folder, loaded by the agent on demand, just as the agent loads the skill body itself on demand.

Some examples:

- **Static prose only:** A skill that teaches the agent how to write commit messages -- `SKILL.md` contains guidelines, tone rules, and a template. No scripts needed; the agent follows the prose directly.
- **Prose + embedded script:** A skill for running a test suite includes a `run-tests.sh` script. `SKILL.md` describes when to run it and how to interpret the output, but the agent invokes the script rather than composing the commands itself each time.
- **Skill binary:** A skill for managing the software development lifecycle bundles all its subcommands into a single compiled binary (`sdlc`). `SKILL.md` is minimal -- it tells the agent to run `sdlc --help` and follow the output.
- **Dynamic skill:** A skill whose front-matter must reflect the current state of the repo (e.g., listing all defined datatypes) is regenerated on demand by a `.dynamic-skill` script, so the description the agent reads at startup is always accurate.

## Problem one: 🤖<how to keep script in sync>{how to keep scripts in sync} with SKILL.md

The first problem that arises when you put scripts inside a skill folder is a basic software-engineering one. In the naive approach, the prose in `SKILL.md` describes how each tool should be invoked -- effectively doubling as the script's user manual. But that prose is disjoint from the script itself, creating a weak coupling that drifts as the software evolves. The second problem is that there is no obvious place to put tests for those scripts; they are not full software projects with the usual project scaffolding.

The `skill binary` pattern 🤖<addresses those by following conventions>{addresses both problems with a few conventions}.

1. 🤖<pick a stronger language>{Pick a stronger language} than just shell scripts. I picked Go, for its static typing, 🤖<fast compilation and simple release packaging>{fast compilation, and simple release packaging} (one single small binary).
2. put most, if not all, scripts in the skill folder as 🤖<subcommand of that Go binary>{subcommands of that Go binary}.
3. 🤖<write regular tests of that binary>{Write regular tests for that binary}.
4. Simplify `SKILL.md` to the point where it merely tells the agent to run `skill-binary --help` for usage instructions. Subcommand help (`skill-binary sub-command --help`) then serves as the manual for each subcommand -- for humans and agents alike. Even without explicit instructions to do so, agents will often invoke `--help` themselves, since that convention is deeply embedded in their training data.

You can check out this pattern in [sdlc skill](https://github.com/xianxu/ariadne/blob/main/construct/local/sdlc/SKILL.md) in ariadne. The `sdlc`'s SKILL.md is very short, 🤖<basically of point 4. above>{basically an instance of point 4 above}. 🤖<All the real prose are>{All the real prose is} in the `sdlc` binary's [help text](https://github.com/xianxu/ariadne/tree/main/cmd/sdlc/helptext). Go's embed functionality means the help text stays in plain markdown files on disk, just bundled into the binary at compile time.

## Problem two: what to do when the 🤖<front-matter stanza>{frontmatter stanza} needs to be dynamic

The skill binary pattern works well -- until you need some meta-"programming" [^programming] that requires interaction between skills and the repo they live in. For example, in `ariadne` I have the concept of a [datatype](https://github.com/xianxu/ariadne/blob/main/construct/local/datatype/SKILL.md): an artifact with processes attached to its shape and lifecycle. I want to enumerate the currently defined datatypes in the `datatype` skill's front-matter, so the agent can route correctly at startup. But because that dynamism must live in the front-matter -- the static stanza loaded first -- the skill binary pattern cannot help: it only generates the skill body, not the front-matter.

Enter the *dynamic skill*: a skill whose 🤖<entire folder content>{entire folder} is generated and managed by code. In `ariadne`, the convention is simple -- if a skill folder contains a `.dynamic-skill` file, that file is a script responsible for regenerating the folder's contents. The script typically delegates to a skill binary for the heavy lifting. After applying this abstraction, the `datatype` skill is reduced to [a short `.dynamic-skill` script](https://github.com/xianxu/ariadne/blob/main/construct/local/datatype/.dynamic-skill).

## The new kind of programming

Taken together, these two patterns point toward something larger. The skill binary pattern brings software-engineering discipline -- static typing, tests, versioned releases -- to what would otherwise be loose prose and ad-hoc shell scripts. The dynamic skill pattern closes the loop between a live codebase and the agent's startup context, so the agent's understanding of the repo is never stale.

What emerges is a layered system: deterministic code at the bottom, structured prose in the middle, and a stochastic LLM on top. The human's job shifts from writing every instruction to designing that layered shell -- deciding what should be fixed in code, what should be expressed in prose, and what should be left to the agent's judgment. Getting those boundaries right is, I'd argue, the central skill of agentic programming.

[^programming]: 🤖<using quotes here as this is not the traditional programming>{Using quotes here because this is not traditional programming}; it's a combination of agent instructions, repo architecture, and 🤖<some code but writing by agents>{some code written by agents}.
