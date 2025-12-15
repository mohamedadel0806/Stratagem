import { test, expect } from '../../fixtures/auth';

/**
 * Basic Connectivity Check
 * Check if the risk details pages are functioning at all
 */

test.describe('Basic Connectivity Check', () => {
  test('check if risk details pages load correctly', async ({ authenticatedPage }) => {
    console.log('=== BASIC CONNECTIVITY CHECK ===');

    const riskId = '95d8a18a-1e1c-44ed-9eaa-25dfadac75b5';

    await authenticatedPage.goto(`/en/dashboard/risks/${riskId}`, { waitUntil: 'domcontentloaded' });
    await authenticatedPage.waitForTimeout(3000);

    // Take screenshot of the page
    await authenticatedPage.screenshot({ path: 'test-results/connectivity/risk-details-page.png', fullPage: true });

    // Check if we can see basic elements
    const pageTitle = await authenticatedPage.title();
    console.log(`Page title: ${pageTitle}`);

    // Check for tabs
    const tabs = ['Overview', 'Assessments', 'Assets', 'Controls', 'Treatments', 'KRIs'];
    console.log('\n📋 Checking tabs:');

    for (const tabName of tabs) {
      const tabElement = authenticatedPage.locator(`[role="tab"]:has-text("${tabName}")`).first();
      const tabVisible = await tabElement.isVisible({ timeout: 2000 }).catch(() => false);
      console.log(`  ${tabVisible ? '✅' : '❌'} ${tabName} tab`);
    }

    // Check for network errors by looking at console
    const pageErrors: string[] = [];
    authenticatedPage.on('console', (msg) => {
      if (msg.type() === 'error') {
        pageErrors.push(msg.text());
      }
    });

    await authenticatedPage.waitForTimeout(2000);

    // Check for any error messages on the page
    const errorElements = authenticatedPage.locator('[role="alert"], .error, .text-red-500, .bg-red-50').count();
    const errorCount = await errorElements;
    console.log(`\n🚨 Found ${errorCount} error elements on page`);

    // Check for API calls by looking at network activity
    const networkRequests: string[] = [];
    authenticatedPage.on('response', (response) => {
      const url = response.url();
      if (url.includes('/api/') || url.includes('/trpc/')) {
        networkRequests.push(`${response.status()}: ${url}`);
      }
    });

    await authenticatedPage.waitForTimeout(2000);

    console.log(`\n🌐 Found ${networkRequests.length} API requests:`);
    networkRequests.forEach(req => console.log(`  ${req}`));

    if (pageErrors.length > 0) {
      console.log(`\n❌ Console errors found:`);
      pageErrors.forEach(error => console.log(`  ${error}`));
    }

    // Try to click on Overview tab to see if page responds
    try {
      const overviewTab = authenticatedPage.locator('[role="tab"]:has-text("Overview")').first();
      const tabVisible = await overviewTab.isVisible({ timeout: 2000 });

      if (tabVisible) {
        await overviewTab.click();
        await authenticatedPage.waitForTimeout(1000);
        console.log('\n✅ Overview tab clickable - page responding');
      } else {
        console.log('\n❌ Overview tab not clickable');
      }
    } catch (error) {
      console.log(`\n❌ Error clicking Overview tab: ${error.message}`);
    }

    // Check the final URL
    const finalUrl = authenticatedPage.url();
    console.log(`\n📍 Final URL: ${finalUrl}`);

    console.log('\n=== CONNECTIVITY CHECK COMPLETE ===');

    if (pageErrors.length === 0 && errorCount === 0) {
      console.log('✅ No critical connectivity issues detected');
    } else {
      console.log('⚠️ Potential connectivity issues detected');
    }
  });
});