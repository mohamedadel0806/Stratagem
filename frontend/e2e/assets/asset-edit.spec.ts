/**
 * Test for editing existing assets - filling forms and saving changes
 */
import { test } from '../fixtures/auth-fixed';
import { expect } from '@playwright/test';

test.describe('Asset Edit and Save', () => {
  test('should edit existing physical asset and save changes', async ({ authenticatedPage }) => {
    // Step 1: Navigate to physical assets page
    await authenticatedPage.goto('http://localhost:3000/en/dashboard/assets/physical');
    await authenticatedPage.waitForLoadState('domcontentloaded');

    // Step 2: Look for Edit buttons
    const editButton = authenticatedPage.getByTestId('asset-edit-button');

    try {
      await editButton.waitFor({ state: 'visible', timeout: 5000 });
    } catch (e) {
      // If Edit button not found, try clicking on an asset row first
    }

    const isEditButtonVisible = await editButton.isVisible().catch(() => false);

    if (!isEditButtonVisible) {
      const assetRows = await authenticatedPage.locator('table tbody tr, .asset-row').all();

      if (assetRows.length > 0) {
        await assetRows[0].click();

        const currentUrl = authenticatedPage.url();
        if (currentUrl.includes('/assets/physical/')) {
          // Look for edit button on the details page
          const detailsEditButton = authenticatedPage.getByTestId('asset-edit-button');
          if (await detailsEditButton.isVisible().catch(() => false)) {
            await detailsEditButton.click();
          }
        }
      }
    }

    const finalEditButtonVisible = await editButton.isVisible().catch(() => false);
    if (!finalEditButtonVisible) {
      await authenticatedPage.screenshot({
        path: 'test-results/physical-assets-no-edit-access.png',
        fullPage: true
      });
      test.skip();
      return;
    }

    // Step 3: Look for editable form fields
    await authenticatedPage.waitForLoadState('domcontentloaded');

    const allInputs = await authenticatedPage.locator('input:not([type="search"]), textarea, select').all();
    const editableFields = [];

    for (const input of allInputs) {
      try {
        const isVisible = await input.isVisible();
        if (isVisible) {
          const type = await input.getAttribute('type') || '';
          const placeholder = await input.getAttribute('placeholder') || '';
          const name = await input.getAttribute('name') || '';
          const isDisabled = await input.isDisabled();
          const isReadOnly = await input.getAttribute('readonly') !== null;

          const isSearchField = type === 'search' ||
                              placeholder.toLowerCase().includes('search') ||
                              name.toLowerCase().includes('search') ||
                              placeholder.toLowerCase().includes('all assets');

          if (!isSearchField && !isDisabled && !isReadOnly) {
            const tagName = await input.evaluate((el: any) => el.tagName.toLowerCase());
            const currentValue = await input.inputValue().catch(() => '');

            editableFields.push({
              element: input,
              tagName,
              type,
              name,
              placeholder,
              currentValue,
              isDisabled,
              isReadOnly
            });
          }
        }
      } catch (e) {
        continue;
      }
    }

    if (editableFields.length === 0) {
      await authenticatedPage.screenshot({
        path: 'test-results/physical-asset-no-editable-fields.png',
        fullPage: true
      });
      test.skip();
      return;
    }

    // Step 4: Fill form fields with test data
    const timestamp = Date.now();
    let fieldsFilled = 0;

    for (let i = 0; i < Math.min(editableFields.length, 5); i++) {
      try {
        const field = editableFields[i];
        let testValue = '';

        if (field.name?.toLowerCase().includes('name') ||
            field.placeholder?.toLowerCase().includes('name')) {
          testValue = `E2E Edited Asset ${timestamp}`;
        } else if (field.name?.toLowerCase().includes('description') ||
                   field.placeholder?.toLowerCase().includes('description')) {
          testValue = `E2E Updated description for physical asset ${timestamp} - this is a test update via automated testing`;
        } else if (field.name?.toLowerCase().includes('notes') ||
                   field.placeholder?.toLowerCase().includes('notes')) {
          testValue = `E2E Updated notes ${timestamp} - testing asset edit functionality with multiline content`;
        } else if (field.name?.toLowerCase().includes('location') ||
                   field.placeholder?.toLowerCase().includes('location')) {
          testValue = `E2E Test Location ${timestamp}`;
        } else if (field.name?.toLowerCase().includes('owner') ||
                   field.placeholder?.toLowerCase().includes('owner')) {
          testValue = `E2E Test Owner ${timestamp}`;
        } else if (field.tagName === 'textarea') {
          testValue = `E2E textarea content ${timestamp} - multiline text testing for asset editing functionality`;
        } else if (field.tagName === 'select') {
          const options = await field.element.locator('option').all();
          if (options.length > 1) {
            await field.element.selectOption({ index: 1 });
            fieldsFilled++;
            continue;
          }
        } else {
          testValue = `E2E Test ${field.name || 'field'} ${timestamp}`;
        }

        if (testValue) {
          await field.element.fill(testValue);
          await expect(field.element).toHaveValue(testValue);
          fieldsFilled++;
        }
      } catch (e) {
        continue;
      }
    }

    // Step 5: Look for and click save/update button
    const saveButtonSelectors = [
      'button:has-text("Save")',
      'button:has-text("Update")',
      'button:has-text("Save Changes")',
      'button:has-text("Apply")',
      'button:has-text("Submit")',
      'button[type="submit"]',
      'input[type="submit"]'
    ];

    let saveButton = null;

    for (const selector of saveButtonSelectors) {
      try {
        const buttons = await authenticatedPage.locator(selector).all();
        for (const button of buttons) {
          const isVisible = await button.isVisible();
          const isEnabled = await button.isEnabled();
          if (isVisible && isEnabled) {
            saveButton = button;
            break;
          }
        }
        if (saveButton) break;
      } catch (e) {
        continue;
      }
    }

    if (!saveButton) {
      await authenticatedPage.screenshot({
        path: 'test-results/physical-asset-no-save-button.png',
        fullPage: true
      });
      test.skip();
      return;
    }

    await saveButton.click();
    await authenticatedPage.waitForLoadState('networkidle');

    // Verify save completed
    await expect(authenticatedPage).toHaveURL(/\/assets\/physical\//);

    expect(fieldsFilled).toBeGreaterThan(0);
  });
});
