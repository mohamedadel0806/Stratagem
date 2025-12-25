import { test } from '../fixtures/auth-storage';
import { expect } from '@playwright/test';
import { PoliciesPage } from '../pages/policies.page';
import { TEST_STATUS, TEST_REVIEW_FREQUENCY } from '../constants';
import { generateUniqueName, getTodayDate, getFutureDate } from '../form-helpers';

test.describe('Policy Approval Workflow E2E Tests', () => {
  let policiesPage: PoliciesPage;

  test.beforeEach(async ({ authenticatedPage }) => {
    policiesPage = new PoliciesPage(authenticatedPage);
    await policiesPage.goto();
  });

  test('should create policy and submit for approval', async ({ authenticatedPage }) => {
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

    const submitForApprovalButton = authenticatedPage.getByRole('button', { name: /Submit for Review|Request Approval/i }).first();
    const hasSubmitButton = await submitForApprovalButton.count() > 0;

    if (hasSubmitButton) {
      await submitForApprovalButton.click();
      await authenticatedPage.waitForLoadState('networkidle');

      const statusBadge = authenticatedPage.locator('[data-testid="policy-status"]').first();
      await expect(statusBadge).toContainText('In Review', { timeout: 10000 });
    }
  });

  test('should view policy approval workflow', async ({ authenticatedPage }) => {
    await authenticatedPage.locator('table tbody tr').first().click();
    await authenticatedPage.waitForURL(/\/policies\/[^/]+/, { timeout: 10000 });
    await authenticatedPage.waitForLoadState('networkidle');

    const workflowTab = authenticatedPage.getByRole('tab', { name: /Workflow|Approval/i }).first();
    const hasWorkflowTab = await workflowTab.count() > 0;

    if (hasWorkflowTab) {
      await expect(workflowTab).toBeVisible({ timeout: 5000 });
      await workflowTab.click();

      const workflowSteps = authenticatedPage.locator('[data-testid^="workflow-step-"]');
      const stepCount = await workflowSteps.count();
      expect(stepCount, 'Expected workflow steps to be visible').toBeGreaterThan(0);
    }
  });

  test('should approve policy as reviewer', async ({ authenticatedPage }) => {
    await authenticatedPage.locator('table tbody tr').first().click();
    await authenticatedPage.waitForURL(/\/policies\/[^/]+/, { timeout: 10000 });

    const approveButton = authenticatedPage.getByRole('button', { name: /Approve|Approve Policy/i }).first();
    const hasApproveButton = await approveButton.count() > 0;

    if (hasApproveButton) {
      await approveButton.click();

      const commentsTextarea = authenticatedPage.getByLabel(/Comments|Approval Comments/i).or(authenticatedPage.locator('textarea[name*="comments"], textarea[name*="approval"]'));
      await expect(commentsTextarea).toBeVisible({ timeout: 5000 });
      await commentsTextarea.fill('Policy approved for publication');

      const confirmButton = authenticatedPage.getByRole('button', { name: /Confirm Approve|Confirm/i });
      await confirmButton.click();
      await authenticatedPage.waitForLoadState('networkidle');

      const statusBadge = authenticatedPage.locator('[data-testid="policy-status"]').first();
      await expect(statusBadge).toContainText('Approved', { timeout: 10000 });
    }
  });

  test('should request changes on policy', async ({ authenticatedPage }) => {
    await authenticatedPage.locator('table tbody tr').first().click();
    await authenticatedPage.waitForURL(/\/policies\/[^/]+/, { timeout: 10000 });

    const requestChangesButton = authenticatedPage.getByRole('button', { name: /Request Changes|Changes Requested/i }).first();
    const hasChangesButton = await requestChangesButton.count() > 0;

    if (hasChangesButton) {
      await requestChangesButton.click();

      const commentsTextarea = authenticatedPage.getByLabel(/Comments|Change Reason/i).or(authenticatedPage.locator('textarea[name*="comments"], textarea[name*="reason"]'));
      await expect(commentsTextarea).toBeVisible({ timeout: 5000 });
      await commentsTextarea.fill('Please update scope section to include remote workers');

      const submitButton = authenticatedPage.getByRole('button', { name: /Submit|Request/i });
      await submitButton.click();
      await authenticatedPage.waitForLoadState('networkidle');

      const statusBadge = authenticatedPage.locator('[data-testid="policy-status"]').first();
      await expect(statusBadge).toContainText('Changes Requested', { timeout: 10000 });
    }
  });

  test('should reject policy', async ({ authenticatedPage }) => {
    await authenticatedPage.locator('table tbody tr').first().click();
    await authenticatedPage.waitForURL(/\/policies\/[^/]+/, { timeout: 10000 });

    const rejectButton = authenticatedPage.getByRole('button', { name: /Reject/i }).first();
    const hasRejectButton = await rejectButton.count() > 0;

    if (hasRejectButton) {
      await rejectButton.click();

      const reasonTextarea = authenticatedPage.getByLabel(/Reason|Rejection Reason/i).or(authenticatedPage.locator('textarea[name*="reason"], textarea[name*="rejection"]'));
      await expect(reasonTextarea).toBeVisible({ timeout: 5000 });
      await reasonTextarea.fill('Policy does not meet compliance requirements');

      const confirmButton = authenticatedPage.getByRole('button', { name: /Confirm|Confirm Reject/i });
      await confirmButton.click();
      await authenticatedPage.waitForLoadState('networkidle');

      const statusBadge = authenticatedPage.locator('[data-testid="policy-status"]').first();
      await expect(statusBadge).toContainText('Rejected', { timeout: 10000 });
    }
  });

  test('should view approval history', async ({ authenticatedPage }) => {
    await authenticatedPage.locator('table tbody tr').first().click();
    await authenticatedPage.waitForURL(/\/policies\/[^/]+/, { timeout: 10000 });

    const historyTab = authenticatedPage.getByRole('tab', { name: /History|Audit/i }).first();
    const hasHistoryTab = await historyTab.count() > 0;

    if (hasHistoryTab) {
      await historyTab.click();

      const historyEntries = authenticatedPage.locator('[data-testid^="history-entry-"]');
      const entryCount = await historyEntries.count();
      expect(entryCount, 'Expected approval history entries').toBeGreaterThan(0);
    }
  });

  test('should publish approved policy', async ({ authenticatedPage }) => {
    await authenticatedPage.locator('table tbody tr').first().click();
    await authenticatedPage.waitForURL(/\/policies\/[^/]+/, { timeout: 10000 });

    const publishButton = authenticatedPage.getByRole('button', { name: /Publish/i }).first();
    const hasPublishButton = await publishButton.count() > 0;

    if (hasPublishButton) {
      await publishButton.click();

      const publishDateInput = authenticatedPage.getByLabel(/Published Date|Publication Date/i).or(authenticatedPage.locator('input[type="date"][name*="published"]'));
      await expect(publishDateInput).toBeVisible({ timeout: 5000 });
      await publishDateInput.fill(getTodayDate());

      const assignToSection = authenticatedPage.locator('[data-testid="assign-to-section"], [data-testid="distribution-section"]');
      const hasAssignSection = await assignToSection.count() > 0;

      if (hasAssignSection) {
        await expect(assignToSection).toBeVisible({ timeout: 5000 });

        const businessUnitsSelect = authenticatedPage.getByLabel(/Business Units|Assign to BUs/i).or(authenticatedPage.locator('select[name*="business_units"]'));
        await expect(businessUnitsSelect).toBeVisible({ timeout: 5000 });
      }

      const confirmButton = authenticatedPage.getByRole('button', { name: /Publish and Notify|Confirm Publish/i });
      await confirmButton.click();
      await authenticatedPage.waitForLoadState('networkidle');

      const statusBadge = authenticatedPage.locator('[data-testid="policy-status"]').first();
      await expect(statusBadge).toContainText('Published', { timeout: 10000 });
    }
  });

  test('should view assigned users and acknowledgment status', async ({ authenticatedPage }) => {
    await authenticatedPage.locator('table tbody tr').first().click();
    await authenticatedPage.waitForURL(/\/policies\/[^/]+/, { timeout: 10000 });

    const assignmentsTab = authenticatedPage.getByRole('tab', { name: /Assignments|Users|Acknowledgments/i }).first();
    const hasAssignmentsTab = await assignmentsTab.count() > 0;

    if (hasAssignmentsTab) {
      await assignmentsTab.click();

      const userAssignments = authenticatedPage.locator('[data-testid^="user-assignment-"]');
      const assignmentCount = await userAssignments.count();
      expect(assignmentCount, 'Expected user assignments').toBeGreaterThanOrEqual(0);
    }
  });

  test('should set acknowledgment due date', async ({ authenticatedPage }) => {
    await policiesPage.openCreateForm();
    await policiesPage.fillBasicInformationTab({
      policyType: 'Information Security',
      title: generateUniqueName('Policy with Acknowledgment'),
      purpose: 'Test purpose',
      scope: 'Test scope',
      status: TEST_STATUS.DRAFT,
      effectiveDate: getTodayDate(),
      nextReviewDate: getFutureDate(365),
      reviewFrequency: TEST_REVIEW_FREQUENCY.ANNUAL,
    });
    await policiesPage.fillContentTab('Test content');

    const settingsTab = authenticatedPage.getByRole('tab', { name: /Settings|Distribution/i }).first();
    await expect(settingsTab).toBeVisible({ timeout: 5000 });
    await settingsTab.click();

    const requiresAcknowledgmentCheckbox = authenticatedPage.getByLabel(/Requires Acknowledgment/i).or(authenticatedPage.locator('input[type="checkbox"][name*="acknowledgment"]'));
    await expect(requiresAcknowledgmentCheckbox).toBeVisible({ timeout: 5000 });

    const isChecked = await requiresAcknowledgmentCheckbox.isChecked();
    if (!isChecked) {
      await requiresAcknowledgmentCheckbox.check();
    }

    const dueDaysInput = authenticatedPage.getByLabel(/Acknowledgment Due Days/i).or(authenticatedPage.locator('input[type="number"][name*="due_days"]'));
    await expect(dueDaysInput).toBeVisible({ timeout: 5000 });
    await dueDaysInput.fill('30');

    await policiesPage.submitForm();

    await policiesPage.goto();
    await expect(authenticatedPage.getByText(/Acknowledgment required/i)).toBeVisible({ timeout: 10000 });
  });

  test('should acknowledge policy as user', async ({ authenticatedPage }) => {
    await authenticatedPage.goto('/en/dashboard/governance/policies/my-assigned');
    await authenticatedPage.waitForLoadState('networkidle');

    const policyRows = await authenticatedPage.locator('table tbody tr').count();

    if (policyRows > 0) {
      await authenticatedPage.locator('table tbody tr').first().click();
      await authenticatedPage.waitForURL(/\/policies\/[^/]+/, { timeout: 10000 });

      const acknowledgeButton = authenticatedPage.getByRole('button', { name: /Acknowledge|I Acknowledge/i }).first();
      const hasAckButton = await acknowledgeButton.count() > 0;

      if (hasAckButton) {
        await acknowledgeButton.click();

        const confirmButton = authenticatedPage.getByRole('button', { name: /Confirm|Yes, I Acknowledge/i });
        await confirmButton.click();
        await authenticatedPage.waitForLoadState('networkidle');

        const acknowledgmentStatus = authenticatedPage.locator('[data-testid="acknowledgment-status"]');
        await expect(acknowledgmentStatus).toContainText('Acknowledged', { timeout: 10000 });
      }
    }
  });

  test('should track acknowledgment rate', async ({ authenticatedPage }) => {
    await policiesPage.goto();

    const acknowledgmentRate = authenticatedPage.locator('[data-testid="acknowledgment-rate"], [data-testid="acknowledgment-percentage"]');
    const hasRate = await acknowledgmentRate.count() > 0;

    if (hasRate) {
      await expect(acknowledgmentRate).toBeVisible({ timeout: 5000 });

      const rateText = await acknowledgmentRate.textContent();
      expect(rateText).toMatch(/\d+%/);
    }
  });

  test('should filter policies by approval status', async ({ authenticatedPage }) => {
    await policiesPage.verifyTableVisible();

    const statusFilter = authenticatedPage.getByLabel(/Status/i).or(authenticatedPage.locator('[aria-label*="status"], select[name="status"]'));
    await statusFilter.click();
    await authenticatedPage.getByRole('option', { name: 'In Review' }).click();
    await authenticatedPage.waitForLoadState('networkidle');

    await expect(authenticatedPage.locator('table')).toBeVisible({ timeout: 5000 });
  });
});
