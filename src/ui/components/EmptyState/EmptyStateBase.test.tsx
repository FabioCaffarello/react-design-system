import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import EmptyStateBase from "./EmptyStateBase";

describe("EmptyStateBase", () => {
  // ── Core rendering ────────────────────────────────────────────────────────

  it("renders the title", () => {
    render(<EmptyStateBase title="Sem resultados" />);
    expect(
      screen.getByRole("heading", { name: "Sem resultados" }),
    ).toBeInTheDocument();
  });

  it("renders title + message when both are provided", () => {
    render(<EmptyStateBase title="Vazio" message="Tente outro filtro." />);
    expect(screen.getByText("Vazio")).toBeInTheDocument();
    expect(screen.getByText("Tente outro filtro.")).toBeInTheDocument();
  });

  it("does NOT render a <p> when message is absent", () => {
    const { container } = render(<EmptyStateBase title="Nada aqui" />);
    expect(container.querySelector("p")).not.toBeInTheDocument();
  });

  // ── Action slot ───────────────────────────────────────────────────────────

  it("renders the action slot when provided", () => {
    render(
      <EmptyStateBase
        title="Sem resultados"
        action={<a href="/?reset">Limpar filtros</a>}
      />,
    );
    const link = screen.getByRole("link", { name: "Limpar filtros" });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/?reset");
  });

  it("renders no action element when action is absent", () => {
    render(<EmptyStateBase title="Nada" />);
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("renders a ReactNode action (e.g. a styled button element)", () => {
    render(
      <EmptyStateBase
        title="Vazio"
        action={<button type="button">Criar</button>}
      />,
    );
    expect(screen.getByRole("button", { name: "Criar" })).toBeInTheDocument();
  });

  // ── Illustration ──────────────────────────────────────────────────────────

  it("renders the illustration when provided", () => {
    render(
      <EmptyStateBase
        title="Vazio"
        illustration={<div data-testid="illo">★</div>}
      />,
    );
    expect(screen.getByTestId("illo")).toBeInTheDocument();
  });

  it("wraps the illustration in an aria-hidden container", () => {
    const { container } = render(
      <EmptyStateBase
        title="Vazio"
        illustration={<div data-testid="illo">★</div>}
      />,
    );
    const hidden = container.querySelector('[aria-hidden="true"]');
    expect(hidden).toContainHTML('data-testid="illo"');
  });

  it("does NOT render an illustration wrapper when illustration is absent", () => {
    const { container } = render(<EmptyStateBase title="Vazio" />);
    expect(
      container.querySelector('[aria-hidden="true"]'),
    ).not.toBeInTheDocument();
  });

  // ── ARIA ──────────────────────────────────────────────────────────────────

  it("has role=status with aria-live=polite", () => {
    render(<EmptyStateBase title="Vazio" />);
    const region = screen.getByRole("status");
    expect(region).toHaveAttribute("aria-live", "polite");
  });

  it("aria-label is 'title. message' when message is present", () => {
    render(<EmptyStateBase title="Sem itens" message="Tente mais tarde." />);
    expect(screen.getByRole("status")).toHaveAttribute(
      "aria-label",
      "Sem itens. Tente mais tarde.",
    );
  });

  it("aria-label is just the title when message is absent", () => {
    render(<EmptyStateBase title="Nada aqui" />);
    expect(screen.getByRole("status")).toHaveAttribute(
      "aria-label",
      "Nada aqui",
    );
  });

  // ── Server-safe invariant ─────────────────────────────────────────────────

  it("does NOT hold state — no hooks (server-safe invariant)", () => {
    // EmptyStateBase must render correctly without any React state.
    // All content is fully determined by props at render time.
    const { container } = render(
      <EmptyStateBase
        title="Sem resultados"
        message="Nenhum parlamentar encontrado."
        illustration={<span data-testid="icon">📋</span>}
        action={<a href="/">Voltar</a>}
      />,
    );
    // Heading, body, illustration, and action all present with zero interactivity
    expect(screen.getByRole("heading")).toBeInTheDocument();
    expect(screen.getByTestId("icon")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Voltar" })).toBeInTheDocument();
    expect(container.querySelector("p")).toBeInTheDocument();
  });

  // ── Ref forwarding ────────────────────────────────────────────────────────

  it("forwards ref to the wrapper div", () => {
    let capturedRef: HTMLDivElement | null = null;
    render(
      <EmptyStateBase
        ref={(el) => {
          capturedRef = el;
        }}
        title="Test"
      />,
    );
    expect(capturedRef).toBeInstanceOf(HTMLDivElement);
  });

  // ── Extra props / className ───────────────────────────────────────────────

  it("merges custom className", () => {
    const { container } = render(
      <EmptyStateBase title="Test" className="my-custom" />,
    );
    expect(container.firstChild).toHaveClass("my-custom");
    expect(container.firstChild).toHaveClass("flex");
  });

  it("spreads extra HTML attributes onto the wrapper div", () => {
    render(<EmptyStateBase title="Test" data-testid="es-base" />);
    expect(screen.getByTestId("es-base")).toBeInTheDocument();
  });
});
