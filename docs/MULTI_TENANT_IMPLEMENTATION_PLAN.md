# Multi-Tenant Architecture Implementation Plan

## Goal Description

Transform the GRC Platform from a single-tenant architecture to a multi-tenant SaaS platform using a **shared database schema with Row-Level Security (RLS)** approach. This implementation will enable the platform to serve multiple organizations from a single infrastructure while maintaining complete data isolation, security, and compliance.

### Business Value
- **60-70% reduction** in infrastructure costs through shared resources
- **Rapid customer onboarding** (< 5 minutes vs. hours)
- **Improved scalability** - add customers without provisioning new infrastructure
- **Enhanced security** through consistent, centralized RLS policies
- **Simplified operations** - single codebase, unified API, centralized monitoring

### Technical Approach
- Add `tenant_id` column to all business tables
- Implement PostgreSQL Row-Level Security (RLS) policies on all tables
- Create tenant context middleware to set `app.tenant_id` session variable
- Update authentication to include `tenant_id` in JWT tokens
- Migrate existing single-tenant data to multi-tenant schema
- Implement tenant management and provisioning workflows

---

## User Review Required

> [!IMPORTANT]
> **Breaking Changes**
> - All existing API requests will require tenant context (via JWT token)
> - Database schema will be modified with `tenant_id` columns (requires migration)
> - Existing single-tenant data will be migrated to a default tenant
> - RLS policies will enforce tenant isolation at the database level

> [!WARNING]
> **Migration Risk**
> - This is a significant database schema change affecting **all business tables** (100+ tables)
> - Requires careful testing and validation before production deployment
> - Rollback plan must be in place (database backup before migration)
> - Estimated downtime: 2-4 hours for production migration

> [!CAUTION]
> **Security Considerations**
> - RLS policies must be tested thoroughly to prevent data leakage
> - Any table without RLS policy = potential security vulnerability
> - Automated validation required to ensure 100% RLS coverage
> - Quarterly audits recommended to verify RLS compliance

### Key Decisions Requiring Review

1. **Migration Strategy**: Should we migrate all existing data to a single "default" tenant, or do you have multiple organizations that need separate tenants?

2. **Tenant Identification**: Should we use:
   - Subdomain-based routing (`tenant1.grcplatform.com`)?
   - Header-based (`X-Tenant-ID` header)?
   - JWT token only (recommended for simplicity)?

3. **Tenant Deletion Policy**: 
   - Soft delete (mark `deleted_at`) for compliance?
   - Hard delete for GDPR right to erasure?
   - Configurable per tenant?

4. **Performance vs. Security Trade-off**: RLS adds ~10-30% query overhead. Are we comfortable with this for enhanced security?

---

## Proposed Changes

### Core Infrastructure

#### [NEW] [tenants](file:///Users/adelsayed/Documents/Code/Stratagem/backend/src/common/entities/tenant.entity.ts)

Create new tenant entity with:
- `id` (UUID, primary key)
- `name` (organization name)
- `code` (unique tenant identifier, e.g., "acme-corp")
- `status` (active, suspended, trial, deleted)
- `settings` (JSONB for tenant-specific configuration)
- `subscription_tier` (starter, professional, enterprise)
- `created_at`, `updated_at`, `deleted_at`

#### [NEW] [tenant.service.ts](file:///Users/adelsayed/Documents/Code/Stratagem/backend/src/common/services/tenant.service.ts)

Tenant management service with:
- `createTenant()` - Create new tenant with default roles and business units
- `suspendTenant()` - Suspend tenant (blocks all logins)
- `deleteTenant()` - Soft/hard delete tenant
- `getTenantSettings()` - Retrieve tenant configuration
- `updateTenantSettings()` - Update tenant configuration

#### [NEW] [tenant-context.interceptor.ts](file:///Users/adelsayed/Documents/Code/Stratagem/backend/src/common/interceptors/tenant-context.interceptor.ts)

Middleware to:
- Extract `tenant_id` from JWT token
- Set PostgreSQL session variable: `SET app.tenant_id = '{tenant_id}'`
- Add tenant context to request object
- Handle missing tenant errors (403 Forbidden)

---

### Database Migrations

#### [NEW] [CreateTenantsTable.ts](file:///Users/adelsayed/Documents/Code/Stratagem/backend/src/migrations/1800000000001-CreateTenantsTable.ts)

Create `tenants` table with all required fields and indexes.

#### [NEW] [AddTenantIdToCoreTables.ts](file:///Users/adelsayed/Documents/Code/Stratagem/backend/src/migrations/1800000000002-AddTenantIdToCoreTables.ts)

Add `tenant_id UUID` column to core tables:
- `users`
- `roles`
- `role_permissions`
- `business_units`
- `tags`
- `audit_logs`
- `approval_workflows`
- `approval_instances`

#### [NEW] [AddTenantIdToGovernanceTables.ts](file:///Users/adelsayed/Documents/Code/Stratagem/backend/src/migrations/1800000000003-AddTenantIdToGovernanceTables.ts)

Add `tenant_id` to governance tables:
- `influencers`
- `frameworks`
- `policies`
- `control_library`
- `control_to_framework_requirements`
- All other governance entities

#### [NEW] [AddTenantIdToAssetTables.ts](file:///Users/adelsayed/Documents/Code/Stratagem/backend/src/migrations/1800000000004-AddTenantIdToAssetTables.ts)

Add `tenant_id` to asset tables:
- `physical_assets`
- `information_assets`
- `business_applications`
- `software_assets`
- `third_party_assets`
- `asset_control_assignments`

#### [NEW] [AddTenantIdToRiskTables.ts](file:///Users/adelsayed/Documents/Code/Stratagem/backend/src/migrations/1800000000005-AddTenantIdToRiskTables.ts)

Add `tenant_id` to risk tables:
- `risks`
- `risk_assessments`
- `risk_treatments`
- `kris`
- `kri_measurements`
- All risk link tables

#### [NEW] [AddTenantIdToComplianceTables.ts](file:///Users/adelsayed/Documents/Code/Stratagem/backend/src/migrations/1800000000006-AddTenantIdToComplianceTables.ts)

Add `tenant_id` to compliance tables:
- `programs`
- `assessments`
- `findings`
- `evidence`
- `reports`

#### [NEW] [EnableRLSOnAllTables.ts](file:///Users/adelsayed/Documents/Code/Stratagem/backend/src/migrations/1800000000007-EnableRLSOnAllTables.ts)

Enable RLS and create policies for all business tables:
```sql
ALTER TABLE table_name ENABLE ROW LEVEL SECURITY;

CREATE POLICY tenant_isolation_policy ON table_name
  USING (tenant_id = current_setting('app.tenant_id')::uuid);
```

#### [NEW] [MigrateExistingDataToDefaultTenant.ts](file:///Users/adelsayed/Documents/Code/Stratagem/backend/src/migrations/1800000000008-MigrateExistingDataToDefaultTenant.ts)

Migrate existing single-tenant data:
1. Create default tenant record
2. Update all existing records to set `tenant_id = default_tenant_id`
3. Make `tenant_id` NOT NULL
4. Add foreign key constraints

---

### Authentication & Authorization

#### [MODIFY] [user.entity.ts](file:///Users/adelsayed/Documents/Code/Stratagem/backend/src/users/entities/user.entity.ts)

Add tenant relationship:
```typescript
@Column({ type: 'uuid', nullable: false })
@Index()
tenantId: string;

@ManyToOne(() => Tenant)
@JoinColumn({ name: 'tenant_id' })
tenant: Tenant;
```

#### [MODIFY] [auth.service.ts](file:///Users/adelsayed/Documents/Code/Stratagem/backend/src/auth/auth.service.ts)

Update authentication:
- Include `tenant_id` in JWT payload
- Validate tenant status on login (active vs. suspended)
- Add tenant context to session

#### [MODIFY] [jwt.strategy.ts](file:///Users/adelsayed/Documents/Code/Stratagem/backend/src/auth/strategies/jwt.strategy.ts)

Extract `tenant_id` from JWT and add to request context.

---

### Entity Updates

All entities in the following modules need `tenant_id` column added:

#### Governance Module
- [influencer.entity.ts](file:///Users/adelsayed/Documents/Code/Stratagem/backend/src/governance/entities/influencer.entity.ts)
- [framework.entity.ts](file:///Users/adelsayed/Documents/Code/Stratagem/backend/src/governance/entities/framework.entity.ts)
- [policy.entity.ts](file:///Users/adelsayed/Documents/Code/Stratagem/backend/src/policy/entities/policy.entity.ts)
- All other governance entities

#### Asset Module
- [physical-asset.entity.ts](file:///Users/adelsayed/Documents/Code/Stratagem/backend/src/asset/entities/physical-asset.entity.ts)
- [information-asset.entity.ts](file:///Users/adelsayed/Documents/Code/Stratagem/backend/src/asset/entities/information-asset.entity.ts)
- [business-application.entity.ts](file:///Users/adelsayed/Documents/Code/Stratagem/backend/src/asset/entities/business-application.entity.ts)
- [software-asset.entity.ts](file:///Users/adelsayed/Documents/Code/Stratagem/backend/src/asset/entities/software-asset.entity.ts)
- [supplier.entity.ts](file:///Users/adelsayed/Documents/Code/Stratagem/backend/src/asset/entities/supplier.entity.ts)

#### Risk Module
- [risk.entity.ts](file:///Users/adelsayed/Documents/Code/Stratagem/backend/src/risk/entities/risk.entity.ts)
- [risk-assessment.entity.ts](file:///Users/adelsayed/Documents/Code/Stratagem/backend/src/risk/entities/risk-assessment.entity.ts)
- [risk-treatment.entity.ts](file:///Users/adelsayed/Documents/Code/Stratagem/backend/src/risk/entities/risk-treatment.entity.ts)
- [kri.entity.ts](file:///Users/adelsayed/Documents/Code/Stratagem/backend/src/risk/entities/kri.entity.ts)

#### Compliance Module
- All compliance entities

#### Common Module
- [business-unit.entity.ts](file:///Users/adelsayed/Documents/Code/Stratagem/backend/src/common/entities/business-unit.entity.ts)
- [audit-log.entity.ts](file:///Users/adelsayed/Documents/Code/Stratagem/backend/src/common/entities/audit-log.entity.ts)

**Pattern for all entities:**
```typescript
@Column({ type: 'uuid', nullable: false })
@Index()
tenantId: string;

@ManyToOne(() => Tenant)
@JoinColumn({ name: 'tenant_id' })
tenant: Tenant;
```

---

### Service Updates

All services will be updated to:
1. **Remove explicit organization filters** - rely on RLS instead
2. **Trust tenant context** from middleware
3. **No manual tenant_id filtering** in queries (RLS handles this)

Example changes:
```typescript
// BEFORE (manual filtering)
async findAll(organizationId: string) {
  return this.repository.find({ where: { organizationId } });
}

// AFTER (RLS handles filtering)
async findAll() {
  return this.repository.find(); // RLS automatically filters by tenant_id
}
```

Services to update:
- All governance services (policies, frameworks, controls, etc.)
- All asset services (physical, information, applications, etc.)
- All risk services (risks, assessments, treatments, KRIs)
- All compliance services

---

### Frontend Changes

#### [MODIFY] [apiClient.ts](file:///Users/adelsayed/Documents/Code/Stratagem/frontend/src/lib/apiClient.ts)

No changes needed - JWT token already includes tenant_id, backend middleware handles extraction.

#### [NEW] Tenant Admin UI (Future Phase)

Create tenant management interface:
- Tenant settings page
- User management (tenant-scoped)
- Subscription management
- Usage analytics

---

## Verification Plan

### Automated Tests

#### 1. Unit Tests - Tenant Service
**Location**: `backend/test/common/tenant.service.spec.ts` (new file)

**Command**: 
```bash
cd backend && npm run test -- tenant.service.spec.ts
```

**Tests**:
- Create tenant with default roles and business units
- Suspend tenant and verify status
- Delete tenant (soft delete)
- Retrieve tenant settings

#### 2. Unit Tests - Tenant Context Interceptor
**Location**: `backend/test/common/tenant-context.interceptor.spec.ts` (new file)

**Command**:
```bash
cd backend && npm run test -- tenant-context.interceptor.spec.ts
```

**Tests**:
- Extract tenant_id from JWT token
- Set PostgreSQL session variable
- Handle missing tenant_id (403 error)
- Handle suspended tenant (403 error)

#### 3. Integration Tests - RLS Enforcement
**Location**: `backend/test/integration/rls-isolation.spec.ts` (new file)

**Command**:
```bash
cd backend && npm run test:e2e -- rls-isolation.spec.ts
```

**Tests**:
- Create two tenants with separate data
- Verify Tenant A cannot see Tenant B's data
- Verify queries return only tenant-specific data
- Test across all modules (governance, assets, risk, compliance)

#### 4. Integration Tests - Multi-Tenant Authentication
**Location**: `backend/test/integration/multi-tenant-auth.spec.ts` (new file)

**Command**:
```bash
cd backend && npm run test:e2e -- multi-tenant-auth.spec.ts
```

**Tests**:
- User login includes tenant_id in JWT
- Suspended tenant users cannot login
- JWT validation extracts tenant_id correctly
- Session includes tenant context

#### 5. Existing Service Tests
**Update existing tests** to work with multi-tenancy:

**Command**:
```bash
cd backend && npm run test
```

**Files to update**:
- `test/governance/policies.service.spec.ts`
- `test/asset/physical-asset.service.spec.ts`
- `test/risk/risk.service.spec.ts`
- All other service tests

**Changes**:
- Add tenant context setup in beforeEach
- Create test data with tenant_id
- Verify RLS filtering works

#### 6. Migration Validation Tests
**Location**: `backend/test/migrations/tenant-migration.spec.ts` (new file)

**Command**:
```bash
cd backend && npm run test -- tenant-migration.spec.ts
```

**Tests**:
- Verify all tables have tenant_id column
- Verify all tables have RLS enabled
- Verify no NULL tenant_id values
- Verify foreign key constraints

---

### Manual Testing

#### 1. Database Migration Validation

**Prerequisites**: Staging database with sample data

**Steps**:
1. Backup staging database: `pg_dump grc_platform > backup.sql`
2. Run migrations: `cd backend && npm run migration:run`
3. Verify tenant table exists: `SELECT * FROM tenants;`
4. Verify tenant_id added to users: `SELECT id, email, tenant_id FROM users LIMIT 10;`
5. Verify RLS enabled: `SELECT tablename, rowsecurity FROM pg_tables WHERE schemaname = 'public';`
6. Test query with tenant context:
   ```sql
   SET app.tenant_id = '<tenant-uuid>';
   SELECT * FROM risks; -- Should return only tenant's risks
   ```

**Expected Result**: All tables have `tenant_id`, RLS enabled, queries filtered by tenant.

#### 2. Multi-Tenant API Testing

**Prerequisites**: Two test tenants created in database

**Steps**:
1. Create Tenant A user and login → get JWT token A
2. Create Tenant B user and login → get JWT token B
3. Create a risk using Token A: `POST /api/v1/risks` with Token A
4. Try to fetch risks using Token B: `GET /api/v1/risks` with Token B
5. Verify Token B does NOT see Token A's risk

**Expected Result**: Complete data isolation between tenants.

#### 3. Tenant Onboarding Flow

**Prerequisites**: Platform admin access

**Steps**:
1. Create new tenant: `POST /api/v1/tenants` with name "Test Corp"
2. Verify default business unit created
3. Verify default roles created (Admin, Manager, Analyst, Viewer)
4. Create first user for tenant
5. Login as first user
6. Verify user can only see their tenant's data

**Expected Result**: New tenant fully functional with isolated data.

---

### Performance Testing

#### Load Test - 100 Tenants

**Tool**: Apache JMeter or k6

**Command**:
```bash
k6 run scripts/load-test-multi-tenant.js
```

**Scenario**:
- 100 concurrent tenants
- 10 users per tenant
- Each user performs: List risks, Create risk, Update risk, Delete risk
- Duration: 10 minutes

**Success Criteria**:
- P99 latency < 1.5 seconds
- Error rate < 1%
- No cross-tenant data leakage
- RLS overhead < 50% (compare with/without RLS)

---

### Security Validation

#### RLS Coverage Audit

**Command**:
```bash
cd backend && npm run test:rls-audit
```

**Script**: `scripts/audit-rls-coverage.ts` (new file)

**Checks**:
- All business tables have RLS enabled
- All RLS policies reference `app.tenant_id`
- No tables missing tenant_id column
- Generate report: `rls-audit-report.json`

**Success Criteria**: 100% coverage (all business tables have RLS)

---

## Implementation Phases

### Phase 1: Foundation (Weeks 1-4)
- Create tenants table and entity
- Add tenant_id to core tables (users, roles, business_units)
- Implement tenant context middleware
- Update authentication to include tenant_id in JWT
- Enable RLS on core tables
- Write unit tests for tenant service and middleware

### Phase 2: Module Migration (Weeks 5-8)
- Add tenant_id to all governance entities and enable RLS
- Add tenant_id to all asset entities and enable RLS
- Add tenant_id to all risk entities and enable RLS
- Add tenant_id to all compliance entities and enable RLS
- Update all services to remove manual filtering
- Update all existing tests

### Phase 3: Data Migration (Weeks 9-10)
- Create default tenant for existing data
- Migrate all existing records to default tenant
- Validate data integrity
- Performance testing with RLS enabled

### Phase 4: Tenant Management (Weeks 11-12)
- Implement tenant provisioning workflow
- Create tenant admin endpoints
- Build tenant settings management
- Implement tenant suspension/deletion

### Phase 5: Testing & Validation (Weeks 13-14)
- Integration testing for cross-tenant isolation
- E2E testing for tenant onboarding
- Load testing with 100 tenants
- Security audit for RLS coverage

### Phase 6: Documentation & Deployment (Weeks 15-16)
- Update API documentation
- Create tenant admin guide
- Deploy to staging and validate
- Production deployment with monitoring

---

**Last Updated**: December 25, 2025  
**Status**: Awaiting Approval  
**Estimated Duration**: 16 weeks
