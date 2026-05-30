"use client";

import { useState, type ReactNode } from "react";
import { Check } from "lucide-react";
import { getSpacingClass } from "../../tokens/spacing";
import { getRadiusClass } from "../../tokens/radius";
import { getAnimationClass } from "../../tokens/animations";
import Button from "../../primitives/Button/Button";
import Separator from "../../primitives/Separator/Separator";

export type StepperStatus = "pending" | "active" | "completed" | "error";

export interface StepperStep {
  id: string;
  title: string;
  description?: string;
  content: ReactNode;
  status?: StepperStatus;
  disabled?: boolean;
}

export interface StepperProps {
  steps: StepperStep[];
  currentStep?: number;
  defaultCurrentStep?: number;
  onStepChange?: (stepIndex: number) => void;
  onComplete?: () => void;
  allowNavigation?: boolean;
  showStepNumbers?: boolean;
  orientation?: "horizontal" | "vertical";
  className?: string;
}

/**
 * Stepper Component
 *
 * A multi-step wizard component for guided workflows.
 * Supports validation, navigation, and completion callbacks.
 * Follows Atomic Design principles as an Organism component.
 *
 * @example
 * ```tsx
 * <Stepper
 *   steps={[
 *     { id: '1', title: 'Step 1', content: <div>Content 1</div> },
 *     { id: '2', title: 'Step 2', content: <div>Content 2</div> },
 *   ]}
 *   onComplete={() => console.log('Completed!')}
 * />
 * ```
 */
export default function Stepper({
  steps,
  currentStep: controlledCurrentStep,
  defaultCurrentStep = 0,
  onStepChange,
  onComplete,
  allowNavigation = true,
  showStepNumbers = true,
  orientation = "horizontal",
  className = "",
}: StepperProps) {
  const [internalCurrentStep, setInternalCurrentStep] =
    useState(defaultCurrentStep);

  const isControlled = controlledCurrentStep !== undefined;
  const currentStepIndex = isControlled
    ? controlledCurrentStep
    : internalCurrentStep;

  const getStepStatus = (index: number): StepperStatus => {
    if (index < currentStepIndex) return "completed";
    if (index === currentStepIndex) return "active";
    return "pending";
  };

  const handleNext = () => {
    if (currentStepIndex < steps.length - 1) {
      const nextStep = currentStepIndex + 1;
      if (!isControlled) {
        setInternalCurrentStep(nextStep);
      }
      onStepChange?.(nextStep);
    } else {
      onComplete?.();
    }
  };

  const handlePrevious = () => {
    if (currentStepIndex > 0) {
      const prevStep = currentStepIndex - 1;
      if (!isControlled) {
        setInternalCurrentStep(prevStep);
      }
      onStepChange?.(prevStep);
    }
  };

  const handleStepClick = (index: number) => {
    if (!allowNavigation) return;
    if (steps[index].disabled) return;

    if (!isControlled) {
      setInternalCurrentStep(index);
    }
    onStepChange?.(index);
  };

  const currentStep = steps[currentStepIndex];
  const isFirstStep = currentStepIndex === 0;
  const isLastStep = currentStepIndex === steps.length - 1;

  if (orientation === "vertical") {
    return (
      <div className={`flex gap-4 ${className}`}>
        {/* Steps List */}
        <div className="flex flex-col">
          {steps.map((step, index) => {
            const status = step.status || getStepStatus(index);
            const isActive = index === currentStepIndex;

            return (
              <div key={step.id} className="flex items-start gap-3">
                {/* Step Indicator */}
                <div className="flex flex-col items-center">
                  <button
                    type="button"
                    onClick={() => handleStepClick(index)}
                    disabled={!allowNavigation || step.disabled}
                    // data-marker="pending" — see .claude/rules/colors.md
                    // "fg-quaternary: AA-by-construction exception". Anchors
                    // the directed a11y suppression to the pending-marker
                    // ROLE, not to style classes; survives a future restyle
                    // of the bubble.
                    {...(status === "pending"
                      ? { "data-marker": "pending" }
                      : {})}
                    className={`
                      flex
                      items-center
                      justify-center
                      w-10
                      h-10
                      ${getRadiusClass("full")}
                      border-2
                      ${getAnimationClass("base")}
                      ${
                        status === "completed"
                          ? `${"bg-success"} ${"border-success"} text-fg-inverse`
                          : status === "active"
                            ? `${"bg-surface-brand-strong"} ${"border-line-brand"} text-fg-inverse`
                            : status === "error"
                              ? `${"bg-error"} ${"border-error"} text-fg-inverse`
                              : "bg-surface-base border-line-emphasis text-fg-quaternary"
                      }
                      ${!allowNavigation || step.disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"}
                    `}
                  >
                    {status === "completed" ? (
                      <Check className="h-5 w-5" />
                    ) : showStepNumbers ? (
                      index + 1
                    ) : null}
                  </button>
                  {index < steps.length - 1 && (
                    <div
                      className={`
                        w-0.5
                        h-12
                        mt-2
                        ${status === "completed" ? "bg-success" : "bg-line-emphasis"}
                      `}
                    />
                  )}
                </div>

                {/* Step Content */}
                <div className="flex-1 pb-8">
                  <button
                    type="button"
                    onClick={() => handleStepClick(index)}
                    disabled={!allowNavigation || step.disabled}
                    className={`
                      text-left
                      ${isActive ? "font-semibold" : "font-medium"}
                      ${status === "active" ? "text-fg-brand-emphasis" : "text-fg-secondary"}
                      ${!allowNavigation || step.disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"}
                    `}
                  >
                    {step.title}
                  </button>
                  {step.description && (
                    <p className="text-sm text-fg-tertiary mt-1">
                      {step.description}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Step Content */}
        <div className="flex-1">
          <div
            className={`
            ${getSpacingClass("lg", "p")}
            border
            border-line-default
            ${getRadiusClass("lg")}
            bg-surface-base
          `}
          >
            {currentStep.content}
          </div>

          {/* Navigation */}
          <div
            className={`flex justify-between mt-4 ${getSpacingClass("base", "gap")}`}
          >
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={isFirstStep}
            >
              Previous
            </Button>
            <Button variant="primary" onClick={handleNext}>
              {isLastStep ? "Complete" : "Next"}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Horizontal orientation
  return (
    <div className={`space-y-6 ${className}`}>
      {/* Steps List */}
      <div className="flex items-center">
        {steps.map((step, index) => {
          const status = step.status || getStepStatus(index);
          const isActive = index === currentStepIndex;

          return (
            <div key={step.id} className="flex items-center flex-1">
              <div className="flex flex-col items-center flex-1">
                <button
                  type="button"
                  onClick={() => handleStepClick(index)}
                  disabled={!allowNavigation || step.disabled}
                  // data-marker="pending" — see .claude/rules/colors.md
                  // "fg-quaternary: AA-by-construction exception".
                  {...(status === "pending"
                    ? { "data-marker": "pending" }
                    : {})}
                  className={`
                    flex
                    items-center
                    justify-center
                    w-10
                    h-10
                    ${getRadiusClass("full")}
                    border-2
                    ${getAnimationClass("base")}
                    ${
                      status === "completed"
                        ? `${"bg-success"} ${"border-success"} text-fg-inverse`
                        : status === "active"
                          ? `${"bg-surface-brand-strong"} ${"border-line-brand"} text-fg-inverse`
                          : status === "error"
                            ? `${"bg-error"} ${"border-error"} text-fg-inverse`
                            : "bg-surface-base border-line-emphasis text-fg-quaternary"
                    }
                    ${!allowNavigation || step.disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"}
                  `}
                >
                  {status === "completed" ? (
                    <Check className="h-5 w-5" />
                  ) : showStepNumbers ? (
                    index + 1
                  ) : null}
                </button>
                <div
                  className={`mt-2 text-center ${getSpacingClass("sm", "px")}`}
                >
                  <p
                    className={`
                      text-sm
                      font-medium
                      ${isActive ? "text-fg-brand-emphasis" : "text-fg-secondary"}
                    `}
                  >
                    {step.title}
                  </p>
                  {step.description && (
                    <p className="text-xs text-fg-tertiary mt-1">
                      {step.description}
                    </p>
                  )}
                </div>
              </div>
              {index < steps.length - 1 && (
                <div className={`flex-1 mx-2 ${getSpacingClass("base", "mx")}`}>
                  <Separator
                    className={`
                      ${status === "completed" ? "border-success" : "border-line-emphasis"}
                    `}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Step Content */}
      <div
        className={`
        ${getSpacingClass("lg", "p")}
        border
        border-line-default
        ${getRadiusClass("lg")}
        bg-surface-base
      `}
      >
        {currentStep.content}
      </div>

      {/* Navigation */}
      <div className={`flex justify-between ${getSpacingClass("base", "gap")}`}>
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={isFirstStep}
        >
          Previous
        </Button>
        <Button variant="primary" onClick={handleNext}>
          {isLastStep ? "Complete" : "Next"}
        </Button>
      </div>
    </div>
  );
}
