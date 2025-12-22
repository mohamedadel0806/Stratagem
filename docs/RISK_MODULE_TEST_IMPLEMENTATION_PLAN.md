# Risk Module Test Implementation Plan

**Based on:** Playwright Testing Advisory Guide v2.0
**Date:** January 2025
**Status:** Ready for Implementation

---

## Overview

This document outlines the implementation plan to bring Risk Module E2E tests to 90%+ compliance with the Playwright Testing Advisory Guide and 90%+ user story coverage.

---

## Phase 1: Quality Improvement (Week 1)

### Goal: Achieve 90%+ Advisory Compliance

### Task 1.1: Add Test IDs to Frontend Components

**Priority:** P0 - CRITICAL
**Effort:** 2-3 days
**Owner:** Frontend Developer + QA

#### Components Requiring Test IDs

**1. Risk Details Page** (`frontend/src/app/[locale]/(dashboard)/dashboard/risks/[id]/page.tsx`)
```typescript
// Add test IDs to:
- Tabs: data-testid="risk-details-tab-overview", "risk-details-tab-assessments", etc.
- Edit button: data-testid="risk-details-edit-button"
- New assessment button: data-testid="risk-details-new-assessment-button"
- Link asset button: data-testid="risk-details-link-asset-button"
- Link control button: data-testid="risk-details-link-control-button"
- New treatment button: data-testid="risk-details-new-treatment-button"
- Link KRI button: data-testid="risk-details-link-kri-button"
```

**2. Risk Form** (`frontend/src/components/forms/risk-form.tsx`)
```typescript
// Add test IDs to:
- Title input: data-testid="risk-form-title-input"
- Description textarea: data-testid="risk-form-description-textarea"
- Category dropdown: data-testid="risk-form-category-dropdown"
- Likelihood dropdown: data-testid="risk-form-likelihood-dropdown"
- Impact dropdown: data-testid="risk-form-impact-dropdown"
- Owner dropdown: data-testid="risk-form-owner-dropdown"
- Status dropdown: data-testid="risk-form-status-dropdown"
- Submit button (create): data-testid="risk-form-submit-create"
- Submit button (update): data-testid="risk-form-submit-update"
- Cancel button: data-testid="risk-form-submit-cancel"
```

**3. Assessment Form** (`frontend/src/components/forms/risk-assessment-form.tsx`)
```typescript
// Add test IDs to:
- Likelihood input: data-testid="assessment-form-likelihood-input"
- Impact input: data-testid="assessment-form-impact-input"
- Method dropdown: data-testid="assessment-form-method-dropdown"
- Notes textarea: data-testid="assessment-form-notes-textarea"
- Submit button: data-testid="assessment-form-submit-create"
```

**4. Treatment Form** (`frontend/src/components/forms/risk-treatment-form.tsx`)
```typescript
// Add test IDs to:
- Type dropdown: data-testid="treatment-form-type-dropdown"
- Status dropdown: data-testid="treatment-form-status-dropdown"
- Description textarea: data-testid="treatment-form-description-textarea"
- Cost input: data-testid="treatment-form-cost-input"
- Submit button: data-testid="treatment-form-submit-create"
```

**5. Asset/Control/Finding Linking Dialogs**
```typescript
// Add test IDs to:
- Search input: data-testid="asset-search-input", "control-search-input", "finding-search-input"
- Select buttons: data-testid="asset-select-button-123", "control-select-button-456"
- Submit button: data-testid="link-asset-submit", "link-control-submit", "link-finding-submit"
```

#### Acceptance Criteria
- [ ] All buttons have test IDs
- [ ] All form inputs have test IDs
- [ ] All dropdown triggers have test IDs
- [ ] All searchable inputs have test IDs
- [ ] Test IDs follow naming convention: `{feature}-{component}-{action}`

---

### Task 1.2: Remove Fallback Selectors from POMs

**Priority:** P0 - CRITICAL
**Effort:** 1 day
**Owner:** QA/Automation Engineer

#### Files to Update

1. **risk-details-page.ts**
```typescript
// ❌ Before
this.overviewTab = page.getByTestId('risk-details-tab-overview')
  .or(page.locator('[role="tab"]:has-text("Overview")').first());

// ✅ After
this.overviewTab = page.getByTestId('risk-details-tab-overview');
```

2. **risk-register-page.ts**
3. **risk-dashboard-page.ts**
4. **risk-analysis-page.ts**
5. **risk-settings-page.ts**
6. **kris-page.ts**
7. **treatments-page.ts**
8. **assessment-requests-page.ts**
9. **risk-categories-page.ts**

#### Acceptance Criteria
- [ ] All POM files use only `page.getByTestId()`
- [ ] No `.or()` fallback selectors remain
- [ ] No text/role selectors remain
- [ ] Tests fail if test IDs are missing (as intended)

---

### Task 1.3: Fix Form Filling Patterns

**Priority:** P0 - HIGH
**Effort:** 1 day
**Owner:** QA/Automation Engineer

#### Pattern to Apply

```typescript
// ✅ REQUIRED Pattern
await page.getByTestId('title-input').clear();
await page.waitForTimeout(500);
await page.getByTestId('title-input').type('My Title', { delay: 50 });
await page.waitForTimeout(1000);

// ❌ NEVER USE
await page.getByTestId('title-input').fill('My Title');
```

#### Files to Update

1. **All POM files** - Replace `fill()` with `type()`
2. **All test files** - Ensure consistent wait times

#### Acceptance Criteria
- [ ] No `fill()` calls remain in tests
- [ ] All text inputs use `type()` with `{ delay: 50 }`
- [ ] Wait times are consistent (500ms, 1000ms, 2000ms)
- [ ] Dropdowns wait 1000ms after selection
- [ ] Forms wait 2000ms after submission

---

### Task 1.4: Clean Up Debug Tests

**Priority:** P1 - MEDIUM
**Effort:** 0.5 day
**Owner:** QA/Automation Engineer

#### Files to Remove or Archive

Move these files to `frontend/e2e/archive/`:
```
debug-simple-test.spec.ts
debug-ultra-simple.spec.ts
form-submission-diagnosis.spec.ts
basic-connectivity-check.spec.ts
risk-id-comparison.spec.ts
all-workflows-summary.spec.ts
final-workflow-summary.spec.ts
treatment-form-submit-fix.spec.ts
manual-treatment-test.spec.ts
new-treatment-specific.spec.ts
fixed-treatment-form.spec.ts
final-treatment-test.spec.ts
slow-treatment-test.spec.ts
assets-checkbox-fix.spec.ts
controls-checkbox-fix.spec.ts
kris-checkbox-fix.spec.ts
kris-tab-exploration.spec.ts
new-risk-all-tabs-test.spec.ts
```

#### Acceptance Criteria
- [ ] Debug tests removed from main test suite
- [ ] Archive folder created
- [ ] Test suite runs faster
- [ ] CI pipeline uses only production tests

---

## Phase 2: Fill Critical Gaps (Week 2)

### Goal: Achieve 100% P0/P1 User Story Coverage

### Task 2.1: Create Bulk Operations Test

**Priority:** P0 - CRITICAL
**User Story:** Epic 1.5 - Bulk Operations on Risks
**Effort:** 1 day

#### Test File: `risk-bulk-operations.spec.ts`

```typescript
import { test, expect } from '../fixtures/auth';
import { RiskRegisterPage } from '../pages/risk-register-page';

test.describe('Risk Bulk Operations', () => {
  test('should bulk update risk status', async ({ authenticatedPage }) => {
    // Create 3 test risks
    // Select all 3
    // Bulk update status to "Mitigated"
    // Verify all updated
  });

  test('should bulk update risk category', async ({ authenticatedPage }) => {
    // Create 3 test risks
    // Select all 3
    // Bulk update category
    // Verify all updated
  });

  test('should bulk delete risks', async ({ authenticatedPage }) => {
    // Create 3 test risks
    // Select all 3
    // Bulk delete
    // Verify all deleted
  });

  test('should bulk export risks', async ({ authenticatedPage }) => {
    // Create test risks
    // Select multiple
    // Export to CSV
    // Verify download
  });
});
```

#### Acceptance Criteria
- [ ] All bulk operations tested
- [ ] Uses POM pattern
- [ ] Uses test IDs only
- [ ] Proper cleanup after test

---

### Task 2.2: Create Risk Level Calculation Test

**Priority:** P0 - CRITICAL
**User Story:** Epic 6.2 - Risk Level Calculation
**Effort:** 1 day

#### Test File: `risk-calculation.spec.ts`

```typescript
import { test, expect } from '../fixtures/auth';
import { RiskFormPage } from '../pages/risk-form-page';

test.describe('Risk Level Calculation', () => {
  test('should calculate risk score correctly', async ({ authenticatedPage }) => {
    // Create risk with likelihood=4, impact=5
    // Verify score = 20
    // Verify level = High (based on settings)
  });

  test('should check risk appetite', async ({ authenticatedPage }) => {
    // Create risk exceeding appetite
    // Verify warning shown
    // Verify risk flagged
  });

  test('should recalculate on update', async ({ authenticatedPage }) => {
    // Create risk
    // Update likelihood
    // Verify score recalculated
  });
});
```

#### Acceptance Criteria
- [ ] Risk score calculation tested
- [ ] Risk level determination tested
- [ ] Risk appetite check tested
- [ ] Recalculation on update tested

---

### Task 2.3: Create Link Findings Test

**Priority:** P0 - CRITICAL
**User Story:** Epic 7.3 - Link Risks to Findings
**Effort:** 1 day

#### Test File: `risk-findings.spec.ts`

```typescript
import { test, expect } from '../fixtures/auth';
import { RiskDetailsPage } from '../pages/risk-details-page';

test.describe('Risk-Finding Links', () => {
  test('should link finding to risk', async ({ authenticatedPage }) => {
    // Navigate to risk details
    // Open findings tab
    // Click "Link Finding"
    // Search and select finding
    // Set relationship type
    // Submit
    // Verify finding linked
  });

  test('should view linked findings', async ({ authenticatedPage }) => {
    // Risk with linked findings
    // Navigate to findings tab
    // Verify findings listed
    // Verify relationship type shown
  });

  test('should remove finding link', async ({ authenticatedPage }) => {
    // Risk with linked finding
    // Remove link
    // Verify finding removed
  });
});
```

#### Acceptance Criteria
- [ ] Link finding tested
- [ ] View linked findings tested
- [ ] Remove link tested
- [ ] Relationship type tested

---

### Task 2.4: Create Treatment Tasks Test

**Priority:** P1 - HIGH
**User Story:** Epic 4.2 - Manage Treatment Tasks
**Effort:** 0.5 day

#### Test File: `treatment-tasks.spec.ts`

```typescript
import { test, expect } from '../fixtures/auth';
import { RiskDetailsPage } from '../pages/risk-details-page';

test.describe('Treatment Tasks', () => {
  test('should create treatment task', async ({ authenticatedPage }) => {
    // Navigate to treatment
    // Create task
    // Assign to user
    // Set due date
    // Verify task created
  });

  test('should update task status', async ({ authenticatedPage }) => {
    // Treatment with task
    // Update task status to "In Progress"
    // Verify status updated
  });

  test('should complete task', async ({ authenticatedPage }) => {
    // Treatment with task
    // Mark task as complete
    // Verify task completed
  });
});
```

#### Acceptance Criteria
- [ ] Create task tested
- [ ] Update task tested
- [ ] Complete task tested

---

### Task 2.5: Create KRI Measurements Test

**Priority:** P1 - HIGH
**User Story:** Epic 5.2 - Record KRI Measurements
**Effort:** 0.5 day

#### Test File: `kri-measurements.spec.ts`

```typescript
import { test, expect } from '../fixtures/auth';
import { KRIPage } from '../pages/kris-page';

test.describe('KRI Measurements', () => {
  test('should record KRI measurement', async ({ authenticatedPage }) => {
    // Navigate to KRI
    // Record measurement
    // Set value
    // Set date
    // Verify measurement recorded
  });

  test('should alert when threshold exceeded', async ({ authenticatedPage }) => {
    // KRI with threshold
    // Record measurement exceeding threshold
    // Verify alert shown
  });

  test('should display measurement history', async ({ authenticatedPage }) => {
    // KRI with measurements
    // View history
    // Verify measurements shown in chart
  });
});
```

#### Acceptance Criteria
- [ ] Record measurement tested
- [ ] Threshold alert tested
- [ ] Measurement history tested

---

## Phase 3: Advanced Features (Week 3-4)

### Goal: Achieve 90%+ Overall Coverage

### Task 3.1: Create Risk Heatmap Test

**Priority:** P2 - MEDIUM
**User Story:** Epic 8.2 - Risk Heatmap
**Effort:** 0.5 day

```typescript
test.describe('Risk Heatmap', () => {
  test('should display risk heatmap', async ({ authenticatedPage }) => {
    // Navigate to risk analysis
    // View heatmap
    // Verify heatmap displayed
  });

  test('should filter heatmap by category', async ({ authenticatedPage }) => {
    // Open heatmap
    // Filter by category
    // Verify heatmap updated
  });

  test('should click risk to view details', async ({ authenticatedPage }) => {
    // Open heatmap
    // Click on risk
    // Verify risk details opened
  });
});
```

---

### Task 3.2: Create Risk Comparison Test

**Priority:** P2 - MEDIUM
**User Story:** Epic 8.3 - Risk Comparison Tool
**Effort:** 0.5 day

```typescript
test.describe('Risk Comparison', () => {
  test('should compare two risks', async ({ authenticatedPage }) => {
    // Select 2 risks
    // Compare
    // Verify comparison matrix shown
  });

  test('should compare multiple risks', async ({ authenticatedPage }) => {
    // Select 3-5 risks
    // Compare
    // Verify all risks shown in comparison
  });

  test('should calculate risk reduction', async ({ authenticatedPage }) => {
    // Compare risks
    // Verify risk reduction percentage shown
  });
});
```

---

### Task 3.3: Create What-If Analysis Test

**Priority:** P2 - MEDIUM
**User Story:** Epic 8.4 - What-If Scenario Analysis
**Effort:** 0.5 day

```typescript
test.describe('What-If Analysis', () => {
  test('should simulate risk reduction', async ({ authenticatedPage }) => {
    // Select risk
    // Open what-if analysis
    // Adjust likelihood/impact
    // Verify before/after comparison shown
  });

  test('should simulate control effectiveness', async ({ authenticatedPage }) => {
    // Select risk
    // Add simulated control
    // Verify residual risk calculated
  });

  test('should warn if risk appetite exceeded', async ({ authenticatedPage }) => {
    // Select risk
    // Simulate high likelihood/impact
    // Verify risk appetite warning shown
  });
});
```

---

### Task 3.4: Create Custom Reports Test

**Priority:** P2 - MEDIUM
**User Story:** Epic 8.5 - Custom Risk Reports
**Effort:** 0.5 day

```typescript
test.describe('Custom Risk Reports', () => {
  test('should create custom report', async ({ authenticatedPage }) => {
    // Navigate to risk analysis
    // Create custom report
    // Select fields
    // Apply filters
    // Generate report
    // Verify report generated
  });

  test('should export custom report as JSON', async ({ authenticatedPage }) => {
    // Create custom report
    // Export as JSON
    // Verify download
  });
});
```

---

### Task 3.5: Create Risk Export Test

**Priority:** P2 - MEDIUM
**User Story:** Epic 8.6 - Risk Export
**Effort:** 0.5 day

```typescript
test.describe('Risk Export', () => {
  test('should export risks to CSV', async ({ authenticatedPage }) => {
    // Navigate to risk register
    // Export to CSV
    // Verify download
  });

  test('should export filtered risks', async ({ authenticatedPage }) => {
    // Apply filter
    // Export filtered results
    // Verify only filtered risks exported
  });

  test('should export selected fields', async ({ authenticatedPage }) => {
    // Select fields to export
    // Export
    // Verify only selected fields exported
  });
});
```

---

### Task 3.6: Create Review Workflow Test

**Priority:** P2 - LOW
**User Story:** Epic 9.1 - Risk Review Workflow
**Effort:** 0.5 day

```typescript
test.describe('Risk Review Workflow', () => {
  test('should set review date', async ({ authenticatedPage }) => {
    // Create risk
    // Set next review date
    // Verify review date saved
  });

  test('should track review status', async ({ authenticatedPage }) => {
    // Risk with review date
    // Update review status
    // Verify status updated
  });

  test('should notify on review due', async ({ authenticatedPage }) => {
    // Risk with review date due
    // Verify notification sent
    // Verify notification shown
  });
});
```

---

### Task 3.7: Create Notifications Test

**Priority:** P2 - LOW
**User Story:** Epic 9.2 - Risk Notifications
**Effort:** 0.5 day

```typescript
test.describe('Risk Notifications', () => {
  test('should notify when risk assigned', async ({ authenticatedPage }) => {
    // Create risk assigned to user
    // Verify notification sent
    // Verify notification shown in UI
  });

  test('should notify when risk exceeds appetite', async ({ authenticatedPage }) => {
    // Create risk exceeding appetite
    // Verify notification sent
  });

  test('should notify when assessment completed', async ({ authenticatedPage }) => {
    // Complete assessment
    // Verify notification sent to risk owner
  });
});
```

---

## Phase 4: Final Polish & Documentation (Week 5)

### Task 4.1: Add Test Data Cleanup Fixture

**Priority:** P1 - HIGH
**Effort:** 0.5 day

#### Create: `frontend/e2e/fixtures/cleanup.ts`

```typescript
import { test as base } from '@playwright/test';

export const test = base.extend<{
  cleanupData: {
    track: (id: string, type: string) => void;
    cleanup: () => Promise<void>;
  };
}>({
  cleanupData: async ({}, use, testInfo) => {
    const createdItems: Array<{ id: string; type: string }> = [];

    await use({
      track: (id: string, type: string) => {
        createdItems.push({ id, type });
      },
      cleanup: async () => {
        // Cleanup logic here
        for (const item of createdItems) {
          try {
            // Delete item via API or UI
            console.log(`Cleaning up ${item.type}: ${item.id}`);
          } catch (e) {
            console.log(`Failed to cleanup ${item.id}:`, e);
          }
        }
      }
    });

    // Auto-cleanup after test
    // Implementation depends on your cleanup strategy
  },
});
```

---

### Task 4.2: Document Test Coverage

**Priority:** P1 - HIGH
**Effort:** 0.5 day

#### Update: `docs/RISK_MODULE_E2E_TEST_COVERAGE_ANALYSIS.md`

- [ ] Update coverage metrics
- [ ] Mark tests as completed
- [ ] Add test execution times
- [ ] Document known issues

---

### Task 4.3: Add CI Integration

**Priority:** P1 - HIGH
**Effort:** 0.5 day

#### Create: `.github/workflows/e2e-risk-tests.yml`

```yaml
name: E2E Risk Tests

on:
  pull_request:
    paths:
      - 'frontend/src/app/**/risks/**'
      - 'frontend/src/components/**/risk*'
      - 'frontend/e2e/risks/**'
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: 20
      - name: Install dependencies
        run: cd frontend && npm ci
      - name: Install Playwright
        run: cd frontend && npx playwright install --with-deps
      - name: Run Risk E2E Tests
        run: cd frontend && npx playwright test e2e/risks
      - name: Upload test results
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: test-results
          path: frontend/test-results/
```

---

## Success Metrics

### Phase 1 Success Criteria
- [ ] 90%+ of tests use `getByTestId()` only (no fallbacks)
- [ ] 100% of form inputs use `type()` with delay
- [ ] 0 debug tests in main suite
- [ ] All POMs follow advisory guidelines

### Phase 2 Success Criteria
- [ ] 100% P0 user stories covered
- [ ] 100% P1 user stories covered
- [ ] All new tests follow POM pattern
- [ ] All new tests use test IDs only

### Phase 3 Success Criteria
- [ ] 90%+ overall user story coverage
- [ ] All P2 features tested
- [ ] Test suite runs in <15 minutes
- [ ] CI integration working

### Overall Success Criteria
- [ ] **90%+ Playwright Advisory compliance**
- [ ] **90%+ user story coverage**
- [ ] **Test suite maintainable and documented**
- [ ] **CI/CD integration complete**

---

## Timeline Summary

| Phase | Tasks | Duration | Target |
|-------|-------|----------|--------|
| Phase 1: Quality Improvement | 4 tasks | Week 1 | 90%+ Advisory compliance |
| Phase 2: Fill Critical Gaps | 5 tasks | Week 2 | 100% P0/P1 coverage |
| Phase 3: Advanced Features | 7 tasks | Week 3-4 | 90%+ overall coverage |
| Phase 4: Final Polish | 3 tasks | Week 5 | Complete & document |
| **Total** | **19 tasks** | **5 weeks** | **Production-ready** |

---

## Risk Mitigation

### Risk 1: Frontend Test IDs Not Available
**Mitigation:** Start with Task 1.1 immediately, coordinate with frontend team

### Risk 2: Test Suite Too Slow
**Mitigation:**
- Use parallel execution
- Optimize wait times
- Mock slow APIs
- Use `domcontentloaded` consistently

### Risk 3: Flaky Tests
**Mitigation:**
- Use retry logic for known flaky operations
- Ensure proper wait times
- Use test data cleanup
- Avoid shared test state

### Risk 4: Resource Constraints
**Mitigation:**
- Prioritize P0/P1 tasks first
- Can defer P2 tasks if needed
- Focus on quality over quantity

---

## Next Steps

1. **Review this plan** with stakeholders
2. **Assign tasks** to team members
3. **Start Phase 1, Task 1.1** (Add Test IDs) - CRITICAL PATH
4. **Set up weekly reviews** to track progress
5. **Update coverage analysis** as tests are completed

---

**Plan Created:** January 2025
**Playwright Advisory Guide:** v2.0
**Target Completion:** Week 5
**Success Criteria:** 90%+ Advisory compliance, 90%+ user story coverage
