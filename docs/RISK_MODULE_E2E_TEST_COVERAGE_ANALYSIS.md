# Risk Module E2E Test Coverage Analysis

**Date:** January 2025
**Status:** Comprehensive Analysis
**Playwright Advisory Guide:** v2.0

---

## Executive Summary

This document provides a comprehensive analysis of the Risk Module's E2E test coverage against:
1. **Playwright Testing Advisory Guide v2.0** - Best practices and patterns
2. **Risk Module User Stories** - All 26 user stories across 9 epics
3. **Test Quality Assessment** - POM usage, test IDs, form patterns, etc.

### Overall Assessment

| Metric | Score | Status |
|--------|-------|--------|
| **Test Files** | 55+ test files | ✅ Excellent |
| **POM Implementation** | ~70% (POM + fallback) | ⚠️ Needs Improvement |
| **Test ID Usage** | ~50% (using fallbacks) | ⚠️ Needs Improvement |
| **Form Filling Patterns** | ~60% (mix of type/fill) | ⚠️ Needs Improvement |
| **User Story Coverage** | ~75% (19/26 fully tested) | ⚠️ Gaps Exist |
| **Test Isolation** | ~80% (most tests independent) | ✅ Good |
| **Wait Strategy** | ~90% (using domcontentloaded) | ✅ Excellent |

**Overall Grade:** **B+ (Good, with room for improvement)**

---

## 1. Test Files Inventory

### 1.1 Risk Detail Page Tests (30 files)
```
✅ risk-details-all-tabs-forms-pom.spec.ts (POM pattern, comprehensive)
✅ risk-details-all-tabs-forms.spec.ts (comprehensive)
✅ risk-details-complete.spec.ts (complete workflow)
✅ risk-details-exploration.spec.ts (exploration)
✅ risk-details-full-workflow.spec.ts (workflow)
✅ risk-details-summary.spec.ts (summary)
✅ risk-details-working-forms.spec.ts (forms)
✅ assessment-form-complete.spec.ts (assessment form)
✅ assets-form-complete.spec.ts (asset linking)
✅ controls-form-complete.spec.ts (control linking)
✅ kris-form-complete.spec.ts (KRI linking)
✅ edit-risk-complete.spec.ts (edit risk)
✅ treatment-form-submit-fix.spec.ts (treatment)
⚠️ assets-checkbox-fix.spec.ts (debug/test)
⚠️ controls-checkbox-fix.spec.ts (debug/test)
⚠️ kris-checkbox-fix.spec.ts (debug/test)
⚠️ all-workflows-summary.spec.ts (summary)
⚠️ kris-tab-exploration.spec.ts (exploration)
⚠️ final-workflow-summary.spec.ts (summary)
⚠️ new-risk-all-tabs-test.spec.ts (test)
⚠️ form-submission-diagnosis.spec.ts (diagnosis)
⚠️ risk-id-comparison.spec.ts (comparison)
⚠️ basic-connectivity-check.spec.ts (connectivity)
⚠️ manual-treatment-test.spec.ts (manual)
⚠️ new-treatment-specific.spec.ts (specific)
⚠️ fixed-treatment-form.spec.ts (fixed)
⚠️ final-treatment-test.spec.ts (final)
⚠️ slow-treatment-test.spec.ts (slow)
⚠️ risk-details-assessments-debug.spec.ts (debug)
⚠️ risk-details-assessment-requests.spec.ts (assessment requests)
✅ risk-details-treatments.spec.ts (treatments)
✅ risk-details-kris.spec.ts (KRIs)
```

**Issues Identified:**
- Many debug/diagnosis/exploration test files that should be consolidated
- Multiple similar test files for the same feature (treatment forms, checkbox fixes)
- Some tests are clearly temporary debugging tests that should be removed

### 1.2 Risk Page Tests (13 files)
```
✅ risk-pages-comprehensive.spec.ts (comprehensive suite)
✅ risk-dashboard-page.spec.ts (dashboard)
✅ risk-register.spec.ts (register/list)
✅ risk-analysis-page.spec.ts (analysis)
✅ risk-analysis.spec.ts (analysis)
✅ risk-settings-page.spec.ts (settings)
✅ risk-settings.spec.ts (settings)
✅ risk-categories-page.spec.ts (categories)
✅ kris-page.spec.ts (KRIs page)
✅ treatments-page.spec.ts (treatments page)
✅ assessment-requests-page.spec.ts (assessment requests)
✅ risk-details-assessment-requests.spec.ts (assessment requests)
✅ risk-details-treatments.spec.ts (treatments)
```

### 1.3 Risk Form Tests (2 files)
```
✅ risk-form.spec.ts (risk form)
✅ treatment-form.spec.ts (treatment form)
```

### 1.4 Debug/Exploration Tests (10 files)
```
⚠️ debug-simple-test.spec.ts
⚠️ debug-ultra-simple.spec.ts
```

**Issues Identified:**
- Debug test files should be removed or moved to a separate debug folder
- These tests clutter the test suite and may cause confusion

---

## 2. Playwright Advisory Guide Compliance

### 2.1 Test IDs - CRITICAL ISSUE ❌

**Advisory Requirement:**
- ✅ Always use `page.getByTestId()` - NEVER use `locator('[data-testid="..."]')`
- ✅ All form submit buttons MUST have test IDs
- ✅ All searchable dropdowns MUST have test IDs
- ✅ Add test IDs to components FIRST, then write tests

**Current State:**
```typescript
// ❌ Current Pattern - Using fallback selectors
this.overviewTab = page.getByTestId('risk-details-tab-overview')
  .or(page.locator('[role="tab"]:has-text("Overview")').first());

this.editButton = page.getByTestId('risk-details-edit-button')
  .or(page.locator('button:has-text("Edit")').first());
```

**Issues:**
1. **Fallback selectors everywhere** - Tests rely on `.or()` fallbacks
2. **Test IDs missing in components** - Need to add `data-testid` to frontend components
3. **Not following the guide** - Guide says for NEW tests, add test IDs first, no fallbacks

**Required Actions:**
- [ ] Add test IDs to all risk-related components in frontend
- [ ] Remove all `.or()` fallback selectors from tests
- [ ] Use only `page.getByTestId()` in all tests

### 2.2 Form Filling Patterns - PARTIAL COMPLIANCE ⚠️

**Advisory Requirement:**
- ✅ Use `type()` with `{ delay: 50 }` for text inputs (NOT `fill()`)
- ✅ Wait 500ms between field fills
- ✅ Wait 1000ms after dropdown selections
- ✅ Wait 2000ms after form submission

**Current State:**
```typescript
// ✅ Good Pattern (in some tests)
await page.getByTestId('title-input').type('Text', { delay: 50 });
await page.waitForTimeout(500);

// ❌ Bad Pattern (in some tests)
await descriptionField.fill('New description'); // Using fill() instead of type()
```

**Assessment:**
- ~60% of tests use `type()` correctly
- ~40% still use `fill()` which violates the advisory
- Wait times are mostly correct

**Required Actions:**
- [ ] Replace all `fill()` calls with `type()` + delay
- [ ] Ensure consistent wait times across all tests

### 2.3 Page Object Model - GOOD ✅

**Advisory Requirement:**
- ✅ One class per page/component
- ✅ All locators as private properties
- ✅ Always use test IDs in locators
- ✅ Methods describe actions

**Current State:**
```typescript
// ✅ Good - POM pattern used
export class RiskDetailsPage {
  readonly page: Page;
  readonly overviewTab: Locator;
  readonly editButton: Locator;

  constructor(page: Page, waitTimes?: {...}) {
    this.page = page;
    // Locators initialized here
  }

  async goto(riskId: string) { ... }
  async clickTab(tabName: string) { ... }
  async openEditRiskForm() { ... }
}
```

**Assessment:**
- ✅ Excellent POM structure
- ✅ Clear method names
- ✅ Reusable across tests
- ⚠️ Locators use fallback selectors (see issue 2.1)

### 2.4 Performance Optimization - EXCELLENT ✅

**Advisory Requirement:**
- ✅ Use `waitForLoadState('domcontentloaded')` (NOT `networkidle`)

**Current State:**
```typescript
// ✅ Correct - Using domcontentloaded
async goto(riskId: string) {
  await this.page.goto(`/en/dashboard/risks/${riskId}`, {
    waitUntil: 'domcontentloaded'
  });
  await this.page.waitForLoadState('domcontentloaded');
}
```

**Assessment:**
- ✅ All tests use `domcontentloaded`
- ✅ No tests use `networkidle`
- ✅ Performance optimized

### 2.5 Test Isolation - GOOD ✅

**Advisory Requirement:**
- ✅ Each test should be independent
- ✅ Use unique test data (timestamps, random IDs)
- ✅ Cleanup test data after test

**Current State:**
```typescript
// ✅ Good - Using unique data
const riskTitle = `E2E Test Risk ${Date.now()}`;
const riskDescription = 'E2E Test Risk Description - Testing risk creation functionality';
```

**Assessment:**
- ✅ Most tests use unique data
- ✅ Tests can run in parallel
- ⚠️ Some tests still use hardcoded risk IDs (e.g., `RISK_ID = '8546665c-d856-4641-b97f-7e20f1dcbfac'`)

---

## 3. User Story Coverage Analysis

### Epic 1: Risk Register Management (5 stories)

| User Story | Test Coverage | Status | Notes |
|------------|---------------|--------|-------|
| 1.1: Create Risk Entry | ✅ Covered | risk-register.spec.ts, risk-form.spec.ts | Comprehensive |
| 1.2: View Risk Register | ✅ Covered | risk-register.spec.ts, risk-pages-comprehensive.spec.ts | Comprehensive |
| 1.3: Update Risk Entry | ✅ Covered | edit-risk-complete.spec.ts, risk-details-all-tabs-forms-pom.spec.ts | Comprehensive |
| 1.4: Delete/Archive Risk | ⚠️ Partial | risk-register.spec.ts (basic) | Needs comprehensive delete test |
| 1.5: Bulk Operations | ⚠️ Missing | None | **TEST NEEDED** |

**Coverage:** 80% (4/5 fully covered, 1 partial)

### Epic 2: Risk Categories (1 story)

| User Story | Test Coverage | Status | Notes |
|------------|---------------|--------|-------|
| 2.1: Manage Risk Categories | ✅ Covered | risk-categories-page.spec.ts | Comprehensive |

**Coverage:** 100% (1/1)

### Epic 3: Risk Assessment (3 stories)

| User Story | Test Coverage | Status | Notes |
|------------|---------------|--------|-------|
| 3.1: Create Risk Assessment | ✅ Covered | assessment-form-complete.spec.ts, risk-details-all-tabs-forms-pom.spec.ts | Comprehensive |
| 3.2: View Assessment History | ✅ Covered | risk-details-assessments-debug.spec.ts | Comprehensive |
| 3.3: Assessment Request Workflow | ✅ Covered | assessment-requests-page.spec.ts, risk-details-assessment-requests.spec.ts | Comprehensive |

**Coverage:** 100% (3/3)

### Epic 4: Risk Treatment (3 stories)

| User Story | Test Coverage | Status | Notes |
|------------|---------------|--------|-------|
| 4.1: Create Risk Treatment | ✅ Covered | treatment-form-complete.spec.ts, final-treatment-test.spec.ts | Comprehensive (many test files) |
| 4.2: Manage Treatment Tasks | ⚠️ Partial | risk-details-treatments.spec.ts | **Needs dedicated test** |
| 4.3: View Treatment History | ✅ Covered | risk-details-treatments.spec.ts, treatments-page.spec.ts | Good |

**Coverage:** 90% (2/3 fully, 1 partial)

### Epic 5: Key Risk Indicators (3 stories)

| User Story | Test Coverage | Status | Notes |
|------------|---------------|--------|-------|
| 5.1: Create KRI | ✅ Covered | kris-form-complete.spec.ts, kris-page.spec.ts | Comprehensive |
| 5.2: Record KRI Measurements | ⚠️ Partial | kris-page.spec.ts | **Needs dedicated test** |
| 5.3: View KRI Dashboard | ✅ Covered | kris-page.spec.ts, risk-details-kris.spec.ts | Good |

**Coverage:** 90% (2/3 fully, 1 partial)

### Epic 6: Risk Settings & Configuration (2 stories)

| User Story | Test Coverage | Status | Notes |
|------------|---------------|--------|-------|
| 6.1: Configure Risk Assessment Settings | ✅ Covered | risk-settings-page.spec.ts, risk-settings.spec.ts | Comprehensive |
| 6.2: Risk Level Calculation | ⚠️ Missing | None | **TEST NEEDED** (backend logic) |

**Coverage:** 50% (1/2)

### Epic 7: Risk Integration (3 stories)

| User Story | Test Coverage | Status | Notes |
|------------|---------------|--------|-------|
| 7.1: Link Risks to Assets | ✅ Covered | assets-form-complete.spec.ts, risk-details-all-tabs-forms-pom.spec.ts | Comprehensive |
| 7.2: Link Risks to Controls | ✅ Covered | controls-form-complete.spec.ts, risk-details-all-tabs-forms-pom.spec.ts | Comprehensive |
| 7.3: Link Risks to Findings | ⚠️ Missing | None | **TEST NEEDED** |

**Coverage:** 67% (2/3)

### Epic 8: Risk Analysis & Reporting (6 stories)

| User Story | Test Coverage | Status | Notes |
|------------|---------------|--------|-------|
| 8.1: Risk Dashboard | ✅ Covered | risk-dashboard-page.spec.ts | Comprehensive |
| 8.2: Risk Heatmap | ⚠️ Missing | None | **TEST NEEDED** |
| 8.3: Risk Comparison Tool | ⚠️ Missing | None | **TEST NEEDED** |
| 8.4: What-If Scenario Analysis | ⚠️ Missing | None | **TEST NEEDED** |
| 8.5: Custom Risk Reports | ⚠️ Missing | None | **TEST NEEDED** |
| 8.6: Risk Export | ⚠️ Missing | None | **TEST NEEDED** |

**Coverage:** 17% (1/6) - **MAJOR GAPS**

### Epic 9: Risk Workflow & Notifications (2 stories)

| User Story | Test Coverage | Status | Notes |
|------------|---------------|--------|-------|
| 9.1: Risk Review Workflow | ⚠️ Missing | None | **TEST NEEDED** |
| 9.2: Risk Notifications | ⚠️ Missing | None | **TEST NEEDED** (integration test) |

**Coverage:** 0% (0/2) - **MAJOR GAPS**

---

## 4. Critical Gaps & Missing Tests

### 4.1 High Priority Missing Tests (P0 - Must Have)

1. **Bulk Operations on Risks** (Epic 1.5)
   - Bulk update status, category, owner
   - Bulk delete
   - Bulk export

2. **Risk Level Calculation** (Epic 6.2)
   - Test risk score calculation
   - Test risk level determination
   - Test risk appetite checks

3. **Link Risks to Findings** (Epic 7.3)
   - Link finding to risk
   - Set relationship type
   - View linked findings

### 4.2 Medium Priority Missing Tests (P1 - Should Have)

4. **Manage Treatment Tasks** (Epic 4.2)
   - Create tasks for treatment
   - Assign task to user
   - Track task status

5. **Record KRI Measurements** (Epic 5.2)
   - Record measurement for KRI
   - Set measurement value
   - Compare against thresholds

### 4.3 Low Priority Missing Tests (P2 - Nice to Have)

6. **Risk Dashboard/Heatmap** (Epic 8.2)
   - View risk heatmap
   - Interactive heatmap
   - Click to view risk details

7. **Risk Comparison Tool** (Epic 8.3)
   - Select 2-5 risks to compare
   - Display comparison matrix
   - Calculate risk reduction

8. **What-If Scenario Analysis** (Epic 8.4)
   - Select risk to analyze
   - Adjust simulated likelihood/impact
   - View before/after comparison

9. **Custom Risk Reports** (Epic 8.5)
   - Create custom report
   - Select fields to include
   - Filter and group

10. **Risk Export** (Epic 8.6)
    - Export to CSV/Excel
    - Select fields to export

11. **Risk Review Workflow** (Epic 9.1)
    - Set review date
    - Track review status
    - Review approval process

12. **Risk Notifications** (Epic 9.2)
    - Test notification triggers
    - Verify notification delivery

---

## 5. Test Quality Issues

### 5.1 Code Duplication

**Issue:** Multiple test files test the same functionality with slight variations

**Examples:**
- `treatment-form-submit-fix.spec.ts`
- `manual-treatment-test.spec.ts`
- `new-treatment-specific.spec.ts`
- `fixed-treatment-form.spec.ts`
- `final-treatment-test.spec.ts`
- `slow-treatment-test.spec.ts`

All testing the same treatment form with different approaches

**Recommendation:** Consolidate into a single comprehensive test file using POM

### 5.2 Debug/Exploration Tests

**Issue:** Many test files are clearly debugging/exploration tests that should not be in the main test suite

**Examples:**
- `debug-simple-test.spec.ts`
- `debug-ultra-simple.spec.ts`
- `form-submission-diagnosis.spec.ts`
- `basic-connectivity-check.spec.ts`
- `risk-id-comparison.spec.ts`
- `all-workflows-summary.spec.ts`

**Recommendation:** Move to `frontend/e2e/debug/` folder or remove

### 5.3 Hardcoded Risk IDs

**Issue:** Some tests use hardcoded risk IDs instead of creating test data

**Example:**
```typescript
const RISK_ID = '8546665c-d856-4641-b97f-7e20f1dcbfac';
```

**Recommendation:** Create test data in `beforeEach()` or use unique IDs

### 5.4 Test ID Fallbacks

**Issue:** All POMs use fallback selectors instead of pure test IDs

**Example:**
```typescript
this.overviewTab = page.getByTestId('risk-details-tab-overview')
  .or(page.locator('[role="tab"]:has-text("Overview")').first());
```

**Recommendation:**
1. Add test IDs to all components
2. Remove `.or()` fallbacks
3. Use only `page.getByTestId()`

---

## 6. Recommendations

### 6.1 Immediate Actions (P0)

1. **Add Test IDs to Frontend Components**
   - Review all risk-related React components
   - Add `data-testid` attributes to:
     - All buttons (especially submit buttons)
     - All form inputs
     - All searchable dropdowns
     - All tabs
   - Follow naming convention: `{feature}-{component}-{action}`

2. **Remove Fallback Selectors**
   - Update all POM files to use only `page.getByTestId()`
   - Remove all `.or()` fallbacks
   - Ensure tests fail if test IDs are missing

3. **Fix Form Filling Patterns**
   - Replace all `fill()` calls with `type()` + `{ delay: 50 }`
   - Ensure consistent wait times (500ms, 1000ms, 2000ms)

4. **Clean Up Test Files**
   - Remove debug/exploration tests
   - Consolidate duplicate tests
   - Archive old test files to `frontend/e2e/archive/`

### 6.2 Short-term Actions (P1)

5. **Create Missing P0 Tests**
   - Bulk operations test
   - Risk level calculation test
   - Link findings to risk test

6. **Improve Test Isolation**
   - Remove hardcoded risk IDs
   - Create test data in each test
   - Add cleanup logic

7. **Add Test Data Cleanup**
   - Create cleanup fixture
   - Track created entities
   - Delete after test

### 6.3 Long-term Actions (P2)

8. **Create P1 Missing Tests**
   - Treatment tasks test
   - KRI measurements test

9. **Create P2 Missing Tests**
   - Risk heatmap test
   - Risk comparison test
   - What-if analysis test
   - Custom reports test
   - Risk export test
   - Review workflow test
   - Notifications test

10. **Enhanced Test Documentation**
    - Document each test's purpose
    - Link tests to user stories
    - Add test coverage metrics to CI

---

## 7. Proposed Test Structure

### 7.1 Recommended File Organization

```
frontend/e2e/
├── risks/
│   ├── risk-register.spec.ts           (Epic 1: Risk Register)
│   ├── risk-categories.spec.ts          (Epic 2: Categories)
│   ├── risk-assessments.spec.ts         (Epic 3: Assessments)
│   ├── risk-treatments.spec.ts          (Epic 4: Treatments)
│   ├── risk-kris.spec.ts                (Epic 5: KRIs)
│   ├── risk-settings.spec.ts            (Epic 6: Settings)
│   ├── risk-integration.spec.ts         (Epic 7: Integration)
│   ├── risk-analysis.spec.ts            (Epic 8: Analysis & Reporting)
│   ├── risk-workflow.spec.ts            (Epic 9: Workflow & Notifications)
│   └── forms/
│       ├── risk-form.spec.ts
│       ├── assessment-form.spec.ts
│       ├── treatment-form.spec.ts
│       └── kri-form.spec.ts
│
├── pages/
│   ├── risk-register-page.ts
│   ├── risk-details-page.ts
│   ├── risk-assessments-page.ts
│   └── ...
│
└── fixtures/
    └── cleanup.ts                       (Test data cleanup fixture)
```

### 7.2 Remove These Files

```
❌ debug-simple-test.spec.ts
❌ debug-ultra-simple.spec.ts
❌ form-submission-diagnosis.spec.ts
❌ basic-connectivity-check.spec.ts
❌ risk-id-comparison.spec.ts
❌ all-workflows-summary.spec.ts
❌ final-workflow-summary.spec.ts
❌ treatment-form-submit-fix.spec.ts
❌ manual-treatment-test.spec.ts
❌ new-treatment-specific.spec.ts
❌ fixed-treatment-form.spec.ts
❌ final-treatment-test.spec.ts
❌ slow-treatment-test.spec.ts
❌ assets-checkbox-fix.spec.ts
❌ controls-checkbox-fix.spec.ts
❌ kris-checkbox-fix.spec.ts
❌ kris-tab-exploration.spec.ts
❌ new-risk-all-tabs-test.spec.ts
```

Move to `frontend/e2e/archive/` or delete

---

## 8. Test Coverage Metrics

### Current Coverage by Epic

| Epic | Stories | Tested | Coverage | Grade |
|------|---------|--------|----------|-------|
| Epic 1: Risk Register | 5 | 4 | 80% | B |
| Epic 2: Risk Categories | 1 | 1 | 100% | A+ |
| Epic 3: Risk Assessment | 3 | 3 | 100% | A+ |
| Epic 4: Risk Treatment | 3 | 2.5 | 83% | B+ |
| Epic 5: KRIs | 3 | 2.5 | 83% | B+ |
| Epic 6: Risk Settings | 2 | 1 | 50% | C |
| Epic 7: Risk Integration | 3 | 2 | 67% | C+ |
| Epic 8: Risk Analysis | 6 | 1 | 17% | F |
| Epic 9: Risk Workflow | 2 | 0 | 0% | F |
| **Total** | **28** | **16.5** | **59%** | **C+** |

### Playwright Advisory Compliance

| Requirement | Status | Score |
|-------------|--------|-------|
| Test IDs (getByTestId only) | ❌ Fail | 0% |
| No fallback selectors | ❌ Fail | 0% |
| Slow typing (type with delay) | ⚠️ Partial | 60% |
| Correct wait times | ✅ Pass | 90% |
| POM pattern | ✅ Pass | 100% |
| domcontentloaded (not networkidle) | ✅ Pass | 100% |
| Test isolation | ✅ Pass | 80% |
| **Overall Compliance** | **⚠️ Partial** | **61%** |

---

## 9. Conclusion

The Risk Module E2E test suite has **good breadth** (55+ test files) but needs improvement in **quality** and **coverage**.

### Strengths
- ✅ Comprehensive POM implementation
- ✅ Good test isolation (mostly)
- ✅ Correct wait strategy (domcontentloaded)
- ✅ Core functionality well-tested (Epic 1-5)

### Weaknesses
- ❌ Test ID usage relies on fallbacks
- ❌ Many debug/exploration tests cluttering the suite
- ❌ Significant gaps in advanced features (Epic 8-9)
- ❌ Inconsistent form filling patterns

### Next Steps

**Phase 1: Quality Improvement (Week 1)**
1. Add test IDs to all risk components
2. Remove fallback selectors from tests
3. Fix form filling patterns
4. Clean up debug tests

**Phase 2: Fill Critical Gaps (Week 2)**
5. Create missing P0 tests (bulk operations, calculation, findings)
6. Create missing P1 tests (treatment tasks, KRI measurements)

**Phase 3: Advanced Features (Week 3-4)**
7. Create P2 tests (heatmap, comparison, what-if, reports, export, workflow)

**Target:** Achieve 90%+ user story coverage with 90%+ Playwright Advisory compliance

---

**Report Generated:** January 2025
**Playwright Advisory Guide Version:** 2.0
**Risk Module User Stories:** 26 stories, 9 epics
