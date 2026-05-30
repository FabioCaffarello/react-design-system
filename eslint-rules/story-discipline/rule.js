/**
 * story-discipline — enforces story metadata conventions from
 * .claude/rules/stories.md.
 *
 * Detects three mechanical violations in `.stories.tsx`:
 *
 *   1. Legacy renderer import — `from "@storybook/react"`.
 *      Should be `@storybook/react-vite` in Storybook 10.
 *
 *   2. Legacy test import — `from "@storybook/test"`.
 *      Should be `storybook/test` (umbrella subpath) in Storybook 10.
 *
 *   3. Invalid title segment — the first `/`-delimited segment of any
 *      `title: "..."` property must be one of the four allowed:
 *      "Primitives", "Components", "Layouts", "Design System".
 *      This is an allowlist (AST), replacing the denylist regex grep
 *      previously documented in stories.md. The allowlist matches the
 *      categorical statement in stories.md:17.
 *
 * Scope: `.stories.tsx` files only. `.mdx` titles (5 legacy files) are
 * NOT covered here — see BACKLOG item "Migrar 5 legacy MDX standalone →
 * attached Meta"; after that migration, .mdx loses literal `title=` and
 * the residual grep in stories.md can be removed.
 */

const ALLOWED_SEGMENTS = [
  "Primitives",
  "Components",
  "Layouts",
  "Design System",
];

const LEGACY_IMPORTS = {
  "@storybook/react": {
    messageId: "legacyRendererImport",
    suggested: "@storybook/react-vite",
  },
  "@storybook/test": {
    messageId: "legacyTestImport",
    suggested: "storybook/test",
  },
};

function firstSegment(title) {
  const slash = title.indexOf("/");
  return slash === -1 ? title : title.slice(0, slash);
}

export default {
  meta: {
    type: "problem",
    docs: {
      description:
        "Enforce story metadata conventions from .claude/rules/stories.md: Storybook 10 import paths and the four-segment title allowlist.",
      recommended: true,
    },
    schema: [],
    messages: {
      legacyRendererImport:
        "Legacy Storybook renderer import '{{source}}'. Use '@storybook/react-vite' (Storybook 10 framework package).",
      legacyTestImport:
        "Legacy Storybook test import '{{source}}'. Use 'storybook/test' (umbrella subpath in Storybook 10).",
      invalidTitleSegment:
        "Story title '{{title}}' starts with '{{segment}}', not one of the four allowed top-level segments: Primitives, Components, Layouts, Design System. See .claude/rules/stories.md.",
    },
  },
  create(context) {
    // Only the meta object's title — i.e. the object that the file
    // default-exports — should be checked. `title` on nested args
    // (Timeline events, Stepper steps, sample data) is unrelated UI
    // content and must not trigger.
    //
    // Two CSF patterns we recognize:
    //   1. `export default { title: "...", component: X }` — inline.
    //   2. `const meta = { title: "...", ... }; export default meta;`
    //      (also `const meta: Meta<typeof X> = {...}` and the `satisfies`
    //      / `as` TS wrappers).
    const topLevelObjectsByName = new Map(); // const name -> ObjectExpression
    let defaultExportNode = null; // ObjectExpression | Identifier

    function unwrapTSWrappers(node) {
      while (
        node &&
        (node.type === "TSSatisfiesExpression" ||
          node.type === "TSAsExpression")
      ) {
        node = node.expression;
      }
      return node;
    }

    function checkMetaTitle(objectExpr) {
      if (!objectExpr || objectExpr.type !== "ObjectExpression") return;
      const titleProp = objectExpr.properties.find(
        (p) =>
          p &&
          p.type === "Property" &&
          p.key &&
          (p.key.name === "title" ||
            (p.key.type === "Literal" && p.key.value === "title")),
      );
      if (!titleProp) return;
      const value = titleProp.value;
      if (!value || value.type !== "Literal") return;
      if (typeof value.value !== "string") return;
      const title = value.value;
      const segment = firstSegment(title);
      if (ALLOWED_SEGMENTS.includes(segment)) return;
      context.report({
        node: value,
        messageId: "invalidTitleSegment",
        data: { title, segment },
      });
    }

    return {
      ImportDeclaration(node) {
        const src = node.source && node.source.value;
        if (typeof src !== "string") return;
        const hit = LEGACY_IMPORTS[src];
        if (!hit) return;
        context.report({
          node: node.source,
          messageId: hit.messageId,
          data: { source: src, suggested: hit.suggested },
        });
      },
      VariableDeclarator(node) {
        // Top-level: VariableDeclarator -> VariableDeclaration -> Program.
        if (
          !node.parent ||
          !node.parent.parent ||
          node.parent.parent.type !== "Program"
        )
          return;
        if (!node.id || node.id.type !== "Identifier") return;
        const init = unwrapTSWrappers(node.init);
        if (!init || init.type !== "ObjectExpression") return;
        topLevelObjectsByName.set(node.id.name, init);
      },
      ExportDefaultDeclaration(node) {
        const decl = unwrapTSWrappers(node.declaration);
        if (!decl) return;
        if (decl.type === "ObjectExpression") {
          defaultExportNode = decl;
        } else if (decl.type === "Identifier") {
          defaultExportNode = decl;
        }
      },
      "Program:exit"() {
        let metaObj = null;
        if (
          defaultExportNode &&
          defaultExportNode.type === "ObjectExpression"
        ) {
          metaObj = defaultExportNode;
        } else if (
          defaultExportNode &&
          defaultExportNode.type === "Identifier"
        ) {
          metaObj = topLevelObjectsByName.get(defaultExportNode.name) || null;
        }
        checkMetaTitle(metaObj);
      },
    };
  },
};
