import { Page, Locator, expect } from '@playwright/test';

const WAIT_SMALL = 500;
const WAIT_MEDIUM = 1000;
const WAIT_LARGE = 2000;

export class AlertPage {
  readonly page: Page;
  readonly createAlertRuleButton: Locator;
  readonly createSubscriptionButton: Locator;
  readonly alertsList: Locator;
  readonly alertRulesList: Locator;
  readonly alertFormDialog: Locator;
  readonly ruleNameInput: Locator;
  readonly ruleDescriptionTextarea: Locator;
  readonly triggerTypeDropdown: Locator;
  readonly alertTypeDropdown: Locator;
  readonly severityDropdown: Locator;
  readonly alertMessageTextarea: Locator;
  readonly acknowledgeButton: Locator;
  readonly resolveButton: Locator;
  readonly triggerRuleButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.createAlertRuleButton = page.getByRole('button', { name: /Create Rule/i });
    this.createSubscriptionButton = page.getByRole('button', { name: /Create Subscription|Add Subscription/i });
    this.alertsList = page.getByTestId('alerts-list').or(page.locator('.space-y-4').filter({ hasText: /Active Alerts/i }));
    this.alertRulesList = page.getByTestId('alert-rules-list').or(page.locator('.space-y-4').filter({ hasText: /Alert Rules/i }));
    this.alertFormDialog = page.getByRole('dialog');
    this.ruleNameInput = page.getByLabel('Rule Name');
    this.ruleDescriptionTextarea = page.getByLabel('Description');
    this.triggerTypeDropdown = page.getByTestId('alert-rule-trigger-type-dropdown');
    this.alertTypeDropdown = page.getByTestId('alert-rule-alert-type-dropdown');
    this.severityDropdown = page.getByTestId('alert-rule-severity-dropdown');
    this.alertMessageTextarea = page.getByLabel('Alert Message');
    this.acknowledgeButton = page.getByRole('button', { name: 'Acknowledge' });
    this.resolveButton = page.getByRole('button', { name: 'Resolve' });
    this.triggerRuleButton = page.getByRole('button', { name: 'Trigger Rule' });
  }

  async goto() {
    await this.page.goto('/en/dashboard/governance/alerts');
    // Wait for the page to be ready by checking for the title or a list
    await expect(this.page.locator('h1').filter({ hasText: /Alert/i }).or(this.alertsList).first()).toBeVisible({ timeout: 15000 });
  }



  async gotoRules() {
    await this.goto();
    // Tab list might re-render, wait a bit
    await this.page.waitForTimeout(WAIT_SMALL);
    const rulesTab = this.page.getByRole('tab', { name: /Rules/i });
    await rulesTab.waitFor({ state: 'visible' });
    await rulesTab.click();
    await expect(this.page.locator('h1').filter({ hasText: /Alert/i }).or(this.alertRulesList).first()).toBeVisible({ timeout: 15000 });
  }


  async gotoSubscriptions() {
    await this.goto();
    // Tab list might re-render, wait a bit
    await this.page.waitForTimeout(WAIT_SMALL);
    const subsTab = this.page.getByRole('tab', { name: /Subscriptions/i });
    await subsTab.waitFor({ state: 'visible' });
    await subsTab.click();
    await expect(this.page.locator('h1').filter({ hasText: /Alert/i }).or(this.page.getByText(/Subscriptions/i)).first()).toBeVisible({ timeout: 15000 });
  }


  async createAlertRule(data: {
    name: string;
    description: string;
    triggerType: string;
    alertType: string;
    severity: string;
    alertMessage: string;
  }) {
    await this.gotoRules();
    await this.createAlertRuleButton.click();
    await expect(this.alertFormDialog).toBeVisible();

    await this.ruleNameInput.fill(data.name);
    await this.ruleDescriptionTextarea.fill(data.description);

    await this.triggerTypeDropdown.click();
    await this.page.getByRole('option', { name: data.triggerType }).click();

    await this.alertTypeDropdown.click();
    await this.page.getByRole('option', { name: data.alertType }).click();

    await this.severityDropdown.click();
    await this.page.getByRole('option', { name: data.severity }).click();

    await this.alertMessageTextarea.fill(data.alertMessage);

    await this.page.getByRole('button', { name: 'Create Rule' }).click();
    await expect(this.alertFormDialog).not.toBeVisible();
  }

  async createSubscription(data: {
    alertType: string;
    severity: string;
    channels: string[];
    frequency: string;
  }) {
    await this.gotoSubscriptions();
    await this.createSubscriptionButton.click();
    await expect(this.alertFormDialog).toBeVisible();

    await this.page.getByLabel('Alert Type').selectOption(data.alertType);
    await this.page.getByLabel('Severity').selectOption(data.severity);

    for (const channel of data.channels) {
      await this.page.getByLabel(channel).check();
    }

    await this.page.getByLabel('Frequency').selectOption(data.frequency);

    await this.page.getByRole('button', { name: 'Create Subscription' }).click();
    await expect(this.alertFormDialog).not.toBeVisible();
  }

  async triggerRule(ruleName: string) {
    await this.page.getByRole('button', { name: 'Trigger Rule' }).click();
    await this.page.getByRole('button', { name: 'Confirm' }).click();
    await expect(this.page.getByText('Alert created successfully')).toBeVisible();
  }

  async acknowledgeAlert(alertTitle: string) {
    // Find the specific alert and acknowledge it
    await this.page.getByText(alertTitle).locator('..').getByRole('button', { name: 'Acknowledge' }).click();
    await expect(this.page.getByRole('dialog')).toBeVisible();
    await this.page.getByRole('button', { name: 'Confirm' }).click();
    await expect(this.page.getByText('Acknowledged')).toBeVisible();
  }

  async resolveAlert(alertTitle: string, resolution: string) {
    // Find the specific alert and resolve it
    await this.page.getByText(alertTitle).locator('..').getByRole('button', { name: 'Resolve' }).click();
    await expect(this.page.getByRole('dialog')).toBeVisible();
    await this.page.getByLabel('Resolution Notes').fill(resolution);
    await this.page.getByRole('button', { name: 'Resolve Alert' }).click();
    await expect(this.page.getByText('Resolved')).toBeVisible();
  }
  async openAlertDetail(alertTitle: string) {
    // Locate the alert row by title and click its view/details button or link
    const row = this.page.getByText(alertTitle).locator('..');
    const link = row.locator('a').first();
    if (await link.isVisible()) {
      await link.click();
    } else {
      const viewBtn = row.getByRole('button', { name: /View|Details/i }).first();
      await viewBtn.click();
    }
    await expect(this.page.locator('h1')).toContainText('Alert', { timeout: 10000 });
  }

  async filterAlerts(filters: { status?: string; severity?: string; type?: string }) {
    if (filters.status) {
      await this.page.getByLabel('Status Filter').selectOption(filters.status);
    }
    if (filters.severity) {
      await this.page.getByLabel('Severity Filter').selectOption(filters.severity);
    }
    if (filters.type) {
      await this.page.getByLabel('Type Filter').selectOption(filters.type);
    }
  }

  async bulkAcknowledge() {
    await this.page.getByRole('checkbox').first().check();
    await this.page.getByRole('button', { name: 'Bulk Acknowledge' }).click();
    await this.page.getByRole('button', { name: 'Confirm' }).click();
    await expect(this.page.getByText('Alerts acknowledged')).toBeVisible();
  }

  async verifyAlertExists(title: string) {
    await expect(this.page.getByText(title)).toBeVisible();
  }

  async verifyAlertStatus(status: string) {
    await expect(this.page.getByText(status)).toBeVisible();
  }

  async verifyAlertRuleExists(name: string) {
    await expect(this.page.getByText(name)).toBeVisible();
  }

  async verifySubscriptionExists(alertType: string) {
    await expect(this.page.getByText(alertType)).toBeVisible();
  }
}