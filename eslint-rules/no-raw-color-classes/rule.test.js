import { describe, it, expect } from "vitest";
import { RuleTester } from "eslint";
import rule from "./rule.js";
import plugin from "../index.js";

describe("no-raw-color-classes — meta", () => {
  it("rule exports proper meta shape", () => {
    expect(rule.meta?.type).toBe("problem");
    expect(rule.meta?.messages?.rawColorClass).toBeTruthy();
    expect(rule.meta?.messages?.arbitraryVarSyntax).toBeTruthy();
    expect(typeof rule.create).toBe("function");
  });

  it("plugin index exposes the rule under its canonical name", () => {
    expect(plugin.rules["no-raw-color-classes"]).toBe(rule);
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

tester.run("no-raw-color-classes", rule, {
  valid: [
    // Semantic vocabulary — the happy path.
    { code: `const cls = "text-fg-primary";` },
    { code: `const cls = "bg-surface-base border-line-default";` },
    { code: `const el = <div className="text-fg-primary bg-surface-base" />;` },
    {
      code: `const cls = \`text-fg-\${variant} bg-surface-base\`;`,
    },
    // Empty / unrelated strings.
    { code: `const s = "";` },
    { code: `const s = "padding-4 margin-2";` },
    // Explicit exception marker on previous line.
    {
      code: [
        `// exception: rare case with no semantic equivalent`,
        `const cls = "text-gray-500";`,
      ].join("\n"),
    },
    // Class-named exception (the Badge.tsx canonical pattern), several lines above.
    {
      code: [
        `// bg-pink-300: secondary solid badge — no semantic equivalent`,
        `const cls = cn(`,
        `  "some-other-class",`,
        `  "bg-pink-300",`,
        `);`,
      ].join("\n"),
    },
    // micro-z marker.
    {
      code: [
        `// micro-z: see colors.md special cases`,
        `const cls = "text-gray-500";`,
      ].join("\n"),
    },
    // Arbitrary syntax with exception.
    {
      code: [
        `// exception: forced by upstream component`,
        `const el = <div className="bg-[var(--color-foo)]" />;`,
      ].join("\n"),
    },
  ],
  invalid: [
    // Plain raw class in a string literal.
    {
      code: `const cls = "text-gray-500";`,
      errors: [{ messageId: "rawColorClass" }],
    },
    // Raw class inside JSX className.
    {
      code: `const el = <div className="bg-indigo-500 text-white" />;`,
      errors: [{ messageId: "rawColorClass" }],
    },
    // Raw class inside template literal.
    {
      code: `const cls = \`text-indigo-500 \${dynamic}\`;`,
      errors: [{ messageId: "rawColorClass" }],
    },
    // Arbitrary syntax — bg-[var(--color-*)].
    {
      code: `const el = <div className="bg-[var(--color-surface-base)]" />;`,
      errors: [{ messageId: "arbitraryVarSyntax" }],
    },
    // Multiple violations in one string — each reported.
    {
      code: `const cls = "text-gray-500 bg-pink-300";`,
      errors: [{ messageId: "rawColorClass" }, { messageId: "rawColorClass" }],
    },
    // Brand primitives are also blocked — components consume them via
    // semantic roles (text-fg-brand, bg-surface-brand), not raw classes.
    {
      code: `const cls = "text-brand-primary-500";`,
      errors: [{ messageId: "rawColorClass" }],
    },
    {
      code: `const el = <div className="bg-brand-secondary-100" />;`,
      errors: [{ messageId: "rawColorClass" }],
    },
    // Wrong-named exception comment doesn't excuse a different class.
    {
      code: [
        `// bg-pink-300: this excuses pink only`,
        `const cls = "text-gray-500";`,
      ].join("\n"),
      errors: [{ messageId: "rawColorClass" }],
    },
    // Exception comment too far above (>15 lines).
    {
      code: [
        `// exception: too far up`,
        ...Array.from({ length: 16 }, (_v, i) => `const _x${i} = 1;`),
        `const cls = "text-gray-500";`,
      ].join("\n"),
      errors: [{ messageId: "rawColorClass" }],
    },
  ],
});
