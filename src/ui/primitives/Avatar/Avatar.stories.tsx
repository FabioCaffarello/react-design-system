import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import Avatar from "./Avatar";
import { AvatarGroup } from "./AvatarGroup";

const meta: Meta<typeof Avatar> = {
  title: "Primitives/Avatar",
  component: Avatar,
  parameters: {
    docs: {
      description: {
        component: `
## Avatar

A versatile avatar component for displaying user profile images or initials. Supports fallback display when image fails to load.

### Size scale

| size | px  | Use case                          |
|------|-----|-----------------------------------|
| xs   | 24  | Tight inline / notification dot   |
| sm   | 32  | Comment thread, compact row       |
| md   | 40  | Default — card header, form row   |
| lg   | 48  | Expanded card, sidebar profile    |
| xl   | 64  | Detail-page section header        |
| 2xl  | 96  | Hero profile (PerfilHeader)       |
| 3xl  | 112 | Full-bleed hero cover             |

### Lazy loading

Pass \`loading="lazy"\` when rendering many avatars in a list (e.g. 24 parliamentary cards per page). The browser defers off-screen image loads, improving LCP. The default is \`"eager"\` for backward compatibility.

### Events

| Event | Description | Parameters | When Fired |
|-------|-------------|------------|------------|
| \`onError\` | Erro ao carregar imagem | \`(event: SyntheticEvent) => void\` | Quando a imagem falha ao carregar |
| \`onLoad\` | Imagem carregada | \`(event: SyntheticEvent) => void\` | Quando a imagem é carregada com sucesso |
        `,
      },
    },
  },
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
      options: ["xs", "sm", "md", "lg", "xl", "2xl", "3xl"],
      description: "Size of the avatar",
    },
    variant: {
      control: "select",
      options: ["circle", "square", "rounded"],
      description: "Shape variant of the avatar",
    },
    loading: {
      control: "select",
      options: ["eager", "lazy"],
      description:
        'Native img loading behaviour. Use "lazy" in listings to defer off-screen images.',
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

// ─────────────────────────────────────────────────────────────────────────────
// Size scale
// ─────────────────────────────────────────────────────────────────────────────

export const Sizes: Story = {
  render: () => (
    <div className="flex items-end gap-4">
      <div className="flex flex-col items-center gap-2">
        <Avatar fallback="XS" size="xs" alt="Extra small" />
        <span className="text-fg-tertiary text-xs">xs · 24px</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Avatar fallback="SM" size="sm" alt="Small" />
        <span className="text-fg-tertiary text-xs">sm · 32px</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Avatar fallback="MD" size="md" alt="Medium" />
        <span className="text-fg-tertiary text-xs">md · 40px</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Avatar fallback="LG" size="lg" alt="Large" />
        <span className="text-fg-tertiary text-xs">lg · 48px</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Avatar fallback="XL" size="xl" alt="Extra large" />
        <span className="text-fg-tertiary text-xs">xl · 64px</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Avatar fallback="2X" size="2xl" alt="2x large" />
        <span className="text-fg-tertiary text-xs">2xl · 96px</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Avatar fallback="3X" size="3xl" alt="3x large" />
        <span className="text-fg-tertiary text-xs">3xl · 112px</span>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Full size scale from `xs` (24 px) to `3xl` (112 px). `2xl` and `3xl` are the hero sizes for profile headers.",
      },
    },
  },
};

export const HeroSizes: Story = {
  name: "Hero sizes — 2xl / 3xl (profile headers)",
  render: () => (
    <div className="flex items-start gap-8">
      <div className="flex flex-col items-center gap-3">
        <Avatar
          src="https://i.pravatar.cc/150?img=12"
          alt="Dep. Maria Silva"
          fallback="MS"
          size="2xl"
        />
        <div className="text-center">
          <p className="text-fg-primary text-sm font-medium">
            Dep. Maria Silva
          </p>
          <p className="text-fg-tertiary text-xs">2xl · 96 px</p>
        </div>
      </div>
      <div className="flex flex-col items-center gap-3">
        <Avatar
          src="https://i.pravatar.cc/150?img=33"
          alt="Sen. João Santos"
          fallback="JS"
          size="3xl"
        />
        <div className="text-center">
          <p className="text-fg-primary text-sm font-medium">
            Sen. João Santos
          </p>
          <p className="text-fg-tertiary text-xs">3xl · 112 px</p>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Hero-profile sizes (`2xl` = 96 px, `3xl` = 112 px) — designed for `PerfilHeader` and similar full-bleed identity sections where the parliamentary photo needs to be large and prominent. Matches brasil-a-vera's `size-24` / `sm:size-28` override.",
      },
    },
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// Variants
// ─────────────────────────────────────────────────────────────────────────────

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

// ─────────────────────────────────────────────────────────────────────────────
// Fallback
// ─────────────────────────────────────────────────────────────────────────────

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
    smoke: {
      allowConsoleErrors: ["net::ERR_NAME_NOT_RESOLVED"],
      reason:
        "Story demonstrates the Avatar fallback when image URL fails to load. Network error is expected and validated visually via the initials fallback.",
    },
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// Lazy loading
// ─────────────────────────────────────────────────────────────────────────────

export const LazyLoading: Story = {
  name: "loading='lazy' — listing optimisation",
  render: () => (
    <div className="space-y-4">
      <p className="text-fg-secondary text-sm">
        Simulated listing — 12 avatars that would include off-screen items in
        production. All use <code>loading="lazy"</code> so the browser defers
        images below the viewport.
      </p>
      <div className="flex flex-wrap gap-3">
        {Array.from({ length: 12 }, (_, i) => (
          <Avatar
            key={i}
            src={`https://i.pravatar.cc/150?img=${i + 1}`}
            alt={`Parlamentar ${i + 1}`}
            fallback={`P${i + 1}`}
            size="md"
            loading="lazy"
          />
        ))}
      </div>
      <p className="text-fg-tertiary text-xs">
        Inspect the network tab: images near the viewport load immediately;
        others are deferred until scrolled into view.
      </p>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: `
Use \`loading="lazy"\` when rendering many avatars in a paginated listing (e.g. 24 parliamentary cards). The browser defers network requests for images outside the viewport, significantly improving **LCP** and reducing data usage on slow connections.

The default is \`"eager"\` (browser native default) to preserve backward compatibility — change only on listings, not on hero avatars above the fold.

\`\`\`tsx
// Listing row — defer off-screen images
<Avatar src={parlamentar.foto} alt={parlamentar.nome} loading="lazy" />

// Hero header — keep eager (above the fold)
<Avatar src={parlamentar.foto} alt={parlamentar.nome} size="2xl" />
\`\`\`
        `,
      },
    },
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// AvatarGroup
// ─────────────────────────────────────────────────────────────────────────────

export const Group: Story = {
  render: () => (
    <div className="space-y-4">
      <div>
        <p className="text-sm text-fg-secondary mb-2">
          Small group (3 avatars)
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
        </AvatarGroup>
      </div>
      <div>
        <p className="text-sm text-fg-secondary mb-2">
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
        <p className="text-sm text-fg-secondary mb-2">
          Group with fallbacks only
        </p>
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
        <p className="text-sm text-fg-secondary mb-2">No spacing</p>
        <AvatarGroup max={5} spacing="none">
          <Avatar fallback="1" />
          <Avatar fallback="2" />
          <Avatar fallback="3" />
        </AvatarGroup>
      </div>
      <div>
        <p className="text-sm text-fg-secondary mb-2">Small spacing</p>
        <AvatarGroup max={5} spacing="sm">
          <Avatar fallback="1" />
          <Avatar fallback="2" />
          <Avatar fallback="3" />
        </AvatarGroup>
      </div>
      <div>
        <p className="text-sm text-fg-secondary mb-2">
          Medium spacing (default)
        </p>
        <AvatarGroup max={5} spacing="md">
          <Avatar fallback="1" />
          <Avatar fallback="2" />
          <Avatar fallback="3" />
        </AvatarGroup>
      </div>
      <div>
        <p className="text-sm text-fg-secondary mb-2">Large spacing</p>
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

// ─────────────────────────────────────────────────────────────────────────────
// Event Stories
// ─────────────────────────────────────────────────────────────────────────────

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
        <p className="text-sm text-fg-secondary">
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
        <p className="text-sm text-fg-tertiary">
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

// ─────────────────────────────────────────────────────────────────────────────
// State stories
// ─────────────────────────────────────────────────────────────────────────────

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
