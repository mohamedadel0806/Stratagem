import { test, expect } from '../fixtures/auth';
import { RiskDetailsPage } from '../pages/risk-details-page';

/**
 * Risk Details - KRIs Tab Test
 * Tests linking a KRI from the risk details page
 */

test.describe('Risk Details - KRIs Tab', () => {
  test.setTimeout(120000); // 2 minutes

  const RISK_ID = '8546665c-d856-4641-b97f-7e20f1dcbfac';
  const waitTimes = {
    small: 500,
    medium: 1000,
    large: 2000,
    afterSubmit: 3000,
  };

  test('should link a KRI to the risk', async ({ authenticatedPage }) => {
    console.log('\n===== TESTING KRIS TAB =====');
    
    const riskDetailsPage = new RiskDetailsPage(authenticatedPage, waitTimes);
    
    // Navigate to risk details
    await riskDetailsPage.goto(RISK_ID);
    console.log('✅ Navigated to risk details page');
    
    // Ensure no dialogs are open
    await riskDetailsPage.ensureNoDialogOpen();
    
    // Open the KRIs tab and link a KRI
    await riskDetailsPage.openLinkKriDialog();
    console.log('✅ KRI linking dialog opened');
    
    // Check if there are any KRIs available to link
    const kriCheckboxes = authenticatedPage.locator('[role="checkbox"], input[type="checkbox"]');
    const kriCheckboxCount = await kriCheckboxes.count();
    
    if (kriCheckboxCount > 0) {
      // Select the first KRI
      await riskDetailsPage.selectKri(0);
      console.log('✅ First KRI selected');
      
      // Submit the KRI link
      await riskDetailsPage.submitKriLink();
      await riskDetailsPage.ensureDialogClosed();
      console.log('✅ KRI linked successfully');
    } else {
      console.log('⚠️ No KRIs available to link, skipping KRI link submission');
      await riskDetailsPage.closeDialog();
      test.skip();
    }
  });
});



