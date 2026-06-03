/**
 * no-raw-shadow-classes — enforces shadow tokens from .claude/rules/tokens.md.
 *
 * Detects raw Tailwind shadow scale classes (`shadow-sm`, `shadow-md`,
 * `shadow-lg`, `shadow-xl`, `shadow-2xl`, `shadow-none`, `shadow-inner`)
 * in component source. The DS exposes these scales through
 * `getShadowClass(scale)` from `src/ui/tokens/shadows.ts`; consumers
 * should call the getter so a future shadow refactor (e.g. a new
 * scale step, dark-mode-aware shadows) lands in one place instead of
 * playing whack-a-mole across the codebase.
 *
 * Pattern: `(prefix?)shadow-<scale>` where `prefix` is the empty
 * string OR a variant marker like `hover:`, `focus:`. The lookbehind
 * `(?<=^|[\s:])` keeps the rule from false-positiving on `drop-shadow-md`
 * (where the `-` before `shadow` is a word boundary that `\b` would
 * otherwise treat as a match start).
 *
 * Exception mechanism (mirrors no-raw-color-classes Principle 3): a
 * comment within ~15 lines above the offending literal, of one of
 * these shapes, exempts it:
 *   - // exception: <reason>
 *   - // <the-exact-class>: <reason> (e.g. // shadow-md: legacy Modal stack)
 */

const SHADOW_SCALES = "none|sm|md|lg|xl|2xl|inner";

const RAW_REGEX = new RegExp(`(?<=^|[\\s:])shadow-(${SHADOW_SCALES})\\b`, "g");

const EXCEPTION_LOOKBACK_LINES = 15;

function commentMatchesException(commentText, className) {
  const text = commentText.trim();
  if (/^exception\s*:/i.test(text)) return true;
  if (className) {
    const lowered = text.toLowerCase();
    const target = className.toLowerCase() + ":";
    if (lowered.startsWith(target)) return true;
    if (lowered.includes(" " + target)) return true;
  }
  return false;
}

function hasNearbyException(node, sourceCode, className) {
  if (!node.loc) return false;
  const nodeLine = node.loc.start.line;
  const allComments = sourceCode.getAllComments();
  return allComments.some((comment) => {
    if (!comment.loc) return false;
    const endLine = comment.loc.end.line;
    if (endLine < nodeLine - EXCEPTION_LOOKBACK_LINES) return false;
    if (endLine > nodeLine) return false;
    return commentMatchesException(comment.value, className);
  });
}

export default {
  meta: {
    type: "problem",
    docs: {
      description:
        "Disallow raw Tailwind shadow scale classes (shadow-sm, shadow-md, …). Require getShadowClass(scale) from src/ui/tokens/shadows.ts, or an inline `// exception: <reason>` comment for legitimate per-site overrides.",
      recommended: true,
    },
    schema: [],
    messages: {
      rawShadowClass:
        "Raw Tailwind shadow class '{{className}}' is not allowed. Use getShadowClass('{{scale}}') from src/ui/tokens/shadows.ts. If this is a legitimate override, add an inline comment near the literal: // exception: <reason>",
    },
  },
  create(context) {
    const sourceCode = context.sourceCode;

    function checkString(value, node) {
      if (typeof value !== "string" || value.length === 0) return;

      RAW_REGEX.lastIndex = 0;
      let match;
      while ((match = RAW_REGEX.exec(value)) !== null) {
        const className = match[0];
        const scale = match[1];
        if (hasNearbyException(node, sourceCode, className)) continue;
        context.report({
          node,
          messageId: "rawShadowClass",
          data: { className, scale },
        });
      }
    }

    return {
      Literal(node) {
        if (typeof node.value !== "string") return;
        checkString(node.value, node);
      },
      TemplateElement(node) {
        const raw = node.value && (node.value.cooked ?? node.value.raw);
        checkString(raw, node);
      },
    };
  },
};
