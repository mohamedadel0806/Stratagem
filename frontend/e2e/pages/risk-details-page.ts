import { Page, Locator, expect } from '@playwright/test';

/**
 * Page Object Model for Risk Details Page
 * Encapsulates all interactions with the risk details page
 */
export class RiskDetailsPage {
  readonly page: Page;

  // Tab locators
  readonly overviewTab: Locator;
  readonly assessmentsTab: Locator;
  readonly assetsTab: Locator;
  readonly controlsTab: Locator;
  readonly treatmentsTab: Locator;
  readonly krisTab: Locator;

  // Overview tab elements
  readonly editButton: Locator;

  // Assessments tab elements
  readonly newAssessmentButton: Locator;

  // Assets tab elements
  readonly linkAssetButton: Locator;

  // Controls tab elements
  readonly linkControlButton: Locator;

  // Treatments tab elements
  readonly newTreatmentButton: Locator;

  // KRIs tab elements
  readonly linkKriButton: Locator;

  // Common dialog/form elements
  readonly dialog: Locator;

  constructor(page: Page) {
    this.page = page;

    // Tab locators - using getByTestId only
    this.overviewTab = page.getByTestId('risk-details-tab-overview');
    this.assessmentsTab = page.getByTestId('risk-details-tab-assessments');
    this.assetsTab = page.getByTestId('risk-details-tab-assets');
    this.controlsTab = page.getByTestId('risk-details-tab-controls');
    this.treatmentsTab = page.getByTestId('risk-details-tab-treatments');
    this.krisTab = page.getByTestId('risk-details-tab-kris');

    // Button locators - using getByTestId only
    this.editButton = page.getByTestId('risk-details-edit-button');
    this.newAssessmentButton = page.getByTestId('risk-details-new-assessment-button');
    this.linkAssetButton = page.getByTestId('risk-details-link-asset-button');
    this.linkControlButton = page.getByTestId('risk-details-link-control-button');
    this.newTreatmentButton = page.getByTestId('risk-details-new-treatment-button');
    this.linkKriButton = page.getByTestId('risk-details-link-kri-button');

    // Common elements
    this.dialog = page.getByRole('dialog');
  }

  /**
   * Navigate to risk details page
   */
  async goto(riskId: string) {
    await this.page.goto(`/en/dashboard/risks/${riskId}`);
    // Wait for the risk title or main container
    await this.page.getByRole('heading', { level: 1 }).first().waitFor({ state: 'visible', timeout: 15000 });
  }

  /**
   * Click on a specific tab
   * Encapsulates tab switching logic and ensures stability
   */
  async clickTab(tabName: 'Overview' | 'Assessments' | 'Assets' | 'Controls' | 'Treatments' | 'KRIs') {
    const tabMap = {
      'Overview': this.overviewTab,
      'Assessments': this.assessmentsTab,
      'Assets': this.assetsTab,
      'Controls': this.controlsTab,
      'Treatments': this.treatmentsTab,
      'KRIs': this.krisTab,
    };

    const tab = tabMap[tabName];
    await tab.waitFor({ state: 'visible', timeout: 10000 });

    // Check if tab is already active
    const state = await tab.getAttribute('data-state').catch(() => '');
    if (state === 'active') {
      return;
    }

    await tab.click();
    // Wait for tab content to render - look for specific markers per tab if needed
    // For now, wait for navigation/load state
    await this.page.waitForLoadState('networkidle').catch(() => { });
  }

  /**
   * Open Edit Risk form
   */
  async openEditRiskForm() {
    await this.clickTab('Overview');
    await this.editButton.waitFor({ state: 'visible', timeout: 5000 });
    await this.editButton.click();
    await this.dialog.waitFor({ state: 'visible', timeout: 5000 });
  }

  /**
   * Fill Edit Risk form
   */
  async fillEditRiskForm(options: { description?: string; statusNotes?: string }) {
    if (options.description) {
      const descriptionField = this.dialog.getByLabel(/Description/i).or(this.dialog.locator('textarea[name*="description"]')).first();
      await descriptionField.fill(options.description);
    }

    if (options.statusNotes) {
      // Handle potential tab switching inside form if fields are segmented
      const notesField = this.dialog.getByLabel(/Status Notes/i).or(this.dialog.locator('textarea[name*="statusNotes"]')).first();
      if (await notesField.isVisible()) {
        await notesField.fill(options.statusNotes);
      } else {
        // Try switching interior tabs if applicable
        const scenarioTab = this.dialog.getByRole('tab', { name: /Scenario/i });
        if (await scenarioTab.isVisible()) {
          await scenarioTab.click();
          await notesField.fill(options.statusNotes);
        }
      }
    }
  }

  /**
   * Submit Edit Risk form
   */
  async submitEditRiskForm() {
    const updateButton = this.dialog.getByRole('button', { name: /Update|Save/i }).first();
    await updateButton.click();
    await this.dialog.waitFor({ state: 'hidden', timeout: 10000 });
  }

  /**
   * Close dialog
   */
  async closeDialog() {
    await this.page.keyboard.press('Escape');
    await this.dialog.waitFor({ state: 'hidden', timeout: 5000 }).catch(() => { });
  }

  /**
   * Ensure dialog is closed
   */
  async ensureDialogClosed() {
    await this.closeDialog();
  }

  /**
   * Ensure no dialog is open before starting a new action
   */
  async ensureNoDialogOpen() {
    if (await this.dialog.isVisible()) {
      await this.closeDialog();
    }
  }

  // ========================================
  // ASSESSMENTS TAB METHODS
  // ========================================

  /**
   * Open New Assessment form
   */
  async openNewAssessmentForm() {
    await this.clickTab('Assessments');
    await this.newAssessmentButton.waitFor({ state: 'visible', timeout: 5000 });
    await this.newAssessmentButton.click();
    await this.dialog.waitFor({ state: 'visible', timeout: 5000 });
  }

  /**
   * Fill assessment form
   */
  async fillAssessmentForm(options: { likelihood?: number; impact?: number; notes?: string }) {
    if (options.likelihood !== undefined) {
      await this.dialog.getByLabel(/Likelihood/i).click();
      await this.page.getByRole('option', { name: new RegExp(`^${options.likelihood}`, 'i') }).click();
    }

    if (options.impact !== undefined) {
      await this.dialog.getByLabel(/Impact/i).click();
      await this.page.getByRole('option', { name: new RegExp(`^${options.impact}`, 'i') }).click();
    }

    if (options.notes) {
      const notesField = this.dialog.getByLabel(/Notes|Comment/i).or(this.dialog.locator('textarea[name*="notes"]')).first();
      await notesField.fill(options.notes);
    }
  }

  /**
   * Submit assessment form
   */
  async submitAssessmentForm() {
    const submitBtn = this.dialog.getByRole('button', { name: /Create|Assess|Submit/i }).first();
    await submitBtn.click();
    await this.dialog.waitFor({ state: 'hidden', timeout: 10000 });
  }

  // ========================================
  // ASSETS TAB METHODS
  // ========================================

  /**
   * Open Link Asset dialog
   */
  async openLinkAssetDialog() {
    await this.clickTab('Assets');
    await this.linkAssetButton.waitFor({ state: 'visible', timeout: 5000 });
    await this.linkAssetButton.click();
    await this.dialog.waitFor({ state: 'visible', timeout: 5000 });
  }

  /**
   * Select asset checkbox by index
   */
  async selectAsset(index: number = 0) {
    const checkbox = this.dialog.locator('input[type="checkbox"], [role="checkbox"]').nth(index);
    await checkbox.check();
  }

  /**
   * Submit asset link
   */
  async submitAssetLink() {
    const submitBtn = this.dialog.getByRole('button', { name: /Link|Add|Save/i }).first();
    await submitBtn.click();
    await this.dialog.waitFor({ state: 'hidden', timeout: 10000 });
  }

  // ========================================
  // CONTROLS TAB METHODS
  // ========================================

  /**
   * Open Link Control dialog
   */
  async openLinkControlDialog() {
    await this.clickTab('Controls');
    await this.linkControlButton.waitFor({ state: 'visible', timeout: 5000 });
    await this.linkControlButton.click();
    await this.dialog.waitFor({ state: 'visible', timeout: 5000 });
  }

  /**
   * Select control checkbox by index
   */
  async selectControl(index: number = 0) {
    const checkbox = this.dialog.locator('input[type="checkbox"], [role="checkbox"]').nth(index);
    await checkbox.check();
  }

  /**
   * Submit control link
   */
  async submitControlLink() {
    const submitBtn = this.dialog.getByRole('button', { name: /Link|Add|Save/i }).first();
    await submitBtn.click();
    await this.dialog.waitFor({ state: 'hidden', timeout: 10000 });
  }

  // ========================================
  // TREATMENTS TAB METHODS
  // ========================================

  /**
   * Open New Treatment form
   */
  async openNewTreatmentForm() {
    await this.clickTab('Treatments');
    await this.newTreatmentButton.waitFor({ state: 'visible', timeout: 5000 });
    await this.newTreatmentButton.click();
    await this.dialog.waitFor({ state: 'visible', timeout: 5000 });
  }

  /**
   * Fill treatment form
   */
  async fillTreatmentForm(options: { title?: string; description?: string; strategy?: string; status?: string }) {
    if (options.title) {
      await this.dialog.getByLabel(/Title/i).fill(options.title);
    }
    if (options.description) {
      await this.dialog.getByLabel(/Description/i).fill(options.description);
    }
    if (options.strategy) {
      await this.dialog.getByLabel(/Strategy/i).click();
      await this.page.getByRole('option', { name: new RegExp(options.strategy, 'i') }).click();
    }
    if (options.status) {
      await this.dialog.getByLabel(/Status/i).click();
      await this.page.getByRole('option', { name: new RegExp(options.status, 'i') }).click();
    }
  }

  /**
   * Submit treatment form
   */
  async submitTreatmentForm() {
    const submitBtn = this.dialog.getByRole('button', { name: /Create|Add|Save/i }).first();
    await submitBtn.click();
    await this.dialog.waitFor({ state: 'hidden', timeout: 10000 });
  }

  // ========================================
  // KRIS TAB METHODS
  // ========================================

  /**
   * Open Link KRI dialog
   */
  async openLinkKriDialog() {
    await this.clickTab('KRIs');
    await this.linkKriButton.waitFor({ state: 'visible', timeout: 5000 });
    await this.linkKriButton.click();
    await this.dialog.waitFor({ state: 'visible', timeout: 5000 });
  }

  /**
   * Select KRI checkbox by index
   */
  async selectKri(index: number = 0) {
    const checkbox = this.dialog.locator('input[type="checkbox"], [role="checkbox"]').nth(index);
    await checkbox.check();
  }

  /**
   * Check if dialog/form is visible
   */
  async isDialogVisible(): Promise<boolean> {
    return await this.dialog.isVisible();
  }

  /**
   * Submit KRI link
   */
  async submitKriLink() {
    const submitBtn = this.dialog.getByRole('button', { name: /Link|Add|Save/i }).first();
    await submitBtn.click();
    await this.dialog.waitFor({ state: 'hidden', timeout: 10000 });
  }

  // ========================================
  // ASSESSMENT REQUESTS METHODS
  // ========================================

  /**
   * Open Request Assessment form
   */
  async openRequestAssessmentForm() {
    await this.clickTab('Assessments');
    const requestButton = this.page.getByTestId('risk-details-request-assessment-button');
    await requestButton.waitFor({ state: 'visible', timeout: 5000 });
    await requestButton.click();
    await this.dialog.waitFor({ state: 'visible', timeout: 5000 });
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
  }) {
    if (options.assessmentType) {
      await this.dialog.getByLabel(/Assessment Type/i).click();
      await this.page.getByRole('option', { name: new RegExp(options.assessmentType, 'i') }).click();
    }

    if (options.priority) {
      await this.dialog.getByLabel(/Priority/i).click();
      await this.page.getByRole('option', { name: new RegExp(options.priority, 'i') }).click();
    }

    if (options.justification) {
      await this.dialog.getByLabel(/Justification/i).fill(options.justification);
    }

    if (options.dueDate) {
      await this.dialog.getByLabel(/Due Date/i).fill(options.dueDate);
    }

    if (options.assignTo) {
      await this.dialog.getByLabel(/Assign To/i).click();
      await this.page.getByRole('option', { name: new RegExp(options.assignTo, 'i') }).click();
    }

    if (options.notes) {
      const notesField = this.dialog.getByLabel(/Notes/i).or(this.dialog.locator('textarea[name*="notes"]')).first();
      await notesField.fill(options.notes);
    }
  }

  /**
   * Submit assessment request form
   */
  async submitAssessmentRequestForm() {
    const submitButton = this.dialog.getByRole('button', { name: /Request|Create|Submit/i }).first();
    await submitButton.click();
    await this.dialog.waitFor({ state: 'hidden', timeout: 10000 });
  }
}



