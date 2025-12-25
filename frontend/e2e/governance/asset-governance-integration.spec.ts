import { test } from '../fixtures/auth-storage';
import { expect } from '@playwright/test';
import { ControlsPage } from '../pages/controls.page';
import { TEST_STATUS, TEST_CONTROL_TYPE, TEST_IMPLEMENTATION_STATUS } from '../constants';
import { generateUniqueIdentifier, generateUniqueName, getTodayDate } from '../form-helpers';
import { navigateToAssetsPage } from '../utils/helpers';

test.describe('Asset-Governance Integration E2E Tests', () => {
  let controlsPage: ControlsPage;

  test.beforeEach(async ({ authenticatedPage }) => {
    controlsPage = new ControlsPage(authenticatedPage);
    await controlsPage.goto();
  });

  test('should link control to assets from governance side', async ({ authenticatedPage }) => {
    const controlTitle = generateUniqueName('Asset Control');
    const controlIdentifier = generateUniqueIdentifier('ASSET-CTRL');

    await controlsPage.openCreateForm();
    await controlsPage.fillForm({
      identifier: controlIdentifier,
      title: controlTitle,
      description: 'Test control for asset linking',
      status: TEST_STATUS.ACTIVE,
      controlType: TEST_CONTROL_TYPE.PREVENTIVE,
      implementationStatus: TEST_IMPLEMENTATION_STATUS.NOT_IMPLEMENTED,
    });
    await controlsPage.submitForm();

    await controlsPage.goto();
    await controlsPage.viewControl(controlTitle);

    const linkedAssetsTab = authenticatedPage.getByRole('tab', { name: /Linked Assets/i }).first();
    await expect(linkedAssetsTab).toBeVisible({ timeout: 10000 });
    await linkedAssetsTab.click();

    const linkAssetsButton = authenticatedPage.getByRole('button', { name: /Link Assets|Add Assets/i }).first();
    await expect(linkAssetsButton).toBeVisible({ timeout: 5000 });

    await linkAssetsButton.click();

    await expect(authenticatedPage.getByRole('dialog', { name: /Link Assets|Select Assets/i })).toBeVisible({ timeout: 5000 });

    const assetTypeFilter = authenticatedPage.getByLabel(/Asset Type|Type/i).or(authenticatedPage.locator('select[name="asset_type"]'));
    await expect(assetTypeFilter).toBeVisible({ timeout: 5000 });
    await assetTypeFilter.click();
    await authenticatedPage.getByRole('option', { name: /Physical Asset|Business Application/i }).first().click();

    const searchInput = authenticatedPage.getByPlaceholder(/Search/i).or(authenticatedPage.locator('input[type="search"], input[name="search"]'));
    await searchInput.fill('test');

    const assetCheckboxes = authenticatedPage.locator('input[type="checkbox"]');
    await expect(assetCheckboxes.first()).toBeVisible({ timeout: 10000 });
    await assetCheckboxes.first().check();

    const implementationDateInput = authenticatedPage.getByLabel(/Implementation Date/i).or(authenticatedPage.locator('input[type="date"][name*="implementation_date"]'));
    await expect(implementationDateInput).toBeVisible({ timeout: 5000 });
    await implementationDateInput.fill(getTodayDate());

    const implementationNotes = authenticatedPage.getByLabel(/Implementation Notes|Notes/i).or(authenticatedPage.locator('textarea[name*="implementation_notes"]'));
    await implementationNotes.fill('Test implementation notes');

    const confirmButton = authenticatedPage.getByRole('button', { name: /Link|Save/i });
    await confirmButton.click();

    await expect(authenticatedPage.getByText(/Assets linked|Linking successful/i)).toBeVisible({ timeout: 10000 });
  });

  test('should view linked assets on control details', async ({ authenticatedPage }) => {
    await authenticatedPage.locator('table tbody tr').first().click();
    await authenticatedPage.waitForURL(/\/controls\/[^/]+/, { timeout: 10000 });


    const linkedAssetsTab = authenticatedPage.getByRole('tab', { name: /Linked Assets/i }).first();
    await expect(linkedAssetsTab).toBeVisible({ timeout: 10000 });
    await linkedAssetsTab.click();


    const assetsSection = authenticatedPage.locator('[data-testid="linked-assets-section"], [data-testid="linked-assets-list"]').first();
    await expect(assetsSection).toBeVisible({ timeout: 10000 });
  });

  test('should set implementation details for each asset', async ({ authenticatedPage }) => {
    await authenticatedPage.locator('table tbody tr').first().click();
    await authenticatedPage.getByRole('tab', { name: /Linked Assets/i }).click();

    const assetRows = authenticatedPage.locator('[data-testid^="linked-asset-row-"], table tbody tr');
    await expect(assetRows.first()).toBeVisible({ timeout: 10000 });
    await assetRows.first().click();

    const implementationStatusSelect = authenticatedPage.getByLabel(/Implementation Status/i).or(authenticatedPage.locator('select[name*="implementation_status"]'));
    await expect(implementationStatusSelect).toBeVisible({ timeout: 5000 });
    await implementationStatusSelect.click();
    await authenticatedPage.getByRole('option', { name: /Implemented|Partial/i }).first().click();

    const saveDetailsButton = authenticatedPage.getByRole('button', { name: /Save Details|Update/i }).first();
    await saveDetailsButton.click();
    await expect(authenticatedPage.getByText(/Implementation details saved|Updated/i)).toBeVisible({ timeout: 10000 });
  });

  test('should navigate from control to asset details', async ({ authenticatedPage }) => {
    await authenticatedPage.locator('table tbody tr').first().click();
    await authenticatedPage.getByRole('tab', { name: /Linked Assets/i }).click();

    const assetLink = authenticatedPage.locator('[data-testid^="linked-asset-row-"]').first().locator('a[href*="/assets"], a[href*="/dashboard/assets"]');
    const hasLink = await assetLink.count() > 0;

    if (hasLink) {
      await assetLink.click();

      await expect(authenticatedPage.url()).toMatch(/\/assets\//);
    }
  });

  test('should view linked controls from asset side', async ({ authenticatedPage }) => {
    await navigateToAssetsPage(authenticatedPage, 'physical-assets');


    const assetRows = await authenticatedPage.locator('table tbody tr').count();

    if (assetRows > 0) {
      await authenticatedPage.locator('table tbody tr').first().click();
      await authenticatedPage.waitForURL(/\/assets\//, { timeout: 10000 });


      const governanceTab = authenticatedPage.getByRole('tab', { name: /Governance/i }).first();
      await expect(governanceTab).toBeVisible({ timeout: 10000 });
      await governanceTab.click();

      const linkedControlsSection = authenticatedPage.locator('[data-testid="linked-controls-section"], [data-testid="governance-controls"]').first();
      await expect(linkedControlsSection).toBeVisible({ timeout: 10000 });
    }
  });

  test('should display compliance status for asset', async ({ authenticatedPage }) => {
    await navigateToAssetsPage(authenticatedPage, 'physical-assets');

    const assetRows = await authenticatedPage.locator('table tbody tr').count();

    if (assetRows > 0) {
      await authenticatedPage.locator('table tbody tr').first().click();
      await authenticatedPage.waitForURL(/\/assets\//, { timeout: 10000 });
      await authenticatedPage.getByRole('tab', { name: /Governance/i }).click();

      const complianceStatus = authenticatedPage.locator('[data-testid="compliance-status"], [data-testid="compliance-indicator"]').first();
      await expect(complianceStatus).toBeVisible({ timeout: 10000 });

      const controlsAssigned = authenticatedPage.locator('[data-testid="controls-assigned-count"]');
      const controlsImplemented = authenticatedPage.locator('[data-testid="controls-implemented-count"]');
      const controlsPassed = authenticatedPage.locator('[data-testid="controls-passed-count"]');

      const anyVisible = await Promise.all([
        controlsAssigned.isVisible(),
        controlsImplemented.isVisible(),
        controlsPassed.isVisible(),
      ]);

      expect(anyVisible.some(Boolean)).toBeTruthy();
    }
  });

  test('should unlink asset from control', async ({ authenticatedPage }) => {
    await authenticatedPage.locator('table tbody tr').first().click();
    await authenticatedPage.getByRole('tab', { name: /Linked Assets/i }).click();

    const assetRows = await authenticatedPage.locator('[data-testid^="linked-asset-row-"]').count();

    if (assetRows > 0) {
      const unlinkButton = authenticatedPage.locator('[data-testid^="linked-asset-row-"]').first()
        .locator('button[aria-label="Unlink"], button[data-testid*="unlink"], button[data-testid*="delete"]');

      const hasUnlinkButton = await unlinkButton.count() > 0;

      if (hasUnlinkButton) {
        await unlinkButton.click();

        if (await authenticatedPage.locator('dialog').isVisible({ timeout: 3000 })) {
          await authenticatedPage.getByRole('button', { name: /Confirm|Yes/i }).click();
        }


        await expect(authenticatedPage.getByText(/Asset unlinked|Link removed/i)).toBeVisible({ timeout: 10000 });
      }
    }
  });

  test('should filter linked assets by implementation status', async ({ authenticatedPage }) => {
    await authenticatedPage.locator('table tbody tr').first().click();
    await authenticatedPage.getByRole('tab', { name: /Linked Assets/i }).click();

    const statusFilter = authenticatedPage.getByLabel(/Status|Implementation Status/i).or(authenticatedPage.locator('select[name*="status"]'));
    const hasFilter = await statusFilter.count() > 0;

    if (hasFilter) {
      await statusFilter.click();
      await authenticatedPage.getByRole('option', { name: 'Implemented' }).click();


      const statusIndicator = authenticatedPage.locator('[data-testid="filter-status-implemented"]');
      await expect(statusIndicator).toBeVisible({ timeout: 5000 });
    }
  });

  test('should display summary metrics for linked assets', async ({ authenticatedPage }) => {
    await authenticatedPage.locator('table tbody tr').first().click();
    await authenticatedPage.getByRole('tab', { name: /Linked Assets/i }).click();

    const summarySection = authenticatedPage.locator('[data-testid="linked-assets-summary"], [data-testid="assets-summary"]');
    const hasSummary = await summarySection.count() > 0;

    if (hasSummary) {
      await expect(summarySection).toBeVisible({ timeout: 10000 });

      const totalAssets = authenticatedPage.locator('[data-testid="total-assets-count"]');
      const implementedAssets = authenticatedPage.locator('[data-testid="implemented-assets-count"]');
      const pendingAssets = authenticatedPage.locator('[data-testid="pending-assets-count"]');

      const anyMetricVisible = await Promise.all([
        totalAssets.isVisible(),
        implementedAssets.isVisible(),
        pendingAssets.isVisible(),
      ]);

      expect(anyMetricVisible.some(Boolean)).toBeTruthy();
    }
  });
});
