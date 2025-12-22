# GOV-060: Control-Asset Linking UI - Status

**Task ID:** GOV-060  
**Title:** Create Control-Asset Linking UI  
**Status:** 🟡 Ready to Start  
**Priority:** P0

---

## ✅ Prerequisites Complete

- ✅ Database table `control_asset_mappings` exists (Migration 1701000000006)
- ✅ Asset Management UI exists
- ✅ Controls UI exists
- ✅ Backend table structure ready

---

## 📋 Implementation Required

### Backend (4-6 hours)
- [ ] Create `ControlAssetMapping` entity
- [ ] Create DTOs (Create, Update, Query)
- [ ] Create `ControlAssetMappingService`
- [ ] Add controller endpoints to `UnifiedControlsController`
- [ ] Register in `GovernanceModule`

### Frontend API Client (1-2 hours)
- [ ] Add TypeScript interfaces
- [ ] Create API client methods
- [ ] Error handling

### Frontend UI Components (8-10 hours)
- [ ] Asset browser dialog component
- [ ] Linked assets list component  
- [ ] Bulk assignment interface
- [ ] Integration into control detail page
- [ ] Integration into asset detail pages

---

## 🎯 Quick Start

Ready to begin implementation. The table structure is defined in:
`backend/src/migrations/1701000000006-CreateControlMappingsTables.ts`

Asset types supported:
- `physical`
- `information`
- `application`
- `software`
- `supplier`

---

**Next Step:** Start with backend entity creation, then service, then controller, then frontend UI.







