# Governance and Asset Integration

## Overview

The Governance module is **directly linked** to the Asset Management module through the **Control-Asset Mapping** system. This integration enables organizations to track which controls are implemented on which assets, providing complete traceability from regulatory requirements to actual implementation.

## Integration Architecture

### High-Level Flow

```
Regulatory Influencer (NCA, SAMA, ISO 27001)
    ↓
Policy (Information Security Policy)
    ↓
Control Objective (CO-IAM-001: Implement strong authentication)
    ↓
Unified Control (UCL-IAM-002: Multi-Factor Authentication)
    ↓
Control-Asset Mapping (Links control to specific assets)
    ↓
Asset (Physical Server, Application, Database, etc.)
```

## Database Schema

### Control-Asset Mapping Table

The integration is implemented through the `control_asset_mappings` table:

```sql
CREATE TABLE control_asset_mappings (
    id UUID PRIMARY KEY,
    unified_control_id UUID NOT NULL REFERENCES unified_controls(id),
    asset_type VARCHAR(100) NOT NULL,  -- 'physical', 'information', 'application', 'software', 'supplier'
    asset_id UUID NOT NULL,             -- References the specific asset
    implementation_date DATE,
    implementation_status implementation_status_enum DEFAULT 'not_implemented',
    implementation_notes TEXT,
    last_test_date DATE,
    last_test_result VARCHAR(100),
    effectiveness_score INTEGER,
    is_automated BOOLEAN DEFAULT false,
    mapped_by UUID REFERENCES users(id),
    mapped_at TIMESTAMP,
    updated_at TIMESTAMP,
    
    UNIQUE(unified_control_id, asset_type, asset_id)
);
```

### Key Fields

- **`unified_control_id`**: Links to the Unified Control from Governance module
- **`asset_type`**: Type of asset (physical, information, application, software, supplier)
- **`asset_id`**: UUID of the specific asset
- **`implementation_status`**: Status of control implementation on this asset
- **`effectiveness_score`**: How effective the control is on this asset (0-100)
- **`is_automated`**: Whether the control is automated on this asset

## Supported Asset Types

The system supports linking controls to **all 5 asset types**:

1. **Physical Assets** (`physical`)
   - Servers, workstations, network devices
   - Example: "MFA control implemented on Production Server-001"

2. **Information Assets** (`information`)
   - Databases, documents, data repositories
   - Example: "Encryption control applied to Customer Database"

3. **Business Applications** (`application`)
   - ERP, CRM, custom applications
   - Example: "Access control implemented in ERP System"

4. **Software Assets** (`software`)
   - Licensed software, open source
   - Example: "Patch management control for Windows Server OS"

5. **Suppliers** (`supplier`)
   - Vendors, partners, service providers
   - Example: "Vendor assessment control for Cloud Provider ABC"

## API Endpoints

### Link Asset to Control

```http
POST /api/v1/governance/unified-controls/{controlId}/assets
Content-Type: application/json

{
  "asset_type": "physical",
  "asset_id": "uuid-of-asset",
  "implementation_date": "2025-01-15",
  "implementation_status": "implemented",
  "implementation_notes": "MFA enabled on all admin accounts",
  "is_automated": true
}
```

### Bulk Link Assets

```http
POST /api/v1/governance/unified-controls/{controlId}/assets/bulk
Content-Type: application/json

{
  "asset_type": "physical",
  "asset_ids": ["uuid-1", "uuid-2", "uuid-3"],
  "implementation_status": "implemented",
  "implementation_date": "2025-01-15"
}
```

### Get Assets Linked to Control

```http
GET /api/v1/governance/unified-controls/{controlId}/assets?asset_type=physical&implementation_status=implemented
```

### Get Controls Linked to Asset

```http
GET /api/v1/governance/unified-controls/by-asset?asset_type=physical&asset_id={assetId}
```

### Update Control-Asset Mapping

```http
PATCH /api/v1/governance/unified-controls/{controlId}/assets/{mappingId}
Content-Type: application/json

{
  "implementation_status": "tested",
  "effectiveness_score": 95,
  "last_test_date": "2025-01-20",
  "last_test_result": "passed"
}
```

### Unlink Asset from Control

```http
DELETE /api/v1/governance/unified-controls/{controlId}/assets/{mappingId}
```

## Use Cases

### 1. Compliance Mapping

**Scenario**: NCA ECC requires MFA on all privileged accounts.

**Implementation**:
1. Create Unified Control: "UCL-IAM-002: Multi-Factor Authentication"
2. Map to NCA ECC requirement
3. Link control to all physical servers where privileged accounts exist
4. Track implementation status per server
5. Generate compliance report showing which servers have MFA implemented

### 2. Control Coverage Analysis

**Question**: "Which assets have encryption controls implemented?"

**Answer**: Query all `control_asset_mappings` where:
- Control title contains "encryption"
- `implementation_status = 'implemented'`
- Group by `asset_type` to see coverage across asset categories

### 3. Asset Compliance Status

**Question**: "Is our Customer Database compliant with all applicable controls?"

**Answer**: 
1. Get all controls linked to "Customer Database" (information asset)
2. Check implementation status for each control
3. Identify gaps (controls not implemented or not tested)
4. Generate remediation plan

### 4. Control Effectiveness Tracking

**Scenario**: Track how effective a control is across different assets.

**Implementation**:
- Link control to multiple assets
- Set `effectiveness_score` per asset
- Track `last_test_date` and `last_test_result`
- Identify assets where control is less effective
- Take corrective action

## Implementation Status Values

Controls can have different implementation statuses on different assets:

- **`not_implemented`**: Control not yet implemented on this asset
- **`planned`**: Implementation planned but not started
- **`in_progress`**: Implementation in progress
- **`implemented`**: Control is implemented
- **`tested`**: Control has been tested and verified
- **`effective`**: Control is working effectively
- **`ineffective`**: Control is not working as expected
- **`not_applicable`**: Control doesn't apply to this asset

## Traceability Chain

The integration enables complete traceability:

```
Influencer (NCA ECC)
    ↓
Policy (Information Security Policy)
    ↓
Control Objective (CO-IAM-001)
    ↓
Unified Control (UCL-IAM-002: MFA)
    ↓
Control-Asset Mapping
    ↓
Physical Asset (Production Server-001)
    ↓
Evidence (Screenshot of MFA configuration)
    ↓
Assessment (Control tested and passed)
```

## Benefits

### 1. Complete Visibility
- See which controls are implemented on which assets
- Identify assets missing critical controls
- Track control coverage across asset types

### 2. Compliance Reporting
- Generate reports showing asset-level compliance
- Identify gaps in control implementation
- Demonstrate compliance to auditors

### 3. Risk Management
- Identify assets with ineffective controls
- Prioritize remediation based on asset criticality
- Track control effectiveness over time

### 4. Operational Efficiency
- Bulk link controls to multiple assets
- Track implementation progress
- Automate compliance checking

## Example Queries

### Get All Controls for a Physical Asset

```typescript
const controls = await controlAssetMappingService.getControlsByAsset(
  AssetType.PHYSICAL,
  'server-uuid-123'
);
```

### Get All Assets for a Control

```typescript
const assets = await controlAssetMappingService.getAssetsByControl(
  'control-uuid-456'
);
```

### Find Assets Missing a Control

```sql
SELECT a.*
FROM physical_assets a
WHERE a.id NOT IN (
  SELECT asset_id 
  FROM control_asset_mappings 
  WHERE unified_control_id = 'control-uuid' 
    AND asset_type = 'physical'
);
```

## Frontend Integration

### Control Detail Page
- Show linked assets in a table
- Allow adding/removing asset links
- Display implementation status per asset
- Show effectiveness scores

### Asset Detail Page
- Show linked controls in a table
- Display control implementation status
- Show compliance gaps
- Link to control details

### Bulk Operations
- Select multiple assets
- Link to a control in one operation
- Set default implementation status
- Add implementation notes

## Best Practices

### 1. Link Controls at Implementation Time
- When implementing a control, immediately link it to relevant assets
- Don't wait until audit time

### 2. Update Status Regularly
- Update implementation status as work progresses
- Record test dates and results
- Track effectiveness scores

### 3. Use Implementation Notes
- Document how the control is implemented on each asset
- Note any exceptions or deviations
- Record configuration details

### 4. Regular Reviews
- Periodically review control-asset mappings
- Remove links for decommissioned assets
- Update status for changed implementations

## Related Features

### Evidence Linking
Evidence can be linked to control-asset mappings to prove implementation:
- Screenshots of configurations
- Test results
- Audit logs
- Compliance reports

### Assessment Integration
Assessments can evaluate control implementation on specific assets:
- Test control effectiveness per asset
- Document findings
- Track remediation

### Reporting
Generate reports showing:
- Control coverage by asset type
- Implementation status across assets
- Compliance gaps per asset
- Control effectiveness metrics

## Summary

The Governance-Asset integration provides:

✅ **Complete Traceability**: From regulations to assets  
✅ **Asset-Level Compliance**: Track controls per asset  
✅ **Gap Analysis**: Identify missing controls  
✅ **Effectiveness Tracking**: Monitor control performance  
✅ **Bulk Operations**: Efficient management at scale  
✅ **Compliance Reporting**: Audit-ready documentation  

This integration is **critical** for demonstrating that governance controls are not just documented, but actually implemented on the assets that matter.

---

**Last Updated**: December 2025  
**Status**: ✅ Fully Implemented







