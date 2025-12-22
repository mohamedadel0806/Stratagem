/**
 * Debug test to understand dependency creation validation and requirements
 */
import { test } from '../fixtures/auth-fixed';
import { expect } from '@playwright/test';
import { AssetDetailsPage, DependenciesTabPage } from '../pages/asset-details.page';

test.describe('Debug Dependency Creation Validation', () => {
  let assetPage: AssetDetailsPage;
  let dependenciesTab: DependenciesTabPage;

  test.beforeEach(async ({ authenticatedPage }) => {
    assetPage = new AssetDetailsPage(authenticatedPage);
    dependenciesTab = new DependenciesTabPage(authenticatedPage);
  });

  test('should debug dependency creation form to understand requirements', async ({ authenticatedPage }) => {
    console.log('\n🔍 DEBUG: UNDERSTANDING DEPENDENCY CREATION VALIDATION');

    const assetUrl = 'http://localhost:3000/en/dashboard/assets/physical/99cb990a-29e4-4e34-acf4-d58b8261046b';

    // Step 1: Navigate and open dependency creation
    console.log('📍 Setting up...');
    await assetPage.navigateToAsset(assetUrl);
    await assetPage.clickTab('Dependencies');
    await dependenciesTab.clickAddDependencyButton();

    const modalVisible = await dependenciesTab.modal.isVisible();
    expect(modalVisible).toBe(true);
    console.log('✅ Dependency creation modal opened');

    await assetPage.takeScreenshot('debug-dependency-modal-initial');

    // Step 2: Analyze the modal structure in detail
    console.log('\n🔍 Analyzing modal structure...');

    // Get all form elements
    const allInputs = await dependenciesTab.modal.locator('input').all();
    const allSelects = await dependenciesTab.modal.locator('select').all();
    const allTextareas = await dependenciesTab.modal.locator('textarea').all();
    const allButtons = await dependenciesTab.modal.locator('button').all();
    const allLabels = await dependenciesTab.modal.locator('label').all();

    console.log(`📝 Found ${allInputs.length} inputs`);
    console.log(`📋 Found ${allSelects.length} selects`);
    console.log(`📄 Found ${allTextareas.length} textareas`);
    console.log(`🔘 Found ${allButtons.length} buttons`);
    console.log(`🏷️  Found ${allLabels.length} labels`);

    // Analyze each input field
    console.log('\n📝 Analyzing input fields:');
    for (let i = 0; i < allInputs.length; i++) {
      try {
        const input = allInputs[i];
        if (await input.isVisible()) {
          const type = await input.getAttribute('type') || 'text';
          const name = await input.getAttribute('name') || '';
          const placeholder = await input.getAttribute('placeholder') || '';
          const value = await input.inputValue();
          const required = await input.getAttribute('required') || 'false';
          const testid = await input.getAttribute('data-testid') || '';

          console.log(`  Input ${i + 1}: type="${type}" name="${name}" placeholder="${placeholder}" value="${value}" required=${required} [${testid}]`);
        }
      } catch (e) {
        console.log(`  Input ${i + 1}: Error analyzing: ${e}`);
      }
    }

    // Analyze each select field
    console.log('\n📋 Analyzing select fields:');
    for (let i = 0; i < allSelects.length; i++) {
      try {
        const select = allSelects[i];
        if (await select.isVisible()) {
          const name = await select.getAttribute('name') || '';
          const required = await select.getAttribute('required') || 'false';
          const testid = await select.getAttribute('data-testid') || '';
          const value = await select.inputValue();

          console.log(`  Select ${i + 1}: name="${name}" value="${value}" required=${required} [${testid}]`);

          // Get options
          const options = await select.locator('option').all();
          console.log(`    Options: ${options.length}`);
          for (let j = 0; j < Math.min(options.length, 5); j++) {
            try {
              const option = options[j];
              const optionValue = await option.getAttribute('value') || '';
              const optionText = await option.textContent() || '';
              const selected = await option.getAttribute('selected') || 'false';
              console.log(`      ${j + 1}. value="${optionValue}" text="${optionText}" selected=${selected}`);
            } catch (e) {
              continue;
            }
          }
        }
      } catch (e) {
        console.log(`  Select ${i + 1}: Error analyzing: ${e}`);
      }
    }

    // Analyze each textarea
    console.log('\n📄 Analyzing textareas:');
    for (let i = 0; i < allTextareas.length; i++) {
      try {
        const textarea = allTextareas[i];
        if (await textarea.isVisible()) {
          const name = await textarea.getAttribute('name') || '';
          const placeholder = await textarea.getAttribute('placeholder') || '';
          const value = await textarea.inputValue();
          const required = await textarea.getAttribute('required') || 'false';
          const testid = await textarea.getAttribute('data-testid') || '';

          console.log(`  Textarea ${i + 1}: name="${name}" placeholder="${placeholder}" value="${value.substring(0, 50)}..." required=${required} [${testid}]`);
        }
      } catch (e) {
        console.log(`  Textarea ${i + 1}: Error analyzing: ${e}`);
      }
    }

    // Analyze buttons
    console.log('\n🔘 Analyzing buttons:');
    for (let i = 0; i < allButtons.length; i++) {
      try {
        const button = allButtons[i];
        if (await button.isVisible()) {
          const text = await button.textContent() || '';
          const type = await button.getAttribute('type') || '';
          const disabled = await button.getAttribute('disabled') || 'false';
          const testid = await button.getAttribute('data-testid') || '';

          console.log(`  Button ${i + 1}: text="${text.trim()}" type="${type}" disabled=${disabled} [${testid}]`);
        }
      } catch (e) {
        console.log(`  Button ${i + 1}: Error analyzing: ${e}`);
      }
    }

    // Step 3: Look for any existing validation messages or hints
    console.log('\n🔍 Looking for validation messages and hints...');

    const validationElements = await dependenciesTab.modal.locator('[aria-invalid="true"], .error, .invalid, [class*="error"], [class*="invalid"]').all();
    const helpTexts = await dependenciesTab.modal.locator('.help-text, .hint, .description, [class*="help"], [class*="hint"]').all();
    const requiredIndicators = await dependenciesTab.modal.locator('[required], [aria-required="true"], .required, [class*="required"]').all();

    console.log(`📋 Found ${validationElements.length} validation indicators`);
    console.log(`📝 Found ${helpTexts.length} help texts`);
    console.log(`⚠️  Found ${requiredIndicators.length} required indicators`);

    for (let i = 0; i < Math.min(helpTexts.length, 3); i++) {
      try {
        const helpText = helpTexts[i];
        if (await helpText.isVisible()) {
          const text = await helpText.textContent();
          console.log(`  Help ${i + 1}: "${text?.trim()}"`);
        }
      } catch (e) {
        continue;
      }
    }

    // Step 4: Try to understand the expected flow
    console.log('\n🎯 Testing form interaction flow...');

    // Try to fill the form step by step and see what happens
    let createButton = null;
    for (const button of allButtons) {
      try {
        const text = await button.textContent();
        if (text && text.toLowerCase().includes('create')) {
          createButton = button;
          break;
        }
      } catch (e) {
        continue;
      }
    }

    if (createButton) {
      console.log('✅ Found create button');

      // Check initial state
      const initiallyEnabled = await createButton.isEnabled();
      console.log(`💾 Create button initially enabled: ${initiallyEnabled}`);

      // Step 5: Try to fill search field and trigger asset selection
      console.log('\n🔍 Testing search functionality...');

      if (allInputs.length > 0) {
        const searchInput = allInputs[0]; // Assume first input is search
        if (await searchInput.isVisible()) {
          const placeholder = await searchInput.getAttribute('placeholder') || '';
          console.log(`📝 Using search input: placeholder="${placeholder}"`);

          // Try different search terms
          const searchTerms = ['server', 'database', 'application', 'network', ''];

          for (const searchTerm of searchTerms) {
            console.log(`\n🔍 Trying search term: "${searchTerm}"`);

            await searchInput.clear();
            if (searchTerm) {
              await searchInput.fill(searchTerm);
            }
            await authenticatedPage.waitForTimeout(2000);

            // Try pressing Enter
            await searchInput.press('Enter');
            await authenticatedPage.waitForTimeout(3000);

            // Look for any new elements that appeared (search results)
            const allElementsAfterSearch = await dependenciesTab.modal.locator('*').all();
            const clickableElements = [];

            for (const element of allElementsAfterSearch.slice(0, 100)) {
              try {
                if (await element.isVisible()) {
                  const tagName = await element.evaluate((el: any) => el.tagName.toLowerCase());
                  const text = await element.textContent();
                  const testid = await element.getAttribute('data-testid') || '';
                  const role = await element.getAttribute('role') || '';

                  // Look for clickable elements that might be search results
                  if (text && text.trim().length > 5 && (
                    tagName === 'button' ||
                    tagName === 'li' ||
                    role === 'option' ||
                    role === 'button' ||
                    testid.includes('result') ||
                    testid.includes('option') ||
                    testid.includes('item')
                  )) {
                    clickableElements.push({
                      element,
                      tagName,
                      text: text.trim(),
                      testid,
                      role
                    });
                  }
                }
              } catch (e) {
                continue;
              }
            }

            console.log(`  📋 Found ${clickableElements.length} potentially clickable elements`);

            // Display first few clickable elements
            for (let i = 0; i < Math.min(clickableElements.length, 5); i++) {
              const item = clickableElements[i];
              console.log(`    ${i + 1}. ${item.tagName.toUpperCase()} [${item.testid}] role="${item.role}": "${item.text.substring(0, 60)}..."`);
            }

            // Try clicking on the first clickable element
            if (clickableElements.length > 0) {
              try {
                await clickableElements[0].element.click();
                console.log(`  ✅ Clicked first clickable element`);
                await authenticatedPage.waitForTimeout(2000);

                // Check if this enabled the create button
                const nowEnabled = await createButton.isEnabled();
                console.log(`  💾 Create button now enabled: ${nowEnabled}`);

                if (nowEnabled && !initiallyEnabled) {
                  console.log(`  🎉 Search term "${searchTerm}" successfully enabled create button!`);
                  break;
                }
              } catch (e) {
                console.log(`  ❌ Error clicking element: ${e}`);
              }
            }
          }
        }
      }

      // Step 6: Try filling other required fields
      console.log('\n📝 Filling other form fields...');

      if (allTextareas.length > 0) {
        const textarea = allTextareas[0];
        if (await textarea.isVisible()) {
          await textarea.fill('Test dependency created by automated testing. This is a description to test the dependency creation functionality.');
          console.log('✅ Filled description textarea');
          await authenticatedPage.waitForTimeout(1000);
        }
      }

      // Step 7: Check if create button is enabled now
      const finalEnabled = await createButton.isEnabled();
      console.log(`💾 Create button final state: enabled=${finalEnabled}`);

      if (finalEnabled) {
        console.log('\n🎉 SUCCESS: Form appears to be ready for submission!');

        // Take screenshot before submission
        await assetPage.takeScreenshot('debug-dependency-form-ready');

        // Try to submit
        console.log('💾 Attempting to submit...');
        await createButton.click();

        await authenticatedPage.waitForTimeout(5000);

        // Check result
        const modalStillOpen = await dependenciesTab.modal.isVisible();

        if (!modalStillOpen) {
          console.log('🎉 SUCCESS: Modal closed after submission!');
        } else {
          console.log('⚠️ Modal still open - looking for error messages...');

          const errorMessages = await dependenciesTab.modal.locator('text:has-text("error"), text:has-text("required"), text:has-text("invalid"), text:has-text("select")').all();

          if (errorMessages.length > 0) {
            console.log('❌ Found error messages:');
            for (const error of errorMessages.slice(0, 3)) {
              try {
                const text = await error.textContent();
                console.log(`  - ${text}`);
              } catch (e) {
                continue;
              }
            }
          }

          await assetPage.takeScreenshot('debug-dependency-form-errors');
        }
      } else {
        console.log('❌ Form still not ready - missing required fields');
      }
    }

    // Final screenshot
    await assetPage.takeScreenshot('debug-dependency-final-state');

    // Close modal if still open
    await dependenciesTab.closeModal();

    console.log('\n✅ DEPENDENCY CREATION DEBUG TEST COMPLETED');
    console.log('📁 Screenshots saved: debug-dependency-*.png');
    console.log('💡 Check screenshots to understand the form structure and requirements');
  });
});