import { test, expect } from '../fixtures/auth';
import { RiskDetailsPage } from '../pages/risk-details-page';

/**
 * Risk Details - Treatments Tab Test
 * Tests creating a treatment from the risk details page
 */

test.describe('Risk Details - Treatments Tab', () => {
  test.setTimeout(120000); // 2 minutes

  const RISK_ID = '8546665c-d856-4641-b97f-7e20f1dcbfac';
  const waitTimes = {
    small: 500,
    medium: 1000,
    large: 2000,
    afterSubmit: 3000,
  };

  test('should create a new treatment', async ({ authenticatedPage }) => {
    console.log('\n===== TESTING TREATMENTS TAB =====');
    
    const riskDetailsPage = new RiskDetailsPage(authenticatedPage, waitTimes);
    
    // Navigate to risk details
    await riskDetailsPage.goto(RISK_ID);
    console.log('✅ Navigated to risk details page');
    
    // Ensure no dialogs are open
    await riskDetailsPage.ensureNoDialogOpen();
    
    // Open the Treatments tab and create a new treatment
    await riskDetailsPage.openNewTreatmentForm();
    console.log('✅ Treatment form opened');
    
    // Fill the treatment form
    const treatmentTitle = `E2E Test Treatment ${Date.now()}`;
    await riskDetailsPage.fillTreatmentForm({
      title: treatmentTitle,
      description: 'E2E Test Treatment Description',
      strategy: 'Mitigate',
      status: 'Planned'
    });
    console.log('✅ Treatment form filled');
    
    // Submit the treatment
    await riskDetailsPage.submitTreatmentForm();
    await riskDetailsPage.ensureDialogClosed();
    console.log('✅ Treatment created successfully');
  });
});
