import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import EmptyState from "./EmptyState";

describe("EmptyState", () => {
  // ── Baseline rendering ────────────────────────────────────────────────────

  it("renders title and message", () => {
    render(<EmptyState title="No items" message="No items found" />);
    expect(screen.getByText("No items")).toBeInTheDocument();
    expect(screen.getByText("No items found")).toBeInTheDocument();
  });

  it("renders title only when message is omitted", () => {
    render(<EmptyState title="Nothing here" />);
    expect(screen.getByText("Nothing here")).toBeInTheDocument();
    expect(screen.queryByRole("paragraph")).not.toBeInTheDocument();
  });

  it("does not render a <p> element when message is absent", () => {
    const { container } = render(<EmptyState title="Empty" />);
    expect(container.querySelector("p")).not.toBeInTheDocument();
  });

  // ── actionLabel + onAction (legacy pair) ──────────────────────────────────

  it("renders action button when actionLabel and onAction are provided", () => {
    const handleAction = vi.fn();
    render(
      <EmptyState
        title="No items"
        message="No items found"
        actionLabel="Create Item"
        onAction={handleAction}
      />,
    );

    const button = screen.getByText("Create Item");
    expect(button).toBeInTheDocument();
    button.click();
    expect(handleAction).toHaveBeenCalledTimes(1);
  });

  it("does not render an action button when only actionLabel is given (no onAction)", () => {
    render(<EmptyState title="Empty" message="Empty." actionLabel="Add" />);
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  // ── action slot (ReactNode) ───────────────────────────────────────────────

  it("renders the action slot when provided", () => {
    render(
      <EmptyState
        title="Sem resultados"
        action={<a href="/lista">Limpar filtros</a>}
      />,
    );
    const link = screen.getByRole("link", { name: "Limpar filtros" });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/lista");
  });

  it("action slot takes priority over actionLabel+onAction", () => {
    const onAction = vi.fn();
    render(
      <EmptyState
        title="Empty"
        action={<a href="/?reset">Reset</a>}
        actionLabel="Button fallback"
        onAction={onAction}
      />,
    );
    // The slot wins — link is rendered
    expect(screen.getByRole("link", { name: "Reset" })).toBeInTheDocument();
    // The button is NOT rendered
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("renders action slot without a message (title-only empty state)", () => {
    render(
      <EmptyState
        title="Nenhum filtro ativo"
        action={<a href="/">Voltar</a>}
      />,
    );
    expect(screen.getByText("Nenhum filtro ativo")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Voltar" })).toBeInTheDocument();
  });

  // ── Illustration ──────────────────────────────────────────────────────────

  it("renders illustration when provided", () => {
    const illustration = <div data-testid="illustration">Illustration</div>;
    render(
      <EmptyState
        title="No items"
        message="No items found"
        illustration={illustration}
      />,
    );
    expect(screen.getByTestId("illustration")).toBeInTheDocument();
  });

  // ── aria-label ────────────────────────────────────────────────────────────

  it("aria-label is 'title. message' when message is present", () => {
    render(<EmptyState title="Empty" message="Try again." />);
    expect(screen.getByRole("status")).toHaveAttribute(
      "aria-label",
      "Empty. Try again.",
    );
  });

  it("aria-label is just the title when message is absent", () => {
    render(<EmptyState title="Nada aqui" />);
    expect(screen.getByRole("status")).toHaveAttribute(
      "aria-label",
      "Nada aqui",
    );
  });

  // ── className ─────────────────────────────────────────────────────────────

  it("applies custom className", () => {
    const { container } = render(
      <EmptyState
        title="No items"
        message="No items found"
        className="custom-class"
      />,
    );
    expect(container.firstChild).toHaveClass("custom-class");
  });
});
