#!/usr/bin/env bash
#
# format-touched.sh — scoped Prettier runner for the Claude Code PostToolUse hook.
#
# Why this lives in a script (not inline in settings.json):
#   passing an empty arg to `prettier --write` makes Prettier walk the entire
#   project and reformat everything. The earlier inline hook fell into that
#   trap whenever $CLAUDE_FILE_PATHS was unset or empty — scoped to touched
#   files, passing empty paths to prettier triggers a full-tree reformat.
#
#   This script reads the hook payload (JSON on stdin), pulls only the
#   file(s) the tool actually touched, and runs Prettier on each one if it
#   exists on disk. Any error path is a no-op — the hook must never trigger
#   a tree-wide reformat.
#
# Input:  JSON on stdin (Claude Code hook payload, shape:
#         {"tool_input": {"file_path": "..."}}
#         or {"tool_input": {"file_paths": ["...", "..."]}} for future
#         array-shaped matchers)
# Output: silent on success, errors swallowed
# Exit:   always 0 — the hook is best-effort cosmetic, must never fail tooling

set -euo pipefail

# Extract paths from the JSON payload via Node (already a dependency because
# Prettier needs it). Emits one path per line; empty / malformed input emits
# nothing. The trailing `|| true` keeps the subshell exit at 0 even if Node
# bails — preserving the no-op contract.
paths="$(node -e '
let data = "";
process.stdin.on("data", (chunk) => { data += chunk; });
process.stdin.on("end", () => {
  try {
    const payload = JSON.parse(data);
    const input = payload.tool_input || {};
    const list = Array.isArray(input.file_paths)
      ? input.file_paths
      : (input.file_path ? [input.file_path] : []);
    for (const p of list) {
      if (typeof p === "string" && p.length > 0) {
        process.stdout.write(p + "\n");
      }
    }
  } catch (e) {
    // swallow parse errors — hook must no-op
  }
});
' 2>/dev/null || true)"

if [ -z "$paths" ]; then
  exit 0
fi

# Iterate line-by-line so paths with spaces / special chars stay intact.
# Each Prettier call is best-effort: if the file vanished mid-flight or
# Prettier rejects it, we move on. We never expand globs and never recurse
# into a directory — the path must already point at an existing regular file.
#
# .mdx files are skipped entirely. Prettier 3.x has no MDX parser and the
# markdown parser mangles top-level JSX (escapes `*` inside `{/* */}` as
# markdown emphasis). .prettierignore also excludes *.mdx — this extension
# guard is a belt-and-suspenders so the hook stays safe even if the
# .prettierignore entry is moved or rewritten.
while IFS= read -r file; do
  if [ -n "$file" ] && [ -f "$file" ]; then
    case "$file" in
      *.mdx) continue ;;
    esac
    npx prettier --write -- "$file" >/dev/null 2>&1 || true
  fi
done <<< "$paths"

exit 0
