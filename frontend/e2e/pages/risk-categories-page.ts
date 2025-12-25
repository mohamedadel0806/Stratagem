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

  constructor(page: Page) {
    this.page = page;

    // Button locators
    this.newCategoryButton = this.page.getByTestId('risk-categories-new-button');
    this.searchInput = this.page.getByTestId('risk-categories-search-input');
    this.categoriesList = this.page.getByTestId('risk-categories-list');
  }

  /**
   * Navigate to risk categories page
   */
  async goto(locale: string = 'en') {
    await this.page.goto(`/${locale}/dashboard/risks/categories`);
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Check if page is loaded
   */
  async isLoaded(): Promise<boolean> {
    return await this.page.getByRole('heading').filter({ hasText: /Categor/i }).first().isVisible();
  }

  /**
   * Open new category form
   */
  async openNewCategoryForm() {
    await this.newCategoryButton.waitFor({ state: 'visible', timeout: 5000 });
    await this.newCategoryButton.click();
    await this.page.getByRole('dialog').waitFor({ state: 'visible', timeout: 5000 });
  }

  /**
   * Search for categories
   */
  async search(query: string) {
    await this.searchInput.fill(query);
    await this.page.waitForLoadState('networkidle').catch(() => { });
  }
}



