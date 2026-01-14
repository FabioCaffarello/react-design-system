import type { StorybookConfig } from "@storybook/react-vite";

const config: StorybookConfig = {
  stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
  addons: [
    "@chromatic-com/storybook", // Visual regression testing with Chromatic
    "@storybook/addon-docs", // Documentation support (includes Controls, Actions, Viewport, and Interactions in Storybook 10)
    "@storybook/addon-a11y", // Accessibility testing
    "@storybook/addon-vitest", // Vitest integration
    "@storybook/addon-mcp", // Model Context Protocol for AI agents
    // Note: @storybook/addon-interactions is now part of @storybook/addon-docs in Storybook 10
    // Additional addons (install if needed):
    // "@storybook/addon-measure", // Measure elements (install: npm install -D @storybook/addon-measure)
    // "@storybook/addon-outline", // Visualize outlines (install: npm install -D @storybook/addon-outline)
    // "@storybook/addon-designs", // Integrate Figma designs (install: npm install -D @storybook/addon-designs)
    // "@storybook/addon-coverage", // Code coverage (install: npm install -D @storybook/addon-coverage)
    // "storybook-addon-performance", // Performance metrics (install: npm install -D storybook-addon-performance)
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

