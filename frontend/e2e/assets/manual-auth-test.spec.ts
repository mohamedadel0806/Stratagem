import { test, expect } from '@playwright/test';

test.describe('Manual Authentication Test for Asset Access', () => {
  test('should manually login and access the specific information asset', async ({ page }) => {
    console.log('🔐 MANUAL LOGIN TEST FOR ASSET: 189d91ee-01dd-46a4-b6ef-76ccac11c60d');

    // Step 1: Navigate to login page
    console.log('📍 Step 1: Navigating to login page...');
    await page.goto('http://localhost:3000/en/login');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);

    // Take screenshot of login page
    await page.screenshot({ path: 'test-results/login-page.png', fullPage: true });

    // Step 2: Manual login with exact credentials
    console.log('🔐 Step 2: Manual login with admin@grcplatform.com...');

    // Fill email
    await page.fill('input[type="email"], input[name="email"]', 'admin@grcplatform.com');
    console.log('✅ Email filled: admin@grcplatform.com');

    // Fill password
    await page.fill('input[type="password"], input[name="password"]', 'password123');
    console.log('✅ Password filled: password123');

    // Click login button
    await page.click('button:has-text("Sign In"), button:has-text("Login")');
    console.log('✅ Login button clicked');

    // Wait for login to complete
    try {
      await page.waitForURL(/\/dashboard/, { timeout: 15000 });
      console.log('✅ Login successful - redirected to dashboard');
    } catch (error) {
      console.log('⚠️ URL redirect not detected, checking current state...');
    }

    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(3000);

    // Take screenshot after login
    await page.screenshot({ path: 'test-results/after-login.png', fullPage: true });

    // Verify we're logged in
    const currentUrl = page.url();
    console.log(`📍 Current URL after login: ${currentUrl}`);

    // Check for dashboard elements
    const dashboardElements = await page.locator('text=Dashboard, text=Assets, text=Governance').all();
    console.log(`📊 Found ${dashboardElements.length} dashboard elements`);

    // Step 3: Navigate to the specific asset
    console.log('📍 Step 3: Navigating to the information asset...');
    await page.goto('http://localhost:3000/en/dashboard/assets/information/189d91ee-01dd-46a4-b6ef-76ccac11c60d');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(5000);

    // Take screenshot of asset page
    await page.screenshot({ path: 'test-results/asset-page-after-manual-login.png', fullPage: true });

    // Step 4: Analyze the asset page
    console.log('🔍 Step 4: Analyzing the asset page...');

    // Check for asset tabs
    const tabElements = await page.locator('[data-testid*="tab"], button[data-value]').all();
    console.log(`📋 Found ${tabElements.length} tab elements`);

    for (let i = 0; i < Math.min(tabElements.length, 10); i++) {
      const tab = tabElements[i];
      const testId = await tab.getAttribute('data-testid');
      const text = await tab.textContent();
      const isVisible = await tab.isVisible();
      console.log(`  Tab ${i}: testId="${testId}" text="${text}" visible=${isVisible}`);
    }

    // Check for asset name
    const h1Elements = await page.locator('h1').all();
    console.log(`📄 Found ${h1Elements.length} H1 elements`);

    for (let i = 0; i < Math.min(h1Elements.length, 3); i++) {
      const h1Text = await h1Elements[i].textContent();
      if (h1Text) {
        console.log(`  H1 ${i}: ${h1Text.trim()}`);
      }
    }

    // Check for "Asset not found" message
    const assetNotFound = await page.locator('text=Asset not found').all();
    console.log(`📄 Found ${assetNotFound.length} "Asset not found" messages`);

    // Check for error messages
    const errorElements = await page.locator('.error, .text-red-500').all();
    console.log(`📄 Found ${errorElements.length} error elements`);

    // Step 5: Test tabs if they exist
    if (tabElements.length > 0) {
      console.log('📋 Step 5: Testing available tabs...');

      const expectedTabs = ['Overview', 'Classification', 'Ownership', 'Compliance', 'Controls', 'Risks', 'Dependencies', 'Graph View', 'Audit Trail'];

      for (const tabName of expectedTabs) {
        try {
          console.log(`📍 Testing tab: ${tabName}`);

          // Look for the tab
          const tabSelector = page.locator(`button:has-text("${tabName}"), [data-testid*="${tabName.toLowerCase().replace(' ', '-')}"]`).first();
          const isVisible = await tabSelector.isVisible();

          if (isVisible) {
            await tabSelector.click();
            await page.waitForTimeout(3000);

            // Take screenshot
            const screenshotPath = `test-results/tab-${tabName.toLowerCase().replace(/\s+/g, '-')}.png`;
            await page.screenshot({ path: screenshotPath, fullPage: false });
            console.log(`✅ Screenshot captured: ${screenshotPath}`);

            // Analyze tab content
            const tabContent = await page.locator('body').textContent();
            const hasContent = tabContent && tabContent.length > 500;
            console.log(`📊 Tab "${tabName}" has content: ${hasContent ? 'YES' : 'NO'}`);
          } else {
            console.log(`⚠️ Tab "${tabName}" not found or not visible`);
          }
        } catch (error) {
          console.log(`❌ Error testing tab ${tabName}: ${error.message}`);
        }
      }
    }

    // Step 6: Monitor network activity during navigation
    console.log('📡 Step 6: Monitoring network activity...');

    const requests: any[] = [];
    const responses: any[] = [];

    page.on('request', request => {
      const url = request.url();
      if (url.includes('assets') && url.includes('189d91ee-01dd-46a4-b6ef-76ccac11c60d')) {
        requests.push({
          method: request.method(),
          url: url,
          headers: request.headers()
        });
        console.log(`📡 Asset Request: ${request.method()} ${url}`);
      }
    });

    page.on('response', response => {
      const url = response.url();
      if (url.includes('assets') && url.includes('189d91ee-01dd-46a4-b6ef-76ccac11c60d')) {
        responses.push({
          status: response.status(),
          statusText: response.statusText(),
          url: url
        });
        console.log(`📡 Asset Response: ${response.status()} ${url} - ${response.statusText}`);
      }
    });

    // Refresh the page to trigger network requests
    await page.reload();
    await page.waitForTimeout(5000);

    // Final screenshot
    await page.screenshot({ path: 'test-results/final-manual-auth-test.png', fullPage: true });

    console.log('🎯 MANUAL AUTHENTICATION TEST COMPLETE');
    console.log(`📊 SUMMARY:`);
    console.log(`📁 Login successful: ${currentUrl.includes('dashboard') || tabElements.length > 0}`);
    console.log(`📁 Asset page loaded: ${page.url().includes('189d91ee-01dd-46a4-b6ef-76ccac11c60d')}`);
    console.log(`📁 Tabs found: ${tabElements.length}`);
    console.log(`📁 "Asset not found" messages: ${assetNotFound.length}`);
    console.log(`📁 Network requests: ${requests.length}`);
    console.log(`📁 Network responses: ${responses.length}`);

    responses.forEach((response, i) => {
      console.log(`📋 Response ${i}: ${response.status} ${response.statusText}`);
    });
  });
});