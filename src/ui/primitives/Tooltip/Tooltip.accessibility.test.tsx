/**
 * Tooltip Accessibility Tests
 *
 * Dedicated a11y test scaffold for Tooltip — the canonical
 * "describes the trigger" overlay pattern. The defining contract:
 * the tooltip DESCRIBES (aria-describedby) rather than LABELS
 * (aria-labelledby) — the trigger keeps its own accessible name;
 * the tooltip is supplementary detail.
 *
 *   - ARIA Labels and Roles: tooltip element has role=tooltip,
 *     aria-live=polite (so AT announces it on show), arrow is
 *     decorative (aria-hidden)
 *   - Keyboard Navigation: trigger gains aria-describedby pointing
 *     at the tooltip when visible; it's removed when hidden
 *   - Focus Management: focus on trigger shows the tooltip (not just
 *     hover) — keyboard-only users must reach the description
 *   - Screen Reader Support: tooltip role=tooltip (NOT role=dialog —
 *     dialogs trap focus, tooltips don't); content describes the
 *     trigger
 *
 * Mirrors the structure of Header.accessibility.test.tsx as the
 * canonical scaffold for component-level a11y suites.
 */

import { describe, it, expect } from "vitest";
import { render, screen, act, waitFor } from "@testing-library/react";
import Tooltip from "./Tooltip";

describe("Tooltip Accessibility", () => {
  describe("ARIA Labels and Roles", () => {
    it("tooltip element has role=tooltip when visible", async () => {
      render(
        <Tooltip content="Helpful hint" delay={0}>
          <button>Trigger</button>
        </Tooltip>,
      );

      const trigger = screen.getByRole("button", { name: "Trigger" });
      await act(async () => {
        trigger.focus();
      });

      await waitFor(() => {
        expect(screen.getByRole("tooltip")).toBeInTheDocument();
      });
    });

    it("tooltip carries aria-live=polite (announces on show)", async () => {
      render(
        <Tooltip content="Helpful hint" delay={0}>
          <button>Trigger</button>
        </Tooltip>,
      );

      const trigger = screen.getByRole("button", { name: "Trigger" });
      await act(async () => {
        trigger.focus();
      });

      await waitFor(() => {
        const tooltip = screen.getByRole("tooltip");
        expect(tooltip).toHaveAttribute("aria-live", "polite");
      });
    });

    it("arrow indicator is aria-hidden (decorative)", async () => {
      render(
        <Tooltip content="Helpful hint" delay={0}>
          <button>Trigger</button>
        </Tooltip>,
      );

      const trigger = screen.getByRole("button", { name: "Trigger" });
      await act(async () => {
        trigger.focus();
      });

      await waitFor(() => {
        const tooltip = screen.getByRole("tooltip");
        // The visual arrow pointing at the trigger is decorative — AT
        // users only need the textual content.
        const arrow = tooltip.querySelector('[aria-hidden="true"]');
        expect(arrow).toBeInTheDocument();
      });
    });
  });

  describe("Keyboard Navigation", () => {
    it("focus on the trigger shows the tooltip (keyboard reachability)", async () => {
      render(
        <Tooltip content="Helpful hint" delay={0}>
          <button>Trigger</button>
        </Tooltip>,
      );

      const trigger = screen.getByRole("button", { name: "Trigger" });
      // Keyboard-only users never hover — they reach the trigger via Tab.
      // If show was hover-only, those users would never see the description.
      await act(async () => {
        trigger.focus();
      });

      await waitFor(() => {
        expect(screen.getByRole("tooltip")).toBeInTheDocument();
      });
    });

    it("blur removes the tooltip and clears aria-describedby on trigger", async () => {
      render(
        <Tooltip content="Helpful hint" delay={0}>
          <button>Trigger</button>
        </Tooltip>,
      );

      const trigger = screen.getByRole("button", { name: "Trigger" });
      await act(async () => {
        trigger.focus();
      });

      await waitFor(() => {
        expect(screen.getByRole("tooltip")).toBeInTheDocument();
      });

      await act(async () => {
        trigger.blur();
      });

      await waitFor(() => {
        expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
      });
      expect(trigger).not.toHaveAttribute("aria-describedby");
    });
  });

  describe("Focus Management", () => {
    it("trigger gets aria-describedby pointing at the tooltip id when visible", async () => {
      render(
        <Tooltip content="Helpful hint" delay={0}>
          <button>Trigger</button>
        </Tooltip>,
      );

      const trigger = screen.getByRole("button", { name: "Trigger" });
      await act(async () => {
        trigger.focus();
      });

      await waitFor(() => {
        const tooltip = screen.getByRole("tooltip");
        // The aria-describedby contract: id pairs trigger ↔ tooltip so
        // AT users hear "Trigger, Helpful hint" instead of just "Trigger".
        expect(trigger.getAttribute("aria-describedby")).toBe(tooltip.id);
      });
    });

    it("trigger keeps its own accessible name (tooltip describes, not labels)", async () => {
      render(
        <Tooltip content="Helpful hint" delay={0}>
          <button>Save</button>
        </Tooltip>,
      );

      const trigger = screen.getByRole("button", { name: "Save" });
      await act(async () => {
        trigger.focus();
      });

      // After tooltip is shown, the accessible NAME of the button must
      // remain "Save" — not "Save Helpful hint" or "Helpful hint". The
      // tooltip is a description; the name comes from the button's text.
      expect(trigger).toHaveAccessibleName("Save");
    });
  });

  describe("Screen Reader Support", () => {
    it("tooltip text is the role=tooltip's accessible content", async () => {
      render(
        <Tooltip content="Delete permanently" delay={0}>
          <button>Trigger</button>
        </Tooltip>,
      );

      const trigger = screen.getByRole("button", { name: "Trigger" });
      await act(async () => {
        trigger.focus();
      });

      await waitFor(() => {
        const tooltip = screen.getByRole("tooltip");
        expect(tooltip).toHaveTextContent("Delete permanently");
      });
    });
  });
});
