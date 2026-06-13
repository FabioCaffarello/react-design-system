/**
 * HeroSection Stories
 *
 * Top-of-page hero with kicker / title / description / actions / kpis / meta
 * slots, three visual treatments (plain / gradient / gradient-glow), and two
 * alignments (start / center).
 */

import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import { Users, FileText, Vote } from "lucide-react";
import HeroSection from "./HeroSection";
import { Button } from "../../primitives/Button/Button";
import Stat from "../Stat/Stat";
import { StatGroup } from "../Stat/StatGroup";

const onPrimary = fn();

const meta: Meta<typeof HeroSection> = {
  title: "Components/HeroSection",
  component: HeroSection,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: `
## HeroSection

Top-of-page hero — a page/landing **introduction** with visual identity and
slots for KPIs and metadata. Distinct from \`PageHeader\` (contextual
navigation: breadcrumb + title + actions).

### Slots

- **kicker** — eyebrow above the title (uppercase, brand-colored)
- **title** *(required)* — rendered as the section's \`<h1>\`
- **description** — supporting copy (readable measure)
- **actions** — CTA buttons
- **kpis** — opaque slot, typically a \`<StatGroup>\`
- **meta** — low-emphasis metadata line

Every slot except \`title\` collapses cleanly when omitted.

### Variants

- **plain** — no decorative background
- **gradient** — soft brand→secondary wash (theme-aware)
- **gradient-glow** — wash + brand glow, for landing/home emphasis

### Accessibility

Renders as a named \`<section>\` landmark. A string \`title\` becomes the
region's accessible name automatically; a rich (non-string) \`title\` needs an
explicit \`aria-label\` / \`aria-labelledby\`.
        `,
      },
    },
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["plain", "gradient", "gradient-glow"],
      description: "Visual treatment of the hero surface",
    },
    align: {
      control: "inline-radio",
      options: ["start", "center"],
      description: "Block alignment of the content",
    },
    title: { control: "text" },
    kicker: { control: "text" },
    description: { control: "text" },
    meta: { control: "text" },
  },
};

export default meta;
type Story = StoryObj<typeof HeroSection>;

const sampleActions = (
  <>
    <Button variant="primary" onClick={onPrimary}>
      Começar
    </Button>
    <Button variant="outline">Saiba mais</Button>
  </>
);

const sampleKpis = (
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
  </StatGroup>
);

/**
 * Default — plain treatment, start-aligned, with kicker, description and
 * actions.
 */
export const Default: Story = {
  args: {
    kicker: "Transparência",
    title: "Acompanhe o Congresso em tempo real",
    description:
      "Proposições, votações e parlamentares — tudo em um só lugar, atualizado diariamente.",
    actions: sampleActions,
  },
};

/**
 * Plain — no decorative background; the hero is text + padding on whatever
 * surface it sits on.
 */
export const Plain: Story = {
  args: {
    variant: "plain",
    kicker: "Documentação",
    title: "Comece por aqui",
    description: "Guias, exemplos e referência da API.",
    meta: "Última atualização há 2 dias",
  },
};

/**
 * Gradient — soft brand→secondary wash. The gradient is composed from
 * semantic surface tokens, so it flips with the active theme.
 */
export const Gradient: Story = {
  args: {
    variant: "gradient",
    kicker: "Listagens",
    title: "Parlamentares",
    description: "9.428 perfis com histórico de votos e alinhamento.",
    actions: <Button variant="primary">Explorar</Button>,
  },
};

/**
 * Gradient-glow — the wash plus a brand-colored outer glow, for the home /
 * landing surface. Shown here with a KPI strip.
 */
export const GradientGlow: Story = {
  args: {
    variant: "gradient-glow",
    align: "center",
    kicker: "Brasil a Vera",
    title: "Política aberta, do seu jeito",
    description:
      "Dados oficiais do Congresso, organizados para qualquer cidadão acompanhar.",
    actions: sampleActions,
    kpis: sampleKpis,
    meta: "Fonte: dados abertos da Câmara e do Senado",
  },
};

/**
 * Centered — `align="center"` centers the text column, the actions row, and
 * the metadata line. KPIs always span the full width.
 */
export const Centered: Story = {
  args: {
    variant: "gradient",
    align: "center",
    title: "Compare parlamentares lado a lado",
    description: "Escolha até quatro perfis e veja onde eles divergem.",
    actions: <Button variant="primary">Comparar agora</Button>,
  },
};

/**
 * With KPIs — the `kpis` slot accepts any node; here a `<StatGroup>` grid.
 */
export const WithKpis: Story = {
  args: {
    variant: "plain",
    title: "Cobertura da base",
    description: "Quanto do Congresso já está mapeado.",
    kpis: (
      <StatGroup layout="grid" cols={3}>
        <Stat value="100%" label="Parlamentares" hint="câmara + senado" />
        <Stat
          value="98%"
          label="Proposições"
          hint="últimos 12 meses"
          tone="success"
        />
        <Stat
          value="76%"
          label="Votações"
          hint="em processamento"
          tone="warning"
        />
      </StatGroup>
    ),
  },
};

/**
 * Minimal — only the required title. Every other slot collapses with no
 * empty wrapper left behind.
 */
export const Minimal: Story = {
  args: {
    title: "Título mínimo",
  },
};

/**
 * Playground — drive every prop from the Controls panel.
 */
export const Playground: Story = {
  args: {
    variant: "gradient",
    align: "start",
    kicker: "Eyebrow",
    title: "Hero title",
    description: "A short supporting description for the hero section.",
    actions: <Button variant="primary">Action</Button>,
    meta: "Some metadata",
  },
};

/**
 * Interactive — verifies the title renders as the page heading, the hero is
 * exposed as a named region landmark, and an action button's callback fires.
 */
export const Interactive: Story = {
  args: {
    title: "Acompanhe o Congresso",
    description: "Tudo em um só lugar.",
    actions: sampleActions,
  },
  play: async ({ canvasElement }) => {
    onPrimary.mockClear();
    const canvas = within(canvasElement);

    // Title is the page's level-1 heading.
    expect(
      canvas.getByRole("heading", { level: 1, name: /acompanhe o congresso/i }),
    ).toBeInTheDocument();

    // The string title names the <section> region landmark.
    expect(
      canvas.getByRole("region", { name: /acompanhe o congresso/i }),
    ).toBeInTheDocument();

    // The primary CTA is operable.
    await userEvent.click(canvas.getByRole("button", { name: /começar/i }));
    expect(onPrimary).toHaveBeenCalledTimes(1);
  },
};
