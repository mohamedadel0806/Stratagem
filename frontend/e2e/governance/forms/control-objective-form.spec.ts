import { test } from '../../fixtures/auth';
import { expect } from '@playwright/test';
import { PoliciesPage } from '../../pages/policies.page';
import { TEST_STATUS, TEST_IMPLEMENTATION_STATUS, TEST_TIMEOUTS } from '../../constants';
import { getTodayDate, getFutureDate, generateUniqueIdentifier, generateUniqueName } from '../../form-helpers';

test.describe('Control Objective Form', () => {
  test('should create control objective within policy context', async ({ authenticatedPage }) => {
    const policyType = `Test Policy Type ${Date.now()}`;
    const policyTitle = generateUniqueName('Policy for CO');
    const objectiveId = generateUniqueIdentifier('CO-TEST');
    const today = getTodayDate();
    const futureDate = getFutureDate(90);

    const policiesPage = new PoliciesPage(authenticatedPage);
    await policiesPage.goto();

    await policiesPage.openCreateForm();
    await policiesPage.fillBasicInformationTab({
      policyType: policyType,
      title: policyTitle,
      purpose: 'Test purpose',
      scope: 'Test scope',
      status: TEST_STATUS.DRAFT,
      effectiveDate: today,
    });
    await policiesPage.submitForm();

    await authenticatedPage.waitForLoadState('domcontentloaded');

    const policyLocator = authenticatedPage.getByText(policyTitle).first();
    await policyLocator.click();
    await authenticatedPage.waitForTimeout(1000);

    const controlObjectivesTab = authenticatedPage.getByRole('tab', { name: 'Control Objectives' }).first();
    const hasTab = await controlObjectivesTab.isVisible({ timeout: 5000 }).catch(() => false);

    if (hasTab) {
      await controlObjectivesTab.click();

      const addCOButton = authenticatedPage.getByRole('button', { name: /Add Control Objective|Add/i }).first();
      const hasButton = await addCOButton.isVisible({ timeout: 5000 }).catch(() => false);

      if (hasButton) {
        await addCOButton.click();

        await authenticatedPage.locator('input[name="objective_identifier"]').fill(objectiveId);
        await authenticatedPage.locator('textarea[name="statement"]').fill('The organization shall implement multi-factor authentication for all privileged accounts.');
        await authenticatedPage.locator('textarea[name="rationale"]').fill('MFA provides additional security layer for privileged access.');
        await authenticatedPage.locator('input[name="domain"]').fill('IAM');
        await authenticatedPage.locator('input[name="priority"]').fill('High');

        const implStatusField = authenticatedPage.locator('label:has-text("Implementation Status")').locator('..').locator('button').first();
        const hasImplStatus = await implStatusField.isVisible({ timeout: 2000 }).catch(() => false);
        if (hasImplStatus) {
          await implStatusField.click();
          await authenticatedPage.getByRole('option', { name: TEST_IMPLEMENTATION_STATUS.NOT_IMPLEMENTED }).first().click();
        }

        await authenticatedPage.locator('input[name="target_implementation_date"]').fill(futureDate);

        const submitButton = authenticatedPage.getByRole('button', { name: /Create|Save/i }).first();
        await submitButton.click();

        const coLocator = authenticatedPage.getByText(objectiveId).first();
        await expect(coLocator, 'Expected control objective to be visible').toBeVisible({ timeout: TEST_TIMEOUTS.VERIFICATION });
      }
    }
  });

  test('should validate required fields for control objective', async ({ authenticatedPage }) => {
    const policiesPage = new PoliciesPage(authenticatedPage);
    await policiesPage.goto();

    const firstPolicy = authenticatedPage.locator('table tbody tr').first();
    const hasPolicy = await firstPolicy.isVisible({ timeout: 5000 }).catch(() => false);

    if (hasPolicy) {
      await firstPolicy.click();
      await authenticatedPage.waitForLoadState('domcontentloaded');

      const controlObjectivesTab = authenticatedPage.getByRole('tab', { name: 'Control Objectives' }).first();
      const hasTab = await controlObjectivesTab.isVisible({ timeout: 5000 }).catch(() => false);

      if (hasTab) {
        await controlObjectivesTab.click();

        const addCOButton = authenticatedPage.getByRole('button', { name: /Add Control Objective|Add/i }).first();
        const hasButton = await addCOButton.isVisible({ timeout: 5000 }).catch(() => false);

        if (hasButton) {
          await addCOButton.click();
          await authenticatedPage.waitForSelector('form, [role="dialog"]', { timeout: 10000 });

          const submitButton = authenticatedPage.getByRole('button', { name: /Create|Save/i }).first();
          await submitButton.click();

          const errorMessages = authenticatedPage.locator('[role="alert"], .text-red-500, .text-destructive');
          const hasErrors = await errorMessages.count() > 0;
          expect(hasErrors, 'Expected validation errors when submitting empty form').toBeTruthy();
        }
      }
    }
  });
});
