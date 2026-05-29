import React from "react";
import { SideNavbar } from "../../components";
import { Container } from "../../layouts/Container/Container";

export interface DashboardLayoutProps {
  /**
   * Sidebar content - use SideNavbar.Navbar and SideNavbar.Sidebar subcomponents
   */
  sidebar?: React.ReactNode;
  /**
   * Main content area
   */
  children: React.ReactNode;
  /**
   * Header content
   */
  header?: React.ReactNode;
  /**
   * Footer content
   */
  footer?: React.ReactNode;
  /**
   * Sidebar collapsed by default
   * @default false
   */
  defaultCollapsed?: boolean;
  /**
   * SideNavbar props
   */
  sidebarProps?: Omit<React.ComponentProps<typeof SideNavbar>, "children">;
}

/**
 * DashboardLayout - A complete dashboard page layout
 *
 * Combines SideNavbar, Container, and Stack to create a full dashboard structure.
 * This template provides a complete page layout with sensible defaults.
 *
 * @example
 * ```tsx
 * <DashboardLayout
 *   sidebar={
 *     <>
 *       <SideNavbar.Navbar>
 *         <SideNavbar.Navbar.Item icon={<Home />} label="Home" />
 *       </SideNavbar.Navbar>
 *       <SideNavbar.Sidebar>
 *         <SideNavbar.Sidebar.Content>Content</SideNavbar.Sidebar.Content>
 *       </SideNavbar.Sidebar>
 *     </>
 *   }
 *   header={<Header />}
 * >
 *   <MainContent />
 * </DashboardLayout>
 * ```
 */
export function DashboardLayout({
  sidebar,
  children,
  header,
  footer,
  defaultCollapsed = false,
  sidebarProps,
}: DashboardLayoutProps) {
  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      {sidebar && (
        <SideNavbar defaultCollapsed={defaultCollapsed} {...sidebarProps}>
          {sidebar}
        </SideNavbar>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        {header && (
          <header className="border-b bg-surface-base">
            <Container maxWidth="full" paddingX="base" paddingY="sm">
              {header}
            </Container>
          </header>
        )}

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          <Container maxWidth="xl" paddingX="base" paddingY="base">
            {children}
          </Container>
        </main>

        {/* Footer */}
        {footer && (
          <footer className="border-t bg-surface-base">
            <Container maxWidth="full" paddingX="base" paddingY="sm">
              {footer}
            </Container>
          </footer>
        )}
      </div>
    </div>
  );
}
