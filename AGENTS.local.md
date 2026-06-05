# Local Extensions

## Repo-specific rules

<!-- Add repo-specific workflow rules, conventions, or overrides here. -->
<!-- This file is referenced by AGENTS.md via @AGENTS.local.md -->

- **Reviewing/editing posts (`src/data/post/*.md`):** route through the `xx-fix` skill protocol rather than hand-authoring markers. Write review findings and proposed edits as inline `🤖` markers (per `workshop/targets/review-convention.md`), and apply existing markers via `/xx-fix <path>`. This is the default for these prose files — don't rewrite unmarked text; the operator accepts/rejects each marker.
