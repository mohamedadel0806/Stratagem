# Multi-Tenant Authentication Testing

## Overview

This directory contains E2E tests for multi-tenant authentication and data isolation.

## Test Files

### 1. multi-tenant-login.spec.ts

Tests multi-tenant authentication flows and JWT token structure.

**Test Cases:**
- ✅ Login with default tenant user
- ✅ Login with Acme tenant user  
- ✅ Verify JWT includes all required claims (sub, email, role, tenantId, iat, exp)
- ✅ Verify tenant_id is correct for each tenant
- ✅ Test invalid credentials (should fail)

**Usage:**
```bash
npm run test:e2e -- auth/multi-tenant-login.spec.ts
```

### 2. cross-tenant-isolation.spec.ts

Tests cross-tenant data isolation and RLS enforcement.

**Test Cases:**
- ✅ Default tenant sees only their data (influencers)
- ✅ Acme tenant sees only their data (empty for new tenant)
- ✅ Default tenant sees only their policies
- ✅ Acme tenant sees only their policies (empty)
- ✅ Tenant isolation maintained across navigation
- ✅ No data leakage between separate browser contexts

**Usage:**
```bash
npm run test:e2e -- auth/cross-tenant-isolation.spec.ts
```

## Test Data

### Default Tenant
- **ID:** `48c23483-9007-4ef8-bf35-103d13f6436b`
- **Email:** `test@example.com`
- **Password:** `password123`
- **Expected Data:** Has influencers, policies, and other governance data

### Acme Tenant
- **ID:** `aaaaaaaa-bbbb-cccc-dddd-000000000002`
- **Email:** `admin@acme.com`
- **Password:** `Test123!`
- **Expected Data:** Empty (new tenant)

## Running All Auth Tests

```bash
# Run all auth tests
npm run test:e2e -- auth/

# Run with headed browser (for debugging)
npm run test:e2e -- auth/ --headed

# Run specific test
npm run test:e2e -- auth/multi-tenant-login.spec.ts --headed
```

## What These Tests Verify

### Authentication
1. Users can login with correct credentials
2. JWT tokens are issued with proper structure
3. JWT includes tenant_id claim
4. Invalid credentials are rejected

### Multi-Tenancy
1. Each tenant only sees their own data
2. RLS policies enforce tenant isolation
3. No cross-tenant data leakage
4. Tenant context persists across navigation
5. Separate browser contexts maintain isolation

## Troubleshooting

### Test Fails: "Login failed"
- Verify backend is running (`docker ps`)
- Check user credentials exist in database
- Ensure migrations have run

### Test Fails: "Data not isolated"
- Verify RLS policies are enabled
- Check tenant_id is set in PostgreSQL session
- Ensure TenantInterceptor is working

### Test Fails: "JWT doesn't include tenant_id"
- Check JwtStrategy includes tenantId in payload
- Verify AuthService.login() sets tenantId
- Ensure user.tenantId is populated in database

## Next Steps

After these tests pass:
1. Add UX component tests (onboarding wizard, upgrade dialog)
2. Add integration tests for service layer
3. Create documentation for multi-tenant patterns
