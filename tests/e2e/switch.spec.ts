import { test, expect } from '@playwright/test';

/**
 * E2E Tests for Switch Component
 * 
 * These tests verify the Switch component behavior in Storybook
 */

test.describe('Switch Component', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/?path=/story/atoms-switch--default');
  });

  test('should render switch', async ({ page }) => {
    const switchButton = page.getByRole('switch');
    await expect(switchButton).toBeVisible();
  });

  test('should be toggleable', async ({ page }) => {
    const switchButton = page.getByRole('switch');
    const initialChecked = await switchButton.getAttribute('aria-checked');
    
    await switchButton.click();
    
    const newChecked = await switchButton.getAttribute('aria-checked');
    expect(newChecked).not.toBe(initialChecked);
  });

  test('should support keyboard navigation', async ({ page }) => {
    const switchButton = page.getByRole('switch');
    await switchButton.focus();
    await expect(switchButton).toBeFocused();
    
    // Test Space key to toggle
    await switchButton.press('Space');
    const checked = await switchButton.getAttribute('aria-checked');
    expect(checked).toBe('true');
  });

  test('should have proper ARIA attributes', async ({ page }) => {
    const switchButton = page.getByRole('switch');
    const ariaChecked = await switchButton.getAttribute('aria-checked');
    expect(ariaChecked).toBeTruthy();
  });

  test('should handle disabled state', async ({ page }) => {
    await page.goto('/?path=/story/atoms-switch--disabled');
    
    const switchButton = page.getByRole('switch');
    await expect(switchButton).toBeDisabled();
  });

  test('should display label', async ({ page }) => {
    await page.goto('/?path=/story/atoms-switch--with-label');
    
    const label = page.locator('label');
    await expect(label).toBeVisible();
  });

  test('should display description', async ({ page }) => {
    await page.goto('/?path=/story/atoms-switch--with-description');
    
    const description = page.getByText(/description/i);
    await expect(description).toBeVisible();
  });

  test('should show checked state visually', async ({ page }) => {
    const switchButton = page.getByRole('switch');
    
    // Check initial state
    const initialChecked = await switchButton.getAttribute('aria-checked');
    
    // Toggle
    await switchButton.click();
    
    // Verify state changed
    const newChecked = await switchButton.getAttribute('aria-checked');
    expect(newChecked).not.toBe(initialChecked);
  });

  test('should support Enter key', async ({ page }) => {
    const switchButton = page.getByRole('switch');
    await switchButton.focus();
    
    await switchButton.press('Enter');
    const checked = await switchButton.getAttribute('aria-checked');
    expect(checked).toBe('true');
  });
});
