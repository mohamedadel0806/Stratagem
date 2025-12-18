# Playwright Configuration Fix Instructions

## Problem Identified
The error "Playwright Test did not expect test.describe() to be called here" is caused by version conflicts between multiple Playwright installations in the dependency tree.

## Root Cause
- package.json specified `@playwright/test ^1.48.2`
- Next.js 16.0.5 has peer dependency on `@playwright/test ^1.51.1`
- Actual installed version was `1.57.0`
- This created module resolution conflicts

## Immediate Fix Steps

### 1. Clean Installation (REQUIRED)
```bash
cd /Users/adelsayed/Documents/Code/Stratagem/frontend
rm -rf node_modules package-lock.json
npm install
```

### 2. Update Playwright Browsers
```bash
npx playwright install chromium
```

### 3. Test Configuration
The main playwright.config.ts has been updated to:
- Use Playwright ^1.57.0 (matching installed version)
- Removed excessive comments for cleaner configuration
- Consolidated imports in auth fixture

### 4. Verify Fix
Run a simple test to verify the fix:
```bash
npx playwright test e2e/debug-basic-test.spec.ts --project=chromium
```

## Alternative: Use Specific Config Files
If you need different configurations for different testing scenarios, use the --config flag:
```bash
npx playwright test e2e/simple-test.spec.ts --config=playwright.config.test.ts
```

## Files Modified
1. `/Users/adelsayed/Documents/Code/Stratagem/frontend/package.json` - Updated Playwright version
2. `/Users/adelsayed/Documents/Code/Stratagem/frontend/playwright.config.ts` - Cleaned configuration
3. `/Users/adelsayed/Documents/Code/Stratagem/frontend/e2e/fixtures/auth.ts` - Consolidated imports
4. `/Users/adelsayed/Documents/Code/Stratagem/frontend/e2e/debug-basic-test.spec.ts` - Created test file

## Optional Cleanup
Consider removing these extra config files if not needed:
- playwright.config.test.ts
- playwright.config.headed.ts
- playwright.config.simple.ts

## Expected Outcome
After following these steps, the "Playwright Test did not expect test.describe() to be called here" error should be resolved and tests should run normally.