# Complete E2E Testing Guide

**Last Updated:** January 2025  
**Test Framework:** Playwright  
**Location:** `frontend/e2e/`

This guide provides comprehensive documentation for all E2E tests across all modules, including commands to run tests individually, by module, or all together, both in headless and browser (headed) modes.

---

## Table of Contents

1. [Quick Start](#quick-start)
2. [Running Tests - Overview](#running-tests---overview)
3. [Test Modules](#test-modules)
   - [Assets Module](#assets-module)
   - [Governance Module](#governance-module)
   - [Risks Module](#risks-module)
   - [Utility & Performance Tests](#utility--performance-tests)
4. [Running Commands Reference](#running-commands-reference)
5. [Test Structure](#test-structure)
6. [Authentication & Setup](#authentication--setup)
7. [Debugging & Troubleshooting](#debugging--troubleshooting)

---

## Quick Start

### Prerequisites

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
   Create `.env.test` in the `frontend` directory:
   ```env
   TEST_USER_EMAIL=admin@grcplatform.com
   TEST_USER_PASSWORD=password123
   FRONTEND_URL=http://localhost:3000
   ```

### Run All Tests

```bash
# Headless mode (fast, no browser visible)
cd frontend
npm run test:e2e

# Headed mode (see browser)
npm run test:e2e:headed

# UI mode (interactive)
npm run test:e2e:ui

# Debug mode (step through)
npm run test:e2e:debug
```

---

## Running Tests - Overview

### Run Modes

| Mode | Command | Description | Use Case |
|------|---------|-------------|----------|
| **Headless** | `npm run test:e2e` | Runs without visible browser | CI/CD, quick checks |
| **Headed** | `npm run test:e2e:headed` | Shows browser window | Debugging, verification |
| **UI Mode** | `npm run test:e2e:ui` | Interactive test runner | Test development |
| **Debug** | `npm run test:e2e:debug` | Step-through debugging | Troubleshooting failures |

### Running Individual Tests

All commands support filtering by test file, test name, or pattern:

```bash
# Run specific test file
npx playwright test e2e/governance/policies.spec.ts

# Run specific test file in browser
npx playwright test e2e/governance/policies.spec.ts --headed

# Run tests matching pattern
npx playwright test --grep "should create"

# Run tests matching pattern in browser
npx playwright test --grep "should create" --headed
```

---

## Test Modules

### Assets Module

**Location:** `e2e/assets/`

Tests for asset management including business applications, physical assets, software assets, information assets, and suppliers.

#### Form Tests

| Test File | Description | Tests |
|-----------|-------------|-------|
| `business-application-form-complete.spec.ts` | Complete business application form | Full form filling, all tabs |
| `business-application-form-fill-submit.spec.ts` | Business application form | Form submission flow |
| `physical-asset-form-complete.spec.ts` | Physical asset form | Complete form test |
| `physical-asset-form-fill-submit.spec.ts` | Physical asset form | Form submission |
| `physical-asset-form-dropdowns.spec.ts` | Physical asset dropdowns | Dropdown selection tests |
| `software-asset-form-fill-submit.spec.ts` | Software asset form | Form filling and submission |
| `information-asset-form-fill-submit.spec.ts` | Information asset form | Form filling and submission |
| `supplier-form-complete.spec.ts` | Supplier form | Complete supplier form test |
| `supplier-form-fill-submit.spec.ts` | Supplier form | Form submission |

#### Functional Tests

| Test File | Description | Tests |
|-----------|-------------|-------|
| `create-assets.spec.ts` | Asset creation | Creating various asset types |
| `edit-delete-assets.spec.ts` | Asset management | Edit and delete operations |
| `asset-search-filter.spec.ts` | Search and filtering | Search and filter functionality |
| `asset-dependencies.spec.ts` | Asset dependencies | Dependency management |
| `asset-import-export.spec.ts` | Import/Export | Import and export operations |
| `asset-tabs-interactions.spec.ts` | Tab interactions | Tab switching and navigation |
| `form-validation.spec.ts` | Form validation | Validation rules and error messages |
| `import-assets.spec.ts` | Asset import | Import functionality |

#### Debug/Development Tests

| Test File | Description |
|-----------|-------------|
| `business-app-create-submit.spec.ts` | Business app creation |
| `business-app-debug.spec.ts` | Debugging utilities |
| `business-app-getbylabel.spec.ts` | Selector testing |
| `business-app-inspect.spec.ts` | Element inspection |
| `business-app-regex-test.spec.ts` | Regex selector testing |
| `business-app-simple-test.spec.ts` | Simple test cases |
| `business-app-step-test.spec.ts` | Step-by-step testing |
| `business-app-verify-fill.spec.ts` | Form fill verification |
| `capture-form-errors.spec.ts` | Error capture |
| `debug-button-click.spec.ts` | Button click debugging |
| `test-form-dropdowns-simple.spec.ts` | Dropdown testing |

#### Running Asset Module Tests

```bash
# Run all asset tests (headless)
npx playwright test e2e/assets

# Run all asset tests in browser
npx playwright test e2e/assets --headed

# Run all asset tests in UI mode
npx playwright test e2e/assets --ui

# Run specific asset test
npx playwright test e2e/assets/business-application-form-complete.spec.ts --headed

# Run all form tests
npx playwright test e2e/assets/*-form-*.spec.ts

# Run form tests in browser
npx playwright test e2e/assets/*-form-*.spec.ts --headed
```

---

### Governance Module

**Location:** `e2e/governance/`

Tests for governance features including policies, controls, assessments, findings, evidence, influencers, and dashboard.

#### Page Tests

| Test File | Description | Tests |
|-----------|-------------|-------|
| `policies.spec.ts` | Policy Management | List, create, view, version comparison |
| `controls.spec.ts` | Control Library | List, create, view controls |
| `assessments.spec.ts` | Assessment Workspace | List, create, view assessments |
| `findings.spec.ts` | Findings Tracker | List, create, filter findings |
| `evidence.spec.ts` | Evidence Repository | List, view, file upload |
| `influencers.spec.ts` | Influencer Registry | List, create, search, filter |
| `dashboard.spec.ts` | Governance Dashboard | Dashboard metrics and widgets |

#### Form Tests

**Location:** `e2e/governance/forms/`

| Test File | Description | Tests |
|-----------|-------------|-------|
| `policy-form.spec.ts` | Policy Form | All tabs, validation, submission |
| `control-objective-form.spec.ts` | Control Objective Form | Creating control objectives |
| `unified-control-form.spec.ts` | Unified Control Form | Control creation and management |
| `assessment-form.spec.ts` | Assessment Form | Assessment creation |
| `finding-form.spec.ts` | Finding Form | Finding creation |
| `evidence-form.spec.ts` | Evidence Form | Evidence creation with files |
| `influencer-form.spec.ts` | Influencer Form | Influencer creation |

#### Running Governance Module Tests

```bash
# Run all governance tests (headless)
npx playwright test e2e/governance

# Run all governance tests in browser
npx playwright test e2e/governance --headed

# Run all governance tests in UI mode
npx playwright test e2e/governance --ui

# Run only page tests
npx playwright test e2e/governance/*.spec.ts

# Run only form tests
npx playwright test e2e/governance/forms

# Run only form tests in browser
npx playwright test e2e/governance/forms --headed

# Run specific governance test
npx playwright test e2e/governance/policies.spec.ts --headed

# Run specific form test
npx playwright test e2e/governance/forms/policy-form.spec.ts --headed
```

---

### Risks Module

**Location:** `e2e/risks/`

Tests for risk management including risk forms, analysis, and settings.

#### Test Files

| Test File | Description | Tests |
|-----------|-------------|-------|
| `risk-analysis.spec.ts` | Risk Analysis | Risk analysis features |
| `risk-settings.spec.ts` | Risk Settings | Risk configuration |

#### Form Tests

**Location:** `e2e/risks/forms/`

| Test File | Description | Tests |
|-----------|-------------|-------|
| `risk-form.spec.ts` | Risk Form | Complete risk form with all tabs:<br>- Basic Info tab<br>- Assessment tab<br>- Risk Scenario tab<br>- Risk score calculation<br>- Validation tests<br>- Form cancellation |

**Risk Form Test Coverage:**
- Full form submission (all tabs and fields)
- Required field validation
- Risk score calculation display
- Form cancellation handling
- Minimal required fields submission

#### Running Risks Module Tests

```bash
# Run all risk tests (headless)
npx playwright test e2e/risks

# Run all risk tests in browser
npx playwright test e2e/risks --headed

# Run all risk tests in UI mode
npx playwright test e2e/risks --ui

# Run only risk form tests
npx playwright test e2e/risks/forms

# Run only risk form tests in browser
npx playwright test e2e/risks/forms --headed

# Run specific risk test
npx playwright test e2e/risks/risk-analysis.spec.ts --headed

# Run risk form test
npx playwright test e2e/risks/forms/risk-form.spec.ts --headed

# Run specific risk form test case
npx playwright test e2e/risks/forms/risk-form.spec.ts -g "should fill all risk form tabs" --headed
```

---

### Utility & Performance Tests

**Location:** `e2e/` (root level)

#### Test Files

| Test File | Description | Tests |
|-----------|-------------|-------|
| `basic-connectivity.spec.ts` | Basic connectivity | Server connectivity and basic routes |
| `performance/asset-performance.spec.ts` | Performance tests | Asset page performance metrics |

#### Running Utility Tests

```bash
# Run connectivity test
npx playwright test e2e/basic-connectivity.spec.ts --headed

# Run performance tests
npx playwright test e2e/performance --headed
```

---

## Running Commands Reference

### By Module

#### All Assets Tests
```bash
# Headless
npx playwright test e2e/assets

# Browser (headed)
npx playwright test e2e/assets --headed

# UI mode
npx playwright test e2e/assets --ui

# Debug mode
npx playwright test e2e/assets --debug
```

#### All Governance Tests
```bash
# Headless
npx playwright test e2e/governance

# Browser (headed)
npx playwright test e2e/governance --headed

# UI mode
npx playwright test e2e/governance --ui

# Debug mode
npx playwright test e2e/governance --debug
```

#### All Risks Tests
```bash
# Headless
npx playwright test e2e/risks

# Browser (headed)
npx playwright test e2e/risks --headed

# UI mode
npx playwright test e2e/risks --ui

# Debug mode
npx playwright test e2e/risks --debug
```

### By Test Type

#### All Form Tests (All Modules)
```bash
# Headless
npx playwright test e2e/**/forms

# Browser (headed)
npx playwright test e2e/**/forms --headed

# UI mode
npx playwright test e2e/**/forms --ui
```

#### Only Asset Form Tests
```bash
npx playwright test e2e/assets/*-form*.spec.ts --headed
```

#### Only Governance Form Tests
```bash
npx playwright test e2e/governance/forms --headed
```

#### Only Risk Form Tests
```bash
npx playwright test e2e/risks/forms --headed
```

### By Specific Test File

#### Example: Risk Form Test
```bash
# Headless
npx playwright test e2e/risks/forms/risk-form.spec.ts

# Browser (headed)
npx playwright test e2e/risks/forms/risk-form.spec.ts --headed

# UI mode
npx playwright test e2e/risks/forms/risk-form.spec.ts --ui

# Debug mode
npx playwright test e2e/risks/forms/risk-form.spec.ts --debug
```

#### Example: Policy Form Test
```bash
npx playwright test e2e/governance/forms/policy-form.spec.ts --headed
```

#### Example: Business Application Form Test
```bash
npx playwright test e2e/assets/business-application-form-complete.spec.ts --headed
```

### By Test Name Pattern

```bash
# Run all tests with "should create" in the name
npx playwright test --grep "should create"

# Run in browser
npx playwright test --grep "should create" --headed

# Run all form validation tests
npx playwright test --grep "validation"

# Run all form submission tests
npx playwright test --grep "submit"
```

### Advanced Filtering

```bash
# Run tests matching multiple patterns (OR)
npx playwright test --grep "should create|should validate" --headed

# Run tests NOT matching a pattern
npx playwright test --grep-invert "debug" --headed

# Run specific test in specific file
npx playwright test e2e/risks/forms/risk-form.spec.ts -g "should fill all risk form tabs" --headed
```

---

## Test Structure

```
e2e/
├── fixtures/
│   ├── auth.ts              # Authentication fixtures
│   └── assets-data.ts       # Asset test data
├── utils/
│   ├── helpers.ts           # Test helper functions
│   ├── test-data.ts         # Test data fixtures
│   ├── dropdown-helpers.ts  # Dropdown interaction helpers
│   └── smart-waits.ts       # Smart wait utilities
├── assets/                  # Asset management tests
│   ├── *-form-*.spec.ts    # Asset form tests
│   ├── create-assets.spec.ts
│   ├── edit-delete-assets.spec.ts
│   ├── asset-search-filter.spec.ts
│   └── ... (many more)
├── governance/              # Governance module tests
│   ├── policies.spec.ts
│   ├── controls.spec.ts
│   ├── assessments.spec.ts
│   ├── findings.spec.ts
│   ├── evidence.spec.ts
│   ├── influencers.spec.ts
│   ├── dashboard.spec.ts
│   └── forms/              # Governance form tests
│       ├── policy-form.spec.ts
│       ├── control-objective-form.spec.ts
│       ├── unified-control-form.spec.ts
│       ├── assessment-form.spec.ts
│       ├── finding-form.spec.ts
│       ├── evidence-form.spec.ts
│       └── influencer-form.spec.ts
├── risks/                  # Risk management tests
│   ├── risk-analysis.spec.ts
│   ├── risk-settings.spec.ts
│   └── forms/             # Risk form tests
│       └── risk-form.spec.ts
├── performance/            # Performance tests
│   └── asset-performance.spec.ts
└── basic-connectivity.spec.ts
```

---

## Authentication & Setup

All tests use the `authenticatedPage` fixture which automatically handles login.

**Fixture Location:** `e2e/fixtures/auth.ts`

**Usage in Tests:**
```typescript
import { test, expect } from '../fixtures/auth';

test('my test', async ({ authenticatedPage }) => {
  // authenticatedPage is already logged in
  await authenticatedPage.goto('/en/dashboard/risks');
});
```

**Default Credentials:**
- Email: `admin@grcplatform.com`
- Password: `password123`

**Override with Environment Variables:**
```env
TEST_USER_EMAIL=your-email@example.com
TEST_USER_PASSWORD=your-password
```

---

## Debugging & Troubleshooting

### View Test Reports

```bash
# View HTML report after test run
npx playwright show-report

# Open report automatically after tests
npx playwright test --reporter=html
```

### Debug Specific Test

```bash
# Step through test execution
npx playwright test e2e/risks/forms/risk-form.spec.ts --debug

# Run with trace (records execution)
npx playwright test e2e/risks/forms/risk-form.spec.ts --trace on

# View trace
npx playwright show-trace
```

### Screenshots and Videos

Screenshots and videos are automatically saved to `test-results/` when tests fail.

```bash
# View screenshots
ls test-results/

# View videos
ls test-results/*/video.webm
```

### Common Issues

#### Tests Timeout

```bash
# Increase timeout for specific test
test.setTimeout(120000); // 2 minutes

# Run with longer timeout
npx playwright test --timeout=120000
```

#### Elements Not Found

- Use Playwright Inspector: `npx playwright codegen http://localhost:3000`
- Check selectors in browser dev tools
- Use `--headed` mode to see what's happening
- Check test-results screenshots

#### Authentication Fails

- Verify credentials in `.env.test`
- Check backend services are running
- Ensure test user has necessary permissions

### Generate Test Code

```bash
# Generate test code by interacting with browser
npm run test:e2e:codegen

# Or directly
npx playwright codegen http://localhost:3000
```

---

## NPM Scripts Reference

Available scripts in `package.json`:

| Script | Command | Description |
|--------|---------|-------------|
| `test:e2e` | `playwright test` | Run all tests (headless) |
| `test:e2e:ui` | `playwright test --ui` | Interactive test runner |
| `test:e2e:headed` | `playwright test --headed` | Run tests with visible browser |
| `test:e2e:debug` | `playwright test --debug` | Debug mode (step through) |
| `test:e2e:codegen` | `playwright codegen` | Generate test code |

### Custom Scripts

| Script | Command | Description |
|--------|---------|-------------|
| `test:dropdowns` | `playwright test e2e/assets/physical-asset-form-dropdowns.spec.ts` | Run dropdown tests |
| `test:dropdowns:ui` | `playwright test e2e/assets/physical-asset-form-dropdowns.spec.ts --ui` | Dropdown tests in UI mode |
| `test:dropdowns:headed` | `playwright test e2e/assets/physical-asset-form-dropdowns.spec.ts --headed` | Dropdown tests in browser |

---

## Test Guidelines

All tests follow the guidelines in `docs/PLAYWRIGHT_TESTING_ADVISORY.md`:

1. **Performance Optimization**
   - Use `waitForLoadState('domcontentloaded')` instead of `networkidle`
   - Appropriate delays between operations (100-300ms)

2. **Selector Strategy**
   - Text inputs: `input[name="fieldName"]`
   - Dropdowns: `getByLabel()` or role-based selectors
   - Checkboxes: `getByLabel()` or `input[type="checkbox"]`

3. **Form Filling**
   - Structured tab-based filling with clear logging
   - Screenshots before form submission
   - Success message verification

4. **Error Handling**
   - Check element existence before interaction
   - Graceful handling of optional fields
   - Clear error messages for debugging

---

## Test Coverage Summary

### Total Test Files: 53+

#### By Module:
- **Assets:** 25+ test files
- **Governance:** 14+ test files (7 page tests + 7 form tests)
- **Risks:** 3 test files (2 page tests + 1 form test)
- **Performance:** 1 test file
- **Utility:** 1+ test files

#### By Type:
- **Form Tests:** 15+ files
- **Page Tests:** 15+ files
- **Functional Tests:** 20+ files
- **Debug/Development Tests:** 10+ files

---

## Quick Command Cheat Sheet

```bash
# === RUN ALL TESTS ===
npm run test:e2e                    # Headless
npm run test:e2e:headed             # Browser
npm run test:e2e:ui                 # Interactive

# === RUN BY MODULE ===
npx playwright test e2e/assets --headed
npx playwright test e2e/governance --headed
npx playwright test e2e/risks --headed

# === RUN FORM TESTS ===
npx playwright test e2e/**/forms --headed
npx playwright test e2e/governance/forms --headed
npx playwright test e2e/risks/forms --headed

# === RUN SPECIFIC TEST ===
npx playwright test e2e/risks/forms/risk-form.spec.ts --headed
npx playwright test e2e/governance/forms/policy-form.spec.ts --headed

# === RUN BY PATTERN ===
npx playwright test --grep "should create" --headed
npx playwright test --grep "validation" --headed

# === DEBUG ===
npm run test:e2e:debug
npx playwright test e2e/risks/forms/risk-form.spec.ts --debug

# === REPORTS ===
npx playwright show-report
```

---

## Additional Resources

- **Playwright Testing Advisory:** `docs/PLAYWRIGHT_TESTING_ADVISORY.md`
- **E2E Test Setup:** `docs/E2E_TESTING_SETUP.md`
- **Test README:** `frontend/e2e/README.md`
- **Governance Forms README:** `frontend/e2e/governance/forms/README.md`
- **Risk Forms README:** `frontend/e2e/risks/forms/README.md`

---

**Last Updated:** January 2025  
**Maintained By:** Development Team  
**Questions?** Check the troubleshooting section or review the test files for examples.



