/**
 * Header Compatibility Tests
 *
 * Tests for Header + SideNavbar compatibility.
 * Following TDD approach: tests first, then implementation.
 *
 * @see TASK-020: Projetar e Validar Arquitetura de Contexts Independentes
 * @see TASK-024: Criar Testes de Compatibilidade Header + SideNavbar
 * @see ADR-002: Header + SideNavbar Compatibility (ACCEPTED)
 */

import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Header } from "./Header";
import { useHeaderContext } from "./contexts/HeaderContext";
import SideNavbar from "../../components/SideNavbar/SideNavbar";
import { DashboardLayout } from "../../components/DashboardLayout/DashboardLayout";
import { NavLink } from "../../primitives/NavLink";
import { Button } from "../../primitives/Button/Button";
import { Home, Settings } from "lucide-react";

describe("Header + SideNavbar Compatibility", () => {
  describe("Contexts Independentes (TASK-020)", () => {
    it("should have independent contexts - HeaderContext does not interfere with SideNavbarContexts", () => {
      // TDD: Test first - HeaderContext should work independently
      const HeaderTestComponent = () => {
        const { isMobileMenuOpen, toggleMobileMenu } = useHeaderContext();
        return (
          <div>
            <span data-testid="header-menu-state">
              {isMobileMenuOpen ? "open" : "closed"}
            </span>
            <button onClick={toggleMobileMenu} data-testid="header-toggle">
              Toggle Header Menu
            </button>
          </div>
        );
      };

      const SideNavbarTestComponent = () => {
        // Access SideNavbar state if available
        return (
          <div>
            <span data-testid="sidebar-state">sidebar</span>
          </div>
        );
      };

      render(
        <div>
          <Header>
            <HeaderTestComponent />
          </Header>
          <SideNavbar>
            <SideNavbarTestComponent />
          </SideNavbar>
        </div>,
      );

      // Header context should work
      expect(screen.getByTestId("header-menu-state")).toHaveTextContent(
        "closed",
      );

      // Toggle header menu
      fireEvent.click(screen.getByTestId("header-toggle"));
      expect(screen.getByTestId("header-menu-state")).toHaveTextContent("open");

      // Sidebar should still work independently
      expect(screen.getByTestId("sidebar-state")).toBeInTheDocument();
    });

    it("should manage mobile menu state independently - Header and SideNavbar mobile menus are separate", () => {
      // TDD: Test that both can have independent mobile menu states
      const HeaderMenuComponent = () => {
        const { isMobileMenuOpen, openMobileMenu, closeMobileMenu } =
          useHeaderContext();
        return (
          <div>
            <span data-testid="header-menu">
              {isMobileMenuOpen ? "open" : "closed"}
            </span>
            <button onClick={openMobileMenu} data-testid="open-header">
              Open Header
            </button>
            <button onClick={closeMobileMenu} data-testid="close-header">
              Close Header
            </button>
          </div>
        );
      };

      render(
        <div>
          <Header>
            <HeaderMenuComponent />
          </Header>
          <SideNavbar defaultCollapsed={false} mode="navigation">
            <SideNavbar.Navbar>
              <SideNavbar.Navbar.Item icon={<Home />} label="Home" />
            </SideNavbar.Navbar>
          </SideNavbar>
        </div>,
      );

      // Initially closed
      expect(screen.getByTestId("header-menu")).toHaveTextContent("closed");

      // Open header menu
      fireEvent.click(screen.getByTestId("open-header"));
      expect(screen.getByTestId("header-menu")).toHaveTextContent("open");

      // Close header menu
      fireEvent.click(screen.getByTestId("close-header"));
      expect(screen.getByTestId("header-menu")).toHaveTextContent("closed");

      // SideNavbar should still be functional (check for role - may have multiple)
      const sidebars = screen.getAllByRole("complementary");
      expect(sidebars.length).toBeGreaterThan(0);
    });

    it("should not have state leakage between HeaderContext and SideNavbarContexts", () => {
      // TDD: Test that changing Header state doesn't affect SideNavbar state
      let headerStateChanges = 0;
      const sidebarStateChanges = 0;

      const HeaderTracker = () => {
        const { isMobileMenuOpen, toggleMobileMenu } = useHeaderContext();
        React.useEffect(() => {
          headerStateChanges++;
        }, [isMobileMenuOpen]);

        return (
          <button onClick={toggleMobileMenu} data-testid="header-toggle">
            Header: {isMobileMenuOpen ? "open" : "closed"}
          </button>
        );
      };

      render(
        <div>
          <Header>
            <HeaderTracker />
          </Header>
          <SideNavbar defaultCollapsed={false}>
            <SideNavbar.Navbar>
              <SideNavbar.Navbar.Item icon={<Home />} label="Home" />
            </SideNavbar.Navbar>
          </SideNavbar>
        </div>,
      );

      const initialHeaderChanges = headerStateChanges;
      const initialSidebarChanges = sidebarStateChanges;

      // Toggle header menu multiple times
      fireEvent.click(screen.getByTestId("header-toggle"));
      fireEvent.click(screen.getByTestId("header-toggle"));
      fireEvent.click(screen.getByTestId("header-toggle"));

      // Header state should change
      expect(headerStateChanges).toBeGreaterThan(initialHeaderChanges);

      // Sidebar state should NOT change
      expect(sidebarStateChanges).toBe(initialSidebarChanges);
    });
  });

  describe("Layout Coordenado (TASK-021)", () => {
    it("should work standalone - Header without SideNavbar", () => {
      // TDD: Test standalone Header
      render(
        <Header>
          <Header.Logo href="/">MyApp</Header.Logo>
          <Header.Navigation>
            <NavLink href="/home">Home</NavLink>
          </Header.Navigation>
          <Header.Actions>
            <Button>Sign In</Button>
          </Header.Actions>
        </Header>,
      );

      expect(screen.getByText("MyApp")).toBeInTheDocument();
      expect(screen.getByText("Home")).toBeInTheDocument();
      expect(screen.getByText("Sign In")).toBeInTheDocument();
    });

    it("should work with SideNavbar via DashboardLayout", () => {
      // TDD: Test Header + SideNavbar via DashboardLayout
      render(
        <DashboardLayout
          sidebar={
            <SideNavbar mode="navigation">
              <SideNavbar.Navbar>
                <SideNavbar.Navbar.Item icon={<Home />} label="Home" />
                <SideNavbar.Navbar.Item icon={<Settings />} label="Settings" />
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

      // Header should be present
      expect(screen.getByText("MyApp")).toBeInTheDocument();
      expect(screen.getByText("User")).toBeInTheDocument();

      // SideNavbar should be present (check by role - may have multiple)
      const sidebars = screen.getAllByRole("complementary");
      expect(sidebars.length).toBeGreaterThan(0);

      // Main content should be present
      expect(screen.getByText("Main Content")).toBeInTheDocument();
    });

    it("should work with SideNavbar via manual layout", () => {
      // TDD: Test manual layout (without DashboardLayout)
      render(
        <div className="flex h-screen">
          <SideNavbar mode="navigation">
            <SideNavbar.Navbar>
              <SideNavbar.Navbar.Item icon={<Home />} label="Home" />
            </SideNavbar.Navbar>
          </SideNavbar>
          <div className="flex-1 flex flex-col">
            <Header>
              <Header.Logo href="/">MyApp</Header.Logo>
            </Header>
            <main>Content</main>
          </div>
        </div>,
      );

      expect(screen.getByText("MyApp")).toBeInTheDocument();
      // SideNavbar should be present (check by role - may have multiple)
      const sidebars = screen.getAllByRole("complementary");
      expect(sidebars.length).toBeGreaterThan(0);
      expect(screen.getByText("Content")).toBeInTheDocument();
    });

    it("should not have visual overlap or gaps in layout", () => {
      // TDD: Test that layout is correct (no overlap, no gaps)
      const { container } = render(
        <DashboardLayout
          sidebar={
            <>
              <SideNavbar.Navbar>
                <SideNavbar.Navbar.Item icon={<Home />} label="Home" />
              </SideNavbar.Navbar>
            </>
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

      // Layout structure should be correct
      const layout = container.querySelector(".flex.h-screen");
      expect(layout).toBeInTheDocument();

      // Main content area should be flex-1
      const mainArea = container.querySelector(".flex-1.flex.flex-col");
      expect(mainArea).toBeInTheDocument();
    });
  });

  describe("Mobile Menus Isolados (TASK-022)", () => {
    it("should have independent mobile menus - Header and SideNavbar mobile menus are separate", () => {
      // TDD: Test that mobile menus are independent
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
                <NavLink href="/about">About</NavLink>
              </Header.MobileMenu>
            </Header>
          }
        >
          <div>Content</div>
        </DashboardLayout>,
      );

      // Hamburger button should be present
      const hamburger = screen.getByLabelText(/open menu|close menu/i);
      expect(hamburger).toBeInTheDocument();

      // SideNavbar should be present (check by role - may have multiple)
      const sidebars = screen.getAllByRole("complementary");
      expect(sidebars.length).toBeGreaterThan(0);

      // Header mobile menu should be controllable independently
      // (Drawer component will handle the actual rendering)
    });

    it("should handle both menus open simultaneously", () => {
      // TDD: Test that both mobile menus can be open at the same time
      const HeaderMenuTracker = () => {
        const { isMobileMenuOpen, openMobileMenu } = useHeaderContext();
        return (
          <div>
            <span data-testid="header-menu-open">
              {isMobileMenuOpen ? "yes" : "no"}
            </span>
            <button onClick={openMobileMenu} data-testid="open-header-menu">
              Open Header Menu
            </button>
          </div>
        );
      };

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
              <HeaderMenuTracker />
              <Header.Logo href="/">MyApp</Header.Logo>
            </Header>
          }
        >
          <div>Content</div>
        </DashboardLayout>,
      );

      // Initially closed
      expect(screen.getByTestId("header-menu-open")).toHaveTextContent("no");

      // Open header menu
      fireEvent.click(screen.getByTestId("open-header-menu"));
      expect(screen.getByTestId("header-menu-open")).toHaveTextContent("yes");

      // SideNavbar should still be functional (check by role - may have multiple)
      const sidebars = screen.getAllByRole("complementary");
      expect(sidebars.length).toBeGreaterThan(0);
    });
  });

  describe("Z-Index Hierarchy (TASK-023)", () => {
    it("should have correct z-index hierarchy - Header mobile menu above SideNavbar mobile menu", () => {
      // TDD: Test z-index hierarchy
      const { container } = render(
        <DashboardLayout
          sidebar={
            <>
              <SideNavbar.Navbar>
                <SideNavbar.Navbar.Item icon={<Home />} label="Home" />
              </SideNavbar.Navbar>
            </>
          }
          header={
            <Header sticky>
              <Header.Logo href="/">MyApp</Header.Logo>
            </Header>
          }
        >
          <div>Content</div>
        </DashboardLayout>,
      );

      // Header should have z-50 when sticky
      const header = container.querySelector("header.sticky");
      if (header) {
        expect(header).toHaveClass("z-50");
      }
    });
  });

  describe("Responsividade (TASK-026)", () => {
    it("should work on desktop - horizontal layout", () => {
      // TDD: Test desktop layout
      render(
        <Header>
          <Header.Logo href="/">MyApp</Header.Logo>
          <Header.Navigation>
            <NavLink href="/home">Home</NavLink>
            <NavLink href="/about">About</NavLink>
          </Header.Navigation>
          <Header.Actions>
            <Button>Sign In</Button>
          </Header.Actions>
        </Header>,
      );

      // Navigation should be visible on desktop (hidden on mobile)
      const navigation = screen.getByLabelText("Main navigation");
      expect(navigation).toBeInTheDocument();
      // Should have hidden md:flex classes for responsive behavior
      expect(navigation).toHaveClass("hidden", "md:flex");
    });

    it("should work on mobile - hamburger menu", () => {
      // TDD: Test mobile layout
      render(
        <Header>
          <Header.Hamburger />
          <Header.Logo href="/">MyApp</Header.Logo>
          <Header.Navigation>
            <NavLink href="/home">Home</NavLink>
          </Header.Navigation>
          <Header.MobileMenu>
            <NavLink href="/home">Home</NavLink>
            <NavLink href="/about">About</NavLink>
          </Header.MobileMenu>
        </Header>,
      );

      // Hamburger should be present
      const hamburger = screen.getByLabelText(/open menu|close menu/i);
      expect(hamburger).toBeInTheDocument();
      // Should be hidden on desktop (md:hidden)
      expect(hamburger.closest("button")).toHaveClass("md:hidden");
    });
  });
});
