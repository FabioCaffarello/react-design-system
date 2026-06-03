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
});
