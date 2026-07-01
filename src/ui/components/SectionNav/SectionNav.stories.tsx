import type { Meta, StoryObj } from "@storybook/react-vite";
import { FileText, Wallet, Vote, Users, BarChart } from "lucide-react";
import { SectionNav } from "./SectionNav";

const meta: Meta<typeof SectionNav> = {
  title: "Components/SectionNav",
  component: SectionNav,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: `
## SectionNav

Sticky anchor navigation sidebar driven by \`useScrollSpy\`. Highlights
the section currently visible in the viewport.

- Client Component (\`"use client"\`) — wraps the RDS \`useScrollSpy\` hook.
- Marks the active link with \`aria-current="true"\`.
- Defaults to plain \`<a>\` links; pass \`linkComponent={Link}\` for client-side router navigation.
- Pair \`stickyTop\` with the same value as \`SectionCard\`'s \`scrollOffset\`.

### Navigation pattern

Each item links to a same-page anchor (\`href="#section-id"\`). This uses
the **navigation pattern** (real \`<a>\` links, \`aria-current="true"\`), NOT
the \`role="tab"\` pattern — tabs would promise arrow-key semantics that
anchor links don't have.

### Requires an accessible name

The \`<nav>\` landmark MUST have an accessible name. Pass \`aria-label\`
(e.g. \`"Page sections"\`) or \`aria-labelledby\` pointing to a heading.
        `,
      },
    },
  },
  argTypes: {
    stickyTop: {
      control: "text",
      description: 'CSS top value for sticky positioning (e.g. "3.5rem").',
    },
    rootMargin: {
      control: "text",
      description: "IntersectionObserver rootMargin forwarded to useScrollSpy.",
    },
  },
};

export default meta;
type Story = StoryObj<typeof SectionNav>;

const basicItems = [
  { id: "votos", label: "Votações" },
  { id: "gastos", label: "Gastos" },
  { id: "proposicoes", label: "Proposições" },
];

const itemsWithIcons = [
  {
    id: "votos",
    label: "Votações",
    icon: <Vote aria-hidden="true" size={16} />,
  },
  {
    id: "gastos",
    label: "Gastos",
    icon: <Wallet aria-hidden="true" size={16} />,
  },
  {
    id: "proposicoes",
    label: "Proposições",
    icon: <FileText aria-hidden="true" size={16} />,
  },
  {
    id: "perfil",
    label: "Perfil",
    icon: <Users aria-hidden="true" size={16} />,
  },
  {
    id: "stats",
    label: "Estatísticas",
    icon: <BarChart aria-hidden="true" size={16} />,
  },
];

export const Default: Story = {
  args: {
    items: basicItems,
    "aria-label": "Page sections",
  },
};

export const WithIcons: Story = {
  args: {
    items: itemsWithIcons,
    "aria-label": "Page sections",
  },
};

export const WithStickyOffset: Story = {
  name: "WithStickyOffset (3.5rem)",
  args: {
    items: itemsWithIcons,
    "aria-label": "Page sections",
    stickyTop: "3.5rem",
  },
};

export const WithCustomRootMargin: Story = {
  name: "WithCustomRootMargin (navbar compensation)",
  args: {
    items: itemsWithIcons,
    "aria-label": "Page sections",
    stickyTop: "3.5rem",
    rootMargin: "-56px 0px -50% 0px",
  },
  parameters: {
    docs: {
      description: {
        story:
          "When a sticky navbar is 56px tall, shift the root margin top by `-56px` so the scroll-spy fires when the section enters the visible area below the navbar.",
      },
    },
  },
};

export const NoIcons: Story = {
  args: {
    items: basicItems,
    "aria-label": "Page sections",
  },
};

export const ManyItems: Story = {
  args: {
    items: [
      {
        id: "s1",
        label: "Identificação",
        icon: <Users aria-hidden="true" size={16} />,
      },
      {
        id: "s2",
        label: "Votações",
        icon: <Vote aria-hidden="true" size={16} />,
      },
      {
        id: "s3",
        label: "Gastos CEAP",
        icon: <Wallet aria-hidden="true" size={16} />,
      },
      {
        id: "s4",
        label: "Proposições",
        icon: <FileText aria-hidden="true" size={16} />,
      },
      {
        id: "s5",
        label: "Estatísticas",
        icon: <BarChart aria-hidden="true" size={16} />,
      },
    ],
    "aria-label": "Page sections",
    stickyTop: "0",
  },
};

export const Playground: Story = {
  args: {
    items: itemsWithIcons,
    "aria-label": "Page sections",
    stickyTop: "0",
  },
};
