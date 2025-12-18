# Frontend E2E Testing with Playwright

This directory contains end-to-end (E2E) tests for the Governance Module frontend application using Playwright.

## Overview

The E2E tests cover all major Governance Module features:
- ✅ Influencer Registry
- ✅ Policy Management (including version comparison)
- ✅ Control Library
- ✅ Assessment Workspace
- ✅ Findings Tracker
- ✅ Evidence Repository
- ✅ Governance Dashboard

## Prerequisites

1. **Install dependencies:**
   ```bash
   cd frontend
   npm install
   ```

2. **Install Playwright browsers:**
   ```bash
   npx playwright install
   ```

3. **Set up environment variables:**
   Create a `.env.test` file in the `frontend` directory with:
   ```env
   TEST_USER_EMAIL=your-test-user@example.com
   TEST_USER_PASSWORD=your-test-password
   FRONTEND_URL=http://localhost:3000
   ```

## Running Tests

### Run all E2E tests:
```bash
npm run test:e2e
```

### Run tests in UI mode (interactive):
```bash
npm run test:e2e:ui
```

### Run tests in headed mode (see browser):
```bash
npm run test:e2e:headed
```

### Run tests in debug mode:
```bash
npm run test:e2e:debug
```

### Run specific test file:
```bash
npx playwright test e2e/governance/policies.spec.ts
```

### Run tests matching a pattern:
```bash
npx playwright test --grep "should create"
```

## Test Structure

```
e2e/
├── fixtures/
│   └── auth.ts              # Authentication fixtures
├── utils/
│   ├── helpers.ts           # Test helper functions
│   └── test-data.ts         # Test data fixtures
├── governance/
│   ├── influencers.spec.ts  # Influencer Registry tests
│   ├── policies.spec.ts     # Policy Management tests
│   ├── controls.spec.ts     # Control Library tests
│   ├── assessments.spec.ts  # Assessment Workspace tests
│   ├── findings.spec.ts     # Findings Tracker tests
│   ├── evidence.spec.ts     # Evidence Repository tests
│   └── dashboard.spec.ts    # Dashboard tests
└── README.md                # This file
```

## Writing Tests

### Using Authentication Fixtures

All tests use the `authenticatedPage` fixture which automatically logs in:

```typescript
import { test, expect } from '../fixtures/auth';

test('my test', async ({ authenticatedPage }) => {
  // authenticatedPage is already logged in
  await authenticatedPage.goto('/dashboard/governance/policies');
});
```

### Helper Functions

Use helper functions from `utils/helpers.ts`:

```typescript
import { navigateToGovernancePage, waitForTable, fillForm } from '../utils/helpers';

// Navigate to a governance page
await navigateToGovernancePage(authenticatedPage, 'policies');

// Wait for table to load
await waitForTable(authenticatedPage);

// Fill form fields
await fillForm(authenticatedPage, {
  title: 'My Policy',
  status: 'draft',
});
```

### Test Data

Use test data fixtures from `utils/test-data.ts`:

```typescript
import { testPolicy } from '../utils/test-data';

// Use predefined test data
const policy = { ...testPolicy, title: 'Custom Title' };
```

## Configuration

Playwright configuration is in `playwright.config.ts` at the root of the frontend directory.

Key settings:
- **Base URL**: Configured via `FRONTEND_URL` environment variable (default: `http://localhost:3000`)
- **Browsers**: Tests run on Chromium by default
- **Retries**: 2 retries on CI, 0 locally
- **Web Server**: Automatically starts Next.js dev server before tests

## CI/CD Integration

### GitHub Actions Example

```yaml
name: E2E Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: |
          cd frontend
          npm ci
          npx playwright install --with-deps
      
      - name: Run E2E tests
        run: |
          cd frontend
          npm run test:e2e
        env:
          TEST_USER_EMAIL: ${{ secrets.TEST_USER_EMAIL }}
          TEST_USER_PASSWORD: ${{ secrets.TEST_USER_PASSWORD }}
          FRONTEND_URL: http://localhost:3000
      
      - uses: actions/upload-artifact@v3
        if: always()
        with:
          name: playwright-report
          path: frontend/playwright-report/
```

## Debugging Tests

### View Test Reports

After running tests, view the HTML report:
```bash
npx playwright show-report
```

### Debug in VS Code

1. Install the [Playwright Test for VS Code](https://marketplace.visualstudio.com/items?itemName=ms-playwright.playwright) extension
2. Use the debugger from the test file
3. Set breakpoints and step through code

### Debug with Browser DevTools

Run tests in debug mode:
```bash
npm run test:e2e:debug
```

### Generate Code

Use Playwright codegen to generate test code:
```bash
npm run test:e2e:codegen
```

## Best Practices

1. **Use Page Object Model** for complex pages (future enhancement)
2. **Keep tests independent** - each test should be able to run in isolation
3. **Use data-testid attributes** in your components for reliable selectors
4. **Wait for elements** - use Playwright's auto-waiting features
5. **Clean up test data** - delete created entities after tests
6. **Use fixtures** for common setup/teardown
7. **Write descriptive test names** - test names should describe what they test

## Troubleshooting

### Tests fail with timeout errors

- Check if the dev server is running
- Verify environment variables are set correctly
- Increase timeout in test if needed: `test.setTimeout(60000)`

### Authentication fails

- Verify test user credentials in `.env.test`
- Check if authentication endpoints are working
- Ensure backend services are running

### Elements not found

- Use Playwright's trace viewer to see what happened: `npx playwright show-trace`
- Check if selectors are correct
- Verify page has fully loaded before interacting

## Next Steps

- [ ] Add more comprehensive test coverage
- [ ] Implement Page Object Model pattern
- [ ] Add visual regression testing
- [ ] Add performance testing
- [ ] Set up test data seeding/cleanup utilities
- [ ] Add API mocking for faster tests





