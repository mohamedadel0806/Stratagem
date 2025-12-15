import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: false, // Run sequentially
  forbidOnly: !!process.env.CI,
  retries: 0, // No retries
  workers: 1, // Single worker
  reporter: [['list']], // Simple output
  timeout: 45000, // Longer timeout
  expect: {
    timeout: 10000, // 10 second assertion timeout
  },
  use: {
    baseURL: process.env.FRONTEND_URL || 'http://127.0.0.1:3000',
    trace: 'off',
    screenshot: 'only-on-failure',
    video: 'off',
    actionTimeout: 8000, // Shorter action timeout
    navigationTimeout: 15000, // Shorter navigation timeout
    headless: false, // Show browser
    slowMo: 100, // Slow down a bit
  },
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        headless: false,
      },
    },
  ],
  webServer: undefined, // Don't auto-start server
});