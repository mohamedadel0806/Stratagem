import { test } from '../fixtures/auth-storage';
import { expect } from '@playwright/test';
import { PoliciesPage } from '../pages/policies.page';
import { TEST_STATUS, TEST_REVIEW_FREQUENCY, TEST_TIMEOUTS } from '../constants';
import { getTodayDate, getFutureDate, generateUniqueName } from '../form-helpers';
import { navigateToDetails } from '../utils/helpers';

test.describe('Policy Management E2E Tests', () => {
  let policiesPage: PoliciesPage;

  test.beforeEach(async ({ authenticatedPage }) => {
    policiesPage = new PoliciesPage(authenticatedPage);
    // Use page object's goto which has robust waiting
    await policiesPage.goto();
  });

  test('should display policies list page', async ({ authenticatedPage }) => {
    await expect(authenticatedPage.locator('h1')).toContainText('Policies', { timeout: TEST_TIMEOUTS.MEDIUM });
    await policiesPage.verifyTableVisible();
    await expect(authenticatedPage.locator('th:has-text("Title")')).toBeVisible();
    await expect(authenticatedPage.locator('th:has-text("Version")')).toBeVisible();
    await expect(authenticatedPage.locator('th:has-text("Status")')).toBeVisible();
  });

  test('should create a new policy', async ({ authenticatedPage }) => {
    const policyTitle = generateUniqueName('Policy');
    const today = getTodayDate();
    const futureDate = getFutureDate(365);

    await policiesPage.openCreateForm();
    await policiesPage.fillBasicInformationTab({
      policyType: 'Information Security',
      title: policyTitle,
      purpose: 'Test policy purpose for E2E testing',
      scope: 'Test policy scope description',
      status: TEST_STATUS.DRAFT,
      effectiveDate: today,
      nextReviewDate: futureDate,
      reviewFrequency: TEST_REVIEW_FREQUENCY.ANNUAL,
    });
    await policiesPage.fillContentTab('Test policy content for E2E testing');
    await policiesPage.fillSettingsTab({
      requiresAcknowledgment: true,
      acknowledgmentDueDays: '30',
    });
    await policiesPage.submitForm();

    await policiesPage.goto();
    await policiesPage.verifyPolicyExists(policyTitle);
  });

  test('should search for policies', async ({ authenticatedPage }) => {
    await policiesPage.verifyTableVisible();

    await policiesPage.search('test');
    await authenticatedPage.waitForLoadState('networkidle');
    await expect(authenticatedPage.locator('table tbody tr').first()).toBeVisible();
  });

  test('should filter policies by status', async ({ authenticatedPage }) => {
    await policiesPage.verifyTableVisible();

    await policiesPage.filterByStatus(TEST_STATUS.DRAFT);
    await authenticatedPage.waitForLoadState('networkidle');
    await expect(authenticatedPage.locator('table').first()).toBeVisible({ timeout: TEST_TIMEOUTS.SHORT });
  });
});
