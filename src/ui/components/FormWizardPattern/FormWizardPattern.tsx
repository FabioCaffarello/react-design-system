import React, { useState } from "react";
import { Stepper } from "../../components";
import { Container } from "../../layouts/Container/Container";
import { Stack } from "../../layouts/Stack/Stack";
import { Button } from "../../primitives";
import { getRadiusClass } from "../../tokens/radius";
import { getSpacingClass } from "../../tokens/spacing";
import type { StepperStep } from "../../components";

export interface FormWizardStep extends StepperStep {
  /**
   * Form fields for this step
   */
  fields: React.ReactNode;
  /**
   * Validation function for this step
   */
  validate?: () => boolean | Promise<boolean>;
  /**
   * Submit handler for this step
   */
  onSubmit?: (data: unknown) => void | Promise<void>;
}

export interface FormWizardPatternProps {
  /**
   * Steps configuration
   */
  steps: FormWizardStep[];
  /**
   * Callback when wizard is completed
   */
  onComplete?: (data: Record<string, unknown>) => void;
  /**
   * Allow navigation to previous steps
   * @default true
   */
  allowBackNavigation?: boolean;
  /**
   * Show step numbers
   * @default true
   */
  showStepNumbers?: boolean;
}

/**
 * FormWizardPattern - A complete form wizard pattern combining Stepper and Form
 *
 * This pattern solves the common UX problem of multi-step forms with validation.
 * It combines Stepper for navigation and Form for data collection.
 *
 * @example
 * ```tsx
 * <FormWizardPattern
 *   steps={steps}
 *   onComplete={(data) => console.log(data)}
 * />
 * ```
 */
export function FormWizardPattern({
  steps,
  onComplete,
  allowBackNavigation = true,
  showStepNumbers: _showStepNumbers = true,
}: FormWizardPatternProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, _setFormData] = useState<Record<string, unknown>>({});
  const [errors, setErrors] = useState<Record<number, boolean>>({});

  const handleNext = async () => {
    const step = steps[currentStep];

    // Validate current step if validation function exists
    if (step.validate) {
      const isValid = await step.validate();
      if (!isValid) {
        setErrors({ ...errors, [currentStep]: true });
        return;
      }
    }

    // Clear error for current step
    setErrors({ ...errors, [currentStep]: false });

    // Submit current step if handler exists
    if (step.onSubmit) {
      await step.onSubmit(formData);
    }

    // Move to next step
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Wizard completed
      if (onComplete) {
        onComplete(formData);
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 0 && allowBackNavigation) {
      setCurrentStep(currentStep - 1);
      // Clear error when going back
      setErrors({ ...errors, [currentStep - 1]: false });
    }
  };

  const handleStepClick = (stepIndex: number) => {
    if (allowBackNavigation && stepIndex < currentStep) {
      setCurrentStep(stepIndex);
    }
  };

  const currentStepData = steps[currentStep];
  const isLastStep = currentStep === steps.length - 1;
  const hasError = errors[currentStep] === true;

  return (
    <Container maxWidth="lg" paddingX="base" paddingY="lg">
      <Stack spacing="lg">
        {/* Stepper */}
        <Stepper
          steps={steps.map((step, index) => ({
            id: step.id,
            title: step.title,
            content: step.content,
            description: step.description,
            status:
              index < currentStep
                ? "completed"
                : index === currentStep
                  ? hasError
                    ? "error"
                    : "active"
                  : "pending",
          }))}
          currentStep={currentStep}
          onStepChange={handleStepClick}
          allowNavigation={allowBackNavigation}
        />

        {/* Form Content */}
        <div
          className={`bg-surface-base ${getRadiusClass("lg")} border ${getSpacingClass("lg", "p")}`}
        >
          <Stack spacing="md">
            <div>
              <h2 className="text-2xl font-semibold">
                {currentStepData.title}
              </h2>
              {currentStepData.description && (
                <p
                  className={`text-fg-secondary ${getSpacingClass("xs", "mt")}`}
                >
                  {currentStepData.description}
                </p>
              )}
            </div>

            {hasError && (
              <div
                className={`bg-error-bg border border-error-border rounded ${getSpacingClass("md", "p")}`}
              >
                <p className="text-sm text-fg-error">
                  Please fix the errors before proceeding.
                </p>
              </div>
            )}

            <div className="min-h-48">{currentStepData.fields}</div>

            {/* Navigation Buttons */}
            <div
              className={`flex justify-between ${getSpacingClass("base", "pt")} border-t`}
            >
              <Button
                variant="outline"
                onClick={handleBack}
                disabled={currentStep === 0}
              >
                Back
              </Button>
              <Button variant="primary" onClick={handleNext}>
                {isLastStep ? "Complete" : "Next"}
              </Button>
            </div>
          </Stack>
        </div>
      </Stack>
    </Container>
  );
}
