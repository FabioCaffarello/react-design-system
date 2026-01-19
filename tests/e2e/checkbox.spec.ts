import { test, expect } from '@playwright/test';

/**
 * E2E Tests for Checkbox Component
 * 
 * These tests verify the Checkbox component behavior in Storybook
 */

test.describe('Checkbox Component', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/?path=/story/atoms-checkbox--default');
  });

  test('should render checkbox', async ({ page }) => {
    const checkbox = page.getByRole('checkbox');
    await expect(checkbox).toBeVisible();
  });

  test('should be checkable', async ({ page }) => {
    const checkbox = page.getByRole('checkbox');
    await checkbox.check();
    await expect(checkbox).toBeChecked();
  });

  test('should support keyboard navigation', async ({ page }) => {
    const checkbox = page.getByRole('checkbox');
    await checkbox.focus();
    await expect(checkbox).toBeFocused();
    
    // Test Space key to toggle
    await checkbox.press('Space');
    await expect(checkbox).toBeChecked();
  });

  test('should have proper ARIA attributes', async ({ page }) => {
    const _checkbox = page.getByRole('checkbox');
    
    // Check aria-invalid when error
    await page.goto('/?path=/story/atoms-checkbox--error');
    const errorCheckbox = page.getByRole('checkbox');
    const ariaInvalid = await errorCheckbox.getAttribute('aria-invalid');
    expect(ariaInvalid).toBe('true');
  });

  test('should handle disabled state', async ({ page }) => {
    await page.goto('/?path=/story/atoms-checkbox--disabled');
    
    const _checkbox = page.getByRole('checkbox');
    await expect(_checkbox).toBeDisabled();
  });

  test('should display label', async ({ page }) => {
    const _checkbox = page.getByRole('checkbox');
    const label = page.locator('label');
    await expect(label).toBeVisible();
  });

  test('should display helper text', async ({ page }) => {
    await page.goto('/?path=/story/atoms-checkbox--with-helper-text');
    
    const helperText = page.getByText(/helper/i);
    await expect(helperText).toBeVisible();
  });

  test('should display error message', async ({ page }) => {
    await page.goto('/?path=/story/atoms-checkbox--error');
    
    const errorMessage = page.getByRole('alert');
    await expect(errorMessage).toBeVisible();
    await expect(errorMessage).toContainText(/error/i);
  });

  test('should support indeterminate state', async ({ page }) => {
    await page.goto('/?path=/story/atoms-checkbox--indeterminate');
    
    const checkbox = page.getByRole('checkbox');
    const indeterminate = await checkbox.evaluate((el: HTMLInputElement) => el.indeterminate);
    expect(indeterminate).toBe(true);
  });
});
