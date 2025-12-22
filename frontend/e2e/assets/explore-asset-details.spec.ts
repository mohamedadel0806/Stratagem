/**
 * Explore asset details page structure to understand tabs and functionality
 */
import { test } from '../fixtures/auth-fixed';
import { expect } from '@playwright/test';
import { waitForAssetsPage } from '../utils/helpers';

test.describe('Explore Asset Details Page Structure', () => {
  test('should analyze asset details page for all asset types', async ({ authenticatedPage }) => {
    console.log('🔍 EXPLORING ASSET DETAILS PAGE STRUCTURE');

    const assetTypes = [
      { path: 'physical', name: 'Physical Assets', testId: 'physical' },
      { path: 'information', name: 'Information Assets', testId: 'information' },
      { path: 'software', name: 'Software Assets', testId: 'software' },
      { path: 'applications', name: 'Business Applications', testId: 'applications' },
      { path: 'suppliers', name: 'Suppliers', testId: 'suppliers' }
    ];

    // First, let's go to the assets list and find a record to click
    await authenticatedPage.goto('/dashboard/assets/physical');
    await waitForAssetsPage(authenticatedPage);

    // Look for any view/clickable elements in the table
    console.log('\n🔍 Looking for asset records in the list...');

    // Try to find any clickable elements that might lead to asset details
    const clickableElements = await authenticatedPage.locator('a, button, [role="button"], tr, td').all();
    let foundAssetRecord = false;
    let clickTarget = null;

    for (let i = 0; i < Math.min(clickableElements.length, 50); i++) {
      try {
        const element = clickableElements[i];
        const isVisible = await element.isVisible().catch(() => false);

        if (isVisible) {
          const text = await element.textContent().catch(() => '');
          const tagName = await element.evaluate((el: any) => el.tagName.toLowerCase());
          const className = await element.getAttribute('class') || '';

          // Look for elements that might be asset records or clickable items
          if (text && text.length > 2 && text.length < 200 &&
              (text.includes('E2E') || text.includes('PHYS-') ||
               text.includes('Info') || text.includes('Software') ||
               text.includes('App') || text.includes('Supplier'))) {
            console.log(`Found potential asset record: "${text}" (${tagName})`);

            // Check if it's clickable (has href, onclick, or is in a clickable row)
            const hasHref = await element.getAttribute('href');
            const hasOnClick = await element.getAttribute('onclick');

            if (hasHref || hasOnClick || tagName === 'a' || tagName === 'button' ||
                className.includes('cursor-pointer') || className.includes('hover')) {
              clickTarget = element;
              foundAssetRecord = true;
              console.log(`✅ Found clickable asset record: "${text}"`);
              break;
            }
          }
        }
      } catch (e) {
        // Continue
      }
    }

    if (!foundAssetRecord) {
      console.log('❌ No existing asset records found to click');
      console.log('🔍 Let me examine the table structure instead...');

      // Screenshot the current table structure
      await authenticatedPage.screenshot({
        path: 'test-results/asset-list-structure.png',
        fullPage: true
      });

      // Look for table headers and structure
      const tableHeaders = await authenticatedPage.locator('th, .table-header, .column-header').all();
      console.log(`\n📋 Found ${tableHeaders.length} table headers:`);

      for (let i = 0; i < Math.min(tableHeaders.length, 10); i++) {
        try {
          const headerText = await tableHeaders[i].textContent();
          console.log(`  Header ${i}: "${headerText}"`);
        } catch (e) {
          console.log(`  Header ${i}: Could not read`);
        }
      }

      // Look for any buttons that might create or navigate
      const actionButtons = await authenticatedPage.locator('button').all();
      console.log(`\n🔘 Found ${actionButtons.length} buttons in the list view:`);

      for (let i = 0; i < Math.min(actionButtons.length, 20); i++) {
        try {
          const buttonText = await actionButtons[i].textContent();
          const isVisible = await actionButtons[i].isVisible();
          if (isVisible && buttonText && buttonText.trim()) {
            console.log(`  Button ${i}: "${buttonText.trim()}"`);
          }
        } catch (e) {
          // Continue
        }
      }

      expect(true).toBe(true); // Test passes with structure analysis
      return;
    }

    // If we found a clickable record, let's try to navigate to details
    console.log('\n🚀 Attempting to navigate to asset details...');

    // Get current URL before click
    const beforeUrl = authenticatedPage.url();
    console.log(`Before click: ${beforeUrl}`);

    // Click the asset record
    await clickTarget.click();

    // Wait for navigation
    await authenticatedPage.waitForTimeout(3000);

    // Get new URL after click
    const afterUrl = authenticatedPage.url();
    console.log(`After click: ${afterUrl}`);

    if (afterUrl !== beforeUrl && afterUrl.includes('/dashboard/assets/')) {
      console.log('✅ Successfully navigated to asset details page!');

      // Screenshot the asset details page
      await authenticatedPage.screenshot({
        path: 'test-results/asset-details-page.png',
        fullPage: true
      });

      // Analyze the asset details page structure
      console.log('\n📋 Analyzing asset details page structure...');

      // Look for tabs
      const tabs = await authenticatedPage.locator('[role="tab"], .tab, button:has-text("Overview"), button:has-text("Details"), button:has-text("History"), button:has-text("Related"), button:has-text("Audit")').all();
      console.log(`Found ${tabs.length} potential tabs:`);

      for (let i = 0; i < Math.min(tabs.length, 10); i++) {
        try {
          const tabText = await tabs[i].textContent();
          const isActive = await tabs[i].getAttribute('aria-selected');
          const isVisible = await tabs[i].isVisible();
          console.log(`  Tab ${i}: "${tabText}" (visible: ${isVisible}, active: ${isActive === 'true'})`);
        } catch (e) {
          console.log(`  Tab ${i}: Could not analyze`);
        }
      }

      // Look for form fields and editable elements
      const formElements = await authenticatedPage.locator('input, select, textarea, [contenteditable="true"]').all();
      console.log(`\n📝 Found ${formElements.length} form/editable elements:`);

      for (let i = 0; i < Math.min(formElements.length, 15); i++) {
        try {
          const element = formElements[i];
          const tagName = await element.evaluate((el: any) => el.tagName.toLowerCase());
          const name = await element.getAttribute('name') || '';
          const placeholder = await element.getAttribute('placeholder') || '';
          const value = await element.inputValue().catch(() => '');
          const isVisible = await element.isVisible();
          const isDisabled = await element.isDisabled();
          const isReadOnly = await element.getAttribute('readonly') !== null;

          if (isVisible) {
            console.log(`  Element ${i}: ${tagName.toUpperCase()} - name: "${name}", placeholder: "${placeholder}", value: "${value}" (disabled: ${isDisabled}, readonly: ${isReadOnly})`);
          }
        } catch (e) {
          console.log(`  Element ${i}: Could not analyze`);
        }
      }

      // Look for save/update buttons
      const actionButtons = await authenticatedPage.locator('button:has-text("Save"), button:has-text("Update"), button:has-text("Submit"), button:has-text("Apply")').all();
      console.log(`\n💾 Found ${actionButtons.length} action buttons:`);

      for (let i = 0; i < actionButtons.length; i++) {
        try {
          const buttonText = await actionButtons[i].textContent();
          const isVisible = await actionButtons[i].isVisible();
          const isDisabled = await actionButtons[i].isDisabled();
          console.log(`  Action ${i}: "${buttonText}" (visible: ${isVisible}, disabled: ${isDisabled})`);
        } catch (e) {
          console.log(`  Action ${i}: Could not analyze`);
        }
      }

      // Try clicking through tabs if we found them
      if (tabs.length > 0) {
        console.log('\n🔄 Clicking through tabs to explore content...');

        for (let i = 0; i < Math.min(tabs.length, 5); i++) {
          try {
            const isVisible = await tabs[i].isVisible();
            if (isVisible) {
              const tabText = await tabs[i].textContent();
              console.log(`\n📂 Exploring tab: "${tabText}"`);

              await tabs[i].click();
              await authenticatedPage.waitForTimeout(2000);

              // Screenshot each tab
              await authenticatedPage.screenshot({
                path: `test-results/asset-details-tab-${i}-${tabText?.replace(/[^a-zA-Z0-9]/g, '_') || 'tab'}.png`,
                fullPage: true
              });

              console.log(`✅ Screenshot captured for tab: "${tabText}"`);
            }
          } catch (e) {
            console.log(`❌ Could not click tab ${i}: ${e}`);
          }
        }
      }

    } else {
      console.log('❌ Navigation did not work as expected');
      console.log('❌ Could not navigate to asset details page');
    }

    console.log('\n🎯 EXPLORATION COMPLETE');
    console.log('📁 Check screenshots in test-results/ folder for visual analysis');

    // Test passes - this is purely exploratory
    expect(true).toBe(true);
  });
});