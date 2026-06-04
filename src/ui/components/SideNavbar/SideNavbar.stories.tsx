import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { expect, within, waitFor } from "storybook/test";
import React, { useState } from "react";
import SideNavbar from "./SideNavbar";
import { SidebarSlot, SidebarSlotContent } from "./components/Sidebar";
import { SidebarSlotProvider } from "./providers/SidebarSlotProvider";
import Card from "../../components/Card/Card";
import { Button, Input } from "../../primitives";
import {
  Home,
  BarChart3,
  Users,
  Settings,
  FileText,
  Bell,
  HelpCircle,
  LogOut,
} from "lucide-react";

const meta: Meta<typeof SideNavbar> = {
  title: "Components/SideNavbar",
  component: SideNavbar,
  parameters: {
    docs: {
      description: {
        component: `
## SideNavbar

A collapsible sidebar with navigation icons column (always visible) and expandable content area with optional header and footer. Uses PanelLeft icons for toggle.

### Events

| Event | Description | Parameters | When Fired |
|-------|-------------|------------|------------|
| \`onCollapseChange\` | Estado de colapso mudou | \`(collapsed: boolean) => void\` | Quando a sidebar é expandida ou colapsada |

### States

| State | Description | How to Activate | Visual |
|-------|-------------|-----------------|--------|
| \`expanded\` | Sidebar expandida | Estado inicial ou \`collapsed={false}\` | Sidebar com conteúdo visível |
| \`collapsed\` | Sidebar colapsada | \`collapsed={true}\` ou \`defaultCollapsed={true}\` | Apenas ícones de navegação visíveis |
| \`default\` | Variante padrão | \`variant="default"\` ou padrão | Estilo padrão |
| \`compact\` | Variante compacta | \`variant="compact"\` | Estilo compacto |
| \`elevated\` | Variante elevada | \`variant="elevated"\` | Estilo com elevação |
        `,
      },
    },
    layout: "fullscreen",
  },
  argTypes: {
    width: {
      control: "text",
      description: "Total width when expanded",
    },
    navigationWidth: {
      control: "text",
      description: "Width of the navigation column (icons)",
    },
    defaultCollapsed: {
      control: "boolean",
      description: "Initial collapsed state",
    },
    variant: {
      control: "select",
      options: ["default", "compact", "elevated"],
      description: "Visual variant",
    },
    showToggle: {
      control: "boolean",
      description: "Whether to show the toggle button",
    },
    togglePosition: {
      control: "select",
      options: ["floating", "top", "bottom"],
      description: "Position of the toggle button",
    },
  },
};

export default meta;
type Story = StoryObj<typeof SideNavbar>;

// Tab metadata for navigation. Driving the rendered triggers from this
// single source of truth keeps icon+label paired — the previous version
// declared an unused `tabLabels` map next to a JSX block that hardcoded
// 5 icon-only triggers without aria-label, producing 38 button-name
// axe violations across the SideNavbar stories.
type TabKey = "home" | "analytics" | "users" | "documents" | "settings";
const tabs: ReadonlyArray<{
  value: TabKey;
  label: string;
  Icon: React.ComponentType<{ className?: string }>;
}> = [
  { value: "home", label: "Home", Icon: Home },
  { value: "analytics", label: "Analytics", Icon: BarChart3 },
  { value: "users", label: "Users", Icon: Users },
  { value: "documents", label: "Documents", Icon: FileText },
  { value: "settings", label: "Settings", Icon: Settings },
];
const tabLabels: Record<string, string> = Object.fromEntries(
  tabs.map((t) => [t.value, t.label]),
);

// Shared navigation tabs component.
//
// HISTORICAL NOTE (PR52 → PR60 followup): These icon-only navigation
// items WERE built on the Tabs primitive with `role="tab"`. The role
// lied in two dimensions:
//
//   (1) tabs require tabpanels — there are none rendered here; the
//       items don't switch panels, they swap state for an adjacent
//       Sidebar.Content area. axe `aria-valid-attr-value` flagged the
//       dangling `aria-controls="tabpanel-X"` references on every story.
//   (2) the visual is a vertical stack, but the Tabs.List orientation
//       prop was being passed on the wrong sub-component (Tabs.List
//       silently spreads it as an HTML attribute; orientation must go
//       on the Tabs root). Result: visual vertical + keyboard horizontal
//       (ArrowRight cycled, ArrowDown — what users actually try in a
//       vertical menu — did nothing). See BACKLOG "Tabs primitive —
//       orientation handling" for the underlying primitive gotcha.
//
// WAI-ARIA pattern: a sidebar navigation menu is `<nav>` containing
// `<button>` (or `<a>`) items, with `aria-current="page"` on the
// active item. Keyboard is plain Tab-by-Tab (standard navigation
// list); not setas (that would be a tablist or menu pattern). The
// aria-labels from PR52 are preserved — they were always the right
// names (the destination of each item); only the role and keyboard
// model are corrected.
const NavigationTabs = ({
  activeTab,
  onTabChange,
}: {
  activeTab: string;
  onTabChange: (tab: string) => void;
}) => (
  <nav aria-label="Sidebar sections" className="w-full p-2 flex flex-col gap-1">
    {tabs.map(({ value, label, Icon }) => {
      const isActive = activeTab === value;
      return (
        <button
          key={value}
          type="button"
          aria-label={label}
          aria-current={isActive ? "page" : undefined}
          onClick={() => onTabChange(value)}
          className={`w-full aspect-square flex items-center justify-center p-2 rounded-md transition-colors ${
            isActive
              ? "bg-surface-brand-muted text-fg-brand-emphasis"
              : "text-fg-secondary hover:bg-surface-hover"
          }`}
        >
          <Icon className="h-5 w-5" />
        </button>
      );
    })}
  </nav>
);

// Layout wrapper for stories
const LayoutWrapper = ({ children }: { children: React.ReactNode }) => (
  <div className="flex h-screen bg-surface-muted">
    {children}
    <div className="flex-1 p-6">
      <h1 className="text-2xl font-bold mb-4">Main Content Area</h1>
      <p className="text-fg-secondary">
        Click the toggle button on the sidebar edge to collapse/expand. The
        navigation icons remain visible when collapsed.
      </p>
    </div>
  </div>
);

/**
 * Default SideNavbar with vertical navigation and toggle on right edge
 *
 * This is the recommended usage pattern:
 * - Navigation items are displayed vertically in the navbar
 * - Toggle button is positioned on the right edge of the navbar, vertically centered
 * - Sidebar content expands/collapses while navigation icons remain visible
 */
export const Default: Story = {
  render: () => {
    const [activeItem, setActiveItem] = useState("home");

    return (
      <LayoutWrapper>
        <SideNavbar showToggle togglePosition="floating">
          <SideNavbar.Navbar>
            {/* Vertical navigation items */}
            <SideNavbar.Navbar.Item
              id="home"
              icon={<Home className="h-5 w-5" />}
              label="Home"
              active={activeItem === "home"}
              onClick={() => setActiveItem("home")}
            />
            <SideNavbar.Navbar.Item
              id="analytics"
              icon={<BarChart3 className="h-5 w-5" />}
              label="Analytics"
              active={activeItem === "analytics"}
              onClick={() => setActiveItem("analytics")}
            />
            <SideNavbar.Navbar.Item
              id="users"
              icon={<Users className="h-5 w-5" />}
              label="Users"
              badge={12}
              active={activeItem === "users"}
              onClick={() => setActiveItem("users")}
            />
            <SideNavbar.Navbar.Item
              id="documents"
              icon={<FileText className="h-5 w-5" />}
              label="Documents"
              active={activeItem === "documents"}
              onClick={() => setActiveItem("documents")}
            />

            <SideNavbar.Navbar.Separator />

            <SideNavbar.Navbar.Item
              id="settings"
              icon={<Settings className="h-5 w-5" />}
              label="Settings"
              active={activeItem === "settings"}
              onClick={() => setActiveItem("settings")}
            />
          </SideNavbar.Navbar>

          <SideNavbar.Sidebar>
            <SideNavbar.Sidebar.Header
              title={activeItem.charAt(0).toUpperCase() + activeItem.slice(1)}
              subtitle="Main navigation"
            />
            <SideNavbar.Sidebar.Content>
              <div className="space-y-4">
                <Card>
                  <h3 className="font-semibold mb-2">
                    Welcome to{" "}
                    {activeItem.charAt(0).toUpperCase() + activeItem.slice(1)}
                  </h3>
                  <p className="text-fg-secondary">
                    This is the content area for the {activeItem} section. Click
                    the toggle button on the right edge of the navbar to
                    collapse/expand the sidebar. The navigation icons remain
                    visible when collapsed.
                  </p>
                </Card>
              </div>
            </SideNavbar.Sidebar.Content>
          </SideNavbar.Sidebar>
        </SideNavbar>
      </LayoutWrapper>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          "Default SideNavbar with vertical navigation items and toggle button on the right edge. This is the recommended usage pattern.",
      },
    },
  },
};

/**
 * SideNavbar that starts collapsed
 *
 * Shows only the vertical navigation icons. The toggle button on the right edge
 * can be used to expand the sidebar.
 */
export const Collapsed: Story = {
  render: () => {
    const [activeItem, setActiveItem] = useState("home");

    return (
      <LayoutWrapper>
        <SideNavbar defaultCollapsed showToggle togglePosition="floating">
          <SideNavbar.Navbar>
            {/* Vertical navigation items - visible even when collapsed */}
            <SideNavbar.Navbar.Item
              id="home"
              icon={<Home className="h-5 w-5" />}
              label="Home"
              active={activeItem === "home"}
              onClick={() => setActiveItem("home")}
            />
            <SideNavbar.Navbar.Item
              id="analytics"
              icon={<BarChart3 className="h-5 w-5" />}
              label="Analytics"
              active={activeItem === "analytics"}
              onClick={() => setActiveItem("analytics")}
            />
            <SideNavbar.Navbar.Item
              id="users"
              icon={<Users className="h-5 w-5" />}
              label="Users"
              badge={12}
              active={activeItem === "users"}
              onClick={() => setActiveItem("users")}
            />
            <SideNavbar.Navbar.Item
              id="documents"
              icon={<FileText className="h-5 w-5" />}
              label="Documents"
              active={activeItem === "documents"}
              onClick={() => setActiveItem("documents")}
            />

            <SideNavbar.Navbar.Separator />

            <SideNavbar.Navbar.Item
              id="settings"
              icon={<Settings className="h-5 w-5" />}
              label="Settings"
              active={activeItem === "settings"}
              onClick={() => setActiveItem("settings")}
            />
          </SideNavbar.Navbar>

          <SideNavbar.Sidebar>
            <SideNavbar.Sidebar.Header
              title={activeItem.charAt(0).toUpperCase() + activeItem.slice(1)}
            />
            <SideNavbar.Sidebar.Content>
              <Card>
                <p className="text-fg-secondary">
                  The collapsed state is persisted to localStorage. Refresh the
                  page and the sidebar will remember its state.
                </p>
              </Card>
            </SideNavbar.Sidebar.Content>
          </SideNavbar.Sidebar>
        </SideNavbar>
      </LayoutWrapper>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          "SideNavbar starting in collapsed state. Only navigation icons are visible. Use the toggle button on the right edge to expand.",
      },
    },
  },
};

/**
 * SideNavbar with header containing title and subtitle
 */
export const WithHeader: Story = {
  render: () => {
    const [activeTab, setActiveTab] = useState("analytics");

    return (
      <LayoutWrapper>
        <SideNavbar>
          <SideNavbar.Navbar>
            <NavigationTabs activeTab={activeTab} onTabChange={setActiveTab} />
          </SideNavbar.Navbar>

          <SideNavbar.Sidebar>
            <SideNavbar.Sidebar.Header
              title={tabLabels[activeTab]}
              subtitle="View your metrics and reports"
            />
            <SideNavbar.Sidebar.Content>
              <div className="space-y-4">
                <Card>
                  <h4 className="font-semibold mb-2">Monthly Revenue</h4>
                  <p className="text-3xl font-bold text-fg-primary">$45,231</p>
                  <p className="text-sm text-fg-tertiary">
                    +12% from last month
                  </p>
                </Card>
                <Card>
                  <h4 className="font-semibold mb-2">Active Users</h4>
                  <p className="text-3xl font-bold text-fg-primary">2,345</p>
                  <p className="text-sm text-fg-tertiary">+5% from last week</p>
                </Card>
              </div>
            </SideNavbar.Sidebar.Content>
          </SideNavbar.Sidebar>
        </SideNavbar>
      </LayoutWrapper>
    );
  },
};

/**
 * SideNavbar with footer containing actions
 */
export const WithFooter: Story = {
  render: () => {
    const [activeTab, setActiveTab] = useState("settings");

    return (
      <LayoutWrapper>
        <SideNavbar>
          <SideNavbar.Navbar>
            <NavigationTabs activeTab={activeTab} onTabChange={setActiveTab} />
          </SideNavbar.Navbar>

          <SideNavbar.Sidebar>
            <SideNavbar.Sidebar.Header title={tabLabels[activeTab]} />
            <SideNavbar.Sidebar.Content>
              <div className="space-y-4">
                {/* Migrated from raw `<input>` + `<label>` prose pair to
                    the `Input` primitive, which wires `<label htmlFor>`
                    to the input via useId. The raw form failed axe
                    `label` (critical) because the `<label>` was a
                    sibling without `htmlFor` — 2 nodes at the
                    baseline-of-record. */}
                <Input
                  type="text"
                  label="Display Name"
                  defaultValue="John Doe"
                />
                <Input
                  type="email"
                  label="Email"
                  defaultValue="john@example.com"
                />
              </div>
            </SideNavbar.Sidebar.Content>
            <SideNavbar.Sidebar.Footer>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1">
                  Cancel
                </Button>
                <Button variant="primary" size="sm" className="flex-1">
                  Save Changes
                </Button>
              </div>
            </SideNavbar.Sidebar.Footer>
          </SideNavbar.Sidebar>
        </SideNavbar>
      </LayoutWrapper>
    );
  },
};

/**
 * Complete SideNavbar with header, content and footer
 */
export const WithHeaderAndFooter: Story = {
  render: () => {
    const [activeTab, setActiveTab] = useState("users");

    return (
      <LayoutWrapper>
        <SideNavbar>
          <SideNavbar.Navbar>
            <NavigationTabs activeTab={activeTab} onTabChange={setActiveTab} />
          </SideNavbar.Navbar>

          <SideNavbar.Sidebar>
            <SideNavbar.Sidebar.Header
              title="User Management"
              subtitle="Manage your team members"
            />
            <SideNavbar.Sidebar.Content>
              <div className="space-y-2">
                {[
                  "Alice Johnson",
                  "Bob Smith",
                  "Carol White",
                  "David Brown",
                ].map((name) => (
                  <div
                    key={name}
                    className="flex items-center gap-3 p-3 bg-surface-base rounded-lg border"
                  >
                    <div className="w-8 h-8 rounded-full bg-surface-brand-subtle flex items-center justify-center">
                      <Users className="w-4 h-4 text-fg-brand-emphasis" />
                    </div>
                    <div>
                      <p className="font-medium">{name}</p>
                      <p className="text-sm text-fg-tertiary">Team member</p>
                    </div>
                  </div>
                ))}
              </div>
            </SideNavbar.Sidebar.Content>
            <SideNavbar.Sidebar.Footer>
              <Button variant="primary" size="sm" className="w-full">
                <Users className="w-4 h-4 mr-2" />
                Add Team Member
              </Button>
            </SideNavbar.Sidebar.Footer>
          </SideNavbar.Sidebar>
        </SideNavbar>
      </LayoutWrapper>
    );
  },
};

/**
 * Controlled SideNavbar with external state management
 */
export const Controlled: Story = {
  render: () => {
    const [activeTab, setActiveTab] = useState("home");
    const [collapsed, setCollapsed] = useState(false);

    return (
      <LayoutWrapper>
        <SideNavbar collapsed={collapsed} onCollapseChange={setCollapsed}>
          <SideNavbar.Navbar>
            <NavigationTabs activeTab={activeTab} onTabChange={setActiveTab} />
          </SideNavbar.Navbar>

          <SideNavbar.Sidebar>
            <SideNavbar.Sidebar.Header title={tabLabels[activeTab]} />
            <SideNavbar.Sidebar.Content>
              <Card>
                <p className="mb-4">
                  Sidebar is currently:{" "}
                  <strong>{collapsed ? "Collapsed" : "Expanded"}</strong>
                </p>
                <Button
                  variant="outline"
                  onClick={() => setCollapsed(!collapsed)}
                >
                  Toggle from Outside
                </Button>
              </Card>
            </SideNavbar.Sidebar.Content>
          </SideNavbar.Sidebar>
        </SideNavbar>
      </LayoutWrapper>
    );
  },
};

/**
 * SideNavbar with localStorage persistence
 */
export const WithPersistence: Story = {
  render: () => {
    const [activeTab, setActiveTab] = useState("home");

    return (
      <LayoutWrapper>
        <SideNavbar storageKey="storybook-sidenav-demo">
          <SideNavbar.Navbar>
            <NavigationTabs activeTab={activeTab} onTabChange={setActiveTab} />
          </SideNavbar.Navbar>

          <SideNavbar.Sidebar>
            <SideNavbar.Sidebar.Header title={tabLabels[activeTab]} />
            <SideNavbar.Sidebar.Content>
              <Card>
                <p className="text-sm text-fg-secondary">
                  The collapsed state is persisted to localStorage. Refresh the
                  page and the sidebar will remember its state.
                </p>
              </Card>
            </SideNavbar.Sidebar.Content>
          </SideNavbar.Sidebar>
        </SideNavbar>
      </LayoutWrapper>
    );
  },
};

/**
 * SideNavbar with custom width
 */
export const CustomWidth: Story = {
  render: () => {
    const [activeTab, setActiveTab] = useState("home");

    return (
      <LayoutWrapper>
        <SideNavbar width="400px" navigationWidth="64px">
          <SideNavbar.Navbar>
            <NavigationTabs activeTab={activeTab} onTabChange={setActiveTab} />
          </SideNavbar.Navbar>

          <SideNavbar.Sidebar>
            <SideNavbar.Sidebar.Header
              title={tabLabels[activeTab]}
              subtitle="With wider dimensions"
            />
            <SideNavbar.Sidebar.Content>
              <p className="text-fg-secondary">
                This sidebar has a custom width of 400px and navigation width of
                64px.
              </p>
            </SideNavbar.Sidebar.Content>
          </SideNavbar.Sidebar>
        </SideNavbar>
      </LayoutWrapper>
    );
  },
};

/**
 * Different visual variants
 */
export const Variants: Story = {
  render: () => {
    const [activeTab, setActiveTab] = useState("home");

    return (
      <div className="flex h-screen bg-surface-muted gap-4 p-4">
        {(["default", "compact", "elevated"] as const).map((variant) => (
          <div key={variant} className="flex flex-col">
            <span className="text-sm font-medium mb-2 capitalize">
              {variant}
            </span>
            <div className="flex-1 border rounded-lg overflow-hidden">
              <SideNavbar
                variant={variant}
                width="200px"
                aria-label={`Sidebar — ${variant} variant`}
              >
                <SideNavbar.Navbar>
                  <NavigationTabs
                    activeTab={activeTab}
                    onTabChange={setActiveTab}
                  />
                </SideNavbar.Navbar>

                <SideNavbar.Sidebar>
                  <SideNavbar.Sidebar.Header title={variant} />
                  <SideNavbar.Sidebar.Content>
                    <p className="text-xs">Variant: {variant}</p>
                  </SideNavbar.Sidebar.Content>
                </SideNavbar.Sidebar>
              </SideNavbar>
            </div>
          </div>
        ))}
      </div>
    );
  },
};

/**
 * SideNavbar with long scrollable content
 */
export const LongContent: Story = {
  render: () => {
    const [activeTab, setActiveTab] = useState("documents");

    return (
      <LayoutWrapper>
        <SideNavbar>
          <SideNavbar.Navbar>
            <NavigationTabs activeTab={activeTab} onTabChange={setActiveTab} />
          </SideNavbar.Navbar>

          <SideNavbar.Sidebar>
            <SideNavbar.Sidebar.Header
              title="Documents"
              subtitle="All your files"
            />
            <SideNavbar.Sidebar.Content>
              <div className="space-y-2">
                {Array.from({ length: 20 }, (_, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 p-3 bg-surface-base rounded-lg border hover:bg-surface-hover cursor-pointer"
                  >
                    <FileText className="w-5 h-5 text-fg-quaternary" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">
                        Document {i + 1}.pdf
                      </p>
                      <p className="text-xs text-fg-tertiary">
                        Modified 2 days ago
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </SideNavbar.Sidebar.Content>
            <SideNavbar.Sidebar.Footer>
              <p className="text-xs text-center text-fg-tertiary">
                20 documents
              </p>
            </SideNavbar.Sidebar.Footer>
          </SideNavbar.Sidebar>
        </SideNavbar>
      </LayoutWrapper>
    );
  },
};

/**
 * SideNavbar with additional navigation items at bottom
 */
export const WithBottomNavigation: Story = {
  render: () => {
    const [activeTab, setActiveTab] = useState("home");

    return (
      <LayoutWrapper>
        <SideNavbar>
          <SideNavbar.Navbar>
            <div className="flex flex-col h-full">
              <NavigationTabs
                activeTab={activeTab}
                onTabChange={setActiveTab}
              />
              <div className="mt-auto p-2 space-y-1">
                <button
                  type="button"
                  aria-label="Notifications"
                  className="w-full aspect-square flex items-center justify-center p-2 rounded-md text-fg-tertiary hover:bg-surface-muted"
                >
                  <Bell className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  aria-label="Help"
                  className="w-full aspect-square flex items-center justify-center p-2 rounded-md text-fg-tertiary hover:bg-surface-muted"
                >
                  <HelpCircle className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  aria-label="Log out"
                  className="w-full aspect-square flex items-center justify-center p-2 rounded-md text-fg-error hover:bg-error-bg"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            </div>
          </SideNavbar.Navbar>

          <SideNavbar.Sidebar>
            <SideNavbar.Sidebar.Header title={tabLabels[activeTab]} />
            <SideNavbar.Sidebar.Content>
              <p className="text-fg-secondary">
                The navigation column has additional icons at the bottom for
                notifications, help, and logout.
              </p>
            </SideNavbar.Sidebar.Content>
          </SideNavbar.Sidebar>
        </SideNavbar>
      </LayoutWrapper>
    );
  },
};

/**
 * SideNavbar using Navbar.Item compound component with badges and variants
 *
 * Demonstrates the recommended pattern: navigation items are placed directly
 * in the Navbar component, which automatically arranges them vertically.
 * The toggle button is positioned on the right edge of the navbar.
 */
export const WithNavbarItems: Story = {
  render: () => {
    const [activeItem, setActiveItem] = useState("home");

    return (
      <LayoutWrapper>
        <SideNavbar showToggle togglePosition="floating">
          <SideNavbar.Navbar>
            {/* Main navigation items - automatically arranged vertically */}
            <SideNavbar.Navbar.Item
              id="home"
              icon={<Home className="h-5 w-5" />}
              label="Home"
              active={activeItem === "home"}
              onClick={() => setActiveItem("home")}
            />
            <SideNavbar.Navbar.Item
              id="analytics"
              icon={<BarChart3 className="h-5 w-5" />}
              label="Analytics"
              active={activeItem === "analytics"}
              onClick={() => setActiveItem("analytics")}
            />
            <SideNavbar.Navbar.Item
              id="users"
              icon={<Users className="h-5 w-5" />}
              label="Users"
              badge={12}
              badgeVariant="default"
              active={activeItem === "users"}
              onClick={() => setActiveItem("users")}
            />
            <SideNavbar.Navbar.Item
              id="documents"
              icon={<FileText className="h-5 w-5" />}
              label="Documents"
              active={activeItem === "documents"}
              onClick={() => setActiveItem("documents")}
            />

            <SideNavbar.Navbar.Separator />

            {/* Bottom items - use mt-auto wrapper for items that should stick to bottom */}
            <div className="mt-auto">
              <SideNavbar.Navbar.Item
                id="notifications"
                icon={<Bell className="h-5 w-5" />}
                label="Notifications"
                badge={3}
                badgeVariant="danger"
                onClick={() => setActiveItem("notifications")}
              />
              <SideNavbar.Navbar.Item
                id="help"
                icon={<HelpCircle className="h-5 w-5" />}
                label="Help & Support"
                href="/help"
              />
              <SideNavbar.Navbar.Item
                id="settings"
                icon={<Settings className="h-5 w-5" />}
                label="Settings"
                active={activeItem === "settings"}
                onClick={() => setActiveItem("settings")}
              />
            </div>
          </SideNavbar.Navbar>

          <SideNavbar.Sidebar>
            <SideNavbar.Sidebar.Header
              title={activeItem.charAt(0).toUpperCase() + activeItem.slice(1)}
              subtitle="Using Navbar.Item compound component"
            />
            <SideNavbar.Sidebar.Content>
              <Card>
                <p className="text-fg-secondary">
                  This example uses <code>SideNavbar.Navbar.Item</code> compound
                  component which supports:
                </p>
                <ul className="list-disc list-inside mt-2 text-sm text-fg-secondary space-y-1">
                  <li>Active state management</li>
                  <li>
                    Badges with variants (default, success, warning, danger)
                  </li>
                  <li>Tooltips on hover (when collapsed)</li>
                  <li>Link support with href</li>
                  <li>Disabled state</li>
                  <li>Multiple sizes (sm, md, lg)</li>
                </ul>
                <p className="text-sm text-fg-tertiary mt-4">
                  <strong>Note:</strong> Navigation items are automatically
                  arranged vertically. The toggle button is positioned on the
                  right edge of the navbar.
                </p>
              </Card>
            </SideNavbar.Sidebar.Content>
          </SideNavbar.Sidebar>
        </SideNavbar>
      </LayoutWrapper>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          "Demonstrates the recommended usage pattern with Navbar.Item components. Items are automatically arranged vertically, and the toggle button is on the right edge.",
      },
    },
  },
};

// Event Stories
export const WithEvents: Story = {
  render: () => {
    const [activeTab, setActiveTab] = useState("home");
    const [collapsed, setCollapsed] = useState(false);
    const handleCollapseChange = fn((newCollapsed: boolean) => {
      setCollapsed(newCollapsed);
    });

    return (
      <LayoutWrapper>
        <SideNavbar
          collapsed={collapsed}
          onCollapseChange={handleCollapseChange}
        >
          <SideNavbar.Navbar>
            <NavigationTabs activeTab={activeTab} onTabChange={setActiveTab} />
          </SideNavbar.Navbar>
          <SideNavbar.Sidebar>
            <SideNavbar.Sidebar.Header title={tabLabels[activeTab]} />
            <SideNavbar.Sidebar.Content>
              <Card>
                <p className="text-sm text-fg-secondary">
                  Toggle the sidebar. Check the Actions panel to see events
                  being fired.
                </p>
                <p className="text-sm text-fg-tertiary mt-2">
                  Collapsed: {collapsed ? "Yes" : "No"}
                </p>
              </Card>
            </SideNavbar.Sidebar.Content>
          </SideNavbar.Sidebar>
        </SideNavbar>
      </LayoutWrapper>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // Wait for sidebar to be rendered
    await waitFor(() => {
      expect(canvas.getByText("Home")).toBeInTheDocument();
    });
  },
  parameters: {
    docs: {
      description: {
        story:
          "Demonstrates sidebar events. Toggle the sidebar and check the Actions panel to see events being logged.",
      },
    },
  },
};

// State Stories
export const ExpandedState: Story = {
  render: () => {
    const [activeTab, setActiveTab] = useState("home");
    return (
      <LayoutWrapper>
        <SideNavbar collapsed={false}>
          <SideNavbar.Navbar>
            <NavigationTabs activeTab={activeTab} onTabChange={setActiveTab} />
          </SideNavbar.Navbar>
          <SideNavbar.Sidebar>
            <SideNavbar.Sidebar.Header title={tabLabels[activeTab]} />
            <SideNavbar.Sidebar.Content>
              <p>Sidebar is expanded.</p>
            </SideNavbar.Sidebar.Content>
          </SideNavbar.Sidebar>
        </SideNavbar>
      </LayoutWrapper>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          "Expanded state - sidebar is fully expanded with content visible.",
      },
    },
  },
};

export const CollapsedState: Story = {
  render: () => {
    const [activeTab, setActiveTab] = useState("home");
    return (
      <LayoutWrapper>
        <SideNavbar collapsed={true}>
          <SideNavbar.Navbar>
            <NavigationTabs activeTab={activeTab} onTabChange={setActiveTab} />
          </SideNavbar.Navbar>
          <SideNavbar.Sidebar>
            <SideNavbar.Sidebar.Header title={tabLabels[activeTab]} />
            <SideNavbar.Sidebar.Content>
              <p>Sidebar is collapsed.</p>
            </SideNavbar.Sidebar.Content>
          </SideNavbar.Sidebar>
        </SideNavbar>
      </LayoutWrapper>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          "Collapsed state - sidebar is collapsed showing only navigation icons.",
      },
    },
  },
};

// ============================================================================
// Phase 2: Edge-Following Toggle Stories
// ============================================================================

/**
 * Toggle positioned at top-right of navbar
 */
export const ToggleAtNavbarTop: Story = {
  render: () => {
    const [activeTab, setActiveTab] = useState("home");
    return (
      <LayoutWrapper>
        <SideNavbar togglePosition="floating">
          <SideNavbar.Navbar>
            <NavigationTabs activeTab={activeTab} onTabChange={setActiveTab} />
          </SideNavbar.Navbar>
          <SideNavbar.Sidebar>
            <SideNavbar.Sidebar.Header title={tabLabels[activeTab]} />
            <SideNavbar.Sidebar.Content>
              <Card>
                <h3 className="font-semibold mb-2">
                  Toggle at Navbar Top-Right
                </h3>
                <p className="text-sm text-fg-secondary">
                  The toggle button is positioned at the top-right corner of the
                  navbar. It stays fixed at the navbar's right edge and smoothly
                  transitions as the sidebar expands and collapses.
                </p>
                <p className="text-sm text-fg-tertiary mt-2">
                  The toggle always remains at the navbar's edge, regardless of
                  the sidebar's state. This provides consistent access to the
                  collapse/expand functionality.
                </p>
              </Card>
            </SideNavbar.Sidebar.Content>
          </SideNavbar.Sidebar>
        </SideNavbar>
      </LayoutWrapper>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          "Demonstrates the toggle button positioned at the top-right of the navbar. The toggle stays at the navbar edge and smoothly transitions with the sidebar state.",
      },
    },
  },
};

// ============================================================================
// Phase 3: Slot System Stories
// ============================================================================

/**
 * Slot system for dynamic sidebar content
 * Note: This story demonstrates the slot system but uses a simplified approach
 * without the navigation hook to avoid Storybook import issues
 */
export const WithSlotSystem: Story = {
  render: () => {
    return (
      <LayoutWrapper>
        <SideNavbar>
          <SidebarSlotProvider defaultSlot="dashboard">
            <SideNavbar.Navbar>
              <div className="flex flex-col h-full p-2 gap-1">
                <SideNavbar.Navbar.Item
                  id="dashboard"
                  icon={<Home className="h-5 w-5" />}
                  label="Dashboard"
                />
                <SideNavbar.Navbar.Item
                  id="analytics"
                  icon={<BarChart3 className="h-5 w-5" />}
                  label="Analytics"
                />
                <SideNavbar.Navbar.Item
                  id="settings"
                  icon={<Settings className="h-5 w-5" />}
                  label="Settings"
                />
              </div>
            </SideNavbar.Navbar>

            <SideNavbar.Sidebar>
              <SideNavbar.Sidebar.Header title="Dynamic Content" />
              <SideNavbar.Sidebar.Content>
                <Card className="mb-4">
                  <p className="text-xs text-fg-tertiary mb-2">
                    <strong>Note:</strong> Slots are exclusive to the Sidebar
                    component. They cannot be used in the Navbar.
                  </p>
                </Card>
                <SidebarSlot id="dashboard">
                  <Card>
                    <h3 className="font-semibold mb-2">Dashboard Content</h3>
                    <p className="text-sm text-fg-secondary">
                      This content is shown when the dashboard item is active.
                      Use the useSideNavbarNavigation hook to switch slots
                      programmatically.
                    </p>
                  </Card>
                </SidebarSlot>
                <SidebarSlot id="analytics">
                  <Card>
                    <h3 className="font-semibold mb-2">Analytics Content</h3>
                    <p className="text-sm text-fg-secondary">
                      This content is shown when the analytics item is active.
                    </p>
                  </Card>
                </SidebarSlot>
                <SidebarSlot id="settings">
                  <Card>
                    <h3 className="font-semibold mb-2">Settings Content</h3>
                    <p className="text-sm text-fg-secondary">
                      This content is shown when the settings item is active.
                    </p>
                  </Card>
                </SidebarSlot>
                <SidebarSlotContent fallback={<p>No content selected</p>} />
              </SideNavbar.Sidebar.Content>
            </SideNavbar.Sidebar>
          </SidebarSlotProvider>
        </SideNavbar>
      </LayoutWrapper>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          "Demonstrates the slot system for dynamic sidebar content. Different slots can be registered and switched dynamically.",
      },
    },
  },
};

// ============================================================================
// Phase 4: Enhanced Navbar Stories
// ============================================================================

/**
 * Navbar with inline labels
 */
export const NavbarWithInlineLabels: Story = {
  render: () => {
    const [activeItem, setActiveItem] = useState("home");
    return (
      <LayoutWrapper>
        <SideNavbar>
          <SideNavbar.Navbar labelMode="inline" expandedWidth={200}>
            <div className="flex flex-col h-full p-2 gap-1">
              <SideNavbar.Navbar.Item
                id="home"
                icon={<Home className="h-5 w-5" />}
                label="Home"
                active={activeItem === "home"}
                onClick={() => setActiveItem("home")}
              />
              <SideNavbar.Navbar.Item
                id="analytics"
                icon={<BarChart3 className="h-5 w-5" />}
                label="Analytics"
                active={activeItem === "analytics"}
                onClick={() => setActiveItem("analytics")}
              />
              <SideNavbar.Navbar.Item
                id="users"
                icon={<Users className="h-5 w-5" />}
                label="Users"
                badge={12}
                active={activeItem === "users"}
                onClick={() => setActiveItem("users")}
              />
              <SideNavbar.Navbar.Item
                id="settings"
                icon={<Settings className="h-5 w-5" />}
                label="Settings"
                active={activeItem === "settings"}
                onClick={() => setActiveItem("settings")}
              />
            </div>
          </SideNavbar.Navbar>
          <SideNavbar.Sidebar>
            <SideNavbar.Sidebar.Header title="Inline Labels" />
            <SideNavbar.Sidebar.Content>
              <Card>
                <p className="text-sm text-fg-secondary">
                  The navbar expands to show labels inline with icons when not
                  collapsed.
                </p>
              </Card>
            </SideNavbar.Sidebar.Content>
          </SideNavbar.Sidebar>
        </SideNavbar>
      </LayoutWrapper>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          "Navbar with inline labels. When expanded, labels appear next to icons.",
      },
    },
  },
};

/**
 * Navbar with labels below icons
 */
export const NavbarWithLabelsBelow: Story = {
  render: () => {
    const [activeItem, setActiveItem] = useState("home");
    return (
      <LayoutWrapper>
        <SideNavbar>
          <SideNavbar.Navbar labelMode="below">
            <div className="flex flex-col h-full p-2 gap-1">
              <SideNavbar.Navbar.Item
                id="home"
                icon={<Home className="h-5 w-5" />}
                label="Home"
                active={activeItem === "home"}
                onClick={() => setActiveItem("home")}
              />
              <SideNavbar.Navbar.Item
                id="analytics"
                icon={<BarChart3 className="h-5 w-5" />}
                label="Analytics"
                active={activeItem === "analytics"}
                onClick={() => setActiveItem("analytics")}
              />
              <SideNavbar.Navbar.Item
                id="users"
                icon={<Users className="h-5 w-5" />}
                label="Users"
                badge={12}
                active={activeItem === "users"}
                onClick={() => setActiveItem("users")}
              />
            </div>
          </SideNavbar.Navbar>
          <SideNavbar.Sidebar>
            <SideNavbar.Sidebar.Header title="Labels Below" />
            <SideNavbar.Sidebar.Content>
              <Card>
                <p className="text-sm text-fg-secondary">
                  Labels appear below icons in this mode.
                </p>
              </Card>
            </SideNavbar.Sidebar.Content>
          </SideNavbar.Sidebar>
        </SideNavbar>
      </LayoutWrapper>
    );
  },
  parameters: {
    docs: {
      description: {
        story: "Navbar with labels displayed below icons.",
      },
    },
  },
};

/**
 * Navbar with groups
 */
export const NavbarWithGroups: Story = {
  render: () => {
    const [activeItem, setActiveItem] = useState("home");
    return (
      <LayoutWrapper>
        <SideNavbar showToggle togglePosition="floating">
          <SideNavbar.Navbar>
            {/* Groups automatically arrange items vertically */}
            <SideNavbar.Navbar.Group
              label="Main"
              collapsible
              defaultCollapsed={false}
            >
              <SideNavbar.Navbar.Item
                id="home"
                icon={<Home className="h-5 w-5" />}
                label="Home"
                active={activeItem === "home"}
                onClick={() => setActiveItem("home")}
              />
              <SideNavbar.Navbar.Item
                id="analytics"
                icon={<BarChart3 className="h-5 w-5" />}
                label="Analytics"
                active={activeItem === "analytics"}
                onClick={() => setActiveItem("analytics")}
              />
              <SideNavbar.Navbar.Item
                id="users"
                icon={<Users className="h-5 w-5" />}
                label="Users"
                active={activeItem === "users"}
                onClick={() => setActiveItem("users")}
              />
            </SideNavbar.Navbar.Group>

            <SideNavbar.Navbar.Separator />

            <SideNavbar.Navbar.Group
              label="Settings"
              collapsible
              defaultCollapsed={true}
            >
              <SideNavbar.Navbar.Item
                id="settings"
                icon={<Settings className="h-5 w-5" />}
                label="Settings"
                active={activeItem === "settings"}
                onClick={() => setActiveItem("settings")}
              />
              <SideNavbar.Navbar.Item
                id="help"
                icon={<HelpCircle className="h-5 w-5" />}
                label="Help"
                active={activeItem === "help"}
                onClick={() => setActiveItem("help")}
              />
            </SideNavbar.Navbar.Group>
          </SideNavbar.Navbar>
          <SideNavbar.Sidebar>
            <SideNavbar.Sidebar.Header title="Grouped Navigation" />
            <SideNavbar.Sidebar.Content>
              <Card>
                <p className="text-sm text-fg-secondary">
                  Navigation items are grouped with collapsible sections. All
                  items are arranged vertically in the navbar.
                </p>
              </Card>
            </SideNavbar.Sidebar.Content>
          </SideNavbar.Sidebar>
        </SideNavbar>
      </LayoutWrapper>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          "Navbar with grouped items. Groups can be collapsed and expanded. All navigation items are arranged vertically.",
      },
    },
  },
};

/**
 * Real-world Dashboard Example
 *
 * A complete dashboard layout showing how SideNavbar would be used in a real application.
 * Features vertical navigation, toggle on right edge, and realistic content.
 */
export const DashboardExample: Story = {
  render: () => {
    const [activeItem, setActiveItem] = useState("dashboard");

    return (
      <LayoutWrapper>
        <SideNavbar showToggle togglePosition="floating" variant="elevated">
          <SideNavbar.Navbar>
            {/* Primary navigation - vertical layout */}
            <SideNavbar.Navbar.Item
              id="dashboard"
              icon={<Home className="h-5 w-5" />}
              label="Dashboard"
              active={activeItem === "dashboard"}
              onClick={() => setActiveItem("dashboard")}
            />
            <SideNavbar.Navbar.Item
              id="analytics"
              icon={<BarChart3 className="h-5 w-5" />}
              label="Analytics"
              active={activeItem === "analytics"}
              onClick={() => setActiveItem("analytics")}
            />
            <SideNavbar.Navbar.Item
              id="users"
              icon={<Users className="h-5 w-5" />}
              label="Users"
              badge={5}
              active={activeItem === "users"}
              onClick={() => setActiveItem("users")}
            />
            <SideNavbar.Navbar.Item
              id="documents"
              icon={<FileText className="h-5 w-5" />}
              label="Documents"
              active={activeItem === "documents"}
              onClick={() => setActiveItem("documents")}
            />

            <SideNavbar.Navbar.Separator />

            {/* Secondary navigation - pushed to bottom */}
            <div className="mt-auto">
              <SideNavbar.Navbar.Item
                id="notifications"
                icon={<Bell className="h-5 w-5" />}
                label="Notifications"
                badge={3}
                badgeVariant="danger"
                onClick={() => setActiveItem("notifications")}
              />
              <SideNavbar.Navbar.Item
                id="settings"
                icon={<Settings className="h-5 w-5" />}
                label="Settings"
                active={activeItem === "settings"}
                onClick={() => setActiveItem("settings")}
              />
            </div>
          </SideNavbar.Navbar>

          <SideNavbar.Sidebar>
            <SideNavbar.Sidebar.Header
              title={activeItem.charAt(0).toUpperCase() + activeItem.slice(1)}
              subtitle="Dashboard Overview"
            />
            <SideNavbar.Sidebar.Content>
              <div className="space-y-4">
                <Card>
                  <h3 className="font-semibold text-lg mb-2">
                    {activeItem === "dashboard" && "Welcome to Dashboard"}
                    {activeItem === "analytics" && "Analytics Overview"}
                    {activeItem === "users" && "User Management"}
                    {activeItem === "documents" && "Document Library"}
                    {activeItem === "notifications" && "Notifications"}
                    {activeItem === "settings" && "Settings"}
                  </h3>
                  <p className="text-fg-secondary">
                    This is a realistic dashboard example showing how the
                    SideNavbar component is used in production applications.
                    Notice:
                  </p>
                  <ul className="list-disc list-inside mt-2 text-sm text-fg-secondary space-y-1">
                    <li>
                      Navigation items are arranged <strong>vertically</strong>{" "}
                      in the navbar
                    </li>
                    <li>
                      The toggle button is positioned on the{" "}
                      <strong>right edge</strong> of the navbar
                    </li>
                    <li>
                      Items can have badges to show notifications or counts
                    </li>
                    <li>
                      Secondary items are pushed to the bottom using{" "}
                      <code>mt-auto</code>
                    </li>
                    <li>
                      The sidebar content changes based on the active navigation
                      item
                    </li>
                  </ul>
                </Card>
              </div>
            </SideNavbar.Sidebar.Content>
          </SideNavbar.Sidebar>
        </SideNavbar>
      </LayoutWrapper>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          "A complete real-world dashboard example showing the recommended usage pattern: vertical navigation items, toggle on right edge, and realistic content structure.",
      },
    },
  },
};
