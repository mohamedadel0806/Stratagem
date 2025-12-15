import { test, expect } from '../../fixtures/auth';

/**
 * Debug test for Assessments form
 * Run this in headed mode to see what's happening
 */

test.describe('Risk Details - Assessments Form Debug', () => {
  test.setTimeout(60000);

  const RISK_ID = '8546665c-d856-4641-b97f-7e20f1dcbfac';
  const RISK_URL = `/en/dashboard/risks/${RISK_ID}`;

  // Longer waits for headed mode
  const WAIT_SMALL = 1000;
  const WAIT_MEDIUM = 2000;
  const WAIT_LARGE = 3000;

  test('should test Assessments tab - New Assessment form (headed debug)', async ({ authenticatedPage }) => {
    console.log('\n===== TESTING ASSESSMENTS TAB - NEW ASSESSMENT FORM (HEADED DEBUG) =====');

    // Navigate to risk details page
    console.log('Navigating to risk details page...');
    await authenticatedPage.goto(RISK_URL, { waitUntil: 'domcontentloaded' });
    await authenticatedPage.waitForLoadState('domcontentloaded');
    await authenticatedPage.waitForTimeout(WAIT_LARGE);
    console.log('✅ Page loaded');

    // Take screenshot of initial state
    await authenticatedPage.screenshot({ path: 'test-results/risk-details/debug-1-initial-page.png', fullPage: true });

    // Click Assessments tab
    console.log('Looking for Assessments tab...');
    const assessmentsTab = authenticatedPage.locator('[role="tab"]:has-text("Assessments")').first();
    await assessmentsTab.waitFor({ state: 'visible', timeout: 10000 });
    console.log('✅ Assessments tab found');
    
    await assessmentsTab.click();
    await authenticatedPage.waitForTimeout(WAIT_MEDIUM);
    console.log('✅ Assessments tab clicked');

    // Take screenshot after clicking tab
    await authenticatedPage.screenshot({ path: 'test-results/risk-details/debug-2-after-tab-click.png', fullPage: true });

    // Look for New Assessment button with multiple selectors
    console.log('Looking for New Assessment button...');
    
    // Try multiple button selectors
    const buttonSelectors = [
      'button:has-text("New Assessment")',
      'button:has-text("new assessment")',
      'button:has-text("New")',
      'button[aria-label*="Assessment"]',
      'button[aria-label*="assessment"]'
    ];

    let buttonFound = false;
    let buttonElement = null;

    for (const selector of buttonSelectors) {
      const buttons = authenticatedPage.locator(selector);
      const count = await buttons.count();
      console.log(`  Selector "${selector}": found ${count} button(s)`);
      
      if (count > 0) {
        buttonElement = buttons.first();
        const isVisible = await buttonElement.isVisible({ timeout: 2000 }).catch(() => false);
        if (isVisible) {
          console.log(`  ✅ Button found with selector: "${selector}"`);
          buttonFound = true;
          break;
        }
      }
    }

    // Also try filter approach
    if (!buttonFound) {
      console.log('Trying filter approach...');
      const allButtons = authenticatedPage.locator('button');
      const buttonCount = await allButtons.count();
      console.log(`  Total buttons on page: ${buttonCount}`);
      
      for (let i = 0; i < Math.min(buttonCount, 20); i++) {
        const btn = allButtons.nth(i);
        const text = await btn.textContent().catch(() => '');
        const isVisible = await btn.isVisible({ timeout: 500 }).catch(() => false);
        if (text && (text.toLowerCase().includes('assessment') || text.toLowerCase().includes('new'))) {
          console.log(`  Button ${i}: "${text}" (visible: ${isVisible})`);
          if (isVisible && text.toLowerCase().includes('assessment')) {
            buttonElement = btn;
            buttonFound = true;
            console.log(`  ✅ Found matching button: "${text}"`);
            break;
          }
        }
      }
    }

    if (buttonFound && buttonElement) {
      console.log('✅ New Assessment button found');
      await authenticatedPage.screenshot({ path: 'test-results/risk-details/debug-3-before-button-click.png', fullPage: true });
      
      // Scroll button into view
      await buttonElement.scrollIntoViewIfNeeded();
      await authenticatedPage.waitForTimeout(WAIT_SMALL);
      
      // Click the button
      console.log('Clicking New Assessment button...');
      await buttonElement.click();
      await authenticatedPage.waitForTimeout(WAIT_MEDIUM);
      console.log('✅ Button clicked');

      // Take screenshot after clicking
      await authenticatedPage.screenshot({ path: 'test-results/risk-details/debug-4-after-button-click.png', fullPage: true });

      // Check if assessment form opened - try multiple ways
      console.log('Checking if form opened...');
      
      const dialogCheck1 = await authenticatedPage.locator('[role="dialog"]').isVisible({ timeout: 3000 }).catch(() => false);
      const dialogCheck2 = await authenticatedPage.locator('form').isVisible({ timeout: 2000 }).catch(() => false);
      const dialogCheck3 = await authenticatedPage.locator('.modal, [class*="Modal"], [class*="Dialog"]').isVisible({ timeout: 2000 }).catch(() => false);
      
      console.log(`  Dialog check (role="dialog"): ${dialogCheck1}`);
      console.log(`  Form check: ${dialogCheck2}`);
      console.log(`  Modal/Dialog class check: ${dialogCheck3}`);

      const dialogVisible = dialogCheck1 || dialogCheck2 || dialogCheck3;

      if (dialogVisible) {
        console.log('✅ Assessment form/dialog opened successfully');
        await authenticatedPage.screenshot({ path: 'test-results/risk-details/debug-5-form-opened.png', fullPage: true });

        // Look for form fields
        const inputs = await authenticatedPage.locator('input, textarea, select').count();
        console.log(`  Found ${inputs} form inputs`);

        // Wait a bit to see the form
        await authenticatedPage.waitForTimeout(WAIT_LARGE);

        // Try to close form
        const cancelButton = authenticatedPage.locator('button:has-text("Cancel")').first();
        const cancelVisible = await cancelButton.isVisible({ timeout: 2000 }).catch(() => false);
        
        if (cancelVisible) {
          console.log('Closing form with Cancel button...');
          await cancelButton.click();
          await authenticatedPage.waitForTimeout(WAIT_MEDIUM);
        } else {
          console.log('Closing form with Escape key...');
          await authenticatedPage.keyboard.press('Escape');
          await authenticatedPage.waitForTimeout(WAIT_MEDIUM);
        }
        console.log('✅ Form closed');
      } else {
        console.log('⚠️ Assessment form did not open after button click');
        
        // Check current URL
        const currentUrl = authenticatedPage.url();
        console.log(`  Current URL: ${currentUrl}`);
        
        // Check for error messages
        const errorMessages = authenticatedPage.locator('[role="alert"], .error, .text-red-500, .text-red-800');
        const errorCount = await errorMessages.count();
        if (errorCount > 0) {
          console.log(`  Found ${errorCount} error message(s)`);
          for (let i = 0; i < Math.min(errorCount, 3); i++) {
            const errorText = await errorMessages.nth(i).textContent().catch(() => '');
            console.log(`    Error ${i + 1}: ${errorText}`);
          }
        }
        
        await authenticatedPage.waitForTimeout(WAIT_LARGE);
      }
    } else {
      console.log('❌ New Assessment button not found');
      
      // Take screenshot showing what buttons are available
      await authenticatedPage.screenshot({ path: 'test-results/risk-details/debug-no-button-found.png', fullPage: true });
      
      // List all visible buttons
      const allButtons = authenticatedPage.locator('button:visible');
      const visibleButtonCount = await allButtons.count();
      console.log(`  Visible buttons on page: ${visibleButtonCount}`);
      
      for (let i = 0; i < Math.min(visibleButtonCount, 15); i++) {
        const btn = allButtons.nth(i);
        const text = await btn.textContent().catch(() => '');
        console.log(`    Button ${i + 1}: "${text}"`);
      }
    }
  });
});
