import { test } from '../../fixtures/auth';
import { expect } from '@playwright/test';
import { AssessmentsPage } from '../../pages/assessments.page';
import { TEST_STATUS, TEST_ASSESSMENT_TYPE, TEST_TIMEOUTS } from '../../constants';
import { getTodayDate, getFutureDate, generateUniqueIdentifier, generateUniqueName } from '../../form-helpers';

test.describe('Assessment Form', () => {
  test('should fill assessment form and create record', async ({ authenticatedPage }) => {    const assessmentName = generateUniqueName('Assessment');
    const assessmentIdentifier = generateUniqueIdentifier('ASSESS');
    const today = getTodayDate();
    const futureDate = getFutureDate(30);

    const assessmentsPage = new AssessmentsPage(authenticatedPage);
    await assessmentsPage.goto();

    await assessmentsPage.openCreateForm();
    await assessmentsPage.fillForm({
      identifier: assessmentIdentifier,
      name: assessmentName,
      description: 'Test assessment description for E2E testing',
      assessmentType: TEST_ASSESSMENT_TYPE.OPERATING_EFFECTIVENESS,
      status: TEST_STATUS.NOT_STARTED,
      scopeDescription: 'Test assessment scope description',
      startDate: today,
      endDate: futureDate,
      assessmentProcedures: 'Test assessment procedures description',
    });
    await assessmentsPage.submitForm();

    await assessmentsPage.goto();
    await assessmentsPage.verifyAssessmentExists(assessmentName);
  });

  test('should validate required fields', async ({ authenticatedPage }) => {
    const assessmentsPage = new AssessmentsPage(authenticatedPage);
    await assessmentsPage.goto();

    await assessmentsPage.openCreateForm();

    const submitButton = authenticatedPage.getByRole('button', { name: /Create|Save/i }).first();
    await submitButton.click();

    const errorMessages = authenticatedPage.locator('[role="alert"], .text-red-500, .text-destructive');
    const hasErrors = await errorMessages.count() > 0;
    expect(hasErrors, 'Expected validation errors when submitting empty form').toBeTruthy();
  });
});
