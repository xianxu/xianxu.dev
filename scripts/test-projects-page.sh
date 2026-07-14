#!/usr/bin/env bash
set -euo pipefail

repo=${1:-.}
posts="$repo/src/data/post"
published="$posts/project-render-published-test.md"
older="$posts/project-render-older-test.md"
nonproject="$posts/project-render-nonproject-test.md"
draft="$posts/project-render-draft-test.md"

for fixture in "$published" "$older" "$nonproject" "$draft"; do
  if [[ -e "$fixture" ]]; then
    echo "Refusing to overwrite existing fixture path: $fixture" >&2
    exit 1
  fi
done

cleanup() {
  rm -f "$published" "$older" "$nonproject" "$draft"
}
trap cleanup EXIT

cat >"$published" <<'EOF'
---
title: Project render published test
publishDate: 2030-01-03
published: true
highlight: true
project:
  github: https://github.com/xianxu/project-render-test
---

Temporary project rendering fixture.
EOF

cat >"$older" <<'EOF'
---
title: Project render older test
publishDate: 2030-01-02
published: true
project:
  github: https://github.com/xianxu/project-render-older-test
---

Temporary older project rendering fixture.
EOF

cat >"$nonproject" <<'EOF'
---
title: Project render nonproject test
publishDate: 2030-01-01
published: true
---

Temporary non-project rendering fixture.
EOF

cat >"$draft" <<'EOF'
---
title: Project render draft test
publishDate: 2029-12-31
published: false
project:
  github: https://github.com/xianxu/project-render-draft-test
---

Temporary draft project rendering fixture.
EOF

(
  cd "$repo"
  npm run build
)

projects="$repo/dist/projects/index.html"
highlights="$repo/dist/highlights/index.html"

rg -q 'Project render published test' "$projects"
rg -q 'href="/2030/01/project-render-published-test"' "$projects"
rg -q 'href="https://github.com/xianxu/project-render-test" aria-label="View Project render published test on GitHub" rel="noopener noreferrer" target="_blank"' "$projects"

new_offset=$(rg --byte-offset -o 'Project render published test' "$projects" | head -n 1 | cut -d: -f1)
older_offset=$(rg --byte-offset -o 'Project render older test' "$projects" | head -n 1 | cut -d: -f1)
if ((new_offset >= older_offset)); then
  echo "Projects are not ordered newest first" >&2
  exit 1
fi

if rg -q 'Project render nonproject test|Project render draft test|project-render-draft-test' "$projects"; then
  echo "Projects page included a non-project or draft fixture" >&2
  exit 1
fi

rg -q 'Project render published test' "$highlights"
if rg -q 'https://github.com/xianxu/project-render-test' "$highlights"; then
  echo "Ordinary blog list exposed a project-only GitHub link" >&2
  exit 1
fi
