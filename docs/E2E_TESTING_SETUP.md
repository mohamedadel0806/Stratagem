# Frontend E2E Testing Setup Guide

## Overview

Frontend E2E (End-to-End) testing is now set up for the Governance Module using Playwright. This document provides instructions for setting up, running, and maintaining the E2E test suite.

## ✅ What's Been Set Up

### 1. Playwright Configuration
- ✅ Playwright installed and configured
- ✅ Test configuration in `frontend/playwright.config.ts`
- ✅ Automated browser setup
- ✅ Test server auto-start configuration

### 2. Test Infrastructure
- ✅ Authentication fixtures (`e2e/fixtures/auth.ts`)
- ✅ Helper utilities (`e2e/utils/helpers.ts`)
- ✅ Test data fixtures (`e2e/utils/test-data.ts`)

### 3. Test Suites Created
- ✅ Influencer Registry tests
- ✅ Policy Management tests (including version comparison)
- ✅ Control Library tests
- ✅ Assessment Workspace tests
- ✅ Findings Tracker tests
- ✅ Evidence Repository tests
- ✅ Governance Dashboard tests

## Installation

### Step 1: Install Dependencies

```bash
cd frontend
npm install
```

This will install Playwright and all required dependencies (already added to `package.json`).

### Step 2: Install Playwright Browsers

```bash
npx playwright install
```

This downloads the Chromium browser needed for tests.

### Step 3: Set Up Test Environment Variables

Create a `.env.test` file in the `frontend` directory:

```env
TEST_USER_EMAIL=test@example.com
TEST_USER_PASSWORD=your-test-password
FRONTEND_URL=http://localhost:3000
```

**Note:** Use a dedicated test user account for E2E tests. This account should have appropriate permissions to access all Governance Module features.

## Running Tests

### Run All Tests

```bash
cd frontend
npm run test:e2e
```

### Run Tests in UI Mode (Interactive)

```bash
npm run test:e2e:ui
```

This opens Playwright's UI mode where you can:
- See tests running in real-time
- Debug tests visually
- Rerun failed tests
- View test traces

### Run Tests in Headed Mode (See Browser)

```bash
npm run test:e2e:headed
```

Useful for debugging and seeing what the tests are doing.

### Run Specific Test File

```bash
npx playwright test e2e/governance/policies.spec.ts
```

### Run Tests Matching Pattern

```bash
npx playwright test --grep "should create"
```

### Debug Tests

```bash
npm run test:e2e:debug
```

Opens Playwright's debug mode with step-through debugging.

## Test Scripts Added to package.json

```json
{
  "test:e2e": "playwright test",
  "test:e2e:ui": "playwright test --ui",
  "test:e2e:headed": "playwright test --headed",
  "test:e2e:debug": "playwright test --debug",
  "test:e2e:codegen": "playwright codegen"
}
```

## CI/CD Integration

### GitHub Actions Example

Add this workflow file: `.github/workflows/e2e-tests.yml`

```yaml
name: E2E Tests

on:
  push:
    branches: [main, develop]
    paths:
      - 'frontend/**'
      - '.github/workflows/e2e-tests.yml'
  pull_request:
    branches: [main, develop]
    paths:
      - 'frontend/**'
      - '.github/workflows/e2e-tests.yml'

jobs:
  e2e-tests:
    runs-on: ubuntu-latest
    timeout-minutes: 30

    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_USER: postgres
          POSTGRES_PASSWORD: postgres
          POSTGRES_DB: grc_platform
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 5432:5432

      redis:
        image: redis:7
        options: >-
          --health-cmd "redis-cli ping"
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 6379:6379

    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
          cache-dependency-path: frontend/package-lock.json

      - name: Install Backend Dependencies
        working-directory: ./backend
        run: npm ci

      - name: Install Frontend Dependencies
        working-directory: ./frontend
        run: npm ci

      - name: Install Playwright Browsers
        working-directory: ./frontend
        run: npx playwright install --with-deps chromium

      - name: Build Backend
        working-directory: ./backend
        run: npm run build
        env:
          NODE_ENV: test

      - name: Start Services
        run: |
          docker-compose -f docker-compose.yml up -d postgres redis mongodb neo4j

      - name: Run Database Migrations
        working-directory: ./backend
        run: npm run migrate
        env:
          DATABASE_URL: postgresql://postgres:postgres@localhost:5432/grc_platform

      - name: Start Backend Server
        working-directory: ./backend
        run: npm run start:dev &
        env:
          NODE_ENV: test
          DATABASE_URL: postgresql://postgres:postgres@localhost:5432/grc_platform

      - name: Wait for Backend
        run: |
          timeout 60 bash -c 'until curl -f http://localhost:3001/health; do sleep 2; done'

      - name: Run E2E Tests
        working-directory: ./frontend
        run: npm run test:e2e
        env:
          TEST_USER_EMAIL: ${{ secrets.TEST_USER_EMAIL }}
          TEST_USER_PASSWORD: ${{ secrets.TEST_USER_PASSWORD }}
          FRONTEND_URL: http://localhost:3000
          CI: true

      - name: Upload Test Results
        uses: actions/upload-artifact@v4
        if: always()
        with:
          name: playwright-report
          path: frontend/playwright-report/
          retention-days: 30

      - name: Upload Test Videos
        uses: actions/upload-artifact@v4
        if: failure()
        with:
          name: test-videos
          path: frontend/test-results/
          retention-days: 7
```

### Required GitHub Secrets

Add these secrets to your GitHub repository:

- `TEST_USER_EMAIL`: Test user email address
- `TEST_USER_PASSWORD`: Test user password

### GitLab CI Example

Add to `.gitlab-ci.yml`:

```yaml
e2e-tests:
  stage: test
  image: node:18
  services:
    - postgres:15
    - redis:7
  variables:
    POSTGRES_DB: grc_platform
    POSTGRES_USER: postgres
    POSTGRES_PASSWORD: postgres
  before_script:
    - cd frontend
    - npm ci
    - npx playwright install --with-deps chromium
  script:
    - npm run test:e2e
  artifacts:
    when: always
    paths:
      - frontend/playwright-report/
    reports:
      junit: frontend/test-results/junit.xml
  only:
    - merge_requests
    - main
```

## Test Maintenance

### Adding New Tests

1. **Create test file** in `e2e/governance/` directory
2. **Use authentication fixtures**:
   ```typescript
   import { test, expect } from '../fixtures/auth';
   ```
3. **Use helper functions** from `e2e/utils/helpers.ts`
4. **Follow existing patterns** from other test files

### Updating Selectors

If UI changes break tests:

1. **Use Playwright codegen** to generate new selectors:
   ```bash
   npm run test:e2e:codegen
   ```
2. **Use data-testid attributes** in components for stable selectors
3. **Use role-based selectors** when possible (more accessible)

### Debugging Failed Tests

1. **View HTML report**:
   ```bash
   npx playwright show-report
   ```
2. **View trace**:
   ```bash
   npx playwright show-trace trace.zip
   ```
3. **Run in debug mode**:
   ```bash
   npm run test:e2e:debug
   ```

## Best Practices

1. **Keep tests independent** - Each test should work in isolation
2. **Clean up test data** - Delete entities created during tests
3. **Use meaningful test names** - Test names should describe what they verify
4. **Wait for elements** - Playwright auto-waits, but use explicit waits when needed
5. **Use fixtures** - Reuse authentication and setup code
6. **Test user flows** - Focus on complete user journeys, not just individual features

## Next Steps

### Immediate Actions Required

1. **Install Playwright**:
   ```bash
   cd frontend
   npm install
   npx playwright install
   ```

2. **Create test user** in your system with appropriate permissions

3. **Set up environment variables** in `.env.test`

4. **Run a test** to verify setup:
   ```bash
   npm run test:e2e -- e2e/governance/dashboard.spec.ts
   ```

### Future Enhancements

- [ ] Add visual regression testing
- [ ] Implement Page Object Model pattern
- [ ] Add API mocking for faster tests
- [ ] Add performance testing
- [ ] Set up test data seeding/cleanup utilities
- [ ] Add accessibility testing
- [ ] Add mobile viewport tests

## Troubleshooting

### Tests Fail to Start

- Check if dev server is running on port 3000
- Verify environment variables are set
- Check Playwright browser installation: `npx playwright --version`

### Authentication Fails

- Verify test user credentials
- Check if backend auth service is running
- Ensure test user has proper permissions

### Timeout Errors

- Increase timeout in test: `test.setTimeout(60000)`
- Check network connectivity
- Verify backend services are responding

### Selectors Not Found

- Use Playwright's trace viewer to see what happened
- Check if page has fully loaded
- Verify selectors are correct for current UI

## Support

For issues or questions:
- Check Playwright documentation: https://playwright.dev
- Review test examples in `e2e/governance/`
- Check Playwright trace files for debugging





