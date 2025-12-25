import { test } from '../fixtures/auth';
import { expect } from '@playwright/test';
import { AssetDetailsPage } from '../pages/asset-details.page';
import { PhysicalAssetsPage } from '../pages/assets-page';
import { TEST_TIMEOUTS, ASSET_CRITICALITY } from '../constants';
import { generateUniqueIdentifier } from '../form-helpers';

test.describe('Asset Details Exploration', () => {
  let assetPage: AssetDetailsPage;
  let physicalAssetsPage: PhysicalAssetsPage;
  let assetUrl = '';

  test('should explore physical asset details with real data', async ({ authenticatedPage }) => {
    assetPage = new AssetDetailsPage(authenticatedPage);
    physicalAssetsPage = new PhysicalAssetsPage(authenticatedPage);

    await authenticatedPage.goto('/en/dashboard/assets/physical');
    await authenticatedPage.waitForLoadState('networkidle');

    const assetSelectors = [
      '[data-testid="asset-card"]',
      '.asset-card',
      '[data-testid="asset-row"]',
      'table tbody tr',
      '[data-testid="physical-asset"]',
      '.asset-item'
    ];

    let assetFound = false;

    for (const selector of assetSelectors) {
      const assets = await authenticatedPage.locator(selector).all();
      if (assets.length > 0) {
        await assets[0].click();
        assetUrl = authenticatedPage.url();
        if (assetUrl.includes('/assets/physical/')) {
          assetFound = true;
          break;
        }
      }
    }

    if (!assetFound) {
      const uniqueId = generateUniqueIdentifier('PHYSICAL');
      await physicalAssetsPage.createPhysicalAsset(uniqueId, 'Test physical asset for E2E testing');
      assetUrl = authenticatedPage.url();
      expect(assetUrl).toContain('/assets/physical/');
    }

    await authenticatedPage.waitForLoadState('networkidle');
    await assetPage.takeScreenshot('physical-asset-details-initial');

    const availableTabs = await assetPage.getAvailableTabs();
    expect(availableTabs.length).toBeGreaterThan(0);
    expect(availableTabs).toContain('Overview');

    const allFormFields = await authenticatedPage.locator('input:not([type="search"]), textarea').all();
    const editableFields = allFormFields.filter(async (field) => {
      const isVisible = await field.isVisible();
      const isDisabled = await field.isDisabled();
      const isReadOnly = await field.getAttribute('readonly') !== null;
      return isVisible && !isDisabled && !isReadOnly;
    });

    const fieldsToEdit = [];
    for (const field of editableFields) {
      if (fieldsToEdit.length >= 2) break;
      const isVisible = await field.isVisible();
      if (isVisible) {
        fieldsToEdit.push(field);
      }
    }

    const timestamp = Date.now();
    for (let i = 0; i < fieldsToEdit.length; i++) {
      const field = fieldsToEdit[i];
      const name = await field.getAttribute('name') || '';
      const placeholder = await field.getAttribute('placeholder') || '';

      let testValue = `E2E Update ${timestamp}-${i}`;
      if (name?.toLowerCase().includes('description') || placeholder?.toLowerCase().includes('description')) {
        testValue = `Updated description for E2E testing ${timestamp}`;
      }

      await field.fill(testValue);
    }

    await assetPage.takeScreenshot('physical-asset-details-updated');

    const tabsToClick = availableTabs.slice(0, Math.min(availableTabs.length, 3));
    for (const tabName of tabsToClick) {
      if (tabName !== 'Overview') {
        await assetPage.clickTab(tabName);
        await authenticatedPage.waitForLoadState('domcontentloaded');
      }
    }

    await assetPage.takeScreenshot('physical-asset-details-final');

    expect(assetUrl).toContain('/assets/physical/');
  });
});