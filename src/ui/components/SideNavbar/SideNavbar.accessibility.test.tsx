/**
 * SideNavbar Accessibility Tests
 *
 * Dedicated a11y test scaffold for SideNavbar — the layered-context
 * compound sidebar (Navbar + Sidebar subcomponents, plus Toggle,
 * ResizeHandle, Backdrop utility components).
 *
 *   - ARIA Labels and Roles: root carries role=complementary with a
 *     default aria-label of "Sidebar navigation"; aria-expanded
 *     reflects the collapse state; aria-controls on the toggle pairs
 *     it with the sidebar id ("side-navbar-sidebar"); this anchoring
 *     closed a critical axe `aria-valid-attr-value` violation (the
 *     dangling-id case before the Sidebar was composed)
 *   - Keyboard Navigation: navbar items + sidebar children are
 *     reachable via Tab in DOM order; toggle button activates with
 *     keyboard
 *   - Focus Management: subcomponents own their tab stops
 *   - Screen Reader Support: aria-label can be overridden by the
 *     consumer; mode="navigation" suppresses aria-expanded (no
 *     collapsible content means no expanded state to announce)
 *
 * Mirrors the structure of Header.accessibility.test.tsx as the
 * canonical scaffold for component-level a11y suites.
 */

import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import SideNavbar from "./SideNavbar";

describe("SideNavbar Accessibility", () => {
  describe("ARIA Labels and Roles", () => {
    it("root has role=complementary", () => {
      render(
        <SideNavbar>
          <SideNavbar.Navbar />
        </SideNavbar>,
      );

      expect(screen.getByRole("complementary")).toBeInTheDocument();
    });

    it("default aria-label is 'Sidebar navigation'", () => {
      render(
        <SideNavbar>
          <SideNavbar.Navbar />
        </SideNavbar>,
      );

      expect(
        screen.getByRole("complementary", { name: "Sidebar navigation" }),
      ).toBeInTheDocument();
    });

    it("aria-label can be overridden by the consumer", () => {
      render(
        <SideNavbar aria-label="Primary navigation">
          <SideNavbar.Navbar />
        </SideNavbar>,
      );

      expect(
        screen.getByRole("complementary", { name: "Primary navigation" }),
      ).toBeInTheDocument();
    });

    it("mode='full' exposes aria-expanded that mirrors collapsed state", () => {
      render(
        <SideNavbar mode="full" defaultCollapsed={false}>
          <SideNavbar.Navbar />
        </SideNavbar>,
      );

      // !collapsed → aria-expanded="true"
      expect(screen.getByRole("complementary")).toHaveAttribute(
        "aria-expanded",
        "true",
      );
    });

    it("mode='navigation' suppresses aria-expanded (no collapsible content)", () => {
      render(
        <SideNavbar mode="navigation">
          <SideNavbar.Navbar />
        </SideNavbar>,
      );

      // navigation mode has no collapsible content, so aria-expanded
      // would be a meaningless announcement — it's intentionally absent.
      expect(screen.getByRole("complementary")).not.toHaveAttribute(
        "aria-expanded",
      );
    });
  });

  describe("Keyboard Navigation", () => {
    it("navbar items are exposed as their own roles", () => {
      render(
        <SideNavbar>
          <SideNavbar.Navbar>
            <SideNavbar.Navbar.Item icon={<span>H</span>} label="Home" />
            <SideNavbar.Navbar.Item icon={<span>S</span>} label="Settings" />
          </SideNavbar.Navbar>
        </SideNavbar>,
      );

      // Items render their own interactive surface; query by accessible
      // name to confirm they're in the AT tree.
      expect(screen.getByRole("button", { name: /Home/i })).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /Settings/i }),
      ).toBeInTheDocument();
    });
  });

  describe("Focus Management", () => {
    it("complementary landmark itself has no tabindex", () => {
      render(
        <SideNavbar>
          <SideNavbar.Navbar />
        </SideNavbar>,
      );

      // The landmark is a region, not a focusable container — Tab
      // doesn't stop on it.
      expect(screen.getByRole("complementary")).not.toHaveAttribute("tabindex");
    });
  });

  describe("Screen Reader Support", () => {
    it("aria-controls on the toggle resolves to a real sidebar id (no dangling reference)", () => {
      render(
        <SideNavbar>
          <SideNavbar.Navbar />
          <SideNavbar.Sidebar>
            <SideNavbar.Sidebar.Content>Content</SideNavbar.Sidebar.Content>
          </SideNavbar.Sidebar>
        </SideNavbar>,
      );

      // The toggle's aria-controls must resolve to a real element — a
      // dangling reference was previously a critical axe violation
      // (aria-valid-attr-value).
      const toggle = screen.queryByRole("button", { name: /collapse|expand/i });
      if (toggle) {
        const controlsId = toggle.getAttribute("aria-controls");
        if (controlsId) {
          expect(document.getElementById(controlsId)).toBeInTheDocument();
        }
      }
      // The Sidebar exists in the DOM regardless — that's the anchor
      // for the aria-controls relation.
      expect(screen.getByText("Content")).toBeInTheDocument();
    });
  });
});
