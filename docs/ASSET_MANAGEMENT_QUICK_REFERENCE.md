# Asset Management System - Quick Reference

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                      FRONTEND (Next.js)                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │ Import Wizard│  │ Asset Forms  │  │  Dashboard   │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │ Integration  │  │ Field Config │  │   Analytics  │          │
│  │   Manager    │  │   Manager    │  │   Widgets    │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │ Bulk Ops Bar │  │ Export Tools │  │ Dependency   │          │
│  │ (Update/Delete)│ │ (CSV/XLS/PDF)│  │   Graph      │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ HTTP/REST API
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    BACKEND API LAYER                            │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │ Asset        │  │ Integration  │  │ Field Config │          │
│  │ Controllers  │  │ Controllers  │  │ Controllers  │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │ Import       │  │ Dashboard    │  │ Audit        │          │
│  │ Controllers  │  │ Controllers  │  │ Controllers  │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
│  ┌──────────────┐                                              │
│  │ Bulk Ops     │                                              │
│  │ Controller   │                                              │
│  └──────────────┘                                              │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    SERVICE LAYER                                 │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │              ASSET SERVICES                               │  │
│  │  • Physical Asset Service                                 │  │
│  │  • Information Asset Service                              │  │
│  │  • Business Application Service                            │  │
│  │  • Software Asset Service                                  │  │
│  │  • Supplier Service                                        │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │              CORE SERVICES                               │  │
│  │  • Import Service (CSV/Excel)                            │  │
│  │  • Integration Service (CMDB/AMS)                       │  │
│  │  • Field Config Service (Custom Fields)                  │  │
│  │  • Audit Service (Change Tracking)                        │  │
│  │  • Dependency Service (Relationships)                     │  │
│  │  • Search Service (Global Search)                         │  │
│  │  • Dashboard Service (Analytics)                          │  │
│  │  • Bulk Operations Service (Update/Delete)                 │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    DATABASE (PostgreSQL)                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │ Asset Tables │  │ Config Tables│  │ Audit Tables │          │
│  │ • physical   │  │ • field      │  │ • audit_logs │          │
│  │ • information│  │   configs    │  │ • import_logs│          │
│  │ • application │  │ • integration│  │ • sync_logs  │          │
│  │ • software    │  │   configs    │  │              │          │
│  │ • supplier    │  │              │  │              │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
└─────────────────────────────────────────────────────────────────┘
                              ▲
                              │
┌─────────────────────────────────────────────────────────────────┐
│                    EXTERNAL INTEGRATIONS                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │   CMDB       │  │ Asset Mgmt  │  │  REST APIs   │          │
│  │ ServiceNow   │  │ Lansweeper  │  │  Custom      │          │
│  │ BMC Remedy   │  │ ManageEngine│  │  Endpoints   │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
│  ┌──────────────┐                                              │
│  │   Webhooks   │                                              │
│  │ Real-time    │                                              │
│  │   Updates    │                                              │
│  └──────────────┘                                              │
└─────────────────────────────────────────────────────────────────┘
```

## Data Import Flow

```
CSV/Excel File
      │
      ▼
┌─────────────────┐
│  Upload & Parse │
└─────────────────┘
      │
      ▼
┌─────────────────┐
│  Preview (10    │
│     rows)       │
└─────────────────┘
      │
      ▼
┌─────────────────┐
│  Field Mapping  │
│  (User Config)  │
└─────────────────┘
      │
      ▼
┌─────────────────┐
│  Validation     │
└─────────────────┘
      │
      ▼
┌─────────────────┐
│  Import Assets  │
│  (Batch)        │
└─────────────────┘
      │
      ▼
┌─────────────────┐
│  Error Report   │
│  (if any)       │
└─────────────────┘
```

## Bulk Operations Flow

```
User Selects Assets
      │
      ▼
┌─────────────────┐
│  Bulk Ops Bar   │
│  Appears        │
└─────────────────┘
      │
      ├───► Update ───┐
      │               │
      ├───► Delete ───┤
      │               │
      └───► Export ───┤
                      │
                      ▼
            ┌─────────────────┐
            │  Operation      │
            │  (Update/Delete)│
            └─────────────────┘
                      │
                      ▼
            ┌─────────────────┐
            │  Progress       │
            │  Indicator      │
            └─────────────────┘
                      │
                      ▼
            ┌─────────────────┐
            │  Results        │
            │  Summary        │
            │  (Success/Fail) │
            └─────────────────┘
```

## Export Flow

```
Selected Assets / Filtered Results
      │
      ▼
┌─────────────────┐
│  Choose Format  │
│  (CSV/XLS/PDF)  │
└─────────────────┘
      │
      ▼
┌─────────────────┐
│  Field Selector │
│  (if >5 fields)  │
└─────────────────┘
      │
      ▼
┌─────────────────┐
│  Format Data    │
│  & Generate     │
└─────────────────┘
      │
      ▼
┌─────────────────┐
│  Download File  │
└─────────────────┘
```

## Integration Sync Flow

```
External System (CMDB/AMS)
      │
      │ HTTP GET with Auth
      ▼
┌─────────────────┐
│  Fetch Data     │
└─────────────────┘
      │
      ▼
┌─────────────────┐
│  Field Mapping  │
│  (Config-based) │
└─────────────────┘
      │
      ▼
┌─────────────────┐
│  Duplicate      │
│  Detection      │
└─────────────────┘
      │
      ▼
┌─────────────────┐
│  Conflict       │
│  Resolution     │
└─────────────────┘
      │
      ▼
┌─────────────────┐
│  Create/Update  │
│  Assets         │
└─────────────────┘
      │
      ▼
┌─────────────────┐
│  Log Sync       │
│  Results        │
└─────────────────┘
```

## Asset Types & Relationships

```
┌─────────────┐
│  Physical   │────┐
│  Assets     │    │ hosts
└─────────────┘    │
                   │
┌─────────────┐    │    ┌─────────────┐
│  Business   │◄───┘    │  Software   │
│ Application │         │  Assets     │
└─────────────┘         └─────────────┘
      │ uses                  │ stores
      │                       │
      │ processes             │
      ▼                       ▼
┌─────────────┐         ┌─────────────┐
│ Information │         │ Information │
│  Assets     │         │  Assets     │
└─────────────┘         └─────────────┘
      │
      │ depends_on
      ▼
┌─────────────┐
│  Suppliers  │
│  / Third    │
│  Parties    │
└─────────────┘
```

## Dependency Visualization Flow

```
Asset Detail Page
      │
      ▼
┌─────────────────┐
│  Load Dependencies│
│  (Incoming/Outgoing)│
└─────────────────┘
      │
      ▼
┌─────────────────┐
│  Build Graph    │
│  (Nodes & Edges)│
└─────────────────┘
      │
      ├───► Filter by Type ───┐
      │                        │
      ├───► Filter by Rel ────┤
      │                        │
      └───► Export PNG ───────┤
                              │
                              ▼
                    ┌─────────────────┐
                    │  Interactive     │
                    │  Visualization  │
                    └─────────────────┘
```

## Feature Matrix

| Feature | Status | Description |
|---------|--------|-------------|
| **CSV Import** | ✅ Complete | Import assets from CSV with field mapping |
| **Excel Import** | ✅ Complete | Import assets from Excel (.xlsx, .xls) |
| **CMDB Integration** | ✅ Complete | Connect to CMDB systems (ServiceNow, BMC) |
| **AMS Integration** | ✅ Complete | Connect to Asset Management Systems |
| **REST API Integration** | ✅ Complete | Generic REST API integration |
| **Webhook Integration** | ✅ Complete | Real-time updates via webhooks |
| **Field Configuration** | ✅ Complete | Custom fields per asset type |
| **Field Validation** | ✅ Complete | Regex patterns and custom rules |
| **Dependency Management** | ✅ Complete | Track asset relationships |
| **Audit Trail** | ✅ Complete | Full change history |
| **Global Search** | ✅ Complete | Search across all asset types |
| **Dashboard Analytics** | ✅ Complete | Asset counts, compliance, security status |
| **Bulk Operations** | ✅ Complete | Multi-select, bulk update (owner/criticality/tags), bulk delete |
| **Export** | ✅ Complete | CSV, Excel (.xlsx), PDF export with field selection |
| **Relationship Visualization** | ✅ Complete | Interactive dependency graphs with filtering and PNG export |

## API Endpoints Summary

### Asset Management
- `GET /assets/physical` - List physical assets
- `POST /assets/physical` - Create physical asset
- `PUT /assets/physical/:id` - Update physical asset
- `DELETE /assets/physical/:id` - Delete physical asset
- (Similar for information, application, software, supplier)

### Import
- `POST /assets/physical/import/preview` - Preview import file
- `POST /assets/physical/import` - Execute import
- `GET /assets/physical/import/history` - Import history
- `GET /assets/physical/import/:id` - Import log details

### Integration
- `GET /assets/integrations` - List integrations
- `POST /assets/integrations` - Create integration
- `PUT /assets/integrations/:id` - Update integration
- `DELETE /assets/integrations/:id` - Delete integration
- `POST /assets/integrations/:id/test` - Test connection
- `POST /assets/integrations/:id/sync` - Trigger sync
- `GET /assets/integrations/:id/sync-history` - Sync history

### Field Configuration
- `GET /assets/field-configs` - List field configs
- `POST /assets/field-configs` - Create field config
- `PUT /assets/field-configs/:id` - Update field config
- `DELETE /assets/field-configs/:id` - Delete field config
- `GET /assets/field-configs/for-form/:assetType` - Get form fields
- `POST /assets/field-configs/validate` - Validate field value

### Dashboard
- `GET /dashboard/overview` - Dashboard overview with analytics

### Bulk Operations
- `POST /assets/bulk/:assetType/update` - Bulk update assets (owner, criticality, compliance tags)
- `POST /assets/bulk/:assetType/delete` - Bulk delete assets
- Request body: `{ assetIds: string[], ownerId?: string, criticalityLevel?: string, complianceTags?: string[] }`
- Response: `{ successful: number, failed: number, errors: Array<{ assetId: string, error: string }> }`

### Search & Dependencies
- `GET /assets/search` - Global asset search
- `GET /assets/:type/:id/dependencies` - Get dependencies
- `GET /assets/:type/:id/dependencies/incoming` - Get incoming dependencies
- `POST /assets/:type/:id/dependencies` - Add dependency
- `DELETE /assets/dependencies/:id` - Remove dependency

## Quick Feature Summary

### ✅ Recently Completed Features

**Bulk Operations (100% Complete)**
- Multi-select assets with checkboxes
- Bulk update: owner, criticality level, compliance tags
- Bulk delete with confirmation
- Progress indicators and result summaries
- Error reporting per asset

**Export (95% Complete)**
- CSV export (existing, enhanced)
- Excel export (.xlsx) - NEW
- PDF export (existing)
- Field selection UI for choosing export columns
- Export filtered/searched results

**Relationship Visualization (90% Complete)**
- Interactive dependency graph (React Flow)
- Filter by asset type
- Filter by relationship type
- Export diagram as PNG
- Click nodes to navigate to asset details

### Usage Examples

**Bulk Update Assets:**
1. Select multiple assets using checkboxes
2. Click "Update" in bulk operations bar
3. Choose fields to update (owner, criticality, compliance tags)
4. View progress and results summary

**Export Assets:**
1. Select assets or apply filters
2. Click "Export" → Choose format (CSV/Excel/PDF)
3. If many fields, select which fields to include
4. Download generated file

**View Dependencies:**
1. Navigate to asset detail page
2. View dependency graph
3. Use filters to focus on specific types/relationships
4. Export diagram as PNG if needed

---

## Component Locations

### Frontend Components
- `frontend/src/components/assets/bulk-operations-bar-enhanced.tsx` - Bulk operations UI
- `frontend/src/components/assets/export-field-selector.tsx` - Field selection dialog
- `frontend/src/components/assets/dependency-graph.tsx` - Dependency visualization
- `frontend/src/lib/utils/excel-export.ts` - Excel export utilities

### Backend Services
- `backend/src/asset/services/bulk-operations.service.ts` - Bulk operations logic
- `backend/src/asset/controllers/bulk-operations.controller.ts` - Bulk operations API

### API Client
- `frontend/src/lib/api/assets.ts` - Contains `bulkUpdate()` and `bulkDelete()` methods

