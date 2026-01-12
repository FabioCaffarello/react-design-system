import type { Meta, StoryObj } from "@storybook/react";
import SidebarItem from "./SidebarItem";

const meta: Meta<typeof SidebarItem> = {
  title: "Organisms/Sidebar/SidebarItem",
  component: SidebarItem,
  parameters: {
    docs: {
      description: {
        component: "An individual navigation item within a sidebar.",
      },
    },
  },
  argTypes: {
    isActive: {
      control: "boolean",
      description: "Whether the item is currently active",
    },
    href: {
      control: "text",
      description: "URL for the navigation item",
    },
  },
};

export const Default: StoryObj<typeof SidebarItem> = {
  args: {
    href: "/epics",
    children: "Epics",
    isActive: false,
  },
};

export const Active: StoryObj<typeof SidebarItem> = {
  args: {
    href: "/epics",
    children: "Epics",
    isActive: true,
  },
};

export const WithIcon: StoryObj<typeof SidebarItem> = {
  args: {
    href: "/epics",
    children: "Epics",
    isActive: false,
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
  },
};

export const Nested: StoryObj<typeof SidebarItem> = {
  args: {
    href: "/epics",
    children: "Epics",
    isActive: false,
    nested: true,
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
  },
};

export const NestedLevel2: StoryObj<typeof SidebarItem> = {
  args: {
    href: "/epics",
    children: "Epics",
    isActive: false,
    nested: 2,
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
  },
};

export const DifferentIconSizes: StoryObj<typeof SidebarItem> = {
  render: () => (
    <div className="space-y-2 w-64">
      <SidebarItem href="/test" iconSize="sm" icon={<span>📄</span>}>
        Small Icon
      </SidebarItem>
      <SidebarItem href="/test" iconSize="md" icon={<span>📄</span>}>
        Medium Icon (default)
      </SidebarItem>
      <SidebarItem href="/test" iconSize="lg" icon={<span>📄</span>}>
        Large Icon
      </SidebarItem>
    </div>
  ),
};

export default meta;
