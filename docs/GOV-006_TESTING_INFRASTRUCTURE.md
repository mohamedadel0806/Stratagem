# GOV-006: Testing Infrastructure - Complete Guide

**Task ID:** GOV-006  
**Status:** In Progress  
**Priority:** P0 (High)  
**Estimated Time:** 10 hours

---

## ✅ What's Been Set Up

### Backend Testing:
1. ✅ **Jest Configuration** - `backend/jest.config.js`
   - Configured for TypeScript
   - Coverage reporting
   - Module path mapping

2. ✅ **E2E Configuration** - `backend/test/jest-e2e.json`
   - Separate config for E2E tests
   - Longer timeout for integration tests

3. ✅ **Test Utilities** - `backend/test/test-utils.ts`
   - Helper functions for creating test modules
   - Test app creation
   - Repository helpers
   - Test data utilities

4. ✅ **Test Setup** - `backend/test/jest.setup.ts`
   - Global test configuration
   - Environment variables
   - Timeout settings

5. ✅ **Sample Tests Created:**
   - `backend/test/governance/policies.service.spec.ts` - Unit test example
   - `backend/test/governance/policies.e2e-spec.ts` - E2E test example

6. ✅ **Test Fixtures** - `backend/test/fixtures/policy.fixture.ts`
   - Sample test data
   - Reusable fixtures

---

## 📁 File Structure

```
backend/
├── jest.config.js              # Main Jest configuration
├── test/
│   ├── jest.setup.ts          # Global test setup
│   ├── jest-e2e.json          # E2E test configuration
│   ├── test-utils.ts          # Test utility functions
│   ├── fixtures/              # Test data fixtures
│   │   └── policy.fixture.ts
│   └── governance/
│       ├── policies.service.spec.ts    # Unit test
│       └── policies.e2e-spec.ts        # E2E test
└── package.json               # Updated test scripts
```

---

## 🚀 Running Tests

### Unit Tests:
```bash
cd backend
npm run test                    # Run all unit tests
npm run test:watch             # Watch mode
npm run test:cov               # With coverage
npm run test:governance        # Run only governance tests
```

### E2E Tests:
```bash
cd backend
npm run test:e2e               # Run all E2E tests
```

---

## 📝 Test Files Created

### 1. Unit Test Example (`policies.service.spec.ts`)
- Tests PoliciesService methods
- Uses mocked repositories
- Tests create, findAll, findOne operations

### 2. E2E Test Example (`policies.e2e-spec.ts`)
- Tests full API endpoints
- Tests CRUD operations
- Tests validation
- Tests pagination and filtering

---

## 🔧 Configuration Details

### Jest Config (`jest.config.js`):
- Test files: `*.spec.ts`
- Root directory: `src/`
- TypeScript transformation
- Coverage collection configured
- Path mapping for `@/` imports

### E2E Config (`jest-e2e.json`):
- Test files: `*.e2e-spec.ts`
- Root directory: `test/`
- 30 second timeout
- Separate coverage directory

---

## 📋 Next Steps

1. ✅ Jest configuration created
2. ✅ Test utilities created
3. ✅ Sample tests created
4. ⏳ **Set up test database**
5. ⏳ **Configure Playwright for frontend**
6. ⏳ **Create more test examples**
7. ⏳ **Set up CI/CD test integration**

---

## 🧪 Test Database Setup

**Still Needed:**
- Test database configuration
- Test migrations
- Test data seeding
- Database cleanup utilities

---

## 📚 Resources

- Jest Documentation: https://jestjs.io/
- NestJS Testing: https://docs.nestjs.com/fundamentals/testing
- Supertest: https://github.com/visionmedia/supertest

---

**Status:** Backend testing infrastructure set up! Next: Frontend E2E with Playwright.







