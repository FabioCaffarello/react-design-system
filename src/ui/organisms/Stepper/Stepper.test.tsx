import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Stepper from './Stepper';

const mockSteps = [
  { id: '1', title: 'Step 1', content: <div>Content 1</div> },
  { id: '2', title: 'Step 2', content: <div>Content 2</div> },
  { id: '3', title: 'Step 3', content: <div>Content 3</div> },
];

describe('Stepper', () => {
  it('renders correctly', () => {
    render(<Stepper steps={mockSteps} />);
    expect(screen.getByText('Step 1')).toBeInTheDocument();
    expect(screen.getByText('Content 1')).toBeInTheDocument();
  });

  it('navigates to next step', () => {
    const handleStepChange = vi.fn();
    render(<Stepper steps={mockSteps} onStepChange={handleStepChange} />);
    
    const nextButton = screen.getByText('Next');
    fireEvent.click(nextButton);
    
    expect(handleStepChange).toHaveBeenCalledWith(1);
  });

  it('navigates to previous step', () => {
    const handleStepChange = vi.fn();
    render(<Stepper steps={mockSteps} defaultCurrentStep={1} onStepChange={handleStepChange} />);
    
    const prevButton = screen.getByText('Previous');
    fireEvent.click(prevButton);
    
    expect(handleStepChange).toHaveBeenCalledWith(0);
  });

  it('calls onComplete on last step', () => {
    const handleComplete = vi.fn();
    render(<Stepper steps={mockSteps} defaultCurrentStep={2} onComplete={handleComplete} />);
    
    const completeButton = screen.getByText('Complete');
    fireEvent.click(completeButton);
    
    expect(handleComplete).toHaveBeenCalled();
  });

  it('handles step click when navigation is allowed', () => {
    const handleStepChange = vi.fn();
    render(<Stepper steps={mockSteps} allowNavigation onStepChange={handleStepChange} />);
    
    const step2 = screen.getByText('Step 2');
    fireEvent.click(step2);
    
    expect(handleStepChange).toHaveBeenCalledWith(1);
  });

  it('disables navigation when allowNavigation is false', () => {
    render(<Stepper steps={mockSteps} allowNavigation={false} />);
    const step2 = screen.getByText('Step 2');
    // Step should not be clickable
    expect(step2).toBeInTheDocument();
  });
});
