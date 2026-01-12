import type { Meta, StoryObj } from "@storybook/react";
import Sidebar from "./Sidebar";

const meta: Meta<typeof Sidebar> = {
  title: "Organisms/Sidebar",
  component: Sidebar,
  parameters: {
    docs: {
      description: {
        component: "A sidebar navigation component with header, groups, and items. Uses Compound Components pattern.",
      },
    },
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "collapsed"],
      description: "Visual variant of the sidebar",
    },
    title: {
      control: "text",
      description: "Title displayed in the header",
    },
    showHeader: {
      control: "boolean",
      description: "Whether to show the header",
    },
  },
};

export const Default: StoryObj<typeof Sidebar> = {
  args: {
    title: "Navigation",
    showHeader: true,
    children: (
      <>
        <Sidebar.Group title="Agile">
          <Sidebar.Item href="/epics" isActive>
            Epics
          </Sidebar.Item>
          <Sidebar.Item href="/stories">Stories</Sidebar.Item>
          <Sidebar.Item href="/backlog">Backlog</Sidebar.Item>
          <Sidebar.Item href="/kanban">Kanban</Sidebar.Item>
          <Sidebar.Item href="/sprints">Sprints</Sidebar.Item>
        </Sidebar.Group>
        <Sidebar.Group title="Documentation">
          <Sidebar.Item href="/adrs">ADRs</Sidebar.Item>
          <Sidebar.Item href="/roadmap">Roadmap</Sidebar.Item>
        </Sidebar.Group>
      </>
    ),
  },
};

export const WithIcons: StoryObj<typeof Sidebar> = {
  args: {
    title: "Navigation",
    showHeader: true,
    children: (
      <Sidebar.Group title="Agile">
        <Sidebar.Item
          href="/epics"
          isActive
          icon={
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          }
        >
          Epics
        </Sidebar.Item>
        <Sidebar.Item
          href="/stories"
          icon={
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          }
        >
          Stories
        </Sidebar.Item>
      </Sidebar.Group>
    ),
  },
};

export const Collapsed: StoryObj<typeof Sidebar> = {
  args: {
    title: "Navigation",
    variant: "collapsed",
    showHeader: true,
    children: (
      <Sidebar.Group>
        <Sidebar.Item href="/epics" isActive>
          Epics
        </Sidebar.Item>
        <Sidebar.Item href="/stories">Stories</Sidebar.Item>
      </Sidebar.Group>
    ),
  },
};

export const WithoutHeader: StoryObj<typeof Sidebar> = {
  args: {
    showHeader: false,
    children: (
      <Sidebar.Group>
        <Sidebar.Item href="/epics" isActive>
          Epics
        </Sidebar.Item>
        <Sidebar.Item href="/stories">Stories</Sidebar.Item>
      </Sidebar.Group>
    ),
  },
};

export default meta;
