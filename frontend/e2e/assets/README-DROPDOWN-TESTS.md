# Physical Asset Form Dropdown Tests

## Overview

This test suite verifies that the Owner ID, Business Unit ID, and Asset Type ID fields in the Physical Asset form are implemented as dropdowns (not free text inputs).

## Test Files

### E2E Tests (Playwright)
- **File:** `physical-asset-form-dropdowns.spec.ts`
- **Location:** `frontend/e2e/assets/`
- **Tests:**
  - Owner field is a dropdown
  - Business Unit field is a dropdown
  - Asset Type field is a dropdown
  - Dropdowns show readable names (not UUIDs)
  - Dropdowns handle loading states
  - Dropdowns handle empty states

### Component Tests (Jest + React Testing Library)
- **File:** `physical-asset-form-dropdowns.test.tsx`
- **Location:** `frontend/src/components/forms/__tests__/`
- **Tests:**
  - Form renders dropdowns correctly
  - Dropdowns display user-friendly names
  - Form submission includes UUID values

## Running the Tests

### E2E Tests (Playwright)

```bash
# Run all dropdown tests
npm run test:e2e -- e2e/assets/physical-asset-form-dropdowns.spec.ts

# Run with UI mode (interactive)
npm run test:e2e:ui -- e2e/assets/physical-asset-form-dropdowns.spec.ts

# Run in headed mode (see browser)
npm run test:e2e:headed -- e2e/assets/physical-asset-form-dropdowns.spec.ts

# Run in debug mode
npm run test:e2e:debug -- e2e/assets/physical-asset-form-dropdowns.spec.ts
```

### Component Tests (Jest)

```bash
# Run component tests
npm test -- physical-asset-form-dropdowns.test.tsx

# Run with watch mode
npm run test:watch -- physical-asset-form-dropdowns.test.tsx

# Run with coverage
npm run test:coverage -- physical-asset-form-dropdowns.test.tsx
```

## Test Helpers

### Dropdown Helpers (`e2e/utils/dropdown-helpers.ts`)

- `verifyFieldIsDropdown()` - Verifies a field is a dropdown, not text input
- `verifyDropdownShowsNames()` - Verifies options show readable names
- `selectDropdownOptionByText()` - Selects an option by visible text
- `verifyDropdownLoadingState()` - Verifies loading state
- `verifyDropdownEmptyState()` - Verifies empty state handling

## Prerequisites

1. **Backend running** on port 3001 (or via Kong on port 8000)
2. **Frontend running** on port 3000
3. **Database seeded** with:
   - At least one user
   - At least one business unit
   - At least one asset type (category='physical')
4. **Test credentials** configured (default: admin@grcplatform.com / password123)

## Environment Variables

```bash
# Optional: Override test credentials
export TEST_USER_EMAIL=admin@grcplatform.com
export TEST_USER_PASSWORD=password123

# Optional: Override base URL
export FRONTEND_URL=http://localhost:3000
```

## Expected Test Results

### E2E Tests
- ✅ All dropdown fields are Select components (not Input)
- ✅ Dropdowns show user-friendly names
- ✅ Dropdowns can be opened and options selected
- ✅ Form submission includes correct UUID values
- ✅ Loading and empty states work correctly

### Component Tests
- ✅ Form renders with dropdowns
- ✅ API calls are made to fetch data
- ✅ Options display readable names
- ✅ Form submission includes UUIDs

## Troubleshooting

### Tests fail with "Button not found"
- Ensure the form dialog is open
- Check that tabs are navigated correctly
- Verify page has fully loaded

### Tests fail with "No options available"
- Check database has test data
- Verify API endpoints are accessible
- Check network requests in browser DevTools

### Tests fail with authentication errors
- Verify test credentials are correct
- Check backend is running
- Ensure session cookies are being set

## Continuous Integration

These tests can be integrated into CI/CD pipelines:

```yaml
# Example GitHub Actions
- name: Run E2E Tests
  run: npm run test:e2e

- name: Run Component Tests
  run: npm test
```

## Maintenance

When updating the form:
1. Update tests to match new field names/labels
2. Update test data mocks if API responses change
3. Update dropdown helpers if UI patterns change

