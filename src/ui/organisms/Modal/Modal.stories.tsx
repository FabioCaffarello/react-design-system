import type { Meta, StoryObj } from "@storybook/react";
import { fn } from '@storybook/test';
import { expect, userEvent, within, waitFor } from '@storybook/test';
import { useState } from "react";
import Modal from "./Modal";
import { Button, Text } from "../../atoms";

const meta: Meta<typeof Modal> = {
  title: "Organisms/Modal",
  component: Modal,
  parameters: {
    docs: {
      description: {
        component: `
## Modal

A modal/dialog component with overlay, portal rendering, focus trap, and accessibility. Supports multiple sizes and custom footers.

### State Machine

\`\`\`mermaid
stateDiagram-v2
    [*] --> Closed
    Closed --> Open: onClick / setIsOpen(true)
    Open --> Closed: onClose / setIsOpen(false)
    Open --> Closed: onClick overlay
    Open --> Closed: onEscape key
    Open --> Closed: onClick close button
    Closed --> [*]
\`\`\`

### Events

| Event | Description | Parameters | When Fired |
|-------|-------------|------------|------------|
| \`onClose\` | Modal fechado | \`() => void\` | Quando o modal é fechado (botão X, overlay, ou Escape) |

### States

| State | Description | How to Activate | Visual |
|-------|-------------|-----------------|--------|
| \`closed\` | Modal fechado | Estado inicial | Modal não visível |
| \`open\` | Modal aberto | \`isOpen={true}\` | Modal visível com overlay |
| \`default\` | Tamanho padrão | \`variant="default"\` ou padrão | Modal com largura padrão |
| \`large\` | Tamanho grande | \`variant="large"\` | Modal com largura maior |
| \`fullscreen\` | Tela cheia | \`variant="fullscreen"\` | Modal ocupando toda a tela |
| \`with-close-button\` | Com botão fechar | \`showCloseButton={true}\` ou padrão | Botão X visível |
| \`without-close-button\` | Sem botão fechar | \`showCloseButton={false}\` | Botão X oculto |
        `,
      },
    },
  },
  argTypes: {
    isOpen: {
      control: "boolean",
      description: "Whether the modal is open",
    },
    variant: {
      control: "select",
      options: ["default", "large", "fullscreen"],
      description: "Size variant of the modal",
    },
    showCloseButton: {
      control: "boolean",
      description: "Whether to show the close button",
    },
  },
};

const ModalWrapper = ({ children, ...args }: { children?: React.ReactNode; [key: string]: unknown }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Open Modal</Button>
      <Modal {...args} isOpen={isOpen} onClose={() => setIsOpen(false)}>
        {children}
      </Modal>
    </>
  );
};

export const Default: StoryObj<typeof Modal> = {
  render: () => (
    <ModalWrapper title="Confirm Action">
      <Text as="p">Are you sure you want to proceed with this action?</Text>
    </ModalWrapper>
  ),
};

export const WithFooter: StoryObj<typeof Modal> = {
  render: () => (
    <ModalWrapper
      title="Delete Epic"
      footer={
        <>
          <Button variant="secondary" onClick={() => {}}>
            Cancel
          </Button>
          <Button variant="error" onClick={() => {}}>
            Delete
          </Button>
        </>
      }
    >
      <Text as="p">This action cannot be undone. Are you sure you want to delete this epic?</Text>
    </ModalWrapper>
  ),
};

export const Large: StoryObj<typeof Modal> = {
  render: () => (
    <ModalWrapper title="Large Modal" variant="large">
      <Text as="p" className="mb-4">
        This is a large modal that can accommodate more content.
      </Text>
      <div className="space-y-2">
        <Text as="p">You can add forms, tables, or any other content here.</Text>
      </div>
    </ModalWrapper>
  ),
};

export const WithoutTitle: StoryObj<typeof Modal> = {
  render: () => (
    <ModalWrapper>
      <Text as="p">This modal doesn't have a title, but still has a close button.</Text>
    </ModalWrapper>
  ),
};

export const WithoutCloseButton: StoryObj<typeof Modal> = {
  render: () => (
    <ModalWrapper title="No Close Button" showCloseButton={false}>
      <Text as="p">This modal doesn't have a close button. Users must use the footer actions.</Text>
    </ModalWrapper>
  ),
};

// Event Stories
export const WithEvents: StoryObj<typeof Modal> = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);
    const handleClose = fn(() => {
      setIsOpen(false);
    });
    
    return (
      <div className="space-y-4">
        <p className="text-sm text-gray-600">
          Open the modal and close it. Check the Actions panel to see events being fired.
        </p>
        <Button onClick={() => setIsOpen(true)}>Open Modal</Button>
        <Modal isOpen={isOpen} onClose={handleClose} title="Event Demo">
          <Text as="p">This modal fires events when closed.</Text>
        </Modal>
      </div>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole('button', { name: /Open Modal/i });
    await userEvent.click(button);
    // Modal renders in a portal (document.body), so search there
    await waitFor(() => {
      const title = within(document.body).getByText('Event Demo');
      expect(title).toBeInTheDocument();
    }, { timeout: 3000 });
  },
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates modal events. Open and close the modal, then check the Actions panel to see events being logged.',
      },
    },
  },
};

// State Stories
export const ClosedState: StoryObj<typeof Modal> = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);
    return (
      <>
        <Button onClick={() => setIsOpen(true)}>Open Modal</Button>
        <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Closed Modal">
          <Text as="p">This modal is closed by default.</Text>
        </Modal>
      </>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Closed state - modal is not visible.',
      },
    },
  },
};

export const OpenState: StoryObj<typeof Modal> = {
  render: () => {
    const [isOpen, setIsOpen] = useState(true);
    return (
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Open Modal">
        <Text as="p">This modal is open by default.</Text>
      </Modal>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Open state - modal is visible.',
      },
    },
  },
};

export const DefaultVariantState: StoryObj<typeof Modal> = {
  render: () => {
    const [isOpen, setIsOpen] = useState(true);
    return (
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Default Size" variant="default">
        <Text as="p">This modal has the default size variant.</Text>
      </Modal>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Default variant state - modal with standard width.',
      },
    },
  },
};

export const LargeVariantState: StoryObj<typeof Modal> = {
  render: () => {
    const [isOpen, setIsOpen] = useState(true);
    return (
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Large Modal" variant="large">
        <Text as="p">This modal has the large size variant.</Text>
      </Modal>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Large variant state - modal with larger width.',
      },
    },
  },
};

export const WithCloseButtonState: StoryObj<typeof Modal> = {
  render: () => {
    const [isOpen, setIsOpen] = useState(true);
    return (
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="With Close Button" showCloseButton>
        <Text as="p">This modal has a close button.</Text>
      </Modal>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'With close button state - modal includes a close button.',
      },
    },
  },
};

export const WithoutCloseButtonState: StoryObj<typeof Modal> = {
  render: () => {
    const [isOpen, setIsOpen] = useState(true);
    return (
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="No Close Button" showCloseButton={false}>
        <Text as="p">This modal does not have a close button. Use footer actions or click outside to close.</Text>
      </Modal>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Without close button state - modal has no X button.',
      },
    },
  },
};

export default meta;
