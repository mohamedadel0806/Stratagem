# Test Automation Setup for Form Dropdowns

## Quick Start

### Run All Dropdown Tests
```bash
# From project root
./scripts/test-form-dropdowns.sh

# Or from frontend directory
npm run test:dropdowns
```

### Run Tests Individually

**E2E Tests (Playwright):**
```bash
cd frontend
npm run test:dropdowns              # Headless
npm run test:dropdowns:ui           # Interactive UI
npm run test:dropdowns:headed       # See browser
npm run test:e2e:debug -- e2e/assets/physical-asset-form-dropdowns.spec.ts  # Debug mode
```

**Component Tests (Jest):**
```bash
cd frontend
npm test -- physical-asset-form-dropdowns.test.tsx
npm run test:watch -- physical-asset-form-dropdowns.test.tsx
```

## Test Structure

### E2E Tests (`e2e/assets/physical-asset-form-dropdowns.spec.ts`)

**What it tests:**
- ✅ Owner field is a dropdown (not text input)
- ✅ Business Unit field is a dropdown (not text input)
- ✅ Asset Type field is a dropdown (not text input)
- ✅ Dropdowns show readable names (not UUIDs)
- ✅ Dropdowns can be opened and options selected
- ✅ Loading states work correctly
- ✅ Empty states are handled gracefully

**How it works:**
1. Uses Playwright for browser automation
2. Authenticates using test fixtures
3. Navigates to physical assets page
4. Opens the form dialog
5. Verifies field types and behavior

### Component Tests (`src/components/forms/__tests__/physical-asset-form-dropdowns.test.tsx`)

**What it tests:**
- ✅ Form renders with Select components
- ✅ API calls are made to fetch data
- ✅ Options display user-friendly names
- ✅ Form submission includes UUID values

**How it works:**
1. Uses Jest + React Testing Library
2. Mocks API responses
3. Renders form component in isolation
4. Tests user interactions
5. Verifies form submission data

## Test Helpers

### Dropdown Helpers (`e2e/utils/dropdown-helpers.ts`)

Reusable functions for testing dropdowns:

```typescript
// Verify field is a dropdown
await verifyFieldIsDropdown(page, 'ownerId');

// Verify dropdown shows names (not UUIDs)
await verifyDropdownShowsNames(page, 'businessUnitId');

// Select option by text
await selectDropdownOptionByText(page, 'ownerId', 'John Doe');

// Verify loading state
await verifyDropdownLoadingState(page, 'assetTypeId');

// Verify empty state
await verifyDropdownEmptyState(page, 'ownerId');
```

## Prerequisites

### Required Services
1. **Frontend Dev Server** - `npm run dev` (port 3000)
2. **Backend API Server** - `npm run start:dev` (port 3001) or Kong (port 8000)
3. **Database** - PostgreSQL with test data

### Required Test Data
```sql
-- At least one user
INSERT INTO users (id, email, first_name, last_name) VALUES (...);

-- At least one business unit
INSERT INTO business_units (id, name, code) VALUES (...);

-- At least one asset type
INSERT INTO asset_types (id, name, category) VALUES (..., 'Server', 'physical');
```

### Environment Variables
```bash
# Optional: Override test credentials
export TEST_USER_EMAIL=admin@grcplatform.com
export TEST_USER_PASSWORD=password123
```

## Troubleshooting

### E2E Tests Fail

**Issue: "Button not found"**
- Solution: Ensure form dialog is open, check tab navigation

**Issue: "No options available"**
- Solution: Check database has test data, verify API endpoints

**Issue: "Authentication failed"**
- Solution: Verify credentials, check backend is running

**Issue: "Timeout waiting for element"**
- Solution: Increase timeout, check page load state

### Component Tests Fail

**Issue: "Cannot find module"**
- Solution: Run `npm install`, check imports

**Issue: "Mock not working"**
- Solution: Clear jest cache: `npm test -- --clearCache`

**Issue: "Query client error"**
- Solution: Check QueryClientProvider setup

## CI/CD Integration

### GitHub Actions Example

```yaml
name: Test Form Dropdowns

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
          cd frontend && npm ci
          cd ../backend && npm ci
      
      - name: Start services
        run: |
          docker-compose up -d
          npm run start:dev &
          cd frontend && npm run dev &
          sleep 30
      
      - name: Run component tests
        run: cd frontend && npm test -- physical-asset-form-dropdowns.test.tsx
      
      - name: Run E2E tests
        run: cd frontend && npm run test:dropdowns
      
      - name: Upload test results
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: test-results
          path: frontend/test-results/
```

## Best Practices

1. **Run tests before committing**
   ```bash
   ./scripts/test-form-dropdowns.sh
   ```

2. **Use watch mode during development**
   ```bash
   npm run test:watch -- physical-asset-form-dropdowns.test.tsx
   ```

3. **Debug failing tests**
   ```bash
   npm run test:e2e:debug -- e2e/assets/physical-asset-form-dropdowns.spec.ts
   ```

4. **Keep test data consistent**
   - Use fixtures for predictable data
   - Clean up test data after tests

5. **Update tests when UI changes**
   - Update selectors if field names change
   - Update mocks if API responses change

## Test Coverage

Current test coverage:
- ✅ Field type verification (dropdown vs input)
- ✅ Option display (names vs UUIDs)
- ✅ User interaction (opening, selecting)
- ✅ Loading states
- ✅ Empty states
- ✅ Form submission with UUIDs

Future enhancements:
- ⏳ Accessibility testing (keyboard navigation)
- ⏳ Performance testing (large datasets)
- ⏳ Visual regression testing



