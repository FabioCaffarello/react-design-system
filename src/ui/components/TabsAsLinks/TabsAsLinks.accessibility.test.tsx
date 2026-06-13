/**
 * TabsAsLinks Accessibility Tests
 *
 * Real WCAG 2.1 AA contract for TabsAsLinks, in the canonical four-section
 * layout mirrored from Header.accessibility.test.tsx.
 *
 * TabsAsLinks is NAVIGATION, not a tab widget: each tab is a link to a
 * distinct URL. The correct pattern is a named <nav> landmark with
 * aria-current="page" on the active link — NOT role="tab"/"tablist" (which
 * would promise arrow-key semantics that links don't provide). These tests
 * lock that contract.
 */

import { createRef } from "react";
import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import TabsAsLinks, { type TabAsLink } from "./TabsAsLinks";

afterEach(() => {
  vi.restoreAllMocks();
});

const items: TabAsLink[] = [
  { label: "Overview", href: "/p?tab=overview", active: true },
  { label: "Alerts", href: "/p?tab=alerts", count: 3 },
  { label: "Settings", href: "/p?tab=settings" },
];

describe("TabsAsLinks Accessibility", () => {
  describe("ARIA Labels and Roles", () => {
    it("is a named navigation landmark", () => {
      render(<TabsAsLinks aria-label="Painel" items={items} />);
      expect(
        screen.getByRole("navigation", { name: "Painel" }),
      ).toBeInTheDocument();
    });

    it("uses the navigation pattern, NOT the tab-widget pattern", () => {
      render(<TabsAsLinks aria-label="Painel" items={items} />);
      // No tablist/tab roles — these are links, not a tab widget.
      expect(screen.queryByRole("tablist")).not.toBeInTheDocument();
      expect(screen.queryByRole("tab")).not.toBeInTheDocument();
      expect(screen.getAllByRole("link")).toHaveLength(3);
    });

    it("marks the current tab with aria-current='page'", () => {
      render(<TabsAsLinks aria-label="Painel" items={items} />);
      expect(screen.getByRole("link", { name: "Overview" })).toHaveAttribute(
        "aria-current",
        "page",
      );
    });

    it("gives every tab an accessible name from its label", () => {
      render(<TabsAsLinks aria-label="Painel" items={items} />);
      expect(
        screen.getByRole("link", { name: "Settings" }),
      ).toBeInTheDocument();
    });
  });

  describe("Keyboard Navigation", () => {
    it("does not steal focus on mount", () => {
      render(<TabsAsLinks aria-label="Painel" items={items} />);
      expect(document.body).toHaveFocus();
    });

    it("reaches each tab link in document order via Tab", async () => {
      const user = userEvent.setup();
      render(<TabsAsLinks aria-label="Painel" items={items} />);
      await user.tab();
      expect(screen.getByRole("link", { name: "Overview" })).toHaveFocus();
      await user.tab();
      expect(screen.getByRole("link", { name: /alerts/i })).toHaveFocus();
      await user.tab();
      expect(screen.getByRole("link", { name: "Settings" })).toHaveFocus();
    });
  });

  describe("Focus Management", () => {
    it("supports programmatic focus through the forwarded ref", () => {
      const ref = createRef<HTMLElement>();
      render(<TabsAsLinks ref={ref} aria-label="Painel" items={items} />);
      ref.current?.focus();
      // The <nav> is not focusable by default; focusing a contained link works.
      const link = screen.getByRole("link", { name: "Overview" });
      link.focus();
      expect(link).toHaveFocus();
    });
  });

  describe("Screen Reader Support", () => {
    it("hides decorative icons from assistive technology", () => {
      render(
        <TabsAsLinks
          aria-label="Painel"
          items={[
            { label: "Home", href: "/", icon: <svg data-testid="icon" /> },
          ]}
        />,
      );
      expect(screen.getByTestId("icon").parentElement).toHaveAttribute(
        "aria-hidden",
        "true",
      );
    });

    it("exposes the count as part of the tab's accessible name", () => {
      render(<TabsAsLinks aria-label="Painel" items={items} />);
      // "Alerts" + "3" → the count is readable text inside the link.
      expect(
        screen.getByRole("link", { name: /alerts\s*3/i }),
      ).toBeInTheDocument();
    });
  });
});
