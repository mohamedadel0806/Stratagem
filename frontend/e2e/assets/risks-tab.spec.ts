import { test } from '../fixtures/auth';
import { expect } from '@playwright/test';
import { AssetDetailsPage, RisksTabPage } from '../pages/asset-details.page';
import { TEST_TIMEOUTS } from '../constants';

test.describe('Asset Risks Tab (POM)', () => {
  let assetPage: AssetDetailsPage;
  let risksTab: RisksTabPage;

  test.beforeEach(async ({ authenticatedPage }) => {
    assetPage = new AssetDetailsPage(authenticatedPage);
    risksTab = new RisksTabPage(authenticatedPage);
  });

  test('should navigate to Risks tab and explore functionality', async ({ authenticatedPage }) => {
    const assetUrl = 'http://localhost:3000/en/dashboard/assets/physical/99cb990a-29e4-4e34-acf4-d58b8261046b';

    await assetPage.navigateToAsset(assetUrl);
    await assetPage.takeScreenshot('risks-pom-initial');

    const availableTabs = await assetPage.getAvailableTabs();
    expect(availableTabs.length).toBeGreaterThan(0);
    expect(availableTabs).toContain('Risks');

    await assetPage.clickRisksTab();
    await assetPage.takeScreenshot('risks-pom-tab-content');

    const hasRisks = await risksTab.hasLinkedRisks();
    const risksCount = await risksTab.getLinkedRisksCount();

    expect(risksCount).toBeGreaterThanOrEqual(0);

    const riskLinkingSelectors = [
      'button:has-text("Link Risk")',
      'button:has-text("Add Risk")',
      '[data-testid*="link"]',
      '[data-testid*="risk"]'
    ];

    let linkRiskButton = null;
    for (const selector of riskLinkingSelectors) {
      const button = await authenticatedPage.locator(selector).first();
      if (await button.isVisible()) {
        linkRiskButton = button;
        break;
      }
    }

    if (linkRiskButton) {
      await linkRiskButton.click();

      const modalVisible = await risksTab.modal.isVisible();
      if (modalVisible) {
        await assetPage.takeScreenshot('risks-pom-modal-opened');

        const searchInput = risksTab.riskSearchInput;
        if (await searchInput.isVisible()) {
          await searchInput.fill('security');
          await assetPage.takeScreenshot('risks-pom-search-results');
        }

        const dropdownTrigger = risksTab.riskDropdownTrigger;
        if (await dropdownTrigger.isVisible()) {
          await dropdownTrigger.click();
          await assetPage.takeScreenshot('risks-pom-dropdown-open');

          const riskOptions = await risksTab.getRiskOptions().all();
          if (riskOptions.length > 0) {
            await riskOptions[0].click();
            await assetPage.takeScreenshot('risks-pom-risk-selected');
          }
        }

        const submitButton = risksTab.riskDialogSubmitButton;
        if (await submitButton.isVisible()) {
          const isEnabled = await submitButton.isEnabled();
          if (isEnabled) {
            await submitButton.click();
            const modalStillOpen = await risksTab.modal.isVisible();
            expect(modalStillOpen).toBe(false);
            await assetPage.takeScreenshot('risks-pom-linking-success');
          }
        }
      }
    }

    await risksTab.closeModal();
    await assetPage.takeScreenshot('risks-pom-final-state');
  });
});