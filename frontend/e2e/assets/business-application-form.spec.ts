import { test } from '../fixtures/auth';
import { expect } from '@playwright/test';
import { TEST_TIMEOUTS, ASSET_STATUS, APPLICATION_TYPE, HOSTING_LOCATION, ASSET_CRITICALITY } from '../constants';
import { BusinessApplicationsPage } from '../pages/assets-page';
import { selectTabDropdown, selectOptionByRole, generateUniqueIdentifier, getTodayDate, getFutureDate } from '../form-helpers';

test.describe('Business Application Form', () => {
  let businessAppPage: BusinessApplicationsPage;

  test.beforeEach(async ({ authenticatedPage }) => {
    businessAppPage = new BusinessApplicationsPage(authenticatedPage);
    await businessAppPage.goto();
  });

  test('should fill complete business application form and submit successfully', async ({ authenticatedPage }) => {
    const uniqueName = generateUniqueIdentifier('Business-App');
    const today = getTodayDate();

    await businessAppPage.openNewForm();

    await authenticatedPage.locator('[role="tab"]:has-text("Basic Info")').first().click();
    await selectOptionByRole(authenticatedPage, 'Application Name', uniqueName);
    await selectOptionByRole(authenticatedPage, 'Description', 'Test business application description for E2E testing');
    await selectTabDropdown(authenticatedPage, 'Application Type', APPLICATION_TYPE.WEB_APPLICATION);
    await selectTabDropdown(authenticatedPage, 'Status', ASSET_STATUS.ACTIVE);

    await authenticatedPage.locator('[role="tab"]:has-text("Technical")').first().click();
    await selectTabDropdown(authenticatedPage, 'Hosting Location', HOSTING_LOCATION.CLOUD);
    await selectOptionByRole(authenticatedPage, 'Technology Stack', 'React, Node.js, PostgreSQL');
    await selectOptionByRole(authenticatedPage, 'URL', 'https://test-app.example.com');
    await authenticatedPage.locator('label:has-text("Deployment Date")').locator('..').locator('input[type="date"]').first().fill(today);
    await authenticatedPage.locator('label:has-text("Last Update Date")').locator('..').locator('input[type="date"]').first().fill(today);
    await authenticatedPage.locator('label:has-text("Processes PII")').first().click();
    await authenticatedPage.locator('label:has-text("Processes Financial Data")').first().click();

    await authenticatedPage.locator('[role="tab"]:has-text("Vendor")').first().click();
    await selectOptionByRole(authenticatedPage, 'Vendor', 'Test Vendor Corp.');
    await selectOptionByRole(authenticatedPage, 'Vendor Contact', 'Jane Smith');
    await selectOptionByRole(authenticatedPage, 'Vendor Email', 'vendor@testcorp.com');
    await selectOptionByRole(authenticatedPage, 'Vendor Phone', '+1-555-0456');

    await authenticatedPage.locator('[role="tab"]:has-text("Compliance")').first().click();

    const ownerSelect = authenticatedPage.locator('label:has-text("Owner")').locator('..').locator('button[role="combobox"]').first();
    await ownerSelect.click();
    await authenticatedPage.waitForSelector('[role="option"]', { timeout: TEST_TIMEOUTS.MEDIUM });
    const ownerOption = authenticatedPage.locator('[role="option"]').first();
    const ownerText = await ownerOption.textContent();
    if (ownerText && !ownerText.toLowerCase().includes('no users available')) {
      await ownerOption.click();
    }

    const buSelect = authenticatedPage.locator('label:has-text("Business Unit")').locator('..').locator('button[role="combobox"]').first();
    await buSelect.click();
    await authenticatedPage.waitForSelector('[role="option"]', { timeout: TEST_TIMEOUTS.MEDIUM });
    const buOption = authenticatedPage.locator('[role="option"]').first();
    const buText = await buOption.textContent();
    if (buText && !buText.toLowerCase().includes('no business units available')) {
      await buOption.click();
    }

    await selectOptionByRole(authenticatedPage, 'Department', 'Engineering');
    await selectOptionByRole(authenticatedPage, 'Notes', 'Test notes for business application');

    const submitButton = authenticatedPage.locator('button[type="submit"]:has-text("Create"), button[type="submit"]:has-text("Save")').first();
    await submitButton.scrollIntoViewIfNeeded();
    await submitButton.click();

    await expect(authenticatedPage.locator('[role="dialog"]')).not.toBeVisible({ timeout: TEST_TIMEOUTS.FORM_SUBMISSION });

    expect(authenticatedPage.url()).toContain('/assets/applications');
    await expect(authenticatedPage.getByText(uniqueName)).toBeVisible({ timeout: TEST_TIMEOUTS.VERIFICATION });
  });

  test('should create business application with minimal required fields', async ({ authenticatedPage }) => {
    const uniqueName = generateUniqueIdentifier('Business-App');

    await businessAppPage.createBusinessApp(uniqueName);

    await expect(authenticatedPage.getByTestId('assets-business-app-list'))
      .toContainText(uniqueName, { timeout: TEST_TIMEOUTS.VERIFICATION });
  });

  test('should validate required fields', async ({ authenticatedPage }) => {
    await businessAppPage.openNewForm();
    const submitButton = authenticatedPage.locator('button[type="submit"]').first();
    await submitButton.click();

    await expect(authenticatedPage.getByText('required')).toBeVisible({ timeout: 5000 });
  });
});