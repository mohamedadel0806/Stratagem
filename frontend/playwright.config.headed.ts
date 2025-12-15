import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: false, // Run one at a time
  forbidOnly: !!process.env.CI,
  retries: 0, // No retries for debugging
  workers: 1, // Single worker
  reporter: [['list']], // Simple console output
  timeout: 60000, // Longer timeout
  expect: {
    timeout: 15000, // 15 second assertion timeout
  },
  use: {
    baseURL: process.env.FRONTEND_URL || 'http://127.0.0.1:3000',
    trace: 'off',
    screenshot: 'only-on-failure',
    video: 'off',
    actionTimeout: 15000, // Longer action timeout
    navigationTimeout: 30000, // Longer navigation timeout
    headless: false, // Always show browser
    slowMo: 200, // Slow down actions
    viewport: { width: 1280, height: 720 },
  },
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        headless: false, // Force headed mode
        launchOptions: {
          args: ['--disable-blink-features=AutomationControlled'], // Hide automation
        },
      },
    },
  ],
  webServer: undefined, // Don't auto-start server
});