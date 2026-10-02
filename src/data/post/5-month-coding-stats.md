---
title: Five Months of Coding, in Numbers
publishDate: 2026-10-01
published: true
excerpt: "A count of code, documents, issues, and commit activity across 15 repositories in my AI coding workflow, from April 20 to October 1, 2026."
tags:
  - tech
  - ai
---

I asked my coding agent to count what is in my repositories: code by language, Markdown documents by purpose, issues opened and closed, and lines changed since April 20. Here are the results.

The period is April 20 through October 1, 2026: 165 calendar days, or about five and a half months. The inventory covers 15 repositories that use my Ariadne layout. It excludes personal capture repositories, third-party clones, packaging repositories, and duplicate worktrees.

The current snapshot contains **914,206 lines of code in 4,395 files**, and **1,175,758 lines of Markdown in 4,042 files**. The issue trackers contain **1,228 issues**, of which **852 are done**, **306 remain open or active**, and **70 are marked punt or wontfix**.

These numbers describe the repositories and their recorded activity. The current inventory includes work from before April 20; the change counts below are limited to the five-month period. Lines of code also include tests, comments, and blank lines.

## Code

Go accounts for most of the source, followed by Lua and Python. The largest repositories by source size are Pair, Parley, and Ariadne.

| Language | Files | Lines |
| --- | --- | --- |
| Go | 2,668 | 565,496 |
| Lua | 799 | 193,508 |
| Python | 468 | 107,848 |
| Shell | 215 | 20,923 |
| HTML | 15 | 9,204 |
| Astro | 141 | 8,040 |
| TypeScript | 27 | 3,833 |
| Make | 32 | 2,840 |
| JavaScript | 15 | 1,249 |
| CUE | 9 | 829 |
| CSS | 2 | 235 |
| Vimscript | 1 | 122 |
| Ruby | 1 | 45 |
| Dockerfile | 2 | 34 |

The per-repository breakdown is below. Small repositories with only a Makefile are included; adopting the layout does not mean a project has substantial implementation yet.

| Repository | Code files | Code lines | Lines by language |
| --- | --- | --- | --- |
| 42shots | 92 | 6,198 | Astro 3,874; TypeScript 1,836; JavaScript 229; CSS 114; Shell 98; Dockerfile 17; Make 16; HTML 14 |
| ariadne | 732 | 141,620 | Go 126,701; Shell 5,619; Python 5,138; Make 1,352; HTML 1,329; CUE 684; JavaScript 594; TypeScript 158; Ruby 45 |
| astro | 1 | 14 | Make 14 |
| ducks | 1 | 10 | Make 10 |
| kaggle | 35 | 3,359 | Go 3,297; Make 36; Shell 26 |
| kbench | 392 | 99,748 | Python 93,998; HTML 5,681; Shell 55; Make 14 |
| metis | 147 | 26,725 | Go 23,042; Python 3,383; CUE 145; Shell 132; Make 23 |
| nous | 327 | 68,020 | Go 63,892; Shell 3,547; Make 488; Python 93 |
| pair | 1,396 | 273,975 | Go 248,546; Lua 15,711; Shell 8,028; Python 1,128; Make 489; JavaScript 73 |
| parley.nvim | 775 | 184,759 | Lua 177,797; Python 3,778; Shell 1,992; HTML 646; Make 300; JavaScript 124; Vimscript 122 |
| parli | 1 | 14 | Make 14 |
| robotics | 2 | 16 | Make 16 |
| tools | 382 | 100,615 | Go 100,018; Shell 433; Python 135; Make 29 |
| xianxu.dev | 97 | 8,215 | Astro 4,166; TypeScript 1,839; HTML 1,534; JavaScript 229; Python 195; CSS 121; Shell 98; Dockerfile 17; Make 16 |
| you-decide | 15 | 918 | Shell 895; Make 23 |

## Documents

There is more Markdown than code in this snapshot. Issue files and plans account for 393,550 lines. The remaining 782,208 lines include documentation, skills, review reports, evidence, and research records. This is a broad record of development work; it should not be read as a count of documentation written for end users.

Each cell below shows **files / lines**. Completed issue documents and archived plans are included.

| Repository | Issue documents | Plans | Other Markdown |
| --- | --- | --- | --- |
| 42shots | 0 / 0 | 0 / 0 | 5 / 363 |
| ariadne | 278 / 46,008 | 80 / 32,326 | 402 / 114,959 |
| astro | 0 / 0 | 0 / 0 | 14 / 1,247 |
| ducks | 11 / 536 | 0 / 0 | 2 / 145 |
| kaggle | 10 / 981 | 2 / 635 | 12 / 1,007 |
| kbench | 28 / 4,500 | 25 / 7,451 | 495 / 71,762 |
| metis | 69 / 8,568 | 36 / 8,935 | 103 / 34,546 |
| nous | 53 / 8,837 | 8 / 3,772 | 39 / 5,461 |
| pair | 374 / 72,348 | 114 / 57,721 | 473 / 185,446 |
| parley.nvim | 311 / 49,532 | 75 / 42,051 | 430 / 242,855 |
| parli | 0 / 0 | 0 / 0 | 18 / 1,224 |
| robotics | 0 / 0 | 0 / 0 | 2 / 6 |
| tools | 82 / 22,903 | 46 / 24,560 | 208 / 95,851 |
| xianxu.dev | 4 / 407 | 1 / 171 | 71 / 14,768 |
| you-decide | 14 / 1,308 | 0 / 0 | 147 / 12,568 |
| Total | 1,234 / 215,928 | 387 / 177,622 | 2,421 / 782,208 |

Here, “plans” means canonical workshop files named `*-plan.md`. Reviews and evidence stored beside plans are counted as other Markdown. Noncanonical planning documents can also fall into that category.

## Issues

The issue counts come from unique IDs in the authoritative issue trackers, rather than the number of Markdown files. That is why the issue totals differ from the document counts above.

“Still open” includes issues being worked on, blocked issues, and code-complete issues that have not been closed. I have kept punt and wontfix separate from done: they are terminal tracker states, but they do not represent completed implementation.

| Repository | Total issues | Created since Apr 20 | Still open | Done | Punt / wontfix |
| --- | --- | --- | --- | --- | --- |
| 42shots | 0 | 0 | 0 | 0 | 0 |
| ariadne | 276 | 273 | 59 | 199 | 18 |
| astro | 0 | 0 | 0 | 0 | 0 |
| ducks | 11 | 11 | 11 | 0 | 0 |
| kaggle | 10 | 10 | 5 | 5 | 0 |
| kbench | 28 | 28 | 5 | 21 | 2 |
| metis | 69 | 69 | 15 | 53 | 1 |
| nous | 53 | 53 | 16 | 36 | 1 |
| pair | 373 | 370 | 115 | 232 | 26 |
| parley.nvim | 308 | 200 | 45 | 241 | 22 |
| parli | 0 | 0 | 0 | 0 | 0 |
| robotics | 0 | 0 | 0 | 0 | 0 |
| tools | 82 | 82 | 23 | 59 | 0 |
| xianxu.dev | 4 | 4 | 2 | 2 | 0 |
| you-decide | 14 | 14 | 10 | 4 | 0 |
| Total | 1,228 | 1,114 | 306 | 852 | 70 |

The trackers retain 1,228 unique IDs; this is not a reconstruction of any records that may have been deleted or migrated away. Five issues lack creation dates, so 1,114 is a lower bound for issues created during the period.

Of the issues known to have been created since April 20, 754 are now done. The tracker cards do not contain explicit closure dates, so this measurement does not establish how many issues were closed during the period.

## Commit activity since April 20

There were **13,380 non-merge commits** reachable from the inspected mainline snapshots during the period. Across the counted source files, those commits added **1,097,761 lines** and deleted **240,268 lines**. Markdown added **1,523,445 lines** and deleted **378,384 lines**.

The table shows additions and deletions separately. Rewriting the same file repeatedly contributes to both; these are activity counts, not a measure of useful output.

| Repository | Commits | Code lines | Markdown lines |
| --- | --- | --- | --- |
| 42shots | 30 | +9,371 / −3,173 | +1,243 / −880 |
| ariadne | 2,675 | +169,550 / −30,402 | +240,378 / −56,568 |
| astro | 6 | +14 / −0 | +1,262 / −15 |
| ducks | 15 | +10 / −0 | +714 / −33 |
| kaggle | 69 | +3,856 / −497 | +2,803 / −180 |
| kbench | 1,173 | +107,960 / −8,212 | +89,373 / −5,660 |
| metis | 722 | +32,035 / −5,310 | +54,951 / −2,902 |
| nous | 510 | +94,326 / −26,306 | +43,665 / −25,595 |
| pair | 4,086 | +371,390 / −97,234 | +495,707 / −177,419 |
| parley.nvim | 2,527 | +183,664 / −53,314 | +398,057 / −88,416 |
| parli | 7 | +18 / −4 | +1,382 / −158 |
| robotics | 6 | +16 / −0 | +17 / −11 |
| tools | 1,160 | +115,988 / −15,386 | +161,221 / −17,097 |
| xianxu.dev | 203 | +8,507 / −292 | +16,391 / −1,045 |
| you-decide | 191 | +1,056 / −138 | +16,281 / −2,405 |
| Total | 13,380 | +1,097,761 / −240,268 | +1,523,445 / −378,384 |

The Markdown changes break down as follows:

| Category | Added lines | Deleted lines |
| --- | --- | --- |
| Issues | 261,728 | 24,294 |
| Plans | 207,264 | 33,892 |
| Other | 1,054,453 | 320,198 |

Spread across 165 calendar days, the averages are about **568 commits per week**, **56,765 code lines changed per week**, and **80,684 Markdown lines changed per week**. “Changed” here is additions plus deletions. These averages include inactive days and do not measure hours worked.

## How the count was made

The measurement used locally cached `origin/main` snapshots for files and commit history, and `origin/issue-tracker` for issue status. It did not fetch remotes, and it excluded uncommitted changes and work that had not reached the inspected mainline. The two branches are separate snapshots, so an issue card and its mainline document need not be at exactly the same stage.

The file count includes regular tracked source and Markdown files. Symlinks, submodules, vendored dependencies, inherited seed copies, and identified generated source copies were excluded. Notebook JSON, configuration files, lockfiles, and data files were not counted as source code.

The dependency exclusions also apply to historical changes. This matters: some dependencies were once tracked and later removed. Counting those removals would inflate the activity figures. In Kbench, the audit excluded 118,782 lines of copied public ARC game environments, along with generated solver snapshots, while retaining Markdown experiment records. Pair's vendored terminal library was excluded too, including local patches within that dependency.

Line counts are physical lines, including comments and blanks, rather than executable statements. Commit churn counts non-merge commits reachable from mainline in the date range. It excludes changes made only while resolving merges and excludes edits on the separate issue-tracker branch. Renames count changed lines, rather than treating an unchanged file move as a full deletion and addition.

The large amount of Markdown is consistent with keeping issues, plans, reviews, and workflow records in the repositories. Its volume does not establish whether those records are useful. The same limitation applies to the source and commit counts: they give me a baseline for the scale and activity of this workflow, but judging the software still requires using it.
