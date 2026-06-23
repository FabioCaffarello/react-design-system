import type { Meta, StoryObj } from "@storybook/react-vite";
import { Users, FileText, Vote, Clock, ShieldCheck } from "lucide-react";
import { Stat } from "./Stat";
import { StatGroup } from "./StatGroup";
import Badge from "../../primitives/Badge/Badge";

const meta: Meta<typeof StatGroup> = {
  title: "Components/Stat",
  component: StatGroup,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: `
## Stat + StatGroup

\`Stat\` is a single metric block (icon? + value + label + hint?). \`StatGroup\` is the container that lays out one or more \`Stat\`s with 1-px dividers between them, either as a single horizontal row (\`layout="strip"\`) or as a multi-column grid that reflows from 2-up on mobile to \`cols\` columns on desktop (\`layout="grid"\`).

Both are presentation-only and ship in the \`./server\` entry. Consumer formats the \`value\` themselves — strings are rendered verbatim.

**Empty state.** When \`value\` is \`null\` or \`undefined\`, the component renders the em-dash placeholder with \`aria-label="No data"\` so screen readers do not announce "em dash". Other falsy values (\`0\`, \`""\`, \`false\`) are legitimate values and render as-is.

**Tone.** Tints the \`hint\` line ONLY (semver-bound contract — see JSDoc). The \`value\` always stays in the default foreground.
        `,
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof StatGroup>;

// ─────────────────────────────────────────────────────────────────────────
// Real-use stories (from the consumer prints)
// ─────────────────────────────────────────────────────────────────────────

export const HomeStrip: Story = {
  name: "Home — strip, center, icon, no hint",
  render: () => (
    <StatGroup layout="strip">
      <Stat
        icon={<Users size={20} aria-hidden="true" />}
        value="9,4 mil"
        label="Parlamentares"
        align="center"
      />
      <Stat
        icon={<FileText size={20} aria-hidden="true" />}
        value="3,2 mil"
        label="Proposições"
        align="center"
      />
      <Stat
        icon={<Vote size={20} aria-hidden="true" />}
        value="1,1 mil"
        label="Votações"
        align="center"
      />
      <Stat
        icon={<Clock size={20} aria-hidden="true" />}
        value="há 18 dias"
        label="Última atualização"
        align="center"
      />
    </StatGroup>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Replicates the home-page hero strip: four centered KPIs with icons, no hint, in a single horizontal row separated by 1-px dividers. No reflow — strip is one-line by design.",
      },
    },
  },
};

export const DetailGrid: Story = {
  name: "Detail — grid, start, hint, no icon",
  render: () => (
    <StatGroup layout="grid" cols={4}>
      <Stat value="87%" label="Alinhamento" hint="últimos 12 meses" />
      <Stat value="42" label="Votações" hint="no banco" />
      <Stat value="R$ 187.472,95" label="Gastos" hint="no mandato" />
      <Stat value="Diária" label="Frequência" hint="média do plenário" />
    </StatGroup>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Replicates a detail-page metrics row: 4-up start-aligned grid, no icons, with hint lines for context. Reflows to 2×2 below `md` (768 px).",
      },
    },
  },
};

// ─────────────────────────────────────────────────────────────────────────
// Tone (anticipatory — current real usage is all neutral; this story
// exercises the contract documented in Stat's JSDoc).
// ─────────────────────────────────────────────────────────────────────────

export const ToneNeutral: Story = {
  name: "Tone — neutral (default)",
  render: () => (
    <Stat
      value="87%"
      label="Alinhamento"
      hint="últimos 12 meses"
      tone="neutral"
    />
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Neutral tone renders the hint in `text-fg-tertiary` — the default hierarchical de-emphasis. Default value of `tone`.",
      },
    },
  },
};

export const ToneSuccess: Story = {
  name: "Tone — success",
  render: () => (
    <Stat value="87%" label="Alinhamento" hint="+3% no mês" tone="success" />
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Success tone tints the hint in `text-fg-success`. Value, label, and icon stay neutral — tone is hint-only by contract.",
      },
    },
  },
};

export const ToneWarning: Story = {
  name: "Tone — warning",
  render: () => (
    <Stat
      value="64%"
      label="Alinhamento"
      hint="abaixo da meta"
      tone="warning"
    />
  ),
  parameters: {
    docs: {
      description: {
        story: "Warning tone tints the hint in `text-fg-warning`.",
      },
    },
  },
};

export const ToneError: Story = {
  name: "Tone — error",
  render: () => (
    <Stat
      value="12%"
      label="Alinhamento"
      hint="crítico — abaixo de 30%"
      tone="error"
    />
  ),
  parameters: {
    docs: {
      description: {
        story: "Error tone tints the hint in `text-fg-error`.",
      },
    },
  },
};

// ─────────────────────────────────────────────────────────────────────────
// Empty state
// ─────────────────────────────────────────────────────────────────────────

export const EmptyState: Story = {
  name: "Empty state — null/undefined value",
  render: () => (
    <StatGroup layout="grid" cols={4}>
      <Stat value={null} label="Alinhamento" hint="sem orientação no período" />
      <Stat value={0} label="Votos" hint="nenhum no banco — valor legítimo" />
      <Stat value="" label="Sem rótulo" hint="string vazia — valor legítimo" />
      <Stat value={undefined} label="Frequência" hint="sem dados disponíveis" />
    </StatGroup>
  ),
  parameters: {
    docs: {
      description: {
        story: `
The empty-state em-dash fires only on \`null\` or \`undefined\` — other falsy values render as-is.

The em-dash carries \`aria-label="No data"\` on its wrapper so screen readers announce "no data" rather than reading the glyph aloud as "em dash" or "travessão" (Portuguese). The aria-label is hard-coded in English in this version; a Portuguese-app consumer hearing "no data" in English is a known inconsistency accepted for now — i18n would require an \`emptyLabel\` prop in a follow-up.

This story renders four cells side by side: \`null\` and \`undefined\` activate the empty state; \`0\` and \`""\` are legitimate values and render as-is. Compare them at a glance to confirm the differentiation.
        `,
      },
    },
  },
};

// ─────────────────────────────────────────────────────────────────────────
// cols variations
// ─────────────────────────────────────────────────────────────────────────

export const ColsThree: Story = {
  name: "Grid cols=3 — odd item count",
  render: () => (
    <StatGroup layout="grid" cols={3}>
      <Stat value="9,4 mil" label="Parlamentares" hint="ativos" />
      <Stat value="3,2 mil" label="Proposições" hint="em tramitação" />
      <Stat value="1,1 mil" label="Votações" hint="no semestre" />
      <Stat value="42" label="Comissões" hint="permanentes" />
    </StatGroup>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "`cols=3` with four `Stat`s — the fourth item rolls to a second row. The 1-px divider technique covers both axes automatically, so the orphan on the second row is visually integrated, not floating.",
      },
    },
  },
};

export const ColsTwo: Story = {
  name: "Grid cols=2 — mobile-shaped on every breakpoint",
  render: () => (
    <StatGroup layout="grid" cols={2}>
      <Stat value="87%" label="Alinhamento" hint="últimos 12 meses" />
      <Stat value="R$ 187.472,95" label="Gastos" hint="no mandato" />
    </StatGroup>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "`cols=2` stays 2-up at every breakpoint — useful when you only have two metrics or want the visual density consistent across viewports.",
      },
    },
  },
};

// ─────────────────────────────────────────────────────────────────────────
// floatingBadge slot
// ─────────────────────────────────────────────────────────────────────────

export const FloatingBadge: Story = {
  name: "floatingBadge — provenance seal over top border",
  render: () => (
    <StatGroup
      layout="strip"
      floatingBadge={
        <Badge variant="success" size="sm">
          <ShieldCheck size={12} aria-hidden="true" className="mr-1" />
          Fonte oficial
        </Badge>
      }
    >
      <Stat
        icon={<Users size={20} aria-hidden="true" />}
        value="726"
        label="Parlam."
        align="center"
      />
      <Stat
        icon={<FileText size={20} aria-hidden="true" />}
        value="28,1 mil"
        label="Proposições"
        align="center"
      />
      <Stat
        icon={<Vote size={20} aria-hidden="true" />}
        value="1,1 mil"
        label="Votações"
        align="center"
      />
    </StatGroup>
  ),
  parameters: {
    docs: {
      description: {
        story: `
Demonstrates the \`floatingBadge\` slot: an opaque \`ReactNode\` rendered
centred over the top border of the group container. Use when **all** metrics
in the group share a common provenance mark (e.g. a trust badge, data-source
seal, tier label).

The consumer owns the badge's shape, style, and a11y — \`StatGroup\` provides
only the positioning. The badge node appears in the DOM **before** the stat
cells so screen readers encounter the provenance mark first.

\`StatGroup\` adds \`pt-4\` (16 px) when \`floatingBadge\` is present so the
first stat row does not collide with the badge's bottom half. This is
calibrated for badges up to ~32 px tall. Pass a custom \`className\` to
increase the spacing for taller badges.
        `,
      },
    },
  },
};

export const FloatingBadgeGrid: Story = {
  name: "floatingBadge — grid layout",
  render: () => (
    <StatGroup
      layout="grid"
      cols={3}
      floatingBadge={
        <Badge variant="info" size="sm">
          <ShieldCheck size={12} aria-hidden="true" className="mr-1" />
          Dado oficial
        </Badge>
      }
    >
      <Stat
        value="87%"
        label="Alinhamento"
        hint="últimos 12 m"
        tone="success"
      />
      <Stat value="R$ 187.472,95" label="Gastos" hint="no mandato" />
      <Stat value="42" label="Votações" hint="no banco" />
    </StatGroup>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'The `floatingBadge` slot works identically on `layout="grid"` — the badge floats over the top border, and the grid divider technique is unaffected.',
      },
    },
  },
};

// ─────────────────────────────────────────────────────────────────────────
// Standalone — Stat without a Group
// ─────────────────────────────────────────────────────────────────────────

export const StandaloneStat: Story = {
  name: "Standalone Stat (no group)",
  render: () => (
    <div style={{ maxWidth: 320 }}>
      <Stat
        icon={<Users size={20} aria-hidden="true" />}
        value="9,4 mil"
        label="Parlamentares"
        hint="câmara + senado"
        align="start"
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "`Stat` outside a `StatGroup` is legitimate — a single hero metric. The 1-px divider technique applies only when stats are siblings inside a `StatGroup`; standalone, the `Stat` carries its own `bg-surface-base` and stands as a self-contained block.",
      },
    },
  },
};
