import { Page, Locator } from '@playwright/test';

/**
 * Page Object Model for Risk Settings Page
 * Encapsulates all interactions with the risk settings/configuration page
 */
export class RiskSettingsPage {
  readonly page: Page;

  // Main elements
  readonly saveButton: Locator;
  readonly resetButton: Locator;

  // Wait times (can be configured)
  private readonly WAIT_SMALL = 500;
  private readonly WAIT_MEDIUM = 1000;
  private readonly WAIT_LARGE = 2000;

  constructor(page: Page) {
    this.page = page;

    // Button locators
    this.saveButton = this.page.getByTestId('risk-settings-save-button');
    this.resetButton = this.page.getByTestId('risk-settings-reset-button');
  }

  /**
   * Navigate to risk settings page
   */
  async goto(locale: string = 'en') {
    await this.page.goto(`/${locale}/dashboard/risks/settings`);
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Check if page is loaded
   */
  async isLoaded(): Promise<boolean> {
    return await this.page.getByRole('heading', { name: /Risk Configuration/i }).first().isVisible();
  }

  /**
   * Save settings
   */
  async saveSettings() {
    await this.saveButton.waitFor({ state: 'visible', timeout: 5000 });
    await this.saveButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Reset to defaults
   */
  async resetToDefaults() {
    await this.resetButton.waitFor({ state: 'visible', timeout: 5000 });
    await this.resetButton.click();
    await this.page.waitForLoadState('networkidle');
  }
}



