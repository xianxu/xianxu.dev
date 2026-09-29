---
title: "Parley: A durable AI Interface for Learning"
publishDate: 2026-09-29
published: false
excerpt: "AI is a great helper to help you access the world's knowledge. However, the current chatbot user interface makes research and learning harder. Have you ever felt inundated with too much information? Parley is different: you have full control of the chat, it's just a text file you can edit."
tags:
  - tech
  - ai
---

Previously, I introduced you to [Parley.nvim](chatgpt-in-neovim-collab.md), a Neovim plugin. Now it's a lot more polished and easy to install: introducing **Parley** the app. 

## What is Parley

What exactly is Parley? It is a research tool that helps you learn a topic, leveraging AI. It encourages free-form discussion, and provides you with tools to find your way around the many threads of digression a learner inevitably takes. To explain how it works, let's think about what AI is good at, and how humans learn.

AI has the world's knowledge. It is an encyclopedia with a natural-language interface that understands the context of a particular conversation. It is your ultimate librarian and professor, depending on how you use it. All you need to do is to ask the right question. 

On the other hand, human learning is less about facts than about constructing a consistent mental model about a domain. And in order to actually learn, humans need repetition, which typically means reviewing material more than once. That's why we make notes in textbooks, create outlines, make flash cards, take quizzes, etc. Here's the dilemma: Have you ever been inundated with long-winded, super-comprehensive AI answers? Have you ever gone back to your ChatGPT conversation and read them again, with new questions to ask in the middle of that conversation? The ChatGPT user interface is good for entertainment, weak for actual learning. 

Parley provides a simple and consistent way to help you get oriented in the sea of AI-generated text: you chat with the AI, have full control of the transcript, make notes in the same file, jump through notes you took, cut off bloated AI answers to focus on the gist, and you can review all those later. If chatting with ChatGPT is like printing a customized textbook that no one's going to read again, talking to AI in Parley is like talking with your professor and making some notes. Actually this is how Parley got its name! You don't need another textbook; with AI, it's just one ask away. 

If that sounds useful, read on. There's a video after the key features to show you Parley in action.

## Key features

The key distinctions of Parley from a typical chatbot:

1. A durable transcript presented just as a markdown file, with an easy-to-understand convention: you ask questions after 💬:, and AI replies after 🤖:. Having a durable transcript in a file allows you to use all the power of Neovim, to search, organize, change text. Yes, you can, and should, change AI's answers as well.
2. Chat files are linked and organized into a tree, mapping to how humans tend to ask questions. When you have questions about AI's response, you can easily fork off a thread to ask about it, without losing track of the main thread. A single keystroke shows you the overall map of the conversation across many notes in the tree of chat files.
3. You make notes in the chat files themselves. Those are your notes to remind you of your learning. You create annotations that appear in the outline of a group of chat files, to help you construct a mental model. You can also come back weeks later, and easily get oriented from annotations you left behind.
4. If the AI generates too much detail, shortcut keystroke `dae`[^dae] clears that entity, be it a paragraph, a section, or entire answer. This helps cut down bloated AI answers to what you are interested in learning at that moment. Don't worry about the trimming, AI is the textbook sitting right there. 
5. Parley works across different AI with the help of `cliproxyapi`. Parley talks to all major AI providers, utilizing the subscription plan you already have with them. 

How does it work? One video is worth a thousand words. Take a look.

<div class="cast-embed" data-cast="/casts/parley-nvim-v1.cast" data-poster="npt:0:41"></div>

## What Parley isn't

To be something, you can't be everything. Parley is not for everyone. In particular, Parley is:  

- **Not a notes app.** The notes here are a byproduct of asking, not the central feature. There are many note-taking apps.
- **Not an agent.** Yes, Parley has local tool calls, can answer questions about itself through provided help text, but it doesn't intend to be a proper harness. For that, use `codex` or `claude code`.
- **It runs on Neovim.** While you don't need much knowledge of Vim to use it, I find the love of Vim's often in the eye of the beholder.  

## Install

```sh
brew install xianxu/parley/parley
```

All the additional dependencies will be downloaded the first time you open Parley to chat with AI. Take Parley for a spin, I hope you like it! 

---
[^dae]: `ae` is a Parley text object. Other verbs work as well: e.g. `yae` etc.
