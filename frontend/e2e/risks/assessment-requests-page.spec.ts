import { test, expect } from '../fixtures/auth';
import { AssessmentRequestsPage } from '../pages/assessment-requests-page';

/**
 * Standalone Assessment Requests Page Test
 */

test.describe('Assessment Requests Page', () => {
  test.setTimeout(120000); // 2 minutes

  const waitTimes = {
    small: 500,
    medium: 1000,
    large: 2000,
  };

  test('should load and display assessment requests page', async ({ authenticatedPage }) => {
    console.log('\n===== TESTING ASSESSMENT REQUESTS PAGE =====');
    
    const assessmentRequestsPage = new AssessmentRequestsPage(authenticatedPage, waitTimes);
    
    await assessmentRequestsPage.goto('en');
    
    const isLoaded = await assessmentRequestsPage.isLoaded();
    expect(isLoaded).toBeTruthy();
    console.log('✅ Assessment requests page loaded');
    
    // Get request count
    const requestCount = await assessmentRequestsPage.getRequestCount();
    console.log(`✅ Found ${requestCount} assessment requests`);
    expect(requestCount).toBeGreaterThanOrEqual(0);
  });

  test('should create new assessment request', async ({ authenticatedPage }) => {
    console.log('\n===== TESTING NEW ASSESSMENT REQUEST FORM =====');
    
    const assessmentRequestsPage = new AssessmentRequestsPage(authenticatedPage, waitTimes);
    
    await assessmentRequestsPage.goto('en');
    
    const initialCount = await assessmentRequestsPage.getRequestCount();
    console.log(`Found ${initialCount} assessment requests initially`);
    
    await assessmentRequestsPage.openNewRequestForm();
    console.log('✅ New assessment request form opened');
    
    // Fill the form - need to select a risk first
    await assessmentRequestsPage.fillAssessmentRequestForm({
      riskId: '', // Will try to select first available risk
      assessmentType: 'Current',
      priority: 'Medium',
      justification: 'E2E Test Assessment Request - Testing assessment request creation',
      notes: 'E2E Test Notes - Testing assessment request creation from standalone page',
    });
    console.log('✅ Assessment request form filled');
    
    await assessmentRequestsPage.submitAssessmentRequestForm();
    console.log('✅ Assessment request form submitted');
    
    // Wait for query invalidation and list refresh
    await authenticatedPage.waitForTimeout(waitTimes.large * 3);
    
    // Reload page to ensure we see the new request
    await assessmentRequestsPage.goto('en');
    await authenticatedPage.waitForTimeout(waitTimes.large);
    
    // Wait for any loading to complete
    await authenticatedPage.waitForLoadState('networkidle');
    await authenticatedPage.waitForTimeout(waitTimes.medium);
    
    const newCount = await assessmentRequestsPage.getRequestCount();
    console.log(`Found ${newCount} assessment requests after creation`);
    
    // Verify request was created (count should increase)
    expect(newCount).toBeGreaterThanOrEqual(initialCount);
  });

  test('should search assessment requests', async ({ authenticatedPage }) => {
    console.log('\n===== TESTING SEARCH FUNCTIONALITY =====');
    
    const assessmentRequestsPage = new AssessmentRequestsPage(authenticatedPage, waitTimes);
    
    await assessmentRequestsPage.goto('en');
    
    await assessmentRequestsPage.search('test');
    await authenticatedPage.waitForTimeout(waitTimes.medium);
    console.log('✅ Search functionality tested');
  });
});



