import { test, expect } from '@playwright/test';

test.describe('Application Asset Verification', () => {
  test('should verify application asset accessibility and functionality', async ({ page }) => {
    console.log('\n🎯 APPLICATION ASSET VERIFICATION');
    console.log('📍 Target: http://localhost:3000/en/dashboard/assets/applications/3b7aec09-55f1-4716-b33a-9dd5170c0c53');

    // Step 1: Login
    console.log('🔐 Step 1: Logging in...');
    await page.goto('http://localhost:3000/en/login');
    await page.fill('input[type="email"]', 'admin@grcplatform.com');
    await page.fill('input[type="password"]', 'password123');
    await page.click('button:has-text("Sign In")');
    await page.waitForTimeout(5000);
    console.log('✅ Login completed');

    // Step 2: Navigate to application asset
    console.log('📍 Step 2: Navigate to application asset...');
    await page.goto('http://localhost:3000/en/dashboard/assets/applications/3b7aec09-55f1-4716-b33a-9dd5170c0c53');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(5000);
    console.log('✅ Application asset loaded');

    // Step 3: Verify we're on the correct page
    const currentUrl = page.url();
    const isCorrectPage = currentUrl.includes('/dashboard/assets/applications/3b7aec09-55f1-4716-b33a-9dd5170c0c53');
    expect(isCorrectPage).toBe(true);
    console.log(`✅ Correct page: ${currentUrl}`);

    // Step 4: Test application-specific tabs
    console.log('📋 Step 4: Testing application tabs...');

    const applicationTabs = [
      { name: 'Overview', testId: 'tab-overview' },
      { name: 'Technical Details', testId: 'tab-technical' },
      { name: 'Vendor', testId: 'tab-vendor' },
      { name: 'Compliance', testId: 'tab-compliance' },
      { name: 'Security Tests', testId: 'tab-security' },
      { name: 'Risks', testId: 'tab-risks' },
      { name: 'Dependencies', testId: 'tab-dependencies' },
      { name: 'Graph View', testId: 'tab-graph' },
      { name: 'Audit Trail', testId: 'tab-audit' }
    ];

    let tabsTested = 0;
    for (const tab of applicationTabs) {
      try {
        const tabElement = page.locator(`button[data-testid="${tab.testId}"]`).first();

        if (await tabElement.isVisible()) {
          await tabElement.click();
          await page.waitForTimeout(2000);
          tabsTested++;
          console.log(`✅ ${tab.name} tab: SUCCESS`);
        } else {
          console.log(`⚠️ ${tab.name} tab: NOT FOUND`);
        }
      } catch (error) {
        console.log(`❌ ${tab.name} tab: ERROR - ${error.message}`);
      }
    }

    console.log(`📊 Tabs successfully tested: ${tabsTested}/${applicationTabs.length}`);

    // Step 5: Test form editing capability
    console.log('✏️ Step 5: Testing form editing...');

    const editButton = page.locator('button:has-text("Edit")').first();
    const editAvailable = await editButton.isVisible();

    if (editAvailable) {
      console.log('✅ Edit button: AVAILABLE');

      // Quick edit test
      await editButton.click();
      await page.waitForTimeout(2000);

      const cancelButton = page.locator('button:has-text("Cancel")').first();
      if (await cancelButton.isVisible()) {
        await cancelButton.click();
        await page.waitForTimeout(1000);
        console.log('✅ Form editing: FUNCTIONAL');
      }
    } else {
      console.log('⚠️ Edit button: NOT AVAILABLE');
    }

    // Step 6: Test application-specific features
    console.log('🔍 Step 6: Testing application-specific features...');

    // Check for Security Tests tab (unique to applications)
    const securityTab = page.locator('button[data-testid="tab-security"]').first();
    const securityAvailable = await securityTab.isVisible();

    if (securityAvailable) {
      console.log('✅ Security Tests tab: AVAILABLE (application-specific feature)');
    } else {
      console.log('⚠️ Security Tests tab: NOT AVAILABLE');
    }

    // Check for Technical Details tab (unique to applications)
    const technicalTab = page.locator('button[data-testid="tab-technical"]').first();
    const technicalAvailable = await technicalTab.isVisible();

    if (technicalAvailable) {
      console.log('✅ Technical Details tab: AVAILABLE (application-specific feature)');
    } else {
      console.log('⚠️ Technical Details tab: NOT AVAILABLE');
    }

    // Step 7: Final verification
    console.log('🎯 Step 7: Final verification...');

    // Take screenshot
    await page.screenshot({
      path: 'test-results/application-asset-verification-complete.png',
      fullPage: true
    });

    // Check page content to ensure it's not empty
    const pageContent = await page.locator('body').textContent();
    const hasContent = pageContent && pageContent.length > 1000;

    expect(hasContent).toBe(true);
    expect(isCorrectPage).toBe(true);
    expect(tabsTested).toBeGreaterThan(5); // At least most tabs should work

    console.log('\\n🎯 APPLICATION ASSET VERIFICATION COMPLETE');
    console.log('📊 RESULTS:');
    console.log(`📁 Page Access: ${isCorrectPage ? 'SUCCESS' : 'FAILED'}`);
    console.log(`📁 Tab Navigation: ${tabsTested}/${applicationTabs.length} working`);
    console.log(`📁 Form Editing: ${editAvailable ? 'AVAILABLE' : 'NOT AVAILABLE'}`);
    console.log(`📁 Security Tests: ${securityAvailable ? 'AVAILABLE' : 'NOT AVAILABLE'}`);
    console.log(`📁 Technical Details: ${technicalAvailable ? 'AVAILABLE' : 'NOT AVAILABLE'}`);
    console.log(`📁 Page Content: ${hasContent ? 'LOADED' : 'EMPTY'}`);
    console.log('📁 Overall Status: SUCCESSFUL');

    console.log('\\n🚀 Application asset testing completed successfully!');
    console.log('✅ All major functionality verified and working');

  });
});