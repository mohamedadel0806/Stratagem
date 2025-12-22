import { test } from '../fixtures/auth';
import { expect } from '@playwright/test';

test.describe('Deep Investigation of Specific Information Asset', () => {
  test('should deeply investigate the specific information asset URL that exists', async ({ page }) => {
    console.log('🔍 DEEP INVESTIGATION OF: http://localhost:3000/en/dashboard/assets/information/189d91ee-01dd-46a4-b6ef-76ccac11c60d');

    // Navigate to the specific URL
    const informationAssetUrl = 'http://localhost:3000/en/dashboard/assets/information/189d91ee-01dd-46a4-b6ef-76ccac11c60d';
    await page.goto(informationAssetUrl);
    console.log(`✅ Navigated to: ${informationAssetUrl}`);

    // Wait for page to fully load
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(5000);

    // Check current URL
    const currentUrl = page.url();
    console.log(`📍 Current URL: ${currentUrl}`);

    // Take comprehensive screenshots
    await page.screenshot({
      path: 'test-results/deep-investigation-initial.png',
      fullPage: true
    });

    // Step 1: Get page HTML structure
    console.log('🔍 STEP 1: ANALYZING COMPLETE PAGE STRUCTURE');

    const pageContent = await page.content();
    console.log(`📄 Page HTML length: ${pageContent.length} characters`);

    // Look for any tabs or navigation elements
    console.log('🔍 STEP 2: LOOKING FOR TABS AND NAVIGATION');

    // Check for TabsTrigger elements specifically
    const tabsTriggers = await page.locator('button[data-radix-collection-item]').all();
    console.log(`📋 Found ${tabsTriggers.length} TabsTrigger elements`);

    for (let i = 0; i < Math.min(tabsTriggers.length, 10); i++) {
      const trigger = tabsTriggers[i];
      const text = await trigger.textContent();
      const value = await trigger.getAttribute('data-value');
      const isVisible = await trigger.isVisible();
      console.log(`  TabsTrigger ${i}: "${text}" (value: ${value}, visible: ${isVisible})`);
    }

    // Check for our data-testid tabs
    const dataTestIds = await page.locator('[data-testid*="tab"]').all();
    console.log(`📋 Found ${dataTestIds.length} data-testid tabs`);

    for (let i = 0; i < Math.min(dataTestIds.length, 10); i++) {
      const element = dataTestIds[i];
      const testId = await element.getAttribute('data-testid');
      const text = await element.textContent();
      const isVisible = await element.isVisible();
      console.log(`  data-testid "${testId}": "${text}" (visible: ${isVisible})`);
    }

    // Check for any elements containing our expected tab names
    const expectedTabNames = ['Overview', 'Classification', 'Ownership', 'Compliance', 'Controls', 'Risks', 'Dependencies', 'Graph', 'Audit'];

    for (const tabName of expectedTabNames) {
      const elements = await page.locator(`text=${tabName}`).all();
      console.log(`📋 Found ${elements.length} elements with text "${tabName}"`);

      for (let i = 0; i < Math.min(elements.length, 3); i++) {
        const element = elements[i];
        const tagName = await element.evaluate(el => el.tagName);
        const isVisible = await element.isVisible();
        console.log(`    Element ${i}: <${tagName}> visible: ${isVisible}`);
      }
    }

    // Step 3: Look for any buttons or clickable elements
    console.log('🔍 STEP 3: ANALYZING ALL BUTTONS AND CLICKABLE ELEMENTS');

    const allButtons = await page.locator('button').all();
    console.log(`📋 Found ${allButtons.length} buttons total`);

    for (let i = 0; i < Math.min(allButtons.length, 15); i++) {
      const button = allButtons[i];
      const text = await button.textContent();
      const isVisible = await button.isVisible();
      const isDisabled = await button.isDisabled();
      const classes = await button.getAttribute('class');

      if (text && text.trim() && isVisible) {
        console.log(`  Button ${i}: "${text.trim()}" (disabled: ${isDisabled}, classes: ${classes?.substring(0, 50)}...)`);
      }
    }

    // Step 4: Look for forms and input fields
    console.log('🔍 STEP 4: LOOKING FOR FORMS AND INPUT FIELDS');

    const forms = await page.locator('form').all();
    console.log(`📋 Found ${forms.length} forms`);

    const inputs = await page.locator('input, textarea, select').all();
    console.log(`📋 Found ${inputs.length} input fields`);

    for (let i = 0; i < Math.min(inputs.length, 10); i++) {
      const input = inputs[i];
      const type = await input.getAttribute('type');
      const name = await input.getAttribute('name');
      const placeholder = await input.getAttribute('placeholder');
      const value = await input.inputValue();
      const isVisible = await input.isVisible();

      console.log(`  Input ${i}: type="${type}" name="${name}" placeholder="${placeholder}" value="${value}" visible: ${isVisible}`);
    }

    // Step 5: Check for card components or data displays
    console.log('🔍 STEP 5: LOOKING FOR DATA DISPLAYS');

    const cards = await page.locator('.card, [class*="card"], [data-testid*="card"]').all();
    console.log(`📋 Found ${cards.length} card elements`);

    const tables = await page.locator('table').all();
    console.log(`📋 Found ${tables.length} tables`);

    const lists = await page.locator('ul, ol, [role="list"]').all();
    console.log(`📋 Found ${lists.length} lists`);

    // Step 6: Try to interact with any potential tabs
    console.log('🔍 STEP 6: ATTEMPTING TO INTERACT WITH POTENTIAL TABS');

    // Try clicking on elements that might be tabs
    const potentialTabSelectors = [
      'button[data-value="overview"]',
      'button[data-value="classification"]',
      'button[data-value="ownership"]',
      'button[data-value="compliance"]',
      'button[data-value="controls"]',
      'button[data-value="risks"]',
      'button[data-value="dependencies"]',
      'button[data-value="graph"]',
      'button[data-value="audit"]',
      '[data-testid="tab-overview"]',
      '[data-testid="tab-classification"]',
      '[data-testid="tab-ownership"]',
      '[data-testid="tab-compliance"]',
      '[data-testid="tab-controls"]',
      '[data-testid="tab-risks"]',
      '[data-testid="tab-dependencies"]',
      '[data-testid="tab-graph"]',
      '[data-testid="tab-audit"]'
    ];

    for (const selector of potentialTabSelectors) {
      try {
        const element = page.locator(selector).first();
        const isVisible = await element.isVisible();
        const text = await element.textContent();

        if (isVisible && text) {
          console.log(`✅ Found potential tab: ${selector} -> "${text}"`);

          // Click it and see what happens
          await element.click();
          await page.waitForTimeout(2000);

          // Take screenshot after click
          const screenshotName = `test-results/clicked-${selector.replace(/[^a-zA-Z0-9]/g, '-')}.png`;
          await page.screenshot({ path: screenshotName, fullPage: false });
          console.log(`  📸 Screenshot after click: ${screenshotName}`);

          // Check if content changed
          const newContent = await page.content();
          const contentChanged = newContent !== pageContent;
          console.log(`  📝 Content changed after click: ${contentChanged}`);
        }
      } catch (error) {
        // Continue to next selector
      }
    }

    // Step 7: Look for edit or modify buttons
    console.log('🔍 STEP 7: LOOKING FOR EDIT/MODIFY BUTTONS');

    const editSelectors = [
      'button:has-text("Edit")',
      'button:has-text("Update")',
      'button:has-text("Modify")',
      'button[aria-label*="edit"]',
      'button[aria-label*="Edit"]',
      '.edit-button',
      'svg.lucide-edit'
    ];

    for (const selector of editSelectors) {
      try {
        const button = page.locator(selector).first();
        const isVisible = await button.isVisible();

        if (isVisible) {
          console.log(`✅ Found edit button: ${selector}`);
          await button.click();
          await page.waitForTimeout(3000);

          // Take screenshot after clicking edit
          await page.screenshot({
            path: 'test-results/after-clicking-edit.png',
            fullPage: true
          });

          // Look for tabs again after edit
          const tabsAfterEdit = await page.locator('button[data-radix-collection-item], [data-testid*="tab"]').all();
          console.log(`📋 After edit: Found ${tabsAfterEdit.length} potential tabs`);

          break;
        }
      } catch (error) {
        continue;
      }
    }

    // Final screenshot
    await page.screenshot({
      path: 'test-results/deep-investigation-final.png',
      fullPage: true
    });

    console.log('🎯 DEEP INVESTIGATION COMPLETE');
    console.log(`📊 Summary:`);
    console.log(`📁 URL: ${currentUrl}`);
    console.log(`📁 TabsTrigger elements: ${tabsTriggers.length}`);
    console.log(`📁 data-testid tabs: ${dataTestIds.length}`);
    console.log(`📁 Total buttons: ${allButtons.length}`);
    console.log(`📁 Input fields: ${inputs.length}`);
    console.log(`📁 Forms: ${forms.length}`);
  });
});