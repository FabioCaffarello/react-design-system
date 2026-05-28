import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import Avatar from "./Avatar";
import { AvatarGroup } from "./AvatarGroup";

const meta: Meta<typeof Avatar> = {
  title: "Atoms/Avatar",
  component: Avatar,
  parameters: {
    docs: {
      description: {
        component: `
## Avatar

A versatile avatar component for displaying user profile images or initials. Supports fallback display when image fails to load.

### Events

| Event | Description | Parameters | When Fired |
|-------|-------------|------------|------------|
| \`onError\` | Erro ao carregar imagem | \`(event: SyntheticEvent) => void\` | Quando a imagem falha ao carregar |
| \`onLoad\` | Imagem carregada | \`(event: SyntheticEvent) => void\` | Quando a imagem é carregada com sucesso |

### States

| State | Description | How to Activate | Visual |
|-------|-------------|-----------------|--------|
| \`with-image\` | Com imagem | \`src\` prop fornecida | Avatar com imagem |
| \`with-fallback\` | Com fallback | Sem \`src\` ou erro ao carregar | Avatar com iniciais ou fallback |
| \`circle\` | Formato circular | \`variant="circle"\` | Avatar circular |
| \`rounded\` | Formato arredondado | \`variant="rounded"\` | Avatar com bordas arredondadas |
| \`square\` | Formato quadrado | \`variant="square"\` | Avatar quadrado |
        `,
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    src: {
      control: "text",
      description: "Image source URL",
    },
    alt: {
      control: "text",
      description: "Alt text for the image",
    },
    fallback: {
      control: "text",
      description: "Fallback text or element when image is not available",
    },
    size: {
      control: "select",
      options: ["xs", "sm", "md", "lg", "xl"],
      description: "Size of the avatar",
    },
    variant: {
      control: "select",
      options: ["circle", "square", "rounded"],
      description: "Shape variant of the avatar",
    },
    onError: {
      description: "Callback fired when the image fails to load",
      action: "onError",
      table: {
        type: { summary: "(event: SyntheticEvent) => void" },
        category: "Events",
      },
    },
    onLoad: {
      description: "Callback fired when the image loads successfully",
      action: "onLoad",
      table: {
        type: { summary: "(event: SyntheticEvent) => void" },
        category: "Events",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Avatar>;

export const Default: Story = {
  args: {
    fallback: "JD",
    alt: "John Doe",
    size: "md",
  },
};

export const WithImage: Story = {
  args: {
    src: "https://i.pravatar.cc/150?img=1",
    alt: "User avatar",
    fallback: "JD",
    size: "md",
  },
};

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Avatar fallback="XS" size="xs" alt="Extra small" />
      <Avatar fallback="SM" size="sm" alt="Small" />
      <Avatar fallback="MD" size="md" alt="Medium" />
      <Avatar fallback="LG" size="lg" alt="Large" />
      <Avatar fallback="XL" size="xl" alt="Extra large" />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "All available sizes of the avatar component.",
      },
    },
  },
};

export const Variants: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Avatar fallback="C" variant="circle" alt="Circle" />
      <Avatar fallback="R" variant="rounded" alt="Rounded" />
      <Avatar fallback="S" variant="square" alt="Square" />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "Different shape variants: circle, rounded, and square.",
      },
    },
  },
};

export const WithFallback: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Avatar fallback="JD" alt="John Doe" />
      <Avatar fallback="AB" alt="Alice Brown" />
      <Avatar fallback="CD" alt="Charlie Davis" />
      <Avatar fallback="EF" alt="Emma Foster" />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "Avatars with fallback initials when no image is provided.",
      },
    },
  },
};

export const ImageError: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Avatar
        src="https://invalid-url.com/image.jpg"
        fallback="JD"
        alt="John Doe"
      />
      <Avatar src="" fallback="AB" alt="Alice Brown" />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Avatars automatically fall back to initials when image fails to load or is not provided.",
      },
    },
  },
};

export const Group: Story = {
  render: () => (
    <div className="space-y-4">
      <div>
        <p className="text-sm text-gray-600 mb-2">Small group (3 avatars)</p>
        <AvatarGroup max={3} size="md">
          <Avatar
            src="https://i.pravatar.cc/150?img=1"
            alt="User 1"
            fallback="U1"
          />
          <Avatar
            src="https://i.pravatar.cc/150?img=2"
            alt="User 2"
            fallback="U2"
          />
          <Avatar
            src="https://i.pravatar.cc/150?img=3"
            alt="User 3"
            fallback="U3"
          />
        </AvatarGroup>
      </div>
      <div>
        <p className="text-sm text-gray-600 mb-2">
          Large group with overflow (max 3)
        </p>
        <AvatarGroup max={3} size="md">
          <Avatar
            src="https://i.pravatar.cc/150?img=1"
            alt="User 1"
            fallback="U1"
          />
          <Avatar
            src="https://i.pravatar.cc/150?img=2"
            alt="User 2"
            fallback="U2"
          />
          <Avatar
            src="https://i.pravatar.cc/150?img=3"
            alt="User 3"
            fallback="U3"
          />
          <Avatar
            src="https://i.pravatar.cc/150?img=4"
            alt="User 4"
            fallback="U4"
          />
          <Avatar
            src="https://i.pravatar.cc/150?img=5"
            alt="User 5"
            fallback="U5"
          />
        </AvatarGroup>
      </div>
      <div>
        <p className="text-sm text-gray-600 mb-2">Group with fallbacks only</p>
        <AvatarGroup max={4} size="md">
          <Avatar fallback="JD" alt="John Doe" />
          <Avatar fallback="AB" alt="Alice Brown" />
          <Avatar fallback="CD" alt="Charlie Davis" />
          <Avatar fallback="EF" alt="Emma Foster" />
          <Avatar fallback="GH" alt="George Hill" />
        </AvatarGroup>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'AvatarGroup displays multiple avatars with automatic overflow handling. Shows a "+N" avatar when there are more than the max number.',
      },
    },
  },
};

export const GroupSpacing: Story = {
  render: () => (
    <div className="space-y-4">
      <div>
        <p className="text-sm text-gray-600 mb-2">No spacing</p>
        <AvatarGroup max={5} spacing="none">
          <Avatar fallback="1" />
          <Avatar fallback="2" />
          <Avatar fallback="3" />
        </AvatarGroup>
      </div>
      <div>
        <p className="text-sm text-gray-600 mb-2">Small spacing</p>
        <AvatarGroup max={5} spacing="sm">
          <Avatar fallback="1" />
          <Avatar fallback="2" />
          <Avatar fallback="3" />
        </AvatarGroup>
      </div>
      <div>
        <p className="text-sm text-gray-600 mb-2">Medium spacing (default)</p>
        <AvatarGroup max={5} spacing="md">
          <Avatar fallback="1" />
          <Avatar fallback="2" />
          <Avatar fallback="3" />
        </AvatarGroup>
      </div>
      <div>
        <p className="text-sm text-gray-600 mb-2">Large spacing</p>
        <AvatarGroup max={5} spacing="lg">
          <Avatar fallback="1" />
          <Avatar fallback="2" />
          <Avatar fallback="3" />
        </AvatarGroup>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "Different spacing options for AvatarGroup.",
      },
    },
  },
};

// Event Stories
export const WithEvents: Story = {
  render: () => {
    const handleError = fn(
      (_e: React.SyntheticEvent<HTMLImageElement, Event>) => {
        console.log("Image failed to load");
      },
    );

    const handleLoad = fn(
      (_e: React.SyntheticEvent<HTMLImageElement, Event>) => {
        console.log("Image loaded successfully");
      },
    );

    return (
      <div className="space-y-4">
        <p className="text-sm text-gray-600">
          The avatar below will try to load an image. Check the Actions panel to
          see events being fired.
        </p>
        <Avatar
          src="https://i.pravatar.cc/150?img=1"
          alt="User avatar"
          fallback="JD"
          onError={handleError}
          onLoad={handleLoad}
        />
        <p className="text-sm text-gray-500">
          Try changing the src to an invalid URL to trigger onError.
        </p>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          "Demonstrates avatar events. Check the Actions panel to see onLoad and onError events being logged.",
      },
    },
  },
};

// State Stories
export const WithImageState: Story = {
  args: {
    src: "https://i.pravatar.cc/150?img=1",
    alt: "User avatar",
    fallback: "JD",
    size: "md",
  },
  parameters: {
    docs: {
      description: {
        story: "With image state - avatar displays the provided image.",
      },
    },
  },
};

export const WithFallbackState: Story = {
  args: {
    fallback: "JD",
    alt: "John Doe",
    size: "md",
  },
  parameters: {
    docs: {
      description: {
        story:
          "With fallback state - avatar displays fallback text when no image is provided.",
      },
    },
  },
};

export const CircleState: Story = {
  args: {
    fallback: "JD",
    variant: "circle",
    size: "md",
  },
  parameters: {
    docs: {
      description: {
        story: "Circle state - avatar with circular shape.",
      },
    },
  },
};

export const RoundedState: Story = {
  args: {
    fallback: "JD",
    variant: "rounded",
    size: "md",
  },
  parameters: {
    docs: {
      description: {
        story: "Rounded state - avatar with rounded corners.",
      },
    },
  },
};

export const SquareState: Story = {
  args: {
    fallback: "JD",
    variant: "square",
    size: "md",
  },
  parameters: {
    docs: {
      description: {
        story: "Square state - avatar with square shape.",
      },
    },
  },
};
