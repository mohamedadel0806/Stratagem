import { test } from '../fixtures/auth';
import { expect } from '@playwright/test';
import { AssetDetailsPage } from '../pages/asset-details.page';

test.describe('Investigate Page and Fill Form Properly', () => {
  let assetDetailsPage: AssetDetailsPage;

  test.beforeEach(async ({ page }) => {
    assetDetailsPage = new AssetDetailsPage(page);
  });

  test('should investigate page structure and fill form correctly', async ({ page }) => {
    console.log('🔍 INVESTIGATE PAGE STRUCTURE AND FILL FORM CORRECTLY');

    // Navigate to the specific information asset
    const informationAssetId = '189d91ee-01dd-46a4-b6ef-76ccac11c60d';
    const informationAssetUrl = `http://localhost:3000/en/dashboard/assets/information/${informationAssetId}`;

    await assetDetailsPage.navigateToAsset(informationAssetUrl);
    console.log(`✅ Navigated to Information Asset: ${informationAssetId}`);

    // Wait for page to fully load
    await page.waitForTimeout(5000);

    // Step 1: Investigate page structure
    console.log('🔍 STEP 1: INVESTIGATING PAGE STRUCTURE');

    // Take screenshot first
    await page.screenshot({
      path: 'test-results/page-structure-investigation.png',
      fullPage: true
    });
    console.log('✅ Page structure screenshot captured');

    // Analyze all interactive elements
    await analyzePageStructure(page);

    // Step 2: Look for Edit button and click it
    console.log('✏️ STEP 2: LOOKING FOR EDIT BUTTON');

    const editButtons = [
      'button:has-text("Edit")',
      'button[aria-label*="Edit"]',
      'button[data-testid*="edit"]',
      'svg.lucide-edit',
      '.edit-button'
    ];

    let editButtonFound = false;

    for (const selector of editButtons) {
      try {
        const button = page.locator(selector).first();
        if (await button.isVisible()) {
          console.log(`✅ Found Edit button with selector: ${selector}`);
          await button.click();
          console.log('✅ Clicked Edit button');
          editButtonFound = true;
          await page.waitForTimeout(3000);
          break;
        }
      } catch (error) {
        continue;
      }
    }

    if (!editButtonFound) {
      console.log('⚠️ No Edit button found - page might already be in edit mode');
    }

    // Step 3: Take screenshot after edit attempt
    await page.screenshot({
      path: 'test-results/after-edit-attempt.png',
      fullPage: true
    });
    console.log('✅ Post-edit attempt screenshot captured');

    // Step 4: Look for form fields after edit
    console.log('📝 STEP 3: LOOKING FOR FORM FIELDS AFTER EDIT');

    await lookForAndFillFormFields(page);

    // Step 5: Test tabs after form interaction
    console.log('📋 STEP 4: TESTING TABS AFTER FORM INTERACTION');

    await testTabsAfterFormInteraction(page, assetDetailsPage);

    // Final screenshot
    await page.screenshot({
      path: 'test-results/final-investigation-result.png',
      fullPage: true
    });
    console.log('✅ Final investigation result screenshot captured');

    console.log('🎯 INVESTIGATION COMPLETE');
  });
});

async function analyzePageStructure(page: any): Promise<void> {
  console.log('🔍 Analyzing page structure...');

  try {
    // Check page title
    const pageTitle = await page.title();
    console.log(`📄 Page title: ${pageTitle}`);

    // Count all elements
    const allButtons = await page.locator('button').all();
    const allInputs = await page.locator('input').all();
    const allTextareas = await page.locator('textarea').all();
    const allSelects = await page.locator('select').all();
    const allCards = await page.locator('.card, [class*="card"]').all();
    const allTabs = await page.locator('[role="tab"], button[data-value], [data-testid*="tab"]').all();

    console.log(`📊 Page element counts:`);
    console.log(`  - Buttons: ${allButtons.length}`);
    console.log(`  - Inputs: ${allInputs.length}`);
    console.log(`  - Textareas: ${allTextareas.length}`);
    console.log(`  - Selects: ${allSelects.length}`);
    console.log(`  - Cards: ${allCards.length}`);
    console.log(`  - Tabs: ${allTabs.length}`);

    // Look for specific elements
    const h1Elements = await page.locator('h1').all();
    const h2Elements = await page.locator('h2').all();

    console.log(`📝 Headings found:`);
    for (let i = 0; i < Math.min(h1Elements.length, 3); i++) {
      const text = await h1Elements[i].textContent();
      console.log(`  H1: ${text}`);
    }

    for (let i = 0; i < Math.min(h2Elements.length, 5); i++) {
      const text = await h2Elements[i].textContent();
      console.log(`  H2: ${text}`);
    }

    // Look for edit indicators
    const editIndicators = await page.locator('text=Edit, text=Modify, text=Update, .edit-mode, [data-edit-mode="true"]').all();
    console.log(`📝 Edit indicators found: ${editIndicators.length}`);

    // Look for form containers
    const formContainers = await page.locator('form, .form, [class*="form"]').all();
    console.log(`📝 Form containers found: ${formContainers.length}`);

  } catch (error) {
    console.log(`❌ Error analyzing page structure: ${error.message}`);
  }
}

async function lookForAndFillFormFields(page: any): Promise<void> {
  console.log('📝 Looking for and filling form fields...');

  try {
    // More comprehensive field search
    const fieldSelectors = [
      // Asset name fields
      'input[name*="name"]',
      'input[placeholder*="name"]',
      'input[id*="name"]',
      'label:has-text("Name") + input, label:has-text("Name") ~ input',

      // Asset identifier fields
      'input[name*="identifier"]',
      'input[placeholder*="identifier"]',
      'input[id*="identifier"]',
      'label:has-text("Identifier") + input',

      // Description fields
      'textarea[name*="description"]',
      'textarea[placeholder*="description"]',
      'textarea[id*="description"]',
      'label:has-text("Description") + textarea',

      // Classification fields
      'select[name*="classification"]',
      'select[name*="dataClassification"]',
      'label:has-text("Classification") + select',

      // Criticality fields
      'select[name*="criticality"]',
      'select[name*="criticalityLevel"]',
      'label:has-text("Criticality") + select',

      // Owner fields
      'select[name*="owner"]',
      'select[name*="ownerId"]',
      'label:has-text("Owner") + select'
    ];

    let fieldsFilled = 0;
    const timestamp = Date.now();

    for (const selector of fieldSelectors) {
      try {
        const elements = await page.locator(selector).all();

        for (const element of elements) {
          if (await element.isVisible() && !await element.isDisabled()) {
            const elementType = await element.evaluate(el => el.tagName.toLowerCase());
            const fieldName = selector.split(',')[0]; // Take first part as field name

            if (elementType === 'select') {
              // Try to get options
              const options = await element.locator('option').all();
              if (options.length > 1) {
                // Select second option (skip first empty option)
                await element.selectOption({ index: 1 });
                console.log(`✅ Selected option for ${fieldName}`);
                fieldsFilled++;
              }
            } else if (elementType === 'textarea' || elementType === 'input') {
              const inputType = await element.getAttribute('type');
              if (inputType !== 'password' && inputType !== 'file') {
                const testValue = `Test Value ${timestamp}`;
                await element.fill(testValue);
                console.log(`✅ Filled ${fieldName}: ${testValue}`);
                fieldsFilled++;
              }
            }
          }
        }
      } catch (error) {
        // Continue with next selector
        continue;
      }
    }

    console.log(`📋 Successfully filled ${fieldsFilled} fields`);

    // Look for save/update buttons after filling fields
    await lookForSaveButton(page);

  } catch (error) {
    console.log(`❌ Error filling form fields: ${error.message}`);
  }
}

async function lookForSaveButton(page: any): Promise<void> {
  console.log('💾 Looking for save/update button...');

  const saveButtonSelectors = [
    'button:has-text("Save")',
    'button:has-text("Update")',
    'button:has-text("Submit")',
    'button[type="submit"]',
    'button[form]',
    'form button:last-child',
    '.save-button',
    '[data-testid*="save"]'
  ];

  for (const selector of saveButtonSelectors) {
    try {
      const button = page.locator(selector).first();
      if (await button.isVisible() && !await button.isDisabled()) {
        console.log(`✅ Found save button: ${selector}`);

        // Check for any validation messages before clicking
        const validationMessages = await page.locator('.text-red-500, .error, .validation-message').all();
        if (validationMessages.length > 0) {
          console.log('⚠️ Validation messages found - checking them...');
          for (let i = 0; i < validationMessages.length; i++) {
            const message = await validationMessages[i].textContent();
            if (message && message.trim()) {
              console.log(`  Validation: ${message.trim()}`);
            }
          }
        }

        await button.click();
        console.log('✅ Clicked save/update button');
        await page.waitForTimeout(5000);
        return;
      }
    } catch (error) {
      continue;
    }
  }

  console.log('⚠️ No save button found');
}

async function testTabsAfterFormInteraction(page: any, assetDetailsPage: AssetDetailsPage): Promise<void> {
  console.log('📋 Testing tabs after form interaction...');

  try {
    // Get available tabs using POM
    const availableTabs = await assetDetailsPage.getAvailableTabs();
    console.log(`📋 Available tabs after form interaction: ${availableTabs.join(', ')}`);

    // Expected tabs for information assets
    const expectedTabs = [
      'Overview', 'Classification', 'Ownership', 'Compliance',
      'Controls', 'Risks', 'Dependencies', 'Graph View', 'Audit Trail'
    ];

    // Test each tab
    for (const tabName of expectedTabs) {
      console.log(`📍 Testing tab: ${tabName}`);

      try {
        await assetDetailsPage.clickTab(tabName);
        console.log(`✅ Successfully clicked ${tabName} tab`);

        await page.waitForTimeout(2000);

        // Take screenshot
        const screenshotPath = `test-results/tab-after-form-${tabName.toLowerCase().replace(/\s+/g, '-')}.png`;
        await page.screenshot({ path: screenshotPath, fullPage: false });
        console.log(`✅ Screenshot captured: ${screenshotPath}`);

      } catch (error) {
        console.log(`❌ Error testing tab ${tabName}: ${error.message}`);
      }
    }

  } catch (error) {
    console.log(`❌ Error testing tabs: ${error.message}`);
  }
}