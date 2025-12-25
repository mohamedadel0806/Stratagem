import { Page, Locator } from '@playwright/test';

export async function fillFormField(page: Page, fieldName: string, value: string) {
  const input = page.locator(`input[name="${fieldName}"]`).first();
  await input.fill(value);
}

export async function fillTextareaField(page: Page, fieldName: string, value: string) {
  const textarea = page.locator(`textarea[name="${fieldName}"]`).first();
  await textarea.fill(value);
}

export async function selectDropdownOption(page: Page, label: string, option: string) {
  const dropdownTrigger = page.locator(`label:has-text("${label}")`).locator('..').locator('button[role="combobox"], button').first();
  await dropdownTrigger.click();
  await page.locator('[role="option"]').filter({ hasText: option }).first().click();
}

export async function selectOptionByRole(page: Page, name: string, optionName: string) {
  const select = page.getByRole('combobox', { name });
  await select.click();
  await page.getByRole('option', { name: optionName }).click();
}

export async function waitForFormReady(page: Page) {
  await page.waitForSelector('form, [role="dialog"]', { state: 'visible' });
  await page.waitForLoadState('domcontentloaded');
}

export async function waitForDialog(page: Page) {
  await page.waitForSelector('[role="dialog"]', { state: 'visible' });
}

export async function closeDialog(page: Page) {
  await page.waitForSelector('[role="dialog"]', { state: 'hidden' });
}

export async function clickButton(page: Page, text: string) {
  const button = page.locator(`button:has-text("${text}")`).first();
  await button.click();
}

export async function waitForTable(page: Page) {
  await page.waitForSelector('table', { state: 'visible' });
  await page.waitForLoadState('networkidle');
}

export async function waitForApiCalls(page: Page) {
  await page.waitForLoadState('networkidle');
}

export async function verifyElementVisible(page: Page, selector: string, timeout: number = 10000) {
  await page.locator(selector).first().waitFor({ state: 'visible', timeout });
}

export async function verifyTextVisible(page: Page, text: string, timeout: number = 10000) {
  await page.locator(`text="${text}"`).first().waitFor({ state: 'visible', timeout });
}

export async function navigateToDetails(page: Page) {
  const firstRow = page.locator('table tbody tr').first();
  await firstRow.click();
}

export function generateUniqueIdentifier(prefix: string): string {
  return `${prefix}-${Date.now()}`;
}

export function generateUniqueName(type: string): string {
  return `E2E Test ${type} ${Date.now()}`;
}

export function getTodayDate(): string {
  return new Date().toISOString().split('T')[0];
}

export function getFutureDate(days: number): string {
  return new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
}

export async function fillTabField(page: Page, fieldName: string, value: string) {
  const input = page.locator(`label:has-text("${fieldName}")`).locator('..').locator('input').first();
  await input.fill(value);
}

export async function fillTabTextarea(page: Page, fieldName: string, value: string) {
  const textarea = page.locator(`label:has-text("${fieldName}")`).locator('..').locator('textarea').first();
  await textarea.fill(value);
}

export async function selectTabDropdown(page: Page, fieldName: string, optionText: string) {
  const dropdown = page.locator(`label:has-text("${fieldName}")`).locator('..').locator('button[role="combobox"]').first();
  await dropdown.click();
  await page.locator('[role="option"]').filter({ hasText: optionText }).first().click();
}

export async function clickCheckbox(page: Page, label: string) {
  const checkbox = page.locator(`label:has-text("${label}")`).first();
  await checkbox.click();
}

export async function waitForDialogToClose(page: Page, timeout: number = 10000) {
  await page.waitForSelector('[role="dialog"]', { state: 'hidden', timeout });
}

export async function clickTab(page: Page, tabName: string) {
  const tab = page.locator(`[role="tab"]:has-text("${tabName}")`).first();
  await tab.click();
  await page.waitForLoadState('domcontentloaded');
}

export async function fillBasicInfoTab(page: Page, data: { name: string; description?: string; type?: string; status?: string; version?: string; criticality?: string }) {
  await selectOptionByRole(page, 'Application Name', data.name);
  if (data.description) {
    await selectOptionByRole(page, 'Description', data.description);
  }
  if (data.type) {
    await selectTabDropdown(page, 'Application Type', data.type);
  }
  if (data.status) {
    await selectTabDropdown(page, 'Status', data.status);
  }
  if (data.version) {
    await selectOptionByRole(page, 'Version', data.version);
  }
  if (data.criticality) {
    await selectTabDropdown(page, 'Criticality', data.criticality);
  }
}

export async function fillTechnicalTab(page: Page, data: { hosting?: string; techStack?: string; url?: string; deploymentDate?: string; processesPII?: boolean; processesFinancial?: boolean }) {
  if (data.hosting) {
    await selectTabDropdown(page, 'Hosting Location', data.hosting);
  }
  if (data.techStack) {
    await selectOptionByRole(page, 'Technology Stack', data.techStack);
  }
  if (data.url) {
    await selectOptionByRole(page, 'URL', data.url);
  }
  if (data.deploymentDate) {
    const dateInput = page.locator('label:has-text("Deployment Date")').locator('..').locator('input[type="date"]').first();
    await dateInput.fill(data.deploymentDate);
  }
  if (data.processesPII) {
    await clickCheckbox(page, 'Processes PII');
  }
  if (data.processesFinancial) {
    await clickCheckbox(page, 'Processes Financial Data');
  }
}

export async function fillComplianceTab(page: Page, data: { owner?: string; businessUnit?: string; department?: string; notes?: string }) {
  if (data.department) {
    await selectOptionByRole(page, 'Department', data.department);
  }
  if (data.notes) {
    await selectOptionByRole(page, 'Notes', data.notes);
  }
}

export async function selectOwner(page: Page) {
  const ownerSelect = page.locator('label:has-text("Owner")').locator('..').locator('button[role="combobox"]').first();
  await ownerSelect.click();
  await page.waitForSelector('[role="option"]', { timeout: 5000 });
  const ownerOption = page.locator('[role="option"]').first();
  const ownerText = await ownerOption.textContent();
  if (ownerText && !ownerText.toLowerCase().includes('no users available')) {
    await ownerOption.click();
  }
}

export async function selectBusinessUnit(page: Page) {
  const buSelect = page.locator('label:has-text("Business Unit")').locator('..').locator('button[role="combobox"]').first();
  await buSelect.click();
  await page.waitForSelector('[role="option"]', { timeout: 5000 });
  const buOption = page.locator('[role="option"]').first();
  const buText = await buOption.textContent();
  if (buText && !buText.toLowerCase().includes('no business units available')) {
    await buOption.click();
  }
}
