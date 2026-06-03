/**
 * no-raw-spacing-classes — enforces spacing tokens from .claude/rules/tokens.md.
 *
 * Detects raw Tailwind spacing classes that map onto the design
 * system's spacing scale, in component source. Consumers should call
 * `getSpacingClass(scale, direction)` from `src/ui/tokens/spacing.ts`
 * so a future scale refactor lands in one place instead of playing
 * whack-a-mole across the codebase.
 *
 * What this rule matches:
 *   - Padding: `p-N`, `px-N`, `py-N`, `pt-N`, `pr-N`, `pb-N`, `pl-N`
 *   - Margin:  `m-N`, `mx-N`, `my-N`, `mt-N`, `mr-N`, `mb-N`, `ml-N`
 *   - Gap:     `gap-N`, `gap-x-N`, `gap-y-N`
 *   - Stack:   `space-y-N`
 *
 * Where N is any value in the SpacingScale union from spacing.ts
 * (`0|0.5|1|1.5|2|2.5|3|3.5|4|5|6|8|10|12|16|20|24|32|40|48|64|80|96`).
 *
 * What it does NOT match (by design):
 *   - `space-x-N` — getSpacingClass has no `space-x` direction yet; if
 *     we matched it, the rule would have no automated fix path.
 *   - Negative margin `-mt-N` — lookbehind ensures the prefix isn't
 *     preceded by `-`; same logic the shadow rule uses to avoid
 *     false-positing on `drop-shadow-md`.
 *   - Arbitrary values `p-[12px]` — regex requires a digit after `-`.
 *   - `space-y-reverse` — alternation is numeric only.
 *
 * Pattern: `(?<=^|[\s:])(prefix)-(spacingScale)` with the lookbehind
 * keeping the rule from triggering inside compound class names and
 * variant prefixes (`hover:p-4`, `md:gap-2`) flow through cleanly via
 * the `:` member of the lookbehind set.
 *
 * Exception mechanism (mirrors no-raw-color-classes Principle 3): a
 * comment within ~15 lines above the offending literal exempts it:
 *   - // exception: <reason>
 *   - // <the-exact-class>: <reason> (e.g. // p-3: prose alignment to icon row)
 */

// Direction prefixes that have a matching getter call.
// Order matters in regex alternation — longer alternatives must come
// first so `gap-x` is preferred over a hypothetical `gap` match.
const DIRECTIONS =
  "gap-x|gap-y|space-y|gap|px|py|pt|pr|pb|pl|mx|my|mt|mr|mb|ml|p|m";

// Scales that the design-system spacing getter actually exposes
// (`SPACING_TOKENS` in src/ui/tokens/spacing.ts). The Tailwind scale is
// broader (`p-5`, `p-7`, `p-32`, …), but those values have no semantic
// key in the getter — flagging them would force migrations to a
// non-existent API. Out-of-scope scales pass through quietly; the
// token-system response is to extend the getter (Principle 9) or use
// the `// exception` escape valve, not to expand this allow-list.
const SCALES = new Set([
  "0",
  "0.5",
  "1",
  "1.5",
  "2",
  "2.5",
  "3",
  "3.5",
  "4",
  "6",
  "8",
  "10",
  "12",
  "16",
  "20",
  "24",
]);

// Match prefix-numericScale. The numeric part is captured loosely and
// validated against SCALES in code — keeps the regex compact and lets
// us add scale entries without touching the regex.
const RAW_REGEX = new RegExp(
  `(?<=^|[\\s:])(${DIRECTIONS})-(\\d+(?:\\.5)?)(?![-\\w])`,
  "g",
);

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

// Map raw direction → getSpacingClass direction argument.
// Most map 1:1; the suggestion message uses these to print a helpful
// replacement. Direction names already match between Tailwind and the
// getter, so this is identity for now but kept explicit in case the
// getter's surface diverges.
const DIRECTION_TO_GETTER = {
  p: "p",
  m: "m",
  px: "px",
  py: "py",
  mx: "mx",
  my: "my",
  pt: "pt",
  pr: "pr",
  pb: "pb",
  pl: "pl",
  mt: "mt",
  mr: "mr",
  mb: "mb",
  ml: "ml",
  gap: "gap",
  "gap-x": "gap-x",
  "gap-y": "gap-y",
  "space-y": "space-y",
};

// Map numeric scale → semantic key used by getSpacingClass.
// Strict mirror of SPACING_TOKENS in spacing.ts — every entry here
// MUST resolve to a real key the getter accepts. Keep keys as strings
// so JS object lookup matches the regex-captured value verbatim
// (numeric keys would coerce to a different type).
const SCALE_TO_KEY = {
  0: "none",
  0.5: "0.5",
  1: "xs",
  1.5: "1.5",
  2: "sm",
  2.5: "2.5",
  3: "md",
  3.5: "3.5",
  4: "base",
  6: "lg",
  8: "xl",
  10: "2xl",
  12: "3xl",
  16: "4xl",
  20: "5xl",
  24: "6xl",
};

function buildSuggestion(direction, scale) {
  const dir = DIRECTION_TO_GETTER[direction];
  const key = SCALE_TO_KEY[scale];
  if (!dir) return null;
  if (key === undefined) return null;
  return `getSpacingClass("${key}", "${dir}")`;
}

export default {
  meta: {
    type: "problem",
    docs: {
      description:
        "Disallow raw Tailwind spacing classes (p-N, m-N, gap-N, space-y-N, …) that map onto the design system's spacing scale. Require getSpacingClass(scale, direction) from src/ui/tokens/spacing.ts, or an inline `// exception: <reason>` comment for legitimate per-site overrides.",
      recommended: true,
    },
    schema: [],
    messages: {
      rawSpacingClass:
        "Raw Tailwind spacing class '{{className}}' is not allowed. {{suggestionHint}} If this is a legitimate override, add an inline comment near the literal: // exception: <reason>",
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
        const direction = match[1];
        const scale = match[2];

        // Skip if the scale isn't in the spacing token set — keeps the
        // rule from flagging Tailwind classes that look like spacing
        // but aren't (e.g. `p-7` — no `7` in scale).
        if (!SCALES.has(scale)) continue;

        if (hasNearbyException(node, sourceCode, className)) continue;

        const suggestion = buildSuggestion(direction, scale);
        const suggestionHint = suggestion
          ? `Use ${suggestion} from src/ui/tokens/spacing.ts.`
          : "Use getSpacingClass(scale, direction) from src/ui/tokens/spacing.ts.";

        context.report({
          node,
          messageId: "rawSpacingClass",
          data: { className, suggestionHint },
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
