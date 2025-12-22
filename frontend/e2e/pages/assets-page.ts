import { Page, Locator, expect } from '@playwright/test';

const WAIT_SMALL = 500;
const WAIT_MEDIUM = 1000;
const WAIT_LARGE = 2000;

async function typeSlow(page: Page, locator: Locator, value: string) {
  await locator.clear();
  await page.waitForTimeout(WAIT_SMALL);
  await locator.type(value, { delay: 50 });
  await page.waitForTimeout(WAIT_MEDIUM);
}

async function submitStandardForm(page: Page) {
  const submitButton = page
    .getByTestId('form-submit-create')
    .or(page.getByTestId('form-submit-update'));

  await submitButton.waitFor({ state: 'visible', timeout: 3000 });
  await submitButton.scrollIntoViewIfNeeded();
  await page.waitForTimeout(WAIT_SMALL);

  const enabled = await submitButton.isEnabled().catch(() => false);
  if (!enabled) {
    await page.waitForTimeout(WAIT_SMALL);
  }

  await submitButton.click();
  await page.waitForTimeout(WAIT_LARGE);

  // verify dialog closed
  let dialogClosed = false;
  for (let i = 0; i < 10; i++) {
    const visible = await page
      .locator('[role="dialog"]')
      .isVisible({ timeout: 500 })
      .catch(() => false);
    if (!visible) {
      dialogClosed = true;
      break;
    }
    await page.waitForTimeout(WAIT_SMALL);
  }

  if (!dialogClosed) {
    throw new Error('Form did not close after submit');
  }

  await page.waitForTimeout(3000);
}

/* ---------- Physical Assets ---------- */

export class PhysicalAssetsPage {
  constructor(private readonly page: Page) {}

  async goto() {
    await this.page.goto('/en/dashboard/assets/physical', {
      waitUntil: 'domcontentloaded',
    });
    await this.page.waitForTimeout(WAIT_MEDIUM);
  }

  get newAssetButton() {
    return this.page.getByTestId('assets-physical-new-asset-button');
  }

  get uniqueIdInput() {
    return this.page.getByTestId('physical-unique-id-input');
  }

  get descriptionInput() {
    return this.page.getByTestId('physical-description-input');
  }

  get assetTypeTrigger() {
    return this.page.getByTestId('physical-asset-type-dropdown-trigger');
  }

  get criticalityTrigger() {
    return this.page.getByTestId('physical-criticality-dropdown-trigger');
  }

  async openNewForm() {
    await this.newAssetButton.click();
    await this.page.waitForSelector('[role="dialog"]', {
      state: 'visible',
      timeout: 5000,
    });
    await this.page.waitForTimeout(WAIT_SMALL);
  }

  private async selectFirstOption(trigger: Locator) {
    await trigger.click();
    await this.page.waitForTimeout(WAIT_SMALL);
    const options = this.page.locator('[role="option"]');
    await options.first().waitFor({ state: 'visible', timeout: 5000 });
    const count = await options.count();
    if (count > 0) {
      const text = await options.first().textContent();
      if (!text || /no .* available/i.test(text)) return;
      await options.first().click();
    }
    await this.page.waitForTimeout(WAIT_MEDIUM);
  }

  async createPhysicalAsset(id: string, desc: string) {
    await this.openNewForm();
    await typeSlow(this.page, this.uniqueIdInput, id);
    await typeSlow(this.page, this.descriptionInput, desc);
    await this.selectFirstOption(this.assetTypeTrigger);
    await this.selectFirstOption(this.criticalityTrigger);
    await submitStandardForm(this.page);

    await expect(this.page.getByTestId('assets-physical-list'))
      .toContainText(desc, { timeout: 10000 });
  }
}

/* ---------- Information Assets ---------- */

export class InformationAssetsPage {
  constructor(private readonly page: Page) {}

  async goto() {
    await this.page.goto('/en/dashboard/assets/information', {
      waitUntil: 'domcontentloaded',
    });
    await this.page.waitForTimeout(WAIT_MEDIUM);
  }

  get newAssetButton() {
    return this.page.getByTestId('assets-information-new-asset-button');
  }

  get nameInput() {
    return this.page.getByTestId('information-name-input');
  }

  get classificationTrigger() {
    return this.page.getByTestId('information-classification-dropdown-trigger');
  }

  get criticalityTrigger() {
    return this.page.getByTestId('information-criticality-dropdown-trigger');
  }

  get containsPiiCheckbox() {
    return this.page.getByTestId('information-contains-pii-checkbox');
  }

  get containsFinancialCheckbox() {
    return this.page.getByTestId('information-contains-financial-checkbox');
  }

  async openNewForm() {
    await this.newAssetButton.click();
    await this.page.waitForSelector('[role="dialog"]', {
      state: 'visible',
      timeout: 5000,
    });
    await this.page.waitForTimeout(WAIT_SMALL);
  }

  private async selectFirstOption(trigger: Locator) {
    await trigger.click();
    await this.page.waitForTimeout(WAIT_SMALL);
    const options = this.page.locator('[role="option"]');
    await options.first().waitFor({ state: 'visible', timeout: 5000 });
    const count = await options.count();
    if (count > 0) {
      const text = await options.first().textContent();
      if (!text || /no .* available/i.test(text)) return;
      await options.first().click();
    }
    await this.page.waitForTimeout(WAIT_MEDIUM);
  }

  async createInformationAsset(name: string) {
    await this.openNewForm();
    await typeSlow(this.page, this.nameInput, name);
    // Information type is a dropdown, not a free-text input.
    // Select the first available option to keep the test resilient.
    await this.selectFirstOption(this.classificationTrigger);
    await this.selectFirstOption(this.criticalityTrigger);
    // Toggle common sensitive data checkboxes
    await this.containsPiiCheckbox.click();
    await this.page.waitForTimeout(WAIT_SMALL);
    await this.containsFinancialCheckbox.click();
    await this.page.waitForTimeout(WAIT_SMALL);
    await submitStandardForm(this.page);

    await expect(this.page.getByTestId('assets-information-list'))
      .toContainText(name, { timeout: 10000 });
  }
}

/* ---------- Software Assets ---------- */

export class SoftwareAssetsPage {
  constructor(private readonly page: Page) {}

  async goto() {
    await this.page.goto('/en/dashboard/assets/software', {
      waitUntil: 'domcontentloaded',
    });
    await this.page.waitForTimeout(WAIT_MEDIUM);
  }

  get newAssetButton() {
    return this.page.getByTestId('assets-software-new-asset-button');
  }

  get nameInput() {
    return this.page.getByTestId('software-name-input');
  }

  get versionInput() {
    return this.page.getByTestId('software-version-input');
  }

  get vendorInput() {
    return this.page.getByTestId('software-vendor-input');
  }

  get typeTrigger() {
    return this.page.getByTestId('software-type-dropdown-trigger');
  }

  get criticalityTrigger() {
    return this.page.getByTestId('software-criticality-dropdown-trigger');
  }

  async openNewForm() {
    await this.newAssetButton.click();
    await this.page.waitForSelector('[role="dialog"]', {
      state: 'visible',
      timeout: 5000,
    });
    await this.page.waitForTimeout(WAIT_SMALL);
  }

  private async selectFirstOption(trigger: Locator) {
    await trigger.click();
    await this.page.waitForTimeout(WAIT_SMALL);
    const options = this.page.locator('[role="option"]');
    await options.first().waitFor({ state: 'visible', timeout: 5000 });
    const count = await options.count();
    if (count > 0) {
      const text = await options.first().textContent();
      if (!text || /no .* available/i.test(text)) return;
      await options.first().click();
    }
    await this.page.waitForTimeout(WAIT_MEDIUM);
  }

  async createSoftwareAsset(name: string) {
    await this.openNewForm();
    await typeSlow(this.page, this.nameInput, name);
    await typeSlow(this.page, this.versionInput, '1.0.0');
    await typeSlow(this.page, this.vendorInput, 'Test Vendor Inc');
    await this.selectFirstOption(this.typeTrigger);
    await this.selectFirstOption(this.criticalityTrigger);
    await submitStandardForm(this.page);

    await expect(this.page.getByTestId('assets-software-list'))
      .toContainText(name, { timeout: 10000 });
  }
}

/* ---------- Business Applications ---------- */

export class BusinessApplicationsPage {
  constructor(private readonly page: Page) {}

  async goto() {
    await this.page.goto('/en/dashboard/assets/applications', {
      waitUntil: 'domcontentloaded',
    });
    await this.page.waitForTimeout(WAIT_MEDIUM);
  }

  get newAppButton() {
    return this.page.getByTestId('assets-business-app-new-asset-button');
  }

  get nameInput() {
    return this.page.getByTestId('business-app-name-input');
  }

  get urlInput() {
    return this.page.getByTestId('business-app-url-input');
  }

  get typeTrigger() {
    return this.page.getByTestId('business-app-type-dropdown-trigger');
  }

  get statusTrigger() {
    return this.page.getByTestId('business-app-status-dropdown-trigger');
  }

  get criticalityTrigger() {
    return this.page.getByTestId('business-app-criticality-dropdown-trigger');
  }

  async openNewForm() {
    await this.newAppButton.click();
    await this.page.waitForSelector('[role="dialog"]', {
      state: 'visible',
      timeout: 5000,
    });
    await this.page.waitForTimeout(WAIT_SMALL);
  }

  private async selectFirstOption(trigger: Locator) {
    await trigger.click();
    await this.page.waitForTimeout(WAIT_SMALL);
    const options = this.page.locator('[role="option"]');
    await options.first().waitFor({ state: 'visible', timeout: 5000 });
    const count = await options.count();
    if (count > 0) {
      const text = await options.first().textContent();
      if (!text || /no .* available/i.test(text)) return;
      await options.first().click();
    }
    await this.page.waitForTimeout(WAIT_MEDIUM);
  }

  async createBusinessApp(name: string) {
    await this.openNewForm();
    await typeSlow(this.page, this.nameInput, name);
    await typeSlow(this.page, this.urlInput, 'https://e2e-app.example.com');
    await this.selectFirstOption(this.typeTrigger);
    await this.selectFirstOption(this.statusTrigger);
    await this.selectFirstOption(this.criticalityTrigger);
    await submitStandardForm(this.page);

    await expect(this.page.getByTestId('assets-business-app-list'))
      .toContainText(name, { timeout: 10000 });
  }
}

/* ---------- Suppliers ---------- */

export class SuppliersPage {
  constructor(private readonly page: Page) {}

  async goto() {
    await this.page.goto('/en/dashboard/assets/suppliers', {
      waitUntil: 'domcontentloaded',
    });
    await this.page.waitForTimeout(WAIT_MEDIUM);
  }

  get newSupplierButton() {
    return this.page.getByTestId('assets-supplier-new-asset-button');
  }

  get nameInput() {
    return this.page.getByTestId('supplier-name-input');
  }

  get typeTrigger() {
    return this.page.getByTestId('supplier-type-dropdown-trigger');
  }

  get criticalityTrigger() {
    return this.page.getByTestId('supplier-criticality-dropdown-trigger');
  }

  get contactNameInput() {
    return this.page.getByTestId('supplier-contact-name-input');
  }

  get contactEmailInput() {
    return this.page.getByTestId('supplier-contact-email-input');
  }

  async openNewForm() {
    await this.newSupplierButton.click();
    await this.page.waitForSelector('[role="dialog"]', {
      state: 'visible',
      timeout: 5000,
    });
    await this.page.waitForTimeout(WAIT_SMALL);
  }

  private async selectFirstOption(trigger: Locator) {
    await trigger.click();
    await this.page.waitForTimeout(WAIT_SMALL);
    const options = this.page.locator('[role="option"]');
    await options.first().waitFor({ state: 'visible', timeout: 5000 });
    const count = await options.count();
    if (count > 0) {
      const text = await options.first().textContent();
      if (!text || /no .* available/i.test(text)) return;
      await options.first().click();
    }
    await this.page.waitForTimeout(WAIT_MEDIUM);
  }

  async createSupplier(name: string) {
    await this.openNewForm();
    await typeSlow(this.page, this.nameInput, name);
    await this.selectFirstOption(this.typeTrigger);
    await this.selectFirstOption(this.criticalityTrigger);
    await typeSlow(this.page, this.contactNameInput, 'John Doe');
    await typeSlow(this.page, this.contactEmailInput, 'john.doe@example.com');
    await submitStandardForm(this.page);

    await expect(this.page.getByTestId('assets-supplier-list'))
      .toContainText(name, { timeout: 10000 });
  }
}



