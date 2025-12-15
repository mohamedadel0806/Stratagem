# Risk Module Form Tests

This folder contains comprehensive E2E tests for the risk module forms, following the guidelines in `PLAYWRIGHT_TESTING_ADVISORY.md`.

## Test Files

### `risk-form.spec.ts`
Tests the Risk form with multiple tabs:
- **Basic Info tab**: Title, risk statement, description, category, status, dates, tags
- **Assessment tab**: Likelihood, impact, inherent scores, target scores
- **Risk Scenario tab**: Threat source, risk velocity, vulnerabilities, early warning signs, business process, status notes

## Test Coverage

### 1. Full Form Submission Test
**Test:** `should fill all risk form tabs and create record`

Tests filling all fields across all three tabs:
- Basic Info: All fields including required (title, category)
- Assessment: Current risk scoring, inherent risk, target risk
- Risk Scenario: Complete scenario information
- Verifies successful form submission and record creation

### 2. Required Field Validation Test
**Test:** `should validate required fields`

Tests that form properly validates required fields:
- Attempts submission without required fields
- Verifies validation error messages are displayed

### 3. Risk Score Calculation Test
**Test:** `should display risk score calculation`

Tests the dynamic risk score calculation:
- Sets likelihood and impact values
- Verifies risk score is calculated and displayed correctly
- Checks risk level badge (Critical/High/Medium/Low)

### 4. Form Cancellation Test
**Test:** `should handle form cancellation`

Tests form cancellation functionality:
- Fills form with data
- Clicks cancel button
- Verifies dialog closes without saving

### 5. Minimal Required Fields Test
**Test:** `should fill form with minimal required fields only`

Tests form submission with only required fields:
- Fills only title and category (required fields)
- Submits form
- Verifies successful submission

## Running the Tests

### Run all risk form tests:
```bash
npx playwright test frontend/e2e/risks/forms
```

### Run a specific test file:
```bash
npx playwright test frontend/e2e/risks/forms/risk-form.spec.ts
```

### Run in headed mode (see browser):
```bash
npx playwright test frontend/e2e/risks/forms --headed
```

### Run with UI mode:
```bash
npx playwright test frontend/e2e/risks/forms --ui
```

### Run a specific test:
```bash
npx playwright test frontend/e2e/risks/forms/risk-form.spec.ts -g "should fill all risk form tabs"
```

## Test Guidelines Followed

All tests follow the `PLAYWRIGHT_TESTING_ADVISORY.md` guidelines:

1. **Performance Optimization**
   - Uses `waitForLoadState('domcontentloaded')` instead of `networkidle`
   - Appropriate delays between operations (200-500ms)
   - No unnecessary wait checks

2. **Form Field Selector Strategy**
   - Text inputs: `input[name="fieldName"]` or `textarea[name="fieldName"]`
   - Dropdowns: Label-based selectors with role="option" for options
   - Select components: Uses label + button pattern for shadcn/ui Select components
   - All selectors verified to work with actual form structure

3. **Authentication & Navigation**
   - Uses `authenticatedPage` fixture from `../../fixtures/auth`
   - Navigates to `/en/dashboard/risks`
   - Fast navigation without excessive waiting

4. **Form Filling Best Practices**
   - Structured tab-based filling with clear console logging
   - Screenshots before form submission (`test-results/risk-form-before-submit.png`)
   - Success verification through dialog closure and record appearance
   - Proper error handling and verification

5. **Error Handling**
   - Checks for element existence before interaction using `.isVisible().catch(() => false)`
   - Graceful handling of optional fields
   - Clear error messages for debugging

## Form Structure

The Risk form consists of three tabs:

### Tab 1: Basic Info
- **title** (required): Text input
- **risk_statement**: Textarea
- **description**: Textarea
- **category** (required): Select dropdown (12 categories)
- **status**: Select dropdown (5 statuses)
- **date_identified**: Date input
- **next_review_date**: Date input
- **tags**: Text input (comma-separated)

### Tab 2: Assessment
- **likelihood**: Select dropdown (1-5 scale)
- **impact**: Select dropdown (1-5 scale)
- **Advanced Section** (collapsible):
  - **inherent_likelihood**: Select dropdown
  - **inherent_impact**: Select dropdown
  - **target_likelihood**: Select dropdown
  - **target_impact**: Select dropdown
- Risk score is automatically calculated and displayed

### Tab 3: Risk Scenario
- **threat_source**: Select dropdown (internal/external/natural/unknown)
- **risk_velocity**: Select dropdown (slow/medium/fast/immediate)
- **vulnerabilities**: Textarea
- **early_warning_signs**: Textarea
- **business_process**: Text input
- **status_notes**: Textarea

## Test Data

Tests use unique identifiers (timestamp-based) to avoid conflicts:
- Risk titles: `E2E Test Risk ${Date.now()}`

## Screenshots

Screenshots are saved to `test-results/` directory:
- `risk-form-before-submit.png` - Form state before submission
- `risk-form-error.png` - Form state if errors occur (on error)

## Test Constants

All tests use consistent wait time constants:
- `WAIT_SMALL = 200` - Between field fills
- `WAIT_MEDIUM = 300` - Tab switches and dropdowns
- `WAIT_LARGE = 500` - Dialog appearances and major operations

## Troubleshooting

If tests fail:

1. **Ensure services are running:**
   - Frontend dev server: `npm run dev` (in frontend directory)
   - Backend API server

2. **Check test user credentials:**
   - Default: `admin@grcplatform.com` / `password123`
   - Or set `TEST_USER_EMAIL` and `TEST_USER_PASSWORD` environment variables

3. **Review screenshots:**
   - Check `test-results/` directory for screenshots
   - Look for form state and error messages

4. **Check browser console:**
   - Run tests in headed mode: `--headed`
   - Check for JavaScript errors or network failures

5. **Verify form structure:**
   - Ensure form fields match expected selectors
   - Check if form structure has changed

6. **Network/Database issues:**
   - Verify API endpoints are accessible
   - Check database connectivity
   - Ensure test data can be created

## Future Enhancements

Potential improvements for these tests:

- [ ] Add tests for form editing (update existing risks)
- [ ] Add tests for form validation edge cases
- [ ] Add tests for risk score calculation edge cases (boundary values)
- [ ] Add tests for advanced assessment section interactions
- [ ] Add tests for form with pre-populated data (edit mode)
- [ ] Add tests for bulk operations on risks
- [ ] Add tests for risk export functionality
- [ ] Add tests for risk filtering and search
