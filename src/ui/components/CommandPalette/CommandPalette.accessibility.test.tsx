/**
 * CommandPalette Accessibility Tests
 *
 * Dedicated a11y test scaffold for CommandPalette — the Cmd+K command
 * launcher pattern. It's a HYBRID: an overlay (like Modal/Drawer) that
 * embeds a search input + filterable action list. The defining
 * contracts:
 *
 *   - ARIA Labels and Roles: opens on Cmd+K (and the trigger if
 *     provided); closes on Escape; the panel is a role="dialog"
 *     aria-modal="true"; the search input is a combobox wired to a
 *     listbox of role="option" commands via aria-controls +
 *     aria-activedescendant
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
const quit = vi.fn();
const items: CommandItem[] = [
  { id: "1", label: "New file", action: newFile, keywords: ["create"] },
  { id: "2", label: "Save", action: save, group: "File" },
  { id: "3", label: "Quit", action: quit },
];

describe("CommandPalette Accessibility", () => {
  describe("ARIA Labels and Roles", () => {
    it("when open: search input is reachable as a textbox", () => {
      render(<CommandPalette items={items} defaultOpen />);

      expect(
        screen.getByPlaceholderText("Type a command or search..."),
      ).toBeInTheDocument();
    });

    it("each command renders as a listbox option with the label as accessible name", () => {
      render(<CommandPalette items={items} defaultOpen />);

      // The results region is a listbox; the search input is a combobox
      // wired to it via aria-controls + aria-activedescendant.
      expect(screen.getByRole("listbox")).toBeInTheDocument();
      expect(screen.getByRole("combobox")).toBeInTheDocument();
      expect(
        screen.getByRole("option", { name: /New file/i }),
      ).toBeInTheDocument();
      expect(screen.getByRole("option", { name: /Save/i })).toBeInTheDocument();
      expect(screen.getByRole("option", { name: /Quit/i })).toBeInTheDocument();
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

    it("ArrowDown follows the visible (grouped) order, not the raw items order", async () => {
      const user = userEvent.setup();
      quit.mockClear();
      save.mockClear();
      render(<CommandPalette items={items} defaultOpen />);

      const input = screen.getByPlaceholderText("Type a command or search...");
      await act(async () => {
        input.focus();
        await user.keyboard("{ArrowDown}");
        await user.keyboard("{Enter}");
      });

      // Regression: items render grouped — "Other" (New file, Quit) then
      // "File" (Save) — so the visually-second row is Quit, even though
      // Save is second in the raw items array. ArrowDown must follow the
      // rendered order, not items.indexOf.
      expect(quit).toHaveBeenCalledTimes(1);
      expect(save).not.toHaveBeenCalled();
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

    it("is a modal dialog and restores focus to the trigger on close", async () => {
      const user = userEvent.setup();
      render(
        <CommandPalette
          items={items}
          trigger={<button>Open palette</button>}
        />,
      );

      const trigger = screen.getByRole("button", { name: "Open palette" });
      await act(async () => {
        await user.click(trigger);
      });

      const dialog = await screen.findByRole("dialog");
      expect(dialog).toHaveAttribute("aria-modal", "true");

      await act(async () => {
        await user.keyboard("{Escape}");
      });

      // Regression: closing left focus stranded on <body>; it must return
      // to whatever opened the palette (WCAG 2.4.3).
      await waitFor(() => expect(trigger).toHaveFocus());
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
      const option = screen.getByRole("option", { name: /New file/i });
      // The option's accessible name excludes the keyword "create":
      // getByRole(name) runs the full accessible-name calculation, so the
      // visible text is "New file", not a label+keyword concatenation.
      expect(option.textContent).toMatch(/New file/);
      expect(option.textContent).not.toMatch(/create/i);
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
