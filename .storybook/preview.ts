import type { Preview } from "@storybook/react-vite";
import React from "react";
import "../src/style.css";

const preview: Preview = {
  parameters: {
    // Controls configuration
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
      expanded: true,
      sort: "requiredFirst",
    },

    // Accessibility configuration
    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: "todo",
      config: {
        rules: [
          {
            id: "color-contrast",
            enabled: true,
          },
          {
            id: "keyboard-navigation",
            enabled: true,
          },
        ],
      },
    },

    // Viewport configuration for responsive testing
    viewport: {
      viewports: {
        mobile: {
          name: "Mobile",
          styles: {
            width: "375px",
            height: "667px",
          },
        },
        tablet: {
          name: "Tablet",
          styles: {
            width: "768px",
            height: "1024px",
          },
        },
        desktop: {
          name: "Desktop",
          styles: {
            width: "1280px",
            height: "800px",
          },
        },
        desktopLarge: {
          name: "Desktop Large",
          styles: {
            width: "1920px",
            height: "1080px",
          },
        },
      },
      defaultViewport: "desktop",
    },

    // Backgrounds for testing components on different backgrounds
    backgrounds: {
      default: "light",
      values: [
        {
          name: "light",
          value: "#ffffff",
        },
        {
          name: "dark",
          value: "#1a1a1a",
        },
        {
          name: "gray",
          value: "#f5f5f5",
        },
      ],
    },

    // Actions configuration
    // Note: argTypesRegex is deprecated, but keeping for now
    // Consider using explicit actions with fn() from @storybook/test in the future
    actions: {
      argTypesRegex: "^on[A-Z].*",
    },

    // Layout configuration
    layout: "centered",

    // Docs configuration
    docs: {
      toc: true,
      source: {
        type: "code",
      },
    },
  },

  // Global decorators
  decorators: [
    (Story) => React.createElement(
      "div",
      { style: { padding: "1rem" } },
      React.createElement(Story)
    ),
  ],

  // Global argTypes
  argTypes: {
    className: {
      control: false,
      description: "Additional CSS classes",
    },
    "aria-label": {
      control: "text",
      description: "Accessible label for screen readers",
    },
  },
};

export default preview;

