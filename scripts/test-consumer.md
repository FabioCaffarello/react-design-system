# External consumer validation

Manual procedure to validate that the design system package can be installed and consumed in a fresh project. Established in Phase 13d after discovering the library was broken externally since v1.0.0 — a cross-chunk `cva` reference failed at runtime in every consumer that imported a component from the main entry, and no test exercised the dist bundle from outside the repo. Internal validation (Storybook, smoke, library build's own validation script) all stayed green throughout.

## When to run

- Before merging any PR that touches `vite.config.ts`, `package.json` (`exports`/`files`/`main`/`module`/`types`/`style`), `src/ui/index.ts`, or the build output structure under `dist/`.
- When upgrading dependencies that participate in bundling (`@vitejs/plugin-react`, `tailwindcss`, `@tailwindcss/vite`, `class-variance-authority`, `clsx`, `tailwind-merge`).
- Periodically when no PR has triggered it — silent drift is the bug class this procedure catches.

## Procedure

Run from the repo root.

1. **Build the library**

   ```sh
   npm run build
   ```

   Confirm `dist/index.js`, `dist/index.cjs`, `dist/ui/index.d.ts` exist. Confirm `dist/react-design-system.css` exists (size depends on whether a styles entry is wired — Phase 13d leaves it at ~120 bytes; Phase 13e will populate it).

2. **Pack the tarball**

   ```sh
   npm pack
   ```

   Captures `fabio.caffarello-react-design-system-<version>.tgz` at the repo root.

3. **Create a fresh consumer outside the repo**

   ```sh
   rm -rf /tmp/rds-test-consumer
   mkdir -p /tmp/rds-test-consumer
   cd /tmp/rds-test-consumer
   npm create vite@latest . -- --template react-ts --yes
   npm install
   ```

4. **Install the tarball with an absolute path**

   ```sh
   npm install /absolute/path/to/fabio.caffarello-react-design-system-<version>.tgz
   ```

5. **Replace `src/App.tsx` with a minimal Button render**

   ```tsx
   import { Button } from "@fabio.caffarello/react-design-system";

   export default function App() {
     return (
       <div style={{ padding: 24, fontFamily: "system-ui" }}>
         <h1>RDS consumer test</h1>
         <Button variant="primary">Test Button</Button>
       </div>
     );
   }
   ```

   Do not install Tailwind in the consumer. The DS is responsible for whatever CSS it ships.

6. **Boot the consumer dev server**

   ```sh
   npm run dev
   ```

7. **Validate in the browser** (or programmatically via Playwright)
   - DevTools console: **zero** `TypeError`. The error class this procedure catches looks like `X is not a function` for some minified `X` — symptom of a cross-chunk reference that broke when the consumer's bundler reassembled the dist chunks.
   - `<h1>` text "RDS consumer test" appears (consumer compiled).
   - A `<button>` element exists in the DOM with text "Test Button".
   - Styling may or may not be present depending on the phase — Phase 13d ships JS only, Phase 13e onwards will also ship CSS. For Phase 13d, an unstyled `<button>` is the success state.

8. **Cleanup**
   ```sh
   rm -rf /tmp/rds-test-consumer
   rm -f fabio.caffarello-react-design-system-*.tgz
   ```

## Known good state (after Phase 13d)

- Build emits a single bundle: `dist/index.js` + `dist/index.cjs` (~277–464 KB).
- No `dist/primitives/`, `dist/components/`, `dist/tokens/`, `dist/providers/` subdirectories — sub-entries were removed because the multi-entry layout was what enabled the cross-chunk bug.
- `package.json` exports map narrowed to `"."` and `"./styles"`. Sub-entries removed.
- Consumer imports look like:
  ```tsx
  import { Button, Card, Form } from "@fabio.caffarello/react-design-system";
  // Phase 13e onwards:
  import "@fabio.caffarello/react-design-system/styles";
  ```
- External consumer test page renders without runtime errors.

## If validation fails

- `X is not a function` in the consumer console — a cross-chunk reference has re-emerged. Inspect `vite.config.ts build.lib`: it must be a single entry, not an object. Inspect `rollupOptions.output.manualChunks` — it should not exist; if it does, re-introducing it likely restored the bug.
- `Cannot find module "@fabio.caffarello/react-design-system/styles"` — `package.json` exports lost the `./styles` mapping, or `dist/react-design-system.css` was not emitted by the build.
- `Cannot find module "@fabio.caffarello/react-design-system"` — main entry is missing from exports, or the tarball wasn't installed.
- Consumer build (`vite build`) fails with TS error on the `/styles` import — TS needs a side-effect import declaration. This is a known follow-up tracked in the backlog; the dev-mode validation (this procedure) is unaffected.

## Methodology lesson

The class of bug this procedure exists for cannot be caught by `npm run storybook:smoke` or `npm run build:validate`. Both are internal — they exercise the source tree (Storybook) or the build's own export list (validator), not the dist bundle as a downstream consumer would see it. The procedure documented here is the first external-consumer test in the project's history. Phase 13d audit confirmed the bug it catches existed since v1.0.0; the gap was discovered when Phase 13c.7 (batteries-included CSS distribution) accidentally required the procedure to validate its scope.

Promotion path: this procedure is currently manual. A CI job that automates it (Playwright-driven render + assertion on console error count) is tracked in the backlog as the natural next step.
