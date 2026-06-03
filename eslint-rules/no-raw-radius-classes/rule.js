/**
 * no-raw-radius-classes — enforces radius tokens from .claude/rules/tokens.md.
 *
 * Detects raw Tailwind radius scale classes (`rounded-none`, `rounded-sm`,
 * `rounded-md`, `rounded-lg`, `rounded-xl`, `rounded-2xl`, `rounded-3xl`,
 * `rounded-full`) in component source. The DS exposes these scales
 * through `getRadiusClass(scale)` from `src/ui/tokens/radius.ts`;
 * consumers should call the getter so a future radius refactor lands
 * in one place.
 *
 * Bare `rounded` (no scale) is INTENTIONALLY not flagged: it slips
 * through as the Tailwind default, and the same literal is sometimes
 * used as a TypeScript variant-name value (e.g. Avatar's
 * `variant: "circle" | "square" | "rounded"`). Flagging bare
 * `rounded` would create false positives on type literals; the cost
 * outweighs the gain.
 *
 * Side-specific radii (`rounded-l-md`, `rounded-tl-lg`, `rounded-t-xl`,
 * etc.) are NOT covered — they have no token-getter equivalent today,
 * and Tailwind v4 still ships them as canonical utilities.
 *
 * Pattern: `(prefix?)rounded-<scale>` where `prefix` is the empty
 * string OR a variant marker like `hover:`, `focus:`. The lookbehind
 * `(?<=^|[\s:])` keeps the rule from matching a trailing `rounded-md`
 * inside a longer non-utility token.
 *
 * Exception mechanism (mirrors no-raw-color-classes Principle 3): a
 * comment within ~15 lines above the offending literal, of one of
 * these shapes, exempts it:
 *   - // exception: <reason>
 *   - // <the-exact-class>: <reason>
 */

const RADIUS_SCALES = "none|sm|md|lg|xl|2xl|3xl|full";

const RAW_REGEX = new RegExp(`(?<=^|[\\s:])rounded-(${RADIUS_SCALES})\\b`, "g");

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
        "Disallow raw Tailwind radius scale classes (rounded-sm, rounded-md, …). Require getRadiusClass(scale) from src/ui/tokens/radius.ts, or an inline `// exception: <reason>` comment for legitimate per-site overrides.",
      recommended: true,
    },
    schema: [],
    messages: {
      rawRadiusClass:
        "Raw Tailwind radius class '{{className}}' is not allowed. Use getRadiusClass('{{scale}}') from src/ui/tokens/radius.ts. If this is a legitimate override, add an inline comment near the literal: // exception: <reason>",
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
          messageId: "rawRadiusClass",
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
