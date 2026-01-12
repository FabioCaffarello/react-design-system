import type { Meta, StoryObj } from "@storybook/react";
import NavLink from "./NavLink";

const meta: Meta<typeof NavLink> = {
  title: "Atoms/NavLink",
  component: NavLink,
  parameters: {
    docs: {
      description: {
        component: "A navigation link component with active and disabled states. Used in headers, sidebars, and breadcrumbs.",
      },
    },
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "active", "disabled"],
      description: "Visual variant of the link",
    },
    href: {
      control: "text",
      description: "URL for the link",
    },
  },
};

export const Default: StoryObj<typeof NavLink> = {
  args: {
    children: "Dashboard",
    href: "/dashboard",
  },
};

export const Active: StoryObj<typeof NavLink> = {
  args: {
    children: "Epics",
    href: "/epics",
    variant: "active",
  },
};

export const Disabled: StoryObj<typeof NavLink> = {
  args: {
    children: "Coming Soon",
    variant: "disabled",
  },
};

export const WithIcon: StoryObj<typeof NavLink> = {
  args: {
    children: "Dashboard",
    href: "/dashboard",
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
  },
};

export const NavigationBar: StoryObj<typeof NavLink> = {
  render: () => (
    <nav className="flex space-x-8">
      <NavLink href="/" variant="active">
        Dashboard
      </NavLink>
      <NavLink href="/epics">
        Epics
      </NavLink>
      <NavLink href="/stories">
        Stories
      </NavLink>
      <NavLink href="/tasks">
        Tasks
      </NavLink>
      <NavLink variant="disabled">
        Coming Soon
      </NavLink>
    </nav>
  ),
};

export default meta;
