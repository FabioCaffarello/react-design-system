import type { Meta, StoryObj } from "@storybook/react";
import { fn } from '@storybook/test';
import Text from "./Text";

const meta: Meta<typeof Text> = {
  title: "Atoms/Text",
  component: Text,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
## Text

A flexible text component that supports different semantic HTML elements and styling variants. Uses polymorphic \`as\` prop.

### Events

| Event | Description | Parameters | When Fired |
|-------|-------------|------------|------------|
| N/A | Text é um componente de exibição | - | Não possui eventos de interação |

### States

| State | Description | How to Activate | Visual |
|-------|-------------|-----------------|--------|
| \`heading\` | Variante heading | \`variant="heading"\` | Texto com estilo de heading |
| \`body\` | Variante body | \`variant="body"\` | Texto com estilo de body |
| \`bodySmall\` | Variante body small | \`variant="bodySmall"\` | Texto pequeno |
| \`bodyLarge\` | Variante body large | \`variant="bodyLarge"\` | Texto grande |
| \`caption\` | Variante caption | \`variant="caption"\` | Texto de caption |
| \`label\` | Variante label | \`variant="label"\` | Texto de label |
        `,
      },
    },
  },
  argTypes: {
    as: {
      control: "select",
      options: ["p", "span", "div", "h1", "h2", "h3", "h4", "h5", "h6", "label", "strong", "em", "small", "li"],
      description: "HTML element to render (polymorphic prop)",
    },
    variant: {
      control: "select",
      options: ["heading", "list", "paragraph", "body", "bodySmall", "bodyLarge", "caption", "label"],
      description: "Typography variant",
    },
    bold: {
      control: "boolean",
      description: "Apply bold font weight",
    },
    italic: {
      control: "boolean",
      description: "Apply italic style",
    },
    colorRole: {
      control: "select",
      options: ["primary", "secondary", "success", "warning", "error", "info", "neutral"],
      description: "Semantic color role",
    },
    colorShade: {
      control: "select",
      options: ["light", "DEFAULT", "dark", "contrast"],
      description: "Color shade variant",
    },
    color: {
      control: "text",
      description: "Custom color (fallback, prefer colorRole/colorShade)",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Text>;

export const Default: Story = {
  args: {
    children: "Default text content",
  },
};

export const Variants: Story = {
  render: () => (
    <div className="space-y-4">
      <Text variant="heading">Heading (renders as h2)</Text>
      <Text variant="bodyLarge">Body Large</Text>
      <Text variant="body">Body</Text>
      <Text variant="paragraph">Paragraph</Text>
      <Text variant="bodySmall">Body Small</Text>
      <Text variant="caption">Caption</Text>
      <Text variant="label">Label</Text>
      <Text variant="list">List Item</Text>
    </div>
  ),
};

export const SemanticElements: Story = {
  render: () => (
    <div className="space-y-4">
      <Text as="p">Paragraph text</Text>
      <Text as="span">Span text</Text>
      <Text as="div">Div text</Text>
      <Text as="h1">Heading 1</Text>
      <Text as="h2">Heading 2</Text>
      <Text as="h3">Heading 3</Text>
      <Text as="strong">Strong text</Text>
      <Text as="em">Emphasized text</Text>
      <Text as="small">Small text</Text>
      <Text as="label">Label text</Text>
      <Text as="li">List item</Text>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "Demonstrates the polymorphic `as` prop to render as different HTML elements.",
      },
    },
  },
};

export const Colors: Story = {
  render: () => (
    <div className="space-y-2">
      <Text colorRole="neutral" colorShade="dark">Neutral Dark (default)</Text>
      <Text colorRole="primary" colorShade="DEFAULT">Primary</Text>
      <Text colorRole="secondary" colorShade="DEFAULT">Secondary</Text>
      <Text colorRole="success" colorShade="DEFAULT">Success</Text>
      <Text colorRole="warning" colorShade="DEFAULT">Warning</Text>
      <Text colorRole="error" colorShade="DEFAULT">Error</Text>
      <Text colorRole="info" colorShade="DEFAULT">Info</Text>
      <Text colorRole="neutral" colorShade="light">Neutral Light</Text>
      <Text colorRole="primary" colorShade="dark">Primary Dark</Text>
      <Text colorRole="primary" colorShade="contrast">Primary Contrast</Text>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "Demonstrates colorRole and colorShade props for semantic colors.",
      },
    },
  },
};

export const TypographyStyles: Story = {
  render: () => (
    <div className="space-y-2">
      <Text>Normal text</Text>
      <Text bold>Bold text</Text>
      <Text italic>Italic text</Text>
      <Text bold italic>Bold and italic text</Text>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "Demonstrates bold and italic props.",
      },
    },
  },
};

export const Combined: Story = {
  render: () => (
    <div className="space-y-4">
      <Text variant="heading" colorRole="primary" colorShade="dark" bold>
        Primary Heading
      </Text>
      <Text variant="body" colorRole="neutral" colorShade="dark">
        Body text with neutral color
      </Text>
      <Text variant="bodySmall" colorRole="error" colorShade="DEFAULT" italic>
        Error message in small text
      </Text>
      <Text as="strong" variant="body" colorRole="success" colorShade="DEFAULT">
        Success message
      </Text>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "Examples combining variant, colorRole, colorShade, and other props.",
      },
    },
  },
};

export const InContext: Story = {
  render: () => (
    <div className="space-y-4 max-w-md">
      <Text as="h1" variant="heading" colorRole="primary" colorShade="dark" bold>
        Article Title
      </Text>
      <Text as="p" variant="body" colorRole="neutral" colorShade="DEFAULT">
        Published on January 1, 2024
      </Text>
      <Text as="p" variant="body">
        This is the main content of the article. It demonstrates how the Text component can be used
        in a real-world context with proper semantic HTML elements.
      </Text>
      <Text as="p" variant="bodySmall" colorRole="neutral" colorShade="DEFAULT">
        Author: John Doe
      </Text>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "Real-world example showing Text component in context.",
      },
    },
  },
};

export const Polymorphic: Story = {
  render: () => (
    <div className="space-y-4">
      <div>
        <Text as="h1" variant="heading">Same variant, different element</Text>
        <Text as="h2" variant="heading">Same variant, different element</Text>
        <Text as="h3" variant="heading">Same variant, different element</Text>
      </div>
      <div>
        <Text as="p" variant="body">Paragraph with body variant</Text>
        <Text as="span" variant="body">Span with body variant</Text>
        <Text as="div" variant="body">Div with body variant</Text>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "Demonstrates how the `as` prop allows rendering the same variant as different HTML elements.",
      },
    },
  },
};

// State Stories
export const HeadingState: Story = {
  args: {
    variant: 'heading',
    children: 'Heading Text',
  },
  parameters: {
    docs: {
      description: {
        story: 'Heading state - text with heading variant styling.',
      },
    },
  },
};

export const BodyState: Story = {
  args: {
    variant: 'body',
    children: 'Body text content',
  },
  parameters: {
    docs: {
      description: {
        story: 'Body state - text with body variant styling.',
      },
    },
  },
};

export const BodySmallState: Story = {
  args: {
    variant: 'bodySmall',
    children: 'Small body text',
  },
  parameters: {
    docs: {
      description: {
        story: 'Body small state - text with small body variant styling.',
      },
    },
  },
};

export const CaptionState: Story = {
  args: {
    variant: 'caption',
    children: 'Caption text',
  },
  parameters: {
    docs: {
      description: {
        story: 'Caption state - text with caption variant styling.',
      },
    },
  },
};
