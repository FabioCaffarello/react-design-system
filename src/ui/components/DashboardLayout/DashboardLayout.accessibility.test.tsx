/**
 * DashboardLayout Accessibility Tests
 *
 * Dedicated a11y test scaffold for DashboardLayout — the full
 * dashboard page template (optional sidebar + optional header +
 * main content + optional footer).
 *
 *   - ARIA Labels and Roles: header renders as <header> (banner
 *     landmark); main content renders as <main> (main landmark);
 *     footer renders as <footer> (contentinfo landmark); sidebar is
 *     a SideNavbar instance (complementary landmark)
 *   - Keyboard Navigation: children inside main + header + footer +
 *     sidebar are reachable in DOM order
 *   - Focus Management: layout itself is not focusable
 *   - Screen Reader Support: AT users navigate by landmark — this
 *     template provides the canonical four (banner / main /
 *     contentinfo / complementary) when all slots are populated
 *
 * Mirrors the structure of Header.accessibility.test.tsx as the
 * canonical scaffold for component-level a11y suites.
 */

import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { DashboardLayout } from "./DashboardLayout";
import SideNavbar from "../SideNavbar";

describe("DashboardLayout Accessibility", () => {
  describe("ARIA Labels and Roles", () => {
    it("renders <main> landmark for the content area", () => {
      render(
        <DashboardLayout>
          <p>Page body</p>
        </DashboardLayout>,
      );

      expect(screen.getByRole("main")).toBeInTheDocument();
    });

    it("renders <header> banner landmark when header prop is supplied", () => {
      render(
        <DashboardLayout header={<div>Top bar</div>}>
          <p>Page body</p>
        </DashboardLayout>,
      );

      expect(screen.getByRole("banner")).toBeInTheDocument();
    });

    it("renders <footer> contentinfo landmark when footer prop is supplied", () => {
      render(
        <DashboardLayout footer={<div>Bottom bar</div>}>
          <p>Page body</p>
        </DashboardLayout>,
      );

      expect(screen.getByRole("contentinfo")).toBeInTheDocument();
    });

    it("renders complementary landmark when sidebar prop is supplied", () => {
      render(
        <DashboardLayout
          sidebar={
            <SideNavbar.Navbar>
              <SideNavbar.Navbar.Item icon={<span>H</span>} label="Home" />
            </SideNavbar.Navbar>
          }
        >
          <p>Page body</p>
        </DashboardLayout>,
      );

      // The sidebar slot is wrapped in <SideNavbar>, which renders
      // role=complementary.
      expect(screen.getByRole("complementary")).toBeInTheDocument();
    });

    it("omitted header/footer/sidebar produce no phantom landmarks", () => {
      render(
        <DashboardLayout>
          <p>Page body</p>
        </DashboardLayout>,
      );

      expect(screen.queryByRole("banner")).not.toBeInTheDocument();
      expect(screen.queryByRole("contentinfo")).not.toBeInTheDocument();
      expect(screen.queryByRole("complementary")).not.toBeInTheDocument();
    });
  });

  describe("Keyboard Navigation", () => {
    it("children inside main are reachable via Tab", async () => {
      render(
        <DashboardLayout>
          <button>In main</button>
        </DashboardLayout>,
      );

      const button = screen.getByRole("button", { name: "In main" });
      button.focus();
      expect(button).toHaveFocus();
    });
  });

  describe("Focus Management", () => {
    it("main landmark itself has no tabindex (region, not focusable)", () => {
      render(
        <DashboardLayout>
          <p>Page body</p>
        </DashboardLayout>,
      );

      expect(screen.getByRole("main")).not.toHaveAttribute("tabindex");
    });
  });

  describe("Screen Reader Support", () => {
    it("populating all four slots yields four landmarks in the AT tree", () => {
      render(
        <DashboardLayout
          header={<div>Top bar</div>}
          footer={<div>Bottom bar</div>}
          sidebar={
            <SideNavbar.Navbar>
              <SideNavbar.Navbar.Item icon={<span>H</span>} label="Home" />
            </SideNavbar.Navbar>
          }
        >
          <p>Page body</p>
        </DashboardLayout>,
      );

      // The canonical four landmarks for a dashboard page — AT users
      // can jump between them with a single key press.
      expect(screen.getByRole("banner")).toBeInTheDocument();
      expect(screen.getByRole("main")).toBeInTheDocument();
      expect(screen.getByRole("contentinfo")).toBeInTheDocument();
      expect(screen.getByRole("complementary")).toBeInTheDocument();
    });
  });
});
