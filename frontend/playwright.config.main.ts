import { defineConfig, devices } from '@playwright/test';

/**
 * Main Playwright configuration for E2E testing
 * This is the primary configuration file that should be used
 */

export default defineConfig({
  testDir: './e2e',
  fullyParallel: process.env.CI ? true : false, // Don't run in parallel locally
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : 1, // Always use 1 worker for better session management
  reporter: [
    ['html'],
    process.env.CI ? ['github'] : ['list'],
  ],
  use: {
    baseURL: process.env.FRONTEND_URL || 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'on',
    actionTimeout: 10000,
    navigationTimeout: 30000,
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  /* Run your local dev server before starting the tests */
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: true,
    timeout: 120 * 1000,
    stdout: 'ignore',
    stderr: 'pipe',
  },
});