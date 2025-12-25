import { Page, Locator } from '@playwright/test';

/**
 * Page Object Model for KRIs Page
 * Encapsulates all interactions with the KRIs page
 */
export class KRIsPage {
  readonly page: Page;

  // Main elements
  readonly newKriButton: Locator;
  readonly searchInput: Locator;
  readonly krisList: Locator;

  // Wait times (can be configured)
  private readonly WAIT_SMALL = 500;
  private readonly WAIT_MEDIUM = 1000;
  private readonly WAIT_LARGE = 2000;

  constructor(page: Page) {
    this.page = page;

    // Button locators
    this.newKriButton = this.page.getByTestId('kris-new-button');
    this.searchInput = this.page.getByTestId('kris-search-input');
    this.krisList = this.page.getByTestId('kris-list');
  }

  /**
   * Navigate to KRIs page
   */
  async goto(locale: string = 'en') {
    await this.page.goto(`/${locale}/dashboard/risks/kris`);
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Check if page is loaded
   */
  async isLoaded(): Promise<boolean> {
    return await this.page.getByRole('heading', { name: /Key Risk Indicators|KRIs/i }).first().isVisible();
  }

  /**
   * Open new KRI form
   */
  async openNewKriForm() {
    await this.newKriButton.waitFor({ state: 'visible', timeout: 5000 });
    await this.newKriButton.click();
    await this.page.locator('[role="dialog"]').waitFor({ state: 'visible', timeout: 5000 });
  }

  /**
   * Search for KRIs
   */
  async search(query: string) {
    await this.searchInput.fill(query);
    await this.page.waitForLoadState('networkidle').catch(() => { });
  }

  /**
   * Get count of KRI cards
   */
  async getKriCount(): Promise<number> {
    const cards = this.page.locator('[data-testid^="kri-card-"]');
    return await cards.count();
  }

  /**
   * Fill KRI form
   */
  async fillKriForm(options: {
    name?: string;
    description?: string;
    measurementFrequency?: string;
    categoryId?: string;
  }) {
    const dialog = this.page.locator('[role="dialog"]');

    if (options.name) {
      await dialog.getByTestId('kri-form-name-input').fill(options.name);
    }
    if (options.description) {
      await dialog.getByTestId('kri-form-description-textarea').fill(options.description);
    }
    if (options.measurementFrequency) {
      await dialog.getByLabel(/Measurement Frequency/i).click();
      await this.page.getByRole('option', { name: new RegExp(options.measurementFrequency, 'i') }).click();
    }
    if (options.categoryId) {
      await dialog.getByLabel(/Category/i).click();
      await this.page.getByRole('option', { name: new RegExp(options.categoryId, 'i') }).click();
    }
  }

  /**
   * Submit KRI form
   */
  async submitKriForm() {
    const submitButton = this.page.getByTestId('kri-form-submit-create').or(
      this.page.getByTestId('kri-form-submit-update')
    );
    await submitButton.click();
    await this.page.locator('[role="dialog"]').waitFor({ state: 'hidden', timeout: 10000 });
  }
}



