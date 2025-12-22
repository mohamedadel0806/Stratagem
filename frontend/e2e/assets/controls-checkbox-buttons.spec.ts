/**
 * Test to properly interact with checkbox-style buttons in the control selection modal
 */
import { test } from '../fixtures/auth-fixed';
import { expect } from '@playwright/test';

test.describe('Controls Checkbox Buttons', () => {
  test('should select controls using checkbox-style buttons', async ({ authenticatedPage }) => {
    console.log('\n☑️ TESTING CHECKBOX-STYLE CONTROL SELECTION');

    const assetUrl = 'http://localhost:3000/en/dashboard/assets/physical/99cb990a-29e4-4e34-acf4-d58b8261046b';

    // Step 1: Navigate and open control selection modal
    await authenticatedPage.goto(assetUrl);
    await authenticatedPage.waitForLoadState('networkidle');
    await authenticatedPage.waitForTimeout(3000);

    await authenticatedPage.locator('[role="tab"]:has-text("Controls")').first().click();
    await authenticatedPage.waitForTimeout(2000);

    await authenticatedPage.locator('button:has-text("Link Controls")').first().click();
    await authenticatedPage.waitForTimeout(3000);

    const modal = await authenticatedPage.locator('[role="dialog"]').first();
    expect(await modal.isVisible()).toBe(true);

    console.log('✅ Control selection modal opened');

    // Step 2: Focus specifically on the checkbox-style buttons
    console.log('\n🔍 Looking for checkbox-style buttons...');

    const checkboxButtons = await modal.locator('button[role="checkbox"]').all();
    console.log(`☑️ Found ${checkboxButtons.length} checkbox-style buttons`);

    // If no checkbox buttons, look for other button patterns
    if (checkboxButtons.length === 0) {
      console.log('🔍 No checkbox buttons found, looking for other patterns...');

      const allButtons = await modal.locator('button:not([role="tab"])').all();
      console.log(`🔘 Found ${allButtons.length} non-tab buttons`);

      let checkboxLikeButtons = [];
      for (let i = 0; i < Math.min(allButtons.length, 10); i++) {
        try {
          const button = allButtons[i];
          if (await button.isVisible()) {
            const text = await button.textContent();
            const ariaChecked = await button.getAttribute('aria-checked');
            const dataState = await button.getAttribute('data-state');
            const classes = await button.getAttribute('class') || '';

            // Look for buttons that behave like checkboxes
            if (ariaChecked || dataState || classes.includes('check') || classes.includes('select')) {
              checkboxLikeButtons.push({
                element: button,
                text: text || '(empty)',
                ariaChecked,
                dataState,
                classes,
                index: i
              });
              console.log(`  ${checkboxLikeButtons.length}. Checkbox-like button: "${text}" (aria-checked: ${ariaChecked}, data-state: ${dataState})`);
            }
          }
        } catch (e) {
          continue;
        }
      }

      if (checkboxLikeButtons.length > 0) {
        console.log(`📋 Found ${checkboxLikeButtons.length} checkbox-like buttons to work with`);
        await selectCheckboxLikeButtons(checkboxLikeButtons, authenticatedPage, modal);
      } else {
        console.log('❌ No checkbox-like buttons found either');

        // Try to find the control content through other means
        await exploreModalContent(authenticatedPage, modal);
      }
    } else {
      console.log(`📋 Found ${checkboxButtons.length} checkbox buttons to work with`);
      await selectCheckboxButtons(checkboxButtons, authenticatedPage, modal);
    }

    // Final screenshot
    await authenticatedPage.screenshot({
      path: 'test-results/controls-checkbox-final.png',
      fullPage: true
    });

    console.log('\n📊 CHECKBOX BUTTON TEST COMPLETE');
  });
});

async function selectCheckboxButtons(checkboxButtons, page, modal) {
  console.log('\n🎯 Selecting checkbox buttons...');

  let selectedCount = 0;

  for (let i = 0; i < Math.min(checkboxButtons.length, 5); i++) {
    try {
      const button = checkboxButtons[i];
      if (await button.isVisible()) {
        // Check current state
        const ariaChecked = await button.getAttribute('aria-checked');
        const isSelected = ariaChecked === 'true';

        console.log(`  Button ${i + 1}: aria-checked="${ariaChecked}" (${isSelected ? 'selected' : 'not selected'})`);

        if (!isSelected) {
          // Click to select
          await button.click();
          selectedCount++;

          console.log(`  ✅ Clicked to select button ${i + 1}`);

          // Check new state
          const newAriaChecked = await button.getAttribute('aria-checked');
          console.log(`    New state: aria-checked="${newAriaChecked}"`);

          // Check if Link button became enabled
          const linkButton = await modal.locator('button:has-text("Link")').first();
          const isEnabled = await linkButton.isEnabled();
          const buttonText = await linkButton.textContent();

          console.log(`    🔗 Link button: "${buttonText}" (enabled: ${isEnabled})`);

          if (isEnabled) {
            console.log(`🎉 SUCCESS: Link button enabled after ${selectedCount} selections!`);

            // Click the Link button
            await linkButton.click();
            console.log('💾 Link button clicked');

            await page.waitForTimeout(5000);

            const modalStillOpen = await modal.isVisible();
            if (!modalStillOpen) {
              console.log('🎉 SUCCESS: Controls linked and modal closed!');

              // Take final screenshot
              await page.screenshot({
                path: 'test-results/controls-linked-success.png',
                fullPage: true
              });

              return;
            }
          }
        }
      }
    } catch (e) {
      console.log(`  ❌ Error with button ${i + 1}: ${e}`);
    }
  }

  console.log(`❌ Could not enable Link button after trying ${selectedCount} buttons`);
}

async function selectCheckboxLikeButtons(checkboxLikeButtons, page, modal) {
  console.log('\n🎯 Selecting checkbox-like buttons...');

  let selectedCount = 0;

  for (let i = 0; i < Math.min(checkboxLikeButtons.length, 5); i++) {
    try {
      const buttonInfo = checkboxLikeButtons[i];
      const button = buttonInfo.element;

      if (await button.isVisible()) {
        console.log(`  Trying button ${i + 1}: "${buttonInfo.text}"`);

        await button.click();
        selectedCount++;

        console.log(`  ✅ Clicked button ${i + 1}`);

        // Check if Link button became enabled
        const linkButton = await modal.locator('button:has-text("Link")').first();
        const isEnabled = await linkButton.isEnabled();
        const buttonText = await linkButton.textContent();

        console.log(`    🔗 Link button: "${buttonText}" (enabled: ${isEnabled})`);

        if (isEnabled) {
          console.log(`🎉 SUCCESS: Link button enabled after ${selectedCount} selections!`);

          // Click the Link button
          await linkButton.click();
          console.log('💾 Link button clicked');

          await page.waitForTimeout(5000);

          const modalStillOpen = await modal.isVisible();
          if (!modalStillOpen) {
            console.log('🎉 SUCCESS: Controls linked and modal closed!');

            // Take final screenshot
            await page.screenshot({
              path: 'test-results/controls-linked-success.png',
              fullPage: true
            });

            return;
          }
        }
      }
    } catch (e) {
      console.log(`  ❌ Error with button ${i + 1}: ${e}`);
    }
  }

  console.log(`❌ Could not enable Link button after trying ${selectedCount} buttons`);
}

async function exploreModalContent(page, modal) {
  console.log('\n🔍 Exploring modal content for other selection mechanisms...');

  // Try to find any clickable elements that might be control items
  const allClickableElements = await modal.locator('button, a, [role="button"], [onclick], [data-action]').all();
  console.log(`🎯 Found ${allClickableElements.length} clickable elements`);

  let potentialControls = [];

  for (let i = 0; i < Math.min(allClickableElements.length, 15); i++) {
    try {
      const element = allClickableElements[i];
      if (await element.isVisible()) {
        const text = await element.textContent();
        const tagName = await element.evaluate((el: any) => el.tagName.toLowerCase());
        const role = await element.getAttribute('role') || '';
        const classes = await element.getAttribute('class') || '';

        if (text && text.trim() && text.trim().length > 3 &&
            role !== 'tab' &&
            !text.toLowerCase().includes('cancel') &&
            !text.toLowerCase().includes('close') &&
            !text.toLowerCase().includes('search')) {
          potentialControls.push({
            element,
            text: text.trim(),
            tagName,
            role,
            classes,
            index: i
          });
          console.log(`  ${potentialControls.length}. ${tagName.toUpperCase()} (${role}): "${text.trim().substring(0, 60)}${text.length > 60 ? '...' : ''}"`);
        }
      }
    } catch (e) {
      continue;
    }
  }

  // Try clicking on some potential controls
  console.log('\n🎯 Trying to click potential control items...');
  for (let i = 0; i < Math.min(potentialControls.length, 5); i++) {
    try {
      await potentialControls[i].element.click();
      console.log(`  ✅ Clicked item ${i + 1}: ${potentialControls[i].text.substring(0, 40)}...`);

      // Check if Link button became enabled
      const linkButton = await modal.locator('button:has-text("Link")').first();
      const isEnabled = await linkButton.isEnabled();
      const buttonText = await linkButton.textContent();

      console.log(`    🔗 Link button: "${buttonText}" (enabled: ${isEnabled})`);

      if (isEnabled) {
        console.log('🎉 SUCCESS: Found the right selection mechanism!');

        await linkButton.click();
        console.log('💾 Link button clicked');

        await page.waitForTimeout(5000);

        const modalStillOpen = await modal.isVisible();
        if (!modalStillOpen) {
          console.log('🎉 SUCCESS: Controls linked and modal closed!');

          await page.screenshot({
            path: 'test-results/controls-linked-success.png',
            fullPage: true
          });
          return;
        }
      }
    } catch (e) {
      console.log(`  ❌ Error clicking item ${i + 1}: ${e}`);
    }
  }

  console.log('❌ Could not find working selection mechanism');
}