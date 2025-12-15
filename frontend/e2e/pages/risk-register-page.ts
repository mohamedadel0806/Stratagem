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
  
  // Wait times (can be configured)
  private readonly WAIT_SMALL = 500;
  private readonly WAIT_MEDIUM = 1000;
  private readonly WAIT_LARGE = 2000;

  constructor(page: Page, waitTimes?: { small?: number; medium?: number; large?: number }) {
    this.page = page;
    
    // Configure wait times if provided
    if (waitTimes) {
      this.WAIT_SMALL = waitTimes.small || this.WAIT_SMALL;
      this.WAIT_MEDIUM = waitTimes.medium || this.WAIT_MEDIUM;
      this.WAIT_LARGE = waitTimes.large || this.WAIT_LARGE;
    }

    // Button locators - using getByTestId with fallback
    this.newRiskButton = page.getByTestId('risk-register-new-risk-button')
      .or(page.locator('button:has-text("New Risk")').first());
    
    // Search input - use getByPlaceholder (recommended Playwright method)
    this.searchInput = page.getByPlaceholder(/Search.*risk/i)
      .or(page.locator('input[placeholder*="Search"], input[type="search"]').first());
    
    // Risks list container - use semantic selectors
    this.risksList = page.getByRole('main')
      .or(page.locator('main').first());
  }

  /**
   * Navigate to risk register page
   */
  async goto(locale: string = 'en') {
    await this.page.goto(`/${locale}/dashboard/risks`, { waitUntil: 'domcontentloaded' });
    await this.page.waitForLoadState('domcontentloaded');
    await this.page.waitForTimeout(this.WAIT_MEDIUM);
  }

  /**
   * Check if page is loaded
   */
  async isLoaded(): Promise<boolean> {
    try {
      // Use getByRole for headings (recommended Playwright method)
      const titleVisible = await this.page.getByRole('heading', { name: /risk/i }).first().isVisible({ timeout: 5000 });
      return titleVisible;
    } catch {
      return false;
    }
  }

  /**
   * Get count of risk cards
   */
  async getRiskCardCount(): Promise<number> {
    const riskCards = this.page.locator('[data-testid^="risk-register-card-"]');
    return await riskCards.count();
  }

  /**
   * Click on a risk card by index
   */
  async clickRiskCard(index: number = 0) {
    const riskCards = this.page.locator('[data-testid^="risk-register-card-"]');
    const count = await riskCards.count();
    
    if (count === 0) {
      throw new Error('No risk cards found on the page');
    }
    
    if (index >= count) {
      throw new Error(`Risk card index ${index} out of range. Found ${count} risk cards.`);
    }
    
    const riskCard = riskCards.nth(index);
    await riskCard.waitFor({ state: 'visible', timeout: 10000 });
    await this.page.waitForTimeout(this.WAIT_SMALL);
    
    // Try to click the View button inside the card
    const viewButton = riskCard.locator('[data-testid^="risk-register-view-button-"]').first();
    const viewButtonVisible = await viewButton.isVisible({ timeout: 3000 }).catch(() => false);
    
    if (viewButtonVisible) {
      await viewButton.click();
    } else {
      // Fallback: click on the card itself or any link inside
      const link = riskCard.locator('a').first();
      await link.click();
    }
    
    await this.page.waitForLoadState('domcontentloaded');
    await this.page.waitForTimeout(this.WAIT_MEDIUM);
  }

  /**
   * Click on a risk card by risk ID
   */
  async clickRiskById(riskId: string) {
    const riskCard = this.page.locator(`[data-testid="risk-register-card-${riskId}"]`);
    const cardVisible = await riskCard.isVisible({ timeout: 5000 }).catch(() => false);
    
    if (!cardVisible) {
      throw new Error(`Risk card with ID ${riskId} not found`);
    }
    
    await riskCard.waitFor({ state: 'visible', timeout: 10000 });
    await this.page.waitForTimeout(this.WAIT_SMALL);
    
    // Try to click the View button
    const viewButton = this.page.locator(`[data-testid="risk-register-view-button-${riskId}"]`).first();
    const viewButtonVisible = await viewButton.isVisible({ timeout: 3000 }).catch(() => false);
    
    if (viewButtonVisible) {
      await viewButton.click();
    } else {
      // Fallback: click on link inside the card
      const link = riskCard.locator('a').first();
      await link.click();
    }
    
    await this.page.waitForLoadState('domcontentloaded');
    await this.page.waitForTimeout(this.WAIT_MEDIUM);
  }

  /**
   * Open new risk form
   */
  async openNewRiskForm() {
    const isVisible = await this.newRiskButton.isVisible({ timeout: 5000 }).catch(() => false);
    if (!isVisible) {
      throw new Error('New Risk button not found');
    }
    
    await this.newRiskButton.scrollIntoViewIfNeeded();
    await this.page.waitForTimeout(this.WAIT_SMALL);
    await this.newRiskButton.click();
    await this.page.waitForTimeout(this.WAIT_MEDIUM);
    
    // Verify dialog/form is visible
    const dialog = this.page.locator('[role="dialog"]');
    const dialogVisible = await dialog.isVisible({ timeout: 3000 }).catch(() => false);
    if (!dialogVisible) {
      throw new Error('New Risk form did not open');
    }
  }

  /**
   * Search for risks
   */
  async search(query: string) {
    const inputVisible = await this.searchInput.isVisible({ timeout: 3000 }).catch(() => false);
    if (inputVisible) {
      await this.searchInput.clear();
      await this.searchInput.fill(query);
      await this.page.waitForTimeout(this.WAIT_MEDIUM); // Wait for search results
    }
  }

  /**
   * Fill new risk form - with slower, more deliberate filling
   */
  async fillNewRiskForm(options: { title: string; description?: string; category?: string }) {
    // Wait for form to be fully loaded
    await this.page.waitForTimeout(this.WAIT_MEDIUM);

    // Fill title - required field (slower typing)
    const titleInput = this.page.getByLabel(/Risk Title/i).or(
      this.page.locator('input[name="title"]').first()
    );
    await titleInput.waitFor({ state: 'visible', timeout: 5000 });
    await titleInput.clear({ timeout: 3000 });
    await this.page.waitForTimeout(this.WAIT_SMALL);
    // Type slowly to simulate human input
    await titleInput.type(options.title, { delay: 50 });
    await this.page.waitForTimeout(this.WAIT_MEDIUM);
    console.log(`✅ Filled risk title: ${options.title}`);

    // Fill description if provided
    if (options.description) {
      await this.page.waitForTimeout(this.WAIT_SMALL);
      const descriptionTextarea = this.page.getByLabel(/Description/i).or(
        this.page.locator('textarea[name="description"]').first()
      );
      await descriptionTextarea.waitFor({ state: 'visible', timeout: 3000 }).catch(() => {});
      await descriptionTextarea.clear({ timeout: 3000 });
      await this.page.waitForTimeout(this.WAIT_SMALL);
      // Type slowly
      await descriptionTextarea.type(options.description, { delay: 50 });
      await this.page.waitForTimeout(this.WAIT_MEDIUM);
      console.log('✅ Filled risk description');
    }

    // Select category if provided
    if (options.category) {
      await this.page.waitForTimeout(this.WAIT_SMALL);
      const categorySelect = this.page.getByLabel(/Category/i).or(
        this.page.locator('select[name*="category"], [role="combobox"]').first()
      );
      await categorySelect.waitFor({ state: 'visible', timeout: 3000 });
      await this.page.waitForTimeout(this.WAIT_SMALL);
      await categorySelect.click();
      await this.page.waitForTimeout(this.WAIT_MEDIUM);
      const categoryOption = this.page.getByRole('option', { name: new RegExp(options.category, 'i') });
      await categoryOption.waitFor({ state: 'visible', timeout: 3000 });
      await this.page.waitForTimeout(this.WAIT_SMALL);
      await categoryOption.click();
      await this.page.waitForTimeout(this.WAIT_MEDIUM);
      console.log(`✅ Selected category: ${options.category}`);
    }
    
    // Final wait after all fields filled
    await this.page.waitForTimeout(this.WAIT_MEDIUM);
  }

  /**
   * Submit new risk form - using getByTestId
   */
  async submitNewRiskForm() {
    // Use getByTestId (recommended Playwright method)
    const submitButton = this.page.getByTestId('risk-form-submit-create').or(
      this.page.getByTestId('risk-form-submit-update')
    );

    const isVisible = await submitButton.isVisible({ timeout: 5000 }).catch(() => false);
    if (!isVisible) {
      throw new Error('Risk form submit button not found (testid: risk-form-submit-create or risk-form-submit-update)');
    }

    await submitButton.scrollIntoViewIfNeeded();
    await this.page.waitForTimeout(this.WAIT_MEDIUM);
    
    // Wait for button to be enabled
    await submitButton.waitFor({ state: 'visible', timeout: 3000 });
    const isEnabled = await submitButton.isEnabled().catch(() => false);
    if (!isEnabled) {
      await this.page.waitForTimeout(this.WAIT_MEDIUM);
    }
    
    await submitButton.click();
    await this.page.waitForTimeout(this.WAIT_MEDIUM * 3); // Wait longer for risk creation

    // Verify dialog is closed (form was submitted)
    const dialog = this.page.locator('[role="dialog"]');
    const dialogStillVisible = await dialog.isVisible({ timeout: 3000 }).catch(() => false);
    if (dialogStillVisible) {
      await this.page.waitForTimeout(this.WAIT_MEDIUM * 2);
      const stillVisibleAfterWait = await dialog.isVisible({ timeout: 2000 }).catch(() => false);
      if (stillVisibleAfterWait) {
        throw new Error('Risk form did not close after submit');
      }
    }

    console.log('✅ Risk form submitted successfully');
  }
}
