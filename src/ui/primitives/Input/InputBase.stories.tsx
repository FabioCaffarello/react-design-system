import type { Meta, StoryObj } from "@storybook/react-vite";
import { Mail, Search } from "lucide-react";
import InputBase from "./InputBase";

const meta: Meta<typeof InputBase> = {
  title: "Primitives/InputBase",
  component: InputBase,
  parameters: {
    docs: {
      description: {
        component: `
## InputBase

The **server-safe presentational core** of \`Input\` (issue #224). It holds no React client state (no \`useState\` / \`useId\` / \`useCallback\`), so it is importable from \`@fabio.caffarello/react-design-system/server\` and renders inside React Server Components and native \`<form>\`s. The interactive \`Input\` composes it, adding the password toggle, clear button, and auto-id.

Pass an \`id\` alongside \`label\` — \`InputBase\` does not auto-generate one (that would require a client hook); it dev-warns when a \`label\` is given without an \`id\`.
        `,
      },
    },
  },
  argTypes: {
    variant: { control: "select", options: ["default", "outlined", "filled"] },
    size: { control: "select", options: ["sm", "md", "lg"] },
  },
};

export default meta;
type Story = StoryObj<typeof InputBase>;

export const Default: Story = {
  args: {
    id: "ib-default",
    label: "Label",
    placeholder: "Type here…",
  },
};

export const Variants: Story = {
  render: () => (
    <div className="space-y-4 w-full max-w-sm">
      <InputBase
        id="ib-default-v"
        label="Default"
        variant="default"
        placeholder="Default variant"
      />
      <InputBase
        id="ib-outlined-v"
        label="Outlined"
        variant="outlined"
        placeholder="Outlined variant"
      />
      <InputBase
        id="ib-filled-v"
        label="Filled"
        variant="filled"
        placeholder="Filled variant"
      />
    </div>
  ),
};

export const States: Story = {
  render: () => (
    <div className="space-y-4 w-full max-w-sm">
      <InputBase
        id="ib-error"
        label="With error"
        error
        helperText="This field is required"
        defaultValue="invalid"
      />
      <InputBase
        id="ib-success"
        label="With success"
        success
        helperText="Looks good"
        defaultValue="valid@example.com"
      />
      <InputBase
        id="ib-disabled"
        label="Disabled"
        disabled
        placeholder="Cannot edit"
      />
    </div>
  ),
};

export const WithIcons: Story = {
  render: () => (
    <div className="space-y-4 w-full max-w-sm">
      <InputBase
        id="ib-left"
        label="Email"
        leftIcon={<Mail className="h-4 w-4" />}
        placeholder="you@example.com"
      />
      <InputBase
        id="ib-right"
        label="Search"
        rightIcon={<Search className="h-4 w-4" />}
        placeholder="Search…"
      />
    </div>
  ),
};

export const NativeForm: Story = {
  render: () => (
    <form method="get" action="#" className="space-y-4 w-full max-w-sm">
      <InputBase
        id="ib-q"
        name="q"
        label="Search proposals"
        placeholder="Tema…"
      />
      <button
        type="submit"
        className="px-3 py-1 text-sm bg-surface-brand-strong text-fg-inverse rounded"
      >
        Filtrar
      </button>
    </form>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "The server-safe use case: a native GET form with no client state. `InputBase` renders a plain styled `<input name>` that submits with the form — importable from `./server` for RSC pages.",
      },
    },
  },
};
