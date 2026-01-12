import type { Meta, StoryObj } from "@storybook/react";
import Card from "./Card";
import { Text, Button } from "../../atoms";

const meta: Meta<typeof Card> = {
  title: "Molecules/Card",
  component: Card,
  parameters: {
    docs: {
      description: {
        component: "A versatile card component for displaying content in containers. Supports multiple variants and padding options.",
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
      control: false,
      description: "Click handler. When provided, card becomes interactive with keyboard support.",
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
  args: {
    variant: "hover",
    padding: "large",
    children: (
      <>
        <Text as="h3" className="text-lg font-semibold mb-2">Card with Actions</Text>
        <Text as="p" className="text-gray-600 mb-4">This card includes action buttons.</Text>
        <div className="flex gap-2">
          <Button variant="regular">Primary Action</Button>
          <Button variant="secondary">Secondary</Button>
        </div>
      </>
    ),
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
  args: {
    variant: "hover",
    onClick: () => alert("Card clicked!"),
    'aria-label': "Clickable card example",
    children: (
      <>
        <Text as="h3" className="text-lg font-semibold mb-2">Interactive Card</Text>
        <Text as="p" className="text-gray-600">This card is clickable. Press Enter or Space when focused to activate.</Text>
      </>
    ),
  },
  parameters: {
    docs: {
      description: {
        story: "Interactive cards support keyboard navigation. Tab to focus, then press Enter or Space to activate.",
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

export default meta;
