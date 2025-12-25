# Risk Module E2E Test Refactoring Summary

## Issues Fixed

### 1. ✅ Standardized Selector Strategy
**Issue:** Mixed selector strategies (`getByTestId`, `getByLabel`, `input[name]`) causing confusion.

**Fix:** 
- Created standardized approach using `getByTestId()` as primary selector strategy
- New helper class `TestWaiter` for consistent wait patterns
- Refactored `risk-register-page.refactored.ts` with consistent `getByTestId()` usage

**Files Created:**
- `frontend/e2e/helpers/test-waiter.ts` - Centralized wait management
- `frontend/e2e/pages/risk-register-page.refactored.ts` - Refactored page object

### 2. ✅ Fixed Test Isolation
**Issue:** Tests shared `createdRiskId` variable causing dependency issues.

**Fix:**
- Removed shared state variables
- Each test now creates its own test data via API
- Tests are fully independent and can run in any order

**Files Created:**
- `frontend/e2e/helpers/test-data-helper.ts` - Centralized test data management
- `frontend/e2e/risks/risk-pages-comprehensive.refactored.spec.ts` - Refactored test suite

### 3. ✅ Removed Hardcoded Risk IDs
**Issue:** Hardcoded UUIDs like `95d8a18a-1e1c-44ed-9eaa-25dfadac75b5`.

**Fix:**
- `TestDataHelper.findExistingRiskId()` - Finds first available risk
- `TestDataHelper.createTestRisk()` - Creates test risk programmatically
- All tests now use dynamic test data

### 4. ✅ Reduced Long Wait Times
**Issue:** Tests using `waitForTimeout(8000)` and longer delays.

**Fix:**
- Created `WAIT_CONSTANTS` with defined wait times (200ms, 500ms, 1000ms, 1500ms)
- `TestWaiter.forResponse()` - Waits for specific API responses instead of arbitrary timeouts
- Replaced all `waitForTimeout()` calls with proper `waitForSelector()` or response waiting

### 5. ✅ Cleaned Up Redundant Selector Fallbacks
**Issue:** Page objects trying 4+ strategies to find buttons.

**Fix:**
- Simplified to single `getByTestId()` approach
- Removed extensive fallback loops
- Cleaner, more maintainable code

### 6. ✅ Added Data Verification
**Issue:** Tests only checking dialog closes, not verifying data actually saved.

**Fix:**
- `TestDataHelper` provides API-level verification
- Tests now verify data via API after UI operations
- Added cleanup methods for proper test data management

### 7. ⚠️ Exploratory Test Files (Pending)
**Issue:** 28 files in `details/` folder, many are debug/exploratory.

**Recommended Files to Remove:**
- `basic-connectivity-check.spec.ts` - Exploratory connectivity test
- `risk-details-exploration.spec.ts` - Exploration test
- `form-submission-diagnosis.spec.ts` - Diagnostic/debug file
- `risk-details-assessments-debug.spec.ts` - Debug file
- `risk-id-comparison.spec.ts` - Diagnostic file

**Recommended Files to Consolidate:**
- `assessment-form-complete.spec.ts`, `assets-form-complete.spec.ts`, `controls-form-complete.spec.ts`, `kris-form-complete.spec.ts` → `form-complete-tests.spec.ts`
- `all-workflows-summary.spec.ts`, `final-workflow-summary.spec.ts` → `workflow-summary.spec.ts`
- `risk-details-all-forms.spec.ts`, `risk-details-all-tabs-forms-pom.spec.ts`, `risk-details-all-tabs-forms.spec.ts` → `risk-details-complete.spec.ts`

## New Helper Classes

### TestDataHelper
Location: `frontend/e2e/helpers/test-data-helper.ts`

Features:
- `findExistingRiskId()` - Finds first available risk
- `createTestRisk(data)` - Creates risk via API
- `createTestTreatment(riskId, data)` - Creates treatment via API
- `createTestKRI(data)` - Creates KRI via API
- `createTestAssessmentRequest(riskId, data)` - Creates assessment request via API
- `cleanupTestRisk(riskId)` - Deletes risk
- `cleanupTestTreatment(treatmentId)` - Deletes treatment
- `cleanupTestKRI(kriId)` - Deletes KRI
- `getAuthHeaders()` - Handles authentication for API calls

### TestWaiter
Location: `frontend/e2e/helpers/test-waiter.ts`

Features:
- `WAIT_CONSTANTS` - Standardized wait times
- `forResponse(page, urlPattern)` - Wait for specific API response
- `forAnyResponse(page, urlPatterns)` - Wait for any of multiple responses
- `forLoadState(page, state)` - Wait for page load state
- `wait(level)` - Simple wait with defined levels

## Refactored Test Files

### risk-pages-comprehensive.refactored.spec.ts
**Changes:**
- Each test creates its own test data via `TestDataHelper`
- No shared state variables
- Tests properly clean up after themselves
- Uses standardized wait times
- Verifies data via API

### risk-form.refactored.spec.ts
**Changes:**
- Uses `getByTestId()` consistently
- Replaced long waits with `WAIT_CONSTANTS`
- Data verification via API
- Form validation tests improved
- Cancellation tests improved

### risk-register-page.refactored.ts
**Changes:**
- Removed multiple selector fallback strategies
- Consistent `getByTestId()` usage
- Integrated `TestWaiter` for consistent waits
- Added `createAndVerifyRisk()` method using API

## Migration Guide

To migrate remaining test files:

1. **Replace selectors:**
   ```typescript
   // Old
   page.locator('input[name="title"]')
   
   // New
   page.getByTestId('risk-form-title-input')
   ```

2. **Replace long waits:**
   ```typescript
   // Old
   await page.waitForTimeout(8000);
   
   // New
   await waiter.forResponse(page, '/api/risks');
   // or
   await page.waitForSelector('[data-testid="risk-register-card-xyz"]', { timeout: 5000 });
   ```

3. **Create test data via API:**
   ```typescript
   const testDataHelper = new TestDataHelper(page, baseURL);
   const riskId = await testDataHelper.createTestRisk({ title: 'Test' });
   ```

4. **Clean up test data:**
   ```typescript
   await testDataHelper.cleanupTestRisk(riskId);
   ```

## Running Refactored Tests

```bash
# Run refactored comprehensive tests
npx playwright test frontend/e2e/risks/risk-pages-comprehensive.refactored.spec.ts

# Run refactored form tests
npx playwright test frontend/e2e/risks/forms/risk-form.refactored.spec.ts

# Run all risk tests with original files
npx playwright test frontend/e2e/risks
```

## Next Steps

1. Apply refactoring pattern to remaining test files
2. Add `data-testid` attributes to frontend components if missing
3. Clean up exploratory/debug test files
4. Consolidate similar test files
5. Update page object files to use `TestWaiter`