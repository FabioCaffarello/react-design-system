import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import EmptyStateBase from "./EmptyStateBase";

// ── Section 1: ARIA Labels and Roles ─────────────────────────────────────────

describe("ARIA Labels and Roles", () => {
  it("has role=status on the root element", () => {
    render(<EmptyStateBase title="Vazio" />);
    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("has aria-live=polite on the root element", () => {
    render(<EmptyStateBase title="Vazio" />);
    expect(screen.getByRole("status")).toHaveAttribute("aria-live", "polite");
  });

  it("aria-label is the title when message is absent", () => {
    render(<EmptyStateBase title="Sem resultados" />);
    expect(screen.getByRole("status")).toHaveAttribute(
      "aria-label",
      "Sem resultados",
    );
  });

  it("aria-label is 'title. message' when message is present", () => {
    render(
      <EmptyStateBase title="Sem resultados" message="Tente outro filtro." />,
    );
    expect(screen.getByRole("status")).toHaveAttribute(
      "aria-label",
      "Sem resultados. Tente outro filtro.",
    );
  });

  it("title renders as an h3 heading", () => {
    render(<EmptyStateBase title="Vazio" />);
    expect(screen.getByRole("heading", { level: 3 })).toHaveTextContent(
      "Vazio",
    );
  });

  it("the illustration wrapper has aria-hidden=true", () => {
    const { container } = render(
      <EmptyStateBase title="Vazio" illustration={<svg aria-label="icon" />} />,
    );
    const hidden = container.querySelector('[aria-hidden="true"]');
    expect(hidden).toBeInTheDocument();
  });

  it("allows the caller to override aria-label via prop", () => {
    render(
      <EmptyStateBase
        title="Vazio"
        message="Sem itens."
        aria-label="Resultado vazio"
      />,
    );
    expect(screen.getByRole("status")).toHaveAttribute(
      "aria-label",
      "Resultado vazio",
    );
  });
});

// ── Section 2: Keyboard Navigation ───────────────────────────────────────────

describe("Keyboard Navigation", () => {
  it("a link in the action slot is reachable by Tab", async () => {
    const user = userEvent.setup();
    render(
      <EmptyStateBase
        title="Vazio"
        action={<a href="/?reset">Limpar filtros</a>}
      />,
    );
    await user.tab();
    expect(screen.getByRole("link", { name: "Limpar filtros" })).toHaveFocus();
  });

  it("a button in the action slot is reachable by Tab", async () => {
    const user = userEvent.setup();
    render(
      <EmptyStateBase
        title="Vazio"
        action={<button type="button">Criar</button>}
      />,
    );
    await user.tab();
    expect(screen.getByRole("button", { name: "Criar" })).toHaveFocus();
  });
});

// ── Section 3: Focus Management ──────────────────────────────────────────────

describe("Focus Management", () => {
  it("the root element itself is not focusable by default", () => {
    render(<EmptyStateBase title="Vazio" />);
    const root = screen.getByRole("status");
    expect(root).not.toHaveAttribute("tabindex");
  });

  it("a focused link inside the action slot has visible focus (test-only: element receives focus)", async () => {
    const user = userEvent.setup();
    render(<EmptyStateBase title="Vazio" action={<a href="/">Voltar</a>} />);
    await user.tab();
    expect(document.activeElement?.tagName).toBe("A");
  });
});

// ── Section 4: Screen Reader Support ─────────────────────────────────────────

describe("Screen Reader Support", () => {
  it("the action link text is visible to assistive technology", () => {
    render(
      <EmptyStateBase title="Vazio" action={<a href="/">Limpar filtros</a>} />,
    );
    expect(
      screen.getByRole("link", { name: "Limpar filtros" }),
    ).toBeInTheDocument();
  });

  it("the message text is present in the accessibility tree", () => {
    render(<EmptyStateBase title="Vazio" message="Nenhum item encontrado." />);
    expect(screen.getByText("Nenhum item encontrado.")).toBeInTheDocument();
  });

  it("the illustration is hidden from the accessibility tree", () => {
    render(
      <EmptyStateBase title="Vazio" illustration={<span>decorative</span>} />,
    );
    // The illustration wrapper is aria-hidden; the text inside should not be
    // reachable by role/name queries.
    expect(screen.queryByText("decorative")).toBeInTheDocument(); // DOM present
    // but inaccessible — the hidden wrapper screens it from AT
    const hidden = document.querySelector('[aria-hidden="true"]');
    expect(hidden).not.toBeNull();
    expect(hidden).toContainElement(screen.queryByText("decorative"));
  });
});
