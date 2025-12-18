# Governance Module - Next Steps

**Last Updated:** December 3, 2025  
**Current Status:** ✅ Backend APIs Complete (25/25 tests passing)  
**Frontend Status:** ✅ 3/7 pages implemented

## 🎯 Priority 1: Complete Frontend Implementation

### 1.1 Create Missing Frontend Pages (High Priority)

**Status:** 3/7 pages done

**Missing Pages:**
- [ ] **Assessments Page** (`/dashboard/governance/assessments`)
  - List assessments with filters (status, type, date range)
  - Create/edit assessment form
  - View assessment results
  - Link controls to assessments
  - **Estimated:** 4-6 hours

- [ ] **Evidence Page** (`/dashboard/governance/evidence`)
  - List evidence items with filters
  - Upload evidence files
  - Link evidence to controls/assessments
  - View evidence details
  - **Estimated:** 6-8 hours (includes file upload)

- [ ] **Findings Page** (`/dashboard/governance/findings`)
  - List findings with severity/status filters
  - Create/edit finding form
  - Remediation tracking
  - Risk acceptance workflow
  - **Estimated:** 4-6 hours

**Reference Implementation:**
- Use existing pages as templates:
  - `frontend/src/app/[locale]/(dashboard)/dashboard/governance/influencers/page.tsx`
  - `frontend/src/app/[locale]/(dashboard)/dashboard/governance/policies/page.tsx`
  - `frontend/src/app/[locale]/(dashboard)/dashboard/governance/controls/page.tsx`

### 1.2 Enhance Existing Pages

- [ ] **Policies Page:** Add control objectives management inline
- [ ] **Controls Page:** Add framework mappings display
- [ ] **Influencers Page:** Add compliance obligations management

## 🧪 Priority 2: Testing & Validation

### 2.1 Test CRUD Operations

**Current:** Only GET endpoints tested

**Needed:**
- [ ] Test POST (Create) for all entities
- [ ] Test PATCH (Update) for all entities
- [ ] Test DELETE (Soft delete) for all entities
- [ ] Test validation errors
- [ ] Test authorization (role-based access)

**Test Script:** Create `scripts/test-governance-crud.sh`

### 2.2 Test Relationships

- [ ] Test policy → control objectives linkage
- [ ] Test assessment → controls linkage
- [ ] Test assessment → findings linkage
- [ ] Test evidence → controls linkage
- [ ] Test control → asset mappings

### 2.3 Integration Testing

- [ ] Test end-to-end workflows:
  - Create policy → Add control objectives → Link to controls
  - Create assessment → Add controls → Run assessment → Create findings
  - Upload evidence → Link to control → View in assessment

## 🔧 Priority 3: Fix Known Issues

### 3.1 Policy Status Enum Mismatch

**Issue:** Old `policies` table uses different enum than Governance `PolicyStatus`

**Options:**
1. **Migration approach:** Create migration to align enums
2. **Adapter approach:** Map between enums in service layer
3. **Separate tables:** Keep old policies separate, new ones in governance

**Recommended:** Option 1 (migration) - most clean long-term

**Estimated:** 2-3 hours

### 3.2 Seed Findings Data

**Status:** Findings table exists but empty

**Action:** Add findings to `seed-governance.ts`
- Create findings linked to assessments
- Link findings to controls
- Add remediation plans
- **Estimated:** 1 hour

## 🚀 Priority 4: Advanced Features

### 4.1 File Upload for Evidence

**Current:** Evidence entity supports file paths, but no upload endpoint

**Needed:**
- [ ] Create file upload endpoint (`POST /api/v1/governance/evidence/upload`)
- [ ] Integrate with file storage (MinIO/S3)
- [ ] Add file validation (type, size)
- [ ] Add virus scanning (optional)
- [ ] Frontend upload component
- **Estimated:** 6-8 hours

### 4.2 Shared Services Integration

**Status:** Partially integrated

**Needed:**
- [ ] **Audit Logging:** Log all CRUD operations
  - Use existing `AssetAuditService` pattern
  - Log: who, what, when, changes
  - **Estimated:** 2-3 hours

- [ ] **Notifications:** Send notifications for:
  - Policy approval requests
  - Assessment assignments
  - Finding remediation due dates
  - **Estimated:** 4-6 hours

- [ ] **File Storage:** Integrate with MinIO/S3
  - Evidence file storage
  - Policy attachments
  - **Estimated:** 2-3 hours

### 4.3 Shared UI Components

**Status:** Using shadcn/ui, but no Governance-specific components

**Needed:**
- [ ] **GovernanceForm:** Base form with common fields
- [ ] **StatusBadge:** Consistent status display
- [ ] **SeverityIndicator:** Visual severity display
- [ ] **RemediationTracker:** Progress tracking component
- [ ] **FrameworkSelector:** Multi-select framework component
- **Estimated:** 6-8 hours

## 📊 Priority 5: Reporting & Analytics

### 5.1 Governance Dashboard Widgets

- [ ] Policy compliance status
- [ ] Control implementation progress
- [ ] Assessment completion rates
- [ ] Findings by severity
- [ ] Remediation overdue items
- **Estimated:** 8-10 hours

### 5.2 Export & Reporting

- [ ] Export assessments to PDF
- [ ] Export findings report
- [ ] Compliance status report
- [ ] Control coverage report
- **Estimated:** 6-8 hours

## 🔗 Priority 6: Asset Integration

### 6.1 Control-Asset Linkages

**Status:** `control_asset_mappings` table exists

**Needed:**
- [ ] Frontend UI to link controls to assets
- [ ] Display linked assets on control detail page
- [ ] Display linked controls on asset detail page
- [ ] Bulk linking operations
- **Estimated:** 6-8 hours

### 6.2 Asset-Based Compliance

- [ ] Show compliance status per asset
- [ ] Identify assets missing controls
- [ ] Asset risk based on control gaps
- **Estimated:** 8-10 hours

## 📝 Priority 7: Documentation

### 7.1 API Documentation

- [ ] Complete OpenAPI/Swagger docs
- [ ] Add request/response examples
- [ ] Document error codes
- **Estimated:** 4-6 hours

### 7.2 User Documentation

- [ ] User guide for each module
- [ ] Workflow documentation
- [ ] Video tutorials (optional)
- **Estimated:** 8-12 hours

## 🎯 Recommended Immediate Next Steps

### Week 1: Complete Frontend
1. ✅ Create Assessments page
2. ✅ Create Evidence page (with file upload)
3. ✅ Create Findings page
4. ✅ Test all pages with real data

### Week 2: Testing & Fixes
1. ✅ Test all CRUD operations
2. ✅ Fix policy status enum
3. ✅ Seed findings data
4. ✅ Test relationships

### Week 3: Integration
1. ✅ Integrate audit logging
2. ✅ Integrate notifications
3. ✅ Complete file upload
4. ✅ Test end-to-end workflows

### Week 4: Polish
1. ✅ Create shared UI components
2. ✅ Add dashboard widgets
3. ✅ Export functionality
4. ✅ Documentation

## 📈 Success Metrics

**Current:**
- ✅ 25/25 API endpoints working
- ✅ 3/7 frontend pages complete
- ✅ All data seeded (except findings)

**Target:**
- 🎯 7/7 frontend pages complete
- 🎯 100% CRUD operations tested
- 🎯 All relationships working
- 🎯 File uploads functional
- 🎯 Audit logging integrated

## 🚦 Quick Start Commands

```bash
# Test all APIs
./scripts/test-all-governance-endpoints.sh

# Check data status
docker-compose exec backend sh -c "DB_HOST=postgres npm run check:governance"

# Seed findings (after implementation)
docker-compose exec backend sh -c "DB_HOST=postgres npm run seed:governance"

# Run frontend
cd frontend && npm run dev

# Run backend
cd backend && npm run start:dev
```

## 📚 Reference Files

- **Implementation Plan:** `docs/GOVERNANCE_IMPLEMENTATION_PLAN.md`
- **API Spec:** `docs/GOVERNANCE_API_SPECIFICATION.md`
- **Test Results:** `docs/GOVERNANCE_API_TEST_RESULTS.md`
- **Testing Guide:** `docs/GOVERNANCE_DOCKER_TESTING.md`
- **Requirements:** `docs/Requirments-US-PRD-DB Schema Governance Management Module Integrated with Assets managment.md`





