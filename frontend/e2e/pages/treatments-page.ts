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

  constructor(page: Page, waitTimes?: { small?: number; medium?: number; large?: number }) {
    this.page = page;
    
    // Configure wait times if provided
    if (waitTimes) {
      this.WAIT_SMALL = waitTimes.small || this.WAIT_SMALL;
      this.WAIT_MEDIUM = waitTimes.medium || this.WAIT_MEDIUM;
      this.WAIT_LARGE = waitTimes.large || this.WAIT_LARGE;
    }

    // Button locators - using getByTestId with fallback
    this.newTreatmentButton = this.page.getByTestId('treatments-new-button')
      .or(this.page.locator('button:has-text("New Treatment")').first());
    
    // Search input - use getByPlaceholder (recommended Playwright method)
    this.searchInput = this.page.getByPlaceholder(/Search.*treatment/i)
      .or(this.page.locator('input[placeholder*="Search"], input[type="search"]').first());
    
    // Treatments list container - use semantic selectors
    this.treatmentsList = this.page.getByRole('main')
      .or(this.page.locator('main').first());
  }

  /**
   * Navigate to treatments page
   */
  async goto(locale: string = 'en') {
    await this.page.goto(`/${locale}/dashboard/risks/treatments`, { waitUntil: 'domcontentloaded' });
    await this.page.waitForLoadState('domcontentloaded');
    await this.page.waitForTimeout(this.WAIT_MEDIUM);
  }

  /**
   * Check if page is loaded
   */
  async isLoaded(): Promise<boolean> {
    try {
      // Use getByRole for headings (recommended Playwright method)
      const titleVisible = await this.page.getByRole('heading', { name: /Risk Treatments/i }).first().isVisible({ timeout: 5000 });
      return titleVisible;
    } catch {
      return false;
    }
  }

  /**
   * Open new treatment form
   */
  async openNewTreatmentForm() {
    const isVisible = await this.newTreatmentButton.isVisible({ timeout: 5000 }).catch(() => false);
    if (!isVisible) {
      throw new Error('New Treatment button not found');
    }
    
    await this.newTreatmentButton.scrollIntoViewIfNeeded();
    await this.page.waitForTimeout(this.WAIT_SMALL);
    await this.newTreatmentButton.click();
    await this.page.waitForTimeout(this.WAIT_MEDIUM);
    
    // Verify dialog/form is visible
    const dialog = this.page.locator('[role="dialog"]');
    const dialogVisible = await dialog.isVisible({ timeout: 3000 }).catch(() => false);
    if (!dialogVisible) {
      throw new Error('New Treatment form did not open');
    }
  }

  /**
   * Search for treatments
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
   * Get count of treatment cards
   */
  async getTreatmentCount(): Promise<number> {
    // Use getByTestId pattern matching, then fallback to role-based selectors
    const cardsWithTestId = this.page.locator('[data-testid^="treatment-card-"]');
    const testIdCount = await cardsWithTestId.count();
    if (testIdCount > 0) {
      return testIdCount;
    }
    // Fallback to semantic selectors
    const cards = this.page.getByRole('article').or(this.page.locator('.card'));
    return await cards.count();
  }

  /**
   * Check if dialog is visible
   */
  private async isDialogVisible(): Promise<boolean> {
    const dialog = this.page.locator('[role="dialog"]');
    return await dialog.isVisible({ timeout: 2000 }).catch(() => false);
  }

  /**
   * Fill treatment form - with slower, more deliberate filling
   */
  async fillTreatmentForm(options: { 
    title?: string; 
    description?: string; 
    strategy?: string; 
    status?: string;
    riskId?: string;
  }) {
    // Wait for form to be fully ready
    await this.page.waitForTimeout(this.WAIT_MEDIUM);

    // Fill risk ID (required for standalone treatments page)
    // Check if Risk field is visible (it will be if no riskId was passed to the form)
    const riskSelect = this.page.getByLabel('Risk').first();
    const riskVisible = await riskSelect.isVisible({ timeout: 3000 }).catch(() => false);
    if (riskVisible) {
      await this.page.waitForTimeout(this.WAIT_SMALL);
      await riskSelect.click();
      await this.page.waitForTimeout(this.WAIT_MEDIUM);
      
      // Get all available risk options
      const allOptions = await this.page.getByRole('option').all();
      if (allOptions.length > 0) {
        // Select the first available risk (skip any "Select a risk" placeholder)
        const firstOption = allOptions[0];
        const optionText = await firstOption.textContent().catch(() => '');
        
        if (optionText && !optionText.toLowerCase().includes('select')) {
          await firstOption.waitFor({ state: 'visible', timeout: 3000 });
          await this.page.waitForTimeout(this.WAIT_SMALL);
          await firstOption.click();
          await this.page.waitForTimeout(this.WAIT_MEDIUM);
          console.log(`✅ Selected risk: ${optionText.trim()}`);
        } else if (allOptions.length > 1) {
          // Try second option if first is placeholder
          const secondOption = allOptions[1];
          await secondOption.waitFor({ state: 'visible', timeout: 3000 });
          await this.page.waitForTimeout(this.WAIT_SMALL);
          await secondOption.click();
          await this.page.waitForTimeout(this.WAIT_MEDIUM);
          const secondOptionText = await secondOption.textContent().catch(() => '');
          console.log(`✅ Selected risk: ${secondOptionText.trim()}`);
        }
      }
    } else if (options.riskId) {
      // Risk field not visible but riskId provided - might already be set
      console.log('✅ Risk already selected or not required');
    }

    // Fill title - required field (slower typing)
    if (options.title) {
      const titleInput = this.page.getByLabel('Title').or(
        this.page.locator('input[name*="title"]').first()
      );
      await titleInput.waitFor({ state: 'visible', timeout: 5000 });
      await titleInput.clear({ timeout: 3000 });
      await this.page.waitForTimeout(this.WAIT_SMALL);
      // Type slowly to simulate human input
      await titleInput.type(options.title, { delay: 50 });
      await this.page.waitForTimeout(this.WAIT_MEDIUM);
      console.log(`✅ Filled treatment title: ${options.title}`);
    }

    // Fill description (slower typing)
    if (options.description) {
      await this.page.waitForTimeout(this.WAIT_SMALL);
      const descriptionTextarea = this.page.getByLabel('Description').or(
        this.page.locator('textarea[name*="description"]').first()
      );
      await descriptionTextarea.waitFor({ state: 'visible', timeout: 3000 }).catch(() => {});
      await descriptionTextarea.clear({ timeout: 3000 });
      await this.page.waitForTimeout(this.WAIT_SMALL);
      // Type slowly
      await descriptionTextarea.type(options.description, { delay: 50 });
      await this.page.waitForTimeout(this.WAIT_MEDIUM);
      console.log(`✅ Filled treatment description`);
    }

    // Fill strategy - required field (with delays)
    if (options.strategy) {
      try {
        await this.page.waitForTimeout(this.WAIT_SMALL);
        const strategySelect = this.page.getByLabel('Strategy').first();
        await strategySelect.waitFor({ state: 'visible', timeout: 5000 });
        await this.page.waitForTimeout(this.WAIT_MEDIUM);
        await strategySelect.click();
        await this.page.waitForTimeout(this.WAIT_MEDIUM);
        
        const option = this.page.getByRole('option', { name: new RegExp(options.strategy, 'i') }).first();
        await option.waitFor({ state: 'visible', timeout: 3000 });
        await this.page.waitForTimeout(this.WAIT_SMALL);
        await option.click();
        await this.page.waitForTimeout(this.WAIT_MEDIUM);
        console.log(`✅ Selected strategy: ${options.strategy}`);
      } catch (error: any) {
        console.log(`⚠️ Could not set strategy: ${error?.message}`);
      }
    }

    // Fill status - required field (with delays)
    if (options.status) {
      try {
        await this.page.waitForTimeout(this.WAIT_SMALL);
        const statusSelect = this.page.getByLabel('Status').first();
        await statusSelect.waitFor({ state: 'visible', timeout: 5000 });
        await this.page.waitForTimeout(this.WAIT_MEDIUM);
        await statusSelect.click();
        await this.page.waitForTimeout(this.WAIT_MEDIUM);
        
        const option = this.page.getByRole('option', { name: new RegExp(options.status, 'i') }).first();
        await option.waitFor({ state: 'visible', timeout: 3000 });
        await this.page.waitForTimeout(this.WAIT_SMALL);
        await option.click();
        await this.page.waitForTimeout(this.WAIT_MEDIUM);
        console.log(`✅ Selected status: ${options.status}`);
      } catch (error: any) {
        console.log(`⚠️ Could not set status: ${error?.message}`);
      }
    }
    
    // Final wait after all fields filled
    await this.page.waitForTimeout(this.WAIT_MEDIUM);
  }

  /**
   * Submit treatment form - using getByTestId (recommended Playwright method)
   */
  async submitTreatmentForm() {
    // Use getByTestId (recommended Playwright method) - preferred approach
    const submitButton = this.page.getByTestId('treatment-form-submit-create').or(
      this.page.getByTestId('treatment-form-submit-update')
    );
    
    const isVisible = await submitButton.isVisible({ timeout: 5000 }).catch(() => false);
    if (!isVisible) {
      throw new Error('Treatment form submit button not found (testid: treatment-form-submit-create or treatment-form-submit-update)');
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
    
    // Wait for dialog to close (form was submitted)
    // The dialog closing is a good indicator that the form submission started
    let dialogClosed = false;
    for (let i = 0; i < 10; i++) {
      const dialogStillVisible = await this.isDialogVisible();
      if (!dialogStillVisible) {
        dialogClosed = true;
        break;
      }
      await this.page.waitForTimeout(this.WAIT_MEDIUM);
    }
    
    if (!dialogClosed) {
      throw new Error('Treatment form did not close after submit');
    }
    
    // Wait additional time for backend processing and query invalidation
    await this.page.waitForTimeout(this.WAIT_MEDIUM * 3);
    
    console.log('✅ Treatment form submitted successfully');
  }
}
