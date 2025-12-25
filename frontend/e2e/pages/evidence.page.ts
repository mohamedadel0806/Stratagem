import { Page, Locator, expect } from '@playwright/test';

export class EvidencePage {
  readonly page: Page;
  readonly addEvidenceButton: Locator;
  readonly uploadButton: Locator;
  readonly evidenceList: Locator;
  readonly evidenceFormDialog: Locator;
  readonly identifierInput: Locator;
  readonly titleInput: Locator;
  readonly descriptionTextarea: Locator;
  readonly evidenceTypeDropdown: Locator;
  readonly statusDropdown: Locator;
  readonly filePathInput: Locator;
  readonly filenameInput: Locator;
  readonly collectionDateInput: Locator;
  readonly validFromDateInput: Locator;
  readonly validUntilDateInput: Locator;
  readonly confidentialCheckbox: Locator;
  readonly submitButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.addEvidenceButton = page.getByRole('button', { name: /Add Evidence|Create/i });
    this.uploadButton = page.getByRole('button', { name: /Upload/i });
    this.evidenceList = page.locator('[data-testid="evidence-list"], table');
    this.evidenceFormDialog = page.getByRole('dialog');
    this.identifierInput = page.getByLabel('Evidence Identifier').or(page.locator('input[name="evidence_identifier"]'));
    this.titleInput = page.getByLabel('Title').or(page.locator('input[name="title"]'));
    this.descriptionTextarea = page.getByLabel('Description').or(page.locator('textarea[name="description"]'));
    this.evidenceTypeDropdown = page.getByTestId('evidence-type-dropdown');
    this.statusDropdown = page.getByTestId('status-dropdown');
    this.filePathInput = page.getByLabel('File Path').or(page.locator('input[name="file_path"]'));
    this.filenameInput = page.getByLabel('Filename').or(page.locator('input[name="filename"]'));
    this.collectionDateInput = page.getByLabel('Collection Date').or(page.locator('input[name="collection_date"]'));
    this.validFromDateInput = page.getByLabel('Valid From Date').or(page.locator('input[name="valid_from_date"]'));
    this.validUntilDateInput = page.getByLabel('Valid Until Date').or(page.locator('input[name="valid_until_date"]'));
    this.confidentialCheckbox = page.getByLabel('Confidential').or(page.locator('input[type="checkbox"][name="confidential"]'));
    this.submitButton = page.getByRole('button', { name: /Create|Save/i });
  }

  async goto() {
    await this.page.goto('/en/dashboard/governance/evidence', { timeout: 15000 });
    await this.page.waitForLoadState('domcontentloaded', { timeout: 10000 });
  }

  async openCreateForm() {
    await this.addEvidenceButton.click();
    await expect(this.evidenceFormDialog).toBeVisible();
  }

  async fillForm(data: {
    identifier: string;
    title: string;
    description?: string;
    evidenceType?: string;
    status?: string;
    filePath?: string;
    filename?: string;
    collectionDate?: string;
    validFromDate?: string;
    validUntilDate?: string;
    confidential?: boolean;
  }) {
    await this.identifierInput.fill(data.identifier);
    await this.titleInput.fill(data.title);

    if (data.description) {
      await this.descriptionTextarea.fill(data.description);
    }

    if (data.evidenceType) {
      await this.evidenceTypeDropdown.click();
      await this.page.getByRole('option', { name: data.evidenceType }).click();
    }

    if (data.status) {
      await this.statusDropdown.click();
      await this.page.getByRole('option', { name: data.status }).click();
    }

    if (data.filePath) {
      await this.filePathInput.fill(data.filePath);
    }

    if (data.filename) {
      await this.filenameInput.fill(data.filename);
    }

    if (data.collectionDate) {
      await this.collectionDateInput.fill(data.collectionDate);
    }

    if (data.validFromDate) {
      await this.validFromDateInput.fill(data.validFromDate);
    }

    if (data.validUntilDate) {
      await this.validUntilDateInput.fill(data.validUntilDate);
    }

    if (data.confidential) {
      const isChecked = await this.confidentialCheckbox.isChecked();
      if (!isChecked) {
        await this.confidentialCheckbox.check();
      }
    }
  }

  async submitForm() {
    await this.submitButton.click();
    await expect(this.evidenceFormDialog).not.toBeVisible({ timeout: 10000 });
  }

  async verifyEvidenceExists(title: string) {
    await expect(this.page.getByText(title)).toBeVisible({ timeout: 10000 });
  }

  async verifyTableVisible() {
    await expect(this.evidenceList).toBeVisible();
  }

  async verifyUploadFormVisible() {
    await expect(this.uploadButton).toBeVisible();
  }
}
