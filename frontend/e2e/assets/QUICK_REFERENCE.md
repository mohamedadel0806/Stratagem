# Assets E2E Test Quick Reference

## Import Pattern

```typescript
import { test, expect } from '../fixtures/auth-fixed';
import { TEST_TIMEOUTS, ASSET_STATUS, ASSET_CRITICALITY } from '../constants';
import { PhysicalAssetsPage, AssetDetailsPage } from '../pages/assets-page';
import { generateUniqueIdentifier, selectTabDropdown } from '../form-helpers';
```

## POM Classes Available

```typescript
// Asset list pages
PhysicalAssetsPage
InformationAssetsPage
SoftwareAssetsPage
BusinessApplicationsPage
SuppliersPage

// Asset details page
AssetDetailsPage
ControlsTabPage
RisksTabPage
DependenciesTabPage
```

## Test Constants Available

```typescript
ASSET_TYPES.PHYSICAL
ASSET_TYPES.INFORMATION
ASSET_TYPES.SOFTWARE
ASSET_TYPES.BUSINESS_APPLICATION
ASSET_TYPES.SUPPLIER

ASSET_STATUS.ACTIVE
ASSET_STATUS.DRAFT
ASSET_CRITICALITY.HIGH

APPLICATION_TYPE.WEB_APPLICATION
HOSTING_LOCATION.CLOUD
```

## Helper Functions Available

```typescript
// Form helpers
generateUniqueIdentifier('PREFIX')
getTodayDate()
getFutureDate(days)

// Field helpers
fillTabField(page, fieldName, value)
fillTabTextarea(page, fieldName, value)
selectTabDropdown(page, fieldName, optionText)
selectOptionByRole(page, name, option)
clickCheckbox(page, label)

// Tab helpers
fillBasicInfoTab(page, data)
fillTechnicalTab(page, data)
fillComplianceTab(page, data)

// Navigation helpers
clickTab(page, tabName)
waitForDialogToClose(page)
selectOwner(page)
selectBusinessUnit(page)
```

## Test Template

```typescript
import { test, expect } from '../fixtures/auth-fixed';
import { TEST_TIMEOUTS } from '../constants';
import { PhysicalAssetsPage } from '../pages/assets-page';
import { generateUniqueIdentifier } from '../form-helpers';

test.describe('My Test Suite', () => {
  let assetsPage: PhysicalAssetsPage;

  test.beforeEach(async ({ authenticatedPage }) => {
    assetsPage = new PhysicalAssetsPage(authenticatedPage);
    await assetsPage.goto();
  });

  test('should create asset', async ({ authenticatedPage }) => {
    const uniqueId = generateUniqueIdentifier('PREFIX');
    await assetsPage.createPhysicalAsset(uniqueId, 'Description');

    await expect(authenticatedPage.getByTestId('assets-physical-list'))
      .toContainText('Description', { timeout: TEST_TIMEOUTS.VERIFICATION });
  });
});
```

## Common Patterns

### Fill form with dropdown
```typescript
await selectTabDropdown(page, 'Status', ASSET_STATUS.ACTIVE);
```

### Navigate to tab
```typescript
await assetPage.clickTab('Dependencies');
```

### Check for element
```typescript
expect(await authenticatedPage.getByText('something').isVisible()).toBe(true);
```

### Wait for dialog to close
```typescript
await waitForDialogToClose(authenticatedPage);
```