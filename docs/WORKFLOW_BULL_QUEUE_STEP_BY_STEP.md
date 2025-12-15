# Workflow + Bull Queue Integration - Step by Step Progress

**Date:** December 2024  
**Status:** In Progress  
**Approach:** Hybrid - Keep workflow entities, execute via Bull Queue

## Step 1: Infrastructure Setup ✅

### Completed:
- [x] Install Bull Queue dependencies (`@nestjs/bull`, `bull`, `@types/bull`)
- [x] Create Redis configuration (`redis.config.ts`)
- [x] Configure BullModule in `app.module.ts` with Redis connection
- [x] Create `GovernanceQueuesModule` with all 8 queues
- [x] Integrated queues into GovernanceModule

### Files Created:
- `backend/src/config/redis.config.ts` - Redis configuration
- `backend/src/governance/queues/governance-queues.module.ts` - Queue module

---

## Step 2: Workflow Job Interfaces ✅

### Completed:
- [x] Create workflow job interfaces

### Files Created:
- `backend/src/workflow/interfaces/workflow-job.interface.ts` - Job data structures

### Interface Definitions:
```typescript
- WorkflowExecutionJob
- WorkflowActionJob
- PolicyApprovalWorkflowJob
- WorkflowNotificationJob
```

---

## Step 3: Workflow Processor ✅

### Completed:
- [x] Create `WorkflowProcessor` for async workflow execution

### Files Created:
- `backend/src/governance/queues/processors/workflow-processor.ts` - Queue processor

### Features:
- Processes `EXECUTE_WORKFLOW` jobs
- Handles workflow execution asynchronously
- Error handling and logging

---

## Step 4: Update WorkflowService ✅

### Completed:
- [x] Inject Bull Queue into WorkflowService (optional injection)
- [x] Add `queueWorkflowExecution()` method
- [x] Update `checkAndTriggerWorkflows()` to support queue option

### Changes Made:
- Added `@InjectQueue('governance:policy')` injection (optional)
- New method: `queueWorkflowExecution()` - Queues workflow for async execution
- Updated: `checkAndTriggerWorkflows()` - Now supports `useQueue` parameter

### Files Modified:
- `backend/src/workflow/services/workflow.service.ts`
- `backend/src/workflow/workflow.module.ts`

### Key Methods Added:

#### `queueWorkflowExecution()`
```typescript
async queueWorkflowExecution(
  workflowId: string,
  entityType: EntityType,
  entityId: string,
  inputData?: Record<string, any>,
  triggeredBy?: string,
): Promise<{ executionId: string; jobId: string }>
```

This method:
1. Creates a workflow execution record
2. Queues the workflow job to Bull Queue
3. Returns execution ID and job ID
4. Falls back to synchronous execution if queue unavailable

---

## Step 5: Integration with Governance Policies ✅ COMPLETE

### Completed:
- [x] Update `PoliciesService` to trigger workflows via queue
- [x] Add workflow trigger on policy creation (ON_CREATE)
- [x] Add workflow trigger on policy status changes (ON_STATUS_CHANGE)
- [x] Add workflow trigger on policy updates (ON_UPDATE)
- [x] Import WorkflowModule into GovernanceModule

### Changes Made:
1. ✅ Updated `PoliciesService` to inject WorkflowService (optional)
2. ✅ Added workflow triggers in `create()` method
3. ✅ Added workflow triggers in `update()` method with status change detection
4. ✅ All workflows execute via Bull Queue (async)

### Files Modified:
- `backend/src/governance/policies/policies.service.ts` - Added workflow integration
- `backend/src/governance/governance.module.ts` - Added WorkflowModule import

### Key Features:
- Workflows trigger automatically on policy operations
- Status change tracking (oldStatus → newStatus)
- Error handling (workflow failures don't block policy operations)
- Async execution via Bull Queue

---

## Step 6: Testing ⏳

### To Do:
- [ ] Test workflow queuing
- [ ] Test workflow execution via processor
- [ ] Test error handling and retries
- [ ] Test fallback to synchronous execution

---

## Current Status Summary

### ✅ Completed Infrastructure:
- Bull Queue setup and configuration
- Workflow job interfaces
- Workflow processor skeleton
- WorkflowService queue integration

### 🔄 In Progress:
- Integration with Governance policies

### ⏳ Next Steps:
1. Integrate with PoliciesService
2. Test end-to-end workflow execution
3. Add monitoring and UI for workflow jobs

---

## Architecture Flow

```
Policy Status Change
        ↓
PoliciesService.update()
        ↓
WorkflowService.checkAndTriggerWorkflows(useQueue: true)
        ↓
WorkflowService.queueWorkflowExecution()
        ↓
Bull Queue (governance:policy) - EXECUTE_WORKFLOW job
        ↓
WorkflowProcessor.handleWorkflowExecution()
        ↓
WorkflowService.executeWorkflow() [synchronous execution]
        ↓
Workflow Actions (status changes, notifications, etc.)
```

---

## Key Features

1. **Backward Compatible**: Existing `executeWorkflow()` method still works synchronously
2. **Optional Queue**: Queue injection is optional, falls back to sync if unavailable
3. **Error Handling**: Automatic retries via Bull Queue
4. **Monitoring**: Job status tracking in Redis

---

## Notes

- Queue is registered in `GovernanceQueuesModule`
- WorkflowService uses `@Optional()` injection to handle queue availability
- Falls back to synchronous execution if queue is not available
- WorkflowProcessor calls existing `executeWorkflow()` method for actual execution

