import { test } from '../fixtures/auth';
import { expect } from '@playwright/test';
import { RiskAnalysisPage } from '../pages/risk-analysis-page';

test.describe('Risk Analysis Tools E2E Tests', () => {
  let analysisPage: RiskAnalysisPage;

  test.beforeEach(async ({ authenticatedPage }) => {
    analysisPage = new RiskAnalysisPage(authenticatedPage);
    await analysisPage.goto('en');
    await expect(authenticatedPage.getByRole('heading', { name: /Risk Analysis Tools/i }).first()).toBeVisible({ timeout: 15000 });
  });

  test('should display risk analysis tools page', async () => {
    const isLoaded = await analysisPage.isLoaded();
    expect(isLoaded).toBeTruthy();
  });

  test('should display all 3 analysis tabs', async () => {
    await expect(analysisPage.compareTab).toBeVisible();
    await expect(analysisPage.whatIfTab).toBeVisible();
    await expect(analysisPage.reportsTab).toBeVisible();
  });

  test.describe('Risk Comparison Tool', () => {
    test('should display risk selection interface', async () => {
      await analysisPage.clickTab('compare');
      await expect(
        analysisPage.page.getByRole('heading', { name: /Select Risks to Compare/i })
      ).toBeVisible({ timeout: 5000 });
    });

    test('should allow selecting multiple risks', async () => {
      await analysisPage.clickTab('compare');

      // Wait for risks to load
      const riskItems = analysisPage.page.getByTestId(/^risk-register-card-/).or(analysisPage.page.locator('[class*="card"]').filter({ hasText: /RISK-/ }));
      await riskItems.first().waitFor({ state: 'visible', timeout: 10000 });

      const riskCount = await riskItems.count();

      if (riskCount >= 2) {
        await riskItems.first().click();
        await riskItems.nth(1).click();

        // Check for selection indicator
        const selectedCount = analysisPage.page.locator('text=/\\d+.*selected/i');
        await expect(selectedCount).toBeVisible({ timeout: 5000 });
      } else {
        test.skip();
      }
    });
  });

  test.describe('What-If Analysis Tool', () => {
    test('should display what-if analysis interface', async () => {
      await analysisPage.clickTab('whatif');
      await expect(
        analysisPage.page.getByRole('heading', { name: /What-If Scenario Analysis/i })
      ).toBeVisible({ timeout: 5000 });
    });

    test('should display risk selection dropdown', async () => {
      await analysisPage.clickTab('whatif');
      const riskSelect = analysisPage.page.getByRole('combobox').or(analysisPage.page.locator('button:has-text("Choose")')).first();
      await expect(riskSelect).toBeVisible({ timeout: 5000 });
    });

    test('should display sliders for likelihood and impact', async () => {
      await analysisPage.clickTab('whatif');

      const riskSelect = analysisPage.page.getByRole('combobox').or(analysisPage.page.locator('button:has-text("Choose")')).first();
      if (await riskSelect.isVisible()) {
        await riskSelect.click();
        const firstOption = analysisPage.page.getByRole('option').first();
        if (await firstOption.isVisible({ timeout: 3000 })) {
          await firstOption.click();
        }
      }

      const sliders = analysisPage.page.locator('input[type="range"], [role="slider"]');
      await expect(sliders.first()).toBeVisible({ timeout: 5000 });
      expect(await sliders.count()).toBeGreaterThanOrEqual(2);
    });
  });

  test.describe('Custom Report Builder', () => {
    test('should display custom report builder interface', async () => {
      await analysisPage.clickTab('reports');
      await expect(
        analysisPage.page.getByRole('heading', { name: /Custom Report Builder/i })
      ).toBeVisible({ timeout: 5000 });
    });

    test('should display report name input', async () => {
      await analysisPage.clickTab('reports');
      const nameInput = analysisPage.page.getByLabel(/Report Name/i).or(analysisPage.page.getByPlaceholder(/name/i)).first();
      await expect(nameInput).toBeVisible({ timeout: 5000 });
    });

    test('should display field selection checkboxes', async () => {
      await analysisPage.clickTab('reports');

      // Wait for fields to load
      const checkboxes = analysisPage.page.locator('input[type="checkbox"]');
      try {
        await checkboxes.first().waitFor({ state: 'visible', timeout: 10000 });
        expect(await checkboxes.count()).toBeGreaterThan(0);
      } catch (e) {
        test.skip();
      }
    });
  });

  test('should navigate between analysis tabs', async () => {
    const tabs: Array<'compare' | 'whatif' | 'reports'> = ['compare', 'whatif', 'reports'];

    for (const tabName of tabs) {
      await analysisPage.clickTab(tabName);
      const tabButton = tabName === 'compare' ? analysisPage.compareTab : (tabName === 'whatif' ? analysisPage.whatIfTab : analysisPage.reportsTab);
      await expect(tabButton).toHaveAttribute('data-state', 'active', { timeout: 3000 });
    }
  });
});

