/**
 * Button Accessibility Tests
 *
 * Dedicated a11y test scaffold for Button — the most fundamental
 * interactive primitive. Contracts here propagate to every consumer
 * (Modal close, Drawer close, Popover close, Toast dismiss, Card
 * interactive, etc.).
 *
 *   - ARIA Labels and Roles: button role from native element;
 *     aria-busy mirrors isLoading; aria-disabled mirrors disabled OR
 *     isLoading; iconOnly variant requires aria-label (with "Button"
 *     fallback to prevent axe button-name failures)
 *   - Keyboard Navigation: Enter and Space activate (native button
 *     contract); disabled button suppresses both
 *   - Focus Management: enabled button in tab order; disabled is not
 *   - Screen Reader Support: loading state announced via aria-busy;
 *     loadingText replaces children in the AT-readable surface; right
 *     icon and left icon don't affect accessible name
 *
 * Mirrors the structure of Header.accessibility.test.tsx as the
 * canonical scaffold for component-level a11y suites.
 */

import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Button from "./Button";

describe("Button Accessibility", () => {
  describe("ARIA Labels and Roles", () => {
    it("renders as a native button with the text as accessible name", () => {
      render(<Button>Save</Button>);

      expect(screen.getByRole("button", { name: "Save" })).toBeInTheDocument();
    });

    it("isLoading sets aria-busy=true", () => {
      render(<Button isLoading>Save</Button>);

      expect(screen.getByRole("button")).toHaveAttribute("aria-busy", "true");
    });

    it("disabled sets aria-disabled=true (plus native disabled)", () => {
      render(<Button disabled>Save</Button>);

      const btn = screen.getByRole("button");
      expect(btn).toHaveAttribute("aria-disabled", "true");
      expect(btn).toBeDisabled();
    });

    it("iconOnly with aria-label exposes the label as accessible name", () => {
      render(
        <Button variant="iconOnly" aria-label="Close panel">
          <span aria-hidden="true">×</span>
        </Button>,
      );

      expect(
        screen.getByRole("button", { name: "Close panel" }),
      ).toBeInTheDocument();
    });

    it("iconOnly without aria-label and without children falls back to 'Button'", () => {
      render(<Button variant="iconOnly" />);

      // Fallback contract: prevents axe button-name (critical) but
      // surfaces a visible code smell. Consumers should always supply
      // aria-label for iconOnly buttons.
      expect(
        screen.getByRole("button", { name: "Button" }),
      ).toBeInTheDocument();
    });
  });

  describe("Keyboard Navigation", () => {
    it("Enter activates the button", async () => {
      const user = userEvent.setup();
      const onClick = vi.fn();
      render(<Button onClick={onClick}>Save</Button>);

      const btn = screen.getByRole("button");
      btn.focus();
      await user.keyboard("{Enter}");
      expect(onClick).toHaveBeenCalled();
    });

    it("Space activates the button", async () => {
      const user = userEvent.setup();
      const onClick = vi.fn();
      render(<Button onClick={onClick}>Save</Button>);

      const btn = screen.getByRole("button");
      btn.focus();
      await user.keyboard(" ");
      expect(onClick).toHaveBeenCalled();
    });

    it("disabled button suppresses Enter activation", async () => {
      const user = userEvent.setup();
      const onClick = vi.fn();
      render(
        <Button disabled onClick={onClick}>
          Save
        </Button>,
      );

      const btn = screen.getByRole("button");
      btn.focus();
      await user.keyboard("{Enter}");
      expect(onClick).not.toHaveBeenCalled();
    });
  });

  describe("Focus Management", () => {
    it("enabled button is in the natural tab order", async () => {
      const user = userEvent.setup();
      render(<Button>Save</Button>);

      await user.tab();
      expect(screen.getByRole("button")).toHaveFocus();
    });

    it("disabled button is NOT in the tab order", async () => {
      const user = userEvent.setup();
      render(
        <>
          <button>Before</button>
          <Button disabled>Disabled</Button>
          <button>After</button>
        </>,
      );

      screen.getByRole("button", { name: "Before" }).focus();
      await user.tab();
      expect(screen.getByRole("button", { name: "After" })).toHaveFocus();
    });
  });

  describe("Screen Reader Support", () => {
    it("loadingText replaces children when isLoading (AT-readable surface)", () => {
      render(
        <Button isLoading loadingText="Saving…">
          Save
        </Button>,
      );

      // The visible / AT-readable text is "Saving…", not "Save".
      // The spinner is decorative.
      const btn = screen.getByRole("button");
      expect(btn).toHaveTextContent("Saving…");
    });
  });

  describe("asChild — a11y contract on the projected element", () => {
    // The asChild form projects Button's classes onto the consumer's
    // child. The child remains the native element it always was: a
    // link is still a link, an anchor still uses link semantics. AT
    // users hear "link", not "button" — the visual chrome doesn't
    // override the role.
    it("rendered as a link still announces as a link, not a button", () => {
      render(
        <Button asChild>
          <a href="/profile">Profile</a>
        </Button>,
      );

      // Native <a href> → role=link in the accessibility tree.
      expect(screen.getByRole("link", { name: "Profile" })).toBeInTheDocument();
      expect(screen.queryByRole("button")).not.toBeInTheDocument();
    });

    it("aria-label on Button is forwarded to the child element", () => {
      render(
        <Button asChild aria-label="Open profile">
          <a href="/profile">→</a>
        </Button>,
      );

      // The accessible name comes from the projected aria-label, not
      // the visible "→" glyph.
      expect(
        screen.getByRole("link", { name: "Open profile" }),
      ).toBeInTheDocument();
    });

    it("disabled on Button surfaces as aria-disabled on the child link", () => {
      render(
        <Button asChild disabled>
          <a href="/profile">Profile</a>
        </Button>,
      );

      const link = screen.getByRole("link", { name: "Profile" });
      // Native <a> has no `disabled` attribute, but AT users still
      // hear the disabled state via aria-disabled. Note: anchors do
      // NOT block navigation on aria-disabled alone; consumers must
      // gate href upstream when truly blocking is needed.
      expect(link).toHaveAttribute("aria-disabled", "true");
    });
  });
});
