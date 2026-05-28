import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import { expect, within, waitFor } from "@storybook/test";
import { useState } from "react";
import Rating from "./Rating";

const meta: Meta<typeof Rating> = {
  title: "Molecules/Rating",
  component: Rating,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
## Rating

A rating component that allows users to rate items using stars or other icons.

### Events

| Event | Description | Parameters | When Fired |
|-------|-------------|------------|------------|
| \`onChange\` | Avaliação mudou | \`(value: number) => void\` | Quando uma nova avaliação é selecionada |
| \`onHover\` | Hover sobre estrela | \`(value: number | null) => void\` | Quando o mouse passa sobre uma estrela |

### States

| State | Description | How to Activate | Visual |
|-------|-------------|-----------------|--------|
| \`empty\` | Sem avaliação | \`value={0}\` | Nenhuma estrela preenchida |
| \`with-value\` | Com avaliação | \`value\` > 0 | Estrelas preenchidas até o valor |
| \`read-only\` | Somente leitura | \`readOnly={true}\` | Rating não interativo |
| \`half-rating\` | Meia estrela | \`allowHalf={true}\` e valor decimal | Permite meias estrelas |
| \`filled\` | Variante preenchida | \`variant="filled"\` | Estrelas preenchidas |
| \`outlined\` | Variante outline | \`variant="outlined"\` | Estrelas com contorno |
        `,
      },
    },
  },
  argTypes: {
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
    },
    variant: {
      control: "select",
      options: ["filled", "outlined"],
    },
    max: {
      control: "number",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Rating>;

export const Default: Story = {
  render: (args) => {
    const [value, setValue] = useState(args.defaultValue || 0);
    const [hoverValue, setHoverValue] = useState<number | null>(null);

    return (
      <div className="space-y-4">
        <Rating
          {...args}
          value={value}
          onChange={(newValue) => {
            setValue(newValue);
            console.log("Rating changed to:", newValue);
          }}
          onHover={setHoverValue}
        />
        <div className="text-sm text-gray-600 space-y-1">
          <p>
            <strong>Current rating:</strong> {value} / {args.max || 5}
          </p>
          {hoverValue !== null && (
            <p>
              <strong>Hovering:</strong> {hoverValue} / {args.max || 5}
            </p>
          )}
        </div>
      </div>
    );
  },
  args: {
    max: 5,
    defaultValue: 0,
  },
  parameters: {
    docs: {
      description: {
        story:
          "Interactive rating with real state. Click stars to rate, hover to see preview.",
      },
    },
  },
};

export const WithValue: Story = {
  render: (args) => {
    const [value, setValue] = useState(args.defaultValue || 3);
    return <Rating {...args} value={value} onChange={setValue} showValue />;
  },
  args: {
    max: 5,
    defaultValue: 3,
  },
};

export const ReadOnly: Story = {
  render: () => (
    <div className="space-y-4">
      <div>
        <p className="text-sm text-gray-600 mb-2">Read-only rating (3 stars)</p>
        <Rating value={3} readOnly showValue />
      </div>
      <div>
        <p className="text-sm text-gray-600 mb-2">
          Read-only rating (4.5 stars)
        </p>
        <Rating value={4.5} readOnly showValue allowHalf />
      </div>
    </div>
  ),
};

export const HalfRatings: Story = {
  render: (args) => {
    const [value, setValue] = useState(args.defaultValue || 2.5);
    return (
      <div className="space-y-4">
        <Rating
          {...args}
          value={value}
          onChange={setValue}
          allowHalf
          showValue
        />
        <p className="text-sm text-gray-600">Current value: {value}</p>
      </div>
    );
  },
  args: {
    max: 5,
    defaultValue: 2.5,
  },
};

export const Sizes: Story = {
  render: () => {
    const [smValue, setSmValue] = useState(3);
    const [mdValue, setMdValue] = useState(3);
    const [lgValue, setLgValue] = useState(3);

    return (
      <div className="space-y-6">
        <div>
          <p className="text-sm text-gray-600 mb-2">Small</p>
          <Rating size="sm" value={smValue} onChange={setSmValue} showValue />
        </div>
        <div>
          <p className="text-sm text-gray-600 mb-2">Medium</p>
          <Rating size="md" value={mdValue} onChange={setMdValue} showValue />
        </div>
        <div>
          <p className="text-sm text-gray-600 mb-2">Large</p>
          <Rating size="lg" value={lgValue} onChange={setLgValue} showValue />
        </div>
      </div>
    );
  },
};

export const CustomMax: Story = {
  render: () => {
    const [value, setValue] = useState(7);
    return (
      <div className="space-y-4">
        <Rating max={10} value={value} onChange={setValue} showValue />
        <p className="text-sm text-gray-600">Rating out of 10</p>
      </div>
    );
  },
};

export const Variants: Story = {
  render: () => {
    const [filledValue, setFilledValue] = useState(3);
    const [outlinedValue, setOutlinedValue] = useState(3);

    return (
      <div className="space-y-6">
        <div>
          <p className="text-sm text-gray-600 mb-2">Filled</p>
          <Rating
            variant="filled"
            value={filledValue}
            onChange={setFilledValue}
            showValue
          />
        </div>
        <div>
          <p className="text-sm text-gray-600 mb-2">Outlined</p>
          <Rating
            variant="outlined"
            value={outlinedValue}
            onChange={setOutlinedValue}
            showValue
          />
        </div>
      </div>
    );
  },
};

export const InContext: Story = {
  render: () => {
    const [productRating, setProductRating] = useState(4.5);
    const [serviceRating, setServiceRating] = useState(5);
    const [submitted, setSubmitted] = useState(false);

    const average = ((productRating + serviceRating) / 2).toFixed(1);

    const handleSubmit = () => {
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 3000);
    };

    return (
      <div className="w-96 space-y-6 p-4 border border-gray-200 rounded-lg">
        <h3 className="text-lg font-semibold">Rate Your Experience</h3>

        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Product Quality</span>
              <Rating
                value={productRating}
                onChange={setProductRating}
                allowHalf
                showValue
                size="sm"
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Customer Service</span>
              <Rating
                value={serviceRating}
                onChange={setServiceRating}
                showValue
                size="sm"
              />
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-gray-200 space-y-2">
          <p className="text-sm font-medium text-gray-700">
            Average Rating: <strong>{average}/5</strong>
          </p>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            {submitted ? "Submitted!" : "Submit Rating"}
          </button>
          {submitted && (
            <p className="text-sm text-green-600">
              ✓ Thank you for your feedback!
            </p>
          )}
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          "Rating component in a real-world context. Rate different aspects and see the average calculated in real-time.",
      },
    },
  },
};

// Event Stories
export const WithEvents: Story = {
  render: () => {
    const [value, setValue] = useState(0);
    const handleChange = fn((newValue: number) => {
      setValue(newValue);
    });
    const handleHover = fn((hoverValue: number | null) => {
      console.log("Hovering:", hoverValue);
    });

    return (
      <div className="space-y-4">
        <p className="text-sm text-gray-600">
          Click stars to rate or hover over them. Check the Actions panel to see
          events being fired.
        </p>
        <Rating
          value={value}
          onChange={handleChange}
          onHover={handleHover}
          max={5}
        />
        <p className="text-sm text-gray-500">Current rating: {value} / 5</p>
      </div>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // Wait for rating component to be interactive
    await waitFor(
      () => {
        // Use a more flexible text matcher for text that might be split across elements
        // Get all elements that contain "Current rating:" and verify at least one exists
        const ratingElements = canvas.getAllByText((content, element) => {
          return element?.textContent?.includes("Current rating:") || false;
        });
        expect(ratingElements.length).toBeGreaterThan(0);
      },
      { timeout: 3000 },
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          "Demonstrates rating events. Click or hover over stars and check the Actions panel to see events being logged.",
      },
    },
  },
};

// State Stories
export const EmptyState: Story = {
  args: {
    value: 0,
    max: 5,
  },
  parameters: {
    docs: {
      description: {
        story: "Empty state - no stars are filled.",
      },
    },
  },
};

export const WithValueState: Story = {
  args: {
    value: 3,
    max: 5,
    showValue: true,
  },
  parameters: {
    docs: {
      description: {
        story: "With value state - stars are filled up to the value.",
      },
    },
  },
};

export const ReadOnlyState: Story = {
  args: {
    value: 4,
    max: 5,
    readOnly: true,
    showValue: true,
  },
  parameters: {
    docs: {
      description: {
        story: "Read-only state - rating is displayed but cannot be changed.",
      },
    },
  },
};

export const HalfRatingState: Story = {
  args: {
    value: 2.5,
    max: 5,
    allowHalf: true,
    showValue: true,
  },
  parameters: {
    docs: {
      description: {
        story: "Half rating state - allows half-star ratings.",
      },
    },
  },
};

export const FilledVariantState: Story = {
  args: {
    value: 4,
    max: 5,
    variant: "filled",
    showValue: true,
  },
  parameters: {
    docs: {
      description: {
        story: "Filled variant state - stars are filled.",
      },
    },
  },
};

export const OutlinedVariantState: Story = {
  args: {
    value: 4,
    max: 5,
    variant: "outlined",
    showValue: true,
  },
  parameters: {
    docs: {
      description: {
        story: "Outlined variant state - stars have outlines.",
      },
    },
  },
};
