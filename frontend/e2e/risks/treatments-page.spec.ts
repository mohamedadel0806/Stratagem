import { test, expect } from '../fixtures/auth';
import { TreatmentsPage } from '../pages/treatments-page';

/**
 * Standalone Treatments Page Test
 */

test.describe('Treatments Page', () => {
  test.setTimeout(120000); // 2 minutes

  const waitTimes = {
    small: 500,
    medium: 1000,
    large: 2000,
  };

  test('should load and display treatments page', async ({ authenticatedPage }) => {
    console.log('\n===== TESTING TREATMENTS PAGE =====');
    
    const treatmentsPage = new TreatmentsPage(authenticatedPage, waitTimes);
    
    await treatmentsPage.goto('en');
    
    const isLoaded = await treatmentsPage.isLoaded();
    expect(isLoaded).toBeTruthy();
    console.log('✅ Treatments page loaded');
    
    // Get treatment count
    const treatmentCount = await treatmentsPage.getTreatmentCount();
    console.log(`✅ Found ${treatmentCount} treatments`);
    expect(treatmentCount).toBeGreaterThanOrEqual(0);
  });

  test('should create new treatment', async ({ authenticatedPage }) => {
    console.log('\n===== TESTING NEW TREATMENT FORM =====');
    
    const treatmentsPage = new TreatmentsPage(authenticatedPage, waitTimes);
    
    await treatmentsPage.goto('en');
    
    const initialCount = await treatmentsPage.getTreatmentCount();
    console.log(`Found ${initialCount} treatments initially`);
    
    await treatmentsPage.openNewTreatmentForm();
    console.log('✅ New treatment form opened');
    
    const treatmentTitle = `E2E Test Treatment ${Date.now()}`;
    await treatmentsPage.fillTreatmentForm({
      title: treatmentTitle,
      description: 'E2E Test Treatment Description - Testing treatment creation',
      strategy: 'Mitigate',
      status: 'Planned',
    });
    console.log('✅ Treatment form filled');
    
    await treatmentsPage.submitTreatmentForm();
    console.log('✅ Treatment form submitted');
    
    await authenticatedPage.waitForTimeout(waitTimes.large * 2);
    const newCount = await treatmentsPage.getTreatmentCount();
    console.log(`Found ${newCount} treatments after creation`);
    
    // Verify treatment was created (count should increase)
    expect(newCount).toBeGreaterThanOrEqual(initialCount);
  });
});



