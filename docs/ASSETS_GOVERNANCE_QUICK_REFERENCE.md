# Assets-Governance Integration - Quick Reference

## Overview

Your system has **full integration** between Asset Management and Governance modules:

- **28 Physical Assets** can be linked to **11 Governance Controls**
- **Information Assets, Applications, Software, Suppliers** also support control linking
- All linking creates **audit trails** and tracks **implementation status**

## How It Works

### Architecture
```
Governance Module (Controls, Policies, Assessments)
         ↓
    Control-Asset Mapping Service
         ↓  
Asset Module (Physical, Info, Apps, Software, Suppliers)
```

### Data Flow Example
1. Compliance Officer has a Control: "Multi-Factor Authentication"
2. Security Team implements MFA on 5 production servers
3. Officer links the control to those 5 servers in Governance UI
4. System creates audit trail entries
5. Reports show which servers have MFA implemented vs which don't

## Key Endpoints

| Action | Endpoint | Method |
|--------|----------|--------|
| **Link Control to Asset** | `/api/v1/governance/unified-controls/:id/assets` | POST |
| View Linked Assets | `/api/v1/governance/unified-controls/:id/assets` | GET |
| Bulk Link Assets | `/api/v1/governance/unified-controls/:id/assets/bulk` | POST |

## Quick Test

```bash
# 1. Get token
TOKEN=$(curl -s -X POST http://localhost:3001/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@grcplatform.com","password":"password123"}' | jq -r '.accessToken')

# 2. List controls
curl -s http://localhost:3001/api/v1/governance/unified-controls \
  -H "Authorization: Bearer $TOKEN" | jq '.data[] | {id, control_name}'

# 3. List assets (physical)
curl -s "http://localhost:3001/assets/physical" \
  -H "Authorization: Bearer $TOKEN" | jq '.data[] | {id, asset_name}'

# 4. Link a control to an asset
CONTROL_ID="05e9dc0a-3415-4ff4-8531-04cf9bd95794"
ASSET_ID="b674dae7-b704-4d0c-a033-037fe3e1a109"

curl -X POST http://localhost:3001/api/v1/governance/unified-controls/$CONTROL_ID/assets \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"asset_type\": \"physical\",
    \"asset_id\": \"$ASSET_ID\",
    \"implementation_date\": \"2025-12-01\",
    \"implementation_status\": \"implemented\",
    \"implementation_notes\": \"MFA enabled\",
    \"is_automated\": false,
    \"effectiveness_score\": 5
  }"

# 5. View linked assets for that control
curl -s http://localhost:3001/api/v1/governance/unified-controls/$CONTROL_ID/assets \
  -H "Authorization: Bearer $TOKEN" | jq '.data'
```

## Implementation Status Options

When linking, use one of these values:
- `not_implemented` - Control not yet in place
- `in_progress` - Control being deployed
- `implemented` - Control is active
- `tested` - Control has been verified

## Asset Types

Use these exact values for `asset_type`:
- `physical` - Servers, workstations, network devices
- `information` - Databases, repositories
- `application` - Business applications
- `software` - Licensed/open source software
- `supplier` - Third-party vendors

## Real-World Use Cases

### 1. Demonstrate Control Coverage
**Scenario**: Auditors ask "Which servers have encryption enabled?"
```
→ Link "Data Encryption" control to all production servers
→ Run report showing 100% control coverage
```

### 2. Track Implementation Progress
**Scenario**: Rolling out MFA across infrastructure
```
→ Initial link: status = "in_progress" (5 servers)
→ Phase 1 complete: status = "implemented" (10 servers)
→ Phase 2 complete: status = "implemented" (15 servers)
→ Dashboard shows progress bar
```

### 3. Compliance Reporting
**Scenario**: Generate SOC 2 compliance report
```
→ Controls linked to assets show implementation
→ Automated report includes:
   - Which assets have required controls
   - Which are missing controls
   - When each was implemented
```

### 4. Audit Trail
**Scenario**: Track who made what changes
```
→ Each link/unlink creates audit log entry
→ Shows: User, Control, Asset, Action, Timestamp
→ Tamper-proof history for compliance verification
```

## Testing via UI

1. **Login**: http://localhost:3000/en/dashboard
2. **Navigate**: Governance → Controls
3. **Select** a control (e.g., "Multi-Factor Authentication")
4. **Click** "Link Assets" tab
5. **Search** for physical assets
6. **Select** assets and click "Link"
7. **Confirm** linking
8. **Verify**: Asset appears in "Linked Assets" list

## Common Field Values

### Effectiveness Score (1-5)
- 1 = Not effective
- 2 = Partially effective
- 3 = Moderately effective
- 4 = Very effective
- 5 = Highly effective

### Key Capabilities

✓ One control can be linked to many assets
✓ One asset can have multiple controls linked
✓ Bulk operations for efficiency
✓ Track implementation progress
✓ Automated testing indicators
✓ Effectiveness scoring
✓ Full audit trail
✓ Real-time reporting

## Integration with Remediation Tracking

The Remediation Tracking feature (already deployed) works with this:
- Findings are linked to governance controls
- Control-asset mappings show where remediation needed
- Track remediation through to control implementation
- Closure when control properly implemented on all assets

## Next Steps

1. **Test API** using the Quick Test commands above
2. **Link a Control** to a Physical Asset via API or UI
3. **Generate Report** showing control coverage
4. **Set up Monitoring** to track control implementation over time
5. **Integrate** with your compliance workflows

## Support

Full documentation available in:
- `ASSETS_GOVERNANCE_INTEGRATION_TEST_SCENARIOS.md` - Detailed test cases
- `ASSET_MANAGEMENT_ARCHITECTURE.md` - System architecture
- `REMEDIATION_TRACKING_COMPLETE.md` - Remediation integration

