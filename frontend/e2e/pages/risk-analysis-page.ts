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

    // Tab locators - using getByTestId (recommended Playwright method)
    this.compareTab = this.page.getByTestId('risk-analysis-tab-compare')
      .or(this.page.getByRole('tab', { name: /Compare Risks/i }).first());
    
    this.whatIfTab = this.page.getByTestId('risk-analysis-tab-whatif')
      .or(this.page.getByRole('tab', { name: /What-If Analysis/i }).first());
    
    this.reportsTab = this.page.getByTestId('risk-analysis-tab-reports')
      .or(this.page.getByRole('tab', { name: /Custom Reports/i }).first());
  }

  /**
   * Navigate to risk analysis page
   */
  async goto(locale: string = 'en') {
    await this.page.goto(`/${locale}/dashboard/risks/analysis`, { waitUntil: 'domcontentloaded' });
    await this.page.waitForLoadState('domcontentloaded');
    await this.page.waitForTimeout(this.WAIT_MEDIUM);
  }

  /**
   * Check if page is loaded
   */
  async isLoaded(): Promise<boolean> {
    try {
      // Use getByRole for headings (recommended Playwright method)
      const titleVisible = await this.page.getByRole('heading', { name: /Risk Analysis Tools/i }).first().isVisible({ timeout: 5000 });
      return titleVisible;
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
      await this.page.waitForTimeout(this.WAIT_MEDIUM);
      return;
    }
    
    await tab.click();
    await this.page.waitForTimeout(this.WAIT_MEDIUM);
  }
}

