---
title: How WhatsApp Works
publishDate: 2025-09-13
excerpt: "How WhatsApp actually worked: Erlang/BEAM/OTP all the way down, the biggest machines money could buy, location-transparent actors, and code hotloading as deployment. They bucked every Cloud Computing canon and ran the world's largest messaging system with a tiny team."
tags:
  - tech
highlight: true
---
This is a counterpart to [WhatsApp Culture]({% post_url 2025-02-27-culture-wa %}). Here, I introduce how WhatsApp works. WhatsApp, for the longest time, took a contrarian approach: 1\) finding the biggest machine; 2\) emphasis on raw efficiency; 3\) relying on semi-manual operation posture. It was an eye-opening experience for me as they basically bucked the canons in the "Cloud Computing" and charted their own path. They proved it working and operated the worlds largest messaging system reliably with a tiny team. 


## The Founding Story 

Legend has it that when WhatsApp was founded, they were in need of an open-source implementation of the Jabber protocol. They searched around, and this little guy called `ejabberd` stood out. It performed and scaled significantly better than anything else on the market. The founder decided to start using that for the message routing, despite having no experience in the language or ecosystem at all, while implementing the other portion of the stack using a more typical web stack. As time passed, they grew more comfortable with it and eventually migrated almost everything to Erlang-based systems. This trend reversed after the Facebook acquisition. It settled with all messaging and control channels on Erlang, and the media-related (images, files, videos, VoIP) data plane on C++, which is a sensible position to be in. 

## Erlang / BEAM / OTP

To talk about WhatsApp, we need to first talk about `Erlang`/`BEAM`/`OTP`.

`Erlang` is a programming language; `BEAM` is its virtual machine and runtime; `OTP` is the standard library for managing distributed actors across a cluster. The whole system was designed around concurrency from day one, not bolted on later. Even a “hello world” program feels verbose, because the language assumes distribution: you start a cluster, print a line, then shut the cluster down. There’s no main thread, only actors processing their mailboxes. 

The key innovations in Erlang/OTP are around two things: 1\) the concurrency model, and 2\) the functional programming model. 

### Concurrency Model

Erlang’s concurrency model revolves around actors and its native implementation within the virtual machine and runtime, allowing unprecedented ways of handling errors: you can catch process crashes on a remote machine and remedy them. Location transparency is built into language and runtime, such that sending a message to an actor, e.g., `Pid ! Msg`, is simple and the same, wherever that actor is physically located, including half a world away. The operational tooling for managing a cluster of heterogeneous actors on many machines is also unprecedented. You can inspect all running actors/processes, their mailboxes, and their internal state. You can safely update their states if you so need, for example, for firefighting situations. You can choose to fast-drain one overloaded actor’s mailbox to alleviate the load temporarily. Compared to any other concurrency programming model, where the request queues are all buried deep under various libraries and are not directly accessible, not even observable at a finer granularity level. All those are possible, as concurrency on multiple different processors without shared memory was the design from the very beginning. All of this scales to millions of actors per node, each occupying several hundred bytes, thus allowing billions across a cluster, limited mainly by memory and network resources. `Erlang`/`OTP` scales out, trivially. 

### Functional Programming Model

It is also about functional programming. Erlang is functional, but also designed to be practical: with simple dynamic typing, simple syntax, and everything is pattern matching. You can even do pattern matching on bit streams, making protocol parsing and handling elegant and a breeze! There are even mutable states in the form of `ETS table`. 

In short, Erlang is consistent in how it models systems: concurrency (processes, supervisor, share-none), state (data), and business logic (functions) are each first-class, but also separated into distinct parts of the language and runtime. In contrast, object-oriented programming ties state and behavior together. That’s useful for simple models of cats and animals, but breaks down at large scale, where it's better for concurrency and state management to be separated. Erlang’s model avoids that trap, kept things very simple at scale. 

## How WhatsApp Works 

WhatsApp’s server, at its core, is a giant router of text messages and control messages. For two parties to send messages to each other, their two devices maintain a connection to some of WhatsApp’s front-end server (called `chatd`). Then, the message from one party goes to the `chatd` they are connected to, and has a dedicated Erlang process handling it. The message is then forwarded to the other Erlang processes representing the other party, after consulting a distributed database recording who’s where. Such a database is provided directly by Erlang itself. In the case of group messaging, the sender’s Erlang process would fan out that single message to all other Erlang processes representing the destinations. So when both ends of the communication are online, on the server, it’s essentially some message forwarding between Erlang processes and devices. 

One special case is when the communication’s counterparts are not online. In that case, the message is forwarded to a server called `offd`, which basically stores the message on durable storage. The next time a user comes online, their `offd` queue is popped, and messages are delivered to their Erlang process, which then is forwarded to the mobile device it’s connected to. `offd` implement such durable storage over a file system, and it worked. 

### Parallelism

WhatsApp layered abstractions on top of Erlang’s primitives to manage concurrency at scale.

At the base level, you have an Erlang process, organized in `gen_server`[^1]. `gen_factory` is used to manage a group of worker `gen_server`, and `gen_industry` is used to manage shards of many `gen_factory` handling some entity, with sharding mapping as part of static cluster configuration. So in this setup, given the identity of an entity, you can easily find which early process handles it, inspect if that portion of the system is having any problems, including inspecting its current state, from any connected Erlang node. 

Typical stateful services (services fronting a database) are managed by `gen_industry`, stateless services often by it, just for uniformity, not for necessity, as it’s easy to operate. The chat routing layer (`chatd`) has its own routing layer. Due to the location transparency of Erlang, those “service discovery” mechanisms are extremely simple: they are just some state stored somewhere on the computing mesh. Accessing the servicing routing information is not that different from accessing any piece of data.

### Code Hotloading

With a programming language and runtime with strict control over concurrency and state, it is relatively trivial to allow code hotloading as a deployment mechanism. Remember each Erlang actor/process is single-threaded, processing messages in their mailbox one at a time. Code hotloading is a matter of letting current mail finish processing, run some migration code if state changed, then switch to the new code and process the next message in the mailbox. To maintain backward compatibility, it's often just requires adding extra function heads to pattern-match updated state.

This worked pretty well for WhatsApp until several years after the acquisition, where they started to embrace more standard CI/CD practices and deploy by restart. I couldn't help wondering had WhatsApp invested in automation around code hotloading, would they be able to chart out a very different CI/CD system. Well, I guess statistically speaking, most things regress to mean, if not to mediocrity.

### Other Distributed Databases (beyond `offd`)

Since Erlang handles distributed aspects of the system really well, we also implement distributed storage using Erlang for coordination, and a usual storage engine (files, RockDB, or Erlang’s native ETS) to handle durable storage. One interesting choice was the overall static nature of all storage partitions. For the longest time, increasing the sharding number has been managed by a set of manual operations. This is one philosophy of keeping things simple, that those capacity-doubling/quadrupling events are fundamentally bounded, making it less useful to automate. 

### Leveraging Facebook Infrastructure 

After the acquisition, it took some years to move from the bare metal hosts they rented in Softlayer into Facebook data centers. Before such move, they ran only in one data center and weren’t able to fall over between data centers. So as part of the migration, first step was to improve the overall system, so the system can operate in multiple data centers, in active-active mode.

Beyond the computing machines we use in Facebook data center, they also started leveraging key infrastructure components, like time series database for observability (`ods`[^2]), real-time debugging dataset in `Scuba`[^3], and databases (`zippy db`[^4], `Hive`). Later, as WhatsApp’s business case expanded, it also started leveraging its `WWW`[^5] layer. 

## Reference 

1. Rick Reed's [WhatsApp 2014 Talk](https://videog.infoq.com/downloads/pdfdownloads/presentations/Erlang2014-RickReed-ThatsBillionwithaBScalingtotheNextLevelatWhatsApp.pdf)   
2. Anton Lavrik's [WhatsApp 2018 Talk](https://www.codemesh.io/uploads/media/default/0001/01/190cbb93b3aeab99aba07d051a857d05a46bf4d1.pdf) 

[^1]:  `gen_server`, a wrapper around a single Erlang process, think it as a server; `gen_factory` manage a group of `gen_server` that provide same functionality for parallelism; `gen_industry` managed sharding support. 

[^2]:  `ODS`, a time series database, similar to metric in DataDog. 

[^3]:  `Scuba`, a real-time hybrid of relational and time-series database, used heavily for debugging. You can view it as structured application log, stored largely in memory, allowing SQL query over it, and an intuitive UI that support typical queries for debugging. 

[^4]:  Key value database, similar in interface to Dynamo. 

[^5]:  Facebook’s common front end server environment, a managed monolith that works.
