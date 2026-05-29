import type { Meta, StoryObj } from "@storybook/react-vite";
import Dot from "./Dot";

const meta: Meta<typeof Dot> = {
  title: "Primitives/Dot",
  component: Dot,
  parameters: {
    docs: {
      description: {
        component: `
## Dot

A dot component for displaying status indicators as colored circles.

### Events

| Event | Description | Parameters | When Fired |
|-------|-------------|------------|------------|
| N/A | Dot is a display component | - | No interaction events |

### States

| State | Description | How to Activate | Visual |
|-------|-------------|-----------------|--------|
| \`online\` | Online status | \`variant="online"\` | Green dot |
| \`offline\` | Offline status | \`variant="offline"\` | Gray dot |
| \`pending\` | Pending status | \`variant="pending"\` | Yellow dot |
| \`warning\` | Warning status | \`variant="warning"\` | Yellow dot |
| \`error\` | Error status | \`variant="error"\` | Red dot |
| \`info\` | Info status | \`variant="info"\` | Blue dot |
| \`small\` | Small size | \`size="sm"\` | 6px dot |
| \`medium\` | Medium size | \`size="md"\` | 8px dot |
| \`large\` | Large size | \`size="lg"\` | 10px dot |
        `,
      },
    },
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["online", "offline", "pending", "warning", "error", "info"],
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Dot>;

export const Default: Story = {
  args: {
    variant: "offline",
    size: "md",
  },
};

export const Variants: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2">
        <Dot variant="online" />
        <span className="text-sm">Online</span>
      </div>
      <div className="flex items-center gap-2">
        <Dot variant="offline" />
        <span className="text-sm">Offline</span>
      </div>
      <div className="flex items-center gap-2">
        <Dot variant="pending" />
        <span className="text-sm">Pending</span>
      </div>
      <div className="flex items-center gap-2">
        <Dot variant="warning" />
        <span className="text-sm">Warning</span>
      </div>
      <div className="flex items-center gap-2">
        <Dot variant="error" />
        <span className="text-sm">Error</span>
      </div>
      <div className="flex items-center gap-2">
        <Dot variant="info" />
        <span className="text-sm">Info</span>
      </div>
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2">
        <Dot variant="online" size="sm" />
        <span className="text-sm">Small</span>
      </div>
      <div className="flex items-center gap-2">
        <Dot variant="online" size="md" />
        <span className="text-sm">Medium</span>
      </div>
      <div className="flex items-center gap-2">
        <Dot variant="online" size="lg" />
        <span className="text-sm">Large</span>
      </div>
    </div>
  ),
};

export const AllCombinations: Story = {
  render: () => (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-medium mb-2">Small Size</h3>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Dot variant="online" size="sm" />
            <span className="text-sm">Online</span>
          </div>
          <div className="flex items-center gap-2">
            <Dot variant="offline" size="sm" />
            <span className="text-sm">Offline</span>
          </div>
          <div className="flex items-center gap-2">
            <Dot variant="pending" size="sm" />
            <span className="text-sm">Pending</span>
          </div>
          <div className="flex items-center gap-2">
            <Dot variant="warning" size="sm" />
            <span className="text-sm">Warning</span>
          </div>
          <div className="flex items-center gap-2">
            <Dot variant="error" size="sm" />
            <span className="text-sm">Error</span>
          </div>
          <div className="flex items-center gap-2">
            <Dot variant="info" size="sm" />
            <span className="text-sm">Info</span>
          </div>
        </div>
      </div>
      <div>
        <h3 className="text-sm font-medium mb-2">Medium Size</h3>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Dot variant="online" size="md" />
            <span className="text-sm">Online</span>
          </div>
          <div className="flex items-center gap-2">
            <Dot variant="offline" size="md" />
            <span className="text-sm">Offline</span>
          </div>
          <div className="flex items-center gap-2">
            <Dot variant="pending" size="md" />
            <span className="text-sm">Pending</span>
          </div>
          <div className="flex items-center gap-2">
            <Dot variant="warning" size="md" />
            <span className="text-sm">Warning</span>
          </div>
          <div className="flex items-center gap-2">
            <Dot variant="error" size="md" />
            <span className="text-sm">Error</span>
          </div>
          <div className="flex items-center gap-2">
            <Dot variant="info" size="md" />
            <span className="text-sm">Info</span>
          </div>
        </div>
      </div>
      <div>
        <h3 className="text-sm font-medium mb-2">Large Size</h3>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Dot variant="online" size="lg" />
            <span className="text-sm">Online</span>
          </div>
          <div className="flex items-center gap-2">
            <Dot variant="offline" size="lg" />
            <span className="text-sm">Offline</span>
          </div>
          <div className="flex items-center gap-2">
            <Dot variant="pending" size="lg" />
            <span className="text-sm">Pending</span>
          </div>
          <div className="flex items-center gap-2">
            <Dot variant="warning" size="lg" />
            <span className="text-sm">Warning</span>
          </div>
          <div className="flex items-center gap-2">
            <Dot variant="error" size="lg" />
            <span className="text-sm">Error</span>
          </div>
          <div className="flex items-center gap-2">
            <Dot variant="info" size="lg" />
            <span className="text-sm">Info</span>
          </div>
        </div>
      </div>
    </div>
  ),
};

export const Accessibility: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <p className="text-sm text-gray-600">Dots with proper ARIA labels:</p>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Dot variant="online" aria-label="User is online" />
            <span className="text-sm">User is online</span>
          </div>
          <div className="flex items-center gap-2">
            <Dot variant="error" aria-label="Error occurred" />
            <span className="text-sm">Error occurred</span>
          </div>
          <div className="flex items-center gap-2">
            <Dot variant="pending" aria-label="Action pending" />
            <span className="text-sm">Action pending</span>
          </div>
          <div className="flex items-center gap-2">
            <Dot variant="info" aria-label="Information available" />
            <span className="text-sm">Information available</span>
          </div>
        </div>
      </div>
      <div className="space-y-2">
        <p className="text-sm text-gray-600">
          Dots with role="status" for screen readers:
        </p>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Dot variant="online" />
            <span className="text-sm">Connected</span>
          </div>
          <div className="flex items-center gap-2">
            <Dot variant="offline" />
            <span className="text-sm">Disconnected</span>
          </div>
          <div className="flex items-center gap-2">
            <Dot variant="warning" />
            <span className="text-sm">Limited connectivity</span>
          </div>
        </div>
        <p className="text-xs text-gray-500">
          Screen readers will announce these dots as status updates. The
          component automatically provides default ARIA labels based on the
          variant.
        </p>
      </div>
      <div className="space-y-2">
        <p className="text-sm text-gray-600">Default ARIA labels by variant:</p>
        <div className="space-y-1 text-xs text-gray-500">
          <p>• online → "Online"</p>
          <p>• offline → "Offline"</p>
          <p>• pending → "Pending"</p>
          <p>• warning → "Warning"</p>
          <p>• error → "Error"</p>
          <p>• info → "Info"</p>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Examples demonstrating accessibility features: ARIA labels, role="status" for screen readers, and automatic default labels based on variant.',
      },
    },
  },
};

export const WithLabels: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <p className="text-sm text-gray-600">User status indicators:</p>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Dot variant="online" />
            <span className="text-sm font-medium">John Doe</span>
            <span className="text-xs text-gray-500">Active now</span>
          </div>
          <div className="flex items-center gap-2">
            <Dot variant="offline" />
            <span className="text-sm font-medium">Jane Smith</span>
            <span className="text-xs text-gray-500">Last seen 2h ago</span>
          </div>
          <div className="flex items-center gap-2">
            <Dot variant="pending" />
            <span className="text-sm font-medium">Bob Johnson</span>
            <span className="text-xs text-gray-500">Away</span>
          </div>
        </div>
      </div>
      <div className="space-y-2">
        <p className="text-sm text-gray-600">System status indicators:</p>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Dot variant="online" size="lg" />
            <div>
              <p className="text-sm font-medium">API Server</p>
              <p className="text-xs text-gray-500">All systems operational</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Dot variant="warning" size="lg" />
            <div>
              <p className="text-sm font-medium">Database</p>
              <p className="text-xs text-gray-500">Degraded performance</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Dot variant="error" size="lg" />
            <div>
              <p className="text-sm font-medium">Email Service</p>
              <p className="text-xs text-gray-500">Service unavailable</p>
            </div>
          </div>
        </div>
      </div>
      <div className="space-y-2">
        <p className="text-sm text-gray-600">Notification indicators:</p>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Dot variant="info" size="sm" />
            <span className="text-sm">New message received</span>
          </div>
          <div className="flex items-center gap-2">
            <Dot variant="warning" size="sm" />
            <span className="text-sm">Action required</span>
          </div>
          <div className="flex items-center gap-2">
            <Dot variant="error" size="sm" />
            <span className="text-sm">Critical alert</span>
          </div>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Common use cases showing dots with text labels for user status, system status, and notifications.",
      },
    },
  },
};

// State Stories - Individual Variant States
export const OnlineState: Story = {
  args: {
    variant: "online",
    size: "md",
  },
  parameters: {
    docs: {
      description: {
        story: "Online state - green dot indicating active/online status.",
      },
    },
  },
};

export const OfflineState: Story = {
  args: {
    variant: "offline",
    size: "md",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Offline state - gray dot indicating inactive/offline status (default).",
      },
    },
  },
};

export const PendingState: Story = {
  args: {
    variant: "pending",
    size: "md",
  },
  parameters: {
    docs: {
      description: {
        story: "Pending state - yellow dot indicating pending/away status.",
      },
    },
  },
};

export const WarningState: Story = {
  args: {
    variant: "warning",
    size: "md",
  },
  parameters: {
    docs: {
      description: {
        story: "Warning state - yellow dot indicating warning/caution status.",
      },
    },
  },
};

export const ErrorState: Story = {
  args: {
    variant: "error",
    size: "md",
  },
  parameters: {
    docs: {
      description: {
        story: "Error state - red dot indicating error/critical status.",
      },
    },
  },
};

export const InfoState: Story = {
  args: {
    variant: "info",
    size: "md",
  },
  parameters: {
    docs: {
      description: {
        story: "Info state - blue dot indicating informational status.",
      },
    },
  },
};

// State Stories - Individual Size States
export const SmallState: Story = {
  args: {
    variant: "online",
    size: "sm",
  },
  parameters: {
    docs: {
      description: {
        story: "Small state - dot with small size (6px).",
      },
    },
  },
};

export const MediumState: Story = {
  args: {
    variant: "online",
    size: "md",
  },
  parameters: {
    docs: {
      description: {
        story: "Medium state - dot with medium size (8px, default).",
      },
    },
  },
};

export const LargeState: Story = {
  args: {
    variant: "online",
    size: "lg",
  },
  parameters: {
    docs: {
      description: {
        story: "Large state - dot with large size (10px).",
      },
    },
  },
};
