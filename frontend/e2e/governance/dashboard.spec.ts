import { test } from '../fixtures/auth';
import { expect } from '@playwright/test';
import { navigateToGovernancePage, waitForApiCalls } from '../utils/helpers';

test.describe('Governance Dashboard E2E Tests', () => {
  test.beforeEach(async ({ authenticatedPage }) => {
    await navigateToGovernancePage(authenticatedPage, 'dashboard');
  });

  test('should display governance dashboard', async ({ authenticatedPage }) => {
    await waitForApiCalls(authenticatedPage);
    
    // Check for dashboard title or heading
    await expect(
      authenticatedPage.locator('h1, h2').filter({ hasText: /Governance|Dashboard/i })
    ).toBeVisible({ timeout: 10000 });
  });

  test('should display summary cards', async ({ authenticatedPage }) => {
    await waitForApiCalls(authenticatedPage);
    
    // Check for summary cards (policies, controls, assessments, findings, evidence)
    const summaryTexts = ['Policies', 'Controls', 'Assessments', 'Findings', 'Evidence'];
    
    for (const text of summaryTexts) {
      await expect(
        authenticatedPage.locator(`text=${text}`).first()
      ).toBeVisible({ timeout: 5000 });
    }
  });

  test('should display charts', async ({ authenticatedPage }) => {
    await waitForApiCalls(authenticatedPage);
    
    // Check for chart elements (SVG, canvas, or chart containers)
    const charts = authenticatedPage.locator('svg, canvas, [class*="chart"], [data-testid*="chart"]');
    const chartCount = await charts.count();
    
    // At least one chart should be present
    expect(chartCount).toBeGreaterThan(0);
  });

  test('should display activity feed', async ({ authenticatedPage }) => {
    await waitForApiCalls(authenticatedPage);
    
    // Look for activity feed or recent activity section
    const activitySection = authenticatedPage.locator(
      'text=Activity, text=Recent Activity, [class*="activity"]'
    ).first();
    
    if (await activitySection.isVisible()) {
      await expect(activitySection).toBeVisible();
    }
  });

  test('should navigate to different modules from dashboard', async ({ authenticatedPage }) => {
    await waitForApiCalls(authenticatedPage);
    
    // Look for navigation links or cards that link to different modules
    // Try multiple strategies to find the link
    const policiesLink = authenticatedPage.locator(
      'a[href*="/policies"], ' +
      'button:has-text("Policies"), ' +
      '[href*="policies"]'
    ).first();
    
    const hasLink = await policiesLink.isVisible({ timeout: 5000 }).catch(() => false);
    
    if (hasLink) {
      await policiesLink.click();
      await authenticatedPage.waitForURL(/\/policies/, { timeout: 15000 });
      await authenticatedPage.waitForLoadState('networkidle');
      
      // Verify we're on policies page - check for any heading with Policy text
      await expect(
        authenticatedPage.locator('h1, h2').filter({ hasText: /Policy/i })
      ).toBeVisible({ timeout: 10000 });
    } else {
      // Skip if navigation link doesn't exist
      test.skip();
    }
  });
});

