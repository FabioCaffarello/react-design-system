/**
 * Toast Accessibility Tests
 *
 * Dedicated a11y test scaffold for Toast — the canonical aria-live
 * region archetype. Notifications appear without user action, so AT
 * users must hear them via aria-live; severity drives whether the
 * announcement is `polite` (queue behind current) or `assertive`
 * (interrupt).
 *
 *   - ARIA Labels and Roles: role=alert, aria-live driven by variant
 *     (error → assertive; success/warning/info → polite),
 *     aria-atomic=true so AT reads the full updated region
 *   - Keyboard Navigation: close button is keyboard-activatable
 *   - Focus Management: action button (when present) is reachable;
 *     close button has accessible name
 *   - Screen Reader Support: variant icons are decorative
 *     (aria-hidden); title is the announced content; description
 *     reinforces it
 *
 * Mirrors the structure of Header.accessibility.test.tsx as the
 * canonical scaffold for component-level a11y suites.
 */

import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Toast } from "./Toast";
import type { Toast as ToastType } from "../../providers/ToastContext";

const makeToast = (overrides: Partial<ToastType> = {}): ToastType => ({
  id: "t-1",
  variant: "info",
  title: "Heads up",
  ...overrides,
});

describe("Toast Accessibility", () => {
  describe("ARIA Labels and Roles", () => {
    it("has role=alert", () => {
      render(<Toast toast={makeToast()} onDismiss={vi.fn()} />);

      expect(screen.getByRole("alert")).toBeInTheDocument();
    });

    it("error variant announces assertively; non-error variants announce politely", () => {
      const { rerender } = render(
        <Toast toast={makeToast({ variant: "error" })} onDismiss={vi.fn()} />,
      );

      expect(screen.getByRole("alert")).toHaveAttribute(
        "aria-live",
        "assertive",
      );

      for (const variant of ["success", "warning", "info"] as const) {
        rerender(<Toast toast={makeToast({ variant })} onDismiss={vi.fn()} />);
        expect(screen.getByRole("alert")).toHaveAttribute(
          "aria-live",
          "polite",
        );
      }
    });

    it("aria-atomic=true so AT reads the full updated region", () => {
      render(<Toast toast={makeToast()} onDismiss={vi.fn()} />);

      // Without aria-atomic, AT could re-announce just the diff on a
      // content update, which is jarring for short toasts. atomic=true
      // contract holds across the toast's lifetime.
      expect(screen.getByRole("alert")).toHaveAttribute("aria-atomic", "true");
    });
  });

  describe("Keyboard Navigation", () => {
    it("close button activates onDismiss from the keyboard", async () => {
      const user = userEvent.setup();
      const onDismiss = vi.fn();
      render(<Toast toast={makeToast()} onDismiss={onDismiss} />);

      const close = screen.getByRole("button", {
        name: "Dismiss notification",
      });
      close.focus();
      await user.keyboard("{Enter}");

      // Dismiss is deferred for animation; assert the timer was started by
      // confirming setIsExiting flow is in motion (close button still present
      // for ~300ms). The contract under test is that Enter triggers the
      // dismiss chain — caller is responsible for the actual removal.
      // Wait for the deferred onDismiss to fire (300ms animation).
      await vi.waitFor(
        () => {
          expect(onDismiss).toHaveBeenCalledWith("t-1");
        },
        { timeout: 600 },
      );
    });
  });

  describe("Focus Management", () => {
    it("close button has accessible name 'Dismiss notification'", () => {
      render(<Toast toast={makeToast()} onDismiss={vi.fn()} />);

      // Discriminates from Modal ('Close modal'), Drawer ('Close drawer'),
      // Popover ('Close popover') — distinct surface, distinct name.
      expect(
        screen.getByRole("button", { name: "Dismiss notification" }),
      ).toBeInTheDocument();
    });

    it("action button (when provided) is reachable as a button", () => {
      render(
        <Toast
          toast={makeToast({
            action: { label: "Undo", onClick: vi.fn() },
          })}
          onDismiss={vi.fn()}
        />,
      );

      expect(screen.getByRole("button", { name: "Undo" })).toBeInTheDocument();
    });
  });

  describe("Screen Reader Support", () => {
    it("variant icon is decorative (aria-hidden)", () => {
      const { container } = render(
        <Toast toast={makeToast({ variant: "success" })} onDismiss={vi.fn()} />,
      );

      // The CheckCircle2 / AlertCircle / etc. lucide icons should not
      // double-announce the variant — the live region's content (the
      // title) is the announced content; the icon is purely visual.
      const hiddenIcons = container.querySelectorAll('svg[aria-hidden="true"]');
      expect(hiddenIcons.length).toBeGreaterThan(0);
    });

    it("title and description are both readable inside the live region", () => {
      render(
        <Toast
          toast={makeToast({
            title: "Saved",
            description: "Your changes were saved to draft.",
          })}
          onDismiss={vi.fn()}
        />,
      );

      const alert = screen.getByRole("alert");
      expect(alert).toHaveTextContent("Saved");
      expect(alert).toHaveTextContent("Your changes were saved to draft.");
    });
  });
});
