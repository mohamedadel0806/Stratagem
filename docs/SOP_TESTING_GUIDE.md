# SOP Frontend Testing Guide

**Date**: December 23, 2025  
**Status**: Ready for Testing  
**Target**: Verify all 15 API methods work correctly  

---

## Quick Start

### Prerequisites
1. Backend running: `docker-compose up -d`
2. Frontend ready: `cd frontend && npm run dev`
3. Browser open: http://localhost:3000

### Verification Already Complete
✅ All 15 API methods have been added to `/frontend/src/lib/api/governance.ts`
✅ Verified with test script: `npm run test:sop-apis`

---

## Phase 1 Testing: Versions & Schedules

### Part A: Test Version History

#### 1. Navigate to SOP Detail Page
```
1. Open browser http://localhost:3000
2. Login with test credentials
3. Go to Governance → SOPs
4. Click on any SOP to open detail page
5. Look for 4 tabs: Overview | Versions | Reviews | Feedback
```

#### 2. Test Versions Tab
```
Steps:
  1. Click "Versions" tab
  2. Page should load version history (may be empty if new SOP)
  3. Open browser DevTools (F12)
  4. Go to Console tab
  5. Run: governanceApi.getSOPVersions('YOUR_SOP_ID')
  6. Should return array of versions ([] if no versions yet)

Expected:
  ✅ Tab loads without errors
  ✅ Console shows successful response
  ✅ Returns array (even if empty)

Troubleshoot:
  ❌ No data? Check SOP has versions in backend
  ❌ Error? Check backend logs: docker-compose logs backend
```

#### 3. Test Version Approval/Rejection
```
If versions exist:
  1. Look for "Approve" and "Reject" buttons
  2. Click "Approve" on any version
  3. Add optional comment
  4. Click confirm
  5. Should update backend
  6. List should refresh

Expected:
  ✅ Buttons clickable
  ✅ Comment field appears
  ✅ Confirmation dialog shows
  ✅ List updates after approval
  
Verify in Console:
  governanceApi.approveSOPVersion({
    id: 'VERSION_ID',
    status: 'approved',
    approval_comments: 'Looks good!'
  })
```

#### 4. Test Version API Methods
```javascript
// In browser console (F12)

// Get all versions for a SOP
const sopId = 'YOUR_SOP_ID_HERE';

// Test: getSOPVersions
await governanceApi.getSOPVersions(sopId)
  .then(data => console.log('✅ Versions:', data))
  .catch(e => console.error('❌ Error:', e.message))

// Expected: Array of version objects with fields like:
// { id, sopId, versionNumber, status, createdAt, etc. }
```

### Part B: Test Schedule Management

#### 1. Navigate to Reviews Tab
```
Steps:
  1. On same SOP detail page
  2. Click "Reviews" tab
  3. Should show existing schedules (may be empty)
  4. Look for "Add Schedule" or "Create Schedule" button
```

#### 2. Test Get Schedules
```javascript
// In browser console (F12)

const sopId = 'YOUR_SOP_ID_HERE';

// Test: getSOPSchedules
await governanceApi.getSOPSchedules({ sop_id: sopId })
  .then(data => console.log('✅ Schedules:', data))
  .catch(e => console.error('❌ Error:', e.message))

// Expected: Array (empty or with schedule objects)
```

#### 3. Test Create Schedule
```javascript
// In browser console (F12)

const newSchedule = {
  sop_id: 'YOUR_SOP_ID_HERE',
  frequency: 'monthly',
  next_review_date: '2025-01-23'
};

// Test: createSOPSchedule
await governanceApi.createSOPSchedule(newSchedule)
  .then(data => console.log('✅ Created:', data))
  .catch(e => console.error('❌ Error:', e.message))

// Expected: Newly created schedule object with ID
```

#### 4. Test Update Schedule
```javascript
// After creating a schedule (copy the ID from response above)

const scheduleId = 'SCHEDULE_ID_FROM_PREVIOUS_RESPONSE';
const updates = {
  frequency: 'quarterly'  // Change from monthly to quarterly
};

// Test: updateSOPSchedule
await governanceApi.updateSOPSchedule(scheduleId, updates)
  .then(data => console.log('✅ Updated:', data))
  .catch(e => console.error('❌ Error:', e.message))

// Expected: Updated schedule object
```

#### 5. Test Delete Schedule
```javascript
// Using the schedule ID from above

const scheduleId = 'SCHEDULE_ID_FROM_PREVIOUS_RESPONSE';

// Test: deleteSOPSchedule
await governanceApi.deleteSOPSchedule(scheduleId)
  .then(() => console.log('✅ Deleted successfully'))
  .catch(e => console.error('❌ Error:', e.message))

// Expected: No error (void method)
```

#### 6. Test UI for Schedule Management
```
Steps:
  1. Click "Add Schedule" button in Reviews tab
  2. Select frequency (monthly, quarterly, yearly, etc.)
  3. Optionally set next review date
  4. Click "Save"
  5. New schedule should appear in list
  6. Click delete/trash icon on schedule
  7. Confirm deletion
  8. Schedule should disappear from list

Expected:
  ✅ Form appears/disappears correctly
  ✅ Frequency dropdown works
  ✅ Date picker works (if shown)
  ✅ Save button creates schedule
  ✅ Delete button removes schedule
  ✅ List updates after changes
```

---

## Phase 2 Testing: Feedback

### Part A: Test Feedback Tab

#### 1. Navigate to Feedback Tab
```
Steps:
  1. On same SOP detail page
  2. Click "Feedback" tab
  3. Should show existing feedback (may be empty)
  4. Look for feedback form or "Add Feedback" button
```

#### 2. Test Get Feedback
```javascript
// In browser console (F12)

const sopId = 'YOUR_SOP_ID_HERE';

// Test: getSOPFeedback
await governanceApi.getSOPFeedback(sopId)
  .then(data => console.log('✅ Feedback:', data))
  .catch(e => console.error('❌ Error:', e.message))

// Expected: Array (empty or with feedback objects)
// Each feedback should have: id, sopId, rating, comment, author, createdAt, etc.
```

#### 3. Test Create Feedback
```javascript
// In browser console (F12)

const newFeedback = {
  sop_id: 'YOUR_SOP_ID_HERE',
  rating: 5,  // 1-5 stars
  comment: 'This SOP is very clear and well-organized!'
};

// Test: createSOPFeedback
await governanceApi.createSOPFeedback(newFeedback)
  .then(data => console.log('✅ Created:', data))
  .catch(e => console.error('❌ Error:', e.message))

// Expected: Newly created feedback object with ID and author info
```

#### 4. Test Delete Feedback
```javascript
// After creating feedback (copy the ID from response above)

const feedbackId = 'FEEDBACK_ID_FROM_PREVIOUS_RESPONSE';

// Test: deleteSOPFeedback
await governanceApi.deleteSOPFeedback(feedbackId)
  .then(() => console.log('✅ Deleted successfully'))
  .catch(e => console.error('❌ Error:', e.message))

// Expected: No error (void method)
```

#### 5. Test UI for Feedback
```
Steps:
  1. In Feedback tab, look for star rating control
  2. Click on stars to set rating (1-5)
  3. Enter optional comment
  4. Click "Submit Feedback" or similar button
  5. Feedback should appear in list
  6. Should show your username/avatar
  7. Should show rating and comment
  8. Should have delete button (if you're the author)
  9. Click delete to remove your feedback
  10. Feedback should disappear from list

Expected:
  ✅ Star rating clickable (shows visual feedback)
  ✅ Comment field optional (accepts text)
  ✅ Submit button disabled until rating selected
  ✅ Feedback appears in list immediately
  ✅ Author info shows correctly
  ✅ Rating displays as stars
  ✅ Delete button works for own feedback
  ✅ List updates after changes
```

---

## Phase 3 Testing: Assignments

### Part A: Test Assignment Dialog

#### 1. Find Assignment Section
```
Steps:
  1. On SOP detail page (Overview tab)
  2. Look for "Assign" button or "Assignments" section
  3. Click to open assignment dialog/modal
```

#### 2. Test Get Assignments
```javascript
// In browser console (F12)

const sopId = 'YOUR_SOP_ID_HERE';

// Test: getSOPAssignments
await governanceApi.getSOPAssignments(sopId)
  .then(data => console.log('✅ Assignments:', data))
  .catch(e => console.error('❌ Error:', e.message))

// Expected: Array (empty or with assignment objects)
// Each assignment should have: id, sopId, userId/roleId, assignedAt, assignedBy, etc.
```

#### 3. Test Get Users for Dropdown
```javascript
// In browser console (F12)

// Test: getUsers
await governanceApi.getUsers()
  .then(data => console.log('✅ Users:', data.length, 'found'))
  .catch(e => console.error('❌ Error:', e.message))

// Expected: Array of user objects
// Each user should have: id, name, email, etc.
```

#### 4. Test Get Roles for Dropdown
```javascript
// In browser console (F12)

// Test: getRoles
await governanceApi.getRoles()
  .then(data => console.log('✅ Roles:', data.length, 'found'))
  .catch(e => console.error('❌ Error:', e.message))

// Expected: Array of role objects
// Each role should have: id, name, description, etc.
```

#### 5. Test Create Assignment
```javascript
// In browser console (F12)

const newAssignment = {
  sop_id: 'YOUR_SOP_ID_HERE',
  user_id: 'USER_ID_FROM_GETUSERS',  // or
  // role_id: 'ROLE_ID_FROM_GETROLES'
};

// Test: createSOPAssignment
await governanceApi.createSOPAssignment(newAssignment)
  .then(data => console.log('✅ Created:', data))
  .catch(e => console.error('❌ Error:', e.message))

// Expected: Newly created assignment object with ID
```

#### 6. Test Delete Assignment
```javascript
// Using assignment ID from above

const assignmentId = 'ASSIGNMENT_ID_FROM_PREVIOUS_RESPONSE';

// Test: deleteSOPAssignment
await governanceApi.deleteSOPAssignment(assignmentId)
  .then(() => console.log('✅ Deleted successfully'))
  .catch(e => console.error('❌ Error:', e.message))

// Expected: No error (void method)
```

#### 7. Test UI for Assignments
```
Steps:
  1. Open Assignment dialog
  2. Should show list of current assignments (if any)
  3. Look for "Add Assignment" or similar button
  4. Click to add new assignment
  5. User dropdown should populate with users
  6. Role dropdown should populate with roles
  7. Select a user OR role (or both)
  8. Click "Assign" or "Save"
  9. New assignment should appear in list
  10. Should show assigned user/role
  11. Should show assign date
  12. Should have delete button
  13. Click delete on any assignment
  14. Confirm deletion
  15. Assignment should disappear

Expected:
  ✅ Dialog appears/closes correctly
  ✅ User dropdown loads and shows users
  ✅ Role dropdown loads and shows roles
  ✅ Can select user, role, or both
  ✅ Save button creates assignment
  ✅ List updates immediately
  ✅ Shows assigned user/role correctly
  ✅ Delete button works
  ✅ Confirmation dialog shows before delete
  ✅ List updates after delete
```

---

## Complete Integration Test

### Scenario: Full SOP Workflow

```javascript
// This tests all features together in a realistic workflow

const sopId = 'YOUR_TEST_SOP_ID';

// 1. Get the SOP details
console.log('1️⃣ Loading SOP details...');
const sop = await governanceApi.getSOP(sopId);
console.log('✅ SOP:', sop.title);

// 2. Load version history
console.log('2️⃣ Loading version history...');
const versions = await governanceApi.getSOPVersions(sopId);
console.log('✅ Versions:', versions.length);

// 3. Load review schedules
console.log('3️⃣ Loading review schedules...');
const schedules = await governanceApi.getSOPSchedules({ sop_id: sopId });
console.log('✅ Schedules:', schedules.length);

// 4. Create a new schedule
console.log('4️⃣ Creating review schedule...');
const newSchedule = await governanceApi.createSOPSchedule({
  sop_id: sopId,
  frequency: 'monthly'
});
console.log('✅ Created schedule:', newSchedule.id);

// 5. Load feedback
console.log('5️⃣ Loading feedback...');
const feedback = await governanceApi.getSOPFeedback(sopId);
console.log('✅ Feedback count:', feedback.length);

// 6. Add feedback
console.log('6️⃣ Adding feedback...');
const newFeedback = await governanceApi.createSOPFeedback({
  sop_id: sopId,
  rating: 4,
  comment: 'Well structured, could use more examples'
});
console.log('✅ Added feedback:', newFeedback.id);

// 7. Load assignments
console.log('7️⃣ Loading assignments...');
const assignments = await governanceApi.getSOPAssignments(sopId);
console.log('✅ Assignments:', assignments.length);

// 8. Get users for assignment
console.log('8️⃣ Loading users...');
const users = await governanceApi.getUsers();
console.log('✅ Users available:', users.length);

// 9. Get roles for assignment
console.log('9️⃣ Loading roles...');
const roles = await governanceApi.getRoles();
console.log('✅ Roles available:', roles.length);

// 10. Create an assignment
console.log('🔟 Creating assignment...');
const newAssignment = await governanceApi.createSOPAssignment({
  sop_id: sopId,
  user_id: users[0].id  // Assign to first user
});
console.log('✅ Created assignment:', newAssignment.id);

console.log('\n✅✅✅ All API methods working! ✅✅✅');
```

---

## Troubleshooting

### Issue: "Method not found" error

**Symptom**: `governanceApi.getSOPVersions is not a function`

**Solutions**:
1. Clear browser cache (Ctrl+Shift+Delete)
2. Restart frontend: Kill npm run dev, run again
3. Verify file modified correctly:
   ```bash
   grep -n "getSOPVersions" frontend/src/lib/api/governance.ts
   ```
4. Check for syntax errors:
   ```bash
   node scripts/test-sop-apis.js
   ```

### Issue: API returns 404 error

**Symptom**: `Error: 404 Not Found`

**Solutions**:
1. Verify backend is running:
   ```bash
   docker-compose ps
   ```
2. Check backend logs:
   ```bash
   docker-compose logs backend | tail -50
   ```
3. Verify SOP ID is correct (not fake IDs)
4. Check if backend endpoint exists:
   ```bash
   grep -r "sop-versions" backend/src/governance/
   ```

### Issue: Empty responses

**Symptom**: API call returns `[]` (empty array)

**Causes**:
- New SOP has no versions yet (normal)
- No schedules created yet (normal)
- No feedback submitted yet (normal)
- No assignments created yet (normal)

**Solution**: Create test data first, then query again

### Issue: Form not submitting

**Symptom**: Click "Save" but nothing happens

**Solutions**:
1. Check browser console for JavaScript errors
2. Verify form has required fields filled
3. Check DevTools Network tab for failed requests
4. Look for validation error messages on form

---

## Browser DevTools Debugging

### Console Tests (F12 → Console Tab)

```javascript
// Quick health check
console.log(typeof governanceApi.getSOPVersions);
// Should print: "function"

// Check if API client is working
await governanceApi.getSOPVersions('test')
  .then(() => console.log('✅ API working'))
  .catch(e => console.log('❌', e.message))

// Monitor all API calls
// Open Network tab (F12 → Network) and perform actions
// Should see requests to /api/v1/governance/* endpoints
```

### Network Tab (F12 → Network Tab)

1. Open Network tab
2. Perform an action (click "Add Schedule", etc.)
3. Look for requests to `/api/v1/governance/...`
4. Click on request to see:
   - Headers
   - Request body
   - Response body
   - Status code (200, 404, 500, etc.)

### Common Status Codes

| Code | Meaning | Action |
|------|---------|--------|
| 200 | ✅ Success | Data loaded correctly |
| 201 | ✅ Created | New resource created |
| 204 | ✅ No content | Delete successful |
| 400 | ❌ Bad request | Check request format |
| 401 | ❌ Unauthorized | Need to login |
| 404 | ❌ Not found | Wrong endpoint or ID |
| 500 | ❌ Server error | Backend crashed, check logs |

---

## Success Checklist

After completing all tests, verify:

### Versions Tab
- [ ] Tab loads without errors
- [ ] Shows version history (if versions exist)
- [ ] Approve button works
- [ ] Reject button works
- [ ] Comments field works
- [ ] List updates after approval

### Reviews Tab
- [ ] Tab loads without errors
- [ ] Shows existing schedules
- [ ] "Add Schedule" button works
- [ ] Frequency dropdown works
- [ ] Schedule can be created
- [ ] Schedule can be updated
- [ ] Schedule can be deleted
- [ ] List updates after changes

### Feedback Tab
- [ ] Tab loads without errors
- [ ] Shows existing feedback
- [ ] Star rating control works
- [ ] Comment field works
- [ ] Feedback can be submitted
- [ ] New feedback appears in list
- [ ] Shows author info correctly
- [ ] Delete works (own feedback)
- [ ] List updates after changes

### Assignments
- [ ] Assignment dialog opens/closes
- [ ] Shows existing assignments
- [ ] User dropdown populates
- [ ] Role dropdown populates
- [ ] Can create assignment
- [ ] New assignment appears in list
- [ ] Can delete assignment
- [ ] List updates after changes

---

## Performance Notes

### Expected Response Times
- Load SOP details: < 500ms
- Load versions: < 500ms
- Load schedules: < 500ms
- Load feedback: < 500ms
- Load assignments: < 500ms
- Create/update/delete: < 1000ms

If slower:
1. Check backend performance: `docker stats`
2. Check network latency: DevTools Network tab
3. Check database queries: Backend logs

---

## Next Steps After Testing

1. **All tests pass** ✅
   - Mark as complete
   - Deploy to staging
   - Create git commit

2. **Some tests fail** ❌
   - Note which methods fail
   - Check backend endpoints
   - Verify request format
   - Update API methods if needed

3. **Backend issues** 🔧
   - Check backend logs
   - Restart backend service
   - Run migrations if needed
   - Verify database connectivity

---

## Test Report Template

Save this for your test results:

```
SOP Frontend Test Report
Date: [DATE]
Tester: [NAME]

Versions Tab:
  - Load: ✅/❌
  - Approve: ✅/❌
  - Reject: ✅/❌
  - Comments: ✅/❌

Reviews Tab:
  - Load: ✅/❌
  - Create: ✅/❌
  - Update: ✅/❌
  - Delete: ✅/❌

Feedback Tab:
  - Load: ✅/❌
  - Create: ✅/❌
  - Delete: ✅/❌

Assignments:
  - Load: ✅/❌
  - Create: ✅/❌
  - Delete: ✅/❌

Overall: ✅/❌ PASS/FAIL

Issues Found:
[List any issues]

Notes:
[Any additional notes]
```

---

## Support

If issues occur:
1. Check this guide's troubleshooting section
2. Review backend logs
3. Verify all 15 methods exist: `node scripts/test-sop-apis.js`
4. Check API endpoint format matches backend routes

---

**Good luck with testing!** 🚀

All 15 API methods are in place. The frontend is ready to communicate with the backend.

