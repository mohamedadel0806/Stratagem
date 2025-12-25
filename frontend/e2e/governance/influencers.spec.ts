import { test } from '../fixtures/auth';
import { expect } from '@playwright/test';
import { InfluencersPage } from '../pages/influencers.page';
import { TEST_STATUS, TEST_INFLUENCER_CATEGORY, TEST_TIMEOUTS } from '../constants';
import { getTodayDate, generateUniqueName } from '../form-helpers';

test.describe('Influencer Registry E2E Tests', () => {
  let influencersPage: InfluencersPage;

  test.beforeEach(async ({ authenticatedPage }) => {
    influencersPage = new InfluencersPage(authenticatedPage);
    await authenticatedPage.goto('/en/dashboard/governance/influencers', { timeout: 15000 });
    await authenticatedPage.waitForLoadState('domcontentloaded', { timeout: 10000 });
    await authenticatedPage.waitForTimeout(2000);
  });

  test('should display influencers list page', async ({ authenticatedPage }) => {
    await expect(authenticatedPage.locator('h1')).toContainText('Influencers', { timeout: TEST_TIMEOUTS.MEDIUM });
    await influencersPage.verifyTableVisible();
    await expect(authenticatedPage.locator('th:has-text("Name")')).toBeVisible();
    await expect(authenticatedPage.locator('th:has-text("Category")')).toBeVisible();
  });

  test('should create a new influencer', async ({ authenticatedPage }) => {
    const influencerName = generateUniqueName('Influencer');
    const today = getTodayDate();

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

  test('should search for influencers', async ({ authenticatedPage }) => {
    await influencersPage.verifyTableVisible();

    await influencersPage.search('test');
    await authenticatedPage.waitForLoadState('networkidle');
    await expect(authenticatedPage.locator('table tbody tr').first()).toBeVisible();
  });

  test('should filter influencers by category', async ({ authenticatedPage }) => {
    await influencersPage.verifyTableVisible();

    await influencersPage.filterByCategory(TEST_INFLUENCER_CATEGORY.REGULATORY);
    await authenticatedPage.waitForLoadState('networkidle');
    await expect(authenticatedPage.locator('table').first()).toBeVisible({ timeout: TEST_TIMEOUTS.SHORT });
  });
});
