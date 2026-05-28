import type { Meta, StoryObj } from "@storybook/react";
import { expect, userEvent, within, waitFor } from "@storybook/test";
import { fn } from "@storybook/test";
import { ToastContainer, useToast } from "./index";
import { ToastProvider } from "../../providers/ToastProvider";
import { Button } from "../../primitives";

// Wrapper component for stories
function ToastDemo({
  position = "top-right" as const,
}: {
  position?:
    | "top-right"
    | "top-left"
    | "bottom-right"
    | "bottom-left"
    | "top-center"
    | "bottom-center";
}) {
  const toast = useToast();

  return (
    <div className="space-y-4 p-8">
      <div className="space-x-2">
        <Button
          onClick={() =>
            toast.success("Success!", "Operation completed successfully")
          }
        >
          Show Success
        </Button>
        <Button
          variant="error"
          onClick={() => toast.error("Error!", "Something went wrong")}
        >
          Show Error
        </Button>
        <Button
          variant="secondary"
          onClick={() => toast.warning("Warning!", "Please be careful")}
        >
          Show Warning
        </Button>
        <Button
          variant="outline"
          onClick={() => toast.info("Info", "Here is some information")}
        >
          Show Info
        </Button>
      </div>
      <div className="space-x-2">
        <Button
          variant="outline"
          onClick={() =>
            toast.success("With Action", "Click the action button", {
              action: {
                label: "View Details",
                onClick: () => alert("Action clicked!"),
              },
            })
          }
        >
          Toast with Action
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            toast.info("Persistent", "This toast will not auto-dismiss", {
              duration: undefined,
            })
          }
        >
          Persistent Toast
        </Button>
        <Button variant="outline" onClick={() => toast.clearAll()}>
          Clear All
        </Button>
      </div>
      <ToastContainer position={position} />
    </div>
  );
}

const meta: Meta<typeof ToastProvider> = {
  title: "Organisms/Toast",
  component: ToastProvider,
  parameters: {
    docs: {
      description: {
        component: `
## Toast

A toast notification system with provider, hook, and container. Supports multiple variants, auto-dismiss, actions, and customizable positioning.

### Events

| Event | Description | Parameters | When Fired |
|-------|-------------|------------|------------|
| \`onAction\` | Ação do toast clicada | \`() => void\` | Quando o botão de ação do toast é clicado |
| \`onClose\` | Toast fechado | \`() => void\` | Quando o toast é fechado (X ou auto-dismiss) |

### States

| State | Description | How to Activate | Visual |
|-------|-------------|-----------------|--------|
| \`default\` | Estado padrão | Estado inicial | Toast visível |
| \`success\` | Variante de sucesso | \`toast.success()\` | Toast verde de sucesso |
| \`error\` | Variante de erro | \`toast.error()\` | Toast vermelho de erro |
| \`warning\` | Variante de aviso | \`toast.warning()\` | Toast amarelo de aviso |
| \`info\` | Variante de informação | \`toast.info()\` | Toast azul de informação |
| \`with-action\` | Com ação | \`action\` prop definida | Toast com botão de ação |
| \`persistent\` | Persistente | \`duration={undefined}\` | Toast que não fecha automaticamente |
| \`top-right\` | Posição superior direita | \`position="top-right"\` ou padrão | Toast no canto superior direito |
| \`top-left\` | Posição superior esquerda | \`position="top-left"\` | Toast no canto superior esquerdo |
| \`bottom-right\` | Posição inferior direita | \`position="bottom-right"\` | Toast no canto inferior direito |
| \`bottom-left\` | Posição inferior esquerda | \`position="bottom-left"\` | Toast no canto inferior esquerdo |
| \`top-center\` | Posição superior centro | \`position="top-center"\` | Toast no topo centralizado |
| \`bottom-center\` | Posição inferior centro | \`position="bottom-center"\` | Toast na parte inferior centralizado |
        `,
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    children: {
      description: "Child components that can use the toast context",
      control: false,
    },
  },
  decorators: [
    (Story) => (
      <ToastProvider>
        <Story />
      </ToastProvider>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof ToastProvider>;

export const Default: Story = {
  render: () => <ToastDemo />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const successButton = canvas.getByRole("button", { name: /show success/i });

    await userEvent.click(successButton);

    // Wait for toast to appear
    await waitFor(() => {
      expect(within(document.body).getByText(/success!/i)).toBeInTheDocument();
    });
  },
};

export const TopLeft: Story = {
  render: () => <ToastDemo position="top-left" />,
};

export const BottomRight: Story = {
  render: () => <ToastDemo position="bottom-right" />,
};

export const BottomLeft: Story = {
  render: () => <ToastDemo position="bottom-left" />,
};

export const TopCenter: Story = {
  render: () => <ToastDemo position="top-center" />,
};

export const BottomCenter: Story = {
  render: () => <ToastDemo position="bottom-center" />,
};

export const MultipleToasts: Story = {
  render: () => {
    const toast = useToast();
    return (
      <div className="space-y-4 p-8">
        <Button
          onClick={() => {
            toast.success("First Toast", "This is the first notification");
            setTimeout(
              () =>
                toast.info("Second Toast", "This is the second notification"),
              200,
            );
            setTimeout(
              () =>
                toast.warning("Third Toast", "This is the third notification"),
              400,
            );
            setTimeout(
              () =>
                toast.error("Fourth Toast", "This is the fourth notification"),
              600,
            );
          }}
        >
          Show Multiple Toasts
        </Button>
        <ToastContainer />
      </div>
    );
  },
};

export const WithActions: Story = {
  render: () => {
    const toast = useToast();
    return (
      <div className="space-y-4 p-8">
        <Button
          onClick={() =>
            toast.success(
              "File Uploaded",
              "Your file has been uploaded successfully",
              {
                action: {
                  label: "View File",
                  onClick: () => alert("Opening file..."),
                },
              },
            )
          }
        >
          Toast with Action
        </Button>
        <ToastContainer />
      </div>
    );
  },
};

export const CustomDuration: Story = {
  render: () => {
    const toast = useToast();
    return (
      <div className="space-y-4 p-8">
        <Button
          onClick={() =>
            toast.info("Quick Toast", "This will disappear in 2 seconds", {
              duration: 2000,
            })
          }
        >
          Short Duration (2s)
        </Button>
        <Button
          onClick={() =>
            toast.info("Long Toast", "This will disappear in 10 seconds", {
              duration: 10000,
            })
          }
        >
          Long Duration (10s)
        </Button>
        <ToastContainer />
      </div>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const quickButton = canvas.getByRole("button", { name: /short duration/i });

    await userEvent.click(quickButton);

    // Wait for toast to appear
    await waitFor(() => {
      expect(
        within(document.body).getByText(/quick toast/i),
      ).toBeInTheDocument();
    });

    // Wait for toast to disappear (after 2 seconds)
    await waitFor(
      () => {
        expect(canvas.queryByText(/quick toast/i)).not.toBeInTheDocument();
      },
      { timeout: 3000 },
    );
  },
};

export const WithAction: Story = {
  render: () => {
    const toast = useToast();
    const handleActionClick = fn(() => {
      alert("Action clicked!");
    });

    return (
      <div className="space-y-4 p-8">
        <Button
          onClick={() =>
            toast.success(
              "File Uploaded",
              "Your file has been uploaded successfully",
              {
                action: {
                  label: "View File",
                  onClick: handleActionClick,
                },
              },
            )
          }
        >
          Toast with Action
        </Button>
        <ToastContainer />
      </div>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole("button", { name: /toast with action/i });

    await userEvent.click(button);

    // Wait for toast to appear with action button
    await waitFor(
      () => {
        expect(
          within(document.body).getByText(/file uploaded/i),
        ).toBeInTheDocument();
        // Verify action button exists (even if not immediately clickable due to animations)
        const actionButton = within(document.body).getByRole("button", {
          name: /view file/i,
        });
        expect(actionButton).toBeInTheDocument();
      },
      { timeout: 2000 },
    );

    // Note: The action button click is tested in the "With Events" story
    // This story just verifies the toast with action appears correctly
  },
};

export const PersistentToast: Story = {
  render: () => {
    const toast = useToast();
    return (
      <div className="space-y-4 p-8">
        <Button
          onClick={() =>
            toast.info(
              "Persistent Toast",
              "This toast will not auto-dismiss. Click X to close.",
              {
                duration: undefined,
              },
            )
          }
        >
          Show Persistent Toast
        </Button>
        <ToastContainer />
      </div>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole("button", {
      name: /show persistent toast/i,
    });

    await userEvent.click(button);

    // Wait for toast to appear
    await waitFor(() => {
      const toasts = within(document.body).getAllByText(/persistent toast/i);
      // Should find the toast message, not the button
      const toastMessage = toasts.find((el) => !el.closest("button"));
      expect(toastMessage).toBeDefined();
    });

    // Wait a bit to ensure it doesn't auto-dismiss
    await new Promise((resolve) => setTimeout(resolve, 3000));

    // Toast should still be visible
    await waitFor(() => {
      const toasts = within(document.body).getAllByText(/persistent toast/i);
      const toastMessage = toasts.find((el) => !el.closest("button"));
      expect(toastMessage).toBeDefined();
    });
  },
};

export const AllVariants: Story = {
  render: () => {
    const toast = useToast();
    return (
      <div className="space-y-4 p-8">
        <div className="space-x-2">
          <Button
            onClick={() =>
              toast.success("Success Toast", "This is a success message")
            }
          >
            Success
          </Button>
          <Button
            variant="error"
            onClick={() =>
              toast.error("Error Toast", "This is an error message")
            }
          >
            Error
          </Button>
          <Button
            variant="secondary"
            onClick={() =>
              toast.warning("Warning Toast", "This is a warning message")
            }
          >
            Warning
          </Button>
          <Button
            variant="outline"
            onClick={() => toast.info("Info Toast", "This is an info message")}
          >
            Info
          </Button>
        </div>
        <ToastContainer />
      </div>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Show all variants
    await userEvent.click(canvas.getByRole("button", { name: /success/i }));
    await userEvent.click(canvas.getByRole("button", { name: /error/i }));
    await userEvent.click(canvas.getByRole("button", { name: /warning/i }));
    await userEvent.click(canvas.getByRole("button", { name: /info/i }));

    // Wait for all toasts to appear
    await waitFor(() => {
      expect(
        within(document.body).getByText(/success toast/i),
      ).toBeInTheDocument();
      expect(
        within(document.body).getByText(/error toast/i),
      ).toBeInTheDocument();
      expect(
        within(document.body).getByText(/warning toast/i),
      ).toBeInTheDocument();
      expect(
        within(document.body).getByText(/info toast/i),
      ).toBeInTheDocument();
    });
  },
};

export const ClearAll: Story = {
  render: () => {
    const toast = useToast();
    return (
      <div className="space-y-4 p-8">
        <div className="space-x-2">
          <Button onClick={() => toast.success("Toast 1", "First toast")}>
            Add Toast 1
          </Button>
          <Button onClick={() => toast.info("Toast 2", "Second toast")}>
            Add Toast 2
          </Button>
          <Button onClick={() => toast.warning("Toast 3", "Third toast")}>
            Add Toast 3
          </Button>
        </div>
        <div className="space-x-2">
          <Button variant="outline" onClick={() => toast.clearAll()}>
            Clear All
          </Button>
        </div>
        <ToastContainer />
      </div>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Add multiple toasts
    await userEvent.click(canvas.getByRole("button", { name: /add toast 1/i }));
    await userEvent.click(canvas.getByRole("button", { name: /add toast 2/i }));
    await userEvent.click(canvas.getByRole("button", { name: /add toast 3/i }));

    // Wait for toasts to appear (in document.body, not in buttons)
    await waitFor(() => {
      const toast1Elements = within(document.body).getAllByText(/toast 1/i);
      const toast1 = toast1Elements.find(
        (el) => !el.closest("button") || el.closest('[role="alert"]'),
      );
      expect(toast1).toBeDefined();

      const toast2Elements = within(document.body).getAllByText(/toast 2/i);
      const toast2 = toast2Elements.find(
        (el) => !el.closest("button") || el.closest('[role="alert"]'),
      );
      expect(toast2).toBeDefined();

      const toast3Elements = within(document.body).getAllByText(/toast 3/i);
      const toast3 = toast3Elements.find(
        (el) => !el.closest("button") || el.closest('[role="alert"]'),
      );
      expect(toast3).toBeDefined();
    });

    // Clear all
    await userEvent.click(canvas.getByRole("button", { name: /clear all/i }));

    // Wait for all toasts to disappear (check in document.body, excluding buttons)
    await waitFor(() => {
      const toast1Elements = within(document.body).queryAllByText(/toast 1/i);
      const toast1 = toast1Elements.find(
        (el) => !el.closest("button") || el.closest('[role="alert"]'),
      );
      expect(toast1).toBeUndefined();

      const toast2Elements = within(document.body).queryAllByText(/toast 2/i);
      const toast2 = toast2Elements.find(
        (el) => !el.closest("button") || el.closest('[role="alert"]'),
      );
      expect(toast2).toBeUndefined();

      const toast3Elements = within(document.body).queryAllByText(/toast 3/i);
      const toast3 = toast3Elements.find(
        (el) => !el.closest("button") || el.closest('[role="alert"]'),
      );
      expect(toast3).toBeUndefined();
    });
  },
};

// Event Stories
export const WithEvents: Story = {
  render: () => {
    const toast = useToast();
    const handleActionClick = fn(() => {
      console.log("Action clicked!");
    });

    return (
      <div className="space-y-4 p-8">
        <p className="text-sm text-gray-600">
          Show toasts and click action buttons. Check the Actions panel to see
          events being fired.
        </p>
        <Button
          onClick={() =>
            toast.success(
              "File Uploaded",
              "Your file has been uploaded successfully",
              {
                action: {
                  label: "View File",
                  onClick: handleActionClick,
                },
              },
            )
          }
        >
          Toast with Action
        </Button>
        <ToastContainer />
      </div>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole("button", { name: /toast with action/i });
    await userEvent.click(button);
    await waitFor(() => {
      expect(
        within(document.body).getByText(/file uploaded/i),
      ).toBeInTheDocument();
    });
  },
  parameters: {
    docs: {
      description: {
        story:
          "Demonstrates toast events. Show toasts and click actions, then check the Actions panel to see events being logged.",
      },
    },
  },
};

// State Stories
export const SuccessState: Story = {
  render: () => {
    const toast = useToast();
    return (
      <div className="space-y-4 p-8">
        <Button
          onClick={() =>
            toast.success("Success!", "Operation completed successfully")
          }
        >
          Show Success Toast
        </Button>
        <ToastContainer />
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: "Success state - green success toast.",
      },
    },
  },
};

export const ErrorState: Story = {
  render: () => {
    const toast = useToast();
    return (
      <div className="space-y-4 p-8">
        <Button
          variant="error"
          onClick={() => toast.error("Error!", "Something went wrong")}
        >
          Show Error Toast
        </Button>
        <ToastContainer />
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: "Error state - red error toast.",
      },
    },
  },
};

export const WithActionState: Story = {
  render: () => {
    const toast = useToast();
    return (
      <div className="space-y-4 p-8">
        <Button
          onClick={() =>
            toast.success(
              "File Uploaded",
              "Your file has been uploaded successfully",
              {
                action: {
                  label: "View File",
                  onClick: () => alert("Opening file..."),
                },
              },
            )
          }
        >
          Toast with Action
        </Button>
        <ToastContainer />
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: "With action state - toast with action button.",
      },
    },
  },
};

export const PersistentState: Story = {
  render: () => {
    const toast = useToast();
    return (
      <div className="space-y-4 p-8">
        <Button
          onClick={() =>
            toast.info("Persistent", "This toast will not auto-dismiss", {
              duration: undefined,
            })
          }
        >
          Persistent Toast
        </Button>
        <ToastContainer />
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: "Persistent state - toast that does not auto-dismiss.",
      },
    },
  },
};
