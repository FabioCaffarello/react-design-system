import { render, screen, waitFor, act } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import userEvent from "@testing-library/user-event";
import TableActions from "./TableActions";

describe("TableActions", () => {
  it("renders actions button", () => {
    const actions = [
      {
        label: "Edit",
        onClick: vi.fn(),
      },
    ];

    render(<TableActions actions={actions} row={{ id: "1" }} />);

    expect(screen.getByLabelText("Row actions")).toBeInTheDocument();
  });

  it("opens dropdown when clicked", async () => {
    const user = userEvent.setup();
    const actions = [
      {
        label: "Edit",
        onClick: vi.fn(),
      },
    ];

    render(<TableActions actions={actions} row={{ id: "1" }} />);

    const button = screen.getByLabelText("Row actions");
    await act(async () => {
      await user.click(button);
    });

    await waitFor(() => {
      expect(screen.getByText("Edit")).toBeInTheDocument();
    });
  });

  it("calls onClick when action is clicked", async () => {
    const user = userEvent.setup();
    const row = { id: "1", name: "Test" };
    const onClick = vi.fn();
    const actions = [
      {
        label: "Edit",
        onClick,
      },
    ];

    render(<TableActions actions={actions} row={row} />);

    const button = screen.getByLabelText("Row actions");
    await act(async () => {
      await user.click(button);
    });

    await waitFor(() => {
      expect(screen.getByText("Edit")).toBeInTheDocument();
    });

    const editButton = screen.getByText("Edit");
    await act(async () => {
      await user.click(editButton);
    });

    expect(onClick).toHaveBeenCalledWith(row);
  });
});
