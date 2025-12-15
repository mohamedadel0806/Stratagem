# Risk Management Module - Next Steps

**Last Updated:** December 2024  
**Current Progress:** 59% Complete (65/110 tasks)

---

## 📊 Current Status Overview

### ✅ Completed (65 tasks)
- **Phase 1: Database Schema** - 100% Complete (37/37)
  - All entities, migrations, and database triggers
  - Risk categories seeded (12 categories)
  - Auto-generation of IDs (RISK, TRT, KRI)
  - Score calculations and status updates

- **Phase 2: Backend Services** - 47% Complete (8/17)
  - All core services implemented
  - All controllers with RESTful endpoints
  - Basic integration services (asset/control links)
  - ⚠️ Missing: Asset/control endpoints in respective controllers
  - ⚠️ Missing: Risk Reporting Service (PDF/Excel export)
  - ⚠️ Missing: Workflow integration

- **Phase 3: Frontend** - 38% Complete (12/32)
  - Risk list page with filtering
  - Risk detail page with tabs
  - Risk form with enhanced fields
  - Risk heatmap component
  - Asset-linked risks component (used in asset detail pages)
  - ⚠️ Missing: Standalone TreatmentForm
  - ⚠️ Missing: Standalone KRIForm
  - ⚠️ Missing: Dedicated Risk Dashboard page
  - ⚠️ Missing: Risk Trend Chart
  - ⚠️ Missing: Configuration pages

---

## 🎯 Priority 1: Integration Completeness (High Priority)

### 1.1 Add Risk Endpoints to Asset Controllers ✅ PARTIALLY DONE
**Status:** Asset detail pages already show risks tab using `AssetLinkedRisks` component

**Missing:**
- [ ] Add risk endpoints to each asset controller (backend):
  - `GET /api/assets/physical/{id}/risks`
  - `GET /api/assets/information/{id}/risks`
  - `GET /api/assets/software/{id}/risks`
  - `GET /api/assets/applications/{id}/risks`
  - `GET /api/assets/suppliers/{id}/risks`
- [ ] Add aggregate risk score to asset list responses
- [ ] Add risk count badge to asset cards

**Files to Modify:**
- `backend/src/asset/controllers/physical-asset.controller.ts`
- `backend/src/asset/controllers/information-asset.controller.ts`
- `backend/src/asset/controllers/software-asset.controller.ts`
- `backend/src/asset/controllers/business-application.controller.ts`
- `backend/src/asset/controllers/supplier.controller.ts`

### 1.2 Add Risk Endpoints to Control Controllers
**Status:** Not implemented

**Tasks:**
- [ ] Add "Risks" tab to control detail page
- [ ] Add risk endpoints to UnifiedControlsController:
  - `GET /api/governance/controls/{id}/risks`
  - `POST /api/governance/controls/{id}/risks` (link risk)
  - `DELETE /api/governance/controls/{id}/risks/{riskId}` (unlink)
- [ ] Create `ControlLinkedRisks` component (similar to `AssetLinkedRisks`)
- [ ] Show control effectiveness for each linked risk

**Files to Create/Modify:**
- `backend/src/governance/unified-controls/controllers/unified-control.controller.ts`
- `frontend/src/components/risks/control-linked-risks.tsx`
- `frontend/src/app/[locale]/(dashboard)/dashboard/governance/controls/[id]/page.tsx`

---

## 🎯 Priority 2: Enhanced Frontend Components (Medium Priority)

### 2.1 Standalone Treatment Form
**Status:** Treatment display exists in risk detail page, but no standalone form

**Tasks:**
- [ ] Create `TreatmentForm` component
  - Strategy selection (mitigate/transfer/avoid/accept)
  - Owner assignment with user picker
  - Timeline inputs (start date, target completion)
  - Cost tracking (estimated/actual)
  - Expected risk reduction
  - Residual risk assessment
- [ ] Create treatments list page (`/dashboard/risks/treatments`)
- [ ] Add "Create Treatment" button to risk detail page

**Files to Create:**
- `frontend/src/components/forms/treatment-form.tsx`
- `frontend/src/app/[locale]/(dashboard)/dashboard/risks/treatments/page.tsx`

### 2.2 Standalone KRI Form
**Status:** KRI display exists in risk detail page, but no standalone form

**Tasks:**
- [ ] Create `KRIForm` component
  - Threshold configuration (green/amber/red)
  - Measurement unit and frequency
  - Data source specification
  - Calculation method
  - Risk linkage
- [ ] Create KRI list/management page (`/dashboard/risks/kris`)
- [ ] Add "Create KRI" button to risk detail page
- [ ] Create `KRITrendChart` component for historical visualization

**Files to Create:**
- `frontend/src/components/forms/kri-form.tsx`
- `frontend/src/app/[locale]/(dashboard)/dashboard/risks/kris/page.tsx`
- `frontend/src/components/risks/kri-trend-chart.tsx`

### 2.3 Dedicated Risk Dashboard Page
**Status:** Dashboard widgets exist, but no dedicated page

**Tasks:**
- [ ] Create `/dashboard/risks/overview` page
- [ ] Include all dashboard widgets:
  - Risk summary cards (total by level)
  - Interactive risk heatmap
  - Top risks widget (highest scores)
  - Treatment progress widget
  - KRI status overview
  - Risk trend chart (over time)
  - Overdue reviews list
- [ ] Add filtering by category, status, owner

**Files to Create:**
- `frontend/src/app/[locale]/(dashboard)/dashboard/risks/overview/page.tsx`
- `frontend/src/components/risks/risk-trend-chart.tsx`
- `frontend/src/components/risks/top-risks-widget.tsx`
- `frontend/src/components/risks/treatment-progress-widget.tsx`

### 2.4 Risk Trend Chart Component
**Status:** Not implemented

**Tasks:**
- [ ] Create `RiskTrendChart` component
  - Show risk level changes over time
  - Filter by category, status
  - Treatment completion trends
  - Use Chart.js or Recharts

**Files to Create:**
- `frontend/src/components/risks/risk-trend-chart.tsx`

---

## 🎯 Priority 3: Configuration & Administration (Medium Priority)

### 3.1 Risk Categories Management Page
**Status:** Categories seeded, but no UI to manage them

**Tasks:**
- [ ] Create `/dashboard/risks/categories` page
- [ ] Allow adding/editing/deleting categories
- [ ] Support parent-child relationships (hierarchy)
- [ ] Configure risk tolerance per category
- [ ] Set display order

**Files to Create:**
- `frontend/src/app/[locale]/(dashboard)/dashboard/risks/categories/page.tsx`
- `frontend/src/components/risks/category-form.tsx`

### 3.2 Risk Appetite Configuration
**Status:** Framework deferred, but basic implementation needed

**Tasks:**
- [ ] Create risk appetite statements table (if not exists)
- [ ] Create `/dashboard/risks/appetite` page
- [ ] Configure risk tolerance by category/level
- [ ] Visualize current risks vs. appetite
- [ ] Alert on appetite violations

**Files to Create:**
- `backend/src/risk/entities/risk-appetite-statement.entity.ts`
- `backend/src/migrations/XXXX-CreateRiskAppetiteStatements.ts`
- `frontend/src/app/[locale]/(dashboard)/dashboard/risks/appetite/page.tsx`

### 3.3 Risk Matrix Configuration
**Status:** Hard-coded 5×5 matrix

**Tasks:**
- [ ] Create risk matrix configuration page
- [ ] Allow customizing likelihood/impact scales
- [ ] Configure risk level thresholds
- [ ] Support multiple matrix templates

**Files to Create:**
- `frontend/src/app/[locale]/(dashboard)/dashboard/risks/matrix-config/page.tsx`

---

## 🎯 Priority 4: Reporting & Export (Lower Priority)

### 4.1 Risk Reporting Service
**Status:** CSV export exists, but no comprehensive reporting

**Tasks:**
- [ ] Create `RiskReportingService` in backend
- [ ] Generate PDF risk register
- [ ] Generate Excel reports with multiple sheets:
  - Risk Register
  - Assessment History
  - Treatment Plans
  - KRI Status
- [ ] Create `RiskReportingController`
- [ ] Add report templates
- [ ] Support scheduled reports

**Files to Create:**
- `backend/src/risk/services/risk-reporting.service.ts`
- `backend/src/risk/controllers/risk-reporting.controller.ts`
- `backend/src/risk/templates/` (PDF/Excel templates)

### 4.2 Enhanced Export Functionality
**Status:** Basic CSV export exists

**Tasks:**
- [ ] Add PDF export to risk list page
- [ ] Add Excel export with formatting
- [ ] Include charts/graphs in PDF exports
- [ ] Support filtering before export

**Files to Modify:**
- `frontend/src/components/export/export-button.tsx`
- `frontend/src/lib/utils/pdf-export.ts`

---

## 🎯 Priority 5: Workflow Integration (Lower Priority)

### 5.1 Risk Approval Workflows
**Status:** Workflow module exists, but not integrated with risks

**Tasks:**
- [ ] Add risk workflow triggers:
  - `ON_RISK_CREATED`
  - `ON_RISK_ASSESSED`
  - `ON_RISK_LEVEL_CHANGED`
  - `ON_TREATMENT_ASSIGNED`
  - `ON_TREATMENT_COMPLETED`
  - `ON_KRI_THRESHOLD_BREACH`
  - `ON_REVIEW_DUE`
- [ ] Create risk approval workflow templates
- [ ] Integrate with notification system
- [ ] Add workflow UI to risk detail page

**Files to Modify:**
- `backend/src/risk/services/risk.service.ts`
- `backend/src/workflow/workflow-triggers.ts`
- `frontend/src/components/risks/risk-workflow-panel.tsx`

---

## 🎯 Priority 6: Assessment Requests (Future)

### 6.1 Assessment Request Workflow
**Status:** Deferred to Phase 2

**Tasks:**
- [ ] Create `risk_assessment_requests` table
- [ ] Create `RiskAssessmentRequest` entity
- [ ] Create assessment request service
- [ ] Create assessment request form
- [ ] Create assessment request list/tracking page
- [ ] Integrate with workflow for approval

**Files to Create:**
- `backend/src/risk/entities/risk-assessment-request.entity.ts`
- `backend/src/risk/services/assessment-request.service.ts`
- `backend/src/risk/controllers/assessment-request.controller.ts`
- `frontend/src/components/forms/assessment-request-form.tsx`
- `frontend/src/app/[locale]/(dashboard)/dashboard/risks/assessment-requests/page.tsx`

---

## 🧪 Testing Priorities

### Immediate Testing Needs:
- [ ] E2E tests for risk-asset linking
- [ ] E2E tests for risk-control linking
- [ ] Component tests for TreatmentForm
- [ ] Component tests for KRIForm
- [ ] Integration tests for risk dashboard

**Files to Create:**
- `backend/test/risk/risk-asset-linkage.e2e.spec.ts`
- `backend/test/risk/risk-control-linkage.e2e.spec.ts`
- `frontend/src/components/forms/__tests__/treatment-form.test.tsx`
- `frontend/src/components/forms/__tests__/kri-form.test.tsx`

---

## 📋 Recommended Implementation Order

### Sprint 1 (Week 1-2): Integration Completion
1. Add risk endpoints to asset controllers (Priority 1.1)
2. Add risk endpoints to control controllers (Priority 1.2)
3. Create ControlLinkedRisks component
4. Add "Risks" tab to control detail page

### Sprint 2 (Week 3-4): Standalone Forms
1. Create standalone TreatmentForm (Priority 2.1)
2. Create treatments list page
3. Create standalone KRIForm (Priority 2.2)
4. Create KRI list page
5. Create KRITrendChart component

### Sprint 3 (Week 5-6): Dashboard & Analytics
1. Create dedicated Risk Dashboard page (Priority 2.3)
2. Create RiskTrendChart component (Priority 2.4)
3. Create TopRisksWidget
4. Create TreatmentProgressWidget

### Sprint 4 (Week 7-8): Configuration
1. Create risk categories management page (Priority 3.1)
2. Create risk appetite configuration (Priority 3.2)
3. Create risk matrix configuration (Priority 3.3)

### Sprint 5 (Week 9-10): Reporting
1. Create Risk Reporting Service (Priority 4.1)
2. Add PDF/Excel export (Priority 4.2)

### Sprint 6 (Week 11-12): Workflows & Polish
1. Integrate risk workflows (Priority 5.1)
2. Testing and bug fixes
3. Performance optimization

---

## 🎯 Success Criteria

### Functional Requirements:
- [ ] Users can view risks from asset detail pages
- [ ] Users can view risks from control detail pages
- [ ] Users can create/manage treatments independently
- [ ] Users can create/manage KRIs independently
- [ ] Users have a dedicated risk dashboard with comprehensive analytics
- [ ] Users can configure risk categories and appetite
- [ ] Users can export comprehensive risk reports

### Performance Requirements:
- [ ] Risk list loads in < 2 seconds for 200 risks
- [ ] Dashboard loads in < 3 seconds
- [ ] Risk-asset/control links load in < 1 second

### Quality Requirements:
- [ ] 80%+ test coverage for new code
- [ ] All E2E tests pass
- [ ] No critical or high severity bugs
- [ ] UI is responsive and accessible

---

## 📝 Notes

1. **Asset Integration:** The asset detail pages already have the "Risks" tab using `AssetLinkedRisks` component. The backend endpoints are available through the risk-links controller, but we should add convenience endpoints in asset controllers for consistency.

2. **Component Reusability:** The `AssetLinkedRisks` component can be used as a template for `ControlLinkedRisks`.

3. **Dashboard Performance:** Consider adding materialized views for dashboard data to improve performance.

4. **Data Migration:** Sample data seeding scripts should be created for development/testing.

---

**Next Action Items:**
1. Review and prioritize this list with the team
2. Start with Sprint 1 (Integration Completion)
3. Test backend endpoints with Postman/Insomnia
4. Create sample risk data for testing




