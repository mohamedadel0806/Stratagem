import { Page, expect } from '@playwright/test';
import {
  waitForTable,
  selectDropdownOption,
  waitForDialog,
  waitForToast,
  generateRandomString
} from './helpers';
import {
  generatePhysicalAssetData,
  generateInformationAssetData,
  generateSoftwareAssetData,
  generateBusinessApplicationData,
  generateSupplierData
} from '../fixtures/assets-data';

/**
 * Helper functions specific to asset testing
 */

/**
 * Create a physical asset with given data or generated data
 */
export async function createPhysicalAsset(
  page: Page,
  data?: ReturnType<typeof generatePhysicalAssetData>
): Promise<string> {
  const assetData = data || generatePhysicalAssetData();

  await page.goto('/dashboard/assets/physical');
  await waitForTable(page);

  await page.click('button:has-text("Add New Asset"), button:has-text("Create")');
  await waitForDialog(page);

  // Fill basic information
  await page.fill('input[name="assetDescription"]', assetData.basic.assetDescription);
  await page.fill('input[name="uniqueIdentifier"]', assetData.basic.uniqueIdentifier);

  // Set asset type if dropdown exists
  const assetTypeField = page.locator('select[name="assetType"], [data-testid="assetType"]').first();
  if (await assetTypeField.isVisible()) {
    await selectDropdownOption(page, assetTypeField, assetData.basic.assetType);
  }

  // Set criticality level if dropdown exists
  const criticalityField = page.locator('select[name="criticalityLevel"], [data-testid="criticalityLevel"]').first();
  if (await criticalityField.isVisible()) {
    await selectDropdownOption(page, criticalityField, assetData.basic.criticalityLevel);
  }

  // Navigate to Location tab and fill location data
  const locationTab = page.locator('button:has-text("Location")').first();
  if (await locationTab.isVisible()) {
    await locationTab.click();
    await page.waitForTimeout(500);

    const buildingInput = page.locator('input[name*="building"], input[placeholder*="Building"]').first();
    if (await buildingInput.isVisible()) {
      await buildingInput.fill(assetData.location.building);
    }

    const floorInput = page.locator('input[name*="floor"], input[placeholder*="Floor"]').first();
    if (await floorInput.isVisible()) {
      await floorInput.fill(assetData.location.floor);
    }
  }

  // Navigate to Network tab and fill network data
  const networkTab = page.locator('button:has-text("Network")').first();
  if (await networkTab.isVisible()) {
    await networkTab.click();
    await page.waitForTimeout(500);

    const hostnameInput = page.locator('input[name*="hostname"], input[placeholder*="Hostname"]').first();
    if (await hostnameInput.isVisible()) {
      await hostnameInput.fill(assetData.network.hostname);
    }

    const ipInput = page.locator('input[name*="ip"], input[placeholder*="IP Address"]').first();
    if (await ipInput.isVisible()) {
      await ipInput.fill(assetData.network.ipAddress);
    }
  }

  // Submit form
  await page.click('button[type="submit"]:has-text("Create"), button:has-text("Save")');
  await page.waitForTimeout(3000);

  // Verify asset was created
  await waitForTable(page);
  await expect(page.locator(`text=${assetData.basic.assetDescription}`).first()).toBeVisible({ timeout: 10000 });

  return assetData.basic.assetDescription;
}

/**
 * Create an information asset with given data or generated data
 */
export async function createInformationAsset(
  page: Page,
  data?: ReturnType<typeof generateInformationAssetData>
): Promise<string> {
  const assetData = data || generateInformationAssetData();

  await page.goto('/dashboard/assets/information');
  await waitForTable(page);

  await page.click('button:has-text("Add New Asset"), button:has-text("Create")');
  await waitForDialog(page);

  // Fill basic information
  await page.fill('input[name="assetName"]', assetData.basic.assetName);
  await page.fill('input[name="informationType"]', assetData.basic.informationType);

  // Set data classification
  const classificationField = page.locator('button[data-testid="dataClassification"], [data-testid="dataClassification"]').first();
  if (await classificationField.isVisible()) {
    await selectDropdownOption(page, classificationField, assetData.basic.dataClassification);
  }

  // Navigate to Classification tab
  const classificationTab = page.locator('button:has-text("Classification")').first();
  if (await classificationTab.isVisible()) {
    await classificationTab.click();
    await page.waitForTimeout(500);

    // Set sensitivity checkboxes
    const piiCheckbox = page.locator('input[name*="pii"], input[name*="PII"]').first();
    if (await piiCheckbox.isVisible()) {
      if (assetData.classification.personalData) {
        await piiCheckbox.check();
      }
    }

    const financialCheckbox = page.locator('input[name*="financial"], input[name*="Financial"]').first();
    if (await financialCheckbox.isVisible()) {
      if (assetData.classification.financialData) {
        await financialCheckbox.check();
      }
    }
  }

  // Submit form
  await page.click('button[type="submit"]:has-text("Create"), button:has-text("Save")');
  await page.waitForTimeout(3000);

  // Verify asset was created
  await waitForTable(page);
  await expect(page.locator(`text=${assetData.basic.assetName}`).first()).toBeVisible({ timeout: 10000 });

  return assetData.basic.assetName;
}

/**
 * Create a software asset with given data or generated data
 */
export async function createSoftwareAsset(
  page: Page,
  data?: ReturnType<typeof generateSoftwareAssetData>
): Promise<string> {
  const assetData = data || generateSoftwareAssetData();

  await page.goto('/dashboard/assets/software');
  await waitForTable(page);

  await page.click('button:has-text("Add New Asset"), button:has-text("Create")');
  await waitForDialog(page);

  // Fill basic information
  await page.fill('input[name="softwareName"]', assetData.basic.softwareName);
  await page.fill('input[name="vendor"]', assetData.basic.vendor);
  await page.fill('input[name="version"]', assetData.basic.version);

  // Navigate to Licensing tab
  const licensingTab = page.locator('button:has-text("Licensing")').first();
  if (await licensingTab.isVisible()) {
    await licensingTab.click();
    await page.waitForTimeout(500);

    // Set license type
    const licenseTypeField = page.locator('select[name*="licenseType"], [data-testid="licenseType"]').first();
    if (await licenseTypeField.isVisible()) {
      await selectDropdownOption(page, licenseTypeField, assetData.licensing.licenseType);
    }

    // Fill license details
    const licenseKeyInput = page.locator('input[name*="licenseKey"], input[placeholder*="License Key"]').first();
    if (await licenseKeyInput.isVisible()) {
      await licenseKeyInput.fill(assetData.licensing.licenseKey);
    }

    const licenseCountInput = page.locator('input[name*="licenseCount"], input[name*="count"]').first();
    if (await licenseCountInput.isVisible()) {
      await licenseCountInput.fill(assetData.licensing.licenseCount.toString());
    }
  }

  // Submit form
  await page.click('button[type="submit"]:has-text("Create"), button:has-text("Save")');
  await page.waitForTimeout(3000);

  // Verify asset was created
  await waitForTable(page);
  await expect(page.locator(`text=${assetData.basic.softwareName}`).first()).toBeVisible({ timeout: 10000 });

  return assetData.basic.softwareName;
}

/**
 * Create a business application with given data or generated data
 */
export async function createBusinessApplication(
  page: Page,
  data?: ReturnType<typeof generateBusinessApplicationData>
): Promise<string> {
  const assetData = data || generateBusinessApplicationData();

  await page.goto('/dashboard/assets/applications');
  await waitForTable(page);

  await page.click('button:has-text("Add New Asset"), button:has-text("Create")');
  await waitForDialog(page);

  // Fill basic information
  await page.fill('input[name="applicationName"]', assetData.basic.applicationName);

  // Set application type
  const applicationTypeField = page.locator('button[data-testid="applicationType"], [data-testid="applicationType"]').first();
  if (await applicationTypeField.isVisible()) {
    await selectDropdownOption(page, applicationTypeField, assetData.basic.applicationType);
  }

  // Set status
  const statusField = page.locator('button[data-testid="status"], [data-testid="status"]').first();
  if (await statusField.isVisible()) {
    await selectDropdownOption(page, statusField, assetData.basic.status);
  }

  // Navigate to Technical tab
  const technicalTab = page.locator('button:has-text("Technical")').first();
  if (await technicalTab.isVisible()) {
    await technicalTab.click();
    await page.waitForTimeout(500);

    const urlInput = page.locator('input[name*="url"], input[placeholder*="URL"]').first();
    if (await urlInput.isVisible()) {
      await urlInput.fill(assetData.technical.url);
    }

    const frameworkInput = page.locator('input[name*="framework"], input[placeholder*="Framework"]').first();
    if (await frameworkInput.isVisible()) {
      await frameworkInput.fill(assetData.technical.framework);
    }
  }

  // Submit form
  await page.click('button[type="submit"]:has-text("Create"), button:has-text("Save")');
  await page.waitForTimeout(3000);

  // Verify asset was created
  await waitForTable(page);
  await expect(page.locator(`text=${assetData.basic.applicationName}`).first()).toBeVisible({ timeout: 10000 });

  return assetData.basic.applicationName;
}

/**
 * Create a supplier with given data or generated data
 */
export async function createSupplier(
  page: Page,
  data?: ReturnType<typeof generateSupplierData>
): Promise<string> {
  const supplierData = data || generateSupplierData();

  await page.goto('/dashboard/assets/suppliers');
  await waitForTable(page);

  await page.click('button:has-text("Add New Asset"), button:has-text("Create")');
  await waitForDialog(page);

  // Fill basic information
  await page.fill('input[name="supplierName"]', supplierData.basic.supplierName);

  // Fill contact information
  const contactNameInput = page.locator('input[name*="primaryContactName"], input[placeholder*="Contact Name"]').first();
  if (await contactNameInput.isVisible()) {
    await contactNameInput.fill(supplierData.contact.primaryContactName);
  }

  const contactEmailInput = page.locator('input[name*="primaryContactEmail"], input[placeholder*="Email"]').first();
  if (await contactEmailInput.isVisible()) {
    await contactEmailInput.fill(supplierData.contact.primaryContactEmail);
  }

  // Submit form
  await page.click('button[type="submit"]:has-text("Create"), button:has-text("Save")');
  await page.waitForTimeout(3000);

  // Verify supplier was created
  await waitForTable(page);
  await expect(page.locator(`text=${supplierData.basic.supplierName}`).first()).toBeVisible({ timeout: 10000 });

  return supplierData.basic.supplierName;
}

/**
 * Edit an existing asset
 */
export async function editAsset(
  page: Page,
  assetName: string,
  assetType: 'physical' | 'information' | 'software' | 'applications' | 'suppliers',
  updateData: Record<string, any>
): Promise<void> {
  await page.goto(`/dashboard/assets/${assetType}`);
  await waitForTable(page);

  // Search for the asset
  await page.fill('input[type="search"], input[placeholder*="Search"]', assetName);
  await page.press('input[type="search"], input[placeholder*="Search"]', 'Enter');
  await page.waitForTimeout(1000);

  // Find and click edit button
  const editButton = page.locator('button[aria-label*="Edit"], button:has-text("Edit")').first();
  await expect(editButton).toBeVisible({ timeout: 5000 });
  await editButton.click();

  await waitForDialog(page);

  // Apply updates based on provided data
  for (const [fieldName, value] of Object.entries(updateData)) {
    const field = page.locator(`input[name="${fieldName}"], textarea[name="${fieldName}"]`).first();
    if (await field.isVisible()) {
      await field.fill(String(value));
    }
  }

  // Save changes
  await page.click('button[type="submit"]:has-text("Save"), button:has-text("Update")');
  await page.waitForTimeout(3000);
}

/**
 * Delete an existing asset
 */
export async function deleteAsset(
  page: Page,
  assetName: string,
  assetType: 'physical' | 'information' | 'software' | 'applications' | 'suppliers'
): Promise<void> {
  await page.goto(`/dashboard/assets/${assetType}`);
  await waitForTable(page);

  // Search for the asset
  await page.fill('input[type="search"], input[placeholder*="Search"]', assetName);
  await page.press('input[type="search"], input[placeholder*="Search"]', 'Enter');
  await page.waitForTimeout(1000);

  // Find and click delete button
  const deleteButton = page.locator('button[aria-label*="Delete"], button:has-text("Delete")').first();
  await expect(deleteButton).toBeVisible({ timeout: 5000 });
  await deleteButton.click();

  // Handle confirmation dialog
  await page.waitForSelector('[role="dialog"], .modal', { timeout: 5000 });

  const confirmButton = page.locator('button:has-text("Delete"), button:has-text("Confirm"), button[aria-label*="Confirm"]').first();
  await confirmButton.click();

  await page.waitForTimeout(2000);

  // Verify asset is deleted
  await waitForTable(page);
  await expect(page.locator(`text=${assetName}`)).not.toBeVisible({ timeout: 10000 });
}

/**
 * Navigate to asset details page
 */
export async function navigateToAssetDetails(
  page: Page,
  assetName: string,
  assetType: 'physical' | 'information' | 'software' | 'applications' | 'suppliers'
): Promise<void> {
  await page.goto(`/dashboard/assets/${assetType}`);
  await waitForTable(page);

  // Search for the asset
  await page.fill('input[type="search"], input[placeholder*="Search"]', assetName);
  await page.press('input[type="search"], input[placeholder*="Search"]', 'Enter');
  await page.waitForTimeout(1000);

  // Click on the asset to view details
  const assetLink = page.locator(`text=${assetName}`).first();
  await assetLink.click();
  await page.waitForTimeout(2000);

  // Verify we're on the details page
  await expect(page.locator('text=Details, text=Information, h1').first()).toBeVisible({ timeout: 5000 });
}

/**
 * Add dynamic field to form (for MAC addresses, IP addresses, etc.)
 */
export async function addDynamicField(
  page: Page,
  fieldLabel: string,
  value: string
): Promise<void> {
  const addButton = page.locator(`button:has-text("Add ${fieldLabel}"), button:has-text("Add ${fieldLabel}")`).first();

  if (await addButton.isVisible()) {
    await addButton.click();
    await page.waitForTimeout(500);

    const newField = page.locator(`input[name*="${fieldLabel.toLowerCase()}"], input[placeholder*="${fieldLabel}"]`).last();
    if (await newField.isVisible()) {
      await newField.fill(value);
    }
  }
}

/**
 * Remove dynamic field from form
 */
export async function removeDynamicField(
  page: Page,
  fieldLabel: string,
  index: number = 0
): Promise<void> {
  const removeButtons = page.locator(`button:has-text("Remove"), button[aria-label*="Remove"]`).all();

  if (removeButtons.length > index) {
    await removeButtons[index].click();
    await page.waitForTimeout(500);
  }
}

/**
 * Verify form validation error is displayed
 */
export async function expectValidationError(
  page: Page,
  expectedErrorMessage: string,
  timeout: number = 5000
): Promise<void> {
  await expect(
    page.locator(`text=${expectedErrorMessage}, text=${expectedErrorMessage.toLowerCase()}, text=${expectedErrorMessage.replace(/\s+/g, '\\s*')}`)
  ).toBeVisible({ timeout });
}

/**
 * Wait for toast notification with specific message
 */
export async function waitForToastNotification(
  page: Page,
  message: string,
  timeout: number = 5000
): Promise<void> {
  await expect(
    page.locator('[role="status"], .toast, [data-testid="toast"]').locator(`text=${message}`)
  ).toBeVisible({ timeout });
}

/**
 * Fill form with provided field data
 */
export async function fillAssetForm(
  page: Page,
  fieldData: Record<string, string | number | boolean>
): Promise<void> {
  for (const [fieldName, value] of Object.entries(fieldData)) {
    const field = page.locator(`input[name="${fieldName}"], textarea[name="${fieldName}"], select[name="${fieldName}"]`).first();

    if (await field.isVisible()) {
      const fieldType = await field.getAttribute('type');
      const tagName = await field.evaluate(el => el.tagName.toLowerCase());

      if (tagName === 'select') {
        await field.selectOption(String(value));
      } else if (fieldType === 'checkbox') {
        const isChecked = await field.isChecked();
        if (value !== isChecked) {
          await field.click();
        }
      } else {
        await field.fill(String(value));
      }
    }
  }
}

/**
 * Get asset count from table
 */
export async function getAssetCount(page: Page): Promise<number> {
  const rows = await page.locator('table tbody tr').count();
  return rows;
}

/**
 * Verify asset exists in table
 */
export async function verifyAssetExists(
  page: Page,
  assetName: string,
  timeout: number = 10000
): Promise<boolean> {
  try {
    await expect(page.locator(`text=${assetName}`).first()).toBeVisible({ timeout });
    return true;
  } catch (error) {
    return false;
  }
}

export default {
  createPhysicalAsset,
  createInformationAsset,
  createSoftwareAsset,
  createBusinessApplication,
  createSupplier,
  editAsset,
  deleteAsset,
  navigateToAssetDetails,
  addDynamicField,
  removeDynamicField,
  expectValidationError,
  waitForToastNotification,
  fillAssetForm,
  getAssetCount,
  verifyAssetExists
};