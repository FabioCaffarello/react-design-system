/**
 * Header Stories
 *
 * Storybook stories for the Header component.
 */

import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";
import { Header } from "./Header";
import { NavLink } from "../../primitives/NavLink";
import { Button } from "../../primitives/Button/Button";
import { DashboardLayout } from "../../components/DashboardLayout/DashboardLayout";
import SideNavbar from "../../components/SideNavbar/SideNavbar";
import { Home, Settings } from "lucide-react";

const meta: Meta<typeof Header> = {
  title: "Components/Header",
  component: Header,
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
        <Header variant="default" aria-label="Header — default variant">
          <Header.Logo href="/">MyApp</Header.Logo>
        </Header>
      </div>
      <div>
        <h3 className="mb-2 text-sm font-medium">Elevated</h3>
        <Header variant="elevated" aria-label="Header — elevated variant">
          <Header.Logo href="/">MyApp</Header.Logo>
        </Header>
      </div>
      <div>
        <h3 className="mb-2 text-sm font-medium">Bordered</h3>
        <Header variant="bordered" aria-label="Header — bordered variant">
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
        <p className="mt-4 text-sm text-fg-secondary">
          Note: Header uses{" "}
          <code className="bg-surface-muted px-1 rounded">bare</code> prop to
          avoid duplicate wrappers when used in DashboardLayout.
        </p>
      </div>
    </DashboardLayout>
  ),
};

/**
 * Interactive
 *
 * Verifies the Header compound assembles its three slots — Logo,
 * Navigation items, Actions — into the rendered tree, exposes the
 * `<header>` landmark for assistive tech, and that focus walks back
 * from the action button through the nav links via Shift+Tab.
 *
 * Header.Hamburger is intentionally NOT exercised here: it carries
 * `md:hidden`, so on Storybook's default 1280px viewport the button
 * is `display:none` and absent from the accessibility tree. A
 * dedicated hamburger interaction test belongs in a mobile-viewport
 * story or a unit test that controls the breakpoint directly.
 */
export const Interactive: Story = {
  render: () => (
    <Header>
      <Header.Logo href="#">MyApp</Header.Logo>
      <Header.Navigation>
        <NavLink href="#home">Home</NavLink>
        <NavLink href="#about">About</NavLink>
      </Header.Navigation>
      <Header.Actions>
        <Button variant="primary">Sign In</Button>
      </Header.Actions>
    </Header>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    expect(canvas.getByRole("banner")).toBeInTheDocument();
    expect(canvas.getByRole("link", { name: /myapp/i })).toBeInTheDocument();
    expect(canvas.getByRole("navigation")).toBeInTheDocument();

    const about = canvas.getByRole("link", { name: /about/i });
    expect(canvas.getByRole("link", { name: /^home$/i })).toHaveAttribute(
      "href",
      "#home",
    );
    expect(about).toHaveAttribute("href", "#about");

    const signIn = canvas.getByRole("button", { name: /sign in/i });
    signIn.focus();
    expect(signIn).toHaveFocus();

    await userEvent.tab({ shift: true });
    expect(about).toHaveFocus();
  },
};
