# Audit Trail and Dependencies - Setup Guide

## Overview

The Asset Management module now includes:
1. **Asset Dependencies** - Track relationships between different assets
2. **Audit Trail** - Complete change history for all asset types

## Database Setup

The migrations have been run successfully:
- `1700000000013-CreateAssetDependenciesTable.ts` - Creates `asset_dependencies` table
- `1700000000014-CreateAssetAuditLogsTable.ts` - Creates `asset_audit_logs` table

## How It Works

### Audit Trail

**Automatic Logging:**
- Audit logs are automatically created when you:
  - **Create** an asset (any type)
  - **Update** an asset (logs field-level changes)
  - **Delete** an asset (soft delete)

**No Seed Data Needed:**
- Audit logs are created automatically as you use the system
- If you see "No audit logs found", it means:
  - The asset was created before audit logging was enabled, OR
  - No changes have been made to the asset yet

**To Generate Audit Logs:**
1. Create a new asset (any type)
2. Edit an existing asset
3. Delete an asset
4. All actions will automatically create audit log entries

### Asset Dependencies

**Manual Creation:**
- Dependencies are created manually through the UI
- Navigate to any asset detail page → "Dependencies" tab
- Click "Add Dependency" to create relationships

**Relationship Types:**
- `depends_on` - Asset depends on another asset
- `uses` - Asset uses another asset
- `contains` - Asset contains another asset
- `hosts` - Asset hosts another asset
- `processes` - Asset processes another asset
- `stores` - Asset stores another asset
- `other` - Other relationship type

## Testing

### Test Audit Trail:
1. Navigate to any asset detail page
2. Click the "Audit Trail" tab
3. If empty, create or update the asset to generate logs
4. You should see:
   - Creation logs when assets are created
   - Update logs showing field changes (old → new values)
   - Delete logs when assets are deleted

### Test Dependencies:
1. Navigate to any asset detail page
2. Click the "Dependencies" tab
3. Click "Add Dependency"
4. Select target asset type and asset
5. Choose relationship type
6. Save - the dependency will appear in the list

## Troubleshooting

### "Error loading audit trail"
- **Check:** Make sure the backend is running
- **Check:** Verify the asset ID is valid
- **Check:** Check browser console for detailed error messages
- **Note:** Empty audit trail is normal if no changes have been made

### "No audit logs found"
- This is normal if:
  - The asset was created before audit logging was enabled
  - No updates/deletes have been performed
- **Solution:** Create or update an asset to generate audit logs

### Dependencies not showing
- **Check:** Make sure dependencies were created through the UI
- **Check:** Verify both source and target assets exist
- **Note:** Dependencies are bidirectional - check both "Outgoing" and "Incoming" tabs

## API Endpoints

### Audit Trail
- `GET /api/v1/assets/:type/:id/audit` - Get audit logs for an asset
  - Query params: `from`, `to`, `userId`, `action`, `page`, `limit`

### Dependencies
- `GET /api/v1/assets/:type/:id/dependencies` - Get outgoing dependencies
- `GET /api/v1/assets/:type/:id/dependencies/incoming` - Get incoming dependencies
- `POST /api/v1/assets/:type/:id/dependencies` - Create dependency
- `DELETE /api/v1/assets/dependencies/:id` - Delete dependency

## Integration Status

✅ **All Asset Types Integrated:**
- Physical Assets
- Information Assets
- Business Applications
- Software Assets
- Suppliers

All asset types now have:
- Audit trail logging (automatic)
- Dependencies management (manual)








