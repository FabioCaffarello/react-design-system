/**
 * Breadcrumb Accessibility Tests
 *
 * Dedicated a11y test scaffold for Breadcrumb — focused on the
 * concerns inherent to a structural-nav with current-page indicator:
 *
 *   - ARIA Labels and Roles: nav landmark, ordered list semantics,
 *     aria-current="page" on the last item, separators as aria-hidden
 *   - Keyboard Navigation: Tab moves through link items only (the
 *     current page label is a span, not in the tab order)
 *   - Focus Management: anchor links are reachable; the current-page
 *     span is not a focusable target
 *   - Screen Reader Support: separators are decorative, last item
 *     identifies as the current page
 *
 * Mirrors the structure of Header.accessibility.test.tsx as the
 * canonical scaffold for component-level a11y suites.
 */

import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Breadcrumb from "./Breadcrumb";

const items = [
  { label: "Home", href: "/" },
  { label: "Projects", href: "/projects" },
  { label: "Current Project" },
];

describe("Breadcrumb Accessibility", () => {
  describe("ARIA Labels and Roles", () => {
    it("wraps the trail in a nav landmark labelled 'Breadcrumb'", () => {
      render(<Breadcrumb items={items} />);

      expect(
        screen.getByRole("navigation", { name: "Breadcrumb" }),
      ).toBeInTheDocument();
    });

    it("renders items inside an ordered list", () => {
      render(<Breadcrumb items={items} />);

      const list = screen.getByRole("list");
      expect(list.tagName).toBe("OL");
      expect(screen.getAllByRole("listitem")).toHaveLength(items.length);
    });

    it("marks the last item with aria-current='page'", () => {
      render(<Breadcrumb items={items} />);

      const current = screen.getByText("Current Project");
      expect(current).toHaveAttribute("aria-current", "page");

      // Non-last items must not carry aria-current.
      const intermediate = screen.getByText("Projects");
      expect(intermediate).not.toHaveAttribute("aria-current");
    });

    it("hides separators from assistive tech", () => {
      const { container } = render(<Breadcrumb items={items} separator=">" />);

      const separators = container.querySelectorAll('[aria-hidden="true"]');
      // Two separators for three items.
      expect(separators).toHaveLength(items.length - 1);
      separators.forEach((sep) => expect(sep).toHaveTextContent(">"));
    });
  });

  describe("Keyboard Navigation", () => {
    it("Tab moves through link items only — current page is not focusable", async () => {
      const user = userEvent.setup();
      render(<Breadcrumb items={items} />);

      await user.tab();
      expect(screen.getByRole("link", { name: "Home" })).toHaveFocus();

      await user.tab();
      expect(screen.getByRole("link", { name: "Projects" })).toHaveFocus();

      // Next Tab leaves the breadcrumb because the current page span has no
      // tabindex — there is no third link to receive focus.
      await user.tab();
      expect(document.activeElement).toBe(document.body);
    });
  });

  describe("Focus Management", () => {
    it("anchor items render as <a> with href", () => {
      render(<Breadcrumb items={items} />);

      const home = screen.getByRole("link", { name: "Home" });
      expect(home).toHaveAttribute("href", "/");

      const projects = screen.getByRole("link", { name: "Projects" });
      expect(projects).toHaveAttribute("href", "/projects");
    });

    it("current page is a span, not a link, and not focusable", () => {
      render(<Breadcrumb items={items} />);

      const current = screen.getByText("Current Project");
      expect(current.tagName).toBe("SPAN");
      expect(current).not.toHaveAttribute("href");
      expect(current).not.toHaveAttribute("tabindex");
    });

    it("intermediate item without href falls back to a non-focusable span", () => {
      // Edge case: a non-last item whose href is omitted should render as a
      // span (not a link), preserving screen-reader semantics without
      // adding a dead-end keyboard stop.
      render(
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Section" },
            { label: "Current Page" },
          ]}
        />,
      );

      const section = screen.getByText("Section");
      expect(section.tagName).toBe("SPAN");
      expect(
        screen.queryByRole("link", { name: "Section" }),
      ).not.toBeInTheDocument();
    });
  });

  describe("Screen Reader Support", () => {
    it("accessible name for current page is its label", () => {
      render(<Breadcrumb items={items} />);

      const current = screen.getByText("Current Project");
      expect(current).toHaveAttribute("aria-current", "page");
      expect(current).toHaveTextContent("Current Project");
    });

    it("separators are excluded from the accessible text tree", () => {
      // aria-hidden="true" on the separator spans means a screen reader
      // walks straight from one item to the next without reading "/" aloud.
      const { container } = render(<Breadcrumb items={items} />);

      const hidden = container.querySelectorAll('[aria-hidden="true"]');
      expect(hidden.length).toBeGreaterThan(0);
      hidden.forEach((node) => {
        expect(node).toHaveTextContent("/");
      });
    });
  });
});
