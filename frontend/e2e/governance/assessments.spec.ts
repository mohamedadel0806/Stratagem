import { test } from '../fixtures/auth-storage';
import { expect } from '@playwright/test';
import { AssessmentsPage } from '../pages/assessments.page';
import { TEST_STATUS, TEST_ASSESSMENT_TYPE, TEST_TIMEOUTS } from '../constants';
import { getTodayDate, getFutureDate, generateUniqueIdentifier, generateUniqueName } from '../form-helpers';

test.describe('Assessment Workspace E2E Tests', () => {
  let assessmentsPage: AssessmentsPage;

  test.beforeEach(async ({ authenticatedPage }) => {
    assessmentsPage = new AssessmentsPage(authenticatedPage);
    await authenticatedPage.goto('/en/dashboard/governance/assessments', { timeout: 15000 });
    await authenticatedPage.waitForLoadState('domcontentloaded', { timeout: 10000 });
    await authenticatedPage.waitForTimeout(2000);
  });

  test('should display assessments list page', async ({ authenticatedPage }) => {
    await expect(authenticatedPage.locator('h1')).toContainText(/Assessment/i, { timeout: TEST_TIMEOUTS.MEDIUM });
    await assessmentsPage.verifyTableVisible();
    await expect(authenticatedPage.locator('th:has-text("Name"), th:has-text("Assessment")')).toBeVisible();
  });

  test('should create a new assessment', async ({ authenticatedPage }) => {
    const assessmentName = generateUniqueName('Assessment');
    const assessmentIdentifier = generateUniqueIdentifier('ASSESS');
    const today = getTodayDate();
    const futureDate = getFutureDate(30);

    await assessmentsPage.openCreateForm();
    await assessmentsPage.fillForm({
      identifier: assessmentIdentifier,
      name: assessmentName,
      description: 'E2E test assessment description',
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

  test('should view assessment details', async ({ authenticatedPage }) => {
    await assessmentsPage.verifyTableVisible();

    const rowCount = await authenticatedPage.locator('table tbody tr').count();
    expect(rowCount, 'Expected at least one assessment to view details').toBeGreaterThan(0);

    await authenticatedPage.locator('table tbody tr').first().click();

    await authenticatedPage.waitForURL(/\/assessments\/[^/]+/, { timeout: TEST_TIMEOUTS.MEDIUM });
    await authenticatedPage.waitForLoadState('networkidle');
    await expect(authenticatedPage.locator('h1, h2, h3').first()).toBeVisible({ timeout: TEST_TIMEOUTS.MEDIUM });
  });
});
