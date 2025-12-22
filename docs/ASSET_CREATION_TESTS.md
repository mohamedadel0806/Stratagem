# Asset Creation Tests Documentation

## Overview

Comprehensive test suite for asset creation functionality across all asset types. Tests cover backend services, frontend API transformations, form components, and end-to-end user flows.

## Test Structure

### Backend Unit Tests

#### Location: `backend/test/asset/`

**Files Created:**
1. `physical-asset.service.spec.ts` - Tests for PhysicalAssetService.create()
2. `information-asset.service.spec.ts` - Tests for InformationAssetService.create()
3. `software-asset.service.spec.ts` - Tests for SoftwareAssetService.create()
4. `supplier.service.spec.ts` - Tests for SupplierService.create()

**Test Coverage:**
- ✅ Successful asset creation with all required fields
- ✅ Auto-generation of unique identifiers
- ✅ Duplicate identifier detection (ConflictException)
- ✅ Date field handling (purchaseDate, warrantyExpiry, etc.)
- ✅ Array field handling (ipAddresses, macAddresses, complianceRequirements)
- ✅ JSONB object handling (vendorContact, primaryContact)
- ✅ Audit logging verification
- ✅ Optional field handling

**Key Test Cases:**

**Physical Assets:**
- Create with auto-generated unique identifier
- Create with provided unique identifier
- Reject duplicate identifiers
- Handle date fields (purchaseDate, warrantyExpiry)
- Handle array fields (ipAddresses, macAddresses)

**Information Assets:**
- Create with required fields (name, informationType, classificationLevel)
- Handle date fields (classificationDate, reclassificationDate)
- Handle optional fields (businessPurpose, storageLocation, etc.)

**Software Assets:**
- Create with vendor information
- Handle vendorContact object construction
- Handle license fields (licenseCount, licenseExpiry)

**Suppliers:**
- Create with provided unique identifier
- Auto-generate unique identifier if not provided
- Reject duplicate identifiers
- Handle primaryContact object
- Handle goodsServicesType array

### Frontend Unit Tests

#### Location: `frontend/src/lib/api/__tests__/`

**File Created:**
- `assets-transformations.test.ts` - Tests for API transformation functions

**Test Coverage:**
- ✅ Field name mapping (frontend → backend)
- ✅ UUID validation
- ✅ Array field conversions
- ✅ Contact object construction
- ✅ Date field transformations

**Key Test Cases:**
- Physical Asset: warrantyExpiryDate → warrantyExpiry mapping
- Information Asset: assetName → name, dataClassification → classificationLevel
- Software Asset: version → versionNumber, vendor contact object construction
- Business Application: url → accessUrl, dataTypesProcessed → dataProcessed array
- Supplier: uniqueIdentifier auto-generation, contact object construction

#### Location: `frontend/src/components/forms/__tests__/`

**File Created:**
- `information-asset-form.test.tsx` - Tests for InformationAssetForm component

**Test Coverage:**
- ✅ Form rendering with all required fields
- ✅ informationType field presence and validation
- ✅ Form validation (required fields)
- ✅ Form submission with correct data transformation
- ✅ Update mode handling
- ✅ Field mapping verification

**Key Test Cases:**
- Render all required fields including informationType
- Show validation error for missing informationType
- Submit form with correct field transformations
- Handle update mode with pre-filled data

### End-to-End Tests

#### Location: `frontend/e2e/assets/`

**File Created:**
- `create-assets.spec.ts` - E2E tests for asset creation flows

**Test Coverage:**
- ✅ Physical asset creation
- ✅ Information asset creation
- ✅ Software asset creation
- ✅ Business application creation
- ✅ Supplier creation
- ✅ Validation error handling
- ✅ Auto-generation of unique identifiers

**Key Test Cases:**

**Physical Assets:**
- Navigate to physical assets page
- Click "Add New Asset"
- Fill form and submit
- Verify asset appears in list

**Information Assets:**
- Create new information asset with all required fields
- Verify informationType field is present
- Test validation error if informationType is missing
- Verify asset appears in list after creation

**Software Assets:**
- Create with software name, vendor, and version
- Verify successful creation

**Business Applications:**
- Create with application name, vendor, and URL
- Verify successful creation

**Suppliers:**
- Create with supplier name and contact information
- Verify uniqueIdentifier auto-generation
- Verify successful creation

## Running the Tests

### Backend Tests

```bash
cd backend
npm test -- asset
```

Run specific test file:
```bash
npm test -- physical-asset.service.spec.ts
npm test -- information-asset.service.spec.ts
npm test -- software-asset.service.spec.ts
npm test -- supplier.service.spec.ts
```

### Frontend Unit Tests

```bash
cd frontend
npm test -- assets-transformations
npm test -- information-asset-form
```

### E2E Tests

```bash
cd frontend
npx playwright test e2e/assets/create-assets.spec.ts
```

Run all E2E tests:
```bash
npx playwright test
```

## Test Coverage Goals

### Backend Services
- **Target**: 80%+ coverage for create() methods
- **Focus Areas**:
  - Field validation
  - Unique identifier generation
  - Date/array/object field handling
  - Error handling (duplicates, validation)

### Frontend API Transformations
- **Target**: 100% coverage for transformation functions
- **Focus Areas**:
  - Field name mappings
  - Data type conversions
  - Object/array constructions
  - UUID validations

### Form Components
- **Target**: 70%+ coverage for form logic
- **Focus Areas**:
  - Form validation
  - Field rendering
  - Submission handling
  - Data transformation

### E2E Tests
- **Target**: Critical user flows covered
- **Focus Areas**:
  - Happy path for each asset type
  - Validation error scenarios
  - Auto-generation features

## Test Data Patterns

### Physical Assets
```typescript
{
  assetDescription: 'Test Server',
  assetType: 'server',
  criticalityLevel: 'high',
  connectivityStatus: 'connected',
  networkApprovalStatus: 'approved',
}
```

### Information Assets
```typescript
{
  name: 'Customer Database',
  informationType: 'Customer Records',
  classificationLevel: 'confidential',
  criticalityLevel: 'high',
}
```

### Software Assets
```typescript
{
  name: 'Microsoft Office',
  versionNumber: '2021',
  vendorName: 'Microsoft',
  criticalityLevel: 'high',
}
```

### Suppliers
```typescript
{
  name: 'ABC Corp',
  uniqueIdentifier: 'SUP-001',
}
```

## Common Test Patterns

### Mock Setup
```typescript
const mockRepository = {
  create: jest.fn(),
  save: jest.fn(),
  findOne: jest.fn(),
  find: jest.fn(),
};
```

### Service Test Structure
```typescript
describe('ServiceName', () => {
  describe('create', () => {
    it('should create successfully', async () => {
      // Arrange
      // Act
      // Assert
    });
  });
});
```

### Form Test Structure
```typescript
describe('FormName', () => {
  describe('Form Rendering', () => {
    it('should render required fields', () => {});
  });
  
  describe('Form Validation', () => {
    it('should show validation errors', () => {});
  });
  
  describe('Form Submission', () => {
    it('should submit with correct data', () => {});
  });
});
```

## Maintenance Notes

1. **When adding new asset types**: Create corresponding service test, form test, and E2E test
2. **When changing field mappings**: Update transformation tests
3. **When adding validation**: Add validation test cases
4. **When changing API contracts**: Update all affected tests

## Known Issues / Future Improvements

1. **Business Application Service Test**: Not yet created (should be added)
2. **Form Tests for Other Asset Types**: Only InformationAssetForm has tests (should add for others)
3. **Integration Tests**: Could add integration tests that test full stack
4. **Performance Tests**: Could add tests for bulk creation scenarios

## Related Documentation

- `ASSET_FORM_FIXES.md` - Field mapping fixes documentation
- `ASSET_IMPORT_ANALYSIS.md` - Import functionality documentation
- `ASSET_MANAGEMENT_TEST_SCENARIOS.md` - Manual test scenarios







