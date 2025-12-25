# E2E Testing Guide: Best Practices & Troubleshooting

This document outlines the patterns and fixes implemented to stabilize the Governance E2E test suite. Use these as a guide for creating new tests or fixing flaky ones.

## 1. Authentication Stability (`auth-storage.ts`)

### The Problem
Tests often failed because Playwright moved too fast for React hydration. Checking for `currentUrl.includes('/dashboard')` was not enough because the UI might still be in a "loading" state.

### The Fix
Use a **Race Strategy** to verify session validity.
- **Race between success and failure indicators:** Wait for the `user-menu-trigger` (success) OR the `Login` button (failure).
- **Manual State Application:** Instead of relying on Playwright's opaque `storageState`, manually apply cookies and `localStorage` from the JSON state for more control.

```typescript
// Pattern: Race verification
await Promise.race([
  page.getByTestId('user-menu-trigger').waitFor({ state: 'visible', timeout: 10000 }),
  page.getByRole('link', { name: 'Login' }).waitFor({ state: 'visible', timeout: 10000 })
]);
```

---

## 2. Robust Selectors with `data-testid`

### The Problem
Text-based selectors (`getByText('Save')`) are fragile because they break if the UI copy changes or if multiple "Save" buttons appear (e.g., one in the background and one in a dialog).

### The Fix
Always prioritize `data-testid`.
- **Components updated:** `DataTableFilters`, `RichTextEditor`, `PolicyForm`.
- **Naming Convention:** Use kebab-case (e.g., `data-testid="status-dropdown"`).

```tsx
// In the component
<SelectTrigger data-testid="status-dropdown">

// In the Page Object
this.statusDropdown = page.getByTestId('status-dropdown');
```

---

## 3. Handling Complex UI States (Tabs & Dialogs)

### The Problem
Elements hidden inside tabs or dialogs will throw "Element not visible" or "Element not interactable" errors.

### The Fix: Automatic Tab Switching
Move the responsibility of navigation into the **Page Object**. Methods that interact with fields should ensure the correct tab is active.

```typescript
// Pattern: Encapsulated Tab Switching
async fillContentTab(content: string) {
  // Ensure the tab is active before interacting
  await this.page.getByRole('tab', { name: /Content/i }).click();
  await this.contentTextarea.fill(content);
}
```

### The Fix: Resilience to Re-renders
Occasionally, React re-renders a component (like a Tab list) immediately after a page load, causing "Element is detached from DOM" errors.
- **Small Delays:** Use a small `waitForTimeout(500)` or a retry-aware `waitFor()` before clicking dynamic elements like tabs.

---

## 4. Page Object Model (POM) Design

### Clean Selectors
Don't use global selectors in the constructor if you can scope them to a specific container (like a dialog).

```typescript
constructor(page: Page) {
  this.page = page;
  this.dialog = page.getByTestId('policy-dialog');
  // Scope fields to the dialog to avoid "Strict mode violation"
  this.titleInput = this.dialog.getByLabel('Title');
}
```

### Strict Mode Violations
If a selector matches multiple elements (e.g., two "Alerts" headers), use `.first()` or `.or()` with more specificity.

```typescript
// Pattern: Flexible but specific locator
this.alertsList = page.getByTestId('alerts-list')
  .or(page.locator('.space-y-4').filter({ hasText: /Active Alerts/i }))
  .first();
```

---

## 5. Summary of Best Practices
1. **Never use hardcoded sleeps** (`page.waitForTimeout(5000)`) unless absolutely necessary for animation stabilization. Favor `await locator.waitFor()`.
2. **Use Regex for text matching** to handle case sensitivity and partial matches: `getByRole('button', { name: /Create Rule/i })`.
3. **Take Screenshots on Failure:** Use Playwright's automatic screenshot feature or manually trigger them in fixtures for diagnostic logs.
4. **Pass Props for Pagination:** Ensure any component that relies on metadata (like `Pagination`) receives all required props (`totalItems`, `itemsPerPage`) to avoid TypeScript errors that block build pipelines.
