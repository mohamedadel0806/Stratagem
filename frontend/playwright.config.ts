import { defineConfig, devices } from '@playwright/test';

/**
 * Clean Playwright configuration for E2E tests
 * Single source of truth for test configuration
 */

export default defineConfig({
  testDir: './e2e',
  fullyParallel: false, // Run sequentially to avoid conflicts
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1, // Single worker for debugging
  reporter: [['list']], // Simple reporter
  timeout: 30000, // 30 second test timeout
  expect: {
    timeout: 8000, // 8 second assertion timeout
  },
  use: {
    baseURL: process.env.FRONTEND_URL || 'http://localhost:3000',
    trace: 'off', // Disable traces for speed
    screenshot: 'only-on-failure',
    video: 'off', // Disable video for speed
    actionTimeout: 10000, // 10 second action timeout
    navigationTimeout: 20000, // 20 second navigation timeout
  },
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        headless: true, // Run headless for CI
      },
    },
  ],
  // Disable automatic webServer start for testing
  webServer: undefined,
});

