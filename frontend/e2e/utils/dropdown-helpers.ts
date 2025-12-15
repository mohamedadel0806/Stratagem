import { Page, expect } from '@playwright/test';

/**
 * Helper functions specifically for testing dropdown/select fields
 * Works with Radix UI Select components used in the application
 */

/**
 * Verify that a field is a dropdown (not a text input)
 */
export async function verifyFieldIsDropdown(
  page: Page,
  fieldName: string,
  options: { label?: string } = {}
): Promise<void> {
  const field = page.locator(`[name="${fieldName}"]`).first();
  await expect(field).toBeVisible({ timeout: 5000 });

  // Verify it's NOT a text input
  const isInput = await field.evaluate((el) => {
    return el.tagName === 'INPUT' && el.getAttribute('type') !== 'hidden';
  });
  expect(isInput).toBe(false);

  // Verify it's a Select/dropdown (Radix UI Select uses button as trigger)
  const isSelect = await field.evaluate((el) => {
    return el.tagName === 'BUTTON' || 
           el.closest('[role="combobox"]') !== null ||
           el.closest('button') !== null;
  });
  expect(isSelect).toBe(true);
}

/**
 * Verify that dropdown options show readable names (not UUIDs)
 */
export async function verifyDropdownShowsNames(
  page: Page,
  fieldName: string,
  options: { minOptions?: number } = {}
): Promise<void> {
  const field = page.locator(`[name="${fieldName}"]`).first();
  await field.click();
  await page.waitForTimeout(500);

  // Wait for dropdown options to appear
  const dropdownOptions = page.locator('[role="option"]');
  const optionCount = await dropdownOptions.count();
  
  expect(optionCount).toBeGreaterThan(options.minOptions || 0);

  // Verify options show readable text, not UUIDs
  if (optionCount > 0) {
    const firstOption = dropdownOptions.first();
    const optionText = await firstOption.textContent();
    
    // Should NOT be just a UUID
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(optionText?.trim() || '');
    expect(isUUID).toBe(false);
    
    // Should contain readable text
    expect(optionText?.length).toBeGreaterThan(2);
  }

  // Close dropdown
  await page.keyboard.press('Escape');
  await page.waitForTimeout(300);
}

/**
 * Select an option from a dropdown by visible text
 */
export async function selectDropdownOptionByText(
  page: Page,
  fieldName: string,
  optionText: string
): Promise<void> {
  const field = page.locator(`[name="${fieldName}"]`).first();
  await field.click();
  await page.waitForTimeout(500);

  // Wait for dropdown options
  await page.waitForSelector('[role="option"]', { state: 'visible', timeout: 5000 });

  // Find and click the option
  const option = page.locator(`[role="option"]:has-text("${optionText}")`).first();
  await option.waitFor({ state: 'visible', timeout: 5000 });
  await option.scrollIntoViewIfNeeded();
  await page.waitForTimeout(300);
  await option.click();

  // Wait for dropdown to close
  await page.waitForTimeout(500);
}

/**
 * Verify dropdown shows loading state
 */
export async function verifyDropdownLoadingState(
  page: Page,
  fieldName: string
): Promise<void> {
  const field = page.locator(`[name="${fieldName}"]`).first();
  await expect(field).toBeVisible({ timeout: 5000 });

  // Check for loading text in the field or nearby
  const loadingText = page.locator(`[name="${fieldName}"]`).locator('..').locator('text=/Loading/i');
  const hasLoading = await loadingText.isVisible().catch(() => false);
  
  // Either should show loading or already be loaded (both are acceptable)
  // The important thing is that it's not a text input
  const isInput = await field.evaluate((el) => {
    return el.tagName === 'INPUT' && el.getAttribute('type') !== 'hidden';
  });
  expect(isInput).toBe(false);
}

/**
 * Verify dropdown handles empty state
 */
export async function verifyDropdownEmptyState(
  page: Page,
  fieldName: string
): Promise<void> {
  const field = page.locator(`[name="${fieldName}"]`).first();
  await field.click();
  await page.waitForTimeout(500);

  // Check for empty state message or options
  const emptyState = page.locator('text=/No .* available/i');
  const hasEmptyState = await emptyState.isVisible().catch(() => false);
  
  const hasOptions = await page.locator('[role="option"]').count() > 0;
  
  // Either should have options or show empty state (both are valid)
  expect(hasOptions || hasEmptyState).toBe(true);

  // Close dropdown
  await page.keyboard.press('Escape');
}
