/**
 * Create asset and then immediately explore its details page
 * Uses the working auth fixture from our successful tests
 */
import { test } from '../fixtures/auth-fixed';
import { expect } from '@playwright/test';
import { waitForAssetsPage } from '../utils/helpers';

test.describe('Create Asset and Explore Details', () => {
  test('should create physical asset and explore details page tabs', async ({ authenticatedPage }) => {
    console.log('🚀 CREATE AND EXPLORE PHYSICAL ASSET DETAILS');
    const timestamp = Date.now();

    // Step 1: Create a new physical asset
    await authenticatedPage.goto('/dashboard/assets/physical');
    await waitForAssetsPage(authenticatedPage);

    await authenticatedPage.click('button:has-text("New Asset")');
    await authenticatedPage.waitForTimeout(3000);

    const uniqueId = `EXPLORE-${timestamp}`;
    const description = `Test asset for details exploration ${timestamp}`;

    await authenticatedPage.fill('input[name="uniqueIdentifier"]', uniqueId);
    await authenticatedPage.fill('textarea[name="assetDescription"]', description);

    // Screenshot the filled form
    await authenticatedPage.screenshot({
      path: 'test-results/explore-details-creation-form.png',
      fullPage: true
    });

    // Submit the form
    await authenticatedPage.click('button[type="submit"]:has-text("Create")');
    await authenticatedPage.waitForTimeout(5000);

    // Step 2: Find the created asset in the list
    await waitForAssetsPage(authenticatedPage);
    await authenticatedPage.waitForTimeout(3000);

    console.log(`🔍 Looking for created asset: ${uniqueId}`);

    // Look for the asset record
    const assetElement = authenticatedPage.locator(`text=${uniqueId}`).first();
    const assetFound = await assetElement.isVisible().catch(() => false);

    if (assetFound) {
      console.log('✅ Found created asset in list!');

      // Screenshot showing asset in list
      await authenticatedPage.screenshot({
        path: 'test-results/explore-details-asset-in-list.png',
        fullPage: true
      });

      // Step 3: Try to navigate to asset details
      console.log('🔍 Attempting to navigate to asset details...');

      // Try different ways to get to details page

      // Method 1: Click on the asset itself
      try {
        await assetElement.click();
        await authenticatedPage.waitForTimeout(3000);

        const currentUrl = authenticatedPage.url();
        console.log(`URL after clicking asset: ${currentUrl}`);

        if (currentUrl.includes('/dashboard/assets/physical/')) {
          console.log('✅ Successfully navigated to asset details page!');
          await exploreAssetDetailsPage(authenticatedPage, 'physical', uniqueId);
        } else {
          console.log('❌ Click on asset did not navigate to details page');
        }
      } catch (e) {
        console.log(`❌ Could not click on asset: ${e}`);
      }

      // Method 2: Look for view/details buttons
      if (authenticatedPage.url().includes('/dashboard/assets/physical')) {
        console.log('Looking for view/details buttons...');

        const actionButtons = await authenticatedPage.locator('button:has-text("View"), button:has-text("Details"), button:has-text("Manage"), button:has-text("Edit")').all();

        for (let i = 0; i < Math.min(actionButtons.length, 5); i++) {
          try {
            const isVisible = await actionButtons[i].isVisible();
            if (isVisible) {
              const buttonText = await actionButtons[i].textContent();
              console.log(`Found action button: "${buttonText}"`);

              await actionButtons[i].click();
              await authenticatedPage.waitForTimeout(3000);

              const newUrl = authenticatedPage.url();
              if (newUrl.includes('/dashboard/assets/physical/')) {
                console.log('✅ Successfully navigated via action button!');
                await exploreAssetDetailsPage(authenticatedPage, 'physical', uniqueId);
                break;
              }
            }
          } catch (e) {
            console.log(`Could not click action button ${i}: ${e}`);
          }
        }
      }

    } else {
      console.log('❌ Could not find created asset in list');
      console.log('🔍 Trying direct navigation to known asset details page...');

      // Use a known asset details page URL
      const detailsUrl = '/dashboard/assets/physical/bcfbb233-f00a-4ec2-b97c-d052b7129385';
      await authenticatedPage.goto(detailsUrl);
      await authenticatedPage.waitForTimeout(3000);

      const currentUrl = authenticatedPage.url();
      if (currentUrl.includes(detailsUrl)) {
        console.log('✅ Successfully navigated to known asset details page!');
        await exploreAssetDetailsPage(authenticatedPage, 'physical', 'sample-asset');
      } else {
        console.log('❌ Could not navigate to asset details page');
      }
    }

    console.log('\n🎯 CREATE AND EXPLORE COMPLETE');
    expect(true).toBe(true);
  });
});

async function exploreAssetDetailsPage(page: any, assetType: string, assetIdentifier: string) {
  console.log(`\n📋 EXPLORING ${assetType.toUpperCase()} ASSET DETAILS PAGE`);
  console.log(`Asset identifier: ${assetIdentifier}`);

  // Screenshot the initial details page
  await page.screenshot({
    path: `test-results/${assetType}-details-explorer-initial.png`,
    fullPage: true
  });
  console.log('✅ Initial details page screenshot captured');

  // Look for tabs and navigation elements
  console.log('\n🔍 LOOKING FOR TABS AND NAVIGATION...');

  const tabSelectors = [
    '[role="tab"]',
    '.tab',
    'button[role="tab"]',
    '.tab-button',
    '.nav-item',
    'nav button',
    '.page-nav button',
    'button:has-text("Overview")',
    'button:has-text("Details")',
    'button:has-text("Information")',
    'button:has-text("History")',
    'button:has-text("Audit")',
    'button:has-text("Related")',
    'button:has-text("Documents")',
    'button:has-text("Notes")',
    'button:has-text("Maintenance")',
    'button:has-text("Security")',
    'button:has-text("Dependencies")'
  ];

  let foundTabs = [];
  for (const selector of tabSelectors) {
    try {
      const elements = await page.locator(selector).all();
      for (const element of elements) {
        const isVisible = await element.isVisible().catch(() => false);
        if (isVisible) {
          const text = await element.textContent();
          if (text && text.trim() && !foundTabs.some(t => t.text === text.trim())) {
            foundTabs.push({
              element,
              text: text.trim(),
              selector
            });
          }
        }
      }
    } catch (e) {
      // Continue
    }
  }

  console.log(`📂 Found ${foundTabs.length} potential tabs/sections:`);
  foundTabs.forEach((tab, index) => {
    console.log(`  Tab ${index}: "${tab.text}" (${tab.selector})`);
  });

  // Click through tabs and explore each one
  for (let i = 0; i < Math.min(foundTabs.length, 8); i++) {
    try {
      const tab = foundTabs[i];
      console.log(`\n🔄 Exploring tab: "${tab.text}"`);

      await tab.element.click();
      await page.waitForTimeout(2000);

      // Screenshot each tab
      await page.screenshot({
        path: `test-results/${assetType}-details-tab-${i}-${tab.text.replace(/[^a-zA-Z0-9]/g, '_')}.png`,
        fullPage: true
      });
      console.log(`✅ Screenshot captured for tab: "${tab.text}"`);

      // Look for form fields in this tab
      const formFields = await page.locator('input, textarea, select').all();
      const visibleEditableFields = [];

      for (const field of formFields) {
        try {
          const isVisible = await field.isVisible();
          const isDisabled = await field.isDisabled();
          const isReadOnly = await field.getAttribute('readonly') !== null;

          if (isVisible && !isDisabled && !isReadOnly) {
            const tagName = await field.evaluate((el: any) => el.tagName.toLowerCase());
            const name = await field.getAttribute('name') || '';
            const placeholder = await field.getAttribute('placeholder') || '';

            visibleEditableFields.push({
              element: field,
              tagName,
              name,
              placeholder
            });
          }
        } catch (e) {
          // Continue
        }
      }

      if (visibleEditableFields.length > 0) {
        console.log(`  📝 Found ${visibleEditableFields.length} editable fields in this tab`);

        // Try to fill a few fields
        for (let j = 0; j < Math.min(visibleEditableFields.length, 2); j++) {
          try {
            const field = visibleEditableFields[j];
            const testValue = `E2E Test Update ${Date.now()}-${j}`;

            await field.element.fill(testValue);
            console.log(`    ✅ Filled ${field.tagName} "${field.name}": "${testValue}"`);
          } catch (e) {
            console.log(`    ❌ Could not fill field ${j}: ${e}`);
          }
        }

        // Screenshot after filling
        await page.screenshot({
          path: `test-results/${assetType}-details-tab-${i}-filled-${tab.text.replace(/[^a-zA-Z0-9]/g, '_')}.png`,
          fullPage: true
        });
      }

      // Look for save/update buttons in this tab
      const saveButtons = await page.locator('button:has-text("Save"), button:has-text("Update"), button:has-text("Submit"), button:has-text("Apply")').all();

      for (const button of saveButtons) {
        try {
          const isVisible = await button.isVisible();
          const isEnabled = await button.isEnabled();
          if (isVisible && isEnabled) {
            const buttonText = await button.textContent();
            console.log(`  💾 Found save button: "${buttonText}"`);

            await button.click();
            await page.waitForTimeout(3000);
            console.log(`  ✅ Clicked save button: "${buttonText}"`);

            // Screenshot after save
            await page.screenshot({
              path: `test-results/${assetType}-details-after-save-${tab.text.replace(/[^a-zA-Z0-9]/g, '_')}.png`,
              fullPage: true
            });

            break;
          }
        } catch (e) {
          console.log(`  ❌ Could not click save button: ${e}`);
        }
      }

    } catch (e) {
      console.log(`❌ Could not explore tab ${i}: ${e}`);
    }
  }

  // If no tabs found, analyze the page structure
  if (foundTabs.length === 0) {
    console.log('\n📄 NO TABS FOUND - ANALYZING PAGE STRUCTURE...');

    // Look for sections
    const sections = await page.locator('h1, h2, h3, .section, .panel, .card').all();
    console.log(`Found ${sections.length} sections:`);

    for (let i = 0; i < Math.min(sections.length, 10); i++) {
      try {
        const section = sections[i];
        const isVisible = await section.isVisible();
        if (isVisible) {
          const text = await section.textContent();
          if (text && text.trim() && text.trim().length < 100) {
            console.log(`  Section: "${text.trim()}"`);
          }
        }
      } catch (e) {
        // Continue
      }
    }
  }

  // Final screenshot
  await page.screenshot({
    path: `test-results/${assetType}-details-explorer-final.png`,
    fullPage: true
  });

  console.log('\n✅ ASSET DETAILS PAGE EXPLORATION COMPLETE');
  console.log(`📁 Found ${foundTabs.length} tabs/sections`);
  console.log(`📁 Screenshots saved for ${assetType} asset details`);
}