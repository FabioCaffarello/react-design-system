import type { Meta, StoryObj } from "@storybook/react";
import BoxWrapper from "./BoxWrapper";

const meta: Meta<typeof BoxWrapper> = {
  title: "Atoms/BoxWrapper",
  component: BoxWrapper,
};

export const Primary: StoryObj<typeof BoxWrapper> = {
  args: {
    children: "Hello from Storybook",
  },
};

export default meta;
