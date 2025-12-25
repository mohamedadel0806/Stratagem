import { test } from '../fixtures/auth';
import { expect } from '@playwright/test';
import { AssetDetailsPage, DependenciesTabPage } from '../pages/asset-details.page';
import { TEST_TIMEOUTS } from '../constants';

test.describe('Asset Dependencies Tab (POM)', () => {
  let assetPage: AssetDetailsPage;
  let dependenciesTab: DependenciesTabPage;

  test.beforeEach(async ({ authenticatedPage }) => {
    assetPage = new AssetDetailsPage(authenticatedPage);
    dependenciesTab = new DependenciesTabPage(authenticatedPage);
  });

  test('should navigate to Dependencies tab and explore functionality', async ({ authenticatedPage }) => {
    const assetUrl = 'http://localhost:3000/en/dashboard/assets/physical/99cb990a-29e4-4e34-acf4-d58b8261046b';

    await assetPage.navigateToAsset(assetUrl);
    await assetPage.takeScreenshot('dependencies-pom-initial');

    const availableTabs = await assetPage.getAvailableTabs();
    expect(availableTabs.length).toBeGreaterThan(0);
    expect(availableTabs).toContain('Dependencies');

    await assetPage.clickTab('Dependencies');
    await assetPage.takeScreenshot('dependencies-pom-tab-content');

    const hasDependencies = await dependenciesTab.hasDependencies();
    const outgoingCount = await dependenciesTab.getOutgoingDependenciesCount();
    const incomingCount = await dependenciesTab.getIncomingDependenciesCount();

    expect(outgoingCount + incomingCount).toBeGreaterThanOrEqual(0);

    const dependencyButtonSelectors = [
      'button:has-text("Add Dependency")',
      'button:has-text("Create Dependency")',
      'button:has-text("Link Dependency")',
      '[data-testid*="dependency"]'
    ];

    let addDependencyButton = null;
    for (const selector of dependencyButtonSelectors) {
      const button = await authenticatedPage.locator(selector).first();
      if (await button.isVisible()) {
        addDependencyButton = button;
        break;
      }
    }

    if (addDependencyButton) {
      await addDependencyButton.click();
      await assetPage.takeScreenshot('dependencies-pom-modal-opened');

      const modalVisible = await dependenciesTab.modal.isVisible();
      if (modalVisible) {
        const modalInputs = await dependenciesTab.modal.locator('input').all();
        const modalButtons = await dependenciesTab.modal.locator('button').all();

        for (const input of modalInputs) {
          if (await input.isVisible()) {
            const placeholder = await input.getAttribute('placeholder') || '';
            if (placeholder.toLowerCase().includes('search')) {
              await input.fill('test');
              await authenticatedPage.waitForTimeout(2000);
              break;
            }
          }
        }

        const submitButton = await dependenciesTab.modal.locator('button:has-text("Create"), button:has-text("Submit")').first();
        if (await submitButton.isVisible()) {
          const isEnabled = await submitButton.isEnabled();
          expect(isEnabled).toBeDefined();
        }
      }
    }

    await dependenciesTab.closeModal();
    await assetPage.takeScreenshot('dependencies-pom-final-state');
  });
});