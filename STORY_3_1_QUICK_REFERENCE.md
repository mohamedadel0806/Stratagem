# Quick Reference: Story 3.1 Features

## 🎯 At a Glance

**Story 3.1: Unified Control Library Core** - Complete unified control management system with browsing, filtering, search, analytics, and bulk operations.

---

## 🔧 Backend API Reference

### Core Endpoints

#### Statistics
```
GET /api/v1/governance/unified-controls/library/statistics
→ Returns: totalControls, activeControls, byType, byComplexity, implementationRate
```

#### Browse with Filters
```
GET /api/v1/governance/unified-controls/library/browse
  ?domain=DOMAIN_ID
  &type=DETECTIVE|PREVENTIVE|CORRECTIVE
  &complexity=LOW|MEDIUM|HIGH
  &status=DRAFT|ACTIVE|DEPRECATED
  &implementationStatus=IMPLEMENTED|PARTIAL|NOT_IMPLEMENTED
  &search=QUERY
  &page=1
  &limit=50
→ Returns: { data: UnifiedControl[], meta: { page, limit, total, totalPages } }
```

#### Domain Management
```
GET /api/v1/governance/unified-controls/library/domains/tree
→ Returns: Array of ControlDomainTreeNodeDto with hierarchy and control counts

GET /api/v1/governance/unified-controls/library/domains
→ Returns: Array of active ControlDomain objects

GET /api/v1/governance/unified-controls/library/types
→ Returns: Array of control type strings
```

#### Dashboard & Analytics
```
GET /api/v1/governance/unified-controls/library/dashboard
→ Returns: { recentControls, draftControls, implementedControls, deprecatedControls }
```

#### Data Operations
```
GET /api/v1/governance/unified-controls/library/export
  ?domain=DOMAIN_ID&type=TYPE&status=STATUS
→ Returns: CSV string

POST /api/v1/governance/unified-controls/library/import
  { "controls": [ { control_identifier, title, domain, ... } ] }
→ Returns: { created, skipped, errors }
```

#### Control Details
```
GET /api/v1/governance/unified-controls/:id/domain
→ Returns: All controls in same domain

GET /api/v1/governance/unified-controls/:id/related
  ?limit=5
→ Returns: Related controls (same type/domain)

GET /api/v1/governance/unified-controls/:id/effectiveness
→ Returns: Control effectiveness metrics
```

---

## 💻 Frontend Usage

### Display Control Library
```tsx
import { ControlLibrary } from '@/components/governance/control-library';

export default function Page() {
  return <ControlLibrary />;
}
```

### Display Domain Browser
```tsx
import { DomainBrowser } from '@/components/governance/domain-browser';

export default function Page() {
  return <DomainBrowser />;
}
```

### Use in Custom Components
```tsx
import { useQuery } from '@tanstack/react-query';
import { governanceApi } from '@/lib/api/governance';

function MyComponent() {
  // Get library statistics
  const { data: stats } = useQuery(
    ['control-stats'],
    () => governanceApi.getLibraryStatistics()
  );

  // Browse with filters
  const { data: controls } = useQuery(
    ['controls', filters],
    () => governanceApi.browseLibrary(filters)
  );

  // Get domain tree
  const { data: domainTree } = useQuery(
    ['domain-tree'],
    () => governanceApi.getDomainTree()
  );

  return (
    <div>
      <p>Total: {stats?.totalControls}</p>
      <p>Controls: {controls?.data.length}</p>
    </div>
  );
}
```

---

## 🔍 Common Queries

### Get all detective controls
```
GET /library/browse?type=DETECTIVE
```

### Get active controls in Risk Management domain
```
GET /library/browse?domain=DOMAIN_ID&status=ACTIVE
```

### Search for access control controls
```
GET /library/browse?search=access
```

### Get high complexity controls
```
GET /library/browse?complexity=HIGH
```

### Get draft controls awaiting review
```
GET /library/browse?status=DRAFT
```

### Get not yet implemented controls
```
GET /library/browse?implementationStatus=NOT_IMPLEMENTED
```

### Combine multiple filters
```
GET /library/browse?domain=DOMAIN&type=PREVENTIVE&complexity=MEDIUM&status=ACTIVE
```

---

## 📊 Response Examples

### Statistics Response
```json
{
  "totalControls": 156,
  "activeControls": 142,
  "draftControls": 10,
  "deprecatedControls": 4,
  "byType": {
    "DETECTIVE": 45,
    "PREVENTIVE": 68,
    "CORRECTIVE": 43
  },
  "byComplexity": {
    "LOW": 89,
    "MEDIUM": 54,
    "HIGH": 13
  },
  "implementationRate": 87
}
```

### Browse Response
```json
{
  "data": [
    {
      "id": "uuid",
      "control_identifier": "CTRL-001",
      "title": "Risk Assessment",
      "control_type": "DETECTIVE",
      "status": "ACTIVE",
      "implementation_status": "IMPLEMENTED",
      "domain": "risk-management",
      "complexity": "MEDIUM",
      "cost_impact": "MEDIUM"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 50,
    "total": 156,
    "totalPages": 4
  }
}
```

### Domain Tree Response
```json
[
  {
    "id": "domain-1",
    "name": "Risk Management",
    "code": "RISK",
    "controlCount": 45,
    "children": [
      {
        "id": "domain-1-1",
        "name": "Risk Assessment",
        "controlCount": 12,
        "children": []
      }
    ]
  }
]
```

### Import Response
```json
{
  "created": 5,
  "skipped": 2,
  "errors": [
    { "row": 8, "error": "control_identifier 'CTRL-999' already exists" }
  ]
}
```

---

## 🎨 UI Features

### ControlLibrary Component
- **Grid View**: Card-based display with hover actions
- **List View**: Table-based with sortable columns
- **Stats View**: Dashboard with metrics and distributions
- **Filters**: Domain, Type, Complexity, Status, Implementation
- **Search**: Real-time full-text search
- **Pagination**: Navigate large result sets
- **Detail Modal**: Full control information dialog
- **Export Button**: Download filtered results as CSV
- **Import Button**: Upload CSV file

### DomainBrowser Component
- **Tree View**: Interactive domain hierarchy
- **Expand/Collapse**: Toggle branch visibility
- **Control Counts**: Badge showing controls per domain
- **Domain Selection**: Highlight current domain
- **Control List**: Shows controls in selected domain
- **Domain Summary**: Quick info about selected domain

---

## ⚙️ Service Methods

```typescript
// Statistics
getLibraryStatistics(): Promise<ControlLibraryStatsDto>

// Browsing
browseLibrary(filters): Promise<ControlLibraryBrowseResponseDto>

// Domain Navigation
getDomainHierarchyTree(): Promise<ControlDomainTreeNodeDto[]>
getActiveDomains(): Promise<ControlDomain[]>
getControlsByDomain(domainId): Promise<UnifiedControl[]>

// Discovery
getControlTypes(): Promise<string[]>
getRelatedControls(controlId, limit): Promise<UnifiedControl[]>
getControlEffectiveness(controlId): Promise<ControlEffectivenessDto>

// Dashboard
getControlsDashboard(): Promise<ControlDashboardDto>

// Data Operations
exportControls(filters): Promise<string> // CSV
importControls(data, userId): Promise<ImportControlsResultDto>
```

---

## 🔐 Authorization

All endpoints require:
- **Authorization Header**: `Bearer <JWT_TOKEN>`
- **Guard**: `@UseGuards(JwtAuthGuard)`
- **User Context**: Available as `req.user` in controllers

---

## 🐛 Error Handling

### Common Errors
- **400 Bad Request**: Invalid filter values or pagination params
- **401 Unauthorized**: Missing or invalid JWT token
- **404 Not Found**: Domain or control doesn't exist
- **409 Conflict**: Duplicate control_identifier on import

### Error Response Format
```json
{
  "statusCode": 400,
  "message": "Invalid complexity value: INVALID",
  "error": "Bad Request"
}
```

---

## 📈 Performance Tips

1. **Pagination**: Always use pagination for large result sets
2. **Filtering**: Combine filters to reduce result size
3. **Caching**: React Query caches results automatically
4. **Search**: Use specific search terms, wildcards are ILIKE
5. **Statistics**: Called frequently, consider longer cache TTL

---

## 🚀 Deployment Checklist

- ✅ Service methods added to UnifiedControlsService
- ✅ Endpoints added to UnifiedControlsController
- ✅ DTOs created and validated
- ✅ Frontend components built
- ✅ API client methods added
- ⏳ Unit tests (run before deployment)
- ⏳ Integration tests (run before deployment)
- ⏳ Code review (needed before deployment)

---

## 📚 Related Stories

- **Story 2.1**: Policy Hierarchy (prerequisite foundation)
- **Story 5.1**: Asset-Control Integration (uses control library)
- **Story 6.1**: Compliance Report (uses control stats)
- **Story 8.3**: Critical Alerts (uses control status)

---

*For detailed API specifications, see STORY_3_1_UNIFIED_CONTROL_LIBRARY_IMPLEMENTATION.md*
