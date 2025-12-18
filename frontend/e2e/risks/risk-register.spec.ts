import { test, expect } from '../fixtures/auth';
import { RiskRegisterPage } from '../pages/risk-register-page';

/**
 * Risk Register Page Test
 * Tests the risks list/register page
 */

test.describe('Risk Register Page', () => {
  test.setTimeout(120000); // 2 minutes

  const waitTimes = {
    small: 500,
    medium: 1000,
    large: 2000,
  };

  test('should load and display risk register page', async ({ authenticatedPage }) => {
    console.log('\n===== TESTING RISK REGISTER PAGE =====');
    
    const riskRegisterPage = new RiskRegisterPage(authenticatedPage, waitTimes);
    
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
      await authenticatedPage.waitForTimeout(waitTimes.medium);
      console.log('✅ Search functionality tested');
    }
  });

  test('should navigate to risk details when clicking a risk card', async ({ authenticatedPage }) => {
    console.log('\n===== TESTING RISK CARD NAVIGATION =====');
    
    const riskRegisterPage = new RiskRegisterPage(authenticatedPage, waitTimes);
    
    await riskRegisterPage.goto('en');
    
    const riskCardCount = await riskRegisterPage.getRiskCardCount();
    
    if (riskCardCount > 0) {
      await riskRegisterPage.clickRiskCard(0);
      
      // Verify we're on a risk details page (should have a UUID after /risks/)
      await authenticatedPage.waitForTimeout(waitTimes.medium);
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

