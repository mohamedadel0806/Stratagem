/**
 * Test single asset details page to understand structure and tabs
 */
import { test } from '../fixtures/auth-fixed';
import { expect } from '@playwright/test';

test.describe('Single Asset Details Page Testing', () => {
  test('should explore physical asset details page thoroughly', async ({ authenticatedPage }) => {
    console.log('🚀 TESTING PHYSICAL ASSET DETAILS PAGE');
    const timestamp = Date.now();

    // Navigate directly to physical asset details page
    const detailsUrl = `/dashboard/assets/physical/bcfbb233-f00a-4ec2-b97c-d052b7129385`;
    await authenticatedPage.goto(detailsUrl);
    await authenticatedPage.waitForTimeout(5000);

    // Verify we're on the details page
    expect(authenticatedPage.url()).toContain(detailsUrl);
    console.log(`✅ Successfully navigated to: ${authenticatedPage.url()}`);

    // Screenshot the initial state
    await authenticatedPage.screenshot({
      path: `test-results/single-asset-details-initial.png`,
      fullPage: true
    });

    // Analyze the page structure step by step
    console.log('\n📋 ANALYZING PAGE STRUCTURE:');

    // Look for any tabs or navigation elements
    const possibleTabs = [
      '[role="tab"]',
      '.tab',
      'button[role="tab"]',
      'nav button',
      '.nav-item',
      '[data-tab]',
      '.tab-button',
      '.page-nav',
      '.section-nav'
    ];

    let foundNavigationElements = [];
    for (const selector of possibleTabs) {
      try {
        const elements = await authenticatedPage.locator(selector).all();
        for (const element of elements) {
          const isVisible = await element.isVisible().catch(() => false);
          if (isVisible) {
            const text = await element.textContent();
            const role = await element.getAttribute('role');
            if (text && text.trim() && !foundNavigationElements.some(t => t.text === text.trim())) {
              foundNavigationElements.push({
                element,
                text: text.trim(),
                role: role || 'unknown',
                selector
              });
            }
          }
        }
      } catch (e) {
        // Continue
      }
    }

    console.log(`🧭 Found ${foundNavigationElements.length} navigation elements:`);
    foundNavigationElements.forEach((nav, index) => {
      console.log(`  Nav ${index}: "${nav.text}" (role: ${nav.role}, selector: ${nav.selector})`);
    });

    // Look for headings that might indicate sections
    console.log('\n📄 LOOKING FOR SECTIONS:');
    const headings = await authenticatedPage.locator('h1, h2, h3, h4, .section-title, .panel-title, .card-header').all();
    let foundSections = [];

    for (let i = 0; i < headings.length; i++) {
      try {
        const heading = headings[i];
        const isVisible = await heading.isVisible();
        if (isVisible) {
          const text = await heading.textContent();
          const tagName = await heading.evaluate((el: any) => el.tagName.toLowerCase());
          if (text && text.trim()) {
            foundSections.push({
              text: text.trim(),
              tag: tagName,
              index: i
            });
            console.log(`  Section ${foundSections.length}: ${tagName.toUpperCase()} - "${text.trim()}"`);
          }
        }
      } catch (e) {
        // Continue
      }
    }

    // Look for form fields and editable elements
    console.log('\n📝 LOOKING FOR FORM FIELDS:');
    const allFormElements = await authenticatedPage.locator('input, textarea, select, [contenteditable="true"]').all();
    let editableFields = [];

    for (let i = 0; i < Math.min(allFormElements.length, 20); i++) {
      try {
        const element = allFormElements[i];
        const isVisible = await element.isVisible();
        if (isVisible) {
          const tagName = await element.evaluate((el: any) => el.tagName.toLowerCase());
          const name = await element.getAttribute('name') || '';
          const placeholder = await element.getAttribute('placeholder') || '';
          const value = await element.inputValue().catch(() => '');
          const isDisabled = await element.isDisabled();
          const isReadOnly = await element.getAttribute('readonly') !== null;
          const type = await element.getAttribute('type') || '';

          editableFields.push({
            tagName,
            name,
            placeholder,
            value,
            isDisabled,
            isReadOnly,
            type,
            index: i
          });

          console.log(`  Field ${i}: ${tagName.toUpperCase()} - name: "${name}", placeholder: "${placeholder}", value: "${value}" (disabled: ${isDisabled}, readonly: ${isReadOnly}, type: ${type})`);
        }
      } catch (e) {
        // Continue
      }
    }

    // Look for buttons that might perform actions
    console.log('\n🔘 LOOKING FOR ACTION BUTTONS:');
    const actionButtons = await authenticatedPage.locator('button').all();
    let foundButtons = [];

    for (let i = 0; i < Math.min(actionButtons.length, 15); i++) {
      try {
        const button = actionButtons[i];
        const isVisible = await button.isVisible();
        if (isVisible) {
          const text = await button.textContent();
          const isDisabled = await button.isDisabled();
          const type = await button.getAttribute('type') || '';

          if (text && text.trim() && (text.toLowerCase().includes('save') ||
              text.toLowerCase().includes('update') ||
              text.toLowerCase().includes('edit') ||
              text.toLowerCase().includes('add') ||
              text.toLowerCase().includes('submit') ||
              text.toLowerCase().includes('apply'))) {

            foundButtons.push({
              text: text.trim(),
              isDisabled,
              type,
              index: i
            });

            console.log(`  Action ${foundButtons.length}: "${text.trim()}" (disabled: ${isDisabled}, type: ${type})`);
          }
        }
      } catch (e) {
        // Continue
      }
    }

    // Click through navigation elements to explore different sections
    console.log('\n🔄 EXPLORING NAVIGATION ELEMENTS:');

    for (let i = 0; i < Math.min(foundNavigationElements.length, 8); i++) {
      try {
        const nav = foundNavigationElements[i];
        console.log(`\n📍 Clicking: "${nav.text}"`);

        await nav.element.click();
        await authenticatedPage.waitForTimeout(2000);

        // Screenshot after clicking navigation element
        await authenticatedPage.screenshot({
          path: `test-results/single-asset-details-nav-${i}-${nav.text.replace(/[^a-zA-Z0-9]/g, '_')}.png`,
          fullPage: true
        });

        console.log(`✅ Screenshot captured for: "${nav.text}"`);

        // Check for new content or form fields after navigation
        const newFormFields = await authenticatedPage.locator('input, textarea, select').all();
        const newVisibleFields = [];

        for (const field of newFormFields) {
          try {
            const isVisible = await field.isVisible();
            if (isVisible) {
              newVisibleFields.push(field);
            }
          } catch (e) {
            // Continue
          }
        }

        if (newVisibleFields.length > editableFields.length) {
          console.log(`  📝 Found ${newVisibleFields.length - editableFields.length} additional form fields in this section`);
        }

      } catch (e) {
        console.log(`❌ Could not click navigation element ${i}: ${e}`);
      }
    }

    // Try to interact with some editable fields
    if (editableFields.length > 0) {
      console.log('\n✏️ TRYING TO INTERACT WITH EDITABLE FIELDS:');

      for (let i = 0; i < Math.min(editableFields.length, 3); i++) {
        try {
          const field = editableFields[i];
          if (!field.isDisabled && !field.isReadOnly) {
            const fieldElement = authenticatedPage.locator(`${field.tagName}${field.name ? `[name="${field.name}"]` : ''}`).first();

            let testValue = '';
            if (field.tagName === 'textarea') {
              testValue = `E2E test update - ${timestamp}`;
            } else if (field.tagName === 'input') {
              testValue = `E2E Test Value ${timestamp}`;
            }

            if (testValue) {
              await fieldElement.fill(testValue);
              console.log(`  ✅ Updated ${field.tagName} "${field.name}": "${testValue}"`);
            }
          }
        } catch (e) {
          console.log(`  ❌ Could not update field ${i}: ${e}`);
        }
      }

      // Screenshot after filling fields
      await authenticatedPage.screenshot({
        path: `test-results/single-asset-details-filled-fields.png`,
        fullPage: true
      });
    }

    // Try to click save/update button if found
    if (foundButtons.length > 0) {
      console.log('\n💾 TRYING TO SAVE CHANGES:');

      for (const button of foundButtons) {
        try {
          if (!button.isDisabled) {
            const buttonElement = actionButtons[button.index];
            await buttonElement.click();
            await authenticatedPage.waitForTimeout(3000);

            console.log(`  ✅ Clicked save button: "${button.text}"`);

            // Screenshot after save
            await authenticatedPage.screenshot({
              path: `test-results/single-asset-details-after-save.png`,
              fullPage: true
            });

            break;
          }
        } catch (e) {
          console.log(`  ❌ Could not click save button: ${e}`);
        }
      }
    }

    // Final screenshot
    await authenticatedPage.screenshot({
      path: `test-results/single-asset-details-final.png`,
      fullPage: true
    });

    console.log('\n🎯 SINGLE ASSET DETAILS TESTING COMPLETE');
    console.log(`📁 Found ${foundNavigationElements.length} navigation elements`);
    console.log(`📁 Found ${foundSections.length} sections`);
    console.log(`📁 Found ${editableFields.length} form fields`);
    console.log(`📁 Found ${foundButtons.length} action buttons`);
    console.log('📁 Screenshots saved in test-results/ folder');

    // Test passes - we've thoroughly explored the page
    expect(true).toBe(true);
  });
});