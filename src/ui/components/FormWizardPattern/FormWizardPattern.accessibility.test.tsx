/**
 * FormWizardPattern Accessibility Tests
 *
 * Dedicated a11y test scaffold for FormWizardPattern — the
 * multi-step form pattern (Stepper for navigation + per-step
 * fields + Back/Next/Complete buttons).
 *
 *   - ARIA Labels and Roles: each step's title renders inside an
 *     `<h2>`; the wizard's nav row exposes Back (the Stepper itself
 *     uses "Previous", so "Back" is unique to the wizard) plus
 *     Next/Complete. Two "Next" buttons coexist in the DOM —
 *     Stepper's and the wizard's — so the wizard's row queries with
 *     `getAllByRole(...).at(-1)` to pick the last (lowest in DOM
 *     order)
 *   - Keyboard Navigation: Enter on the wizard's Next button
 *     triggers the step's validate() (when present); blocked
 *     validation surfaces the error region without advancing the
 *     step
 *   - Focus Management: Back is disabled on step 0; each navigation
 *     button is its own tab stop
 *   - Screen Reader Support: step title heading announces the
 *     current step; on the last step the wizard's button name flips
 *     from "Next" to "Complete" — AT users hear that they're at the
 *     final step
 *
 * Mirrors the structure of Header.accessibility.test.tsx as the
 * canonical scaffold for component-level a11y suites.
 */

import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FormWizardPattern } from "./FormWizardPattern";
import type { FormWizardStep } from "./FormWizardPattern";

const steps: FormWizardStep[] = [
  {
    id: "1",
    title: "Account",
    description: "Pick a username.",
    fields: <input aria-label="Username" />,
  },
  {
    id: "2",
    title: "Profile",
    description: "Add your name.",
    fields: <input aria-label="Full name" />,
  },
  {
    id: "3",
    title: "Review",
    description: "Confirm everything.",
    fields: <p>Looks good.</p>,
  },
];

// Wizard's Next/Complete renders below the Stepper's internal nav row.
// Pick the LAST matching button (the wizard's) so the queries don't
// collide with Stepper's identically-named buttons.
const lastButton = (name: RegExp | string) =>
  screen.getAllByRole("button", { name }).at(-1)!;

describe("FormWizardPattern Accessibility", () => {
  describe("ARIA Labels and Roles", () => {
    it("current step title renders as an <h2>", () => {
      render(<FormWizardPattern steps={steps} />);

      const heading = screen.getByRole("heading", {
        level: 2,
        name: "Account",
      });
      expect(heading).toBeInTheDocument();
    });

    it("wizard exposes a Back button (Stepper uses 'Previous' — Back is unique)", () => {
      render(<FormWizardPattern steps={steps} />);

      // "Back" appears only in the wizard's nav row, never in Stepper —
      // so getByRole is safe here.
      expect(screen.getByRole("button", { name: "Back" })).toBeInTheDocument();
    });

    it("last step flips wizard's Next → Complete", async () => {
      const user = userEvent.setup();
      render(<FormWizardPattern steps={steps} />);

      await user.click(lastButton("Next"));
      await user.click(lastButton("Next"));

      // After 2 advances we're on the last step — wizard's button is
      // now "Complete".
      expect(lastButton("Complete")).toBeInTheDocument();
    });
  });

  describe("Keyboard Navigation", () => {
    it("Enter on the wizard's Next advances and updates the heading", async () => {
      const user = userEvent.setup();
      render(<FormWizardPattern steps={steps} />);

      lastButton("Next").focus();
      await user.keyboard("{Enter}");

      expect(
        screen.getByRole("heading", { level: 2, name: "Profile" }),
      ).toBeInTheDocument();
    });

    it("validate() returning false blocks advancement", async () => {
      const user = userEvent.setup();
      const validate = vi.fn().mockReturnValue(false);
      const stepsWithValidation: FormWizardStep[] = [
        { ...steps[0], validate },
        steps[1],
      ];
      render(<FormWizardPattern steps={stepsWithValidation} />);

      await user.click(lastButton("Next"));

      // Validation was attempted but the wizard stayed on step 0 —
      // heading is still "Account".
      expect(validate).toHaveBeenCalled();
      expect(
        screen.getByRole("heading", { level: 2, name: "Account" }),
      ).toBeInTheDocument();
    });
  });

  describe("Focus Management", () => {
    it("Back is disabled on step 0", () => {
      render(<FormWizardPattern steps={steps} />);

      expect(screen.getByRole("button", { name: "Back" })).toBeDisabled();
    });

    it("Back becomes enabled on step 1+", async () => {
      const user = userEvent.setup();
      render(<FormWizardPattern steps={steps} />);

      await user.click(lastButton("Next"));

      expect(screen.getByRole("button", { name: "Back" })).not.toBeDisabled();
    });
  });

  describe("Screen Reader Support", () => {
    it("onComplete fires from the wizard's Complete on the last step", async () => {
      const user = userEvent.setup();
      const onComplete = vi.fn();
      render(<FormWizardPattern steps={steps} onComplete={onComplete} />);

      await user.click(lastButton("Next"));
      await user.click(lastButton("Next"));
      await user.click(lastButton("Complete"));

      expect(onComplete).toHaveBeenCalled();
    });
  });
});
