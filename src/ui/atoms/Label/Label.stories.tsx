import type { Meta, StoryObj } from "@storybook/react";
import Label from "./Label";
import { Input } from "../../atoms";

const meta: Meta<typeof Label> = {
  title: "Atoms/Label",
  component: Label,
  parameters: {
    docs: {
      description: {
        component: "A styled label component for form inputs. Supports required and optional variants.",
      },
    },
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "required", "optional"],
      description: "Visual variant of the label",
    },
    htmlFor: {
      control: "text",
      description: "ID of the associated input element",
    },
  },
};

export const Default: StoryObj<typeof Label> = {
  args: {
    children: "Email Address",
    htmlFor: "email",
  },
  render: (args) => (
    <div className="space-y-2">
      <Label {...args} />
      <Input id="email" placeholder="Enter email..." />
    </div>
  ),
};

export const Required: StoryObj<typeof Label> = {
  args: {
    children: "Email Address",
    htmlFor: "email-required",
    variant: "required",
  },
  render: (args) => (
    <div className="space-y-2">
      <Label {...args} />
      <Input id="email-required" placeholder="Enter email..." required />
    </div>
  ),
};

export const Optional: StoryObj<typeof Label> = {
  args: {
    children: "Middle Name",
    htmlFor: "middle-name",
    variant: "optional",
  },
  render: (args) => (
    <div className="space-y-2">
      <Label {...args} />
      <Input id="middle-name" placeholder="Enter middle name..." />
    </div>
  ),
};

export const WithInput: StoryObj<typeof Label> = {
  render: () => (
    <div className="space-y-4 max-w-md">
      <div className="space-y-2">
        <Label htmlFor="name" variant="required">
          Full Name
        </Label>
        <Input id="name" placeholder="Enter your name..." />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email" variant="required">
          Email
        </Label>
        <Input id="email" type="email" placeholder="Enter your email..." />
      </div>
      <div className="space-y-2">
        <Label htmlFor="phone" variant="optional">
          Phone Number
        </Label>
        <Input id="phone" type="tel" placeholder="Enter your phone..." />
      </div>
    </div>
  ),
};

export default meta;
