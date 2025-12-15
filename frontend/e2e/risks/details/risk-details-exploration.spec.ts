import { test, expect } from '@playwright/test';

/**
 * Risk Details Page Exploration Test
 * This test will help identify all tabs, buttons, and forms on the risk details page
 */

test('explore risk details page structure', async ({ page }) => {
  // Set up authentication first
  const baseURL = 'http://localhost:3000';

  // Login
  await page.goto(`${baseURL}/en/login`);
  await page.fill('#email', 'admin@grcplatform.com');
  await page.fill('#password', 'password123');
  await page.click('button:has-text("Sign In")');

  // Wait for navigation
  await page.waitForURL(/\/dashboard/);
  await page.waitForTimeout(2000);

  // Navigate to specific risk details page
  const riskId = '95d8a18a-1e1c-44ed-9eaa-25dfadac75b5';
  await page.goto(`${baseURL}/en/dashboard/risks/${riskId}`);
  await page.waitForLoadState('domcontentloaded');
  await page.waitForTimeout(3000);

  // Take screenshot of the page
  await page.screenshot({ path: 'test-results/risk-details-page-full.png', fullPage: true });

  console.log('=== RISK DETAILS PAGE EXPLORATION ===');

  // Find all tabs
  const tabs = page.locator('[role="tab"], .tab, button[role="tab"]');
  const tabCount = await tabs.count();
  console.log(`Found ${tabCount} tabs:`);

  for (let i = 0; i < tabCount; i++) {
    const tabText = await tabs.nth(i).textContent();
    const tabVisible = await tabs.nth(i).isVisible();
    console.log(`  ${i + 1}. "${tabText?.trim()}" - Visible: ${tabVisible}`);
  }

  // Find all buttons
  const buttons = page.locator('button');
  const buttonCount = await buttons.count();
  console.log(`\nFound ${buttonCount} buttons:`);

  for (let i = 0; i < buttonCount; i++) {
    const buttonText = await buttons.nth(i).textContent();
    const buttonVisible = await buttons.nth(i).isVisible();
    if (buttonText && buttonVisible) {
      console.log(`  ${i + 1}. "${buttonText?.trim()}"`);
    }
  }

  // Look for specific action buttons
  const actionButtons = page.locator('button').filter({ hasText: /New|Create|Edit|Delete|Update|Add|View|Manage/ });
  const actionButtonCount = await actionButtons.count();
  console.log(`\nFound ${actionButtonCount} action buttons:`);

  for (let i = 0; i < actionButtonCount; i++) {
    const buttonText = await actionButtons.nth(i).textContent();
    const buttonVisible = await actionButtons.nth(i).isVisible();
    if (buttonText && buttonVisible) {
      console.log(`  ${i + 1}. "${buttonText?.trim()}"`);
    }
  }

  // Look for form elements
  const forms = page.locator('form, [role="dialog"], .modal, .dialog');
  const formCount = await forms.count();
  console.log(`\nFound ${formCount} form elements:`);

  // Check for specific common risk management sections
  const sections = [
    'Overview', 'Details', 'Treatments', 'Controls', 'Assessments',
    'Evidence', 'History', 'Attachments', 'Comments', 'Risk Score',
    'Risk Assessment', 'Mitigation', 'Monitoring'
  ];

  console.log('\nChecking for specific sections:');
  for (const section of sections) {
    const sectionElement = page.locator(`text=${section}, h1:has-text("${section}"), h2:has-text("${section}"), h3:has-text("${section}")`).first();
    const sectionExists = await sectionElement.isVisible().catch(() => false);
    if (sectionExists) {
      console.log(`  ✅ Found section: ${section}`);
    }
  }

  // Check for navigation elements
  const navigation = page.locator('.nav, .navigation, nav');
  const hasNavigation = await navigation.count() > 0;
  if (hasNavigation) {
    console.log(`  ✅ Navigation elements found`);
  }

  console.log('\n=== EXPLORATION COMPLETE ===');
});