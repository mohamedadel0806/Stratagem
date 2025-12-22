'use client';

import { test, expect } from '../fixtures/auth';

test.describe('Comprehensive Information Asset Details Exploration', () => {
  test('should explore Information Assets details page with all tabs and functionality', async ({ page }) => {
    console.log('🚀 TESTING COMPREHENSIVE INFORMATION ASSETS DETAILS PAGE');

    // Navigate directly to the specific information asset
    const informationAssetId = '189d91ee-01dd-46a4-b6ef-76ccac11c60d';
    await page.goto(`http://localhost:3000/en/dashboard/assets/information/${informationAssetId}`);

    await page.waitForTimeout(2000);
    console.log('✅ Navigated to Information Assets details page');

    // Verify current URL
    const currentUrl = page.url();
    expect(currentUrl).toContain('/dashboard/assets/information/');
    expect(currentUrl).toContain(informationAssetId);
    console.log(`✅ Current URL: ${currentUrl}`);

    // Take initial screenshot
    await page.screenshot({
      path: 'test-results/information-assets-initial-details.png',
      fullPage: true
    });
    console.log('✅ Screenshot 1: Information Assets initial details page captured');

    // Analyze page structure - look for navigation elements
    await page.waitForTimeout(1000);

    // Look for tabs specifically (Information assets should have tabs like Physical assets)
    const tabs = page.locator('[role="tab"]');
    const tabsCount = await tabs.count();
    console.log(`🧭 Found ${tabsCount} navigation tabs`);

    // If tabs are found, explore each one
    if (tabsCount > 0) {
      for (let i = 0; i < tabsCount; i++) {
        const tab = tabs.nth(i);
        const tabText = await tab.textContent();

        if (tabText && tabText.trim()) {
          console.log(`📍 Clicking: "${tabText.trim()}"`);

          try {
            await tab.click();
            await page.waitForTimeout(1000);

            // Take screenshot for each tab
            await page.screenshot({
              path: `test-results/information-assets-tab-${tabText.trim().toLowerCase().replace(/\s+/g, '-')}.png`,
              fullPage: false
            });
            console.log(`✅ Screenshot captured for: "${tabText.trim()}"`);

            // Analyze content in this section
            await analyzeTabContent(page, tabText.trim());

          } catch (error) {
            console.log(`❌ Could not explore tab "${tabText.trim()}": ${error.message}`);
          }
        }
      }
    } else {
      // If no tabs found, check for other navigation patterns
      console.log('📋 No tabs found, looking for alternative navigation...');

      // Look for any clickable elements that might be navigation
      const navigationElements = await page.locator('button, [role="button"], a').all();
      const navButtons = [];

      for (let i = 0; i < Math.min(navigationElements.length, 10); i++) {
        try {
          const element = navigationElements.nth(i);
          const text = await element.textContent();
          const isVisible = await element.isVisible();

          if (text && text.trim() && isVisible) {
            navButtons.push(`Nav ${i}: "${text.trim()}" (${element.locator().toString()})`);
          }
        } catch (e) {
          // Skip elements that can't be accessed
        }
      }

      console.log(`🧭 Found ${navButtons.length} navigation elements:`);
      navButtons.forEach(nav => console.log(`  ${nav}`));

      // Try clicking a few key navigation elements if they look relevant
      for (let i = 0; i < Math.min(navButtons.length, 5); i++) {
        try {
          const element = page.locator(navButtons[i].split(' ').pop().replace(/[()]/g, ''));
          await element.click();
          await page.waitForTimeout(1000);
          console.log(`✅ Clicked navigation element ${i}`);
        } catch (error) {
          console.log(`❌ Could not click navigation element ${i}: ${error.message}`);
        }
      }
    }

    // Look for form fields and interactive elements
    await page.waitForTimeout(1000);
    console.log('📝 Looking for form fields and interactive elements...');

    const inputFields = await page.locator('input, textarea, select').all();
    const editableFields = [];

    for (let i = 0; i < Math.min(inputFields.length, 20); i++) {
      try {
        const field = inputFields.nth(i);
        const isVisible = await field.isVisible();
        const isDisabled = await field.isDisabled();
        const isReadOnly = await field.isReadOnly();
        const placeholder = await field.getAttribute('placeholder');
        const name = await field.getAttribute('name');

        if (isVisible && !isDisabled && !isReadOnly) {
          editableFields.push({
            index: i,
            type: await field.evaluate(el => el.tagName.toLowerCase()),
            name: name || placeholder || `input ${i}`,
            placeholder: placeholder || '',
            disabled: isDisabled,
            readonly: isReadOnly
          });
        }
      } catch (e) {
        // Skip fields that can't be accessed
      }
    }

    console.log(`✏️ Found ${editableFields.length} editable fields`);

    // Try to fill some editable fields for testing
    if (editableFields.length > 0) {
      console.log('✏️ Found editable fields - attempting to fill...');

      const testValue = `E2E Test Information Asset ${Date.now()}`;

      for (let i = 0; i < Math.min(editableFields.length, 3); i++) {
        try {
          const field = page.locator('input, textarea, select').nth(i);
          await field.fill(testValue);
          console.log(`    ✅ Updated ${editableFields[i].type}: "${editableFields[i].name}"`);
        } catch (error) {
          console.log(`    ❌ Could not fill field ${i}: ${error.message}`);
        }
      }
    }

    // Look for save/update buttons
    const saveButtons = await page.locator('button:has-text("Save"), button:has-text("Update"), button:has-text("Submit"), button[type="submit"]').all();
    console.log(`💾 Found ${saveButtons.length} save/update buttons`);

    if (saveButtons.length > 0) {
      try {
        console.log('💾 Attempting to save changes...');
        await saveButtons[0].click();
        await page.waitForTimeout(2000);
        console.log('✅ Save action attempted');
      } catch (error) {
        console.log(`❌ Could not click save button: ${error.message}`);
      }
    } else {
      console.log('💾 No save/update buttons found');
    }

    // Take final screenshot
    await page.screenshot({
      path: 'test-results/information-assets-final-details.png',
      fullPage: true
    });
    console.log('✅ Screenshot captured after filling fields');

    // Final analysis
    console.log('🎯 FINAL ANALYSIS');
    console.log(`📊 INFORMATION ASSETS DETAILS PAGE TEST COMPLETE`);
    console.log(`📁 Navigation tabs found: ${tabsCount}`);
    console.log(`📁 Interactive form fields: ${editableFields.length}`);
    console.log(`📁 Editable fields: ${editableFields.length}`);
    console.log(`📁 Save buttons found: ${saveButtons.length}`);
    console.log(`📁 All screenshots saved in test-results/ folder`);
  });
});

async function analyzeTabContent(page: string, tabName: string) {
  try {
    // Look for different types of content based on tab name
    let contentFound = '';

    // Common elements to look for
    const commonSelectors = [
      'form',
      'table',
      'table tbody tr',
      '.grid',
      '.flex',
      'h1, h2, h3, h4, h5, h6',
      'input, textarea, select',
      'button',
      '[data-testid]',
      '.card',
      '.badge'
    ];

    for (const selector of commonSelectors) {
      try {
        const elements = await page.locator(selector).all();
        const visibleCount = await Promise.all(
          elements.map(el => el.isVisible().catch(() => false))
        ).then(results => results.filter(Boolean).length);

        if (visibleCount > 0) {
          contentFound += `📝 Found ${visibleCount} ${selector} elements in this section`;
          break;
        }
      } catch (e) {
        // Skip selector if it causes errors
      }
    }

    if (contentFound) {
      console.log(`  📋 Analyzing content in section: "${tabName}"`);
      console.log(`    ${contentFound}`);
    } else {
      console.log(`  📋 Section "${tabName}" - No common elements found`);
    }
  } catch (error) {
    console.log(`  ❌ Error analyzing section "${tabName}": ${error.message}`);
  }
}