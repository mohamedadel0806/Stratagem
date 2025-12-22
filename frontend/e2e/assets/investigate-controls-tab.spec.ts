import { test } from '../fixtures/auth';
import { expect } from '@playwright/test';

test.describe('Investigate Information Asset Controls Tab', () => {
  test('should investigate actual controls tab content and find real controls', async ({ page }) => {
    console.log('\n🔍 INVESTIGATING INFORMATION ASSET CONTROLS TAB');

    // Step 1: Login and navigate to asset
    console.log('🔐 Step 1: Manual login...');
    await page.goto('http://localhost:3000/en/login');
    await page.fill('input[type="email"], input[name="email"]', 'admin@grcplatform.com');
    await page.fill('input[type="password"], input[name="password"]', 'password123');
    await page.click('button:has-text("Sign In"), button:has-text("Login")');
    await page.waitForURL(/\/dashboard/, { timeout: 15000 });
    console.log('✅ Login successful');

    // Step 2: Navigate to information asset
    console.log('📍 Step 2: Navigating to information asset...');
    await page.goto('http://localhost:3000/en/dashboard/assets/information/189d91ee-01dd-46a4-b6ef-76ccac11c60d');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(5000);

    // Step 3: Navigate to Controls tab
    console.log('📋 Step 3: Navigating to Controls tab...');

    const controlsTabSelectors = [
      'button[data-testid="tab-controls"]',
      '[role="tab"]:has-text("Controls")',
      'button:has-text("Controls")'
    ];

    let controlsTabFound = false;
    for (const selector of controlsTabSelectors) {
      try {
        const controlsTab = page.locator(selector).first();
        const isVisible = await controlsTab.isVisible();
        if (isVisible) {
          console.log(`✅ Found Controls tab: ${selector}`);
          await controlsTab.click();
          await page.waitForTimeout(3000);
          controlsTabFound = true;
          break;
        }
      } catch (error) {
        continue;
      }
    }

    expect(controlsTabFound).toBe(true);
    console.log('✅ Successfully navigated to Controls tab');

    // Step 4: Detailed investigation of Controls tab content
    console.log('\n🔍 Step 4: Detailed investigation of Controls tab content...');

    // Take screenshot of Controls tab
    await page.screenshot({
      path: 'test-results/investigate-controls-tab.png',
      fullPage: true
    });

    // Look for all text content in the Controls tab
    const allText = await page.locator('body').textContent();
    console.log('📄 Full page text length:', allText?.length);

    // Look for Link Controls button
    console.log('\n🔗 Looking for Link Controls button...');

    const linkButtonSelectors = [
      'button:has-text("Link Controls")',
      'button:has-text("Link")',
      'button:has-text("Add Controls")',
      'button:has-text("Associate Controls")',
      '[data-testid*="link"]',
      '[data-testid*="add"]',
      '[data-testid*="control"]'
    ];

    let linkButtonFound = false;
    for (const selector of linkButtonSelectors) {
      try {
        const button = page.locator(selector).first();
        const isVisible = await button.isVisible();
        const isEnabled = await button.isEnabled();
        const text = await button.textContent();

        if (isVisible) {
          console.log(`  📋 Found button: "${text}" (${selector}) - Visible: ${isVisible}, Enabled: ${isEnabled}`);
          if (text && (text.includes('Link') || text.includes('Add') || text.includes('Associate'))) {
            linkButtonFound = true;
          }
        }
      } catch (error) {
        continue;
      }
    }

    console.log(`📊 Link Controls button found: ${linkButtonFound}`);

    // Look for existing controls
    console.log('\n📋 Looking for existing controls...');

    const existingControlSelectors = [
      'text:has-text("Control")',
      '[data-testid*="control"]',
      '.control-item',
      '.control-row',
      'tr:has-text("control")',
      'li:has-text("control")',
      'div:has-text("Control")',
      '[class*="control"]'
    ];

    let existingControlsFound = 0;
    for (const selector of existingControlSelectors) {
      try {
        const elements = page.locator(selector).all();
        const count = await elements.count();
        if (count > 0) {
          console.log(`  📋 Found ${count} elements with selector: ${selector}`);

          // Show first few elements
          for (let i = 0; i < Math.min(count, 3); i++) {
            try {
              const element = elements.nth(i);
              const text = await element.textContent();
              if (text && text.trim() && text.trim().length > 5) {
                console.log(`    ${i + 1}. "${text.trim().substring(0, 100)}${text.length > 100 ? '...' : ''}"`);
                existingControlsFound++;
              }
            } catch (error) {
              continue;
            }
          }
        }
      } catch (error) {
        continue;
      }
    }

    console.log(`📊 Total existing controls found: ${existingControlsFound}`);

    // Look for "Not Implemented" or placeholder text
    console.log('\n🚫 Looking for placeholder or "Not Implemented" content...');

    const placeholderSelectors = [
      'text:has-text("Not Implemented")',
      'text:has-text("Coming Soon")',
      'text:has-text("Under Development")',
      'text:has-text("Placeholder")',
      'button:has-text("Not Implemented")'
    ];

    let placeholdersFound = 0;
    for (const selector of placeholderSelectors) {
      try {
        const elements = page.locator(selector).all();
        const count = await elements.count();
        if (count > 0) {
          console.log(`  📋 Found ${count} placeholder elements: ${selector}`);

          for (let i = 0; i < count; i++) {
            try {
              const element = elements.nth(i);
              const text = await element.textContent();
              if (text && text.trim()) {
                console.log(`    ${i + 1}. "${text.trim()}"`);
                placeholdersFound++;
              }
            } catch (error) {
              continue;
            }
          }
        }
      } catch (error) {
        continue;
      }
    }

    console.log(`📊 Total placeholder elements found: ${placeholdersFound}`);

    // Step 5: Try to open Link Controls modal if button exists
    if (linkButtonFound) {
      console.log('\n🔗 Step 5: Opening Link Controls modal...');

      for (const selector of linkButtonSelectors) {
        try {
          const button = page.locator(selector).first();
          const isVisible = await button.isVisible();
          const isEnabled = await button.isEnabled();
          const text = await button.textContent();

          if (isVisible && isEnabled && text && text.includes('Link')) {
            console.log(`✅ Clicking: "${text}"`);
            await button.click();
            await page.waitForTimeout(3000);

            // Look for modal
            const modal = page.locator('[role="dialog"]').first();
            const modalVisible = await modal.isVisible();

            if (modalVisible) {
              console.log('✅ Modal opened successfully');

              // Wait longer for controls to load
              console.log('⏳ Waiting for controls to load...');
              await page.waitForTimeout(5000);

              // Screenshot modal
              await page.screenshot({
                path: 'test-results/investigate-controls-modal.png',
                fullPage: true
              });

              // Comprehensive modal content investigation
              console.log('\n🔍 Comprehensive modal content investigation...');

              // Look for search/filter inputs
              const searchInputs = await modal.locator('input[placeholder*="search"], input[placeholder*="Search"], input[placeholder*="filter"], input[type="search"]').all();
              console.log(`📊 Found ${searchInputs.length} search/filter inputs`);

              for (let i = 0; i < Math.min(searchInputs.length, 3); i++) {
                try {
                  const input = searchInputs[i];
                  const placeholder = await input.getAttribute('placeholder');
                  const isVisible = await input.isVisible();
                  console.log(`  📋 Search input ${i + 1}: "${placeholder}" - Visible: ${isVisible}`);
                } catch (error) {
                  continue;
                }
              }

              // Look for any loading indicators
              const loadingIndicators = await modal.locator('text:has-text("Loading"), text:has-text("Loading..."), .loading, .spinner').all();
              console.log(`📊 Found ${loadingIndicators.length} loading indicators`);

              // Look for all interactive elements in modal
              const allInteractive = await modal.locator('button, a, input, select, [role="button"], [role="option"], [role="checkbox"]').all();
              console.log(`📊 Found ${allInteractive.length} interactive elements in modal`);

              // Categorize interactive elements
              let buttons = 0;
              let inputs = 0;
              let selects = 0;
              let checkboxes = 0;
              let options = 0;

              for (let i = 0; i < Math.min(allInteractive.length, 20); i++) {
                try {
                  const element = allInteractive[i];
                  const isVisible = await element.isVisible();
                  const tagName = await element.evaluate((el: any) => el.tagName.toLowerCase());
                  const role = await element.getAttribute('role') || '';
                  const type = await element.getAttribute('type') || '';
                  const text = await element.textContent();

                  if (isVisible) {
                    if (tagName === 'button') buttons++;
                    else if (tagName === 'input' && type === 'checkbox') checkboxes++;
                    else if (tagName === 'input' && type === 'radio') options++;
                    else if (tagName === 'input') inputs++;
                    else if (tagName === 'select') selects++;
                    else if (role === 'button') buttons++;
                    else if (role === 'option') options++;
                    else if (role === 'checkbox') checkboxes++;

                    // Log first few elements with meaningful content
                    if (i < 10 && text && text.trim() && text.trim().length > 3) {
                      console.log(`  📋 Element ${i + 1}: ${tagName.toUpperCase()} (role: ${role}, type: ${type}) - "${text.trim().substring(0, 60)}${text.length > 60 ? '...' : ''}"`);
                    }
                  }
                } catch (error) {
                  continue;
                }
              }

              console.log(`📊 Interactive elements breakdown: ${buttons} buttons, ${inputs} inputs, ${selects} selects, ${checkboxes} checkboxes, ${options} options`);

              // Look specifically for control-related content using broader patterns
              const controlPatterns = [
                'text:has-text("control")',
                'text:has-text("Control")',
                'text:has-text("CONTROL")',
                '[class*="control"]',
                '[id*="control"]',
                '[data-testid*="control"]',
                '[aria-label*="control"]'
              ];

              let controlElements = 0;
              for (const pattern of controlPatterns) {
                try {
                  const elements = await modal.locator(pattern).all();
                  const count = await elements.count();
                  if (count > 0) {
                    console.log(`  📋 Pattern "${pattern}": ${count} elements`);
                    controlElements += count;

                    // Show first few elements from this pattern
                    for (let i = 0; i < Math.min(count, 3); i++) {
                      try {
                        const element = elements.nth(i);
                        const text = await element.textContent();
                        const isVisible = await element.isVisible();
                        if (isVisible && text && text.trim() && text.trim().length > 5) {
                          console.log(`    - "${text.trim().substring(0, 80)}${text.length > 80 ? '...' : ''}"`);
                        }
                      } catch (error) {
                        continue;
                      }
                    }
                  }
                } catch (error) {
                  continue;
                }
              }

              console.log(`📊 Total control-related elements: ${controlElements}`);

              // Look for empty state or no-data messages
              const emptyStatePatterns = [
                'text:has-text("No controls")',
                'text:has-text("No data")',
                'text:has-text("Empty")',
                'text:has-text("No results")',
                'text:has-text("Try searching")'
              ];

              for (const pattern of emptyStatePatterns) {
                try {
                  const elements = await modal.locator(pattern).all();
                  const count = await elements.count();
                  if (count > 0) {
                    console.log(`  📋 Empty state: ${pattern} - ${count} elements`);
                    for (let i = 0; i < count; i++) {
                      try {
                        const text = await elements.nth(i).textContent();
                        console.log(`    - "${text}"`);
                      } catch (error) {
                        continue;
                      }
                    }
                  }
                } catch (error) {
                  continue;
                }
              }

              // Look for Link/Submit button in modal
              const modalSubmitButtons = await modal.locator('button:has-text("Link"), button:has-text("Submit"), button:has-text("Confirm"), button:has-text("Save"), button:has-text("Done")').all();
              console.log(`📊 Found ${modalSubmitButtons.length} submit buttons in modal`);

              for (let i = 0; i < modalSubmitButtons.length; i++) {
                try {
                  const button = modalSubmitButtons[i];
                  const text = await button.textContent();
                  const isEnabled = await button.isEnabled();
                  console.log(`  📋 Submit button ${i + 1}: "${text}" - Enabled: ${isEnabled}`);
                } catch (error) {
                  continue;
                }
              }

              break;
            } else {
              console.log('❌ No modal detected after clicking button');
            }

            break;
          }
        } catch (error) {
          continue;
        }
      }
    }

    // Final summary
    console.log('\n📊 INVESTIGATION SUMMARY:');
    console.log(`📁 Controls Tab: ${controlsTabFound ? 'FOUND' : 'NOT FOUND'}`);
    console.log(`📁 Link Controls Button: ${linkButtonFound ? 'FOUND' : 'NOT FOUND'}`);
    console.log(`📁 Existing Controls: ${existingControlsFound}`);
    console.log(`📁 Placeholder Elements: ${placeholdersFound}`);
    console.log(`📁 Screenshots: investigate-controls-tab.png, investigate-controls-modal.png`);

    expect(controlsTabFound).toBe(true);
  });
});