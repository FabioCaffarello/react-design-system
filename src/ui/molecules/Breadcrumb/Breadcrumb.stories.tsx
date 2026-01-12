import type { Meta, StoryObj } from "@storybook/react";
import Breadcrumb from "./Breadcrumb";

const meta: Meta<typeof Breadcrumb> = {
  title: "Molecules/Breadcrumb",
  component: Breadcrumb,
  parameters: {
    docs: {
      description: {
        component: "A breadcrumb navigation component for hierarchical navigation. Accessible with proper ARIA labels.",
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
  args: {
    items: [
      { label: "Home", href: "/" },
      { label: "Epics", href: "/epics" },
      { label: "Epic Details" },
    ],
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
  args: {
    items: [
      { label: "Home", href: "/" },
      { label: "Epics", href: "/epics" },
      { label: "User Authentication", href: "/epics/1" },
      { label: "Edit" },
    ],
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

export default meta;
