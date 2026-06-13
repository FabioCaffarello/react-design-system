/**
 * TabsAsLinks Stories
 *
 * Tabs rendered as URL navigation links — server-safe, active state decided by
 * the caller. Uses the navigation pattern (named <nav> + aria-current), not
 * the interactive tab-widget pattern.
 */

import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { LayoutDashboard, Bell, Settings } from "lucide-react";
import TabsAsLinks from "./TabsAsLinks";

const meta: Meta<typeof TabsAsLinks> = {
  title: "Components/TabsAsLinks",
  component: TabsAsLinks,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: `
## TabsAsLinks

Tabs rendered as **navigation links**, with the active tab decided by the
caller (from the URL) — not by interactive state. The server-safe counterpart
to the \`Tabs\` widget; use it for tab bars whose selection lives in the URL
(\`?tab=\`, \`/section\`) so they work without JavaScript.

Because each tab links to a distinct destination, it uses the **navigation**
pattern: a named \`<nav>\` landmark with \`aria-current="page"\` on the active
link (NOT \`role="tab"\`).

### Accessible name

Pass \`aria-label\` (or \`aria-labelledby\`) so screen-reader users can tell
multiple tab bars apart. A dev warning fires if the landmark is anonymous.

### Router links

Defaults to a plain \`<a>\` (zero JS). Pass \`linkComponent={Link}\` to keep a
router's client-side navigation:

\`\`\`tsx
<TabsAsLinks aria-label="Painel" linkComponent={Link} items={items} />
\`\`\`
        `,
      },
    },
  },
  argTypes: {
    variant: {
      control: "inline-radio",
      options: ["default", "sub"],
      description: "Visual hierarchy: primary tab bar vs nested sub-tabs",
    },
  },
};

export default meta;
type Story = StoryObj<typeof TabsAsLinks>;

/**
 * Default — a primary tab bar. The active tab carries the brand underline and
 * `aria-current="page"`.
 */
export const Default: Story = {
  args: {
    "aria-label": "Painel",
    items: [
      { label: "Visão geral", href: "?tab=overview", active: true },
      { label: "Parlamentares", href: "?tab=parlamentares" },
      { label: "Proposições", href: "?tab=proposicoes" },
      { label: "Votações", href: "?tab=votacoes" },
    ],
  },
};

/**
 * Sub — the nested tier (lighter track, smaller text), for `?subtab=` rows.
 */
export const Sub: Story = {
  args: {
    "aria-label": "Sub-navegação de parlamentares",
    variant: "sub",
    items: [
      { label: "Câmara", href: "?subtab=camara", active: true },
      { label: "Senado", href: "?subtab=senado" },
    ],
  },
};

/**
 * With icons — a decorative leading icon per tab (marked `aria-hidden`).
 */
export const WithIcons: Story = {
  args: {
    "aria-label": "Painel",
    items: [
      {
        label: "Visão geral",
        href: "?tab=overview",
        active: true,
        icon: <LayoutDashboard size={16} aria-hidden="true" />,
      },
      {
        label: "Alertas",
        href: "?tab=alerts",
        icon: <Bell size={16} aria-hidden="true" />,
      },
      {
        label: "Configurações",
        href: "?tab=settings",
        icon: <Settings size={16} aria-hidden="true" />,
      },
    ],
  },
};

/**
 * With counts — a trailing count badge becomes part of each tab's accessible
 * name ("Alertas 3").
 */
export const WithCounts: Story = {
  args: {
    "aria-label": "Painel",
    items: [
      { label: "Tudo", href: "?tab=all", active: true, count: 128 },
      { label: "Alertas", href: "?tab=alerts", count: 3 },
      { label: "Arquivados", href: "?tab=archived", count: 0 },
    ],
  },
};

/**
 * Playground — drive the variant from Controls.
 */
export const Playground: Story = {
  args: {
    "aria-label": "Painel",
    variant: "default",
    items: [
      { label: "One", href: "?tab=one", active: true },
      { label: "Two", href: "?tab=two", count: 5 },
      { label: "Three", href: "?tab=three" },
    ],
  },
};

/**
 * Interactive — verifies the navigation landmark, the link set, and that the
 * active tab carries `aria-current="page"`.
 */
export const Interactive: Story = {
  args: {
    "aria-label": "Painel",
    items: [
      { label: "Visão geral", href: "?tab=overview", active: true },
      { label: "Alertas", href: "?tab=alerts", count: 3 },
    ],
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    expect(
      canvas.getByRole("navigation", { name: "Painel" }),
    ).toBeInTheDocument();
    expect(canvas.getAllByRole("link")).toHaveLength(2);
    expect(canvas.getByRole("link", { name: "Visão geral" })).toHaveAttribute(
      "aria-current",
      "page",
    );
  },
};
