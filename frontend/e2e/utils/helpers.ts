import { Page, expect } from '@playwright/test';

/**
 * Helper functions for E2E tests
 */

/**
 * Wait for API calls to complete
 */
export async function waitForApiCalls(page: Page, timeout = 5000): Promise<void> {
  await page.waitForLoadState('networkidle', { timeout });
}

/**
 * Wait for a toast notification to appear
 */
export async function waitForToast(page: Page, message?: string): Promise<void> {
  // Adjust selector based on your toast implementation
  const toastSelector = '[role="status"], .toast, [data-testid="toast"]';
  
  if (message) {
    await expect(page.locator(toastSelector)).toContainText(message, { timeout: 5000 });
  } else {
    await expect(page.locator(toastSelector).first()).toBeVisible({ timeout: 5000 });
  }
}

/**
 * Fill form fields
 */
export async function fillForm(
  page: Page,
  fields: Record<string, string | boolean>
): Promise<void> {
  for (const [name, value] of Object.entries(fields)) {
    if (typeof value === 'boolean') {
      const checkbox = page.locator(`input[name="${name}"], input[type="checkbox"][id*="${name}"]`);
      const isChecked = await checkbox.isChecked();
      if (value !== isChecked) {
        await checkbox.click();
      }
    } else {
      const input = page.locator(`input[name="${name}"], textarea[name="${name}"]`);
      await input.fill(value);
    }
  }
}

/**
 * Click a button by text
 */
export async function clickButton(page: Page, text: string): Promise<void> {
  await page.click(`button:has-text("${text}")`);
}

/**
 * Handle Radix UI dropdown/select interactions
 */
export async function selectDropdownOption(
  page: Page,
  trigger: any, // Can be a selector string or Locator
  optionText: string,
  timeout = 10000
): Promise<void> {
  // Get the trigger locator
  const triggerLocator = typeof trigger === 'string' ? page.locator(trigger).first() : trigger;
  
  await triggerLocator.waitFor({ state: 'visible', timeout });
  await triggerLocator.click();
  
  // Wait for dropdown menu to appear
  await page.waitForSelector('[role="listbox"], [role="menu"], [data-radix-popper-content-wrapper], [role="option"]', {
    state: 'visible',
    timeout: 5000,
  });
  
  // Wait a bit for the dropdown to fully open
  await page.waitForTimeout(500);
  
  // Find and click the option - try multiple strategies
  const option = page.locator(`[role="option"]:has-text("${optionText}"), text="${optionText}"`).first();
  await option.waitFor({ state: 'visible', timeout: 5000 });
  
  // Scroll into view if needed
  await option.scrollIntoViewIfNeeded();
  await page.waitForTimeout(300);
  
  // Click with force if needed (to bypass overlays)
  try {
    await option.click({ timeout: 3000 });
  } catch (e) {
    // If click fails due to interception, try force click
    await option.click({ force: true });
  }
  
  // Wait for dropdown to close
  await page.waitForTimeout(500);
}

/**
 * Click table row or view button to navigate to details
 */
export async function navigateToDetails(page: Page, tableSelector = 'table'): Promise<void> {
  await waitForTable(page, tableSelector);
  
  const firstRow = page.locator(`${tableSelector} tbody tr`).first();
  await firstRow.waitFor({ state: 'visible', timeout: 5000 });
  
  // Try to find a link first (most reliable)
  const rowLink = firstRow.locator('a').first();
  const hasLink = await rowLink.isVisible().catch(() => false);
  
  if (hasLink) {
    await rowLink.click({ timeout: 5000 });
    return;
  }
  
  // Try to find a view/edit button
  const viewButton = firstRow.locator(
    'button[aria-label*="View"], ' +
    'button[aria-label*="view"], ' +
    'button:has-text("View"), ' +
    'button:has-text("Edit"), ' +
    'button[aria-label*="Edit"]'
  ).first();
  
  const hasViewButton = await viewButton.isVisible().catch(() => false);
  
  if (hasViewButton) {
    await viewButton.click({ timeout: 5000 });
    return;
  }
  
  // Try clicking on the first cell (might be a link)
  const firstCell = firstRow.locator('td, th').first();
  const firstCellLink = firstCell.locator('a').first();
  const hasCellLink = await firstCellLink.isVisible().catch(() => false);
  
  if (hasCellLink) {
    await firstCellLink.click({ timeout: 5000 });
    return;
  }
  
  // Last resort: click the row itself
  await firstRow.click({ timeout: 5000 });
  
  // Wait a bit for any navigation to start
  await page.waitForTimeout(1000);
}

/**
 * Wait for table to load and return rows
 */
export async function waitForTable(page: Page, tableSelector = 'table'): Promise<void> {
  await page.waitForSelector(tableSelector, { state: 'visible' });
  // Wait for table rows to appear (indicating data has loaded)
  await page.waitForSelector(`${tableSelector} tbody tr`, { timeout: 10000 });
}

/**
 * Get table row count
 */
export async function getTableRowCount(page: Page, tableSelector = 'table'): Promise<number> {
  const rows = await page.locator(`${tableSelector} tbody tr`).count();
  return rows;
}

/**
 * Click table row by index
 */
export async function clickTableRow(page: Page, index: number, tableSelector = 'table'): Promise<void> {
  const row = page.locator(`${tableSelector} tbody tr`).nth(index);
  await row.click();
}

/**
 * Search in a search input
 */
export async function search(page: Page, query: string, searchSelector = 'input[type="search"], input[placeholder*="Search"]'): Promise<void> {
  const searchInput = page.locator(searchSelector).first();
  await searchInput.fill(query);
  await searchInput.press('Enter');
  await page.waitForTimeout(500); // Wait for search results
}

/**
 * Wait for dialog/modal to appear
 */
export async function waitForDialog(page: Page): Promise<void> {
  await page.waitForSelector('[role="dialog"], .modal, [data-testid="dialog"]', {
    state: 'visible',
    timeout: 5000,
  });
}

/**
 * Close dialog/modal
 */
export async function closeDialog(page: Page): Promise<void> {
  const closeButton = page.locator(
    'button[aria-label="Close"], button:has-text("Cancel"), [data-testid="close-dialog"]'
  ).first();
  if (await closeButton.isVisible()) {
    await closeButton.click();
  }
}

/**
 * Navigate to a governance page
 */
export async function navigateToGovernancePage(
  page: Page,
  pageName: 'influencers' | 'policies' | 'controls' | 'assessments' | 'findings' | 'evidence' | 'dashboard',
  locale = 'en'
): Promise<void> {
  const routes = {
    influencers: `/${locale}/dashboard/governance/influencers`,
    policies: `/${locale}/dashboard/governance/policies`,
    controls: `/${locale}/dashboard/governance/controls`,
    assessments: `/${locale}/dashboard/governance/assessments`,
    findings: `/${locale}/dashboard/governance/findings`,
    evidence: `/${locale}/dashboard/governance/evidence`,
    dashboard: `/${locale}/dashboard/governance`,
  };

  await page.goto(routes[pageName]);
  await waitForApiCalls(page);
}

/**
 * Generate random string for test data
 */
export function generateRandomString(prefix = 'test', length = 8): string {
  const random = Math.random().toString(36).substring(2, length + 2);
  return `${prefix}-${random}`;
}

/**
 * Generate random email for test data
 */
export function generateRandomEmail(prefix = 'test'): string {
  const random = Math.random().toString(36).substring(2, 10);
  return `${prefix}-${random}@example.com`;
}

/**
 * Wait for page to be fully loaded (React + API calls)
 */
export async function waitForPageLoad(page: Page): Promise<void> {
  await page.waitForLoadState('domcontentloaded');
  await page.waitForLoadState('networkidle');
  // Additional wait for React hydration
  await page.waitForTimeout(500);
}

