import { Page, Locator, expect } from '@playwright/test';

export class ControlsPage {
  readonly page: Page;
  readonly addControlButton: Locator;
  readonly controlsList: Locator;
  readonly controlFormDialog: Locator;
  readonly identifierInput: Locator;
  readonly titleInput: Locator;
  readonly descriptionTextarea: Locator;
  readonly statusDropdown: Locator;
  readonly controlTypeDropdown: Locator;
  readonly complexityDropdown: Locator;
  readonly costImpactDropdown: Locator;
  readonly domainInput: Locator;
  readonly implementationStatusDropdown: Locator;
  readonly controlProceduresTextarea: Locator;
  readonly testingProceduresTextarea: Locator;
  readonly submitButton: Locator;
  readonly searchInput: Locator;
  readonly cancelButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.addControlButton = page.getByTestId('add-control-button');
    this.controlsList = page.getByTestId('controls-table');
    this.controlFormDialog = page.getByTestId('control-dialog');
    this.identifierInput = page.getByLabel('Control Identifier').or(page.locator('input[name="control_identifier"]'));
    this.titleInput = page.getByLabel('Title').or(page.locator('input[name="title"]'));
    this.descriptionTextarea = page.getByLabel('Description').or(page.locator('textarea[name="description"]'));
    this.statusDropdown = page.getByTestId('status-dropdown');
    this.controlTypeDropdown = page.getByTestId('control-type-dropdown');
    this.complexityDropdown = page.getByTestId('complexity-dropdown');
    this.costImpactDropdown = page.getByTestId('cost-impact-dropdown');
    this.domainInput = page.getByLabel('Domain').or(page.locator('input[name="domain"]'));
    this.implementationStatusDropdown = page.getByTestId('implementation-status-dropdown');
    this.controlProceduresTextarea = page.getByLabel('Control Procedures').or(page.locator('textarea[name="control_procedures"]'));
    this.testingProceduresTextarea = page.getByLabel('Testing Procedures').or(page.locator('textarea[name="testing_procedures"]'));
    this.submitButton = page.getByRole('button', { name: /Create|Save/i });
    this.cancelButton = page.getByRole('button', { name: /Cancel/i });
    this.searchInput = page.getByPlaceholder(/search/i).or(page.locator('input[type="search"]'));
  }

  async goto() {
    await this.page.goto('/en/dashboard/governance/controls', { timeout: 15000 });
    // Wait for the page to be ready
    await expect(this.page.getByTestId('controls-page-title').or(this.controlsList).first()).toBeVisible({ timeout: 15000 });
  }


  async openCreateForm() {
    await this.addControlButton.click();
    await expect(this.controlFormDialog).toBeVisible();
  }

  async fillForm(data: {
    identifier: string;
    title: string;
    description?: string;
    status?: string;
    controlType?: string;
    complexity?: string;
    costImpact?: string;
    domain?: string;
    implementationStatus?: string;
    controlProcedures?: string;
    testingProcedures?: string;
  }) {
    await this.identifierInput.fill(data.identifier);
    await this.titleInput.fill(data.title);

    if (data.description) {
      await this.descriptionTextarea.fill(data.description);
    }

    if (data.status) {
      await this.statusDropdown.click();
      await this.page.getByRole('option', { name: data.status }).click();
    }

    if (data.controlType) {
      await this.controlTypeDropdown.click();
      await this.page.getByRole('option', { name: data.controlType }).click();
    }

    if (data.complexity) {
      await this.complexityDropdown.click();
      await this.page.getByRole('option', { name: data.complexity }).click();
    }

    if (data.costImpact) {
      await this.costImpactDropdown.click();
      await this.page.getByRole('option', { name: data.costImpact }).click();
    }

    if (data.domain) {
      await this.domainInput.fill(data.domain);
    }

    if (data.implementationStatus) {
      await this.implementationStatusDropdown.click();
      await this.page.getByRole('option', { name: data.implementationStatus }).click();
    }

    if (data.controlProcedures) {
      await this.controlProceduresTextarea.fill(data.controlProcedures);
    }

    if (data.testingProcedures) {
      await this.testingProceduresTextarea.fill(data.testingProcedures);
    }
  }

  async submitForm() {
    await this.submitButton.click();
    await expect(this.controlFormDialog).not.toBeVisible({ timeout: 10000 });
  }

  async cancelForm() {
    await this.cancelButton.click();
    await expect(this.controlFormDialog).not.toBeVisible({ timeout: 10000 });
  }

  async search(query: string) {
    await this.searchInput.fill(query);
    await this.searchInput.press('Enter');
  }

  async getControlRow(controlTitle: string): Promise<Locator> {
    return this.page.locator('tr').filter({ hasText: controlTitle }).first();
  }

  async viewControl(controlTitle: string) {
    const row = await this.getControlRow(controlTitle);
    await row.locator('[data-testid^="control-view-button-"]').click();
  }

  async editControl(controlTitle: string) {
    const row = await this.getControlRow(controlTitle);
    await row.locator('[data-testid^="control-edit-button-"]').click();
  }

  async deleteControl(controlTitle: string) {
    const row = await this.getControlRow(controlTitle);
    await row.locator('[data-testid^="control-delete-button-"]').click();
  }

  async verifyControlExists(title: string) {
    await expect(this.page.getByText(title)).toBeVisible({ timeout: 10000 });
  }

  async verifyTableVisible() {
    await expect(this.controlsList).toBeVisible();
  }

  async verifyRowCount(count: number) {
    const rows = await this.controlsList.locator('tbody tr').count();
    await expect(rows).toBe(count);
  }
}
