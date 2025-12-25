import { test } from '../fixtures/auth-storage';
import { expect } from '@playwright/test';
import { ControlsPage } from '../pages/controls.page';
import { TEST_STATUS, TEST_CONTROL_TYPE, TEST_SEVERITY, TEST_IMPLEMENTATION_STATUS } from '../constants';
import { generateUniqueIdentifier, generateUniqueName } from '../form-helpers';

test.describe('Control Framework Mapping E2E Tests', () => {
  let controlsPage: ControlsPage;

  test.beforeEach(async ({ authenticatedPage }) => {
    controlsPage = new ControlsPage(authenticatedPage);
    await controlsPage.goto();
  });

  test('should view framework mappings for a control', async ({ authenticatedPage }) => {
    const rowCount = await authenticatedPage.locator('table tbody tr').count();
    expect(rowCount, 'Expected at least one control to view framework mappings').toBeGreaterThan(0);

    await authenticatedPage.locator('table tbody tr').first().click();
    await authenticatedPage.waitForURL(/\/controls\/[^/]+/, { timeout: 10000 });
    await authenticatedPage.waitForLoadState('networkidle');

    const frameworkMappingsTab = authenticatedPage.getByRole('tab', { name: /Framework Mappings/i }).first();
    await expect(frameworkMappingsTab).toBeVisible({ timeout: 10000 });
    await frameworkMappingsTab.click();
  });

  test('should add framework mapping to control', async ({ authenticatedPage }) => {
    await controlsPage.openCreateForm();
    const controlTitle = generateUniqueName('Framework Test Control');
    const controlIdentifier = generateUniqueIdentifier('FMW-CTRL');

    await controlsPage.fillForm({
      identifier: controlIdentifier,
      title: controlTitle,
      description: 'Test control for framework mapping',
      status: TEST_STATUS.ACTIVE,
      controlType: TEST_CONTROL_TYPE.PREVENTIVE,
      complexity: TEST_SEVERITY.MEDIUM,
      costImpact: TEST_SEVERITY.LOW,
      domain: 'IAM',
      implementationStatus: TEST_IMPLEMENTATION_STATUS.NOT_IMPLEMENTED,
      controlProcedures: 'Test procedures',
      testingProcedures: 'Test testing procedures',
    });
    await controlsPage.submitForm();

    await controlsPage.goto();
    await controlsPage.viewControl(controlTitle);

    await authenticatedPage.getByRole('tab', { name: /Framework Mappings/i }).click();
    await authenticatedPage.waitForLoadState('networkidle');

    const addMappingButton = authenticatedPage.getByRole('button', { name: /Add Framework Mapping|Add Mapping/i }).first();
    await expect(addMappingButton).toBeVisible({ timeout: 5000 });

    if (await addMappingButton.isVisible()) {
      await addMappingButton.click();

      const frameworkSelect = authenticatedPage.getByLabel(/Framework/i).or(authenticatedPage.locator('select[name="framework_id"]'));
      await expect(frameworkSelect).toBeVisible({ timeout: 5000 });
      await frameworkSelect.click();
      await authenticatedPage.getByRole('option').first().click();

      const requirementSelect = authenticatedPage.getByLabel(/Requirement/i).or(authenticatedPage.locator('select[name="requirement_id"]'));
      await expect(requirementSelect).toBeVisible({ timeout: 5000 });
      await requirementSelect.click();
      await authenticatedPage.waitForTimeout(500);
      await authenticatedPage.getByRole('option').first().click();

      const coverageLevelSelect = authenticatedPage.getByLabel(/Coverage Level|Coverage/i).or(authenticatedPage.locator('select[name="coverage_level"]'));
      await expect(coverageLevelSelect).toBeVisible({ timeout: 5000 });
      await coverageLevelSelect.click();
      await authenticatedPage.getByRole('option', { name: 'Full' }).click();

      const notesInput = authenticatedPage.getByLabel(/Notes|Mapping Notes/i).or(authenticatedPage.locator('textarea[name="mapping_notes"]'));
      await expect(notesInput).toBeVisible({ timeout: 5000 });
      await notesInput.fill('Test framework mapping note');

      const saveButton = authenticatedPage.getByRole('button', { name: /Save|Add Mapping/i });
      await saveButton.click();
      await authenticatedPage.waitForLoadState('networkidle');

      await expect(authenticatedPage.getByText(/Framework mapping added|Mapping saved/i)).toBeVisible({ timeout: 10000 });
    }
  });

  test('should map control to multiple frameworks', async ({ authenticatedPage }) => {
    await controlsPage.openCreateForm();
    const controlTitle = generateUniqueName('Multi-Framework Control');
    const controlIdentifier = generateUniqueIdentifier('MULTI-FW-CTRL');

    await controlsPage.fillForm({
      identifier: controlIdentifier,
      title: controlTitle,
      description: 'Test control for multiple framework mappings',
      status: TEST_STATUS.ACTIVE,
      controlType: TEST_CONTROL_TYPE.PREVENTIVE,
      complexity: TEST_SEVERITY.MEDIUM,
      costImpact: TEST_SEVERITY.LOW,
      domain: 'IAM',
      implementationStatus: TEST_IMPLEMENTATION_STATUS.NOT_IMPLEMENTED,
    });
    await controlsPage.submitForm();

    await controlsPage.goto();
    await controlsPage.viewControl(controlTitle);
    await authenticatedPage.getByRole('tab', { name: /Framework Mappings/i }).click();

    const frameworks = ['NCA ECC', 'ISO 27001', 'NIST CSF'];

    for (const framework of frameworks) {
      const addMappingButton = authenticatedPage.getByRole('button', { name: /Add Framework Mapping|Add Mapping/i }).first();
      if (await addMappingButton.isVisible()) {
        await addMappingButton.click();

        const frameworkSelect = authenticatedPage.getByLabel(/Framework/i).or(authenticatedPage.locator('select[name="framework_id"]'));
        await frameworkSelect.click();
        await authenticatedPage.waitForTimeout(500);
        await authenticatedPage.getByRole('option', { name: framework }).or(authenticatedPage.getByText(framework)).click();

        const saveButton = authenticatedPage.getByRole('button', { name: /Save/i }).filter({ hasText: /^Save$/ }).first();
        await saveButton.click();
        await authenticatedPage.waitForLoadState('networkidle');
      }
    }

    const mappingCount = await authenticatedPage.locator('[data-testid^="framework-mapping-"]').count();
    expect(mappingCount, 'Expected at least 3 framework mappings').toBeGreaterThanOrEqual(3);
  });

  test('should set different coverage levels', async ({ authenticatedPage }) => {
    const coverageLevels = ['Full', 'Partial', 'Not Applicable'];

    await authenticatedPage.locator('table tbody tr').first().click();
    await authenticatedPage.getByRole('tab', { name: /Framework Mappings/i }).click();

    for (const coverageLevel of coverageLevels) {
      const addMappingButton = authenticatedPage.getByRole('button', { name: /Add Framework Mapping|Add Mapping/i });
      if (await addMappingButton.isVisible()) {
        await addMappingButton.click();

        const coverageLevelSelect = authenticatedPage.getByLabel(/Coverage Level|Coverage/i).or(authenticatedPage.locator('select[name="coverage_level"]'));
        await coverageLevelSelect.click();
        await authenticatedPage.getByRole('option', { name: coverageLevel }).click();

        const saveButton = authenticatedPage.getByRole('button', { name: /Save/i }).filter({ hasText: /^Save$/ }).first();
        await saveButton.click();
        await authenticatedPage.waitForLoadState('networkidle');
      }
    }

    const partialMappings = await authenticatedPage.getByText('Partial').count();
    const fullMappings = await authenticatedPage.getByText('Full').count();
    expect(partialMappings + fullMappings).toBeGreaterThan(0);
  });

  test('should add mapping notes for framework mappings', async ({ authenticatedPage }) => {
    const mappingNotes = 'This control fully satisfies NCA ECC requirement 5-1-2 for multi-factor authentication.';

    await authenticatedPage.locator('table tbody tr').first().click();
    await authenticatedPage.getByRole('tab', { name: /Framework Mappings/i }).click();

    const addMappingButton = authenticatedPage.getByRole('button', { name: /Add Framework Mapping|Add Mapping/i }).first();
    if (await addMappingButton.isVisible()) {
      await addMappingButton.click();

      const notesInput = authenticatedPage.getByLabel(/Notes|Mapping Notes/i).or(authenticatedPage.locator('textarea[name="mapping_notes"]'));
      await notesInput.fill(mappingNotes);

      const saveButton = authenticatedPage.getByRole('button', { name: /Save/i }).filter({ hasText: /^Save$/ }).first();
      await saveButton.click();
      await authenticatedPage.waitForLoadState('networkidle');

      await expect(authenticatedPage.getByText(mappingNotes)).toBeVisible({ timeout: 10000 });
    }
  });

  test('should display coverage matrix', async ({ authenticatedPage }) => {
    await authenticatedPage.locator('table tbody tr').first().click();
    await authenticatedPage.getByRole('tab', { name: /Framework Mappings/i }).click();

    const coverageMatrix = authenticatedPage.locator('[data-testid="coverage-matrix"], [data-testid="framework-matrix"]').first();
    await expect(coverageMatrix).toBeVisible({ timeout: 10000 });
  });

  test('should delete framework mapping', async ({ authenticatedPage }) => {
    await authenticatedPage.locator('table tbody tr').first().click();
    await authenticatedPage.getByRole('tab', { name: /Framework Mappings/i }).click();

    const existingMappings = await authenticatedPage.locator('[data-testid^="framework-mapping-"]').count();
    if (existingMappings > 0) {
      const deleteButton = authenticatedPage.locator('[data-testid^="framework-mapping-"]').first().locator('button[aria-label="Delete"], button[data-testid^="delete-"]');
      await deleteButton.click();

      if (await authenticatedPage.locator('dialog').isVisible({ timeout: 3000 })) {
        await authenticatedPage.getByRole('button', { name: /Confirm|Yes/i }).click();
      }

      await authenticatedPage.waitForLoadState('networkidle');
      await expect(authenticatedPage.getByText(/Mapping deleted|Framework mapping removed/i)).toBeVisible({ timeout: 10000 });
    }
  });

  test('should navigate to framework detail from mapping', async ({ authenticatedPage }) => {
    await authenticatedPage.locator('table tbody tr').first().click();
    await authenticatedPage.getByRole('tab', { name: /Framework Mappings/i }).click();

    const frameworkLink = authenticatedPage.locator('[data-testid^="framework-mapping-"]').first().locator('a[href*="/frameworks"], a[href*="/controls/framework"]');
    const hasLink = await frameworkLink.count() > 0;

    if (hasLink) {
      await frameworkLink.click();
      await authenticatedPage.waitForLoadState('networkidle');
      await expect(authenticatedPage.url()).toMatch(/\/frameworks\//);
    }
  });
});
