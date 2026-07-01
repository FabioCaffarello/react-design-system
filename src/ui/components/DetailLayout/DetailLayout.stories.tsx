import type { Meta, StoryObj } from "@storybook/react-vite";
import { Vote, Wallet, FileText, Users, BarChart } from "lucide-react";
import { DetailLayout } from "./DetailLayout";
import Text from "../../primitives/Text/Text";
import { Stack } from "../../layouts/Stack/Stack";
import Badge from "../../primitives/Badge/Badge";

const meta: Meta<typeof DetailLayout> = {
  title: "Components/DetailLayout",
  component: DetailLayout,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: `
## DetailLayout

Responsive detail-page shell that eliminates the triple-declaration problem.

Instead of declaring sections in three separate places (sidebar nav items,
Accordion items, SectionCard stack), pass a single \`sections[]\` and
\`DetailLayout\` derives all three views automatically.

### Desktop
- **Left**: sticky \`SectionNav\` sidebar (scroll-spy highlight).
- **Right**: stack of \`SectionCard\` sections (anchor targets + \`scroll-margin-top\`).

### Mobile
- SectionNav sidebar is hidden; sections collapse into a \`multiple\`-mode \`Accordion\`.

### Client Component
\`DetailLayout\` is \`"use client"\` — it composes \`SectionNav\` (uses
\`useScrollSpy\`) and \`Accordion\` (uses \`useState\`). Individual \`content\`
slots may be RSC.

### Avoids triple-declaration boilerplate
\`\`\`tsx
// ❌ Before: sections declared in 3 places
const navItems = sections.map(s => ({ id: s.id, label: s.navLabel }))
const accordionItems = sections.map(s => ({ id: s.id, title: s.title, content: s.content }))
const cards = sections.map(s => <SectionCard key={s.id} {...s} />)

// ✅ After: single source of truth
<DetailLayout sections={sections} stickyNavTop="3.5rem" />
\`\`\`
        `,
      },
    },
  },
  argTypes: {
    stickyNavTop: { control: "text" },
    navAriaLabel: { control: "text" },
  },
};

export default meta;
type Story = StoryObj<typeof DetailLayout>;

const sampleSections = [
  {
    id: "votos",
    navLabel: "Votações",
    navIcon: <Vote aria-hidden="true" size={16} />,
    title: "Votações Recentes",
    subtitle: "Últimos 30 dias",
    content: (
      <Stack gap="sm">
        <Text>Votação 1 — Aprovado</Text>
        <Text>Votação 2 — Rejeitado</Text>
        <Text>Votação 3 — Absteve</Text>
      </Stack>
    ),
  },
  {
    id: "gastos",
    navLabel: "Gastos",
    navIcon: <Wallet aria-hidden="true" size={16} />,
    title: "Gastos CEAP",
    badge: <Badge variant="outline">R$ 35k</Badge>,
    content: (
      <Stack gap="sm">
        <Text>Passagens aéreas — R$ 12.000</Text>
        <Text>Combustível — R$ 8.500</Text>
        <Text>Hospedagem — R$ 14.500</Text>
      </Stack>
    ),
  },
  {
    id: "proposicoes",
    navLabel: "Proposições",
    navIcon: <FileText aria-hidden="true" size={16} />,
    title: "Proposições Apresentadas",
    subtitle: "Legislatura 2023–2027",
    badge: <Badge>42</Badge>,
    content: (
      <Stack gap="sm">
        <Text>PL 1234/2024 — Em tramitação</Text>
        <Text>PDL 567/2023 — Aprovado</Text>
      </Stack>
    ),
  },
];

export const Default: Story = {
  args: {
    sections: sampleSections,
    navAriaLabel: "Page sections",
  },
};

export const WithHeaderAndStats: Story = {
  args: {
    breadcrumb: (
      <nav aria-label="Breadcrumb">
        <Text>
          <a href="/">Home</a> / <a href="/parlamentares">Parlamentares</a> /
          Fulano de Tal
        </Text>
      </nav>
    ),
    header: (
      <Stack gap="xs">
        <Text as="h1" size="xl" weight="bold">
          Fulano de Tal
        </Text>
        <Text color="secondary">Partido ABC — Estado SP</Text>
      </Stack>
    ),
    stats: (
      <div
        style={{
          display: "flex",
          gap: "1rem",
          padding: "1rem",
          background: "var(--color-surface-subtle)",
          borderRadius: "0.5rem",
        }}
      >
        <Text>Votações: 342</Text>
        <Text>Alinhamento: 87%</Text>
        <Text>Faltas: 12</Text>
      </div>
    ),
    sections: sampleSections,
    stickyNavTop: "0",
    navAriaLabel: "Seções do perfil",
  },
};

export const WithStickyOffset: Story = {
  name: "WithStickyOffset (3.5rem navbar)",
  args: {
    sections: sampleSections,
    stickyNavTop: "3.5rem",
    navAriaLabel: "Page sections",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Set `stickyNavTop` to the navbar height. It's applied as `top` on the SectionNav and as `scroll-margin-top` on every SectionCard.",
      },
    },
  },
};

export const WithDesktopGrid: Story = {
  name: "WithDesktopGridIds (votos + gastos side-by-side)",
  args: {
    sections: [
      {
        id: "votos",
        navLabel: "Votações",
        navIcon: <Vote aria-hidden="true" size={16} />,
        title: "Votações",
        content: (
          <>
            <Text weight="semibold">Aprovadas</Text>
            <Text>12</Text>
          </>
        ),
      },
      {
        id: "gastos",
        navLabel: "Gastos",
        navIcon: <Wallet aria-hidden="true" size={16} />,
        title: "Gastos",
        content: (
          <>
            <Text weight="semibold">Total</Text>
            <Text>R$ 35k</Text>
          </>
        ),
      },
      {
        id: "proposicoes",
        navLabel: "Proposições",
        navIcon: <FileText aria-hidden="true" size={16} />,
        title: "Proposições",
        content: <Text>Lista de proposições apresentadas na legislatura.</Text>,
      },
    ],
    desktopGridIds: ["votos", "gastos"],
    navAriaLabel: "Page sections",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Sections listed in `desktopGridIds` have their content wrapped in a 2-column grid on desktop.",
      },
    },
  },
};

export const WithDefaultOpenMobile: Story = {
  name: "WithDefaultOpenMobile (gastos)",
  args: {
    sections: sampleSections,
    defaultOpenMobile: ["gastos"],
    navAriaLabel: "Page sections",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Override which Accordion panel opens by default on mobile. Default is the first section.",
      },
    },
  },
};

export const ManySections: Story = {
  args: {
    sections: [
      {
        id: "identificacao",
        navLabel: "Identificação",
        navIcon: <Users aria-hidden="true" size={16} />,
        content: <Text>Dados de identificação.</Text>,
      },
      {
        id: "votos",
        navLabel: "Votações",
        navIcon: <Vote aria-hidden="true" size={16} />,
        content: <Text>Histórico de votações.</Text>,
      },
      {
        id: "gastos",
        navLabel: "Gastos",
        navIcon: <Wallet aria-hidden="true" size={16} />,
        content: <Text>Gastos parlamentares.</Text>,
      },
      {
        id: "proposicoes",
        navLabel: "Proposições",
        navIcon: <FileText aria-hidden="true" size={16} />,
        content: <Text>Proposições apresentadas.</Text>,
      },
      {
        id: "stats",
        navLabel: "Estatísticas",
        navIcon: <BarChart aria-hidden="true" size={16} />,
        content: <Text>Estatísticas de desempenho.</Text>,
      },
    ],
    navAriaLabel: "Page sections",
  },
};

export const Minimal: Story = {
  args: {
    sections: [
      { id: "s1", navLabel: "Seção 1", content: <Text>Conteúdo 1</Text> },
      { id: "s2", navLabel: "Seção 2", content: <Text>Conteúdo 2</Text> },
    ],
    navAriaLabel: "Page sections",
  },
};
