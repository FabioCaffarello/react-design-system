import { test, expect } from '@playwright/test';

/**
 * E2E Tests for Radio Component
 * 
 * These tests verify the Radio component behavior in Storybook
 */

test.describe('Radio Component', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/?path=/story/atoms-radio--default');
  });

  test('should render radio button', async ({ page }) => {
    const radio = page.getByRole('radio');
    await expect(radio).toBeVisible();
  });

  test('should be selectable', async ({ page }) => {
    const radio = page.getByRole('radio');
    await radio.check();
    await expect(radio).toBeChecked();
  });

  test('should support keyboard navigation', async ({ page }) => {
    const radio = page.getByRole('radio');
    await radio.focus();
    await expect(radio).toBeFocused();
    
    // Test Space key to select
    await radio.press('Space');
    await expect(radio).toBeChecked();
  });

  test('should have proper ARIA attributes', async ({ page }) => {
    const radio = page.getByRole('radio');
    
    // Check aria-invalid when error
    await page.goto('/?path=/story/atoms-radio--error');
    const errorRadio = page.getByRole('radio');
    const ariaInvalid = await errorRadio.getAttribute('aria-invalid');
    expect(ariaInvalid).toBe('true');
  });

  test('should handle disabled state', async ({ page }) => {
    await page.goto('/?path=/story/atoms-radio--disabled');
    
    const radio = page.getByRole('radio');
    await expect(radio).toBeDisabled();
  });

  test('should display label', async ({ page }) => {
    const radio = page.getByRole('radio');
    const label = page.locator('label');
    await expect(label).toBeVisible();
  });

  test('should display helper text', async ({ page }) => {
    await page.goto('/?path=/story/atoms-radio--with-helper-text');
    
    const helperText = page.getByText(/helper/i);
    await expect(helperText).toBeVisible();
  });

  test('should display error message', async ({ page }) => {
    await page.goto('/?path=/story/atoms-radio--error');
    
    const errorMessage = page.getByRole('alert');
    await expect(errorMessage).toBeVisible();
    await expect(errorMessage).toContainText(/error/i);
  });

  test('should work in radio group', async ({ page }) => {
    await page.goto('/?path=/story/atoms-radio--radio-group');
    
    const radios = page.getByRole('radio');
    const count = await radios.count();
    expect(count).toBeGreaterThan(1);
    
    // Select first radio
    await radios.first().check();
    await expect(radios.first()).toBeChecked();
    
    // Select second radio - first should be unchecked
    await radios.nth(1).check();
    await expect(radios.first()).not.toBeChecked();
    await expect(radios.nth(1)).toBeChecked();
  });
});
