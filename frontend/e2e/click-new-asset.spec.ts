import { test, expect } from '@playwright/test';

test.describe('New Asset Button Test', () => {
  test('should click New Asset button successfully', async ({ page }) => {
    console.log('🚀 Starting New Asset button test...');

    // Set up basic page
    page.setDefaultTimeout(10000);

    // Step 1: Go directly to assets page (after manual login)
    console.log('📍 Navigating to physical assets page...');
    await page.goto('http://127.0.0.1:3000/dashboard/assets/physical', {
      waitUntil: 'domcontentloaded',
      timeout: 15000
    });

    // Wait a moment for page to render
    await page.waitForTimeout(3000);

    // Take screenshot to see the current state
    await page.screenshot({ path: 'test-results/assets-page-before.png' });

    // Debug: What's on the page?
    const pageTitle = await page.title();
    console.log(`📄 Page title: ${pageTitle}`);
    console.log(`🔗 Current URL: ${page.url()}`);

    // Step 2: Look for the New Asset button with multiple strategies
    console.log('🔍 Looking for New Asset button...');

    const buttonSelectors = [
      'button:has-text("New Asset")',
      'button[data-testid="new-asset"]',
      'button[aria-label*="New Asset"]',
      'button[class*="new"]',
      'button:has-text("Add")',
      'button:has-text("Create")',
      'button:has-text("+")'
    ];

    let foundButton = null;
    let usedSelector = '';

    for (const selector of buttonSelectors) {
      const button = page.locator(selector).first();
      if (await button.isVisible().catch(() => false)) {
        foundButton = button;
        usedSelector = selector;
        console.log(`✅ Found button with selector: ${selector}`);
        break;
      } else {
        console.log(`❌ Button not found with selector: ${selector}`);
      }
    }

    // Step 3: If button not found, look for any clickable elements
    if (!foundButton) {
      console.log('🔍 Looking for any clickable elements that might be the New Asset button...');

      // Look for any buttons
      const allButtons = page.locator('button').all();
      const buttonCount = await allButtons.length;
      console.log(`📊 Found ${buttonCount} buttons on page`);

      // Check text content of all buttons
      for (let i = 0; i < Math.min(buttonCount, 10); i++) {
        const button = page.locator('button').nth(i);
        const buttonText = await button.textContent().catch(() => '');
        console.log(`🔘 Button ${i}: "${buttonText}"`);

        if (buttonText?.toLowerCase().includes('new') ||
            buttonText?.toLowerCase().includes('asset') ||
            buttonText?.toLowerCase().includes('create') ||
            buttonText?.toLowerCase().includes('add')) {
          foundButton = button;
          usedSelector = `button:nth-child(${i + 1})`;
          console.log(`✅ Found likely button: "${buttonText}"`);
          break;
        }
      }
    }

    // Step 4: Take screenshot before clicking
    await page.screenshot({ path: 'test-results/before-click.png' });

    // Step 5: Click the button if found
    if (foundButton) {
      console.log(`🖱️ Clicking button using selector: ${usedSelector}`);

      // Highlight the button before clicking (for debugging)
      await foundButton.evaluate(el => {
        el.style.border = '3px solid red';
        el.style.backgroundColor = 'yellow';
      });

      // Take screenshot with highlighted button
      await page.screenshot({ path: 'test-results/button-highlighted.png' });

      await foundButton.click();
      console.log('✅ Button clicked!');

      // Wait a moment for any response
      await page.waitForTimeout(3000);

      // Take screenshot after clicking
      await page.screenshot({ path: 'test-results/after-click.png' });

      // Check if form opened
      const hasForm = await page.locator('form, [role="dialog"], .modal').isVisible().catch(() => false);
      console.log(`📋 Form opened after click: ${hasForm}`);

      if (hasForm) {
        console.log('🎉 SUCCESS! Form opened after clicking New Asset button');
      } else {
        console.log('ℹ️ No form detected after click - maybe navigation happened');
      }

    } else {
      console.log('❌ Could not find New Asset button');

      // Take a full page screenshot for debugging
      await page.screenshot({ path: 'test-results/no-button-found.png', fullPage: true });

      // Get all text content on the page
      const pageText = await page.locator('body').textContent();
      console.log('📝 Page text preview:');
      console.log(pageText?.substring(0, 500));

      // Look for any elements with "New" or "Asset" in their text
      const newElements = page.locator('*:has-text("New"), *:has-text("Asset")').all();
      console.log(`🔍 Found ${await newElements.length} elements with "New" or "Asset" text`);

      throw new Error('New Asset button not found on the page');
    }
  });
});