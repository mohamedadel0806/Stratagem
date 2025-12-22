/**
 * Debug test to understand how asset editing works
 */
import { test } from '../fixtures/auth-fixed';
import { expect } from '@playwright/test';

test('debug asset edit functionality', async ({ authenticatedPage }) => {
  console.log('\n🔍 DEBUGGING ASSET EDIT FUNCTIONALITY');

  // Navigate to physical assets page
  await authenticatedPage.goto('http://localhost:3000/en/dashboard/assets/physical');
  await authenticatedPage.waitForLoadState('networkidle');
  await authenticatedPage.waitForTimeout(5000);

  // Screenshot initial state
  await authenticatedPage.screenshot({
    path: 'test-results/debug-asset-list.png',
    fullPage: true
  });

  // Find and click the first Edit button
  const editButtons = await authenticatedPage.locator('button:has-text("Edit")').all();
  console.log(`Found ${editButtons.length} Edit buttons`);

  if (editButtons.length > 0) {
    const firstEditButton = editButtons[0];

    // Screenshot before clicking
    await authenticatedPage.screenshot({
      path: 'test-results/debug-before-edit-click.png',
      fullPage: true
    });

    console.log('Clicking first Edit button...');
    await firstEditButton.click();

    // Wait for any navigation or modal
    await authenticatedPage.waitForTimeout(5000);

    // Screenshot after clicking edit
    await authenticatedPage.screenshot({
      path: 'test-results/debug-after-edit-click.png',
      fullPage: true
    });

    // Check current URL
    const currentUrl = authenticatedPage.url();
    console.log(`Current URL after clicking Edit: ${currentUrl}`);

    // Look for any modals or dialogs
    const modalSelectors = [
      '.modal',
      '.dialog',
      '[role="dialog"]',
      '.popup',
      '.overlay',
      '[data-testid="modal"]',
      '[data-testid="dialog"]'
    ];

    console.log('Looking for modals or dialogs...');
    for (const selector of modalSelectors) {
      try {
        const modals = await authenticatedPage.locator(selector).all();
        const visibleModals = [];
        for (const modal of modals) {
          if (await modal.isVisible()) {
            visibleModals.push(modal);
          }
        }
        if (visibleModals.length > 0) {
          console.log(`Found ${visibleModals.length} visible modals with selector: ${selector}`);

          // Get modal content
          const modalText = await visibleModals[0].textContent();
          console.log(`Modal content: ${modalText?.substring(0, 200)}...`);
        }
      } catch (e) {
        // Continue
      }
    }

    // Look for any form that appeared
    const formSelectors = [
      'form',
      '.form',
      '[data-testid="form"]',
      'fieldset',
      '.edit-form'
    ];

    console.log('Looking for forms...');
    for (const selector of formSelectors) {
      try {
        const forms = await authenticatedPage.locator(selector).all();
        const visibleForms = [];
        for (const form of forms) {
          if (await form.isVisible()) {
            visibleForms.push(form);
          }
        }
        if (visibleForms.length > 0) {
          console.log(`Found ${visibleForms.length} visible forms with selector: ${selector}`);
        }
      } catch (e) {
        // Continue
      }
    }

    // Look for any new input fields
    const allInputs = await authenticatedPage.locator('input, textarea, select').all();
    console.log(`Total input elements found: ${allInputs.length}`);

    let inputDetails = [];
    for (let i = 0; i < Math.min(allInputs.length, 10); i++) {
      try {
        const input = allInputs[i];
        const isVisible = await input.isVisible();
        if (isVisible) {
          const type = await input.getAttribute('type') || '';
          const placeholder = await input.getAttribute('placeholder') || '';
          const name = await input.getAttribute('name') || '';
          const value = await input.inputValue().catch(() => '');
          const isDisabled = await input.isDisabled();

          inputDetails.push({
            index: i,
            type,
            name,
            placeholder,
            value: value.substring(0, 50),
            isDisabled
          });
        }
      } catch (e) {
        // Continue
      }
    }

    console.log('Input details:');
    inputDetails.forEach(input => {
      console.log(`  Input ${input.index}: type="${input.type}", name="${input.name}", placeholder="${input.placeholder}", value="${input.value}", disabled=${input.isDisabled}`);
    });

    // Look for any new buttons that appeared
    const allButtons = await authenticatedPage.locator('button').all();
    console.log(`Total buttons found: ${allButtons.length}`);

    let buttonDetails = [];
    for (let i = 0; i < Math.min(allButtons.length, 15); i++) {
      try {
        const button = allButtons[i];
        const isVisible = await button.isVisible();
        if (isVisible) {
          const text = await button.textContent();
          const isEnabled = await button.isEnabled();

          if (text && text.trim()) {
            buttonDetails.push({
              index: i,
              text: text.trim(),
              isEnabled
            });
          }
        }
      } catch (e) {
        // Continue
      }
    }

    console.log('Button details:');
    buttonDetails.forEach(button => {
      console.log(`  Button ${button.index}: "${button.text}", enabled=${button.isEnabled}`);
    });

    // Try alternative approach - maybe clicking on the asset row first
    console.log('\nTrying alternative approach - clicking asset row first...');

    // Go back to asset list
    await authenticatedPage.goto('http://localhost:3000/en/dashboard/assets/physical');
    await authenticatedPage.waitForTimeout(3000);

    // Try clicking on an asset row
    const assetRows = await authenticatedPage.locator('table tbody tr').all();
    console.log(`Found ${assetRows.length} asset rows`);

    if (assetRows.length > 0) {
      await assetRows[0].click();
      await authenticatedPage.waitForTimeout(5000);

      // Check where we are now
      const afterClickUrl = authenticatedPage.url();
      console.log(`URL after clicking asset row: ${afterClickUrl}`);

      // Screenshot after clicking row
      await authenticatedPage.screenshot({
        path: 'test-results/debug-after-row-click.png',
        fullPage: true
      });

      // Now look for Edit button on details page
      const detailEditButtons = await authenticatedPage.locator('button:has-text("Edit")').all();
      console.log(`Found ${detailEditButtons.length} Edit buttons on details page`);

      if (detailEditButtons.length > 0) {
        await detailEditButtons[0].click();
        await authenticatedPage.waitForTimeout(5000);

        // Screenshot after clicking details edit
        await authenticatedPage.screenshot({
          path: 'test-results/debug-after-details-edit.png',
          fullPage: true
        });

        // Check for forms again
        const finalForms = await authenticatedPage.locator('form, fieldset').all();
        console.log(`Found ${finalForms.length} forms after details edit`);

        // Check for inputs again
        const finalInputs = await authenticatedPage.locator('input, textarea, select').all();
        let editableCount = 0;
        for (const input of finalInputs) {
          try {
            const isVisible = await input.isVisible();
            const isDisabled = await input.isDisabled();
            const isReadOnly = await input.getAttribute('readonly') !== null;

            if (isVisible && !isDisabled && !isReadOnly) {
              editableCount++;
            }
          } catch (e) {
            // Continue
          }
        }
        console.log(`Found ${editableCount} editable inputs after details edit`);
      }
    }
  }

  console.log('\n🔍 DEBUG COMPLETE - Check screenshots in test-results/');
});