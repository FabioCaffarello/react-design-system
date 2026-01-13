import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { FileText, CheckSquare } from "lucide-react";
import SidebarGroup from "./SidebarGroup";
import SidebarItem from "../SidebarItem/SidebarItem";

const meta: Meta<typeof SidebarGroup> = {
  title: "Organisms/Sidebar/SidebarGroup",
  component: SidebarGroup,
  parameters: {
    docs: {
      description: {
        component: "A group container for sidebar items with optional title. Supports collapsible groups.",
      },
    },
  },
  argTypes: {
    title: {
      control: "text",
      description: "Title text for the group",
    },
    collapsible: {
      control: "boolean",
      description: "Whether the group can be collapsed",
    },
    defaultCollapsed: {
      control: "boolean",
      description: "Initial collapsed state (uncontrolled mode)",
    },
  },
};

export const Default: StoryObj<typeof SidebarGroup> = {
  args: {
    title: "Agile",
    children: (
      <>
        <SidebarItem href="/epics">Epics</SidebarItem>
        <SidebarItem href="/stories">Stories</SidebarItem>
        <SidebarItem href="/tasks">Tasks</SidebarItem>
      </>
    ),
  },
};

export const WithoutTitle: StoryObj<typeof SidebarGroup> = {
  args: {
    children: (
      <>
        <SidebarItem href="/kanban">Kanban</SidebarItem>
        <SidebarItem href="/sprints">Sprints</SidebarItem>
      </>
    ),
  },
};

export const Collapsible: StoryObj<typeof SidebarGroup> = {
  args: {
    title: "Backlog",
    collapsible: true,
    defaultCollapsed: false,
    children: (
      <>
        <SidebarItem href="/epics" nested={true}>Epics</SidebarItem>
        <SidebarItem href="/stories" nested={true}>Stories</SidebarItem>
        <SidebarItem href="/tasks" nested={true}>Tasks</SidebarItem>
      </>
    ),
  },
};

export const CollapsibleDefaultCollapsed: StoryObj<typeof SidebarGroup> = {
  args: {
    title: "Backlog",
    collapsible: true,
    defaultCollapsed: true,
    children: (
      <>
        <SidebarItem href="/epics" nested={true}>Epics</SidebarItem>
        <SidebarItem href="/stories" nested={true}>Stories</SidebarItem>
        <SidebarItem href="/tasks" nested={true}>Tasks</SidebarItem>
      </>
    ),
  },
};

export const ControlledCollapsible: StoryObj<typeof SidebarGroup> = {
  render: () => {
    const [collapsed, setCollapsed] = useState(false);
    return (
      <div className="space-y-4">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="px-4 py-2 bg-gray-100 rounded"
        >
          {collapsed ? "Expand" : "Collapse"} (External Control)
        </button>
        <SidebarGroup
          title="Backlog"
          collapsible={true}
          collapsed={collapsed}
          onCollapseChange={setCollapsed}
        >
          <SidebarItem href="/epics" nested={true}>Epics</SidebarItem>
          <SidebarItem href="/stories" nested={true}>Stories</SidebarItem>
          <SidebarItem href="/tasks" nested={true}>Tasks</SidebarItem>
        </SidebarGroup>
      </div>
    );
  },
};

export const WithNestedItems: StoryObj<typeof SidebarGroup> = {
  args: {
    title: "Backlog",
    collapsible: true,
    defaultCollapsed: false,
    children: (
      <>
        <SidebarItem
          href="/epics"
          nested={true}
          icon={<FileText className="h-5 w-5" />}
        >
          Epics
        </SidebarItem>
        <SidebarItem
          href="/stories"
          nested={true}
          icon={<FileText className="h-5 w-5" />}
        >
          Stories
        </SidebarItem>
        <SidebarItem
          href="/tasks"
          nested={true}
          icon={<CheckSquare className="h-5 w-5" />}
        >
          Tasks
        </SidebarItem>
      </>
    ),
  },
};

export const MultipleGroups: StoryObj<typeof SidebarGroup> = {
  render: () => (
    <div className="w-64 bg-white border-r border-gray-200 p-4 space-y-4">
      <SidebarGroup title="Backlog" collapsible={true} defaultCollapsed={false}>
        <SidebarItem href="/epics" nested={true}>Epics</SidebarItem>
        <SidebarItem href="/stories" nested={true}>Stories</SidebarItem>
        <SidebarItem href="/tasks" nested={true}>Tasks</SidebarItem>
      </SidebarGroup>
      <SidebarGroup>
        <SidebarItem href="/kanban">Kanban</SidebarItem>
        <SidebarItem href="/sprints">Sprints</SidebarItem>
      </SidebarGroup>
    </div>
  ),
};

export default meta;
