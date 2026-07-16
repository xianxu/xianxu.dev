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
