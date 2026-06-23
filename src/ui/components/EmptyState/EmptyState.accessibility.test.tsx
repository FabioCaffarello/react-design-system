/**
 * EmptyState Accessibility Tests
 *
 * Dedicated a11y test scaffold for EmptyState — the "no content"
 * status pattern used when a list, search, or section returns
 * nothing.
 *
 *   - ARIA Labels and Roles: role=status with aria-live=polite (so
 *     AT users hear the empty state when it appears, e.g. after a
 *     filter clears results); aria-label combines title + message
 *     for the AT-readable surface; illustration is aria-hidden;
 *     heading is rendered as `<h3>`
 *   - Keyboard Navigation: optional CTA button is keyboard-activatable
 *   - Focus Management: CTA button is in the tab order
 *   - Screen Reader Support: heading + body text are duplicated in
 *     aria-label so AT users get the full message in a single
 *     announce; illustration doesn't pollute the announcement
 *
 * Mirrors the structure of Header.accessibility.test.tsx as the
 * canonical scaffold for component-level a11y suites.
 */

import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import EmptyState from "./EmptyState";

describe("EmptyState Accessibility", () => {
  describe("ARIA Labels and Roles", () => {
    it("role=status with aria-live=polite", () => {
      render(
        <EmptyState title="No results" message="Try a different query." />,
      );

      const region = screen.getByRole("status");
      expect(region).toHaveAttribute("aria-live", "polite");
    });

    it("aria-label combines title and message into a single AT announce", () => {
      render(
        <EmptyState title="No results" message="Try a different query." />,
      );

      const region = screen.getByRole("status");
      expect(region).toHaveAttribute(
        "aria-label",
        "No results. Try a different query.",
      );
    });

    it("aria-label is just the title when message is absent (title-only variant)", () => {
      render(<EmptyState title="Nada aqui" />);
      expect(screen.getByRole("status")).toHaveAttribute(
        "aria-label",
        "Nada aqui",
      );
    });

    it("title renders as <h3> heading", () => {
      render(<EmptyState title="Nothing here" message="Add an item." />);

      const heading = screen.getByRole("heading", { name: "Nothing here" });
      expect(heading.tagName).toBe("H3");
    });

    it("illustration is aria-hidden (visual only)", () => {
      const { container } = render(
        <EmptyState
          title="Nothing here"
          message="Add an item."
          illustration={<div data-testid="illo">illo</div>}
        />,
      );

      // The illustration wrapper is aria-hidden so AT users don't hear
      // the visual symbol — the aria-label already carries the full
      // message.
      const hidden = container.querySelector('[aria-hidden="true"]');
      expect(hidden).toContainHTML('data-testid="illo"');
    });
  });

  describe("Keyboard Navigation", () => {
    it("CTA button activates onAction from the keyboard", async () => {
      const user = userEvent.setup();
      const onAction = vi.fn();
      render(
        <EmptyState
          title="Empty"
          message="Add an item."
          actionLabel="Add"
          onAction={onAction}
        />,
      );

      const cta = screen.getByRole("button", { name: "Add" });
      cta.focus();
      await user.keyboard("{Enter}");
      expect(onAction).toHaveBeenCalled();
    });
  });

  describe("Focus Management", () => {
    it("CTA button is in the natural tab order", async () => {
      const user = userEvent.setup();
      render(
        <EmptyState
          title="Empty"
          message="Add an item."
          actionLabel="Add"
          onAction={vi.fn()}
        />,
      );

      await user.tab();
      expect(screen.getByRole("button", { name: "Add" })).toHaveFocus();
    });
  });

  describe("Keyboard Navigation", () => {
    it("action slot link is in the natural tab order", async () => {
      const userEvent = await import("@testing-library/user-event");
      const user = userEvent.default.setup();
      render(
        <EmptyState
          title="Sem resultados"
          action={<a href="/?reset">Limpar filtros</a>}
        />,
      );

      await user.tab();
      expect(
        screen.getByRole("link", { name: "Limpar filtros" }),
      ).toHaveFocus();
    });
  });

  describe("Screen Reader Support", () => {
    it("without CTA, no button is in the AT tree", () => {
      render(<EmptyState title="Nothing" message="Try later." />);

      expect(screen.queryByRole("button")).not.toBeInTheDocument();
    });

    it("action slot link is visible in the AT tree", () => {
      render(<EmptyState title="Vazio" action={<a href="/back">Voltar</a>} />);
      expect(screen.getByRole("link", { name: "Voltar" })).toBeInTheDocument();
    });

    it("aria-label survives illustration: the AT announcement is unchanged", () => {
      const withoutIllustration = render(
        <EmptyState title="Empty" message="Add one." />,
      );
      const ariaWithout = withoutIllustration
        .getByRole("status")
        .getAttribute("aria-label");

      withoutIllustration.unmount();

      const withIllustration = render(
        <EmptyState
          title="Empty"
          message="Add one."
          illustration={<div>icon</div>}
        />,
      );
      const ariaWith = withIllustration
        .getByRole("status")
        .getAttribute("aria-label");

      // Same aria-label regardless of illustration — illustration is
      // pure decoration.
      expect(ariaWith).toBe(ariaWithout);
    });
  });
});
