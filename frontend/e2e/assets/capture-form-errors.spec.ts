import { test, expect } from '../fixtures/auth';

/**
 * Test to capture errors that occur when opening the form and interacting with dropdowns
 */
test('Capture form errors and verify dropdowns', async ({ authenticatedPage }) => {
  // Navigate to physical assets page
  await authenticatedPage.goto('/en/dashboard/assets/physical');
  
  // Wait for page to load
  await authenticatedPage.waitForLoadState('networkidle');
  await authenticatedPage.waitForTimeout(2000);
  
  // Wait for loading to complete
  await authenticatedPage.waitForFunction(() => {
    return !document.body.textContent?.includes('Loading assets...');
  }, { timeout: 15000 });
  
  // Collect console errors
  const consoleErrors: string[] = [];
  authenticatedPage.on('console', msg => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });
  
  // Collect page errors
  const pageErrors: string[] = [];
  authenticatedPage.on('pageerror', error => {
    pageErrors.push(error.message);
  });
  
  // Click "New Asset" button
  const newAssetButton = authenticatedPage.locator('button:has-text("New Asset")').first();
  await newAssetButton.waitFor({ state: 'visible', timeout: 10000 });
  await newAssetButton.scrollIntoViewIfNeeded();
  await authenticatedPage.waitForTimeout(500);
  await newAssetButton.click({ timeout: 5000 });
  
  // Wait for dialog to open
  await authenticatedPage.waitForSelector('[role="dialog"]', { state: 'visible', timeout: 10000 });
  await authenticatedPage.waitForTimeout(2000);
  
  console.log('\n=== After clicking New Asset button ===');
  console.log('Console errors:', consoleErrors);
  console.log('Page errors:', pageErrors);
  
  // Take screenshot
  await authenticatedPage.screenshot({ path: 'test-results/form-opened.png', fullPage: true });
  
  // Wait for form to be fully rendered
  await authenticatedPage.waitForSelector('form', { state: 'visible', timeout: 10000 });
  await authenticatedPage.waitForTimeout(1000);
  
  // List all tabs first
  console.log('\n=== All tabs on page ===');
  const allTabs = await authenticatedPage.locator('[role="tab"]').all();
  console.log(`Found ${allTabs.length} tabs`);
  for (let i = 0; i < allTabs.length; i++) {
    const tab = allTabs[i];
    const text = await tab.textContent();
    const visible = await tab.isVisible();
    console.log(`Tab ${i}: "${text}" - Visible: ${visible}`);
  }
  
  // Try to navigate to Ownership tab
  console.log('\n=== Attempting to navigate to Ownership tab ===');
  try {
    const ownershipTab = authenticatedPage.locator('button[role="tab"]:has-text("Ownership"), [role="tab"]:has-text("Ownership")').first();
    await ownershipTab.waitFor({ state: 'visible', timeout: 5000 });
    await ownershipTab.click();
    await authenticatedPage.waitForTimeout(2000); // Wait longer for tab content to render
    console.log('✅ Ownership tab clicked');
    
    // Wait for the tab content to be visible
    await authenticatedPage.waitForFunction(() => {
      const tabPanel = document.querySelector('[role="tabpanel"]');
      return tabPanel && getComputedStyle(tabPanel).display !== 'none';
    }, { timeout: 5000 });
    console.log('✅ Tab panel is visible');
  } catch (error: any) {
    console.log(`❌ Failed to click Ownership tab: ${error.message}`);
  }
  
  // Try to find Owner field - check multiple ways
  console.log('\n=== Looking for Owner field ===');
  
  // First, check if form is visible
  const formVisible = await authenticatedPage.locator('form').isVisible();
  console.log(`Form visible: ${formVisible}`);
  
  // Check all inputs/selects in the form
  const allFormFields = await authenticatedPage.locator('form input, form select, form button[role="combobox"]').all();
  console.log(`Found ${allFormFields.length} form fields total`);
  for (let i = 0; i < Math.min(allFormFields.length, 30); i++) {
    const field = allFormFields[i];
    const name = await field.getAttribute('name').catch(() => 'no-name');
    const tag = await field.evaluate(el => el.tagName);
    const visible = await field.isVisible();
    console.log(`Field ${i}: name="${name}", tag=${tag}, visible=${visible}`);
  }
  
  try {
    // Try different selectors for the owner field
    const ownerSelectors = [
      '[name="ownerId"]',
      'button[role="combobox"][aria-labelledby*="owner"]',
      'label:has-text("Owner") + * button',
      'label:has-text("Owner") ~ * button',
    ];
    
    let ownerField = null;
    for (const selector of ownerSelectors) {
      const field = authenticatedPage.locator(selector).first();
      const count = await field.count();
      if (count > 0) {
        const visible = await field.isVisible();
        if (visible) {
          ownerField = field;
          console.log(`✅ Found Owner field with selector: ${selector}`);
          break;
        }
      }
    }
    
    if (!ownerField) {
      // Try to find by label
      const ownerLabel = authenticatedPage.locator('label:has-text("Owner"), label:has-text("owner")').first();
      if (await ownerLabel.count() > 0) {
        const labelId = await ownerLabel.getAttribute('id').catch(() => null);
        const htmlFor = await ownerLabel.getAttribute('for').catch(() => null);
        console.log(`Owner label found - id: ${labelId}, for: ${htmlFor}`);
        
        // Try to find associated input/select
        if (htmlFor) {
          ownerField = authenticatedPage.locator(`#${htmlFor}, [name="${htmlFor}"]`).first();
        } else if (labelId) {
          ownerField = authenticatedPage.locator(`[aria-labelledby="${labelId}"]`).first();
        }
      }
    }
    
    if (ownerField && await ownerField.count() > 0) {
      await ownerField.waitFor({ state: 'visible', timeout: 5000 });
      console.log('✅ Owner field found and visible');
      
      // Check what type of element it is
      const tagName = await ownerField.evaluate(el => el.tagName);
      const type = await ownerField.evaluate(el => el.getAttribute('type') || 'none');
      const role = await ownerField.evaluate(el => el.getAttribute('role') || 'none');
      const className = await ownerField.evaluate(el => el.className || 'none');
      
      console.log(`Tag: ${tagName}, Type: ${type}, Role: ${role}`);
      console.log(`Class: ${className.substring(0, 100)}...`);
      
      // Try to click it
      try {
        await ownerField.click({ timeout: 3000 });
        console.log('✅ Owner field clicked');
        
        // Wait for dropdown
        await authenticatedPage.waitForTimeout(500);
        const options = await authenticatedPage.locator('[role="option"]').count();
        console.log(`Found ${options} dropdown options`);
      } catch (clickError: any) {
        console.log(`❌ Failed to click Owner field: ${clickError.message}`);
      }
    } else {
      console.log('❌ Owner field not found with any selector');
    }
  } catch (error: any) {
    console.log(`❌ Error finding Owner field: ${error.message}`);
    
    // List all form fields
    const allInputs = await authenticatedPage.locator('input, select, button[role="combobox"]').all();
    console.log(`Found ${allInputs.length} form fields`);
    for (let i = 0; i < Math.min(allInputs.length, 20); i++) {
      const field = allInputs[i];
      const name = await field.getAttribute('name').catch(() => 'no-name');
      const tag = await field.evaluate(el => el.tagName);
      const text = await field.textContent().catch(() => 'no-text');
      console.log(`Field ${i}: name="${name}", tag=${tag}, text="${text?.substring(0, 50)}"`);
    }
  }
  
  // Try to find Business Unit field
  console.log('\n=== Looking for Business Unit field ===');
  try {
    const businessUnitField = authenticatedPage.locator('[name="businessUnitId"]').first();
    await businessUnitField.waitFor({ state: 'visible', timeout: 5000 });
    console.log('✅ Business Unit field found');
    
    const tagName = await businessUnitField.evaluate(el => el.tagName);
    console.log(`Tag: ${tagName}`);
  } catch (error: any) {
    console.log(`❌ Business Unit field not found: ${error.message}`);
  }
  
  // Check for any error messages on the page
  const errorElements = await authenticatedPage.locator('.text-red-500, [role="alert"], .error').all();
  console.log(`\n=== Error elements on page: ${errorElements.length} ===`);
  for (let i = 0; i < errorElements.length; i++) {
    const errorText = await errorElements[i].textContent();
    console.log(`Error ${i}: ${errorText}`);
  }
  
  // Final error summary
  console.log('\n=== Final Error Summary ===');
  console.log('Console errors:', consoleErrors.length);
  consoleErrors.forEach((err, i) => console.log(`  ${i + 1}. ${err}`));
  console.log('Page errors:', pageErrors.length);
  pageErrors.forEach((err, i) => console.log(`  ${i + 1}. ${err}`));
  
  // Take final screenshot
  await authenticatedPage.screenshot({ path: 'test-results/form-with-errors.png', fullPage: true });
  
  // Wait to see results
  await authenticatedPage.waitForTimeout(5000);
});
