import { Page, Locator } from '@playwright/test';

/**
 * Page Object Model for Risk Register (Risks List) Page
 * Encapsulates all interactions with the risk register/list page
 */
export class RiskRegisterPage {
  readonly page: Page;

  // Main elements
  readonly newRiskButton: Locator;
  readonly searchInput: Locator;
  readonly risksList: Locator;

  constructor(page: Page) {
    this.page = page;

    // Selectors using data-testid as priority
    this.newRiskButton = page.getByTestId('risk-register-new-risk-button');
    this.searchInput = page.getByTestId('risk-register-search-input');
    this.risksList = page.getByTestId('risk-register-list');
  }

  /**
   * Navigate to risk register page
   */
  async goto(locale: string = 'en') {
    await this.page.goto(`/${locale}/dashboard/risks`);
    // Wait for the main list or empty state to be visible
    await Promise.race([
      this.risksList.waitFor({ state: 'visible', timeout: 15000 }),
      this.page.getByTestId('empty-state').waitFor({ state: 'visible', timeout: 15000 })
    ]).catch(() => console.log('Wait for risk register visibility timed out or alternate state appeared'));
  }

  /**
   * Check if page is loaded
   */
  async isLoaded(): Promise<boolean> {
    try {
      // Use getByRole for headings (recommended Playwright method)
      await this.page.getByRole('heading', { name: /risk/i }).first().waitFor({ state: 'visible', timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Get count of risk cards
   */
  async getRiskCardCount(): Promise<number> {
    const riskCards = this.page.getByTestId(/^risk-register-card-/);
    // Wait for at least one card or verify it's empty
    try {
      await riskCards.first().waitFor({ state: 'visible', timeout: 5000 });
    } catch (e) {
      // If none found, return 0
      return 0;
    }
    return await riskCards.count();
  }

  /**
   * Click on a risk card by index
   */
  async clickRiskCard(index: number = 0) {
    const riskCards = this.page.getByTestId(/^risk-register-card-/);
    const riskCard = riskCards.nth(index);

    await riskCard.waitFor({ state: 'visible', timeout: 10000 });

    // Try to click the View button inside the card, fallback to card itself
    const viewButton = riskCard.getByTestId(/^risk-register-view-button-/).first();
    if (await viewButton.isVisible()) {
      await viewButton.click();
    } else {
      await riskCard.click();
    }

    // Wait for navigation
    await this.page.waitForLoadState('domcontentloaded');
  }

  /**
   * Click on a risk card by risk ID
   */
  async clickRiskById(riskId: string) {
    const riskCard = this.page.getByTestId(`risk-register-card-${riskId}`);
    await riskCard.waitFor({ state: 'visible', timeout: 10000 });

    const viewButton = this.page.getByTestId(`risk-register-view-button-${riskId}`);
    if (await viewButton.isVisible()) {
      await viewButton.click();
    } else {
      await riskCard.click();
    }

    await this.page.waitForLoadState('domcontentloaded');
  }

  /**
   * Open new risk form
   */
  async openNewRiskForm() {
    await this.newRiskButton.waitFor({ state: 'visible', timeout: 10000 });
    await this.newRiskButton.click();

    // Verify dialog/form is visible
    await this.page.getByRole('dialog').waitFor({ state: 'visible', timeout: 5000 });
  }

  /**
   * Search for risks
   */
  async search(query: string) {
    await this.searchInput.waitFor({ state: 'visible', timeout: 5000 });
    await this.searchInput.clear();
    // Use fill() which is generally more reliable in Playwright than type()
    // but the guide mentions typing with delay for React hydration if needed.
    // fill() is preferred unless specific hydration issues occur.
    await this.searchInput.fill(query);

    // Wait for potential debounce/filter
    await this.page.waitForLoadState('networkidle').catch(() => { });
  }

  /**
   * Fill new risk form
   */
  async fillNewRiskForm(options: { title: string; description?: string; category?: string }) {
    const dialog = this.page.getByRole('dialog');

    // Fill title
    const titleInput = dialog.getByTestId('risk-form-title-input');
    await titleInput.fill(options.title);

    // Fill description
    if (options.description) {
      const descriptionTextarea = dialog.getByTestId('risk-form-description-textarea');
      await descriptionTextarea.fill(options.description);
    }

    // Select category
    if (options.category) {
      const categorySelect = dialog.getByTestId('risk-form-category-dropdown');
      await categorySelect.click();
      await this.page.getByRole('option', { name: new RegExp(options.category, 'i') }).click();
    }
  }

  /**
   * Submit new risk form
   */
  async submitNewRiskForm() {
    const submitButton = this.page.getByTestId('risk-form-submit-create')
      .or(this.page.getByTestId('risk-form-submit-update'))
      .or(this.page.getByRole('button', { name: /create|submit|save/i }))
      .first();

    await submitButton.waitFor({ state: 'visible', timeout: 5000 });
    await submitButton.click();

    // Wait for dialog to close
    await this.page.getByRole('dialog').waitFor({ state: 'hidden', timeout: 10000 });
  }
}



