import { Page, Locator, expect } from '@playwright/test';

export class InfluencersPage {
  readonly page: Page;
  readonly addInfluencerButton: Locator;
  readonly influencersList: Locator;
  readonly influencerFormDialog: Locator;
  readonly nameInput: Locator;
  readonly categoryDropdown: Locator;
  readonly subCategoryInput: Locator;
  readonly referenceNumberInput: Locator;
  readonly issuingAuthorityInput: Locator;
  readonly jurisdictionInput: Locator;
  readonly descriptionTextarea: Locator;
  readonly statusDropdown: Locator;
  readonly applicabilityStatusDropdown: Locator;
  readonly publicationDateInput: Locator;
  readonly effectiveDateInput: Locator;
  readonly submitButton: Locator;
  readonly searchInput: Locator;
  readonly categoryFilter: Locator;
  readonly cancelButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.addInfluencerButton = page.getByTestId('add-influencer-button');
    this.influencersList = page.getByTestId('influencers-table');
    this.influencerFormDialog = page.getByTestId('influencer-dialog');
    this.nameInput = page.getByLabel('Name').or(page.locator('input[name="name"]'));
    this.categoryDropdown = page.getByTestId('category-dropdown');
    this.subCategoryInput = page.getByLabel('Sub Category').or(page.locator('input[name="sub_category"]'));
    this.referenceNumberInput = page.getByLabel('Reference Number').or(page.locator('input[name="reference_number"]'));
    this.issuingAuthorityInput = page.getByLabel('Issuing Authority').or(page.locator('input[name="issuing_authority"]'));
    this.jurisdictionInput = page.getByLabel('Jurisdiction').or(page.locator('input[name="jurisdiction"]'));
    this.descriptionTextarea = page.getByLabel('Description').or(page.locator('textarea[name="description"]'));
    this.statusDropdown = page.getByTestId('status-dropdown');
    this.applicabilityStatusDropdown = page.getByTestId('applicability-status-dropdown');
    this.publicationDateInput = page.getByLabel('Publication Date').or(page.locator('input[name="publication_date"]'));
    this.effectiveDateInput = page.getByLabel('Effective Date').or(page.locator('input[name="effective_date"]'));
    this.submitButton = page.getByRole('button', { name: /Create|Save/i });
    this.cancelButton = page.getByRole('button', { name: /Cancel/i });
    this.searchInput = page.getByPlaceholder(/search/i).or(page.locator('input[type="search"]'));
    this.categoryFilter = page.getByLabel(/category/i).or(page.locator('[aria-label*="category"], [aria-label*="Category"]'));
  }

  async goto() {
    await this.page.goto('/en/dashboard/governance/influencers');
    await this.page.waitForLoadState('domcontentloaded');
  }

  async openCreateForm() {
    await this.addInfluencerButton.click();
    await expect(this.influencerFormDialog).toBeVisible();
  }

  async fillForm(data: {
    name: string;
    category?: string;
    subCategory?: string;
    referenceNumber?: string;
    issuingAuthority?: string;
    jurisdiction?: string;
    description?: string;
    status?: string;
    applicabilityStatus?: string;
    publicationDate?: string;
    effectiveDate?: string;
  }) {
    await this.nameInput.fill(data.name);

    if (data.category) {
      await this.categoryDropdown.click();
      await this.page.getByRole('option', { name: data.category }).click();
    }

    if (data.subCategory) {
      await this.subCategoryInput.fill(data.subCategory);
    }

    if (data.referenceNumber) {
      await this.referenceNumberInput.fill(data.referenceNumber);
    }

    if (data.issuingAuthority) {
      await this.issuingAuthorityInput.fill(data.issuingAuthority);
    }

    if (data.jurisdiction) {
      await this.jurisdictionInput.fill(data.jurisdiction);
    }

    if (data.description) {
      await this.descriptionTextarea.fill(data.description);
    }

    if (data.status) {
      await this.statusDropdown.click();
      await this.page.getByRole('option', { name: data.status }).click();
    }

    if (data.applicabilityStatus) {
      await this.applicabilityStatusDropdown.click();
      await this.page.getByRole('option', { name: data.applicabilityStatus }).click();
    }

    if (data.publicationDate) {
      await this.publicationDateInput.fill(data.publicationDate);
    }

    if (data.effectiveDate) {
      await this.effectiveDateInput.fill(data.effectiveDate);
    }
  }

  async submitForm() {
    await this.submitButton.click();
    await expect(this.influencerFormDialog).not.toBeVisible({ timeout: 10000 });
  }

  async cancelForm() {
    await this.cancelButton.click();
    await expect(this.influencerFormDialog).not.toBeVisible({ timeout: 10000 });
  }

  async search(query: string) {
    await this.searchInput.fill(query);
    await this.searchInput.press('Enter');
  }

  async filterByCategory(category: string) {
    await this.categoryFilter.click();
    await this.page.getByRole('option', { name: category }).click();
  }

  async getInfluencerRow(influencerName: string): Promise<Locator> {
    return this.page.locator('tr').filter({ hasText: influencerName }).first();
  }

  async viewInfluencer(influencerName: string) {
    const row = await this.getInfluencerRow(influencerName);
    await row.locator('[data-testid^="influencer-view-button-"]').click();
  }

  async editInfluencer(influencerName: string) {
    const row = await this.getInfluencerRow(influencerName);
    await row.locator('[data-testid^="influencer-edit-button-"]').click();
  }

  async deleteInfluencer(influencerName: string) {
    const row = await this.getInfluencerRow(influencerName);
    await row.locator('[data-testid^="influencer-delete-button-"]').click();
  }

  async verifyInfluencerExists(name: string) {
    await expect(this.page.getByText(name)).toBeVisible({ timeout: 10000 });
  }

  async verifyTableVisible() {
    await expect(this.influencersList).toBeVisible();
  }

  async verifyRowCount(count: number) {
    const rows = await this.influencersList.locator('tbody tr').count();
    await expect(rows).toBe(count);
  }
}
