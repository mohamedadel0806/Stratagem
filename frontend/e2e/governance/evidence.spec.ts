import { test } from '../fixtures/auth-storage';
import { expect } from '@playwright/test';
import { EvidencePage } from '../pages/evidence.page';
import { TEST_STATUS, TEST_EVIDENCE_TYPE, TEST_TIMEOUTS } from '../constants';
import { getTodayDate, getFutureDate, generateUniqueIdentifier, generateUniqueName } from '../form-helpers';
import { navigateToDetails } from '../utils/helpers';

test.describe('Evidence Repository E2E Tests', () => {
  let evidencePage: EvidencePage;

  test.beforeEach(async ({ authenticatedPage }) => {
    evidencePage = new EvidencePage(authenticatedPage);
    await authenticatedPage.goto('/en/dashboard/governance/evidence', { timeout: 15000 });
    await authenticatedPage.waitForLoadState('domcontentloaded', { timeout: 10000 });
    await authenticatedPage.waitForTimeout(2000);
  });

  test('should display evidence list page', async ({ authenticatedPage }) => {
    await expect(authenticatedPage.locator('h1')).toContainText(/Evidence/i, { timeout: TEST_TIMEOUTS.MEDIUM });
    await evidencePage.verifyTableVisible();
    await expect(authenticatedPage.locator('th:has-text("Title"), th:has-text("Evidence")')).toBeVisible();
  });

  test('should view evidence details', async ({ authenticatedPage }) => {
    await evidencePage.verifyTableVisible();

    const rowCount = await authenticatedPage.locator('table tbody tr').count();
    expect(rowCount, 'Expected at least one evidence to view details').toBeGreaterThan(0);

    await navigateToDetails(authenticatedPage);

    await authenticatedPage.waitForURL(/\/evidence\/[^/]+/, { timeout: TEST_TIMEOUTS.MEDIUM });
    await authenticatedPage.waitForLoadState('networkidle');
    await expect(authenticatedPage.locator('h1, h2, h3').first()).toBeVisible({ timeout: TEST_TIMEOUTS.MEDIUM });
  });

  test('should create a new evidence record', async ({ authenticatedPage }) => {
    const evidenceTitle = generateUniqueName('Evidence');
    const evidenceIdentifier = generateUniqueIdentifier('EVID');
    const today = getTodayDate();
    const futureDate = getFutureDate(365);

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

  test('should upload evidence file', async ({ authenticatedPage }) => {
    const uploadButton = authenticatedPage.locator('button:has-text("Upload"), button:has-text("Add Evidence")').first();
    const hasUploadButton = await uploadButton.isVisible({ timeout: 5000 }).catch(() => false);

    expect(hasUploadButton, 'Upload button should be available').toBe(true);
    if (hasUploadButton) {
      await uploadButton.click();
      await authenticatedPage.waitForSelector('[type="file"], input[accept]', { timeout: 5000 });
      await expect(authenticatedPage.locator('[type="file"], input[accept"]').first()).toBeVisible();
    }
  });
});
