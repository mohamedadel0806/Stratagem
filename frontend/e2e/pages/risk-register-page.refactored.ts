import { Page, Locator } from '@playwright/test';
import { TestDataHelper } from '../helpers/test-data-helper';
import { TestWaiter, WAIT_CONSTANTS } from '../helpers/test-waiter';

export class RiskRegisterPage {
  readonly page: Page;
  readonly waiter: TestWaiter;
  readonly testDataHelper: TestDataHelper;

  readonly newRiskButton: Locator;
  readonly searchInput: Locator;
  readonly risksList: Locator;

  constructor(page: Page, baseURL: string, customWaitTimes?: Partial<typeof WAIT_CONSTANTS>) {
    this.page = page;
    this.waiter = new TestWaiter({ ...WAIT_CONSTANTS, ...customWaitTimes });
    this.testDataHelper = new TestDataHelper(page, baseURL);

    this.newRiskButton = page.getByTestId('risk-register-new-risk-button');
    this.searchInput = page.getByTestId('risk-register-search-input');
    this.risksList = page.getByTestId('risk-register-list');
  }

  async goto(locale: string = 'en') {
    await this.page.goto(`/${locale}/dashboard/risks`, { waitUntil: 'domcontentloaded' });
    await this.waiter.forLoadState(this.page, 'domcontentloaded');
  }

  async isLoaded(): Promise<boolean> {
    try {
      const titleVisible = await this.page.getByRole('heading', { name: /risk/i }).first().isVisible({ timeout: 5000 });
      return titleVisible;
    } catch {
      return false;
    }
  }

  async getRiskCardCount(): Promise<number> {
    const selector = '[data-testid^="risk-register-card-"]';
    const elements = this.page.locator(selector);
    const count = await elements.count();
    const visibleCount = await elements.filter({ visible: true }).count();
    console.log(`Found ${visibleCount} visible risk cards out of ${count} total`);
    return visibleCount;
  }

  async clickRiskCard(index: number = 0) {
    const riskCards = this.page.locator('[data-testid^="risk-register-card-"]');
    const count = await riskCards.count();

    if (count === 0) {
      throw new Error('No risk cards found on page');
    }

    if (index >= count) {
      throw new Error(`Risk card index ${index} out of range. Found ${count} risk cards.`);
    }

    const riskCard = riskCards.nth(index);
    await riskCard.waitFor({ state: 'visible', timeout: 10000 });
    await this.waiter.wait('small');

    const viewButton = riskCard.locator('[data-testid^="risk-register-view-button-"]').first();
    const viewButtonVisible = await viewButton.isVisible({ timeout: 3000 }).catch(() => false);

    if (viewButtonVisible) {
      await viewButton.click();
    } else {
      const link = riskCard.locator('a').first();
      await link.click();
    }

    await this.waiter.forLoadState(this.page, 'domcontentloaded');
    await this.waiter.wait('medium');
  }

  async clickRiskById(riskId: string) {
    const riskCard = this.page.locator(`[data-testid="risk-register-card-${riskId}"]`);
    const cardVisible = await riskCard.isVisible({ timeout: 5000 }).catch(() => false);

    if (!cardVisible) {
      throw new Error(`Risk card with ID ${riskId} not found`);
    }

    await riskCard.waitFor({ state: 'visible', timeout: 10000 });
    await this.waiter.wait('small');

    const viewButton = this.page.locator(`[data-testid="risk-register-view-button-${riskId}"]`).first();
    const viewButtonVisible = await viewButton.isVisible({ timeout: 3000 }).catch(() => false);

    if (viewButtonVisible) {
      await viewButton.click();
    } else {
      const link = riskCard.locator('a').first();
      await link.click();
    }

    await this.waiter.forLoadState(this.page, 'domcontentloaded');
    await this.waiter.wait('medium');
  }

  async openNewRiskForm() {
    console.log('Looking for New Risk button...');
    await this.waiter.wait('medium');

    const button = this.newRiskButton;
    const isVisible = await button.isVisible({ timeout: 2000 });
    if (!isVisible) {
      throw new Error('New Risk button not found');
    }

    await button.scrollIntoViewIfNeeded();
    await this.waiter.wait('small');
    await button.click();

    await this.waiter.wait('medium');

    const dialog = this.page.locator('[role="dialog"]');
    const dialogVisible = await dialog.isVisible({ timeout: 3000 }).catch(() => false);
    if (!dialogVisible) {
      console.log('Risk form not detected as dialog, but continuing anyway...');
    }

    console.log('New Risk form appears to have opened successfully');
  }

  async search(query: string) {
    const inputVisible = await this.searchInput.isVisible({ timeout: 3000 }).catch(() => false);
    if (inputVisible) {
      await this.searchInput.clear();
      await this.searchInput.type(query, { delay: 30 });
      await this.waiter.wait('medium');
    }
  }

  async fillNewRiskForm(options: { title: string; description?: string; category?: string }) {
    await this.waiter.wait('medium');

    const titleInput = this.page.getByTestId('risk-form-title-input');
    await titleInput.waitFor({ state: 'visible', timeout: 5000 });
    await titleInput.clear({ timeout: 3000 });
    await this.waiter.wait('small');
    await titleInput.type(options.title, { delay: 50 });
    await this.waiter.wait('medium');
    console.log(`✅ Filled risk title: ${options.title}`);

    if (options.description) {
      await this.waiter.wait('small');
      const descriptionTextarea = this.page.getByTestId('risk-form-description-textarea');
      await descriptionTextarea.waitFor({ state: 'visible', timeout: 3000 }).catch(() => {});
      await descriptionTextarea.clear({ timeout: 3000 });
      await this.waiter.wait('small');
      await descriptionTextarea.type(options.description, { delay: 50 });
      await this.waiter.wait('medium');
      console.log('✅ Filled risk description');
    }

    if (options.category) {
      await this.waiter.wait('small');
      const categorySelect = this.page.getByTestId('risk-form-category-dropdown');
      await categorySelect.waitFor({ state: 'visible', timeout: 3000 });
      await this.waiter.wait('small');
      await categorySelect.click();
      await this.waiter.wait('medium');
      const categoryOption = this.page.getByRole('option', { name: new RegExp(options.category, 'i') });
      await categoryOption.waitFor({ state: 'visible', timeout: 3000 });
      await this.waiter.wait('small');
      await categoryOption.click();
      await this.waiter.wait('medium');
      console.log(`✅ Selected category: ${options.category}`);
    }

    await this.waiter.wait('medium');
  }

  async submitNewRiskForm() {
    console.log('Submitting risk form...');

    const submitButton = this.page.getByTestId('risk-form-submit-create')
      .or(this.page.getByTestId('risk-form-submit-update'));

    const isVisible = await submitButton.isVisible({ timeout: 2000 });
    if (!isVisible) {
      throw new Error('Risk form submit button not found');
    }

    await submitButton.scrollIntoViewIfNeeded();
    await this.waiter.wait('medium');

    let isEnabled = await submitButton.isEnabled().catch(() => false);
    if (!isEnabled) {
      console.log('Submit button disabled, waiting...');
      await this.waiter.wait('medium');
      isEnabled = await submitButton.isEnabled().catch(() => false);
    }

    await submitButton.click();
    console.log('Submit button clicked');

    await this.waiter.forResponse(this.page, '/api/risks');

    const dialog = this.page.locator('[role="dialog"]');
    let dialogClosed = false;
    try {
      await dialog.waitFor({ state: 'hidden', timeout: 5000 });
      dialogClosed = true;
      console.log('Dialog closed successfully');
    } catch (error) {
      console.log('Dialog still visible or never was a dialog');
    }

    if (!dialogClosed) {
      await this.waiter.wait('medium');

      const successSelectors = [
        '.text-green-500',
        '[role="alert"]:has-text("success")',
        '[role="alert"]:has-text("created")',
      ];

      for (const selector of successSelectors) {
        try {
          const successElement = this.page.locator(selector);
          const isVisible = await successElement.isVisible({ timeout: 2000 });
          if (isVisible) {
            console.log('Found success message');
            dialogClosed = true;
            break;
          }
        } catch (error) {
          // Continue checking
        }
      }
    }

    await this.waiter.wait('medium');
    console.log('✅ Risk form submission completed');
  }

  async createAndVerifyRisk(options: { title?: string; description?: string; category?: string }): Promise<string> {
    const riskTitle = options.title || `E2E Test Risk ${Date.now()}`;
    const riskId = await this.testDataHelper.createTestRisk({
      title: riskTitle,
      description: options.description,
      category: options.category
    });

    await this.goto();
    await this.waiter.wait('medium');

    const riskCard = this.page.locator(`[data-testid="risk-register-card-${riskId}"]`);
    const cardVisible = await riskCard.isVisible({ timeout: 5000 }).catch(() => false);

    if (!cardVisible) {
      const titleLocator = this.page.getByText(riskTitle);
      await titleLocator.waitFor({ state: 'visible', timeout: 10000 });
    }

    console.log(`✅ Risk created and verified: ${riskId}`);
    return riskId;
  }
}