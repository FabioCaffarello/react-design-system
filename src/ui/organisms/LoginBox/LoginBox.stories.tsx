import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "storybook/test";
import LoginBox from "./LoginBox";

const meta: Meta<typeof LoginBox> = {
  title: "UI/Organisms/LoginBox",
  component: LoginBox,
  parameters: {
    actions: {
      argTypesRegex: "^on.*",
    },
  },
};

export const Primary: StoryObj<typeof LoginBox> = {
  args: {
    className: "w-[300px]",
    onSubmit: fn().mockName("onSubmit"),
  },
};

export default meta;
