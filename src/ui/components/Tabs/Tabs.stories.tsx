import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { expect, userEvent, within, waitFor } from "storybook/test";
import React from "react";
import Tabs from "./Tabs";
import Card from "../Card/Card";

const meta: Meta<typeof Tabs> = {
  title: "Components/Tabs",
  component: Tabs,
  parameters: {
    docs: {
      description: {
        component: `
## Tabs

A flexible tabs component with compound components pattern. Supports horizontal and vertical orientations, automatic and manual activation modes. Fully accessible with ARIA attributes and keyboard navigation.

### Events

| Event | Description | Parameters | When Fired |
|-------|-------------|------------|------------|
| \`onValueChange\` | Tab ativo mudou | \`(value: string) => void\` | Quando uma nova tab é selecionada |

### States

| State | Description | How to Activate | Visual |
|-------|-------------|-----------------|--------|
| \`horizontal\` | Orientação horizontal | \`orientation="horizontal"\` ou padrão | Tabs dispostas horizontalmente |
| \`vertical\` | Orientação vertical | \`orientation="vertical"\` | Tabs dispostas verticalmente |
| \`automatic\` | Modo automático | \`activationMode="automatic"\` ou padrão | Tab ativa ao focar |
| \`manual\` | Modo manual | \`activationMode="manual"\` | Tab ativa apenas com Enter/Space |
| \`with-disabled\` | Com tab desabilitada | Tab com \`disabled\` prop | Tab desabilitada não clicável |
        `,
      },
    },
  },
  argTypes: {
    defaultValue: {
      control: "text",
      description: "Default active tab value (uncontrolled)",
    },
    value: {
      control: "text",
      description: "Controlled active tab value",
    },
    onValueChange: {
      action: "valueChanged",
      description: "Callback when active tab changes",
      category: "Events",
    },
    orientation: {
      control: "select",
      options: ["horizontal", "vertical"],
      description: "Orientation of the tabs",
    },
    activationMode: {
      control: "select",
      options: ["automatic", "manual"],
      description:
        "Activation mode: automatic (on focus) or manual (on Enter/Space)",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Tabs>;

export const Default: Story = {
  render: () => (
    <Tabs defaultValue="tab1">
      <Tabs.List>
        <Tabs.Trigger value="tab1">Overview</Tabs.Trigger>
        <Tabs.Trigger value="tab2">Settings</Tabs.Trigger>
        <Tabs.Trigger value="tab3">Billing</Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content value="tab1">
        <Card className="p-4">
          <h3 className="text-lg font-semibold mb-2">Overview</h3>
          <p>
            This is the overview content. Here you can see a summary of your
            account.
          </p>
        </Card>
      </Tabs.Content>
      <Tabs.Content value="tab2">
        <Card className="p-4">
          <h3 className="text-lg font-semibold mb-2">Settings</h3>
          <p>Manage your account settings and preferences here.</p>
        </Card>
      </Tabs.Content>
      <Tabs.Content value="tab3">
        <Card className="p-4">
          <h3 className="text-lg font-semibold mb-2">Billing</h3>
          <p>View and manage your billing information and subscription.</p>
        </Card>
      </Tabs.Content>
    </Tabs>
  ),
};

export const Vertical: Story = {
  render: () => (
    <div className="flex gap-4">
      <Tabs defaultValue="tab1" orientation="vertical">
        <Tabs.List>
          <Tabs.Trigger value="tab1">Profile</Tabs.Trigger>
          <Tabs.Trigger value="tab2">Security</Tabs.Trigger>
          <Tabs.Trigger value="tab3">Notifications</Tabs.Trigger>
        </Tabs.List>
      </Tabs>
      <div className="flex-1">
        <Tabs defaultValue="tab1" orientation="vertical">
          <Tabs.Content value="tab1">
            <Card className="p-4">
              <h3 className="text-lg font-semibold mb-2">Profile</h3>
              <p>Edit your profile information and preferences.</p>
            </Card>
          </Tabs.Content>
          <Tabs.Content value="tab2">
            <Card className="p-4">
              <h3 className="text-lg font-semibold mb-2">Security</h3>
              <p>Manage your security settings and passwords.</p>
            </Card>
          </Tabs.Content>
          <Tabs.Content value="tab3">
            <Card className="p-4">
              <h3 className="text-lg font-semibold mb-2">Notifications</h3>
              <p>Configure your notification preferences.</p>
            </Card>
          </Tabs.Content>
        </Tabs>
      </div>
    </div>
  ),
};

export const ManualActivation: Story = {
  render: () => (
    <Tabs defaultValue="tab1" activationMode="manual">
      <Tabs.List>
        <Tabs.Trigger value="tab1">Tab 1</Tabs.Trigger>
        <Tabs.Trigger value="tab2">Tab 2</Tabs.Trigger>
        <Tabs.Trigger value="tab3">Tab 3</Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content value="tab1">
        <Card className="p-4">
          <p>
            Tab 1 content. In manual mode, tabs only activate on Enter/Space,
            not on focus.
          </p>
        </Card>
      </Tabs.Content>
      <Tabs.Content value="tab2">
        <Card className="p-4">
          <p>Tab 2 content.</p>
        </Card>
      </Tabs.Content>
      <Tabs.Content value="tab3">
        <Card className="p-4">
          <p>Tab 3 content.</p>
        </Card>
      </Tabs.Content>
    </Tabs>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "In manual activation mode, tabs only activate when Enter or Space is pressed, not on focus.",
      },
    },
  },
};

export const WithDisabledTab: Story = {
  render: () => (
    <Tabs defaultValue="tab1">
      <Tabs.List>
        <Tabs.Trigger value="tab1">Active</Tabs.Trigger>
        <Tabs.Trigger value="tab2" disabled>
          Disabled
        </Tabs.Trigger>
        <Tabs.Trigger value="tab3">Available</Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content value="tab1">
        <Card className="p-4">
          <p>This is the active tab content.</p>
        </Card>
      </Tabs.Content>
      <Tabs.Content value="tab2">
        <Card className="p-4">
          <p>This tab is disabled and should not be accessible.</p>
        </Card>
      </Tabs.Content>
      <Tabs.Content value="tab3">
        <Card className="p-4">
          <p>This is another available tab.</p>
        </Card>
      </Tabs.Content>
    </Tabs>
  ),
};

export const Controlled: Story = {
  render: () => {
    const [activeTab, setActiveTab] = React.useState("tab1");
    const [tabHistory, setTabHistory] = React.useState<string[]>(["tab1"]);

    const handleTabChange = (value: string) => {
      setActiveTab(value);
      setTabHistory((prev) => [...prev, value].slice(-5)); // Keep last 5
    };

    return (
      <div className="space-y-4">
        <div className="flex gap-2">
          <button
            onClick={() => handleTabChange("tab1")}
            className="px-3 py-1 text-sm bg-surface-emphasis rounded hover:bg-surface-strong"
          >
            Set Tab 1
          </button>
          <button
            onClick={() => handleTabChange("tab2")}
            className="px-3 py-1 text-sm bg-surface-emphasis rounded hover:bg-surface-strong"
          >
            Set Tab 2
          </button>
          <button
            onClick={() => handleTabChange("tab3")}
            className="px-3 py-1 text-sm bg-surface-emphasis rounded hover:bg-surface-strong"
          >
            Set Tab 3
          </button>
        </div>
        <Tabs value={activeTab} onValueChange={handleTabChange}>
          <Tabs.List>
            <Tabs.Trigger value="tab1">Tab 1</Tabs.Trigger>
            <Tabs.Trigger value="tab2">Tab 2</Tabs.Trigger>
            <Tabs.Trigger value="tab3">Tab 3</Tabs.Trigger>
          </Tabs.List>
          <Tabs.Content value="tab1">
            <Card className="p-4">
              <p>
                Controlled tab 1 content. Active tab:{" "}
                <strong>{activeTab}</strong>
              </p>
            </Card>
          </Tabs.Content>
          <Tabs.Content value="tab2">
            <Card className="p-4">
              <p>
                Controlled tab 2 content. Active tab:{" "}
                <strong>{activeTab}</strong>
              </p>
            </Card>
          </Tabs.Content>
          <Tabs.Content value="tab3">
            <Card className="p-4">
              <p>
                Controlled tab 3 content. Active tab:{" "}
                <strong>{activeTab}</strong>
              </p>
            </Card>
          </Tabs.Content>
        </Tabs>
        <div className="text-sm text-fg-secondary">
          <p>
            <strong>Tab History:</strong> {tabHistory.join(" → ")}
          </p>
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          "Example of controlled tabs where the active tab is managed externally. Tab changes are tracked in history.",
      },
    },
  },
};

export const WithRealContent: Story = {
  render: () => {
    const [activeTab, setActiveTab] = React.useState("overview");

    const stats = {
      totalUsers: 1234,
      activeUsers: 892,
      revenue: "$45,678",
    };

    const settings = {
      notifications: true,
      theme: "light",
      language: "en",
    };

    return (
      <div className="space-y-4">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <Tabs.List>
            <Tabs.Trigger value="overview">Overview</Tabs.Trigger>
            <Tabs.Trigger value="analytics">Analytics</Tabs.Trigger>
            <Tabs.Trigger value="settings">Settings</Tabs.Trigger>
          </Tabs.List>
          <Tabs.Content value="overview">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Dashboard Overview</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="p-4 bg-info-bg rounded">
                  <p className="text-sm text-fg-secondary">Total Users</p>
                  <p className="text-2xl font-bold text-fg-info">
                    {stats.totalUsers}
                  </p>
                </div>
                <div className="p-4 bg-success-bg rounded">
                  <p className="text-sm text-fg-secondary">Active Users</p>
                  <p className="text-2xl font-bold text-fg-success">
                    {stats.activeUsers}
                  </p>
                </div>
                <div className="p-4 bg-surface-secondary-subtle rounded">
                  <p className="text-sm text-fg-secondary">Revenue</p>
                  <p className="text-2xl font-bold text-fg-brand-secondary">
                    {stats.revenue}
                  </p>
                </div>
              </div>
            </Card>
          </Tabs.Content>
          <Tabs.Content value="analytics">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Analytics</h3>
              <div className="space-y-2">
                <div className="flex justify-between p-2 bg-surface-subtle rounded">
                  <span>Page Views</span>
                  <span className="font-semibold">12,345</span>
                </div>
                <div className="flex justify-between p-2 bg-surface-subtle rounded">
                  <span>Unique Visitors</span>
                  <span className="font-semibold">8,901</span>
                </div>
                <div className="flex justify-between p-2 bg-surface-subtle rounded">
                  <span>Bounce Rate</span>
                  <span className="font-semibold">32.5%</span>
                </div>
              </div>
            </Card>
          </Tabs.Content>
          <Tabs.Content value="settings">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Settings</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span>Email Notifications</span>
                  <span
                    className={
                      settings.notifications
                        ? "text-fg-success"
                        : "text-fg-quaternary"
                    }
                  >
                    {settings.notifications ? "✓ Enabled" : "✗ Disabled"}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Theme</span>
                  <span className="font-medium">{settings.theme}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Language</span>
                  <span className="font-medium">
                    {settings.language.toUpperCase()}
                  </span>
                </div>
              </div>
            </Card>
          </Tabs.Content>
        </Tabs>
        <div className="text-sm text-fg-secondary">
          <p>
            Current tab: <strong>{activeTab}</strong>
          </p>
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          "Tabs with real content and data. Navigate between tabs to see different content sections.",
      },
    },
  },
};

export const DynamicTabs: Story = {
  render: () => {
    const [tabs, setTabs] = React.useState([
      { id: "tab1", label: "Tab 1", content: "Content for Tab 1" },
      { id: "tab2", label: "Tab 2", content: "Content for Tab 2" },
    ]);
    const [activeTab, setActiveTab] = React.useState("tab1");
    const [newTabLabel, setNewTabLabel] = React.useState("");

    const addTab = () => {
      if (!newTabLabel.trim()) return;
      const newId = `tab${tabs.length + 1}`;
      setTabs([
        ...tabs,
        {
          id: newId,
          label: newTabLabel,
          content: `Content for ${newTabLabel}`,
        },
      ]);
      setActiveTab(newId);
      setNewTabLabel("");
    };

    const removeTab = (id: string) => {
      if (tabs.length <= 1) return;
      const newTabs = tabs.filter((t) => t.id !== id);
      setTabs(newTabs);
      if (activeTab === id) {
        setActiveTab(newTabs[0].id);
      }
    };

    return (
      <div className="space-y-4">
        <div className="flex gap-2 items-center">
          <input
            type="text"
            value={newTabLabel}
            onChange={(e) => setNewTabLabel(e.target.value)}
            placeholder="New tab label"
            className="px-3 py-1 border rounded text-sm"
            onKeyPress={(e) => e.key === "Enter" && addTab()}
          />
          <button
            onClick={addTab}
            className="px-3 py-1 text-sm bg-surface-brand-strong text-fg-inverse rounded hover:opacity-90"
          >
            Add Tab
          </button>
        </div>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <Tabs.List>
            {tabs.map((tab) => (
              <div key={tab.id} className="flex items-center gap-1">
                <Tabs.Trigger value={tab.id}>{tab.label}</Tabs.Trigger>
                {tabs.length > 1 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeTab(tab.id);
                    }}
                    className="ml-1 text-fg-quaternary hover:text-fg-error text-xs"
                    aria-label={`Remove ${tab.label}`}
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
          </Tabs.List>
          {tabs.map((tab) => (
            <Tabs.Content key={tab.id} value={tab.id}>
              <Card className="p-4">
                <p>{tab.content}</p>
              </Card>
            </Tabs.Content>
          ))}
        </Tabs>
        <div className="text-sm text-fg-secondary">
          <p>
            <strong>Total tabs:</strong> {tabs.length}
          </p>
          <p>
            <strong>Active tab:</strong>{" "}
            {tabs.find((t) => t.id === activeTab)?.label}
          </p>
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          "Dynamic tabs that can be added and removed. Add new tabs and remove existing ones to see the tabs update dynamically.",
      },
    },
  },
};

export const KeyboardNavigation: Story = {
  render: () => {
    const [activeTab, setActiveTab] = React.useState("tab1");
    const [lastAction, setLastAction] = React.useState<string | null>(null);

    const handleChange = (value: string) => {
      setActiveTab(value);
      setLastAction(`Switched to ${value}`);
      setTimeout(() => setLastAction(null), 2000);
    };

    return (
      <div className="space-y-4">
        <Tabs value={activeTab} onValueChange={handleChange}>
          <Tabs.List>
            <Tabs.Trigger value="tab1">Tab 1</Tabs.Trigger>
            <Tabs.Trigger value="tab2">Tab 2</Tabs.Trigger>
            <Tabs.Trigger value="tab3">Tab 3</Tabs.Trigger>
          </Tabs.List>
          <Tabs.Content value="tab1">
            <Card className="p-4">
              <p>Tab 1 content. Try keyboard navigation!</p>
            </Card>
          </Tabs.Content>
          <Tabs.Content value="tab2">
            <Card className="p-4">
              <p>Tab 2 content.</p>
            </Card>
          </Tabs.Content>
          <Tabs.Content value="tab3">
            <Card className="p-4">
              <p>Tab 3 content.</p>
            </Card>
          </Tabs.Content>
        </Tabs>
        {lastAction && (
          <div className="text-sm text-fg-success p-2 bg-success-bg rounded">
            ✓ {lastAction}
          </div>
        )}
        <div className="text-sm text-fg-secondary space-y-2 p-4 bg-surface-subtle rounded">
          <p>
            <strong>Keyboard Navigation:</strong>
          </p>
          <ul className="list-disc list-inside space-y-1">
            <li>Tab to focus the tabs list</li>
            <li>Arrow Left/Right to navigate between tabs</li>
            <li>Enter or Space to activate focused tab</li>
            <li>Home to jump to first tab</li>
            <li>End to jump to last tab</li>
          </ul>
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          "Demonstrates keyboard navigation. Use Tab to focus, then Arrow keys to navigate, Enter/Space to activate.",
      },
    },
  },
};

// Event Stories
export const WithEvents: Story = {
  render: () => {
    const [activeTab, setActiveTab] = React.useState("tab1");
    const handleValueChange = fn((value: string) => {
      setActiveTab(value);
    });

    return (
      <div className="space-y-4">
        <p className="text-sm text-fg-secondary">
          Click tabs to switch. Check the Actions panel to see events being
          fired.
        </p>
        <Tabs value={activeTab} onValueChange={handleValueChange}>
          <Tabs.List>
            <Tabs.Trigger value="tab1">Tab 1</Tabs.Trigger>
            <Tabs.Trigger value="tab2">Tab 2</Tabs.Trigger>
            <Tabs.Trigger value="tab3">Tab 3</Tabs.Trigger>
          </Tabs.List>
          <Tabs.Content value="tab1">
            <Card className="p-4">
              <p>Tab 1 content</p>
            </Card>
          </Tabs.Content>
          <Tabs.Content value="tab2">
            <Card className="p-4">
              <p>Tab 2 content</p>
            </Card>
          </Tabs.Content>
          <Tabs.Content value="tab3">
            <Card className="p-4">
              <p>Tab 3 content</p>
            </Card>
          </Tabs.Content>
        </Tabs>
        <p className="text-sm text-fg-tertiary">Active tab: {activeTab}</p>
      </div>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const tab2 = canvas.getByText("Tab 2");
    await userEvent.click(tab2);
    await waitFor(() => {
      expect(tab2).toBeInTheDocument();
    });
  },
  parameters: {
    docs: {
      description: {
        story:
          "Demonstrates tabs events. Click tabs and check the Actions panel to see events being logged.",
      },
    },
  },
};

// State Stories
export const HorizontalState: Story = {
  render: () => (
    <Tabs defaultValue="tab1" orientation="horizontal">
      <Tabs.List>
        <Tabs.Trigger value="tab1">Tab 1</Tabs.Trigger>
        <Tabs.Trigger value="tab2">Tab 2</Tabs.Trigger>
        <Tabs.Trigger value="tab3">Tab 3</Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content value="tab1">
        <Card className="p-4">
          <p>Tab 1 content</p>
        </Card>
      </Tabs.Content>
      <Tabs.Content value="tab2">
        <Card className="p-4">
          <p>Tab 2 content</p>
        </Card>
      </Tabs.Content>
      <Tabs.Content value="tab3">
        <Card className="p-4">
          <p>Tab 3 content</p>
        </Card>
      </Tabs.Content>
    </Tabs>
  ),
  parameters: {
    docs: {
      description: {
        story: "Horizontal state - tabs are arranged horizontally (default).",
      },
    },
  },
};

export const VerticalState: Story = {
  render: () => (
    <div className="flex gap-4">
      <Tabs defaultValue="tab1" orientation="vertical">
        <Tabs.List>
          <Tabs.Trigger value="tab1">Tab 1</Tabs.Trigger>
          <Tabs.Trigger value="tab2">Tab 2</Tabs.Trigger>
          <Tabs.Trigger value="tab3">Tab 3</Tabs.Trigger>
        </Tabs.List>
      </Tabs>
      <div className="flex-1">
        <Tabs defaultValue="tab1" orientation="vertical">
          <Tabs.Content value="tab1">
            <Card className="p-4">
              <p>Tab 1 content</p>
            </Card>
          </Tabs.Content>
          <Tabs.Content value="tab2">
            <Card className="p-4">
              <p>Tab 2 content</p>
            </Card>
          </Tabs.Content>
          <Tabs.Content value="tab3">
            <Card className="p-4">
              <p>Tab 3 content</p>
            </Card>
          </Tabs.Content>
        </Tabs>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "Vertical state - tabs are arranged vertically.",
      },
    },
  },
};

export const AutomaticModeState: Story = {
  render: () => (
    <Tabs defaultValue="tab1" activationMode="automatic">
      <Tabs.List>
        <Tabs.Trigger value="tab1">Tab 1</Tabs.Trigger>
        <Tabs.Trigger value="tab2">Tab 2</Tabs.Trigger>
        <Tabs.Trigger value="tab3">Tab 3</Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content value="tab1">
        <Card className="p-4">
          <p>Tab 1 content - activates on focus</p>
        </Card>
      </Tabs.Content>
      <Tabs.Content value="tab2">
        <Card className="p-4">
          <p>Tab 2 content</p>
        </Card>
      </Tabs.Content>
      <Tabs.Content value="tab3">
        <Card className="p-4">
          <p>Tab 3 content</p>
        </Card>
      </Tabs.Content>
    </Tabs>
  ),
  parameters: {
    docs: {
      description: {
        story: "Automatic mode state - tabs activate when focused (default).",
      },
    },
  },
};

export const ManualModeState: Story = {
  render: () => (
    <Tabs defaultValue="tab1" activationMode="manual">
      <Tabs.List>
        <Tabs.Trigger value="tab1">Tab 1</Tabs.Trigger>
        <Tabs.Trigger value="tab2">Tab 2</Tabs.Trigger>
        <Tabs.Trigger value="tab3">Tab 3</Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content value="tab1">
        <Card className="p-4">
          <p>Tab 1 content - activates on Enter/Space</p>
        </Card>
      </Tabs.Content>
      <Tabs.Content value="tab2">
        <Card className="p-4">
          <p>Tab 2 content</p>
        </Card>
      </Tabs.Content>
      <Tabs.Content value="tab3">
        <Card className="p-4">
          <p>Tab 3 content</p>
        </Card>
      </Tabs.Content>
    </Tabs>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Manual mode state - tabs activate only when Enter or Space is pressed.",
      },
    },
  },
};
