---
description: Remove dead-weight features and verify the build still passes
---

# Prune

Remove a chunk of dead weight from this repo safely. The target is given as $ARGUMENTS (e.g. "flow", "mcp", "playgrounds").

## Procedure

1. **Map the blast radius first.** Grep for all imports/references to the target across `src/`, `docs/`, `package.json` scripts, `.storybook/`, and config. List every file that references it. Do not delete yet.

2. **Confirm the plan.** Show me the full list of files/dirs to remove and dependencies to drop from package.json. Wait for my OK.

3. **Remove** with `git rm -r` so it's tracked. Drop now-unused deps from package.json. Delete orphaned scripts and docs.

4. **Heal references.** Fix any remaining imports, story indexes, or README links pointing at removed code.

5. **Verify.** Run `npm install`, `npm run lint`, `npm run test`, `npm run build`, `npm run build-storybook`. Everything must pass. Report results.

6. **Commit** with a clear message: `chore: prune <target>`.

Never leave the repo in a broken state between steps. If verification fails, fix or roll back before reporting done.
