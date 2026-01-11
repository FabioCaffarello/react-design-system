import type { Meta, StoryObj } from "@storybook/react";
import Select from "./Select";

const meta: Meta<typeof Select> = {
  title: "UI/Atoms/Select",
  component: Select,
  parameters: {
    docs: {
      description: {
        component: "A styled select dropdown component for forms. Supports options, placeholder, and error states.",
      },
    },
  },
  argTypes: {
    options: {
      control: "object",
      description: "Array of options to display",
    },
    placeholder: {
      control: "text",
      description: "Placeholder text for the select",
    },
    error: {
      control: "boolean",
      description: "Whether the select is in an error state",
    },
  },
};

const defaultOptions = [
  { value: "1", label: "Option 1" },
  { value: "2", label: "Option 2" },
  { value: "3", label: "Option 3" },
];

export const Primary: StoryObj<typeof Select> = {
  args: {
    options: defaultOptions,
    placeholder: "Select an option",
  },
};

export const WithSelectedValue: StoryObj<typeof Select> = {
  args: {
    options: defaultOptions,
    defaultValue: "2",
  },
};

export const WithError: StoryObj<typeof Select> = {
  args: {
    options: defaultOptions,
    placeholder: "Select an option",
    error: true,
  },
};

export const WithDisabledOption: StoryObj<typeof Select> = {
  args: {
    options: [
      { value: "1", label: "Option 1" },
      { value: "2", label: "Option 2 (Disabled)", disabled: true },
      { value: "3", label: "Option 3" },
    ],
    placeholder: "Select an option",
  },
};

export const StatusOptions: StoryObj<typeof Select> = {
  args: {
    options: [
      { value: "DRAFT", label: "Draft" },
      { value: "ACTIVE", label: "Active" },
      { value: "COMPLETED", label: "Completed" },
      { value: "ARCHIVED", label: "Archived" },
    ],
    placeholder: "Select status",
  },
};

export const PriorityOptions: StoryObj<typeof Select> = {
  args: {
    options: [
      { value: "LOW", label: "Low" },
      { value: "MEDIUM", label: "Medium" },
      { value: "HIGH", label: "High" },
      { value: "CRITICAL", label: "Critical" },
    ],
    placeholder: "Select priority",
  },
};

export default meta;
