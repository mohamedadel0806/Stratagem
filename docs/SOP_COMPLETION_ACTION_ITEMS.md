# SOP Frontend - Action Items for 100% Completion

**Date**: December 23, 2025  
**Current Status**: 75-80% Complete  
**Target**: 100% in 2-3 hours  

---

## Quick Summary

The SOP Module frontend is **ALMOST COMPLETE**:
- ✅ All UI pages and components built
- ✅ All basic CRUD operations working
- ✅ Execution tracking fully functional
- ❌ **ONLY MISSING**: 16 API method definitions in frontend client

**Backend is FULLY READY** - all endpoints exist, just need frontend to call them!

---

## Immediate Action Items

### CRITICAL (Do These First - 1-2 hours)

#### 1. Add SOP Version APIs to `governance.ts`
**File**: `/frontend/src/lib/api/governance.ts`
**Location**: Add to `governanceApi` object
**Methods Needed**: 3

```typescript
getSOPVersions: async (sopId: string): Promise<any[]> => {
  const response = await apiClient.get(
    `/api/v1/governance/sop-versions/sop/${sopId}/history`
  );
  return response.data || [];
},

approveSOPVersion: async (data: {
  id: string;
  status: 'approved' | 'rejected';
  approval_comments?: string;
}): Promise<any> => {
  const endpoint = data.status === 'approved'
    ? `/api/v1/governance/sop-versions/${data.id}/approve`
    : `/api/v1/governance/sop-versions/${data.id}/reject`;
  
  const response = await apiClient.post(endpoint, {
    approval_comments: data.approval_comments
  });
  return response.data;
},

rejectSOPVersion: async (data: {
  id: string;
  rejection_reason?: string;
}): Promise<any> => {
  const response = await apiClient.post(
    `/api/v1/governance/sop-versions/${data.id}/reject`,
    { rejection_reason: data.rejection_reason }
  );
  return response.data;
},
```

**Impact**: ✅ Unlocks "Versions" tab on SOP detail page

---

#### 2. Add SOP Schedule APIs to `governance.ts`
**File**: `/frontend/src/lib/api/governance.ts`
**Location**: Add to `governanceApi` object
**Methods Needed**: 4

```typescript
getSOPSchedules: async (params: { sop_id: string }): Promise<any[]> => {
  const response = await apiClient.get(
    `/api/v1/governance/sop-schedules/sop/${params.sop_id}`
  );
  return response.data || [];
},

createSOPSchedule: async (data: {
  sop_id: string;
  frequency: string;
  next_review_date?: string;
  cron_expression?: string;
}): Promise<any> => {
  const response = await apiClient.post(
    '/api/v1/governance/sop-schedules',
    data
  );
  return response.data;
},

updateSOPSchedule: async (id: string, data: any): Promise<any> => {
  const response = await apiClient.patch(
    `/api/v1/governance/sop-schedules/${id}`,
    data
  );
  return response.data;
},

deleteSOPSchedule: async (id: string): Promise<void> => {
  await apiClient.delete(`/api/v1/governance/sop-schedules/${id}`);
},
```

**Impact**: ✅ Unlocks "Reviews" tab on SOP detail page

---

### HIGH PRIORITY (Do These Next - 1-2 hours)

#### 3. Add SOP Feedback APIs to `governance.ts`
**File**: `/frontend/src/lib/api/governance.ts`
**Location**: Add to `governanceApi` object
**Methods Needed**: 3

```typescript
getSOPFeedback: async (sopId: string): Promise<any[]> => {
  const response = await apiClient.get(
    `/api/v1/governance/sop-feedback/sop/${sopId}`
  );
  return response.data || [];
},

createSOPFeedback: async (data: {
  sop_id: string;
  rating: number;
  comment?: string;
}): Promise<any> => {
  const response = await apiClient.post(
    '/api/v1/governance/sop-feedback',
    data
  );
  return response.data;
},

deleteSOPFeedback: async (id: string): Promise<void> => {
  await apiClient.delete(`/api/v1/governance/sop-feedback/${id}`);
},
```

**Impact**: ✅ Unlocks "Feedback" tab on SOP detail page

---

#### 4. Add SOP Assignment APIs to `governance.ts`
**File**: `/frontend/src/lib/api/governance.ts`
**Location**: Add to `governanceApi` object
**Methods Needed**: 2 + 2 verification

```typescript
getSOPAssignments: async (sopId: string): Promise<any[]> => {
  try {
    const response = await apiClient.get(
      `/api/v1/governance/sops/${sopId}/assignments`
    );
    return response.data || [];
  } catch {
    return [];
  }
},

deleteSOPAssignment: async (id: string): Promise<void> => {
  await apiClient.delete(`/api/v1/governance/sop-assignments/${id}`);
},
```

**Also Verify These Exist**:
```typescript
// Check if these are already in governanceApi:
getUsers: // Used in sop-assignment-dialog.tsx line 45
getRoles: // Used in sop-assignment-dialog.tsx line 50
```

**Impact**: ✅ Unlocks assignment management in detail page

---

### MEDIUM PRIORITY (30-45 mins)

#### 5. Verify/Add SOP Template APIs
**File**: `/frontend/src/lib/api/governance.ts`
**Methods to Check**: 
- `getDocumentTemplates()` - Need to verify it filters for SOP type
- `deleteDocumentTemplate()` - Need to verify it exists

```typescript
// May already exist as:
getDocumentTemplates: async (params?: {
  type?: 'sop' | 'policy' | 'procedure';
  isActive?: boolean;
}): Promise<DocumentTemplate[]> => {
  // Check if this works correctly
},

// May already exist as:
deleteDocumentTemplate: async (id: string): Promise<void> => {
  // Check if this exists
},
```

**Impact**: ✅ Ensures Template Library component works correctly

---

#### 6. Optional: Add Analytics APIs
**File**: `/frontend/src/lib/api/governance.ts`
**Methods**: 2 (Optional but nice-to-have)

```typescript
getSOPFeedbackMetrics: async (sopId: string): Promise<any> => {
  const response = await apiClient.get(
    `/api/v1/governance/sop-feedback/sop/${sopId}/metrics`
  );
  return response.data;
},

getSOPExecutionStatistics: async (sopId: string): Promise<any> => {
  const response = await apiClient.get(
    `/api/v1/governance/sop-logs/sop/${sopId}/statistics`
  );
  return response.data;
},
```

**Impact**: 🌟 Adds analytics/dashboard insights (not required for Epic 4)

---

## Implementation Guide

### Step 1: Open the governance API file
```bash
# File to edit:
/Users/adelsayed/Documents/Code/Stratagem/frontend/src/lib/api/governance.ts
```

### Step 2: Find the end of the governanceApi object
Look for the last method in the `governanceApi = { ... }` object (around line 3460)

### Step 3: Add new methods
Copy the methods from "Action Items" above and paste before the closing `}` of the governanceApi object

### Step 4: Add TypeScript interfaces (Optional but recommended)
At the top of the file, add type definitions:

```typescript
// Add near other SOP interfaces (search for SOPStatus, SOP, etc.)

interface SOPVersion {
  id: string;
  sop_id: string;
  version_number: string;
  status: 'draft' | 'pending_approval' | 'approved' | 'published' | 'rejected';
  created_at: string;
  // ... other fields
}

interface SOPSchedule {
  id: string;
  sop_id: string;
  frequency: string;
  cron_expression?: string;
  next_execution_date?: string;
  // ... other fields
}

interface SOPFeedback {
  id: string;
  sop_id: string;
  rating: number;
  comment?: string;
  sentiment?: string;
  created_at: string;
  // ... other fields
}

interface SOPAssignment {
  id: string;
  sop_id: string;
  user_id?: string;
  role_id?: string;
  assigned_at: string;
  // ... other fields
}
```

### Step 5: Test the implementation
1. Start the frontend dev server: `npm run dev`
2. Navigate to a SOP detail page
3. Click on the "Versions" tab - should load version history
4. Click on the "Reviews" tab - should show schedule options
5. Click on the "Feedback" tab - should show feedback form
6. Check the "Manage Assignments" button

### Step 6: Fix any issues
- Check browser console for errors
- Verify API endpoint paths match backend routes
- Check network tab to see actual API calls

---

## Testing Checklist

After implementing the API methods, verify:

- [ ] Versions tab loads without errors
- [ ] Can view version history timeline
- [ ] Can approve/reject versions with comments
- [ ] Reviews tab loads without errors
- [ ] Can create schedules with frequency selection
- [ ] Can delete schedules
- [ ] Next review date updates correctly
- [ ] Feedback tab loads without errors
- [ ] Can submit 5-star feedback with comments
- [ ] Can view feedback history
- [ ] Can delete feedback
- [ ] Assignment dialog shows current assignments
- [ ] Can delete assignments
- [ ] Error handling works (toast notifications)

---

## Estimated Timeline

| Phase | Tasks | Time | Impact |
|-------|-------|------|--------|
| Phase 1 | Add 3 Version APIs + 4 Schedule APIs | 1 hour | Unblocks 2 tabs |
| Phase 2 | Add 3 Feedback APIs + 2 Assignment APIs | 1 hour | Unblocks 2 tabs |
| Phase 3 | Verify template APIs + Optional analytics | 30 mins | Polish |
| Testing | Manual QA on all features | 30 mins | Quality assurance |
| **TOTAL** | **All items** | **2.5-3 hours** | **100% complete** |

---

## Files to Modify

### Primary File
```
/frontend/src/lib/api/governance.ts (Add ~16 methods)
```

### Files That Will Immediately Work Once APIs Added
1. `/frontend/src/components/governance/sop-version-history.tsx`
2. `/frontend/src/components/governance/sop-schedule-manager.tsx`
3. `/frontend/src/components/governance/sop-feedback-form.tsx`
4. `/frontend/src/components/governance/sop-assignment-dialog.tsx`
5. `/frontend/src/app/.../dashboard/governance/sops/[id]/page.tsx` (all tabs)

---

## Verification Steps

### After Phase 1 (Versions + Schedules)
Run in browser console:
```javascript
// Test version API
governanceApi.getSOPVersions('test-id')
  .then(data => console.log('Versions:', data))
  .catch(e => console.error('Error:', e))

// Test schedule API
governanceApi.getSOPSchedules({ sop_id: 'test-id' })
  .then(data => console.log('Schedules:', data))
  .catch(e => console.error('Error:', e))
```

### After Phase 2 (Feedback + Assignments)
```javascript
// Test feedback API
governanceApi.getSOPFeedback('test-id')
  .then(data => console.log('Feedback:', data))
  .catch(e => console.error('Error:', e))

// Test assignment API
governanceApi.getSOPAssignments('test-id')
  .then(data => console.log('Assignments:', data))
  .catch(e => console.error('Error:', e))
```

---

## FAQ

**Q: Do I need to modify the backend?**
A: NO! All backend endpoints already exist and are working. You only need to add frontend API client methods.

**Q: Will this break anything?**
A: NO! These are additive changes only - existing functionality remains untouched.

**Q: How do I know if the APIs are correct?**
A: The backend controller files show the exact routes:
- `/backend/src/governance/sops/controllers/sop-versions.controller.ts`
- `/backend/src/governance/sops/controllers/sop-schedules.controller.ts`
- `/backend/src/governance/sops/controllers/sop-feedback.controller.ts`

**Q: What if an endpoint doesn't exist?**
A: Use try-catch blocks for optional endpoints (like in SOPAssignmentDialog)

**Q: Can I test without all methods?**
A: Yes! Implement Phase 1 first (Versions + Schedules) to unlock 2 tabs, then Phase 2.

---

## Success Criteria

- [x] All 4 SOP pages working (✅ already done)
- [x] All 7 components built (✅ already done)
- [ ] All API methods defined (← You are here)
- [ ] Version History tab functional
- [ ] Schedule Manager tab functional
- [ ] Feedback Form tab functional
- [ ] Assignment Dialog functional
- [ ] Template Library verified working
- [ ] All error handling in place
- [ ] Testing complete

---

## Questions or Issues?

If you encounter any issues:
1. Check browser console for error messages
2. Check network tab to see actual API responses
3. Verify backend routes exist in controller files
4. Ensure correct paths in API methods

**All necessary backend infrastructure is ready - you've got this!** ✅

