import { test } from '../fixtures/auth-storage';
import { expect } from '@playwright/test';
import { FindingsPage } from '../pages/findings.page';
import { TEST_STATUS, TEST_SEVERITY, TEST_TIMEOUTS } from '../constants';
import { getTodayDate, getFutureDate, generateUniqueIdentifier, generateUniqueName } from '../form-helpers';
import { navigateToDetails } from '../utils/helpers';

test.describe('Findings Tracker E2E Tests', () => {
  let findingsPage: FindingsPage;

  test.beforeEach(async ({ authenticatedPage }) => {
    findingsPage = new FindingsPage(authenticatedPage);
    await authenticatedPage.goto('/en/dashboard/governance/findings', { timeout: 15000 });
    await authenticatedPage.waitForLoadState('domcontentloaded', { timeout: 10000 });
    await authenticatedPage.waitForTimeout(2000);
  });

  test('should display findings list page', async ({ authenticatedPage }) => {
    await expect(authenticatedPage.locator('h1, h2').filter({ hasText: /Finding/i })).toBeVisible({ timeout: TEST_TIMEOUTS.MEDIUM });
    await findingsPage.verifyTableVisible();
    await expect(authenticatedPage.locator('th:has-text("Title"), th:has-text("Finding")').first()).toBeVisible();
  });

  test('should create a new finding', async ({ authenticatedPage }) => {
    const findingTitle = generateUniqueName('Finding');
    const findingIdentifier = generateUniqueIdentifier('FIND');
    const today = getTodayDate();
    const futureDate = getFutureDate(30);

    await findingsPage.openCreateForm();
    await findingsPage.fillForm({
      identifier: findingIdentifier,
      title: findingTitle,
      description: 'Test finding description for E2E testing. This is a detailed description of the finding.',
      severity: TEST_SEVERITY.MEDIUM,
      status: TEST_STATUS.OPEN,
      findingDate: today,
      remediationPlan: 'Test remediation plan for E2E testing',
      remediationDueDate: futureDate,
      retestRequired: true,
    });
    await findingsPage.submitForm();

    await findingsPage.goto();
    await findingsPage.verifyFindingExists(findingTitle);
  });

  test('should filter findings by severity', async ({ authenticatedPage }) => {
    await findingsPage.verifyTableVisible();

    await findingsPage.filterBySeverity(TEST_SEVERITY.MEDIUM);
    await authenticatedPage.waitForLoadState('networkidle');
    await expect(authenticatedPage.locator('table').first()).toBeVisible({ timeout: TEST_TIMEOUTS.SHORT });
  });
});
