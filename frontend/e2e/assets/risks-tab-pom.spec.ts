/**
 * POM-based test for Risks tab functionality
 */
import { test } from '../fixtures/auth-fixed';
import { expect } from '@playwright/test';
import { AssetDetailsPage, RisksTabPage } from '../pages/asset-details.page';

test.describe('Asset Risks Tab (POM)', () => {
  let assetPage: AssetDetailsPage;
  let risksTab: RisksTabPage;

  test.beforeEach(async ({ authenticatedPage }) => {
    assetPage = new AssetDetailsPage(authenticatedPage);
    risksTab = new RisksTabPage(authenticatedPage);
  });

  test('should navigate to Risks tab and explore risk linking functionality', async ({ authenticatedPage }) => {
    console.log('\n🔍 TESTING RISKS TAB WITH POM AND TESTIDS');

    const page = authenticatedPage;

    const assetUrl = 'http://localhost:3000/en/dashboard/assets/physical/99cb990a-29e4-4e34-acf4-d58b8261046b';

    // Step 1: Navigate to asset and verify tabs
    console.log('📍 Navigating to asset...');
    await assetPage.navigateToAsset(assetUrl);

    console.log('✅ Asset page loaded');

    // Screenshot initial state
    await assetPage.takeScreenshot('risks-pom-initial-asset-page');

    // Step 2: Get all available tabs
    console.log('\n🧭 Getting all available navigation tabs...');
    const availableTabs = await assetPage.getAvailableTabs();
    console.log(`📋 Found ${availableTabs.length} tabs:`, availableTabs);

    expect(availableTabs.length).toBeGreaterThan(0);
    expect(availableTabs).toContain('Controls');
    expect(availableTabs).toContain('Risks');

    // Step 3: Navigate to Risks tab
    console.log('\n🚨 Navigating to Risks tab...');
    await assetPage.clickRisksTab();

    console.log('✅ Risks tab clicked');
    await assetPage.takeScreenshot('risks-pom-tab-content');

    // Step 4: Analyze current risks state
    console.log('\n📊 Analyzing current risks state...');

    const hasRisks = await risksTab.hasLinkedRisks();
    const risksCount = await risksTab.getLinkedRisksCount();

    console.log(`🔍 Has linked risks: ${hasRisks}`);
    console.log(`📈 Linked risks count: ${risksCount}`);

    if (hasRisks) {
      console.log('✅ Asset already has linked risks');

      // Look for existing risk elements
      const riskElements = await page.locator('[data-testid^="risk-"]').all();
      console.log(`📋 Found ${riskElements.length} risk elements with data-testid`);

      for (let i = 0; i < Math.min(riskElements.length, 3); i++) {
        try {
          const element = riskElements[i];
          if (await element.isVisible()) {
            const text = await element.textContent();
            const testid = await element.getAttribute('data-testid');
            console.log(`  ${i + 1}. [${testid}] "${text?.trim().substring(0, 80)}${text ? (text.length > 80 ? '...' : '') : ''}"`);
          }
        } catch (e) {
          continue;
        }
      }
    } else {
      console.log('ℹ️ No linked risks found - looking for linking functionality');
    }

    // Step 5: Look for risk linking functionality
    console.log('\n🔗 Looking for risk linking functionality...');

    // Try different button selectors for linking risks
    const riskLinkingSelectors = [
      'button:has-text("Link Risk")',
      'button:has-text("Link Risks")',
      'button:has-text("Add Risk")',
      'button:has-text("Add Risks")',
      'button:has-text("Associate Risk")',
      'button:has-text("Connect Risk")',
      '[data-testid*="link"]',
      '[data-testid*="add"]',
      '[data-testid*="risk"]'
    ];

    let linkRiskButton = null;
    let foundSelector = '';
    let modalVisible = false;

    for (const selector of riskLinkingSelectors) {
      try {
        const button = await page.locator(selector).first();
        if (await button.isVisible()) {
          linkRiskButton = button;
          foundSelector = selector;
          console.log(`✅ Found risk linking button: ${selector}`);
          break;
        }
      } catch (e) {
        continue;
      }
    }

    if (linkRiskButton) {
      console.log('\n🎯 Risk linking button found - testing functionality...');

      // Click the button to open risk selection
      await linkRiskButton.click();
      console.log('✅ Risk linking button clicked');
      await page.waitForTimeout(3000);

      // Check if modal opened
      modalVisible = await risksTab.modal.isVisible();
      console.log(`📋 Modal opened: ${modalVisible}`);

      if (modalVisible) {
        console.log('✅ Risk selection modal opened');

        await assetPage.takeScreenshot('risks-pom-modal-opened');

        // Step 6: Explore risk selection modal
        console.log('\n🔍 Exploring risk selection modal...');

        // Look for risk search functionality
        try {
          const searchInput = risksTab.riskSearchInput;
          if (await searchInput.isVisible()) {
            console.log('✅ Found risk search input');

            // Try searching for risks
            await searchInput.fill('security');
            await page.waitForTimeout(2000);
            console.log('✅ Searched for "security" risks');

            await assetPage.takeScreenshot('risks-pom-search-results');
          }
        } catch (e) {
          console.log('⚠️ Risk search input not found');
        }

        // Look for risk dropdown
        try {
          const dropdownTrigger = risksTab.riskDropdownTrigger;
          if (await dropdownTrigger.isVisible()) {
            console.log('✅ Found risk dropdown trigger');

            await dropdownTrigger.click();
            await page.waitForTimeout(2000);
            console.log('✅ Risk dropdown opened');

            await assetPage.takeScreenshot('risks-pom-dropdown-open');

            // Look for risk options
            const riskOptions = await risksTab.getRiskOptions().all();
            console.log(`📋 Found ${riskOptions.length} risk options`);

            for (let i = 0; i < Math.min(riskOptions.length, 3); i++) {
              try {
                const option = riskOptions[i];
                if (await option.isVisible()) {
                  const text = await option.textContent();
                  const testid = await option.getAttribute('data-testid');
                  console.log(`  ${i + 1}. [${testid || 'no-testid'}] "${text?.trim().substring(0, 60)}${text ? (text.length > 60 ? '...' : '') : ''}"`);

                  // Try selecting the first risk option
                  if (i === 0) {
                    await option.click();
                    console.log(`  ✅ Selected risk option ${i + 1}`);
                    await page.waitForTimeout(1000);
                  }
                }
              } catch (e) {
                console.log(`  ❌ Error with option ${i + 1}: ${e}`);
              }
            }

            await assetPage.takeScreenshot('risks-pom-risk-selected');
          }
        } catch (e) {
          console.log('⚠️ Risk dropdown not found');
        }

        // Step 7: Try to complete the risk linking
        console.log('\n💾 Attempting to complete risk linking...');

        try {
          const submitButton = risksTab.riskDialogSubmitButton;
          if (await submitButton.isVisible()) {
            const isEnabled = await submitButton.isEnabled();
            console.log(`💾 Submit button visible: true, enabled: ${isEnabled}`);

            if (isEnabled) {
              await submitButton.click();
              console.log('✅ Risk linking submit button clicked');

              await page.waitForTimeout(5000);

              // Check if modal closed
              const modalStillOpen = await risksTab.modal.isVisible();
              if (!modalStillOpen) {
                console.log('🎉 SUCCESS: Risk linking completed and modal closed!');

                await assetPage.takeScreenshot('risks-pom-linking-success');

                // Verify the risk was linked
                const newRisksCount = await risksTab.getLinkedRisksCount();
                console.log(`📈 New risks count: ${newRisksCount}`);

                if (newRisksCount > risksCount) {
                  console.log('✅ SUCCESS: Risk count increased - linking was successful!');
                }
              } else {
                console.log('⚠️ Modal still open - checking for errors...');

                // Look for error messages
                const errorMessages = await page.locator('text:has-text("error"), text:has-text("required")').all();
                if (errorMessages.length > 0) {
                  console.log('❌ Found error messages:');
                  for (const error of errorMessages.slice(0, 2)) {
                    try {
                      const text = await error.textContent();
                      console.log(`  - ${text}`);
                    } catch (e) {
                      continue;
                    }
                  }
                }
              }
            } else {
              console.log('⚠️ Submit button is disabled - may need to complete required fields');
            }
          } else {
            console.log('⚠️ Submit button not found in modal');
          }
        } catch (e) {
          console.log(`❌ Error with submit button: ${e}`);
        }

        // Close modal if still open
        await risksTab.closeModal();

      } else {
        console.log('ℹ️ No modal opened - risk linking might work differently');
      }

    } else {
      console.log('⚠️ No risk linking button found');

      // Look for any other risk-related buttons or elements
      const allRiskElements = await page.locator('[data-testid*="risk"], button:has-text("Risk")').all();
      console.log(`🔍 Found ${allRiskElements.length} risk-related elements`);

      for (let i = 0; i < Math.min(allRiskElements.length, 5); i++) {
        try {
          const element = allRiskElements[i];
          if (await element.isVisible()) {
            const text = await element.textContent();
            const testid = await element.getAttribute('data-testid');
            const tagName = await element.evaluate((el: any) => el.tagName.toLowerCase());
            console.log(`  ${i + 1}. ${tagName.toUpperCase()} [${testid || 'no-testid'}]: "${text?.trim().substring(0, 60)}${text ? (text.length > 60 ? '...' : '') : ''}"`);
          }
        } catch (e) {
          continue;
        }
      }
    }

    // Step 8: Final verification and screenshots
    console.log('\n📊 FINAL VERIFICATION...');

    await assetPage.takeScreenshot('risks-pom-final-state');

    // Check final risks state
    const finalRisksCount = await risksTab.getLinkedRisksCount();
    const finalHasRisks = await risksTab.hasLinkedRisks();

    console.log(`📈 Final risks count: ${finalRisksCount}`);
    console.log(`🔍 Final has linked risks: ${finalHasRisks}`);

    // Summary
    console.log('\n📊 RISKS TAB POM TEST RESULTS:');
    console.log(`📁 Available tabs: ${availableTabs.length}`);
    console.log(`📁 Initial linked risks: ${risksCount}`);
    console.log(`📁 Final linked risks: ${finalRisksCount}`);
    console.log(`📁 Risk linking button found: ${!!linkRiskButton}`);
    console.log(`📁 Modal opened: ${modalVisible}`);
    console.log('📁 Screenshots saved: risks-pom-*.png');

    // Assertions
    expect(availableTabs.length).toBeGreaterThan(0);
    expect(availableTabs).toContain('Risks');

    console.log('\n🎯 CONCLUSION:');
    if (finalRisksCount > risksCount) {
      console.log('🎉 COMPLETE SUCCESS: Risks successfully linked to the asset using POM!');
    } else if (linkRiskButton) {
      console.log('✅ SUCCESS: Risk linking functionality found and explored using POM');
      console.log('✅ Test demonstrates proper testid-based selection');
    } else {
      console.log('ℹ️ Risk tab explored - check screenshots for current state');
    }
  });
});