/**
 * Playground Stepper Component
 * 
 * Wrapper for Stepper component from design system.
 * Renders steps dynamically based on active tab.
 */

/**
 * Playground Stepper Component
 * 
 * @deprecated This component is no longer used in the playground.
 * The playground now uses tabs only without stepper navigation.
 * This file is kept for backward compatibility but should not be imported.
 */

import React from 'react';
import type { PlaygroundTabId } from './PlaygroundTabs';
import { 
  getSpacingClass, 
  getColorClass, 
  getTypographyClasses 
} from '../../../tokens';

export interface PlaygroundStepperProps {
  activeTab: PlaygroundTabId;
  currentStep?: number;
  defaultCurrentStep?: number;
  onStepChange?: (stepIndex: number) => void;
}

/**
 * @deprecated PlaygroundStepper is no longer used. Use tabs directly.
 */
export function PlaygroundStepper(_props: PlaygroundStepperProps) {
  return (
    <div
      className={`
        ${getSpacingClass('base', 'p')}
        text-center
        ${getColorClass('neutral', 'DEFAULT', 'text')}
        ${getTypographyClasses('body')}
      `}
    >
      Stepper is deprecated. Use tabs directly.
    </div>
  );
}
