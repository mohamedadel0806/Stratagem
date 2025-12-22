# Template File Access Fix

## Issue
The template file was showing "file not found" error when accessing:
- `http://localhost:3000/en/uploads/evidence-template-sample.txt`

## Root Cause
The Next.js middleware was adding locale prefixes to all paths, including static files in the `public` folder.

## Solution

### 1. Updated Middleware (`frontend/src/middleware.ts`)
- Added logic to skip locale redirect for static files
- Excluded `/uploads/` and `/downloads/` paths from locale handling
- Added file extension pattern matching for static files

### 2. Updated Form Component (`frontend/src/components/governance/evidence-form.tsx`)
- Changed from Next.js `Link` component to regular `<a>` tag
- This bypasses Next.js routing and locale handling for static files

## Correct Access URLs

The template file can now be accessed via:

✅ **Correct (without locale):**
```
http://localhost:3000/uploads/evidence-template-sample.txt
```

❌ **Incorrect (with locale):**
```
http://localhost:3000/en/uploads/evidence-template-sample.txt
```

## How It Works

1. **Static Files in Public Folder:**
   - Files in `frontend/public/` are served from the root URL
   - Path: `/uploads/evidence-template-sample.txt`
   - No locale prefix needed

2. **Middleware Behavior:**
   - Checks if path starts with `/uploads/` or `/downloads/`
   - Checks if path matches file extension pattern
   - If static file detected, skips locale redirect

3. **Form Component:**
   - Uses regular `<a>` tag instead of Next.js `Link`
   - Directly links to `/uploads/evidence-template-sample.txt`
   - Opens in new tab with `target="_blank"`

## Testing

To verify the fix works:

1. Start the frontend: `cd frontend && npm run dev`
2. Navigate to Evidence page: `http://localhost:3000/en/dashboard/governance/evidence`
3. Click "Add Evidence"
4. Click "Download Template" link in the File Upload section
5. Template file should download/open correctly

## Files Changed

1. `frontend/src/middleware.ts` - Added static file exclusion logic
2. `frontend/src/components/governance/evidence-form.tsx` - Changed Link to anchor tag

## Related Files

- Template file: `frontend/public/uploads/evidence-template-sample.txt`
- Documentation: `docs/HOW_TO_UPLOAD_EVIDENCE.md`







