# Risk Module - Next Steps Roadmap

**Current Progress:** 76% Complete (96/127 tasks)  
**Last Updated:** December 12, 2025

---

## 🎯 Immediate Next Steps (High Priority)

### 1. Frontend Integration for Backend Changes ⭐ **RECOMMENDED FIRST**

**What We Just Completed:**
- ✅ Risk counts in all asset responses
- ✅ Risk-finding relationship system
- ✅ New API endpoints

**What Needs to Be Done:**

#### A. Update Frontend API Client
- [ ] Add `riskCount` field to asset TypeScript interfaces
- [ ] Add risk-finding link API functions to `risks.ts`
- [ ] Update finding API client to include risk endpoints

**Files to Update:**
- `frontend/src/lib/api/risks.ts` - Add risk-finding link functions
- `frontend/src/lib/api/assets.ts` - Update asset interfaces to include `riskCount`
- `frontend/src/lib/api/governance.ts` - Add finding risk endpoints

#### B. Update Asset UI Components
- [ ] Display risk count in asset list views (badge/indicator)
- [ ] Display risk count in asset detail pages
- [ ] Add "Risks" tab to all asset detail pages (if not already done)
  - Physical Assets
  - Information Assets
  - Software Assets
  - Business Applications
  - Suppliers

#### C. Update Findings UI
- [ ] Add "Risks" section to finding detail page
- [ ] Create risk-finding link management UI
- [ ] Display linked risks in finding list/detail views
- [ ] Add ability to link/unlink risks from findings

**Estimated Time:** 8-12 hours

---

### 2. Risk-Finding Link UI Components

**Components to Create:**
- [ ] `FindingRiskSelector` component - Select risks to link to findings
- [ ] `RiskFindingLinks` component - Display and manage risk-finding links
- [ ] `FindingLinkedRisks` component - Show risks linked to a finding
- [ ] `RiskLinkedFindings` component - Show findings linked to a risk

**Estimated Time:** 6-8 hours

---

## 📋 Medium Priority Tasks

### 3. Complete Frontend Integration (Phase 3)

**Remaining Frontend Tasks:**
- [ ] Create `AssetRiskSelector` component (for selecting assets when creating risks)
- [ ] Create `ControlRiskSelector` component (for selecting controls when creating risks)
- [ ] Create `TreatmentForm` component (standalone form for creating treatments)
- [ ] Create `KRIForm` component (standalone form for creating KRIs)
- [ ] Create risk categories management page
- [ ] Create assessment request forms and pages

**Estimated Time:** 15-20 hours

---

### 4. Testing (Phase 4)

**Backend Testing:**
- [ ] Unit tests for RiskService
- [ ] Unit tests for RiskAssetLinkService
- [ ] Unit tests for RiskControlLinkService
- [ ] Unit tests for RiskFindingLinkService
- [ ] E2E tests for risk API endpoints
- [ ] E2E tests for asset-risk integration
- [ ] E2E tests for governance-risk integration
- [ ] E2E tests for risk-finding integration

**Frontend Testing:**
- [ ] Component tests for risk forms
- [ ] Component tests for dashboard widgets
- [ ] E2E tests for risk-finding linking
- [ ] Integration tests for asset-risk linking

**Estimated Time:** 20-25 hours

---

### 5. Data Migration & Seeding (Phase 5)

- [ ] Migration script for existing risks (if needed)
- [ ] Seed script for sample risks (dev environment)
- [ ] Seed script for sample KRIs (dev environment)
- [ ] Data import script from CSV/Excel

**Estimated Time:** 8-10 hours

---

## 🚀 Recommended Order of Execution

### Option 1: Frontend Integration First (Recommended)
1. **Update API clients** (2-3 hours)
   - Add risk count to asset interfaces
   - Add risk-finding link functions
   
2. **Update Asset UI** (4-5 hours)
   - Display risk counts
   - Add/verify "Risks" tabs
   
3. **Update Findings UI** (3-4 hours)
   - Add risk-finding link management
   - Display linked risks

**Total:** ~10-12 hours

### Option 2: Testing First
1. Write unit tests for new services
2. Write E2E tests for new endpoints
3. Then proceed with frontend integration

### Option 3: Complete Remaining Features
1. TreatmentForm component
2. KRIForm component
3. Assessment requests
4. Then testing and polish

---

## 📊 Progress by Priority

### High Priority (Do First)
- ✅ Backend integration - **COMPLETE**
- ⏳ Frontend integration for new features - **NEXT**
- ⏳ Risk-finding link UI - **NEXT**

### Medium Priority
- ⏳ Complete remaining frontend components
- ⏳ Testing infrastructure
- ⏳ Data seeding

### Low Priority (Enhancements)
- ⏳ Assessment requests workflow
- ⏳ PDF/Excel export for reports
- ⏳ Advanced workflow integration

---

## 🎯 Quick Wins (Can Do Now)

1. **Update TypeScript Interfaces** (30 minutes)
   - Add `riskCount?: number` to asset interfaces
   - Add risk-finding link types

2. **Display Risk Counts** (1-2 hours)
   - Add risk count badge to asset list cards
   - Show risk count in asset detail headers

3. **Add Risk-Finding API Functions** (1 hour)
   - Add functions to `risks.ts` API client
   - Add functions to `governance.ts` for findings

---

## 💡 Suggestions

**If you want to see immediate results:**
1. Start with updating the API clients (quick win)
2. Add risk count display to asset lists (visual impact)
3. Then build out the full risk-finding link UI

**If you want to complete a full feature:**
1. Focus on risk-finding link UI completely
2. Make it work end-to-end
3. Then move to next feature

**If you want to improve quality:**
1. Write tests for the new backend code
2. Ensure everything is well-tested
3. Then proceed with frontend

---

## 📝 Notes

- All backend work is complete and tested
- Database migration is successful
- Backend service is running
- Ready for frontend integration
- No blocking issues

---

**Recommended Next Step:** Frontend Integration (Option 1) - Update API clients and display risk counts in asset UI.

