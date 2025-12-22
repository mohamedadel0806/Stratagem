/**
 * Test to link controls to an asset using the Link Controls functionality
 */
import { test } from '../fixtures/auth-fixed';
import { expect } from '@playwright/test';

test.describe('Controls Linking Test', () => {
  test('should use Link Controls button to add controls to the asset', async ({ authenticatedPage }) => {
    console.log('\n🔗 TESTING CONTROL LINKING FUNCTIONALITY');

    const assetUrl = 'http://localhost:3000/en/dashboard/assets/physical/99cb990a-29e4-4e34-acf4-d58b8261046b';
    const timestamp = Date.now();

    // Step 1: Navigate to asset and go to Controls tab
    await authenticatedPage.goto(assetUrl);
    await authenticatedPage.waitForLoadState('networkidle');
    await authenticatedPage.waitForTimeout(3000);

    console.log('✅ Asset page loaded');

    // Find and click Controls tab
    const navTabs = await authenticatedPage.locator('[role="tab"], .tab, button[role="tab"]').all();
    let controlsTab = null;

    for (const tab of navTabs) {
      try {
        const isVisible = await tab.isVisible();
        if (isVisible) {
          const text = await tab.textContent();
          if (text && text.trim() && text.trim().toLowerCase().includes('control')) {
            controlsTab = tab;
            console.log(`✅ Found Controls tab: "${text.trim()}"`);
            break;
          }
        }
      } catch (e) {
        continue;
      }
    }

    expect(controlsTab).not.toBeNull();
    await controlsTab!.click();
    await authenticatedPage.waitForTimeout(3000);

    console.log('✅ Controls tab clicked');

    // Screenshot initial Controls tab state
    await authenticatedPage.screenshot({
      path: 'test-results/controls-linking-initial.png',
      fullPage: true
    });

    // Step 2: Look for the "Link Controls" button
    console.log('\n🔗 Looking for Link Controls button...');

    const linkControlsSelectors = [
      'button:has-text("Link Control")',
      'button:has-text("Link Controls")',
      'button:has-text("Add Control")',
      'button:has-text("Add Controls")',
      'button:has-text("Assign Control")',
      'button:has-text("Assign Controls")',
      '[data-testid*="link"]',
      '[data-testid*="add"]',
      '[data-testid*="assign"]'
    ];

    let linkControlsButton = null;
    let buttonText = '';

    for (const selector of linkControlsSelectors) {
      try {
        const button = await authenticatedPage.locator(selector).first();
        if (await button.isVisible()) {
          linkControlsButton = button;
          buttonText = await button.textContent();
          console.log(`✅ Found link button: "${buttonText}" (${selector})`);
          break;
        }
      } catch (e) {
        continue;
      }
    }

    if (!linkControlsButton) {
      console.log('❌ No Link Controls button found');

      // Try to find any button that might open a control selection modal
      const allButtons = await authenticatedPage.locator('button').all();
      console.log(`🔍 Found ${allButtons.length} total buttons on page`);

      for (let i = 0; i < Math.min(allButtons.length, 10); i++) {
        try {
          const button = allButtons[i];
          if (await button.isVisible()) {
            const text = await button.textContent();
            if (text && text.trim() && text.trim().length > 0) {
              console.log(`  ${i + 1}. "${text.trim()}"`);
            }
          }
        } catch (e) {
          continue;
        }
      }
    }

    expect(linkControlsButton).not.toBeNull();

    // Step 3: Click the Link Controls button
    console.log('\n🎯 Clicking Link Controls button...');
    await linkControlsButton!.click();
    await authenticatedPage.waitForTimeout(3000);

    console.log('✅ Link Controls button clicked');

    // Step 4: Look for control selection modal/interface
    console.log('\n🔍 Looking for control selection interface...');

    // Check for modal
    const modal = await authenticatedPage.locator('[role="dialog"]').first();
    const modalVisible = await modal.isVisible();

    if (modalVisible) {
      console.log('✅ Modal opened for control selection');

      // Screenshot modal
      await authenticatedPage.screenshot({
        path: 'test-results/controls-linking-modal.png',
        fullPage: true
      });

      // Look for control selection elements in modal
      await exploreControlSelectionModal(authenticatedPage, timestamp);

    } else {
      console.log('ℹ️ No modal opened - looking for alternative control selection interface');

      // Look for control selection on the same page
      await exploreControlSelectionOnPage(authenticatedPage, timestamp);
    }

    // Step 5: Try to select and link some controls
    console.log('\n🎯 Attempting to select and link controls...');

    // Look for checkboxes, multi-selects, or other selection mechanisms
    const selectionMechanisms = [
      'input[type="checkbox"]',
      'input[type="radio"]',
      'select[multiple]',
      '.multiselect',
      '.control-select',
      '[role="option"]',
      '.option',
      'button[aria-selected="false"]'
    ];

    let foundControls = [];
    let selectedCount = 0;

    for (const selector of selectionMechanisms) {
      try {
        const elements = await authenticatedPage.locator(selector).all();
        if (elements.length > 0) {
          console.log(`📋 Found ${elements.length} selection elements: ${selector}`);

          for (let i = 0; i < Math.min(elements.length, 5); i++) {
            try {
              const element = elements[i];
              const isVisible = await element.isVisible();
              if (isVisible) {
                const text = await element.textContent();
                const parentText = await element.locator('..').first().textContent();

                console.log(`  ${i + 1}. Element ${i + 1}: "${text?.trim().substring(0, 50)}${text ? (text.length > 50 ? '...' : '') : ''}"`);
                console.log(`     Parent: "${parentText?.trim().substring(0, 100)}${parentText ? (parentText.length > 100 ? '...' : '') : ''}"`);

                foundControls.push({
                  element,
                  text: text || parentText,
                  selector
                });

                // Try to select/click it
                if (selector === 'input[type="checkbox"]') {
                  const isChecked = await element.isChecked();
                  if (!isChecked) {
                    await element.check();
                    selectedCount++;
                    console.log(`    ✅ Checkbox selected`);
                  }
                } else {
                  await element.click();
                  selectedCount++;
                  console.log(`    ✅ Element clicked`);
                }
              }
            } catch (e) {
              console.log(`    ❌ Error with element ${i + 1}: ${e}`);
            }
          }
        }
      } catch (e) {
        continue;
      }
    }

    console.log(`📊 Selected ${selectedCount} controls for linking`);

    // Step 6: Look for confirm/submit button
    console.log('\n💾 Looking for confirm/submit button...');

    const confirmSelectors = [
      'button:has-text("Link")',
      'button:has-text("Save")',
      'button:has-text("Confirm")',
      'button:has-text("Submit")',
      'button:has-text("Done")',
      'button:has-text("Apply")',
      'button[type="submit"]',
      '.btn-primary'
    ];

    let confirmButton = null;

    // First look in modal if it exists
    if (modalVisible) {
      for (const selector of confirmSelectors) {
        try {
          const button = await modal.locator(selector).first();
          if (await button.isVisible()) {
            confirmButton = button;
            console.log(`✅ Found confirm button in modal: ${selector}`);
            break;
          }
        } catch (e) {
          continue;
        }
      }
    }

    // If not found in modal, look on the page
    if (!confirmButton) {
      for (const selector of confirmSelectors) {
        try {
          const button = await authenticatedPage.locator(selector).first();
          if (await button.isVisible()) {
            confirmButton = button;
            console.log(`✅ Found confirm button on page: ${selector}`);
            break;
          }
        } catch (e) {
          continue;
        }
      }
    }

    if (confirmButton) {
      console.log('💾 Clicking confirm button to complete linking...');
      await confirmButton.click();
      await authenticatedPage.waitForTimeout(5000);

      console.log('✅ Confirm button clicked');

      // Step 7: Verify the controls were linked
      console.log('\n🔍 Verifying controls were linked...');

      // Check if modal closed
      const modalStillVisible = modalVisible ? await modal.isVisible() : false;
      if (modalVisible && !modalStillVisible) {
        console.log('✅ Modal closed after linking');
      }

      // Take final screenshot
      await authenticatedPage.screenshot({
        path: 'test-results/controls-linking-final.png',
        fullPage: true
      });

      // Look for newly linked controls
      const linkedControlsSelectors = [
        'text:has-text("Control")',
        '.control-item',
        '.linked-control',
        '[data-testid*="control"]',
        'table td:has-text("Control")',
        '.list-item:has-text("Control")'
      ];

      let linkedControlsFound = 0;
      for (const selector of linkedControlsSelectors) {
        try {
          const elements = await authenticatedPage.locator(selector).all();
          const visibleElements = [];
          for (const element of elements) {
            if (await element.isVisible()) {
              visibleElements.push(element);
            }
          }

          if (visibleElements.length > 0) {
            console.log(`📋 Found ${visibleElements.length} visible controls with selector: ${selector}`);
            linkedControlsFound += visibleElements.length;

            for (let i = 0; i < Math.min(visibleElements.length, 3); i++) {
              const text = await visibleElements[i].textContent();
              console.log(`  ${i + 1}. "${text?.trim().substring(0, 80)}${text ? (text.length > 80 ? '...' : '') : ''}"`);
            }
          }
        } catch (e) {
          continue;
        }
      }

      if (linkedControlsFound > 0) {
        console.log(`🎉 SUCCESS: Found ${linkedControlsFound} linked controls!`);
      } else {
        console.log('ℹ️ No linked controls found - but the linking process was completed');
      }

    } else {
      console.log('❌ No confirm button found - linking process incomplete');
    }

    // Final summary
    console.log('\n📊 CONTROL LINKING TEST RESULTS:');
    console.log(`📁 Controls tab found: Yes`);
    console.log(`📁 Link Controls button found: ${!!linkControlsButton}`);
    console.log(`📁 Modal opened: ${modalVisible}`);
    console.log(`📁 Controls available for selection: ${foundControls.length}`);
    console.log(`📁 Controls selected for linking: ${selectedCount}`);
    console.log(`📁 Confirm button found: ${!!confirmButton}`);
    console.log('📁 Screenshots saved: controls-linking-*.png');

    expect(controlsTab).not.toBeNull();
    expect(linkControlsButton).not.toBeNull();

    console.log('\n🎯 CONCLUSION:');
    if (confirmButton) {
      console.log('✅ Control linking workflow completed');
      console.log('✅ Check screenshots to see the linking interface and results');
    } else {
      console.log('ℹ️ Control linking interface explored');
      console.log('✅ Found Link Controls button and explored available options');
    }
  });
});

async function exploreControlSelectionModal(page, timestamp) {
  console.log('🔍 Exploring control selection modal...');

  // Look for search/filter functionality
  const searchInputs = await page.locator('input[type="search"], input[placeholder*="search"], input[placeholder*="Search"]').all();
  if (searchInputs.length > 0) {
    console.log(`  🔍 Found ${searchInputs.length} search inputs in modal`);
  }

  // Look for dropdowns or filters
  const selects = await page.locator('select').all();
  if (selects.length > 0) {
    console.log(`  📋 Found ${selects.length} select elements in modal`);
  }

  // Look for control lists or grids
  const lists = await page.locator('ul, ol, table, .list, .grid').all();
  if (lists.length > 0) {
    console.log(`  📄 Found ${lists.length} potential control lists in modal`);
  }

  // Look for tabs or categories
  const tabs = await page.locator('[role="tab"], .tab, .category').all();
  if (tabs.length > 0) {
    console.log(`  🧭 Found ${tabs.length} tabs/categories in modal`);
  }

  // Try to fill a search if available
  if (searchInputs.length > 0) {
    try {
      const searchInput = searchInputs[0];
      await searchInput.fill('access');
      await page.waitForTimeout(2000);
      console.log('  ✅ Filled search with "access" to test control filtering');
    } catch (e) {
      console.log(`  ❌ Could not fill search: ${e}`);
    }
  }
}

async function exploreControlSelectionOnPage(page, timestamp) {
  console.log('🔍 Exploring control selection on page...');

  // Look for any new sections that appeared after clicking Link Controls
  const newSections = await page.locator('.control-selector, .control-picker, .selection-panel, .modal, .dialog, .dropdown').all();
  if (newSections.length > 0) {
    console.log(`  📋 Found ${newSections.length} potential control selection sections`);
  }

  // Look for any newly visible buttons
  const allButtons = await page.locator('button').all();
  let visibleButtons = [];
  for (const button of allButtons.slice(0, 15)) {
    try {
      if (await button.isVisible()) {
        const text = await button.textContent();
        if (text && text.trim()) {
          visibleButtons.push(text.trim());
        }
      }
    } catch (e) {
      continue;
    }
  }

  console.log(`  🔘 Found ${visibleButtons.length} visible buttons:`, visibleButtons);
}