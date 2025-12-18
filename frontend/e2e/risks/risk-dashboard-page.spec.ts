import { test, expect } from '../fixtures/auth';
import { RiskDashboardPage } from '../pages/risk-dashboard-page';

/**
 * Risk Dashboard Page Test
 */

test.describe('Risk Dashboard Page', () => {
  test.setTimeout(120000); // 2 minutes

  const waitTimes = {
    small: 500,
    medium: 1000,
    large: 2000,
  };

  test('should load and display risk dashboard page', async ({ authenticatedPage }) => {
    console.log('\n===== TESTING RISK DASHBOARD PAGE =====');
    
    const dashboardPage = new RiskDashboardPage(authenticatedPage, waitTimes);
    
    await dashboardPage.goto('en');
    
    const isLoaded = await dashboardPage.isLoaded();
    expect(isLoaded).toBeTruthy();
    console.log('✅ Risk dashboard page loaded');
    
    // Try to get summary values
    const totalRisks = await dashboardPage.getSummaryValue('Total Risks');
    if (totalRisks) {
      console.log(`✅ Total Risks value found: ${totalRisks}`);
      expect(totalRisks).toBeTruthy();
    }
  });
});

