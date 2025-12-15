import { test, expect } from '../../fixtures/auth';

/**
 * KRIs Tab Exploration
 * Check what buttons and content are actually in the KRIs tab
 */

test('should explore KRIs tab content', async ({ authenticatedPage }) => {
  const riskId = '95d8a18a-1e1c-44ed-9eaa-25dfadac75b5';

  console.log('=== KRIS TAB EXPLORATION ===');

  await authenticatedPage.goto(`/en/dashboard/risks/${riskId}`, { waitUntil: 'domcontentloaded' });
  await authenticatedPage.waitForTimeout(2000);

  // Navigate to KRIs tab
  await authenticatedPage.locator('[role="tab"]:has-text("KRIs")').first().click();
  await authenticatedPage.waitForTimeout(2000);

  console.log('✅ Navigated to KRIs tab');

  // Take screenshot
  await authenticatedPage.screenshot({ path: 'test-results/kris-exploration/kris-tab-overview.png', fullPage: true });

  // Look for all buttons in KRIs tab
  const allButtons = authenticatedPage.locator('button');
  const buttonCount = await allButtons.count();
  console.log(`Found ${buttonCount} buttons in KRIs tab:`);

  for (let i = 0; i < buttonCount; i++) {
    const buttonText = await allButtons.nth(i).textContent();
    const buttonVisible = await allButtons.nth(i).isVisible();
    if (buttonText && buttonVisible) {
      console.log(`  Button ${i + 1}: "${buttonText.trim()}"`);
    }
  }

  // Look for specific KRIs-related buttons
  const kriButtons = [
    'Link KRI',
    'Add KRI',
    'New KRI',
    'Create KRI',
    'Link KRI(s)',
    'Add Metric'
  ];

  console.log('\n🔍 Looking for KRIs-related buttons:');
  for (const buttonText of kriButtons) {
    const button = authenticatedPage.locator('button').filter({ hasText: new RegExp(buttonText, 'i') }).first();
    const buttonVisible = await button.isVisible({ timeout: 2000 }).catch(() => false);

    if (buttonVisible) {
      console.log(`✅ Found: "${buttonText}"`);
    } else {
      console.log(`❌ Not found: "${buttonText}"`);
    }
  }

  // Look for any cards or content
  const cards = authenticatedPage.locator('.card, .item, .entry, [data-testid*="kri"], .kri-item').count();
  console.log(`\n📊 Found ${cards} KRIs cards/items`);

  // Look for text content
  const textContent = await authenticatedPage.locator('body').textContent();
  if (textContent.includes('No KRIs') || textContent.includes('No KRIs found')) {
    console.log('📝 Page shows "No KRIs" message');
  }

  console.log('=== KRIS EXPLORATION COMPLETE ===');
});