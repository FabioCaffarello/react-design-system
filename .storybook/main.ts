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
  async viteFinal(config, { configType }) {
    // Ensure proper module resolution
    config.resolve = config.resolve || {};
    config.resolve.dedupe = config.resolve.dedupe || [];
    config.resolve.dedupe.push('react', 'react-dom');
    
    // Optimize dependencies
    config.optimizeDeps = config.optimizeDeps || {};
    config.optimizeDeps.include = config.optimizeDeps.include || [];
    config.optimizeDeps.include.push(
      'react',
      'react-dom',
      'lucide-react'
    );
    
    // Improve module resolution for complex imports
    config.resolve.alias = config.resolve.alias || {};
    
    // Ensure proper handling of client directives
    config.esbuild = config.esbuild || {};
    config.esbuild.jsx = 'automatic';
    
    return config;
  },
  core: {
    disableTelemetry: true,
  },
  features: {
    buildStoriesJson: true,
  },
};
export default config;

