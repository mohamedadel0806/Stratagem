import { test } from '../fixtures/auth-storage';
import { expect } from '@playwright/test';
import { ControlsPage } from '../pages/controls.page';
import { TEST_STATUS, TEST_CONTROL_TYPE, TEST_SEVERITY, TEST_IMPLEMENTATION_STATUS, TEST_TIMEOUTS } from '../constants';
import { generateUniqueIdentifier, generateUniqueName } from '../form-helpers';

test.describe('Control Library E2E Tests', () => {
  let controlsPage: ControlsPage;

  test.beforeEach(async ({ authenticatedPage }) => {
    controlsPage = new ControlsPage(authenticatedPage);
    await authenticatedPage.goto('/en/dashboard/governance/controls', { timeout: 15000 });
    await authenticatedPage.waitForLoadState('domcontentloaded', { timeout: 10000 });
    await authenticatedPage.waitForTimeout(2000);
  });

  test('should display controls list page', async ({ authenticatedPage }) => {
    await expect(authenticatedPage.locator('h1')).toContainText(/Control/i, { timeout: TEST_TIMEOUTS.MEDIUM });
    await controlsPage.verifyTableVisible();
    await expect(authenticatedPage.locator('th:has-text("Title"), th:has-text("Control")')).toBeVisible();
  });

  test('should create a new control', async ({ authenticatedPage }) => {
    const controlTitle = generateUniqueName('Control');
    const controlIdentifier = generateUniqueIdentifier('CTRL');

    await controlsPage.openCreateForm();
    await controlsPage.fillForm({
      identifier: controlIdentifier,
      title: controlTitle,
      description: 'E2E test control description',
      status: TEST_STATUS.DRAFT,
      controlType: TEST_CONTROL_TYPE.PREVENTIVE,
      complexity: TEST_SEVERITY.MEDIUM,
      costImpact: TEST_SEVERITY.LOW,
      domain: 'IAM',
      implementationStatus: TEST_IMPLEMENTATION_STATUS.NOT_IMPLEMENTED,
      controlProcedures: 'Test control procedures description',
      testingProcedures: 'Test testing procedures description',
    });
    await controlsPage.submitForm();

    await controlsPage.goto();
    await controlsPage.verifyControlExists(controlTitle);
  });

  test('should view control details', async ({ authenticatedPage }) => {
    await controlsPage.verifyTableVisible();

    const rowCount = await authenticatedPage.locator('table tbody tr').count();
    expect(rowCount, 'Expected at least one control to view details').toBeGreaterThan(0);

    await authenticatedPage.locator('table tbody tr').first().click();

    await authenticatedPage.waitForURL(/\/controls\/[^/]+/, { timeout: TEST_TIMEOUTS.MEDIUM });
    await authenticatedPage.waitForLoadState('networkidle');
    await expect(authenticatedPage.locator('h1, h2, h3').first()).toBeVisible({ timeout: TEST_TIMEOUTS.MEDIUM });
  });

  test('should search for controls', async ({ authenticatedPage }) => {
    await controlsPage.verifyTableVisible();

    await controlsPage.search('test');
    await authenticatedPage.waitForLoadState('networkidle');
    await expect(authenticatedPage.locator('table tbody tr').first()).toBeVisible();
  });
});
