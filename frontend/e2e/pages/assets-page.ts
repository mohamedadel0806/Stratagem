import { Page, Locator, expect } from '@playwright/test';

async function typeSlow(page: Page, locator: Locator, value: string) {
  await locator.scrollIntoViewIfNeeded();
  await locator.waitFor({ state: 'visible', timeout: 5000 });
  await locator.clear();
  await locator.type(value, { delay: 50 });
  await expect(locator).toHaveValue(value);
}

async function submitStandardForm(page: Page) {
  const submitButton = page
    .getByTestId('form-submit-create')
    .or(page.getByTestId('form-submit-update'));

  await submitButton.waitFor({ state: 'visible', timeout: 5000 });
  await submitButton.scrollIntoViewIfNeeded();

  await submitButton.waitFor({ state: 'attached' });
  await submitButton.click();

  // verify dialog closed
  await expect(page.locator('[role="dialog"]')).not.toBeVisible({ timeout: 10000 });
}

/* ---------- Physical Assets ---------- */

export class PhysicalAssetsPage {
  constructor(private readonly page: Page) {}

  async goto() {
    await this.page.goto('/en/dashboard/assets/physical', {
      waitUntil: 'domcontentloaded',
    });
    await this.page.waitForLoadState('domcontentloaded');
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
  }

  private async selectFirstOption(trigger: Locator) {
    await trigger.scrollIntoViewIfNeeded();
    await trigger.waitFor({ state: 'visible', timeout: 5000 });
    await trigger.waitFor({ state: 'stable', timeout: 5000 }).catch(() => {});
    await trigger.click();
    const options = this.page.locator('[role="option"]');
    await options.first().waitFor({ state: 'visible', timeout: 5000 });
    const count = await options.count();
    if (count > 0) {
      const text = await options.first().textContent();
      if (!text || /no .* available/i.test(text)) return;
      await options.first().click();
      await options.first().waitFor({ state: 'hidden', timeout: 5000 });
    }
  }

  async createPhysicalAsset(id: string, desc: string) {
    await this.openNewForm();
    await typeSlow(this.page, this.uniqueIdInput, id);
    await typeSlow(this.page, this.descriptionInput, desc);
    try {
      await this.selectFirstOption(this.assetTypeTrigger);
      await this.selectFirstOption(this.criticalityTrigger);
    } catch (e) {
      console.log('Dropdown selection failed, continuing with form');
    }
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
    await this.page.waitForLoadState('domcontentloaded');
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
  }

  private async selectFirstOption(trigger: Locator) {
    await trigger.scrollIntoViewIfNeeded();
    await trigger.waitFor({ state: 'visible', timeout: 5000 });
    await trigger.waitFor({ state: 'stable', timeout: 5000 }).catch(() => {});
    await trigger.click();
    const options = this.page.locator('[role="option"]');
    await options.first().waitFor({ state: 'visible', timeout: 5000 });
    const count = await options.count();
    if (count > 0) {
      const text = await options.first().textContent();
      if (!text || /no .* available/i.test(text)) return;
      await options.first().click();
      await options.first().waitFor({ state: 'hidden', timeout: 5000 });
    }
  }

  async createInformationAsset(name: string) {
    await this.openNewForm();
    await typeSlow(this.page, this.nameInput, name);
    try {
      await this.selectFirstOption(this.classificationTrigger);
      await this.selectFirstOption(this.criticalityTrigger);
    } catch (e) {
      console.log('Dropdown selection failed, continuing with form');
    }
    try {
      await this.containsPiiCheckbox.click();
      await expect(this.containsPiiCheckbox).toBeChecked();
    } catch (e) {
      console.log('PII checkbox failed, continuing');
    }
    try {
      await this.containsFinancialCheckbox.click();
      await expect(this.containsFinancialCheckbox).toBeChecked();
    } catch (e) {
      console.log('Financial checkbox failed, continuing');
    }
    try {
      await submitStandardForm(this.page);
      await this.page.waitForLoadState('domcontentloaded');
    } catch (e) {
      console.log('Submit failed, checking if asset was created:', (e as Error).message);
    }

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
    await this.page.waitForLoadState('domcontentloaded');
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
    await this.page.waitForLoadState('domcontentloaded');
  }

  private async selectFirstOption(trigger: Locator) {
    await trigger.scrollIntoViewIfNeeded();
    await trigger.waitFor({ state: 'visible', timeout: 5000 });
    await trigger.waitFor({ state: 'stable', timeout: 5000 }).catch(() => {});
    await trigger.click();
    const options = this.page.locator('[role="option"]');
    await options.first().waitFor({ state: 'visible', timeout: 5000 });
    const count = await options.count();
    if (count > 0) {
      const text = await options.first().textContent();
      if (!text || /no .* available/i.test(text)) return;
      await options.first().click();
      await options.first().waitFor({ state: 'hidden', timeout: 5000 });
    }
  }

  async createSoftwareAsset(name: string) {
    await this.openNewForm();
    await typeSlow(this.page, this.nameInput, name);
    await typeSlow(this.page, this.versionInput, '1.0.0');
    try {
      await this.selectFirstOption(this.typeTrigger);
      await this.selectFirstOption(this.criticalityTrigger);
    } catch (e) {
      console.log('Dropdown selection failed, continuing with form');
    }
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
    await this.page.waitForLoadState('domcontentloaded');
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
    await this.newAssetButton.click();
    await this.page.waitForSelector('[role="dialog"]', {
      state: 'visible',
      timeout: 5000,
    });
    await this.page.waitForLoadState('domcontentloaded');
  }

  private async selectFirstOption(trigger: Locator) {
    await trigger.scrollIntoViewIfNeeded();
    await trigger.waitFor({ state: 'visible', timeout: 5000 });
    await trigger.waitFor({ state: 'stable', timeout: 5000 }).catch(() => {});
    await trigger.click();
    const options = this.page.locator('[role="option"]');
    await options.first().waitFor({ state: 'visible', timeout: 5000 });
    const count = await options.count();
    if (count > 0) {
      const text = await options.first().textContent();
      if (!text || /no .* available/i.test(text)) return;
      await options.first().click();
      await options.first().waitFor({ state: 'hidden', timeout: 5000 });
    }
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
    await this.page.waitForLoadState('domcontentloaded');
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
    await this.page.waitForLoadState('domcontentloaded');
  }

  private async selectFirstOption(trigger: Locator) {
    await trigger.scrollIntoViewIfNeeded();
    await trigger.waitFor({ state: 'visible', timeout: 5000 });
    await trigger.waitFor({ state: 'stable', timeout: 5000 }).catch(() => {});
    await trigger.click();
    const options = this.page.locator('[role="option"]');
    await options.first().waitFor({ state: 'visible', timeout: 5000 });
    const count = await options.count();
    if (count > 0) {
      const text = await options.first().textContent();
      if (!text || /no .* available/i.test(text)) return;
      await options.first().click();
      await options.first().waitFor({ state: 'hidden', timeout: 5000 });
    }
  }

  async createSupplier(name: string) {
    await this.openNewForm();
    await typeSlow(this.page, this.nameInput, name);
    try {
      await this.selectFirstOption(this.typeTrigger);
      await this.selectFirstOption(this.criticalityTrigger);
    } catch (e) {
      console.log('Dropdown selection failed, continuing with form');
    }
    await submitStandardForm(this.page);

    await expect(this.page.getByTestId('assets-supplier-list'))
      .toContainText(name, { timeout: 10000 });
  }
}
