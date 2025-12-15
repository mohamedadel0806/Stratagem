import { Page, Locator } from '@playwright/test';

/**
 * Page Object Model for Risk Categories Page
 * Encapsulates all interactions with the risk categories page
 */
export class RiskCategoriesPage {
  readonly page: Page;
  
  // Main elements
  readonly newCategoryButton: Locator;
  readonly searchInput: Locator;
  readonly categoriesList: Locator;
  
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

    // Button locators - using getByTestId (recommended Playwright method)
    this.newCategoryButton = this.page.getByTestId('risk-categories-new-button')
      .or(this.page.getByRole('button', { name: /New Category/i }).first());
    
    // Search input - using getByTestId
    this.searchInput = this.page.getByTestId('risk-categories-search-input')
      .or(this.page.getByPlaceholder(/Search.*categor/i).first());
    
    // Categories list container
    this.categoriesList = this.page.getByRole('main')
      .or(this.page.locator('main').first());
  }

  /**
   * Navigate to risk categories page
   */
  async goto(locale: string = 'en') {
    await this.page.goto(`/${locale}/dashboard/risks/categories`, { waitUntil: 'domcontentloaded' });
    await this.page.waitForLoadState('domcontentloaded');
    await this.page.waitForTimeout(this.WAIT_MEDIUM);
  }

  /**
   * Check if page is loaded
   */
  async isLoaded(): Promise<boolean> {
    try {
      // Use getByRole for headings (recommended Playwright method)
      // The heading might be "Risk Categories" or just "Categories"
      const titleVisible = await this.page.getByRole('heading').filter({ hasText: /Categor/i }).first().isVisible({ timeout: 5000 });
      return titleVisible;
    } catch {
      return false;
    }
  }

  /**
   * Open new category form
   */
  async openNewCategoryForm() {
    const isVisible = await this.newCategoryButton.isVisible({ timeout: 5000 }).catch(() => false);
    if (!isVisible) {
      throw new Error('New Category button not found');
    }
    
    await this.newCategoryButton.scrollIntoViewIfNeeded();
    await this.page.waitForTimeout(this.WAIT_SMALL);
    await this.newCategoryButton.click();
    await this.page.waitForTimeout(this.WAIT_MEDIUM);
    
    // Verify dialog/form is visible
    const dialog = this.page.getByRole('dialog');
    const dialogVisible = await dialog.isVisible({ timeout: 3000 }).catch(() => false);
    if (!dialogVisible) {
      throw new Error('New Category form did not open');
    }
  }

  /**
   * Search for categories
   */
  async search(query: string) {
    const inputVisible = await this.searchInput.isVisible({ timeout: 3000 }).catch(() => false);
    if (inputVisible) {
      await this.searchInput.clear();
      await this.searchInput.fill(query);
      await this.page.waitForTimeout(this.WAIT_MEDIUM); // Wait for search results
    }
  }
}
