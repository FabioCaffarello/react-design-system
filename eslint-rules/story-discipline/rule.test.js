import { describe, it, expect } from "vitest";
import { RuleTester } from "eslint";
import tsParser from "@typescript-eslint/parser";
import rule from "./rule.js";
import plugin from "../index.js";

describe("story-discipline — meta", () => {
  it("rule exports proper meta shape", () => {
    expect(rule.meta?.type).toBe("problem");
    expect(rule.meta?.messages?.legacyRendererImport).toBeTruthy();
    expect(rule.meta?.messages?.legacyTestImport).toBeTruthy();
    expect(rule.meta?.messages?.invalidTitleSegment).toBeTruthy();
    expect(typeof rule.create).toBe("function");
  });

  it("plugin index exposes the rule under its canonical name", () => {
    expect(plugin.rules["story-discipline"]).toBe(rule);
  });
});

const tester = new RuleTester({
  languageOptions: {
    parser: tsParser,
    ecmaVersion: 2020,
    sourceType: "module",
    parserOptions: {
      ecmaFeatures: { jsx: true },
    },
  },
});

// Title checks ONLY apply to the meta object the file default-exports.
// All title-related fixtures wrap in the real CSF pattern:
//   const meta = { title: "...", component: X }; export default meta;
// OR the inline form: `export default { title: "...", component: X };`
const wrapNamed = (title) =>
  `const meta = { title: "${title}", component: X }; export default meta;`;
const wrapInline = (title) =>
  `export default { title: "${title}", component: X };`;

tester.run("story-discipline", rule, {
  valid: [
    // Storybook 10 canonical imports.
    { code: `import type { Meta, StoryObj } from "@storybook/react-vite";` },
    { code: `import { fn, expect } from "storybook/test";` },
    {
      code: [
        `import type { Meta, StoryObj } from "@storybook/react-vite";`,
        `import { fn } from "storybook/test";`,
      ].join("\n"),
    },
    // Title with each of the four allowed segments (named meta form).
    { code: wrapNamed("Primitives/Button") },
    { code: wrapNamed("Components/Modal") },
    { code: wrapNamed("Layouts/Container") },
    { code: wrapNamed("Design System/Introduction") },
    // "Design System" with deeper nesting (matches the AppProvider fix).
    { code: wrapNamed("Design System/Providers/AppProvider") },
    // Inline default export form also accepted.
    { code: wrapInline("Components/Modal") },
    // Single-segment title in the allowlist (no `/`).
    { code: wrapNamed("Components") },
    // `satisfies Meta<typeof X>` TS wrapper around the object literal.
    {
      code: `const meta = { title: "Primitives/Button", component: X } satisfies Meta<typeof X>; export default meta;`,
    },
    // Non-string title value — skip rather than crash (rare, dynamic).
    {
      code: `const t = "Components/Button"; const meta = { title: t, component: X }; export default meta;`,
    },
    // Title appears in a NESTED object (story args / sample data) but the
    // meta itself is fine. Must NOT trigger — this is the original false
    // positive that the meta-only restriction fixes (Timeline events,
    // Stepper steps, Card content all have nested {title} fields).
    {
      code: [
        `const meta = { title: "Components/Timeline", component: X };`,
        `export default meta;`,
        `export const WithEvents = { args: { items: [{ title: "Event 1" }, { title: "Event 2" }] } };`,
      ].join("\n"),
    },
    {
      code: [
        `const meta = { title: "Components/Stepper", component: X };`,
        `export default meta;`,
        `const steps = [{ title: "Step 1" }, { title: "Step 2" }];`,
      ].join("\n"),
    },
    // No default export at all — file has nothing to validate. Skip
    // silently rather than fire false positives on partial files.
    { code: `const meta = { title: "Atoms/Foo" };` },
    // Property named other than `title` — ignored even on meta.
    {
      code: `const meta = { description: "Atoms/Whatever", component: X }; export default meta;`,
    },
    // Unrelated import — ignored.
    { code: `import * as React from "react";` },
  ],
  invalid: [
    // Legacy renderer import.
    {
      code: `import type { Meta } from "@storybook/react";`,
      errors: [{ messageId: "legacyRendererImport" }],
    },
    // Legacy test import.
    {
      code: `import { fn } from "@storybook/test";`,
      errors: [{ messageId: "legacyTestImport" }],
    },
    // Both legacies in one file — each reported.
    {
      code: [
        `import type { Meta } from "@storybook/react";`,
        `import { fn } from "@storybook/test";`,
      ].join("\n"),
      errors: [
        { messageId: "legacyRendererImport" },
        { messageId: "legacyTestImport" },
      ],
    },
    // Atomic taxonomy — the old layer names. All must fire via named-meta.
    {
      code: wrapNamed("Atoms/Button"),
      errors: [{ messageId: "invalidTitleSegment" }],
    },
    {
      code: wrapNamed("Molecules/Card"),
      errors: [{ messageId: "invalidTitleSegment" }],
    },
    {
      code: wrapNamed("Organisms/SideNavbar"),
      errors: [{ messageId: "invalidTitleSegment" }],
    },
    {
      code: wrapNamed("Templates/Dashboard"),
      errors: [{ messageId: "invalidTitleSegment" }],
    },
    {
      code: wrapNamed("Patterns/Login"),
      errors: [{ messageId: "invalidTitleSegment" }],
    },
    // The Phase B regression case: "Providers/" at the top level. The
    // earlier denylist grep enumerated banned segments and missed this.
    // The allowlist catches anything not in the four — that's the point.
    {
      code: wrapNamed("Providers/AppProvider"),
      errors: [{ messageId: "invalidTitleSegment" }],
    },
    // Future invented segment — Widgets, anything — also caught.
    {
      code: wrapNamed("Widgets/Foo"),
      errors: [{ messageId: "invalidTitleSegment" }],
    },
    // Case sensitivity: "primitives" (lowercase) is NOT "Primitives".
    {
      code: wrapNamed("primitives/Button"),
      errors: [{ messageId: "invalidTitleSegment" }],
    },
    // Inline default export form — also caught.
    {
      code: wrapInline("Patterns/Foo"),
      errors: [{ messageId: "invalidTitleSegment" }],
    },
    // Empty title — empty segment, not in allowlist.
    {
      code: wrapNamed(""),
      errors: [{ messageId: "invalidTitleSegment" }],
    },
    // `satisfies Meta<typeof X>` wrapper does not hide a bad title.
    {
      code: `const meta = { title: "Atoms/Button", component: X } satisfies Meta<typeof X>; export default meta;`,
      errors: [{ messageId: "invalidTitleSegment" }],
    },
  ],
});
