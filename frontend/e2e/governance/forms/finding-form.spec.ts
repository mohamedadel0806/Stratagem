import { test } from '../../fixtures/auth';
import { expect } from '@playwright/test';
import { FindingsPage } from '../../pages/findings.page';
import { TEST_STATUS, TEST_SEVERITY, TEST_TIMEOUTS } from '../../constants';
import { getTodayDate, getFutureDate, generateUniqueIdentifier, generateUniqueName } from '../../form-helpers';

test.describe('Finding Form', () => {
  test('should fill finding form and create record', async ({ authenticatedPage }) => {
    const findingTitle = generateUniqueName('Finding');
    const findingIdentifier = generateUniqueIdentifier('FIND');
    const today = getTodayDate();
    const futureDate = getFutureDate(30);

    const findingsPage = new FindingsPage(authenticatedPage);
    await findingsPage.goto();

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

  test('should validate required fields', async ({ authenticatedPage }) => {
    const findingsPage = new FindingsPage(authenticatedPage);
    await findingsPage.goto();

    await findingsPage.openCreateForm();

    const submitButton = authenticatedPage.getByRole('button', { name: /Create|Save/i }).first();
    await submitButton.click();

    const errorMessages = authenticatedPage.locator('[role="alert"], .text-red-500, .text-destructive');
    const hasErrors = await errorMessages.count() > 0;
    expect(hasErrors, 'Expected validation errors when submitting empty form').toBeTruthy();
  });
});
