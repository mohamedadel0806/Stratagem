import { test, expect } from '../fixtures/auth';
import { RiskCategoriesPage } from '../pages/risk-categories-page';

/**
 * Risk Categories Page Test
 */

test.describe('Risk Categories Page', () => {
  test.setTimeout(120000); // 2 minutes

  const waitTimes = {
    small: 500,
    medium: 1000,
    large: 2000,
  };

  test('should load and display risk categories page', async ({ authenticatedPage }) => {
    console.log('\n===== TESTING RISK CATEGORIES PAGE =====');
    
    const categoriesPage = new RiskCategoriesPage(authenticatedPage, waitTimes);
    
    await categoriesPage.goto('en');
    
    const isLoaded = await categoriesPage.isLoaded();
    expect(isLoaded).toBeTruthy();
    console.log('✅ Risk categories page loaded');
  });

  test('should search categories', async ({ authenticatedPage }) => {
    console.log('\n===== TESTING SEARCH FUNCTIONALITY =====');
    
    const categoriesPage = new RiskCategoriesPage(authenticatedPage, waitTimes);
    
    await categoriesPage.goto('en');
    
    await categoriesPage.search('test');
    await authenticatedPage.waitForTimeout(waitTimes.medium);
    console.log('✅ Search functionality tested');
  });

  test('should open new category form', async ({ authenticatedPage }) => {
    console.log('\n===== TESTING NEW CATEGORY FORM =====');
    
    const categoriesPage = new RiskCategoriesPage(authenticatedPage, waitTimes);
    
    await categoriesPage.goto('en');
    
    await categoriesPage.openNewCategoryForm();
    console.log('✅ New category form opened');
    
    // Close it
    await authenticatedPage.keyboard.press('Escape');
    await authenticatedPage.waitForTimeout(waitTimes.medium);
  });
});



