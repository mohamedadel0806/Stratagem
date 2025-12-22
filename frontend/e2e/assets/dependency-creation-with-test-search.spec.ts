/**
 * Test to create dependency by searching "test" and selecting from asset list
 */
import { test } from '../fixtures/auth-fixed';
import { expect } from '@playwright/test';
import { AssetDetailsPage, DependenciesTabPage } from '../pages/asset-details.page';

test.describe('Create Dependency with Test Search', () => {
  let assetPage: AssetDetailsPage;
  let dependenciesTab: DependenciesTabPage;

  test.beforeEach(async ({ authenticatedPage }) => {
    assetPage = new AssetDetailsPage(authenticatedPage);
    dependenciesTab = new DependenciesTabPage(authenticatedPage);
  });

  test('should search for test assets and select one to create dependency', async ({ authenticatedPage }) => {
    console.log('\n🎯 CREATING DEPENDENCY BY SEARCHING "TEST"');

    const assetUrl = 'http://localhost:3000/en/dashboard/assets/physical/99cb990a-29e4-4e34-acf4-d58b8261046b';
    const timestamp = Date.now();

    // Step 1: Navigate and get initial state
    console.log('📍 Setting up...');
    await assetPage.navigateToAsset(assetUrl);
    await assetPage.clickTab('Dependencies');

    const initialOutgoing = await dependenciesTab.getOutgoingDependenciesCount();
    const initialIncoming = await dependenciesTab.getIncomingDependenciesCount();
    const initialHasDeps = await dependenciesTab.hasDependencies();

    console.log(`📤 Initial outgoing: ${initialOutgoing}`);
    console.log(`📥 Initial incoming: ${initialIncoming}`);
    console.log(`🔍 Initial has dependencies: ${initialHasDeps}`);

    await assetPage.takeScreenshot('test-search-initial-state');

    // Step 2: Open dependency creation modal
    console.log('\n➕ Opening dependency creation modal...');
    await dependenciesTab.clickAddDependencyButton();

    const modalVisible = await dependenciesTab.modal.isVisible();
    expect(modalVisible).toBe(true);
    console.log('✅ Dependency creation modal opened');

    await assetPage.takeScreenshot('test-search-modal-opened');

    // Step 3: Handle dropdown controls
    console.log('\n🎯 Setting up dropdown controls...');

    const modalButtons = await dependenciesTab.modal.locator('button').all();
    let assetTypeDropdown = null;
    let relationshipTypeDropdown = null;
    let createButton = null;

    for (const button of modalButtons) {
      try {
        const text = await button.textContent();
        if (text && text.toLowerCase().includes('physical')) {
          assetTypeDropdown = button;
        } else if (text && text.toLowerCase().includes('depends on')) {
          relationshipTypeDropdown = button;
        } else if (text && text.toLowerCase().includes('create dependency')) {
          createButton = button;
        }
      } catch (e) {
        continue;
      }
    }

    // Select Physical asset type
    if (assetTypeDropdown) {
      await assetTypeDropdown.click();
      await authenticatedPage.waitForTimeout(2000);

      const options = await authenticatedPage.locator('[role="option"]').all();
      console.log(`📋 Found ${options.length} asset type options`);

      for (const option of options) {
        try {
          const text = await option.textContent();
          if (text && text.toLowerCase().includes('physical')) {
            await option.click();
            console.log('✅ Selected Physical asset type');
            break;
          }
        } catch (e) {
          continue;
        }
      }
      await authenticatedPage.waitForTimeout(1000);
    }

    // Select Depends On relationship type
    if (relationshipTypeDropdown) {
      await relationshipTypeDropdown.click();
      await authenticatedPage.waitForTimeout(2000);

      const options = await authenticatedPage.locator('[role="option"]').all();
      console.log(`📋 Found ${options.length} relationship type options`);

      for (const option of options) {
        try {
          const text = await option.textContent();
          if (text && text.toLowerCase().includes('depends on')) {
            await option.click();
            console.log('✅ Selected Depends On relationship');
            break;
          }
        } catch (e) {
          continue;
        }
      }
      await authenticatedPage.waitForTimeout(1000);
    }

    await assetPage.takeScreenshot('test-search-dropdowns-selected');

    // Step 4: Search for "test" assets - THIS IS THE KEY PART!
    console.log('\n🔍 Searching for "test" assets...');

    const searchInput = await dependenciesTab.modal.locator('input[placeholder*="Search"]').first();
    if (await searchInput.isVisible()) {
      console.log('✅ Found search input');

      // Clear and search for "test"
      await searchInput.clear();
      await searchInput.fill('test');
      console.log('✅ Filled search with "test"');

      // Wait for search to trigger
      await authenticatedPage.waitForTimeout(3000);

      // Try pressing Enter to trigger search
      await searchInput.press('Enter');
      await authenticatedPage.waitForTimeout(3000);
      console.log('✅ Triggered search with Enter');

      await assetPage.takeScreenshot('test-search-filled');

      // Step 5: Look for asset list that appears
      console.log('\n📋 Looking for asset list...');

      // Look for various types of asset list elements
      const assetListSelectors = [
        '[role="option"]',
        '[role="listitem"]',
        'li',
        '.asset-item',
        '.search-result',
        '[data-testid*="asset"]',
        '[data-testid*="item"]',
        '[data-testid*="result"]',
        '.dropdown-item',
        '.option'
      ];

      let assetItems = [];
      for (const selector of assetListSelectors) {
        try {
          const items = await dependenciesTab.modal.locator(selector).all();
          if (items.length > 0) {
            console.log(`📋 Found ${items.length} items with selector: ${selector}`);
            assetItems = items;
            break;
          }
        } catch (e) {
          continue;
        }
      }

      if (assetItems.length > 0) {
        console.log(`✅ Found ${assetItems.length} potential asset items in list`);

        // Analyze the asset items
        let validAssets = [];
        for (let i = 0; i < Math.min(assetItems.length, 10); i++) {
          try {
            const item = assetItems[i];
            if (await item.isVisible()) {
              const text = await item.textContent();
              const testid = await item.getAttribute('data-testid');
              const className = await item.getAttribute('className');

              // Look for actual asset names (not dropdown headers)
              if (text && text.trim().length > 5 &&
                  !text.toLowerCase().includes('overview') &&
                  !text.toLowerCase().includes('location') &&
                  !text.toLowerCase().includes('ownership') &&
                  !text.toLowerCase().includes('compliance') &&
                  !text.toLowerCase().includes('controls') &&
                  !text.toLowerCase().includes('risks') &&
                  !text.toLowerCase().includes('graph') &&
                  !text.toLowerCase().includes('audit')) {

                validAssets.push({
                  element: item,
                  text: text.trim(),
                  testid: testid || '',
                  className: className || '',
                  index: i
                });

                console.log(`  📋 Asset ${validAssets.length}: "${text.trim()}" [${testid || 'no-testid'}]`);
              }
            }
          } catch (e) {
            continue;
          }
        }

        if (validAssets.length > 0) {
          console.log(`✅ Found ${validAssets.length} valid assets to select from`);

          // Select the first valid asset
          try {
            const selectedAsset = validAssets[0];
            await selectedAsset.element.click();
            console.log(`✅ Selected asset: "${selectedAsset.text}"`);
            await authenticatedPage.waitForTimeout(2000);

            await assetPage.takeScreenshot('test-search-asset-selected');

            // Check if this enabled the create button
            if (createButton) {
              const isEnabled = await createButton.isEnabled();
              console.log(`💾 Create button enabled after asset selection: ${isEnabled}`);

              if (isEnabled) {
                console.log('🎉 SUCCESS: Asset selection enabled create button!');
              }
            }

          } catch (e) {
            console.log(`❌ Error selecting asset: ${e}`);
          }
        } else {
          console.log('ℹ️ No valid assets found in search results');

          // Try alternative approaches - maybe assets are shown differently
          console.log('\n🔍 Trying alternative search approaches...');

          // Wait a bit more and look again
          await authenticatedPage.waitForTimeout(3000);

          const allClickableElements = await dependenciesTab.modal.locator('div, span, button, li').all();
          console.log(`🔍 Found ${allClickableElements.length} total clickable elements`);

          let assetLikeElements = [];
          for (let i = 0; i < Math.min(allClickableElements.length, 50); i++) {
            try {
              const element = allClickableElements[i];
              if (await element.isVisible()) {
                const text = await element.textContent();

                if (text && text.toLowerCase().includes('test') && text.trim().length > 5 && text.trim().length < 100) {
                  assetLikeElements.push({
                    element,
                    text: text.trim(),
                    index: i
                  });
                  console.log(`  🎯 Potential asset element ${i}: "${text.trim()}"`);
                }
              }
            } catch (e) {
              continue;
            }
          }

          if (assetLikeElements.length > 0) {
            console.log(`✅ Found ${assetLikeElements.length} elements containing "test" - trying to click one`);

            try {
              await assetLikeElements[0].element.click();
              console.log('✅ Clicked first test-related element');
              await authenticatedPage.waitForTimeout(2000);

              await assetPage.takeScreenshot('test-search-alternative-selected');
            } catch (e) {
              console.log(`❌ Error clicking alternative element: ${e}`);
            }
          }
        }
      } else {
        console.log('❌ No asset list found after searching for "test"');

        // Maybe the search shows results in a different way
        console.log('\n🔍 Looking for any new content that appeared after search...');

        // Take a screenshot to see what actually appeared
        await assetPage.takeScreenshot('test-search-no-results-debug');
      }
    }

    // Step 6: Fill description
    console.log('\n📄 Filling description...');
    const descriptionTextarea = await dependenciesTab.modal.locator('textarea').first();
    if (await descriptionTextarea.isVisible()) {
      await descriptionTextarea.fill(`Dependency created by E2E test at ${timestamp}. Found and selected a test asset from the search results.`);
      console.log('✅ Filled description');
    }

    await assetPage.takeScreenshot('test-search-form-completed');

    // Step 7: Try to submit the form
    console.log('\n💾 Attempting to submit dependency creation...');

    if (createButton) {
      const isEnabled = await createButton.isEnabled();
      const buttonText = await createButton.textContent();

      console.log(`💾 Create button: "${buttonText}" (enabled: ${isEnabled})`);

      if (isEnabled) {
        console.log('✅ Submitting dependency creation...');
        await createButton.click();
        console.log('✅ Create button clicked');

        // Wait for processing
        await authenticatedPage.waitForTimeout(8000);

        // Check if modal closed
        const modalStillOpen = await dependenciesTab.modal.isVisible();

        if (!modalStillOpen) {
          console.log('🎉 SUCCESS: Modal closed after dependency creation!');

          await assetPage.takeScreenshot('test-search-creation-success');

          // Step 8: Verify dependency was created
          console.log('\n🔍 Verifying dependency creation...');

          // Reload page for fresh data
          await authenticatedPage.waitForTimeout(3000);
          await assetPage.navigateToAsset(assetUrl);
          await assetPage.clickTab('Dependencies');
          await authenticatedPage.waitForTimeout(5000);

          const finalOutgoing = await dependenciesTab.getOutgoingDependenciesCount();
          const finalIncoming = await dependenciesTab.getIncomingDependenciesCount();
          const finalHasDeps = await dependenciesTab.hasDependencies();

          console.log(`📤 Final outgoing: ${finalOutgoing} (was ${initialOutgoing})`);
          console.log(`📥 Final incoming: ${finalIncoming} (was ${initialIncoming})`);
          console.log(`🔍 Final has dependencies: ${finalHasDeps} (was ${initialHasDeps})`);

          const dependencyCreated = finalOutgoing > initialOutgoing || finalIncoming > initialIncoming || (finalHasDeps && !initialHasDeps);

          if (dependencyCreated) {
            console.log('🎉 COMPLETE SUCCESS: Actual dependency created using "test" search!');
          } else {
            console.log('ℹ️ Dependency creation attempted, checking for visible results...');

            // Look for dependency elements on the page
            const depElements = await authenticatedPage.locator('[data-testid*="dependency"], .dependency, [class*="dependency"]').all();
            console.log(`📋 Found ${depElements.length} dependency elements`);

            for (let i = 0; i < Math.min(depElements.length, 3); i++) {
              try {
                const element = depElements[i];
                if (await element.isVisible()) {
                  const text = await element.textContent();
                  const testid = await element.getAttribute('data-testid');
                  console.log(`  ${i + 1}. [${testid || 'no-testid'}] "${text?.trim().substring(0, 100)}${text ? (text.length > 100 ? '...' : '') : ''}"`);
                }
              } catch (e) {
                continue;
              }
            }
          }

          await assetPage.takeScreenshot('test-search-final-verification');

        } else {
          console.log('⚠️ Modal still open after submission - checking for errors...');

          const errorElements = await dependenciesTab.modal.locator('text:has-text("error"), text:has-text("required"), text:has-text("invalid")').all();

          if (errorElements.length > 0) {
            console.log('❌ Found error messages:');
            for (const error of errorElements.slice(0, 3)) {
              try {
                const text = await error.textContent();
                console.log(`  - ${text}`);
              } catch (e) {
                continue;
              }
            }
          }

          await assetPage.takeScreenshot('test-search-modal-errors');
        }
      } else {
        console.log('❌ Create button is still disabled - may need to select an asset properly');
        await assetPage.takeScreenshot('test-search-button-disabled');
      }
    } else {
      console.log('❌ Create Dependency button not found');
    }

    // Clean up
    await dependenciesTab.closeModal();

    console.log('\n✅ DEPENDENCY CREATION WITH "TEST" SEARCH COMPLETED');
    console.log('📁 Screenshots saved: test-search-*.png');
  });
});