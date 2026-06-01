import type { Preview } from "@storybook/react-vite";
import React from "react";
import "../src/style.css";
// Shared a11y rule/options/check config — single source for the
// addon-a11y gate (here) AND the serial baseline runner
// (`scripts/a11y-serial-baseline.mjs`). Do not duplicate the rule
// list inline; edit `.storybook/a11y-config.mjs` instead.
import {
  a11yRules,
  a11yOptions,
  a11yChecks,
  a11yDisabledRules,
} from "./a11y-config.mjs";

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

    // Accessibility configuration - WCAG 2.1 AA compliance.
    //
    // Rule list, axe options, and color-contrast check options live in
    // `./a11y-config.mjs` so the serial baseline runner can import the
    // same source. Do not inline the rule array here — keep it imported.
    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: "todo",
      config: {
        rules: a11yRules,
      },
      options: {
        ...a11yOptions,
        checks: a11yChecks,
        // axe-core 4.11.4 ignores configure-time `enabled: false` when
        // runOnly is tag-based. The disable lives here (run-options
        // level) where axe honors it. See a11y-config.mjs for the long
        // rationale. Per-story re-enable (DashboardLayout) mirrors this
        // via parameters.a11y.options.rules with `enabled: true`.
        rules: a11yDisabledRules,
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

    // Opinionated sidebar order. Default alphabetical buried Design System
    // in the middle (Components → Design System → Layouts → Primitives) and
    // dropped first-time visitors on Components/Accordion arbitrarily. New
    // order surfaces Design System first (with Introduction landing), then
    // the three component layers. Within Design System, order is by
    // consultation frequency, not alphabet.
    options: {
      storySort: {
        order: [
          "Design System",
          [
            "Introduction",
            "Tokens",
            "Providers",
            ["AppProvider"],
            "Component Status",
            "Guides",
            ["Component Composition"],
          ],
          "Primitives",
          "Components",
          "Layouts",
        ],
      },
    },
  },

  // Global decorators
  decorators: [
    (Story) => (
      <div style={{ padding: "1rem" }}>
        <Story />
      </div>
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
