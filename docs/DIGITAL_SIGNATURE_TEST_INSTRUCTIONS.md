# Digital Signature Test Instructions

## Issue: No Approvals Showing in Frontend

### Problem
The test script creates approvals successfully, but they don't appear in the frontend at `http://localhost:3000/en/dashboard/workflows/approvals`.

### Root Cause
The approval was created for user `compliance@grcplatform.com` (ID: `01180d49-d38b-4421-a130-b1ce4b7c34fa`). To see the approval, you must be **logged in as that user**.

### Solution

#### Option 1: Log in as the Correct User (Recommended)

1. **Log out** of the current session (if logged in)
2. **Log in** with:
   - Email: `compliance@grcplatform.com`
   - Password: (check your seed data or user creation script)
3. Navigate to: `http://localhost:3000/en/dashboard/workflows/approvals`
4. You should now see the pending approval

#### Option 2: Update Test Script to Use Your User

If you want to use a different user, update the test script to create the approval for your logged-in user ID.

### Verification Steps

1. **Check which user you're logged in as:**
   - Look at the top-right corner of the frontend (user menu)
   - Or check browser DevTools → Application → Cookies → `next-auth.session-token`

2. **Check the approval in database:**
   ```sql
   SELECT 
     wa.id,
     wa.status,
     u.email as approver_email,
     we."entityType",
     we."entityId"
   FROM workflow_approvals wa
   JOIN users u ON u.id = wa."approverId"
   JOIN workflow_executions we ON we.id = wa."workflowExecutionId"
   WHERE wa.status = 'pending';
   ```

3. **Test the API directly:**
   ```bash
   # First, get a token by logging in
   # Then test the endpoint:
   curl -H "Authorization: Bearer YOUR_TOKEN" \
        http://localhost:3001/api/v1/workflows/my-approvals
   ```

### Fixed Issues

✅ **Service Method Fixed**: Changed `execution?.entity_type` to `execution?.entityType` to match entity property names

### Test Data Created

- **Policy ID**: `bdce65a7-d0c9-4f91-9185-210b53e1588e`
- **Workflow ID**: `66ede8db-0d7d-47cf-b403-966aa0fa949a`
- **Execution ID**: `6da7e623-8e5d-4ab8-a5d6-904994c10894`
- **Approval ID**: `d3d168cf-fe2c-457f-afd9-8cf63b4e0ed4`
- **Approver**: `compliance@grcplatform.com` (ID: `01180d49-d38b-4421-a130-b1ce4b7c34fa`)

### Quick Test

1. **Log in as**: `compliance@grcplatform.com`
2. **Navigate to**: `http://localhost:3000/en/dashboard/workflows/approvals`
3. **You should see**: "Test Digital Signature Policy" approval
4. **Click**: "Sign & Approve" to test digital signature

---

**Last Updated**: December 2025




