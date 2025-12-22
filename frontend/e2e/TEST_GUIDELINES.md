# E2E Test Guidelines

## Import Patterns

### For Tests Requiring Authentication:
```typescript
import { test } from '../fixtures/auth';
import { expect } from '@playwright/test';
```

### For Tests Without Authentication:
```typescript
import { test, expect } from '@playwright/test';
```

## Test Structure

```typescript
test.describe('Feature Name', () => {
  test('should do something specific', async ({ authenticatedPage }) => {
    // Test implementation
  });
});
```

## Running Tests

### Basic Test Run:
```bash
cd frontend
npm run test:e2e
```

### Run Specific Test:
```bash
npm run test:e2e -- e2e/your-test-file.spec.ts
```

### Run Tests in UI Mode:
```bash
npm run test:e2e:ui
```

### Run Tests Headed (with browser visible):
```bash
npm run test:e2e:headed
```

## Common Issues

1. **Configuration Conflicts**: Ensure only one playwright.config.ts file has content
2. **Import Issues**: Use consistent import patterns as shown above
3. **Authentication**: Use the auth fixture for tests that require login
4. **Timeouts**: Adjust timeouts in the config if tests are flaky

## Assets E2E Tests

The assets module tests are located in `e2e/assets/` and cover:
- Physical assets
- Information assets
- Software assets
- Business applications
- Suppliers
- Asset validation
- Import/export functionality

Run assets tests:
```bash
npm run test:e2e -- e2e/assets/
```