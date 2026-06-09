/**
 * Card Accessibility Tests
 *
 * Dedicated a11y test scaffold for Card. The defining contract:
 * interactivity is driven by the `onClick` prop ALONE — `variant="hover"`
 * is a visual style (hover shadow + cursor hint), NOT a declaration that
 * the card is clickable. This decoupling closes the historical axe
 * `nested-interactive` violation where a hover-variant Card with Buttons
 * inside became `role=button` outer with role=button inner.
 *
 *   - ARIA Labels and Roles: no onClick → plain div (no role); with
 *     onClick → role=button + tabIndex=0; aria-label and
 *     aria-labelledby pass through cleanly
 *   - Keyboard Navigation: Enter and Space activate interactive cards;
 *     non-interactive cards ignore them
 *   - Focus Management: interactive cards are in the tab order;
 *     non-interactive cards are not
 *   - Screen Reader Support: variant="hover" without onClick keeps the
 *     card as a non-interactive region (no nested-interactive regression
 *     when buttons live inside)
 *
 * Mirrors the structure of Header.accessibility.test.tsx as the
 * canonical scaffold for component-level a11y suites.
 */

import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Card from "./Card";

describe("Card Accessibility", () => {
  describe("ARIA Labels and Roles", () => {
    it("non-interactive card has NO role (plain div)", () => {
      render(<Card>Plain content</Card>);

      expect(screen.queryByRole("button")).not.toBeInTheDocument();
      expect(screen.getByText("Plain content")).toBeInTheDocument();
    });

    it("interactive card (onClick) gets role=button", () => {
      render(<Card onClick={vi.fn()}>Clickable</Card>);

      expect(
        screen.getByRole("button", { name: "Clickable" }),
      ).toBeInTheDocument();
    });

    it("variant='hover' WITHOUT onClick stays non-interactive (no nested-interactive risk)", () => {
      // Regression guard. Previously the hover variant coupled to
      // role=button, so any consumer composing buttons inside (e.g. a
      // WithActions story) shipped a nested-interactive violation.
      // Decoupling preserves the visual hover shadow while keeping the
      // outer non-interactive.
      render(
        <Card variant="hover">
          <button>Inner action</button>
        </Card>,
      );

      // Only one button is present — the inner one. The card outer is
      // a plain div.
      const buttons = screen.getAllByRole("button");
      expect(buttons).toHaveLength(1);
      expect(buttons[0]).toHaveTextContent("Inner action");
    });

    it("aria-label passes through cleanly to the rendered div/button", () => {
      render(<Card aria-label="Pricing summary">$100</Card>);

      // getByText returns the element directly containing the text.
      const card = screen.getByText("$100");
      expect(card).toHaveAttribute("aria-label", "Pricing summary");
    });

    it("aria-labelledby passes through cleanly", () => {
      render(
        <>
          <h2 id="card-title">Pricing</h2>
          <Card aria-labelledby="card-title">$100</Card>
        </>,
      );

      const card = screen.getByText("$100");
      expect(card).toHaveAttribute("aria-labelledby", "card-title");
    });
  });

  describe("Keyboard Navigation", () => {
    it("Enter on a focused interactive card fires onClick", async () => {
      const user = userEvent.setup();
      const handleClick = vi.fn();
      render(<Card onClick={handleClick}>Clickable</Card>);

      const card = screen.getByRole("button", { name: "Clickable" });
      card.focus();
      await user.keyboard("{Enter}");
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it("Space on a focused interactive card fires onClick", async () => {
      const user = userEvent.setup();
      const handleClick = vi.fn();
      render(<Card onClick={handleClick}>Clickable</Card>);

      const card = screen.getByRole("button", { name: "Clickable" });
      card.focus();
      await user.keyboard(" ");
      expect(handleClick).toHaveBeenCalledTimes(1);
    });
  });

  describe("Focus Management", () => {
    it("interactive card is in the natural tab order (tabIndex=0)", async () => {
      const user = userEvent.setup();
      render(<Card onClick={vi.fn()}>Clickable</Card>);

      await user.tab();
      expect(screen.getByRole("button", { name: "Clickable" })).toHaveFocus();
    });

    it("non-interactive card is NOT in the tab order", async () => {
      const user = userEvent.setup();
      render(
        <>
          <button>Before</button>
          <Card>Plain content</Card>
          <button>After</button>
        </>,
      );

      screen.getByRole("button", { name: "Before" }).focus();
      await user.tab();
      // Tab skips the non-interactive card and lands on the next button.
      expect(screen.getByRole("button", { name: "After" })).toHaveFocus();
    });
  });

  describe("Screen Reader Support", () => {
    it("non-interactive card with inner Button: only one button in the AT tree", () => {
      render(
        <Card>
          <button>Action</button>
        </Card>,
      );

      // The card outer is not a button. AT users hear "Action, button"
      // and not "Card, button, Action, button" (the nested-interactive
      // violation pattern this contract closes).
      const buttons = screen.getAllByRole("button");
      expect(buttons).toHaveLength(1);
      expect(buttons[0]).toHaveTextContent("Action");
    });
  });

  describe("asSection landmark (#165)", () => {
    // Four affirmative tests that cover both axes of the landmark
    // contract — equivalent, for a11y, of the "prove the gate fails
    // when it should" discipline from .claude/rules/ci-gates.md:
    //
    //   1. asSection + aria-labelledby → NAMED region landmark.
    //   2. Default (no asSection) → no region role exposed.
    //   3. asSection without a name → dev warn fires (the dev-time
    //      safety net that replaces the missing axe rule — axe does
    //      not flag <section> without a name because it's valid HTML,
    //      just bad for AT navigation).
    //   4. asSection + aria-label alone → still named, NO warn.

    it("asSection + aria-labelledby produces a NAMED region landmark", () => {
      render(
        <Card asSection aria-labelledby="card-title">
          <Card.Header>
            <Card.Title id="card-title">Parlamentares</Card.Title>
          </Card.Header>
        </Card>,
      );
      // The implicit role of <section> with an accessible name is "region".
      const region = screen.getByRole("region", { name: "Parlamentares" });
      expect(region).toBeInTheDocument();
      expect(region.tagName).toBe("SECTION");
    });

    it("default (no asSection) does NOT expose a region role", () => {
      render(<Card aria-labelledby="any">Plain</Card>);
      expect(screen.queryByRole("region")).not.toBeInTheDocument();
    });

    it("asSection WITHOUT an accessible name fires the dev warn", () => {
      const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
      try {
        render(<Card asSection>Anonymous landmark</Card>);
        expect(warnSpy).toHaveBeenCalledTimes(1);
        const message = warnSpy.mock.calls[0]![0] as string;
        expect(message).toContain("[Card]");
        expect(message).toContain("asSection");
        expect(message).toContain("aria-labelledby");
      } finally {
        warnSpy.mockRestore();
      }
    });

    it("asSection + aria-label alone is enough — NO warn", () => {
      const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
      try {
        render(
          <Card asSection aria-label="Resumo">
            conteúdo
          </Card>,
        );
        expect(warnSpy).not.toHaveBeenCalled();
        // aria-label is a valid accessible name on <section>; axe-equivalent
        // region role is exposed.
        expect(
          screen.getByRole("region", { name: "Resumo" }),
        ).toBeInTheDocument();
      } finally {
        warnSpy.mockRestore();
      }
    });
  });
});
