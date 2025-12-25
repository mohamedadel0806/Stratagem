import { test } from '../fixtures/auth';
import { expect } from '@playwright/test';
import { PhysicalAssetsPage, InformationAssetsPage, SoftwareAssetsPage, SuppliersPage } from '../pages/assets-page';
import { TEST_TIMEOUTS, ASSET_CRITICALITY } from '../constants';
import { generateUniqueIdentifier } from '../form-helpers';

test.describe('Asset Creation Tests', () => {
  test('should create physical asset', async ({ authenticatedPage }) => {
    const physicalAssetsPage = new PhysicalAssetsPage(authenticatedPage);
    await physicalAssetsPage.goto();

    const uniqueId = generateUniqueIdentifier('PHYSICAL');
    const description = 'Test physical asset for E2E testing';

    await physicalAssetsPage.createPhysicalAsset(uniqueId, description);

    await expect(authenticatedPage.getByTestId('assets-physical-list'))
      .toContainText(description, { timeout: TEST_TIMEOUTS.VERIFICATION });
  });

  test('should create information asset', async ({ authenticatedPage }) => {
    const informationAssetsPage = new InformationAssetsPage(authenticatedPage);
    await informationAssetsPage.goto();

    const name = generateUniqueIdentifier('INFO');

    await informationAssetsPage.createInformationAsset(name);

    await expect(authenticatedPage.getByTestId('assets-information-list'))
      .toContainText(name, { timeout: TEST_TIMEOUTS.VERIFICATION });
  });

  test('should create software asset', async ({ authenticatedPage }) => {
    const softwareAssetsPage = new SoftwareAssetsPage(authenticatedPage);
    await softwareAssetsPage.goto();

    const name = generateUniqueIdentifier('SOFTWARE');

    await softwareAssetsPage.createSoftwareAsset(name);

    await expect(authenticatedPage.getByTestId('assets-software-list'))
      .toContainText(name, { timeout: TEST_TIMEOUTS.VERIFICATION });
  });

  test('should create supplier', async ({ authenticatedPage }) => {
    const suppliersPage = new SuppliersPage(authenticatedPage);
    await suppliersPage.goto();

    const name = generateUniqueIdentifier('SUPPLIER');

    await suppliersPage.createSupplier(name);

    await expect(authenticatedPage.getByTestId('assets-supplier-list'))
      .toContainText(name, { timeout: TEST_TIMEOUTS.VERIFICATION });
  });
});