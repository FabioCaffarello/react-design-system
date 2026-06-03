/**
 * CommandPalette Accessibility Tests
 *
 * Dedicated a11y test scaffold for CommandPalette — the Cmd+K command
 * launcher pattern. It's a HYBRID: an overlay (like Modal/Drawer) that
 * embeds a search input + filterable action list. The defining
 * contracts:
 *
 *   - ARIA Labels and Roles: opens on Cmd+K (and the trigger if
 *     provided); closes on Escape; the searchbox sits inside the
 *     overlay; each command is a button with the visible label as
 *     accessible name
 *   - Keyboard Navigation: ArrowUp/Down navigate filtered items;
 *     Enter activates the highlighted item; Escape closes
 *   - Focus Management: opening focuses the input; the rest of the
 *     palette is keyboard-reachable from there
 *   - Screen Reader Support: empty state announces an emptyMessage;
 *     each command's label is the AT-readable name (descriptions /
 *     keywords are filter sources, not names)
 *
 * Mirrors the structure of Header.accessibility.test.tsx as the
 * canonical scaffold for component-level a11y suites.
 */

import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CommandPalette, { type CommandItem } from "./CommandPalette";

const newFile = vi.fn();
const save = vi.fn();
const items: CommandItem[] = [
  { id: "1", label: "New file", action: newFile, keywords: ["create"] },
  { id: "2", label: "Save", action: save, group: "File" },
  { id: "3", label: "Quit", action: vi.fn() },
];

describe("CommandPalette Accessibility", () => {
  describe("ARIA Labels and Roles", () => {
    it("when open: search input is reachable as a textbox", () => {
      render(<CommandPalette items={items} defaultOpen />);

      expect(
        screen.getByPlaceholderText("Type a command or search..."),
      ).toBeInTheDocument();
    });

    it("each command renders as a button with the label as accessible name", () => {
      render(<CommandPalette items={items} defaultOpen />);

      expect(
        screen.getByRole("button", { name: /New file/i }),
      ).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /Save/i })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /Quit/i })).toBeInTheDocument();
    });
  });

  describe("Keyboard Navigation", () => {
    it("Enter on default-highlighted (index 0) item activates its action", async () => {
      const user = userEvent.setup();
      newFile.mockClear();
      render(<CommandPalette items={items} defaultOpen />);

      const input = screen.getByPlaceholderText("Type a command or search...");
      await act(async () => {
        input.focus();
      });
      // The default selectedIndex is 0; pressing Enter activates the
      // first filtered item (New file).
      await act(async () => {
        await user.keyboard("{Enter}");
      });

      expect(newFile).toHaveBeenCalledTimes(1);
    });

    it("ArrowDown then Enter activates the second item", async () => {
      const user = userEvent.setup();
      save.mockClear();
      render(<CommandPalette items={items} defaultOpen />);

      const input = screen.getByPlaceholderText("Type a command or search...");
      await act(async () => {
        input.focus();
        await user.keyboard("{ArrowDown}");
        await user.keyboard("{Enter}");
      });

      expect(save).toHaveBeenCalledTimes(1);
    });

    it("Escape closes the palette", async () => {
      const user = userEvent.setup();
      const handleOpenChange = vi.fn();
      render(
        <CommandPalette
          items={items}
          defaultOpen
          onOpenChange={handleOpenChange}
        />,
      );

      const input = screen.getByPlaceholderText("Type a command or search...");
      await act(async () => {
        input.focus();
        await user.keyboard("{Escape}");
      });

      expect(handleOpenChange).toHaveBeenCalledWith(false);
    });
  });

  describe("Focus Management", () => {
    it("opens focused on the search input", async () => {
      render(<CommandPalette items={items} defaultOpen />);

      // The Component focuses the input via setTimeout(0) on open —
      // wait for that to settle.
      await waitFor(() => {
        const input = screen.getByPlaceholderText(
          "Type a command or search...",
        );
        expect(input).toHaveFocus();
      });
    });
  });

  describe("Screen Reader Support", () => {
    it("renders emptyMessage when filter matches no items", async () => {
      const user = userEvent.setup();
      render(<CommandPalette items={items} defaultOpen />);

      const input = screen.getByPlaceholderText("Type a command or search...");
      await act(async () => {
        await user.type(input, "zzzzz no match");
      });

      // The empty-state text is the AT-readable indication that the
      // typed query returned nothing.
      expect(screen.getByText("No commands found")).toBeInTheDocument();
    });

    it("description and keywords are filter sources, NOT part of the accessible name", () => {
      render(<CommandPalette items={items} defaultOpen />);

      // 'New file' has keyword "create" — it filters by that keyword,
      // but the button's accessible name is the label only, not the
      // concatenation of label + keyword.
      const button = screen.getByRole("button", { name: /New file/i });
      // The button's accessible-name computation excludes the keyword
      // "create" — testing-library's getByRole(name) does the full
      // accessible-name calculation, so if it found "create", the
      // earlier matcher would have to be `/create/`. Asserting the
      // exact contract: the visible button text contains "New file"
      // and not "create".
      expect(button.textContent).toMatch(/New file/);
      expect(button.textContent).not.toMatch(/create/i);
    });

    it("Cmd+K toggles the palette open/closed", async () => {
      const user = userEvent.setup();
      const handleOpenChange = vi.fn();
      render(<CommandPalette items={items} onOpenChange={handleOpenChange} />);

      // Closed initially.
      expect(
        screen.queryByPlaceholderText("Type a command or search..."),
      ).not.toBeInTheDocument();

      await act(async () => {
        await user.keyboard("{Meta>}k{/Meta}");
      });

      // The CommandPalette toggles via Cmd+K (metaKey or ctrlKey).
      // After firing, onOpenChange should have been called with true.
      await waitFor(() => {
        expect(handleOpenChange).toHaveBeenCalledWith(true);
      });
    });
  });
});
