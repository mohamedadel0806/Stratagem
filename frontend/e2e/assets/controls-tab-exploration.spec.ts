/**
 * Test to explore Controls tab and control linking functionality
 */
import { test } from '../fixtures/auth-fixed';
import { expect } from '@playwright/test';

test.describe('Controls Tab Exploration', () => {
  test('should explore Controls tab and find control linking functionality', async ({ authenticatedPage }) => {
    console.log('\n🔍 EXPLORING CONTROLS TAB FOR CONTROL LINKING');

    const assetUrl = 'http://localhost:3000/en/dashboard/assets/physical/99cb990a-29e4-4e34-acf4-d58b8261046b';
    const timestamp = Date.now();

    // Step 1: Navigate to asset and open details
    await authenticatedPage.goto(assetUrl);
    await authenticatedPage.waitForLoadState('networkidle');
    await authenticatedPage.waitForTimeout(3000);

    console.log('✅ Asset page loaded');

    // Screenshot initial state
    await authenticatedPage.screenshot({
      path: 'test-results/controls-initial-asset-page.png',
      fullPage: true
    });

    // Step 2: Look for navigation tabs, specifically the Controls tab
    console.log('\n🧭 Looking for navigation tabs...');

    const navTabs = await authenticatedPage.locator('[role="tab"], .tab, button[role="tab"], .nav-item, [data-testid*="tab"]').all();
    let tabs = [];

    for (const tab of navTabs) {
      try {
        const isVisible = await tab.isVisible();
        if (isVisible) {
          const text = await tab.textContent();
          if (text && text.trim()) {
            tabs.push({
              element: tab,
              text: text.trim()
            });
          }
        }
      } catch (e) {
        continue;
      }
    }

    console.log(`📋 Found ${tabs.length} navigation tabs:`, tabs.map(t => t.text));

    // Look specifically for Controls tab
    let controlsTab = null;
    for (const tab of tabs) {
      if (tab.text.toLowerCase().includes('control')) {
        controlsTab = tab;
        console.log(`✅ Found Controls tab: "${tab.text}"`);
        break;
      }
    }

    if (!controlsTab) {
      console.log('⚠️ No Controls tab found in navigation');

      // Try alternative approaches to find controls
      const alternativeSelectors = [
        'a:has-text("Controls")',
        'button:has-text("Controls")',
        '[href*="control"]',
        '[data-testid*="control"]',
        'text:has-text("Controls")',
        '.controls-section'
      ];

      for (const selector of alternativeSelectors) {
        try {
          const element = await authenticatedPage.locator(selector).first();
          if (await element.isVisible()) {
            console.log(`✅ Found controls-related element: ${selector}`);
            controlsTab = { element, text: 'Controls (alternative)' };
            break;
          }
        } catch (e) {
          continue;
        }
      }
    }

    // Step 3: Navigate to Controls tab or explore current page for controls
    if (controlsTab) {
      console.log('\n📍 Navigating to Controls tab...');
      await controlsTab.element.click();
      await authenticatedPage.waitForTimeout(3000);

      // Screenshot Controls tab
      await authenticatedPage.screenshot({
        path: 'test-results/controls-tab-content.png',
        fullPage: true
      });

      console.log('✅ Controls tab loaded');

      // Look for control-related content
      await exploreControlsContent(authenticatedPage, timestamp);

    } else {
      console.log('\n🔍 Exploring current page for any controls content...');
      await exploreControlsContent(authenticatedPage, timestamp);
    }

    // Step 4: Try opening edit modal to see if controls can be linked there
    console.log('\n🔧 Opening edit modal to check for controls in edit mode...');

    const editButton = await authenticatedPage.locator('button:has-text("Edit")').first();
    if (await editButton.isVisible()) {
      await editButton.click();
      await authenticatedPage.waitForTimeout(3000);

      const modal = await authenticatedPage.locator('[role="dialog"]').first();
      expect(await modal.isVisible()).toBe(true);

      console.log('✅ Edit modal opened');

      // Look for control-related tabs in the modal
      const modalTabs = await modal.locator('[role="tab"], .tab, button[role="tab"]').all();
      let modalTabNames = [];

      for (const tab of modalTabs) {
        try {
          const isVisible = await tab.isVisible();
          if (isVisible) {
            const text = await tab.textContent();
            if (text && text.trim()) {
              modalTabNames.push(text.trim());
            }
          }
        } catch (e) {
          continue;
        }
      }

      console.log(`📋 Modal tabs found:`, modalTabNames);

      // Look for Controls or related tab
      let controlsModalTab = null;
      for (let i = 0; i < modalTabs.length; i++) {
        const tabText = modalTabNames[i];
        if (tabText.toLowerCase().includes('control')) {
          controlsModalTab = modalTabs[i];
          console.log(`✅ Found Controls tab in modal: "${tabText}"`);
          break;
        }
      }

      if (controlsModalTab) {
        await controlsModalTab.click();
        await authenticatedPage.waitForTimeout(2000);

        console.log('✅ Controls modal tab clicked');

        // Screenshot controls in modal
        await authenticatedPage.screenshot({
          path: 'test-results/controls-modal-tab.png',
          fullPage: true
        });

        // Look for control linking functionality
        await exploreControlsInModal(authenticatedPage, timestamp);
      }

      // Close modal
      try {
        const cancelButton = await modal.locator('button:has-text("Cancel")').first();
        if (await cancelButton.isVisible()) {
          await cancelButton.click();
          await authenticatedPage.waitForTimeout(2000);
        }
      } catch (e) {
        console.log('Could not close modal normally');
      }
    }

    // Step 5: Try navigating to controls pages directly
    console.log('\n🌐 Exploring controls pages and navigation...');

    const controlUrls = [
      'http://localhost:3000/en/dashboard/governance/controls',
      'http://localhost:3000/en/dashboard/controls',
      'http://localhost:3000/en/dashboard/governance',
      'http://localhost:3000/en/dashboard/assets/physical/99cb990a-29e4-4e34-acf4-d58b8261046b/controls'
    ];

    for (const url of controlUrls) {
      try {
        console.log(`🔍 Trying: ${url}`);
        await authenticatedPage.goto(url);
        await authenticatedPage.waitForTimeout(3000);

        const pageTitle = await authenticatedPage.title();
        const pageVisible = await authenticatedPage.locator('body').isVisible();

        console.log(`  📄 Title: ${pageTitle}`);
        console.log(`  👁️ Page visible: ${pageVisible}`);

        // Look for control-related content
        const controlElements = await authenticatedPage.locator('text:has-text("control")').all();
        console.log(`  📋 Found ${controlElements.length} control-related elements`);

        if (controlElements.length > 0) {
          await authenticatedPage.screenshot({
            path: `test-results/controls-page-${url.split('/').pop() || 'main'}.png`,
            fullPage: true
          });
        }

        // Check if this page has control linking functionality
        const linkButtons = await authenticatedPage.locator('button:has-text("Link"), button:has-text("Add"), button:has-text("Assign")').all();
        if (linkButtons.length > 0) {
          console.log(`  🔗 Found ${linkButtons.length} potential linking buttons`);
        }

      } catch (e) {
        console.log(`  ❌ Error accessing ${url}: ${e}`);
      }
    }

    // Return to original asset page
    await authenticatedPage.goto(assetUrl);
    await authenticatedPage.waitForTimeout(3000);

    console.log('\n📊 CONTROLS TAB EXPLORATION COMPLETE');
    console.log('📁 Screenshots saved in test-results/controls-*.png');

    console.log('\n🎯 FINDINGS SUMMARY:');
    console.log('✅ Navigation tabs explored on asset page');
    console.log('✅ Edit modal tabs investigated for controls');
    console.log('✅ Direct control URLs attempted');
    console.log('ℹ️ Check screenshots to understand current controls state');

  });
});

async function exploreControlsContent(page, timestamp) {
  console.log('🔍 Exploring controls content on current page...');

  // Look for various control-related elements
  const controlSelectors = [
    'text:has-text("Controls")',
    'text:has-text("Linked Controls")',
    'text:has-text("Associated Controls")',
    'text:has-text("Control")',
    '[data-testid*="control"]',
    '.control',
    '.controls',
    'table:has-text("Control")',
    '.list:has-text("Control")',
    'button:has-text("Add Control")',
    'button:has-text("Link Control")',
    'button:has-text("Assign Controls")',
    '.empty-state:has-text("control")',
    '.no-data:has-text("control")'
  ];

  let foundElements = [];

  for (const selector of controlSelectors) {
    try {
      const elements = await page.locator(selector).all();
      for (const element of elements.slice(0, 3)) {
        try {
          const isVisible = await element.isVisible();
          if (isVisible) {
            const text = await element.textContent();
            if (text && text.trim() && text.trim().length > 3) {
              foundElements.push({
                selector,
                text: text.trim().substring(0, 100),
                element
              });
              console.log(`  📋 Found (${selector}): "${text.trim().substring(0, 100)}${text.length > 100 ? '...' : ''}"`);
            }
          }
        } catch (e) {
          continue;
        }
      }
    } catch (e) {
      continue;
    }
  }

  if (foundElements.length === 0) {
    console.log('  ❌ No control-related elements found');

    // Look for empty states or "no data" messages
    const emptyStateSelectors = [
      '.empty-state',
      '.no-data',
      '.no-results',
      'text:has-text("No")',
      'text:has-text("empty")',
      'text:has-text("No data")',
      'text:has-text("No controls")',
      'text:has-text("not found")'
    ];

    for (const selector of emptyStateSelectors) {
      try {
        const elements = await page.locator(selector).all();
        for (const element of elements) {
          if (await element.isVisible()) {
            const text = await element.textContent();
            if (text && text.trim()) {
              console.log(`  📄 Empty state message: "${text.trim()}"`);
            }
          }
        }
      } catch (e) {
        continue;
      }
    }
  }

  // Look for any buttons or actions that might add/link controls
  const actionButtons = await page.locator('button, [role="button"], .btn, a[href]').all();
  let controlActions = [];

  for (const button of actionButtons.slice(0, 10)) {
    try {
      const isVisible = await button.isVisible();
      if (isVisible) {
        const text = await button.textContent();
        if (text && text.trim() && (
          text.toLowerCase().includes('control') ||
          text.toLowerCase().includes('link') ||
          text.toLowerCase().includes('add') ||
          text.toLowerCase().includes('assign') ||
          text.toLowerCase().includes('manage')
        )) {
          controlActions.push({
            text: text.trim(),
            tag: await button.evaluate((el: any) => el.tagName.toLowerCase()),
            href: await button.getAttribute('href')
          });
          console.log(`  🔗 Action button: "${text.trim()}" (${controlActions[controlActions.length - 1].tag})`);
        }
      }
    } catch (e) {
      continue;
    }
  }

  return { foundElements, controlActions };
}

async function exploreControlsInModal(page, timestamp) {
  console.log('🔍 Exploring controls content in modal...');

  // Look for control lists, selectors, or linking interfaces
  const modalControlSelectors = [
    'select:has-text("Control")',
    'select[multiple]',
    'input:has-text("Control")',
    'textarea:has-text("Control")',
    '.control-selector',
    '.control-picker',
    '.control-list',
    '.multiselect',
    'input[type="checkbox"]',
    '.checkbox',
    '[role="option"]',
    '.option'
  ];

  for (const selector of modalControlSelectors) {
    try {
      const elements = await page.locator(selector).all();
      if (elements.length > 0) {
        console.log(`  📋 Found ${elements.length} elements with selector: ${selector}`);

        for (let i = 0; i < Math.min(elements.length, 3); i++) {
          try {
            const element = elements[i];
            const isVisible = await element.isVisible();
            if (isVisible) {
              const text = await element.textContent();
              const tagName = await element.evaluate((el: any) => el.tagName.toLowerCase());
              console.log(`    ${i + 1}. ${tagName.toUpperCase()}: "${text?.trim().substring(0, 50)}${text ? (text.length > 50 ? '...' : '') : ''}"`);
            }
          } catch (e) {
            continue;
          }
        }
      }
    } catch (e) {
      continue;
    }
  }

  // Look for search functionality for controls
  const searchInputs = await page.locator('input[type="search"], input[placeholder*="search"], input[placeholder*="Search"]').all();
  if (searchInputs.length > 0) {
    console.log(`  🔍 Found ${searchInputs.length} search inputs - might be for finding controls`);
  }

  // Look for any "Load", "Browse", "Search" buttons that might load controls
  const loadButtons = await page.locator('button:has-text("Load"), button:has-text("Browse"), button:has-text("Search"), button:has-text("Find")').all();
  if (loadButtons.length > 0) {
    console.log(`  📂 Found ${loadButtons.length} load/search buttons - might load control library`);
  }
}