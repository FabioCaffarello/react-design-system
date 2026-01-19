import { test, expect } from '@playwright/test';

/**
 * E2E Tests for Input Component
 * 
 * These tests verify the Input component behavior in Storybook
 */

test.describe('Input Component', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/?path=/story/atoms-input--default');
  });

  test('should render input with label', async ({ page }) => {
    const input = page.getByRole('textbox');
    await expect(input).toBeVisible();
  });

  test('should be typeable', async ({ page }) => {
    const input = page.getByRole('textbox');
    await input.fill('test value');
    await expect(input).toHaveValue('test value');
  });

  test('should support keyboard navigation', async ({ page }) => {
    const input = page.getByRole('textbox');
    await input.focus();
    await expect(input).toBeFocused();
    
    // Test typing
    await input.type('Hello');
    await expect(input).toHaveValue('Hello');
  });

  test('should have proper ARIA attributes', async ({ page }) => {
    const _input = page.getByRole('textbox');
    
    // Check aria-invalid when error
    await page.goto('/?path=/story/atoms-input--error');
    const errorInput = page.getByRole('textbox');
    const ariaInvalid = await errorInput.getAttribute('aria-invalid');
    expect(ariaInvalid).toBe('true');
  });

  test('should handle disabled state', async ({ page }) => {
    await page.goto('/?path=/story/atoms-input--disabled');
    
    const input = page.getByRole('textbox');
    await expect(input).toBeDisabled();
  });

  test('should show clear button when value exists', async ({ page }) => {
    await page.goto('/?path=/story/atoms-input--with-clear-button');
    
    const input = page.getByRole('textbox');
    await input.fill('test');
    
    const clearButton = page.getByRole('button', { name: 'Clear input' });
    await expect(clearButton).toBeVisible();
    
    await clearButton.click();
    await expect(input).toHaveValue('');
  });

  test('should toggle password visibility', async ({ page }) => {
    await page.goto('/?path=/story/atoms-input--password');
    
    const input = page.getByRole('textbox', { name: /password/i });
    await input.fill('secret123');
    
    // Initially should be password type (hidden)
    const type = await input.getAttribute('type');
    expect(type).toBe('password');
    
    // Toggle visibility
    const toggleButton = page.getByRole('button', { name: /show password/i });
    await toggleButton.click();
    
    // Should now be text type (visible)
    const newType = await input.getAttribute('type');
    expect(newType).toBe('text');
  });

  test('should display helper text', async ({ page }) => {
    await page.goto('/?path=/story/atoms-input--with-helper-text');
    
    const helperText = page.getByText(/helper/i);
    await expect(helperText).toBeVisible();
  });

  test('should display error message', async ({ page }) => {
    await page.goto('/?path=/story/atoms-input--error');
    
    const errorMessage = page.getByRole('alert');
    await expect(errorMessage).toBeVisible();
    await expect(errorMessage).toContainText(/error/i);
  });
});
