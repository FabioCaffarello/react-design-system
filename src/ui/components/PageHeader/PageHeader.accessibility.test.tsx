/**
 * PageHeader Accessibility Tests
 *
 * Dedicated a11y test scaffold for PageHeader — the page-level
 * composition of breadcrumb + h1 title + description + actions.
 *
 *   - ARIA Labels and Roles: title renders as <h1> (the page's main
 *     heading); breadcrumb is the nav-landmark version from the
 *     Breadcrumb primitive; actions container is a plain div that
 *     holds Button-like children (each carrying its own accessible
 *     name)
 *   - Keyboard Navigation: breadcrumb links + action buttons are
 *     reachable in DOM order
 *   - Focus Management: title is non-interactive; breadcrumb and
 *     action buttons are tab stops
 *   - Screen Reader Support: h1 is the page heading (one per page is
 *     the AT-friendly convention); description is rendered as <p> so
 *     AT users hear it as body text adjacent to the heading
 *
 * Mirrors the structure of Header.accessibility.test.tsx as the
 * canonical scaffold for component-level a11y suites.
 */

import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { PageHeader } from "./PageHeader";

describe("PageHeader Accessibility", () => {
  describe("ARIA Labels and Roles", () => {
    it("title renders as <h1> (page heading)", () => {
      render(<PageHeader title="Settings" />);

      const heading = screen.getByRole("heading", { level: 1 });
      expect(heading).toHaveTextContent("Settings");
    });

    it("description renders as body text adjacent to the heading", () => {
      render(
        <PageHeader title="Settings" description="Manage your account." />,
      );

      // The description is in the DOM as a child of the same wrapper
      // as the heading — AT users hear it right after the title.
      expect(screen.getByText("Manage your account.")).toBeInTheDocument();
    });

    it("breadcrumb renders the navigation landmark when items are provided", () => {
      render(
        <PageHeader
          title="Edit profile"
          breadcrumb={[
            { label: "Home", href: "/" },
            { label: "Settings", href: "/settings" },
            { label: "Profile" },
          ]}
        />,
      );

      // The Breadcrumb primitive renders a nav landmark — already
      // covered by Breadcrumb.accessibility.test.tsx, but we verify it
      // appears in this composition.
      const nav = screen.getByRole("navigation", { name: "Breadcrumb" });
      expect(nav).toBeInTheDocument();
    });

    it("actions render with their own accessible names (no wrapper role)", () => {
      render(
        <PageHeader
          title="Settings"
          actions={
            <>
              <button>Save</button>
              <button>Cancel</button>
            </>
          }
        />,
      );

      // Each action keeps its own accessible name. The outer wrapper
      // is a plain div with no role pollution.
      expect(screen.getByRole("button", { name: "Save" })).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: "Cancel" }),
      ).toBeInTheDocument();
    });
  });

  describe("Keyboard Navigation", () => {
    it("breadcrumb links + action buttons are reachable in DOM order", async () => {
      const user = userEvent.setup();
      render(
        <PageHeader
          title="Edit profile"
          breadcrumb={[{ label: "Home", href: "/" }, { label: "Profile" }]}
          actions={<button>Save</button>}
        />,
      );

      await user.tab();
      // First focusable is the Home link in breadcrumb.
      expect(screen.getByRole("link", { name: "Home" })).toHaveFocus();

      await user.tab();
      // Next is the Save button (Profile is non-link since no href).
      expect(screen.getByRole("button", { name: "Save" })).toHaveFocus();
    });
  });

  describe("Focus Management", () => {
    it("heading itself is not in the tab order", async () => {
      const user = userEvent.setup();
      render(
        <>
          <button>Before</button>
          <PageHeader title="Settings" />
          <button>After</button>
        </>,
      );

      screen.getByRole("button", { name: "Before" }).focus();
      await user.tab();
      // Heading is not focusable; tab jumps over.
      expect(screen.getByRole("button", { name: "After" })).toHaveFocus();
    });
  });

  describe("Screen Reader Support", () => {
    it("no breadcrumb when items array is empty (no empty nav landmark)", () => {
      render(<PageHeader title="Settings" breadcrumb={[]} />);

      // Empty breadcrumb array suppresses the nav landmark — AT users
      // don't hear an empty "Breadcrumb navigation".
      expect(
        screen.queryByRole("navigation", { name: "Breadcrumb" }),
      ).not.toBeInTheDocument();
    });

    it("title is the only level-1 heading (exactly one h1 per page)", () => {
      render(
        <PageHeader title="Settings" description="Manage your account." />,
      );

      const h1s = screen.getAllByRole("heading", { level: 1 });
      // The AT-friendly convention: one h1 per page. PageHeader owns
      // that single h1.
      expect(h1s).toHaveLength(1);
    });
  });
});
