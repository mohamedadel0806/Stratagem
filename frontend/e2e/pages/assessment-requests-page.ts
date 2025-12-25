import { Page, Locator } from '@playwright/test';

/**
 * Page Object Model for Assessment Requests Page
 * Encapsulates all interactions with the assessment requests page
 */
export class AssessmentRequestsPage {
  readonly page: Page;

  // Main elements
  readonly newRequestButton: Locator;
  readonly searchInput: Locator;
  readonly statusFilter: Locator;
  readonly requestsList: Locator;

  // Wait times (can be configured)
  private readonly WAIT_SMALL = 500;
  private readonly WAIT_MEDIUM = 1000;
  private readonly WAIT_LARGE = 2000;

  constructor(page: Page) {
    this.page = page;

    // Button locators
    this.newRequestButton = page.getByTestId('assessment-requests-new-button');
    this.searchInput = page.getByTestId('assessment-requests-search-input');
    this.statusFilter = page.getByTestId('assessment-requests-status-filter');
    this.requestsList = page.getByTestId('assessment-requests-list');
  }

  /**
   * Navigate to assessment requests page
   */
  async goto(locale: string = 'en', riskId?: string) {
    const url = riskId
      ? `/${locale}/dashboard/risks/assessment-requests?riskId=${riskId}`
      : `/${locale}/dashboard/risks/assessment-requests`;
    await this.page.goto(url);
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Check if page is loaded
   */
  async isLoaded(): Promise<boolean> {
    return await this.page.getByRole('heading', { name: /Assessment Requests/i }).first().isVisible();
  }

  /**
   * Open new assessment request form
   */
  async openNewRequestForm() {
    await this.newRequestButton.waitFor({ state: 'visible', timeout: 5000 });
    await this.newRequestButton.click();
    await this.page.locator('[role="dialog"]').waitFor({ state: 'visible', timeout: 5000 });
  }

  /**
   * Search for assessment requests
   */
  async search(query: string) {
    await this.searchInput.fill(query);
    await this.page.waitForLoadState('networkidle').catch(() => { });
  }

  /**
   * Filter by status
   */
  async filterByStatus(status: string) {
    await this.statusFilter.click();
    await this.page.getByRole('option', { name: new RegExp(status, 'i') }).first().click();
    await this.page.waitForLoadState('networkidle').catch(() => { });
  }

  /**
   * Get count of assessment request cards
   */
  async getRequestCount(): Promise<number> {
    const cards = this.page.locator('[data-testid^="assessment-request-card-"]');
    return await cards.count();
  }

  /**
   * Fill assessment request form
   */
  async fillAssessmentRequestForm(options: {
    assessmentType?: string;
    priority?: string;
    dueDate?: string;
    assignTo?: string;
    notes?: string;
    justification?: string;
    riskId?: string;
  }) {
    const dialog = this.page.locator('[role="dialog"]');

    if (options.riskId) {
      await this.page.getByTestId('risk-dropdown-trigger').click();
      await this.page.getByTestId('risk-search-input').fill(options.riskId);
      await this.page.getByTestId(`risk-option-${options.riskId}`).click();
    }

    if (options.assessmentType) {
      await dialog.getByLabel(/Assessment Type/i).click();
      await this.page.getByRole('option', { name: new RegExp(options.assessmentType, 'i') }).click();
    }

    if (options.priority) {
      await dialog.getByLabel(/Priority/i).click();
      await this.page.getByRole('option', { name: new RegExp(options.priority, 'i') }).click();
    }

    if (options.justification) {
      await dialog.getByLabel(/Justification/i).fill(options.justification);
    }

    if (options.dueDate) {
      await dialog.getByLabel(/Due Date/i).fill(options.dueDate);
    }

    if (options.assignTo) {
      await dialog.getByLabel(/Assign To/i).click();
      await this.page.getByRole('option', { name: new RegExp(options.assignTo, 'i') }).click();
    }

    if (options.notes) {
      await dialog.getByLabel(/Notes/i).fill(options.notes);
    }
  }

  /**
   * Submit assessment request form
   */
  async submitAssessmentRequestForm() {
    const submitButton = this.page.getByTestId('assessment-request-form-submit-create').or(
      this.page.getByTestId('assessment-request-form-submit-update')
    );
    await submitButton.click();
    await this.page.locator('[role="dialog"]').waitFor({ state: 'hidden', timeout: 10000 });
  }
}



