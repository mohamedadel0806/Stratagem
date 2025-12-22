import { Page, Locator, expect } from '@playwright/test';

const WAIT_SMALL = 500;
const WAIT_MEDIUM = 1000;
const WAIT_LARGE = 2000;

export class SOPPage {
  readonly page: Page;
  readonly createSOPButton: Locator;
  readonly sopsList: Locator;
  readonly sopFormDialog: Locator;
  readonly sopIdentifierInput: Locator;
  readonly sopTitleInput: Locator;
  readonly sopCategoryDropdown: Locator;
  readonly sopPurposeTextarea: Locator;
  readonly sopScopeTextarea: Locator;
  readonly sopContentTextarea: Locator;
  readonly sopFormSubmitCreate: Locator;
  readonly sopFormSubmitUpdate: Locator;
  readonly publishSOPButton: Locator;
  readonly acknowledgeButton: Locator;
  readonly provideFeedbackButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.createSOPButton = page.getByRole('button', { name: 'Create SOP' });
    this.sopsList = page.locator('[data-testid="sops-list"]');
    this.sopFormDialog = page.getByRole('dialog');
    this.sopIdentifierInput = page.getByTestId('sop-form-identifier-input');
    this.sopTitleInput = page.getByTestId('sop-form-title-input');
    this.sopCategoryDropdown = page.getByTestId('sop-form-category-dropdown');
    this.sopPurposeTextarea = page.getByLabel('Purpose');
    this.sopScopeTextarea = page.getByLabel('Scope');
    this.sopContentTextarea = page.getByLabel('Content');
    this.sopFormSubmitCreate = page.getByTestId('sop-form-submit-create');
    this.sopFormSubmitUpdate = page.getByTestId('sop-form-submit-update');
    this.publishSOPButton = page.getByRole('button', { name: 'Publish SOP' });
    this.acknowledgeButton = page.getByRole('button', { name: 'Acknowledge' });
    this.provideFeedbackButton = page.getByRole('button', { name: 'Provide Feedback' });
  }

  async goto() {
    await this.page.goto('/en/dashboard/governance/sops');
    await this.page.waitForLoadState('domcontentloaded');
  }

  async gotoMyAssigned() {
    await this.page.goto('/en/dashboard/governance/sops/my-assigned');
    await this.page.waitForLoadState('domcontentloaded');
  }

  async createSOP(data: {
    identifier: string;
    title: string;
    category?: string;
    purpose?: string;
    scope?: string;
    content?: string;
  }) {
    await this.createSOPButton.click();
    await expect(this.sopFormDialog).toBeVisible();

    await this.sopIdentifierInput.fill(data.identifier);
    await this.sopTitleInput.fill(data.title);

    if (data.category) {
      await this.sopCategoryDropdown.click();
      await this.page.getByRole('option', { name: data.category }).click();
    }

    if (data.purpose) {
      await this.sopPurposeTextarea.fill(data.purpose);
    }

    if (data.scope) {
      await this.sopScopeTextarea.fill(data.scope);
    }

    if (data.content) {
      await this.sopContentTextarea.fill(data.content);
    }

    await this.sopFormSubmitCreate.click();
    await expect(this.sopFormDialog).not.toBeVisible();
  }

  async updateSOP(data: {
    title?: string;
    purpose?: string;
    scope?: string;
    content?: string;
  }) {
    await this.page.getByRole('button', { name: 'Edit' }).click();
    await expect(this.sopFormDialog).toBeVisible();

    if (data.title) {
      await this.sopTitleInput.fill(data.title);
    }

    if (data.purpose) {
      await this.sopPurposeTextarea.fill(data.purpose);
    }

    if (data.scope) {
      await this.sopScopeTextarea.fill(data.scope);
    }

    if (data.content) {
      await this.sopContentTextarea.fill(data.content);
    }

    await this.sopFormSubmitUpdate.click();
    await expect(this.sopFormDialog).not.toBeVisible();
  }

  async publishSOP() {
    await this.publishSOPButton.click();
    await expect(this.page.getByRole('dialog')).toBeVisible();
    await this.page.getByRole('button', { name: 'Publish' }).click();
    await expect(this.page.getByText('Published')).toBeVisible();
  }

  async acknowledgeSOP() {
    await this.acknowledgeButton.click();
    await expect(this.page.getByRole('dialog')).toBeVisible();
    await this.page.getByRole('button', { name: 'Confirm Acknowledgment' }).click();
    await expect(this.page.getByText('Acknowledged')).toBeVisible();
  }

  async provideFeedback(rating: string, comments: string) {
    await this.provideFeedbackButton.click();
    await expect(this.page.getByRole('dialog')).toBeVisible();

    await this.page.getByLabel('Rating').selectOption(rating);
    await this.page.getByLabel('Comments').fill(comments);

    await this.page.getByRole('button', { name: 'Submit Feedback' }).click();
    await expect(this.page.getByText(comments)).toBeVisible();
  }

  async clickSOPByTitle(title: string) {
    await this.page.getByRole('link', { name: title }).click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  async verifySOPExists(title: string) {
    await expect(this.page.getByText(title)).toBeVisible();
  }

  async verifySOPStatus(status: string) {
    await expect(this.page.getByText(status)).toBeVisible();
  }

  async verifySOPContent(content: string) {
    await expect(this.page.getByText(content)).toBeVisible();
  }
}