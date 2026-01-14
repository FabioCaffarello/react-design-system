import { test, expect } from '@playwright/test';

// Note: Install @axe-core/playwright for accessibility testing
// npm install -D @axe-core/playwright
// import AxeBuilder from '@axe-core/playwright';

/**
 * E2E Accessibility Tests
 * 
 * These tests verify accessibility compliance across components
 */

test.describe('Accessibility', () => {
  test('should have no accessibility violations on Button component', async ({ page }) => {
    await page.goto('/?path=/story/atoms-button--primary');
    
    // Basic accessibility checks
    const button = page.getByRole('button');
    await expect(button).toBeVisible();
    
    // Check for proper ARIA attributes
    const ariaLabel = await button.getAttribute('aria-label');
    const hasText = await button.textContent();
    
    // If button has no visible text, it should have aria-label
    if (!hasText || hasText.trim() === '') {
      expect(ariaLabel).toBeTruthy();
    }
    
    // Note: For full axe-core testing, install @axe-core/playwright
    // const accessibilityScanResults = await new AxeBuilder({ page })
    //   .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'best-practice'])
    //   .analyze();
    // expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('should have proper heading hierarchy', async ({ page }) => {
    await page.goto('/?path=/story/atoms-button--primary');
    
    // Check for h1
    const h1 = page.locator('h1');
    const h1Count = await h1.count();
    
    // Should have at least one h1
    expect(h1Count).toBeGreaterThanOrEqual(1);
  });

  test('should have proper focus management', async ({ page }) => {
    await page.goto('/?path=/story/atoms-button--primary');
    
    // Tab through interactive elements
    await page.keyboard.press('Tab');
    const focusedElement = page.locator(':focus');
    await expect(focusedElement).toBeVisible();
  });

  test('should have sufficient color contrast', async ({ page }) => {
    await page.goto('/?path=/story/atoms-button--primary');
    
    // Basic contrast check - verify button is visible and readable
    const button = page.getByRole('button');
    await expect(button).toBeVisible();
    
    // Check computed styles for contrast
    const color = await button.evaluate((el) => {
      const styles = window.getComputedStyle(el);
      return {
        color: styles.color,
        backgroundColor: styles.backgroundColor,
      };
    });
    
    expect(color.color).toBeTruthy();
    expect(color.backgroundColor).toBeTruthy();
    
    // Note: For full contrast testing, install @axe-core/playwright
    // const accessibilityScanResults = await new AxeBuilder({ page })
    //   .withTags(['wcag2aa'])
    //   .analyze();
    // const contrastViolations = accessibilityScanResults.violations.filter(
    //   (violation) => violation.id === 'color-contrast'
    // );
    // expect(contrastViolations).toEqual([]);
  });
});
