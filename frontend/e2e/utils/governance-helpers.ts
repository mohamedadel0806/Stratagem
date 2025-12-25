import { Page } from '@playwright/test';

export async function navigateToAssetsPage(page: Page, assetType: 'physical-assets' | 'business-applications' | 'software-assets' | 'information-assets' | 'suppliers') {
  const routes = {
    'physical-assets': '/en/dashboard/assets/physical-assets',
    'business-applications': '/en/dashboard/assets/business-applications',
    'software-assets': '/en/dashboard/assets/software-assets',
    'information-assets': '/en/dashboard/assets/information-assets',
    'suppliers': '/en/dashboard/assets/suppliers',
  };

  await page.goto(routes[assetType]);
  await page.waitForLoadState('domcontentloaded');
  await page.waitForLoadState('networkidle');
}

export async function navigateToGovernancePage(page: Page, governanceType: 'influencers' | 'policies' | 'controls' | 'assessments' | 'evidence' | 'findings') {
  const routes = {
    'influencers': '/en/dashboard/governance/influencers',
    'policies': '/en/dashboard/governance/policies',
    'controls': '/en/dashboard/governance/controls',
    'assessments': '/en/dashboard/governance/assessments',
    'evidence': '/en/dashboard/governance/evidence',
    'findings': '/en/dashboard/governance/findings',
  };

  await page.goto(routes[governanceType]);
  await page.waitForLoadState('domcontentloaded');
  await page.waitForLoadState('networkidle');
}

export async function waitForModal(page: Page, timeout: number = 10000) {
  await page.waitForSelector('[role="dialog"], [data-testid$="-dialog"]', { state: 'visible', timeout });
}

export async function waitForModalClose(page: Page, timeout: number = 10000) {
  await page.waitForSelector('[role="dialog"], [data-testid$="-dialog"]', { state: 'hidden', timeout });
}

export async function selectFromDropdown(page: Page, labelText: string, optionText: string) {
  const dropdown = page.getByLabel(labelText).or(page.locator(`[aria-label*="${labelText}"]`));
  await dropdown.click();
  
  const option = page.getByRole('option', { name: optionText });
  await option.click();
}

export async function fillInputByLabel(page: Page, labelText: string, value: string) {
  const input = page.getByLabel(labelText).or(page.locator(`input[name*="${labelText.toLowerCase().replace(/\s+/g, '_')}"]`));
  await input.fill(value);
}

export async function fillTextareaByLabel(page: Page, labelText: string, value: string) {
  const textarea = page.getByLabel(labelText).or(page.locator(`textarea[name*="${labelText.toLowerCase().replace(/\s+/g, '_')}"]`));
  await textarea.fill(value);
}

export async function clickButtonByName(page: Page, buttonText: string) {
  const button = page.getByRole('button', { name: buttonText });
  await button.click();
}

export async function verifyToastMessage(page: Page, messagePattern: string | RegExp) {
  const toast = page.locator('[data-testid="toast"], [role="alert"], [role="status"]').first();
  await expect(toast).toBeVisible({ timeout: 5000 });
  
  const toastContent = await toast.textContent();
  if (typeof messagePattern === 'string') {
    expect(toastContent).toContain(messagePattern);
  } else {
    expect(toastContent).toMatch(messagePattern);
  }
}
