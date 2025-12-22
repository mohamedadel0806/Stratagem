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

  constructor(page: Page, waitTimes?: { small?: number; medium?: number; large?: number }) {
    this.page = page;
    
    // Configure wait times if provided
    if (waitTimes) {
      this.WAIT_SMALL = waitTimes.small || this.WAIT_SMALL;
      this.WAIT_MEDIUM = waitTimes.medium || this.WAIT_MEDIUM;
      this.WAIT_LARGE = waitTimes.large || this.WAIT_LARGE;
    }

    // Button locators - using getByTestId only (Playwright Advisory Guide compliant)
    this.saveButton = this.page.getByTestId('risk-settings-save-button');

    this.resetButton = this.page.getByTestId('risk-settings-reset-button');
  }

  /**
   * Navigate to risk settings page
   */
  async goto(locale: string = 'en') {
    await this.page.goto(`/${locale}/dashboard/risks/settings`, { waitUntil: 'domcontentloaded' });
    await this.page.waitForLoadState('domcontentloaded');
    await this.page.waitForTimeout(this.WAIT_MEDIUM);
  }

  /**
   * Check if page is loaded
   */
  async isLoaded(): Promise<boolean> {
    try {
      // Use getByRole for headings (recommended Playwright method)
      const titleVisible = await this.page.getByRole('heading', { name: /Risk Configuration/i }).first().isVisible({ timeout: 5000 });
      return titleVisible;
    } catch {
      return false;
    }
  }

  /**
   * Save settings
   */
  async saveSettings() {
    const isVisible = await this.saveButton.isVisible({ timeout: 5000 }).catch(() => false);
    if (!isVisible) {
      throw new Error('Save button not found');
    }
    
    const isEnabled = await this.saveButton.isEnabled().catch(() => false);
    if (!isEnabled) {
      throw new Error('Save button is disabled');
    }
    
    await this.saveButton.scrollIntoViewIfNeeded();
    await this.page.waitForTimeout(this.WAIT_SMALL);
    await this.saveButton.click();
    await this.page.waitForTimeout(this.WAIT_MEDIUM);
  }

  /**
   * Reset to defaults
   */
  async resetToDefaults() {
    const isVisible = await this.resetButton.isVisible({ timeout: 5000 }).catch(() => false);
    if (!isVisible) {
      throw new Error('Reset button not found');
    }
    
    await this.resetButton.scrollIntoViewIfNeeded();
    await this.page.waitForTimeout(this.WAIT_SMALL);
    await this.resetButton.click();
    await this.page.waitForTimeout(this.WAIT_MEDIUM);
  }
}



