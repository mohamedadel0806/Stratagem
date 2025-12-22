# GOV-060: Control-Asset Linking UI Implementation Plan

**Status:** Ready to Implement  
**Priority:** P0  
**Estimated Time:** 26 hours  
**Dependencies:** GOV-032 (Asset Management UI) ✅, GOV-057 (Backend) ✅

---

## 📋 Overview

Create the UI for linking controls to assets. The backend table (`control_asset_mappings`) exists, but we need:
1. Backend service/controller for CRUD operations
2. Frontend UI components for asset browser and linking
3. Display linked assets on control detail page
4. Display linked controls on asset detail pages

---

## 🏗️ Architecture

### Database Schema (Already Exists)
```sql
control_asset_mappings:
  - id (uuid)
  - unified_control_id (uuid, FK)
  - asset_type (varchar) - 'physical', 'information', 'application', 'software', 'supplier'
  - asset_id (uuid)
  - implementation_date (date)
  - implementation_status (enum)
  - implementation_notes (text)
  - last_test_date (date)
  - last_test_result (varchar)
  - effectiveness_score (integer)
  - is_automated (boolean)
  - mapped_by (uuid)
  - mapped_at (timestamp)
  - updated_at (timestamp)
```

### Backend Endpoints (To Create)
```
GET    /api/v1/governance/unified-controls/:id/assets
POST   /api/v1/governance/unified-controls/:id/assets
DELETE /api/v1/governance/unified-controls/:id/assets/:mappingId
PATCH  /api/v1/governance/unified-controls/:id/assets/:mappingId
GET    /api/v1/governance/unified-controls/:id/assets/search
```

### Frontend Components (To Create)
1. `ControlAssetBrowser` - Asset selection dialog
2. `LinkedAssetsList` - Display linked assets on control detail
3. `BulkAssetAssignment` - Bulk linking interface
4. `AssetControlLinks` - Display linked controls on asset detail (in Asset Management)

---

## 📦 Implementation Steps

### Phase 1: Backend (4-6 hours)
1. ✅ Create `ControlAssetMapping` entity
2. ✅ Create DTOs for mapping operations
3. ✅ Create `ControlAssetMappingService`
4. ✅ Add endpoints to `UnifiedControlsController`
5. ✅ Register service in `GovernanceModule`

### Phase 2: Frontend API Client (1-2 hours)
1. ✅ Add types/interfaces for control-asset mappings
2. ✅ Create API client methods
3. ✅ Add error handling

### Phase 3: UI Components (8-10 hours)
1. ✅ Create asset browser dialog component
2. ✅ Create linked assets display component
3. ✅ Create bulk assignment interface
4. ✅ Integrate into control detail page

### Phase 4: Asset Management Integration (4-6 hours)
1. ✅ Create control links display on asset detail pages
2. ✅ Add linking from asset side

### Phase 5: Testing & Polish (2-4 hours)
1. ✅ Test all CRUD operations
2. ✅ Test bulk operations
3. ✅ UI/UX improvements
4. ✅ Error handling

---

## 🎯 Acceptance Criteria

- [x] Asset browser from control detail working
- [x] Bulk assignment interface functional
- [x] Linked assets shown on control detail
- [x] Linked controls shown on asset detail (in Asset Management)
- [x] UI responsive and performant

---

## 📝 Next Steps

Ready to start implementation! Begin with Phase 1 (Backend).







