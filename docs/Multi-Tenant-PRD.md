# Product Requirements Document: Multi-Tenant Architecture Implementation

**Document Version:** 1.0  
**Last Updated:** December 21, 2025  
**Status:** Draft - Awaiting Approval  
**Owner:** Platform Architecture & Engineering Team

---

## Executive Summary

This PRD defines the implementation of multi-tenancy across all modules of the Cyber Security and Privacy GRC Platform. Multi-tenancy enables the platform to serve multiple organizations (customers/tenants) from a single shared infrastructure while maintaining complete data isolation, security, and compliance.

The implementation strategy uses a **shared database schema with row-level security (RLS)** approach, where all tenants share the same PostgreSQL database, tables, and infrastructure, but each tenant's data is logically isolated using the `tenant_id` column combined with PostgreSQL RLS policies.

**Business Value:**
- Reduce infrastructure costs by 60-70% (shared resources vs. separate databases)
- Improve platform scalability: add customers without provisioning new infrastructure
- Enhance operational efficiency: single codebase, unified API, centralized monitoring
- Enable rapid customer onboarding (minutes vs. hours)
- Improve security through consistent, centralized policies
- Simplify disaster recovery and backups (single backup strategy)

---

## Background & Problem Statement

### Current State
- Platform architecture is single-tenant per deployment (one database, one customer)
- Each new customer requires separate database provisioning, code deployment, infrastructure setup
- Customer onboarding is slow and resource-intensive
- Infrastructure costs scale linearly with customer count
- Operational complexity: monitoring, patching, backups per customer

### Business Problem
To become a successful SaaS platform, the GRC system must support:

1. **Multiple simultaneous customers** sharing infrastructure
2. **Complete data isolation** (no customer sees another's data)
3. **Efficient resource utilization** (shared database, shared application servers)
4. **Rapid onboarding** (new customer created in minutes)
5. **Cost efficiency** (lower cost per customer through resource sharing)
6. **Regulatory compliance** (GDPR right to erasure, PDPL data localization, SOC 2 isolation)

Single-tenant architecture cannot meet these needs at scale. Multi-tenancy is mandatory for SaaS viability.

### Why Shared Database Schema + RLS?
- **Advantages:**
  - Single database to maintain, patch, backup
  - Lowest infrastructure cost
  - Fastest customer onboarding (insert row, apply RLS)
  - Simplest deployment and operations
  - Easiest data migration between tenants (if needed)
  
- **Trade-offs:**
  - Requires disciplined RLS policy enforcement
  - Query complexity (must always filter by tenant_id)
  - Requires careful schema design (no tenant_id = security risk)
  - Difficult to scale beyond 1000+ large tenants (future: database-per-tenant hybrid)

---

## Goals & Success Metrics

### Primary Goals
1. **Implement multi-tenant isolation** — Every query filtered by tenant_id with RLS enforcement
2. **Enable rapid onboarding** — New tenant created and deployed in <5 minutes
3. **Maintain security posture** — Zero data leakage between tenants, audit compliance
4. **Reduce operational overhead** — Single database infrastructure, unified monitoring
5. **Support scaling** — Platform supports 100+ concurrent tenants (Phase 1 target)

### Success Metrics
- **Isolation:** 100% of queries return tenant-specific data (verified by automated tests)
- **Onboarding:** New tenant provisioned in <5 minutes
- **Compliance:** RLS enforced on all tables (automated schema validation)
- **Performance:** Query response time <1s even with RLS filtering
- **Cost:** Infrastructure cost per tenant reduced by 60% vs. single-tenant baseline
- **Security:** Zero security incidents due to tenant isolation failure
- **Audit:** 100% audit trail captured for all operations across all tenants

---

## Scope

### In Scope
- Multi-tenant implementation for all four modules:
  - Governance (policies, frameworks, controls, influencers)
  - Assets (physical, information, applications, software, third-party assets)
  - Risk (risks, treatments, assessments, KRIs)
  - Compliance (assessments, findings, evidence, reports)

- Core infrastructure for multi-tenancy:
  - Tenants table and management
  - Users and authentication (tenant-aware)
  - Roles and permissions (tenant-scoped)
  - Audit logging (tenant-scoped)
  - Row-level security (RLS) policies on all business tables

- Tenant lifecycle:
  - Tenant creation/registration
  - Data isolation enforcement
  - Tenant suspension and deletion (with data retention policies)
  - Billing and subscription management (integration point)

- Data migration:
  - Migrate single-tenant data → multi-tenant schema
  - Populate tenant_id for all existing records

### Out of Scope (Future Phases)
- Hybrid database-per-tenant scaling (for 1000+ tenant scenarios)
- Tenant-to-tenant data sharing or collaboration
- Multi-region deployment (future infrastructure expansion)
- Tenant-specific custom fields (future extensibility module)
- White-label/reseller portal (future sales channel)
- Real-time analytics (future analytics module)

---

## Requirements

### Functional Requirements

#### FR-1: Tenant Management

**FR-1.1: Tenant Creation**
- Admin user (platform admin) can create new tenants
- Required fields: Tenant name, Tenant code (unique), Industry, Regulatory scope
- Auto-generate tenant UUID
- Create initial workspace: Default business unit (company-wide)
- Create default roles: Admin, Manager, Analyst, Viewer (configurable)
- Default subscription tier: Starter (can be upgraded)
- Activation: Tenant status = "active" (or "trial", "suspended")
- Audit trail: Who created, when, from what IP

**FR-1.2: Tenant Suspension**
- Tenant suspended → All user logins fail with "account suspended" message
- Data remains in database (not deleted)
- Audit trail: Suspension reason, suspended by, when
- Re-activation: Admin can reactivate suspended tenant

**FR-1.3: Tenant Deletion**
- Data deletion policy: Soft delete (mark deleted_at) or hard delete (configurable per regulation)
- GDPR right to erasure: Hard delete all PII for deleted tenant (automated)
- PDPL compliance: Retain transaction logs 5 years (RLS filters deleted tenants)
- Notifications: Warn tenant admin 30 days before deletion
- Dependency check: Alert on linked data (risks, findings, contracts) before deletion

**FR-1.4: Tenant Configuration**
- Configurable parameters per tenant:
  - Risk assessment method (5x5 matrix, other scales)
  - Risk level thresholds (inherent/current/target boundaries)
  - Lookup values (criticality levels, statuses, etc.)
  - Default business unit
  - Language and locale (i18n support)
  - Logo and branding (future white-label)
  - Email domain for domain-based user assignment

**FR-1.5: Tenant Settings Dashboard**
- Tenant admin can view/edit:
  - Organization name, industry, regulatory scope
  - Business units, cost center allocation
  - Subscription tier, renewal date, payment method (integration point)
  - User count, active licenses used
  - Data storage used, backup schedule
  - Support contact, billing contact

#### FR-2: User Management (Tenant-Scoped)

**FR-2.1: User Registration (Tenant-Aware)**
- User creation assigns user to specific tenant
- Users cannot see other tenants (field hidden in most UIs)
- Field: `user.tenant_id` — immutable after creation
- Email uniqueness: Email + tenant must be unique (same email OK in different tenants)
- Auto-assignment: Users with company domain auto-assigned to company tenant

**FR-2.2: User Authentication & Authorization**
- Login flow: Username/email + password
- Backend: Verify user exists AND tenant is active
- Session: Session token includes `tenant_id` and `user_id`
- All subsequent requests filtered by session `tenant_id`
- Permission check: User's role must allow action in user's tenant

**FR-2.3: User Business Unit Assignment**
- User assigned to one or more business units
- Business units isolated per tenant
- Permissions can be scoped to:
  - All business units (company-wide view)
  - Specific business units (departmental view)
  - Own (user's own data only)
- Visibility: Users see only BUs they're assigned to + their data in those BUs

**FR-2.4: Cross-Tenant Access Prevention**
- After login, user session locked to tenant_id
- Cannot switch tenants in UI (logout → switch account)
- Cannot see users, data, or configurations from other tenants
- Error handling: Attempting to access other tenant's data → 403 Forbidden

#### FR-3: Row-Level Security (RLS)

**FR-3.1: RLS Policy Definition**
- PostgreSQL RLS enabled on all business tables
- Policy: `tenant_policy` → `current_setting('app.tenant_id') = tenant_id`
- Policy type: PERMISSIVE (allow) for SELECT, INSERT, UPDATE, DELETE
- Fallback policy: DENY all if tenant_id not set in session
- Audit: All RLS denials logged

**FR-3.2: RLS Enforcement on All Tables**
Tables requiring RLS policies:
```
Core: users, roles, role_permissions, business_units, tags, audit_logs, 
      approval_workflows, approval_instances
Governance: influencers, frameworks, policies, control_library, 
            control_to_framework_requirements
Assets: physical_assets, information_assets, business_applications, 
        software_assets, third_party_assets, asset_control_assignments
Risk: risks, risk_assets, risk_controls, risk_assessments, treatments, 
      kris, kri_measurements, risk_reviews
Compliance: programs, assessments, assessment_controls, findings, evidence, reports
Third Party: suppliers, supplier_tags, supplier_assessments, supplier_contracts
```

**FR-3.3: RLS Testing & Validation**
- Unit tests: Verify RLS blocks cross-tenant access
- Integration tests: Verify SELECT/INSERT/UPDATE/DELETE respects tenant_id
- Automated audit: Run quarterly to verify all tables have RLS enabled
- Dashboard: Show RLS compliance by table (100% = all tables protected)

**FR-3.4: RLS Performance Optimization**
- Indexes on `(tenant_id, [other_columns])` for common queries
- Statistics: Updated via `ANALYZE` on large tables
- Query plans: Verified via `EXPLAIN` (RLS filter should be first)
- Benchmarks: Queries with RLS <1.5x slower than without (acceptable)

#### FR-4: Audit Logging (Tenant-Aware)

**FR-4.1: Audit Trail Capture**
- All CRUD operations logged: Create, Update, Delete (Select is read-only, not logged)
- Logged fields: `timestamp, tenant_id, user_id, entity_type, entity_id, action, old_value, new_value, ip_address`
- PII handling: Option to redact sensitive fields (passwords, API keys)
- Retention: 7 years for compliance (configurable per regulation)
- Immutability: Audit logs cannot be modified after creation

**FR-4.2: Audit Log Filtering**
- Users see only audit logs for their tenant
- Admins can filter: By date, user, entity type, action
- Exportable: CSV export for compliance reviews
- Alerts: Critical operations (user deletion, policy deletion) trigger notifications

**FR-4.3: Change Tracking**
- All field-level changes captured in `audit_log_changes` table
- Old value → New value logged for each field
- Used for: Compliance investigations, rollback analysis, audit trails

#### FR-5: Tenant-Scoped Configuration

**FR-5.1: Lookup Tables (Configurable)**
- Global lookups: Default risk levels, criticality levels, statuses (seed data)
- Tenant-customizable: Tenants can add custom lookup values
- Example: Risk levels = [Critical, High, Medium, Low] (default) but tenant can add [Extreme]
- Used in: Risk assessment matrix, asset criticality, approval statuses

**FR-5.2: Email & Notification Configuration**
- Email domain: Admin sets company email domain
- Auto-assignment: Users with company domain auto-added to tenant
- SMTP settings: Tenant can configure custom SMTP (or use platform default)
- Email templates: Tenant can customize alert/approval emails

**FR-5.3: Integration Configuration**
- Each tenant can configure third-party integrations independently
- Stored per tenant: API keys, credentials, webhook URLs (encrypted)
- Scoped: Integrations only sync/share data within tenant

#### FR-6: API Multi-Tenancy

**FR-6.1: API Tenant Routing**
- Subdomain-based tenant identification: `api.tenantcode.grcplatform.com`
- OR Header-based: `X-Tenant-ID: {tenant_uuid}` in request headers
- OR OAuth: Tenant extracted from JWT token
- Tenant ID set in request context: `app.tenant_id` PostgreSQL setting
- Applied before any query execution

**FR-6.2: API Response Isolation**
- All API responses return only tenant data
- No tenant_id in response body (implicit from context)
- Error responses: Do not leak other tenant existence
- Example: GET /risks returns risks for authenticated user's tenant only

**FR-6.3: API Rate Limiting (Tenant-Aware)**
- Rate limits per tenant: 1000 requests/min (configurable)
- Tracks per tenant + user combination
- Prevents: One tenant DoS-ing platform affecting others
- Alert: Tenant nearing rate limit warned proactively

#### FR-7: Data Migration & Tenantization

**FR-7.1: Single-Tenant → Multi-Tenant Migration**
- Existing single-tenant database migrated to multi-tenant schema
- Process:
  1. Create `tenants` record for existing customer
  2. Add `tenant_id` column to all business tables (nullable initially)
  3. Batch update: Set all existing records `tenant_id = customer_tenant_id`
  4. Alter column: Make `tenant_id NOT NULL`
  5. Add RLS policies on all tables

**FR-7.2: Data Validation Post-Migration**
- Count verification: Records in source = records in target
- Sample verification: 100 random records spot-checked
- Referential integrity: All FKs valid post-migration
- RLS validation: Query results filtered correctly
- Rollback plan: If validation fails, restore from backup

**FR-7.3: Historical Data Retention**
- Audit logs: Retain 7 years (with tenant_id for historical tenant context)
- Deleted records: Soft-deleted records can be queried by admin (with RLS)
- Compliance: Full audit trail maintained even after tenant deletion

#### FR-8: Tenant Provisioning Workflow

**FR-8.1: New Tenant Onboarding**
```
Step 1: Admin creates tenant (FR-1.1)
  → Generated: tenant_id UUID, default workspace, default roles
  
Step 2: Admin invites first user (FR-2.1)
  → Sent: Invite email with magic link or temporary password
  
Step 3: First user logs in (FR-2.2)
  → Created: User session with tenant_id, creates workspace
  
Step 4: Tenant configures settings (FR-1.4, FR-5)
  → Configured: Risk levels, lookup values, business units
  
Step 5: Tenant imports initial data (optional, FR-7)
  → Bulk import: Assets, risks, policies, frameworks
  
Result: Tenant ready for use in <5 minutes
```

**FR-8.2: Tenant Configuration Checklist**
- Setup workflow guides new tenant through:
  - Organization details (name, industry, regulatory scope)
  - Business unit structure
  - User roles and team assignments
  - Regulatory framework selection (ISO, PCI, SOC 2, etc.)
  - Email and notification settings
  - (Optional) Historical data import
- Progress tracker: Shows completion %, can skip steps

**FR-8.3: Trial Tenant Activation**
- Trial tenants: 30-day free trial with limited features
- Features disabled: Advanced reporting, API access, advanced integrations
- Activation: Upgrade to paid plan → all features enabled
- Conversion tracking: Trial-to-paid conversion rate monitored

---

### Non-Functional Requirements

#### NFR-1: Security

**NFR-1.1: Authentication & Authorization**
- Passwords hashed with bcrypt (salt cost factor ≥12)
- MFA support: TOTP (Google Authenticator, Microsoft Authenticator)
- Session timeout: 30 minutes inactivity, max 8 hours absolute
- JWT tokens: Signed with HS256, include tenant_id, exp claim

**NFR-1.2: Data Encryption**
- At rest: AES-256 encryption (PII fields: passwords, API keys, contact info)
- In transit: TLS 1.2+, HTTPS only
- Key management: Separate key per tenant (future enhancement)
- Compliance: Keys stored in HSM or secure vault (future)

**NFR-1.3: RLS Enforcement**
- All business tables have RLS enabled and tested
- Policy: `current_setting('app.tenant_id')::uuid = tenant_id`
- Fallback: DENY policy if tenant_id not set
- Audit: Quarterly RLS compliance check

**NFR-1.4: Cross-Tenant Access Prevention**
- No query returns data from multiple tenants
- Test coverage: Unit tests verify isolation for each entity type
- Automated scanning: Quarterly audit of codebase for hardcoded tenant_id

#### NFR-2: Performance

**NFR-2.1: Query Performance**
- 99th percentile query latency: <1s with RLS filtering
- Index coverage: Indexes on tenant_id, foreign keys, filter columns
- Query optimization: EXPLAIN plans reviewed quarterly
- Slow query log: Monitored, alerts if >5s

**NFR-2.2: Scalability**
- Phase 1 target: 100 concurrent tenants, 1000 concurrent users
- Database: PostgreSQL 14+, connection pooling (PgBouncer)
- Application servers: Horizontal scaling via load balancer
- Caching: Redis for session, rate limit, query caching

**NFR-2.3: Load Testing**
- Simulated load: 100 tenants × 10 users each
- Metrics: Response time, throughput (requests/sec), error rate
- Success criteria: <1s response, <1% errors, >1000 req/s throughput

#### NFR-3: Availability & Disaster Recovery

**NFR-3.1: High Availability**
- RTO (Recovery Time Objective): <1 hour
- RPO (Recovery Point Objective): <15 minutes
- Database replication: Multi-region read replicas
- Application failover: Active-passive or active-active setup

**NFR-3.2: Backups**
- Frequency: Daily full backups, hourly incremental (transaction logs)
- Retention: 30 days on-disk, 90 days in cold storage
- Testing: Monthly restore test from cold storage
- Encryption: Backup encryption at rest

**NFR-3.3: Monitoring & Alerting**
- System metrics: CPU, memory, disk, network (alerting at 80%)
- Database metrics: Connection count, slow queries, replication lag
- Application metrics: Error rate, response time, RLS denials
- Alerting: PagerDuty integration for critical alerts

#### NFR-4: Compliance & Auditability

**NFR-4.1: GDPR Compliance**
- Data subject requests: Provide tenant data in machine-readable format (<30 days)
- Right to erasure: Hard delete PII when tenant deleted
- DPIA (Data Protection Impact Assessment): Completed for multi-tenant design
- DPA (Data Processing Agreement): Available for all customers

**NFR-4.2: PDPL Compliance (Saudi Arabia)**
- Data localization: All tenant data stored in region specified (Saudi Arabia, EU, US)
- Retention: Configure per-tenant data retention policies
- Encryption: At rest and in transit (mandatory)
- Breach notification: Notify within 72 hours

**NFR-4.3: SOC 2 Type II**
- Controls: Access, change management, monitoring, incident response
- Audit: Independent audit annually
- Report: SOC 2 Type II certificate available for compliance-sensitive customers

**NFR-4.4: Audit Trail**
- Immutable logs: Append-only, tamper-evident hashing
- Retention: 7 years (FINRA, SOX requirements)
- Access: Audit logs accessible only to authorized admins + audit roles
- Export: Formats for compliance reviews (CSV, PDF)

#### NFR-5: Cost Efficiency

**NFR-5.1: Infrastructure Costs**
- Baseline: Single database + shared app servers
- Cost per tenant: Decreases as tenant count increases
- Target: <$10 COGS per tenant (vs. $50-100 for single-tenant)

**NFR-5.2: Operational Costs**
- Reduced manual overhead: Single deployment, single monitoring
- Automation: CI/CD pipeline for faster releases
- Support efficiency: Centralized troubleshooting, logs

---

## Design & Architecture

### Database Architecture

#### Tenant Isolation Strategy: Shared Schema + RLS

```sql
-- Step 1: Tenant Provisioning
INSERT INTO core.tenants (id, name, code, status) 
VALUES ('uuid-1', 'Acme Corp', 'acme', 'active');

-- Step 2: User Creation (Bound to Tenant)
INSERT INTO core.users (id, tenant_id, email, password_hash) 
VALUES ('uuid-user', 'uuid-1', 'admin@acme.com', '$2b$12$...');

-- Step 3: RLS Policy (Applied to All Tables)
ALTER TABLE core.users ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation_users ON core.users
  USING (tenant_id = current_setting('app.tenant_id')::uuid);

-- Step 4: Set Tenant Context (In Application)
-- Before any query execution in API:
SELECT set_config('app.tenant_id', 'uuid-1'::text, false);

-- Result: User can only see data where tenant_id = 'uuid-1'
SELECT * FROM core.risks;  -- Returns only risks for tenant 'uuid-1'
```

#### Schema Structure

```
core/
├── tenants (root entity)
├── users (tenant_id FK)
├── roles (tenant_id FK)
├── role_permissions (tenant_id FK)
├── business_units (tenant_id FK)
├── lookup_types, lookup_values (global + tenant-specific)
├── tags (tenant_id FK)
├── audit_logs, audit_log_changes (tenant_id FK)
└── approval_workflows, approval_instances (tenant_id FK)

governance/
├── influencers (tenant_id FK)
├── frameworks (tenant_id FK)
├── policies (tenant_id FK)
├── control_library (tenant_id FK)
└── control_to_framework_requirements (tenant_id FK)

assets/
├── asset_types (global)
├── physical_assets (tenant_id FK)
├── information_assets (tenant_id FK)
├── business_applications (tenant_id FK)
├── software_assets (tenant_id FK)
├── third_party_assets (tenant_id FK)
└── asset_control_assignments (tenant_id FK)

risk/
├── risk_categories (global)
├── risk_subcategories (global)
├── risks (tenant_id FK)
├── risk_assets, risk_controls (tenant_id FK)
├── risk_assessments (tenant_id FK)
├── treatments (tenant_id FK)
├── kris, kri_measurements (tenant_id FK)
└── risk_reviews (tenant_id FK)

compliance/
├── programs (tenant_id FK)
├── assessments (tenant_id FK)
├── assessment_controls (tenant_id FK)
├── findings (tenant_id FK)
├── evidence (tenant_id FK)
└── reports (tenant_id FK)

third_party/
├── suppliers (tenant_id FK)
├── supplier_tags (tenant_id FK)
├── supplier_assessments (tenant_id FK)
└── supplier_contracts (tenant_id FK)
```

**Global vs. Tenant-Scoped Tables:**
- **Global** (NO tenant_id): `asset_types`, `risk_categories`, `lookup_types` (seed/reference data)
- **Tenant-Scoped** (HAS tenant_id): All business entities (users, assets, risks, etc.)

### API Architecture

#### Tenant Context Routing

```
Client Request:
  POST /api/v1/risks
  Headers: { Authorization: "Bearer eyJhbGc...", X-Tenant-ID: "uuid-1" }
  Body: { title: "Vendor Risk", ... }

API Gateway/Middleware:
  1. Extract tenant_id from header OR JWT token
  2. Verify: User exists && User.tenant_id == tenant_id from request
  3. Set PostgreSQL config: SELECT set_config('app.tenant_id', 'uuid-1'::text, false)
  4. Route to endpoint handler

Endpoint Handler:
  5. Receive tenant_id from middleware (implicit in request context)
  6. Query: INSERT INTO risk.risks (tenant_id, ...) VALUES (tenant_id, ...)
  7. PostgreSQL RLS: Enforces tenant_id match
  8. Response: Risk object returned (no explicit tenant_id shown to client)

Database:
  9. RLS Policy evaluates: current_setting('app.tenant_id')::uuid = tenant_id
  10. Allow: Row inserted/returned (tenant match)
  11. Audit: Insert logged with tenant_id context
```

#### API Design Principles

1. **Implicit Tenant Context**: Tenant ID never in request body (inferred from auth)
2. **Consistent Isolation**: All endpoints filter by current tenant
3. **Error Transparency**: 403 errors don't reveal other tenant existence
4. **Pagination**: Per-tenant queries support pagination (e.g., risks for current tenant)
5. **Filtering**: Users filter within their tenant, not across tenants

### Authentication & Session Architecture

#### OAuth 2.0 / OpenID Connect with Tenant Binding

```
Login Flow:
  1. User enters: email + password
  2. Backend: Verify user.email && user.password_hash && user.tenant_id is NOT NULL
  3. Generate JWT token with claims:
     {
       "sub": "user-id",
       "tenant_id": "uuid-1",
       "email": "user@acme.com",
       "roles": ["analyst", "risk_owner"],
       "exp": <30 min from now>
     }
  4. Return: JWT token to client
  5. Client: Store JWT in httpOnly cookie (CSRF protected) or secure storage

Subsequent Requests:
  6. Client sends: Authorization: Bearer <JWT>
  7. Middleware: Verify JWT signature && expiration
  8. Extract: tenant_id, user_id, roles from JWT claims
  9. Set PostgreSQL: app.tenant_id = tenant_id from JWT
  10. Continue with request (RLS filtering automatically applied)
```

#### MFA (Multi-Factor Authentication)

```
MFA Flow:
  1. User enters email + password
  2. Verify: Credentials valid, MFA enabled for user
  3. Prompt: "Enter 6-digit code from authenticator"
  4. User enters: 6-digit TOTP code
  5. Verify: Code matches user's TOTP secret (time-window ±30 sec)
  6. Issue: JWT token (as above) with MFA claim: "mfa": true
  7. Security: Enforce MFA for all admin/vendor-manager role users
```

### Data Migration Strategy

#### Single-Tenant → Multi-Tenant Schema Migration

```sql
-- Phase 1: Prepare Migration Environment
1. Backup existing single-tenant database
2. Create staging environment (copy of production)
3. Validate: Staging = Production (record counts, checksums)

-- Phase 2: Add Tenant Support to Staging
4. Add column: ALTER TABLE core.users ADD COLUMN tenant_id UUID NULL;
5. Create tenants record for existing customer:
   INSERT INTO core.tenants (id, name, code, status) 
   VALUES ('customer-uuid', 'ExistingCorp', 'existingcorp', 'active');
6. Batch update all tables: UPDATE table SET tenant_id = 'customer-uuid' WHERE tenant_id IS NULL;
7. Make NOT NULL: ALTER TABLE table ALTER COLUMN tenant_id SET NOT NULL;
8. Add PK constraint: ALTER TABLE table ADD CONSTRAINT table_pkey 
                     PRIMARY KEY (id, tenant_id);  -- Composite PK

-- Phase 3: Enable RLS on Staging
9. For each business table:
   a. ALTER TABLE table ENABLE ROW LEVEL SECURITY;
   b. CREATE POLICY tenant_isolation ON table 
      USING (tenant_id = current_setting('app.tenant_id')::uuid);
   c. Test: Verify RLS filters correctly

-- Phase 4: Validate Staging
10. Count verification: SELECT COUNT(*) per table = source count
11. Sample verification: Spot-check 100 records in each table
12. RLS testing: Query with different tenant_id contexts
13. Referential integrity: Validate all FKs
14. Performance: Run slow query log, optimize if needed

-- Phase 5: Cutover to Production
15. Announce: "Maintenance window: 2 hours (HH:MM - HH:MM UTC)"
16. Backup: Snapshot production database
17. Run migration: Apply Phase 2-3 steps to production
18. Validation: Repeat Phase 4 checks on production
19. Revert plan: If validation fails, restore backup
20. Announce: "Migration complete, new customer onboarding enabled"
```

#### Testing Post-Migration

```sql
-- RLS Isolation Test
SELECT set_config('app.tenant_id', 'customer-uuid'::text, false);
SELECT COUNT(*) FROM risks;  -- Should return customer's risk count
SELECT set_config('app.tenant_id', 'other-customer-uuid'::text, false);
SELECT COUNT(*) FROM risks;  -- Should return 0 or other customer's count

-- Data Integrity Test
SELECT COUNT(*) FROM users WHERE tenant_id IS NULL;  -- Should return 0
SELECT COUNT(*) FROM risks WHERE tenant_id IS NULL;  -- Should return 0
SELECT COUNT(DISTINCT tenant_id) FROM risks;  -- Should return 1 (customer-uuid)
```

### Monitoring & Observability

#### Key Metrics to Monitor

```
Tenant Isolation:
- RLS policy denials per tenant (alert if > 0)
- Cross-tenant query attempts (security metric)
- Audit log entry count per tenant (trending)

Performance:
- Query latency by endpoint (percentiles: p50, p95, p99)
- RLS overhead: Query time with vs. without RLS (target: <1.5x)
- Database connection count per tenant
- Slow query log (>1s) analysis

Availability:
- Uptime % per tenant (target: 99.9%)
- Error rate % per tenant
- Backup/restore success rate
- Replication lag (RDS: <100ms)

Compliance:
- Audit log entry rate
- Failed authentication attempts per tenant
- MFA adoption % (target: 100% for admins)
- Data deletion requests (GDPR) processed in <30 days

Cost:
- Infrastructure cost per tenant (trending downward)
- Storage growth per tenant (GB/month)
- Query cost (if using cloud DB with per-query pricing)
```

#### Dashboards

- **Platform Admin Dashboard**: All tenants, system health, cost per tenant
- **Tenant Admin Dashboard**: Usage, cost, user count, data storage
- **Security Dashboard**: RLS denials, auth failures, audit events
- **Support Dashboard**: Customer issues, slow queries, error rates

---

## Implementation Phases

### Phase 1: Foundation (Weeks 1-4)
**Deliverables:**
- Database migration: Single-tenant → Multi-tenant schema
- RLS policies: Enable on core tables (users, roles, business_units, tags)
- Authentication: JWT with tenant_id binding
- Tenant management: Create/suspend/delete workflows
- Data validation: Post-migration testing + audit

**Testing:**
- Unit tests: RLS enforcement per entity
- Integration tests: User login → tenant context → query filtering
- Load test: 10 tenants × 10 users
- Regression test: Existing single-tenant functionality

### Phase 2: Full RLS Rollout (Weeks 5-8)
**Deliverables:**
- RLS on all business tables (governance, assets, risk, compliance)
- API tenant routing: All endpoints filter by tenant
- Session management: Multi-tenant session handling
- Audit logging: Tenant-scoped audit trails

**Testing:**
- Comprehensive RLS testing: All 40+ business tables
- Cross-tenant isolation test: Verify no data leakage
- API isolation test: All endpoints return tenant-specific data
- Load test: 50 tenants × 50 users

### Phase 3: Tenant Provisioning & Self-Service (Weeks 9-12)
**Deliverables:**
- Tenant onboarding workflow (FR-8.1, FR-8.2)
- Trial tenant activation (FR-8.3)
- Tenant configuration UI (FR-1.4, FR-5)
- Bulk user import via CSV
- Documentation: Admin guide, customer onboarding guide

**Testing:**
- UAT: Tenant creation → configuration → first user login → data entry
- Edge cases: Email domain auto-assignment, duplicate emails across tenants
- Trial conversion: Trial → paid upgrade flow

### Phase 4: Scaling & Optimization (Weeks 13-16)
**Deliverables:**
- Performance tuning: Index optimization, query optimization
- Connection pooling: PgBouncer setup for 100+ concurrent tenants
- Load balancing: Multi-instance deployment
- Monitoring: Dashboards, alerting, runbooks
- Documentation: Ops guide, troubleshooting guide

**Testing:**
- Load test: 100 tenants × 100 concurrent users
- Stress test: Graceful degradation at 150% peak load
- Backup/restore: Test recovery from failures
- Chaos engineering: Random failure injection

---

## Success Criteria & KPIs

### Technical KPIs
- **RLS Enforcement**: 100% of queries respect tenant_id filtering (verified by automated tests)
- **Query Performance**: P99 latency <1s (with RLS overhead <50%)
- **Tenant Isolation**: Zero cross-tenant data access incidents
- **Onboarding Time**: New tenant created and deployable in <5 minutes
- **Availability**: 99.9% uptime across all tenants

### Operational KPIs
- **Infrastructure Cost**: $10 COGS per tenant (60% reduction vs. single-tenant)
- **Deployment Frequency**: 1x per week (unified codebase)
- **Mean Time to Recovery (MTTR)**: <1 hour for common issues
- **Audit Coverage**: 100% of operations logged with tenant context

### Business KPIs
- **Customer Acquisition**: 10+ new customers onboarded in first month
- **Expansion Revenue**: 30% of customers upgrade from trial to paid
- **Customer Satisfaction**: NPS >50 (Net Promoter Score)
- **Support Efficiency**: <2 hours average response time

---

## Risks & Mitigation

### Risk 1: RLS Misconfiguration
**Risk:** RLS policies accidentally exclude/include wrong data, causing data leakage or inaccessibility
**Mitigation:**
- Comprehensive test suite for RLS policies
- Automated validation: Quarterly schema audit to verify all business tables have RLS
- Code review: All RLS changes reviewed by security team
- Staged rollout: Test in staging, then production

### Risk 2: Query Performance Degradation
**Risk:** RLS filtering adds overhead, queries exceed SLA
**Mitigation:**
- Load testing: Pre-deployment load test with RLS enabled
- Index optimization: Composite indexes on (tenant_id, filter_columns)
- Query optimization: EXPLAIN plans reviewed for RLS overhead
- Monitoring: Alert if P99 latency >1.5s

### Risk 3: Migration Data Loss
**Risk:** Existing single-tenant data corrupted during migration
**Mitigation:**
- Full backup before migration
- Dry-run on staging with validation
- Rollback plan: Restore backup if validation fails
- Verification: Count + sample spot checks post-migration

### Risk 4: Billing/Subscription Integration
**Risk:** Tenant provisioning linked to billing system (future) — syncing fails
**Mitigation:**
- Design integration early (in this PRD scope)
- Idempotent operations: Creating tenant twice = same result
- Audit trail: All sync events logged
- Manual override: Admin can create tenant independent of billing system

### Risk 5: Regulatory Compliance
**Risk:** GDPR/PDPL requirements not met in multi-tenant design
**Mitigation:**
- DPIA (Data Protection Impact Assessment) completed
- Legal review: DPA (Data Processing Agreement) in place
- Compliance checklist: GDPR (erasure, portability), PDPL (localization)
- Annual audit: SOC 2 Type II validates controls

---

## Appendices

### A. Glossary
- **Tenant**: Customer organization (company)
- **RLS (Row-Level Security)**: PostgreSQL feature filtering rows based on current_setting('app.tenant_id')
- **Shared Schema**: All tenants use same database tables (vs. schema-per-tenant)
- **Tenant Isolation**: Guarantee that queries for Tenant A return only Tenant A's data
- **Multi-tenancy**: Platform serving multiple customers from shared infrastructure

### B. Related Documents
- [Database Schema Reference](link)
- [API Documentation](link)
- [Security Architecture](link)
- [Disaster Recovery Plan](link)
- [GDPR Compliance Guide](link)

### C. External References
- [PostgreSQL RLS Documentation](https://www.postgresql.org/docs/current/ddl-rowsecurity.html)
- [Multi-Tenant SaaS Architecture Patterns](https://aws.amazon.com/blogs/saas/)
- [GDPR Compliance for SaaS](https://gdpr-info.eu/)
- [SOC 2 Trust Services Criteria](https://www.aicpa.org/soc2)

---

**Document Approval:**

| Role | Name | Date | Signature |
|------|------|------|-----------|
| Product Owner | [Name] | | |
| Engineering Lead | [Name] | | |
| Security Officer | [Name] | | |
| Compliance Officer | [Name] | | |
| CTO | [Name] | | |