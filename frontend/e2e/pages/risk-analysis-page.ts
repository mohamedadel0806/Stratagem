import { Page, Locator } from '@playwright/test';

/**
 * Page Object Model for Risk Analysis Page
 * Encapsulates all interactions with the risk analysis tools page
 */
export class RiskAnalysisPage {
  readonly page: Page;

  // Tab locators
  readonly compareTab: Locator;
  readonly whatIfTab: Locator;
  readonly reportsTab: Locator;

  constructor(page: Page) {
    this.page = page;

    // Tab locators - using getByTestId only
    this.compareTab = this.page.getByTestId('risk-analysis-tab-compare');
    this.whatIfTab = this.page.getByTestId('risk-analysis-tab-whatif');
    this.reportsTab = this.page.getByTestId('risk-analysis-tab-reports');
  }

  /**
   * Navigate to risk analysis page
   */
  async goto(locale: string = 'en') {
    await this.page.goto(`/${locale}/dashboard/risks/analysis`);
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Check if page is loaded
   */
  async isLoaded(): Promise<boolean> {
    try {
      await this.page.getByRole('heading', { name: /Risk Analysis Tools/i }).first().waitFor({ state: 'visible', timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Click on a specific tab
   */
  async clickTab(tabName: 'compare' | 'whatif' | 'reports') {
    const tabMap = {
      'compare': this.compareTab,
      'whatif': this.whatIfTab,
      'reports': this.reportsTab,
    };

    const tab = tabMap[tabName];
    await tab.waitFor({ state: 'visible', timeout: 10000 });

    // Check if tab is already active to avoid redundant clicks
    const isActive = await tab.getAttribute('data-state').catch(() => '');
    if (isActive === 'active') {
      return;
    }

    await tab.click();
    // Wait for the tab panel to be visible (usually associated with the tab content)
    await this.page.waitForLoadState('networkidle').catch(() => { });
  }
}



