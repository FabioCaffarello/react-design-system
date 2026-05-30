/**
 * PageHeader Stories
 *
 * Storybook stories for the PageHeader component.
 */

import type { Meta, StoryObj } from "@storybook/react-vite";
import { PageHeader } from "./PageHeader";
import { Button } from "../../primitives/Button/Button";
import { Plus, Edit, Trash2 } from "lucide-react";

const meta: Meta<typeof PageHeader> = {
  title: "Components/PageHeader",
  component: PageHeader,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: `
## PageHeader

Page header component with title, description, breadcrumb, and actions.

### Features

- **Title**: Required page title
- **Description**: Optional page description
- **Breadcrumb**: Optional breadcrumb navigation
- **Actions**: Optional action buttons or content
- **Variants**: default, compact

### Usage

\`\`\`tsx
<PageHeader
  title="Page Title"
  description="Page description"
  breadcrumb={[
    { label: 'Home', href: '/' },
    { label: 'Page', href: '/page' },
  ]}
  actions={<Button>Action</Button>}
/>
\`\`\`
        `,
      },
    },
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "compact"],
      description: "Visual variant of the PageHeader",
    },
  },
};

export default meta;
type Story = StoryObj<typeof PageHeader>;

/**
 * Default PageHeader
 */
export const Default: Story = {
  args: {
    title: "Page Title",
    description:
      "This is a page description that provides context about the page content.",
  },
};

/**
 * With Breadcrumb
 */
export const WithBreadcrumb: Story = {
  args: {
    title: "Page Title",
    description: "Page with breadcrumb navigation",
    breadcrumb: [
      { label: "Home", href: "/" },
      { label: "Section", href: "/section" },
      { label: "Page Title" },
    ],
  },
};

/**
 * With Actions
 */
export const WithActions: Story = {
  args: {
    title: "Page Title",
    description: "Page with action buttons",
    actions: (
      <>
        <Button variant="outline">Cancel</Button>
        <Button variant="primary">Save</Button>
      </>
    ),
  },
};

/**
 * Complete Example
 */
export const Complete: Story = {
  args: {
    title: "Edit User",
    description: "Update user information and settings",
    breadcrumb: [
      { label: "Home", href: "/" },
      { label: "Users", href: "/users" },
      { label: "Edit User" },
    ],
    actions: (
      <>
        <Button variant="outline" icon={<Trash2 />}>
          Delete
        </Button>
        <Button variant="primary" icon={<Plus />}>
          Save Changes
        </Button>
      </>
    ),
  },
};

/**
 * Compact Variant
 */
export const Compact: Story = {
  args: {
    title: "Compact Page Header",
    description: "This is a compact variant with less spacing",
    variant: "compact",
  },
};

/**
 * Without Description
 */
export const WithoutDescription: Story = {
  args: {
    title: "Simple Page Title",
    actions: <Button variant="primary">Action</Button>,
  },
};

/**
 * Without Actions
 */
export const WithoutActions: Story = {
  args: {
    title: "Page Title",
    description: "Page without action buttons",
    breadcrumb: [{ label: "Home", href: "/" }, { label: "Page" }],
  },
};

/**
 * Minimal
 */
export const Minimal: Story = {
  args: {
    title: "Minimal Page Header",
  },
};

/**
 * With Multiple Actions
 */
export const WithMultipleActions: Story = {
  args: {
    title: "Document Editor",
    description: "Edit and manage your document",
    actions: (
      <>
        <Button variant="ghost" icon={<Edit />}>
          Edit
        </Button>
        <Button variant="ghost" icon={<Trash2 />}>
          Delete
        </Button>
        <Button variant="primary" icon={<Plus />}>
          New
        </Button>
      </>
    ),
  },
};
