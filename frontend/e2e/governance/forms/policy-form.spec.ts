import { test } from '../../fixtures/auth';
import { expect } from '@playwright/test';
import { PoliciesPage } from '../../pages/policies.page';
import { TEST_STATUS, TEST_REVIEW_FREQUENCY, TEST_TIMEOUTS } from '../../constants';
import { getTodayDate, getFutureDate, generateUniqueName } from '../../form-helpers';

test.describe('Policy Form', () => {
  test('should fill all policy form tabs and create record', async ({ authenticatedPage }) => {
    const policyTitle = generateUniqueName('Policy');
    const today = getTodayDate();
    const futureDate = getFutureDate(365);

    const policiesPage = new PoliciesPage(authenticatedPage);
    await policiesPage.goto();

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

    const contentTab = authenticatedPage.getByRole('tab', { name: 'Content' }).first();
    const hasContentTab = await contentTab.isVisible({ timeout: 2000 }).catch(() => false);
    if (hasContentTab) {
      await contentTab.click();
      await policiesPage.fillContentTab('Test policy content for E2E testing');
    }

    const settingsTab = authenticatedPage.getByRole('tab', { name: 'Settings' }).first();
    const hasSettingsTab = await settingsTab.isVisible({ timeout: 2000 }).catch(() => false);
    if (hasSettingsTab) {
      await settingsTab.click();
      await policiesPage.fillSettingsTab({
        requiresAcknowledgment: true,
        acknowledgmentDueDays: '30',
      });
    }

    await policiesPage.submitForm();

    await policiesPage.goto();
    await policiesPage.verifyPolicyExists(policyTitle);
  });

  test('should validate required fields', async ({ authenticatedPage }) => {
    const policiesPage = new PoliciesPage(authenticatedPage);
    await policiesPage.goto();

    await policiesPage.openCreateForm();

    const submitButton = authenticatedPage.getByRole('button', { name: /Create|Save/i }).first();
    await submitButton.click();

    const errorMessages = authenticatedPage.locator('[role="alert"], .text-red-500, .text-destructive');
    const hasErrors = await errorMessages.count() > 0;
    expect(hasErrors, 'Expected validation errors when submitting empty form').toBeTruthy();
  });
});
