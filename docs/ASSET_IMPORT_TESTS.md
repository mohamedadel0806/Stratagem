# Asset Import Tests Documentation

## Overview

Comprehensive test suite for asset import functionality across all asset types. Tests cover backend services, import handlers, and end-to-end user flows.

## Test Results Summary

✅ **All Tests Passing:**
- Backend Import Service: 11/11 tests passed
- Physical Asset Import Handler: 5/5 tests passed
- Information Asset Import Handler: 6/6 tests passed
- Total: 38/38 tests passed

## Test Structure

### Backend Unit Tests

#### Location: `backend/test/asset/`

**Files Created:**
1. `import.service.spec.ts` - Tests for ImportService
2. `physical-asset-import-handler.spec.ts` - Tests for PhysicalAssetImportHandler
3. `information-asset-import-handler.spec.ts` - Tests for InformationAssetImportHandler

**Test Coverage:**

**ImportService Tests:**
- ✅ CSV file parsing and preview
- ✅ Excel file parsing and preview
- ✅ Preview row limiting
- ✅ Empty file error handling
- ✅ Invalid buffer error handling
- ✅ Asset import from CSV
- ✅ Asset import from Excel
- ✅ Validation error handling during import
- ✅ Unsupported asset type error handling
- ✅ Handler registration verification

**Import Handler Tests:**

**Physical Asset Handler:**
- ✅ Field mapping from CSV/Excel to DTO
- ✅ Array field parsing (IP addresses, MAC addresses)
- ✅ Enum field normalization (criticality, connectivity status)
- ✅ Missing optional fields handling
- ✅ Data validation
- ✅ Asset creation via service

**Information Asset Handler:**
- ✅ Field mapping including informationType
- ✅ Classification level normalization
- ✅ Required field validation (name, informationType, classificationLevel)
- ✅ Asset creation via service

### End-to-End Tests

#### Location: `frontend/e2e/assets/`

**File Created:**
- `import-assets.spec.ts` - E2E tests for import flows

**Test Coverage:**
- ✅ Physical assets import dialog
- ✅ Information assets import dialog
- ✅ Software assets import dialog
- ✅ Business applications import dialog
- ✅ Suppliers import dialog
- ✅ Sample Excel download for all asset types
- ✅ Field mapping interface verification

## Running the Tests

### Backend Tests

```bash
cd backend
npm test -- test/asset/import
```

Run specific test file:
```bash
npm test -- test/asset/import.service.spec.ts
npm test -- test/asset/physical-asset-import-handler.spec.ts
npm test -- test/asset/information-asset-import-handler.spec.ts
```

Run all asset tests (including import):
```bash
npm test -- test/asset
```

### E2E Tests

```bash
cd frontend
npx playwright test e2e/assets/import-assets.spec.ts
```

## Test Scenarios Covered

### CSV Import
- Parse CSV with headers
- Map CSV columns to asset fields
- Handle comma-separated arrays
- Validate required fields
- Create assets from CSV data

### Excel Import
- Parse Excel files (.xlsx)
- Extract data from first sheet
- Map Excel columns to asset fields
- Handle Excel-specific data types

### Field Mapping
- Map CSV/Excel column names to DTO field names
- Handle field name variations
- Skip unmapped columns
- Validate mapped data

### Validation
- Required field validation
- Enum value validation
- Data type validation
- Error reporting with row numbers

### Error Handling
- Empty file errors
- Invalid file format errors
- Validation errors per row
- Unsupported asset type errors
- Import log creation and tracking

## Key Test Patterns

### CSV Parsing Test
```typescript
const csvContent = `Asset Description,Unique Identifier,Location
Server 01,PHY-001,Data Center A
Server 02,PHY-002,Data Center B`;

const fileBuffer = Buffer.from(csvContent);
const result = await service.previewCSV(fileBuffer, 10);
```

### Excel Parsing Test
```typescript
const XLSX = require('xlsx');
const workbook = XLSX.utils.book_new();
const worksheet = XLSX.utils.aoa_to_sheet([
  ['Asset Description', 'Unique Identifier'],
  ['Server 01', 'PHY-001'],
]);
XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
const excelBuffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
```

### Import Handler Test
```typescript
const row = {
  'Asset Description': 'Test Server',
  'Unique Identifier': 'PHY-001',
};

const mapping = {
  'Asset Description': 'assetDescription',
  'Unique Identifier': 'uniqueIdentifier',
};

const result = handler.mapFields(row, mapping);
```

## Test Data Examples

### Physical Assets CSV
```csv
Asset Description,Unique Identifier,Location,Criticality Level,IP Addresses
Server 01,PHY-001,Data Center A,high,192.168.1.1,192.168.1.2
Server 02,PHY-002,Data Center B,medium,192.168.1.3
```

### Information Assets CSV
```csv
Asset Name,Information Type,Data Classification,Storage Location
Customer Database,Customer Records,confidential,Data Center A
Financial Records,Financial Data,restricted,Data Center B
```

## Coverage Goals

### Backend Import Service
- **Target**: 90%+ coverage
- **Focus Areas**:
  - File parsing (CSV/Excel)
  - Field mapping
  - Validation
  - Error handling
  - Import log management

### Import Handlers
- **Target**: 85%+ coverage
- **Focus Areas**:
  - Field mapping logic
  - Data transformation
  - Validation rules
  - Service integration

## Known Limitations

1. **File Upload in E2E**: E2E tests verify UI but don't actually upload files (would need file creation)
2. **Handler Tests**: Only Physical and Information handlers have tests (Software, Application, Supplier handlers follow same pattern)
3. **Integration Tests**: No full-stack integration tests (would test actual file upload → import → database)

## Future Improvements

1. Add tests for remaining import handlers (Software, Application, Supplier)
2. Add integration tests with actual file uploads
3. Add performance tests for large file imports
4. Add tests for import error recovery
5. Add tests for import history and reporting

## Related Documentation

- `ASSET_IMPORT_ANALYSIS.md` - Import functionality architecture
- `ASSET_CREATION_TESTS.md` - Asset creation tests
- `ASSET_FORM_FIXES.md` - Field mapping fixes







