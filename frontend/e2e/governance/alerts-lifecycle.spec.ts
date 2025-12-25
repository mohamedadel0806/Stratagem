/**
 * Alert System E2E Tests
 * Tests complete alert workflow: Rule Creation → Triggering → Notifications → Resolution
 */

import { test } from '../fixtures/auth-storage';
import { expect } from '@playwright/test';
import { AlertPage } from '../pages/alert.page';

test.describe('Alert System E2E', () => {
  test('should complete full alert lifecycle from rule creation to resolution', async ({ authenticatedPage }) => {
    const alertPage = new AlertPage(authenticatedPage);

    // Navigate to alerts page
    await alertPage.goto();
    await expect(authenticatedPage.locator('h1').filter({ hasText: 'Alerts' })).toBeVisible();

    // Create a new alert rule
    await alertPage.createAlertRule({
      name: 'E2E Test Alert Rule',
      description: 'Test rule for E2E testing',
      triggerType: 'Custom Condition',
      alertType: 'Custom',
      severity: 'High',
      alertMessage: 'E2E Test Alert Triggered',
    });

    // Verify rule was created
    await alertPage.verifyAlertRuleExists('E2E Test Alert Rule');

    // Manually trigger the alert rule
    await alertPage.triggerRule('E2E Test Alert Rule');

    // Verify alert was created
    await alertPage.verifyAlertExists('E2E Test Alert Triggered');
    await alertPage.verifyAlertStatus('Active');

    // Test alert acknowledgment
    await alertPage.acknowledgeAlert('E2E Test Alert Triggered');

    // Test alert resolution
    await alertPage.resolveAlert('E2E Test Alert Triggered', 'Issue resolved during E2E testing');

    console.log('✅ Complete alert lifecycle E2E test passed');
  });

  test('should test alert subscription and notification workflow', async ({ authenticatedPage }) => {
    const alertPage = new AlertPage(authenticatedPage);

    // Navigate to alert subscriptions
    await alertPage.gotoSubscriptions();
    await expect(authenticatedPage.locator('h1').filter({ hasText: 'Alert Subscriptions' })).toBeVisible();

    // Create alert subscription
    await alertPage.createSubscription({
      alertType: 'POLICY_REVIEW_OVERDUE',
      severity: 'HIGH',
      channels: ['email'],
      frequency: 'IMMEDIATE',
    });

    // Verify subscription was created
    await alertPage.verifySubscriptionExists('POLICY_REVIEW_OVERDUE');
    await expect(authenticatedPage.getByText('IMMEDIATE')).toBeVisible();

    // Test subscription management
    await authenticatedPage.getByRole('button', { name: 'Edit Subscription' }).click();
    await authenticatedPage.getByLabel('Frequency').selectOption('DAILY');
    await authenticatedPage.getByRole('button', { name: 'Update Subscription' }).click();

    // Verify subscription was updated
    await expect(authenticatedPage.getByText('DAILY')).toBeVisible();

    console.log('✅ Alert subscription and notification E2E test passed');
  });

  test('should test alert dashboard and filtering', async ({ authenticatedPage }) => {
    const alertPage = new AlertPage(authenticatedPage);

    // Navigate to alerts dashboard
    await alertPage.goto();
    await expect(authenticatedPage.locator('h1').filter({ hasText: 'Alerts' })).toBeVisible();

    // Test filtering by status
    await alertPage.filterAlerts({ status: 'ACTIVE' });
    await alertPage.verifyAlertStatus('Active');

    // Test filtering by severity
    await alertPage.filterAlerts({ severity: 'HIGH' });
    await expect(authenticatedPage.getByText('High')).toBeVisible();

    // Test filtering by type
    await alertPage.filterAlerts({ type: 'CUSTOM' });
    await expect(authenticatedPage.getByText('Custom')).toBeVisible();

    // Test bulk actions
    await alertPage.bulkAcknowledge();

    console.log('✅ Alert dashboard and filtering E2E test passed');
  });
});