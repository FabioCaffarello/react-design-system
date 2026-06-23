import type { Meta, StoryObj } from "@storybook/react-vite";
import AvatarBase from "./AvatarBase";

const meta: Meta<typeof AvatarBase> = {
  title: "Primitives/AvatarBase",
  component: AvatarBase,
  parameters: {
    docs: {
      description: {
        component: `
## AvatarBase

The **server-safe presentational core** of \`Avatar\` (issue #250). It holds no React client state (\`useState\` / hooks of any kind), so it is importable from \`@fabio.caffarello/react-design-system/server\` and renders inside React Server Components and zero-JS routes.

### When to use AvatarBase vs Avatar

| Scenario | Use |
|---|---|
| Server Component list, \`src\` is \`null\` when no photo | **AvatarBase** — initials rendered server-side, zero-JS |
| Interactive client island (profile drawer, modal) | **Avatar** — graceful \`onError\` swap to initials |
| Any route where "+0 KB JS" is a hard constraint | **AvatarBase** |

### Trade-off

When a \`src\` is provided but the image 404s, \`AvatarBase\` shows the browser's native broken-image — there is no graceful fallback swap. This is intentional: the swap requires \`onError\` state which demands \`"use client"\`. If you need the fallback on error, use \`Avatar\`.
        `,
      },
    },
  },
  argTypes: {
    size: {
      control: "select",
      options: ["xs", "sm", "md", "lg", "xl", "2xl", "3xl"],
    },
    variant: {
      control: "select",
      options: ["circle", "square", "rounded"],
    },
    loading: {
      control: "select",
      options: ["eager", "lazy"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof AvatarBase>;

// ── Core use-case: fallback rendered server-side ───────────────────────────

export const InitialsFallback: Story = {
  name: "Initials fallback (no src)",
  args: {
    fallback: "João Silva",
    alt: "João Silva",
    size: "md",
  },
};

export const WithImage: Story = {
  name: "With image src",
  args: {
    src: "https://i.pravatar.cc/150?img=3",
    alt: "Parlamentar",
    size: "md",
  },
};

export const NoFallback: Story = {
  name: "No fallback (shows ?)",
  args: {
    alt: "Unknown user",
    size: "md",
  },
};

// ── Size scale ─────────────────────────────────────────────────────────────

export const Sizes: Story = {
  render: () => (
    <div className="flex items-end gap-4">
      {(["xs", "sm", "md", "lg", "xl", "2xl", "3xl"] as const).map((size) => (
        <div key={size} className="flex flex-col items-center gap-2">
          <AvatarBase fallback="JS" alt={`Avatar ${size}`} size={size} />
          <span className="text-fg-secondary text-xs">{size}</span>
        </div>
      ))}
    </div>
  ),
};

// ── Variants ───────────────────────────────────────────────────────────────

export const Variants: Story = {
  render: () => (
    <div className="flex items-center gap-6">
      {(["circle", "square", "rounded"] as const).map((variant) => (
        <div key={variant} className="flex flex-col items-center gap-2">
          <AvatarBase
            fallback="FC"
            alt={`Avatar ${variant}`}
            size="lg"
            variant={variant}
          />
          <span className="text-fg-secondary text-xs">{variant}</span>
        </div>
      ))}
    </div>
  ),
};

// ── Server-rendered list simulation ───────────────────────────────────────

export const ZeroJsList: Story = {
  name: "Zero-JS list (server-rendered)",
  render: () => (
    <ul className="flex flex-col gap-3">
      {[
        { name: "Ana Souza", src: "https://i.pravatar.cc/150?img=1" },
        { name: "Bruno Lima", src: null },
        { name: "Carla Neves", src: "https://i.pravatar.cc/150?img=5" },
        { name: "Daniel Costa", src: null },
        { name: "Elisa Prado", src: "https://i.pravatar.cc/150?img=9" },
      ].map(({ name, src }) => (
        <li key={name} className="flex items-center gap-3">
          <AvatarBase
            src={src ?? undefined}
            fallback={name}
            alt={name}
            size="sm"
            loading="lazy"
          />
          <span className="text-fg-primary text-sm">{name}</span>
        </li>
      ))}
    </ul>
  ),
};
