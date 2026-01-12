import type { Meta, StoryObj } from "@storybook/react";
import Textarea from "./Textarea";

const meta: Meta<typeof Textarea> = {
  title: "Atoms/Textarea",
  component: Textarea,
  parameters: {
    docs: {
      description: {
        component: "A styled textarea component for longer text input. Supports error states and resize options.",
      },
    },
  },
  argTypes: {
    placeholder: {
      control: "text",
      description: "Placeholder text",
    },
    rows: {
      control: "number",
      description: "Number of visible rows",
    },
    error: {
      control: "boolean",
      description: "Whether the textarea is in an error state",
    },
    resize: {
      control: "select",
      options: ["none", "both", "horizontal", "vertical"],
      description: "Resize behavior",
    },
  },
};

export const Primary: StoryObj<typeof Textarea> = {
  args: {
    placeholder: "Enter description...",
    rows: 4,
  },
};

export const WithDefaultValue: StoryObj<typeof Textarea> = {
  args: {
    defaultValue: "This is a default value",
    rows: 4,
  },
};

export const WithError: StoryObj<typeof Textarea> = {
  args: {
    placeholder: "Enter description...",
    rows: 4,
    error: true,
  },
};

export const NoResize: StoryObj<typeof Textarea> = {
  args: {
    placeholder: "Fixed size textarea",
    rows: 4,
    resize: "none",
  },
};

export const LargeTextarea: StoryObj<typeof Textarea> = {
  args: {
    placeholder: "Enter a longer description...",
    rows: 8,
  },
};

export default meta;
