/**
 * Stepper Accessibility Tests
 *
 * Dedicated a11y test scaffold for Stepper. The main test file
 * exercises step transitions and the controlled/uncontrolled split;
 * this file targets the structural a11y invariants that hold across
 * both orientations (horizontal / vertical):
 *
 *   - ARIA Labels and Roles: each step indicator is a button with
 *     `aria-label="Step N: Title"` (or `"Step N"` when title is
 *     absent); pending-status indicators carry `data-marker="pending"`
 *     so the AA-by-construction fg-quaternary exception suppression
 *     can anchor on the ROLE, not the style classes
 *   - Keyboard Navigation: Enter/Space on an enabled step button
 *     activates onStepChange; disabled steps are not activatable;
 *     `allowNavigation={false}` makes every step button unactivatable
 *   - Focus Management: disabled steps and locked navigation are
 *     surfaced via the native `disabled` attribute (not just
 *     `aria-disabled`)
 *   - Screen Reader Support: completed step renders no visible
 *     glyph beyond the Check icon — the accessible label is the only
 *     text identifier; Previous is disabled on the first step
 *
 * Mirrors the structure of Header.accessibility.test.tsx as the
 * canonical scaffold for component-level a11y suites.
 */

import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Stepper, { type StepperStep } from "./Stepper";

const steps: StepperStep[] = [
  { id: "one", title: "Account", content: <p>Account form</p> },
  { id: "two", title: "Profile", content: <p>Profile form</p> },
  { id: "three", title: "Confirm", content: <p>Confirm</p> },
];

describe("Stepper Accessibility", () => {
  describe("ARIA Labels and Roles", () => {
    it("each step indicator carries aria-label='Step N: Title'", () => {
      render(<Stepper steps={steps} />);

      expect(
        screen.getByRole("button", { name: "Step 1: Account" }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: "Step 2: Profile" }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: "Step 3: Confirm" }),
      ).toBeInTheDocument();
    });

    it("titleless step falls back to aria-label='Step N'", () => {
      render(
        <Stepper
          steps={[
            { id: "one", title: "", content: <p>One</p> },
            { id: "two", title: "", content: <p>Two</p> },
          ]}
        />,
      );

      expect(
        screen.getByRole("button", { name: "Step 1" }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: "Step 2" }),
      ).toBeInTheDocument();
    });

    it("pending steps carry data-marker='pending' (anchors directed a11y suppression)", () => {
      render(<Stepper steps={steps} defaultCurrentStep={0} />);

      // currentStep=0 → step 0 is active, steps 1 and 2 are pending.
      const profile = screen.getByRole("button", { name: "Step 2: Profile" });
      const confirm = screen.getByRole("button", { name: "Step 3: Confirm" });
      expect(profile).toHaveAttribute("data-marker", "pending");
      expect(confirm).toHaveAttribute("data-marker", "pending");

      // Active step must NOT carry the marker — the suppression only
      // applies to pending bubbles where the contrast intentionally fails.
      const account = screen.getByRole("button", { name: "Step 1: Account" });
      expect(account).not.toHaveAttribute("data-marker");
    });
  });

  describe("Keyboard Navigation", () => {
    it("Enter on an enabled step button calls onStepChange", async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();
      render(
        <Stepper
          steps={steps}
          defaultCurrentStep={1}
          onStepChange={handleChange}
        />,
      );

      const account = screen.getByRole("button", { name: "Step 1: Account" });
      account.focus();
      await user.keyboard("{Enter}");
      expect(handleChange).toHaveBeenCalledWith(0);
    });

    it("Space on an enabled step button calls onStepChange", async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();
      render(
        <Stepper
          steps={steps}
          defaultCurrentStep={1}
          onStepChange={handleChange}
        />,
      );

      const confirm = screen.getByRole("button", { name: "Step 3: Confirm" });
      confirm.focus();
      await user.keyboard(" ");
      expect(handleChange).toHaveBeenCalledWith(2);
    });

    it("Tab traverses step buttons in DOM order", async () => {
      const user = userEvent.setup();
      render(<Stepper steps={steps} />);

      await user.tab();
      expect(
        screen.getByRole("button", { name: "Step 1: Account" }),
      ).toHaveFocus();

      await user.tab();
      expect(
        screen.getByRole("button", { name: "Step 2: Profile" }),
      ).toHaveFocus();

      await user.tab();
      expect(
        screen.getByRole("button", { name: "Step 3: Confirm" }),
      ).toHaveFocus();
    });
  });

  describe("Focus Management", () => {
    it("disabled step renders as disabled button", () => {
      const stepsWithDisabled: StepperStep[] = [
        steps[0],
        { ...steps[1], disabled: true },
        steps[2],
      ];
      render(<Stepper steps={stepsWithDisabled} />);

      const disabled = screen.getByRole("button", { name: "Step 2: Profile" });
      expect(disabled).toBeDisabled();
    });

    it("allowNavigation=false disables every step button", () => {
      render(<Stepper steps={steps} allowNavigation={false} />);

      for (let i = 1; i <= 3; i++) {
        const button = screen.getByRole("button", {
          name: new RegExp(`Step ${i}:`),
        });
        expect(button).toBeDisabled();
      }
    });

    it("disabled step does not fire onStepChange even when focused + Enter pressed", async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();
      const stepsWithDisabled: StepperStep[] = [
        steps[0],
        { ...steps[1], disabled: true },
        steps[2],
      ];
      render(<Stepper steps={stepsWithDisabled} onStepChange={handleChange} />);

      const disabled = screen.getByRole("button", { name: "Step 2: Profile" });
      disabled.focus();
      await user.keyboard("{Enter}");
      expect(handleChange).not.toHaveBeenCalled();
    });
  });

  describe("Screen Reader Support", () => {
    it("Previous button is disabled when on the first step", () => {
      render(<Stepper steps={steps} defaultCurrentStep={0} />);

      const previous = screen.getByRole("button", { name: "Previous" });
      expect(previous).toBeDisabled();
    });

    it("Next button becomes 'Complete' on the last step", () => {
      render(<Stepper steps={steps} defaultCurrentStep={2} />);

      expect(
        screen.getByRole("button", { name: "Complete" }),
      ).toBeInTheDocument();
      expect(
        screen.queryByRole("button", { name: "Next" }),
      ).not.toBeInTheDocument();
    });
  });
});
