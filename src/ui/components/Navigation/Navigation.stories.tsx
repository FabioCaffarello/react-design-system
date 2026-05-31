/**
 * Navigation Stories
 *
 * Storybook stories for the Navigation component.
 */

import type { Meta, StoryObj } from "@storybook/react-vite";
import { Navigation } from "./Navigation";
import type { NavItem } from "./types";
import { Home, Settings, User, FileText, Bell } from "lucide-react";

const meta: Meta<typeof Navigation> = {
  title: "Components/Navigation",
  component: Navigation,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
## Navigation

Navigation component that uses NavLink internally.
Supports horizontal and vertical orientations, variants, and icons.

### Features

- **Uses NavLink**: Composes NavLink internally
- **Orientations**: horizontal, vertical
- **Variants**: default, pills, tabs
- **Icons**: Optional icons per item
- **Active State**: Automatic active state handling
- **Bare Mode**: Use \`bare\` prop when used inside Header.Navigation to avoid nested nav elements
- **Active State**: Auto-detect active items via \`pathname\` prop (Next.js usePathname)

### Usage

\`\`\`tsx
<Navigation
  items={[
    { href: '/home', label: 'Home' },
    { href: '/about', label: 'About' },
  ]}
  orientation="horizontal"
  variant="default"
/>

// With auto-detection (Next.js)
import { usePathname } from 'next/navigation';

const pathname = usePathname();
<Navigation items={items} pathname={pathname} />

// Inside Header.Navigation (use bare prop)
<Header.Navigation>
  <Navigation items={items} variant="tabs" bare pathname={pathname} />
</Header.Navigation>
\`\`\`
        `,
      },
    },
  },
  argTypes: {
    orientation: {
      control: "select",
      options: ["horizontal", "vertical"],
      description: "Orientation of the navigation",
    },
    variant: {
      control: "select",
      options: ["default", "pills", "tabs"],
      description: "Visual variant of the navigation",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Navigation>;

const basicItems: NavItem[] = [
  { href: "/home", label: "Home", active: true },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

/**
 * Default Navigation
 */
export const Default: Story = {
  args: {
    items: basicItems,
    orientation: "horizontal",
    variant: "default",
  },
};

/**
 * Horizontal Navigation
 */
export const Horizontal: Story = {
  args: {
    items: basicItems,
    orientation: "horizontal",
  },
};

/**
 * Vertical Navigation
 */
export const Vertical: Story = {
  args: {
    items: basicItems,
    orientation: "vertical",
  },
};

/**
 * Variants
 */
export const Variants: Story = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h3 className="mb-2 text-sm font-medium">Default</h3>
        <Navigation items={basicItems} variant="default" />
      </div>
      <div>
        <h3 className="mb-2 text-sm font-medium">Pills</h3>
        <Navigation items={basicItems} variant="pills" />
      </div>
      <div>
        <h3 className="mb-2 text-sm font-medium">Tabs</h3>
        <Navigation items={basicItems} variant="tabs" />
      </div>
    </div>
  ),
};

/**
 * With Icons
 */
export const WithIcons: Story = {
  args: {
    items: [
      {
        href: "/home",
        label: "Home",
        icon: <Home className="h-4 w-4" />,
        active: true,
      },
      {
        href: "/settings",
        label: "Settings",
        icon: <Settings className="h-4 w-4" />,
      },
      {
        href: "/profile",
        label: "Profile",
        icon: <User className="h-4 w-4" />,
      },
      { href: "/docs", label: "Docs", icon: <FileText className="h-4 w-4" /> },
    ],
  },
};

/**
 * With Disabled Items
 */
export const WithDisabled: Story = {
  args: {
    items: [
      { href: "/home", label: "Home", active: true },
      { href: "/about", label: "About" },
      { href: "/contact", label: "Contact", disabled: true },
    ],
  },
};

/**
 * Vertical with Icons
 */
export const VerticalWithIcons: Story = {
  args: {
    items: [
      {
        href: "/home",
        label: "Home",
        icon: <Home className="h-4 w-4" />,
        active: true,
      },
      {
        href: "/settings",
        label: "Settings",
        icon: <Settings className="h-4 w-4" />,
      },
      {
        href: "/notifications",
        label: "Notifications",
        icon: <Bell className="h-4 w-4" />,
      },
    ],
    orientation: "vertical",
  },
};

/**
 * Complete Example
 */
export const Complete: Story = {
  args: {
    items: [
      {
        href: "/home",
        label: "Home",
        icon: <Home className="h-4 w-4" />,
        active: true,
      },
      {
        href: "/about",
        label: "About",
        icon: <FileText className="h-4 w-4" />,
      },
      {
        href: "/settings",
        label: "Settings",
        icon: <Settings className="h-4 w-4" />,
      },
      { href: "/contact", label: "Contact", disabled: true },
    ],
    orientation: "horizontal",
    variant: "pills",
  },
};

/**
 * With Badges
 */
export const WithBadges: Story = {
  args: {
    items: [
      {
        href: "/notifications",
        label: "Notifications",
        icon: <Bell className="h-4 w-4" />,
        badge: (
          <span className="ml-2 rounded-full bg-status-neutral text-fg-inverse text-xs px-2 py-0.5">
            3
          </span>
        ),
      },
      {
        href: "/messages",
        label: "Messages",
        icon: <FileText className="h-4 w-4" />,
        badge: (
          <span className="ml-2 rounded-full bg-status-neutral text-fg-inverse text-xs px-2 py-0.5">
            12
          </span>
        ),
      },
    ],
  },
};

/**
 * Vertical Pills
 */
export const VerticalPills: Story = {
  args: {
    items: [
      {
        href: "/home",
        label: "Home",
        icon: <Home className="h-4 w-4" />,
        active: true,
      },
      {
        href: "/about",
        label: "About",
        icon: <FileText className="h-4 w-4" />,
      },
      {
        href: "/settings",
        label: "Settings",
        icon: <Settings className="h-4 w-4" />,
      },
    ],
    orientation: "vertical",
    variant: "pills",
  },
};

/**
 * Vertical Tabs
 */
export const VerticalTabs: Story = {
  args: {
    items: [
      {
        href: "/home",
        label: "Home",
        icon: <Home className="h-4 w-4" />,
        active: true,
      },
      {
        href: "/about",
        label: "About",
        icon: <FileText className="h-4 w-4" />,
      },
      {
        href: "/settings",
        label: "Settings",
        icon: <Settings className="h-4 w-4" />,
      },
    ],
    orientation: "vertical",
    variant: "tabs",
  },
};

/**
 * Bare Mode Example
 *
 * Example showing Navigation with bare prop to avoid nested nav elements
 * when used inside Header.Navigation.
 */
export const BareMode: Story = {
  args: {
    items: basicItems,
    variant: "tabs",
    bare: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          "Use `bare` prop when Navigation is used inside Header.Navigation to avoid nested nav elements.",
      },
    },
  },
};
