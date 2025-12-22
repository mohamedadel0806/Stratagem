/**
 * Quick analysis of the physical assets page structure
 */
import { test } from '../fixtures/auth-fixed';

test('analyze physical assets page structure', async ({ authenticatedPage }) => {
  console.log('🔍 Analyzing physical assets page structure...');

  // Navigate to physical assets page
  await authenticatedPage.goto('http://localhost:3000/en/dashboard/assets/physical');
  await authenticatedPage.waitForLoadState('networkidle');
  await authenticatedPage.waitForTimeout(5000);

  // Take full page screenshot
  await authenticatedPage.screenshot({
    path: 'test-results/physical-assets-page-analysis.png',
    fullPage: true
  });

  // Get page title
  const title = await authenticatedPage.title();
  console.log(`Page title: ${title}`);

  // Get current URL
  const url = authenticatedPage.url();
  console.log(`Current URL: ${url}`);

  // Look for add/create buttons with more specific selectors
  const addButtonSelectors = [
    'button:has-text("Add")',
    'button:has-text("Create")',
    'button:has-text("New")',
    'button:has-text("Add Asset")',
    'button:has-text("Create Asset")',
    'button[aria-label*="Add"]',
    'button[aria-label*="Create"]',
    '.add-button',
    '.create-button',
    '[data-testid*="add"]',
    '[data-testid*="create"]',
    'button svg', // Look for buttons with icons (like +)
    'a:has-text("Add")',
    'a:has-text("Create")',
    '.fab', // Floating action buttons
    '.btn-primary'
  ];

  console.log('\n🔍 Looking for add/create buttons...');
  let addButtonsFound = [];

  for (const selector of addButtonSelectors) {
    try {
      const buttons = await authenticatedPage.locator(selector).all();
      for (const button of buttons) {
        const isVisible = await button.isVisible();
        if (isVisible) {
          const text = await button.textContent();
          const ariaLabel = await button.getAttribute('aria-label');

          addButtonsFound.push({
            selector,
            text: text?.trim() || '',
            ariaLabel: ariaLabel || '',
            isVisible
          });
        }
      }
    } catch (e) {
      // Continue
    }
  }

  console.log(`Found ${addButtonsFound.length} potential add/create buttons:`);
  addButtonsFound.forEach((btn, index) => {
    console.log(`  Button ${index}: "${btn.text}" (aria-label: "${btn.ariaLabel}") - ${btn.selector}`);
  });

  // Look for any cards or empty state messages
  const emptyStateSelectors = [
    'text:has-text("No assets")',
    'text:has-text("No data")',
    'text:has-text("empty")',
    'text:has-text("Add your first")',
    'text:has-text("Get started")',
    '.empty-state',
    '.no-data',
    '[data-testid="empty-state"]',
    '[data-testid="no-data"]'
  ];

  console.log('\n🔍 Looking for empty state messages...');
  let emptyStatesFound = [];

  for (const selector of emptyStateSelectors) {
    try {
      const elements = await authenticatedPage.locator(selector).all();
      for (const element of elements) {
        const isVisible = await element.isVisible();
        if (isVisible) {
          const text = await element.textContent();
          emptyStatesFound.push({
            selector,
            text: text?.trim() || ''
          });
        }
      }
    } catch (e) {
      // Continue
    }
  }

  console.log(`Found ${emptyStatesFound.length} empty state messages:`);
  emptyStatesFound.forEach((state, index) => {
    console.log(`  Empty state ${index}: "${state.text}" - ${state.selector}`);
  });

  // Look for any navigation or breadcrumb elements
  const navSelectors = [
    '.breadcrumb',
    '.nav',
    '.navigation',
    '[data-testid="breadcrumb"]',
    'nav',
    '.breadcrumbs'
  ];

  console.log('\n🔍 Looking for navigation elements...');
  let navElementsFound = [];

  for (const selector of navSelectors) {
    try {
      const elements = await authenticatedPage.locator(selector).all();
      for (const element of elements) {
        const isVisible = await element.isVisible();
        if (isVisible) {
          const text = await element.textContent();
          navElementsFound.push({
            selector,
            text: text?.trim() || ''
          });
        }
      }
    } catch (e) {
      // Continue
    }
  }

  console.log(`Found ${navElementsFound.length} navigation elements:`);
  navElementsFound.forEach((nav, index) => {
    console.log(`  Nav ${index}: "${nav.text}" - ${nav.selector}`);
  });

  // Console log the page content structure for debugging
  const pageContent = await authenticatedPage.locator('body').textContent();
  console.log('\n📄 Page content preview (first 500 chars):');
  console.log(pageContent?.substring(0, 500) || 'No content found');

  // Get all buttons on the page
  const allButtons = await authenticatedPage.locator('button').all();
  console.log(`\n🔘 Total buttons found: ${allButtons.length}`);

  // Get all links on the page
  const allLinks = await authenticatedPage.locator('a').all();
  console.log(`🔗 Total links found: ${allLinks.length}`);

  console.log('\n✅ Page analysis complete - screenshot saved to test-results/physical-assets-page-analysis.png');
});