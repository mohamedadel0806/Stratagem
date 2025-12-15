# React Hydration Mismatch Fix

## Problem

React hydration errors occurred with Radix UI `DropdownMenu` components:

```
A tree hydrated but some attributes of the server rendered HTML didn't match the client properties.
```

This appeared in console as:
```
id="radix-_R_qitqbmmlb_"  (client)
id="radix-_R_36itqbmmlb_" (server)
```

## Root Cause

Radix UI's DropdownMenu primitive generates unique IDs dynamically on each render. During server-side rendering (SSR), these IDs are generated one way, but during client-side hydration, they're regenerated differently, causing a mismatch.

### Why It Happened

1. **SSR Render**: Next.js renders components on server and generates Radix UI IDs (e.g., `radix-_R_36itqbmmlb_`)
2. **HTML sent to client**: Browser receives HTML with server-generated IDs
3. **Client Hydration**: React re-renders components on client, Radix UI generates new IDs (e.g., `radix-_R_qitqbmmlb_`)
4. **Mismatch**: Client IDs don't match server IDs → hydration error

## Solution

Only render `DropdownMenu` components on the client side, after hydration is complete. Use a `mounted` state to track when the component is ready for client-side rendering.

### Pattern

```tsx
'use client';

import { useState, useEffect } from 'react';

export function MyComponent() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Render fallback UI on server
    return <Button variant="outline">Export</Button>;
  }

  // Only render DropdownMenu on client
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">Export</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {/* Content */}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
```

## Components Fixed

### 1. `NotificationBell` Component
**File**: `frontend/src/components/notifications/notification-bell.tsx`

**Changes**:
- Already had `mounted` state check
- Improved comment explaining why this pattern is necessary
- Full DropdownMenu only renders when `mounted === true`
- Server fallback: Simple Bell button with badge

### 2. `ExportButton` Component
**File**: `frontend/src/components/export/export-button.tsx`

**Changes**:
- Added `mounted` state with `useEffect` hook
- Added import for `useState` and `useEffect`
- Server render: Simple Export button
- Client render: Full DropdownMenu with CSV/PDF export options

### 3. `AssetAuditTrail` Component
**File**: `frontend/src/components/assets/asset-audit-trail.tsx`

**Changes**:
- Added `useEffect` to imports
- Added `mounted` state initialization
- Added `useEffect` hook to set mounted on component mount
- Wrapped DropdownMenu with `{mounted && (...)}`
- Added fallback button for server render
- Added comments explaining hydration fix

## Implementation Details

### Why `useEffect` Works

The `useEffect` hook runs only on the client after hydration is complete:

1. **Initial render** (server): `mounted = false` → renders fallback
2. **Hydration**: Browser hydrates with fallback UI
3. **After hydration**: `useEffect` fires → `setMounted(true)`
4. **Re-render**: Component re-renders with `mounted = true` → DropdownMenu renders
5. **No mismatch**: Server and client now have matching HTML

### Fallback Rendering

All three components provide fallback UI for SSR:
- `NotificationBell`: Simple button with bell icon
- `ExportButton`: Simple Export button
- `AssetAuditTrail`: Simple Download button

This ensures the UI is functional and accessible even before hydration completes.

## Testing

To verify the fix works:

1. Open browser DevTools Console
2. Look for hydration warnings (should be gone)
3. Click dropdown components - they should open/close correctly
4. Check that export functionality works
5. Verify no layout shift occurs during hydration

## Related Documentation

- [Next.js Hydration Error Guide](https://nextjs.org/docs/messages/react-hydration-error)
- [React Hydration Mismatch](https://react.dev/link/hydration-mismatch)
- [Radix UI Documentation](https://www.radix-ui.com/)

## Prevention for Future Development

When using Radix UI components (especially those with dynamic IDs like DropdownMenu, Dialog, Popover, etc.) in Next.js:

1. Always wrap in `mounted` check if rendering on server
2. Provide fallback UI for server render
3. Only render interactive primitives on client
4. Use `useEffect` to gate client-side rendering

Example template for new components:

```tsx
'use client';

import { useState, useEffect } from 'react';

export function NewComponent() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <SimpleFallback />;
  }

  return <RadixUIComponent />;
}
```

---

**Fixed**: December 4, 2025  
**Components Modified**: 3  
**Status**: ✅ Complete
