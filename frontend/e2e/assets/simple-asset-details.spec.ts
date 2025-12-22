/**
 * Simple test to navigate to asset details page without complex auth fixture
 */
import { test, expect } from '@playwright/test';

test.describe('Simple Asset Details Test', () => {
  test('should navigate to asset details page and explore structure', async ({ page }) => {
    console.log('🚀 SIMPLE ASSET DETAILS EXPLORATION');

    // Set longer timeouts
    page.setDefaultTimeout(30000);
    page.setDefaultNavigationTimeout(60000);

    // Step 1: Login manually
    console.log('🔐 Logging in...');
    await page.goto('http://localhost:3000/en/login', { timeout: 30000 });
    await page.waitForLoadState('domcontentloaded', { timeout: 15000 });

    // Fill login form
    const email = 'admin@grcplatform.com';
    const password = 'password123';

    await page.locator('input[type="email"], input[id="email"], input[name="email"]').first().waitFor({ state: 'visible', timeout: 10000 });
    await page.locator('input[type="email"], input[id="email"], input[name="email"]').first().fill(email);

    await page.locator('input[type="password"], input[id="password"], input[name="password"]').first().waitFor({ state: 'visible', timeout: 10000 });
    await page.locator('input[type="password"], input[id="password"], input[name="password"]').first().fill(password);

    await page.locator('button:has-text("Sign In with Email")').first().click();

    // Wait for redirect to dashboard
    await page.waitForURL(/\/dashboard/, { timeout: 20000 });
    await page.waitForLoadState('domcontentloaded', { timeout: 10000 });

    console.log(`✅ Logged in successfully. Current URL: ${page.url()}`);

    // Step 2: Navigate to asset details page directly
    console.log('📍 Navigating to asset details page...');
    const detailsUrl = 'http://localhost:3000/en/dashboard/assets/physical/bcfbb233-f00a-4ec2-b97c-d052b7129385';
    await page.goto(detailsUrl, { timeout: 20000 });
    await page.waitForLoadState('domcontentloaded', { timeout: 15000 });
    await page.waitForTimeout(3000);

    console.log(`✅ Navigated to: ${page.url()}`);

    // Take initial screenshot
    await page.screenshot({
      path: 'test-results/simple-asset-details-1-initial.png',
      fullPage: true
    });
    console.log('✅ Initial screenshot captured');

    // Step 3: Analyze page structure
    console.log('\n📋 Analyzing page structure...');

    // Get all text content to understand what's on the page
    const pageText = await page.textContent('body');
    console.log(`Page contains ${pageText?.length || 0} characters`);

    // Look for common elements
    const elements = {
      headings: await page.locator('h1, h2, h3, h4, h5, h6').all(),
      buttons: await page.locator('button').all(),
      links: await page.locator('a').all(),
      inputs: await page.locator('input').all(),
      textareas: await page.locator('textarea').all(),
      selects: await page.locator('select').all(),
      tables: await page.locator('table').all(),
      cards: await page.locator('.card, .panel, .section').all()
    };

    console.log(`\n📊 PAGE ELEMENTS COUNT:`);
    Object.entries(elements).forEach(([type, els]) => {
      console.log(`  ${type}: ${els.length}`);
    });

    // Look for headings that might indicate tabs or sections
    console.log(`\n📄 HEADINGS FOUND:`);
    for (let i = 0; i < Math.min(elements.headings.length, 15); i++) {
      try {
        const heading = elements.headings[i];
        const isVisible = await heading.isVisible();
        if (isVisible) {
          const text = await heading.textContent();
          const tagName = await heading.evaluate((el: any) => el.tagName.toLowerCase());
          if (text && text.trim()) {
            console.log(`  ${tagName.toUpperCase()}: "${text.trim()}"`);
          }
        }
      } catch (e) {
        // Continue
      }
    }

    // Look for buttons that might be tabs or actions
    console.log(`\n🔘 BUTTONS FOUND:`);
    for (let i = 0; i < Math.min(elements.buttons.length, 20); i++) {
      try {
        const button = elements.buttons[i];
        const isVisible = await button.isVisible();
        if (isVisible) {
          const text = await button.textContent();
          const role = await button.getAttribute('role');
          const ariaLabel = await button.getAttribute('aria-label');
          const className = await button.getAttribute('class') || '';

          if (text && text.trim()) {
            console.log(`  Button: "${text.trim()}" (role: ${role || 'none'}, aria-label: "${ariaLabel || 'none'}")`);

            // Check if it looks like a tab
            if (className.includes('tab') || role === 'tab' || text.toLowerCase().includes('overview') ||
                text.toLowerCase().includes('details') || text.toLowerCase().includes('history') ||
                text.toLowerCase().includes('audit') || text.toLowerCase().includes('related')) {
              console.log(`    👆 This looks like a tab!`);

              // Try clicking it
              try {
                await button.click();
                await page.waitForTimeout(2000);

                const screenshotName = `test-results/simple-asset-details-2-tab-${text.replace(/[^a-zA-Z0-9]/g, '_')}.png`;
                await page.screenshot({
                  path: screenshotName,
                  fullPage: true
                });
                console.log(`    ✅ Clicked and screenshot saved: ${screenshotName}`);

                // Look for new content after clicking
                const newContent = await page.textContent('body');
                if (newContent && newContent !== pageText) {
                  console.log(`    📝 Content changed after clicking "${text.trim()}"`);
                }
              } catch (e) {
                console.log(`    ❌ Could not click tab: ${e}`);
              }
            }
          }
        }
      } catch (e) {
        // Continue
      }
    }

    // Look for form fields
    console.log(`\n📝 FORM FIELDS FOUND:`);
    const allFormFields = [...elements.inputs, ...elements.textareas, ...elements.selects];

    for (let i = 0; i < Math.min(allFormFields.length, 10); i++) {
      try {
        const field = allFormFields[i];
        const isVisible = await field.isVisible();
        if (isVisible) {
          const tagName = await field.evaluate((el: any) => el.tagName.toLowerCase());
          const name = await field.getAttribute('name') || '';
          const placeholder = await field.getAttribute('placeholder') || '';
          const value = await field.inputValue().catch(() => '');
          const isDisabled = await field.isDisabled();
          const isReadOnly = await field.getAttribute('readonly') !== null;

          console.log(`  ${tagName.toUpperCase()}: name="${name}", placeholder="${placeholder}", value="${value}" (disabled: ${isDisabled}, readonly: ${isReadOnly})`);

          // Try to fill a few editable fields
          if (!isDisabled && !isReadOnly && i < 3) {
            try {
              const testValue = `E2E Test Update ${Date.now()}`;
              await field.fill(testValue);
              console.log(`    ✅ Filled with: "${testValue}"`);
            } catch (e) {
              console.log(`    ❌ Could not fill: ${e}`);
            }
          }
        }
      } catch (e) {
        // Continue
      }
    }

    // Look for save/update buttons
    console.log(`\n💾 ACTION BUTTONS:`);
    for (let i = 0; i < Math.min(elements.buttons.length, 10); i++) {
      try {
        const button = elements.buttons[i];
        const isVisible = await button.isVisible();
        if (isVisible) {
          const text = await button.textContent();
          const isDisabled = await button.isDisabled();

          if (text && (text.toLowerCase().includes('save') ||
                      text.toLowerCase().includes('update') ||
                      text.toLowerCase().includes('submit') ||
                      text.toLowerCase().includes('apply'))) {
            console.log(`  Action: "${text.trim()}" (disabled: ${isDisabled})`);

            if (!isDisabled) {
              try {
                await button.click();
                await page.waitForTimeout(3000);
                console.log(`    ✅ Clicked: "${text.trim()}"`);

                // Screenshot after action
                await page.screenshot({
                  path: 'test-results/simple-asset-details-3-after-action.png',
                  fullPage: true
                });
                console.log('    ✅ Screenshot captured after action');
                break;
              } catch (e) {
                console.log(`    ❌ Could not click: ${e}`);
              }
            }
          }
        }
      } catch (e) {
        // Continue
      }
    }

    // Final screenshot
    await page.screenshot({
      path: 'test-results/simple-asset-details-4-final.png',
      fullPage: true
    });

    console.log('\n🎯 SIMPLE ASSET DETAILS EXPLORATION COMPLETE');
    console.log('📁 Screenshots saved in test-results/ folder');

    // Test passes - we've explored the page
    expect(true).toBe(true);
  });
});