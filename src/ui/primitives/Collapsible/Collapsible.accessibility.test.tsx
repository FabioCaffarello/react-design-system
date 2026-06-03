/**
 * Collapsible Accessibility Tests
 *
 * Dedicated a11y test scaffold for Collapsible — the disclosure
 * primitive (trigger button + collapsible content panel).
 *
 *   - ARIA Labels and Roles: trigger is a native <button> with
 *     aria-expanded reflecting open state and aria-controls pointing at
 *     the panel id; panel carries aria-hidden when collapsed
 *   - Keyboard Navigation: Enter/Space on the trigger toggles open
 *   - Focus Management: trigger is the only tab stop; the panel is not
 *     focusable
 *   - Screen Reader Support: aria-expanded gives the AT user the
 *     current state without needing to walk into the panel
 *
 * Mirrors the structure of Header.accessibility.test.tsx as the
 * canonical scaffold for component-level a11y suites.
 */

import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Collapsible from "./Collapsible";

describe("Collapsible Accessibility", () => {
  describe("ARIA Labels and Roles", () => {
    it("trigger is a <button> with aria-expanded reflecting state", () => {
      render(
        <Collapsible trigger="Toggle" defaultOpen={true}>
          <div>Panel content</div>
        </Collapsible>,
      );

      const trigger = screen.getByRole("button", { name: "Toggle" });
      expect(trigger).toHaveAttribute("aria-expanded", "true");
    });

    it("aria-expanded='false' when collapsed", () => {
      render(
        <Collapsible trigger="Toggle" defaultOpen={false}>
          <div>Panel content</div>
        </Collapsible>,
      );

      expect(screen.getByRole("button")).toHaveAttribute(
        "aria-expanded",
        "false",
      );
    });

    it("aria-controls points at the panel id", () => {
      render(
        <Collapsible trigger="Toggle">
          <div>Panel content</div>
        </Collapsible>,
      );

      const trigger = screen.getByRole("button");
      const controlsId = trigger.getAttribute("aria-controls");
      expect(controlsId).toBeTruthy();
      // The id resolves to the panel container so AT users can navigate
      // from the trigger to the content via the relation.
      expect(document.getElementById(controlsId!)).toBeInTheDocument();
    });

    it("disabled trigger carries aria-disabled='true'", () => {
      render(
        <Collapsible trigger="Toggle" disabled>
          <div>Panel content</div>
        </Collapsible>,
      );

      expect(screen.getByRole("button")).toHaveAttribute(
        "aria-disabled",
        "true",
      );
    });
  });

  describe("Keyboard Navigation", () => {
    it("Enter on the trigger toggles open state", async () => {
      const user = userEvent.setup();
      const onOpenChange = vi.fn();
      render(
        <Collapsible
          trigger="Toggle"
          defaultOpen={false}
          onOpenChange={onOpenChange}
        >
          <div>Panel content</div>
        </Collapsible>,
      );

      const trigger = screen.getByRole("button");
      trigger.focus();
      await user.keyboard("{Enter}");
      expect(onOpenChange).toHaveBeenCalledWith(true);
    });

    it("Space on the trigger toggles open state", async () => {
      const user = userEvent.setup();
      const onOpenChange = vi.fn();
      render(
        <Collapsible
          trigger="Toggle"
          defaultOpen={false}
          onOpenChange={onOpenChange}
        >
          <div>Panel content</div>
        </Collapsible>,
      );

      const trigger = screen.getByRole("button");
      trigger.focus();
      await user.keyboard(" ");
      expect(onOpenChange).toHaveBeenCalledWith(true);
    });
  });

  describe("Focus Management", () => {
    it("trigger is the only tab stop", async () => {
      const user = userEvent.setup();
      render(
        <>
          <button>Before</button>
          <Collapsible trigger="Toggle">
            <div>Panel content</div>
          </Collapsible>
          <button>After</button>
        </>,
      );

      screen.getByRole("button", { name: "Before" }).focus();
      await user.tab();
      expect(screen.getByRole("button", { name: "Toggle" })).toHaveFocus();

      await user.tab();
      // Tab skips the panel — content is part of flow but the trigger
      // is the only interactive surface this primitive owns.
      expect(screen.getByRole("button", { name: "After" })).toHaveFocus();
    });
  });

  describe("Screen Reader Support", () => {
    it("aria-hidden on the panel mirrors open state (controlled)", () => {
      // Use the controlled `open` prop — `defaultOpen` is consumed only
      // on mount, so a rerender with a new defaultOpen won't flip state.
      const { rerender } = render(
        <Collapsible trigger="Toggle" open={true}>
          <div>Panel content</div>
        </Collapsible>,
      );

      const trigger = screen.getByRole("button");
      const panelId = trigger.getAttribute("aria-controls")!;
      const openPanel = document.getElementById(panelId);
      expect(openPanel).toHaveAttribute("aria-hidden", "false");

      rerender(
        <Collapsible trigger="Toggle" open={false}>
          <div>Panel content</div>
        </Collapsible>,
      );

      const closedTrigger = screen.getByRole("button");
      const closedPanelId = closedTrigger.getAttribute("aria-controls")!;
      const closedPanel = document.getElementById(closedPanelId);
      expect(closedPanel).toHaveAttribute("aria-hidden", "true");
    });
  });
});
