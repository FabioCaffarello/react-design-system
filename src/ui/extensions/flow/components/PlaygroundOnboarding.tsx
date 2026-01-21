/**
 * Playground Onboarding Component
 * 
 * Provides guided tour, contextual tooltips, and help panel for new users.
 */

import React, { useState, useCallback, useEffect } from 'react';
import { Card } from '../../../molecules';
import { Button } from '../../../atoms';
import { 
  getSpacingClass, 
  getColorClass, 
  getTypographyClasses 
} from '../../../tokens';

export interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  target?: string; // CSS selector for element to highlight
  position?: 'top' | 'bottom' | 'left' | 'right';
}

const onboardingSteps: OnboardingStep[] = [
  {
    id: 'welcome',
    title: 'Welcome to Flow Playground',
    description: 'This is your workspace for creating and testing flow diagrams. Use the tabs on the left to configure different aspects of your flow.',
  },
  {
    id: 'tabs',
    title: 'Navigation Tabs',
    description: 'Use these tabs to switch between different configuration sections: Nodes & Edges, Canvas, Background, Layout, Validation, Code, and Settings.',
    target: '[data-onboarding="tabs"]',
    position: 'right',
  },
  {
    id: 'canvas',
    title: 'Canvas Area',
    description: 'This is where your flow diagram is displayed. You can drag nodes, create connections, and interact with the flow.',
    target: '[data-onboarding="canvas"]',
    position: 'left',
  },
  {
    id: 'header',
    title: 'Header Controls',
    description: 'Use the header to undo/redo actions, search for nodes/edges, and apply or discard changes.',
    target: '[data-onboarding="header"]',
    position: 'bottom',
  },
];

export interface PlaygroundOnboardingProps {
  onComplete?: () => void;
  showOnFirstVisit?: boolean;
}

export function PlaygroundOnboarding({ 
  onComplete,
  showOnFirstVisit = true 
}: PlaygroundOnboardingProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState(false);

  useEffect(() => {
    if (showOnFirstVisit) {
      const seen = localStorage.getItem('playground-onboarding-seen');
      if (!seen) {
        setIsVisible(true);
      } else {
        setHasSeenOnboarding(true);
      }
    }
  }, [showOnFirstVisit]);

  const handleComplete = useCallback(() => {
    setIsVisible(false);
    localStorage.setItem('playground-onboarding-seen', 'true');
    if (onComplete) {
      onComplete();
    }
  }, [onComplete]);

  const handleNext = useCallback(() => {
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      handleComplete();
    }
  }, [currentStep, handleComplete]);

  const handlePrevious = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  }, [currentStep]);

  const handleSkip = useCallback(() => {
    handleComplete();
  }, [handleComplete]);

  if (!isVisible && hasSeenOnboarding) {
    return null;
  }

  const currentStepData = onboardingSteps[currentStep];

  return (
    <>
      {isVisible && (
        <div
          className="fixed inset-0 z-[9999] pointer-events-none"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
        >
          {/* Overlay */}
          <div className="absolute inset-0" />
          
          {/* Tooltip/Guide */}
          <div
            className="absolute z-[10000] pointer-events-auto"
            style={{
              top: currentStepData.position === 'bottom' ? '80px' : 'auto',
              bottom: currentStepData.position === 'top' ? '80px' : 'auto',
              left: currentStepData.position === 'right' ? '20px' : '50%',
              right: currentStepData.position === 'left' ? '20px' : 'auto',
              transform: currentStepData.position === 'right' || currentStepData.position === 'left' 
                ? 'none' 
                : 'translateX(-50%)',
              maxWidth: '400px',
            }}
          >
            <Card padding="lg" className="shadow-2xl">
              <div className={`flex flex-col ${getSpacingClass('md', 'gap')}`}>
                <div>
                  <h3
                    className={`
                      ${getTypographyClasses('h4')}
                      ${getColorClass('neutral', 'dark', 'text')}
                      m-0
                      ${getSpacingClass('sm', 'mb')}
                    `}
                  >
                    {currentStepData.title}
                  </h3>
                  <p
                    className={`
                      ${getTypographyClasses('body')}
                      ${getColorClass('neutral', 'DEFAULT', 'text')}
                      m-0
                    `}
                  >
                    {currentStepData.description}
                  </p>
                </div>
                
                <div className={`flex items-center justify-between ${getSpacingClass('sm', 'pt')} border-t`}>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleSkip}
                    >
                      Skip Tour
                    </Button>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handlePrevious}
                      disabled={currentStep === 0}
                    >
                      Previous
                    </Button>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={handleNext}
                    >
                      {currentStep === onboardingSteps.length - 1 ? 'Finish' : 'Next'}
                    </Button>
                  </div>
                </div>
                
                {/* Progress indicator */}
                <div className="flex items-center gap-1">
                  {onboardingSteps.map((_, index) => (
                    <div
                      key={index}
                      className={`
                        flex-1 h-1 rounded
                        transition-all duration-200
                        ${index === currentStep 
                          ? getColorClass('primary', 'DEFAULT', 'bg')
                          : getColorClass('neutral', 'light', 'bg')
                        }
                      `}
                    />
                  ))}
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}
    </>
  );
}

/**
 * Help Panel Component
 * Provides quick access to documentation and tips
 */
export function PlaygroundHelpPanel() {
  const [isOpen, setIsOpen] = useState(false);

  const helpTopics = [
    {
      title: 'Getting Started',
      content: 'Start by selecting a template from the Dataset selector, then customize nodes and edges.',
    },
    {
      title: 'Keyboard Shortcuts',
      content: 'Ctrl+Z: Undo, Ctrl+Y: Redo, Ctrl+F: Search, Alt+1-7: Switch tabs',
    },
    {
      title: 'Creating Connections',
      content: 'Click and drag from a node handle to another node to create a connection.',
    },
    {
      title: 'Editing Nodes',
      content: 'Click on a node to select it, then use the editor panel to modify its properties.',
    },
  ];

  if (!isOpen) {
    return (
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 z-50"
        title="Open Help"
      >
        ?
      </Button>
    );
  }

  return (
    <Card
      padding="lg"
      className="fixed bottom-4 right-4 z-50 w-80 max-h-96 overflow-y-auto shadow-xl"
    >
      <div className={`flex flex-col ${getSpacingClass('base', 'gap')}`}>
        <div className="flex items-center justify-between">
          <h3
            className={`
              ${getTypographyClasses('h4')}
              ${getColorClass('neutral', 'dark', 'text')}
              m-0
            `}
          >
            Help & Tips
          </h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsOpen(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <div className={`flex flex-col ${getSpacingClass('md', 'gap')}`}>
          {helpTopics.map((topic, index) => (
            <div key={index}>
              <h4
                className={`
                  ${getTypographyClasses('label')}
                  ${getColorClass('neutral', 'dark', 'text')}
                  m-0
                  ${getSpacingClass('xs', 'mb')}
                `}
              >
                {topic.title}
              </h4>
              <p
                className={`
                  ${getTypographyClasses('caption')}
                  ${getColorClass('neutral', 'DEFAULT', 'text')}
                  m-0
                `}
              >
                {topic.content}
              </p>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
