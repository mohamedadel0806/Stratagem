import { test, expect } from '../fixtures/auth';
import { waitForDialog } from '../utils/helpers';

/**
 * Test to fill all form tabs, submit, and verify record is created
 */
test('should fill all form tabs, submit, and verify record is created', async ({ authenticatedPage }) => {
  // Navigate to applications page
  await authenticatedPage.goto('/en/dashboard/assets/applications', { waitUntil: 'domcontentloaded' });
  await authenticatedPage.waitForTimeout(500);

  // Click "New Application" button
  const newAssetButton = authenticatedPage.locator('button:has-text("New Application")').first();
  await newAssetButton.waitFor({ state: 'visible', timeout: 3000 });
  await newAssetButton.click({ timeout: 2000 });
  
  // Wait for form dialog to open
  await waitForDialog(authenticatedPage);
  await authenticatedPage.waitForTimeout(1000);

  console.log('Form opened. Filling all tabs...');
  
  const uniqueName = `Test App ${Date.now()}`;

  // ===== BASIC INFO TAB =====
  console.log('Filling Basic Info tab...');
  await authenticatedPage.locator('input[name="applicationName"]').fill(uniqueName);
  await authenticatedPage.waitForTimeout(500);
  console.log(`✅ Application Name filled: "${uniqueName}"`);

  await authenticatedPage.locator('textarea[name="description"]').fill('Test business application for verification');
  await authenticatedPage.waitForTimeout(500);
  console.log('✅ Description filled');

  // Application Type dropdown
  await authenticatedPage.getByLabel(/Application Type/).click();
  await authenticatedPage.waitForTimeout(500);
  await authenticatedPage.locator('[role="option"]:has-text("Web Application")').first().click();
  await authenticatedPage.waitForTimeout(500);
  console.log('✅ Application Type selected');

  // Status dropdown
  await authenticatedPage.getByLabel(/Status/).click();
  await authenticatedPage.waitForTimeout(500);
  await authenticatedPage.locator('[role="option"]:has-text("Active")').first().click();
  await authenticatedPage.waitForTimeout(500);
  console.log('✅ Status selected');

  // Fill optional fields
  await authenticatedPage.locator('input[name="version"]').fill('1.0.0');
  await authenticatedPage.waitForTimeout(400);
  await authenticatedPage.locator('input[name="patchLevel"]').fill('1.0.1');
  await authenticatedPage.waitForTimeout(400);
  console.log('✅ Version and Patch Level filled');

  // Select criticality level
  await authenticatedPage.getByLabel('Criticality').click();
  await authenticatedPage.waitForTimeout(500);
  await authenticatedPage.locator('[role="option"]:has-text("High")').first().click();
  await authenticatedPage.waitForTimeout(500);
  console.log('✅ Criticality selected');

  // ===== TECHNICAL TAB =====
  console.log('Filling Technical tab...');
  const technicalTab = authenticatedPage.locator('button[role="tab"]:has-text("Technical")').first();
  await technicalTab.click();
  await authenticatedPage.waitForTimeout(500);

  // Select hosting location
  await authenticatedPage.getByLabel('Hosting Location').click();
  await authenticatedPage.waitForTimeout(500);
  await authenticatedPage.locator('[role="option"]').first().click();
  await authenticatedPage.waitForTimeout(500);
  console.log('✅ Hosting Location selected');

  // Fill technology stack
  await authenticatedPage.locator('input[name="technologyStack"]').fill('React, Node.js, PostgreSQL');
  await authenticatedPage.waitForTimeout(400);
  console.log('✅ Technology Stack filled');

  // Fill URL
  await authenticatedPage.locator('input[name="url"]').fill('https://test-app.example.com');
  await authenticatedPage.waitForTimeout(400);
  console.log('✅ URL filled');

  // Fill deployment dates
  const today = new Date().toISOString().split('T')[0];
  await authenticatedPage.locator('input[name="deploymentDate"]').fill(today);
  await authenticatedPage.waitForTimeout(400);
  await authenticatedPage.locator('input[name="lastUpdateDate"]').fill(today);
  await authenticatedPage.waitForTimeout(400);
  console.log('✅ Deployment dates filled');

  // Check data processing checkboxes
  await authenticatedPage.getByLabel('Processes PII').click();
  await authenticatedPage.waitForTimeout(400);
  await authenticatedPage.getByLabel('Processes Financial Data').click();
  await authenticatedPage.waitForTimeout(400);
  console.log('✅ Data processing checkboxes selected');

  // ===== VENDOR TAB =====
  console.log('Filling Vendor tab...');
  const vendorTab = authenticatedPage.locator('button[role="tab"]:has-text("Vendor")').first();
  await vendorTab.click();
  await authenticatedPage.waitForTimeout(500);

  await authenticatedPage.locator('input[name="vendor"]').fill('Test Vendor Corp.');
  await authenticatedPage.waitForTimeout(400);
  await authenticatedPage.locator('input[name="vendorContact"]').fill('Jane Smith');
  await authenticatedPage.waitForTimeout(400);
  await authenticatedPage.locator('input[name="vendorEmail"]').fill('vendor@testcorp.com');
  await authenticatedPage.waitForTimeout(400);
  await authenticatedPage.locator('input[name="vendorPhone"]').fill('+1-555-0456');
  await authenticatedPage.waitForTimeout(400);
  console.log('✅ Vendor information filled');

  // Select owner (in Vendor tab)
  const ownerButton = authenticatedPage.locator('button').filter({ has: authenticatedPage.locator('text="Select owner"') }).first();
  const ownerExists = await ownerButton.isVisible({ timeout: 2000 }).catch(() => false);
  
  if (ownerExists) {
    await ownerButton.click();
    await authenticatedPage.waitForTimeout(400);
    const firstOwnerOption = authenticatedPage.locator('[role="option"]').first();
    const ownerOptionExists = await firstOwnerOption.isVisible({ timeout: 2000 }).catch(() => false);
    if (ownerOptionExists) {
      const optionText = await firstOwnerOption.textContent();
      if (optionText && !optionText.toLowerCase().includes('no users')) {
        await firstOwnerOption.click();
        await authenticatedPage.waitForTimeout(400);
        console.log('✅ Owner selected');
      }
    }
  }

  // Select business unit (in Vendor tab)
  const buButton = authenticatedPage.locator('button').filter({ has: authenticatedPage.locator('text="Select business unit"') }).first();
  const buExists = await buButton.isVisible({ timeout: 2000 }).catch(() => false);
  
  if (buExists) {
    await buButton.click();
    await authenticatedPage.waitForTimeout(400);
    const firstBuOption = authenticatedPage.locator('[role="option"]').first();
    const buOptionExists = await firstBuOption.isVisible({ timeout: 2000 }).catch(() => false);
    if (buOptionExists) {
      const optionText = await firstBuOption.textContent();
      if (optionText && !optionText.toLowerCase().includes('no business unit')) {
        await firstBuOption.click();
        await authenticatedPage.waitForTimeout(400);
        console.log('✅ Business Unit selected');
      }
    }
  }

  // ===== COMPLIANCE TAB =====
  console.log('Filling Compliance tab...');
  const complianceTab = authenticatedPage.locator('button[role="tab"]:has-text("Compliance")').first();
  await complianceTab.click();
  await authenticatedPage.waitForTimeout(500);

  // Fill notes (only field in Compliance tab)
  await authenticatedPage.locator('textarea[name="notes"]').fill('Test notes for business application compliance');
  await authenticatedPage.waitForTimeout(400);
  console.log('✅ Notes filled');

  // Take screenshot before submit
  await authenticatedPage.screenshot({ path: 'test-results/form-before-submit.png', fullPage: true });
  console.log('📸 Screenshot taken before submit');

  // Find and click the Create button
  console.log('Looking for Create button...');
  await authenticatedPage.waitForTimeout(1000);
  const createButton = authenticatedPage.locator('button:has-text("Create")').first();
  const createButtonVisible = await createButton.isVisible({ timeout: 3000 }).catch(() => false);
  
  if (createButtonVisible) {
    console.log('✅ Create button found and visible');
    await createButton.scrollIntoViewIfNeeded();
    await authenticatedPage.waitForTimeout(500);
    await createButton.click();
    console.log('✅ Create button clicked');
  } else {
    throw new Error('Create button not found or not visible');
  }

  // Wait for form to close (indicates submission)
  console.log('Waiting for form submission...');
  await authenticatedPage.waitForFunction(
    () => !document.querySelector('[role="dialog"]'),
    { timeout: 10000 }
  ).catch(() => console.log('Note: Dialog may have closed'));
  
  await authenticatedPage.waitForTimeout(2000);

  // Check for success message
  const successMessage = authenticatedPage.locator('text=/success|created|saved/i').first();
  const hasSuccessMessage = await successMessage.isVisible({ timeout: 3000 }).catch(() => false);
  
  if (hasSuccessMessage) {
    console.log('✅ Success message appeared');
  }

  // Verify we're back on the applications page
  await authenticatedPage.waitForURL('**/assets/applications', { timeout: 5000 });
  console.log('✅ Returned to applications page');

  // Take screenshot after submit
  await authenticatedPage.screenshot({ path: 'test-results/form-after-submit.png', fullPage: true });

  // Search for the newly created application in the list
  console.log(`Looking for application: "${uniqueName}"`);
  const appRow = authenticatedPage.locator(`text="${uniqueName}"`).first();
  const appVisible = await appRow.isVisible({ timeout: 5000 }).catch(() => false);
  
  if (appVisible) {
    console.log('✅ Application found in list - RECORD CREATED SUCCESSFULLY!');
  } else {
    throw new Error(`Application "${uniqueName}" not found in list after creation`);
  }

  console.log('\n✅ TEST PASSED - ALL TABS FILLED AND RECORD SUCCESSFULLY CREATED!');
});
