import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import { expect, userEvent, within, waitFor } from "@storybook/test";
import Button from "./Button";
import { Play, X, Save, Download, Trash2 } from "lucide-react";

const meta: Meta<typeof Button> = {
  title: "Primitives/Button",
  component: Button,
  parameters: {
    docs: {
      description: {
        component: `
## Button

A versatile button component with multiple variants, sizes, and states. Supports loading states, icons, and polymorphic rendering.

### Events

| Event | Description | Parameters | When Fired |
|-------|-------------|------------|------------|
| \`onClick\` | Clique no botão | \`(event: MouseEvent) => void\` | Quando o usuário clica no botão |
| \`onMouseEnter\` | Mouse entra no botão | \`(event: MouseEvent) => void\` | Quando o cursor entra na área do botão |
| \`onMouseLeave\` | Mouse sai do botão | \`(event: MouseEvent) => void\` | Quando o cursor sai da área do botão |
| \`onFocus\` | Botão recebe foco | \`(event: FocusEvent) => void\` | Quando o botão recebe foco (teclado ou mouse) |
| \`onBlur\` | Botão perde foco | \`(event: FocusEvent) => void\` | Quando o botão perde foco |

### States

| State | Description | How to Activate | Visual |
|-------|-------------|-----------------|--------|
| \`default\` | Estado padrão | Estado inicial | Botão com estilo padrão |
| \`hover\` | Mouse sobre o botão | Passar mouse sobre o botão | Botão com estilo de hover |
| \`active\` | Botão pressionado | Clicar e segurar o botão | Botão com estilo de active |
| \`focus\` | Botão com foco | Tab ou clique | Botão com outline de foco |
| \`disabled\` | Botão desabilitado | \`disabled={true}\` | Botão com opacidade reduzida, não clicável |
| \`loading\` | Botão carregando | \`isLoading={true}\` | Botão com spinner, desabilitado |
        `,
      },
    },
  },
  argTypes: {
    variant: {
      control: "select",
      options: [
        "primary",
        "secondary",
        "error",
        "outline",
        "ghost",
        "iconOnly",
      ],
      description: "Button variant",
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
      description: "Button size",
    },
    isLoading: {
      control: "boolean",
      description: "Show loading spinner",
    },
    loadingText: {
      control: "text",
      description: "Text to show while loading",
    },
    loadingIcon: {
      control: false,
      description: "Custom loading icon (ReactNode)",
    },
    leftIcon: {
      control: false,
      description: "Icon to display on the left (ReactNode)",
    },
    rightIcon: {
      control: false,
      description: "Icon to display on the right (ReactNode)",
    },
    disabled: {
      control: "boolean",
      description: "Disable the button",
    },
    fullWidth: {
      control: "boolean",
      description: "Make button full width",
    },
    as: {
      control: "select",
      options: ["button", "a", "div"],
      description:
        "Polymorphic prop: render as different element (e.g., Link component)",
    },
    href: {
      control: "text",
      description: 'URL when using as="a" or custom Link component',
    },
    onClick: {
      description: "Callback fired when the button is clicked",
      action: "onClick",
      table: {
        type: { summary: "(event: MouseEvent) => void" },
        category: "Events",
      },
    },
    onMouseEnter: {
      description: "Callback fired when mouse enters the button",
      action: "onMouseEnter",
      table: {
        type: { summary: "(event: MouseEvent) => void" },
        category: "Events",
      },
    },
    onMouseLeave: {
      description: "Callback fired when mouse leaves the button",
      action: "onMouseLeave",
      table: {
        type: { summary: "(event: MouseEvent) => void" },
        category: "Events",
      },
    },
    onFocus: {
      description: "Callback fired when the button receives focus",
      action: "onFocus",
      table: {
        type: { summary: "(event: FocusEvent) => void" },
        category: "Events",
      },
    },
    onBlur: {
      description: "Callback fired when the button loses focus",
      action: "onBlur",
      table: {
        type: { summary: "(event: FocusEvent) => void" },
        category: "Events",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: {
    variant: "primary",
    children: "Primary Button",
  },
};

export const Secondary: Story = {
  args: {
    variant: "secondary",
    children: "Secondary Button",
  },
};

export const Error: Story = {
  args: {
    variant: "error",
    children: "Error Button",
  },
};

export const Outline: Story = {
  args: {
    variant: "outline",
    children: "Outline Button",
  },
};

export const Ghost: Story = {
  args: {
    variant: "ghost",
    children: "Ghost Button",
  },
};

export const IconOnly: Story = {
  args: {
    variant: "iconOnly",
    leftIcon: <X className="h-5 w-5" />,
    "aria-label": "Close",
  },
};

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Button size="sm">Small</Button>
      <Button size="md">Medium</Button>
      <Button size="lg">Large</Button>
    </div>
  ),
};

export const WithIcons: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <Button leftIcon={<Play className="h-4 w-4" />}>Play</Button>
        <Button rightIcon={<Download className="h-4 w-4" />}>Download</Button>
        <Button
          leftIcon={<Save className="h-4 w-4" />}
          rightIcon={<X className="h-4 w-4" />}
        >
          Save and Close
        </Button>
      </div>
      <div className="flex items-center gap-4">
        <Button variant="outline" leftIcon={<Play className="h-4 w-4" />}>
          Play
        </Button>
        <Button variant="ghost" leftIcon={<Trash2 className="h-4 w-4" />}>
          Delete
        </Button>
      </div>
    </div>
  ),
};

export const Loading: Story = {
  args: {
    isLoading: true,
    children: "Loading Button",
  },
};

export const LoadingWithText: Story = {
  args: {
    isLoading: true,
    loadingText: "Saving...",
    children: "Save",
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    children: "Disabled Button",
  },
};

export const FullWidth: Story = {
  args: {
    fullWidth: true,
    children: "Full Width Button",
  },
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <Button variant="primary">Primary</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="error">Error</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="ghost">Ghost</Button>
        <Button
          variant="iconOnly"
          leftIcon={<X className="h-5 w-5" />}
          aria-label="Close"
        />
      </div>
      <div className="flex items-center gap-4">
        <Button variant="primary" isLoading>
          Loading
        </Button>
        <Button variant="primary" disabled>
          Disabled
        </Button>
        <Button variant="primary" leftIcon={<Save className="h-4 w-4" />}>
          With Icon
        </Button>
      </div>
    </div>
  ),
};

export const Accessibility: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <p className="text-sm text-gray-600">
          Buttons with proper ARIA labels:
        </p>
        <div className="flex gap-2">
          <Button aria-label="Save document">Save</Button>
          <Button
            variant="iconOnly"
            leftIcon={<X className="h-5 w-5" />}
            aria-label="Close dialog"
          >
            <X className="h-5 w-5" />
          </Button>
          <Button
            variant="iconOnly"
            leftIcon={<Save className="h-5 w-5" />}
            aria-label="Save changes"
          >
            <Save className="h-5 w-5" />
          </Button>
        </div>
      </div>
      <div className="space-y-2">
        <p className="text-sm text-gray-600">Loading state with aria-busy:</p>
        <Button isLoading aria-busy="true">
          Processing...
        </Button>
      </div>
      <div className="space-y-2">
        <p className="text-sm text-gray-600">
          Disabled state with aria-disabled:
        </p>
        <Button disabled aria-disabled="true">
          Disabled Action
        </Button>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Examples demonstrating accessibility features: ARIA labels, aria-busy for loading, and aria-disabled for disabled states.",
      },
    },
  },
};

export const KeyboardNavigation: Story = {
  render: () => (
    <div className="space-y-4">
      <p className="text-sm text-gray-600">
        Try navigating with Tab key and activating buttons with Enter or Space:
      </p>
      <div className="flex flex-col gap-2">
        <Button>First Button (Tab here)</Button>
        <Button variant="secondary">Second Button</Button>
        <Button variant="outline">Third Button</Button>
        <Button variant="ghost">Fourth Button</Button>
      </div>
      <p className="text-xs text-gray-500 mt-4">
        All buttons support keyboard navigation: Tab to focus, Enter or Space to
        activate.
      </p>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Demonstrates keyboard navigation support. Use Tab to navigate between buttons and Enter/Space to activate.",
      },
    },
  },
};

export const LoadingStates: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <p className="text-sm text-gray-600">Loading with default spinner:</p>
        <div className="flex gap-2">
          <Button isLoading>Loading</Button>
          <Button variant="secondary" isLoading>
            Loading
          </Button>
          <Button variant="outline" isLoading>
            Loading
          </Button>
        </div>
      </div>
      <div className="space-y-2">
        <p className="text-sm text-gray-600">Loading with custom text:</p>
        <div className="flex gap-2">
          <Button isLoading loadingText="Saving...">
            Save
          </Button>
          <Button isLoading loadingText="Uploading...">
            Upload
          </Button>
          <Button isLoading loadingText="Processing...">
            Process
          </Button>
        </div>
      </div>
      <div className="space-y-2">
        <p className="text-sm text-gray-600">Loading with custom icon:</p>
        <div className="flex gap-2">
          <Button
            isLoading
            loadingIcon={<Save className="h-4 w-4 animate-spin" />}
            loadingText="Saving..."
          >
            Save
          </Button>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Demonstrates different loading states: default spinner, custom loading text, and custom loading icon.",
      },
    },
  },
};

export const Polymorphic: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <p className="text-sm text-gray-600">Button as anchor tag:</p>
        <Button as="a" href="https://example.com" target="_blank">
          Link Button
        </Button>
      </div>
      <div className="space-y-2">
        <p className="text-sm text-gray-600">
          Button with href (for custom Link components):
        </p>
        <Button as="a" href="/dashboard">
          Dashboard Link
        </Button>
      </div>
      <p className="text-xs text-gray-500">
        The `as` prop allows rendering Button as different elements, useful for
        Next.js Link or React Router.
      </p>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Demonstrates the polymorphic `as` prop to render Button as different elements (e.g., anchor tag or custom Link component).",
      },
    },
  },
};

// Event Stories
export const WithEvents: Story = {
  render: () => {
    const handleClick = fn((event: React.MouseEvent<HTMLButtonElement>) => {
      console.log("Button clicked:", event);
    });

    const handleMouseEnter = fn(
      (event: React.MouseEvent<HTMLButtonElement>) => {
        console.log("Mouse entered:", event);
      },
    );

    const handleMouseLeave = fn(
      (event: React.MouseEvent<HTMLButtonElement>) => {
        console.log("Mouse left:", event);
      },
    );

    const handleFocus = fn((event: React.FocusEvent<HTMLButtonElement>) => {
      console.log("Button focused:", event);
    });

    const handleBlur = fn((event: React.FocusEvent<HTMLButtonElement>) => {
      console.log("Button blurred:", event);
    });

    return (
      <div className="space-y-4">
        <p className="text-sm text-gray-600">
          Interact with the button below. Check the Actions panel to see events
          being fired.
        </p>
        <Button
          onClick={handleClick}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onFocus={handleFocus}
          onBlur={handleBlur}
        >
          Interactive Button
        </Button>
      </div>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole("button", { name: /Interactive Button/i });

    // Test click
    await userEvent.click(button);

    // Test hover
    await userEvent.hover(button);
    await userEvent.unhover(button);

    // Test focus - focus directly on the button
    button.focus();
    await waitFor(() => {
      expect(button).toHaveFocus();
    });

    // Test blur - click outside or tab away
    await userEvent.click(canvasElement);
    await waitFor(() => {
      expect(button).not.toHaveFocus();
    });
  },
  parameters: {
    docs: {
      description: {
        story:
          "Demonstrates all button events. Interact with the button and check the Actions panel to see events being logged.",
      },
    },
  },
};

// State Stories
export const DefaultState: Story = {
  args: {
    children: "Default Button",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Default state of the button - normal appearance, ready for interaction.",
      },
    },
  },
};

export const HoverState: Story = {
  args: {
    children: "Hover over me",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole("button");
    await userEvent.hover(button);
    // Hover state is visual, verified by user interaction
  },
  parameters: {
    docs: {
      description: {
        story:
          "Hover state - activated when mouse enters the button area. Visual feedback shows the button is interactive.",
      },
    },
  },
};

export const ActiveState: Story = {
  args: {
    children: "Click and hold",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole("button");
    await userEvent.pointer({ keys: "[MouseLeft>]", target: button });
    // Active state is visual during click and hold
  },
  parameters: {
    docs: {
      description: {
        story:
          "Active state - activated when button is pressed and held. Shows pressed appearance.",
      },
    },
  },
};

export const FocusState: Story = {
  args: {
    children: "Focus me (Tab)",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole("button");
    await userEvent.tab();
    await waitFor(() => {
      expect(button).toHaveFocus();
    });
  },
  parameters: {
    docs: {
      description: {
        story:
          "Focus state - activated via Tab key or programmatic focus. Shows focus outline for accessibility.",
      },
    },
  },
};

export const DisabledState: Story = {
  args: {
    disabled: true,
    children: "Disabled Button",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Disabled state - button is not interactive, shows reduced opacity and is not clickable.",
      },
    },
  },
};

export const LoadingState: Story = {
  args: {
    isLoading: true,
    children: "Loading Button",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Loading state - button shows spinner and is disabled during loading operation.",
      },
    },
  },
};
