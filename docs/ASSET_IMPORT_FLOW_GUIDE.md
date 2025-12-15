# Asset Import Flow - Complete Guide

## Overview

This guide explains the complete flow of importing assets from CSV or Excel files, from file upload to final import results.

---

## Sample CSV File

A sample CSV file is provided at: `docs/sample-physical-assets-import.csv`

### Sample File Structure

The sample includes:
- **10 sample physical assets** with realistic data
- **All common fields** that can be imported
- **Various asset types**: servers, workstations, network devices, mobile devices, IoT devices, printers, storage devices
- **Different criticality levels**: critical, high, medium, low
- **Mixed connectivity statuses**: connected, disconnected, unknown
- **IP and MAC addresses** (comma-separated for multiple)
- **Date fields** in ISO format (YYYY-MM-DD)
- **Boolean fields** (true/false, yes/no, 1/0)

### Required Fields

- **Asset Description** (required) - Name/description of the asset
- **Unique Identifier** (required) - Can be auto-generated if not provided, or use Serial Number/Asset Tag. If not included in CSV, system will auto-generate a unique identifier.

### Optional Fields

All other fields are optional and can be mapped or skipped during import.

---

## Complete Import Flow

### Step 1: Upload File

```
User Action:
1. Navigate to Assets → Physical Assets
2. Click "Import" button
3. Select CSV or Excel file
4. Click "Upload"
```

**What Happens:**
- File is uploaded to backend
- File type is detected (CSV or Excel)
- File is validated (not empty, correct format)
- File buffer is stored temporarily

**Backend:**
- `POST /assets/physical/import/preview`
- File is parsed (CSV or Excel)
- First 10 rows are extracted for preview
- Headers are identified

**Frontend:**
- `AssetImportWizard` component opens
- Step changes to "map" (field mapping)

---

### Step 2: Field Mapping

```
User Action:
1. Review detected columns from file
2. Map each CSV column to asset field
3. Use dropdown to select target field
4. Can skip columns by selecting "-- Skip Column --"
```

**What Happens:**
- System auto-maps common column names:
  - "Asset Description" → `assetDescription`
  - "Asset Type" → `assetType`
  - "Manufacturer" → `manufacturer`
  - "Serial Number" → `serialNumber`
  - "IP Address" → `ipAddresses`
  - etc.

**Field Mapping Options:**
- Asset Description * (required)
- Unique Identifier (auto-generated if not provided)
- Asset Type
- Manufacturer
- Model
- Serial Number
- Location
- Building
- Floor
- Room
- IP Addresses (comma-separated)
- MAC Addresses (comma-separated)
- Connectivity Status
- Business Unit
- Department
- Criticality Level
- Data Classification
- Contains PII (boolean)
- Contains PHI (boolean)
- Contains Financial Data (boolean)
- Purchase Date
- Warranty Expiry Date
- Vendor
- Notes

**Special Handling:**
- **Array Fields** (IP/MAC addresses, compliance tags): Comma or semicolon separated values are automatically split
- **Boolean Fields**: Accepts true/false, yes/no, 1/0, y/n
- **Enum Fields**: Case-insensitive, handles spaces/underscores
  - Asset Type: server, workstation, network_device, mobile_device, iot_device, printer, storage_device, other
  - Criticality: critical, high, medium, low
  - Connectivity: connected, disconnected, unknown
- **Date Fields**: Accepts various date formats, converts to ISO format (YYYY-MM-DD)

**Frontend:**
- Shows mapping interface with dropdowns
- Auto-mapping suggestions
- User can adjust mappings
- Click "Next" to proceed

---

### Step 3: Preview Data

```
User Action:
1. Review preview of first 10 rows
2. Check for data quality issues
3. Verify field mappings are correct
4. Click "Start Import" to proceed
```

**What Happens:**
- System shows preview of mapped data
- Displays how CSV columns map to asset fields
- Shows sample rows with mapped values
- Highlights any obvious errors

**Preview Display:**
- Table showing first 10 rows
- Mapped values displayed
- Column headers show target field names
- Row numbers for reference

**Frontend:**
- Preview table component
- Shows mapped data
- User can go back to adjust mappings
- Click "Start Import" to begin

---

### Step 4: Import Processing

```
User Action:
1. Click "Start Import"
2. Wait for import to complete
3. View progress indicator
```

**What Happens Backend:**

1. **Create Import Log**
   - Creates record in `import_logs` table
   - Status: `PROCESSING`
   - Stores field mapping
   - Records user who initiated import

2. **Parse File**
   - Reads entire file (not just preview)
   - Parses all rows
   - Applies field mapping to each row

3. **Process Each Row** (for each asset):
   ```
   For each row in file:
     a. Map CSV columns to asset fields using mapping
     b. Transform data:
        - Split arrays (IP/MAC addresses)
        - Parse booleans
        - Normalize enums
        - Parse dates
     c. Validate required fields:
        - assetDescription (required)
     d. Create asset via PhysicalAssetService
     e. Track success/failure
   ```

4. **Data Transformations:**
   - **IP/MAC Addresses**: `"192.168.1.1, 192.168.1.2"` → `["192.168.1.1", "192.168.1.2"]`
   - **Booleans**: `"yes"` → `true`, `"no"` → `false`
   - **Enums**: `"Critical"` → `"critical"`, `"Network Device"` → `"network_device"`
   - **Dates**: `"2023-01-15"` → ISO date string

5. **Error Handling:**
   - Missing required fields → Error logged
   - Invalid enum values → Error logged
   - Duplicate unique identifiers → Error logged
   - Database errors → Error logged
   - Row continues to next row on error

6. **Update Import Log:**
   - Total records processed
   - Successful imports count
   - Failed imports count
   - Error report (JSON with row numbers and errors)
   - Status: `COMPLETED`, `PARTIAL`, or `FAILED`
   - Completion timestamp

**Frontend:**
- Shows progress indicator
- Displays "Importing..." message
- Shows row count being processed
- User waits (cannot cancel during import)

---

### Step 5: Import Results

```
User Action:
1. Review import results
2. Check success/failure counts
3. View error details if any
4. Click "Done" to close wizard
```

**What Happens:**
- Import log is finalized
- Results are displayed to user
- Error report shows which rows failed and why

**Results Display:**
- ✅ **Total Records**: Number of rows in file
- ✅ **Successful**: Number of assets created
- ❌ **Failed**: Number of rows with errors
- 📋 **Error Details**: List of failed rows with error messages

**Error Report Format:**
```json
[
  {
    "row": 5,
    "errors": ["Asset description is required"]
  },
  {
    "row": 8,
    "errors": ["Invalid criticality level: 'very_high'"]
  }
]
```

**Status Meanings:**
- **COMPLETED**: All records imported successfully
- **PARTIAL**: Some records succeeded, some failed
- **FAILED**: No records were imported (all failed)

**Frontend:**
- Results summary card
- Success/failure counts
- Expandable error details
- "Done" button to close
- Option to download error report

---

## Backend API Endpoints

### 1. Preview Import
```
POST /assets/physical/import/preview
Content-Type: multipart/form-data
Body: { file: File }

Response:
{
  headers: string[],
  rows: Array<{
    rowNumber: number,
    data: Record<string, any>
  }>,
  totalRows: number
}
```

### 2. Execute Import
```
POST /assets/physical/import
Content-Type: multipart/form-data
Body: {
  file: File,
  fieldMapping: Record<string, string>
}

Response:
{
  importLogId: string,
  totalRecords: number,
  successfulImports: number,
  failedImports: number,
  errors: Array<{
    row: number,
    errors: string[]
  }>
}
```

### 3. Get Import History
```
GET /assets/physical/import/history?limit=20

Response: ImportLog[]
```

### 4. Get Import Log Details
```
GET /assets/physical/import/:id

Response: ImportLog (with error report)
```

---

## Data Validation Rules

### Required Fields
- **assetDescription**: Must be provided, max 200 characters

### Enum Values
- **assetType**: server, workstation, network_device, mobile_device, iot_device, printer, storage_device, other
- **criticalityLevel**: critical, high, medium, low
- **connectivityStatus**: connected, disconnected, unknown
- **networkApprovalStatus**: approved, pending, rejected, not_required

### Data Types
- **Strings**: Max length varies by field (typically 200 chars)
- **Arrays**: IP addresses, MAC addresses, compliance tags (comma/semicolon separated)
- **Booleans**: true/false, yes/no, 1/0, y/n (case-insensitive)
- **Dates**: Various formats accepted, converted to ISO (YYYY-MM-DD)
- **UUIDs**: For ownerId, businessUnitId, assetTypeId (if provided)

---

## Import Log Tracking

Every import creates a log entry in the database:

```typescript
{
  id: string (UUID)
  fileName: string
  fileType: 'csv' | 'excel'
  assetType: 'physical'
  status: 'processing' | 'completed' | 'partial' | 'failed'
  fieldMapping: Record<string, string> (JSON)
  totalRecords: number
  successfulImports: number
  failedImports: number
  errorReport: string (JSON)
  importedById: string (UUID)
  createdAt: Date
  completedAt: Date
}
```

**Use Cases:**
- Track import history
- Audit trail
- Debugging failed imports
- Reporting on import success rates

---

## Common Import Scenarios

### Scenario 1: Perfect Import
- All rows valid
- All required fields present
- No errors
- **Result**: Status = `COMPLETED`, all assets created

### Scenario 2: Partial Import
- Some rows have errors
- Some rows succeed
- **Result**: Status = `PARTIAL`, successful count < total, error report shows failed rows

### Scenario 3: Failed Import
- All rows have errors
- No assets created
- **Result**: Status = `FAILED`, successful count = 0, error report shows all errors

### Scenario 4: Large File Import
- 1000+ rows
- Takes longer to process
- Progress indicator shows status
- **Result**: Same as above, but processing time is longer

---

## Tips for Successful Imports

1. **Prepare Your Data:**
   - Ensure required fields are present
   - Use consistent enum values (case doesn't matter)
   - Format dates consistently (YYYY-MM-DD recommended)
   - Separate multiple IP/MAC addresses with commas

2. **Field Mapping:**
   - Review auto-mapping suggestions
   - Adjust mappings if column names don't match
   - Skip columns you don't want to import

3. **Preview Before Import:**
   - Always review the preview
   - Check data quality
   - Verify mappings are correct

4. **Handle Errors:**
   - Review error report after import
   - Fix data issues in source file
   - Re-import corrected rows

5. **Large Files:**
   - Consider splitting very large files (>5000 rows)
   - Monitor import progress
   - Check import history for status

---

## Troubleshooting

### Issue: "Failed to parse CSV"
- **Cause**: Invalid CSV format, encoding issues
- **Solution**: Ensure file is UTF-8 encoded, check CSV format

### Issue: "Asset description is required"
- **Cause**: Missing asset description in one or more rows
- **Solution**: Add asset description column or ensure it's mapped

### Issue: "Invalid enum value"
- **Cause**: Value doesn't match allowed enum values
- **Solution**: Check enum values in documentation, normalize data

### Issue: "Duplicate unique identifier"
- **Cause**: Multiple rows with same identifier
- **Solution**: Ensure unique identifiers are unique, or let system auto-generate

### Issue: Import hangs or times out
- **Cause**: Very large file or network issues
- **Solution**: Split file into smaller chunks, check network connection

---

## Example: Complete Import Session

1. **User uploads** `sample-physical-assets-import.csv` (10 rows)
2. **System previews** first 10 rows, shows all columns
3. **Auto-mapping** maps most columns correctly
4. **User reviews** preview, confirms mappings look good
5. **User clicks** "Start Import"
6. **System processes** all 10 rows:
   - Row 1: ✅ Success (Production Web Server)
   - Row 2: ✅ Success (Development Workstation)
   - Row 3: ✅ Success (Network Switch)
   - ... (all 10 rows succeed)
7. **System shows** results:
   - Total: 10
   - Successful: 10
   - Failed: 0
   - Status: COMPLETED
8. **User clicks** "Done"
9. **Assets appear** in Physical Assets list
10. **Import log** saved for audit trail

---

## Next Steps After Import

1. **Verify Assets:**
   - Navigate to Physical Assets page
   - Check that imported assets appear
   - Verify data is correct

2. **Review Import History:**
   - Check import log for details
   - Download error report if needed
   - Track import success rate

3. **Update Assets:**
   - Edit any assets that need corrections
   - Add missing information
   - Assign owners if needed

4. **Set Up Dependencies:**
   - Create relationships between assets
   - Link assets to applications
   - Configure compliance tags

---

## File Format Examples

### CSV Format
```csv
Asset Description,Asset Type,Manufacturer,Model,Serial Number,Location,IP Addresses,MAC Addresses,Criticality Level
Server 01,server,Dell,PowerEdge R740,SN-001,Data Center,192.168.1.10,00:1B:44:11:3A:B7,critical
Workstation 01,workstation,HP,EliteDesk 800,SN-002,Office,192.168.2.50,00:50:56:12:34:56,medium
```

### Excel Format
- Same structure as CSV
- First sheet is used
- Headers in first row
- Data in subsequent rows
- Supports .xlsx and .xls formats

---

## Summary

The import flow is a **5-step wizard**:
1. **Upload** → Select and upload file
2. **Map** → Map CSV columns to asset fields
3. **Preview** → Review first 10 rows
4. **Import** → Process all rows
5. **Results** → View success/failure summary

**Key Features:**
- ✅ Supports CSV and Excel formats
- ✅ Flexible field mapping
- ✅ Data validation and error reporting
- ✅ Progress tracking
- ✅ Import history and audit trail
- ✅ Handles arrays, booleans, enums, dates automatically

**Ready to test?** Use the sample CSV file: `docs/sample-physical-assets-import.csv`

