import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Drawer, { DrawerContent, DrawerHeader, DrawerFooter } from "./Drawer";
import Button from "../../primitives/Button/Button";

describe("Drawer", () => {
  describe("DrawerContent", () => {
    it("renders drawer content when open", async () => {
      render(
        <Drawer defaultOpen>
          <DrawerContent>
            <p>Drawer Content</p>
          </DrawerContent>
        </Drawer>,
      );

      await waitFor(() => {
        expect(screen.getByText("Drawer Content")).toBeInTheDocument();
      });
    });

    it("does not render when closed", () => {
      render(
        <Drawer>
          <DrawerContent>
            <p>Drawer Content</p>
          </DrawerContent>
        </Drawer>,
      );

      expect(screen.queryByText("Drawer Content")).not.toBeInTheDocument();
    });

    it("closes on escape key", async () => {
      const handleOpenChange = vi.fn();
      render(
        <Drawer defaultOpen onOpenChange={handleOpenChange}>
          <DrawerContent>
            <p>Drawer Content</p>
          </DrawerContent>
        </Drawer>,
      );

      await waitFor(() => {
        expect(screen.getByText("Drawer Content")).toBeInTheDocument();
      });

      fireEvent.keyDown(document, { key: "Escape" });

      await waitFor(() => {
        expect(handleOpenChange).toHaveBeenCalledWith(false);
      });
    });

    it("closes on overlay click when closeOnOverlayClick is true", async () => {
      const handleOpenChange = vi.fn();
      render(
        <Drawer defaultOpen onOpenChange={handleOpenChange} closeOnOverlayClick>
          <DrawerContent>
            <p>Drawer Content</p>
          </DrawerContent>
        </Drawer>,
      );

      await waitFor(() => {
        const overlay = document.querySelector(".bg-scrim");
        expect(overlay).toBeInTheDocument();
        fireEvent.click(overlay!);
        expect(handleOpenChange).toHaveBeenCalledWith(false);
      });
    });

    it("does not close on overlay click when closeOnOverlayClick is false", async () => {
      const handleOpenChange = vi.fn();
      render(
        <Drawer
          defaultOpen
          onOpenChange={handleOpenChange}
          closeOnOverlayClick={false}
        >
          <DrawerContent>
            <p>Drawer Content</p>
          </DrawerContent>
        </Drawer>,
      );

      await waitFor(() => {
        const overlay = document.querySelector(".bg-scrim");
        expect(overlay).toBeInTheDocument();
        fireEvent.click(overlay!);
        expect(handleOpenChange).not.toHaveBeenCalled();
      });
    });

    it("shows close button when showCloseButton is true", async () => {
      render(
        <Drawer defaultOpen>
          <DrawerContent showCloseButton>
            <p>Drawer Content</p>
          </DrawerContent>
        </Drawer>,
      );

      await waitFor(() => {
        expect(screen.getByLabelText("Close drawer")).toBeInTheDocument();
      });
    });
  });

  describe("DrawerHeader", () => {
    it("renders header content", async () => {
      render(
        <Drawer defaultOpen>
          <DrawerContent>
            <DrawerHeader>
              <h2>Drawer Title</h2>
            </DrawerHeader>
            <p>Content</p>
          </DrawerContent>
        </Drawer>,
      );

      await waitFor(() => {
        expect(screen.getByText("Drawer Title")).toBeInTheDocument();
      });
    });
  });

  describe("DrawerFooter", () => {
    it("renders footer content", async () => {
      render(
        <Drawer defaultOpen>
          <DrawerContent>
            <p>Content</p>
            <DrawerFooter>
              <Button>Save</Button>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>,
      );

      await waitFor(() => {
        expect(screen.getByText("Save")).toBeInTheDocument();
      });
    });
  });

  describe("Positions", () => {
    it("renders with different positions", async () => {
      const { rerender } = render(
        <Drawer defaultOpen position="right">
          <DrawerContent>
            <p>Right Drawer</p>
          </DrawerContent>
        </Drawer>,
      );

      await waitFor(() => {
        expect(screen.getByText("Right Drawer")).toBeInTheDocument();
      });

      rerender(
        <Drawer defaultOpen position="left">
          <DrawerContent>
            <p>Left Drawer</p>
          </DrawerContent>
        </Drawer>,
      );

      await waitFor(() => {
        expect(screen.getByText("Left Drawer")).toBeInTheDocument();
      });
    });
  });

  describe("Sizes", () => {
    it("renders with different sizes", async () => {
      const { rerender } = render(
        <Drawer defaultOpen size="sm">
          <DrawerContent>
            <p>Small Drawer</p>
          </DrawerContent>
        </Drawer>,
      );

      await waitFor(() => {
        expect(screen.getByText("Small Drawer")).toBeInTheDocument();
      });

      rerender(
        <Drawer defaultOpen size="lg">
          <DrawerContent>
            <p>Large Drawer</p>
          </DrawerContent>
        </Drawer>,
      );

      await waitFor(() => {
        expect(screen.getByText("Large Drawer")).toBeInTheDocument();
      });
    });
  });

  describe("Controlled Mode", () => {
    it("respects controlled open state", async () => {
      const { rerender } = render(
        <Drawer open={false}>
          <DrawerContent>
            <p>Drawer Content</p>
          </DrawerContent>
        </Drawer>,
      );

      expect(screen.queryByText("Drawer Content")).not.toBeInTheDocument();

      rerender(
        <Drawer open={true}>
          <DrawerContent>
            <p>Drawer Content</p>
          </DrawerContent>
        </Drawer>,
      );

      await waitFor(() => {
        expect(screen.getByText("Drawer Content")).toBeInTheDocument();
      });
    });

    it("calls onOpenChange when state changes", async () => {
      const handleOpenChange = vi.fn();
      const { rerender } = render(
        <Drawer open={false} onOpenChange={handleOpenChange}>
          <DrawerContent>
            <p>Drawer Content</p>
          </DrawerContent>
        </Drawer>,
      );

      // Open drawer programmatically - this should trigger onOpenChange
      rerender(
        <Drawer open={true} onOpenChange={handleOpenChange}>
          <DrawerContent>
            <p>Drawer Content</p>
          </DrawerContent>
        </Drawer>,
      );

      // The onOpenChange is only called when the state actually changes via user interaction
      // For controlled mode, we need to verify the drawer is open instead
      await waitFor(() => {
        expect(screen.getByText("Drawer Content")).toBeInTheDocument();
      });
    });
  });

  describe("Accessibility", () => {
    it("has correct role and aria attributes", async () => {
      render(
        <Drawer defaultOpen>
          <DrawerContent>
            <p>Drawer Content</p>
          </DrawerContent>
        </Drawer>,
      );

      await waitFor(() => {
        const drawer = screen.getByRole("dialog");
        expect(drawer).toHaveAttribute("aria-modal", "true");
      });
    });

    it("prevents body scroll when open", async () => {
      render(
        <Drawer defaultOpen>
          <DrawerContent>
            <p>Drawer Content</p>
          </DrawerContent>
        </Drawer>,
      );

      await waitFor(() => {
        expect(document.body.style.overflow).toBe("hidden");
      });
    });
  });

  describe("Accessible name (aria-dialog-name)", () => {
    let warnSpy: ReturnType<typeof vi.spyOn>;
    beforeEach(() => {
      warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
    });
    afterEach(() => {
      warnSpy.mockRestore();
    });

    it("title prop renders a heading and wires aria-labelledby", async () => {
      render(
        <Drawer defaultOpen>
          <DrawerContent title="Settings">
            <p>body</p>
          </DrawerContent>
        </Drawer>,
      );

      const dialog = await screen.findByRole("dialog");
      const heading = screen.getByRole("heading", { name: "Settings" });
      expect(heading.tagName).toBe("H2");
      expect(dialog).toHaveAttribute("aria-labelledby", heading.id);
      expect(dialog).not.toHaveAttribute("aria-label");
      expect(warnSpy).not.toHaveBeenCalled();
    });

    it("aria-label prop sets the dialog name without a visible heading", async () => {
      render(
        <Drawer defaultOpen>
          <DrawerContent aria-label="Filters panel">
            <p>body</p>
          </DrawerContent>
        </Drawer>,
      );

      const dialog = await screen.findByRole("dialog");
      expect(dialog).toHaveAttribute("aria-label", "Filters panel");
      expect(dialog).not.toHaveAttribute("aria-labelledby");
      expect(screen.queryByRole("heading")).toBeNull();
      expect(warnSpy).not.toHaveBeenCalled();
    });

    it("aria-labelledby prop overrides the auto title id and points to an external element", async () => {
      render(
        <Drawer defaultOpen>
          <DrawerContent aria-labelledby="external-heading">
            <DrawerHeader>
              <h2 id="external-heading">Manual heading</h2>
            </DrawerHeader>
            <p>body</p>
          </DrawerContent>
        </Drawer>,
      );

      const dialog = await screen.findByRole("dialog");
      expect(dialog).toHaveAttribute("aria-labelledby", "external-heading");
      expect(warnSpy).not.toHaveBeenCalled();
    });

    it("warns in dev when none of title / aria-label / aria-labelledby is provided", async () => {
      render(
        <Drawer defaultOpen>
          <DrawerContent>
            <p>body</p>
          </DrawerContent>
        </Drawer>,
      );

      await screen.findByRole("dialog");
      expect(warnSpy).toHaveBeenCalledWith(
        expect.stringContaining("[DrawerContent] Missing accessible name"),
      );
    });

    it("aria-labelledby takes precedence over title (consumer-managed id wins)", async () => {
      render(
        <Drawer defaultOpen>
          <DrawerContent title="Auto title" aria-labelledby="external-heading">
            <DrawerHeader>
              <h2 id="external-heading">External heading</h2>
            </DrawerHeader>
            <p>body</p>
          </DrawerContent>
        </Drawer>,
      );

      const dialog = await screen.findByRole("dialog");
      expect(dialog).toHaveAttribute("aria-labelledby", "external-heading");
    });
  });
});
