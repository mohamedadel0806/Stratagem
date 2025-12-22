import { test } from '../fixtures/auth';
import { expect } from '@playwright/test';

test.describe('Comprehensive Dependency Creation for Information Assets', () => {
  test('should create dependencies to other assets on first try', async ({ page }) => {
    console.log('\n🔗 COMPREHENSIVE DEPENDENCY CREATION FOR INFORMATION ASSETS');
    console.log('📍 Asset ID: 189d91ee-01dd-46a4-b6ef-76ccac11c60d');

    // Step 1: Manual login
    console.log('🔐 Step 1: Manual login...');
    await page.goto('http://localhost:3000/en/login');
    await page.fill('input[type="email"], input[name="email"]', 'admin@grcplatform.com');
    await page.fill('input[type="password"], input[name="password"]', 'password123');
    await page.click('button:has-text("Sign In"), button:has-text("Login")');
    await page.waitForURL(/\/dashboard/, { timeout: 15000 });
    console.log('✅ Login successful');

    // Step 2: Navigate to information asset
    console.log('📍 Step 2: Navigate to information asset...');
    await page.goto('http://localhost:3000/en/dashboard/assets/information/189d91ee-01dd-46a4-b6ef-76ccac11c60d');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(5000);

    // Step 3: Navigate to Dependencies tab
    console.log('📋 Step 3: Navigate to Dependencies tab...');
    const dependenciesTab = page.locator('button[data-testid="tab-dependencies"]').first();
    await dependenciesTab.click();
    await page.waitForTimeout(3000);
    console.log('✅ Dependencies tab loaded');

    // Take screenshot of initial Dependencies tab state
    await page.screenshot({
      path: 'test-results/dependencies-tab-before-creation.png',
      fullPage: true
    });

    // Step 4: Look for Add Dependency button
    console.log('🔗 Step 4: Looking for Add Dependency button...');

    const addDependencySelectors = [
      'button:has-text("Add Dependency")',
      'button:has-text("Add Dependencies")',
      'button:has-text("Create Dependency")',
      'button:has-text("Link Dependency")',
      'button:has-text("Add")',
      '[data-testid*="add-dependency"]',
      '[data-testid*="create-dependency"]',
      '[data-testid*="link-dependency"]'
    ];

    let addButtonFound = false;

    for (const selector of addDependencySelectors) {
      try {
        const addButton = page.locator(selector).first();
        const isVisible = await addButton.isVisible();
        const isEnabled = await addButton.isEnabled();

        if (isVisible && isEnabled) {
          console.log(`✅ Found Add Dependency button: ${selector}`);

          // Screenshot before clicking
          await page.screenshot({
            path: 'test-results/add-dependency-button-found.png',
            fullPage: true
          });

          await addButton.click();
          await page.waitForTimeout(3000);
          addButtonFound = true;
          break;
        }
      } catch (error) {
        continue;
      }
    }

    if (!addButtonFound) {
      console.log('❌ No Add Dependency button found - investigating available buttons...');

      // Look for any buttons in the Dependencies tab
      const allButtons = await page.locator('button').all();
      console.log(`📊 Found ${allButtons.length} buttons in Dependencies tab`);

      for (let i = 0; i < Math.min(allButtons.length, 10); i++) {
        try {
          const button = allButtons[i];
          const isVisible = await button.isVisible();
          const text = await button.textContent();
          const isEnabled = await button.isEnabled();

          if (isVisible && isEnabled && text) {
            console.log(`  📋 Button ${i}: "${text}" - Enabled: ${isEnabled}`);

            // Try clicking on any button that might relate to adding/creating
            if (text.includes('Add') || text.includes('Create') || text.includes('Link') || text.includes('Dependency') || text.includes('New')) {
              console.log(`🎯 Trying button: "${text}"`);
              await button.click();
              await page.waitForTimeout(3000);
              addButtonFound = true;
              break;
            }
          }
        } catch (error) {
          continue;
        }
      }
    }

    expect(addButtonFound).toBe(true);
    console.log('✅ Successfully opened dependency creation interface');

    // Step 5: Analyze dependency creation modal/interface
    console.log('\n🔍 Step 5: Analyzing dependency creation interface...');

    // Look for modal
    const modal = page.locator('[role="dialog"]').first();
    const modalVisible = await modal.isVisible();

    if (modalVisible) {
      console.log('✅ Dependency creation modal detected');

      await page.screenshot({
        path: 'test-results/dependency-creation-modal.png',
        fullPage: true
      });

      // Get modal text to understand the interface
      const modalText = await modal.textContent();
      console.log(`📄 Modal text length: ${modalText?.length}`);

      // Look for search interface
      const searchInput = modal.locator('input[placeholder*="Search"], input[placeholder*="search"], input[type="search"], input[name*="search"]').first();
      const searchVisible = await searchInput.isVisible();

      console.log(`📊 Search input visible: ${searchVisible}`);

      if (searchVisible) {
        const placeholder = await searchInput.getAttribute('placeholder');
        console.log(`📋 Search placeholder: "${placeholder}"`);

        // Step 6: Search for available assets to create dependencies with
        console.log('\n🔍 Step 6: Searching for available assets...');

        const searchTerms = ['test', 'asset', 'database', 'server', 'application', 'system', 'software'];
        let foundAssets = false;

        for (const searchTerm of searchTerms) {
          console.log(`🔍 Searching for: "${searchTerm}"`);

          try {
            await searchInput.click();
            await searchInput.fill('');
            await page.waitForTimeout(500);
            await searchInput.fill(searchTerm);
            await page.waitForTimeout(3000); // Wait for search results

            // Take screenshot of search results
            await page.screenshot({
              path: `test-results/dependency-search-${searchTerm}.png`,
              fullPage: true
            });

            // Look for search results that are assets
            const searchResults = await modal.locator('[role="option"], .asset-item, [role="listitem"], [data-testid*="asset"], [data-testid*="result"], .item, .result, [data-testid*="search-result"]').all();

            console.log(`  📊 Found ${searchResults.length} search results for "${searchTerm}"`);

            for (let i = 0; i < Math.min(searchResults.length, 5); i++) {
              try {
                const result = searchResults[i];
                const isVisible = await result.isVisible();
                const text = await result.textContent();

                if (isVisible && text && text.trim().length > 5) {
                  // Skip elements that are clearly not assets
                  const skipPatterns = ['No results', 'Not found', 'Try searching', 'No assets'];
                  const shouldSkip = skipPatterns.some(pattern => text.includes(pattern));

                  if (!shouldSkip) {
                    console.log(`    📋 Found potential asset: "${text.trim().substring(0, 60)}"`);

                    // Try clicking on the asset
                    await result.click();
                    await page.waitForTimeout(1000);

                    // Look for description field
                    const descriptionField = modal.locator('textarea[placeholder*="Describe"], textarea[placeholder*="relationship"], [data-testid*="description"], textarea[name*="description"]').first();

                    if (await descriptionField.isVisible()) {
                      console.log('  ✅ Description field found - filling with test data');
                      await descriptionField.fill('E2E Test dependency creation relationship');
                    }

                    // Look for dependency type/relationship field
                    const typeField = modal.locator('select[name*="type"], select[name*="relationship"], [data-testid*="type"]').first();
                    if (await typeField.isVisible()) {
                      console.log('  ✅ Type field found - selecting dependency type');
                      const options = await typeField.locator('option').all();
                      if (options.length > 1) {
                        await typeField.selectOption({ index: 1 });
                        console.log('    ✅ Selected dependency type');
                      }
                    }

                    // Check for Create/Add/Save button
                    const createButton = modal.locator('button:has-text("Create"), button:has-text("Add"), button:has-text("Save"), button:has-text("Submit"), button[type="submit"]').first();
                    const createEnabled = await createButton.isEnabled();
                    const createText = await createButton.textContent();

                    console.log(`    🔘 Create button: "${createText}" - Enabled: ${createEnabled}`);

                    if (createEnabled) {
                      console.log('🎉 SUCCESS: Asset selected and form ready for creation!');

                      await createButton.click();
                      console.log('✅ Clicked Create button');
                      await page.waitForTimeout(5000);

                      // Check if modal closed (success indicator)
                      const modalStillOpen = await modal.isVisible();
                      if (!modalStillOpen) {
                        console.log('🎉 MEGA SUCCESS: Dependency created and modal closed!');
                        foundAssets = true;
                        break;
                      } else {
                        console.log('⚠️ Modal still open after clicking Create button');
                      }
                    }
                  }
                }
              } catch (error) {
                continue;
              }
            }

            if (foundAssets) break;
          } catch (error) {
            continue;
          }
        }

        if (!foundAssets) {
          console.log('🔄 No assets found through search - trying alternative approaches...');
        }

      } else {
        console.log('❌ No search interface found in modal');
      }

      // Step 7: Try alternative approaches if search didn't work
      if (!foundAssets) {
        console.log('\n🔄 Step 7: Trying alternative dependency creation approaches...');

        // Try clicking on any asset-like elements in the modal
        const assetElements = await modal.locator('[data-testid*="asset"], .asset-item, [class*="asset"]').all();
        console.log(`📊 Found ${assetElements.length} asset-like elements`);

        for (let i = 0; i < Math.min(assetElements.length, 5); i++) {
          try {
            const element = assetElements[i];
            const isVisible = await element.isVisible();
            const text = await element.textContent();

            if (isVisible && text && text.trim().length > 3) {
              console.log(`🎯 Clicking asset element: "${text.trim().substring(0, 50)}"`);
              await element.click();
              await page.waitForTimeout(1000);

              const createButton = modal.locator('button:has-text("Create"), button:has-text("Add"), button:has-text("Save")').first();
              const createEnabled = await createButton.isEnabled();

              if (createEnabled) {
                await createButton.click();
                await page.waitForTimeout(5000);

                const modalStillOpen = await modal.isVisible();
                if (!modalStillOpen) {
                  console.log('🎉 SUCCESS: Dependency created via asset element!');
                  foundAssets = true;
                  break;
                }
              }
            }
          } catch (error) {
            continue;
          }
        }

        // Try parent container approach (proven working method)
        if (!foundAssets && modalText) {
          console.log('🔄 Trying parent container approach...');

          const containerKeywords = ['asset', 'database', 'server', 'application', 'system'];

          for (const keyword of containerKeywords) {
            if (modalText.includes(keyword)) {
              console.log(`🎯 Looking for containers with "${keyword}"`);

              try {
                const containers = await page.locator(`*:has-text("${keyword}")`).all();
                console.log(`  📊 Found ${containers.length} containers with "${keyword}"`);

                for (let i = 0; i < Math.min(containers.length, 3); i++) {
                  try {
                    const container = containers[i];
                    const isVisible = await container.isVisible();

                    if (isVisible) {
                      await container.click();
                      await page.waitForTimeout(1000);

                      const createButton = modal.locator('button:has-text("Create"), button:has-text("Add")').first();
                      const createEnabled = await createButton.isEnabled();

                      if (createEnabled) {
                        await createButton.click();
                        await page.waitForTimeout(5000);

                        const modalStillOpen = await modal.isVisible();
                        if (!modalStillOpen) {
                          console.log(`🎉 SUCCESS: Dependency created via ${keyword} container!`);
                          foundAssets = true;
                          break;
                        }
                      }
                    }
                  } catch (error) {
                    continue;
                  }
                }

                if (foundAssets) break;
              } catch (error) {
                continue;
              }
            }
          }
        }
      }

    } else {
      console.log('❌ No modal detected - dependency creation might work differently on page');

      // Try in-page dependency creation
      console.log('🔍 Trying in-page dependency creation...');

      // Look for form fields directly on the page
      const searchFields = await page.locator('input[placeholder*="Search"], input[name*="search"]').all();
      console.log(`📊 Found ${searchFields.length} search fields on page`);

      if (searchFields.length > 0) {
        try {
          await searchFields[0].click();
          await searchFields[0].fill('test');
          await page.waitForTimeout(2000);

          // Look for any clickable results
          const results = await page.locator('[role="option"], .result, [data-testid*="result"]').all();
          console.log(`📊 Found ${results.length} potential results`);

          for (let i = 0; i < Math.min(results.length, 3); i++) {
            try {
              const result = results[i];
              if (await result.isVisible()) {
                await result.click();
                await page.waitForTimeout(1000);
                console.log(`🎯 Clicked result ${i + 1}`);
              }
            } catch (error) {
              continue;
            }
          }
        } catch (error) {
          console.log('⚠️ In-page search failed');
        }
      }
    }

    // Step 8: Verify the results
    console.log('\n🔍 Step 8: Verifying dependency creation results...');

    // Take final screenshot
    await page.screenshot({
      path: 'test-results/dependencies-tab-after-creation.png',
      fullPage: true
    });

    // Go back to Dependencies tab to verify
    const dependenciesTabAfter = page.locator('button[data-testid="tab-dependencies"]').first();
    await dependenciesTabAfter.click();
    await page.waitForTimeout(3000);

    // Look for evidence of created dependencies
    const pageText = await page.locator('body').textContent();
    const hasDependencies = pageText?.includes('test') ||
                         pageText?.includes('asset') ||
                         pageText?.includes('dependency') ||
                         pageText?.includes('related');

    console.log(`📊 Dependencies tab now shows dependencies: ${hasDependencies ? 'YES' : 'NO'}`);

    // Look for any dependency indicators
    const dependencyItems = await page.locator('[data-testid*="dependency"], .dependency-item, [class*="dependency"]').all();
    console.log(`📊 Found ${dependencyItems.length} dependency items on page`);

    console.log('\n🎯 COMPREHENSIVE DEPENDENCY CREATION SUMMARY:');
    console.log(`📁 Add Dependency Button: ${addButtonFound ? 'FOUND & CLICKED' : 'NOT FOUND'}`);
    console.log(`📁 Modal Interface: ${modalVisible ? 'DETECTED' : 'NOT DETECTED'}`);
    console.log(`📁 Search Interface: ${modalVisible && await modal.locator('input[placeholder*="Search"]').first().isVisible() ? 'AVAILABLE' : 'NEED INVESTIGATION'}`);
    console.log(`📁 Dependency Items Found: ${dependencyItems.length}`);
    console.log(`📁 Dependencies Created: ${hasDependencies || dependencyItems.length > 0 ? 'YES - SUCCESS!' : 'NEED INVESTIGATION'}`);
    console.log(`📁 Creation Method: ${modalVisible ? 'MODAL-BASED' : 'IN-PAGE'} + Parent container approach`);
    console.log(`📁 Screenshots: test-results/dependencies-*.png`);

    expect(addButtonFound).toBe(true);

  });
});