/* eslint-disable react-refresh/only-export-components */
import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within, waitFor } from '@storybook/test';
import { Button } from '../atoms';
import { Input } from '../atoms';
import { Label } from '../atoms';
import Modal from '../organisms/Modal/Modal';
import { useState } from 'react';

const meta: Meta = {
  title: 'Accessibility/Examples',
  parameters: {
    docs: {
      description: {
        component: `
# Accessibility Examples

These stories demonstrate proper accessibility patterns and can be used for testing with screen readers and keyboard navigation.

## Testing Instructions

1. **Keyboard Navigation**: Use Tab, Shift+Tab, Enter, Space, and Arrow keys
2. **Screen Reader**: Test with NVDA, VoiceOver, or JAWS
3. **Color Contrast**: Verify all text meets WCAG AA standards
4. **Focus Management**: Check that focus is visible and logical
        `,
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj;

/**
 * Keyboard Navigation Example
 * 
 * Demonstrates proper keyboard navigation patterns.
 * Test with Tab, Shift+Tab, Enter, and Space keys.
 */
export const KeyboardNavigation: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: '1rem' }}>
      <h2>Keyboard Navigation Test</h2>
      <p>Use Tab to navigate through the elements below:</p>
      
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <Button>First Button</Button>
        <Button variant="secondary">Second Button</Button>
        <Button variant="outline">Third Button</Button>
      </div>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxWidth: '300px' }}>
        <Label htmlFor="input-1">Input 1</Label>
        <Input id="input-1" placeholder="Type here..." />
        
        <Label htmlFor="input-2">Input 2</Label>
        <Input id="input-2" placeholder="Type here..." />
      </div>
      
      <div>
        <a href="#" style={{ marginRight: '1rem' }}>Link 1</a>
        <a href="#" style={{ marginRight: '1rem' }}>Link 2</a>
        <a href="#">Link 3</a>
      </div>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    // Test keyboard navigation
    const firstButton = canvas.getByRole('button', { name: /first button/i });
    await userEvent.tab();
    expect(firstButton).toHaveFocus();
    
    await userEvent.tab();
    const secondButton = canvas.getByRole('button', { name: /second button/i });
    expect(secondButton).toHaveFocus();
    
    await userEvent.tab();
    const thirdButton = canvas.getByRole('button', { name: /third button/i });
    expect(thirdButton).toHaveFocus();
    
    // Test input navigation
    await userEvent.tab();
    const input1 = canvas.getByLabelText(/input 1/i);
    expect(input1).toHaveFocus();
    
    await userEvent.tab();
    const input2 = canvas.getByLabelText(/input 2/i);
    expect(input2).toHaveFocus();
    
    // Test link navigation
    await userEvent.tab();
    const link1 = canvas.getByRole('link', { name: /link 1/i });
    expect(link1).toHaveFocus();
  },
  parameters: {
    docs: {
      description: {
        story: 'Navigate through all interactive elements using only the keyboard. Focus should be visible and logical.',
      },
    },
  },
};

/**
 * Focus Management Example Component
 * 
 * Demonstrates proper focus trapping in modals.
 */
function FocusManagementExample() {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div style={{ padding: '1rem' }}>
      <Button onClick={() => setIsOpen(true)}>Open Modal</Button>
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Focus Management Test"
      >
        <p>This modal traps focus. Press Tab to cycle through elements, Escape to close.</p>
        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
          <Button onClick={() => setIsOpen(false)}>Cancel</Button>
          <Button variant="primary" onClick={() => setIsOpen(false)}>Confirm</Button>
        </div>
      </Modal>
    </div>
  );
}

/**
 * Focus Management Example
 * 
 * Demonstrates proper focus trapping in modals.
 */
export const FocusManagement: Story = {
  render: () => <FocusManagementExample />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    // Open modal
    const openButton = canvas.getByRole('button', { name: /open modal/i });
    await userEvent.click(openButton);
    
    // Wait for modal to appear
    await waitFor(() => {
      expect(canvas.getByRole('dialog')).toBeInTheDocument();
    });
    
    // Test focus trapping - focus should be on first focusable element
    const cancelButton = canvas.getByRole('button', { name: /cancel/i });
    await waitFor(() => {
      expect(cancelButton).toHaveFocus();
    });
    
    // Test Tab navigation within modal
    await userEvent.tab();
    const confirmButton = canvas.getByRole('button', { name: /confirm/i });
    expect(confirmButton).toHaveFocus();
    
    // Test Escape key closes modal
    await userEvent.keyboard('{Escape}');
    await waitFor(() => {
      expect(canvas.queryByRole('dialog')).not.toBeInTheDocument();
    });
    
    // Focus should return to trigger button
    expect(openButton).toHaveFocus();
  },
  parameters: {
    docs: {
      description: {
        story: 'Open the modal and test focus trapping. Focus should cycle within the modal and restore to the trigger button when closed.',
      },
    },
  },
};

/**
 * ARIA Labels Example
 * 
 * Demonstrates proper use of ARIA attributes.
 */
export const AriaLabels: Story = {
  render: () => (
    <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <h2>ARIA Labels Examples</h2>
      
      {/* Icon-only button with aria-label */}
      <div>
        <h3>Icon-only Button</h3>
        <Button aria-label="Close dialog">
          ×
        </Button>
        <p style={{ fontSize: '0.875rem', color: '#666', marginTop: '0.5rem' }}>
          Screen readers will announce "Close dialog" button
        </p>
      </div>
      
      {/* Button with aria-busy */}
      <div>
        <h3>Loading Button</h3>
        <Button aria-busy="true" aria-disabled="true">
          Loading...
        </Button>
        <p style={{ fontSize: '0.875rem', color: '#666', marginTop: '0.5rem' }}>
          Screen readers will announce "Loading... button, busy, disabled"
        </p>
      </div>
      
      {/* Form with aria-describedby */}
      <div>
        <h3>Form with Error Message</h3>
        <Label htmlFor="email-input">Email</Label>
        <Input
          id="email-input"
          type="email"
          aria-invalid="true"
          aria-describedby="email-error"
          defaultValue="invalid-email"
        />
        <span id="email-error" role="alert" style={{ color: 'red', fontSize: '0.875rem', display: 'block', marginTop: '0.25rem' }}>
          Please enter a valid email address
        </span>
        <p style={{ fontSize: '0.875rem', color: '#666', marginTop: '0.5rem' }}>
          Screen readers will announce the error message when the input is focused
        </p>
      </div>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    // Test icon-only button has aria-label
    const closeButton = canvas.getByRole('button', { name: /close dialog/i });
    expect(closeButton).toHaveAttribute('aria-label', 'Close dialog');
    
    // Test loading button has aria-busy and aria-disabled
    const loadingButton = canvas.getByRole('button', { name: /loading/i });
    expect(loadingButton).toHaveAttribute('aria-busy', 'true');
    expect(loadingButton).toHaveAttribute('aria-disabled', 'true');
    
    // Test input with error has aria-invalid and aria-describedby
    const emailInput = canvas.getByLabelText(/email/i);
    expect(emailInput).toHaveAttribute('aria-invalid', 'true');
    expect(emailInput).toHaveAttribute('aria-describedby', 'email-error');
    
    // Test error message is announced
    const errorMessage = canvas.getByRole('alert');
    expect(errorMessage).toBeInTheDocument();
    expect(errorMessage).toHaveTextContent(/valid email address/i);
  },
  parameters: {
    docs: {
      description: {
        story: 'Examples of proper ARIA attribute usage. Test with a screen reader to hear how these are announced.',
      },
    },
  },
};

/**
 * Color Contrast Example
 * 
 * Demonstrates proper color contrast ratios.
 */
export const ColorContrast: Story = {
  render: () => (
    <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <h2>Color Contrast Examples</h2>
      
      <div>
        <h3>WCAG AA Compliant (4.5:1)</h3>
        <div style={{ 
          backgroundColor: '#6366f1', 
          color: '#ffffff', 
          padding: '1rem',
          borderRadius: '4px',
          marginTop: '0.5rem'
        }}>
          This text has sufficient contrast (4.5:1) for normal text
        </div>
      </div>
      
      <div>
        <h3>Large Text (3:1)</h3>
        <div style={{ 
          backgroundColor: '#818cf8', 
          color: '#ffffff', 
          padding: '1rem',
          borderRadius: '4px',
          marginTop: '0.5rem',
          fontSize: '18px',
          fontWeight: 'bold'
        }}>
          This large text has sufficient contrast (3:1)
        </div>
      </div>
      
      <div>
        <h3>Error State (Not Color Alone)</h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '1.25rem' }}>⚠️</span>
          <span style={{ color: '#dc2626', fontWeight: '600' }}>
            Error: This message uses icon + color + text
          </span>
        </div>
        <p style={{ fontSize: '0.875rem', color: '#666', marginTop: '0.5rem' }}>
          Error messages should not rely on color alone. Use icons and text as well.
        </p>
      </div>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    // Test that text elements are present (color contrast is tested by a11y addon)
    const normalText = canvas.getByText(/sufficient contrast.*normal text/i);
    expect(normalText).toBeInTheDocument();
    
    const largeText = canvas.getByText(/large text.*sufficient contrast/i);
    expect(largeText).toBeInTheDocument();
    
    // Test error message doesn't rely on color alone
    const errorMessage = canvas.getByText(/error:.*icon.*color.*text/i);
    expect(errorMessage).toBeInTheDocument();
  },
  parameters: {
    docs: {
      description: {
        story: 'Examples of proper color contrast. All text should meet WCAG AA standards (4.5:1 for normal text, 3:1 for large text).',
      },
    },
  },
};

/**
 * Screen Reader Example
 * 
 * Demonstrates semantic HTML and screen reader announcements.
 */
export const ScreenReaderSupport: Story = {
  render: () => (
    <div style={{ padding: '1rem' }}>
      <h2>Screen Reader Support</h2>
      
      <nav aria-label="Main navigation" style={{ marginTop: '1rem' }}>
        <ul style={{ listStyle: 'none', padding: 0, display: 'flex', gap: '1rem' }}>
          <li><a href="#" aria-current="page">Home</a></li>
          <li><a href="#">About</a></li>
          <li><a href="#">Contact</a></li>
        </ul>
      </nav>
      
      <main style={{ marginTop: '2rem' }}>
        <article>
          <h1>Article Title</h1>
          <p>This is an article with proper semantic HTML. Screen readers will announce the structure correctly.</p>
          
          <section>
            <h2>Section Heading</h2>
            <p>Content in a section with proper heading hierarchy.</p>
          </section>
        </article>
      </main>
      
      <aside style={{ marginTop: '2rem', padding: '1rem', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
        <h2>Related Information</h2>
        <p>This is an aside with related content.</p>
      </aside>
      
      <footer style={{ marginTop: '2rem', padding: '1rem', borderTop: '1px solid #e5e5e5' }}>
        <p>© 2024 Design System. All rights reserved.</p>
      </footer>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    // Test semantic HTML structure
    const nav = canvas.getByRole('navigation', { name: /main navigation/i });
    expect(nav).toBeInTheDocument();
    
    const main = canvas.getByRole('main');
    expect(main).toBeInTheDocument();
    
    const article = canvas.getByRole('article');
    expect(article).toBeInTheDocument();
    
    // Test heading hierarchy
    const h1 = canvas.getByRole('heading', { name: /article title/i, level: 1 });
    expect(h1).toBeInTheDocument();
    
    const h2 = canvas.getByRole('heading', { name: /section heading/i, level: 2 });
    expect(h2).toBeInTheDocument();
    
    // Test navigation links
    const homeLink = canvas.getByRole('link', { name: /home/i });
    expect(homeLink).toHaveAttribute('aria-current', 'page');
    
    // Test list structure
    const listItems = canvas.getAllByRole('listitem');
    expect(listItems.length).toBeGreaterThan(0);
  },
  parameters: {
    docs: {
      description: {
        story: 'Example of semantic HTML structure. Test with a screen reader to hear how the page structure is announced.',
      },
    },
  },
};
