import { test, expect } from '../fixtures/auth';
import { RiskAnalysisPage } from '../pages/risk-analysis-page';

/**
 * Risk Analysis Page Test
 */

test.describe('Risk Analysis Page', () => {
  test.setTimeout(120000); // 2 minutes

  const waitTimes = {
    small: 500,
    medium: 1000,
    large: 2000,
  };

  test('should load and display risk analysis page', async ({ authenticatedPage }) => {
    console.log('\n===== TESTING RISK ANALYSIS PAGE =====');
    
    const analysisPage = new RiskAnalysisPage(authenticatedPage, waitTimes);
    
    await analysisPage.goto('en');
    
    const isLoaded = await analysisPage.isLoaded();
    expect(isLoaded).toBeTruthy();
    console.log('✅ Risk analysis page loaded');
  });

  test('should navigate all tabs', async ({ authenticatedPage }) => {
    console.log('\n===== TESTING TAB NAVIGATION =====');
    
    const analysisPage = new RiskAnalysisPage(authenticatedPage, waitTimes);
    
    await analysisPage.goto('en');
    
    // Test Compare Risks tab
    await analysisPage.clickTab('compare');
    await authenticatedPage.waitForTimeout(waitTimes.medium);
    console.log('✅ Compare Risks tab tested');
    
    // Test What-If Analysis tab
    await analysisPage.clickTab('whatif');
    await authenticatedPage.waitForTimeout(waitTimes.medium);
    console.log('✅ What-If Analysis tab tested');
    
    // Test Custom Reports tab
    await analysisPage.clickTab('reports');
    await authenticatedPage.waitForTimeout(waitTimes.medium);
    console.log('✅ Custom Reports tab tested');
  });
});



