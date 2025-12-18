import { test, expect } from '../fixtures/auth';
import { RiskSettingsPage } from '../pages/risk-settings-page';

/**
 * Risk Settings Page Test
 */

test.describe('Risk Settings Page', () => {
  test.setTimeout(120000); // 2 minutes

  const waitTimes = {
    small: 500,
    medium: 1000,
    large: 2000,
  };

  test('should load and display risk settings page', async ({ authenticatedPage }) => {
    console.log('\n===== TESTING RISK SETTINGS PAGE =====');
    
    const settingsPage = new RiskSettingsPage(authenticatedPage, waitTimes);
    
    await settingsPage.goto('en');
    
    const isLoaded = await settingsPage.isLoaded();
    expect(isLoaded).toBeTruthy();
    console.log('✅ Risk settings page loaded');
    
    // Verify buttons exist (but don't actually save/reset to avoid changing settings)
    const saveButtonVisible = await settingsPage.saveButton.isVisible({ timeout: 3000 }).catch(() => false);
    const resetButtonVisible = await settingsPage.resetButton.isVisible({ timeout: 3000 }).catch(() => false);
    
    expect(saveButtonVisible).toBeTruthy();
    expect(resetButtonVisible).toBeTruthy();
    console.log('✅ Save and Reset buttons found');
  });
});

