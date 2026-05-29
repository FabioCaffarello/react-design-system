/**
 * NavLink Stories
 *
 * Storybook stories for the NavLink component.
 */

import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import { NavLink } from "./NavLink";

const meta: Meta<typeof NavLink> = {
  title: "Primitives/NavLink",
  component: NavLink,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
## NavLink

Navigation link component with active state detection and Next.js integration.

### Features

- **Active State Detection**: Manual via \`active\` prop (auto-detect via usePathname coming soon)
- **Next.js Integration**: Auto-detects Next.js Link component when available
- **Variants**: default, underline, background
- **Sizes**: sm, md, lg
- **Accessibility**: Full ARIA support, keyboard navigation, WCAG 2.1 AA compliant

### Usage

\`\`\`tsx
// Basic usage
<NavLink href="/home">Home</NavLink>

// With active state
<NavLink href="/about" active>About</NavLink>

// With variant
<NavLink href="/contact" variant="underline" active>Contact</NavLink>

// With size
<NavLink href="/settings" variant="background" size="lg">Settings</NavLink>
\`\`\`
        `,
      },
    },
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "underline", "background"],
      description: "Visual variant of the NavLink",
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
      description: "Size of the NavLink",
    },
    active: {
      control: "boolean",
      description: "Whether the link is active (manual control)",
    },
    disabled: {
      control: "boolean",
      description: "Whether the link is disabled",
    },
    href: {
      control: "text",
      description: "URL of the navigation link",
    },
    onClick: {
      description: "Callback fired when the link is clicked",
      action: "onClick",
    },
  },
};

export default meta;
type Story = StoryObj<typeof NavLink>;

/**
 * Default NavLink
 */
export const Default: Story = {
  args: {
    href: "/home",
    children: "Home",
  },
};

/**
 * Active NavLink
 */
export const Active: Story = {
  args: {
    href: "/home",
    children: "Home",
    active: true,
  },
};

/**
 * Disabled NavLink
 */
export const Disabled: Story = {
  args: {
    href: "/home",
    children: "Home",
    disabled: true,
  },
};

/**
 * Variants
 */
export const Variants: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div>
        <h3 className="mb-2 text-sm font-medium">Default</h3>
        <div className="flex gap-4">
          <NavLink href="/home">Home</NavLink>
          <NavLink href="/about" active>
            About (Active)
          </NavLink>
        </div>
      </div>
      <div>
        <h3 className="mb-2 text-sm font-medium">Underline</h3>
        <div className="flex gap-4">
          <NavLink href="/home" variant="underline">
            Home
          </NavLink>
          <NavLink href="/about" variant="underline" active>
            About (Active)
          </NavLink>
        </div>
      </div>
      <div>
        <h3 className="mb-2 text-sm font-medium">Background</h3>
        <div className="flex gap-4">
          <NavLink href="/home" variant="background">
            Home
          </NavLink>
          <NavLink href="/about" variant="background" active>
            About (Active)
          </NavLink>
        </div>
      </div>
    </div>
  ),
};

/**
 * Sizes
 */
export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div>
        <h3 className="mb-2 text-sm font-medium">Small</h3>
        <div className="flex gap-4">
          <NavLink href="/home" size="sm">
            Home
          </NavLink>
          <NavLink href="/about" size="sm" active>
            About
          </NavLink>
        </div>
      </div>
      <div>
        <h3 className="mb-2 text-sm font-medium">Medium (Default)</h3>
        <div className="flex gap-4">
          <NavLink href="/home" size="md">
            Home
          </NavLink>
          <NavLink href="/about" size="md" active>
            About
          </NavLink>
        </div>
      </div>
      <div>
        <h3 className="mb-2 text-sm font-medium">Large</h3>
        <div className="flex gap-4">
          <NavLink href="/home" size="lg">
            Home
          </NavLink>
          <NavLink href="/about" size="lg" active>
            About
          </NavLink>
        </div>
      </div>
    </div>
  ),
};

/**
 * Navigation Example
 */
export const NavigationExample: Story = {
  render: () => (
    <nav className="flex gap-4" aria-label="Main navigation">
      <NavLink href="/home" active>
        Home
      </NavLink>
      <NavLink href="/about">About</NavLink>
      <NavLink href="/services">Services</NavLink>
      <NavLink href="/contact">Contact</NavLink>
    </nav>
  ),
};

/**
 * All States
 */
export const AllStates: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div>
        <h3 className="mb-2 text-sm font-medium">Default State</h3>
        <NavLink href="/home">Home</NavLink>
      </div>
      <div>
        <h3 className="mb-2 text-sm font-medium">Active State</h3>
        <NavLink href="/about" active>
          About
        </NavLink>
      </div>
      <div>
        <h3 className="mb-2 text-sm font-medium">Disabled State</h3>
        <NavLink href="/contact" disabled>
          Contact
        </NavLink>
      </div>
    </div>
  ),
};

/**
 * Interactive
 */
export const Interactive: Story = {
  args: {
    href: "/home",
    children: "Click me",
    onClick: fn(),
  },
};
