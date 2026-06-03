/**
 * Separator Accessibility Tests
 *
 * Dedicated a11y test scaffold for Separator — the visual divider
 * primitive. Two structural shapes per orientation:
 *
 *   - **Horizontal**: renders an `<hr>` (the native divider element)
 *     with `role="separator"` and `aria-orientation="horizontal"`.
 *   - **Vertical**: renders a `<div>` (since `<hr>` can't carry
 *     vertical semantics in HTML) with explicit role + orientation.
 *
 *   - ARIA Labels and Roles: role=separator on both shapes;
 *     aria-orientation mirrors the prop
 *   - Keyboard Navigation: non-interactive
 *   - Focus Management: not in tab order
 *   - Screen Reader Support: AT users hear "separator" announcement
 *     between content sections; vertical/horizontal qualifier is
 *     spec-correct semantics
 *
 * Mirrors the structure of Header.accessibility.test.tsx as the
 * canonical scaffold for component-level a11y suites.
 */

import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Separator from "./Separator";

describe("Separator Accessibility", () => {
  describe("ARIA Labels and Roles", () => {
    it("horizontal: renders as <hr> with role=separator", () => {
      const { container } = render(<Separator />);

      const sep = screen.getByRole("separator");
      // Native horizontal divider element.
      expect(sep.tagName).toBe("HR");
      expect(container.querySelector("hr")).toBeInTheDocument();
    });

    it("horizontal: aria-orientation='horizontal'", () => {
      render(<Separator />);

      expect(screen.getByRole("separator")).toHaveAttribute(
        "aria-orientation",
        "horizontal",
      );
    });

    it("vertical: renders as <div> (since <hr> has no vertical semantics)", () => {
      const { container } = render(<Separator orientation="vertical" />);

      const sep = screen.getByRole("separator");
      // Vertical divider can't use <hr> — falls back to <div>.
      expect(sep.tagName).toBe("DIV");
      expect(container.querySelector("hr")).not.toBeInTheDocument();
    });

    it("vertical: aria-orientation='vertical'", () => {
      render(<Separator orientation="vertical" />);

      expect(screen.getByRole("separator")).toHaveAttribute(
        "aria-orientation",
        "vertical",
      );
    });
  });

  describe("Keyboard Navigation", () => {
    it("non-interactive (no tabindex)", () => {
      render(<Separator />);

      expect(screen.getByRole("separator")).not.toHaveAttribute("tabindex");
    });
  });

  describe("Focus Management", () => {
    it("not focusable", () => {
      render(<Separator />);

      expect(screen.getByRole("separator")).not.toHaveAttribute("tabindex");
    });
  });

  describe("Screen Reader Support", () => {
    it("variant prop changes visual only — aria-orientation stays the same", () => {
      const { rerender } = render(<Separator variant="solid" />);

      const solidOrientation = screen
        .getByRole("separator")
        .getAttribute("aria-orientation");

      rerender(<Separator variant="dashed" />);
      const dashedOrientation = screen
        .getByRole("separator")
        .getAttribute("aria-orientation");

      // The visual variant (solid/dashed/dotted) is purely
      // decorative — AT users hear the same "separator, horizontal"
      // regardless of CSS border-style.
      expect(solidOrientation).toBe(dashedOrientation);
    });
  });
});
