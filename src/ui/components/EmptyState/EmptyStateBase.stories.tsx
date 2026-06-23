import type { Meta, StoryObj } from "@storybook/react-vite";
import EmptyStateBase from "./EmptyStateBase";

const meta: Meta<typeof EmptyStateBase> = {
  title: "Components/EmptyStateBase",
  component: EmptyStateBase,
};
export default meta;

type Story = StoryObj<typeof EmptyStateBase>;

export const TitleOnly: Story = {
  args: {
    title: "Sem resultados",
  },
};

export const WithMessage: Story = {
  args: {
    title: "Sem resultados",
    message: "Nenhum parlamentar encontrado para esses filtros.",
  },
};

export const WithLinkAction: Story = {
  name: "With link action (server-safe)",
  args: {
    title: "Sem resultados",
    message: "Nenhum parlamentar encontrado.",
    action: <a href="/">Limpar filtros</a>,
  },
};

export const WithIllustration: Story = {
  args: {
    title: "Nenhum documento",
    message: "Crie um novo documento para começar.",
    illustration: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={48}
        height={48}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"
        />
      </svg>
    ),
    action: <a href="/novo">Criar documento</a>,
  },
};

export const ZeroJsListingPage: Story = {
  name: "Zero-JS listing page (server-safe demo)",
  render: () => (
    <div style={{ maxWidth: 480 }}>
      <EmptyStateBase
        title="Nenhuma proposição encontrada"
        message="Tente ajustar os filtros ou ampliar o intervalo de datas."
        action={<a href="/?reset">Limpar todos os filtros</a>}
      />
    </div>
  ),
};
