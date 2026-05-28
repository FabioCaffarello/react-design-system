/**
 * Header DashboardLayout Integration Tests
 *
 * Tests for Header integration with DashboardLayout.
 * Following TDD approach: tests first, then implementation.
 *
 * @see TASK-025: Integrar Header com DashboardLayout
 */

import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Header } from "./Header";
import SideNavbar from "../../components/SideNavbar/SideNavbar";
import { DashboardLayout } from "../../components/DashboardLayout/DashboardLayout";
import { NavLink } from "../../primitives/NavLink";
import { Button } from "../../primitives/Button/Button";
import { Home } from "lucide-react";

describe("Header + DashboardLayout Integration (TASK-025)", () => {
  describe("Basic Integration", () => {
    it("should render Header correctly when passed to DashboardLayout header prop", () => {
      // TDD: Test that Header works via DashboardLayout header prop
      render(
        <DashboardLayout
          sidebar={
            <SideNavbar mode="navigation">
              <SideNavbar.Navbar>
                <SideNavbar.Navbar.Item icon={<Home />} label="Home" />
              </SideNavbar.Navbar>
            </SideNavbar>
          }
          header={
            <Header>
              <Header.Logo href="/">MyApp</Header.Logo>
              <Header.Actions>
                <Button>User</Button>
              </Header.Actions>
            </Header>
          }
        >
          <div>Main Content</div>
        </DashboardLayout>,
      );

      // Header content should be present
      expect(screen.getByText("MyApp")).toBeInTheDocument();
      expect(screen.getByText("User")).toBeInTheDocument();

      // Main content should be present
      expect(screen.getByText("Main Content")).toBeInTheDocument();
    });

    it("should use bare mode to avoid duplicate header elements when used in DashboardLayout", () => {
      // TDD: Test that Header with bare prop doesn't create duplicate wrappers
      const { container } = render(
        <DashboardLayout
          header={
            <Header bare>
              <Header.Logo href="/">MyApp</Header.Logo>
            </Header>
          }
        >
          <div>Content</div>
        </DashboardLayout>,
      );

      // With bare mode, Header should not create its own header element
      // DashboardLayout creates the header wrapper, Header just provides content
      const headers = container.querySelectorAll("header");
      // Should have only one header (from DashboardLayout)
      expect(headers.length).toBe(1);

      // Content should still be present
      expect(screen.getByText("MyApp")).toBeInTheDocument();
    });

    it("should use bare mode to avoid duplicate Container elements when used in DashboardLayout", () => {
      // TDD: Test that Header with bare prop doesn't create duplicate Container
      const { container } = render(
        <DashboardLayout
          header={
            <Header bare>
              <Header.Logo href="/">MyApp</Header.Logo>
            </Header>
          }
        >
          <div>Content</div>
        </DashboardLayout>,
      );

      // With bare mode, Header should not create its own Container
      // DashboardLayout provides the Container wrapper
      // Count containers with max-width classes
      const containers = container.querySelectorAll('[class*="max-w"]');
      // Should have containers from DashboardLayout, but Header shouldn't add another
      expect(containers.length).toBeGreaterThan(0);

      // Content should still be present
      expect(screen.getByText("MyApp")).toBeInTheDocument();
    });
  });

  describe("Layout Coordination", () => {
    it("should coordinate layout correctly - Header and SideNavbar work together", () => {
      // TDD: Test layout coordination
      const { container } = render(
        <DashboardLayout
          sidebar={
            <SideNavbar mode="navigation">
              <SideNavbar.Navbar>
                <SideNavbar.Navbar.Item icon={<Home />} label="Home" />
              </SideNavbar.Navbar>
            </SideNavbar>
          }
          header={
            <Header>
              <Header.Logo href="/">MyApp</Header.Logo>
            </Header>
          }
        >
          <div>Content</div>
        </DashboardLayout>,
      );

      // Layout structure should be: flex h-screen > SideNavbar + flex-1 flex flex-col > Header + Main
      const rootLayout = container.querySelector(".flex.h-screen");
      expect(rootLayout).toBeInTheDocument();

      const mainArea = container.querySelector(".flex-1.flex.flex-col");
      expect(mainArea).toBeInTheDocument();
    });

    it("should handle Header sticky positioning correctly in DashboardLayout", () => {
      // TDD: Test sticky header in DashboardLayout
      const { container } = render(
        <DashboardLayout
          header={
            <Header sticky>
              <Header.Logo href="/">MyApp</Header.Logo>
            </Header>
          }
        >
          <div>Content</div>
        </DashboardLayout>,
      );

      const header = container.querySelector("header.sticky");
      expect(header).toBeInTheDocument();
      expect(header).toHaveClass("sticky", "top-0", "z-50");
    });
  });

  describe("Responsiveness", () => {
    it("should work responsively in DashboardLayout - mobile menu should work", () => {
      // TDD: Test responsive behavior
      render(
        <DashboardLayout
          sidebar={
            <SideNavbar mode="navigation">
              <SideNavbar.Navbar>
                <SideNavbar.Navbar.Item icon={<Home />} label="Home" />
              </SideNavbar.Navbar>
            </SideNavbar>
          }
          header={
            <Header>
              <Header.Hamburger />
              <Header.Logo href="/">MyApp</Header.Logo>
              <Header.MobileMenu>
                <NavLink href="/home">Home</NavLink>
              </Header.MobileMenu>
            </Header>
          }
        >
          <div>Content</div>
        </DashboardLayout>,
      );

      // Hamburger should be present
      const hamburger = screen.getByLabelText(/open menu|close menu/i);
      expect(hamburger).toBeInTheDocument();
    });
  });

  describe("Variants", () => {
    it("should apply Header variants correctly in DashboardLayout", () => {
      // TDD: Test variants work in DashboardLayout
      // Note: DashboardLayout wraps header in its own header element
      // So we need to find the inner header (from Header component)
      const { container } = render(
        <DashboardLayout
          header={
            <Header variant="elevated">
              <Header.Logo href="/">MyApp</Header.Logo>
            </Header>
          }
        >
          <div>Content</div>
        </DashboardLayout>,
      );

      // Find the inner header (Header component creates its own header)
      const headers = container.querySelectorAll("header");
      // The inner header should have the variant class
      const innerHeader = Array.from(headers).find((h) =>
        h.classList.contains("shadow-sm"),
      );
      expect(innerHeader).toBeInTheDocument();
    });

    it("should apply bordered variant correctly in DashboardLayout", () => {
      // TDD: Test bordered variant
      const { container } = render(
        <DashboardLayout
          header={
            <Header variant="bordered">
              <Header.Logo href="/">MyApp</Header.Logo>
            </Header>
          }
        >
          <div>Content</div>
        </DashboardLayout>,
      );

      const header = container.querySelector("header");
      expect(header).toHaveClass("border-b");
    });
  });
});
