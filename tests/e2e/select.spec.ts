import { test, expect } from '@playwright/test';

/**
 * E2E Tests for Select Component
 * 
 * These tests verify the Select component behavior in Storybook
 */

test.describe('Select Component', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/?path=/story/atoms-select--default');
  });

  test('should render select dropdown', async ({ page }) => {
    const select = page.getByRole('combobox');
    await expect(select).toBeVisible();
  });

  test('should be selectable', async ({ page }) => {
    const select = page.getByRole('combobox');
    await select.selectOption('option1');
    await expect(select).toHaveValue('option1');
  });

  test('should support keyboard navigation', async ({ page }) => {
    const select = page.getByRole('combobox');
    await select.focus();
    await expect(select).toBeFocused();
    
    // Test keyboard selection
    await select.press('ArrowDown');
    await select.press('Enter');
  });

  test('should have proper ARIA attributes', async ({ page }) => {
    const _select = page.getByRole('combobox');
    
    // Check aria-invalid when error
    await page.goto('/?path=/story/atoms-select--error');
    const errorSelect = page.getByRole('combobox');
    const ariaInvalid = await errorSelect.getAttribute('aria-invalid');
    expect(ariaInvalid).toBe('true');
  });

  test('should handle disabled state', async ({ page }) => {
    await page.goto('/?path=/story/atoms-select--disabled');
    
    const select = page.getByRole('combobox');
    await expect(select).toBeDisabled();
  });

  test('should display placeholder', async ({ page }) => {
    await page.goto('/?path=/story/atoms-select--with-placeholder');
    
    const select = page.getByRole('combobox');
    const placeholder = await select.locator('option').first();
    await expect(placeholder).toContainText(/select/i);
  });

  test('should display helper text', async ({ page }) => {
    await page.goto('/?path=/story/atoms-select--with-helper-text');
    
    const helperText = page.getByText(/helper/i);
    await expect(helperText).toBeVisible();
  });

  test('should display error message', async ({ page }) => {
    await page.goto('/?path=/story/atoms-select--error');
    
    const errorMessage = page.getByRole('alert');
    await expect(errorMessage).toBeVisible();
    await expect(errorMessage).toContainText(/error/i);
  });

  test('should support option groups', async ({ page }) => {
    await page.goto('/?path=/story/atoms-select--with-option-groups');
    
    const select = page.getByRole('combobox');
    const optgroups = await select.locator('optgroup').count();
    expect(optgroups).toBeGreaterThan(0);
  });
});
