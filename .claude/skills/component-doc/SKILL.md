---
name: component-doc
description: Write or scaffold MDX documentation for a design system component. Use when the user asks to document an existing component, write docs for X, or fill in the missing MDX page for a primitive/component/layout. Produces a Polaris-Stripe hybrid — opinionated when/when-not/accessibility guidance over Storybook-native examples and Controls. Pairs with .claude/skills/component-doc/template.mdx as the concrete skeleton.
---

# Component documentation

Write a component's MDX doc page so a designer or developer arriving for
the first time can answer three questions in under a minute:

1. Should I use this here? (When to use / when not to use)
2. How do I use it? (Examples, Props)
3. Will it work for the people using my product? (Accessibility)

The doc supplements the stories — it does not replace them. Reuse story
exports via `<Canvas of={...} />` and `<Controls of={...} />`; do not
duplicate code blocks.

## Doc model — attached MDX is canonical, autodocs is off

This project uses MDX attached docs (`<Meta of={ComponentStories} />`)
as the canonical doc form. Autodocs is disabled — components without
an `.mdx` do not show an aggregated doc page in the sidebar, only
individual stories.

**Do not re-introduce `tags: ['autodocs']` to any `.stories.tsx`
file.** Storybook 10's indexer errors on the duplicate when a CSF file
is tagged autodocs AND has an attached MDX
(`You created a component docs page for X, but also tagged the CSF
file with autodocs`). The error condition is asymmetric: per-story
tag triggers it, project-level negation (`['!autodocs']`) does NOT
silence it. The only safe path is keeping per-story tags clean.

## When to invoke

- "Write docs for `<Component>`"
- "Document the Modal" / "the Button has no MDX yet"
- Phase 13b2/13b3/13b4 component-doc work (this is the skill that
  Phase 13b1 extracted)
- Any time someone asks to fill in a missing `.mdx` for a
  primitive/component/layout under `src/ui/`

## Steps

1. **Read the component source.** Open `Component.tsx` and
   `Component.stories.tsx`. You need to know: the exported `Props`
   shape (or `interface Props`), the story exports (especially
   `Default`), and any subcomponents (`Component.Header`, etc.).

2. **Decide if Anatomy applies** (see "Section catalogue" below).
   Compound components and components with distinguishable named
   parts get Anatomy. Unitary components do not.

3. **Copy the skeleton** from `template.mdx` to
   `src/ui/<layer>/<Component>/<Component>.mdx`. Replace the
   placeholders. Delete sections that don't apply (only Anatomy is
   optional; the rest are mandatory).

4. **Wire to stories** with `<Meta of={ComponentStories} />` (attached
   form). Reuse story exports via `<Canvas of={ComponentStories.Default} />`
   etc. Do not write any `<Story>` blocks; do not duplicate JSX.

5. **Validate.** `npm run lint` clean. `npm run storybook:smoke -- --filter '^<id-prefix>--'` green. Open Storybook locally if you can; confirm the doc renders in the same sidebar entry as the stories (not as a separate leaf).

## Section catalogue

The full structure is captured in `template.mdx`. The matrix below is
what `SKILL.md` uses to decide section presence and length when
adapting the skeleton to a specific component.

| Section          | Status       | Target words¹                              | Notes                                                                                            |
| ---------------- | ------------ | ------------------------------------------ | ------------------------------------------------------------------------------------------------ |
| Frontmatter+Meta | mandatory    | n/a                                        | `<Meta of={Stories} />` attached form. Title comes from the meta export.                         |
| Intro            | mandatory    | 30-60                                      | One line "what" + one line "when it earns its place".                                            |
| When to use      | mandatory    | 60-120                                     | Bulleted, situational, second-person imperative.                                                 |
| When not to use  | mandatory    | 40-80                                      | Each bullet names the alternative.                                                               |
| Anatomy          | **optional** | scales by part count, see below + 1 canvas | Present iff component has distinguishable named parts (see below).                               |
| Examples         | mandatory    | 10-20 per canvas                           | `Default` always; 2-4 curated additions. Each canvas earns its space.                            |
| Props            | mandatory    | 0 prose                                    | `<Controls of={ComponentStories.Default} />` plus manual table only for props Controls degrades. |
| Accessibility    | mandatory    | 100-200                                    | Keyboard, ARIA, focus management, screen reader. Concrete, not generic.                          |

¹ Targets, not ceilings. Calibrate per component during writing. Total
prose (excluding rendered canvases and auto-generated controls):
**270-540 words**.

### Anatomy presence criterion

Include Anatomy iff a designer or developer needs to "know which part
is which" to customize the component. Examples:

- **Has anatomy:** Modal (overlay/container/header/body/footer),
  Card (header/body/footer), Tabs (list/trigger/content), Accordion
  (item/header/content), Form (root/field/label/control/error).
- **No anatomy:** Button, Badge, Spinner, Icon, Switch, Avatar
  (single-element components — the "parts" would be repeating the
  component itself).

When present, the Anatomy section is one short paragraph plus a
single `<Canvas of={ComponentStories.Default} />` (or a dedicated
`Anatomy` story export if a labelled diagram fits better than the
default).

### Anatomy word count scales by part count

Phase 13b3 introduced this calibration when compound components
(Drawer, Header, Menu, SideNavbar — typically marked `YES (compound)`
in the inventory) made the original 30-60 word band too tight to
name 5+ parts with real explanation.

- **Simple anatomy** (1-3 named parts): 30-60 words. Examples — Input
  (label / field / helper), Switch (track / thumb / label / description).
- **Standard anatomy** (4-5 named parts): 50-100 words. Example —
  Modal (overlay / container / header / body / footer) at 49 words.
- **Compound anatomy** (6+ named parts, often `YES (compound)`):
  80-150 words. Example — SideNavbar with Navbar / Sidebar / Toggle /
  ResizeHandle / Backdrop + interaction notes.

Calibrate by part count, not by component complexity. A compound
component with sparse part-by-part explanation reads thin and forces
re-learning when the consumer composes the component for the first
time. A simple anatomy padded to the compound band reads as filler.

The 11 docs that landed in Phase 13b1+13b2 with Anatomy (Modal,
Input, Checkbox, Radio, Switch, Tooltip, Chip, Select, Textarea,
Slider, Collapsible) all sit in the simple-to-standard bands and
remain in spec under this rule.

### Examples selection criterion

- **Always:** `<Canvas of={ComponentStories.Default} />`. When a
  component names its canonical lead export differently — `Button`
  uses `Primary`, some components use `Basic` or the first variant
  in the family — substitute that export instead. The template
  skeleton keeps the literal name `Default` for the common case;
  rename on copy when the lead is something else.
- **Then:** 2-4 additional canvases, each demonstrating something
  the lead does not — a critical variant, a critical state
  (`loading`, `disabled`), or a common composition.
- **Hard cap:** if you reach 5+ canvases, you are slipping into
  MUI-style example dump. Cut the ones that repeat aesthetic without
  changing the decision.
- **Framing prose:** keep it 10-20 words per canvas, only when the
  next canvas needs an introduction. If the variant name and the
  rendered story make the point on their own, no prose at all.

### Props handling

- **Primary:** `<Controls of={ComponentStories.Default} />`. Interactive,
  pulls from the TypeScript interface via Storybook's docgen, shows
  description and default.
- **Manual markdown table** scoped to props that Controls degrades —
  callbacks, polymorphic `as`, complex discriminated unions — and only
  when the omission actually hurts understanding. Don't make manual
  tables routine.
- **Upstream fix** is preferred when a critical prop is unintelligible
  in the Controls panel: refine `argTypes` in the `.stories.tsx` file
  (e.g. `argTypes: { as: { control: { type: 'select', options: [...]
} } }`). The fix lives where the source of truth lives, and it
  improves the playground too.
- **Inherited HTML attributes** are not documented individually. The
  Intro mentions when the component extends a native element (e.g.
  "extends all `button` HTML attributes").

## Cross-reference rule (Phase 13b3 onward)

Inline-code mentions in prose (`` `Toast` ``, `` `Modal` ``, …) are
**not** cross-references — use them freely; they cost nothing. The
24 docs landed in Phase 13b1+13b2 establish the convention by example:
named components appear as inline-code wherever they help redirect or
distinguish.

A cross-reference is a clickable markdown link to another doc page.
Maximum 2-3 links per doc, only when:

- The component composes the linked one as a public part (Form uses
  Input → the first Input mention in Form.mdx can link to Input docs).
- A consumer decision genuinely depends on the linked doc beyond what
  your prose explains.

Don't link when:

- The mention is one of many alternatives in a When-not-to-use bullet
  — alternatives stay inline-code so the comparison reads cleanly.
- The referenced component is an implementation detail invisible to
  the consumer.

**URL format** (verified empirically against `storybook-static/index.json`
in Phase 13b3 PASSO 2): `?path=/docs/<lowercase-kebab-title>--docs`.
Examples: `?path=/docs/primitives-input--docs`,
`?path=/docs/components-modal--docs`.

### Examples

When **to** link:

> "Form composes [Input](?path=/docs/primitives-input--docs) and
> [Label](?path=/docs/primitives-label--docs) — pass the same `id`
> to both so the label binds to the field and screen readers
> announce them as one accessible name."

Two links because the consumer cannot wire IDs correctly without
visiting both linked docs.

When **not** to link:

> "Don't use Modal for non-critical messages — prefer `Toast`."

`Toast` stays inline-code: it is one alternative in a When-not-to-use
bullet, and the redirect is the value, not the navigation.

If more than 2-3 links are needed, the doc is re-explaining instead
of pointing — rewrite.

## Tone & voice

- **English uniform** with the rest of `.claude/` and the codebase.
- **Second person, imperative for guidance.** "Use Modal when…" /
  "Avoid Button when…" / "Combine with Form when…". Polaris and
  Stripe both use second-person; it reads more direct than passive
  third-person descriptions of the component as a thing in space.
- **Indicative for description.** "Modal renders inside a portal."
  "Button supports a polymorphic `as` prop." Reserve indicative for
  facts; reserve imperative for advice.
- **No emojis.** No marketing prose ("delightful", "powerful",
  "intuitive"). No filler ("In this section, we will cover…").
- **Concrete over abstract.** Bullets > prose for guidance sections.
  Code or canvas > prose for examples.

## Anti-patterns (rejected by code review)

- **Duplicating story JSX** in MDX `tsx` code blocks. Use
  `<Canvas of={Stories.X} />`.
- **Manual props tables** that mirror `<Controls />`. Only when
  Controls genuinely fails on a prop.
- **Writing prose in the Props section to "complement" Controls.**
  The section is `<Controls of={...} />` and nothing else by default.
  _Exception:_ a single short paragraph (≤30 words) is acceptable
  ONLY when a polymorphic prop (`as`), callback signature, or generic
  type significantly degrades in Controls display. Document the
  reason in the prose itself so the exception is visible — "Polymorphic
  via `as`: when…". The exception must be marked in the MDX with an
  inline `{/* exception: <reason> */}` comment immediately above the
  paragraph, mirroring the `// exception:` pattern in component code
  (Principle 3 of `.claude/rules/colors.md`). Threshold check: if
  more than one component in ten needs an exception-paragraph, the
  template is wrong, not the components — reopen template
  calibration.
- **`<Meta title="..." />` standalone form.** Use attached
  `<Meta of={Stories} />`. The standalone form creates a duplicate
  sidebar leaf and disconnects the doc from autodocs.
- **MUI-style example dumps** (10+ canvases of small variations).
  Curate.
- **Generic accessibility prose** ("This component is fully
  accessible.") — name the keyboard shortcuts, the ARIA roles, the
  focus management behavior. If you cannot, the component still
  has work to do.
- **Anatomy on unitary components.** A Button doesn't have parts;
  don't invent them to fill the section.
- **Re-explaining primitives inside a composed component's doc.** A
  `Card` doc should not re-explain how `Button` works. Mention that
  the action area accepts a `Button` and link or rely on the reader
  to navigate. The Button doc owns the Button surface; the Card doc
  owns the Card decision.
- **Restating the `.stories.tsx` taxonomy.** The doc adds the layer
  the stories cannot provide (when / when-not / a11y). It does not
  recreate the "Variants" or "States" listing that already exists as
  story exports — those are visible via the rendered canvases.

## Worked examples

The canonical examples Phase 13b1 produced:

- `src/ui/components/Modal/Modal.mdx` — exercises the compound /
  composite end of the spectrum (Anatomy present, full ladder).
- `src/ui/primitives/Button/Button.mdx` — exercises the simple end
  (no Anatomy, polymorphic `as`, accessibility focused on focus
  ring and disabled semantics).

When in doubt about a section, read both before improvising.

## Related rules

The doc inherits the discipline of the rest of the system. Before
writing, skim:

- `.claude/rules/components.md` — overall component standards;
  defines what "shipping" means and which props/typing patterns are
  the norm.
- `.claude/rules/stories.md` — MDX is indexed by the same Storybook
  glob as `.stories.tsx`, and the taxonomy / title rules apply (no
  `Atoms/Molecules/...` segments; first segment is
  `Primitives|Components|Layouts|Design System`).
- `.claude/rules/colors.md` — applies the moment any class name
  appears in prose or in an inline JSX example.

## Guardrails

- **Do not touch the component source** while writing the doc. If
  the doc reveals an API problem (a prop that can't be explained, a
  variant that has no story), stop and report; do not patch the
  component in a docs PR.
- **Do not introduce new addons** (e.g. `addon-designs`,
  `addon-measure`) just to make a doc richer. Stay within the
  installed surface (`addon-docs`, `addon-a11y`).
- **Do not auto-format the .mdx file** in a separate step. The
  project's `format-touched.sh` hook skips `.mdx` and
  `.prettierignore` excludes the extension — prettier 3.x mangles
  top-level JSX in markdown mode. Edit by hand, validate with the
  smoke runner.
