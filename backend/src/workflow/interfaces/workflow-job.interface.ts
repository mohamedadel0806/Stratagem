/**
 * Workflow Job Interfaces for Bull Queue Integration
 * 
 * These interfaces define the job data structures used when
 * executing workflows via Bull Queue.
 */

export interface WorkflowExecutionJob {
  workflowId: string;
  entityType: string;
  entityId: string;
  executionId: string;
  inputData?: Record<string, any>;
  triggeredBy?: string; // userId who triggered
  triggerType: 'manual' | 'automatic';
}

export interface WorkflowActionJob {
  executionId: string;
  workflowId: string;
  entityType: string;
  entityId: string;
  actionType: 'status_change' | 'notification' | 'assignment' | 'task_creation' | 'approval';
  actionData: Record<string, any>;
}

export interface PolicyApprovalWorkflowJob {
  policyId: string;
  workflowId: string;
  approvers: string[];
  currentStep: number;
  executionId: string;
}

export interface WorkflowNotificationJob {
  executionId: string;
  userIds: string[];
  workflowName: string;
  entityType: string;
  entityId: string;
  notificationType: 'approval_request' | 'workflow_triggered' | 'workflow_completed' | 'workflow_rejected';
}




