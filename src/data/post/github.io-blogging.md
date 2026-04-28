---
title: Blogging With GitHub Gages, From A Private Repository
publishDate: 2025-01-12
excerpt: "How to run a GitHub Pages blog from a private staging repo with a publish.sh script — drafts in private, posts in public, and an identity that's not trivially traceable back to you. A practical walk-through, not a manifesto."
tags:
  - tech
---

If you, like me, have decided that this is a good time to start blogging, the next question is where should you host it? There are many choices, like [Medium](https://medium.com/) or [Substack](https://substack.com/about). GitHub Pages is a good choice for something simple, that you have full control of, that uses the [Markdown](https://en.wikipedia.org/wiki/Markdown) format, and that you can easily quote code or write math formulas (like <span>$E=mc^2$</span>). The flip side is that you do need to be able to tinker to make this work well. The fact that you write in Markdown can also be both a feature and a bug. 

Here's how to use GitHub to manage multiple blogs with separate identities. I hope to get the tinkering part out of your way so you can focus on writing. By *you*, I also meant my future self.

## TL;DR

After following the instructions here, you will get:

* Free blog hosting service backed by GitHub Pages that supports the Markdown format, with good formatting support for `code` and <span>$math$</span>.
* Private repo where you can have your private unpublished drafts or other things. There is a folder representing all published posts, so when you are ready, copy the markdown file to that folder and run a script.
* You can manage multiple blogs with different identities this way, but share a single private where you tinker. The private repo aspect is important for me, as I often update my draft several times before it's ready to be published.

## 0/ Sketches of what we are doing

We want to create `1/` a private repo, where you can draft without prying eyes. `2/` a public repo to host your blog, from where GitHub manages hosting and publishing. And `3/` a script is used to publish the from your private repo to the public repo.

## 1/ Create a private repo for your private stuff

Nothing special, but if you are brand new, check out [GitHub's tutorial](https://docs.github.com/en/repositories/creating-and-managing-repositories/quickstart-for-repositories) on it.

## 2/ Create a public GitHub repo for your blog

Note that to keep your authorship private, you must pay attention to using a GitHub account that is not easily traceable to your real identity. See [4/ And One More Thing: Keep Things Private](#4-and-one-more-thing-keep-things-private) for more details.

After that, create a public repo with the name following some rules. For example, for the account `username`, if you use `username.github.io` as the repo name, then the blog, when online, can be accessed with `https://username.github.io`. Pretty neat.

A single account `username` can have multiple blogs. Just that a single can be addressed as `https://username.github.io`. The others: `https://username.github.io/reponame`. There's that.

Once you have your public repo set up, we will need to set up some bare-bone code and configurations that constitute your blog. The first step is to copy all the files from [xianxu/minima](https://github.com/xianxu/minima) to your public repo. Or you can just make a fork. You will then need to change the following:

1. Update `_config.yml` to your liking. Mostly, the blog's title and description and your contact information.
2. Update `_layout/base.html`, and replace `xianxu/minima` with the public repo hosting your blog. That HTML script block is used to enable comments via [utterances](https://utteranc.es). If you don't want comment functionality, you can remove that block and have a static blog.
3. Try updating posts in the `_posts` directory or writing your first post. There are two examples there.

After that, commit and push to GitHub. Your blog should show up in `https://username.github.io` soon. You can check the status of it by checking the Repo > Settings (top bar) > Pages (left bar in Settings). If successful, you should see a message like *"Your site is live at https://username.github.io"*.

Locally, you can take a preview of what it looks like. You can use any Markdown viewer to read the formatted Markdown file. I use `glow`. 

You can use `bundle exec jekyll serve` to start a static website locally so you can see the effect of your changes. Before that, you need to run `bundle install` to ensure necessary local dependencies are installed.

## 3/ Using a private repo as a staging area

OK, so by now, you have a blog website up. If you want to hide some part of the blog from the public, let's say during writing, you can pick any private repo and create a folder with the following structures.


```
blogs/
  username.github.io/
    publish.sh
    posts/
      2025-01-01-your-post.markdown
      ...
    draft/
  another_blog/
    ...
```

I hope the structure is self-explanatory. Basically, private repo is private, and we use a script to publish what's in `_posts`, to pre-configured (in the script) public GitHub destinations.

And the `publish.sh` looks like the following. It basically fetches the public repo and overrides the `_posts` folder with what's currently in the private repo's `\_post folder`. Easy enough! When I want to actually publish, I copy from the file from the `draft/` directory to the `_posts` directory in my private repo and run `./publish.sh`.

All you need to do is to replace `USERNAME` and `USEREMAIL`. Do read the script in full, though, and pay attention to what it is doing.

```sh
#!/bin/bash

# Set repo names
PUBLIC_REPO="git@github.com:USERNAME/USERNAME.github.io.git"
CLONE_DIR="blog_sync_temp"

# Remove any existing directory
rm -rf $CLONE_DIR

# Clone the public repo
git clone --depth=1 $PUBLIC_REPO $CLONE_DIR

# Copy only _posts/ from private repo
rsync -av --delete posts/ $CLONE_DIR/_posts/
rsync -av --delete images/ $CLONE_DIR/assets/images/
rsync -av --delete static/ $CLONE_DIR/assets/static/

# Commit and push changes
cd $CLONE_DIR

git config user.name "Xian Xu"               # use a secret name
git config user.email "xianxu@gmail.com"     # use a secret email

git add _posts/
git add assets/
git commit -m "Sync posts from remote land" || echo "Nothing to commit"
git push origin main

# Cleanup
cd ..
rm -rf $CLONE_DIR

echo "Sync complete!"
```

## 4/ And One More Thing: Keep Things Private

To really keep things private, you will need to make sure your identity used for your *secret* yet public blog is not traced back to your real identity or your private repo. At least not easily traceable. To do that, here is something to think about:

1. Use a new email address.
2. Use a new GitHub account.
3. Generate [PAT](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens), not using SSH to clone, as PAT token can be stored locally in your machine, yet SSH keys need to be uploaded to your public blog repo.
4. Check the publish.sh script to make sure it does not pick up from global git settings that might reveal your identity. 
