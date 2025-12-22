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

  constructor(page: Page, waitTimes?: { small?: number; medium?: number; large?: number }) {
    this.page = page;
    
    // Configure wait times if provided
    if (waitTimes) {
      this.WAIT_SMALL = waitTimes.small || this.WAIT_SMALL;
      this.WAIT_MEDIUM = waitTimes.medium || this.WAIT_MEDIUM;
      this.WAIT_LARGE = waitTimes.large || this.WAIT_LARGE;
    }
  }

  /**
   * Navigate to risk dashboard page
   */
  async goto(locale: string = 'en') {
    await this.page.goto(`/${locale}/dashboard/risks/dashboard`, { waitUntil: 'domcontentloaded' });
    await this.page.waitForLoadState('domcontentloaded');
    await this.page.waitForTimeout(this.WAIT_MEDIUM);
  }

  /**
   * Check if page is loaded
   */
  async isLoaded(): Promise<boolean> {
    try {
      // Use getByRole for headings (recommended Playwright method)
      const titleVisible = await this.page.getByRole('heading', { name: /Risk Dashboard/i }).first().isVisible({ timeout: 5000 });
      return titleVisible;
    } catch {
      return false;
    }
  }

  /**
   * Get summary card value by label
   */
  async getSummaryValue(label: string): Promise<string | null> {
    try {
      // Look for the label text, then find the value nearby
      const labelElement = this.page.getByText(label, { exact: false });
      const card = labelElement.locator('..').locator('..'); // Navigate up to card
      const valueElement = card.getByRole('heading', { level: 2 }).or(card.locator('.text-2xl, .text-3xl'));
      const value = await valueElement.textContent();
      return value;
    } catch {
      return null;
    }
  }
}



