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
          <div className="p-4 bg-success-bg border border-success rounded-lg">
            <p className="text-fg-success">
              Epic created! Items: {items.join(", ")}
            </p>
            <button
              onClick={() => setItems([])}
              className="mt-2 px-3 py-1 text-sm bg-success-bg-emphasis rounded hover:bg-success"
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
          <p className="text-sm text-fg-secondary text-center">
            Creating epic...
          </p>
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
          <div className="p-4 bg-surface-selected-subtle border border-line-default rounded-lg">
            <p className="text-fg-primary font-medium mb-2">Stories created:</p>
            <ul className="list-disc list-inside text-fg-primary">
              {stories.map((story, i) => (
                <li key={i}>{story}</li>
              ))}
            </ul>
            <button
              onClick={() => setStories([])}
              className="mt-3 px-3 py-1 text-sm bg-surface-emphasis rounded hover:bg-surface-strong"
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
            className="mx-auto h-12 w-12 text-fg-quaternary"
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
        <Inbox
          className="mx-auto h-12 w-12 text-fg-quaternary"
          aria-hidden="true"
        />
      ),
      folder: (
        <FolderOpen
          className="mx-auto h-12 w-12 text-fg-quaternary"
          aria-hidden="true"
        />
      ),
      file: (
        <FileText
          className="mx-auto h-12 w-12 text-fg-quaternary"
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
            className="px-3 py-1 text-sm bg-surface-emphasis rounded hover:bg-surface-strong"
          >
            Inbox
          </button>
          <button
            onClick={() => setType("folder")}
            className="px-3 py-1 text-sm bg-surface-emphasis rounded hover:bg-surface-strong"
          >
            Folder
          </button>
          <button
            onClick={() => setType("file")}
            className="px-3 py-1 text-sm bg-surface-emphasis rounded hover:bg-surface-strong"
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
        <p className="text-sm text-fg-secondary">
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
        className="mx-auto h-12 w-12 text-fg-quaternary"
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

// ── action slot (issue #252) ───────────────────────────────────────────────

export const WithActionSlot: Story = {
  name: "action slot — server-rendered link",
  render: () => (
    <EmptyState
      title="Sem resultados"
      message="Nenhum parlamentar corresponde aos filtros aplicados."
      action={
        <a
          href="/?reset"
          className="text-fg-brand underline text-sm font-medium hover:text-fg-brand-emphasis"
        >
          Limpar filtros
        </a>
      }
    />
  ),
  parameters: {
    docs: {
      description: {
        story:
          "The `action` slot accepts any ReactNode — a plain `<a href>`, a `next/link`, or a custom CTA. Use this to keep zero-JS routes free of client islands: the link is server-rendered and requires no hydration, while the legacy `actionLabel` + `onAction` pair still works for callback-driven buttons.",
      },
    },
  },
};

export const TitleOnly: Story = {
  name: "Title only (no message)",
  args: {
    title: "Nenhum filtro ativo",
  },
  parameters: {
    docs: {
      description: {
        story:
          "`message` is now optional. Omit it when the title is self-explanatory. The `aria-label` becomes just the title; no `<p>` is rendered.",
      },
    },
  },
};

export const TitleOnlyWithLink: Story = {
  name: "Title only + action slot",
  render: () => (
    <EmptyState
      title="Nada por aqui"
      action={
        <a
          href="/"
          className="text-fg-brand underline text-sm font-medium hover:text-fg-brand-emphasis"
        >
          Voltar ao início
        </a>
      }
    />
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Title-only empty state paired with the action slot: no message, no Button, zero-JS.",
      },
    },
  },
};
