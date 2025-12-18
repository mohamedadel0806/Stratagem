# Governance Module Form Tests

This folder contains comprehensive E2E tests for all governance module forms, following the guidelines in `PLAYWRIGHT_TESTING_ADVISORY.md`.

## Test Files

### 1. `influencer-form.spec.ts`
Tests the Influencer form:
- Form filling and submission
- Required field validation
- All form fields (name, category, status, dates, etc.)

### 2. `policy-form.spec.ts`
Tests the Policy form with multiple tabs:
- Basic Information tab
- Content tab (rich text editor)
- Settings tab (acknowledgment settings)
- Required field validation

### 3. `control-objective-form.spec.ts`
Tests the Control Objective form:
- Creating control objectives within policy context
- Required field validation
- Note: Control objectives require a policy, so tests create a policy first

### 4. `unified-control-form.spec.ts`
Tests the Unified Control form:
- Form filling with all fields
- Control type, complexity, cost impact selections
- Implementation status tracking
- Required field validation

### 5. `assessment-form.spec.ts`
Tests the Assessment form:
- Assessment creation with all fields
- Assessment type and status selection
- Date range selection
- Required field validation

### 6. `evidence-form.spec.ts`
Tests the Evidence form:
- Evidence creation with file path entry
- Evidence type and status selection
- Date fields (collection, valid from/until)
- Confidential checkbox
- Required field validation

### 7. `finding-form.spec.ts`
Tests the Finding form:
- Finding creation with all fields
- Severity and status selection
- Remediation plan and due date
- Retest required checkbox
- Required field validation

## Running the Tests

### Run all form tests:
```bash
npx playwright test frontend/e2e/governance/forms
```

### Run a specific test file:
```bash
npx playwright test frontend/e2e/governance/forms/influencer-form.spec.ts
```

### Run in headed mode (see browser):
```bash
npx playwright test frontend/e2e/governance/forms --headed
```

### Run with UI mode:
```bash
npx playwright test frontend/e2e/governance/forms --ui
```

## Test Guidelines Followed

All tests follow the `PLAYWRIGHT_TESTING_ADVISORY.md` guidelines:

1. **Performance Optimization**
   - Uses `waitForLoadState('domcontentloaded')` instead of `networkidle`
   - Appropriate delays between operations (100-300ms)
   - No unnecessary wait checks

2. **Form Field Selector Strategy**
   - Text inputs: `input[name="fieldName"]`
   - Dropdowns: `getByLabel()` or role-based selectors
   - Checkboxes: `getByLabel()` or `input[type="checkbox"][name="fieldName"]`
   - Select components: Filtered button selectors

3. **Authentication & Navigation**
   - Uses `authenticatedPage` fixture
   - Fast navigation without excessive waiting
   - Proper URL verification

4. **Form Filling Best Practices**
   - Structured tab-based filling with clear logging
   - Screenshots before form submission
   - Success message verification
   - Record verification in list

5. **Error Handling**
   - Checks for element existence before interaction
   - Graceful handling of optional fields
   - Clear error messages for debugging

## Test Structure

Each test file includes:
- **Main test**: Fills all form fields and verifies record creation
- **Validation test**: Tests required field validation

## Screenshots

Screenshots are saved to `test-results/` directory before form submission:
- `{form-name}-form-before-submit.png`

## Notes

- All tests use unique identifiers (timestamp-based) to avoid conflicts
- Tests verify both form submission and record appearance in lists
- Tests handle optional fields gracefully with existence checks
- Control Objective tests require a policy context (policy is created first)

## Troubleshooting

If tests fail:
1. Ensure the frontend dev server is running (`npm run dev`)
2. Ensure the backend API is running
3. Check that test user credentials are correct (default: `admin@grcplatform.com` / `password123`)
4. Review screenshots in `test-results/` directory
5. Check browser console for errors

## Future Enhancements

- Add tests for form editing (update existing records)
- Add tests for form cancellation
- Add tests for file upload in evidence form
- Add tests for rich text editor in policy form
- Add tests for complex form relationships (linking controls to assessments, etc.)

