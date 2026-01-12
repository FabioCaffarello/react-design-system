// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
import storybook from "eslint-plugin-storybook";

import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";
import { defineConfig, globalIgnores } from "eslint/config";

export default defineConfig([
  globalIgnores(["dist", "storybook-static"]),
  {
    files: ["**/*.{ts,tsx}"],
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
    rules: {
      // TypeScript strict rules
      "@typescript-eslint/no-explicit-any": ["error", { 
        ignoreRestArgs: false,
        fixToUnknown: true,
      }],
      "@typescript-eslint/no-unsafe-assignment": "error",
      "@typescript-eslint/no-unsafe-member-access": "error",
      "@typescript-eslint/no-unsafe-call": "error",
      "@typescript-eslint/no-unsafe-return": "error",
      "@typescript-eslint/explicit-module-boundary-types": "warn",
      
      // Disallow console in production code (allow in stories and dev)
      "no-console": ["warn", { 
        allow: ["warn", "error"],
      }],
      
      // Code quality
      "no-unused-vars": "off", // Use TypeScript version
      "@typescript-eslint/no-unused-vars": ["error", {
        argsIgnorePattern: "^_",
        varsIgnorePattern: "^_",
      }],
      "prefer-const": "error",
      "no-var": "error",
      
      // React best practices
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
      "react-refresh/only-export-components": ["warn", { 
        allowConstantExport: true,
      }],
    },
  },
  {
    // More lenient rules for stories
    files: ["**/*.stories.{ts,tsx}"],
    rules: {
      "no-console": "off",
      "@typescript-eslint/no-explicit-any": "warn",
    },
  },
  {
    // Storybook specific rules
    files: ["**/*.stories.{ts,tsx}", ".storybook/**/*.{ts,tsx}"],
    plugins: {
      storybook,
    },
    rules: {
      ...storybook.configs.recommended.rules,
    },
  },
]);
