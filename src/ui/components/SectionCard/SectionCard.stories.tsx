import type { Meta, StoryObj } from "@storybook/react-vite";
import { FileText, Wallet, Vote, Users } from "lucide-react";
import { SectionCard } from "./SectionCard";
import Badge from "../../primitives/Badge/Badge";
import { Text } from "../../primitives/Text/Text";
import { Stack } from "../../layouts/Stack/Stack";

const meta: Meta<typeof SectionCard> = {
  title: "Components/SectionCard",
  component: SectionCard,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: `
## SectionCard

A semantic content section card with built-in anchor-navigation and sticky-navbar support.

Wraps the \`Card\` compound (\`asSection\` variant) with:
- an \`id\` that doubles as the anchor target for \`href="#section-id"\` links
- \`scroll-margin-top\` to keep the heading visible below a sticky navbar
- \`icon\` / \`badge\` slots on the header
- an auto-wired \`aria-labelledby\` so screen readers announce the section name

Server-safe: no hooks, no event handlers on DOM elements.

### With SectionNav

\`SectionCard\` is the content side of the section-nav pattern. Pair it
with \`SectionNav\` (which consumes \`useScrollSpy\`) on the same page:

\`\`\`tsx
// Server Component
<SectionCard id="votos" title="Votações" scrollOffset="3.5rem">
  <VotacoesRecentes />
</SectionCard>

// Client Component (sidebar)
<SectionNav
  items={[{ id: 'votos', label: 'Votações' }]}
  stickyTop="3.5rem"
/>
\`\`\`
        `,
      },
    },
  },
  argTypes: {
    scrollOffset: {
      control: "text",
      description:
        "CSS scroll-margin-top value. Compensates for a sticky navbar height.",
    },
  },
};

export default meta;
type Story = StoryObj<typeof SectionCard>;

export const Default: Story = {
  args: {
    id: "votos",
    title: "Votações Recentes",
    children: (
      <Text>
        Esta seção lista as últimas votações registradas no período selecionado.
      </Text>
    ),
  },
};

export const WithSubtitle: Story = {
  args: {
    id: "gastos",
    title: "Gastos CEAP",
    subtitle: "Cota para Exercício da Atividade Parlamentar — últimos 30 dias",
    children: (
      <Text>
        Resumo de despesas reembolsadas pela cota parlamentar no período.
      </Text>
    ),
  },
};

export const WithIconAndBadge: Story = {
  args: {
    id: "proposicoes",
    title: "Proposições",
    subtitle: "Projetos de lei e requerimentos",
    icon: <FileText aria-hidden="true" size={18} />,
    badge: <Badge variant="outline">L1</Badge>,
    children: (
      <Text>
        Listagem de proposições apresentadas ou relatadas pelo parlamentar.
      </Text>
    ),
  },
};

export const WithScrollOffset: Story = {
  name: "WithScrollOffset (3.5rem)",
  args: {
    id: "offset-section",
    title: "Seção com Offset",
    subtitle: "scroll-margin-top: 3.5rem — navbar de 56px",
    icon: <Wallet aria-hidden="true" size={18} />,
    scrollOffset: "3.5rem",
    children: (
      <Text>
        O atributo <code>scrollOffset</code> aplica{" "}
        <code>scroll-margin-top</code> via CSS inline para que o browser
        posicione o topo da seção abaixo da navbar ao navegar pelo hash.
      </Text>
    ),
  },
};

export const MinimalContent: Story = {
  args: {
    id: "minimal",
    title: "Seção Mínima",
  },
};

export const AsAnchorTarget: Story = {
  name: "AsAnchorTarget (grupo de seções)",
  render: () => (
    <Stack gap="base">
      <nav aria-label="Seções da página">
        <ul
          style={{
            display: "flex",
            gap: "1rem",
            listStyle: "none",
            padding: 0,
          }}
        >
          <li>
            <a href="#votos-group">Votações</a>
          </li>
          <li>
            <a href="#gastos-group">Gastos</a>
          </li>
          <li>
            <a href="#proposicoes-group">Proposições</a>
          </li>
        </ul>
      </nav>

      <SectionCard
        id="votos-group"
        title="Votações Recentes"
        icon={<Vote aria-hidden="true" size={18} />}
        subtitle="Últimos 30 dias"
        scrollOffset="0"
      >
        <Text>Conteúdo das votações.</Text>
      </SectionCard>

      <SectionCard
        id="gastos-group"
        title="Gastos CEAP"
        icon={<Wallet aria-hidden="true" size={18} />}
        badge={<Badge>R$ 35k</Badge>}
        scrollOffset="0"
      >
        <Text>Conteúdo dos gastos.</Text>
      </SectionCard>

      <SectionCard
        id="proposicoes-group"
        title="Proposições"
        icon={<FileText aria-hidden="true" size={18} />}
        subtitle="Projetos apresentados na legislatura"
        badge={<Badge variant="outline">42</Badge>}
        scrollOffset="0"
      >
        <Text>Conteúdo das proposições.</Text>
      </SectionCard>
    </Stack>
  ),
};

export const WithRichSlots: Story = {
  args: {
    id: "rich",
    title: "Perfil do Parlamentar",
    subtitle: "Câmara dos Deputados — SP",
    icon: <Users aria-hidden="true" size={18} />,
    badge: <Badge variant="success">Ativo</Badge>,
    scrollOffset: "3.5rem",
    children: (
      <Stack gap="sm">
        <Text>Nome: Fulano de Tal</Text>
        <Text>Partido: ABC</Text>
        <Text>Mandato: 2023–2027</Text>
      </Stack>
    ),
  },
};
