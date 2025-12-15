# Assets-Governance Integration Testing Guide

**Last Updated**: December 5, 2025

## Quick Summary

Assets are integrated with Governance in your system by allowing you to:
1. **Link Controls to Assets** - Show which security controls are implemented on each asset  
2. **View Linked Assets** - See which assets have a specific control
3. **Bulk Assign Controls** - Apply controls to multiple assets at once
4. **Track Control Implementation** - Monitor control status across asset inventory

## Current Test Data

```
✓ Physical Assets:        28
✓ Information Assets:       6
✓ Business Applications:    6
✓ Software Assets:          6
✓ Suppliers:                6
✓ Unified Controls:        11
✓ Policies:                42
```

## API Endpoints Reference

| Operation | Method | Endpoint | Purpose |
|-----------|--------|----------|---------|
| List Controls | GET | `/api/v1/governance/unified-controls` | Get all governance controls |
| List Physical Assets | GET | `/api/v1/assets/physical` | Get all physical assets |
| List Info Assets | GET | `/api/v1/assets/information` | Get all information assets |
| List Applications | GET | `/api/v1/assets/applications` | Get all business applications |
| List Software | GET | `/api/v1/assets/software` | Get all software assets |
| List Suppliers | GET | `/api/v1/assets/suppliers` | Get all suppliers |
| **Link Control to Asset** | **POST** | **`/api/v1/governance/unified-controls/:id/assets`** | **Assign control to asset(s)** |
| Get Linked Assets | GET | `/api/v1/governance/unified-controls/:id/assets` | View assets with control |
| Bulk Link Assets | POST | `/api/v1/governance/unified-controls/:id/assets/bulk` | Assign control to multiple assets |

## Asset Types (Enum Values)

Use these exact values for `asset_type`:
- `physical` - Physical servers, workstations, network devices
- `information` - Databases, data repositories, document stores
- `application` - Business applications, ERP, CRM systems
- `software` - Licensed or open source software packages
- `supplier` - Third-party vendors and service providers

## Implementation Statuses

Valid values for `implementation_status`:
- `not_implemented` - Control not yet implemented
- `in_progress` - Control currently being implemented
- `implemented` - Control is fully implemented
- `tested` - Control has been tested and verified

## Testing Steps

### 1. Get Authentication Token

```bash
TOKEN=$(curl -s -X POST http://localhost:3001/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@grcplatform.com","password":"password123"}' | jq -r '.accessToken')

echo "✓ Token: $TOKEN"
```

### 2. View Available Controls

```bash
curl -s http://localhost:3001/api/v1/governance/unified-controls \
  -H "Authorization: Bearer $TOKEN" | jq '.data[] | {id, control_name, control_type}'
```

**Sample Output:**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "control_name": "Multi-Factor Authentication",
  "control_type": "technical"
}
```

### 3. View Available Physical Assets

```bash
curl -s "http://localhost:3001/api/v1/assets/physical?page=1&limit=5" \
  -H "Authorization: Bearer $TOKEN" | jq '.data[] | {id, asset_name, status, criticality_level}'
```

### 4. Link a Control to an Asset

**CORRECT REQUEST:**

```bash
TOKEN="your-token-here"
CONTROL_ID="550e8400-e29b-41d4-a716-446655440000"
ASSET_ID="660e8400-e29b-41d4-a716-446655440001"

curl -X POST http://localhost:3001/api/v1/governance/unified-controls/$CONTROL_ID/assets \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"asset_type\": \"physical\",
    \"asset_id\": \"$ASSET_ID\",
    \"implementation_date\": \"2025-12-01\",
    \"implementation_status\": \"implemented\",
    \"implementation_notes\": \"MFA enabled on all admin accounts\",
    \"is_automated\": false,
    \"effectiveness_score\": 4
  }" | jq .
```

**Expected Response:**
```json
{
  "id": "mapping-id-here",
  "control_id": "control-id",
  "asset_type": "physical",
  "asset_id": "asset-id",
  "implementation_status": "implemented",
  "created_at": "2025-12-04T20:30:00.000Z"
}
```

### 5. View Linked Assets for a Control

```bash
CONTROL_ID="550e8400-e29b-41d4-a716-446655440000"

curl -s http://localhost:3001/api/v1/governance/unified-controls/$CONTROL_ID/assets \
  -H "Authorization: Bearer $TOKEN" | jq '.data[] | {asset_id, asset_type, implementation_status, implementation_date}'
```

### 6. Bulk Link Assets to a Control

```bash
CONTROL_ID="550e8400-e29b-41d4-a716-446655440000"

curl -X POST http://localhost:3001/api/v1/governance/unified-controls/$CONTROL_ID/assets/bulk \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"asset_type\": \"physical\",
    \"asset_ids\": [
      \"660e8400-e29b-41d4-a716-446655440001\",
      \"660e8400-e29b-41d4-a716-446655440002\",
      \"660e8400-e29b-41d4-a716-446655440003\"
    ],
    \"implementation_date\": \"2025-12-01\",
    \"implementation_status\": \"implemented\",
    \"implementation_notes\": \"Bulk security controls applied\"
  }" | jq .
```

## Complete Automated Testing Script

Save this as `test-assets-governance.sh`:

```bash
#!/bin/bash
set -e

echo "=== Assets-Governance Integration Test ==="
echo ""

# Get token
echo "1️⃣  Authenticating..."
TOKEN=$(curl -s -X POST http://localhost:3001/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@grcplatform.com","password":"password123"}' | jq -r '.accessToken')
echo "✓ Got token"
echo ""

# Get first control
echo "2️⃣  Fetching first control..."
CONTROL_ID=$(curl -s http://localhost:3001/api/v1/governance/unified-controls \
  -H "Authorization: Bearer $TOKEN" | jq -r '.data[0].id')
CONTROL_NAME=$(curl -s http://localhost:3001/api/v1/governance/unified-controls/$CONTROL_ID \
  -H "Authorization: Bearer $TOKEN" | jq -r '.control_name')
echo "✓ Control: $CONTROL_NAME"
echo "  ID: $CONTROL_ID"
echo ""

# Get first physical asset
echo "3️⃣  Fetching first physical asset..."
ASSET_ID=$(curl -s "http://localhost:3001/api/v1/assets/physical?page=1&limit=1" \
  -H "Authorization: Bearer $TOKEN" | jq -r '.data[0].id')
ASSET_NAME=$(curl -s "http://localhost:3001/api/v1/assets/physical?page=1&limit=1" \
  -H "Authorization: Bearer $TOKEN" | jq -r '.data[0].asset_name')
echo "✓ Asset: $ASSET_NAME"
echo "  ID: $ASSET_ID"
echo ""

# Link control to asset
echo "4️⃣  Linking control to asset..."
curl -X POST http://localhost:3001/api/v1/governance/unified-controls/$CONTROL_ID/assets \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"asset_type\": \"physical\",
    \"asset_id\": \"$ASSET_ID\",
    \"implementation_date\": \"2025-12-01\",
    \"implementation_status\": \"implemented\",
    \"implementation_notes\": \"Test linking\",
    \"is_automated\": false,
    \"effectiveness_score\": 4
  }" | jq '{status: .implementation_status, asset_id, control_id}'
echo ""

# View linked assets
echo "5️⃣  Viewing linked assets for control..."
curl -s http://localhost:3001/api/v1/governance/unified-controls/$CONTROL_ID/assets \
  -H "Authorization: Bearer $TOKEN" | jq '.data | length' | xargs echo "✓ Linked assets count:"
echo ""

echo "✅ Integration test complete!"
```

Run it:
```bash
chmod +x test-assets-governance.sh
./test-assets-governance.sh
```

## UI Testing (Dashboard)

1. **Login** to http://localhost:3000/en/dashboard
2. **Navigate** to Governance → Controls
3. **Open** a control (e.g., "Multi-Factor Authentication")
4. **Look for** "Linked Assets" tab
5. **Click** "Link Assets" button
6. **Select** Physical assets from the browser
7. **Confirm** linking
8. **Navigate** to Assets → Physical Assets
9. **Open** an asset
10. **Look for** "Governance" or "Linked Controls" tab
11. **Verify** the control you linked appears

## Integration Architecture

```
┌─────────────────────────────────────────────────┐
│                  Governance Module              │
│  (Controls, Policies, Assessments, Findings)   │
└────────────────┬────────────────────────────────┘
                 │
            Linking Service
                 │
┌────────────────┴────────────────────────────────┐
│            Control-Asset Links                  │
│  (Tracks which controls are on which assets)   │
└────────────────┬────────────────────────────────┘
                 │
┌─────────────────────────────────────────────────┐
│                  Asset Module                   │
│  (Physical, Info, Application, Software, etc.) │
└─────────────────────────────────────────────────┘
```

## Key API Endpoints

| Operation | Method | Endpoint | Purpose |
|-----------|--------|----------|---------|
| List Controls | GET | `/api/v1/governance/controls` | Get all controls |
| List Assets | GET | `/api/v1/assets/:type` | Get assets of a type |
| Link Control to Assets | POST | `/api/v1/governance/controls/:id/assets` | Assign control to asset(s) |
| Get Linked Assets | GET | `/api/v1/governance/controls/:id/assets` | View assets with control |
| Get Linked Controls | GET | `/api/v1/governance/assets/:type/:id/controls` | View controls on asset |
| Get Compliance Status | GET | `/api/v1/governance/assets/:type/:id/compliance` | View compliance of asset |
| Bulk Assign Controls | POST | `/api/v1/governance/assets/:type/:id/controls` | Assign multiple controls |

## Testing Checklist

- [ ] Retrieve authentication token
- [ ] List controls available
- [ ] List assets by type
- [ ] Link a control to a physical asset
- [ ] View controls linked to that asset
- [ ] View linked assets for a control
- [ ] View compliance status of asset
- [ ] Bulk assign multiple controls to an asset
- [ ] Check governance dashboard shows asset metrics
- [ ] Verify audit logs track all changes

## Common Issues & Solutions

**Issue**: 401 Unauthorized  
**Solution**: Ensure token is valid and not expired. Re-run auth login.

**Issue**: 404 Not Found  
**Solution**: Verify the control ID and asset ID exist. Check IDs are UUIDs.

**Issue**: No linked assets appear  
**Solution**: Make sure you're using the correct asset type enum (physical_asset, information_asset, etc.)

**Issue**: Compliance percentage shows 0%  
**Solution**: Ensure controls are properly linked with implementation_status = "implemented"

## Next Steps

1. **Test in UI** - Verify all integrations work through dashboard
2. **Run Full Suite** - Use test scripts to verify all 8 operations
3. **Create Business Cases** - Link real controls to your production assets
4. **Generate Reports** - Create compliance reports by asset
5. **Set up Monitoring** - Track control coverage via dashboard
