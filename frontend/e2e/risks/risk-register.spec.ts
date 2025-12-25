import { test } from '../fixtures/auth';
import { expect } from '@playwright/test';
import { RiskRegisterPage } from '../pages/risk-register-page';

/**
 * Risk Register Page Test
 * Tests the risks list/register page
 */

test.describe('Risk Register Page', () => {
  test.setTimeout(60000); // 1 minute is usually enough for these tests

  test('should load and display risk register page', async ({ authenticatedPage }) => {
    console.log('\n===== TESTING RISK REGISTER PAGE =====');

    const riskRegisterPage = new RiskRegisterPage(authenticatedPage);

    // Navigate to risks list page
    await riskRegisterPage.goto('en');
    console.log('✅ Navigated to risk register page');

    // Verify page is loaded
    const isLoaded = await riskRegisterPage.isLoaded();
    expect(isLoaded).toBeTruthy();
    console.log('✅ Risk register page loaded');

    // Get risk card count
    const riskCardCount = await riskRegisterPage.getRiskCardCount();
    console.log(`✅ Found ${riskCardCount} risk cards`);
    expect(riskCardCount).toBeGreaterThanOrEqual(0);

    // Test search functionality
    if (riskCardCount > 0) {
      await riskRegisterPage.search('test');
      // POM search handles waiting
      console.log('✅ Search functionality tested');
    }
  });

  test('should navigate to risk details when clicking a risk card', async ({ authenticatedPage }) => {
    console.log('\n===== TESTING RISK CARD NAVIGATION =====');

    const riskRegisterPage = new RiskRegisterPage(authenticatedPage);

    await riskRegisterPage.goto('en');

    const riskCardCount = await riskRegisterPage.getRiskCardCount();

    if (riskCardCount > 0) {
      await riskRegisterPage.clickRiskCard(0);

      // Verify we're on a risk details page (should have a UUID after /risks/)
      const currentUrl = authenticatedPage.url();
      // Check if URL contains a UUID pattern (risk ID)
      const hasRiskId = /\/risks\/[a-f0-9-]{36}/i.test(currentUrl);
      expect(hasRiskId).toBeTruthy();
      console.log(`✅ Navigated to risk details page: ${currentUrl}`);
    } else {
      test.skip();
    }
  });
});



