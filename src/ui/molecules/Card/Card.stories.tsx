import type { Meta, StoryObj } from "@storybook/react";
import { fn } from '@storybook/test';
import { expect, userEvent, within, waitFor } from '@storybook/test';
import { useState } from "react";
import Card from "./Card";
import { Text, Button } from "../../atoms";

const meta: Meta<typeof Card> = {
  title: "Molecules/Card",
  component: Card,
  parameters: {
    docs: {
      description: {
        component: `
## Card

A versatile card component for displaying content in containers. Supports multiple variants and padding options.

### Events

| Event | Description | Parameters | When Fired |
|-------|-------------|------------|------------|
| \`onClick\` | Card clicado | \`(event: MouseEvent) => void\` | Quando o card é clicado |

### States

| State | Description | How to Activate | Visual |
|-------|-------------|-----------------|--------|
| \`default\` | Estado padrão | Estado inicial | Card normal |
| \`hover\` | Com hover | \`variant="hover"\` | Card com efeitos de hover |
| \`selected\` | Selecionado | \`variant="selected"\` | Card com borda destacada |
| \`no-padding\` | Sem padding | \`padding="none"\` | Card sem padding interno |
| \`small-padding\` | Padding pequeno | \`padding="small"\` | Card com padding pequeno |
| \`medium-padding\` | Padding médio | \`padding="medium"\` | Card com padding médio |
| \`large-padding\` | Padding grande | \`padding="large"\` | Card com padding grande |
        `,
      },
    },
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "hover", "selected"],
      description: "Visual variant of the card",
    },
    padding: {
      control: "select",
      options: ["none", "small", "medium", "large"],
      description: "Padding size",
    },
    onClick: {
      description: 'Callback fired when the card is clicked',
      action: 'onClick',
      table: {
        type: { summary: '(event: MouseEvent) => void' },
        category: 'Events',
      },
    },
    'aria-label': {
      control: "text",
      description: "Accessible label for interactive cards",
    },
    'aria-labelledby': {
      control: "text",
      description: "ID of element that labels the card",
    },
  },
};

export const Default: StoryObj<typeof Card> = {
  args: {
    children: (
      <>
        <Text as="h3" className="text-lg font-semibold mb-2">Card Title</Text>
        <Text as="p" className="text-gray-600">This is a default card with medium padding.</Text>
      </>
    ),
  },
};

export const Hover: StoryObj<typeof Card> = {
  args: {
    variant: "hover",
    children: (
      <>
        <Text as="h3" className="text-lg font-semibold mb-2">Hover Card</Text>
        <Text as="p" className="text-gray-600">This card has hover effects. Hover over it!</Text>
      </>
    ),
  },
};

export const Selected: StoryObj<typeof Card> = {
  args: {
    variant: "selected",
    children: (
      <>
        <Text as="h3" className="text-lg font-semibold mb-2">Selected Card</Text>
        <Text as="p" className="text-gray-600">This card appears selected with a blue border.</Text>
      </>
    ),
  },
};

export const WithPaddingSmall: StoryObj<typeof Card> = {
  args: {
    padding: "small",
    children: (
      <>
        <Text as="h3" className="text-lg font-semibold mb-2">Small Padding</Text>
        <Text as="p" className="text-gray-600">This card has small padding.</Text>
      </>
    ),
  },
};

export const WithPaddingLarge: StoryObj<typeof Card> = {
  args: {
    padding: "large",
    children: (
      <>
        <Text as="h3" className="text-lg font-semibold mb-2">Large Padding</Text>
        <Text as="p" className="text-gray-600">This card has large padding for more spacious content.</Text>
      </>
    ),
  },
};

export const WithActions: StoryObj<typeof Card> = {
  render: () => {
    const [primaryClicked, setPrimaryClicked] = useState(false);
    const [secondaryClicked, setSecondaryClicked] = useState(false);
    
    return (
      <div className="space-y-4">
        <Card variant="hover" padding="large">
          <Text as="h3" className="text-lg font-semibold mb-2">Card with Actions</Text>
          <Text as="p" className="text-gray-600 mb-4">This card includes action buttons with real callbacks.</Text>
          <div className="flex gap-2">
            <Button 
              variant="regular"
              onClick={() => {
                setPrimaryClicked(true);
                setTimeout(() => setPrimaryClicked(false), 2000);
              }}
            >
              Primary Action
            </Button>
            <Button 
              variant="secondary"
              onClick={() => {
                setSecondaryClicked(true);
                setTimeout(() => setSecondaryClicked(false), 2000);
              }}
            >
              Secondary
            </Button>
          </div>
        </Card>
        {(primaryClicked || secondaryClicked) && (
          <div className="text-sm text-gray-600 p-3 bg-gray-50 rounded">
            {primaryClicked && <p>✓ Primary action clicked!</p>}
            {secondaryClicked && <p>✓ Secondary action clicked!</p>}
          </div>
        )}
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: "Card with interactive buttons. Click the buttons to see feedback.",
      },
    },
  },
};

export const SelectableCards: StoryObj<typeof Card> = {
  render: () => {
    const [selectedCard, setSelectedCard] = useState<string | null>(null);
    
    const cards = [
      { id: '1', title: 'Basic Plan', price: '$9/month' },
      { id: '2', title: 'Pro Plan', price: '$29/month' },
      { id: '3', title: 'Enterprise Plan', price: '$99/month' },
    ];
    
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-3 gap-4">
          {cards.map((card) => (
            <Card
              key={card.id}
              variant={selectedCard === card.id ? "selected" : "hover"}
              onClick={() => setSelectedCard(card.id)}
              aria-label={`${card.title} - ${card.price}`}
            >
              <Text as="h3" className="text-lg font-semibold mb-2">{card.title}</Text>
              <Text as="p" className="text-gray-600">{card.price}</Text>
            </Card>
          ))}
        </div>
        {selectedCard && (
          <div className="text-sm text-gray-600 p-3 bg-blue-50 rounded">
            Selected: <strong>{cards.find(c => c.id === selectedCard)?.title}</strong>
          </div>
        )}
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: "Selectable cards demonstrating selection state. Click cards to select them.",
      },
    },
  },
};

export const NoPadding: StoryObj<typeof Card> = {
  args: {
    padding: "none",
    children: (
      <div className="p-4">
        <Text as="h3" className="text-lg font-semibold mb-2">No Padding Card</Text>
        <Text as="p" className="text-gray-600">This card has no default padding. Content controls its own spacing.</Text>
      </div>
    ),
  },
};

export const Interactive: StoryObj<typeof Card> = {
  render: () => {
    const [clickCount, setClickCount] = useState(0);
    const [lastAction, setLastAction] = useState<string | null>(null);
    
    const handleClick = () => {
      setClickCount(prev => prev + 1);
      setLastAction("Card clicked");
      setTimeout(() => setLastAction(null), 2000);
    };
    
    return (
      <div className="space-y-4">
        <Card
          variant="hover"
          onClick={handleClick}
          aria-label="Clickable card example"
        >
          <Text as="h3" className="text-lg font-semibold mb-2">Interactive Card</Text>
          <Text as="p" className="text-gray-600">This card is clickable. Press Enter or Space when focused to activate.</Text>
        </Card>
        <div className="text-sm text-gray-600">
          {lastAction && (
            <p className="text-green-600">✓ {lastAction} (Total: {clickCount})</p>
          )}
          <p>Click count: {clickCount}</p>
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: "Interactive cards support keyboard navigation. Tab to focus, then press Enter or Space to activate. Click to see the counter increase.",
      },
    },
  },
};

export const WithAriaLabel: StoryObj<typeof Card> = {
  args: {
    variant: "hover",
    onClick: () => alert("Card clicked!"),
    'aria-label': "Product card: Premium Plan - $99/month",
    children: (
      <>
        <Text as="h3" className="text-lg font-semibold mb-2">Premium Plan</Text>
        <Text as="p" className="text-gray-600 mb-2">$99/month</Text>
        <Text as="p" className="text-sm text-gray-500">Includes all features</Text>
      </>
    ),
  },
};

// Event Stories
export const WithEvents: StoryObj<typeof Card> = {
  render: () => {
    const [clickCount, setClickCount] = useState(0);
    
    const handleClick = fn(() => {
      setClickCount(prev => prev + 1);
      console.log('Card clicked');
    });
    
    return (
      <div className="space-y-4">
        <p className="text-sm text-gray-600">
          Click the card below. Check the Actions panel to see events being fired.
        </p>
        <Card
          variant="hover"
          onClick={handleClick}
          aria-label="Interactive card"
        >
          <Text as="h3" className="text-lg font-semibold mb-2">Interactive Card</Text>
          <Text as="p" className="text-gray-600">Click me to see events in the Actions panel.</Text>
        </Card>
        <p className="text-sm text-gray-500">Click count: {clickCount}</p>
      </div>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const card = canvas.getByRole('button') || canvas.getByLabelText('Interactive card');
    
    // Test click
    await userEvent.click(card);
    await waitFor(() => {
      expect(card).toBeInTheDocument();
    });
  },
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates card events. Click the card and check the Actions panel to see events being logged.',
      },
    },
  },
};

// State Stories
export const DefaultState: StoryObj<typeof Card> = {
  args: {
    variant: "default",
    padding: "medium",
    children: (
      <>
        <Text as="h3" className="text-lg font-semibold mb-2">Default Card</Text>
        <Text as="p" className="text-gray-600">This is a default card.</Text>
      </>
    ),
  },
  parameters: {
    docs: {
      description: {
        story: 'Default state - card with default variant and medium padding.',
      },
    },
  },
};

export const HoverState: StoryObj<typeof Card> = {
  args: {
    variant: "hover",
    padding: "medium",
    children: (
      <>
        <Text as="h3" className="text-lg font-semibold mb-2">Hover Card</Text>
        <Text as="p" className="text-gray-600">This card has hover effects.</Text>
      </>
    ),
  },
  parameters: {
    docs: {
      description: {
        story: 'Hover state - card with hover variant that shows hover effects.',
      },
    },
  },
};

export const SelectedState: StoryObj<typeof Card> = {
  args: {
    variant: "selected",
    padding: "medium",
    children: (
      <>
        <Text as="h3" className="text-lg font-semibold mb-2">Selected Card</Text>
        <Text as="p" className="text-gray-600">This card appears selected.</Text>
      </>
    ),
  },
  parameters: {
    docs: {
      description: {
        story: 'Selected state - card with selected variant showing highlighted border.',
      },
    },
  },
};

export default meta;
