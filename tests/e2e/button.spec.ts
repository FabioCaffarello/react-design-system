import { test, expect } from '@playwright/test';

/**
 * E2E Tests for Button Component
 * 
 * These tests verify the Button component behavior in Storybook
 */

test.describe('Button Component', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to Button story in Storybook
    await page.goto('/?path=/story/atoms-button--primary');
  });

  test('should render button with text', async ({ page }) => {
    const button = page.getByRole('button');
    await expect(button).toBeVisible();
    await expect(button).toHaveText(/button/i);
  });

  test('should be clickable', async ({ page }) => {
    const button = page.getByRole('button');
    await button.click();
    // Add assertions based on button behavior
  });

  test('should support keyboard navigation', async ({ page }) => {
    const button = page.getByRole('button');
    await button.focus();
    await expect(button).toBeFocused();
    
    // Test Enter key
    await button.press('Enter');
    
    // Test Space key
    await button.press('Space');
  });

  test('should have proper ARIA attributes', async ({ page }) => {
    const button = page.getByRole('button');
    const ariaLabel = await button.getAttribute('aria-label');
    
    // If button has text, aria-label might not be needed
    // But if it's icon-only, it should have aria-label
    const hasText = await button.textContent();
    if (!hasText || hasText.trim() === '') {
      expect(ariaLabel).toBeTruthy();
    }
  });

  test('should handle disabled state', async ({ page }) => {
    // Navigate to disabled story
    await page.goto('/?path=/story/atoms-button--disabled');
    
    const button = page.getByRole('button');
    await expect(button).toBeDisabled();
    await expect(button).toHaveAttribute('aria-disabled', 'true');
  });
});
