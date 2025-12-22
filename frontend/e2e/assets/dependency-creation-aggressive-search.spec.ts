/**
 * Aggressive test to find and interact with asset search results
 */
import { test } from '../fixtures/auth-fixed';
import { expect } from '@playwright/test';
import { AssetDetailsPage, DependenciesTabPage } from '../pages/asset-details.page';

test.describe('Aggressive Dependency Search Test', () => {
  let assetPage: AssetDetailsPage;
  let dependenciesTab: DependenciesTabPage;

  test.beforeEach(async ({ authenticatedPage }) => {
    assetPage = new AssetDetailsPage(authenticatedPage);
    dependenciesTab = new DependenciesTabPage(authenticatedPage);
  });

  test('should aggressively search for assets and find the list', async ({ authenticatedPage }) => {
    console.log('\n🔥 AGGRESSIVE SEARCH FOR ASSETS IN DEPENDENCY CREATION');

    const assetUrl = 'http://localhost:3000/en/dashboard/assets/physical/99cb990a-29e4-4e34-acf4-d58b8261046b';

    // Step 1: Set up the form
    console.log('📍 Setting up dependency creation form...');
    await assetPage.navigateToAsset(assetUrl);
    await assetPage.clickTab('Dependencies');
    await dependenciesTab.clickAddDependencyButton();

    // Set up dropdowns quickly
    const modalButtons = await dependenciesTab.modal.locator('button').all();
    for (const button of modalButtons) {
      try {
        const text = await button.textContent();
        if (text && text.toLowerCase().includes('physical')) {
          await button.click();
          await authenticatedPage.waitForTimeout(1000);
          // Select Physical
          const options = await authenticatedPage.locator('[role="option"]').all();
          for (const option of options) {
            try {
              if ((await option.textContent())?.toLowerCase().includes('physical')) {
                await option.click();
                break;
              }
            } catch (e) { continue; }
          }
          await authenticatedPage.waitForTimeout(1000);
        } else if (text && text.toLowerCase().includes('depends on')) {
          await button.click();
          await authenticatedPage.waitForTimeout(1000);
          // Select Depends On
          const options = await authenticatedPage.locator('[role="option"]').all();
          for (const option of options) {
            try {
              if ((await option.textContent())?.toLowerCase().includes('depends on')) {
                await option.click();
                break;
              }
            } catch (e) { continue; }
          }
          await authenticatedPage.waitForTimeout(1000);
        }
      } catch (e) { continue; }
    }

    // Step 2: Aggressive search for assets
    console.log('\n🔥 STARTING AGGRESSIVE SEARCH...');

    const searchInput = await dependenciesTab.modal.locator('input[placeholder*="Search"]').first();
    if (await searchInput.isVisible()) {
      console.log('✅ Search input found');

      // Try multiple search strategies with longer waits
      const searchStrategies = [
        { term: 'test', wait: 5000, description: 'Search for "test" with 5s wait' },
        { term: 'Test', wait: 5000, description: 'Search for "Test" with 5s wait' },
        { term: 'TEST', wait: 5000, description: 'Search for "TEST" with 5s wait' },
        { term: '', wait: 3000, description: 'Empty search to show all assets' },
        { term: 'server', wait: 5000, description: 'Search for "server" with 5s wait' },
        { term: 'application', wait: 5000, description: 'Search for "application" with 5s wait' },
        { term: 'database', wait: 5000, description: 'Search for "database" with 5s wait' },
        { term: 'network', wait: 5000, description: 'Search for "network" with 5s wait' }
      ];

      for (const strategy of searchStrategies) {
        console.log(`\n${strategy.description}`);

        try {
          await searchInput.clear();
          if (strategy.term) {
            await searchInput.fill(strategy.term);
            console.log(`  ✅ Filled search with "${strategy.term}"`);
          }

          // Try multiple ways to trigger search
          console.log('  🔍 Triggering search with Enter...');
          await searchInput.press('Enter');

          // Wait longer for results to appear
          console.log(`  ⏳ Waiting ${strategy.wait}ms for results...`);
          await authenticatedPage.waitForTimeout(strategy.wait);

          // Take screenshot after each search to see what appears
          await assetPage.takeScreenshot(`aggressive-search-${strategy.term || 'empty'}`);

          // Look for ANY new elements that appeared
          console.log('  🔍 Scanning for ANY clickable elements...');

          // Get ALL elements in modal and analyze them
          const allModalElements = await dependenciesTab.modal.locator('*').all();
          console.log(`    📋 Found ${allModalElements.length} total elements in modal`);

          let potentialAssets = [];
          let clickableElements = [];

          for (let i = 0; i < Math.min(allModalElements.length, 100); i++) {
            try {
              const element = allModalElements[i];
              if (await element.isVisible()) {
                const text = await element.textContent();
                const tagName = await element.evaluate((el: any) => el.tagName.toLowerCase());
                const className = await element.getAttribute('class') || '';
                const testid = await element.getAttribute('data-testid') || '';
                const role = await element.getAttribute('role') || '';

                // Look for clickable elements that might be asset results
                if (text && text.trim().length > 3) {
                  const isClickable = tagName === 'button' || tagName === 'li' || tagName === 'a' ||
                                     role === 'option' || role === 'button' || role === 'listitem' ||
                                     className.includes('item') || className.includes('option') ||
                                     className.includes('result') || className.includes('asset') ||
                                     testid.includes('asset') || testid.includes('item') || testid.includes('result');

                  if (isClickable) {
                    clickableElements.push({
                      element,
                      index: i,
                      text: text.trim(),
                      tagName,
                      className,
                      testid,
                      role
                    });

                    // Look specifically for asset-like text
                    if (text.length > 10 && text.length < 200 &&
                        !text.toLowerCase().includes('overview') &&
                        !text.toLowerCase().includes('location') &&
                        !text.toLowerCase().includes('ownership') &&
                        !text.toLowerCase().includes('compliance') &&
                        !text.toLowerCase().includes('controls') &&
                        !text.toLowerCase().includes('risks') &&
                        !text.toLowerCase().includes('graph') &&
                        !text.toLowerCase().includes('audit') &&
                        !text.toLowerCase().includes('physical') &&
                        !text.toLowerCase().includes('depends on') &&
                        !text.toLowerCase().includes('cancel') &&
                        !text.toLowerCase().includes('create') &&
                        !text.toLowerCase().includes('close')) {

                      potentialAssets.push({
                        element,
                        text: text.trim(),
                        index: i,
                        tagName,
                        className,
                        testid,
                        role
                      });
                    }
                  }
                }
              }
            } catch (e) {
              continue;
            }
          }

          console.log(`    🔍 Found ${clickableElements.length} clickable elements`);
          console.log(`    🎯 Found ${potentialAssets.length} potential asset elements`);

          if (potentialAssets.length > 0) {
            console.log('    🎉 POTENTIAL ASSETS FOUND! Displaying them:');

            for (let i = 0; i < Math.min(potentialAssets.length, 5); i++) {
              const asset = potentialAssets[i];
              console.log(`      ${i + 1}. ${asset.tagName.toUpperCase()} [${asset.testid || 'no-testid'}] role="${asset.role}"`);
              console.log(`         Text: "${asset.text.substring(0, 100)}${asset.text.length > 100 ? '...' : ''}"`);
              console.log(`         Class: "${asset.className}"`);
            }

            // Try clicking the first potential asset
            console.log('    🖱️  Attempting to click first potential asset...');
            try {
              await potentialAssets[0].element.click();
              console.log('    ✅ Clicked first potential asset element');
              await authenticatedPage.waitForTimeout(2000);

              // Check if create button is now enabled
              const createButton = await dependenciesTab.modal.locator('button:has-text("Create Dependency")').first();
              if (await createButton.isVisible()) {
                const isEnabled = await createButton.isEnabled();
                console.log(`    💾 Create button enabled after click: ${isEnabled}`);

                if (isEnabled) {
                  console.log('    🎉 SUCCESS: Found and selected an asset!');
                  await assetPage.takeScreenshot('aggressive-search-success-asset-found');
                  break;
                }
              }
            } catch (e) {
              console.log(`    ❌ Error clicking potential asset: ${e}`);
            }
          }

          // If no potential assets, try any clickable element
          if (potentialAssets.length === 0 && clickableElements.length > 5) {
            console.log('    🔍 No obvious assets, trying any clickable element...');
            console.log('    🔍 Clickable elements found:');

            for (let i = 0; i < Math.min(clickableElements.length, 3); i++) {
              const element = clickableElements[i];
              console.log(`      ${i + 1}. ${element.tagName} [${element.testid || 'no-testid'}]: "${element.text.substring(0, 50)}..."`);
            }

            // Try clicking the first few clickable elements
            for (let i = 0; i < Math.min(clickableElements.length, 3); i++) {
              try {
                console.log(`    🖱️  Trying to click clickable element ${i + 1}...`);
                await clickableElements[i].element.click();
                await authenticatedPage.waitForTimeout(2000);

                const createButton = await dependenciesTab.modal.locator('button:has-text("Create Dependency")').first();
                if (await createButton.isVisible()) {
                  const isEnabled = await createButton.isEnabled();
                  console.log(`      💾 Create button enabled: ${isEnabled}`);

                  if (isEnabled) {
                    console.log(`      🎉 SUCCESS: Clicking element ${i + 1} enabled create button!`);
                    await assetPage.takeScreenshot('aggressive-search-success-clickable');
                    break;
                  }
                }
              } catch (e) {
                console.log(`      ❌ Error clicking element ${i + 1}: ${e}`);
              }
            }
          }

          // Check if we were successful with this strategy
          const createButton = await dependenciesTab.modal.locator('button:has-text("Create Dependency")').first();
          if (await createButton.isVisible() && await createButton.isEnabled()) {
            console.log(`  🎉 STRATEGY SUCCESSFUL with "${strategy.term}"!`);

            // Fill description and submit
            const textarea = await dependenciesTab.modal.locator('textarea').first();
            if (await textarea.isVisible()) {
              await textarea.fill(`Dependency created with search term "${strategy.term}". Found and selected asset successfully!`);
              console.log('  ✅ Filled description');
            }

            await createButton.click();
            console.log('  💾 Submitted dependency creation!');
            await authenticatedPage.waitForTimeout(5000);

            const modalStillOpen = await dependenciesTab.modal.isVisible();
            if (!modalStillOpen) {
              console.log('  🎉 COMPLETE SUCCESS: Modal closed - dependency created!');
              await assetPage.takeScreenshot('aggressive-search-complete-success');
              break;
            }
          }
        } catch (e) {
          console.log(`  ❌ Strategy "${strategy.term}" failed: ${e}`);
        }
      }
    }

    // Final state check
    console.log('\n📊 FINAL ANALYSIS:');
    const modalStillOpen = await dependenciesTab.modal.isVisible();
    console.log(`Modal still open: ${modalStillOpen}`);

    if (modalStillOpen) {
      await assetPage.takeScreenshot('aggressive-search-final-state');
    }

    await dependenciesTab.closeModal();

    console.log('\n✅ AGGRESSIVE SEARCH TEST COMPLETED');
    console.log('📁 Screenshots saved: aggressive-search-*.png');
    console.log('💡 Check screenshots to see how the search results appear');
  });
});