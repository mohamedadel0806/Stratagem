import { Page, Locator } from '@playwright/test';

/**
 * Page Object Model for Risk Dashboard Page
 * Encapsulates all interactions with the risk dashboard page
 */
export class RiskDashboardPage {
  readonly page: Page;

  // Wait times (can be configured)
  private readonly WAIT_SMALL = 500;
  private readonly WAIT_MEDIUM = 1000;
  private readonly WAIT_LARGE = 2000;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Navigate to risk dashboard page
   */
  async goto(locale: string = 'en') {
    await this.page.goto(`/${locale}/dashboard/risks/dashboard`);
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Check if page is loaded
   */
  async isLoaded(): Promise<boolean> {
    return await this.page.getByRole('heading', { name: /Risk Dashboard/i }).first().isVisible();
  }

  /**
   * Get summary card value by label
   */
  async getSummaryValue(label: string): Promise<string | null> {
    try {
      const card = this.page.locator('.card').filter({ hasText: label });
      const valueElement = card.getByRole('heading', { level: 2 }).or(card.locator('.text-2xl, .text-3xl'));
      return await valueElement.textContent();
    } catch {
      return null;
    }
  }
}



