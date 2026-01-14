import type { Meta, StoryObj } from "@storybook/react";
import { fn } from '@storybook/test';
import { expect, userEvent, within, waitFor } from '@storybook/test';
import { useState } from "react";
import Breadcrumb from "./Breadcrumb";

const meta: Meta<typeof Breadcrumb> = {
  title: "Molecules/Breadcrumb",
  component: Breadcrumb,
  parameters: {
    docs: {
      description: {
        component: `
## Breadcrumb

A breadcrumb navigation component for hierarchical navigation. Accessible with proper ARIA labels.

### Events

| Event | Description | Parameters | When Fired |
|-------|-------------|------------|------------|
| \`onClick\` (item) | Item do breadcrumb clicado | \`(event: MouseEvent) => void\` | Quando um item do breadcrumb é clicado |

### States

| State | Description | How to Activate | Visual |
|-------|-------------|-----------------|--------|
| \`default\` | Estado padrão | Estado inicial | Breadcrumb normal |
| \`two-levels\` | Dois níveis | 2 itens | Breadcrumb com 2 níveis |
| \`three-levels\` | Três níveis | 3 itens | Breadcrumb com 3 níveis |
| \`single-item\` | Item único | 1 item | Breadcrumb com apenas 1 item |
        `,
      },
    },
  },
  argTypes: {
    items: {
      control: "object",
      description: "Array of breadcrumb items",
    },
    separator: {
      control: "text",
      description: "Separator between items",
    },
  },
};

export const Default: StoryObj<typeof Breadcrumb> = {
  render: () => {
    const [currentPath, setCurrentPath] = useState<string[]>(["Home", "Epics", "Epic Details"]);
    
    const items = [
      { 
        label: "Home", 
        href: "#",
        onClick: (e: React.MouseEvent) => {
          e.preventDefault();
          setCurrentPath(["Home"]);
        }
      },
      { 
        label: "Epics", 
        href: "#",
        onClick: (e: React.MouseEvent) => {
          e.preventDefault();
          setCurrentPath(["Home", "Epics"]);
        }
      },
      { label: "Epic Details" },
    ];
    
    return (
      <div className="space-y-4">
        <Breadcrumb items={items} />
        <div className="text-sm text-gray-600">
          <p><strong>Current path:</strong> {currentPath.join(" > ")}</p>
          <p className="text-xs text-gray-500 mt-1">Click breadcrumb links to navigate</p>
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: "Interactive breadcrumb with navigation. Click links to see the path change.",
      },
    },
  },
};

export const TwoLevels: StoryObj<typeof Breadcrumb> = {
  args: {
    items: [
      { label: "Dashboard", href: "/" },
      { label: "Epics" },
    ],
  },
};

export const ThreeLevels: StoryObj<typeof Breadcrumb> = {
  render: () => {
    const [currentPage, setCurrentPage] = useState("Edit");
    
    const items = [
      { 
        label: "Home", 
        href: "#",
        onClick: (e: React.MouseEvent) => {
          e.preventDefault();
          setCurrentPage("Home");
        }
      },
      { 
        label: "Epics", 
        href: "#",
        onClick: (e: React.MouseEvent) => {
          e.preventDefault();
          setCurrentPage("Epics");
        }
      },
      { 
        label: "User Authentication", 
        href: "#",
        onClick: (e: React.MouseEvent) => {
          e.preventDefault();
          setCurrentPage("User Authentication");
        }
      },
      { label: "Edit" },
    ];
    
    return (
      <div className="space-y-4">
        <Breadcrumb items={items} />
        <div className="p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600">
            <strong>Current page:</strong> {currentPage}
          </p>
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: "Breadcrumb with multiple levels and navigation. Click links to navigate between pages.",
      },
    },
  },
};

export const CustomSeparator: StoryObj<typeof Breadcrumb> = {
  args: {
    items: [
      { label: "Home", href: "/" },
      { label: "Epics", href: "/epics" },
      { label: "Details" },
    ],
    separator: "›",
  },
};

export const SingleItem: StoryObj<typeof Breadcrumb> = {
  args: {
    items: [
      { label: "Dashboard" },
    ],
  },
};

// Event Stories
export const WithEvents: StoryObj<typeof Breadcrumb> = {
  render: () => {
    const [currentPath, setCurrentPath] = useState<string[]>(["Home", "Epics", "Details"]);
    
    const handleItemClick = fn((e: React.MouseEvent, index: number) => {
      e.preventDefault();
      console.log('Breadcrumb item clicked:', index);
    });
    
    const items = [
      { 
        label: "Home", 
        href: "#",
        onClick: (e: React.MouseEvent) => {
          handleItemClick(e, 0);
          setCurrentPath(["Home"]);
        }
      },
      { 
        label: "Epics", 
        href: "#",
        onClick: (e: React.MouseEvent) => {
          handleItemClick(e, 1);
          setCurrentPath(["Home", "Epics"]);
        }
      },
      { label: "Details" },
    ];
    
    return (
      <div className="space-y-4">
        <p className="text-sm text-gray-600">
          Click breadcrumb items below. Check the Actions panel to see events being fired.
        </p>
        <Breadcrumb items={items} />
        <p className="text-sm text-gray-500">Current path: {currentPath.join(" > ")}</p>
      </div>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const links = canvas.getAllByRole('link');
    
    // Test clicking first link
    if (links.length > 0) {
      await userEvent.click(links[0]);
      await waitFor(() => {
        expect(links[0]).toBeInTheDocument();
      });
    }
  },
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates breadcrumb events. Click breadcrumb items and check the Actions panel to see events being logged.',
      },
    },
  },
};

// State Stories
export const DefaultState: StoryObj<typeof Breadcrumb> = {
  args: {
    items: [
      { label: "Home", href: "/" },
      { label: "Epics", href: "/epics" },
      { label: "Details" },
    ],
  },
  parameters: {
    docs: {
      description: {
        story: 'Default state - breadcrumb with standard navigation items.',
      },
    },
  },
};

export const TwoLevelsState: StoryObj<typeof Breadcrumb> = {
  args: {
    items: [
      { label: "Dashboard", href: "/" },
      { label: "Epics" },
    ],
  },
  parameters: {
    docs: {
      description: {
        story: 'Two levels state - breadcrumb with 2 navigation levels.',
      },
    },
  },
};

export const ThreeLevelsState: StoryObj<typeof Breadcrumb> = {
  args: {
    items: [
      { label: "Home", href: "/" },
      { label: "Epics", href: "/epics" },
      { label: "Details" },
    ],
  },
  parameters: {
    docs: {
      description: {
        story: 'Three levels state - breadcrumb with 3 navigation levels.',
      },
    },
  },
};

export const SingleItemState: StoryObj<typeof Breadcrumb> = {
  args: {
    items: [
      { label: "Dashboard" },
    ],
  },
  parameters: {
    docs: {
      description: {
        story: 'Single item state - breadcrumb with only one item (current page).',
      },
    },
  },
};

export default meta;
