import type { Meta, StoryObj } from "@storybook/react";
import EmptyState from "./EmptyState";

const meta = {
  title: "Molecules/EmptyState",
  component: EmptyState,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: "A component for displaying empty states when there's no content. Includes proper ARIA attributes (role='status', aria-live='polite') for screen reader announcements.",
      },
    },
  },
  tags: ["autodocs"],
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
  args: {
    title: "No epics yet",
    message: "Get started by creating your first epic to organize your work.",
    actionLabel: "Create Epic",
    onAction: () => {},
    variant: "withAction",
  },
};

export const WithIllustration: Story = {
  args: {
    title: "No stories found",
    message: "This epic doesn't have any stories yet. Add a story to get started.",
    actionLabel: "Add Story",
    onAction: () => {},
    variant: "withIllustration",
    illustration: (
      <svg
        className="mx-auto h-12 w-12 text-gray-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
      </svg>
    ),
  },
};
