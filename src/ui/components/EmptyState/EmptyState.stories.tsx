import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { expect, userEvent, within, waitFor } from "storybook/test";
import { useState } from "react";
import { FileText, Inbox, FolderOpen } from "lucide-react";
import EmptyState from "./EmptyState";

const meta = {
  title: "Components/EmptyState",
  component: EmptyState,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
## EmptyState

A component for displaying empty states when there's no content. Includes proper ARIA attributes (role='status', aria-live='polite') for screen reader announcements.

### Events

| Event | Description | Parameters | When Fired |
|-------|-------------|------------|------------|
| \`onAction\` | Botão de ação clicado | \`() => void\` | Quando o botão de ação é clicado |

### States

| State | Description | How to Activate | Visual |
|-------|-------------|-----------------|--------|
| \`default\` | Estado padrão | Sem variante ou \`variant="default"\` | Empty state simples com título e mensagem |
| \`with-action\` | Com ação | \`variant="withAction"\` | Empty state com botão de ação |
| \`with-illustration\` | Com ilustração | \`variant="withIllustration"\` | Empty state com ilustração e opcionalmente ação |
        `,
      },
    },
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "withAction", "withIllustration"],
      description: "Visual variant of the empty state",
    },
    title: {
      control: "text",
      description: "Title text displayed prominently",
    },
    message: {
      control: "text",
      description: "Descriptive message text",
    },
    actionLabel: {
      control: "text",
      description: "Label for the action button",
    },
    onAction: {
      action: "onAction",
      description: "Callback when action button is clicked",
      category: "Events",
    },
  },
} satisfies Meta<typeof EmptyState>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: "No items found",
    message: "There are no items to display at this time.",
  },
};

export const WithAction: Story = {
  render: () => {
    const [actionClicked, setActionClicked] = useState(false);
    const [items, setItems] = useState<string[]>([]);

    const handleAction = () => {
      setActionClicked(true);
      // Simulate creating an item
      setTimeout(() => {
        setItems([`Epic ${items.length + 1}`]);
        setActionClicked(false);
      }, 500);
    };

    if (items.length > 0) {
      return (
        <div className="space-y-4">
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-800">
              Epic created! Items: {items.join(", ")}
            </p>
            <button
              onClick={() => setItems([])}
              className="mt-2 px-3 py-1 text-sm bg-green-200 rounded hover:bg-green-300"
            >
              Reset
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        <EmptyState
          title="No epics yet"
          message="Get started by creating your first epic to organize your work."
          actionLabel={actionClicked ? "Creating..." : "Create Epic"}
          onAction={handleAction}
          variant="withAction"
        />
        {actionClicked && (
          <p className="text-sm text-gray-600 text-center">Creating epic...</p>
        )}
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          "Empty state with real action. Click the button to see it create an item.",
      },
    },
  },
};

export const WithIllustration: Story = {
  render: () => {
    const [stories, setStories] = useState<string[]>([]);
    const [isCreating, setIsCreating] = useState(false);

    const handleAddStory = () => {
      setIsCreating(true);
      setTimeout(() => {
        setStories([...stories, `Story ${stories.length + 1}`]);
        setIsCreating(false);
      }, 800);
    };

    if (stories.length > 0) {
      return (
        <div className="space-y-4">
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-blue-800 font-medium mb-2">Stories created:</p>
            <ul className="list-disc list-inside text-blue-700">
              {stories.map((story, i) => (
                <li key={i}>{story}</li>
              ))}
            </ul>
            <button
              onClick={() => setStories([])}
              className="mt-3 px-3 py-1 text-sm bg-blue-200 rounded hover:bg-blue-300"
            >
              Clear Stories
            </button>
          </div>
        </div>
      );
    }

    return (
      <EmptyState
        title="No stories found"
        message="This epic doesn't have any stories yet. Add a story to get started."
        actionLabel={isCreating ? "Adding..." : "Add Story"}
        onAction={handleAddStory}
        variant="withIllustration"
        illustration={
          <FileText
            className="mx-auto h-12 w-12 text-gray-400"
            aria-hidden="true"
          />
        }
      />
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          "Empty state with illustration and real action. Click to add stories and see them appear.",
      },
    },
  },
};

export const DifferentIllustrations: Story = {
  render: () => {
    const [type, setType] = useState<"inbox" | "folder" | "file">("inbox");

    const illustrations = {
      inbox: (
        <Inbox className="mx-auto h-12 w-12 text-gray-400" aria-hidden="true" />
      ),
      folder: (
        <FolderOpen
          className="mx-auto h-12 w-12 text-gray-400"
          aria-hidden="true"
        />
      ),
      file: (
        <FileText
          className="mx-auto h-12 w-12 text-gray-400"
          aria-hidden="true"
        />
      ),
    };

    const configs = {
      inbox: {
        title: "No messages",
        message: "Your inbox is empty. New messages will appear here.",
        actionLabel: "Refresh",
      },
      folder: {
        title: "No folders",
        message:
          "You don't have any folders yet. Create one to organize your files.",
        actionLabel: "Create Folder",
      },
      file: {
        title: "No files",
        message: "This folder is empty. Upload files to get started.",
        actionLabel: "Upload Files",
      },
    };

    return (
      <div className="space-y-6">
        <div className="flex gap-2 justify-center">
          <button
            onClick={() => setType("inbox")}
            className="px-3 py-1 text-sm bg-gray-200 rounded hover:bg-gray-300"
          >
            Inbox
          </button>
          <button
            onClick={() => setType("folder")}
            className="px-3 py-1 text-sm bg-gray-200 rounded hover:bg-gray-300"
          >
            Folder
          </button>
          <button
            onClick={() => setType("file")}
            className="px-3 py-1 text-sm bg-gray-200 rounded hover:bg-gray-300"
          >
            File
          </button>
        </div>
        <EmptyState
          title={configs[type].title}
          message={configs[type].message}
          actionLabel={configs[type].actionLabel}
          onAction={() => alert(`${configs[type].actionLabel} clicked!`)}
          variant="withIllustration"
          illustration={illustrations[type]}
        />
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          "Empty state with different illustrations. Switch between types to see different contexts.",
      },
    },
  },
};

// Event Stories
export const WithEvents: Story = {
  render: () => {
    const handleAction = fn(() => {
      console.log("Action button clicked");
    });

    return (
      <div className="space-y-4">
        <p className="text-sm text-gray-600">
          Click the action button. Check the Actions panel to see events being
          fired.
        </p>
        <EmptyState
          title="No items found"
          message="Get started by creating your first item."
          actionLabel="Create Item"
          onAction={handleAction}
          variant="withAction"
        />
      </div>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByText("Create Item");
    await userEvent.click(button);
    await waitFor(() => {
      expect(button).toBeInTheDocument();
    });
  },
  parameters: {
    docs: {
      description: {
        story:
          "Demonstrates empty state events. Click the action button and check the Actions panel to see events being logged.",
      },
    },
  },
};

// State Stories
export const DefaultState: Story = {
  args: {
    title: "No items found",
    message: "There are no items to display at this time.",
  },
  parameters: {
    docs: {
      description: {
        story: "Default state - empty state with title and message only.",
      },
    },
  },
};

export const WithActionState: Story = {
  args: {
    title: "No epics yet",
    message: "Get started by creating your first epic to organize your work.",
    actionLabel: "Create Epic",
    variant: "withAction",
  },
  parameters: {
    docs: {
      description: {
        story: "With action state - empty state includes an action button.",
      },
    },
  },
};

export const WithIllustrationState: Story = {
  args: {
    title: "No stories found",
    message:
      "This epic doesn't have any stories yet. Add a story to get started.",
    actionLabel: "Add Story",
    variant: "withIllustration",
    illustration: (
      <FileText
        className="mx-auto h-12 w-12 text-gray-400"
        aria-hidden="true"
      />
    ),
  },
  parameters: {
    docs: {
      description: {
        story:
          "With illustration state - empty state includes an illustration icon.",
      },
    },
  },
};
