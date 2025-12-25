import { test } from '../../fixtures/auth';
import { expect } from '@playwright/test';
import { InfluencersPage } from '../../pages/influencers.page';
import { TEST_STATUS, TEST_INFLUENCER_CATEGORY, TEST_TIMEOUTS } from '../../constants';
import { getTodayDate, generateUniqueName } from '../../form-helpers';

test.describe('Influencer Form', () => {
  test('should fill influencer form and create record', async ({ authenticatedPage }) => {
    const influencerName = generateUniqueName('Influencer');
    const today = getTodayDate();

    const influencersPage = new InfluencersPage(authenticatedPage);
    await influencersPage.goto();

    await influencersPage.openCreateForm();
    await influencersPage.fillForm({
      name: influencerName,
      category: TEST_INFLUENCER_CATEGORY.REGULATORY,
      subCategory: 'Cybersecurity',
      referenceNumber: `REF-${Date.now()}`,
      issuingAuthority: 'National Cybersecurity Authority',
      jurisdiction: 'Saudi Arabia',
      description: 'Test influencer description for E2E testing',
      status: TEST_STATUS.ACTIVE,
      applicabilityStatus: 'Applicable',
      publicationDate: today,
      effectiveDate: today,
    });
    await influencersPage.submitForm();

    await influencersPage.goto();
    await influencersPage.verifyInfluencerExists(influencerName);
  });

  test('should validate required fields', async ({ authenticatedPage }) => {
    const influencersPage = new InfluencersPage(authenticatedPage);
    await influencersPage.goto();

    await influencersPage.openCreateForm();

    const submitButton = authenticatedPage.getByRole('button', { name: /Create|Save/i }).first();
    await submitButton.click();

    const errorMessages = authenticatedPage.locator('[role="alert"], .text-red-500, .text-destructive');
    const hasErrors = await errorMessages.count() > 0;
    expect(hasErrors, 'Expected validation errors when submitting empty form').toBeTruthy();
  });
});
