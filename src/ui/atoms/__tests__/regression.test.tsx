/**
 * Regression Tests for Atoms
 * 
 * These tests ensure that critical functionality doesn't break
 * when making changes to atoms.
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import React from 'react';

// Import all atoms
import Button from '../Button/Button';
import Checkbox from '../Checkbox/Checkbox';
import Radio from '../Radio/Radio';
import Input from '../Input/Input';
import Select from '../Select/Select';
import Textarea from '../Textarea/Textarea';
import Switch from '../Switch/Switch';
import Chip from '../Chip/Chip';
import Badge from '../Badge/Badge';
import Spinner from '../Spinner/Spinner';
import Progress from '../Progress/Progress';

describe('Atoms Regression Tests', () => {
  describe('Form Inputs - Controlled/Uncontrolled', () => {
    it('Checkbox works as controlled component', async () => {
      const ControlledCheckbox = () => {
        const [checked, setChecked] = useState(false);
        return (
          <Checkbox
            label="Test"
            checked={checked}
            onChange={(e) => setChecked(e.target.checked)}
          />
        );
      };

      render(<ControlledCheckbox />);
      const checkbox = screen.getByLabelText('Test') as HTMLInputElement;
      expect(checkbox.checked).toBe(false);
      await act(async () => {
        await userEvent.click(checkbox);
      });
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0));
      });
      expect(checkbox.checked).toBe(true);
    });

    it('Radio works as controlled component', async () => {
      const ControlledRadio = () => {
        const [value, setValue] = useState('');
        return (
          <>
            <Radio
              label="Option 1"
              name="test"
              value="1"
              checked={value === '1'}
              onChange={(e) => setValue(e.target.value)}
            />
            <Radio
              label="Option 2"
              name="test"
              value="2"
              checked={value === '2'}
              onChange={(e) => setValue(e.target.value)}
            />
          </>
        );
      };

      render(<ControlledRadio />);
      const radio1 = screen.getByLabelText('Option 1') as HTMLInputElement;
      await act(async () => {
        await userEvent.click(radio1);
      });
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0));
      });
      expect(radio1.checked).toBe(true);
    });

    it('Input works as controlled component', async () => {
      const ControlledInput = () => {
        const [value, setValue] = useState('');
        return (
          <Input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Type here"
          />
        );
      };

      render(<ControlledInput />);
      const input = screen.getByPlaceholderText('Type here') as HTMLInputElement;
      await act(async () => {
        await userEvent.type(input, 'test');
      });
      expect(input.value).toBe('test');
    });
  });

  describe('Accessibility - ARIA Attributes', () => {
    it('Checkbox has correct aria attributes', () => {
      render(<Checkbox label="Test" error helperText="Error message" id="test-checkbox" />);
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toHaveAttribute('aria-invalid', 'true');
      expect(checkbox).toHaveAttribute('aria-describedby', 'test-checkbox-error');
    });

    it('Radio has correct aria attributes', () => {
      render(<Radio label="Test" error helperText="Error message" id="test-radio" />);
      const radio = screen.getByRole('radio');
      expect(radio).toHaveAttribute('aria-invalid', 'true');
      expect(radio).toHaveAttribute('aria-describedby', 'test-radio-error');
    });

    it('Input has correct aria attributes', () => {
      render(<Input label="Email" error helperText="Invalid email" id="email" />);
      const input = screen.getByLabelText('Email');
      expect(input).toHaveAttribute('aria-invalid', 'true');
      expect(input).toHaveAttribute('aria-describedby', 'email-error');
    });

    it('Button has aria-busy when loading', () => {
      render(<Button isLoading>Loading</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-busy', 'true');
    });
  });

  describe('Keyboard Navigation', () => {
    it('Checkbox responds to Space key', async () => {
      const handleChange = vi.fn();
      render(<Checkbox label="Test" onChange={handleChange} />);
      const checkbox = screen.getByLabelText('Test');
      checkbox.focus();
      await act(async () => {
        await userEvent.keyboard(' ');
      });
      expect(handleChange).toHaveBeenCalled();
    });

    it('Button responds to Enter key', async () => {
      const handleClick = vi.fn();
      render(<Button onClick={handleClick}>Click me</Button>);
      const button = screen.getByRole('button');
      button.focus();
      await act(async () => {
        await userEvent.keyboard('{Enter}');
      });
      expect(handleClick).toHaveBeenCalled();
    });
  });

  describe('Error States', () => {
    it('Form inputs show error state correctly', () => {
      const { container: checkboxContainer } = render(<Checkbox label="Test" error />);
      const { container: radioContainer } = render(<Radio label="Test" error />);
      const { container: inputContainer } = render(<Input label="Test" error />);
      
      expect(checkboxContainer.querySelector('[aria-invalid="true"]')).toBeInTheDocument();
      expect(radioContainer.querySelector('[aria-invalid="true"]')).toBeInTheDocument();
      expect(inputContainer.querySelector('[aria-invalid="true"]')).toBeInTheDocument();
    });

    it('Error messages are associated correctly', () => {
      render(<Input label="Email" error helperText="Invalid" id="email" />);
      const input = screen.getByLabelText('Email');
      const errorId = input.getAttribute('aria-describedby');
      expect(errorId).toBeTruthy();
      expect(screen.getByText('Invalid')).toHaveAttribute('id', errorId);
    });
  });

  describe('Disabled States', () => {
    it('All form inputs respect disabled prop', () => {
      const { container: checkboxContainer } = render(<Checkbox label="Checkbox" disabled />);
      const { container: radioContainer } = render(<Radio label="Radio" disabled />);
      const { container: inputContainer } = render(<Input label="Input" disabled />);
      const { container: selectContainer } = render(<Select label="Select" options={[]} disabled />);
      const { container: textareaContainer } = render(<Textarea disabled />);
      const { container: switchContainer } = render(<Switch label="Switch" disabled />);
      const { container: buttonContainer } = render(<Button disabled>Button</Button>);

      expect(checkboxContainer.querySelector('input[type="checkbox"]')).toBeDisabled();
      expect(radioContainer.querySelector('input[type="radio"]')).toBeDisabled();
      expect(inputContainer.querySelector('input')).toBeDisabled();
      expect(selectContainer.querySelector('select')).toBeDisabled();
      expect(textareaContainer.querySelector('textarea')).toBeDisabled();
      expect(switchContainer.querySelector('input[type="checkbox"]')).toBeDisabled();
      expect(buttonContainer.querySelector('button')).toBeDisabled();
    });
  });

  describe('ForwardRef', () => {
    it('Checkbox forwards ref correctly', () => {
      const ref = { current: null } as React.RefObject<HTMLInputElement>;
      render(<Checkbox label="Test" ref={ref} />);
      expect(ref.current).toBeInstanceOf(HTMLInputElement);
    });

    it('Radio forwards ref correctly', () => {
      const ref = { current: null } as React.RefObject<HTMLInputElement>;
      render(<Radio label="Test" ref={ref} />);
      expect(ref.current).toBeInstanceOf(HTMLInputElement);
    });

    it('Textarea forwards ref correctly', () => {
      const ref = { current: null } as React.RefObject<HTMLTextAreaElement>;
      render(<Textarea ref={ref} />);
      expect(ref.current).toBeInstanceOf(HTMLTextAreaElement);
    });
  });

  describe('className Merge', () => {
    it('Custom className is merged correctly', () => {
      const { container } = render(
        <>
          <Button className="custom-button">Button</Button>
          <Checkbox label="Test" className="custom-checkbox" />
          <Input className="custom-input" />
        </>
      );

      expect(container.querySelector('.custom-button')).toBeInTheDocument();
      expect(container.querySelector('.custom-checkbox')).toBeInTheDocument();
      expect(container.querySelector('.custom-input')).toBeInTheDocument();
    });
  });

  describe('Design System Integration', () => {
    it('Components use design system tokens', () => {
      // This is a smoke test - if tokens are used, components should render
      render(
        <>
          <Button variant="primary">Button</Button>
          <Badge variant="success">Badge</Badge>
          <Chip variant="default">Chip</Chip>
          <Spinner variant="primary" />
          <Progress variant="primary" value={50} />
        </>
      );

      // If tokens are broken, components might not render or throw errors
      expect(screen.getByText('Button')).toBeInTheDocument();
      expect(screen.getByText('Badge')).toBeInTheDocument();
      expect(screen.getByText('Chip')).toBeInTheDocument();
    });
  });
});
