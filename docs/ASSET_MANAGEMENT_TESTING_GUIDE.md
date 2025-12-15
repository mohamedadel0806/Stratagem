# Asset Management System - Testing Guide

## Post-Import User Flows to Test

After successfully importing assets, use this guide to test all available features and user flows.

---

## 1. Viewing and Browsing Assets

### 1.1 View Imported Assets List
**Flow:**
1. Navigate to **Assets → Physical Assets**
2. Verify imported assets appear in the list
3. Check pagination works correctly
4. Verify total count matches imported records

**What to Check:**
- ✅ All imported assets are visible
- ✅ Asset identifiers are correct
- ✅ Asset descriptions are displayed
- ✅ Asset types are shown correctly
- ✅ Pagination controls work
- ✅ Total count is accurate

### 1.2 Search Assets
**Flow:**
1. Use the search bar to search by:
   - Asset identifier (e.g., "PHY-APP-001")
   - Asset description (e.g., "Application Server")
   - Manufacturer (e.g., "IBM")
   - Location (e.g., "Data Center")

**What to Check:**
- ✅ Search returns relevant results
- ✅ Search is case-insensitive
- ✅ Partial matches work
- ✅ Search clears properly

### 1.3 Filter Assets
**Flow:**
1. Apply filters:
   - By Asset Type (server, workstation, network_device, etc.)
   - By Criticality Level (critical, high, medium, low)
   - By Connectivity Status (connected, disconnected, unknown)
   - By Business Unit
   - By Department
   - By Location

**What to Check:**
- ✅ Filters apply correctly
- ✅ Multiple filters can be combined
- ✅ Filter state persists
- ✅ Clear filters button works

### 1.4 Sort Assets
**Flow:**
1. Click column headers to sort by:
   - Asset Identifier
   - Asset Description
   - Asset Type
   - Criticality Level
   - Last Updated Date

**What to Check:**
- ✅ Ascending/descending sort works
- ✅ Sort indicator shows correctly
- ✅ Sort persists across pages

---

## 2. Asset Details and Viewing

### 2.1 View Asset Details
**Flow:**
1. Click on an asset from the list
2. View the asset detail page

**What to Check:**
- ✅ All asset fields are displayed
- ✅ IP addresses show as list/array
- ✅ MAC addresses show as list/array
- ✅ Dates are formatted correctly
- ✅ Boolean fields (PII, PHI, Financial Data) show correctly
- ✅ Owner information displays (if assigned)
- ✅ Business Unit and Department show correctly

### 2.2 View Asset Audit Trail
**Flow:**
1. Open an asset detail page
2. Navigate to "Audit Trail" or "History" tab
3. Review change history

**What to Check:**
- ✅ Import action is logged
- ✅ Timestamps are correct
- ✅ User who imported is recorded
- ✅ Changes show old/new values
- ✅ Audit entries are chronological

---

## 3. Editing and Updating Assets

### 3.1 Edit Single Asset
**Flow:**
1. Open an asset detail page
2. Click "Edit" button
3. Modify fields:
   - Update asset description
   - Change criticality level
   - Update location information
   - Modify IP addresses
   - Change owner
4. Save changes

**What to Check:**
- ✅ Form pre-populates with current values
- ✅ Validation works (required fields)
- ✅ Enum fields show correct options
- ✅ Date pickers work correctly
- ✅ Array fields (IP/MAC) can be edited
- ✅ Changes save successfully
- ✅ Success message appears
- ✅ Updated values reflect in list view

### 3.2 Update Asset Owner
**Flow:**
1. Open asset detail page
2. Click "Assign Owner" or edit owner field
3. Select a user from dropdown
4. Save

**What to Check:**
- ✅ Owner dropdown shows available users
- ✅ Owner assignment saves correctly
- ✅ Owner appears in asset list
- ✅ Owner filter works

### 3.3 Update Criticality Level
**Flow:**
1. Edit an asset
2. Change criticality level (e.g., medium → critical)
3. Save

**What to Check:**
- ✅ Criticality updates correctly
- ✅ Criticality filter reflects change
- ✅ Dashboard metrics update

---

## 4. Bulk Operations

### 4.1 Bulk Select Assets
**Flow:**
1. Go to Physical Assets list
2. Use checkboxes to select multiple assets
3. Verify bulk operations bar appears

**What to Check:**
- ✅ Checkboxes work correctly
- ✅ "Select All" works
- ✅ Bulk operations bar shows selected count
- ✅ Deselect works

### 4.2 Bulk Update Owner
**Flow:**
1. Select multiple assets
2. Click "Bulk Update" → "Update Owner"
3. Select new owner
4. Confirm action

**What to Check:**
- ✅ All selected assets update
- ✅ Success message shows count
- ✅ Changes reflect in list
- ✅ Audit trail records bulk update

### 4.3 Bulk Update Criticality
**Flow:**
1. Select multiple assets
2. Click "Bulk Update" → "Update Criticality"
3. Select new criticality level
4. Confirm

**What to Check:**
- ✅ All selected assets update
- ✅ Success message appears
- ✅ Changes are visible immediately

### 4.4 Bulk Update Compliance Tag
**Flow:**
1. Select multiple assets
2. Click "Bulk Update" → "Update Compliance Tag"
3. Select compliance requirement
4. Confirm

**What to Check:**
- ✅ Compliance tags update correctly
- ✅ Multiple assets update simultaneously

### 4.5 Bulk Delete Assets
**Flow:**
1. Select multiple assets
2. Click "Bulk Delete"
3. Confirm deletion in dialog

**What to Check:**
- ✅ Confirmation dialog appears
- ✅ Warning message is clear
- ✅ Assets are soft-deleted (not permanently removed)
- ✅ Deleted assets disappear from list
- ✅ Success message shows count
- ✅ Audit trail records deletion

---

## 5. Export Functionality

### 5.1 Export to CSV
**Flow:**
1. Apply filters (optional)
2. Click "Export" → "CSV"
3. Select fields to export
4. Download file

**What to Check:**
- ✅ CSV file downloads
- ✅ Selected fields are included
- ✅ Data is formatted correctly
- ✅ Filtered results export correctly
- ✅ All imported assets export (if no filters)

### 5.2 Export to Excel
**Flow:**
1. Click "Export" → "Excel"
2. Select fields to export
3. Download file

**What to Check:**
- ✅ Excel file downloads (.xlsx)
- ✅ File opens correctly in Excel
- ✅ All columns are present
- ✅ Data formatting is preserved
- ✅ Dates are formatted correctly

### 5.3 Export to PDF
**Flow:**
1. Click "Export" → "PDF"
2. Select fields to export
3. Download file

**What to Check:**
- ✅ PDF file downloads
- ✅ PDF is readable
- ✅ All selected fields are included
- ✅ Formatting is correct

### 5.4 Export with Filters
**Flow:**
1. Apply filters (e.g., criticality = "critical")
2. Export to CSV/Excel
3. Verify only filtered assets export

**What to Check:**
- ✅ Only filtered assets are exported
- ✅ Filter criteria are preserved
- ✅ Export count matches filtered count

---

## 6. Relationship and Dependency Management

### 6.1 View Asset Dependencies
**Flow:**
1. Open an asset detail page
2. Navigate to "Dependencies" tab
3. View outgoing dependencies

**What to Check:**
- ✅ Dependencies list displays
- ✅ Dependency types show correctly
- ✅ Related assets are linked

### 6.2 Add Asset Dependency
**Flow:**
1. Open asset detail page
2. Go to "Dependencies" tab
3. Click "Add Dependency"
4. Select dependency type
5. Search and select related asset
6. Save

**What to Check:**
- ✅ Dependency is created
- ✅ Dependency appears in list
- ✅ Relationship is bidirectional
- ✅ Dependency type is correct

### 6.3 View Dependency Graph
**Flow:**
1. Open asset detail page
2. Click "View Dependency Graph"
3. Explore the visual graph

**What to Check:**
- ✅ Graph renders correctly
- ✅ Nodes represent assets
- ✅ Edges show relationships
- ✅ Graph is interactive (zoom, pan)
- ✅ Clicking nodes shows asset details
- ✅ Filter options work

### 6.4 Export Dependency Graph
**Flow:**
1. View dependency graph
2. Click "Export Graph"
3. Choose format (PNG, SVG, PDF)

**What to Check:**
- ✅ Graph exports correctly
- ✅ Image quality is good
- ✅ All relationships are visible

---

## 7. Dashboard and Analytics

### 7.1 View Asset Dashboard
**Flow:**
1. Navigate to Dashboard
2. View asset-related widgets

**What to Check:**
- ✅ Asset count by type chart
- ✅ Asset count by criticality chart
- ✅ Assets without owners count
- ✅ Recent changes list
- ✅ Assets by compliance scope
- ✅ Assets with outdated security tests
- ✅ Charts are interactive
- ✅ Data refreshes correctly

### 7.2 Filter Dashboard by Date Range
**Flow:**
1. On dashboard, select date range
2. View updated metrics

**What to Check:**
- ✅ Metrics update based on date range
- ✅ Charts reflect filtered data
- ✅ Date picker works correctly

---

## 8. Import History and Management

### 8.1 View Import History
**Flow:**
1. Navigate to **Assets → Import History**
2. View list of import operations

**What to Check:**
- ✅ Import history shows all imports
- ✅ File names are displayed
- ✅ Import status is shown (completed, failed, partial)
- ✅ Success/failure counts are visible
- ✅ Import date/time is shown
- ✅ Imported by user is displayed

### 8.2 View Import Details
**Flow:**
1. Click on an import log entry
2. View import details

**What to Check:**
- ✅ Import summary shows correctly
- ✅ Field mapping is displayed
- ✅ Error report is accessible (if any errors)
- ✅ Successful imports count
- ✅ Failed imports count
- ✅ Error details are clear

### 8.3 Download Error Report
**Flow:**
1. Open an import with errors
2. Click "Download Error Report"
3. Review error details

**What to Check:**
- ✅ Error report downloads
- ✅ Errors are clearly explained
- ✅ Row numbers are correct
- ✅ Error messages are helpful

---

## 9. Advanced Features

### 9.1 Global Asset Search
**Flow:**
1. Use global search (top navigation)
2. Search across all asset types
3. View results

**What to Check:**
- ✅ Search finds assets across types
- ✅ Results are grouped by asset type
- ✅ Search is fast
- ✅ Results are relevant

### 9.2 Custom Field Configuration
**Flow:**
1. Navigate to **Settings → Asset Field Configuration**
2. View custom fields
3. Create a new custom field (if admin)
4. Apply to asset type

**What to Check:**
- ✅ Custom fields appear in forms
- ✅ Field validation works
- ✅ Custom fields save correctly
- ✅ Custom fields appear in exports

### 9.3 Integration Management
**Flow:**
1. Navigate to **Settings → Integrations**
2. View configured integrations
3. Test an integration connection
4. Trigger a sync (if configured)

**What to Check:**
- ✅ Integration list displays
- ✅ Connection test works
- ✅ Sync history shows
- ✅ Sync status is accurate

---

## 10. Data Validation and Edge Cases

### 10.1 Test Required Fields
**Flow:**
1. Try to create/edit asset without required fields
2. Verify validation errors

**What to Check:**
- ✅ Required field validation works
- ✅ Error messages are clear
- ✅ Form highlights missing fields

### 10.2 Test Duplicate Identifiers
**Flow:**
1. Try to create asset with existing identifier
2. Verify error handling

**What to Check:**
- ✅ Duplicate identifier is rejected
- ✅ Error message is clear
- ✅ Suggests alternative identifier

### 10.3 Test Invalid Data Formats
**Flow:**
1. Enter invalid dates
2. Enter invalid IP addresses
3. Enter invalid MAC addresses
4. Verify validation

**What to Check:**
- ✅ Date validation works
- ✅ IP address format validation
- ✅ MAC address format validation
- ✅ Error messages are helpful

### 10.4 Test Large Data Sets
**Flow:**
1. Import large file (100+ assets)
2. Verify performance
3. Test pagination with large dataset

**What to Check:**
- ✅ Import completes successfully
- ✅ List view loads quickly
- ✅ Pagination works smoothly
- ✅ Search is responsive

---

## 11. User Permissions and Access Control

### 11.1 Test Role-Based Access
**Flow:**
1. Login as different user roles
2. Verify access to asset features

**What to Check:**
- ✅ Admin users can access all features
- ✅ Regular users can view/edit assets
- ✅ Restricted users have limited access
- ✅ Unauthorized actions are blocked

### 11.2 Test Asset Ownership
**Flow:**
1. Assign asset to specific user
2. Login as that user
3. Verify they can see/edit their assets

**What to Check:**
- ✅ Users see their assigned assets
- ✅ Ownership filter works
- ✅ Owner can edit their assets

---

## 12. Performance and Usability

### 12.1 Test Page Load Times
**Flow:**
1. Navigate between pages
2. Monitor load times

**What to Check:**
- ✅ Pages load quickly (< 2 seconds)
- ✅ Large lists paginate correctly
- ✅ No unnecessary data loading

### 12.2 Test Responsive Design
**Flow:**
1. Resize browser window
2. Test on mobile/tablet viewport

**What to Check:**
- ✅ Layout adapts to screen size
- ✅ Tables are scrollable on mobile
- ✅ Forms are usable on small screens
- ✅ Buttons are accessible

### 12.3 Test Browser Compatibility
**Flow:**
1. Test in Chrome, Firefox, Safari, Edge

**What to Check:**
- ✅ All features work across browsers
- ✅ No console errors
- ✅ Styling is consistent

---

## Testing Checklist Summary

### Critical Flows (Must Test)
- [ ] View imported assets list
- [ ] Search and filter assets
- [ ] View asset details
- [ ] Edit single asset
- [ ] Bulk update operations
- [ ] Export to CSV/Excel
- [ ] View import history
- [ ] View dashboard metrics

### Important Flows (Should Test)
- [ ] Asset dependency management
- [ ] Dependency graph visualization
- [ ] Global asset search
- [ ] Audit trail viewing
- [ ] Custom field configuration
- [ ] Integration management

### Nice to Have (Optional)
- [ ] PDF export
- [ ] Advanced filtering
- [ ] Performance with large datasets
- [ ] Mobile responsiveness
- [ ] Browser compatibility

---

## Common Issues to Watch For

1. **Data Not Appearing**: Check if filters are applied, verify import was successful
2. **Slow Performance**: Check database indexes, verify pagination is working
3. **Export Errors**: Verify file permissions, check data format
4. **Permission Errors**: Check user role, verify RBAC configuration
5. **Validation Errors**: Check required fields, verify data format
6. **Missing Relationships**: Verify dependencies were created correctly

---

## Next Steps After Testing

1. **Document Issues**: Record any bugs or issues found
2. **Performance Metrics**: Note any slow operations
3. **User Feedback**: Gather feedback on usability
4. **Data Quality**: Verify imported data accuracy
5. **Integration Testing**: Test with real external systems

---

## Support and Resources

- **API Documentation**: `/api/docs` (Swagger)
- **Import Guide**: `docs/ASSET_IMPORT_FLOW_GUIDE.md`
- **Architecture**: `docs/ASSET_MANAGEMENT_QUICK_REFERENCE.md`
- **Sample Files**: `docs/sample-physical-assets-import*.csv`

