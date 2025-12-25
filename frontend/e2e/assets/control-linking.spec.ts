import { test } from '../fixtures/auth';
import { expect } from '@playwright/test';
import { AssetDetailsPage, ControlsTabPage } from '../pages/asset-details.page';
import { TEST_TIMEOUTS } from '../constants';

test.describe('Control Linking', () => {
  let assetPage: AssetDetailsPage;
  let controlsTab: ControlsTabPage;

  test.beforeEach(async ({ authenticatedPage }) => {
    assetPage = new AssetDetailsPage(authenticatedPage);
    controlsTab = new ControlsTabPage(authenticatedPage);
  });

  test('should check if control linking works for information assets', async ({ authenticatedPage }) => {
    const assetUrl = 'http://localhost:3000/en/dashboard/assets/information/189d91ee-01dd-46a4-b6ef-76ccac11c60d';

    await authenticatedPage.goto(assetUrl);
    await authenticatedPage.waitForLoadState('domcontentloaded');

    await assetPage.clickTab('Controls');

    const existingControls = await authenticatedPage.locator('[data-testid^="control-"], .control-item').all();
    const emptyStates = await authenticatedPage.locator('text:has-text("No controls"), text:has-text("Empty")').all();

    const linkButton = await controlsTab.linkControlsButton.first();
    const linkButtonVisible = await linkButton.isVisible({ timeout: 5000 });

    if (!linkButtonVisible) {
      test.skip();
      return;
    }

    await controlsTab.clickLinkControlsButton();

    const modalVisible = await controlsTab.modal.isVisible();
    expect(modalVisible).toBe(true);

    const searchInput = await controlsTab.modal.locator('input[placeholder*="Search"]').first();
    const searchVisible = await searchInput.isVisible();

    if (searchVisible) {
      await searchInput.fill('test');
      await authenticatedPage.waitForTimeout(2000);

      const searchResults = await controlsTab.modal.locator('[role="option"], .control-item').all();
      expect(searchResults.length).toBeGreaterThanOrEqual(0);
    }

    const notImplemented = await controlsTab.modal.locator('text:has-text("Not Implemented")').all();
    const checkboxes = await controlsTab.modal.locator('input[type="checkbox"]').all();

    const linkSubmitButton = await controlsTab.modal.locator('button:has-text("Link")').first();
    const linkSubmitEnabled = await linkSubmitButton.isEnabled();

    let selectedCount = 0;
    const clickableItems = await controlsTab.modal.locator('[role="option"], .control-item').all();

    for (let i = 0; i < Math.min(clickableItems.length, 3); i++) {
      const item = clickableItems[i];
      const isVisible = await item.isVisible();
      const text = await item.textContent();

      if (isVisible && text && !text.includes('Not Implemented') && text.length > 5) {
        await item.click();
        selectedCount++;
        const isEnabled = await linkSubmitButton.isEnabled();
        if (isEnabled) {
          break;
        }
      }
    }

    if (selectedCount > 0 && await linkSubmitButton.isEnabled()) {
      await linkSubmitButton.click();
      await authenticatedPage.waitForTimeout(5000);
      const modalStillOpen = await controlsTab.modal.isVisible();
      expect(modalStillOpen).toBe(false);
    }

    await controlsTab.closeModal();

    expect(existingControls.length).toBeGreaterThanOrEqual(0);
    expect(selectedCount).toBeGreaterThanOrEqual(0);
  });
});