# Playwright Test Documentation

This folder contains all documentation related to Playwright E2E testing for the GRC Platform.

## Documentation Files

### Test Setup & Configuration
- **TEST_AUTOMATION_SETUP.md** - Comprehensive guide on setting up and running Playwright tests
- **TEST_AUTOMATION_SUMMARY.md** - High-level summary of test automation implementation

### Test Results & Fixes
- **TEST_RESULTS_DROPDOWNS.md** - Manual testing steps and results for dropdown implementations
- **DROPDOWN_IMPLEMENTATION_FIXES.md** - Issues found and fixes applied for dropdown fields
- **BUSINESS_UNIT_DROPDOWN_FIX.md** - Root cause analysis and fix for empty business unit dropdown
- **PHYSICAL_ASSET_FORM_COMPLETE_TEST.md** - Complete test suite documentation for physical asset form

## Test Files Location

The actual Playwright test files are located in:
- `frontend/e2e/assets/` - Asset-related E2E tests
- `frontend/e2e/utils/` - Test utilities and helpers

## Quick Start

1. **Run all dropdown tests:**
   ```bash
   cd frontend
   npm run test:dropdowns
   ```

2. **Run complete form test:**
   ```bash
   cd frontend
   npx playwright test e2e/assets/physical-asset-form-fill-submit.spec.ts
   ```

3. **Run tests in UI mode:**
   ```bash
   cd frontend
   npx playwright test --ui
   ```

## Related Documentation

- See `frontend/e2e/assets/README-DROPDOWN-TESTS.md` for test-specific documentation
- See `frontend/playwright.config.ts` for Playwright configuration
