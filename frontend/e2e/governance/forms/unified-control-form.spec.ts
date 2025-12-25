import { test } from '../../fixtures/auth';
import { expect } from '@playwright/test';
import { ControlsPage } from '../../pages/controls.page';
import { TEST_STATUS, TEST_CONTROL_TYPE, TEST_SEVERITY, TEST_IMPLEMENTATION_STATUS, TEST_TIMEOUTS } from '../../constants';
import { generateUniqueIdentifier, generateUniqueName } from '../../form-helpers';

test.describe('Unified Control Form', () => {
  test('should fill unified control form and create record', async ({ authenticatedPage }) => {
    const controlTitle = generateUniqueName('Control');
    const controlIdentifier = generateUniqueIdentifier('UCL-TEST');

    const controlsPage = new ControlsPage(authenticatedPage);
    await controlsPage.goto();

    await controlsPage.openCreateForm();
    await controlsPage.fillForm({
      identifier: controlIdentifier,
      title: controlTitle,
      description: 'Test control description for E2E testing',
      status: TEST_STATUS.DRAFT,
      controlType: TEST_CONTROL_TYPE.PREVENTIVE,
      complexity: TEST_SEVERITY.MEDIUM,
      costImpact: TEST_SEVERITY.LOW,
      domain: 'IAM',
      implementationStatus: TEST_IMPLEMENTATION_STATUS.NOT_IMPLEMENTED,
      controlProcedures: 'Test control procedures description',
      testingProcedures: 'Test testing procedures description',
    });
    await controlsPage.submitForm();

    await controlsPage.goto();
    await controlsPage.verifyControlExists(controlTitle);
  });

  test('should validate required fields', async ({ authenticatedPage }) => {
    const controlsPage = new ControlsPage(authenticatedPage);
    await controlsPage.goto();

    await controlsPage.openCreateForm();

    const submitButton = authenticatedPage.getByRole('button', { name: /Create|Save/i }).first();
    await submitButton.click();

    const errorMessages = authenticatedPage.locator('[role="alert"], .text-red-500, .text-destructive');
    const hasErrors = await errorMessages.count() > 0;
    expect(hasErrors, 'Expected validation errors when submitting empty form').toBeTruthy();
  });
});
