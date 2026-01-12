import type { StorybookConfig } from "@storybook/react-vite";

const config: StorybookConfig = {
  stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
  addons: [
    "@chromatic-com/storybook", // Documentation and MDX support
    "@storybook/addon-docs", // Documentation support
    "@storybook/addon-a11y", // Accessibility testing
    "@storybook/addon-vitest", // Vitest integration
    "@storybook/addon-mcp", // Model Context Protocol for AI agents
    // Note: Controls, Actions, Viewport are included in addon-docs for Storybook 10
  ],
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
  core: {
    disableTelemetry: true,
  },
  features: {
    buildStoriesJson: true,
  },
};
export default config;

