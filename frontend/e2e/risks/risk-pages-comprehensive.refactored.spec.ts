import { test, expect } from '../fixtures/auth';
import { RiskRegisterPage } from '../pages/risk-register-page.refactored';
import { RiskDetailsPage } from '../pages/risk-details-page';
import { TestDataHelper, RiskData, TreatmentData, AssessmentRequestData } from '../helpers/test-data-helper';
import { WAIT_CONSTANTS } from '../helpers/test-waiter';

test.describe('Risk Pages - Comprehensive Test Suite', () => {
  const waitTimes = {
    small: 500,
    medium: 1000,
    large: 2000,
    afterSubmit: 1500,
  };

  test.describe('Risk Management Core Flow', () => {
    test.setTimeout(120000);

    test('should create and verify new risk', async ({ authenticatedPage, baseURL }) => {
      console.log('\n===== TESTING RISK CREATION =====');

      const testDataHelper = new TestDataHelper(authenticatedPage, baseURL || 'http://localhost:3000');
      const riskRegisterPage = new RiskRegisterPage(authenticatedPage, baseURL || 'http://localhost:3000');

      const riskTitle = `E2E Test Risk ${Date.now()}`;
      const riskDescription = 'E2E Test Risk Description - Testing risk creation functionality';

      console.log('Opening new risk form...');
      await riskRegisterPage.goto();
      await riskRegisterPage.openNewRiskForm();
      console.log('✅ New risk form opened');

      await riskRegisterPage.fillNewRiskForm({
        title: riskTitle,
        description: riskDescription,
      });
      console.log('✅ Risk form filled');

      await riskRegisterPage.submitNewRiskForm();
      console.log('✅ New risk created successfully');

      await authenticatedPage.waitForTimeout(waitTimes.large * 2);

      await riskRegisterPage.goto();
      await authenticatedPage.waitForTimeout(waitTimes.medium);

      const newRiskCount = await riskRegisterPage.getRiskCardCount();
      console.log(`Risk count after creation: ${newRiskCount}`);

      const riskCards = authenticatedPage.locator('[data-testid^="risk-register-card-"]');
      const riskCardCount = await riskCards.count();
      let foundNewRisk = false;
      let createdRiskId: string | null = null;

      for (let i = 0; i < riskCardCount; i++) {
        const card = riskCards.nth(i);
        const cardText = await card.textContent();
        if (cardText?.includes(riskTitle)) {
          foundNewRisk = true;
          const testId = await card.getAttribute('data-testid');
          createdRiskId = testId?.replace('risk-register-card-', '') || null;
          await riskRegisterPage.clickRiskCard(i);
          break;
        }
      }

      expect(foundNewRisk).toBeTruthy();
      console.log(`✅ Risk created and found: ${createdRiskId}`);

      if (foundNewRisk && createdRiskId) {
        const currentUrl = authenticatedPage.url();
        expect(currentUrl).toContain('/risks/');
        console.log(`✅ Successfully navigated to risk details page`);

        await testDataHelper.cleanupTestRisk(createdRiskId);
      }
    });

    test('should manage treatments on risk details page', async ({ authenticatedPage, baseURL }) => {
      console.log('\n===== TESTING RISK TREATMENTS =====');

      const testDataHelper = new TestDataHelper(authenticatedPage, baseURL || 'http://localhost:3000');
      const riskDetailsPage = new RiskDetailsPage(authenticatedPage, waitTimes);

      const riskId = await testDataHelper.createTestRisk({
        title: `E2E Test Risk for Treatment ${Date.now()}`,
        description: 'Test risk for treatment testing'
      });

      console.log(`Created test risk: ${riskId}`);

      await riskDetailsPage.goto(riskId);

      const riskTitle = await authenticatedPage.getByRole('heading', { level: 1 })
        .or(authenticatedPage.getByRole('heading', { level: 2 })).first().textContent();
      console.log(`Risk details page loaded. Risk: "${riskTitle?.substring(0, 50)}..."`);

      console.log('Creating new treatment...');
      await riskDetailsPage.openNewTreatmentForm();
      console.log('✅ Treatment form opened');

      const treatmentTitle = `E2E Test Treatment ${Date.now()}`;
      await riskDetailsPage.fillTreatmentForm({
        title: treatmentTitle,
        description: 'E2E Test Treatment Description - Testing treatment creation',
        strategy: 'Mitigate',
        status: 'Planned'
      });
      console.log('✅ Treatment form filled');

      await riskDetailsPage.submitTreatmentForm();
      await riskDetailsPage.ensureDialogClosed();
      console.log('✅ Treatment created successfully');

      await authenticatedPage.waitForTimeout(waitTimes.medium);

      const treatmentElements = authenticatedPage.locator('[data-testid^="treatment-"]');
      const treatmentCount = await treatmentElements.count();
      expect(treatmentCount).toBeGreaterThan(0);
      console.log(`✅ Found ${treatmentCount} treatments on the risk details page`);

      await testDataHelper.cleanupTestRisk(riskId);
    });

    test('should create assessment requests', async ({ authenticatedPage, baseURL }) => {
      console.log('\n===== TESTING ASSESSMENT REQUESTS =====');

      const testDataHelper = new TestDataHelper(authenticatedPage, baseURL || 'http://localhost:3000');
      const riskDetailsPage = new RiskDetailsPage(authenticatedPage, waitTimes);

      const riskId = await testDataHelper.createTestRisk({
        title: `E2E Test Risk for Assessment ${Date.now()}`,
        description: 'Test risk for assessment request testing'
      });

      console.log(`Created test risk: ${riskId}`);

      await riskDetailsPage.goto(riskId);

      console.log('Creating assessment request...');
      await riskDetailsPage.openRequestAssessmentForm();
      console.log('✅ Assessment request form opened');

      await riskDetailsPage.fillAssessmentRequestForm({
        notes: 'E2E Test Assessment Request - Created by comprehensive test'
      });
      console.log('✅ Assessment request form filled');

      await riskDetailsPage.submitAssessmentRequestForm();
      await riskDetailsPage.ensureDialogClosed();
      console.log('✅ Assessment request submitted successfully');

      await authenticatedPage.waitForTimeout(waitTimes.medium);

      await testDataHelper.cleanupTestRisk(riskId);
    });
  });

  test.describe('Standalone Risk Pages', () => {
    test('should test standalone treatments page', async ({ authenticatedPage }) => {
      console.log('\n===== TESTING STANDALONE TREATMENTS PAGE =====');

      const baseURL = 'http://localhost:3000';
      const testDataHelper = new TestDataHelper(authenticatedPage, baseURL);
      const riskId = await testDataHelper.createTestRisk({
        title: `E2E Test Risk for Standalone Treatment ${Date.now()}`,
        description: 'Test risk for standalone treatment page testing'
      });

      const treatmentId = await testDataHelper.createTestTreatment(riskId, {
        title: `E2E Test Treatment ${Date.now()}`,
        description: 'Test treatment for standalone page testing',
        strategy: 'Mitigate',
        status: 'Planned'
      });

      console.log(`Created test risk and treatment: ${riskId}, ${treatmentId}`);

      await authenticatedPage.goto(`${baseURL}/en/dashboard/risks/treatments`, {
        waitUntil: 'domcontentloaded'
      });
      await authenticatedPage.waitForLoadState('domcontentloaded');
      await authenticatedPage.waitForTimeout(waitTimes.medium);

      const titleLocator = authenticatedPage.getByText(treatmentId).or(
        authenticatedPage.getByRole('heading', { name: /treatment/i })
      );
      await titleLocator.waitFor({ state: 'visible', timeout: 10000 });
      console.log('✅ Treatments page loaded');

      await testDataHelper.cleanupTestTreatment(treatmentId);
      await testDataHelper.cleanupTestRisk(riskId);
    });

    test('should test standalone KRIs page', async ({ authenticatedPage }) => {
      console.log('\n===== TESTING STANDALONE KRIS PAGE =====');

      const baseURL = 'http://localhost:3000';
      const testDataHelper = new TestDataHelper(authenticatedPage, baseURL);

      const kriId = await testDataHelper.createTestKRI({
        name: `E2E Test KRI ${Date.now()}`,
        description: 'Test KRI for standalone page testing',
        measurement_frequency: 'Monthly'
      });

      console.log(`Created test KRI: ${kriId}`);

      await authenticatedPage.goto(`${baseURL}/en/dashboard/risks/kris`, {
        waitUntil: 'domcontentloaded'
      });
      await authenticatedPage.waitForLoadState('domcontentloaded');
      await authenticatedPage.waitForTimeout(waitTimes.medium);

      const titleLocator = authenticatedPage.getByRole('heading', { name: /key risk indicator|kris/i });
      await titleLocator.waitFor({ state: 'visible', timeout: 10000 });
      console.log('✅ KRIs page loaded');

      await testDataHelper.cleanupTestKRI(kriId);
    });

    test('should test standalone assessment requests page', async ({ authenticatedPage }) => {
      console.log('\n===== TESTING STANDALONE ASSESSMENT REQUESTS PAGE =====');

      const baseURL = 'http://localhost:3000';
      const testDataHelper = new TestDataHelper(authenticatedPage, baseURL);

      const riskId = await testDataHelper.createTestRisk({
        title: `E2E Test Risk for Standalone Assessment ${Date.now()}`,
        description: 'Test risk for standalone assessment page testing'
      });

      const requestId = await testDataHelper.createTestAssessmentRequest(riskId, {
        notes: 'Test assessment request for standalone page testing'
      });

      console.log(`Created test risk and assessment request: ${riskId}, ${requestId}`);

      await authenticatedPage.goto(`${baseURL}/en/dashboard/risks/assessment-requests`, {
        waitUntil: 'domcontentloaded'
      });
      await authenticatedPage.waitForLoadState('domcontentloaded');
      await authenticatedPage.waitForTimeout(waitTimes.medium);

      const titleLocator = authenticatedPage.getByRole('heading', { name: /assessment request/i });
      await titleLocator.waitFor({ state: 'visible', timeout: 10000 });
      console.log('✅ Assessment requests page loaded');

      await testDataHelper.cleanupTestRisk(riskId);
    });
  });
});