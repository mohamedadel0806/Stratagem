# Story 3.1: Unified Control Library - Quick Start Guide

## 🚀 Getting Started with the Control Library

### Frontend Usage

#### 1. Browsing Controls

```typescript
import { ControlLibrary } from '@/components/governance/control-library';

export function ControlsPage() {
  const handleSelectControl = (controlId: string) => {
    console.log('Selected control:', controlId);
    // Navigate to control details or trigger action
  };

  return (
    <ControlLibrary 
      onSelectControl={handleSelectControl}
      showActions={true}
    />
  );
}
```

#### 2. Using Domain Browser

```typescript
import { DomainBrowser } from '@/components/governance/domain-browser';

export function DomainsPage() {
  return (
    <DomainBrowser 
      onSelectDomain={(domain) => console.log('Selected:', domain)}
      showControlCount={true}
    />
  );
}
```

#### 3. API Client Methods

```typescript
import { governanceApi } from '@/lib/api/governance';

// Get library statistics
const stats = await governanceApi.getLibraryStatistics();
console.log(`Total controls: ${stats.totalControls}`);
console.log(`Implementation rate: ${stats.implementationRate}%`);

// Get domain hierarchy tree
const tree = await governanceApi.getDomainTree();

// Browse controls with filters
const results = await governanceApi.browseLibrary({
  domain: 'operations',
  type: 'preventive',
  complexity: 'high',
  page: 1,
  limit: 25
});

// Get related controls
const related = await governanceApi.getRelatedControls('control-123', 5);

// Export controls to CSV
const csv = await governanceApi.exportControls({
  domain: 'operations',
  status: 'active'
});

// Import controls from data
const result = await governanceApi.importControls([
  {
    control_identifier: 'ACC-001',
    title: 'User Access Control',
    domain: 'access',
    control_type: 'preventive',
    complexity: 'medium'
  }
]);
```

### Backend Usage

#### 1. Service Methods

```typescript
import { UnifiedControlsService } from './unified-controls.service';

constructor(private controlsService: UnifiedControlsService) {}

// Get statistics
const stats = await this.controlsService.getLibraryStatistics();

// Browse library with filtering
const result = await this.controlsService.browseLibrary({
  domain: 'operations',
  search: 'firewall',
  page: 1,
  limit: 50
});

// Get controls by domain
const controls = await this.controlsService.getControlsByDomain('domain-123');

// Get domain hierarchy tree
const tree = await this.controlsService.getDomainHierarchyTree();

// Get related controls
const related = await this.controlsService.getRelatedControls('control-123');

// Get control effectiveness
const effectiveness = await this.controlsService.getControlEffectiveness('control-123');

// Export controls
const csv = await this.controlsService.exportControls({
  domain: 'operations'
});

// Import controls
const result = await this.controlsService.importControls(data, userId);

// Get dashboard data
const dashboard = await this.controlsService.getControlsDashboard();
```

### API Endpoints

#### Browse Library
```bash
GET /api/v1/governance/unified-controls/library/browse
Query Parameters:
  - domain: string (optional) - Filter by domain
  - type: string (optional) - Filter by control type
  - complexity: string (optional) - Filter by complexity (low/medium/high)
  - status: string (optional) - Filter by status (active/draft/deprecated)
  - implementationStatus: string (optional) - Filter by implementation status
  - search: string (optional) - Full-text search
  - page: number (default: 1) - Page number
  - limit: number (default: 50, max: 100) - Results per page

Response:
{
  "data": [...],
  "meta": {
    "page": 1,
    "limit": 50,
    "total": 250,
    "totalPages": 5
  }
}
```

#### Get Statistics
```bash
GET /api/v1/governance/unified-controls/library/statistics

Response:
{
  "totalControls": 250,
  "activeControls": 180,
  "draftControls": 50,
  "deprecatedControls": 20,
  "byType": { "Preventive": 100, "Detective": 80, ... },
  "byComplexity": { "Low": 120, "Medium": 100, "High": 30 },
  "implementationRate": 72
}
```

#### Get Domain Tree
```bash
GET /api/v1/governance/unified-controls/library/domains/tree

Response:
[
  {
    "id": "domain-123",
    "name": "Operational",
    "controlCount": 50,
    "children": [...]
  }
]
```

#### Browse by Domain
```bash
GET /api/v1/governance/unified-controls/:id/domain

Response: Array of controls in the same domain
```

#### Get Related Controls
```bash
GET /api/v1/governance/unified-controls/:id/related?limit=5

Response: Array of related controls
```

#### Get Control Effectiveness
```bash
GET /api/v1/governance/unified-controls/:id/effectiveness

Response:
{
  "controlId": "123",
  "title": "Access Control",
  "implementationStatus": "implemented",
  "lastUpdated": "2025-12-19T...",
  "avgEffectiveness": 92,
  "testHistory": [...]
}
```

#### Export Controls
```bash
GET /api/v1/governance/unified-controls/library/export
Query Parameters:
  - domain: string (optional)
  - type: string (optional)
  - status: string (optional)

Response: CSV format (text/csv)
```

#### Import Controls
```bash
POST /api/v1/governance/unified-controls/library/import
Body:
[
  {
    "control_identifier": "ACC-001",
    "title": "User Access Control",
    "domain": "access",
    "control_type": "preventive",
    "complexity": "medium"
  }
]

Response:
{
  "created": 10,
  "skipped": 2,
  "errors": [{ "row": 5, "error": "..." }]
}
```

### Common Workflows

#### 1. Display Control Statistics Dashboard

```typescript
const stats = await governanceApi.getLibraryStatistics();

return (
  <div className="grid grid-cols-4 gap-4">
    <Card>
      <CardTitle>Total</CardTitle>
      <p className="text-2xl">{stats.totalControls}</p>
    </Card>
    <Card>
      <CardTitle>Active</CardTitle>
      <p className="text-2xl text-green-600">{stats.activeControls}</p>
    </Card>
    <Card>
      <CardTitle>Draft</CardTitle>
      <p className="text-2xl text-yellow-600">{stats.draftControls}</p>
    </Card>
    <Card>
      <CardTitle>Implementation Rate</CardTitle>
      <p className="text-2xl text-blue-600">{stats.implementationRate}%</p>
    </Card>
  </div>
);
```

#### 2. Filter and Search Controls

```typescript
const [filters, setFilters] = useState({
  domain: '',
  type: '',
  search: '',
  page: 1
});

const { data: results } = useQuery({
  queryKey: ['controls', filters],
  queryFn: () => governanceApi.browseLibrary(filters)
});

return (
  <div>
    <input 
      onChange={(e) => setFilters({ ...filters, search: e.target.value })}
      placeholder="Search controls..."
    />
    <select onChange={(e) => setFilters({ ...filters, domain: e.target.value })}>
      <option>All Domains</option>
      {/* Domain options */}
    </select>
    {results?.data.map(control => (
      <div key={control.id}>{control.title}</div>
    ))}
  </div>
);
```

#### 3. Bulk Import Controls from CSV

```typescript
const handleImport = async (file: File) => {
  const text = await file.text();
  const lines = text.split('\n');
  const headers = lines[0].split(',');
  
  const controls = lines.slice(1).map(line => {
    const values = line.split(',');
    return {
      control_identifier: values[0],
      title: values[1],
      domain: values[2],
      control_type: values[3],
      complexity: values[4]
    };
  });

  const result = await governanceApi.importControls(controls);
  console.log(`Imported ${result.created} controls`);
};
```

#### 4. Show Related Controls

```typescript
const [selectedControl, setSelectedControl] = useState<string>();

const { data: related } = useQuery({
  queryKey: ['related', selectedControl],
  queryFn: () => governanceApi.getRelatedControls(selectedControl, 10),
  enabled: !!selectedControl
});

return (
  <div>
    <h3>Related Controls</h3>
    {related?.map(control => (
      <div key={control.id} className="p-4 border">
        <h4>{control.title}</h4>
        <p>{control.description}</p>
      </div>
    ))}
  </div>
);
```

### Performance Tips

1. **Use pagination** for large result sets (default 50 per page)
2. **Cache domain tree** - doesn't change frequently, use React Query staleTime
3. **Lazy load related controls** - only fetch when needed
4. **Debounce search input** - avoid excessive API calls while typing
5. **Export large datasets in background** - CSV generation can be slow for 10k+ controls

### Troubleshooting

| Issue | Solution |
|-------|----------|
| Search not working | Ensure search term matches control_identifier, title, or description |
| Import fails | Check CSV format: control_identifier, title, domain required |
| Empty domain tree | Verify domains exist and is_active = true |
| Slow browse queries | Add limit parameter, enable database indices |
| Related controls empty | Check controls in same domain with same control_type |

### Next Integration Points

- **Story 5.1**: Use browseLibrary() to link assets to controls
- **Story 8.3**: Use getControlEffectiveness() for alert triggering
- **Reporting**: Leverage getLibraryStatistics() for compliance dashboards
- **Workflows**: Use getControlsByDomain() for domain-specific workflows

---
**Version**: 1.0  
**Last Updated**: December 19, 2025
