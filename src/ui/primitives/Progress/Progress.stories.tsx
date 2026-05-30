import type { Meta, StoryObj } from "@storybook/react-vite";
import React from "react";
import Progress from "./Progress";

const meta: Meta<typeof Progress> = {
  title: "Primitives/Progress",
  component: Progress,
  parameters: {
    docs: {
      description: {
        component: `
## Progress

A progress bar component for displaying progress or loading states. Supports both determinate (with value) and indeterminate (without value) modes.

### Events

| Event | Description | Parameters | When Fired |
|-------|-------------|------------|------------|
| N/A | Progress é um componente de exibição | - | Não possui eventos de interação |

### States

| State | Description | How to Activate | Visual |
|-------|-------------|-----------------|--------|
| \`determinate\` | Com valor definido | \`value={0-100}\` | Barra de progresso com porcentagem visível |
| \`indeterminate\` | Sem valor definido | Sem prop \`value\` | Barra de progresso animada |
| \`0%\` | Não iniciado | \`value={0}\` | Barra vazia |
| \`100%\` | Completo | \`value={100}\` | Barra cheia |
        `,
      },
    },
  },
  argTypes: {
    value: {
      control: { type: "range", min: 0, max: 100, step: 1 },
      description: "Progress value (0-100). Omit for indeterminate mode.",
    },
    max: {
      control: "number",
      description: "Maximum value (default: 100)",
    },
    variant: {
      control: "select",
      options: ["primary", "secondary", "success", "error", "warning", "info"],
      description: "Color variant of the progress bar",
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
      description: "Size of the progress bar",
    },
    showLabel: {
      control: "boolean",
      description: "Whether to show the label and percentage",
    },
    label: {
      control: "text",
      description: "Custom label text",
    },
  },
};

// State Stories
export const DeterminateState: Story = {
  args: {
    value: 50,
    variant: "primary",
    size: "md",
    showLabel: true,
  },
  parameters: {
    docs: {
      description: {
        story: "Determinate state - progress bar with a defined value (0-100).",
      },
    },
  },
};

export const IndeterminateState: Story = {
  args: {
    variant: "primary",
    size: "md",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Indeterminate state - animated progress bar for loading states where progress cannot be determined.",
      },
    },
  },
};

export const ZeroPercentState: Story = {
  args: {
    value: 0,
    variant: "primary",
    size: "md",
    showLabel: true,
    label: "Not Started",
  },
  parameters: {
    docs: {
      description: {
        story: "Zero percent state - progress bar at 0%, not started.",
      },
    },
  },
};

export const CompleteState: Story = {
  args: {
    value: 100,
    variant: "success",
    size: "md",
    showLabel: true,
    label: "Complete",
  },
  parameters: {
    docs: {
      description: {
        story: "Complete state - progress bar at 100%, fully completed.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Progress>;

export const Default: Story = {
  args: {
    value: 50,
    variant: "primary",
    size: "md",
  },
};

export const WithLabel: Story = {
  args: {
    value: 75,
    variant: "primary",
    showLabel: true,
    label: "Upload Progress",
  },
};

export const Indeterminate: Story = {
  args: {
    variant: "primary",
    size: "md",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Indeterminate progress bar for loading states where progress cannot be determined.",
      },
    },
  },
};

export const Variants: Story = {
  render: () => (
    <div className="space-y-4 w-full max-w-md">
      <Progress value={60} variant="primary" showLabel label="Primary" />
      <Progress value={60} variant="secondary" showLabel label="Secondary" />
      <Progress value={60} variant="success" showLabel label="Success" />
      <Progress value={60} variant="error" showLabel label="Error" />
      <Progress value={60} variant="warning" showLabel label="Warning" />
      <Progress value={60} variant="info" showLabel label="Info" />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "All available color variants of the progress bar.",
      },
    },
  },
};

export const Sizes: Story = {
  render: () => (
    <div className="space-y-4 w-full max-w-md">
      <Progress value={50} size="sm" showLabel label="Small" />
      <Progress value={50} size="md" showLabel label="Medium" />
      <Progress value={50} size="lg" showLabel label="Large" />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "Different sizes of the progress bar.",
      },
    },
  },
};

export const States: Story = {
  render: () => (
    <div className="space-y-4 w-full max-w-md">
      <Progress value={0} showLabel label="Not Started (0%)" />
      <Progress value={25} showLabel label="In Progress (25%)" />
      <Progress value={50} showLabel label="Halfway (50%)" />
      <Progress value={75} showLabel label="Almost Done (75%)" />
      <Progress value={100} showLabel label="Complete (100%)" />
      <Progress variant="primary" showLabel label="Indeterminate" />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Different progress states from 0% to 100%, plus indeterminate mode.",
      },
    },
  },
};

export const Animated: Story = {
  render: () => {
    const [progress, setProgress] = React.useState(0);

    React.useEffect(() => {
      const timer = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            return 0;
          }
          return prev + 10;
        });
      }, 500);

      return () => clearInterval(timer);
    }, []);

    return (
      <div className="space-y-4 w-full max-w-md">
        <Progress value={progress} showLabel label="Animated Progress" />
        <p className="text-sm text-gray-600">
          Progress automatically updates every 500ms
        </p>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: "Animated progress bar that updates automatically.",
      },
    },
  },
};
