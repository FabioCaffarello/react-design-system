import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within, waitFor } from "storybook/test";
import { DashboardLayout } from "./DashboardLayout";
import { Button, Text } from "../../primitives";
import { SideNavbar } from "../../components";
import { Home, Settings, Users, FileText } from "lucide-react";

const meta: Meta<typeof DashboardLayout> = {
  title: "Components/DashboardLayout",
  component: DashboardLayout,
  parameters: {
    layout: "fullscreen",
    // DashboardLayout renders <header> + <main> + <footer> — a real page
    // structure. Re-enable the three landmark/heading rules disabled
    // globally in .storybook/preview.tsx so this component IS held to
    // the page-level a11y contract its API promises.
    //
    // The re-enable is expressed via `options.rules` (run-time) rather
    // than `config.rules` (configure-time). axe-core 4.11.4 ignores
    // configure-time enabled flags when runOnly is tag-based, so the
    // global disable AND any per-story override must both flow through
    // axe.run options. See `.storybook/a11y-config.mjs` for the
    // full rationale.
    a11y: {
      options: {
        rules: {
          region: { enabled: true },
          "landmark-one-main": { enabled: true },
          "page-has-heading-one": { enabled: true },
        },
      },
    },
    docs: {
      description: {
        component: `
## DashboardLayout

A complete dashboard page layout that combines SideNavbar, Container, and Stack.
This template provides a full page structure with header, sidebar, main content, and footer.

### Components Used
- SideNavbar (organism)
- Container (layout)
- Stack (layout)

### Events

| Event | Description | Parameters | When Fired |
|-------|-------------|------------|------------|
| \`onSidebarToggle\` | Sidebar toggle | \`(collapsed: boolean) => void\` | Quando a sidebar é expandida/colapsada |
| \`onNavItemClick\` | Item de navegação clicado | \`(item: { id: string; label: string }) => void\` | Quando um item de navegação é clicado |

### States

| State | Description | How to Activate | Visual |
|-------|-------------|-----------------|--------|
| \`default\` | Default layout | Initial render | Full layout with sidebar |
| \`collapsed\` | Collapsed sidebar | \`defaultCollapsed={true}\` | Sidebar collapsed |
| \`no-sidebar\` | No sidebar | No sidebar prop | No sidebar visible |
| \`minimal\` | Layout minimal | Sem header e footer | Apenas sidebar e conteúdo |
        `,
      },
    },
  },
  argTypes: {
    defaultCollapsed: {
      control: "boolean",
      description: "Sidebar collapsed by default",
    },
  },
};

export default meta;
type Story = StoryObj<typeof DashboardLayout>;

const mockSidebar = (
  <SideNavbar.Navbar>
    <SideNavbar.Navbar.Item
      id="home"
      icon={<Home className="h-5 w-5" />}
      label="Home"
    />
    <SideNavbar.Navbar.Item
      id="users"
      icon={<Users className="h-5 w-5" />}
      label="Users"
    />
    <SideNavbar.Navbar.Item
      id="documents"
      icon={<FileText className="h-5 w-5" />}
      label="Documents"
    />
    <SideNavbar.Navbar.Item
      id="settings"
      icon={<Settings className="h-5 w-5" />}
      label="Settings"
    />
  </SideNavbar.Navbar>
);

export const Default: Story = {
  args: {
    sidebar: mockSidebar,
    header: (
      <div className="flex items-center justify-between">
        <Text variant="heading" className="text-lg">
          Dashboard
        </Text>
        <div className="flex gap-2">
          <Button variant="outline">Settings</Button>
          <Button variant="primary">New Item</Button>
        </div>
      </div>
    ),
    children: (
      <div className="space-y-4">
        <Text variant="heading" className="text-xl">
          Welcome to Dashboard
        </Text>
        <Text>
          This is the main content area. You can add any content here.
        </Text>
        <div className="grid grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-surface-muted p-4 rounded">
              <Text variant="heading" className="text-base">
                Card {i}
              </Text>
              <Text variant="bodySmall">Content for card {i}</Text>
            </div>
          ))}
        </div>
      </div>
    ),
    footer: (
      <div className="flex items-center justify-between">
        <Text variant="bodySmall" className="text-fg-secondary">
          © 2024 Company Name
        </Text>
        <Text variant="bodySmall" className="text-fg-secondary">
          Version 1.0.0
        </Text>
      </div>
    ),
  },
};

export const CollapsedSidebar: Story = {
  args: {
    ...Default.args,
    defaultCollapsed: true,
  },
};

export const NoSidebar: Story = {
  args: {
    sidebar: undefined,
    header: Default.args?.header,
    children: Default.args?.children,
    footer: Default.args?.footer,
  },
};

export const Minimal: Story = {
  args: {
    sidebar: mockSidebar,
    children: (
      <div>
        <Text variant="heading">Minimal Dashboard</Text>
        <Text>No header or footer, just sidebar and content.</Text>
      </div>
    ),
  },
};

// Event Stories
export const WithEvents: Story = {
  render: () => {
    return (
      <div className="space-y-4">
        <p className="text-sm text-fg-secondary">
          Toggle sidebar or click navigation items. Check the Actions panel to
          see events being fired.
        </p>
        <DashboardLayout
          sidebar={mockSidebar}
          header={Default.args?.header}
          children={Default.args?.children}
          footer={Default.args?.footer}
        />
      </div>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await waitFor(
      async () => {
        // Use getAllByText since there are multiple "Dashboard" elements
        const dashboardElements = canvas.getAllByText(/dashboard/i);
        expect(dashboardElements.length).toBeGreaterThan(0);
      },
      { timeout: 3000 },
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          "Demonstrates layout events. Toggle sidebar or click navigation items and check the Actions panel to see events being logged.",
      },
    },
  },
};

// State Stories
export const DefaultState: Story = {
  args: {
    sidebar: mockSidebar,
    header: (
      <div className="flex items-center justify-between">
        <Text variant="heading" className="text-lg">
          Dashboard
        </Text>
        <div className="flex gap-2">
          <Button variant="outline">Settings</Button>
          <Button variant="primary">New Item</Button>
        </div>
      </div>
    ),
    children: (
      <div className="space-y-4">
        <Text variant="heading" className="text-xl">
          Welcome to Dashboard
        </Text>
        <Text>
          This is the main content area. You can add any content here.
        </Text>
      </div>
    ),
    footer: (
      <div className="flex items-center justify-between">
        <Text variant="bodySmall" className="text-fg-secondary">
          © 2024 Company Name
        </Text>
        <Text variant="bodySmall" className="text-fg-secondary">
          Version 1.0.0
        </Text>
      </div>
    ),
  },
  parameters: {
    docs: {
      description: {
        story:
          "Default state - full layout with sidebar, header, content, and footer.",
      },
    },
  },
};

export const CollapsedState: Story = {
  args: {
    ...Default.args,
    defaultCollapsed: true,
  },
  parameters: {
    docs: {
      description: {
        story: "Collapsed state - sidebar is collapsed by default.",
      },
    },
  },
};

export const NoSidebarState: Story = {
  args: {
    sidebar: undefined,
    header: Default.args?.header,
    children: Default.args?.children,
    footer: Default.args?.footer,
  },
  parameters: {
    docs: {
      description: {
        story: "No sidebar state - sidebar is not visible.",
      },
    },
  },
};

export const MinimalState: Story = {
  args: {
    sidebar: mockSidebar,
    children: (
      <div>
        <Text variant="heading">Minimal Dashboard</Text>
        <Text>No header or footer, just sidebar and content.</Text>
      </div>
    ),
  },
  parameters: {
    docs: {
      description: {
        story: "Minimal state - no header or footer, only sidebar and content.",
      },
    },
  },
};
