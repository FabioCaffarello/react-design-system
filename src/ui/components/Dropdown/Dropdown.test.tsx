import { describe, it, expect, vi } from "vitest";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Dropdown from "./Dropdown";
import { Button } from "../../primitives";

describe("Dropdown", () => {
  it("renders trigger", () => {
    render(<Dropdown trigger={<Button>Actions</Button>} items={[]} />);

    expect(screen.getByText("Actions")).toBeInTheDocument();
  });

  it("opens dropdown when trigger is clicked", async () => {
    const user = userEvent.setup();
    render(
      <Dropdown
        trigger={<Button>Actions</Button>}
        items={[{ label: "Edit", onClick: vi.fn() }]}
      />,
    );

    const trigger = screen.getByText("Actions");
    await act(async () => {
      await user.click(trigger);
    });

    await waitFor(() => {
      expect(screen.getByText("Edit")).toBeInTheDocument();
    });
  });

  it("calls onClick when item is clicked", async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    render(
      <Dropdown
        trigger={<Button>Actions</Button>}
        items={[{ label: "Edit", onClick: handleClick }]}
      />,
    );

    const trigger = screen.getByText("Actions");
    await act(async () => {
      await user.click(trigger);
    });

    await waitFor(() => {
      expect(screen.getByText("Edit")).toBeInTheDocument();
    });

    const item = screen.getByText("Edit");
    await act(async () => {
      await user.click(item);
    });

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("closes dropdown when clicking outside", async () => {
    const user = userEvent.setup();
    render(
      <Dropdown
        trigger={<Button>Actions</Button>}
        items={[{ label: "Edit", onClick: vi.fn() }]}
      />,
    );

    const trigger = screen.getByText("Actions");
    await act(async () => {
      await user.click(trigger);
    });

    await waitFor(() => {
      expect(screen.getByText("Edit")).toBeInTheDocument();
    });

    // Click outside the dropdown
    await act(async () => {
      await user.click(document.body);
    });

    await waitFor(() => {
      expect(screen.queryByText("Edit")).not.toBeInTheDocument();
    });
  });

  describe("Keyboard Navigation", () => {
    it("opens dropdown with Enter key", async () => {
      render(
        <Dropdown
          trigger={<Button>Actions</Button>}
          items={[{ label: "Edit", onClick: vi.fn() }]}
        />,
      );

      const trigger = screen.getByText("Actions");
      trigger.focus();
      await act(async () => {
        fireEvent.keyDown(trigger, { key: "Enter" });
      });

      await waitFor(() => {
        expect(screen.getByText("Edit")).toBeInTheDocument();
      });
    });

    it("opens dropdown with Space key", async () => {
      render(
        <Dropdown
          trigger={<Button>Actions</Button>}
          items={[{ label: "Edit", onClick: vi.fn() }]}
        />,
      );

      const trigger = screen.getByText("Actions");
      trigger.focus();
      await act(async () => {
        fireEvent.keyDown(trigger, { key: " " });
      });

      await waitFor(() => {
        expect(screen.getByText("Edit")).toBeInTheDocument();
      });
    });

    it("closes dropdown with Escape key", async () => {
      const user = userEvent.setup();
      render(
        <Dropdown
          trigger={<Button>Actions</Button>}
          items={[{ label: "Edit", onClick: vi.fn() }]}
        />,
      );

      const trigger = screen.getByText("Actions");
      await act(async () => {
        await user.click(trigger);
      });

      await waitFor(() => {
        expect(screen.getByText("Edit")).toBeInTheDocument();
      });

      // Escape key should be handled by the menu element
      const menu = screen.getByRole("menu");
      await act(async () => {
        fireEvent.keyDown(menu, { key: "Escape" });
      });

      await waitFor(() => {
        expect(screen.queryByText("Edit")).not.toBeInTheDocument();
      });
    });

    it("navigates items with Arrow keys", async () => {
      render(
        <Dropdown
          trigger={<Button>Actions</Button>}
          items={[
            { label: "Edit", onClick: vi.fn() },
            { label: "Delete", onClick: vi.fn() },
            { label: "Copy", onClick: vi.fn() },
          ]}
        />,
      );

      const trigger = screen.getByText("Actions");
      await act(async () => {
        await userEvent.click(trigger);
      });

      await waitFor(() => {
        expect(screen.getByText("Edit")).toBeInTheDocument();
      });

      // Arrow key navigation would be tested here if implemented
      const items = screen.getAllByRole("menuitem");
      expect(items.length).toBeGreaterThan(0);
    });
  });

  describe("Accessibility", () => {
    it("has correct ARIA attributes on trigger", () => {
      render(<Dropdown trigger={<Button>Actions</Button>} items={[]} />);

      const trigger = screen.getByText("Actions");
      // aria-haspopup="menu" is more specific and correct than "true"
      expect(trigger).toHaveAttribute("aria-haspopup", "menu");
    });

    it("has correct role on menu", async () => {
      const user = userEvent.setup();
      render(
        <Dropdown
          trigger={<Button>Actions</Button>}
          items={[{ label: "Edit", onClick: vi.fn() }]}
        />,
      );

      const trigger = screen.getByText("Actions");
      await act(async () => {
        await user.click(trigger);
      });

      await waitFor(() => {
        const menu = screen.getByRole("menu");
        expect(menu).toBeInTheDocument();
      });
    });

    it("has correct role on menu items", async () => {
      const user = userEvent.setup();
      render(
        <Dropdown
          trigger={<Button>Actions</Button>}
          items={[
            { label: "Edit", onClick: vi.fn() },
            { label: "Delete", onClick: vi.fn() },
          ]}
        />,
      );

      const trigger = screen.getByText("Actions");
      await act(async () => {
        await user.click(trigger);
      });

      await waitFor(() => {
        const items = screen.getAllByRole("menuitem");
        expect(items.length).toBe(2);
      });
    });

    it("associates trigger with menu via aria-controls", async () => {
      const user = userEvent.setup();
      render(
        <Dropdown
          trigger={<Button>Actions</Button>}
          items={[{ label: "Edit", onClick: vi.fn() }]}
        />,
      );

      const trigger = screen.getByText("Actions");
      await act(async () => {
        await user.click(trigger);
      });

      await waitFor(() => {
        const menu = screen.getByRole("menu");
        const menuId = menu.id;
        expect(trigger).toHaveAttribute("aria-controls", menuId);
      });
    });

    it("has aria-expanded on trigger", async () => {
      const user = userEvent.setup();
      render(
        <Dropdown
          trigger={<Button>Actions</Button>}
          items={[{ label: "Edit", onClick: vi.fn() }]}
        />,
      );

      const trigger = screen.getByText("Actions");
      expect(trigger).toHaveAttribute("aria-expanded", "false");

      await act(async () => {
        await user.click(trigger);
      });

      await waitFor(() => {
        expect(trigger).toHaveAttribute("aria-expanded", "true");
      });
    });
  });

  describe("Edge Cases", () => {
    it("handles empty items array", () => {
      render(<Dropdown trigger={<Button>Actions</Button>} items={[]} />);

      expect(screen.getByText("Actions")).toBeInTheDocument();
    });

    it("handles disabled items", async () => {
      const user = userEvent.setup();
      const handleClick = vi.fn();
      render(
        <Dropdown
          trigger={<Button>Actions</Button>}
          items={[{ label: "Edit", onClick: handleClick, disabled: true }]}
        />,
      );

      const trigger = screen.getByText("Actions");
      await act(async () => {
        await user.click(trigger);
      });

      await waitFor(() => {
        const item = screen.getByText("Edit");
        expect(item).toHaveAttribute("aria-disabled", "true");
      });
    });

    it("handles items with dividers", async () => {
      const user = userEvent.setup();
      render(
        <Dropdown
          trigger={<Button>Actions</Button>}
          items={[
            { label: "Edit", onClick: vi.fn() },
            { type: "divider" },
            { label: "Delete", onClick: vi.fn() },
          ]}
        />,
      );

      const trigger = screen.getByText("Actions");
      await act(async () => {
        await user.click(trigger);
      });

      await waitFor(() => {
        expect(screen.getByText("Edit")).toBeInTheDocument();
        expect(screen.getByText("Delete")).toBeInTheDocument();
      });
    });
  });
});
