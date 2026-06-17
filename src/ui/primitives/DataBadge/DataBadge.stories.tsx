import type { Meta, StoryObj } from "@storybook/react-vite";
import { Building2, MapPin, ShieldCheck } from "lucide-react";
import DataBadge from "./DataBadge";

const meta: Meta<typeof DataBadge> = {
  title: "Primitives/DataBadge",
  component: DataBadge,
  parameters: {
    docs: {
      description: {
        component: `
## DataBadge

An inline metadata chip: a primary **label**, an optional lesser-emphasis
**source** sub-label (where the datum came from), a semantic **tone**, and
an optional decorative **icon**. Built for transparency/data UIs where a
value must travel with its provenance ("L2 · Portal Transparência").

Distinct from \`Badge\` (single-string status), \`Chip\` (selectable), and
\`Info\` (tooltip): only DataBadge carries a value + source pair.

Server-safe — ships from the \`./server\` entry.
        `,
      },
    },
  },
  argTypes: {
    label: { control: "text" },
    source: { control: "text" },
    tone: {
      control: "select",
      options: [
        "neutral",
        "success",
        "warning",
        "error",
        "info",
        "primary",
        "secondary",
        "dataviz",
      ],
    },
    size: { control: "select", options: ["sm", "md"] },
  },
};

export default meta;
type Story = StoryObj<typeof DataBadge>;

export const Default: Story = {
  args: {
    label: "Aprovada",
    tone: "success",
  },
};

export const WithSource: Story = {
  args: {
    label: "L2",
    source: "Portal Transparência",
    tone: "warning",
  },
};

export const Tones: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-2">
      <DataBadge label="Pendente" source="análise" tone="neutral" />
      <DataBadge label="Aprovada" source="Câmara" tone="success" />
      <DataBadge label="L2" source="Portal Transparência" tone="warning" />
      <DataBadge label="Rejeitada" source="Senado" tone="error" />
      <DataBadge label="Em pauta" source="agenda" tone="info" />
      <DataBadge label="Destaque" source="curadoria" tone="primary" />
      <DataBadge label="Arquivada" source="histórico" tone="secondary" />
      <DataBadge label="L3" source="análise" tone="dataviz" />
    </div>
  ),
};

export const CategoricalTone: Story = {
  name: "Categorical (data-viz) tone",
  render: () => (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap items-center gap-2">
        <DataBadge label="L1" source="oficial" tone="success" />
        <DataBadge label="L2" source="Portal Transparência" tone="warning" />
        <DataBadge label="L3" source="análise" tone="dataviz" />
      </div>
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <DataBadge label="L2" source="Câmara" tone="warning" size="sm" />
      <DataBadge label="L2" source="Câmara" tone="warning" size="md" />
    </div>
  ),
};

export const WithIcon: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-2">
      <DataBadge
        label="Aprovada"
        source="Câmara"
        tone="success"
        icon={<ShieldCheck />}
      />
      <DataBadge label="Brasília" source="DF" tone="info" icon={<MapPin />} />
      <DataBadge
        label="Executivo"
        source="órgão"
        tone="primary"
        icon={<Building2 />}
      />
    </div>
  ),
};

export const LabelOnly: Story = {
  args: {
    label: "Aprovada",
    tone: "success",
  },
};

export const Playground: Story = {
  args: {
    label: "L2",
    source: "Portal Transparência",
    tone: "warning",
    size: "md",
  },
};
