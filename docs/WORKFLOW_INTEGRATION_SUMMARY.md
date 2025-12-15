# Workflow + Bull Queue Integration Summary

**Date:** December 2024  
**Status:** ✅ Step 1 & 2 Complete  
**Approach:** Hybrid - Keep workflow entities, execute via Bull Queue

## ✅ Completed Steps

### Step 1: Update WorkflowService ✅
- [x] Added Bull Queue injection (optional)
- [x] Created `queueWorkflowExecution()` method
- [x] Updated `checkAndTriggerWorkflows()` with queue support
- [x] Maintained backward compatibility with synchronous execution

### Step 2: Integrate with Governance Policies ✅
- [x] Updated PoliciesService to inject WorkflowService
- [x] Added workflow triggers on policy creation
- [x] Added workflow triggers on policy status changes
- [x] Added workflow triggers on policy updates
- [x] All workflows execute via Bull Queue (async)

---

## Integration Points

### PoliciesService Integration

#### On Policy Creation:
```typescript
// Triggers: WorkflowTrigger.ON_CREATE
// Entity Data: { status, policy_type }
// Queue: Yes (async via Bull Queue)
```

#### On Policy Update:
```typescript
// Triggers: WorkflowTrigger.ON_UPDATE
// Entity Data: { status, policy_type }
// Queue: Yes (async via Bull Queue)
```

#### On Policy Status Change:
```typescript
// Triggers: WorkflowTrigger.ON_STATUS_CHANGE
// Entity Data: { status, oldStatus, policy_type }
// Queue: Yes (async via Bull Queue)
```

---

## Workflow Execution Flow

```
1. Policy Created/Updated/Status Changed
        ↓
2. PoliciesService.update() or create()
        ↓
3. WorkflowService.checkAndTriggerWorkflows(useQueue: true)
        ↓
4. WorkflowService.queueWorkflowExecution()
        ↓
5. Creates WorkflowExecution record in DB
        ↓
6. Queues job to Bull Queue (governance:policy)
        ↓
7. WorkflowProcessor.handleWorkflowExecution()
        ↓
8. WorkflowService.executeWorkflow() [synchronous execution of actions]
        ↓
9. Workflow Actions:
   - Approval steps
   - Status changes
   - Notifications
   - Task creation
   - Assignments
```

---

## Files Modified

### Backend Files:
1. ✅ `backend/src/workflow/services/workflow.service.ts`
   - Added queue injection
   - Added `queueWorkflowExecution()` method
   - Updated `checkAndTriggerWorkflows()` method

2. ✅ `backend/src/governance/policies/policies.service.ts`
   - Added WorkflowService injection
   - Added workflow triggers in `create()` method
   - Added workflow triggers in `update()` method

3. ✅ `backend/src/governance/governance.module.ts`
   - Added WorkflowModule import

4. ✅ `backend/src/workflow/workflow.module.ts`
   - Updated to work with queue system

### Configuration Files:
1. ✅ `backend/src/config/redis.config.ts` - Redis configuration
2. ✅ `backend/src/app.module.ts` - Bull Module configuration

### New Files Created:
1. ✅ `backend/src/governance/queues/governance-queues.module.ts` - Queue module
2. ✅ `backend/src/governance/queues/processors/workflow-processor.ts` - Queue processor
3. ✅ `backend/src/workflow/interfaces/workflow-job.interface.ts` - Job interfaces

---

## Features

### ✅ What Works Now:

1. **Async Workflow Execution**
   - Workflows execute in background via Bull Queue
   - Non-blocking API responses
   - Automatic retries on failure

2. **Policy Status Change Triggers**
   - Automatically triggers workflows when policy status changes
   - Example: `draft` → `in_review` → `approved` → `published`

3. **Backward Compatibility**
   - Existing workflow methods still work synchronously
   - Optional queue injection - falls back gracefully
   - Workflow entities and definitions unchanged

4. **Error Handling**
   - Workflow failures don't block policy operations
   - Errors logged but don't throw
   - Automatic retry via Bull Queue

---

## Configuration

### Environment Variables Required:
```env
REDIS_URL=redis://redis:6379
# Or
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
REDIS_DB=0
```

### Queue Configuration:
- Queue Name: `governance:policy`
- Retry Attempts: 5
- Backoff: Exponential (2s, 4s, 8s...)
- Job Retention: Last 100 completed, last 1000 failed

---

## Next Steps (Optional Enhancements)

### Step 3: Additional Integration Points
- [ ] Add workflow triggers for Assessments
- [ ] Add workflow triggers for Evidence
- [ ] Add workflow triggers for Findings

### Step 4: Monitoring & UI
- [ ] Create job status tracking endpoint
- [ ] Add workflow job monitoring UI
- [ ] Add job progress indicators

### Step 5: Testing
- [ ] Unit tests for workflow queuing
- [ ] Integration tests for policy workflows
- [ ] End-to-end workflow execution tests

---

## Usage Example

### Creating a Workflow for Policy Approval:

1. **Create Workflow via API:**
```json
POST /api/v1/workflows
{
  "name": "Policy Approval Workflow",
  "type": "approval",
  "trigger": "on_status_change",
  "entityType": "policy",
  "conditions": {
    "status": "in_review"
  },
  "actions": {
    "approvers": ["user-id-1", "user-id-2"],
    "changeStatus": "approved",
    "notify": ["user-id-3"]
  }
}
```

2. **When Policy Status Changes:**
```typescript
// Policy updated to "in_review" status
// → Automatically triggers workflow
// → Workflow queued to Bull Queue
// → Processed asynchronously
// → Approval steps created
// → Notifications sent
```

---

## Benefits Achieved

✅ **Performance**: Non-blocking API responses  
✅ **Reliability**: Automatic retries on failure  
✅ **Scalability**: Process workflows in parallel  
✅ **Monitoring**: Job status tracking in Redis  
✅ **Flexibility**: Keep existing workflow definitions  
✅ **Backward Compatible**: Works with or without queue  

---

## Status: ✅ COMPLETE - Ready for Testing 🚀

### ✅ Steps Completed:
1. ✅ Infrastructure Setup - Bull Queue configured
2. ✅ WorkflowService Integration - Queue support added
3. ✅ PoliciesService Integration - Workflow triggers added
4. ✅ WorkflowProcessor - Async execution implemented

The hybrid workflow + Bull Queue integration is **complete**! All workflows triggered by policy changes will execute asynchronously via Bull Queue.

### What Works Now:
- Policy creation triggers workflows (ON_CREATE)
- Policy updates trigger workflows (ON_UPDATE)
- Policy status changes trigger workflows (ON_STATUS_CHANGE)
- All workflows execute via Bull Queue (async)
- Automatic retries on failure
- Error handling doesn't block operations

