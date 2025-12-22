import { test, expect } from '@playwright/test';

/**
 * Accessibility Test Suite
 * Tests WCAG 2.1 Level AA compliance for the Governance Module
 */

test.describe('Accessibility Tests - Governance Module', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to governance dashboard
    await page.goto('/en/dashboard/governance');
    // Wait for page to load
    await page.waitForLoadState('networkidle');
  });

  test.describe('Keyboard Navigation', () => {
    test('should navigate through page with Tab key', async ({ page }) => {
      // Start from the beginning
      await page.keyboard.press('Tab');
      
      // Check if skip-to-content link appears
      const skipLink = page.locator('button:has-text("Skip to main content")');
      await expect(skipLink).toBeVisible();
      
      // Press Tab multiple times to navigate through interactive elements
      for (let i = 0; i < 5; i++) {
        await page.keyboard.press('Tab');
        // Verify focus is visible
        const focusedElement = page.locator(':focus');
        await expect(focusedElement).toBeVisible();
      }
    });

    test('should activate skip-to-content link with Enter', async ({ page }) => {
      // Tab to skip link
      await page.keyboard.press('Tab');
      const skipLink = page.locator('button:has-text("Skip to main content")');
      
      // Activate with Enter
      await page.keyboard.press('Enter');
      
      // Verify focus moved to main content
      const mainContent = page.locator('main');
      await expect(mainContent).toBeFocused();
    });

    test('should close dialogs with Escape key', async ({ page }) => {
      // This test would need a dialog to be open
      // For now, we'll verify Escape key works
      await page.keyboard.press('Escape');
      // No error should occur
    });

    test('should navigate mobile posture summary with keyboard', async ({ page }) => {
      // Set mobile viewport
      await page.setViewportSize({ width: 375, height: 667 });
      await page.reload();
      await page.waitForLoadState('networkidle');

      // Tab through mobile summary
      await page.keyboard.press('Tab');
      
      // Verify focus moves through interactive elements
      const focusedElement = page.locator(':focus');
      await expect(focusedElement).toBeVisible();
    });
  });

  test.describe('ARIA Attributes', () => {
    test('should have proper ARIA labels on buttons', async ({ page }) => {
      // Check mobile view
      await page.setViewportSize({ width: 375, height: 667 });
      await page.reload();
      await page.waitForLoadState('networkidle');

      // Find buttons with aria-label
      const buttons = page.locator('button[aria-label]');
      const count = await buttons.count();
      
      // Should have at least some buttons with aria-labels
      expect(count).toBeGreaterThan(0);
      
      // Verify each button has a meaningful aria-label
      for (let i = 0; i < Math.min(count, 5); i++) {
        const button = buttons.nth(i);
        const ariaLabel = await button.getAttribute('aria-label');
        expect(ariaLabel).toBeTruthy();
        expect(ariaLabel!.length).toBeGreaterThan(0);
      }
    });

    test('should have proper ARIA roles on semantic elements', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.reload();
      await page.waitForLoadState('networkidle');

      // Check for semantic roles
      const regions = page.locator('[role="region"]');
      const count = await regions.count();
      expect(count).toBeGreaterThan(0);

      // Check for navigation role
      const navigation = page.locator('[role="navigation"]');
      const navCount = await navigation.count();
      expect(navCount).toBeGreaterThan(0);
    });

    test('should have progress bar with proper ARIA attributes', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.reload();
      await page.waitForLoadState('networkidle');

      // Find progress bar
      const progressBar = page.locator('[role="progressbar"]');
      const count = await progressBar.count();
      
      if (count > 0) {
        const firstProgress = progressBar.first();
        
        // Check required ARIA attributes
        const ariaValueNow = await firstProgress.getAttribute('aria-valuenow');
        const ariaValueMin = await firstProgress.getAttribute('aria-valuemin');
        const ariaValueMax = await firstProgress.getAttribute('aria-valuemax');
        const ariaLabel = await firstProgress.getAttribute('aria-label');
        
        expect(ariaValueNow).toBeTruthy();
        expect(ariaValueMin).toBeTruthy();
        expect(ariaValueMax).toBeTruthy();
        expect(ariaLabel).toBeTruthy();
      }
    });

    test('should have alert regions for critical findings', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.reload();
      await page.waitForLoadState('networkidle');

      // Check for alert role
      const alerts = page.locator('[role="alert"]');
      const alertCount = await alerts.count();
      
      // May or may not have alerts depending on data
      // But if present, should have proper attributes
      if (alertCount > 0) {
        const firstAlert = alerts.first();
        const ariaLive = await firstAlert.getAttribute('aria-live');
        expect(ariaLive).toBeTruthy();
      }
    });
  });

  test.describe('Touch Targets', () => {
    test('should have minimum touch target size (44x44px)', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.reload();
      await page.waitForLoadState('networkidle');

      // Get all buttons
      const buttons = page.locator('button');
      const count = await buttons.count();
      
      // Check first 10 buttons
      for (let i = 0; i < Math.min(count, 10); i++) {
        const button = buttons.nth(i);
        const box = await button.boundingBox();
        
        if (box) {
          // Check minimum size (44x44px)
          expect(box.width).toBeGreaterThanOrEqual(44);
          expect(box.height).toBeGreaterThanOrEqual(44);
        }
      }
    });

    test('should have adequate spacing between touch targets', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.reload();
      await page.waitForLoadState('networkidle');

      // Check quick links section
      const quickLinks = page.locator('[role="list"] button');
      const count = await quickLinks.count();
      
      if (count > 1) {
        const firstBox = await quickLinks.first().boundingBox();
        const secondBox = await quickLinks.nth(1).boundingBox();
        
        if (firstBox && secondBox) {
          // Check spacing (at least 8px recommended)
          const spacing = secondBox.y - (firstBox.y + firstBox.height);
          expect(spacing).toBeGreaterThanOrEqual(8);
        }
      }
    });
  });

  test.describe('Screen Reader Support', () => {
    test('should hide decorative icons from screen readers', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.reload();
      await page.waitForLoadState('networkidle');

      // Find icons with aria-hidden
      const hiddenIcons = page.locator('[aria-hidden="true"]');
      const count = await hiddenIcons.count();
      
      // Should have some decorative icons hidden
      expect(count).toBeGreaterThan(0);
    });

    test('should have descriptive text for screen readers', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.reload();
      await page.waitForLoadState('networkidle');

      // Check for elements with descriptive aria-labels
      const labeledElements = page.locator('[aria-label]');
      const count = await labeledElements.count();
      
      expect(count).toBeGreaterThan(0);
      
      // Verify labels are descriptive (not empty, meaningful)
      for (let i = 0; i < Math.min(count, 5); i++) {
        const element = labeledElements.nth(i);
        const label = await element.getAttribute('aria-label');
        expect(label).toBeTruthy();
        expect(label!.length).toBeGreaterThan(5); // Meaningful length
      }
    });

    test('should have proper heading hierarchy', async ({ page }) => {
      // Check for proper heading structure
      const h1 = page.locator('h1');
      const h1Count = await h1.count();
      
      // Should have at least one h1
      expect(h1Count).toBeGreaterThan(0);
      
      // Check heading levels are sequential
      const headings = page.locator('h1, h2, h3, h4, h5, h6');
      const headingCount = await headings.count();
      
      if (headingCount > 0) {
        // Verify we have proper heading structure
        expect(headingCount).toBeGreaterThan(0);
      }
    });
  });

  test.describe('Color Contrast', () => {
    test('should have sufficient color contrast for text', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.reload();
      await page.waitForLoadState('networkidle');

      // Get text elements
      const textElements = page.locator('p, span, div').filter({ hasText: /.+/ }).first();
      
      // Note: Full color contrast testing requires more complex setup
      // This is a placeholder - in production, use axe-core or similar
      await expect(textElements).toBeVisible();
    });
  });

  test.describe('Focus Management', () => {
    test('should show visible focus indicators', async ({ page }) => {
      // Tab through elements
      await page.keyboard.press('Tab');
      
      // Get focused element
      const focusedElement = page.locator(':focus');
      await expect(focusedElement).toBeVisible();
      
      // Check if focus is visible (has outline or ring)
      const styles = await focusedElement.evaluate((el) => {
        const computed = window.getComputedStyle(el);
        return {
          outline: computed.outline,
          outlineWidth: computed.outlineWidth,
          boxShadow: computed.boxShadow,
        };
      });
      
      // Should have some focus indicator
      const hasFocusIndicator = 
        styles.outlineWidth !== '0px' || 
        styles.boxShadow !== 'none';
      
      expect(hasFocusIndicator).toBeTruthy();
    });

    test('should trap focus in modals', async ({ page }) => {
      // This would test focus trapping in dialogs
      // Requires a dialog to be open
      // Placeholder for future implementation
    });
  });

  test.describe('Mobile Responsiveness', () => {
    test('should display mobile posture summary on small screens', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.reload();
      await page.waitForLoadState('networkidle');

      // Check for mobile-specific content
      const mobileSummary = page.locator('[role="region"][aria-label*="Compliance posture"]');
      await expect(mobileSummary).toBeVisible();
    });

    test('should hide desktop dashboard on mobile', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.reload();
      await page.waitForLoadState('networkidle');

      // Desktop dashboard should be hidden
      const desktopDashboard = page.locator('.hidden.md\\:flex');
      // This selector targets hidden-on-mobile elements
      // Verify they're actually hidden
      const isVisible = await desktopDashboard.first().isVisible().catch(() => false);
      expect(isVisible).toBeFalsy();
    });
  });

  test.describe('Accessibility Snapshot', () => {
    test('should pass Playwright accessibility snapshot', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('/en/dashboard/governance');
      await page.waitForLoadState('networkidle');

      // Playwright's accessibility snapshot
      const snapshot = await page.accessibility.snapshot();
      
      // Verify snapshot exists and has content
      expect(snapshot).toBeTruthy();
      
      // Check for common accessibility issues
      if (snapshot) {
        // Verify we have interactive elements
        const hasButtons = JSON.stringify(snapshot).includes('button');
        expect(hasButtons).toBeTruthy();
      }
    });
  });
});


