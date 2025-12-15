# Risk Management Module Integration Plan

## Executive Summary

This plan outlines the integration of the enhanced Risk Management Module with the existing Asset Management and Governance modules in the Stratagem platform. The implementation follows Phase 1 scope from the Risk Management Requirements document.

**Duration:** 4 months  
**Goal:** Operational risk register with basic assessment, treatment tracking, and reporting capabilities  
**Target:** Support 100-200 risks, 20-30 KRIs, and 50+ active users

---

## Current State Analysis

### Existing Risk Module (Basic)
- ✅ Basic risk entity (title, description, category, status, likelihood, impact)
- ✅ Basic CRUD operations
- ✅ Risk heatmap
- ✅ Workflow integration
- ❌ No asset linkage
- ❌ No control linkage
- ❌ No risk treatments
- ❌ No KRIs
- ❌ No risk assessments history

### Existing Asset Module (Complete)
- ✅ Physical Assets
- ✅ Information Assets
- ✅ Software Assets
- ✅ Business Applications
- ✅ Suppliers
- ✅ Asset Dependencies
- ✅ Audit Logging

### Existing Governance Module (Complete)
- ✅ Unified Controls
- ✅ Assessments & Results
- ✅ Evidence Management
- ✅ Findings with Remediation
- ✅ Control-Asset Mappings
- ✅ Influencers (Frameworks)
- ✅ Policies
- ✅ Gap Analysis

---

## Phase 1: Database Schema & Entity Enhancement

### 1.1 Risk Categories & Taxonomy
- [ ] **Task 1.1.1:** Create `risk_categories` table migration
  ```
  - id (UUID)
  - name (VARCHAR)
  - description (TEXT)
  - parent_category_id (UUID, nullable - for 2-level hierarchy)
  - risk_tolerance (ENUM: low/medium/high)
  - is_active (BOOLEAN)
  - display_order (INTEGER)
  - created_at, updated_at, deleted_at
  ```
- [ ] **Task 1.1.2:** Create `RiskCategory` entity with TypeORM decorators
- [ ] **Task 1.1.3:** Create seed data for 12 predefined risk categories
- [ ] **Task 1.1.4:** Create DTOs (CreateRiskCategoryDto, UpdateRiskCategoryDto)
- [ ] **Task 1.1.5:** Create RiskCategoryController and RiskCategoryService

### 1.2 Enhanced Risk Entity
- [ ] **Task 1.2.1:** Create migration to enhance `risks` table
  ```
  Additional fields:
  - risk_id (VARCHAR, auto-generated RISK-XXXX)
  - risk_statement (TEXT - If/Then/Resulting format)
  - category_id (UUID, FK to risk_categories)
  - sub_category_id (UUID, nullable)
  - risk_analyst_id (UUID, FK to users)
  - date_identified (DATE)
  - threat_source (ENUM: internal/external/natural)
  - risk_velocity (ENUM: slow/medium/fast/immediate)
  - early_warning_signs (TEXT)
  - status_notes (TEXT)
  - tags (VARCHAR[])
  - business_process (TEXT)
  - version_number (INTEGER)
  - next_review_date (DATE)
  - deleted_at (TIMESTAMP)
  ```
- [ ] **Task 1.2.2:** Update Risk entity to include new fields and relationships
- [ ] **Task 1.2.3:** Update CreateRiskDto and UpdateRiskDto
- [ ] **Task 1.2.4:** Update RiskResponseDto with new fields

### 1.3 Risk Assessments Table
- [ ] **Task 1.3.1:** Create `risk_assessments` table migration
  ```
  - id (UUID)
  - risk_id (UUID, FK to risks)
  - assessment_type (ENUM: inherent/current/target)
  - likelihood (INTEGER 1-5)
  - impact (INTEGER 1-5)
  - risk_score (INTEGER, calculated)
  - risk_level (ENUM: low/medium/high/critical)
  - financial_impact (ENUM: negligible/minor/moderate/major/catastrophic)
  - operational_impact (ENUM)
  - reputational_impact (ENUM)
  - compliance_impact (ENUM)
  - safety_impact (ENUM)
  - assessment_date (DATE)
  - assessor_id (UUID, FK to users)
  - assessment_method (VARCHAR)
  - assessment_notes (TEXT)
  - confidence_level (ENUM: high/medium/low)
  - evidence_attachments (JSONB)
  - created_at, updated_at
  ```
- [ ] **Task 1.3.2:** Create `RiskAssessment` entity
- [ ] **Task 1.3.3:** Create RiskAssessmentService with score calculation logic
- [ ] **Task 1.3.4:** Create RiskAssessmentController and DTOs

### 1.4 Risk-Asset Linkage Tables
- [ ] **Task 1.4.1:** Create `risk_asset_links` table migration
  ```
  - id (UUID)
  - risk_id (UUID, FK to risks)
  - asset_type (ENUM: physical/information/software/application/supplier)
  - asset_id (UUID)
  - impact_description (TEXT)
  - linked_by (UUID, FK to users)
  - linked_at (TIMESTAMP)
  ```
- [ ] **Task 1.4.2:** Create `RiskAssetLink` entity with polymorphic asset reference
- [ ] **Task 1.4.3:** Create RiskAssetLinkService with methods for each asset type
- [ ] **Task 1.4.4:** Create RiskAssetLinkController and DTOs

### 1.5 Risk-Control Linkage Tables
- [ ] **Task 1.5.1:** Create `risk_control_links` table migration
  ```
  - id (UUID)
  - risk_id (UUID, FK to risks)
  - control_id (UUID, FK to unified_controls)
  - effectiveness_rating (INTEGER 1-5 or %)
  - notes (TEXT)
  - linked_by (UUID, FK to users)
  - linked_at (TIMESTAMP)
  ```
- [ ] **Task 1.5.2:** Create `RiskControlLink` entity
- [ ] **Task 1.5.3:** Create RiskControlLinkService
- [ ] **Task 1.5.4:** Create RiskControlLinkController and DTOs

### 1.6 Risk Treatment Plans
- [ ] **Task 1.6.1:** Create `risk_treatments` table migration
  ```
  - id (UUID)
  - treatment_id (VARCHAR, auto-generated TRT-XXXX)
  - risk_id (UUID, FK to risks)
  - strategy (ENUM: mitigate/transfer/avoid/accept)
  - title (VARCHAR)
  - description (TEXT)
  - treatment_owner_id (UUID, FK to users)
  - status (ENUM: planned/in_progress/completed/deferred/cancelled)
  - priority (ENUM: critical/high/medium/low)
  - start_date (DATE)
  - target_completion_date (DATE)
  - actual_completion_date (DATE)
  - estimated_cost (DECIMAL)
  - actual_cost (DECIMAL)
  - expected_risk_reduction (TEXT)
  - residual_likelihood (INTEGER)
  - residual_impact (INTEGER)
  - progress_percentage (INTEGER)
  - progress_notes (TEXT)
  - created_by, created_at, updated_by, updated_at, deleted_at
  ```
- [ ] **Task 1.6.2:** Create `RiskTreatment` entity
- [ ] **Task 1.6.3:** Create `treatment_tasks` table for sub-tasks
- [ ] **Task 1.6.4:** Create `TreatmentTask` entity
- [ ] **Task 1.6.5:** Create RiskTreatmentService with progress tracking
- [ ] **Task 1.6.6:** Create RiskTreatmentController and DTOs

### 1.7 Key Risk Indicators (KRIs)
- [ ] **Task 1.7.1:** Create `kris` table migration
  ```
  - id (UUID)
  - kri_id (VARCHAR, auto-generated KRI-XXXX)
  - name (VARCHAR)
  - description (TEXT)
  - category_id (UUID, FK to risk_categories)
  - measurement_unit (VARCHAR)
  - measurement_frequency (ENUM: daily/weekly/monthly/quarterly)
  - data_source (VARCHAR)
  - calculation_method (TEXT)
  - threshold_green (DECIMAL)
  - threshold_amber (DECIMAL)
  - threshold_red (DECIMAL)
  - current_value (DECIMAL)
  - current_status (ENUM: green/amber/red)
  - trend (ENUM: improving/stable/worsening)
  - kri_owner_id (UUID, FK to users)
  - is_active (BOOLEAN)
  - last_measured_at (TIMESTAMP)
  - created_by, created_at, updated_by, updated_at
  ```
- [ ] **Task 1.7.2:** Create `KRI` entity
- [ ] **Task 1.7.3:** Create `kri_measurements` table for historical values
- [ ] **Task 1.7.4:** Create `KRIMeasurement` entity
- [ ] **Task 1.7.5:** Create `kri_risk_links` junction table
- [ ] **Task 1.7.6:** Create KRIService with measurement tracking
- [ ] **Task 1.7.7:** Create KRIController and DTOs

### 1.8 Risk Appetite Framework
- [ ] **Task 1.8.1:** Create `risk_appetite_statements` table migration
  ```
  - id (UUID)
  - version (INTEGER)
  - effective_date (DATE)
  - expiry_date (DATE)
  - statement_text (TEXT)
  - status (ENUM: draft/pending_approval/approved/superseded)
  - approved_by (UUID, FK to users)
  - approved_at (TIMESTAMP)
  - created_by, created_at, updated_by, updated_at
  ```
- [ ] **Task 1.8.2:** Create `RiskAppetiteStatement` entity
- [ ] **Task 1.8.3:** Create RiskAppetiteService
- [ ] **Task 1.8.4:** Create RiskAppetiteController and DTOs

### 1.9 Assessment Requests
- [ ] **Task 1.9.1:** Create `risk_assessment_requests` table migration
  ```
  - id (UUID)
  - request_id (VARCHAR, auto-generated RAR-XXXX)
  - title (VARCHAR)
  - description (TEXT)
  - requested_by_id (UUID, FK to users)
  - business_justification (TEXT)
  - trigger_type (ENUM: new_product/new_technology/regulatory_change/incident/audit_finding/etc)
  - scope_description (TEXT)
  - affected_business_units (UUID[])
  - priority (ENUM: high/medium/low)
  - requested_due_date (DATE)
  - status (ENUM: submitted/under_review/approved/in_progress/completed/rejected)
  - assigned_to_id (UUID, FK to users)
  - reviewed_by_id (UUID, FK to users)
  - reviewed_at (TIMESTAMP)
  - completed_at (TIMESTAMP)
  - attachments (JSONB)
  - created_at, updated_at
  ```
- [ ] **Task 1.9.2:** Create `RiskAssessmentRequest` entity
- [ ] **Task 1.9.3:** Create assessment request workflow integration
- [ ] **Task 1.9.4:** Create AssessmentRequestService
- [ ] **Task 1.9.5:** Create AssessmentRequestController and DTOs

---

## Phase 2: Backend Services & Integration

### 2.1 Update Risk Module Structure
- [ ] **Task 2.1.1:** Reorganize risk module folder structure:
  ```
  src/risk/
  ├── controllers/
  │   ├── risk.controller.ts
  │   ├── risk-assessment.controller.ts
  │   ├── risk-treatment.controller.ts
  │   ├── risk-category.controller.ts
  │   ├── kri.controller.ts
  │   ├── assessment-request.controller.ts
  │   └── risk-appetite.controller.ts
  ├── dto/
  │   ├── risk/
  │   ├── assessment/
  │   ├── treatment/
  │   ├── category/
  │   ├── kri/
  │   └── appetite/
  ├── entities/
  │   ├── risk.entity.ts
  │   ├── risk-assessment.entity.ts
  │   ├── risk-treatment.entity.ts
  │   ├── treatment-task.entity.ts
  │   ├── risk-category.entity.ts
  │   ├── kri.entity.ts
  │   ├── kri-measurement.entity.ts
  │   ├── risk-asset-link.entity.ts
  │   ├── risk-control-link.entity.ts
  │   ├── risk-appetite-statement.entity.ts
  │   └── risk-assessment-request.entity.ts
  ├── services/
  │   ├── risk.service.ts
  │   ├── risk-assessment.service.ts
  │   ├── risk-treatment.service.ts
  │   ├── risk-category.service.ts
  │   ├── kri.service.ts
  │   ├── risk-asset-link.service.ts
  │   ├── risk-control-link.service.ts
  │   ├── assessment-request.service.ts
  │   └── risk-appetite.service.ts
  └── risk.module.ts
  ```
- [ ] **Task 2.1.2:** Update risk.module.ts to import all new entities and providers

### 2.2 Asset Integration Service
- [ ] **Task 2.2.1:** Create `RiskAssetIntegrationService` in risk module
  - Method: `linkAssetToRisk(riskId, assetType, assetId)`
  - Method: `unlinkAssetFromRisk(linkId)`
  - Method: `getLinkedAssets(riskId)`
  - Method: `getRisksForAsset(assetType, assetId)`
  - Method: `getAssetRiskScore(assetType, assetId)`
- [ ] **Task 2.2.2:** Add risk endpoints to each asset controller:
  - GET `/api/assets/physical/{id}/risks`
  - GET `/api/assets/information/{id}/risks`
  - GET `/api/assets/software/{id}/risks`
  - GET `/api/assets/applications/{id}/risks`
  - GET `/api/assets/suppliers/{id}/risks`
- [ ] **Task 2.2.3:** Create aggregate risk score calculation for assets
- [ ] **Task 2.2.4:** Add risk count to asset list responses

### 2.3 Governance Integration Service
- [ ] **Task 2.3.1:** Create `RiskControlIntegrationService`
  - Method: `linkControlToRisk(riskId, controlId, effectivenessRating)`
  - Method: `unlinkControlFromRisk(linkId)`
  - Method: `getLinkedControls(riskId)`
  - Method: `getRisksForControl(controlId)`
  - Method: `calculateControlEffectiveness(riskId)`
- [ ] **Task 2.3.2:** Add risk endpoints to UnifiedControlsController:
  - GET `/api/governance/controls/{id}/risks`
  - POST `/api/governance/controls/{id}/risks` (link risk)
  - DELETE `/api/governance/controls/{id}/risks/{riskId}` (unlink)
- [ ] **Task 2.3.3:** Create control gap analysis for risks (risks without controls)
- [ ] **Task 2.3.4:** Update Finding entity to link to risks
- [ ] **Task 2.3.5:** Create risk-finding relationship service

### 2.4 Risk Dashboard Service
- [ ] **Task 2.4.1:** Create `RiskDashboardService`
  - Method: `getRiskSummary()` - counts by status, level
  - Method: `getTopRisks(limit)` - highest risk scores
  - Method: `getRisksByCategory()` - distribution
  - Method: `getTreatmentProgress()` - treatment status summary
  - Method: `getKRIStatus()` - KRI red/amber/green counts
  - Method: `getOverdueReviews()` - risks needing review
  - Method: `getRisksExceedingAppetite()` - appetite violations
- [ ] **Task 2.4.2:** Create `RiskDashboardController`
- [ ] **Task 2.4.3:** Create materialized view for dashboard performance

### 2.5 Risk Reporting Service
- [ ] **Task 2.5.1:** Create `RiskReportingService`
  - Method: `generateRiskRegister(filters)` - export risk register
  - Method: `generateHeatmapReport()`
  - Method: `generateTreatmentReport()`
  - Method: `generateKRIReport()`
  - Method: `generateRiskTrendReport(dateRange)`
- [ ] **Task 2.5.2:** Create PDF/Excel export for risk reports
- [ ] **Task 2.5.3:** Create `RiskReportingController`

### 2.6 Workflow Integration
- [ ] **Task 2.6.1:** Add risk workflow triggers:
  - ON_RISK_CREATED
  - ON_RISK_ASSESSED
  - ON_RISK_LEVEL_CHANGED
  - ON_TREATMENT_ASSIGNED
  - ON_TREATMENT_COMPLETED
  - ON_KRI_THRESHOLD_BREACH
  - ON_REVIEW_DUE
- [ ] **Task 2.6.2:** Create risk approval workflows
- [ ] **Task 2.6.3:** Integrate with existing notification system

---

## Phase 3: Frontend Implementation

### 3.1 Risk Module Pages
- [ ] **Task 3.1.1:** Update risk list page (`/dashboard/risks/page.tsx`)
  - Enhanced filtering (category, level, status, owner)
  - Column for linked assets count
  - Column for linked controls count
  - Column for treatment status
  - Bulk actions
- [ ] **Task 3.1.2:** Update risk detail page (`/dashboard/risks/[id]/page.tsx`)
  - Risk details section
  - Assessments history tab
  - Linked assets tab
  - Linked controls tab
  - Treatments tab
  - KRIs tab
  - Activity/audit log tab
- [ ] **Task 3.1.3:** Create risk form component with full fields
- [ ] **Task 3.1.4:** Create risk assessment form component

### 3.2 Risk-Asset Integration UI
- [ ] **Task 3.2.1:** Create `AssetRiskSelector` component
  - Multi-select assets by type
  - Search/filter functionality
  - Display asset criticality
- [ ] **Task 3.2.2:** Create `RiskLinkedAssets` component
  - Display linked assets grouped by type
  - Quick add/remove actions
  - Navigate to asset detail
- [ ] **Task 3.2.3:** Add "Risks" tab to all asset detail pages
  - Show linked risks with risk level badges
  - Aggregate risk score display
  - Add/remove risk links

### 3.3 Risk-Governance Integration UI
- [ ] **Task 3.3.1:** Create `ControlRiskSelector` component
  - Search controls
  - Show control implementation status
  - Effectiveness rating input
- [ ] **Task 3.3.2:** Create `RiskLinkedControls` component
  - Display linked controls
  - Show effectiveness ratings
  - Gap indicator for uncontrolled risks
- [ ] **Task 3.3.3:** Add "Risks" tab to control detail page
  - Show linked risks
  - Risk mitigation effectiveness
- [ ] **Task 3.3.4:** Update findings to show related risks

### 3.4 Risk Treatment UI
- [ ] **Task 3.4.1:** Create `TreatmentForm` component
  - Strategy selection
  - Owner assignment
  - Timeline inputs
  - Cost tracking
- [ ] **Task 3.4.2:** Create `TreatmentProgressTracker` component
  - Progress bar
  - Task checklist
  - Status updates
- [ ] **Task 3.4.3:** Create `TreatmentGanttChart` component (optional)
- [ ] **Task 3.4.4:** Create treatments list page (`/dashboard/risks/treatments`)

### 3.5 KRI UI
- [ ] **Task 3.5.1:** Create `KRIForm` component
  - Threshold configuration
  - Measurement setup
- [ ] **Task 3.5.2:** Create `KRIDashboardWidget` component
  - Traffic light indicators
  - Trend arrows
- [ ] **Task 3.5.3:** Create `KRITrendChart` component
- [ ] **Task 3.5.4:** Create KRI list/management page (`/dashboard/risks/kris`)

### 3.6 Risk Dashboard
- [ ] **Task 3.6.1:** Create `RiskSummaryWidget` component
  - Total risks by level
  - Trend indicators
- [ ] **Task 3.6.2:** Update `RiskHeatmap` component
  - Interactive cells
  - Click to filter
  - Category overlay option
- [ ] **Task 3.6.3:** Create `RiskTrendChart` component
  - Risk level over time
  - Treatment completion trends
- [ ] **Task 3.6.4:** Create `TopRisksWidget` component
- [ ] **Task 3.6.5:** Create `TreatmentProgressWidget` component
- [ ] **Task 3.6.6:** Create `RiskAppetiteWidget` component
  - Current vs. appetite visualization
- [ ] **Task 3.6.7:** Create dedicated risk dashboard page (`/dashboard/risks/overview`)

### 3.7 Risk Categories & Configuration
- [ ] **Task 3.7.1:** Create risk categories management page
- [ ] **Task 3.7.2:** Create risk appetite configuration page
- [ ] **Task 3.7.3:** Create risk matrix configuration page

### 3.8 Assessment Requests
- [ ] **Task 3.8.1:** Create assessment request form
- [ ] **Task 3.8.2:** Create assessment request list/tracking page
- [ ] **Task 3.8.3:** Create assessment request workflow UI

---

## Phase 4: API Integration & Testing

### 4.1 Frontend API Services
- [ ] **Task 4.1.1:** Update `risks.ts` API client with new endpoints
- [ ] **Task 4.1.2:** Create `risk-assessments.ts` API client
- [ ] **Task 4.1.3:** Create `risk-treatments.ts` API client
- [ ] **Task 4.1.4:** Create `kris.ts` API client
- [ ] **Task 4.1.5:** Create `risk-categories.ts` API client
- [ ] **Task 4.1.6:** Create `risk-links.ts` API client (asset/control links)
- [ ] **Task 4.1.7:** Create `risk-dashboard.ts` API client
- [ ] **Task 4.1.8:** Create `assessment-requests.ts` API client

### 4.2 Backend Testing
- [ ] **Task 4.2.1:** Create unit tests for RiskService
- [ ] **Task 4.2.2:** Create unit tests for RiskAssessmentService
- [ ] **Task 4.2.3:** Create unit tests for RiskTreatmentService
- [ ] **Task 4.2.4:** Create unit tests for KRIService
- [ ] **Task 4.2.5:** Create unit tests for integration services
- [ ] **Task 4.2.6:** Create E2E tests for risk API endpoints
- [ ] **Task 4.2.7:** Create E2E tests for asset-risk integration
- [ ] **Task 4.2.8:** Create E2E tests for governance-risk integration

### 4.3 Frontend Testing
- [ ] **Task 4.3.1:** Create component tests for risk forms
- [ ] **Task 4.3.2:** Create component tests for risk dashboard widgets
- [ ] **Task 4.3.3:** Create Playwright E2E tests for risk workflows
- [ ] **Task 4.3.4:** Create integration tests for asset-risk linking

---

## Phase 5: Data Migration & Seeding

### 5.1 Migration Scripts
- [ ] **Task 5.1.1:** Create migration script for existing risks to new schema
- [ ] **Task 5.1.2:** Create seed script for risk categories
- [ ] **Task 5.1.3:** Create seed script for sample risks (development)
- [ ] **Task 5.1.4:** Create seed script for sample KRIs (development)
- [ ] **Task 5.1.5:** Create data import script from CSV/Excel

---

## Implementation Order & Dependencies

### Sprint 1 (Weeks 1-2): Foundation
1. Task 1.1.x - Risk Categories
2. Task 1.2.x - Enhanced Risk Entity
3. Task 1.3.x - Risk Assessments
4. Task 2.1.x - Module Restructure

### Sprint 2 (Weeks 3-4): Asset Integration
1. Task 1.4.x - Risk-Asset Linkage
2. Task 2.2.x - Asset Integration Service
3. Task 3.2.x - Asset Integration UI

### Sprint 3 (Weeks 5-6): Governance Integration
1. Task 1.5.x - Risk-Control Linkage
2. Task 2.3.x - Governance Integration Service
3. Task 3.3.x - Governance Integration UI

### Sprint 4 (Weeks 7-8): Treatments & KRIs
1. Task 1.6.x - Risk Treatments
2. Task 1.7.x - KRIs
3. Task 3.4.x - Treatment UI
4. Task 3.5.x - KRI UI

### Sprint 5 (Weeks 9-10): Dashboard & Reporting
1. Task 2.4.x - Dashboard Service
2. Task 2.5.x - Reporting Service
3. Task 3.6.x - Dashboard UI

### Sprint 6 (Weeks 11-12): Configuration & Workflows
1. Task 1.8.x - Risk Appetite
2. Task 1.9.x - Assessment Requests
3. Task 2.6.x - Workflow Integration
4. Task 3.7.x - Configuration UI
5. Task 3.8.x - Assessment Request UI

### Sprint 7 (Weeks 13-14): API & Testing
1. Task 4.1.x - API Clients
2. Task 4.2.x - Backend Testing
3. Task 4.3.x - Frontend Testing

### Sprint 8 (Weeks 15-16): Migration & Polish
1. Task 5.1.x - Data Migration
2. Bug fixes and polish
3. Documentation
4. Performance optimization

---

## API Endpoints Summary

### Risk Management
```
GET    /api/risks                           # List risks
POST   /api/risks                           # Create risk
GET    /api/risks/:id                       # Get risk details
PUT    /api/risks/:id                       # Update risk
DELETE /api/risks/:id                       # Delete risk
GET    /api/risks/:id/assessments           # Get assessment history
POST   /api/risks/:id/assess                # Create assessment
GET    /api/risks/:id/treatments            # Get treatments
POST   /api/risks/:id/treatments            # Create treatment
GET    /api/risks/:id/assets                # Get linked assets
POST   /api/risks/:id/assets                # Link asset
DELETE /api/risks/:id/assets/:linkId        # Unlink asset
GET    /api/risks/:id/controls              # Get linked controls
POST   /api/risks/:id/controls              # Link control
DELETE /api/risks/:id/controls/:linkId      # Unlink control
GET    /api/risks/:id/kris                  # Get KRIs for risk
GET    /api/risks/heatmap                   # Heatmap data
GET    /api/risks/export                    # Export risk register
```

### Risk Treatments
```
GET    /api/treatments                      # List treatments
GET    /api/treatments/:id                  # Get treatment details
POST   /api/treatments                      # Create treatment
PUT    /api/treatments/:id                  # Update treatment
PUT    /api/treatments/:id/progress         # Update progress
DELETE /api/treatments/:id                  # Delete treatment
```

### KRIs
```
GET    /api/kris                            # List KRIs
POST   /api/kris                            # Create KRI
GET    /api/kris/:id                        # Get KRI details
PUT    /api/kris/:id                        # Update KRI
DELETE /api/kris/:id                        # Delete KRI
POST   /api/kris/:id/measure                # Record measurement
GET    /api/kris/:id/measurements           # Get measurement history
```

### Risk Categories
```
GET    /api/risk-categories                 # List categories
POST   /api/risk-categories                 # Create category
PUT    /api/risk-categories/:id             # Update category
DELETE /api/risk-categories/:id             # Delete category
```

### Risk Dashboard
```
GET    /api/risk-dashboard/summary          # Dashboard summary
GET    /api/risk-dashboard/top-risks        # Top risks by score
GET    /api/risk-dashboard/by-category      # Risks by category
GET    /api/risk-dashboard/treatments       # Treatment progress
GET    /api/risk-dashboard/kri-status       # KRI status overview
GET    /api/risk-dashboard/appetite         # Risk vs appetite
```

### Assessment Requests
```
GET    /api/assessment-requests             # List requests
POST   /api/assessment-requests             # Create request
PUT    /api/assessment-requests/:id         # Update request
PUT    /api/assessment-requests/:id/assign  # Assign request
PUT    /api/assessment-requests/:id/complete # Complete request
```

---

## Success Criteria

### Functional
- [ ] Users can create, view, update, and delete risks with full Phase 1 fields
- [ ] Users can link risks to multiple asset types
- [ ] Users can link risks to controls and see effectiveness
- [ ] Users can create and track treatment plans
- [ ] Users can define and monitor KRIs
- [ ] Dashboard shows comprehensive risk overview
- [ ] Reports can be exported in PDF/Excel format
- [ ] Workflows trigger on risk events
- [ ] Assessment requests can be submitted and tracked

### Performance
- [ ] Risk list loads in < 2 seconds for 200 risks
- [ ] Dashboard loads in < 3 seconds
- [ ] Heatmap renders in < 1 second
- [ ] API response times < 500ms for standard operations

### Quality
- [ ] 80%+ test coverage for new code
- [ ] All E2E tests pass
- [ ] No critical or high severity bugs
- [ ] UI is responsive and accessible

---

## Notes & Considerations

1. **Database Performance:** Consider adding database indexes for frequently queried fields (risk_level, status, category_id, owner_id)

2. **Soft Deletes:** Use soft deletes (deleted_at) for all entities to maintain audit trail

3. **Version Control:** Track version numbers for risks to support historical tracking

4. **Caching:** Consider Redis caching for dashboard data with 5-minute TTL

5. **Bulk Operations:** Implement bulk operations for risk management efficiency

6. **Export Limits:** Implement pagination and streaming for large exports

7. **Permissions:** Integrate with existing auth system for role-based access

---

*Last Updated: 2024-12-07*
*Version: 1.0*




