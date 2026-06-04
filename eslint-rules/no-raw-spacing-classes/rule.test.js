import { describe, it, expect } from "vitest";
import { RuleTester } from "eslint";
import rule from "./rule.js";
import plugin from "../index.js";

describe("no-raw-spacing-classes — meta", () => {
  it("rule exports proper meta shape", () => {
    expect(rule.meta?.type).toBe("problem");
    expect(rule.meta?.messages?.rawSpacingClass).toBeTruthy();
    expect(typeof rule.create).toBe("function");
  });

  it("plugin index exposes the rule under its canonical name", () => {
    expect(plugin.rules["no-raw-spacing-classes"]).toBe(rule);
    expect(plugin.meta?.name).toBe("eslint-plugin-ds-tokens");
  });
});

const tester = new RuleTester({
  languageOptions: {
    ecmaVersion: 2020,
    sourceType: "module",
    parserOptions: {
      ecmaFeatures: { jsx: true },
    },
  },
});

tester.run("no-raw-spacing-classes", rule, {
  valid: [
    // Getter call — happy path.
    {
      code: `const cls = \`\${getSpacingClass("base", "p")} bg-surface-base\`;`,
    },
    // No spacing class at all.
    { code: `const s = "text-fg-primary bg-surface-base";` },
    { code: `const s = "";` },
    // Arbitrary value — not in the spacing scale, intentionally not matched.
    { code: `const cls = "p-[12px]";` },
    // Negative margin — lookbehind protects against this. Outside the
    // rule's scope for now (no getter equivalent).
    { code: `const cls = "-mt-2 -ml-1";` },
    // Numeric scale not exposed by getSpacingClass (out-of-getter or
    // outright not in the Tailwind scale) — rule skips quietly so it
    // doesn't force migrations to a non-existent API. `p-5` falls in
    // the first bucket; `p-7` / `p-9` fall in the second.
    { code: `const cls = "p-5 p-7 m-9 gap-7 p-32";` },
    // space-y-reverse / space-x-reverse — not a number after the prefix.
    { code: `const cls = "space-y-reverse space-x-reverse";` },
    // Bare prefix without a numeric scale.
    { code: `const cls = "p m gap";` },
    // Strings that look spacing-like but aren't preceded by space/colon —
    // false-positive guard.
    { code: `const s = "padding-4 spacing-2";` },
    { code: `const s = "wrap-2 stop-3";` },
    // Explicit exception marker on previous line.
    {
      code: [
        `// exception: legacy footer offset preserved verbatim`,
        `const cls = "p-3";`,
      ].join("\n"),
    },
    // Class-named exception, several lines above.
    {
      code: [
        `// p-3: prose alignment to icon row, justified literal`,
        `const cls = cn(`,
        `  "some-other-class",`,
        `  "p-3",`,
        `);`,
      ].join("\n"),
    },
  ],
  invalid: [
    // Plain raw class in a string literal — padding.
    {
      code: `const cls = "p-4";`,
      errors: [{ messageId: "rawSpacingClass" }],
    },
    // Margin.
    {
      code: `const cls = "m-2";`,
      errors: [{ messageId: "rawSpacingClass" }],
    },
    // Directional padding.
    {
      code: `const cls = "px-4 py-2";`,
      errors: [
        { messageId: "rawSpacingClass" },
        { messageId: "rawSpacingClass" },
      ],
    },
    // Side-specific.
    {
      code: `const cls = "pt-3 pl-1";`,
      errors: [
        { messageId: "rawSpacingClass" },
        { messageId: "rawSpacingClass" },
      ],
    },
    // Gap.
    {
      code: `const cls = "gap-2 gap-x-1 gap-y-3";`,
      errors: [
        { messageId: "rawSpacingClass" },
        { messageId: "rawSpacingClass" },
        { messageId: "rawSpacingClass" },
      ],
    },
    // space-y is in scope.
    {
      code: `const cls = "space-y-4";`,
      errors: [{ messageId: "rawSpacingClass" }],
    },
    // space-x is in scope (symmetric with space-y).
    {
      code: `const cls = "space-x-2";`,
      errors: [{ messageId: "rawSpacingClass" }],
    },
    // Half-step scale.
    {
      code: `const cls = "p-1.5 m-0.5";`,
      errors: [
        { messageId: "rawSpacingClass" },
        { messageId: "rawSpacingClass" },
      ],
    },
    // Variant prefix — `hover:p-4` is still in scope.
    {
      code: `const cls = "hover:p-4 md:gap-2";`,
      errors: [
        { messageId: "rawSpacingClass" },
        { messageId: "rawSpacingClass" },
      ],
    },
    // Raw class inside JSX className.
    {
      code: `const el = <div className="p-4 m-2" />;`,
      errors: [
        { messageId: "rawSpacingClass" },
        { messageId: "rawSpacingClass" },
      ],
    },
    // Raw class inside template literal.
    {
      code: `const cls = \`p-4 \${dynamic}\`;`,
      errors: [{ messageId: "rawSpacingClass" }],
    },
  ],
});
