import { Page, Locator } from '@playwright/test';

/**
 * Page Object Model for Treatments Page
 * Encapsulates all interactions with the treatments page
 */
export class TreatmentsPage {
  readonly page: Page;

  // Main elements
  readonly newTreatmentButton: Locator;
  readonly searchInput: Locator;
  readonly treatmentsList: Locator;

  // Wait times (can be configured)
  private readonly WAIT_SMALL = 500;
  private readonly WAIT_MEDIUM = 1000;
  private readonly WAIT_LARGE = 2000;

  constructor(page: Page) {
    this.page = page;

    // Button locators
    this.newTreatmentButton = this.page.getByTestId('treatments-new-button');
    this.searchInput = this.page.getByTestId('treatments-search-input');
    this.treatmentsList = this.page.getByTestId('treatments-list');
  }

  /**
   * Navigate to treatments page
   */
  async goto(locale: string = 'en') {
    await this.page.goto(`/${locale}/dashboard/risks/treatments`);
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Check if page is loaded
   */
  async isLoaded(): Promise<boolean> {
    return await this.page.getByRole('heading', { name: /Risk Treatments/i }).first().isVisible();
  }

  /**
   * Open new treatment form
   */
  async openNewTreatmentForm() {
    await this.newTreatmentButton.waitFor({ state: 'visible', timeout: 5000 });
    await this.newTreatmentButton.click();
    await this.page.locator('[role="dialog"]').waitFor({ state: 'visible', timeout: 5000 });
  }

  /**
   * Search for treatments
   */
  async search(query: string) {
    await this.searchInput.fill(query);
    await this.page.waitForLoadState('networkidle').catch(() => { });
  }

  /**
   * Get count of treatment cards
   */
  async getTreatmentCount(): Promise<number> {
    const cards = this.page.locator('[data-testid^="treatment-card-"]');
    return await cards.count();
  }

  /**
   * Fill treatment form
   */
  async fillTreatmentForm(options: {
    title?: string;
    description?: string;
    strategy?: string;
    status?: string;
    riskId?: string;
  }) {
    const dialog = this.page.locator('[role="dialog"]');

    if (options.title) {
      await dialog.getByTestId('treatment-form-title-input').fill(options.title);
    }
    if (options.description) {
      await dialog.getByTestId('treatment-form-description-textarea').fill(options.description);
    }
    if (options.strategy) {
      await dialog.getByTestId('treatment-form-strategy-dropdown').click();
      await this.page.getByRole('option', { name: new RegExp(options.strategy, 'i') }).click();
    }
    if (options.status) {
      await dialog.getByTestId('treatment-form-status-dropdown').click();
      await this.page.getByRole('option', { name: new RegExp(options.status, 'i') }).click();
    }
  }

  /**
   * Submit treatment form
   */
  async submitTreatmentForm() {
    const submitButton = this.page.getByTestId('treatment-form-submit-create').or(
      this.page.getByTestId('treatment-form-submit-update')
    );
    await submitButton.click();
    await this.page.locator('[role="dialog"]').waitFor({ state: 'hidden', timeout: 10000 });
  }
}



