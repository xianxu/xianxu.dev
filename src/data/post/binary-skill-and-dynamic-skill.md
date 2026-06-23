---
title: Skill Binary and Dynamic Skill
publishDate: 2026-06-20
published: false
excerpt: "The key role of the human in agentic coding is to set up what I would call the deterministic shell in more places such that human intention can be enforced. Agent skill is the main way the current generation of harnesses uses to stitch together a static set of prose, potentially with embedded scripts. Here, I demonstrate two patterns I used in ariadne to make such prose fragments easier to maintain and regenerate dynamically."
tags:
  - ai
  - tech
---

The useful way to think about agent skills is not as a pile of prompts, but as part of a deterministic shell around a stochastic machine. The prose tells the agent how to behave; the scripts, binaries, and generated files decide which parts of that behavior are enforced by code. This post is about two patterns I use to make that shell less fragile.

In the context of agentic coding, at the end of the day, you assemble some system prompts to prime how an LLM-based intelligent agent works in a session. **That's the mechanism for using the LLM -- the new stochastic computer.** And the current generation of LLM-based agents use the [agent skill](https://agentskills.io/home) convention for constructing such prompts, also known as context. The convention works roughly as follows: there is a folder with the name of the skill, and within that folder a file named `SKILL.md` serves as the entry point. `SKILL.md` contains a frontmatter-formatted metadata section at the top. The body is prose describing what the agent is supposed to do. One front-matter field is of particular interest: `description`, which is always loaded into the agent's context at startup. The rest of the document is pulled into context later in the session -- by the agent's own determination, based on that description.

The skill's main prose acts as a user manual. It may reference scripts that live alongside it in the skill folder -- scripts that encode deterministic behavior and spare the LLM from re-deriving the same logic every time. Additional markdown files can also sit in the skill folder, loaded by the agent on demand, just as the agent loads the skill body itself on demand. This behavior is usually called progressive disclosure -- you feed the LLM just enough instructions, not the whole rule book. 

However, there are software-development problems with simply having a directory of markdown files and scripts. Let's take a look. 


## Problem one: how to keep scripts in sync with SKILL.md

The first problem that arises when you put scripts inside a skill folder is a basic software-engineering one. In the naive approach, the prose in `SKILL.md` describes how each tool should be invoked -- effectively doubling as the script's user manual. But that prose is disjoint from the script itself, creating a weak coupling that drifts as the software evolves. The second problem is that there is no obvious place to put tests for those scripts; they are not full software projects with the usual testing scaffolding.

The `skill binary` pattern addresses those problems with a few conventions.

1. Pick a stronger language than just shell scripts. I picked Go, for its static typing, fast compilation, and simple release packaging (one single small binary).
2. Put most, if not all, scripts in the skill folder as subcommands of that Go binary. Then write regular tests for that binary.
3. Simplify `SKILL.md` to the point where it merely tells the agent to run `skill-binary --help` for usage instructions. Subcommand help (`skill-binary sub-command --help`) then serves as the manual for each subcommand -- for humans and agents alike. Even without explicit instructions to do so, agents will often invoke `--help` themselves, since that convention is deeply embedded in their training data.

You can check out this pattern in [sdlc skill](https://github.com/xianxu/ariadne/blob/main/construct/local/sdlc/SKILL.md) in ariadne, which manages software development lifecycle for projects using an ariadne-style AI development process. The `sdlc`'s SKILL.md is very short, basically an instance of point 3 above. All the real prose is in the `sdlc` binary's [help text](https://github.com/xianxu/ariadne/tree/main/cmd/sdlc/helptext). Go's embed functionality means the help text stays in a set of well-organized plain markdown files, just bundled into the binary at compile time.

## Problem two: what to do when the front-matter stanza needs to be dynamic

The `skill binary` pattern works well -- until you need some meta-"programming" [^programming] that requires interaction between skills and the repo they live in. For example, in `ariadne` I have the concept of a [datatype](https://github.com/xianxu/ariadne/blob/main/construct/local/datatype/SKILL.md). A `datatype` is an artifact in the repo with some processes attached to its content and lifecycle. I want to enumerate the currently defined datatypes in the `datatype` skill's frontmatter to make it easier for the agent to route correctly at startup. But because that dynamism must live in the front-matter -- the static stanza loaded first -- the skill binary pattern cannot help: it only generates the majority of the skill body, not the frontmatter.

Enter the *dynamic skill*: a skill whose entire folder content is generated and managed by code. In `ariadne`, the convention is simple -- if a skill folder contains a `.dynamic-skill` file, that script is responsible for regenerating the folder's contents. The script typically delegates to a `skill binary` for the heavy lifting. After applying this abstraction, the `datatype` skill is reduced to [a short `.dynamic-skill` script](https://github.com/xianxu/ariadne/blob/main/construct/local/datatype/.dynamic-skill) which calls the [datatype binary](https://github.com/xianxu/ariadne/tree/main/cmd/datatype) for its functionality. 

One more interesting aspect here is that while the `datatype` binary is defined in the `ariadne` base layer, repos derived from `ariadne` can introduce their own new datatypes. So in this case, we get a generic `datatype` binary from "inheritance" but then it is invoked on a merged view of all datatypes defined across ariadne and the derivative repos. This means different ariadne repositories will have their own slightly different instances of the `datatype` skill when the compile-time `make weave` command generates local skills from the ariadne template. 

## The new kind of programming

Taken together, these two patterns point toward something larger. The skill binary pattern brings software-engineering discipline -- static typing, tests, DRY priniple (Don't Repeat Yourself) -- to what would otherwise be loose prose and ad-hoc shell scripts. The dynamic skill pattern closes the loop between a live codebase and the agent's startup context, so the agent's understanding of the repo is never stale.

What emerges is a layered system that uses deterministic code to create hard shells that stipulate system behavior while seamlessly leveraging the LLM's stochastic machinery. The deterministic shell improve LLM performance by shortening the inference chain and providing deterministic correctness signals for otherwise always-plausible LLM responses. 

That boundary work is where the human stays central. The important question is not how to make the agent memorize more instructions, but how to decide which parts of the system deserve deterministic enforcement, which parts can live as prose for versatility, and which parts should remain open for the LLM's judgment. This is how we define correctness in this new stachastic world. 

[^programming]: Using quotes here because this is not traditional programming; it's a combination of agent instructions, repo architecture, and code often scoped by human but written by agents.
