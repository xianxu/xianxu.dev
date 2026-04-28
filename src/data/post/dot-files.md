---
title: Dot Files and Mac Setup
publishDate: 2025-01-04
published: true
excerpt: "A new-Mac setup checklist for the terminal-and-Neovim crowd: Ghostty, zsh, Oh My Zsh, yadm for dotfiles, Homebrew bundles, and the AI tools (Claude Code, Codex, Gemini CLI) now sitting alongside the classics."
tags:
  - tech
---
Being old-fashioned, I always want simplicity and speed. That's why I use the terminal and NeoVIM. Here's my setup on Mac. The key is I want to keep this deadly simple, thus when there's an OK default, I would use that instead of heavily customization. The biggest change over the years is the "defaults" are getting extremely well (`Oh-My-Zsh` and `Lazyvim` etc.), and the inclusion of AI-based tools, like Claude Code and ChatGPT.

## How to Set Up a New Mac

1. Mac desktop basics:
    1. Dock to the left, hide
    2. Allow whole-screen zoom in Accessibility (for eyesight of an old man, I use ctrl+scroll)
    3. Customize modifier key, CAPS LOCK -> ESC (for vim)
    4. Adjust trackpad scroll speed
    5. Install Alfred, point settings sync to ~/settings (I put settings here so I can easily `yadm` later)
        1. Alfred is a much nicer command switcher, including 1) multiple clipboard history, 2) global hotkey, 3) snippets (e.g. easy access to `¯\_(ツ)_/¯`)
        2. Unbind Cmd+Space from Spotlight to Alfred.
    6. Set screenshot to iCloud location.
    ```
        1. defaults write com.apple.screencapture location "$HOME/Library/Mobile Documents/com~apple~CloudDocs/screenshots"
        2. killall SystemUIServer
    ```
    7. TODO: more
2. Set up the terminal
    1. Use `zsh`. 
    2. Install [Gostty](https://ghostty.org/), which is much clearer/faster than `iTerm2`. `iTerm2` still wins with server side tmux integration, but nowadays I do things on my Mac more.
    2. Or install [iTerm2](https://iterm2.com/), tried and great.
        1. Set it to load from a custom folder in: `Preferences> General > Settings`. We will recover settings later in `yadm`. It's OK for now. 
    3. Install [Oh My Zsh](https://ohmyz.sh/), with command: `sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"`
        1. `Oh My Zsh` provides out of box great defaults for `zsh` users.
        2. Additional `zsh` plugins: 
            1. `git clone https://github.com/Aloxaf/fzf-tab ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/fzf-tab`
            2. `git clone https://github.com/zsh-users/zsh-autosuggestions ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-autosuggestions`
            3. `git clone https://github.com/zdharma-continuum/fast-syntax-highlighting.git ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/fast-syntax-highlighting`
    4. Get a new font, I use [DejaVuSansM Nerd Font](https://www.nerdfonts.com/font-downloads), direct [link](https://github.com/ryanoasis/nerd-fonts/releases/download/v3.4.0/DejaVuSansMono.zip). If you are using `Ghostty`, built-in font is already good enough, so no need to install this.
3. Set up `SSH` and access to `Github`
    1. Assuming you don't have the keys: `ls ~/.ssh/id\_\*`, use `ssh-keygen -t ed25519 -C "your-email@example.com"` to generate, and set up a passphrase to protect it.
    2. Create ssh config file `~/.ssh/config` with the following content. This instructs ssh-add to use keychain.
    ```
    Host \*
    UseKeychain yes
    AddKeysToAgent yes
    IdentityFile ~/.ssh/id\_ed25519
    ```
    1. Add to key to keychain so you don't need to keep input that passphrase: `ssh-add --apple-use-keychain ~/.ssh/id\_ed25519`
    2. Copy your **public key** to [Github](https://github.com/settings/keys) `pbcopy < ~/.ssh/id_ed25519.pub`. Add a new SSH key there.
    3. Test setup with `ssh -T git@github.com`
4. Install `yadm` to recover settings
    1. Install [Homebrew](https://brew.sh/), which downloads Xcode Command Line Tools. Command: `/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"`
    2. Recover install brews, e.g. `brew bundle --file=~/settings/brewfile`
        1. Or install yadm `brew install yadm` directly.
        2. the command to dump brewfile is `brew bundle dump --file=~/settings/brewfile --describe`
    3. Get your configuration from you github repo, mine: `yadm clone git@github.com:xianxu/dotfiles.git`
    4. Use `yadm status` and check out what the differences are. It's great to always have a sane default.
    5. TODO
5. Set up the terminal-based development environment. 
    1. Get neovim: `brew install neovim`
    2. Get Node.js `brew install node`
    3. Get Amazon Q `brew install amazon-q`
    4. Get Claude Code `npm install -g @anthropic-ai/claude-code`
    5. Get OpenAI Codex `npm install -g @openai/codex`
    6. Get Gemini CLI `npm install -g @google/gemini-cli`
    7. Or just use `brew bundle --file=~/settings/Brewfile` to recover brew state.
6. Install other Mac Apps
    1. `ChatGPT`, `Chrome`, `Edge`, `VimR`, `WhatsApp`, `Grammerly`, `Zettlr`
    2. Chrome plugins: `Grammarly`, `Save Pinned Tabs`, `Quick Tab Switch`, `Video DownloadHelper`.
    3. Safari plugins: `Grammarly` (Spelling and syntax check everywhere), `TabBack` (Jump back and forth between two most recently used tabs, similar to Chrome's Switch between recent tabs (MRU tabs switch, and I bind to same key `option+q`). 
    4. Some small utilities: `Horo` (timer), `Quick View Calendar` for dates, `Magnet` for window control.
7. Other settings
    1. Some shortcuts from ~ to usual locations
    2. Keychain access of API keys, often for AI related things
    3. Set up git user name: `git config --global --edit`

## yadm

I started to use yadm to keep dotfiles in sync. yadm wraps around git and creates the illusion that some files and directories under `$HOME` are source controlled. Otherwise, it behaves just like `git`.

1. `brew install yadm`
2. `yadm clone ...` to clone your dotfiles repo. Or check [yadm manual](https://yadm.io/docs/getting_started) on how to initiate a repo from yadm. I'd suggest having a separate private GitHub repo to track your configuration files.
3. In the ideal case, that's all you need to do; you have recovered all the configuration files tracked by `yadm`!
4. To track a new file, it's simply something like: `yadm add ~/.zshrc`. You use `yadm status` to check what's changed. And `yadm commit; yadm push` to commit and push your changes to your repo on GitHub. It basically behaves the same as `git` command.
5. Some additional files I track:
  1. Generate homebrew bundle file with `brew bundle dump --describe --file=~/.brewfile`. Recover on new host with `brew bundle --file=~/.brewfile`
  2. ~/.crontab file contains periodical thing I run on a host. Recover on new host with `crontab ~/.crontab`
  3. `Alfred` preference files in `~/Alfred.alfredpreferences/`

## Software Shortlist on Mac

* Install [iTerm2](https://iterm2.com), which is vastly better than Terminal.app, especially if you need to connect to remote servers. Even just for local use, it's pretty good.
* Install [Ghostty](https://ghostty.org/), with is much clearer/faster than `iTerm2`, with less features as it's pretty new. For example, there's no native integration with tmux on remote servers, meaning you can't map remote tmux operations to local window operations. But if you mainly use local terminal, it is already a good enough replacement of iTerm2. Example configurations: 
```
font-family = DejaVuSansM Nerd Font Mono
font-size = 15
theme = Apple System Colors
quick-terminal-position = bottom
focus-follows-mouse = true

keybind = cmd+left=previous_tab
keybind = cmd+right=next_tab
keybind = cmd+shift+left=move_tab:-1
keybind = cmd+shift+right=move_tab:+1
keybind = cmd+c=copy_to_clipboard
keybind = cmd+v=paste_from_clipboard
keybind = cmd+i=write_screen_file:paste
keybind = cmd+d=new_split:right
keybind = cmd+shift+d=new_split:down
keybind = cmd+shift+enter=toggle_split_zoom
keybind = cmd+shift+equal=equalize_splits
copy-on-select = clipboard

keybind = ctrl+h=goto_split:left
keybind = ctrl+j=goto_split:bottom
keybind = ctrl+k=goto_split:top
keybind = ctrl+l=goto_split:right
keybind = shift+enter=text:\n

macos-titlebar-style = tabs
link-url = true 
```
* Install [Alfred](https://www.alfredapp.com). I use the `1/` multi clipboard, `2/` global hot keys, and `3/` snippets (e.g. having quick access to ASCII art like `¯\_(ツ)_/¯`, for example).
* Use `zsh`, a modern shell.
* Use [Oh My Zsh](https://ohmyz.sh/) to customize your `zsh`. It adds all the cool bars and fonts here and there, and also much better command completion. It does all those largely out of the box.
* Install [HomeBrew](https://brew.sh/), which makes installing software on Mac much easier. e.g. `rg`, `ack`, `nvim`, etc.
* You will need some fonts to display some weird Unicode codepoints. I use nerd fonts, in particular, `DejaVuSansMNerdFontPropo-Regular.ttf`.
* Some small utilities: `Horo` (timer), `Quick View Calendar` for dates, `Magnet` for window control. 

