import { test } from '../../fixtures/auth';
import { expect } from '@playwright/test';
import { EvidencePage } from '../../pages/evidence.page';
import { TEST_STATUS, TEST_EVIDENCE_TYPE, TEST_TIMEOUTS } from '../../constants';
import { getTodayDate, getFutureDate, generateUniqueIdentifier, generateUniqueName } from '../../form-helpers';

test.describe('Evidence Form', () => {
  test('should fill evidence form and create record', async ({ authenticatedPage }) => {
    const evidenceTitle = generateUniqueName('Evidence');
    const evidenceIdentifier = generateUniqueIdentifier('EVID');
    const today = getTodayDate();
    const futureDate = getFutureDate(365);

    const evidencePage = new EvidencePage(authenticatedPage);
    await evidencePage.goto();

    await evidencePage.openCreateForm();
    await evidencePage.fillForm({
      identifier: evidenceIdentifier,
      title: evidenceTitle,
      description: 'Test evidence description for E2E testing',
      evidenceType: TEST_EVIDENCE_TYPE.POLICY_DOCUMENT,
      status: TEST_STATUS.DRAFT,
      filePath: `/uploads/evidence/test-${Date.now()}.pdf`,
      filename: `test-evidence-${Date.now()}.pdf`,
      collectionDate: today,
      validFromDate: today,
      validUntilDate: futureDate,
      confidential: false,
    });
    await evidencePage.submitForm();

    await evidencePage.goto();
    await evidencePage.verifyEvidenceExists(evidenceTitle);
  });

  test('should validate required fields', async ({ authenticatedPage }) => {
    const evidencePage = new EvidencePage(authenticatedPage);
    await evidencePage.goto();

    await evidencePage.openCreateForm();

    const submitButton = authenticatedPage.getByRole('button', { name: /Create|Save/i }).first();
    await submitButton.click();

    const errorMessages = authenticatedPage.locator('[role="alert"], .text-red-500, .text-destructive');
    const hasErrors = await errorMessages.count() > 0;
    expect(hasErrors, 'Expected validation errors when submitting empty form').toBeTruthy();
  });
});
