---
title: Binary Skill and Dynamic Skill
publishDate: 2026-06-20
published: false
excerpt: "The key role of the human in agentic coding is to set up what I would call the deterministic shell in more places such that human intention can be enforced. Agent skill is the main way the current generation of harnesses uses to stitch together a static set of prose, potentially with embedded scripts. Here, I demonstrate two patterns I used in ariadne to make such prose fragments 🤖<easier to maintain and dynamic>{easier to maintain and regenerate dynamically}."
tags:
  - ai
  - tech
---

In the context of agentic coding, at the end of the day, you assemble some system prompts to prime how an LLM-based intelligent agent works in a session. **That's the mechanism for using the LLM -- the new stochastic computer.** And the current generation of 🤖<LLM based agents>{LLM-based agents} use the [agent skill](https://agentskills.io/home) convention for constructing such prompts (aka context). The convention works roughly as follows: there is a folder with the name of the skill, and within that folder a file named `SKILL.md` serves as the entry point. `SKILL.md` contains a 🤖<front-matter formatted meta-data>{frontmatter-formatted metadata} section at the top. The body is prose describing what the agent is supposed to do. One front-matter field is of particular interest: `description`, which is always loaded into the agent's context at startup. The rest of the document is pulled into context later in the session -- by the agent's own determination, based on that description.

The skill's main prose acts as a user manual. It may reference scripts that live alongside it in the skill folder -- scripts that encode deterministic behavior and spare the LLM from re-deriving the same logic every time. Additional markdown files can also sit in the skill folder, loaded by the agent on demand, just as the agent loads the skill body itself on demand. This behavior is termed progressive disclosure -- 🤖<you feed LLM just enough instructions>{you feed the LLM just enough instruction}, not the whole rule book. 

🤖<However, there are some software development issues to just have a directory of markdown files and scripts.>{However, there are software-development problems with simply having a directory of markdown files and scripts.} Let's take a look. 


## Problem one: how to keep scripts in sync with SKILL.md

The first problem that arises when you put scripts inside a skill folder is a basic software-engineering one. In the naive approach, the prose in `SKILL.md` describes how each tool should be invoked -- effectively doubling as the script's user manual. But that prose is disjoint from the script itself, creating a weak coupling that drifts as the software evolves. The second problem is that there is no obvious place to put tests for those scripts; they are not full software projects with the usual testing scaffolding.

The `skill binary` pattern addresses those by following conventions.

1. 🤖<pick a stronger language>{Pick a stronger language} than just shell scripts. I picked Go, for its static typing, 🤖<fast compilation and simple release packaging>{fast compilation, and simple release packaging} (one single small binary).
2. 🤖<put most, if not all, scripts>{Put most, if not all, scripts} in the skill folder as subcommands of that Go binary. Write regular tests of that binary.
3. Simplify `SKILL.md` to the point where it merely tells the agent to run `skill-binary --help` for usage instructions. Subcommand help (`skill-binary sub-command --help`) then serves as the manual for each subcommand -- for humans and agents alike. Even without explicit instructions to do so, agents will often invoke `--help` themselves, since that convention is deeply embedded in their training data.

You can check out this pattern in [sdlc skill](https://github.com/xianxu/ariadne/blob/main/construct/local/sdlc/SKILL.md) in ariadne, which manages software development 🤖<life cycle for all project using ariadne styled AI development process>{lifecycle for projects using an ariadne-style AI development process}. The `sdlc`'s SKILL.md is very short, basically an instance of point 3 above. All the real prose is in the `sdlc` binary's [help text](https://github.com/xianxu/ariadne/tree/main/cmd/sdlc/helptext). Go's embed functionality means the help text stays in 🤖<a set of well organized plain markdown files>{a set of well-organized plain markdown files}, just bundled into the binary at compile time.

## Problem two: what to do when the front-matter stanza needs to be dynamic

The `skill binary` pattern works well -- until you need some meta-"programming" [^programming] that requires interaction between skills and the repo they live in. For example, in `ariadne` I have the concept of a [datatype](https://github.com/xianxu/ariadne/blob/main/construct/local/datatype/SKILL.md)🤖<. a `datatype` is>{. A `datatype` is} an artifact in the repo with some processes attached to its content and lifecycle. I want to enumerate the currently defined datatypes in the `datatype` skill's front-matter, to make it easier for the agent to route correctly at startup. But because that dynamism must live in the front-matter -- the static stanza loaded first -- the skill binary pattern cannot help: it only 🤖<generates majority of skill body, not the still's front-matter>{generates the majority of the skill body, not the skill's frontmatter}.

Enter the *dynamic skill*: a skill whose entire folder content is generated and managed by code. In `ariadne`, the convention is simple -- if a skill folder contains a `.dynamic-skill` file, that file is a script responsible for regenerating the folder's contents. The script typically delegates to a `skill binary` for the heavy lifting. After applying this abstraction, the `datatype` skill is reduced to [a short `.dynamic-skill` script](https://github.com/xianxu/ariadne/blob/main/construct/local/datatype/.dynamic-skill) 🤖<which calls to the [datatype binary](https://github.com/xianxu/ariadne/tree/main/cmd/datatype) for it's functionality>{which calls the [datatype binary](https://github.com/xianxu/ariadne/tree/main/cmd/datatype) for its functionality}. 

One more interesting aspect here is that while the `datatype` binary is defined in the `ariadne` base layer, 🤖<derivative repos from `ariadne`>{repos derived from `ariadne`} can introduce their own new datatypes. So in this case, we get a generic `datatype` binary from "inheritance" but then it is invoked on a merged view of all datatypes defined across ariadne and the derivative repo under consideration. This means 🤖<different ariadne repository will have their own slightly different instance of `datatype` skills>{different ariadne repositories will have their own slightly different instances of the `datatype` skill}, 🤖<when the `make weave` compile time command's invoked>{when the compile-time `make weave` command is invoked}. 

## The new kind of programming

Taken together, these two patterns point toward something larger. The skill binary pattern brings software-engineering discipline -- static typing, tests -- to what would otherwise be loose prose and ad-hoc shell scripts. The dynamic skill pattern closes the loop between a live codebase and the agent's startup context, so the agent's understanding of the repo is never stale.

What emerges is a layered system that uses deterministic code to create hard shells that stipulate system behavior 🤖<while seamless leverage LLM the stochastic machinery>{while seamlessly leveraging the LLM's stochastic machinery}. 🤖<The deterministic shell and bones improve LLM performance to both shorten the inference chain>{The deterministic shell and bones improve LLM performance by shortening the inference chain}, and provide 🤖<determininistic correctness signal>{deterministic correctness signals}, 🤖<to the otherwise, always plausible LLM responses>{for otherwise always-plausible LLM responses}. 

[^programming]: Using quotes here because this is not traditional programming; it's a combination of agent instructions, repo architecture, and code often scoped by human but written by agents.
