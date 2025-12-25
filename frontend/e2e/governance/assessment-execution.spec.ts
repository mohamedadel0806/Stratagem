import { test } from '../fixtures/auth-storage';
import { expect } from '@playwright/test';
import { AssessmentsPage } from '../pages/assessments.page';
import { ControlsPage } from '../pages/controls.page';
import { TEST_STATUS, TEST_ASSESSMENT_TYPE } from '../constants';
import { generateUniqueIdentifier, generateUniqueName, getTodayDate, getFutureDate } from '../form-helpers';

test.describe('Assessment Execution E2E Tests', () => {
  let assessmentsPage: AssessmentsPage;

  test.beforeEach(async ({ authenticatedPage }) => {
    assessmentsPage = new AssessmentsPage(authenticatedPage);
    await assessmentsPage.goto();
  });

  test('should create assessment and add controls', async ({ authenticatedPage }) => {
    const assessmentName = generateUniqueName('Assessment');
    const assessmentIdentifier = generateUniqueIdentifier('ASSESS');
    const today = getTodayDate();
    const futureDate = getFutureDate(30);

    await assessmentsPage.openCreateForm();
    await assessmentsPage.fillForm({
      identifier: assessmentIdentifier,
      name: assessmentName,
      description: 'E2E test assessment for execution',
      assessmentType: TEST_ASSESSMENT_TYPE.OPERATING_EFFECTIVENESS,
      status: TEST_STATUS.NOT_STARTED,
      scopeDescription: 'Test assessment scope',
      startDate: today,
      endDate: futureDate,
      assessmentProcedures: 'Test assessment procedures',
    });
    await assessmentsPage.submitForm();

    await assessmentsPage.goto();
    await assessmentsPage.viewAssessment(assessmentName);

    const addControlsButton = authenticatedPage.getByRole('button', { name: /Add Controls|Select Controls/i }).first();
    await expect(addControlsButton).toBeVisible({ timeout: 5000 });
    await addControlsButton.click();

    await expect(authenticatedPage.getByRole('dialog', { name: /Add Controls|Select Controls/i })).toBeVisible({ timeout: 5000 });

    const domainFilter = authenticatedPage.getByLabel(/Domain/i).or(authenticatedPage.locator('select[name*="domain"]'));
    await expect(domainFilter).toBeVisible({ timeout: 5000 });
    await domainFilter.click();
    await authenticatedPage.getByRole('option', { name: 'IAM' }).click();

    const searchInput = authenticatedPage.getByPlaceholder(/Search/i).or(authenticatedPage.locator('input[type="search"], input[name="search"]'));
    await searchInput.fill('multi-factor');

    await authenticatedPage.waitForLoadState('networkidle');

    // Select controls - deterministic wait
    const controlCheckboxes = authenticatedPage.locator('input[type="checkbox"]');
    await expect(controlCheckboxes.first()).toBeVisible({ timeout: 10000 });
    await controlCheckboxes.first().check();

    const confirmButton = authenticatedPage.getByRole('button', { name: /Add|Save/i });
    await confirmButton.click();
    await authenticatedPage.waitForLoadState('networkidle');

    await expect(authenticatedPage.getByText(/Controls added|Assessment updated/i)).toBeVisible({ timeout: 10000 });
  });

  test('should start assessment and update status', async ({ authenticatedPage }) => {
    await authenticatedPage.locator('table tbody tr').first().click();
    await authenticatedPage.waitForURL(/\/assessments\/[^/]+/, { timeout: 10000 });
    await authenticatedPage.waitForLoadState('networkidle');

    const startButton = authenticatedPage.getByRole('button', { name: /Start|Begin/i });
    if (await startButton.isVisible()) {
      await startButton.click();
      await authenticatedPage.waitForLoadState('networkidle');
    }

    const statusBadge = authenticatedPage.locator('[data-testid="assessment-status"]').first();
    await expect(statusBadge).toContainText('In Progress', { timeout: 10000 });
  });


  test('should execute assessment and record results', async ({ authenticatedPage }) => {
    await authenticatedPage.locator('table tbody tr').first().click();
    await authenticatedPage.waitForURL(/\/assessments\/[^/]+/, { timeout: 10000 });

    const controlsSection = authenticatedPage.locator('[data-testid="assessment-controls"], [data-testid="controls-to-assess"]').first();
    await expect(controlsSection).toBeVisible({ timeout: 10000 });

    const controlRows = authenticatedPage.locator('[data-testid^="assessment-control-row-"]');
    const rowCount = await controlRows.count();

    if (rowCount > 0) {
      await controlRows.first().click();

      const resultSelect = authenticatedPage.getByLabel(/Result|Assessment Result/i).or(authenticatedPage.locator('select[name="result"]'));
      await expect(resultSelect).toBeVisible({ timeout: 5000 });
      await resultSelect.click();
      await authenticatedPage.getByRole('option', { name: 'Compliant' }).click();

      const effectivenessRating = authenticatedPage.getByLabel(/Effectiveness Rating|Rating/i).or(authenticatedPage.locator('input[type="number"][name*="rating"], input[name*="effectiveness"]'));
      await expect(effectivenessRating).toBeVisible({ timeout: 5000 });
      await effectivenessRating.fill('5');

      const findingsInput = authenticatedPage.getByLabel(/Findings|Observations/i).or(authenticatedPage.locator('textarea[name*="findings"], textarea[name*="observations"]'));
      await expect(findingsInput).toBeVisible({ timeout: 5000 });
      await findingsInput.fill('Control operating effectively');

      const recommendationsInput = authenticatedPage.getByLabel(/Recommendations/i).or(authenticatedPage.locator('textarea[name*="recommendations"]'));
      await expect(recommendationsInput).toBeVisible({ timeout: 5000 });
      await recommendationsInput.fill('Continue current implementation');

      const submitButton = authenticatedPage.getByRole('button', { name: /Submit|Save Result/i });
      await submitButton.click();
      await authenticatedPage.waitForLoadState('networkidle');

      await expect(authenticatedPage.getByText(/Result saved|Assessment result recorded/i)).toBeVisible({ timeout: 10000 });
    }
  });

  test('should attach evidence to assessment results', async ({ authenticatedPage }) => {
    await authenticatedPage.locator('table tbody tr').first().click();
    await authenticatedPage.waitForURL(/\/assessments\/[^/]+/, { timeout: 10000 });

    const controlRows = authenticatedPage.locator('[data-testid^="assessment-control-row-"]');
    await expect(controlRows.first()).toBeVisible({ timeout: 10000 });
    await controlRows.first().click();

    const attachEvidenceButton = authenticatedPage.getByRole('button', { name: /Attach Evidence|Add Evidence/i }).first();
    await expect(attachEvidenceButton).toBeVisible({ timeout: 5000 });
    await attachEvidenceButton.click();

    await expect(authenticatedPage.getByRole('dialog', { name: /Attach Evidence|Select Evidence/i })).toBeVisible({ timeout: 5000 });

    const evidenceSelect = authenticatedPage.getByLabel(/Evidence/i).or(authenticatedPage.locator('select[name*="evidence"]'));
    await expect(evidenceSelect).toBeVisible({ timeout: 5000 });
    await evidenceSelect.click();

    await authenticatedPage.getByRole('option').first().click();

    const addButton = authenticatedPage.getByRole('button', { name: /Attach|Add/i });
    await addButton.click();
    await authenticatedPage.waitForLoadState('networkidle');

    await expect(authenticatedPage.getByText(/Evidence attached/i)).toBeVisible({ timeout: 10000 });
  });


  test('should track assessment progress', async ({ authenticatedPage }) => {
    await authenticatedPage.locator('table tbody tr').first().click();
    await authenticatedPage.waitForURL(/\/assessments\/[^/]+/, { timeout: 10000 });

    const progressBar = authenticatedPage.locator('[data-testid="assessment-progress"], [role="progressbar"]').first();
    await expect(progressBar).toBeVisible({ timeout: 10000 });

    const progressText = authenticatedPage.locator('[data-testid="progress-text"], [data-testid="controls-assessed"]');
    await expect(progressText).toBeVisible({ timeout: 5000 });

    const controlsTotal = authenticatedPage.locator('[data-testid="controls-total"]');
    await expect(controlsTotal).toBeVisible({ timeout: 5000 });
  });

  test('should complete assessment when all controls assessed', async ({ authenticatedPage }) => {
    await authenticatedPage.locator('table tbody tr').first().click();
    await authenticatedPage.waitForURL(/\/assessments\/[^/]+/, { timeout: 10000 });

    const completeButton = authenticatedPage.getByRole('button', { name: /Complete|Finalize|Finish/i });
    await expect(completeButton).toBeVisible({ timeout: 10000 });
    await completeButton.click();

    if (await authenticatedPage.locator('dialog').isVisible({ timeout: 3000 })) {
      const confirmButton = authenticatedPage.getByRole('button', { name: /Confirm|Yes|OK/i });
      if (await confirmButton.isVisible()) {
        await confirmButton.click();
      }
    }

    await authenticatedPage.waitForLoadState('networkidle');

    const statusBadge = authenticatedPage.locator('[data-testid="assessment-status"]').first();
    await expect(statusBadge).toContainText('Completed', { timeout: 10000 });
  });


  test('should view assessment results summary', async ({ authenticatedPage }) => {
    await authenticatedPage.locator('table tbody tr').first().click();
    await authenticatedPage.waitForURL(/\/assessments\/[^/]+/, { timeout: 10000 });

    const summarySection = authenticatedPage.locator('[data-testid="assessment-summary"], [data-testid="results-summary"]').first();
    const hasSummary = await summarySection.count() > 0;

    if (hasSummary) {
      await expect(summarySection).toBeVisible({ timeout: 10000 });

      const overallScore = authenticatedPage.locator('[data-testid="overall-score"], [data-testid="score"]');
      const compliantCount = authenticatedPage.locator('[data-testid="compliant-count"]');
      const nonCompliantCount = authenticatedPage.locator('[data-testid="non-compliant-count"]');

      const anyMetricVisible = await Promise.all([
        overallScore.isVisible(),
        compliantCount.isVisible(),
        nonCompliantCount.isVisible(),
      ]);

      expect(anyMetricVisible.some(Boolean)).toBeTruthy();
    }
  });

  test('should create findings from failed assessments', async ({ authenticatedPage }) => {
    await authenticatedPage.locator('table tbody tr').first().click();
    await authenticatedPage.waitForURL(/\/assessments\/[^/]+/, { timeout: 10000 });

    const controlRows = authenticatedPage.locator('[data-testid^="assessment-control-row-"]');
    await expect(controlRows.first()).toBeVisible({ timeout: 10000 });
    await controlRows.first().click();

    const resultSelect = authenticatedPage.getByLabel(/Result|Assessment Result/i).or(authenticatedPage.locator('select[name="result"]'));
    await expect(resultSelect).toBeVisible({ timeout: 5000 });
    await resultSelect.click();
    await authenticatedPage.getByRole('option', { name: 'Non-Compliant' }).click();

    const createFindingButton = authenticatedPage.getByRole('button', { name: /Create Finding|Add Finding/i }).first();
    await expect(createFindingButton).toBeVisible({ timeout: 5000 });
    await createFindingButton.click();
    await authenticatedPage.waitForLoadState('networkidle');

    await expect(authenticatedPage.url()).toMatch(/\/governance\/findings\//);
  });


  test('should assign lead and additional assessors', async ({ authenticatedPage }) => {
    await assessmentsPage.openCreateForm();

    const assessmentName = generateUniqueName('Multi-Assessor Assessment');
    const assessmentIdentifier = generateUniqueIdentifier('MULTI-ASSESS');

    await assessmentsPage.fillForm({
      identifier: assessmentIdentifier,
      name: assessmentName,
      description: 'Test assessment with multiple assessors',
      assessmentType: TEST_ASSESSMENT_TYPE.OPERATING_EFFECTIVENESS,
    });

    const leadAssessorSelect = authenticatedPage.getByLabel(/Lead Assessor/i).or(authenticatedPage.locator('select[name*="lead_assessor"]'));
    await expect(leadAssessorSelect).toBeVisible({ timeout: 5000 });
    await leadAssessorSelect.click();

    await authenticatedPage.getByRole('option').first().click();

    const additionalAssessorsSelect = authenticatedPage.getByLabel(/Additional Assessors/i).or(authenticatedPage.locator('select[name*="additional_assessors"]'));
    const hasAdditionalSelect = await additionalAssessorsSelect.count() > 0;

    if (hasAdditionalSelect) {
      await additionalAssessorsSelect.click();

      await authenticatedPage.getByRole('option').first().click();

      const addButton = authenticatedPage.getByRole('button', { name: /Add|Add Assessor/i });
      await addButton.click();
    }

    await assessmentsPage.submitForm();
    await assessmentsPage.goto();
    await assessmentsPage.verifyAssessmentExists(assessmentName);
  });

  test('should filter assessments by status', async ({ authenticatedPage }) => {
    await assessmentsPage.verifyTableVisible();

    const statusFilter = authenticatedPage.getByLabel(/Status/i).or(authenticatedPage.locator('[aria-label*="status"], select[name="status"]'));
    await statusFilter.click();
    await authenticatedPage.getByRole('option', { name: 'In Progress' }).click();
    await authenticatedPage.waitForLoadState('networkidle');

    await expect(authenticatedPage.locator('table')).toBeVisible({ timeout: 5000 });
  });
});
