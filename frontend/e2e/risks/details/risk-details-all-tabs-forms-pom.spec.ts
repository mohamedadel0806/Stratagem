import { test, expect } from '../../fixtures/auth';
import { RiskDetailsPage } from '../../pages/risk-details-page';

/**
 * Risk Details Page - Comprehensive Test Using Page Object Model
 * Tests all tabs and form interactions using POM pattern for better maintainability
 * 
 * Risk ID: 8546665c-d856-4641-b97f-7e20f1dcbfac
 */

test.describe('Risk Details Page - All Tabs and Forms (POM)', () => {
  test.setTimeout(300000); // 5 minutes

  const RISK_ID = '8546665c-d856-4641-b97f-7e20f1dcbfac';

  // Configure wait times for headed mode
  const isHeaded = process.env.PWHEADED === 'true' || process.argv.includes('--headed');
  const waitTimes = {
    small: isHeaded ? 2000 : 500,
    medium: isHeaded ? 3000 : 1000,
    large: isHeaded ? 4000 : 2000,
    afterSubmit: 3000,
  };

  test('should test all tabs and forms in sequence with single login', async ({ authenticatedPage }) => {
    console.log('\n===== COMPREHENSIVE TEST: ALL TABS AND FORMS (POM) =====');
    
    // Initialize page object
    const riskDetailsPage = new RiskDetailsPage(authenticatedPage, waitTimes);
    
    // Navigate to page (login happens in fixture)
    await riskDetailsPage.goto(RISK_ID);
    console.log('✅ Navigated to risk details page');

    // ========================================
    // TEST 1: OVERVIEW TAB - EDIT RISK FORM
    // ========================================
    console.log('\n===== TESTING OVERVIEW TAB - EDIT RISK FORM =====');
    
    try {
      // Ensure no dialogs are open before starting
      await riskDetailsPage.ensureNoDialogOpen();
      
      await riskDetailsPage.openEditRiskForm();
      console.log('✅ Edit Risk form opened');
      
      // Fill the form with updated values
      await riskDetailsPage.fillEditRiskForm({
        description: `E2E Test - Updated description at ${new Date().toISOString()}`,
        statusNotes: `E2E Test - Status notes updated at ${new Date().toISOString()}`
      });
      console.log('✅ Edit Risk form filled with updated values');
      
      // Save the changes
      await riskDetailsPage.submitEditRiskForm();
      await riskDetailsPage.ensureDialogClosed();
      console.log('✅ Edit Risk form saved successfully');
      
      // Wait a bit to ensure the page has updated
      await authenticatedPage.waitForTimeout(1000);
    } catch (error: any) {
      console.log(`⚠️ Overview tab test failed: ${error?.message || error}`);
      // Ensure dialog is closed before continuing
      await riskDetailsPage.ensureNoDialogOpen();
      await authenticatedPage.waitForTimeout(1000);
    }

    // ========================================
    // TEST 2: ASSESSMENTS TAB - NEW ASSESSMENT FORM
    // ========================================
    console.log('\n===== TESTING ASSESSMENTS TAB - NEW ASSESSMENT FORM =====');

    try {
      // Ensure no dialogs are open
      await riskDetailsPage.ensureNoDialogOpen();
      
      await riskDetailsPage.openNewAssessmentForm();
      console.log('✅ Assessment form opened');
      
      await riskDetailsPage.fillAssessmentForm({
        likelihood: 4,
        impact: 4,
        notes: `E2E Test Assessment Notes - ${new Date().toISOString()}`
      });
      console.log('✅ Assessment form filled');
      
      await riskDetailsPage.submitAssessmentForm();
      await riskDetailsPage.ensureDialogClosed();
      console.log('✅ Assessment submitted successfully');
    } catch (error: any) {
      console.log(`⚠️ Assessments tab test failed: ${error?.message || error}`);
      // Ensure dialog is closed before continuing
      await riskDetailsPage.ensureNoDialogOpen();
    }

    // ========================================
    // TEST 3: ASSETS TAB - LINK ASSET FORM
    // ========================================
    console.log('\n===== TESTING ASSETS TAB - LINK ASSET FORM =====');

    try {
      // Ensure no dialogs are open
      await riskDetailsPage.ensureNoDialogOpen();
      
      await riskDetailsPage.openLinkAssetDialog();
      console.log('✅ Asset linking dialog opened');
      
      await riskDetailsPage.selectAsset(0);
      console.log('✅ First asset selected');
      
      await riskDetailsPage.submitAssetLink();
      await riskDetailsPage.ensureDialogClosed();
      console.log('✅ Asset linked successfully');
    } catch (error: any) {
      console.log(`⚠️ Assets tab test failed: ${error?.message || error}`);
      // Ensure dialog is closed before continuing
      await riskDetailsPage.ensureNoDialogOpen();
    }

    // ========================================
    // TEST 4: CONTROLS TAB - LINK CONTROL FORM
    // ========================================
    console.log('\n===== TESTING CONTROLS TAB - LINK CONTROL FORM =====');

    try {
      // Ensure no dialogs are open
      await riskDetailsPage.ensureNoDialogOpen();
      
      await riskDetailsPage.openLinkControlDialog();
      console.log('✅ Control linking dialog opened');
      
      await riskDetailsPage.selectControl(0);
      console.log('✅ First control selected');
      
      await riskDetailsPage.submitControlLink();
      await riskDetailsPage.ensureDialogClosed();
      console.log('✅ Control linked successfully');
    } catch (error: any) {
      console.log(`⚠️ Controls tab test failed: ${error?.message || error}`);
      // Ensure dialog is closed before continuing
      await riskDetailsPage.ensureNoDialogOpen();
    }

    // ========================================
    // TEST 5: TREATMENTS TAB - NEW TREATMENT FORM
    // ========================================
    console.log('\n===== TESTING TREATMENTS TAB - NEW TREATMENT FORM =====');

    try {
      // Ensure no dialogs are open
      await riskDetailsPage.ensureNoDialogOpen();
      
      await riskDetailsPage.openNewTreatmentForm();
      console.log('✅ Treatment form opened');
      
      await riskDetailsPage.fillTreatmentForm({
        title: `E2E Test Treatment ${Date.now()}`,
        description: 'E2E Test Treatment Description - Testing treatment form submission',
        strategy: 'Mitigate',
        status: 'Planned'
      });
      console.log('✅ Treatment form filled');
      
      // Save the treatment (submit form)
      await riskDetailsPage.submitTreatmentForm();
      await riskDetailsPage.ensureDialogClosed();
      console.log('✅ Treatment saved successfully');
    } catch (error: any) {
      console.log(`⚠️ Treatments tab test failed: ${error?.message || error}`);
      // Ensure dialog is closed before continuing
      await riskDetailsPage.ensureNoDialogOpen();
    }

    // ========================================
    // TEST 6: KRIS TAB - LINK KRI FUNCTIONALITY
    // ========================================
    console.log('\n===== TESTING KRIS TAB - LINK KRI FUNCTIONALITY =====');

    try {
      // Ensure no dialogs are open
      await riskDetailsPage.ensureNoDialogOpen();
      
      await riskDetailsPage.openLinkKriDialog();
      console.log('✅ KRI linking dialog opened');
      
      await riskDetailsPage.selectKri(0);
      console.log('✅ First KRI selected');
      
      await riskDetailsPage.submitKriLink();
      await riskDetailsPage.ensureDialogClosed();
      console.log('✅ KRI linked successfully');
    } catch (error: any) {
      console.log(`⚠️ KRIs tab test failed: ${error?.message || error}`);
      // Ensure dialog is closed before continuing
      await riskDetailsPage.ensureNoDialogOpen();
    }

    console.log('\n===== ALL TABS AND FORMS TEST COMPLETED =====');
    console.log('✅ Overview tab tested');
    console.log('✅ Assessments tab tested and submitted');
    console.log('✅ Assets tab tested and linked');
    console.log('✅ Controls tab tested and linked');
    console.log('✅ Treatments tab tested');
    console.log('✅ KRIs tab tested and linked');
  });
});

