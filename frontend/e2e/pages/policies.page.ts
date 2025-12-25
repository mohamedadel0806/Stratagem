import { Page, Locator, expect } from '@playwright/test';

export class PoliciesPage {
  readonly page: Page;
  readonly addPolicyButton: Locator;
  readonly policiesList: Locator;
  readonly policyFormDialog: Locator;
  readonly policyTypeInput: Locator;
  readonly titleInput: Locator;
  readonly purposeTextarea: Locator;
  readonly scopeTextarea: Locator;
  readonly statusDropdown: Locator;
  readonly effectiveDateInput: Locator;
  readonly nextReviewDateInput: Locator;
  readonly reviewFrequencyDropdown: Locator;
  readonly contentTextarea: Locator;
  readonly requiresAcknowledgmentCheckbox: Locator;
  readonly acknowledgmentDueDaysInput: Locator;
  readonly submitButton: Locator;
  readonly searchInput: Locator;
  readonly statusFilter: Locator;

  constructor(page: Page) {
    this.page = page;
    this.addPolicyButton = page.getByTestId('add-policy-button');
    this.policiesList = page.getByTestId('policies-table');
    this.policyFormDialog = page.getByTestId('policy-dialog');
    this.policyTypeInput = page.getByLabel('Policy Type').or(page.locator('input[name="policy_type"]'));
    this.titleInput = page.getByLabel('Title').or(page.locator('input[name="title"]'));
    this.purposeTextarea = page.getByLabel('Purpose').or(page.locator('textarea[name="purpose"]'));
    this.scopeTextarea = page.getByLabel('Scope').or(page.locator('textarea[name="scope"]'));
    this.statusDropdown = page.getByTestId('status-dropdown');
    this.effectiveDateInput = page.getByLabel('Effective Date').or(page.locator('input[name="effective_date"]'));
    this.nextReviewDateInput = page.getByLabel('Next Review Date').or(page.locator('input[name="next_review_date"]'));
    this.reviewFrequencyDropdown = page.getByTestId('review-frequency-dropdown');
    this.contentTextarea = this.page.getByTestId('rich-text-editor').locator('[contenteditable="true"]').first();
    this.requiresAcknowledgmentCheckbox = page.getByLabel('Requires Acknowledgment').or(page.locator('input[type="checkbox"][name="requires_acknowledgment"]'));
    this.acknowledgmentDueDaysInput = page.getByLabel('Acknowledgment Due Days').or(page.locator('input[name="acknowledgment_due_days"]'));
    this.submitButton = page.getByRole('button', { name: /Create|Save/i });
    this.searchInput = page.getByTestId('policies-filters');
    this.statusFilter = page.getByTestId('filter-status');
  }

  async goto() {
    await this.page.goto('/en/dashboard/governance/policies', { timeout: 15000 });
    // Wait for the page to be ready by checking for the title or a table
    await expect(this.page.getByTestId('policies-page-title').or(this.policiesList).first()).toBeVisible({ timeout: 15000 });
  }


  async openCreateForm() {
    await this.addPolicyButton.click();
    await expect(this.policyFormDialog).toBeVisible();
  }

  async fillBasicInformationTab(data: {
    policyType: string;
    title: string;
    purpose?: string;
    scope?: string;
    status?: string;
    effectiveDate?: string;
    nextReviewDate?: string;
    reviewFrequency?: string;
  }) {
    await this.page.getByRole('tab', { name: /Basic/i }).click();
    await this.policyTypeInput.fill(data.policyType);
    await this.titleInput.fill(data.title);

    if (data.purpose) {
      await this.purposeTextarea.fill(data.purpose);
    }

    if (data.scope) {
      await this.scopeTextarea.fill(data.scope);
    }

    if (data.status) {
      await this.statusDropdown.click();
      await this.page.getByRole('option', { name: data.status }).click();
    }

    if (data.effectiveDate) {
      await this.effectiveDateInput.fill(data.effectiveDate);
    }

    if (data.nextReviewDate) {
      await this.nextReviewDateInput.fill(data.nextReviewDate);
    }

    if (data.reviewFrequency) {
      await this.reviewFrequencyDropdown.click();
      await this.page.getByRole('option', { name: data.reviewFrequency }).click();
    }
  }

  async fillContentTab(content: string) {
    await this.page.getByRole('tab', { name: /Content/i }).click();
    await this.contentTextarea.fill(content);
  }

  async fillSettingsTab(data: {
    requiresAcknowledgment?: boolean;
    acknowledgmentDueDays?: string;
  }) {
    await this.page.getByRole('tab', { name: /Settings/i }).click();
    if (data.requiresAcknowledgment) {
      const isChecked = await this.requiresAcknowledgmentCheckbox.isChecked();
      if (!isChecked) {
        await this.requiresAcknowledgmentCheckbox.check();
      }
    }

    if (data.acknowledgmentDueDays) {
      await this.acknowledgmentDueDaysInput.fill(data.acknowledgmentDueDays);
    }
  }

  async submitForm() {
    await this.submitButton.click();
    await expect(this.policyFormDialog).not.toBeVisible({ timeout: 10000 });
  }

  async search(query: string) {
    await this.searchInput.fill(query);
    await this.searchInput.press('Enter');
  }

  async filterByStatus(status: string) {
    await this.statusFilter.click();
    await this.page.getByRole('option', { name: status }).click();
  }

  async verifyPolicyExists(title: string) {
    await expect(this.page.getByText(title)).toBeVisible({ timeout: 10000 });
  }

  async verifyTableVisible() {
    await expect(this.policiesList).toBeVisible();
  }
}
