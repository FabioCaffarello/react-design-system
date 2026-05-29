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

    // Accessibility configuration - WCAG 2.1 AA compliance
    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: "todo",
      config: {
        rules: [
          // Perceivable - Text Alternatives
          {
            id: "image-alt",
            enabled: true,
          },
          {
            id: "object-alt",
            enabled: true,
          },
          {
            id: "role-img-alt",
            enabled: true,
          },
          {
            id: "video-caption",
            enabled: true,
          },
          {
            id: "audio-caption",
            enabled: true,
          },

          // Perceivable - Time-based Media
          {
            id: "video-description",
            enabled: true,
          },

          // Perceivable - Adaptable
          {
            id: "html-has-lang",
            enabled: true,
          },
          {
            id: "html-lang-valid",
            enabled: true,
          },
          {
            id: "valid-lang",
            enabled: true,
          },

          // Perceivable - Distinguishable
          {
            id: "color-contrast",
            enabled: true,
          },
          {
            id: "color-contrast-enhanced",
            enabled: false, // AAA level, optional
          },
          {
            id: "avoid-inline-spacing",
            enabled: true,
          },

          // Operable - Keyboard Accessible
          {
            id: "keyboard",
            enabled: true,
          },
          {
            id: "keyboard-navigation",
            enabled: true,
          },
          {
            id: "no-keyboard-trap",
            enabled: true,
          },
          {
            id: "focus-order-semantics",
            enabled: true,
          },

          // Operable - Enough Time
          {
            id: "meta-refresh",
            enabled: true,
          },
          {
            id: "timed-media",
            enabled: true,
          },

          // Operable - Seizures and Physical Reactions
          {
            id: "blink",
            enabled: true,
          },

          // Operable - Navigable
          {
            id: "bypass",
            enabled: true,
          },
          {
            id: "document-title",
            enabled: true,
          },
          {
            id: "focus-order-semantics",
            enabled: true,
          },
          {
            id: "link-purpose",
            enabled: true,
          },
          {
            id: "page-has-heading-one",
            enabled: true,
          },
          {
            id: "landmark-one-main",
            enabled: true,
          },
          {
            id: "region",
            enabled: true,
          },
          {
            id: "scrollable-region-focusable",
            enabled: true,
          },

          // Understandable - Readable
          {
            id: "html-lang-valid",
            enabled: true,
          },
          {
            id: "valid-lang",
            enabled: true,
          },

          // Understandable - Predictable
          {
            id: "meta-refresh",
            enabled: true,
          },
          {
            id: "page-has-heading-one",
            enabled: true,
          },

          // Understandable - Input Assistance
          {
            id: "label",
            enabled: true,
          },
          {
            id: "label-title-only",
            enabled: true,
          },
          {
            id: "form-field-multiple-labels",
            enabled: true,
          },
          {
            id: "error-message",
            enabled: true,
          },

          // Robust - Parsing
          {
            id: "duplicate-id",
            enabled: true,
          },
          {
            id: "duplicate-id-active",
            enabled: true,
          },
          {
            id: "duplicate-id-aria",
            enabled: true,
          },

          // Robust - Name, Role, Value
          {
            id: "aria-allowed-attr",
            enabled: true,
          },
          {
            id: "aria-required-attr",
            enabled: true,
          },
          {
            id: "aria-required-children",
            enabled: true,
          },
          {
            id: "aria-required-parent",
            enabled: true,
          },
          {
            id: "aria-roles",
            enabled: true,
          },
          {
            id: "aria-valid-attr",
            enabled: true,
          },
          {
            id: "aria-valid-attr-value",
            enabled: true,
          },
          {
            id: "button-name",
            enabled: true,
          },
          {
            id: "input-button-name",
            enabled: true,
          },
          {
            id: "link-name",
            enabled: true,
          },
          {
            id: "list",
            enabled: true,
          },
          {
            id: "listitem",
            enabled: true,
          },
          {
            id: "select-name",
            enabled: true,
          },
          {
            id: "table-fake-caption",
            enabled: true,
          },
          {
            id: "td-headers-attr",
            enabled: true,
          },
          {
            id: "th-has-data-cells",
            enabled: true,
          },
          {
            id: "aria-hidden-focus",
            enabled: true,
          },
          {
            id: "aria-hidden-body",
            enabled: true,
          },
          {
            id: "aria-input-field-name",
            enabled: true,
          },
          {
            id: "aria-meter-name",
            enabled: true,
          },
          {
            id: "aria-progressbar-name",
            enabled: true,
          },
          {
            id: "aria-slider-name",
            enabled: true,
          },
          {
            id: "aria-tooltip-name",
            enabled: true,
          },
          {
            id: "aria-treeitem-name",
            enabled: true,
          },
          {
            id: "heading-order",
            enabled: true,
          },
          // Storybook-iframe context exceptions — disabled GLOBALLY here,
          // re-enabled per-story on components that actually render real
          // page structure. See docs/ACCESSIBILITY.md "Story-iframe
          // exceptions" for the rationale and the re-enable pattern.
          //
          // The three rules below are page-level: they assert structure
          // about a full HTML document (one `<main>`, an `<h1>`, all
          // meaningful content inside a landmark). A Storybook story
          // iframe renders only the component under test — no header,
          // no nav, no `<main>` wrapper. The component itself has no
          // mandate to provide a page chrome; that's the consumer's
          // responsibility at the application level.
          //
          // The Phase C baseline run (842 of 852 stories with at least
          // one a11y violation) showed these three rules accounted for
          // 2.788 of 2.817 moderate-severity nodes — 98,9% of moderate
          // severity was instrument noise, not real accessibility debt.
          // Leaving them enabled meant flipping `a11y.test: "error"`
          // would block CI on every story for false positives.
          //
          // Re-enable in stories that DO render a full page structure
          // (a `<main>`/landmark composition) by adding to the story
          // meta:
          //   parameters: {
          //     a11y: {
          //       config: {
          //         rules: [
          //           { id: "region", enabled: true },
          //           { id: "landmark-one-main", enabled: true },
          //           { id: "page-has-heading-one", enabled: true },
          //         ],
          //       },
          //     },
          //   }
          // Currently only DashboardLayout meets that bar (renders
          // `<header>` + `<main>` + `<footer>`). Header/Navigation/
          // SideNavbar emit partial landmarks (header/nav/aside) but
          // are not full pages — keep these rules off there.
          { id: "region", enabled: false },
          { id: "landmark-one-main", enabled: false },
          { id: "page-has-heading-one", enabled: false },
        ],
      },
      options: {
        checks: {
          "color-contrast": {
            options: {
              noScroll: true,
              // WCAG 2.1 AA: 4.5:1 for normal text, 3:1 for large text
              contrastRatio: 4.5,
            },
          },
        },
        restoreScroll: true,
        runOnly: {
          type: "tag",
          values: ["wcag2a", "wcag2aa", "wcag21aa", "best-practice"],
        },
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
