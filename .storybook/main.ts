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
    
    // Ensure proper handling of client directives (Next.js compatibility)
    // Vite will ignore 'use client' directives, but we need to ensure they don't break module resolution
    config.esbuild = config.esbuild || {};
    config.esbuild.jsx = 'automatic';
    config.esbuild.legalComments = 'none';
    
    // Better handling of dynamic imports
    config.build = config.build || {};
    config.build.rollupOptions = config.build.rollupOptions || {};
    config.build.rollupOptions.output = config.build.rollupOptions.output || {};
    
    // Improve chunk splitting for better dynamic import handling
    if (Array.isArray(config.build.rollupOptions.output)) {
      config.build.rollupOptions.output = config.build.rollupOptions.output.map((output) => ({
        ...output,
        manualChunks: undefined, // Let Vite handle chunking automatically
      }));
    } else if (config.build.rollupOptions.output) {
      config.build.rollupOptions.output.manualChunks = undefined;
    }
    
    // Add plugin to handle 'use client' directives
    const plugins = config.plugins || [];
    const existingPluginIndex = plugins.findIndex(
      (p: any) => p && p.name === 'vite-plugin-client-directive'
    );
    
    // If there's no existing plugin, add a simple transform to strip 'use client'
    if (existingPluginIndex === -1) {
      plugins.push({
        name: 'strip-client-directive',
        transform(code: string, id: string) {
          // Only process .tsx and .ts files
          if (id.match(/\.(tsx?|jsx?)$/)) {
            // Remove 'use client' directive if present
            const cleanedCode = code.replace(/^['"]use client['"];?\s*/gm, '');
            if (cleanedCode !== code) {
              return {
                code: cleanedCode,
                map: null,
              };
            }
          }
          return null;
        },
      });
      config.plugins = plugins;
    }
    
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

