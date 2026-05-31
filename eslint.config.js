// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
import storybook from "eslint-plugin-storybook";

import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";
import { defineConfig, globalIgnores } from "eslint/config";

import dsColor from "./eslint-rules/index.js";

export default defineConfig([
  globalIgnores(["dist", "storybook-static", "**/*.d.ts"]),
  {
    files: ["**/*.{ts,tsx}"],
    ignores: [
      ".storybook/**",
      "**/*.stories.{ts,tsx}",
      "**/*.test.{ts,tsx}",
      "vite.config.ts",
    ],
    extends: [
      js.configs.recommended,
      ...tseslint.configs.recommended,
      reactHooks.configs["recommended-latest"],
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      ds: dsColor,
    },
    rules: {
      // Design system: semantic color vocabulary enforcement.
      // See .claude/rules/colors.md for the canonical vocabulary and
      // the 9 role-choice principles (Phase 7). Principle 3 exceptions
      // require an inline `// exception: <reason>` comment near the
      // offending literal.
      "ds/no-raw-color-classes": "error",

      // TypeScript rules (non-type-aware for better performance)
      "@typescript-eslint/no-explicit-any": [
        "warn",
        {
          ignoreRestArgs: false,
          fixToUnknown: true,
        },
      ],
      "@typescript-eslint/no-unsafe-assignment": "off",
      "@typescript-eslint/no-unsafe-member-access": "off",
      "@typescript-eslint/no-unsafe-call": "off",
      "@typescript-eslint/no-unsafe-return": "off",
      "@typescript-eslint/explicit-module-boundary-types": "off",

      // Disallow console in production code (allow in stories and dev)
      "no-console": [
        "warn",
        {
          allow: ["warn", "error"],
        },
      ],

      // Code quality
      "no-unused-vars": "off", // Use TypeScript version
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
        },
      ],
      "prefer-const": "error",
      "no-var": "error",

      // React best practices
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
      "react-refresh/only-export-components": [
        "warn",
        {
          allowConstantExport: true,
        },
      ],
    },
  },
  {
    // More lenient rules for stories and tests.
    //
    // ds/no-raw-color-classes IS applied to *.stories.tsx (cadeado on),
    // wired in the story-discipline block below — see comments there.
    // Tests remain exempt: raw color in *.test.tsx is acceptable for
    // assertion fixtures and unlikely to leak into rendered UI.
    files: ["**/*.stories.{ts,tsx}", "**/*.test.{ts,tsx}"],
    extends: [
      js.configs.recommended,
      ...tseslint.configs.recommended,
      reactHooks.configs["recommended-latest"],
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: { ...globals.browser, ...globals.node },
    },
    plugins: {
      storybook,
    },
    rules: {
      ...storybook.configs.recommended.rules,
      "no-console": "off",
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-unsafe-assignment": "off",
      "@typescript-eslint/no-unsafe-member-access": "off",
      "@typescript-eslint/no-unsafe-call": "off",
      "@typescript-eslint/no-unsafe-return": "off",
      "@typescript-eslint/explicit-module-boundary-types": "off",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
        },
      ],
      // Allow hooks in render functions (Storybook pattern)
      "react-hooks/rules-of-hooks": "off",
    },
  },
  {
    // Storybook config files - no type checking
    files: [".storybook/**/*.{ts,tsx}", "vite.config.ts"],
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.node,
    },
    rules: {
      "@typescript-eslint/no-unsafe-assignment": "off",
      "@typescript-eslint/no-unsafe-member-access": "off",
      "@typescript-eslint/no-unsafe-call": "off",
      "@typescript-eslint/no-unsafe-return": "off",
      "@typescript-eslint/explicit-module-boundary-types": "off",
      "@typescript-eslint/no-explicit-any": "warn",
    },
  },
  {
    // Story metadata discipline — enforces Storybook 10 import paths and
    // the four-segment title allowlist from .claude/rules/stories.md.
    // Scoped to `.stories.tsx` only; `.mdx` is NOT covered here. The
    // .mdx surface today is four stable infrastructure pages (Introduction,
    // ComponentStatus, Tokens, ComponentComposition) all with valid
    // "Design System/..." titles — they document the design system itself,
    // have no .stories.tsx counterpart, and won't migrate to attached
    // <Meta of={...}>. Scope is stable, not shrinking. Adding
    // eslint-plugin-mdx for four stable pages is bad ROI; the residual
    // grep in .claude/rules/stories.md covers .mdx for sweeps.
    files: ["**/*.stories.{ts,tsx}"],
    plugins: {
      ds: dsColor,
    },
    rules: {
      "ds/story-discipline": "error",
      // Cadeado: stories now under the same semantic-vocabulary rule as
      // shipped component source. Triagem por papel (Phase 7) was
      // completed in PR ${??} — every raw Tailwind color across the 56
      // story files was either kept (genuine status / brand / decoration
      // -> documented via Principle 3 exception comment) or substituted
      // semantically. Re-enabling the rule here cristaliza the discipline:
      // future regressions back to raw color must either use the
      // Principle-3 escape valve or be substituted by token role.
      //
      // The rule's exception-comment shapes (// exception: ...,
      // // micro-z: ..., // <class>: ...) work identically in stories
      // as they do in component source — see .claude/rules/colors.md.
      "ds/no-raw-color-classes": "error",
    },
  },
  {
    // TokenVisualizations renders primitive color tokens by design
    // (meta-documentation: the file IS the catalogue of the primitive
    // scale that everything else avoids). Exempt from the semantic
    // vocabulary rule. If the token-system docs are ever rewritten,
    // revisit (see BACKLOG).
    files: ["src/ui/tokens/TokenVisualizations.tsx"],
    rules: {
      "ds/no-raw-color-classes": "off",
    },
  },
  {
    // Scripts - allow console.log for debugging and output
    files: ["scripts/**/*.{ts,js}"],
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.node,
    },
    rules: {
      "no-console": "off", // Allow all console methods in scripts
      "@typescript-eslint/no-require-imports": "off", // Allow require() in scripts
      "@typescript-eslint/no-unsafe-assignment": "off",
      "@typescript-eslint/no-unsafe-member-access": "off",
      "@typescript-eslint/no-unsafe-call": "off",
      "@typescript-eslint/no-unsafe-return": "off",
      "@typescript-eslint/explicit-module-boundary-types": "off",
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
        },
      ],
    },
  },
]);
