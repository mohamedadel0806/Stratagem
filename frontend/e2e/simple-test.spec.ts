import { test, expect } from './fixtures/auth';

test('simple connection test', async ({ authenticatedPage }) => {
  console.log('Starting simple test...');
  console.log('Current URL:', authenticatedPage.url());

  // Try to navigate to the base URL
  await authenticatedPage.goto('/');
  await authenticatedPage.waitForLoadState('networkidle');

  console.log('After navigation URL:', authenticatedPage.url());

  // Take a screenshot to see what's on the page
  await authenticatedPage.screenshot({ path: 'test-results/simple-test.png', fullPage: true });

  // Check if we can see anything on the page
  const bodyText = await authenticatedPage.locator('body').textContent();
  console.log('Page content length:', bodyText?.length || 0);

  // Basic checks
  await expect(authenticatedPage.locator('body')).toBeVisible();
});