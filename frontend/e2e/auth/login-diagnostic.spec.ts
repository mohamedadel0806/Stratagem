/**
 * Diagnostic test to understand the login flow
 */
import { test, expect } from '@playwright/test';

test.describe('Auth - Login Diagnostic', () => {
  test('should analyze login form structure', async ({ page }) => {
    // Go to login page directly
    await page.goto('/en/login');
    await page.waitForLoadState('domcontentloaded');

    // Take screenshot
    await page.screenshot({ path: 'test-results/login-page.png', fullPage: true });

    // Get all text on the page
    const allText = await page.textContent('body');
    console.log('Login page text:', allText?.substring(0, 500));

    // Look for email input fields
    const emailInputs = await page.locator('input[type="email"], input[id*="email"], input[name*="email"], input[placeholder*="email"]').all();
    console.log(`Found ${emailInputs.length} potential email inputs:`);

    for (let i = 0; i < emailInputs.length; i++) {
      const placeholder = await emailInputs[i].getAttribute('placeholder');
      const id = await emailInputs[i].getAttribute('id');
      const name = await emailInputs[i].getAttribute('name');
      console.log(`  Email Input ${i}: placeholder="${placeholder}", id="${id}", name="${name}"`);
    }

    // Look for password input fields
    const passwordInputs = await page.locator('input[type="password"], input[id*="password"], input[name*="password"]').all();
    console.log(`Found ${passwordInputs.length} potential password inputs:`);

    for (let i = 0; i < passwordInputs.length; i++) {
      const placeholder = await passwordInputs[i].getAttribute('placeholder');
      const id = await passwordInputs[i].getAttribute('id');
      const name = await passwordInputs[i].getAttribute('name');
      console.log(`  Password Input ${i}: placeholder="${placeholder}", id="${id}", name="${name}"`);
    }

    // Look for submit buttons
    const buttons = await page.locator('button').all();
    console.log(`Found ${buttons.length} buttons on login page:`);

    for (let i = 0; i < buttons.length; i++) {
      try {
        const buttonText = await buttons[i].textContent();
        const type = await buttons[i].getAttribute('type');
        const isVisible = await buttons[i].isVisible();
        console.log(`  Button ${i}: text="${buttonText}", type="${type}", visible=${isVisible}`);
      } catch (e) {
        console.log(`  Button ${i}: Could not analyze (${e})`);
      }
    }

    // Look for form elements
    const forms = await page.locator('form').all();
    console.log(`Found ${forms.length} forms:`);

    for (let i = 0; i < forms.length; i++) {
      const action = await forms[i].getAttribute('action');
      const method = await forms[i].getAttribute('method');
      console.log(`  Form ${i}: action="${action}", method="${method}"`);
    }

    // Test manual login if elements found
    if (emailInputs.length > 0 && passwordInputs.length > 0 && buttons.length > 0) {
      console.log('Testing manual login...');

      try {
        await emailInputs[0].fill('admin@grcplatform.com');
        console.log('Filled email field');

        await passwordInputs[0].fill('password123');
        console.log('Filled password field');

        // Look for submit button
        let submitButton = null;
        for (const button of buttons) {
          const buttonText = await button.textContent();
          if (buttonText && (buttonText.toLowerCase().includes('sign') ||
                              buttonText.toLowerCase().includes('login') ||
                              buttonText.toLowerCase().includes('submit'))) {
            submitButton = button;
            console.log(`Found submit button: "${buttonText}"`);
            break;
          }
        }

        if (!submitButton) {
          // Use first button as fallback
          submitButton = buttons[0];
          console.log('Using first button as submit button');
        }

        await submitButton.click();
        console.log('Clicked submit button');

        // Wait for navigation
        await page.waitForTimeout(5000);

        // Check where we ended up
        const finalUrl = page.url();
        console.log(`After login - Current URL: ${finalUrl}`);

        // Take screenshot of result
        await page.screenshot({ path: 'test-results/login-result.png', fullPage: true });

      } catch (error) {
        console.log(`Login test failed: ${error}`);
      }
    }

    // This test should always pass for analysis
    expect(true).toBe(true);
  });
});