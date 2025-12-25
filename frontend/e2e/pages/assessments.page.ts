import { Page, Locator, expect } from '@playwright/test';

export class AssessmentsPage {
  readonly page: Page;
  readonly addAssessmentButton: Locator;
  readonly assessmentsList: Locator;
  readonly assessmentFormDialog: Locator;
  readonly identifierInput: Locator;
  readonly nameInput: Locator;
  readonly descriptionTextarea: Locator;
  readonly assessmentTypeDropdown: Locator;
  readonly statusDropdown: Locator;
  readonly scopeDescriptionTextarea: Locator;
  readonly startDateInput: Locator;
  readonly endDateInput: Locator;
  readonly assessmentProceduresTextarea: Locator;
  readonly submitButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.addAssessmentButton = page.getByRole('button', { name: /New Assessment|Add Assessment|Create/i });
    this.assessmentsList = page.locator('[data-testid="assessments-list"], table');
    this.assessmentFormDialog = page.getByRole('dialog');
    this.identifierInput = page.getByLabel('Assessment Identifier').or(page.locator('input[name="assessment_identifier"]'));
    this.nameInput = page.getByLabel('Name').or(page.locator('input[name="name"]'));
    this.descriptionTextarea = page.getByLabel('Description').or(page.locator('textarea[name="description"]'));
    this.assessmentTypeDropdown = page.getByTestId('assessment-type-dropdown');
    this.statusDropdown = page.getByTestId('status-dropdown');
    this.scopeDescriptionTextarea = page.getByLabel('Scope Description').or(page.locator('textarea[name="scope_description"]'));
    this.startDateInput = page.getByLabel('Start Date').or(page.locator('input[name="start_date"]'));
    this.endDateInput = page.getByLabel('End Date').or(page.locator('input[name="end_date"]'));
    this.assessmentProceduresTextarea = page.getByLabel('Assessment Procedures').or(page.locator('textarea[name="assessment_procedures"]'));
    this.submitButton = page.getByRole('button', { name: /Create|Save/i });
  }

  async goto() {
    await this.page.goto('/en/dashboard/governance/assessments', { timeout: 15000 });
    // Wait for the page to be ready
    await expect(this.page.getByTestId('assessments-page-title').or(this.assessmentsList).first()).toBeVisible({ timeout: 15000 });
  }


  async openCreateForm() {
    await this.addAssessmentButton.click();
    await expect(this.assessmentFormDialog).toBeVisible();
  }

  async fillForm(data: {
    identifier: string;
    name: string;
    description?: string;
    assessmentType?: string;
    status?: string;
    scopeDescription?: string;
    startDate?: string;
    endDate?: string;
    assessmentProcedures?: string;
  }) {
    await this.identifierInput.fill(data.identifier);
    await this.nameInput.fill(data.name);

    if (data.description) {
      await this.descriptionTextarea.fill(data.description);
    }

    if (data.assessmentType) {
      await this.assessmentTypeDropdown.click();
      await this.page.getByRole('option', { name: data.assessmentType }).click();
    }

    if (data.status) {
      await this.statusDropdown.click();
      await this.page.getByRole('option', { name: data.status }).click();
    }

    if (data.scopeDescription) {
      await this.scopeDescriptionTextarea.fill(data.scopeDescription);
    }

    if (data.startDate) {
      await this.startDateInput.fill(data.startDate);
    }

    if (data.endDate) {
      await this.endDateInput.fill(data.endDate);
    }

    if (data.assessmentProcedures) {
      await this.assessmentProceduresTextarea.fill(data.assessmentProcedures);
    }
  }

  async submitForm() {
    await this.submitButton.click();
    await expect(this.assessmentFormDialog).not.toBeVisible({ timeout: 10000 });
  }

  async verifyAssessmentExists(name: string) {
    await expect(this.page.getByText(name)).toBeVisible({ timeout: 10000 });
  }

  async getAssessmentRow(name: string): Promise<Locator> {
    return this.page.locator('tr').filter({ hasText: name }).first();
  }

  async viewAssessment(name: string) {
    const row = await this.getAssessmentRow(name);
    await row.locator('[data-testid^="assessment-view-button-"]').click();
  }

  async verifyTableVisible() {
    await expect(this.assessmentsList).toBeVisible();
  }
}
