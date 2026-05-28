/**
 * Header Stories
 *
 * Storybook stories for the Header component.
 */

import type { Meta, StoryObj } from "@storybook/react";
import { Header } from "./Header";
import { NavLink } from "../../primitives/NavLink";
import { Button } from "../../primitives/Button/Button";
import { DashboardLayout } from "../../components/DashboardLayout/DashboardLayout";
import SideNavbar from "../../components/SideNavbar/SideNavbar";
import { Home, Settings } from "lucide-react";

const meta: Meta<typeof Header> = {
  title: "Molecules/Header",
  component: Header,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: `
## Header

Horizontal header component with logo, navigation, and actions slots.
Uses compound components pattern for maximum flexibility.

### Features

- **Compound Components**: Logo, Navigation, Actions slots
- **Variants**: default, elevated, bordered
- **Sticky Positioning**: Optional sticky header
- **Responsive**: Mobile menu support (coming soon)
- **Context**: Independent HeaderContext for mobile menu state

### Usage

\`\`\`tsx
<Header>
  <Header.Logo href="/">MyApp</Header.Logo>
  <Header.Navigation>
    <NavLink href="/home">Home</NavLink>
    <NavLink href="/about">About</NavLink>
  </Header.Navigation>
  <Header.Actions>
    <Button>Sign In</Button>
  </Header.Actions>
</Header>
\`\`\`
        `,
      },
    },
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "elevated", "bordered"],
      description: "Visual variant of the Header",
    },
    sticky: {
      control: "boolean",
      description: "Whether the header is sticky",
    },
    maxWidth: {
      control: "select",
      options: ["sm", "md", "lg", "xl", "full"],
      description: "Max width of the header container",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Header>;

/**
 * Default Header
 */
export const Default: Story = {
  render: () => (
    <Header>
      <Header.Logo href="/">MyApp</Header.Logo>
    </Header>
  ),
};

/**
 * Header with Logo and Navigation
 */
export const WithNavigation: Story = {
  render: () => (
    <Header>
      <Header.Logo href="/">MyApp</Header.Logo>
      <Header.Navigation>
        <NavLink href="/home">Home</NavLink>
        <NavLink href="/about">About</NavLink>
        <NavLink href="/contact">Contact</NavLink>
      </Header.Navigation>
    </Header>
  ),
};

/**
 * Header with Logo and Actions
 */
export const WithActions: Story = {
  render: () => (
    <Header>
      <Header.Logo href="/">MyApp</Header.Logo>
      <Header.Actions>
        <Button variant="outline">Sign In</Button>
        <Button variant="primary">Sign Up</Button>
      </Header.Actions>
    </Header>
  ),
};

/**
 * Complete Header
 */
export const Complete: Story = {
  render: () => (
    <Header>
      <Header.Logo href="/">MyApp</Header.Logo>
      <Header.Navigation>
        <NavLink href="/home">Home</NavLink>
        <NavLink href="/about">About</NavLink>
        <NavLink href="/contact">Contact</NavLink>
      </Header.Navigation>
      <Header.Actions>
        <Button variant="outline">Sign In</Button>
        <Button variant="primary">Sign Up</Button>
      </Header.Actions>
    </Header>
  ),
};

/**
 * Variants
 */
export const Variants: Story = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h3 className="mb-2 text-sm font-medium">Default</h3>
        <Header variant="default">
          <Header.Logo href="/">MyApp</Header.Logo>
        </Header>
      </div>
      <div>
        <h3 className="mb-2 text-sm font-medium">Elevated</h3>
        <Header variant="elevated">
          <Header.Logo href="/">MyApp</Header.Logo>
        </Header>
      </div>
      <div>
        <h3 className="mb-2 text-sm font-medium">Bordered</h3>
        <Header variant="bordered">
          <Header.Logo href="/">MyApp</Header.Logo>
        </Header>
      </div>
    </div>
  ),
};

/**
 * Sticky Header
 */
export const Sticky: Story = {
  render: () => (
    <div>
      <Header sticky>
        <Header.Logo href="/">MyApp</Header.Logo>
        <Header.Navigation>
          <NavLink href="/home">Home</NavLink>
          <NavLink href="/about">About</NavLink>
        </Header.Navigation>
        <Header.Actions>
          <Button>Sign In</Button>
        </Header.Actions>
      </Header>
      <div className="h-screen p-8">
        <p>Scroll down to see the sticky header behavior</p>
        <div className="mt-96">Content below...</div>
      </div>
    </div>
  ),
};

/**
 * With Mobile Menu
 */
export const WithMobileMenu: Story = {
  render: () => (
    <Header>
      <Header.Hamburger />
      <Header.Logo href="/">MyApp</Header.Logo>
      <Header.Navigation>
        <NavLink href="/home">Home</NavLink>
        <NavLink href="/about">About</NavLink>
        <NavLink href="/contact">Contact</NavLink>
      </Header.Navigation>
      <Header.Actions>
        <Button variant="outline" className="hidden md:inline-flex">
          Sign In
        </Button>
        <Button variant="primary" className="hidden md:inline-flex">
          Sign Up
        </Button>
      </Header.Actions>
      <Header.MobileMenu>
        <NavLink href="/home" className="block py-2">
          Home
        </NavLink>
        <NavLink href="/about" className="block py-2">
          About
        </NavLink>
        <NavLink href="/contact" className="block py-2">
          Contact
        </NavLink>
        <div className="mt-4 pt-4 border-t">
          <Button variant="outline" className="w-full mb-2">
            Sign In
          </Button>
          <Button variant="primary" className="w-full">
            Sign Up
          </Button>
        </div>
      </Header.MobileMenu>
    </Header>
  ),
};

/**
 * With DashboardLayout
 *
 * Example of Header used with DashboardLayout.
 * Uses `bare` prop to avoid duplicate header/Container wrappers.
 */
export const WithDashboardLayout: Story = {
  render: () => (
    <DashboardLayout
      sidebar={
        <SideNavbar mode="navigation">
          <SideNavbar.Navbar>
            <SideNavbar.Navbar.Item icon={<Home />} label="Home" />
            <SideNavbar.Navbar.Item icon={<Settings />} label="Settings" />
          </SideNavbar.Navbar>
        </SideNavbar>
      }
      header={
        <Header bare>
          <Header.Logo href="/">AppBuilder</Header.Logo>
          <Header.Actions>
            <Button variant="outline">Sign In</Button>
            <Button variant="primary">Sign Up</Button>
          </Header.Actions>
        </Header>
      }
    >
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">Dashboard Content</h1>
        <p>This is the main content area of the dashboard.</p>
        <p className="mt-4 text-sm text-gray-600">
          Note: Header uses{" "}
          <code className="bg-gray-100 px-1 rounded">bare</code> prop to avoid
          duplicate wrappers when used in DashboardLayout.
        </p>
      </div>
    </DashboardLayout>
  ),
};
