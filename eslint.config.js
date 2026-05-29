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
    // Note: ds/no-raw-color-classes is intentionally NOT applied here.
    // *.stories.tsx files currently carry ~586 raw color uses, a mix of
    // intentional palette demos and legacy lazy color. A dedicated triage
    // phase (see BACKLOG) will decide per-story; until then the rule
    // stays scoped to shipped component source (src/ui/**/*.tsx).
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
