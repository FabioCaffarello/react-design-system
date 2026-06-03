/**
 * Pagination Accessibility Tests
 *
 * Dedicated a11y test scaffold for Pagination — focused on concerns
 * that surface only in this component's interactive nav structure:
 *
 *   - ARIA Labels and Roles: nav landmark, per-button aria-label,
 *     aria-current="page" on the active page button
 *   - Keyboard Navigation: Tab moves through buttons, Enter triggers
 *     page change, disabled boundary buttons are not activatable
 *   - Focus Management: page button receives focus when activated
 *   - Screen Reader Support: ellipsis is decorative (no role / no name)
 *
 * Mirrors the structure of Header.accessibility.test.tsx as the
 * canonical scaffold for component-level a11y suites.
 */

import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Pagination from "./Pagination";

describe("Pagination Accessibility", () => {
  describe("ARIA Labels and Roles", () => {
    it("wraps controls in a nav landmark labelled 'Pagination'", () => {
      render(
        <Pagination currentPage={1} totalPages={3} onPageChange={() => {}} />,
      );

      expect(
        screen.getByRole("navigation", { name: "Pagination" }),
      ).toBeInTheDocument();
    });

    it("labels each page button with its destination", () => {
      render(
        <Pagination currentPage={1} totalPages={3} onPageChange={() => {}} />,
      );

      expect(
        screen.getByRole("button", { name: "Go to page 1" }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: "Go to page 2" }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: "Go to page 3" }),
      ).toBeInTheDocument();
    });

    it("marks the current page with aria-current='page'", () => {
      render(
        <Pagination currentPage={2} totalPages={3} onPageChange={() => {}} />,
      );

      const current = screen.getByRole("button", { name: "Go to page 2" });
      expect(current).toHaveAttribute("aria-current", "page");

      const other = screen.getByRole("button", { name: "Go to page 1" });
      expect(other).not.toHaveAttribute("aria-current");
    });
  });

  describe("Keyboard Navigation", () => {
    it("activates a page button on Enter when focused", async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();
      render(
        <Pagination
          currentPage={1}
          totalPages={3}
          onPageChange={handleChange}
        />,
      );

      const target = screen.getByRole("button", { name: "Go to page 3" });
      target.focus();
      await user.keyboard("{Enter}");

      expect(handleChange).toHaveBeenCalledWith(3);
    });

    it("activates a page button on Space when focused", async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();
      render(
        <Pagination
          currentPage={1}
          totalPages={3}
          onPageChange={handleChange}
        />,
      );

      const target = screen.getByRole("button", { name: "Go to page 2" });
      target.focus();
      await user.keyboard(" ");

      expect(handleChange).toHaveBeenCalledWith(2);
    });

    it("Tab traverses controls in DOM order: Previous, pages, Next", async () => {
      const user = userEvent.setup();
      render(
        <Pagination currentPage={2} totalPages={3} onPageChange={() => {}} />,
      );

      await user.tab();
      expect(screen.getByRole("button", { name: "Previous" })).toHaveFocus();

      await user.tab();
      expect(
        screen.getByRole("button", { name: "Go to page 1" }),
      ).toHaveFocus();

      await user.tab();
      expect(
        screen.getByRole("button", { name: "Go to page 2" }),
      ).toHaveFocus();

      await user.tab();
      expect(
        screen.getByRole("button", { name: "Go to page 3" }),
      ).toHaveFocus();

      await user.tab();
      expect(screen.getByRole("button", { name: "Next" })).toHaveFocus();
    });
  });

  describe("Focus Management", () => {
    it("disabled Previous at first page is not keyboard-activatable", async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();
      render(
        <Pagination
          currentPage={1}
          totalPages={3}
          onPageChange={handleChange}
        />,
      );

      const prev = screen.getByRole("button", { name: "Previous" });
      expect(prev).toBeDisabled();

      // Even if the consumer programmatically focuses it, Enter must not fire
      // onPageChange because the native button is disabled.
      prev.focus();
      await user.keyboard("{Enter}");
      expect(handleChange).not.toHaveBeenCalled();
    });

    it("disabled Next at last page is not keyboard-activatable", async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();
      render(
        <Pagination
          currentPage={3}
          totalPages={3}
          onPageChange={handleChange}
        />,
      );

      const next = screen.getByRole("button", { name: "Next" });
      expect(next).toBeDisabled();

      next.focus();
      await user.keyboard("{Enter}");
      expect(handleChange).not.toHaveBeenCalled();
    });
  });

  describe("Screen Reader Support", () => {
    it("ellipsis between page groups is not announced as a button", () => {
      // 10 pages forces an ellipsis in the page list. Only 5 numbered buttons
      // are visible — first 4 + last + ellipsis(es).
      render(
        <Pagination currentPage={1} totalPages={10} onPageChange={() => {}} />,
      );

      const ellipsis = screen.getByText("...");
      // The ellipsis is a plain span — no role, no name. A screen reader
      // pass-through must not announce it as an interactive control.
      expect(ellipsis.tagName).toBe("SPAN");
      expect(ellipsis).not.toHaveAttribute("role");
    });

    it("does not duplicate page numbers in accessible name when label is set", () => {
      // Page button text is the number; aria-label is the verbose form.
      // Asserting both ensures AT users get the explicit destination
      // and sighted users see the short label.
      render(
        <Pagination currentPage={1} totalPages={3} onPageChange={() => {}} />,
      );

      const button = screen.getByRole("button", { name: "Go to page 2" });
      // Visible text is "2"; aria-label overrides the accessible name.
      expect(button).toHaveTextContent("2");
      expect(button).toHaveAttribute("aria-label", "Go to page 2");
    });
  });
});
