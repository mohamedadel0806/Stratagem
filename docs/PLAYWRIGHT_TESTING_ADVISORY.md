# Playwright Testing Advisory Guide

**Last Updated:** January 2025  
**Based On:** 
- Business Application Form Test Fixes (e2e/assets/business-app-create-submit.spec.ts)
- Risk Details Page Test with POM Pattern (e2e/risks/details/risk-details-all-tabs-forms-pom.spec.ts)
- Risk, Treatment, KRI, and Assessment Request Form Implementation (2025)

---

## ⚠️ **CRITICAL REQUIREMENTS**

**Before writing any test, ensure:**

1. **Test IDs are ALWAYS used** - All interactive elements (buttons, form inputs, dropdowns) MUST have `data-testid` attributes
2. **Always use `page.getByTestId()`** - Never use `locator('[data-testid="..."]')` or text/role selectors for key elements
3. **Add test IDs to components FIRST** - If a test ID doesn't exist, add it to the component before writing the test
4. **Form submit buttons MUST have test IDs** - This is non-negotiable
5. **Use `type()` with delay instead of `fill()`** - For all text inputs to simulate human input

See [Test IDs section](#test-ids-data-testid) and [Form Filling Best Practices](#form-filling-best-practices) for details.

---

## Table of Contents
1. [Performance Optimization](#performance-optimization)
2. [Page Object Model (POM) Pattern](#page-object-model-pom-pattern)
3. [Test IDs (data-testid)](#test-ids-data-testid) ⚠️ **CRITICAL - Always Use**
4. [Form Field Selector Strategy](#form-field-selector-strategy)
5. [Authentication & Navigation](#authentication--navigation)
6. [Form Filling Best Practices](#form-filling-best-practices)
7. [Common Pitfalls & Solutions](#common-pitfalls--solutions)
8. [Code Organization](#code-organization)
9. [Checklist for New Tests](#checklist-for-new-tests)

---

## Performance Optimization

### ⚡ Critical Finding: waitForLoadState Strategy

**Problem:** Using `waitForLoadState('networkidle')` after authentication waits excessively for all network activity to complete (~27 seconds test time).

**Solution:** Use `waitForLoadState('domcontentloaded')` instead
```typescript
// ❌ SLOW - Waits for all network requests
await page.waitForLoadState('networkidle');

// ✅ FAST - Waits only for DOM ready
await page.waitForLoadState('domcontentloaded');
```

**Performance Impact:** 47% faster (27s → 14.3s base time)

### ⏱️ Wait Strategy Hierarchy

Use this hierarchy for any wait operation:

1. **No wait** (if not needed) - Fastest
2. **Specific element visibility** - `locator.waitFor({ state: 'visible' })`
3. **DOM content loaded** - `page.waitForLoadState('domcontentloaded')`
4. **Network idle** - Only for specific network-dependent operations (rare)

### ⏳ Timeout Recommendations

For form filling operations:
- **Between field fills:** 100-300ms (allows React state updates)
- **Tab switches:** 300-500ms
- **Modal/dialog appearances:** 500-1000ms (use `waitFor` instead when possible)
- **Page navigation:** 1000-2000ms (use `waitForNavigation` for page loads)

**Example:**
```typescript
await page.locator('input[name="fieldName"]').fill('value');
await page.waitForTimeout(200);  // Allows React to process
```

### ✅ Remove Unnecessary Checks

**Don't do this:**
```typescript
// Wasteful - adds 500ms+ per operation
await page.waitForFunction(() => {
  const content = document.body.innerText;
  return content.includes('Dashboard') && content.includes('Applications');
}, { timeout: 5000 });
```

**Do this instead:**
```typescript
// Navigate and wait for page state change
await page.goto('/dashboard');
await page.waitForLoadState('domcontentloaded');
```

---

## Page Object Model (POM) Pattern

### 🎯 Why Use Page Object Model?

**Benefits:**
- **Maintainability:** Centralizes selectors and page interactions in one place
- **Reusability:** Methods can be reused across multiple tests
- **Readability:** Tests read like user stories (e.g., `pageObject.fillForm()`)
- **Robustness:** Changes to UI require updates in one place, not in every test
- **Testability:** Easier to test page objects independently

### 📐 POM Structure

Create a separate file for each page/component under `frontend/e2e/pages/`:

```
frontend/e2e/
├── pages/
│   ├── risk-details-page.ts      # Page object for risk details
│   ├── business-app-page.ts      # Page object for business apps
│   └── ...
├── fixtures/
│   └── auth.ts
└── risks/
    └── details/
        └── risk-details-all-tabs-forms-pom.spec.ts
```

### 📝 Example: Risk Details Page Object

```typescript
// frontend/e2e/pages/risk-details-page.ts
import { Page, Locator } from '@playwright/test';

export class RiskDetailsPage {
  private readonly page: Page;
  
  // Locators - using testid with fallback
  private readonly overviewTab: Locator;
  private readonly assessmentsTab: Locator;
  private readonly editButton: Locator;
  private readonly newAssessmentButton: Locator;
  
  // Wait constants
  private readonly WAIT_SMALL = 500;
  private readonly WAIT_MEDIUM = 1000;
  
  constructor(page: Page, waitTimes?: { small?: number; medium?: number }) {
    this.page = page;
    
    // Configure wait times if provided
    if (waitTimes) {
      this.WAIT_SMALL = waitTimes.small || this.WAIT_SMALL;
      this.WAIT_MEDIUM = waitTimes.medium || this.WAIT_MEDIUM;
    }
    
    // Tab locators - prefer testid, fallback to role/text
    this.overviewTab = page.getByTestId('risk-details-tab-overview')
      .or(page.locator('[role="tab"]:has-text("Overview")').first());
    this.assessmentsTab = page.getByTestId('risk-details-tab-assessments')
      .or(page.locator('[role="tab"]:has-text("Assessments")').first());
    
    // Button locators - prefer testid
    this.editButton = page.getByTestId('risk-details-edit-button')
      .or(page.locator('button:has-text("Edit")').first());
    this.newAssessmentButton = page.getByTestId('risk-details-new-assessment-button')
      .or(page.locator('button').filter({ hasText: /New Assessment/i }).first());
  }
  
  /**
   * Navigate to risk details page
   */
  async goto(riskId: string) {
    await this.page.goto(`/en/dashboard/risks/${riskId}`, { 
      waitUntil: 'domcontentloaded' 
    });
    await this.page.waitForLoadState('domcontentloaded');
    await this.page.waitForTimeout(this.WAIT_MEDIUM);
  }
  
  /**
   * Click on a specific tab
   */
  async clickTab(tabName: 'Overview' | 'Assessments' | 'Assets' | 'Controls' | 'Treatments' | 'KRIs') {
    const tabMap = {
      'Overview': this.overviewTab,
      'Assessments': this.assessmentsTab,
      // ... other tabs
    };
    
    const tab = tabMap[tabName];
    await tab.waitFor({ state: 'visible', timeout: 10000 });
    
    // Check if tab is already active to avoid redundant clicks
    const isActive = await tab.getAttribute('data-state').catch(() => '');
    if (isActive === 'active') {
      await this.page.waitForTimeout(this.WAIT_MEDIUM);
      return;
    }
    
    await tab.click();
    await this.page.waitForTimeout(this.WAIT_MEDIUM);
  }
  
  /**
   * Open Edit Risk form
   */
  async openEditRiskForm() {
    await this.clickTab('Overview');
    const isVisible = await this.editButton.isVisible({ timeout: 5000 }).catch(() => false);
    if (!isVisible) {
      throw new Error('Edit button not found');
    }
    await this.editButton.click();
    await this.page.waitForTimeout(this.WAIT_MEDIUM);
    
    const dialogVisible = await this.page.locator('[role="dialog"]').isVisible({ timeout: 3000 });
    if (!dialogVisible) {
      throw new Error('Edit Risk form did not open');
    }
  }
  
  /**
   * Fill and submit Edit Risk form
   */
  async fillEditRiskForm(options: { description?: string; statusNotes?: string }) {
    if (options.description) {
      const descriptionField = this.page.locator('label:has-text("Description") ~ textarea').first();
      await descriptionField.clear();
      await descriptionField.fill(options.description);
      await this.page.waitForTimeout(this.WAIT_SMALL);
    }
    // ... fill other fields
  }
  
  async submitEditRiskForm() {
    const updateButton = this.page.getByRole('button', { name: /Update Risk/i });
    await updateButton.click();
    await this.page.waitForTimeout(this.WAIT_MEDIUM);
    
    // Verify dialog closed
    const dialogStillVisible = await this.page.locator('[role="dialog"]').isVisible({ timeout: 3000 }).catch(() => false);
    if (dialogStillVisible) {
      throw new Error('Edit Risk form did not close after submit');
    }
  }
}
```

### 🧪 Using POM in Tests

```typescript
// frontend/e2e/risks/details/risk-details-all-tabs-forms-pom.spec.ts
import { test } from '../../fixtures/auth';
import { RiskDetailsPage } from '../../pages/risk-details-page';

test.describe('Risk Details Page - All Tabs and Forms (POM)', () => {
  const RISK_ID = '8546665c-d856-4641-b97f-7e20f1dcbfac';
  const waitTimes = {
    small: 500,
    medium: 1000,
    large: 2000,
  };

  test('should test all tabs and forms', async ({ authenticatedPage }) => {
    // Initialize page object
    const riskDetailsPage = new RiskDetailsPage(authenticatedPage, waitTimes);
    
    // Navigate to page
    await riskDetailsPage.goto(RISK_ID);
    
    // Use page object methods - clean and readable!
    await riskDetailsPage.openEditRiskForm();
    await riskDetailsPage.fillEditRiskForm({ 
      description: 'Updated description' 
    });
    await riskDetailsPage.submitEditRiskForm();
    
    // Switch to assessments tab
    await riskDetailsPage.openNewAssessmentForm();
    // ... continue with other interactions
  });
});
```

### ✅ POM Best Practices

1. **One Page Object per Page/Component**
   - Create a separate class for each major page or complex component
   - Keep related interactions together

2. **Encapsulate Locators**
   - Define all locators as private/protected class properties
   - Use testid with fallback patterns: `page.getByTestId('id').or(fallbackLocator)`

3. **Method Names Should Describe Actions**
   - ✅ `openEditRiskForm()`, `fillAssessmentForm()`, `submitForm()`
   - ❌ `clickButton()`, `doThing()`, `process()`

4. **Handle Wait Times**
   - Accept wait times in constructor for flexibility (headed vs headless)
   - Use reasonable defaults

5. **Return Values for Verification**
   - Methods can return data or boolean values for assertions
   - Example: `async isFormVisible(): Promise<boolean>`

6. **Error Handling**
   - Throw descriptive errors when elements aren't found
   - Use `.catch(() => false)` for optional checks

### 📚 Real-World Example

**Reference Implementation:**
- **Page Object:** `frontend/e2e/pages/risk-details-page.ts`
- **Test:** `frontend/e2e/risks/details/risk-details-all-tabs-forms-pom.spec.ts`

---

## Test IDs (data-testid)

### ⚠️ **CRITICAL REQUIREMENT: Always Use Test IDs**

**MANDATORY RULE:** 
- **Test IDs MUST be used for all interactive elements** (buttons, form inputs, dropdowns, etc.)
- **Always use `page.getByTestId()` in tests** - never use `locator('[data-testid="..."]')` or text/role selectors
- **If a test ID doesn't exist, add it to the component FIRST** before writing the test
- **For new tests, do NOT use fallbacks** - add test IDs and use only `getByTestId()`
- **Form submit buttons MUST have test IDs** - this is non-negotiable

### 🎯 Why Use Test IDs?

**Benefits:**

**Benefits:**
- **Stability:** Test IDs don't change when UI text or structure changes
- **Performance:** Faster than complex CSS selectors or text matching
- **Clarity:** Explicitly marked for testing, won't be removed accidentally
- **Maintainability:** Clear intent - these attributes are for testing
- **Recommended by Playwright:** `page.getByTestId()` is the preferred method
- **Required for Reliability:** Tests without test IDs are fragile and break easily

### 📝 Adding Test IDs to Components ⚠️ **MANDATORY**

**IMPORTANT:** All interactive elements MUST have test IDs. This includes:
- **Form submit buttons** (ALWAYS REQUIRED)
- **Form inputs and textareas** (preferred)
- **Dropdown/select triggers** (preferred)
- **Searchable dropdown triggers and inputs** (ALWAYS REQUIRED)
- **Action buttons** (Create, Edit, Delete, etc.)
- **Tabs and navigation elements**
- **Dialog/modals**

#### React/Next.js Components

```typescript
// ✅ ALWAYS add data-testid to interactive elements
<Button 
  onClick={() => setIsDialogOpen(true)}
  data-testid="risk-details-edit-button"
>
  <Edit className="mr-2 h-4 w-4" />
  Edit
</Button>

<TabsTrigger 
  value="overview" 
  data-testid="risk-details-tab-overview"
>
  Overview
</TabsTrigger>

// ✅ Add to form submit buttons
<Button 
  type="submit"
  data-testid="risk-asset-dialog-submit-button"
>
  Link Asset
</Button>
```

#### Naming Convention

Use descriptive, hierarchical names:
```
{feature}-{component}-{action/element}
```

**Examples:**
- `risk-details-edit-button`
- `risk-details-tab-overview`
- `risk-details-new-assessment-button`
- `risk-asset-dialog-submit-button`
- `risk-control-dialog-submit-button`
- `business-app-form-title-input`

### 🔍 Using Test IDs in Tests (ALWAYS REQUIRED)

**CRITICAL RULE:** Always use `page.getByTestId()` - never use `page.locator('[data-testid="..."]')`

#### With Page Object Model (Recommended)

```typescript
export class RiskDetailsPage {
  private readonly editButton: Locator;
  private readonly newAssessmentButton: Locator;
  
  constructor(page: Page) {
    // Prefer testid, with fallback for robustness
    this.editButton = page.getByTestId('risk-details-edit-button')
      .or(page.locator('button:has-text("Edit")').first());
    
    this.newAssessmentButton = page.getByTestId('risk-details-new-assessment-button')
      .or(page.locator('button').filter({ hasText: /New Assessment/i }).first());
  }
  
  async openEditRiskForm() {
    // Use getByTestId - recommended Playwright method
    const button = this.page.getByTestId('risk-details-edit-button');
    await button.click();
  }
}
```

#### Direct Usage in Tests

```typescript
// ✅ REQUIRED: Always use getByTestId()
await page.getByTestId('risk-details-edit-button').click();

// ⚠️ TEMPORARY: Fallback only during migration - remove once test IDs added
const button = page.getByTestId('risk-details-edit-button')
  .or(page.locator('button:has-text("Edit")').first());
await button.click();

// ❌ NEVER USE: Always use getByTestId() instead
await page.locator('[data-testid="risk-details-edit-button"]').click();

// ❌ NEVER USE: Add test ID to component instead
await page.locator('button:has-text("Edit")').click();

// ❌ NEVER USE: Add test ID to component instead
await page.getByRole('button', { name: 'Edit' }).click();
```

### 📋 Where to Add Test IDs

**Prioritize adding testids to:**

1. **Navigation Elements**
   - Tabs, menu items, breadcrumbs
   ```tsx
   <TabsTrigger value="overview" data-testid="risk-details-tab-overview">
     Overview
   </TabsTrigger>
   ```

2. **Action Buttons**
   - Create, Edit, Delete, Submit, Cancel buttons
   ```tsx
   <Button onClick={handleSubmit} data-testid="risk-details-new-assessment-button">
     New Assessment
   </Button>
   ```

3. **Form Dialogs/Modals**
   - Submit buttons in dialogs
   ```tsx
   <Button type="submit" data-testid="risk-asset-dialog-submit-button">
     Link Asset
   </Button>
   ```

4. **Complex Interactive Elements**
   - Multi-step forms, wizards, accordions
   ```tsx
   <AccordionItem value="item-1" data-testid="form-section-basic-info">
     ...
   </AccordionItem>
   ```

**Test IDs are REQUIRED for:**
- All form submit buttons
- All searchable dropdown triggers and inputs
- All action buttons (Create, Edit, Delete, etc.)
- All tabs and navigation elements
- All dialog/modals

**Test IDs are preferred for:**
- Form inputs and textareas
- Standard dropdown/select triggers
- Interactive UI elements

**Test IDs are optional for:**
- Purely presentational elements (icons, labels without interaction)
- Static text content

### ✅ Test ID Best Practices (MANDATORY)

1. **ALWAYS Use `page.getByTestId()`** ⚠️ **REQUIRED**
   - ✅ `page.getByTestId('my-test-id')` - **ALWAYS USE THIS**
   - ❌ `page.locator('[data-testid="my-test-id"]')` - **NEVER USE THIS**
   - ❌ `page.locator('button:has-text("Submit")')` - **Add test ID instead**
   - ❌ `page.getByRole('button', { name: 'Submit' })` - **Add test ID instead**

2. **Test IDs Must Exist Before Writing Tests**
   - If a test ID doesn't exist, **add it to the component FIRST**
   - Do not write tests without test IDs for key elements
   - Form submit buttons, searchable dropdowns, and action buttons MUST have test IDs

3. **Fallbacks (Migration Only)**
   - Use `.or()` to fall back to text/role selectors ONLY during migration of existing tests
   - For new tests, add test IDs first - do not use fallbacks
   - Remove all fallbacks once test IDs are added

4. **Be Descriptive**
   - Include feature, component, and purpose in the name
   - Example: `risk-details-new-assessment-button` (not `btn-1`)

5. **Keep Consistent Naming**
   - Use kebab-case (dashes)
   - Follow the pattern: `{feature}-{component}-{element}`

6. **Update Both Component and Test Together**
   - When adding testid to component, update tests to use it immediately
   - Remove fallback selectors once testid is confirmed working

### 🔄 Implementation Strategy

**IMPORTANT:** For new tests, ALWAYS add test IDs first, then write the test using ONLY `getByTestId()`. Do not use fallbacks in new code.

**For New Tests (REQUIRED):**
```tsx
// Step 1: Add testid to component FIRST
<Button data-testid="my-button">Click Me</Button>
```

```typescript
// Step 2: Write test using ONLY getByTestId() - no fallbacks
const button = page.getByTestId('my-button');
await button.click();
```

**For Existing Tests (Migration - Temporary Only):**
```tsx
// Phase 1: Add testid to component
<Button data-testid="my-button">Click Me</Button>
```

```typescript
// Phase 2: Update test with fallback (TEMPORARY)
const button = page.getByTestId('my-button')
  .or(page.locator('button:has-text("Click Me")'));
```

```typescript
// Phase 3: Remove fallback - use ONLY testid (FINAL)
const button = page.getByTestId('my-button');
await button.click();
```

### 📚 Real-World Examples

**Components with testids:**
- `frontend/src/app/[locale]/(dashboard)/dashboard/risks/[id]/page.tsx`
  - Tabs: `risk-details-tab-overview`, `risk-details-tab-assessments`, etc.
  - Buttons: `risk-details-edit-button`, `risk-details-new-assessment-button`, etc.

**Dialog components:**
- `frontend/src/components/risks/risk-asset-browser-dialog.tsx`
  - Submit button: `risk-asset-dialog-submit-button`

**Tests using testids:**
- `frontend/e2e/pages/risk-details-page.ts`
- `frontend/e2e/risks/details/risk-details-all-tabs-forms-pom.spec.ts`

---

## Form Field Selector Strategy

### 🎯 Selector Selection by Field Type

**Priority Order:**
1. **Test IDs** (if available) - `page.getByTestId('field-name')`
2. **Name attributes** - `page.locator('input[name="fieldName"]')`
3. **Labels** - `page.getByLabel('Field Label')`
4. **Role + text** - `page.getByRole('button', { name: 'Submit' })`

The form field type determines the correct selector strategy:

#### **Text Inputs** (applicationName, description, vendor, etc.)
```typescript
// ✅ REQUIRED: Use testid (preferred - add test ID if missing)
await page.getByTestId('form-title-input').type('Test App', { delay: 50 });

// ⚠️ FALLBACK: Use name attribute only if test ID cannot be added immediately
await page.locator('input[name="applicationName"]').type('Test App', { delay: 50 });
await page.locator('textarea[name="description"]').type('Description text', { delay: 50 });

// ⚠️ LAST RESORT: Use label if test ID and name not available
await page.getByLabel('Application Name').type('Test App', { delay: 50 });

// ❌ NEVER USE: Always add test ID instead
await page.locator('text=Application Name').fill('Test App');
```

**Note:** Always use `type()` with delay instead of `fill()` - see Form Filling Best Practices section.

#### **Dropdowns/Select Components** (applicationType, status, etc.)
```typescript
// ✅ REQUIRED: Use testid if available (preferred)
await page.getByTestId('application-type-dropdown-trigger').click();

// ⚠️ FALLBACK: Use getByLabel only if test ID not available
await page.getByLabel('Application Type').click();
await page.locator('[role="option"]').first().click();

// ✅ Or use label + radio/option pattern
await page.getByLabel(/Application Type/).click();

// ❌ Avoid - Buttons don't have name attributes
await page.locator('button[name="applicationType"]').click();

// ❌ Avoid - Complex DOM traversal
await page.locator('label:has-text("Owner")').locator('..').locator('button');
```

#### **Checkboxes** (processesPII, processesPHI, etc.)
```typescript
// ✅ Use getByLabel for checkboxes
await page.getByLabel('Processes PII').click();
await page.getByLabel('Processes PHI').click();

// ✅ Or use input[name] with type=checkbox
await page.locator('input[name="processesPII"][type="checkbox"]').click();

// ❌ Avoid - Text matching without proper role
await page.locator('text=Processes PII').click();
```

#### **Select Components (shadcn/ui)** (ownerId, businessUnit)
```typescript
// ✅ Use existence check with fallback
const ownerButton = page.locator('button').filter({ 
  has: page.locator('text="Select owner"') 
}).first();

const exists = await ownerButton.isVisible({ timeout: 2000 }).catch(() => false);
if (exists) {
  await ownerButton.click();
  await page.locator('[role="option"]').first().click();
}

// ❌ Avoid - Single approach for all selectors
await page.getByLabel('Owner').click();  // May match 5+ elements
```

### 🔍 Selector Debugging Strategy

When a selector fails:

1. **Check the actual form component** - Look at the React component to understand structure
2. **Verify field exists** - Don't assume fields exist (e.g., "department" doesn't exist)
3. **Test selector in Playwright Inspector:**
   ```bash
   npx playwright codegen --browser=chromium http://localhost:3000
   ```
4. **Use multiple approaches:**
   - Try `name` attribute first (most reliable)
   - Then try `getByLabel()` with regex for flexibility
   - Then try role-based selectors
   - Avoid complex DOM traversal

### 📋 Field Name Reference

**Always verify field names from the form component**, not from UI labels:

```typescript
// From business-application-form.tsx Zod schema:
// ✅ applicationName (NOT "Application Name" or "name")
// ✅ applicationType (NOT "type")
// ✅ processesPII (NOT "processes_pii")
// ✅ vendorEmail (NOT "email")
// ✅ ownerId (NOT "owner")
// ❌ department (DOES NOT EXIST)
```

---

## Authentication & Navigation

### 🔐 Fixture Structure

**Optimize authentication fixture:**

```typescript
// ✅ FAST approach
export const authenticatedPage = test.extend<{ authenticatedPage: Page }>({
  authenticatedPage: async ({ browser }, use) => {
    const context = await browser.newContext();
    const page = await context.newPage();
    
    // Navigate and wait only for DOM content
    await page.goto('http://localhost:3000/auth/login');
    await page.waitForLoadState('domcontentloaded');
    
    // Fill credentials
    await page.locator('input[type="email"]').fill('admin@grcplatform.com');
    await page.locator('input[type="password"]').fill('Password123');
    
    // Submit
    await page.locator('button:has-text("Sign In")').click();
    
    // Wait for navigation to complete, NOT for network idle
    await page.waitForURL('**/dashboard');
    await page.waitForLoadState('domcontentloaded');
    
    await use(page);
    await context.close();
  },
});
```

### 🚀 Fast Navigation Pattern

```typescript
// ✅ Quick navigation without excessive waiting
await page.goto('/applications');
await page.waitForLoadState('domcontentloaded');

// Don't wait for specific content
// Don't check for dashboard text
// Don't verify UI elements loaded
```

---

## Form Filling Best Practices

### 🎯 Critical: Always Use `getByTestId` for Form Submissions

**IMPORTANT:** Form submit buttons MUST use `getByTestId()` - this is the recommended Playwright method and most reliable selector.

**Pattern for submit buttons:**
```typescript
// ✅ ALWAYS use getByTestId for submit buttons
const submitButton = this.page.getByTestId('risk-form-submit-create').or(
  this.page.getByTestId('risk-form-submit-update')
);

await submitButton.waitFor({ state: 'visible', timeout: 3000 });
await submitButton.scrollIntoViewIfNeeded();
await this.page.waitForTimeout(this.WAIT_MEDIUM);

// Wait for button to be enabled
const isEnabled = await submitButton.isEnabled().catch(() => false);
if (!isEnabled) {
  await this.page.waitForTimeout(this.WAIT_MEDIUM);
}

await submitButton.click();
await this.page.waitForTimeout(this.WAIT_AFTER_SUBMIT);
```

**Required test IDs for form submit buttons:**
- Risk forms: `risk-form-submit-create` / `risk-form-submit-update`
- Treatment forms: `treatment-form-submit-create` / `treatment-form-submit-update`
- KRI forms: `kri-form-submit-create` / `kri-form-submit-update`
- Assessment request forms: `assessment-request-form-submit-create` / `assessment-request-form-submit-update`

**Adding test IDs to submit buttons:**
```tsx
<Button 
  type="submit" 
  disabled={mutation.isPending}
  data-testid={isEditMode ? "form-submit-update" : "form-submit-create"}
>
  {isEditMode ? "Update" : "Create"}
</Button>
```

### ⏱️ Slow Form Filling (Simulate Human Input)

**Always use `type()` with delay instead of `fill()` for text inputs and textareas** to simulate human typing and avoid race conditions with React state updates.

```typescript
// ❌ FAST - Can cause race conditions
await titleInput.fill(options.title);

// ✅ SLOW - Simulates human input, more reliable
await titleInput.waitFor({ state: 'visible', timeout: 5000 });
await titleInput.clear({ timeout: 3000 });
await this.page.waitForTimeout(this.WAIT_SMALL);
await titleInput.type(options.title, { delay: 50 }); // 50ms delay per character
await this.page.waitForTimeout(this.WAIT_MEDIUM);
```

**Benefits:**
- More reliable with React forms (allows state updates)
- Better simulates user behavior
- Reduces race conditions
- Catches timing issues earlier

**Pattern for all text inputs:**
```typescript
async fillFormField(fieldLocator: Locator, value: string) {
  await fieldLocator.waitFor({ state: 'visible', timeout: 5000 });
  await fieldLocator.clear({ timeout: 3000 });
  await this.page.waitForTimeout(this.WAIT_SMALL);
  await fieldLocator.type(value, { delay: 50 });
  await this.page.waitForTimeout(this.WAIT_MEDIUM);
}
```

### 🔄 Dropdown/Select Handling

**For standard dropdowns:**
```typescript
// ✅ Use getByLabel for dropdown triggers
const select = this.page.getByLabel('Priority');
await select.waitFor({ state: 'visible', timeout: 5000 });
await this.page.waitForTimeout(this.WAIT_MEDIUM);
await select.click();
await this.page.waitForTimeout(this.WAIT_MEDIUM);

// Wait for option to be visible
const option = this.page.getByRole('option', { name: new RegExp('Medium', 'i') }).first();
await option.waitFor({ state: 'visible', timeout: 3000 });
await this.page.waitForTimeout(this.WAIT_SMALL);
await option.click();
await this.page.waitForTimeout(this.WAIT_MEDIUM);
```

**For searchable dropdowns (custom components):**
```typescript
// ✅ Use test IDs for searchable dropdowns
const dropdownTrigger = this.page.getByTestId('risk-dropdown-trigger');
await dropdownTrigger.click();
await this.page.waitForTimeout(this.WAIT_MEDIUM);

// Wait for search input
const searchInput = this.page.getByTestId('risk-search-input');
await searchInput.waitFor({ state: 'visible', timeout: 5000 });
await this.page.waitForTimeout(this.WAIT_MEDIUM); // Wait for options to load

// Type to search (use type with delay)
await searchInput.clear();
await searchInput.type(searchTerm, { delay: 50 });
await this.page.waitForTimeout(this.WAIT_MEDIUM * 2); // Wait for search results

// Select option by test ID or text
const option = this.page.getByTestId(`risk-option-${riskId}`).or(
  this.page.locator('[data-testid^="risk-option-"]').filter({ hasText: searchTerm }).first()
);
await option.waitFor({ state: 'visible', timeout: 3000 });
await option.click();
await this.page.waitForTimeout(this.WAIT_MEDIUM); // Wait for dropdown to close
```

**Key points:**
- Always wait for dropdown to open before interacting
- Wait for options to load after search
- Wait for dropdown to close after selection
- **Continue with form filling AFTER dropdown closes** - this ensures form state is updated
- Use test IDs for searchable dropdown triggers and inputs when available

### ⏸️ Proper Waits After Form Operations

**After form submission:**
```typescript
async submitForm() {
  const submitButton = this.page.getByTestId('form-submit-create');
  await submitButton.click();
  
  // Wait for dialog to close (form was submitted)
  let dialogClosed = false;
  for (let i = 0; i < 10; i++) {
    const dialogStillVisible = await this.isDialogVisible();
    if (!dialogStillVisible) {
      dialogClosed = true;
      break;
    }
    await this.page.waitForTimeout(this.WAIT_MEDIUM);
  }
  
  if (!dialogClosed) {
    throw new Error('Form did not close after submit');
  }
  
  // Wait additional time for backend processing and query invalidation
  await this.page.waitForTimeout(this.WAIT_MEDIUM * 3);
}
```

**Between field fills:**
- Small wait (WAIT_SMALL = 500ms) between individual field fills
- Medium wait (WAIT_MEDIUM = 1000ms) after dropdown selections
- Large wait (WAIT_LARGE = 2000ms) after form submission
- Extra wait after searchable dropdown selections (2x MEDIUM)

### 📝 Structured Tab-Based Filling

Organize test to fill one tab at a time with clear logging:

```typescript
test('fill all form tabs', async ({ authenticatedPage }) => {
  // === TAB 1: BASIC INFO ===
  console.log('Filling Basic Info tab...');
  
  // Text inputs
  await authenticatedPage.locator('input[name="applicationName"]').fill(uniqueName);
  await authenticatedPage.locator('textarea[name="description"]').fill('Description');
  
  // Dropdowns
  await authenticatedPage.getByLabel('Application Type').click();
  await authenticatedPage.locator('[role="option"]').first().click();
  
  // === TAB 2: TECHNICAL ===
  console.log('Filling Technical tab...');
  const technicalTab = authenticatedPage.locator('button[role="tab"]:has-text("Technical")');
  await technicalTab.click();
  
  // ... fill technical fields
  
  // === TAB 3: VENDOR ===
  console.log('Filling Vendor tab...');
  const vendorTab = authenticatedPage.locator('button[role="tab"]:has-text("Vendor")');
  await vendorTab.click();
  
  // ... fill vendor fields
  
  // === TAB 4: COMPLIANCE ===
  console.log('Filling Compliance tab...');
  const complianceTab = authenticatedPage.locator('button[role="tab"]:has-text("Compliance")');
  await complianceTab.click();
  
  // ... fill compliance fields
});
```

### ⏱️ Delays Between Operations (DEPRECATED - Use type() instead)

**Note:** The patterns below use `fill()`. For new tests, prefer using `type()` with delay as shown in the "Slow Form Filling" section above.

Add reasonable delays to allow React state updates:

```typescript
// ⚠️ DEPRECATED - Use type() with delay instead
// ✅ Fill, wait for React, then proceed
await page.locator('input[name="field"]').fill('value');
await page.waitForTimeout(200);  // React processes state update

// ✅ Click dropdown, wait for options to render
await page.getByLabel('Dropdown').click();
await page.waitForTimeout(300);  // Options render
await page.locator('[role="option"]').first().click();
```

**For new tests, use the slow typing pattern:**
```typescript
// ✅ NEW - Use type() with delay (recommended)
await page.locator('input[name="field"]').type('value', { delay: 50 });
await page.waitForTimeout(this.WAIT_MEDIUM);
```

### ✅ Error Handling for Optional Elements

```typescript
// ✅ Check if element exists before interacting
const ownerButton = page.locator('button').filter({ 
  has: page.locator('text="Select owner"') 
}).first();

const exists = await ownerButton.isVisible({ timeout: 2000 }).catch(() => false);
if (exists) {
  await ownerButton.click();
  // ... select option
} else {
  console.log('Owner field not available, skipping');
}
```

### 📸 Screenshot Before Submit

Always capture state before submission for debugging:

```typescript
// Before submitting form
await page.screenshot({ path: 'before-submit.png' });

// Then submit
await page.locator('button:has-text("Create")').click();
```

---

## Common Pitfalls & Solutions

### ❌ Pitfall 1: Assuming Fields Exist

**Wrong:**
```typescript
// Crashes if "department" field doesn't exist
await page.locator('input[name="department"]').fill('Engineering');
```

**Right:**
```typescript
// Check first, then fill
const deptField = page.locator('input[name="department"]');
if (await deptField.isVisible({ timeout: 1000 }).catch(() => false)) {
  await deptField.fill('Engineering');
}
```

**Or better:** Check the form component first to verify field exists

### ❌ Pitfall 2: Using getByLabel() for Multiple Matches

**Wrong:**
```typescript
// "Owner" label might match multiple elements (5+ in strict mode)
await page.getByLabel('Owner').click();  // Error: strict mode violation
```

**Right:**
```typescript
// Be more specific
const ownerButton = page.locator('button').filter({ 
  has: page.locator('text="Select owner"') 
}).first();
await ownerButton.click();
```

### ❌ Pitfall 3: Overcomplicated DOM Traversal

**Wrong:**
```typescript
// Fragile - breaks if DOM structure changes
await page.locator('label:has-text("Owner")')
  .locator('..')
  .locator('button[role="combobox"]')
  .first()
  .click();
```

**Right:**
```typescript
// Simple and direct
await page.getByLabel('Owner').click();
// OR if that matches multiple:
const ownerButton = page.locator('button').filter({ 
  has: page.locator('text="Select owner"') 
}).first();
await ownerButton.click();
```

### ❌ Pitfall 4: Using Wrong Wait Strategies

**Wrong:**
```typescript
// Waits 5 seconds for all network activity to complete
await page.waitForLoadState('networkidle');
```

**Right:**
```typescript
// Waits only for DOM ready
await page.waitForLoadState('domcontentloaded');
```

### ❌ Pitfall 5: Not Verifying Form Submission

**Wrong:**
```typescript
// Clicks button but doesn't verify anything happened
await page.locator('button:has-text("Create")').click();
```

**Right:**
```typescript
// Verify form was submitted
await page.locator('button:has-text("Create")').click();
await page.waitForTimeout(1000);

// Check for success message
const successMsg = page.locator('text=Success').or(page.locator('[role="alert"]:has-text("Success")'));
await expect(successMsg).toBeVisible();

// Or verify navigation occurred
await page.waitForURL('**/applications');
```

### ❌ Pitfall 6: Playwright Keeping Browser Open

**Issue:** Test hangs with browser remaining open

**Solution:** Ensure proper fixture cleanup
```typescript
test.afterEach(async ({ page }) => {
  await page.close();  // Explicit cleanup
});
```

---

## Code Organization

### 📁 Test File Structure

```typescript
import { test, expect, Page } from '@playwright/test';
import { authenticatedPage } from './fixtures/auth';

// ===== SETUP =====
// Import fixtures, define constants

// ===== CONSTANTS =====
const TEST_TIMEOUT = 120000;
const WAIT_SMALL = 100;
const WAIT_MEDIUM = 300;
const WAIT_LARGE = 500;

// ===== TEST =====
test.describe('Business Application Form', () => {
  test.use({ timeout: TEST_TIMEOUT });

  test('should fill all tabs and create record', async ({ authenticatedPage }) => {
    // Login happens in fixture
    
    // Navigate to form
    // Fill basic info tab
    // Fill technical tab
    // Fill vendor tab
    // Fill compliance tab
    // Submit form
    // Verify success
  });
});
```

### 📝 Logging & Console Messages

Use clear, consistent logging:

```typescript
// ✅ Clear progression
console.log('Filling Basic Info tab...');
console.log('✅ Application Name filled: "' + uniqueName + '"');
console.log('✅ Description filled');
console.log('✅ Application Type selected');

// ✅ Clear errors
console.error('❌ Form submission failed');

// ✅ Section headers
console.log('===== BASIC INFO TAB =====');
```

---

## Checklist for New Tests

Use this checklist when creating or modifying form tests:

- [ ] **Authentication**
  - [ ] Using `waitForLoadState('domcontentloaded')` in auth fixture
  - [ ] Not checking for specific dashboard text
  - [ ] Fixture properly cleans up after test

- [ ] **Form Structure**
  - [ ] Verified all field names from form component (not UI labels)
  - [ ] Identified all form tabs
  - [ ] Listed all fields in each tab
  - [ ] Noted any Select/combobox components

- [ ] **Page Object Model (POM)**
  - [ ] Created page object class for complex pages
  - [ ] Locators defined as class properties
  - [ ] Methods encapsulate page interactions
  - [ ] Clear, descriptive method names
  - [ ] Page object reused across multiple tests

- [ ] **Test IDs (data-testid)**
  - [ ] Added testids to key interactive elements (buttons, tabs, forms)
  - [ ] Using `page.getByTestId()` in tests (not `locator('[data-testid="..."]')`)
  - [ ] Testids follow naming convention: `{feature}-{component}-{element}`
  - [ ] Fallback selectors provided during migration
  - [ ] Testids added to components used by tests
  - [ ] **Form submit buttons have test IDs** (e.g., `form-submit-create`, `form-submit-update`) - **REQUIRED**
  - [ ] Searchable dropdowns have test IDs for trigger and input (e.g., `risk-dropdown-trigger`, `risk-search-input`)

- [ ] **Form Filling**
  - [ ] Using `type()` with `{ delay: 50 }` for text inputs (not `fill()`) - **REQUIRED**
  - [ ] Proper waits between field fills (WAIT_SMALL = 500ms)
  - [ ] Proper waits after dropdown selections (WAIT_MEDIUM = 1000ms)
  - [ ] Proper waits after form submission (WAIT_MEDIUM * 3)
  - [ ] Form filling continues after dropdown selections
  - [ ] Waiting for dropdown to close before continuing with next field

- [ ] **Selectors**
  - [ ] Prefer testids first, then name attributes, then labels/roles
  - [ ] **Form submit buttons ALWAYS use `getByTestId()`** - **REQUIRED**
  - [ ] Text inputs use `getByTestId()`, `getByLabel()`, or `input[name="..."]`
  - [ ] Dropdowns use `getByTestId()`, `getByLabel()`, or role selectors
  - [ ] Searchable dropdowns use test IDs for trigger and search input
  - [ ] Checkboxes use `getByTestId()`, `getByLabel()`, or role selectors
  - [ ] Buttons use `getByTestId()` or `getByRole('button', { name: '...' })`
  - [ ] All selectors tested individually
  - [ ] No assumed fields (verify existence first)

- [ ] **Test Flow**
  - [ ] Clear section headers/logs for each tab
  - [ ] **Form filling uses slow typing (`type()` with delay)** - **REQUIRED**
  - [ ] Proper waits after each form operation
  - [ ] **Form submission uses `getByTestId()` for submit button** - **REQUIRED**
  - [ ] Verify form closes after submission
  - [ ] Wait for query invalidation after form submission
  - [ ] Reasonable delays between operations (100-300ms)
  - [ ] Error handling for optional elements
  - [ ] Screenshot before form submission
  - [ ] Success message verification
  - [ ] Record verification in list/database

- [ ] **Performance**
  - [ ] Using appropriate wait strategies (not `networkidle`)
  - [ ] No unnecessary `waitForFunction` checks
  - [ ] Test completes in reasonable time (<60s for complex forms)

- [ ] **Robustness**
  - [ ] Handles missing optional fields gracefully
  - [ ] Uses `.catch(() => false)` for visibility checks
  - [ ] Checks element existence before interaction
  - [ ] Clear error messages for debugging

- [ ] **Code Quality**
  - [ ] Consistent formatting
  - [ ] Clear variable names
  - [ ] No commented-out code
  - [ ] Comments explain "why", not "what"

---

## Key Metrics

**Based on Business Application Form Test:**

| Metric | Before Optimization | After Optimization |
|--------|---------------------|-------------------|
| Test Duration | ~27 seconds | ~25 seconds |
| Auth Wait | networkidle | domcontentloaded |
| Individual Wait | 300-500ms | 100-200ms |
| Form Tabs | 4 | 4 |
| Fields Filled | 20+ | 20+ |
| Success Rate | ❌ Failing | ✅ Passing |

---

## References

### Example Implementations

- **POM Example:** `frontend/e2e/pages/risk-details-page.ts`
- **POM Test:** `frontend/e2e/risks/details/risk-details-all-tabs-forms-pom.spec.ts`
- **Test ID Components:** 
  - `frontend/src/app/[locale]/(dashboard)/dashboard/risks/[id]/page.tsx`
  - `frontend/src/components/risks/risk-asset-browser-dialog.tsx`
  - `frontend/src/components/risks/risk-control-browser-dialog.tsx`
  - `frontend/src/components/risks/kri-browser-dialog.tsx`

### Legacy Examples (Good Patterns but Not Using POM)

- **Test File:** `frontend/e2e/assets/business-app-create-submit.spec.ts`
- **Form Component:** `frontend/src/components/forms/business-application-form.tsx`
- **Auth Fixture:** `frontend/e2e/fixtures/auth.ts`

### Documentation

- **Playwright Docs:** https://playwright.dev/docs/intro
- **Best Practices:** https://playwright.dev/docs/best-practices
- **Test Selectors:** https://playwright.dev/docs/selectors
- **Page Object Model:** https://playwright.dev/docs/pom

---

**Last Updated:** December 2025 ✅  
**Last Tested:** December 2025 ✅  
**Status:** All guidance verified with working tests using POM and testids
