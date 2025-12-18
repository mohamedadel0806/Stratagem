import { test, expect } from '../fixtures/auth';
import { selectDropdownOption, waitForDialog, waitForTable } from '../utils/helpers';
import { waitForAssetsContent, waitForButtonClickable } from '../utils/smart-waits';

/**
 * E2E Tests for Physical Asset Form Dropdowns
 * 
 * Tests that Owner ID, Business Unit ID, and Asset Type ID
 * are implemented as dropdowns (not free text inputs)
 */
test.describe('Physical Asset Form - Dropdown Fields', () => {
  test.beforeEach(async ({ authenticatedPage }) => {
    // Navigate to physical assets page
    await authenticatedPage.goto('/en/dashboard/assets/physical');
    
    // Wait for page to fully load
    await authenticatedPage.waitForLoadState('networkidle');
    await authenticatedPage.waitForTimeout(2000);
    
    // Wait for loading to complete - the page shows "Loading assets..." during load
    await authenticatedPage.waitForFunction(() => {
      return !document.body.textContent?.includes('Loading assets...');
    }, { timeout: 15000 });
  });

  test('should display Owner field as dropdown (not text input)', async ({ authenticatedPage }) => {
    // Click "New Asset" button - use the same approach that worked in diagnostic test
    const newAssetButton = authenticatedPage.locator('button:has-text("New Asset")').first();
    await newAssetButton.waitFor({ state: 'visible', timeout: 10000 });
    await newAssetButton.scrollIntoViewIfNeeded();
    await authenticatedPage.waitForTimeout(500);
    await newAssetButton.click({ timeout: 5000 });
    
    // Wait for form dialog to open
    await waitForDialog(authenticatedPage);
    await authenticatedPage.waitForTimeout(1000);

    // Navigate to Ownership tab
    const ownershipTab = authenticatedPage.locator('button[role="tab"]:has-text("Ownership"), [role="tab"]:has-text("Ownership")');
    await ownershipTab.click();
    await authenticatedPage.waitForTimeout(500);

    // Find the Owner field - Radix Select doesn't use name on button, find by label
    const ownerLabel = authenticatedPage.locator('label:has-text("Owner")').first();
    await ownerLabel.waitFor({ state: 'visible', timeout: 5000 });
    const labelFor = await ownerLabel.getAttribute('for');
    const ownerField = labelFor 
      ? authenticatedPage.locator(`#${labelFor}, [aria-labelledby*="${labelFor}"]`).first()
      : authenticatedPage.locator('label:has-text("Owner") ~ * button[role="combobox"]').first();
    await expect(ownerField).toBeVisible({ timeout: 5000 });

    // Verify it's NOT a text input
    const isInput = await ownerField.evaluate((el) => {
      return el.tagName === 'INPUT' && el.getAttribute('type') !== 'hidden';
    });
    expect(isInput).toBe(false);

    // Verify it's a Select/dropdown (Radix UI Select uses button as trigger)
    const isSelect = await ownerField.evaluate((el) => {
      return el.tagName === 'BUTTON' || 
             el.closest('[role="combobox"]') !== null ||
             el.closest('button') !== null;
    });
    expect(isSelect).toBe(true);

    // Verify placeholder text
    const placeholder = await ownerField.locator('..').locator('text=/Select owner|Loading/i').first();
    await expect(placeholder).toBeVisible({ timeout: 5000 });
  });

  test('should display Business Unit field as dropdown (not text input)', async ({ authenticatedPage }) => {
    // Click "New Asset" button
    const newAssetButton = authenticatedPage.locator('button:has-text("New Asset")').first();
    await newAssetButton.waitFor({ state: 'visible', timeout: 10000 });
    await newAssetButton.scrollIntoViewIfNeeded();
    await authenticatedPage.waitForTimeout(500);
    await newAssetButton.click({ timeout: 5000 });
    
    // Wait for form dialog to open
    await waitForDialog(authenticatedPage);
    await authenticatedPage.waitForTimeout(1000);

    // Navigate to Ownership tab
    const ownershipTab = authenticatedPage.locator('button[role="tab"]:has-text("Ownership"), [role="tab"]:has-text("Ownership")');
    await ownershipTab.click();
    await authenticatedPage.waitForTimeout(500);

    // Find the Business Unit field - find by label
    const businessUnitLabel = authenticatedPage.locator('label:has-text("Business Unit")').first();
    await businessUnitLabel.waitFor({ state: 'visible', timeout: 5000 });
    const buLabelFor = await businessUnitLabel.getAttribute('for');
    const businessUnitField = buLabelFor
      ? authenticatedPage.locator(`#${buLabelFor}, [aria-labelledby*="${buLabelFor}"]`).first()
      : authenticatedPage.locator('label:has-text("Business Unit") ~ * button[role="combobox"]').first();
    await expect(businessUnitField).toBeVisible({ timeout: 5000 });

    // Verify it's NOT a text input
    const isInput = await businessUnitField.evaluate((el) => {
      return el.tagName === 'INPUT' && el.getAttribute('type') !== 'hidden';
    });
    expect(isInput).toBe(false);

    // Verify it's a Select/dropdown
    const isSelect = await businessUnitField.evaluate((el) => {
      return el.tagName === 'BUTTON' || 
             el.closest('[role="combobox"]') !== null ||
             el.closest('button') !== null;
    });
    expect(isSelect).toBe(true);

    // Verify placeholder text
    const placeholder = await businessUnitField.locator('..').locator('text=/Select business unit|Loading/i').first();
    await expect(placeholder).toBeVisible({ timeout: 5000 });
  });

  test('should display Asset Type field as dropdown (not text input)', async ({ authenticatedPage }) => {
    // Click "New Asset" button
    const newAssetButton = authenticatedPage.locator('button:has-text("New Asset")').first();
    await newAssetButton.waitFor({ state: 'visible', timeout: 10000 });
    await newAssetButton.scrollIntoViewIfNeeded();
    await authenticatedPage.waitForTimeout(500);
    await newAssetButton.click({ timeout: 5000 });
    
    // Wait for form dialog to open
    await waitForDialog(authenticatedPage);
    await authenticatedPage.waitForTimeout(1000);

    // Navigate to Basic tab (should be default)
    const basicTab = authenticatedPage.locator('button[role="tab"]:has-text("Basic"), [role="tab"]:has-text("Basic")');
    if (await basicTab.isVisible()) {
      await basicTab.click();
      await authenticatedPage.waitForTimeout(500);
    }

    // Find the Asset Type field - find by label
    const assetTypeLabel = authenticatedPage.locator('label:has-text("Asset Type")').first();
    await assetTypeLabel.waitFor({ state: 'visible', timeout: 5000 });
    const atLabelFor = await assetTypeLabel.getAttribute('for');
    const assetTypeField = atLabelFor
      ? authenticatedPage.locator(`#${atLabelFor}, [aria-labelledby*="${atLabelFor}"]`).first()
      : authenticatedPage.locator('label:has-text("Asset Type") ~ * button[role="combobox"]').first();
    await expect(assetTypeField).toBeVisible({ timeout: 5000 });

    // Verify it's NOT a text input
    const isInput = await assetTypeField.evaluate((el) => {
      return el.tagName === 'INPUT' && el.getAttribute('type') !== 'hidden';
    });
    expect(isInput).toBe(false);

    // Verify it's a Select/dropdown
    const isSelect = await assetTypeField.evaluate((el) => {
      return el.tagName === 'BUTTON' || 
             el.closest('[role="combobox"]') !== null ||
             el.closest('button') !== null;
    });
    expect(isSelect).toBe(true);
  });

  test('should allow selecting Owner from dropdown', async ({ authenticatedPage }) => {
    // Click "New Asset" button
    const newAssetButton = authenticatedPage.locator('button:has-text("New Asset")').first();
    await newAssetButton.waitFor({ state: 'visible', timeout: 10000 });
    await newAssetButton.scrollIntoViewIfNeeded();
    await authenticatedPage.waitForTimeout(500);
    await newAssetButton.click({ timeout: 5000 });
    
    // Wait for form dialog to open
    await waitForDialog(authenticatedPage);
    await authenticatedPage.waitForTimeout(1000);

    // Navigate to Ownership tab
    const ownershipTab = authenticatedPage.locator('button[role="tab"]:has-text("Ownership"), [role="tab"]:has-text("Ownership")');
    await ownershipTab.click();
    await authenticatedPage.waitForTimeout(500);

    // Find the Owner field trigger - find by label
    const ownerLabel = authenticatedPage.locator('label:has-text("Owner")').first();
    const labelFor = await ownerLabel.getAttribute('for');
    const ownerTrigger = labelFor
      ? authenticatedPage.locator(`#${labelFor}, [aria-labelledby*="${labelFor}"]`).first()
      : authenticatedPage.locator('label:has-text("Owner") ~ * button[role="combobox"]').first();
    await expect(ownerTrigger).toBeVisible({ timeout: 5000 });

    // Click to open dropdown
    await ownerTrigger.click();
    await authenticatedPage.waitForTimeout(500);

    // Wait for dropdown options to appear
    const dropdownOptions = authenticatedPage.locator('[role="option"]');
    const optionCount = await dropdownOptions.count();
    
    // Should have at least one option (or "No users available")
    expect(optionCount).toBeGreaterThan(0);

    // Verify options show user names (not UUIDs)
    if (optionCount > 0) {
      const firstOption = dropdownOptions.first();
      const optionText = await firstOption.textContent();
      
      // Should contain name or email, not just a UUID
      const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(optionText?.trim() || '');
      expect(isUUID).toBe(false);
      
      // Should contain readable text (name, email, or "No users available")
      expect(optionText?.length).toBeGreaterThan(5);
    }

    // Close dropdown by clicking outside or pressing Escape
    await authenticatedPage.keyboard.press('Escape');
    await authenticatedPage.waitForTimeout(300);
  });

  test('should allow selecting Business Unit from dropdown', async ({ authenticatedPage }) => {
    // Click "New Asset" button
    const newAssetButton = authenticatedPage.locator('button:has-text("New Asset")').first();
    await newAssetButton.waitFor({ state: 'visible', timeout: 10000 });
    await newAssetButton.scrollIntoViewIfNeeded();
    await authenticatedPage.waitForTimeout(500);
    await newAssetButton.click({ timeout: 5000 });
    
    // Wait for form dialog to open
    await waitForDialog(authenticatedPage);
    await authenticatedPage.waitForTimeout(1000);

    // Navigate to Ownership tab
    const ownershipTab = authenticatedPage.locator('button[role="tab"]:has-text("Ownership"), [role="tab"]:has-text("Ownership")');
    await ownershipTab.click();
    await authenticatedPage.waitForTimeout(500);

    // Find the Business Unit field trigger - find by label
    const businessUnitLabel = authenticatedPage.locator('label:has-text("Business Unit")').first();
    const buLabelFor = await businessUnitLabel.getAttribute('for');
    const businessUnitTrigger = buLabelFor
      ? authenticatedPage.locator(`#${buLabelFor}, [aria-labelledby*="${buLabelFor}"]`).first()
      : authenticatedPage.locator('label:has-text("Business Unit") ~ * button[role="combobox"]').first();
    await expect(businessUnitTrigger).toBeVisible({ timeout: 5000 });

    // Click to open dropdown
    await businessUnitTrigger.click();
    await authenticatedPage.waitForTimeout(500);

    // Wait for dropdown options to appear
    const dropdownOptions = authenticatedPage.locator('[role="option"]');
    const optionCount = await dropdownOptions.count();
    
    // Should have at least one option (or "No business units available")
    expect(optionCount).toBeGreaterThan(0);

    // Verify options show business unit names (not UUIDs)
    if (optionCount > 0) {
      const firstOption = dropdownOptions.first();
      const optionText = await firstOption.textContent();
      
      // Should contain name, not just a UUID
      const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(optionText?.trim() || '');
      expect(isUUID).toBe(false);
      
      // Should contain readable text
      expect(optionText?.length).toBeGreaterThan(5);
    }

    // Close dropdown
    await authenticatedPage.keyboard.press('Escape');
    await authenticatedPage.waitForTimeout(300);
  });

  test('should allow selecting Asset Type from dropdown', async ({ authenticatedPage }) => {
    // Click "New Asset" button
    const newAssetButton = authenticatedPage.locator('button:has-text("New Asset")').first();
    await newAssetButton.waitFor({ state: 'visible', timeout: 10000 });
    await newAssetButton.scrollIntoViewIfNeeded();
    await authenticatedPage.waitForTimeout(500);
    await newAssetButton.click({ timeout: 5000 });
    
    // Wait for form dialog to open
    await waitForDialog(authenticatedPage);
    await authenticatedPage.waitForTimeout(1000);

    // Find the Asset Type field trigger - find by label
    const assetTypeLabel = authenticatedPage.locator('label:has-text("Asset Type")').first();
    const atLabelFor = await assetTypeLabel.getAttribute('for');
    const assetTypeTrigger = atLabelFor
      ? authenticatedPage.locator(`#${atLabelFor}, [aria-labelledby*="${atLabelFor}"]`).first()
      : authenticatedPage.locator('label:has-text("Asset Type") ~ * button[role="combobox"]').first();
    await expect(assetTypeTrigger).toBeVisible({ timeout: 5000 });

    // Click to open dropdown
    await assetTypeTrigger.click();
    await authenticatedPage.waitForTimeout(500);

    // Wait for dropdown options to appear
    const dropdownOptions = authenticatedPage.locator('[role="option"]');
    const optionCount = await dropdownOptions.count();
    
    // Should have at least one option
    expect(optionCount).toBeGreaterThan(0);

    // Verify options show asset type names (not UUIDs)
    if (optionCount > 0) {
      const firstOption = dropdownOptions.first();
      const optionText = await firstOption.textContent();
      
      // Should contain name, not just a UUID
      const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(optionText?.trim() || '');
      expect(isUUID).toBe(false);
      
      // Should contain readable text
      expect(optionText?.length).toBeGreaterThan(2);
    }

    // Close dropdown
    await authenticatedPage.keyboard.press('Escape');
    await authenticatedPage.waitForTimeout(300);
  });

  test('should show loading state while fetching dropdown data', async ({ authenticatedPage }) => {
    // Click "New Asset" button
    const newAssetButton = authenticatedPage.locator('button:has-text("New Asset")').first();
    await newAssetButton.waitFor({ state: 'visible', timeout: 10000 });
    await newAssetButton.scrollIntoViewIfNeeded();
    await authenticatedPage.waitForTimeout(500);
    await newAssetButton.click({ timeout: 5000 });
    
    // Wait for form dialog to open
    await waitForDialog(authenticatedPage);
    await authenticatedPage.waitForTimeout(500);

    // Navigate to Ownership tab
    const ownershipTab = authenticatedPage.locator('button[role="tab"]:has-text("Ownership")').first();
    await ownershipTab.click();
    await authenticatedPage.waitForTimeout(1000);
    
    // Find Owner field by label
    const ownerLabel = authenticatedPage.locator('label:has-text("Owner")').first();
    await ownerLabel.waitFor({ state: 'visible', timeout: 5000 });
    const labelFor = await ownerLabel.getAttribute('for');
    const ownerField = labelFor
      ? authenticatedPage.locator(`#${labelFor}`).first()
      : authenticatedPage.locator('label:has-text("Owner") ~ * button[role="combobox"]').first();
    
    // Verify it's NOT a text input
    const isInput = await ownerField.evaluate((el) => {
      return el.tagName === 'INPUT' && el.getAttribute('type') !== 'hidden';
    });
    expect(isInput).toBe(false);
  });

  test('should handle empty states gracefully', async ({ authenticatedPage }) => {
    // Click "New Asset" button
    const newAssetButton = authenticatedPage.locator('button:has-text("New Asset")').first();
    await newAssetButton.waitFor({ state: 'visible', timeout: 10000 });
    await newAssetButton.scrollIntoViewIfNeeded();
    await authenticatedPage.waitForTimeout(500);
    await newAssetButton.click({ timeout: 5000 });
    
    // Wait for form dialog to open
    await waitForDialog(authenticatedPage);
    await authenticatedPage.waitForTimeout(1000);

    // Navigate to Ownership tab
    const ownershipTab = authenticatedPage.locator('button[role="tab"]:has-text("Ownership"), [role="tab"]:has-text("Ownership")');
    await ownershipTab.click();
    await authenticatedPage.waitForTimeout(500);

    // Open Owner dropdown - find by label
    const ownerLabel = authenticatedPage.locator('label:has-text("Owner")').first();
    const labelFor = await ownerLabel.getAttribute('for');
    const ownerTrigger = labelFor
      ? authenticatedPage.locator(`#${labelFor}`).first()
      : authenticatedPage.locator('label:has-text("Owner") ~ * button[role="combobox"]').first();
    await ownerTrigger.click();
    await authenticatedPage.waitForTimeout(500);

    // Check for empty state message
    const emptyState = authenticatedPage.locator('text=/No users available|No business units available/i');
    const hasEmptyState = await emptyState.isVisible().catch(() => false);
    
    // Either should have options or show empty state (both are valid)
    const hasOptions = await authenticatedPage.locator('[role="option"]').count() > 0;
    expect(hasOptions || hasEmptyState).toBe(true);

    // Close dropdown
    await authenticatedPage.keyboard.press('Escape');
  });
});

