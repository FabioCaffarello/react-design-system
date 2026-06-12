import type { Meta, StoryObj } from "@storybook/react-vite";
import FilterChips from "./FilterChips";
import Chip from "../../primitives/Chip/Chip";

const meta: Meta<typeof FilterChips> = {
  title: "Components/FilterChips",
  component: FilterChips,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: `
## FilterChips

The shell of every chip-based filter bar: a \`role="group"\` container with an optional neutral text label at the left and a flex run of \`Chip\`s that wraps responsively by default (\`wrap\` prop, default \`true\`).

Purely presentational and ships in the \`./server\` entry — the interactive identity (select, navigate, remove) lives in each \`Chip\` (\`onClick\`/\`onRemove\`, or \`asChild\` with a consumer \`<Link>\`), never in this wrapper.

**Accessible name.** When \`label\` is a plain string it doubles as the group's \`aria-label\` automatically; an explicit consumer \`aria-label\` always overrides it; a non-string \`ReactNode\` label derives nothing (name the group yourself if AT users need to identify it).

**Not a fieldset.** The label is neutral text, not \`<legend>\` — chips are navigation/selection affordances, not form controls.
        `,
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof FilterChips>;

// ─────────────────────────────────────────────────────────────────────────
// Real-use stories (listing-page filter bars)
// ─────────────────────────────────────────────────────────────────────────

export const WithLabelAndSelection: Story = {
  name: "With label + selected chips",
  render: () => (
    <FilterChips label="Filtros">
      <Chip variant="filled" selected>
        UF: SP
      </Chip>
      <Chip>Partido: PT</Chip>
      <Chip variant="filled" selected>
        Casa: Câmara
      </Chip>
      <Chip>Em exercício</Chip>
    </FilterChips>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'The canonical listing-page filter bar: a string `label` (which doubles as the group\'s `aria-label`) followed by a mix of selected (`variant="filled" selected`) and unselected chips.',
      },
    },
  },
};

export const NavigationChips: Story = {
  name: "Navigation chips (Chip asChild)",
  render: () => (
    <FilterChips label="Filtros" aria-label="Filtros de parlamentares">
      <Chip asChild variant="filled" selected>
        {/* In the consumer this is next/link; aria-current surfaces the
            active route to AT users — see Chip's asChild JSDoc. */}
        <a href="?uf=SP" aria-current="page">
          UF: SP
        </a>
      </Chip>
      <Chip asChild>
        <a href="?partido=PT">Partido: PT</a>
      </Chip>
      <Chip asChild>
        <a href="?casa=senado">Casa: Senado</a>
      </Chip>
    </FilterChips>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "The zero-JS server-rendered form: each chip collapses into a consumer `<Link>` via `asChild`. The explicit `aria-label` overrides the derived one — useful when the visible label is terse but the group deserves a fuller accessible name.",
      },
    },
  },
};

export const WithoutLabel: Story = {
  name: "Without label",
  render: () => (
    <FilterChips aria-label="Refinar busca">
      <Chip>Tema: Saúde</Chip>
      <Chip>Situação: Em tramitação</Chip>
      <Chip>Ano: 2026</Chip>
    </FilterChips>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "No visible label — e.g. refinement chips under a search input where the context is obvious visually. Without a string `label` no accessible name is derived, so pass `aria-label` explicitly (as here) to keep the group identifiable to AT users.",
      },
    },
  },
};

export const WrapDefault: Story = {
  name: "Wrap (default) — chips flow to new lines",
  render: () => (
    <div style={{ maxWidth: 420 }}>
      <FilterChips label="Filtros">
        <Chip>UF: SP</Chip>
        <Chip>UF: RJ</Chip>
        <Chip>UF: MG</Chip>
        <Chip>Partido: PT</Chip>
        <Chip>Partido: PL</Chip>
        <Chip>Casa: Câmara</Chip>
        <Chip>Casa: Senado</Chip>
        <Chip>Em exercício</Chip>
      </FilterChips>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "`wrap` defaults to `true` (`flex-wrap`): chips overflow into new lines inside a constrained container — the responsive filter-bar behavior. The DOM order never changes; wrapping is purely visual.",
      },
    },
  },
};

export const NoWrap: Story = {
  name: "wrap={false} — single line",
  render: () => (
    // Scrollable overflow region: focusable + named so keyboard users can
    // scroll it (axe scrollable-region-focusable) — the pattern the
    // consumer owns when choosing wrap={false}.
    <div
      aria-label="Período — lista rolável de filtros"
      role="region"
      style={{ maxWidth: 420, overflowX: "auto" }}
      tabIndex={0}
    >
      <FilterChips label="Período" wrap={false}>
        <Chip>2020</Chip>
        <Chip>2021</Chip>
        <Chip>2022</Chip>
        <Chip>2023</Chip>
        <Chip>2024</Chip>
        <Chip>2025</Chip>
        <Chip>2026</Chip>
      </FilterChips>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          '`wrap={false}` applies `flex-nowrap` and keeps every chip on one line. Overflow handling belongs to the consumer — this story wraps the group in a horizontally scrollable container with `role="region"` + `aria-label` + `tabIndex={0}` — the accessible overflow pattern the consumer owns (a scrollable region must be keyboard-reachable).',
      },
    },
  },
};

export const RemovableChips: Story = {
  name: "Removable chips (client-side composition)",
  render: () => (
    <FilterChips label="Filtros ativos">
      <Chip onRemove={() => {}}>UF: SP</Chip>
      <Chip onRemove={() => {}}>Partido: PT</Chip>
      <Chip onRemove={() => {}}>Casa: Câmara</Chip>
    </FilterChips>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Active-filter summary with removable chips. The wrapper stays presentational; `onRemove` lives in each `Chip`, which crosses the RSC boundary as a client reference when the page itself is server-rendered.",
      },
    },
  },
};
