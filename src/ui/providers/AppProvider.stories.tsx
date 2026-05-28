import type { Meta, StoryObj } from "@storybook/react";
import { AppProvider } from "./AppProvider";
import { Button } from "../primitives";

const meta: Meta<typeof AppProvider> = {
  title: "Providers/AppProvider",
  component: AppProvider,
  parameters: {
    docs: {
      description: {
        component: `
## AppProvider

Root provider that composes all global providers of the design system.
Uses Composition Pattern to combine providers in a logical hierarchy.

### Context Hierarchy

\`\`\`mermaid
graph TB
    AppProvider[AppProvider Root]
    ThemeProvider[ThemeProvider]
    ConfigProvider[ConfigProvider]
    ToastProvider[ToastProvider]
    DialogProvider[DialogProvider]
    
    AppProvider --> ThemeProvider
    ThemeProvider --> ConfigProvider
    ConfigProvider --> ToastProvider
    ToastProvider --> DialogProvider
    DialogProvider --> App[Application Components]
    
    style AppProvider fill:#6366f1,stroke:#4f46e5,color:#fff
    style ThemeProvider fill:#818cf8,stroke:#6366f1,color:#fff
    style ConfigProvider fill:#a5b4fc,stroke:#818cf8,color:#fff
    style ToastProvider fill:#c7d2fe,stroke:#a5b4fc,color:#000
    style DialogProvider fill:#e0e7ff,stroke:#c7d2fe,color:#000
\`\`\`

### Data Flow

\`\`\`mermaid
flowchart TD
    AppProvider[AppProvider] --> ThemeContext[Theme Context]
    AppProvider --> ConfigContext[Config Context]
    AppProvider --> ToastContext[Toast Context]
    AppProvider --> DialogContext[Dialog Context]
    
    ThemeContext --> Components[Components]
    ConfigContext --> Components
    ToastContext --> Components
    DialogContext --> Components
    
    Components --> useTheme[useTheme Hook]
    Components --> useConfig[useConfig Hook]
    Components --> useToast[useToast Hook]
    Components --> useDialog[useDialog Hook]
\`\`\`

### Provider Composition

The AppProvider uses a bottom-up composition strategy:
1. **ThemeProvider** (foundation) - Provides theme tokens and colors
2. **ConfigProvider** (configuration) - Provides design system configuration
3. **ToastProvider** (component-level) - Manages toast notifications
4. **DialogProvider** (most specific) - Manages dialog/modal state
        `,
      },
    },
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof AppProvider>;

/**
 * Default AppProvider
 *
 * AppProvider with all default providers enabled.
 */
export const Default: Story = {
  render: () => (
    <AppProvider>
      <div style={{ padding: "20px" }}>
        <h2>AppProvider Example</h2>
        <p>
          This component is wrapped with AppProvider, providing access to all
          global contexts.
        </p>
        <Button>Test Button</Button>
      </div>
    </AppProvider>
  ),
};

/**
 * Custom Configuration
 *
 * AppProvider with custom provider configuration.
 */
export const CustomConfig: Story = {
  render: () => (
    <AppProvider
      config={{
        theme: { defaultTheme: "dark" },
        config: {
          config: {
            features: { debug: true },
          },
        },
        toast: { maxToasts: 5 },
      }}
    >
      <div style={{ padding: "20px" }}>
        <h2>Custom Configuration</h2>
        <p>AppProvider with custom theme, config, and toast settings.</p>
        <Button>Test Button</Button>
      </div>
    </AppProvider>
  ),
};

/**
 * Selective Providers
 *
 * AppProvider with only specific providers enabled.
 */
export const SelectiveProviders: Story = {
  render: () => (
    <AppProvider
      config={{
        providers: {
          theme: true,
          config: true,
          toast: false,
          dialog: false,
        },
      }}
    >
      <div style={{ padding: "20px" }}>
        <h2>Selective Providers</h2>
        <p>Only ThemeProvider and ConfigProvider are enabled.</p>
        <Button>Test Button</Button>
      </div>
    </AppProvider>
  ),
};
