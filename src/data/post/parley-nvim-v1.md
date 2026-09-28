---
title: "Parley: A durable AI Interface for Learning"
publishDate: 2026-09-11
published: false
excerpt: "AI is a great helper to help you access world's knowledge. However, the current Chatbot user interface makes research and learning harder. Have you ever 🤖<feel innudated>{felt inundated} with too much information? Parley is different, you have full control of the chat, it's just a text file you can edit."
tags:
  - tech
  - ai
---

Previously, I introduced you to [Parley.nvim](chatgpt-in-neovim-collab.md), a Neovim plugin. Now it's a lot more polished and easy to install: introducing **Parley** the app. 

What 🤖<is exactly>{exactly is} Parley? It is a research tool that 🤖<help>{helps} you learn a topic, leveraging AI. It encourages free form discussion, and 🤖<provide you with tools to find way around the many threads of digression a learner inevitable would take>{provides you with tools to find your way around the many threads of digression a learner inevitably takes}. To explain how it works, let's think about what AI is good at, and how 🤖<human learns>{humans learn}.

AI has the world's knowledge. It is an encyclopedia that has a natural language interface, that 🤖<understand>{understands} the context of a particular conversation. It is your ultimate librarian and professor, depending on how you use it. All you need to do is to ask the right question. 

On the other hand, human learning is less about 🤖<facts, but>{facts than} about constructing a consistent mental model about a domain. And in order to actually learn, 🤖<human needs repetition, which typically means review materials>{humans need repetition, which typically means reviewing material} more than once. That's why we make notes in textbooks, make flash cards, 🤖<take quizzes, etc..>{take quizzes, etc.} Here's the dilemma: Have you ever 🤖<being inundated with long winding and super comprehensive>{been inundated with long-winded, super-comprehensive} AI answers? Have you ever gone back to your ChatGPT conversation and read them again, with new questions to ask in the middle of that conversation? The ChatGPT user experience is good for entertainment, weak for actual learning. 🤖{Study Mode and Claude's Learning mode are the reply you'll get — both do tailor explanations, so a reader can dispute this as written. Your real argument is about the interface (append-only, can't edit or prune, can't re-enter the middle), not the model. Narrow the sentence to that?}

Parley 🤖<comes in providing>{provides} a simple and consistent way to help you get oriented in the sea of 🤖<AI generated>{AI-generated} text: you chat with the AI, have full control of the transcript, make notes in the same file, jump through notes you took, cut off bloated AI answers to focus on the gist, so that you can review them later. If chatting with ChatGPT is printing a customized 🤖<text book>{textbook} that no one's going to read 🤖<again;>{again,} talking to AI in Parley is making notes talking with your professor. You don't need another 🤖<text book>{textbook}, with AI, it's just one ask 🤖<a way>{away}. 🤖~The key is to not get lost in the full volume of information.~

If 🤖<you find those potentially useful, you may find Parley a useful tool. Read>{that sounds useful, read} on. 

The key distinctions of Parley from typical chatbot:

1. A durable transcript presented just as a markdown file, with easy to understand convention: you ask 🤖<question>{questions} after 💬:, and AI replies after 🤖:. Having a durable 🤖<script>{transcript} in a file allows you to use all the power of 🤖<NeoVim>{Neovim}, to search, organize, change text. Yes, you can, and should, change AI's answers as well.
2. Chat files are linked and organized into a tree, mapping to how 🤖<human>{humans} tend to ask questions. When you have questions about AI's response, you can easily fork off a thread to ask about it, without losing track of the main thread. A single 🤖<key stroke>{keystroke} shows you the overall map of the conversation across many notes in the 🤖<spawning tree>{tree} of chat files.
3. You make notes in 🤖<chat files itself>{the chat files themselves}. Those are your notes to remind you of your learning. You create annotations that appear in the outline of a group of chat files, to help you construct a mental model. 🤖{paragraph 4 promises repetition and review, but nothing in this list covers coming back months later — chat finder, or asking the AI to search your past chats. Own item, or folded in here?}
4. If 🤖<AI generate too much details>{the AI generates too much detail}, shortcut keystroke `dae` clears that entity 🤖{worth a clause that `ae` is Parley's own text object, not stock vim — it composes with `y`/`c`/`v` and dot-repeat. It's also the first raw vim keystroke in the post; does a non-vim reader need a word of orientation?}, be it a paragraph, a section, or entire answer. This helps 🤖<cutting>{cut} down bloated AI answers to what you are interested in learning at that moment. Don't worry about the trimming, AI is the textbook sitting right there. 
5. Parley works across different AI with the help of `cliproxyapi`. Parley 🤖<talk>{talks} to all major AI providers, utilizing the subscription plan you already have with them. 

How does it work? One video is worth 🤖<thousand>{a thousand} words. 

TODO: video

🤖<Highlight>{Highlights} from the video

1. Create a new chat and ask a question. 
2. Fork off a chat. 
3. Check definitions of some phrase. 🤖{vaguer than the other four — and no highlight yet shows going back into an old conversation to ask a question in the middle of it, which is the claim from paragraph 4 and the thing ChatGPT structurally can't do}
4. Make some notes, annotations. 
5. One key to see the whole chat tree.

🤖{still missing, from our earlier list: where the name came from, the `brew install xianxu/parley/parley` line, and an honest "what Parley isn't" — not a notes app, not an agent — with the vim wall stated plainly rather than discovered}
