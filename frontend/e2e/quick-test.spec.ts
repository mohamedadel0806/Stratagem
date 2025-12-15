import { test, expect } from './fixtures/auth';

test.describe('Quick Asset Tests', () => {
  test('should login and navigate to assets quickly', async ({ authenticatedPage }) => {
    console.log('🚀 Starting quick test...');

    // Go to physical assets page and wait for proper rendering
    await authenticatedPage.goto('/dashboard/assets/physical');
    console.log('📁 Navigated to physical assets');

    // Wait for page to be fully rendered - look for specific content
    await authenticatedPage.waitForLoadState('networkidle');

    // Wait for assets to load - the page uses a card grid layout, not a table
    await authenticatedPage.waitForSelector('.grid > div > [role="button"], .grid > div > div > .card, .grid .card', {
      state: 'visible',
      timeout: 30000
    }).catch(() => {
      // If no assets exist, look for the "No assets found" message
      return authenticatedPage.waitForSelector('text=No physical assets found, text=Create Your First Asset', {
        state: 'visible',
        timeout: 15000
      });
    });
    console.log('✅ Assets page loaded (with data or empty state)');

    // Wait for page to be stable (no more loading states)
    await authenticatedPage.waitForFunction(() => {
      return !document.querySelector('.loading, .spinner, [data-testid="loading"]') &&
             document.querySelector('h1') &&
             document.querySelector('button:has-text("New Asset")');
    }, { timeout: 15000 });

    // Check if New Asset button exists and is clickable (from the actual page)
    const addButton = authenticatedPage.locator('button:has-text("New Asset")').first();
    await addButton.waitFor({ state: 'visible', timeout: 15000 });
    await expect(addButton).toBeEnabled();
    console.log('➕ New Asset button found and clickable');

    // Additional check that page is fully loaded
    await expect(authenticatedPage.locator('h1:has-text("Physical Assets")').first()).toBeVisible({ timeout: 10000 });
    console.log('✅ Page title visible');

    // Take screenshot for verification
    await authenticatedPage.screenshot({ path: 'test-results/quick-test-success.png' });
    console.log('📸 Screenshot taken');

    console.log('🎉 Quick test completed successfully!');
  });

  test('should create a simple physical asset', async ({ authenticatedPage }) => {
    console.log('🆕 Starting asset creation test...');

    await authenticatedPage.goto('/dashboard/assets/physical');

    // Wait for page to be fully loaded
    await authenticatedPage.waitForLoadState('networkidle');

    // Wait for page content (either assets cards or empty state)
    await authenticatedPage.waitForSelector('.grid > div > div > .card, .grid .card, text=No physical assets found', {
      state: 'visible',
      timeout: 30000
    }).catch(() => {
      // Fallback - wait for page title and button
      return authenticatedPage.waitForSelector('h1:has-text("Physical Assets"), button:has-text("New Asset")', {
        state: 'visible',
        timeout: 15000
      });
    });

    // Click New Asset button (from the actual page)
    const addButton = authenticatedPage.locator('button:has-text("New Asset")').first();
    await addButton.waitFor({ state: 'visible', timeout: 15000 });
    await addButton.click();
    console.log('📝 Opening form...');

    // Wait for form to be fully rendered with smart waits
    await authenticatedPage.waitForSelector('form, [role="dialog"], .modal', { timeout: 15000 });

    // Wait for form to be interactive (not just visible)
    await authenticatedPage.waitForFunction(() => {
      const form = document.querySelector('form, [role="dialog"]');
      return form && !form.classList.contains('loading') && getComputedStyle(form).display !== 'none';
    }, { timeout: 10000 });
    console.log('📋 Form opened and ready');

    // Wait for form inputs to be ready
    await authenticatedPage.waitForSelector('input[name="assetDescription"], input[placeholder*="Asset Description"], input[placeholder*="description"]', {
      state: 'visible',
      timeout: 10000
    });

    // Fill basic required fields only
    await authenticatedPage.fill('input[name="assetDescription"], input[placeholder*="Asset Description"], input[placeholder*="description"]', 'Quick Test Asset');
    console.log('✏️ Filled description');

    await authenticatedPage.waitForSelector('input[name="uniqueIdentifier"], input[placeholder*="Unique Identifier"], input[placeholder*="identifier"]', {
      state: 'visible',
      timeout: 5000
    });
    await authenticatedPage.fill('input[name="uniqueIdentifier"], input[placeholder*="Unique Identifier"], input[placeholder*="identifier"]', 'QUICK-TEST-001');
    console.log('🏷️ Filled identifier');

    // Wait for submit button to be enabled
    const submitButton = authenticatedPage.locator('button[type="submit"]:has-text("Create"), button:has-text("Save")').first();
    await submitButton.waitFor({ state: 'visible', timeout: 5000 });
    await submitButton.waitFor({ state: 'enabled', timeout: 5000 });

    // Submit form
    await submitButton.click();
    console.log('💾 Submitting form...');

    // Wait for submission to complete - look for success indicators
    await authenticatedPage.waitForSelector('.toast, [role="status"], [data-testid="success-message"], text=Success, text=Created', {
      state: 'visible',
      timeout: 15000
    }).catch(() => {
      console.log('ℹ️ No success toast found, continuing...');
    });

    // Wait to return to assets view (card grid)
    await authenticatedPage.waitForSelector('.grid > div > div > .card, .grid .card', {
      state: 'visible',
      timeout: 20000
    }).catch(() => {
      // Fallback - wait for page title
      return authenticatedPage.waitForSelector('h1:has-text("Physical Assets")', {
        state: 'visible',
        timeout: 10000
      });
    });
    console.log('📊 Back to assets view');

    // Verify asset was created with smart wait
    await authenticatedPage.waitForFunction(() => {
      return document.body.textContent.includes('Quick Test Asset');
    }, { timeout: 15000 });
    console.log('✅ Asset created successfully!');

    await authenticatedPage.screenshot({ path: 'test-results/asset-creation-success.png' });
    console.log('🎉 Asset creation test completed!');
  });
});