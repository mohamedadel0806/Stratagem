import { test, expect } from './fixtures/auth';
import { RiskRegisterPage } from './pages/risk-register-page';

test.describe('Debug with Auth Fixture', () => {
  test('should analyze risk register with proper auth', async ({ authenticatedPage }) => {
    console.log('Analyzing risk register page with auth...');

    try {
      const riskRegisterPage = new RiskRegisterPage(authenticatedPage);

      // Navigate to risks list page
      await riskRegisterPage.goto('en');
      console.log('✅ Navigated to risk register page');

      // Wait for content
      await authenticatedPage.waitForTimeout(3000);

      // Analyze what's actually on the page
      const pageTitle = await authenticatedPage.title();
      console.log('Page title:', pageTitle);

      // Look for buttons with various selectors
      const buttonSelectors = [
        'button:has-text("New Risk")',
        'button:has-text("Add Risk")',
        'button:has-text("Create")',
        '[data-testid*="risk-register-new"]',
        '[data-testid*="new-risk"]',
        '[data-testid*="add"]',
        'button[aria-label*="new"]',
        'button[aria-label*="create"]',
        'button[aria-label*="add"]'
      ];

      console.log(`Checking ${buttonSelectors.length} different button selectors...`);

      for (let i = 0; i < buttonSelectors.length; i++) {
        const selector = buttonSelectors[i];
        try {
          const elements = await authenticatedPage.locator(selector).all();
          const visibleElements = await authenticatedPage.locator(selector).filter({ hasText: /.+/ }).count();

          console.log(`Selector ${i + 1} ("${selector}"): Found ${elements.length} elements, ${visibleElements} visible`);

          if (elements.length > 0) {
            for (let j = 0; j < Math.min(elements.length, 3); j++) {
              const element = elements[j];
              const text = await element.textContent();
              const testId = await element.getAttribute('data-testid');
              const isVisible = await element.isVisible();

              console.log(`  - Element ${j}: text="${text}", testId="${testId}", visible=${isVisible}`);
            }
          }
        } catch (e) {
          console.log(`Selector ${i + 1} ("${selector}"): Error - ${e}`);
        }
      }

      // Look for any clickable elements
      const clickableElements = await authenticatedPage.locator('button, a[role="button"], [role="button"]').all();
      console.log(`Found ${clickableElements.length} clickable elements`);

      for (let i = 0; i < Math.min(clickableElements.length, 10); i++) {
        const element = clickableElements[i];
        const text = await element.textContent();
        const tag = await element.evaluate(el => el.tagName.toLowerCase());
        const role = await element.getAttribute('role');
        const isVisible = await element.isVisible();

        if (text && text.trim() && isVisible) {
          console.log(`Clickable ${i}: tag="${tag}", role="${role}", text="${text.trim()}"`);
        }
      }

      // Check risk card count
      const riskCardCount = await riskRegisterPage.getRiskCardCount();
      console.log(`Risk card count: ${riskCardCount}`);

      // Take a screenshot
      await authenticatedPage.screenshot({ path: 'test-results/risk-register-with-auth.png', fullPage: true });
      console.log('✅ Screenshot saved');

    } catch (error: any) {
      console.log('❌ Error:', error.message);
      await authenticatedPage.screenshot({ path: 'test-results/risk-register-auth-error.png', fullPage: true });
      throw error;
    }
  });
});