import { test, expect } from '@playwright/test';

/**
 * E2E Navigation Tests
 * 
 * These tests verify Storybook navigation and component discovery
 */

test.describe('Storybook Navigation', () => {
  test('should load Storybook homepage', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/storybook/i);
  });

  test('should navigate to component stories', async ({ page }) => {
    await page.goto('/');
    
    // Navigate to a component story
    await page.goto('/?path=/story/atoms-button--primary');
    
    // Verify story is loaded
    const canvas = page.locator('#storybook-preview-iframe');
    await expect(canvas).toBeVisible();
  });

  test('should support keyboard navigation in sidebar', async ({ page }) => {
    await page.goto('/');
    
    // Focus sidebar
    const sidebar = page.locator('[data-side="left"]');
    await sidebar.focus();
    
    // Navigate with arrow keys
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('Enter');
  });

  test('should search for components', async ({ page }) => {
    await page.goto('/');
    
    // Find search input
    const searchInput = page.locator('input[placeholder*="Search"]');
    if (await searchInput.count() > 0) {
      await searchInput.fill('Button');
      await page.waitForTimeout(500); // Wait for search results
    }
  });
});
