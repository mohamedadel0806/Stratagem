# E2E Test Troubleshooting Guide

## Current Issues

### Issue 1: Authentication Timeout ❌

**Problem**: Tests are timing out during authentication in the `beforeEach` hook.

**Symptoms**:
- `Test timeout of 30000ms exceeded while running "beforeEach" hook`
- Login button selector not found: `waiting for locator('button[type="submit"]')`

**Root Causes**:
1. **Wrong button selector** - Login form button text is "Sign In with Email", not a standard submit button
2. **NextAuth flow** - Authentication uses NextAuth which has async redirects
3. **Backend not accessible** - Backend API might not be running or accessible
4. **Missing test credentials** - Test user might not exist

### Issue 2: Backend Dependency

Tests require:
- ✅ Backend server running (port 3001)
- ✅ Database accessible
- ✅ Test user account exists

---

## Solutions

### Solution 1: Fix Authentication Fixture ✅ (Done)

Updated `e2e/fixtures/auth.ts` to:
- Use correct button selector (by text: "Sign In with Email")
- Handle NextAuth redirects properly
- Better error handling and debugging

### Solution 2: Set Up Test User

**Option A: Create test user via API**

```bash
# Create a test user via backend API
curl -X POST http://localhost:3001/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "testpassword123",
    "firstName": "Test",
    "lastName": "User"
  }'
```

**Option B: Use existing user**

Set environment variables:
```bash
export TEST_USER_EMAIL=your-existing-user@example.com
export TEST_USER_PASSWORD=your-password
```

### Solution 3: Create .env.test File

Create `frontend/.env.test`:

```env
TEST_USER_EMAIL=test@example.com
TEST_USER_PASSWORD=testpassword123
FRONTEND_URL=http://localhost:3000
```

### Solution 4: Make Tests Optional (Skip Auth)

For now, you can skip authentication and test pages that don't require auth, or create a mock authentication.

---

## Quick Fixes

### Fix 1: Update Button Selector

The login button uses text "Sign In with Email", not `type="submit"`. ✅ Fixed in auth.ts

### Fix 2: Check Backend is Running

```bash
curl http://localhost:3001/health
```

Should return a health status.

### Fix 3: Check Frontend is Accessible

```bash
curl http://localhost:3000
```

Should return HTML.

### Fix 4: Run Tests with More Verbose Output

```bash
cd frontend
DEBUG=pw:api npm run test:e2e
```

---

## Running Tests Without Full Setup

### Option 1: Skip Authentication Tests

Temporarily skip tests that require auth:

```typescript
test.skip('requires auth', async ({ page }) => {
  // Test code
});
```

### Option 2: Mock Authentication

Create a simpler auth fixture that bypasses login:

```typescript
authenticatedPage: async ({ page }, use) => {
  // Set auth token in localStorage or cookies
  await page.addInitScript(() => {
    localStorage.setItem('auth-token', 'mock-token');
  });
  await use(page);
}
```

### Option 3: Use Playwright's Storage State

After first successful login, save authentication state:

```typescript
// After successful login
await page.context().storageState({ path: 'auth.json' });

// In future tests, use stored auth
authenticatedPage: async ({ browser }, use) => {
  const context = await browser.newContext({
    storageState: 'auth.json'
  });
  const page = await context.newPage();
  await use(page);
}
```

---

## Recommended Next Steps

1. ✅ **Fix authentication fixture** - Use correct button selector
2. ⏳ **Set up test user** - Create or identify test credentials
3. ⏳ **Create .env.test** - Store test credentials securely
4. ⏳ **Verify backend is running** - Check health endpoint
5. ⏳ **Run single test** - Test authentication first before all tests

---

## Test Configuration Notes

- Playwright will automatically start dev server via `webServer` config
- Tests use baseURL: `http://localhost:3000`
- Authentication uses NextAuth with credentials provider
- Backend API should be at: `http://localhost:3001`

---

## Common Errors

### Error: "Test timeout exceeded"
- **Cause**: Page not loading, authentication failing, or backend not accessible
- **Fix**: Check backend is running, verify test credentials, increase timeout

### Error: "Element not found"
- **Cause**: Page structure changed or selector is wrong
- **Fix**: Use Playwright codegen to generate correct selectors

### Error: "Navigation timeout"
- **Cause**: Page taking too long to load or redirect
- **Fix**: Check network, verify services are running, increase timeout

---

## Debugging Commands

```bash
# Run single test with verbose output
npx playwright test e2e/governance/dashboard.spec.ts --headed --debug

# Generate test code interactively
npx playwright codegen http://localhost:3000/en/login

# Show test report
npx playwright show-report

# View trace
npx playwright show-trace trace.zip
```





