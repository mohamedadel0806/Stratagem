import { Page, Locator, expect } from '@playwright/test';

export class FindingsPage {
  readonly page: Page;
  readonly addFindingButton: Locator;
  readonly findingsList: Locator;
  readonly findingFormDialog: Locator;
  readonly identifierInput: Locator;
  readonly titleInput: Locator;
  readonly descriptionTextarea: Locator;
  readonly severityDropdown: Locator;
  readonly statusDropdown: Locator;
  readonly findingDateInput: Locator;
  readonly remediationPlanTextarea: Locator;
  readonly remediationDueDateInput: Locator;
  readonly retestRequiredCheckbox: Locator;
  readonly submitButton: Locator;
  readonly severityFilter: Locator;

  constructor(page: Page) {
    this.page = page;
    this.addFindingButton = page.getByRole('button', { name: /New Finding|Add Finding|Create/i });
    this.findingsList = page.locator('[data-testid="findings-list"], table');
    this.findingFormDialog = page.getByRole('dialog');
    this.identifierInput = page.getByLabel('Finding Identifier').or(page.locator('input[name="finding_identifier"]'));
    this.titleInput = page.getByLabel('Title').or(page.locator('input[name="title"]'));
    this.descriptionTextarea = page.getByLabel('Description').or(page.locator('textarea[name="description"]'));
    this.severityDropdown = page.getByTestId('severity-dropdown');
    this.statusDropdown = page.getByTestId('status-dropdown');
    this.findingDateInput = page.getByLabel('Finding Date').or(page.locator('input[name="finding_date"]'));
    this.remediationPlanTextarea = page.getByLabel('Remediation Plan').or(page.locator('textarea[name="remediation_plan"]'));
    this.remediationDueDateInput = page.getByLabel('Remediation Due Date').or(page.locator('input[name="remediation_due_date"]'));
    this.retestRequiredCheckbox = page.getByLabel('Retest Required').or(page.locator('input[type="checkbox"][name="retest_required"]'));
    this.submitButton = page.getByRole('button', { name: /Create|Save/i });
    this.severityFilter = page.getByLabel(/severity/i).or(page.locator('[aria-label*="severity"], [aria-label*="Severity"]'));
  }

  async goto() {
    await this.page.goto('/en/dashboard/governance/findings', { timeout: 15000 });
    await this.page.waitForLoadState('domcontentloaded', { timeout: 10000 });
  }

  async openCreateForm() {
    await this.addFindingButton.click();
    await expect(this.findingFormDialog).toBeVisible();
  }

  async fillForm(data: {
    identifier: string;
    title: string;
    description?: string;
    severity?: string;
    status?: string;
    findingDate?: string;
    remediationPlan?: string;
    remediationDueDate?: string;
    retestRequired?: boolean;
  }) {
    await this.identifierInput.fill(data.identifier);
    await this.titleInput.fill(data.title);

    if (data.description) {
      await this.descriptionTextarea.fill(data.description);
    }

    if (data.severity) {
      await this.severityDropdown.click();
      await this.page.getByRole('option', { name: data.severity }).click();
    }

    if (data.status) {
      await this.statusDropdown.click();
      await this.page.getByRole('option', { name: data.status }).click();
    }

    if (data.findingDate) {
      await this.findingDateInput.fill(data.findingDate);
    }

    if (data.remediationPlan) {
      await this.remediationPlanTextarea.fill(data.remediationPlan);
    }

    if (data.remediationDueDate) {
      await this.remediationDueDateInput.fill(data.remediationDueDate);
    }

    if (data.retestRequired) {
      const isChecked = await this.retestRequiredCheckbox.isChecked();
      if (!isChecked) {
        await this.retestRequiredCheckbox.check();
      }
    }
  }

  async submitForm() {
    await this.submitButton.click();
    await expect(this.findingFormDialog).not.toBeVisible({ timeout: 10000 });
  }

  async filterBySeverity(severity: string) {
    await this.severityFilter.click();
    await this.page.getByRole('option', { name: severity }).click();
  }

  async verifyFindingExists(title: string) {
    await expect(this.page.getByText(title)).toBeVisible({ timeout: 10000 });
  }

  async verifyTableVisible() {
    await expect(this.findingsList).toBeVisible();
  }
}
