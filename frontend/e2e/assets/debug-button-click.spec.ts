import { test, expect } from '../fixtures/auth';

/**
 * Diagnostic test to understand why the "New Asset" button can't be clicked
 */
test('Debug: Investigate New Asset button', async ({ authenticatedPage }) => {
  // Navigate to physical assets page
  await authenticatedPage.goto('/en/dashboard/assets/physical');
  
  // Wait for page to load
  await authenticatedPage.waitForLoadState('networkidle');
  await authenticatedPage.waitForTimeout(2000);
  
  // Take screenshot of current state
  await authenticatedPage.screenshot({ path: 'test-results/debug-before-click.png', fullPage: true });
  
  // Get all buttons on the page
  const allButtons = await authenticatedPage.locator('button').all();
  console.log(`Found ${allButtons.length} buttons on the page`);
  
  // Check each button
  for (let i = 0; i < allButtons.length; i++) {
    const button = allButtons[i];
    const text = await button.textContent();
    const isVisible = await button.isVisible();
    const isEnabled = await button.isEnabled();
    const boundingBox = await button.boundingBox();
    
    console.log(`Button ${i}: "${text}" - Visible: ${isVisible}, Enabled: ${isEnabled}, BoundingBox: ${JSON.stringify(boundingBox)}`);
    
    if (text?.includes('New Asset') || text?.includes('Create')) {
      console.log(`\n=== FOUND TARGET BUTTON ===`);
      console.log(`Text: ${text}`);
      console.log(`Visible: ${isVisible}`);
      console.log(`Enabled: ${isEnabled}`);
      console.log(`BoundingBox: ${JSON.stringify(boundingBox)}`);
      
      // Check if it's covered by another element
      const isIntersectingViewport = await button.evaluate((el) => {
        const rect = el.getBoundingClientRect();
        return rect.top >= 0 && rect.left >= 0 && 
               rect.bottom <= window.innerHeight && 
               rect.right <= window.innerWidth;
      });
      console.log(`In viewport: ${isIntersectingViewport}`);
      
      // Check z-index and stacking context
      const zIndex = await button.evaluate((el) => {
        return window.getComputedStyle(el).zIndex;
      });
      console.log(`Z-index: ${zIndex}`);
      
      // Check for overlays
      const overlays = await authenticatedPage.evaluate(() => {
        const elements = document.elementsFromPoint(window.innerWidth / 2, window.innerHeight / 2);
        return elements.map(el => ({
          tag: el.tagName,
          class: el.className,
          zIndex: window.getComputedStyle(el).zIndex,
          pointerEvents: window.getComputedStyle(el).pointerEvents
        }));
      });
      console.log(`Elements at center: ${JSON.stringify(overlays, null, 2)}`);
      
      // Try to click it
      try {
        await button.scrollIntoViewIfNeeded();
        await authenticatedPage.waitForTimeout(500);
        await button.click({ timeout: 5000, force: false });
        console.log('✅ Click succeeded!');
        
        // Wait for dialog
        await authenticatedPage.waitForTimeout(1000);
        const dialog = await authenticatedPage.locator('[role="dialog"]').isVisible();
        console.log(`Dialog opened: ${dialog}`);
        
        if (dialog) {
          await authenticatedPage.screenshot({ path: 'test-results/debug-after-click.png', fullPage: true });
        }
      } catch (error: any) {
        console.log(`❌ Click failed: ${error.message}`);
        
        // Try force click
        try {
          await button.click({ force: true, timeout: 5000 });
          console.log('✅ Force click succeeded!');
        } catch (forceError: any) {
          console.log(`❌ Force click also failed: ${forceError.message}`);
        }
      }
    }
  }
  
  // Also try different selectors
  console.log('\n=== Trying different selectors ===');
  
  const selectors = [
    'button:has-text("New Asset")',
    'button:has-text("Create")',
    'button:has-text("Create Your First Asset")',
    '[data-testid*="new-asset"]',
    '[data-testid*="create"]',
    'button[aria-label*="New"]',
    'button[aria-label*="Create"]',
  ];
  
  for (const selector of selectors) {
    const count = await authenticatedPage.locator(selector).count();
    console.log(`Selector "${selector}": ${count} elements found`);
    if (count > 0) {
      const first = authenticatedPage.locator(selector).first();
      const text = await first.textContent();
      const visible = await first.isVisible();
      console.log(`  - Text: "${text}", Visible: ${visible}`);
    }
  }
  
  // Check page state
  const pageText = await authenticatedPage.textContent('body');
  const hasLoading = pageText?.includes('Loading assets');
  const hasError = pageText?.includes('Error');
  console.log(`\n=== Page State ===`);
  console.log(`Has "Loading assets": ${hasLoading}`);
  console.log(`Has "Error": ${hasError}`);
  console.log(`Body text length: ${pageText?.length}`);
  
  // Wait a bit to see results
  await authenticatedPage.waitForTimeout(5000);
});
