import { test } from '../fixtures/auth';
import {
  PhysicalAssetsPage,
  InformationAssetsPage,
  SoftwareAssetsPage,
  BusinessApplicationsPage,
  SuppliersPage,
} from '../pages/assets-page';

const WAIT_SMALL = 500;
const WAIT_MEDIUM = 1000;

test('assets: create all asset types in one flow (POM + test IDs)', async ({ authenticatedPage }) => {
  const page = authenticatedPage;
  test.setTimeout(120_000);

  // Initial dashboard load (domcontentloaded per advisory)
  await page.goto('/en/dashboard/assets', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(WAIT_MEDIUM);

  const physical = new PhysicalAssetsPage(page);
  const info = new InformationAssetsPage(page);
  const software = new SoftwareAssetsPage(page);
  const apps = new BusinessApplicationsPage(page);
  const suppliers = new SuppliersPage(page);

  // ---------- Physical Asset ----------
  await physical.goto();
  const physicalDesc = `Physical E2E ${Date.now()}`;
  await physical.createPhysicalAsset(`PHYS-${Date.now()}`, physicalDesc);

  // ---------- Information Asset ----------
  await info.goto();
  const infoName = `Info E2E ${Date.now()}`;
  await info.createInformationAsset(infoName);

  // ---------- Software Asset ----------
  await software.goto();
  const swName = `SW E2E ${Date.now()}`;
  await software.createSoftwareAsset(swName);

  // ---------- Business Application ----------
  await apps.goto();
  const appName = `APP E2E ${Date.now()}`;
  await apps.createBusinessApp(appName);

  // ---------- Supplier ----------
  await suppliers.goto();
  const supplierName = `SUP E2E ${Date.now()}`;
  await suppliers.createSupplier(supplierName);

  await page.waitForTimeout(WAIT_SMALL);
});

