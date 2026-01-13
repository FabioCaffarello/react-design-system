import type { Meta, StoryObj } from "@storybook/react";
import { FileText } from "lucide-react";
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
    icon: <FileText className="h-5 w-5" />,
  },
};

export const Nested: StoryObj<typeof SidebarItem> = {
  args: {
    href: "/epics",
    children: "Epics",
    isActive: false,
    nested: true,
    icon: <FileText className="h-5 w-5" />,
  },
};

export const NestedLevel2: StoryObj<typeof SidebarItem> = {
  args: {
    href: "/epics",
    children: "Epics",
    isActive: false,
    nested: 2,
    icon: <FileText className="h-5 w-5" />,
  },
};

export const DifferentIconSizes: StoryObj<typeof SidebarItem> = {
  render: () => (
    <div className="space-y-2 w-64">
      <SidebarItem href="/test" iconSize="sm" icon={<FileText className="h-4 w-4" />}>
        Small Icon
      </SidebarItem>
      <SidebarItem href="/test" iconSize="md" icon={<FileText className="h-5 w-5" />}>
        Medium Icon (default)
      </SidebarItem>
      <SidebarItem href="/test" iconSize="lg" icon={<FileText className="h-6 w-6" />}>
        Large Icon
      </SidebarItem>
    </div>
  ),
};

export default meta;
