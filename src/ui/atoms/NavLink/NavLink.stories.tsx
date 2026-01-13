import type { Meta, StoryObj } from "@storybook/react";
import { Home } from "lucide-react";
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
    icon: <Home className="h-5 w-5" />,
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
