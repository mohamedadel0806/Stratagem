/**
 * Comprehensive diagnostic test to find form fields and buttons for all asset types
 */
import { test } from '../fixtures/auth-fixed';
import { expect } from '@playwright/test';
import { waitForAssetsPage } from '../utils/helpers';

test.describe('Asset Types - Comprehensive Diagnostic', () => {
  const assetTypes = [
    { path: 'physical', name: 'Physical Assets' },
    { path: 'information', name: 'Information Assets' },
    { path: 'software', name: 'Software Assets' },
    { path: 'applications', name: 'Business Applications' },
    { path: 'suppliers', name: 'Suppliers' }
  ];

  assetTypes.forEach(({ path, name }) => {
    test(`should diagnose ${name} form fields and buttons`, async ({ authenticatedPage }) => {
      console.log(`\n🔍 DIAGNOSING ${name.toUpperCase()} (${path})`);

      // Navigate to asset page
      await authenticatedPage.goto(`/dashboard/assets/${path}`);
      await waitForAssetsPage(authenticatedPage);

      console.log(`✅ Successfully navigated to: ${authenticatedPage.url()}`);

      // Find the correct "Add/Create/New" button for this asset type
      const possibleButtonSelectors = [
        'button:has-text("New Asset")',
        'button:has-text("New Application")',
        'button:has-text("New Supplier")',
        'button:has-text("New Software")',
        'button:has-text("New Information Asset")',
        'button:has-text("Add New")',
        'button:has-text("Create")',
        'button:has-text("Add")',
        'button:has-text("Add Application")',
        'button:has-text("Add Supplier")',
        'button:has-text("Add Software")',
        'button:has-text("Add Information")'
      ];

      let workingButtonSelector = '';
      let buttonText = '';

      for (const selector of possibleButtonSelectors) {
        try {
          const button = authenticatedPage.locator(selector);
          const isVisible = await button.isVisible().catch(() => false);

          if (isVisible) {
            workingButtonSelector = selector;
            buttonText = await button.textContent();
            console.log(`✅ Found working button: "${selector}" -> "${buttonText}"`);
            break;
          }
        } catch (e) {
          // Continue
        }
      }

      if (!workingButtonSelector) {
        console.log(`❌ No working button found for ${name}`);
        // Take screenshot for manual inspection
        await authenticatedPage.screenshot({
          path: `test-results/diagnostic-${path}-page.png`,
          fullPage: true
        });
        throw new Error(`No working button found for ${name}`);
      }

      // Click the button and wait for form
      await authenticatedPage.click(workingButtonSelector);
      await authenticatedPage.waitForTimeout(3000);

      // Screenshot form state
      await authenticatedPage.screenshot({
        path: `test-results/diagnostic-${path}-form.png`,
        fullPage: true
      });

      console.log(`\n📋 Analyzing form fields for ${name}:`);

      // Find all form inputs, selects, and textareas
      const formElements = await authenticatedPage.locator('input, select, textarea').all();
      console.log(`Found ${formElements.length} form elements`);

      const visibleFormFields = [];

      for (let i = 0; i < formElements.length; i++) {
        try {
          const element = formElements[i];
          const isVisible = await element.isVisible().catch(() => false);

          if (isVisible) {
            const tagName = await element.evaluate((el: any) => el.tagName.toLowerCase());
            const name = await element.getAttribute('name');
            const placeholder = await element.getAttribute('placeholder');
            const type = await element.getAttribute('type');

            // Find associated label
            const label = await element.evaluate((el: any) => {
              const parentLabel = el.closest('label');
              if (parentLabel) return parentLabel.textContent?.trim();

              const associatedLabel = document.querySelector(`label[for="${el.id}"]`);
              if (associatedLabel) return associatedLabel.textContent?.trim();

              // Look for preceding element that might be a label
              const prevElement = el.previousElementSibling;
              if (prevElement && (prevElement.tagName === 'LABEL' || prevElement.classList.contains('label'))) {
                return prevElement.textContent?.trim();
              }

              return '';
            });

            const fieldInfo = {
              tagName,
              name,
              placeholder,
              label,
              type,
              selector: `${tagName}${name ? `[name="${name}"]` : ''}${placeholder ? `[placeholder*="${placeholder}"]` : ''}`
            };

            visibleFormFields.push(fieldInfo);
            console.log(`  ✅ ${tagName.toUpperCase()}: "${name || 'unnamed'}" - Label: "${label || 'none'}" - Placeholder: "${placeholder || 'none'}"`);
          }
        } catch (e) {
          // Skip inaccessible elements
        }
      }

      // Find submit buttons in the form
      console.log(`\n🔍 Looking for submit buttons in ${name} form:`);
      const submitButtons = await authenticatedPage.locator('button[type="submit"], button:has-text("Create"), button:has-text("Save"), button:has-text("Submit")').all();

      let workingSubmitSelector = '';
      let workingSubmitText = '';

      for (let i = 0; i < submitButtons.length; i++) {
        try {
          const button = submitButtons[i];
          const isVisible = await button.isVisible();
          const isEnabled = await button.isEnabled();
          const text = await button.textContent();

          if (isVisible && isEnabled) {
            workingSubmitSelector = `button${text ? `:has-text("${text}")` : '[type="submit"]'}`;
            workingSubmitText = text || 'Submit';
            console.log(`  ✅ Found working submit button: "${workingSubmitSelector}" -> "${text}" (enabled: ${isEnabled})`);
            break;
          }
        } catch (e) {
          // Continue
        }
      }

      // Store results for analysis
      console.log(`\n📊 SUMMARY for ${name}:`);
      console.log(`- Working Add Button: ${workingButtonSelector} -> "${buttonText}"`);
      console.log(`- Working Submit Button: ${workingSubmitSelector} -> "${workingSubmitText}"`);
      console.log(`- Form Fields Found: ${visibleFormFields.length}`);

      // Essential form fields to look for
      const essentialFields = ['assetName', 'assetDescription', 'uniqueIdentifier', 'informationType', 'softwareName', 'applicationName', 'supplierName'];
      const foundEssentialFields = visibleFormFields.filter(field =>
        essentialFields.some(essential =>
          field.name?.includes(essential) ||
          field.label?.toLowerCase().includes(essential.toLowerCase())
        )
      );

      console.log(`- Essential Fields: ${foundEssentialFields.map(f => `${f.name || f.label}(${f.tagName})`).join(', ')}`);

      // The test should pass if we found basic elements
      expect(workingButtonSelector).toBeTruthy();
      expect(visibleFormFields.length).toBeGreaterThan(0);
    });
  });
});