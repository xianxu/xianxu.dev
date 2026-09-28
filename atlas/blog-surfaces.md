# Blog surfaces

Posts are authored under `src/data/post/` and normalized through
`src/utils/blog.ts` for every listing and post route.

`/projects` is a discovery view over published posts carrying this optional
frontmatter:

```yaml
project:
  github: https://github.com/owner/repository
```

The nested object both marks membership and supplies the direct repository link.
`src/pages/projects.astro` selects those normalized posts, while the shared blog
list renders the GitHub link only when the Projects page opts into that context.
Ordinary blog lists therefore keep their existing presentation.

## Markdown render pipeline

Remark/rehype plugins in `src/utils/frontmatter.ts`, wired in `astro.config.ts`,
shape post markdown on the way to HTML: reading time, relative `.md` cross-links
resolved to permalinks, responsive tables, lazy images, heading/paragraph anchors
— and parley folds.

`parleyFoldsRemarkPlugin` collapses the apparatus lines a
[parley.nvim](https://github.com/xianxu/parley.nvim) transcript carries — `🧠:`
reasoning, `📝:` summary, `🔧:`/`📎:` tool call and result (each owning the fenced
block that follows) — into a native `<details>`, closed by default, styled in
`src/components/blog/SinglePost.astro`. Only a marker at the start of a top-level
paragraph folds, so posts *about* parley can name the markers in prose.

The prefixes and the summary wording are a **cross-repo contract**: they mirror
parley's `chat_memory.reasoning_prefix` / `chat_tool_use_prefix` config and its
`tool_folds.foldtext()`, so a fold reads the same on the page as in the editor.
Changing them in parley drifts this plugin. `npm run check:folds` asserts the
transform (`scripts/verify-parley-folds.mjs`); the same plugin, styles and script
live in the peer blog `../42shots/`.
