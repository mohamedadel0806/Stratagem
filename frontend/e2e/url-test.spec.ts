import { test, expect } from '@playwright/test';

test('test different URL approaches', async ({ page }) => {
  console.log('🔍 Testing URL approaches...');

  const urls = [
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    'http://localhost:3000/en/login',
    'http://127.0.0.1:3000/en/login',
  ];

  let workingUrl = '';

  for (const url of urls) {
    try {
      console.log(`📍 Trying: ${url}`);
      const response = await page.goto(url, { timeout: 5000, waitUntil: 'domcontentloaded' });

      if (response && response.status() === 200) {
        console.log(`✅ Success: ${url}`);
        workingUrl = url;
        break;
      }
    } catch (error) {
      console.log(`❌ Failed: ${url} - ${error.message}`);
    }
  }

  if (!workingUrl) {
    console.log('🚨 No URLs worked! Checking network...');

    // Try to check if server is running
    try {
      const response = await fetch('http://localhost:3000/api/health');
      console.log('Health check response:', response.status);
    } catch (error) {
      console.log('Health check failed:', error.message);
    }

    throw new Error('Could not connect to any URL');
  }

  // Take screenshot of working page
  await page.screenshot({ path: 'test-results/url-test-working.png' });

  console.log(`🎉 Working URL: ${workingUrl}`);
  console.log(`Current URL: ${page.url()}`);

  // Check if we can see login form
  const loginForm = page.locator('form').first();
  const hasForm = await loginForm.isVisible().catch(() => false);
  console.log(`📋 Has login form: ${hasForm}`);

  // Check page content
  const pageTitle = await page.title();
  console.log(`📄 Page title: ${pageTitle}`);

  const bodyText = await page.locator('body').textContent();
  console.log(`📝 Body content length: ${bodyText?.length || 0}`);
});