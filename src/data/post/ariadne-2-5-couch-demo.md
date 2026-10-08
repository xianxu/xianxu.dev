---
title: "Couch: A Sneak Peek"
publishDate: 2026-10-08
published: false
excerpt: "A sneak peek of couch, an agentic coding workbench created by 100% agentic coding. The process of creating it was very liberating."
tags:
  - tech
  - ai
---

This is post "2.5" of a 5-post series on the AI-native development stack I built over the last 5 months:

1. [the 5-month journey of building the workflow that created `Parley`.](ariadne-1-building-blocks-of-ai-coding.md)
2. [reflection on how to leverage AI in software product development.](ariadne-2-hot-takes.md)
   1. **a sneak peek of `couch`.** (this post)
3. `couch` and `pair`, the coding environment I use daily. (TKTK)
4. `ariadne`, the skills and binaries that supported my workflow. (TKTK)
5. and lastly, where to go from here. (TKTK)

---

I decided to write a brief `2.5` post, as I got excited about how well agentic coding is working in the land of `couch`. `couch` is similar to a terminal multiplexer/switcher, but is custom-built for working with coding agents, think [cmux](https://cmux.com/), but with "agentic software development process" built into it.

As an illustration of the workflow, I got the idea it would be nice to be able to [broadcast](https://github.com/xianxu/pair/blob/main/workshop/history/issues/000395-couch-broadcast-stream-the-composed-couch-screen-view-only-to-a-remote-couch-watch.md) `couch` to many recipients, for example, for pair programming, or just 🤖<help>{to help} other users using `couch`. A 🤖<viewer only>{viewer-only} version was created within several hours. Then some 🤖<touch ups>{touch-ups}, such as a mode where 🤖<viewer>{a viewer} can [point at things](https://github.com/xianxu/pair/blob/main/workshop/history/issues/000412-couch-broadcast-remote-pointer-link-tap-and-draw-fading-marks-on-the-operator-s-screen.md), for example, to bring attention during a live pair session. There were also interesting and subtle rendering issues between Unicode, emoji, different fonts, the difference between how terminals and different web browsers draw stuff. I didn't know [those intricacies](https://github.com/xianxu/pair/blob/main/workshop/history/issues/000415-broadcast-viewer-text-style-glyphs-for-symbols-jetbrains-mono-lacks-draw-as-emoji-on-ipad.md), but was able to learn from AI ([hot take 1](ariadne-2-hot-takes.md#1)). In less than two days, we have a pretty robust feature so a live `couch` session can be viewed from anywhere on the internet, and viewers having a laser pointer to ask questions of things they see on the screen.

A video from the terminal:

<div class="cast-embed" data-cast="/casts/couch-demo.cast"></div>

And a video from the browser on an iPad:
<video src="/videos/couch-demo-viewer.mp4" controls playsinline preload="metadata" style="display:block; max-width:100%; max-height:80vh; margin:2rem auto;"></video>


