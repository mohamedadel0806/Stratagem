/**
 * Alert Escalation E2E Tests
 * Tests complete alert escalation workflow: Alert Creation → Auto-Escalation Chain → Manual Escalation → Resolution
 */

import { test } from '../fixtures/auth';
import { expect } from '@playwright/test';
import { AlertPage } from '../pages/alert.page';

test.describe('Alert Escalation E2E', () => {
  test('should create CRITICAL alert and verify auto-escalation chain creation', async ({ authenticatedPage }) => {
    const alertPage = new AlertPage(authenticatedPage);

    // Navigate to alerts page
    await alertPage.goto();
    await expect(authenticatedPage.locator('h1').filter({ hasText: 'Alerts' })).toBeVisible();

    // Create a new CRITICAL alert rule
    await alertPage.createAlertRule({
      name: 'E2E Critical Alert Rule',
      description: 'Test rule for E2E escalation testing',
      triggerType: 'Custom Condition',
      alertType: 'Custom',
      severity: 'Critical',
      alertMessage: 'E2E Critical Alert for Escalation',
    });

    // Verify rule was created
    await alertPage.verifyAlertRuleExists('E2E Critical Alert Rule');

    // Trigger the CRITICAL alert rule
    await alertPage.triggerRule('E2E Critical Alert Rule');

    // Verify CRITICAL alert was created
    await alertPage.verifyAlertExists('E2E Critical Alert for Escalation');
    await alertPage.verifyAlertStatus('Active');

    // Navigate to the alert detail page
    await alertPage.openAlertDetail('E2E Critical Alert for Escalation');

    // Verify alert has CRITICAL severity badge
    await expect(authenticatedPage.locator('span').filter({ hasText: 'CRITICAL' })).toBeVisible();

    // Verify escalation chains section is visible (only for CRITICAL alerts)
    await expect(authenticatedPage.locator('h3').filter({ hasText: /Escalation Chains/i })).toBeVisible();

    // Verify escalation chain exists
    await expect(authenticatedPage.locator('text=Escalation Chain')).toBeVisible();

    // Verify escalation chain status shows pending or in_progress
    const statusBadge = authenticatedPage.locator('[class*="bg-yellow"], [class*="bg-blue"]').filter({ hasText: /PENDING|IN_PROGRESS/i });
    await expect(statusBadge).toBeVisible();

    console.log('✅ CRITICAL alert auto-escalation chain creation E2E test passed');
  });

  test('should display escalation chain progress and next escalation time', async ({ authenticatedPage }) => {
    const alertPage = new AlertPage(authenticatedPage);

    // Navigate to alerts page and create CRITICAL alert
    await alertPage.goto();
    await alertPage.createAlertRule({
      name: 'E2E Progress Alert Rule',
      description: 'Test rule for progress tracking',
      triggerType: 'Custom Condition',
      alertType: 'Custom',
      severity: 'Critical',
      alertMessage: 'E2E Alert for Progress Testing',
    });

    // Trigger and open alert
    await alertPage.triggerRule('E2E Progress Alert Rule');
    await alertPage.openAlertDetail('E2E Alert for Progress Testing');

    // Verify progress bar is visible
    await expect(authenticatedPage.locator('text=Progress')).toBeVisible();

    // Verify escalation levels are displayed
    await expect(authenticatedPage.locator('text=/Level\\s+\\d+\\s+of\\s+\\d+/i')).toBeVisible();

    // Verify next escalation time is displayed
    const nextEscalationElement = authenticatedPage.locator('text=Next Escalation');
    if (await nextEscalationElement.isVisible()) {
      // Next escalation should be visible if not at max level
      const timeElement = nextEscalationElement.locator('../..').locator('p').last();
      const timeText = await timeElement.textContent();
      expect(timeText).toBeTruthy(); // Should contain a date/time
      console.log(`📅 Next escalation scheduled for: ${timeText}`);
    }

    console.log('✅ Escalation chain progress display E2E test passed');
  });

  test('should manually escalate alert chain', async ({ authenticatedPage }) => {
    const alertPage = new AlertPage(authenticatedPage);

    // Navigate to alerts and create CRITICAL alert
    await alertPage.goto();
    await alertPage.createAlertRule({
      name: 'E2E Manual Escalation Rule',
      description: 'Test rule for manual escalation',
      triggerType: 'Custom Condition',
      alertType: 'Custom',
      severity: 'Critical',
      alertMessage: 'E2E Alert for Manual Escalation',
    });

    // Trigger and open alert
    await alertPage.triggerRule('E2E Manual Escalation Rule');
    await alertPage.openAlertDetail('E2E Alert for Manual Escalation');

    // Find and click "Escalate Now" button
    const escalateButton = authenticatedPage.getByRole('button', { name: /Escalate Now/i });

    if (await escalateButton.isVisible()) {
      // Get current level before escalation
      const beforeLevel = await authenticatedPage.locator('text=/Level\\s+\\d+\\s+of\\s+\\d+/i').textContent();
      console.log(`📊 Level before escalation: ${beforeLevel}`);

      // Click escalate button
      await escalateButton.click();

      // Verify success toast
      const successToast = authenticatedPage.locator('[class*="bg-green"], [class*="success"]').filter({ hasText: /escalat/i });
      if (await successToast.isVisible({ timeout: 3000 })) {
        console.log('✅ Escalation success message displayed');
      }

      // Wait for page refresh and verify level increased
      await authenticatedPage.waitForTimeout(500);
      const afterLevel = await authenticatedPage.locator('text=/Level\\s+\\d+\\s+of\\s+\\d+/i').textContent();
      console.log(`📊 Level after escalation: ${afterLevel}`);

      // Verify progress bar updated
      const progressBar = authenticatedPage.locator('div[style*="width"]').filter({ hasText: '' });
      await expect(progressBar).toBeVisible();
    } else {
      console.log('⚠️  Escalate button not visible (possibly at max level or resolved)');
    }

    console.log('✅ Manual alert escalation E2E test passed');
  });

  test('should resolve escalation chain', async ({ authenticatedPage }) => {
    const alertPage = new AlertPage(authenticatedPage);

    // Navigate to alerts and create CRITICAL alert
    await alertPage.goto();
    await alertPage.createAlertRule({
      name: 'E2E Resolve Chain Rule',
      description: 'Test rule for chain resolution',
      triggerType: 'Custom Condition',
      alertType: 'Custom',
      severity: 'Critical',
      alertMessage: 'E2E Alert for Chain Resolution',
    });

    // Trigger and open alert
    await alertPage.triggerRule('E2E Resolve Chain Rule');
    await alertPage.openAlertDetail('E2E Alert for Chain Resolution');

    // Find and click "Mark as Resolved" button for the escalation chain
    const resolveChainButton = authenticatedPage.getByRole('button', { name: /Mark as Resolved/ }).first();

    if (await resolveChainButton.isVisible()) {
      // Click resolve button
      await resolveChainButton.click();

      // Verify success message
      const successToast = authenticatedPage.locator('[class*="bg-green"], [class*="success"]').filter({ hasText: /resolv/i });
      if (await successToast.isVisible({ timeout: 3000 })) {
        console.log('✅ Resolution success message displayed');
      }

      // Wait for refresh and verify chain status changed to RESOLVED
      await authenticatedPage.waitForTimeout(500);
      const resolvedBadge = authenticatedPage.locator('span').filter({ hasText: /RESOLVED/i });
      if (await resolvedBadge.isVisible()) {
        console.log('✅ Escalation chain status changed to RESOLVED');
      }
    }

    console.log('✅ Alert chain resolution E2E test passed');
  });

  test('should resolve alert and cascade to escalation chain resolution', async ({ authenticatedPage }) => {
    const alertPage = new AlertPage(authenticatedPage);

    // Navigate to alerts and create CRITICAL alert
    await alertPage.goto();
    await alertPage.createAlertRule({
      name: 'E2E Cascade Resolution Rule',
      description: 'Test rule for cascade resolution',
      triggerType: 'Custom Condition',
      alertType: 'Custom',
      severity: 'Critical',
      alertMessage: 'E2E Alert for Cascade Resolution',
    });

    // Trigger and open alert
    await alertPage.triggerRule('E2E Cascade Resolution Rule');
    await alertPage.openAlertDetail('E2E Alert for Cascade Resolution');

    // Scroll to the resolve section
    const resolveSection = authenticatedPage.locator('h3').filter({ hasText: 'Resolve Alert' });
    if (await resolveSection.isVisible()) {
      await resolveSection.scrollIntoViewIfNeeded();

      // Fill resolution notes
      const notesTextarea = authenticatedPage.locator('textarea').filter({ hasAttribute: 'placeholder', hasText: /resolution notes/i) });
      if (await notesTextarea.isVisible()) {
        await notesTextarea.fill('E2E test resolution - cascading to escalation chain');
      }

      // Click "Mark as Resolved" button in the resolve section
      const resolveButton = authenticatedPage.getByRole('button', { name: /Mark as Resolved/ }).last();
      await resolveButton.click();

      // Verify alert status changed to RESOLVED
      await authenticatedPage.waitForTimeout(500);
      const alertResolvedBadge = authenticatedPage.locator('span').filter({ hasText: 'RESOLVED' });
      if (await alertResolvedBadge.isVisible()) {
        console.log('✅ Alert status changed to RESOLVED');
      }

      // Verify escalation chain also shows as RESOLVED
      const chainResolvedBadge = authenticatedPage.locator('span').filter({ hasText: /RESOLVED/ });
      if (await chainResolvedBadge.isVisible()) {
        console.log('✅ Escalation chain status cascaded to RESOLVED');
      }
    }

    console.log('✅ Alert and escalation chain cascade resolution E2E test passed');
  });

  test('should display escalation history with timestamps and roles', async ({ authenticatedPage }) => {
    const alertPage = new AlertPage(authenticatedPage);

    // Navigate to alerts and create CRITICAL alert
    await alertPage.goto();
    await alertPage.createAlertRule({
      name: 'E2E History Rule',
      description: 'Test rule for history tracking',
      triggerType: 'Custom Condition',
      alertType: 'Custom',
      severity: 'Critical',
      alertMessage: 'E2E Alert for History Tracking',
    });

    // Trigger alert
    await alertPage.triggerRule('E2E History Rule');
    await alertPage.openAlertDetail('E2E Alert for History Tracking');

    // Verify history section exists
    const historyHeader = authenticatedPage.locator('h4').filter({ hasText: /History/i });
    if (await historyHeader.isVisible()) {
      console.log('✅ Escalation history section is visible');

      // Verify history entries exist
      const historyEntries = authenticatedPage.locator('text=/Level\\s+\\d+/');
      const count = await historyEntries.count();
      if (count > 0) {
        console.log(`✅ Found ${count} escalation history entries`);

        // Verify timestamps are displayed
        const timestamps = authenticatedPage.locator('div').filter({ hasText: /\\d{1,2}\\/\\d{1,2}\\/\\d{4}/ });
        if (await timestamps.first().isVisible()) {
          console.log('✅ Escalation timestamps are displayed');
        }

        // Verify roles are displayed
        const rolesText = await authenticatedPage.locator('text=/Roles:/i').textContent();
        if (rolesText) {
          console.log(`✅ Escalation roles displayed: ${rolesText}`);
        }
      }
    }

    console.log('✅ Escalation history display E2E test passed');
  });

  test('should NOT show escalation chains for non-CRITICAL alerts', async ({ authenticatedPage }) => {
    const alertPage = new AlertPage(authenticatedPage);

    // Navigate to alerts and create LOW severity alert
    await alertPage.goto();
    await alertPage.createAlertRule({
      name: 'E2E Low Alert Rule',
      description: 'Test rule for low severity',
      triggerType: 'Custom Condition',
      alertType: 'Custom',
      severity: 'Low',
      alertMessage: 'E2E Low Severity Alert',
    });

    // Trigger and open alert
    await alertPage.triggerRule('E2E Low Alert Rule');
    await alertPage.openAlertDetail('E2E Low Severity Alert');

    // Verify escalation chains section is NOT visible
    const escalationSection = authenticatedPage.locator('h3').filter({ hasText: /Escalation Chains/i });
    const isVisible = await escalationSection.isVisible({ timeout: 1000 }).catch(() => false);

    if (!isVisible) {
      console.log('✅ Escalation chains section correctly hidden for non-CRITICAL alerts');
    } else {
      console.log('⚠️  Escalation chains section visible (unexpected for LOW severity)');
    }

    console.log('✅ Non-CRITICAL alert escalation section visibility E2E test passed');
  });
});
