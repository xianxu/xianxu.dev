---
id: '000004'
status: done
started: 2026-09-19T16:58:34-07:00
created: 2026-09-19
updated: 2026-09-27
actual_hours: 11.75
---

# Collapse parley tool and thinking blocks at render

## Problem

Published parley transcripts carry lines that are *folded by default in nvim* because
they are data, not reader-facing prose: the reasoning line (`🧠:`), the summary line
(`📝:`), and the tool call / tool result blocks (`🔧:` / `📎:`, each followed by a
fenced code block). The blog renders them inline and fully expanded, so a transcript
post reads as a wall of machine bookkeeping between the human-interesting parts.

Present in the corpus today: 8 posts with `🧠:` lines, 10 with `📝:` lines. No `🔧:`/
`📎:` blocks are published yet, but parley emits them (`tests/fixtures/fold_tool_transcript.md`
in `../parley.nvim`) and they are the worst offenders when they land.
