# Workflow + Bull Queue Hybrid Integration

**Date:** December 2024  
**Status:** In Progress  
**Approach:** Hybrid - Keep workflow entities, execute via Bull Queue

## Overview

This document describes the hybrid integration between the existing Workflow system and Bull Queue. We keep the workflow entities (definitions, executions, approvals) but execute workflow actions asynchronously via Bull Queue for better performance, retries, and monitoring.

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│              Workflow System (Entities & Definitions)        │
│  - Workflow (definitions)                                   │
│  - WorkflowExecution (tracking)                             │
│  - WorkflowApproval (approvals)                             │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│              WorkflowService                                 │
│  - checkAndTriggerWorkflows() → Queues jobs                 │
│  - executeWorkflow() → Queues job (async)                   │
│  - approve() → Triggers next workflow step                  │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│              Bull Queue (governance:policy)                  │
│  - EXECUTE_WORKFLOW job                                     │
│  - EXECUTE_WORKFLOW_ACTION job                              │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│              WorkflowProcessor                               │
│  - handleWorkflowExecution()                                │
│  - handleWorkflowAction()                                   │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│              Workflow Actions Execution                      │
│  - Status changes                                           │
│  - Notifications                                            │
│  - Assignments                                              │
│  - Task creation                                            │
│  - Approval steps                                           │
└─────────────────────────────────────────────────────────────┘
```

## Key Components

### 1. Workflow Entities (Kept)
- **Workflow**: Workflow definitions, triggers, conditions, actions
- **WorkflowExecution**: Tracks workflow execution status and metadata
- **WorkflowApproval**: Manages approval steps and responses

### 2. WorkflowService (Enhanced)
- Keeps existing methods for backward compatibility
- Adds methods to queue workflows instead of executing synchronously
- Methods:
  - `queueWorkflowExecution()` - Queues workflow to Bull Queue
  - `checkAndTriggerWorkflows()` - Updated to queue jobs
  - Existing approval methods remain unchanged

### 3. Bull Queue Integration
- **Queue**: `governance:policy` (shared with policy operations)
- **Job Types**:
  - `EXECUTE_WORKFLOW` - Execute a complete workflow
  - `EXECUTE_WORKFLOW_ACTION` - Execute a specific workflow action

### 4. WorkflowProcessor
- Processes workflow execution jobs asynchronously
- Calls WorkflowService methods to execute actions
- Handles errors and retries automatically

## Implementation Status

### ✅ Completed
- [x] Install Bull Queue dependencies
- [x] Configure Redis connection and Bull Module
- [x] Create GovernanceQueuesModule with all queues
- [x] Create workflow job interfaces
- [x] Create WorkflowProcessor skeleton

### 🔄 In Progress
- [ ] Update WorkflowService to queue jobs
- [ ] Integrate with Governance PoliciesService
- [ ] Add workflow execution methods to processor
- [ ] Test workflow execution via Bull Queue

### ⏳ Pending
- [ ] Update workflow triggers to use queues
- [ ] Add job status tracking
- [ ] Create UI for monitoring workflow jobs
- [ ] Documentation and examples

## Usage Examples

### Triggering a Workflow (Future)

```typescript
// In PoliciesService
async update(id: string, updateDto: UpdatePolicyDto, userId: string) {
  const policy = await this.findOne(id);
  const oldStatus = policy.status;
  
  Object.assign(policy, updateDto, { updated_by: userId });
  await this.policyRepository.save(policy);
  
  // Trigger workflows if status changed
  if (oldStatus !== policy.status) {
    await this.workflowService.checkAndTriggerWorkflows(
      EntityType.POLICY,
      policy.id,
      WorkflowTrigger.ON_STATUS_CHANGE,
      { status: policy.status, oldStatus },
    );
  }
  
  return policy;
}
```

### Queueing a Workflow Execution

```typescript
// In WorkflowService
async queueWorkflowExecution(
  workflowId: string,
  entityType: EntityType,
  entityId: string,
  inputData?: Record<string, any>,
): Promise<string> {
  // Create execution record
  const execution = this.executionRepository.create({
    workflowId,
    entityType,
    entityId,
    status: WorkflowExecutionStatus.IN_PROGRESS,
    inputData,
    startedAt: new Date(),
  });
  const savedExecution = await this.executionRepository.save(execution);
  
  // Queue job
  const job = await this.workflowQueue.add('EXECUTE_WORKFLOW', {
    workflowId,
    entityType,
    entityId,
    executionId: savedExecution.id,
    inputData,
  });
  
  return job.id;
}
```

## Benefits

1. **Async Processing**: Workflows don't block API responses
2. **Retries**: Automatic retry on failure with exponential backoff
3. **Monitoring**: Track job status, progress, and failures
4. **Scalability**: Process workflows in parallel across workers
5. **Reliability**: Jobs persist in Redis, survive server restarts
6. **Backward Compatible**: Existing workflow entities and definitions remain

## Next Steps

1. Implement `queueWorkflowExecution()` in WorkflowService
2. Update workflow trigger methods to use queues
3. Integrate with Governance policies status changes
4. Test end-to-end workflow execution
5. Add monitoring and UI for workflow jobs




