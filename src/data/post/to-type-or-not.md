---
title: To Type or Not to Type
publishDate: 2026-02-09
excerpt: "Mainstream type systems are simultaneously too strong (closed-world assumptions hurt during change) and too weak (can't say \"positive integer\" or \"age between 0 and 200\"). For startups in unsettled domains, duck typing wins — types are a luxury you afford after product-market fit."
tags:
  - tech
---

I’m a programming language enthusiast and love type systems. But I’ve also realized, as I’ve gained industrial experience, that this is often not such a useful pursuit, Mostly because our understanding of the world, and the businesses we are in, constantly changes. As a matter of fact, the software industry in general gravitates toward domains where our understanding of the problem is not well established (i.e., new industries). In such domains, business needs are typically unknown at the beginning. How do you model something that is unknown? This really calls for the power of weaker typing systems (duck typing, for example).

In an ironic way, the type systems found in typical programming languages are both too strong, yet not strong enough.

Typical type systems often follow closed-world assumptions, and thus cause pain during change, particularly when their structure is persisted (in data storage), or distributed (in a distributed system, or in software you ship). In those cases, you can’t easily change things without causing all sorts of compatibility troubles.

Typical type systems, on the other hand, are also too weak. They are not able to capture many seemingly simple constructs, such as an integer needing to be positive, or a person’s age generally falling between 0 and 200. Yes, there’s dependent types, but those surely are not mainstream. 

You may then ask: why do we do types at all? I think the answer is mostly historical. Almost all programming languages are designed not as something you persist in a database, and not to operate in a distributed system (with Erlang as a famous outlier). They typically assume that you have all files available at compilation time, resulting in a coherent binary (or a group of binaries) that is loaded into a single computer’s memory in an immutable fashion (no code hot-loading). Back in such time, the current mainstream type system worked well! But time has changed, and that was a very different world from modern software development in an industrial setting.

So, a piece of advice for startups? Don’t get too hung up on type checks in programming languages. Avoid micro-services. Focus on the business. Use a duck-typed language early on. If you are wildly successful, you will have the billions of dollars to hire people to rewrite some core components in typed languages, once your understanding of the domain stabilizes. You will have understood the proper service boundaries in time. 

P.S. As a programming language enthusiast, of course I want to design a perfect industrial programming language! And here’s my wish list.

- structural typing
- optional-by-default
- strict Option[T]
- open enums
- algebraic data types + functions
