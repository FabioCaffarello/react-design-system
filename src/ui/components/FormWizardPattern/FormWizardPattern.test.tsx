import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { FormWizardPattern } from "./FormWizardPattern";
import type { FormWizardStep } from "./FormWizardPattern";

// FormWizardPattern renders BOTH a Stepper (which carries its own
// Previous/Next nav buttons) and its own Back/Next buttons below the
// fields. Plain `getByRole("button", { name: /next/i })` therefore
// matches multiple elements. The form's advance button is always the
// last matching button in DOM order (the Stepper renders above it),
// so we pick the trailing match.
const formAdvanceButton = () => {
  const matches = screen.getAllByRole("button", {
    name: /^(next|complete)$/i,
  });
  return matches[matches.length - 1];
};
const formBackButton = () => screen.getByRole("button", { name: /^back$/i });

const baseSteps: FormWizardStep[] = [
  {
    id: "step-1",
    title: "Identity",
    fields: <input aria-label="Name" />,
  },
  {
    id: "step-2",
    title: "Address",
    fields: <input aria-label="Street" />,
  },
  {
    id: "step-3",
    title: "Review",
    fields: <p>Confirm details</p>,
  },
];

describe("FormWizardPattern", () => {
  it("renders the first step's title and fields on mount", () => {
    render(<FormWizardPattern steps={baseSteps} />);

    expect(
      screen.getByRole("heading", { name: /identity/i }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Name")).toBeInTheDocument();
  });

  it("disables Back on the first step and labels the advance button Next", () => {
    render(<FormWizardPattern steps={baseSteps} />);

    expect(formBackButton()).toBeDisabled();
    expect(formAdvanceButton()).toHaveTextContent(/^next$/i);
  });

  it("advances to the next step when Next is clicked", () => {
    render(<FormWizardPattern steps={baseSteps} />);

    fireEvent.click(formAdvanceButton());

    expect(
      screen.getByRole("heading", { name: /address/i }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Street")).toBeInTheDocument();
  });

  it("returns to the previous step when Back is clicked after advancing", () => {
    render(<FormWizardPattern steps={baseSteps} />);

    fireEvent.click(formAdvanceButton());
    fireEvent.click(formBackButton());

    expect(
      screen.getByRole("heading", { name: /identity/i }),
    ).toBeInTheDocument();
  });

  it("blocks the advance and surfaces an error when the step's validate returns false", async () => {
    const validate = vi.fn().mockResolvedValue(false);
    const onSubmit = vi.fn();
    const steps: FormWizardStep[] = [
      {
        id: "step-1",
        title: "Identity",
        fields: <input aria-label="Name" />,
        validate,
        onSubmit,
      },
      baseSteps[1],
    ];

    render(<FormWizardPattern steps={steps} />);
    fireEvent.click(formAdvanceButton());

    await vi.waitFor(() => {
      expect(validate).toHaveBeenCalled();
    });
    await vi.waitFor(() => {
      expect(screen.getByText(/please fix the errors/i)).toBeInTheDocument();
    });
    expect(onSubmit).not.toHaveBeenCalled();
    // Still on Identity step
    expect(
      screen.getByRole("heading", { name: /identity/i }),
    ).toBeInTheDocument();
  });

  it("labels the advance button Complete on the last step and fires onComplete", () => {
    const onComplete = vi.fn();
    render(<FormWizardPattern steps={baseSteps} onComplete={onComplete} />);

    fireEvent.click(formAdvanceButton()); // Identity → Address
    fireEvent.click(formAdvanceButton()); // Address → Review

    expect(formAdvanceButton()).toHaveTextContent(/^complete$/i);

    fireEvent.click(formAdvanceButton());
    expect(onComplete).toHaveBeenCalledTimes(1);
  });

  it("fires onSubmit for the current step before advancing", () => {
    const onSubmitStep1 = vi.fn();
    const steps: FormWizardStep[] = [
      {
        id: "step-1",
        title: "Identity",
        fields: <input aria-label="Name" />,
        onSubmit: onSubmitStep1,
      },
      baseSteps[1],
    ];

    render(<FormWizardPattern steps={steps} />);
    fireEvent.click(formAdvanceButton());

    expect(onSubmitStep1).toHaveBeenCalledTimes(1);
  });
});
