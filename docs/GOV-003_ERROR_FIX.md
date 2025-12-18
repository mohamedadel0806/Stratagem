# Fix: 500 Error on /workflows/my-approvals

**Issue:** 500 Internal Server Error when accessing `/workflows/my-approvals` endpoint

**Root Cause:** The `getPendingApprovalsForUser` method was not handling null relations properly when mapping approval data.

**Fix Applied:**
1. Added try-catch blocks around the query and mapping
2. Added null-safe accessors for nested relations
3. Added fallback values for all fields
4. Added error logging for debugging

**Changes Made:**
- `backend/src/workflow/services/workflow.service.ts` - Enhanced `getPendingApprovalsForUser` method with robust error handling





