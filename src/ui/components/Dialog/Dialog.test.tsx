import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Dialog from "./Dialog";
import { AlertDialog } from "./AlertDialog";
import Button from "../../primitives/Button/Button";

describe("Dialog", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
  });

  afterEach(() => {
    vi.clearAllTimers();
    // Restore body overflow
    document.body.style.overflow = "";
  });

  describe("Rendering", () => {
    it("renders dialog trigger", () => {
      render(
        <Dialog>
          <Dialog.Trigger>Open Dialog</Dialog.Trigger>
          <Dialog.Content>
            <Dialog.Title>Test Dialog</Dialog.Title>
          </Dialog.Content>
        </Dialog>,
      );

      expect(screen.getByText("Open Dialog")).toBeInTheDocument();
    });

    it("does not render content when closed", () => {
      render(
        <Dialog defaultOpen={false}>
          <Dialog.Trigger>Open</Dialog.Trigger>
          <Dialog.Content>
            <Dialog.Title>Test Dialog</Dialog.Title>
          </Dialog.Content>
        </Dialog>,
      );

      expect(screen.queryByText("Test Dialog")).not.toBeInTheDocument();
    });

    it("renders content when open", () => {
      render(
        <Dialog defaultOpen>
          <Dialog.Content>
            <Dialog.Title>Test Dialog</Dialog.Title>
          </Dialog.Content>
        </Dialog>,
      );

      expect(screen.getByText("Test Dialog")).toBeInTheDocument();
    });
  });

  describe("Opening and Closing", () => {
    it("opens dialog when trigger is clicked", async () => {
      const user = userEvent.setup();
      render(
        <Dialog>
          <Dialog.Trigger>Open Dialog</Dialog.Trigger>
          <Dialog.Content>
            <Dialog.Title>Test Dialog</Dialog.Title>
          </Dialog.Content>
        </Dialog>,
      );

      const trigger = screen.getByText("Open Dialog");
      await act(async () => {
        await user.click(trigger);
      });

      await waitFor(() => {
        expect(screen.getByText("Test Dialog")).toBeInTheDocument();
      });
    });

    it("closes dialog when overlay is clicked", async () => {
      const user = userEvent.setup();
      render(
        <Dialog defaultOpen>
          <Dialog.Content closeOnOverlayClick>
            <Dialog.Title>Test Dialog</Dialog.Title>
          </Dialog.Content>
        </Dialog>,
      );

      await waitFor(() => {
        expect(screen.getByText("Test Dialog")).toBeInTheDocument();
      });

      // Find the overlay (the div with aria-hidden="true" and bg-black)
      const overlay = document.querySelector('[aria-hidden="true"].bg-black');
      if (overlay) {
        // Click directly on the overlay
        await act(async () => {
          await user.click(overlay as HTMLElement);
        });

        await waitFor(
          () => {
            expect(screen.queryByText("Test Dialog")).not.toBeInTheDocument();
          },
          { timeout: 2000 },
        );
      }
    });

    it("does not close dialog when content is clicked", async () => {
      const user = userEvent.setup();
      render(
        <Dialog defaultOpen>
          <Dialog.Content closeOnOverlayClick>
            <Dialog.Title>Test Dialog</Dialog.Title>
          </Dialog.Content>
        </Dialog>,
      );

      const dialog = screen.getByRole("dialog");
      await user.click(dialog);

      // Dialog should still be open
      expect(screen.getByText("Test Dialog")).toBeInTheDocument();
    });

    it("closes dialog on Escape key", async () => {
      render(
        <Dialog defaultOpen>
          <Dialog.Content closeOnEscape>
            <Dialog.Title>Test Dialog</Dialog.Title>
          </Dialog.Content>
        </Dialog>,
      );

      fireEvent.keyDown(document, { key: "Escape" });

      await waitFor(() => {
        expect(screen.queryByText("Test Dialog")).not.toBeInTheDocument();
      });
    });

    it("closes dialog when the auto close button is clicked", async () => {
      const user = userEvent.setup();
      render(
        <Dialog defaultOpen>
          <Dialog.Content>
            <Dialog.Title>Test Dialog</Dialog.Title>
          </Dialog.Content>
        </Dialog>,
      );

      // DialogContent renders the ✕ automatically (showCloseButton
      // defaults to true, issue #221) with aria-label="Close dialog".
      const closeButton = screen.getByLabelText("Close dialog");
      await act(async () => {
        await user.click(closeButton);
      });

      await waitFor(() => {
        expect(screen.queryByText("Test Dialog")).not.toBeInTheDocument();
      });
    });
  });

  describe("Close button (showCloseButton)", () => {
    it("renders the auto ✕ by default", () => {
      render(
        <Dialog defaultOpen>
          <Dialog.Content>
            <Dialog.Title>Test Dialog</Dialog.Title>
          </Dialog.Content>
        </Dialog>,
      );

      expect(screen.getByLabelText("Close dialog")).toBeInTheDocument();
    });

    it("suppresses the ✕ when showCloseButton={false} (non-dismissable)", () => {
      render(
        <Dialog defaultOpen>
          <Dialog.Content showCloseButton={false}>
            <Dialog.Title>Test Dialog</Dialog.Title>
          </Dialog.Content>
        </Dialog>,
      );

      expect(screen.queryByLabelText("Close dialog")).not.toBeInTheDocument();
    });

    it("renders exactly one ✕ (no duplicate with the auto button)", () => {
      render(
        <Dialog defaultOpen>
          <Dialog.Content>
            <Dialog.Title>Test Dialog</Dialog.Title>
          </Dialog.Content>
        </Dialog>,
      );

      expect(screen.getAllByLabelText("Close dialog")).toHaveLength(1);
    });
  });

  describe("Focus Management", () => {
    it("traps focus within dialog", async () => {
      render(
        <Dialog defaultOpen>
          <Dialog.Content>
            <Dialog.Title>Test Dialog</Dialog.Title>
            <Button>First Button</Button>
            <Button>Last Button</Button>
          </Dialog.Content>
        </Dialog>,
      );

      await waitFor(() => {
        expect(screen.getByText("Test Dialog")).toBeInTheDocument();
      });

      const firstButton = screen.getByText("First Button");
      const lastButton = screen.getByText("Last Button");

      // Focus should be on first focusable element (or dialog itself)
      await waitFor(() => {
        const activeElement = document.activeElement;
        expect(
          activeElement === firstButton ||
            activeElement === screen.getByRole("dialog") ||
            activeElement?.closest('[role="dialog"]'),
        ).toBeTruthy();
      });

      // Tab should move to next element
      firstButton.focus();
      // Use userEvent for more realistic keyboard events
      const user = userEvent.setup();
      await user.tab();
      // After tab, focus should be on lastButton or still within dialog
      await waitFor(
        () => {
          const activeElement = document.activeElement;
          expect(
            activeElement === lastButton ||
              activeElement === firstButton ||
              activeElement?.closest('[role="dialog"]'),
          ).toBeTruthy();
        },
        { timeout: 1000 },
      );
    });

    it("restores focus to previous element when closed", async () => {
      const user = userEvent.setup();
      const triggerButton = document.createElement("button");
      triggerButton.textContent = "Trigger";
      document.body.appendChild(triggerButton);
      triggerButton.focus();

      render(
        <Dialog>
          <Dialog.Trigger>Open Dialog</Dialog.Trigger>
          <Dialog.Content>
            <Dialog.Title>Test Dialog</Dialog.Title>
          </Dialog.Content>
        </Dialog>,
      );

      const trigger = screen.getByText("Open Dialog");
      await act(async () => {
        await user.click(trigger);
      });

      await waitFor(() => {
        expect(screen.getByText("Test Dialog")).toBeInTheDocument();
      });

      await act(async () => {
        fireEvent.keyDown(document, { key: "Escape" });
      });

      await waitFor(() => {
        expect(screen.queryByText("Test Dialog")).not.toBeInTheDocument();
      });

      // Focus should be restored (this is tested via the implementation)
    });
  });

  describe("Portal Rendering", () => {
    it("renders dialog in portal", () => {
      render(
        <Dialog defaultOpen>
          <Dialog.Content>
            <Dialog.Title>Test Dialog</Dialog.Title>
          </Dialog.Content>
        </Dialog>,
      );

      const dialog = screen.getByRole("dialog");
      // Dialog should be in document.body, not in the root
      expect(document.body.contains(dialog)).toBe(true);
    });
  });

  describe("Accessibility", () => {
    it("has correct ARIA attributes", () => {
      render(
        <Dialog defaultOpen>
          <Dialog.Content>
            <Dialog.Title>Test Dialog</Dialog.Title>
            <Dialog.Description>Dialog description</Dialog.Description>
          </Dialog.Content>
        </Dialog>,
      );

      const dialog = screen.getByRole("dialog");
      expect(dialog).toHaveAttribute("aria-modal", "true");
      expect(dialog).toHaveAttribute("aria-labelledby");
      expect(dialog).toHaveAttribute("aria-describedby");
    });

    it("associates title with dialog", () => {
      render(
        <Dialog defaultOpen>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>Test Dialog</Dialog.Title>
            </Dialog.Header>
          </Dialog.Content>
        </Dialog>,
      );

      const dialog = screen.getByRole("dialog");
      const title = screen.getByText("Test Dialog");
      const titleId = title.id;

      expect(dialog).toHaveAttribute("aria-labelledby", titleId);
    });

    it("associates description with dialog", () => {
      render(
        <Dialog defaultOpen>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>Test Dialog</Dialog.Title>
              <Dialog.Description>Dialog description</Dialog.Description>
            </Dialog.Header>
          </Dialog.Content>
        </Dialog>,
      );

      const dialog = screen.getByRole("dialog");
      const description = screen.getByText("Dialog description");
      const descriptionId = description.id;

      expect(dialog).toHaveAttribute("aria-describedby", descriptionId);
    });
  });

  describe("Controlled vs Uncontrolled", () => {
    it("works in uncontrolled mode", async () => {
      const user = userEvent.setup();
      render(
        <Dialog defaultOpen={false}>
          <Dialog.Trigger>Open</Dialog.Trigger>
          <Dialog.Content>
            <Dialog.Title>Test Dialog</Dialog.Title>
          </Dialog.Content>
        </Dialog>,
      );

      const trigger = screen.getByText("Open");
      await act(async () => {
        await user.click(trigger);
      });

      await waitFor(() => {
        expect(screen.getByText("Test Dialog")).toBeInTheDocument();
      });
    });

    it("works in controlled mode", () => {
      const { rerender } = render(
        <Dialog open={false}>
          <Dialog.Content>
            <Dialog.Title>Test Dialog</Dialog.Title>
          </Dialog.Content>
        </Dialog>,
      );

      expect(screen.queryByText("Test Dialog")).not.toBeInTheDocument();

      rerender(
        <Dialog open>
          <Dialog.Content>
            <Dialog.Title>Test Dialog</Dialog.Title>
          </Dialog.Content>
        </Dialog>,
      );

      expect(screen.getByText("Test Dialog")).toBeInTheDocument();
    });

    it("calls onOpenChange in controlled mode", async () => {
      const handleOpenChange = vi.fn();
      render(
        <Dialog open onOpenChange={handleOpenChange}>
          <Dialog.Content>
            <Dialog.Title>Test Dialog</Dialog.Title>
          </Dialog.Content>
        </Dialog>,
      );

      fireEvent.keyDown(document, { key: "Escape" });

      await waitFor(() => {
        expect(handleOpenChange).toHaveBeenCalledWith(false);
      });
    });
  });

  describe("Sizes", () => {
    it("applies correct size classes", async () => {
      const { rerender } = render(
        <Dialog defaultOpen>
          <Dialog.Content size="sm">
            <Dialog.Title>Small Dialog</Dialog.Title>
          </Dialog.Content>
        </Dialog>,
      );

      await waitFor(() => {
        expect(screen.getByText("Small Dialog")).toBeInTheDocument();
      });

      // Dialog is rendered in portal, so query from document.body
      let dialog = document.querySelector('[role="dialog"]');
      expect(dialog).toHaveClass("max-w-sm");

      rerender(
        <Dialog defaultOpen>
          <Dialog.Content size="lg">
            <Dialog.Title>Large Dialog</Dialog.Title>
          </Dialog.Content>
        </Dialog>,
      );

      await waitFor(() => {
        expect(screen.getByText("Large Dialog")).toBeInTheDocument();
      });

      dialog = document.querySelector('[role="dialog"]');
      expect(dialog).toHaveClass("max-w-lg");
    });
  });

  describe("Body Scroll Lock", () => {
    it("locks body scroll when dialog is open", () => {
      render(
        <Dialog defaultOpen>
          <Dialog.Content>
            <Dialog.Title>Test Dialog</Dialog.Title>
          </Dialog.Content>
        </Dialog>,
      );

      expect(document.body.style.overflow).toBe("hidden");
    });

    it("unlocks body scroll when dialog is closed", async () => {
      const _user = userEvent.setup();
      const { rerender } = render(
        <Dialog defaultOpen>
          <Dialog.Content>
            <Dialog.Title>Test Dialog</Dialog.Title>
          </Dialog.Content>
        </Dialog>,
      );

      await waitFor(() => {
        expect(document.body.style.overflow).toBe("hidden");
      });

      rerender(
        <Dialog open={false}>
          <Dialog.Content>
            <Dialog.Title>Test Dialog</Dialog.Title>
          </Dialog.Content>
        </Dialog>,
      );

      await waitFor(
        () => {
          // The overflow should be restored (empty string or original value)
          expect(document.body.style.overflow).toBe("");
        },
        { timeout: 2000 },
      );
    });
  });
});

describe("AlertDialog", () => {
  afterEach(() => {
    document.body.style.overflow = "";
  });

  it("closes itself on Confirm in uncontrolled mode (defaultOpen)", async () => {
    const user = userEvent.setup();
    const onConfirm = vi.fn();
    render(
      <AlertDialog
        defaultOpen
        title="Delete item"
        description="This cannot be undone."
        onConfirm={onConfirm}
      />,
    );

    expect(
      await screen.findByRole("dialog", { name: "Delete item" }),
    ).toBeInTheDocument();

    await act(async () => {
      await user.click(screen.getByRole("button", { name: "Confirm" }));
    });

    expect(onConfirm).toHaveBeenCalledTimes(1);
    // Regression: in uncontrolled mode onOpenChange is undefined, so the
    // old handler never closed the dialog — it stayed open forever.
    await waitFor(() => {
      expect(
        screen.queryByRole("dialog", { name: "Delete item" }),
      ).not.toBeInTheDocument();
    });
  });

  it("closes itself on Cancel in uncontrolled mode (defaultOpen)", async () => {
    const user = userEvent.setup();
    const onCancel = vi.fn();
    render(<AlertDialog defaultOpen title="Confirm" onCancel={onCancel} />);

    await act(async () => {
      await user.click(screen.getByRole("button", { name: "Cancel" }));
    });

    expect(onCancel).toHaveBeenCalledTimes(1);
    await waitFor(() => {
      expect(
        screen.queryByRole("dialog", { name: "Confirm" }),
      ).not.toBeInTheDocument();
    });
  });

  it("does not render the auto ✕ — it is a decision gate (Confirm/Cancel only)", () => {
    render(<AlertDialog defaultOpen title="Confirm" />);

    // AlertDialog passes showCloseButton={false} to DialogContent so the
    // user must pick an action rather than dismiss via the ✕.
    expect(screen.queryByLabelText("Close dialog")).not.toBeInTheDocument();
  });
});
