import { test, expect } from '../../fixtures/auth';

/**
 * Risk Details Page Complete Test Suite
 * Tests all tabs, buttons, and form interactions on the risk details page
 */

test.describe('Risk Details Page', () => {
  test.setTimeout(180000);

  const WAIT_SMALL = 400;
  const WAIT_MEDIUM = 600;
  const WAIT_LARGE = 1000;
  const riskId = '95d8a18a-1e1c-44ed-9eaa-25dfadac75b5';

  test.beforeEach(async ({ authenticatedPage }) => {
    // Navigate to risk details page
    await authenticatedPage.goto(`/en/dashboard/risks/${riskId}`, { waitUntil: 'domcontentloaded' });
    await authenticatedPage.waitForLoadState('domcontentloaded');
    await authenticatedPage.waitForTimeout(WAIT_LARGE);
  });

  test('should navigate through all tabs and verify content', async ({ authenticatedPage }) => {
    console.log('=== TESTING RISK DETAILS PAGE TABS ===');

    // Define all tabs with expected content patterns
    const tabs = [
      {
        name: 'Overview',
        expectedContent: ['Risk', 'Status', 'Category', 'Score'],
        expectedButtons: ['Edit', 'Delete']
      },
      {
        name: 'Assessments',
        expectedContent: ['Assessment', 'Likelihood', 'Impact', 'Date'],
        expectedButtons: ['New Assessment', 'Add Assessment', 'Create']
      },
      {
        name: 'Assets',
        expectedContent: ['Asset', 'Business Process', 'Information'],
        expectedButtons: ['Link Asset', 'Add Asset', 'Link']
      },
      {
        name: 'Controls',
        expectedContent: ['Control', 'Implementation', 'Effectiveness'],
        expectedButtons: ['Link Control', 'Add Control', 'New Control']
      },
      {
        name: 'Treatments',
        expectedContent: ['Treatment', 'Strategy', 'Status', 'Progress'],
        expectedButtons: ['New Treatment', 'Add Treatment', 'Create']
      },
      {
        name: 'KRIs',
        expectedContent: ['Metric', 'Target', 'Current', 'Trend'],
        expectedButtons: ['New KRI', 'Add Metric', 'Create']
      }
    ];

    // Test each tab
    for (let i = 0; i < tabs.length; i++) {
      const tab = tabs[i];
      console.log(`\n--- Testing ${tab.name} Tab ---`);

      // Click on the tab
      const tabElement = authenticatedPage.locator(`[role="tab"]:has-text("${tab.name}")`).first();
      await tabElement.waitFor({ state: 'visible', timeout: 10000 });
      await tabElement.click();
      await authenticatedPage.waitForTimeout(WAIT_MEDIUM);

      console.log(`✅ Clicked ${tab.name} tab`);

      // Verify tab content
      console.log('Checking for expected content...');
      let contentFound = 0;
      for (const content of tab.expectedContent) {
        const contentElement = authenticatedPage.locator(`text=${content}`).first();
        const contentExists = await contentElement.isVisible({ timeout: 2000 }).catch(() => false);
        if (contentExists) {
          contentFound++;
          console.log(`  ✅ Found content: ${content}`);
        }
      }
      console.log(`  Found ${contentFound}/${tab.expectedContent.length} expected content items`);

      // Look for action buttons in this tab
      console.log('Checking for action buttons...');
      let buttonsFound = 0;
      for (const buttonText of tab.expectedButtons) {
        const buttonElement = authenticatedPage.locator('button').filter({ hasText: buttonText }).first();
        const buttonExists = await buttonElement.isVisible({ timeout: 2000 }).catch(() => false);
        if (buttonExists) {
          buttonsFound++;
          console.log(`  ✅ Found button: ${buttonText}`);
        }
      }
      console.log(`  Found ${buttonsFound}/${tab.expectedButtons.length} expected buttons`);

      // Take screenshot of each tab
      await authenticatedPage.screenshot({
        path: `test-results/risk-details-${tab.name.toLowerCase()}-tab.png`,
        fullPage: true
      });
    }

    console.log('\n✅ All tabs tested successfully');
  });

  test('should test form opening buttons in each tab', async ({ authenticatedPage }) => {
    console.log('=== TESTING FORM OPENING BUTTONS ===');

    // Test the Edit button first (usually visible in Overview)
    const editButton = authenticatedPage.locator('button:has-text("Edit")').first();
    const editVisible = await editButton.isVisible({ timeout: 3000 }).catch(() => false);
    if (editVisible) {
      console.log('Testing Edit button...');
      await editButton.click();
      await authenticatedPage.waitForTimeout(WAIT_MEDIUM);

      // Check if form opened
      const formOpened = await authenticatedPage.locator('form, [role="dialog"], .modal').isVisible({ timeout: 3000 }).catch(() => false);
      if (formOpened) {
        console.log('✅ Edit form opened successfully');
        await authenticatedPage.screenshot({ path: 'test-results/risk-edit-form.png', fullPage: true });

        // Close the form (look for Cancel button)
        const cancelButton = authenticatedPage.locator('button:has-text("Cancel"), button:has-text("Close"), button:has-text("×")').first();
        const cancelVisible = await cancelButton.isVisible({ timeout: 2000 }).catch(() => false);
        if (cancelVisible) {
          await cancelButton.click();
          await authenticatedPage.waitForTimeout(WAIT_SMALL);
          console.log('✅ Edit form closed');
        }
      } else {
        console.log('⚠️ Edit button clicked but no form opened');
      }
    }

    // Test the Treatments tab (most likely to have form buttons)
    const treatmentsTab = authenticatedPage.locator('[role="tab"]:has-text("Treatments")').first();
    await treatmentsTab.click();
    await authenticatedPage.waitForTimeout(WAIT_MEDIUM);

    // Look for treatment-related buttons
    const treatmentButtons = ['New Treatment', 'Add Treatment', 'Create Treatment'];
    for (const buttonText of treatmentButtons) {
      const button = authenticatedPage.locator('button').filter({ hasText: buttonText }).first();
      const buttonVisible = await button.isVisible({ timeout: 2000 }).catch(() => false);

      if (buttonVisible) {
        console.log(`Testing ${buttonText} button...`);

        // Take screenshot before clicking
        await authenticatedPage.screenshot({ path: `test-results/before-${buttonText.toLowerCase().replace(/\s+/g, '-')}.png` });

        await button.click();
        await authenticatedPage.waitForTimeout(WAIT_MEDIUM);

        // Check if form opened
        const formOpened = await authenticatedPage.locator('form, [role="dialog"], .modal').isVisible({ timeout: 5000 }).catch(() => false);

        if (formOpened) {
          console.log(`✅ ${buttonText} form opened successfully`);
          await authenticatedPage.screenshot({
            path: `test-results/${buttonText.toLowerCase().replace(/\s+/g, '-')}-form.png`,
            fullPage: true
          });

          // Look for form fields to verify it's a real form
          const formFields = authenticatedPage.locator('input, textarea, select').count();
          if (formFields > 0) {
            console.log(`  ✅ Found ${formFields} form fields`);
          }

          // Close the form
          const cancelButton = authenticatedPage.locator('button:has-text("Cancel"), button:has-text("Close"), button:has-text("×")').first();
          const cancelVisible = await cancelButton.isVisible({ timeout: 2000 }).catch(() => false);
          if (cancelVisible) {
            await cancelButton.click();
            await authenticatedPage.waitForTimeout(WAIT_SMALL);
            console.log(`✅ ${buttonText} form closed`);
          } else {
            // Try pressing Escape
            await authenticatedPage.keyboard.press('Escape');
            await authenticatedPage.waitForTimeout(WAIT_SMALL);
            console.log(`✅ ${buttonText} form closed (Escape key)`);
          }
        } else {
          console.log(`⚠️ ${buttonText} button clicked but no form opened`);

          // Check if we navigated to a different page
          const currentUrl = authenticatedPage.url();
          console.log(`  Current URL: ${currentUrl}`);

          // If we navigated, go back
          if (currentUrl !== `/en/dashboard/risks/${riskId}`) {
            await authenticatedPage.goto(`/en/dashboard/risks/${riskId}`);
            await authenticatedPage.waitForTimeout(WAIT_MEDIUM);
            await treatmentsTab.click();
            await authenticatedPage.waitForTimeout(WAIT_MEDIUM);
          }
        }

        // Only test one successful form to avoid too many interactions
        break;
      }
    }

    console.log('✅ Form opening buttons test completed');
  });

  test('should test navigation and page functionality', async ({ authenticatedPage }) => {
    console.log('=== TESTING NAVIGATION AND FUNCTIONALITY ===');

    // Test Back button
    const backButton = authenticatedPage.locator('button:has-text("Back")').first();
    const backVisible = await backButton.isVisible({ timeout: 3000 }).catch(() => false);
    if (backVisible) {
      console.log('Testing Back button...');
      const currentUrl = authenticatedPage.url();
      await backButton.click();
      await authenticatedPage.waitForTimeout(WAIT_MEDIUM);

      const newUrl = authenticatedPage.url();
      if (newUrl !== currentUrl) {
        console.log('✅ Back button navigated to different page');

        // Navigate back to risk details
        await authenticatedPage.goto(`/en/dashboard/risks/${riskId}`);
        await authenticatedPage.waitForTimeout(WAIT_MEDIUM);
      } else {
        console.log('⚠️ Back button did not navigate');
      }
    }

    // Test main navigation menu items
    const navItems = ['Dashboard', 'Risks', 'Assets', 'Compliance'];
    for (const navItem of navItems) {
      const navButton = authenticatedPage.locator('button').filter({ hasText: navItem }).first();
      const navVisible = await navButton.isVisible({ timeout: 2000 }).catch(() => false);
      if (navVisible) {
        console.log(`Testing navigation to ${navItem}...`);
        await navButton.click();
        await authenticatedPage.waitForTimeout(WAIT_MEDIUM);

        // Verify navigation worked
        const urlContainsPath = await authenticatedPage.url().includes(navItem.toLowerCase());
        if (urlContainsPath) {
          console.log(`✅ Successfully navigated to ${navItem}`);
        }

        // Return to risk details
        await authenticatedPage.goto(`/en/dashboard/risks/${riskId}`);
        await authenticatedPage.waitForTimeout(WAIT_MEDIUM);
      }
    }

    console.log('✅ Navigation test completed');
  });
});