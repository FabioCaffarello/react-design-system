import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import Modal from "./Modal";
import { Button, Text } from "../../atoms";

const meta: Meta<typeof Modal> = {
  title: "Organisms/Modal",
  component: Modal,
  parameters: {
    docs: {
      description: {
        component: "A modal/dialog component with overlay, portal rendering, focus trap, and accessibility. Supports multiple sizes and custom footers.",
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

const ModalWrapper = ({ children, ...args }: any) => {
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

export default meta;
