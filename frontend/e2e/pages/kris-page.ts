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

  constructor(page: Page, waitTimes?: { small?: number; medium?: number; large?: number }) {
    this.page = page;
    
    // Configure wait times if provided
    if (waitTimes) {
      this.WAIT_SMALL = waitTimes.small || this.WAIT_SMALL;
      this.WAIT_MEDIUM = waitTimes.medium || this.WAIT_MEDIUM;
      this.WAIT_LARGE = waitTimes.large || this.WAIT_LARGE;
    }

    // Button locators - using getByTestId with fallback
    this.newKriButton = this.page.getByTestId('kris-new-button')
      .or(this.page.locator('button:has-text("New KRI")').first());
    
    // Search input - use getByPlaceholder (recommended Playwright method)
    this.searchInput = this.page.getByPlaceholder(/Search.*kri/i)
      .or(this.page.locator('input[placeholder*="Search"], input[type="search"]').first());
    
    // KRIs list container - use semantic selectors
    this.krisList = this.page.getByRole('main')
      .or(this.page.locator('main').first());
  }

  /**
   * Navigate to KRIs page
   */
  async goto(locale: string = 'en') {
    await this.page.goto(`/${locale}/dashboard/risks/kris`, { waitUntil: 'domcontentloaded' });
    await this.page.waitForLoadState('domcontentloaded');
    await this.page.waitForTimeout(this.WAIT_MEDIUM);
  }

  /**
   * Check if page is loaded
   */
  async isLoaded(): Promise<boolean> {
    try {
      // Use getByRole for headings (recommended Playwright method)
      const titleVisible = await this.page.getByRole('heading', { name: /Key Risk Indicators|KRIs/i }).first().isVisible({ timeout: 5000 });
      return titleVisible;
    } catch {
      return false;
    }
  }

  /**
   * Open new KRI form
   */
  async openNewKriForm() {
    const isVisible = await this.newKriButton.isVisible({ timeout: 5000 }).catch(() => false);
    if (!isVisible) {
      throw new Error('New KRI button not found');
    }
    
    await this.newKriButton.scrollIntoViewIfNeeded();
    await this.page.waitForTimeout(this.WAIT_SMALL);
    await this.newKriButton.click();
    await this.page.waitForTimeout(this.WAIT_MEDIUM);
    
    // Verify dialog/form is visible
    const dialog = this.page.locator('[role="dialog"]');
    const dialogVisible = await dialog.isVisible({ timeout: 3000 }).catch(() => false);
    if (!dialogVisible) {
      throw new Error('New KRI form did not open');
    }
  }

  /**
   * Search for KRIs
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
   * Get count of KRI cards
   */
  async getKriCount(): Promise<number> {
    // Use getByTestId pattern matching, then fallback to role-based selectors
    const cardsWithTestId = this.page.locator('[data-testid^="kri-card-"]');
    const testIdCount = await cardsWithTestId.count();
    if (testIdCount > 0) {
      return testIdCount;
    }
    
    // KRI cards have Edit buttons with text "Edit" (not "Edit KRI" or anything else)
    // Use a simpler approach: find all buttons with text "Edit" and count their parent cards
    const editButtons = this.page.locator('button').filter({ hasText: /^Edit$/ });
    const editButtonCount = await editButtons.count();
    
    if (editButtonCount > 0) {
      // Each Edit button should be in a KRI card
      // We can count unique cards by going up to the card container
      // But simpler: just return the count of Edit buttons (one per KRI card)
      return editButtonCount;
    }
    
    // Fallback: Look for cards that contain Delete buttons (KRI cards have Delete buttons too)
    const deleteButtons = this.page.locator('button').filter({ hasText: /^Delete$/ });
    const deleteButtonCount = await deleteButtons.count();
    
    if (deleteButtonCount > 0) {
      return deleteButtonCount;
    }
    
    // Last resort: Look for grid with cards (but exclude filter/search card)
    // The filter/search card is in a Card but not in the grid
    const gridCards = this.page.locator('div.grid .card');
    const gridCardCount = await gridCards.count();
    return gridCardCount;
  }

  /**
   * Check if dialog is visible
   */
  private async isDialogVisible(): Promise<boolean> {
    const dialog = this.page.locator('[role="dialog"]');
    return await dialog.isVisible({ timeout: 2000 }).catch(() => false);
  }

  /**
   * Fill KRI form - with slower, more deliberate filling
   */
  async fillKriForm(options: { 
    name?: string; 
    description?: string; 
    measurementFrequency?: string;
    categoryId?: string;
  }) {
    // Wait for form to be fully ready
    await this.page.waitForTimeout(this.WAIT_MEDIUM);

    // Fill name - required field (slower typing)
    if (options.name) {
      const nameInput = this.page.getByLabel('Name').or(
        this.page.locator('input[name*="name"]').first()
      );
      await nameInput.waitFor({ state: 'visible', timeout: 5000 });
      await nameInput.clear({ timeout: 3000 });
      await this.page.waitForTimeout(this.WAIT_SMALL);
      // Type slowly to simulate human input
      await nameInput.type(options.name, { delay: 50 });
      await this.page.waitForTimeout(this.WAIT_MEDIUM);
      console.log(`✅ Filled KRI name: ${options.name}`);
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
      console.log(`✅ Filled KRI description`);
    }

    // Fill measurement frequency (with delays)
    if (options.measurementFrequency) {
      try {
        await this.page.waitForTimeout(this.WAIT_SMALL);
        const frequencySelect = this.page.getByLabel('Measurement Frequency').first();
        const frequencyVisible = await frequencySelect.isVisible({ timeout: 5000 }).catch(() => false);
        
        if (frequencyVisible) {
          await frequencySelect.click();
          await this.page.waitForTimeout(this.WAIT_MEDIUM);
          
          const option = this.page.getByRole('option', { name: new RegExp(options.measurementFrequency, 'i') }).first();
          await option.waitFor({ state: 'visible', timeout: 3000 });
          await this.page.waitForTimeout(this.WAIT_SMALL);
          await option.click();
          await this.page.waitForTimeout(this.WAIT_MEDIUM);
          console.log(`✅ Selected measurement frequency: ${options.measurementFrequency}`);
        }
      } catch (error: any) {
        console.log(`⚠️ Could not set measurement frequency: ${error?.message}`);
      }
    }

    // Fill category if provided (with delays)
    if (options.categoryId) {
      try {
        await this.page.waitForTimeout(this.WAIT_SMALL);
        const categorySelect = this.page.getByLabel('Category').first();
        const categoryVisible = await categorySelect.isVisible({ timeout: 5000 }).catch(() => false);
        
        if (categoryVisible) {
          await categorySelect.click();
          await this.page.waitForTimeout(this.WAIT_MEDIUM);
          
          // Try to find category by ID or name
          const categoryOption = this.page.getByRole('option').filter({ hasText: new RegExp(options.categoryId, 'i') }).first();
          const optionVisible = await categoryOption.isVisible({ timeout: 3000 }).catch(() => false);
          if (optionVisible) {
            await categoryOption.waitFor({ state: 'visible', timeout: 3000 });
            await this.page.waitForTimeout(this.WAIT_SMALL);
            await categoryOption.click();
            await this.page.waitForTimeout(this.WAIT_MEDIUM);
            const optionText = await categoryOption.textContent().catch(() => '');
            console.log(`✅ Selected category: ${optionText.trim()}`);
          }
        }
      } catch (error: any) {
        console.log(`⚠️ Could not set category: ${error?.message}`);
      }
    }
    
    // Final wait after all fields filled
    await this.page.waitForTimeout(this.WAIT_MEDIUM);
  }

  /**
   * Submit KRI form - using getByTestId (recommended Playwright method)
   */
  async submitKriForm() {
    // Use getByTestId (recommended Playwright method) - preferred approach
    const submitButton = this.page.getByTestId('kri-form-submit-create').or(
      this.page.getByTestId('kri-form-submit-update')
    );
    
    const isVisible = await submitButton.isVisible({ timeout: 5000 }).catch(() => false);
    if (!isVisible) {
      throw new Error('KRI form submit button not found (testid: kri-form-submit-create or kri-form-submit-update)');
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
      throw new Error('KRI form did not close after submit');
    }
    
    // Wait additional time for backend processing and query invalidation
    await this.page.waitForTimeout(this.WAIT_MEDIUM * 3);
    
    console.log('✅ KRI form submitted successfully');
  }
}
