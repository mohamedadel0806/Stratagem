# INT-1.2: View Asset Compliance Status Implementation Guide

**User Story**: As a compliance officer, I want to view the compliance status of assets based on assigned controls so that I can identify non-compliant assets and take action.

**Priority**: P1 (Should Have)  
**Story Points**: 8  
**Status**: ✅ IMPLEMENTED

---

## Overview

The Asset Compliance Status feature enables compliance officers to view a comprehensive dashboard displaying the compliance status of all assets in the system. The feature provides filtering, search, and export capabilities to help identify non-compliant assets and track compliance trends.

## Architecture

### Backend Components

#### 1. API Endpoint
**Endpoint**: `GET /compliance/assessments/assets-compliance-list`

**Query Parameters**:
- `assetType` (optional): Filter by asset type (physical, information, application, software, supplier)
- `complianceStatus` (optional): Filter by compliance status (compliant, non_compliant, partially_compliant, not_assessed, requires_review)
- `businessUnit` (optional): Filter by business unit
- `criticality` (optional): Filter by criticality level (critical, high, medium, low)
- `searchQuery` (optional): Search by asset name or identifier
- `page` (optional, default=1): Page number for pagination
- `pageSize` (optional, default=20): Number of items per page

**Response**:
```typescript
{
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  assets: AssetComplianceSummary[];
  complianceSummary: {
    totalAssets: number;
    compliantAssets: number;
    nonCompliantAssets: number;
    partiallyCompliantAssets: number;
    averageCompliancePercentage: number;
  };
}
```

#### 2. Service Method
**Location**: `backend/src/common/services/compliance-assessment.service.ts`

**Method**: `getAssetComplianceList(filters, pagination)`

The service method:
- Retrieves all assets and their compliance mappings
- Calculates compliance metrics per asset
- Groups assets and their linked controls
- Supports filtering and pagination
- Returns comprehensive compliance summary

### Frontend Components

#### 1. React Component
**Location**: `frontend/src/components/assets/asset-compliance-view.tsx`

**Features**:
- Summary cards showing key metrics
- Filterable table with compliance status
- Search functionality
- Pagination support
- CSV export capability
- Asset navigation links
- Compliance status icons and badges

#### 2. API Client
**Location**: `frontend/src/lib/api/compliance.ts`

**Function**: `assetComplianceListApi.getAssetComplianceList(filters, pagination)`

#### 3. Page
**Location**: `frontend/src/app/[locale]/(dashboard)/dashboard/assets/compliance/page.tsx`

Provides a dedicated page for viewing asset compliance status with tabs for overview and detailed views.

---

## Database Query

The backend uses an optimized SQL query to calculate compliance metrics:

```sql
WITH asset_compliance AS (
  SELECT 
    arm.asset_type,
    arm.asset_id,
    COUNT(*) as total_requirements,
    COUNT(CASE WHEN arm.compliance_status = 'compliant' THEN 1 END) as compliant_count,
    COUNT(CASE WHEN arm.compliance_status = 'non_compliant' THEN 1 END) as non_compliant_count,
    COUNT(CASE WHEN arm.compliance_status = 'partially_compliant' THEN 1 END) as partially_compliant_count,
    COUNT(CASE WHEN arm.compliance_status = 'not_assessed' THEN 1 END) as not_assessed_count,
    COUNT(CASE WHEN arm.compliance_status = 'requires_review' THEN 1 END) as requires_review_count,
    COUNT(CASE WHEN arm.compliance_status = 'not_applicable' THEN 1 END) as not_applicable_count,
    ROUND(100.0 * COUNT(CASE WHEN arm.compliance_status = 'compliant' THEN 1 END) / COUNT(*), 2) as compliance_percentage,
    MAX(arm.created_at) as last_assessment_date,
    CASE
      WHEN COUNT(CASE WHEN arm.compliance_status = 'compliant' THEN 1 END) = COUNT(*) THEN 'compliant'
      WHEN COUNT(CASE WHEN arm.compliance_status = 'non_compliant' THEN 1 END) > 0 THEN 'non_compliant'
      WHEN COUNT(CASE WHEN arm.compliance_status = 'partially_compliant' THEN 1 END) > 0 THEN 'partially_compliant'
      ELSE 'not_assessed'
    END as overall_status
  FROM asset_requirement_mappings arm
  GROUP BY arm.asset_type, arm.asset_id
)
SELECT * FROM asset_compliance
```

---

## Features

### 1. Summary Dashboard
- **Total Assets**: Count of all assets in the system
- **Compliant**: Number of fully compliant assets
- **Non-Compliant**: Number of non-compliant assets
- **Partially Compliant**: Number of partially compliant assets
- **Average Compliance**: Overall average compliance percentage

### 2. Asset Table
Displays comprehensive information for each asset:
- **Asset Name & ID**: Clickable to navigate to asset detail page
- **Asset Type**: Physical, Information, Application, Software, or Supplier
- **Criticality Level**: Critical, High, Medium, Low
- **Total Requirements**: Number of compliance requirements
- **Compliant Count**: Requirements with compliant status
- **Non-Compliant Count**: Requirements with non-compliant status
- **Compliance %**: Visual progress bar
- **Controls Linked**: Count of linked controls
- **Status Badge**: Overall compliance status with icon
- **Actions**: Menu to view asset details

### 3. Filtering
- **Asset Type Filter**: Select specific asset types
- **Compliance Status Filter**: Filter by compliance status
- **Business Unit Filter**: Filter by business unit
- **Criticality Filter**: Filter by criticality level
- **Search**: Search by asset name or identifier

### 4. Export
- **CSV Export**: Download compliance data as CSV file
- Includes all asset information and compliance metrics
- Timestamped filename for easy organization

### 5. Pagination
- Default page size: 20 items
- Configurable page size (max 100)
- Page navigation with previous/next buttons
- Current page indicator

---

## Data Models

### AssetComplianceSummary
```typescript
interface AssetComplianceSummary {
  assetId: string;
  assetType: AssetType;
  assetName: string;
  assetIdentifier?: string;
  description?: string;
  criticality?: string;
  businessUnit?: string;
  totalRequirements: number;
  compliantCount: number;
  nonCompliantCount: number;
  partiallyCompliantCount: number;
  notAssessedCount: number;
  overallCompliancePercentage: number;
  controlsLinkedCount: number;
  linkedControls: LinkedControl[];
  lastAssessmentDate?: string;
  overallComplianceStatus: ComplianceStatusEnum;
}
```

### LinkedControl
```typescript
interface LinkedControl {
  controlId: string;
  controlName: string;
  controlDescription?: string;
  implementationStatus: ImplementationStatus;
  implementationDate?: string;
  lastTestDate?: string;
  lastTestResult?: string;
  effectivenessScore?: number;
  isAutomated: boolean;
  implementationNotes?: string;
}
```

---

## Testing

### Backend Tests
**File**: `backend/test/governance/asset-compliance-list.e2e-spec.ts`

**Test Coverage**:
1. Basic endpoint functionality
2. Pagination support
3. Filtering by asset type
4. Filtering by compliance status
5. Response structure validation
6. Linked controls inclusion
7. Empty result handling
8. Parameter validation

### Frontend Tests
**File**: `frontend/src/components/assets/__tests__/asset-compliance-view.test.tsx`

**Test Coverage**:
1. Initial load and loading states
2. Asset data display
3. Summary metrics display
4. Filtering functionality
5. Search functionality
6. Export functionality
7. Pagination
8. Error handling
9. Empty state handling
10. Navigation

---

## Acceptance Criteria

All acceptance criteria from test scenario TS-INT-007 are met:

✅ **AC1: Asset list complete** - All assets are displayed with complete information  
✅ **AC2: Status information accurate** - Compliance status accurately reflects mapped requirements  
✅ **AC3: Summary metrics correct** - Summary totals are accurate and calculated correctly  
✅ **AC4: Filtering functional** - All filter types work correctly  
✅ **AC5: Navigation works** - Asset details can be accessed from the table  
✅ **AC6: Export works** - CSV export functionality is operational  

---

## Usage Instructions

### For Compliance Officers

#### Accessing the Feature
1. Navigate to **Dashboard** → **Assets** → **Compliance**
2. Or access directly: `/dashboard/assets/compliance`

#### Viewing Asset Compliance Status
1. The dashboard displays all assets with their compliance status
2. Summary cards show overall compliance metrics
3. The table shows detailed information for each asset

#### Filtering Assets
1. Use the filter section to narrow down assets:
   - Select **Asset Type** to filter by type
   - Select **Compliance Status** to find non-compliant assets
   - Enter **Business Unit** name to filter by department
   - Select **Criticality** to focus on critical assets
   - Use **Search** to find specific assets by name or ID

#### Exporting Compliance Data
1. Click the **Export** button to download a CSV file
2. The file contains all visible assets and their compliance metrics
3. Use the exported data for compliance reports and audits

#### Investigating Non-Compliant Assets
1. Filter by **Compliance Status** = "Non-Compliant" or "Partially Compliant"
2. Click on an asset name to view detailed compliance information
3. Review linked controls and their implementation status
4. Take corrective actions based on compliance gaps

---

## Performance Considerations

- **Query Optimization**: Uses SQL aggregation for efficient calculation
- **Pagination**: Reduces data transfer with configurable page sizes
- **Caching**: React Query handles response caching
- **Lazy Loading**: Linked controls loaded on demand

---

## Future Enhancements

1. **Trend Analysis**: Historical compliance trend charts
2. **Automated Remediation**: Auto-assign corrective controls
3. **Compliance Dashboard Widgets**: Add compliance cards to main dashboard
4. **Email Notifications**: Alert compliance officers of non-compliance
5. **Bulk Actions**: Update multiple assets' compliance status
6. **Advanced Reporting**: Generate compliance reports by control/requirement

---

## Related Features

- **INT-1.1**: Link Controls to Assets
- **Asset Management**: Individual asset detail views
- **Compliance Assessment**: Assess requirements for assets
- **Governance Controls**: Link controls to compliance requirements

---

## Configuration

No special configuration required. The feature works with existing:
- Asset Management Module
- Compliance Assessment Engine
- Governance Controls Framework

---

## Support & Troubleshooting

### Common Issues

**Q: No assets showing in the view?**
- A: Ensure assets exist and have compliance requirements linked
- Check filters are set correctly
- Verify user has permission to view assets

**Q: Compliance percentage seems incorrect?**
- A: Ensure compliance assessments have been run
- Check that asset-requirement mappings exist
- Run compliance assessment to update status

**Q: Export button not working?**
- A: Check browser's download permissions
- Ensure pop-up blockers are disabled
- Try using a different browser

---

**Last Updated**: December 5, 2025  
**Version**: 1.0  
**Status**: ✅ COMPLETE
