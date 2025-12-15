# Backend Testing Guide

This directory contains all test files and utilities for the backend.

## Structure

```
test/
├── README.md                    # This file
├── jest.setup.ts               # Global test setup
├── jest-e2e.json               # E2E test configuration
├── test-utils.ts               # Test utility functions
├── fixtures/                   # Test data fixtures
│   └── policy.fixture.ts
└── governance/                 # Governance module tests
    ├── policies.service.spec.ts    # Unit test example
    └── policies.e2e-spec.ts        # E2E test example
```

## Running Tests

### Unit Tests
```bash
npm run test              # Run all unit tests
npm run test:watch        # Watch mode
npm run test:cov          # With coverage
npm run test:governance   # Run only governance tests
```

### E2E Tests
```bash
npm run test:e2e          # Run all E2E tests
```

## Test Files

### Unit Tests (`*.spec.ts`)
- Located in `test/` or `src/` directories
- Test individual services, controllers, or components
- Use mocked dependencies
- Fast execution

### E2E Tests (`*.e2e-spec.ts`)
- Located in `test/` directory
- Test full API endpoints
- Use real database connections (test database)
- Slower execution

## Writing Tests

### Unit Test Example
See `governance/policies.service.spec.ts` for a complete example.

### E2E Test Example
See `governance/policies.e2e-spec.ts` for a complete example.

### Using Test Utilities
```typescript
import { createTestApp, requestTestApp } from '../test-utils';

// In your test
const app = await createTestApp(module);
const request = requestTestApp(app);
```

### Using Fixtures
```typescript
import { createPolicyFixture } from '../fixtures/policy.fixture';

// In your test
const policyData = createPolicyFixture({ title: 'Custom Title' });
```

## Test Database

E2E tests require a test database. Set the `TEST_DATABASE_URL` environment variable:

```bash
export TEST_DATABASE_URL="postgresql://postgres:password@localhost:5432/grc_platform_test"
```

Or create a `.env.test` file in the backend directory.

## Best Practices

1. **Use descriptive test names** - Describe what the test does
2. **One assertion per test** - Keep tests focused
3. **Use fixtures** - Reuse test data
4. **Clean up** - Remove test data after tests
5. **Mock external dependencies** - Keep unit tests fast
6. **Test edge cases** - Don't just test happy paths

## Resources

- [Jest Documentation](https://jestjs.io/)
- [NestJS Testing](https://docs.nestjs.com/fundamentals/testing)
- [Supertest Documentation](https://github.com/visionmedia/supertest)




