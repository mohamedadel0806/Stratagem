# Risk Module Test IDs Implementation Status

**Date:** January 2025
**Based on:** Playwright Testing Advisory Guide v2.0
**Status:** Phase 1 In Progress

---

## Summary

The Risk Details Page already has **ALL required test IDs**! ✅

However, the **Form components** need test IDs added to their input fields.

---

## Completed Components ✅

### 1. Risk Details Page (`frontend/src/app/[locale]/(dashboard)/dashboard/risks/[id]/page.tsx`)

**Status:** ✅ **COMPLETE** - All test IDs present

| Element | Test ID | Line | Status |
|---------|---------|------|--------|
| Overview Tab | `risk-details-tab-overview` | 508 | ✅ |
| Assessments Tab | `risk-details-tab-assessments` | 509 | ✅ |
| Assets Tab | `risk-details-tab-assets` | 515 | ✅ |
| Controls Tab | `risk-details-tab-controls` | 521 | ✅ |
| Treatments Tab | `risk-details-tab-treatments` | 527 | ✅ |
| KRIs Tab | `risk-details-tab-kris` | 533 | ✅ |
| Edit Button | `risk-details-edit-button` | 445 | ✅ |
| New Assessment Button | `risk-details-new-assessment-button` | 693 | ✅ |
| Request Assessment Button | `risk-details-request-assessment-button` | 689 | ✅ |
| Link Asset Button | `risk-details-link-asset-button` | 835 | ✅ |
| Link Control Button | `risk-details-link-control-button` | 892 | ✅ |
| New Treatment Button | `risk-details-new-treatment-button` | 960 | ✅ |
| Link KRI Button | `risk-details-link-kri-button` | 1061 | ✅ |

**Action Required:** None ✅

---

## Components Requiring Test IDs ⚠️

### 2. Risk Form (`frontend/src/components/forms/risk-form.tsx`)

**Status:** ⚠️ **PARTIAL** - Submit button has test ID, form fields need IDs

#### Already Has Test IDs:
- ✅ Submit Create Button: `risk-form-submit-create` (line 924)
- ✅ Submit Update Button: `risk-form-submit-update` (line 924)

#### Needs Test IDs (Form Fields):

**Basic Information Tab:**
```typescript
// Title Input (line 309)
<Input
  placeholder="e.g., Data Breach Risk from Unauthorized Access"
  data-testid="risk-form-title-input"  // ✅ ADD THIS
  {...field}
/>

// Risk Statement Textarea (line 323)
<Textarea
  placeholder="If [threat] exploits [vulnerability]..."
  data-testid="risk-form-risk-statement-textarea"  // ✅ ADD THIS
  {...field}
/>

// Description Textarea (line 344)
<Textarea
  placeholder="Describe the risk in detail..."
  data-testid="risk-form-description-textarea"  // ✅ ADD THIS
  {...field}
/>

// Category Select (line 375)
<SelectTrigger data-testid="risk-form-category-dropdown">  // ✅ ADD THIS
  <SelectValue placeholder="Select category" />
</SelectTrigger>

// Status Select (line ~399)
<SelectTrigger data-testid="risk-form-status-dropdown">  // ✅ ADD THIS
  <SelectValue placeholder="Select status" />
</SelectTrigger>
```

**Risk Scoring Tab:**
```typescript
// Likelihood Select (find likelihood field)
<SelectTrigger data-testid="risk-form-likelihood-dropdown">  // ✅ ADD THIS
  <SelectValue placeholder="Select likelihood" />
</SelectTrigger>

// Impact Select (find impact field)
<SelectTrigger data-testid="risk-form-impact-dropdown">  // ✅ ADD THIS
  <SelectValue placeholder="Select impact" />
</SelectTrigger>

// Owner Select (find owner field)
<SelectTrigger data-testid="risk-form-owner-dropdown">  // ✅ ADD THIS
  <SelectValue placeholder="Select owner" />
</SelectTrigger>

// Risk Analyst Select (find analyst field)
<SelectTrigger data-testid="risk-form-analyst-dropdown">  // ✅ ADD THIS
  <SelectValue placeholder="Select analyst" />
</SelectTrigger>
```

**Scenario Tab:**
```typescript
// Threat Source Select
<SelectTrigger data-testid="risk-form-threat-source-dropdown">  // ✅ ADD THIS
  <SelectValue placeholder="Select threat source" />
</SelectTrigger>

// Risk Velocity Select
<SelectTrigger data-testid="risk-form-velocity-dropdown">  // ✅ ADD THIS
  <SelectValue placeholder="Select velocity" />
</SelectTrigger>

// Early Warning Signs Textarea
<Textarea
  data-testid="risk-form-early-warning-signs-textarea"  // ✅ ADD THIS
  {...field}
/>

// Vulnerabilities Textarea
<Textarea
  data-testid="risk-form-vulnerabilities-textarea"  // ✅ ADD THIS
  {...field}
/>
```

**Dates Tab:**
```typescript
// Date Identified Input
<Input
  type="date"
  data-testid="risk-form-date-identified-input"  // ✅ ADD THIS
  {...field}
/>

// Next Review Date Input
<Input
  type="date"
  data-testid="risk-form-next-review-date-input"  // ✅ ADD THIS
  {...field}
/>
```

**Advanced Tab:**
```typescript
// Status Notes Textarea
<Textarea
  data-testid="risk-form-status-notes-textarea"  // ✅ ADD THIS
  {...field}
/>

// Business Process Input
<Input
  data-testid="risk-form-business-process-input"  // ✅ ADD THIS
  {...field}
/>

// Tags Input
<Input
  data-testid="risk-form-tags-input"  // ✅ ADD THIS
  {...field}
/>
```

---

### 3. Risk Assessment Form (`frontend/src/components/forms/risk-assessment-form.tsx`)

**Status:** ❓ **NEEDS CHECKING**

**Required Test IDs:**
```typescript
// Likelihood Input/Select
data-testid="assessment-form-likelihood-input"

// Impact Input/Select
data-testid="assessment-form-impact-input"

// Method Dropdown
data-testid="assessment-form-method-dropdown"

// Notes Textarea
data-testid="assessment-form-notes-textarea"

// Assessment Date Input
data-testid="assessment-form-date-input"

// Next Review Date Input
data-testid="assessment-form-next-review-date-input"

// Submit Button
data-testid="assessment-form-submit-create"
data-testid="assessment-form-submit-update"
```

---

### 4. Risk Treatment Form (`frontend/src/components/forms/treatment-form.tsx`)

**Status:** ❓ **NEEDS CHECKING**

**Required Test IDs:**
```typescript
// Title Input
data-testid="treatment-form-title-input"

// Type Dropdown
data-testid="treatment-form-type-dropdown"

// Status Dropdown
data-testid="treatment-form-status-dropdown"

// Priority Dropdown
data-testid="treatment-form-priority-dropdown"

// Strategy Dropdown
data-testid="treatment-form-strategy-dropdown"

// Description Textarea
data-testid="treatment-form-description-textarea"

// Cost Input
data-testid="treatment-form-cost-input"

// Start Date Input
data-testid="treatment-form-start-date-input"

// End Date Input
data-testid="treatment-form-end-date-input"

// Owner Dropdown
data-testid="treatment-form-owner-dropdown"

// Submit Button
data-testid="treatment-form-submit-create"
data-testid="treatment-form-submit-update"
```

---

### 5. Browser Dialogs

**Status:** ❓ **NEEDS CHECKING**

#### Risk Asset Browser Dialog (`frontend/src/components/risks/risk-asset-browser-dialog.tsx`)

**Required Test IDs:**
```typescript
// Search Input
data-testid="asset-search-input"

// Asset Select Button (for each asset)
data-testid="asset-select-button-{assetId}"

// Submit Button
data-testid="link-asset-submit"
```

#### Risk Control Browser Dialog (`frontend/src/components/risks/risk-control-browser-dialog.tsx`)

**Required Test IDs:**
```typescript
// Search Input
data-testid="control-search-input"

// Control Select Button (for each control)
data-testid="control-select-button-{controlId}"

// Submit Button
data-testid="link-control-submit"
```

#### KRI Browser Dialog (`frontend/src/components/risks/kri-browser-dialog.tsx`)

**Required Test IDs:**
```typescript
// Search Input
data-testid="kri-search-input"

// KRI Select Button (for each KRI)
data-testid="kri-select-button-{kriId}"

// Submit Button
data-testid="link-kri-submit"
```

---

## Implementation Priority

### Priority P0 (Critical) - Do First:

1. **Risk Form** - Add test IDs to all form inputs
   - Time estimate: 1-2 hours
   - Impact: High - Used in many tests

2. **Risk Assessment Form** - Add test IDs
   - Time estimate: 1 hour
   - Impact: High - Core risk functionality

3. **Risk Treatment Form** - Add test IDs
   - Time estimate: 1 hour
   - Impact: High - Core risk functionality

### Priority P1 (High):

4. **Browser Dialogs** - Add test IDs to search inputs and select buttons
   - Time estimate: 2 hours (3 dialogs)
   - Impact: Medium - Asset/Control/KRI linking

---

## Next Steps

1. **Add test IDs to Risk Form** (Priority P0)
   - Open `frontend/src/components/forms/risk-form.tsx`
   - Add `data-testid` attributes to all Input, Textarea, and SelectTrigger components
   - Follow naming convention: `risk-form-{field-name}-{input-type}`

2. **Check other forms**
   - Open `frontend/src/components/forms/risk-assessment-form.tsx`
   - Check if test IDs exist
   - Add if missing

3. **Check browser dialogs**
   - Open browser dialog components
   - Add test IDs to search inputs and buttons

4. **Update POM files**
   - Remove fallback `.or()` selectors
   - Use only `page.getByTestId()`

---

## Test ID Naming Convention

Follow this pattern: `{feature}-{component}-{element-type}`

**Examples:**
- `risk-form-title-input` (input field)
- `risk-form-category-dropdown` (dropdown trigger)
- `risk-form-description-textarea` (textarea)
- `risk-form-submit-create` (submit button, create mode)
- `risk-form-submit-update` (submit button, update mode)

**Element Types:**
- `input` - Input fields
- `textarea` - Textarea fields
- `dropdown` - Select/dropdown triggers
- `search-input` - Searchable inputs
- `submit-create` - Submit button (create mode)
- `submit-update` - Submit button (update mode)
- `submit-cancel` - Cancel button
- `button-{action}` - Other buttons

---

## Quick Reference: How to Add Test IDs

### Input Field:
```typescript
// ❌ Before
<Input placeholder="Title" {...field} />

// ✅ After
<Input
  placeholder="Title"
  data-testid="risk-form-title-input"
  {...field}
/>
```

### Textarea:
```typescript
// ❌ Before
<Textarea placeholder="Description" {...field} />

// ✅ After
<Textarea
  placeholder="Description"
  data-testid="risk-form-description-textarea"
  {...field}
/>
```

### Select/Dropdown:
```typescript
// ❌ Before
<Select>
  <FormControl>
    <SelectTrigger>
      <SelectValue placeholder="Select" />
    </SelectTrigger>
  </FormControl>
  ...
</Select>

// ✅ After
<Select>
  <FormControl>
    <SelectTrigger data-testid="risk-form-category-dropdown">
      <SelectValue placeholder="Select" />
    </SelectTrigger>
  </FormControl>
  ...
</Select>
```

### Button:
```typescript
// ❌ Before
<Button type="submit">Create</Button>

// ✅ After
<Button
  type="submit"
  data-testid={isEditMode ? "risk-form-submit-update" : "risk-form-submit-create"}
>
  {isEditMode ? "Update" : "Create"}
</Button>
```

---

**Last Updated:** January 2025
**Next Action:** Add test IDs to Risk Form component
**Estimated Time:** 3-4 hours for all remaining components
