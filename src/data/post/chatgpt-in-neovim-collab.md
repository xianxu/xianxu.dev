---
title: Use ChatGPT to Learn and NeoVIM to Take Note
publishDate: 2025-04-24
published: true
excerpt: "Introducing Parley.nvim: a Neovim plugin that turns chatting with an LLM into a living, editable transcript. Trees of follow-up questions, annotations, and context compaction via assistant-summarized lines — built collaboratively with Claude Code."
tags:
  - tech
---
Introducing [Parley.nvim](https://github.com/xianxu/parley.nvim)[^disclaimer], the NeoVIM plugin I wrote with help from [Claude Code](https://docs.anthropic.com/en/docs/agents-and-tools/claude-code/overview)[^claude], that provides you with a live transcript of your talk with an LLM. 

I have been chatting with ChatGPT avidly ever since its inception. One big class of my chat is about learning new topics and domains. For example, you can think of understanding the Establishment Clause's contour, history, and current holdings[^legal_geek]. And as such, oftentimes, I'm not familiar with that domain, which means a couple of things: 

1. I often have many more questions after ChatGPT's initial answers. The chat can easily become a tree of questions, which is pretty hard to track in a chat window. 
2. I need to make notes to synthesize and learn from such sessions. This also means annotating, changing, or deleting anything in a chat session and potentially asking for additional advice and insights from ChatGPT after such a change. 
3. Wouldn't using VIM to navigate in a document be nice? 

One way to do it is to collaboratively construct a **transcript**, which I can update and annotate, to produce a curated FAQ of a topic/domain. Think of a living document that works with you, having access to your best sounding board. Welcome to the [Parley](https://github.com/xianxu/parley.nvim), which serves quite well for this purpose. Here's a description of the workflow. 

1. It's just a document organized with alternating questions and answers.
2. You ask questions in the 💬: line and the lines follow.
3. Assistant answers in the 🤖: line and the lines follow.
4. The assistant is instructed to "reason" and output one 🧠: line. This is just there to make the answer better. 
5. The assistant is also instructed to "summarize" and output one 📝: line. This is there so that later we can use it to describe earlier chats with a lot fewer tokens, essentially context compaction. 
6. The transcript has all states of the chat (well, the agent can be swapped, and referenced files can change), and is hermetic. 
7. In typical flow, you ask new questions at the end of a document, on the 💬: line.
8. You can edit any text to make it more precise. You can edit your questions, as well as the assistant's response. You can add styling. If you add `#` and `##` headings, they appear in the table of contents, along with each chat exchange. 
10. You can ask the assistant to answer your updated question again. In this mode, chat exchanges up to that question are used to construct context, leaving the rest untouched. The assistant's answer is used to update just the corresponding answer.

Still a WIP, but already very useful! Have a try! 

------

[^disclaimer]: Parley's forked from [ChatGPT in NeoVIM](/2025/04/chatgpt-in-neovim)
[^claude]: I talked about my early experience using Claude [here](/2025/03/claude-code)
[^legal_geek]: Right, I'm a legal geek, particularly around constitutional laws.
