import type { Meta, StoryObj } from "@storybook/react";
import NavbarGroup from "./NavbarGroup";

const meta: Meta<typeof NavbarGroup> = {
  title: "Molecules/NavbarGroup",
  component: NavbarGroup,
  parameters: {
    docs: {
      description: {
        component: "A clickable group in the navbar that can expand a sidebar.",
      },
    },
  },
  argTypes: {
    label: {
      control: "text",
      description: "Label text for the group",
    },
    isActive: {
      control: "boolean",
      description: "Whether the group is currently active",
    },
  },
};

export const Default: StoryObj<typeof NavbarGroup> = {
  args: {
    label: "Agile",
    isActive: false,
  },
};

export const Active: StoryObj<typeof NavbarGroup> = {
  args: {
    label: "Agile",
    isActive: true,
  },
};

export const WithIcon: StoryObj<typeof NavbarGroup> = {
  args: {
    label: "Agile",
    isActive: false,
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
  },
};

export const NavigationBar: StoryObj<typeof NavbarGroup> = {
  render: () => (
    <nav className="flex space-x-4 bg-white p-4 border-b">
      <NavbarGroup label="Dashboard" isActive={false} />
      <NavbarGroup label="Agile" isActive={true} />
      <NavbarGroup label="Documentação" isActive={false} />
    </nav>
  ),
};

export default meta;
