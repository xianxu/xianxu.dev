---
title: "Parley: A durable AI Interface for Learning"
publishDate: 2026-09-11
published: false
excerpt: "AI is a great helper to help you access world's knowledge. However, the current Chatbot user interface makes research and learning harder. Have you ever felt inundated with too much information? Parley is different, you have full control of the chat, it's just a text file you can edit."
tags:
  - tech
  - ai
---

Previously, I introduced you to [Parley.nvim](chatgpt-in-neovim-collab.md), a Neovim plugin. Now it's a lot more polished and easy to install: introducing **Parley** the app. 

## What is Parley

What exactly is Parley? It is a research tool that helps you learn a topic, leveraging AI. It encourages free form discussion, and provides you with tools to find your way around the many threads of digression a learner inevitably takes. To explain how it works, let's think about what AI is good at, and how humans learn.

AI has the world's knowledge. It is an encyclopedia with a natural-language interface that understands the context of a particular conversation. It is your ultimate librarian and professor, depending on how you use it. All you need to do is to ask the right question. 

On the other hand, human learning is less about facts than about constructing a consistent mental model about a domain. And in order to actually learn, humans need repetition, which typically means reviewing material more than once. That's why we make notes in textbooks, make flash cards, take quizzes, etc. Here's the dilemma: Have you ever been inundated with long-winded, super-comprehensive AI answers? Have you ever gone back to your ChatGPT conversation and read them again, with new questions to ask in the middle of that conversation? The ChatGPT user interface is good for entertainment, weak for actual learning. 

Parley provides a simple and consistent way to help you get oriented in the sea of AI-generated text: you chat with the AI, have full control of the transcript, make notes in the same file, jump through notes you took, cut off bloated AI answers to focus on the gist, so that you can review them later. If chatting with ChatGPT is printing a customized textbook that no one's going to read again, talking to AI in Parley is making notes talking with your professor. Actually this is how Parley got its name! You don't need another textbook — with AI, it's just one ask away. 

If that sounds useful, read on. 

The key distinctions of Parley from a typical chatbot:

1. A durable transcript presented just as a markdown file, with an easy-to-understand convention: you ask questions after 💬:, and AI replies after 🤖:. Having a durable transcript in a file allows you to use all the power of Neovim, to search, organize, change text. Yes, you can, and should, change AI's answers as well.
2. Chat files are linked and organized into a tree, mapping to how humans tend to ask questions. When you have questions about AI's response, you can easily fork off a thread to ask about it, without losing track of the main thread. A single keystroke shows you the overall map of the conversation across many notes in the tree of chat files.
3. You make notes in the chat files themselves. Those are your notes to remind you of your learning. You create annotations that appear in the outline of a group of chat files, to help you construct a mental model. You can also come back weeks later, and easily get oriented from annotations you left behind.
4. If the AI generates too much detail, shortcut keystroke `dae`[^dae] clears that entity, be it a paragraph, a section, or entire answer. This helps cut down bloated AI answers to what you are interested in learning at that moment. Don't worry about the trimming, AI is the textbook sitting right there. 
5. Parley works across different AI with the help of `cliproxyapi`. Parley talks to all major AI providers, utilizing the subscription plan you already have with them. 

How does it work? One video is worth a thousand words. 

TODO: video: which topic to use? 🤖{candidates from your own corpus, so the demo is a real inquiry rather than a staged one: the space-data-centers research (you already published the narrative, so viewers can read where it went), the WhatsApp GDPR fine (a fact-dense domain where trimming pays off), or graphviz dot (short, and the definitions-lookup highlight falls out naturally). The first has the most support material already written.}

Highlights from the video

1. Create a new chat and ask a question. 
2. Fork off a chat. 
3. Check definitions of some phrase. 
4. Make some notes, annotations. 
5. One key to see the whole chat tree, go back to somewhere in the middle, and fork other branches. 

## What Parley isn't

- **Not a notes app.** No graph, no backlinks, no mobile. Obsidian does that job better. The notes here are a byproduct of asking, not a filing system you maintain.
- **Not an agent.** Parley has local tool calls — it can search your past chats and read files in a project folder — but it stays a research tool. You don't hand it a task and walk away.
- **It runs on Neovim.** There are modes to learn. The app opens with a vim crash course, but if modal editing isn't for you, neither is Parley.

🤖{a fourth one worth considering: it isn't source-grounded — no citations, and answers come from the model's knowledge rather than documents you upload. That's the honest limit against NotebookLM for the readers you're aiming at. Add it, or keep the section to three?}

## Install

```sh
brew install xianxu/parley/parley
```

🤖{worth a line each: the first launch downloads the plugins and opens the welcome chat; `:ParleyProxy connect` logs into a provider you already pay for; `:ParleyAgent` picks a model. And that Parley keeps its config and chats separate from an existing Neovim setup — the first thing a vim user will want to know. Also: the fence now installs but never says how to start it — the packaging README has `parley` as the second line, and `parley notes.md` opens a file.}

---
[^dae]: `ae` is a Parley text object. Other verbs 🤖<works>{work} as well: e.g. `yae` etc.
