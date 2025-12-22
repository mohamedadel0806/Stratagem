import { apiClient } from './client';

export interface Workflow {
  id: string;
  name: string;
  description?: string;
  type: 'approval' | 'notification' | 'escalation' | 'status_change' | 'deadline_reminder';
  status: 'active' | 'inactive' | 'archived';
  trigger: 'manual' | 'on_create' | 'on_update' | 'on_status_change' | 'on_deadline_approaching' | 'on_deadline_passed' | 'scheduled';
  entityType: 'risk' | 'policy' | 'compliance_requirement' | 'task' | 'sop';
  conditions?: Record<string, any>;
  actions: WorkflowActions;
  daysBeforeDeadline?: number;
  createdAt: string;
  updatedAt: string;
}

export interface WorkflowActions {
  approvers?: string[];
  changeStatus?: string;
  assignTo?: string;
  notify?: string[];
  createTask?: {
    title: string;
    description?: string;
    priority?: string;
    dueDate?: string;
    assigneeId?: string;
  };
}

export interface CreateWorkflowData {
  name: string;
  description?: string;
  type: Workflow['type'];
  trigger: Workflow['trigger'];
  entityType: Workflow['entityType'];
  conditions?: Record<string, any>;
  actions: WorkflowActions;
  daysBeforeDeadline?: number;
}

export interface Approval {
  id: string;
  workflowExecutionId: string;
  approverId: string;
  approverName: string;
  status: 'pending' | 'approved' | 'rejected' | 'cancelled';
  comments?: string;
  stepOrder: number;
  respondedAt?: string;
  createdAt: string;
}

export interface PendingApproval {
  id: string;
  workflowExecutionId: string;
  workflowName: string;
  workflowType: Workflow['type'];
  entityType: string;
  entityId: string;
  status: 'pending';
  stepOrder: number;
  createdAt: string;
}

export interface WorkflowExecution {
  id: string;
  workflowId: string;
  workflowName: string;
  workflowType: Workflow['type'];
  entityType: string;
  entityId: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed' | 'cancelled';
  errorMessage?: string;
  inputData?: Record<string, any>;
  startedAt?: string;
  completedAt?: string;
  createdAt: string;
  approvals?: Approval[];
}

export interface WorkflowTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  workflow: Omit<CreateWorkflowData, 'name' | 'description'>;
}

export const workflowsApi = {
  getAll: async (): Promise<Workflow[]> => {
    const response = await apiClient.get<Workflow[]>('/api/v1/workflows');
    return response.data;
  },

  getById: async (id: string): Promise<Workflow> => {
    const response = await apiClient.get<Workflow>(`/api/v1/workflows/${id}`);
    return response.data;
  },

  create: async (data: CreateWorkflowData): Promise<Workflow> => {
    const response = await apiClient.post<Workflow>('/api/v1/workflows', data);
    return response.data;
  },

  update: async (id: string, data: Partial<CreateWorkflowData>): Promise<Workflow> => {
    const response = await apiClient.put<Workflow>(`/api/v1/workflows/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/api/v1/workflows/${id}`);
  },

  execute: async (id: string, entityType: string, entityId: string, inputData?: Record<string, any>): Promise<{ executionId: string }> => {
    const response = await apiClient.post<{ message: string; executionId: string }>(`/api/v1/workflows/${id}/execute`, {
      entityType,
      entityId,
      inputData,
    });
    return { executionId: response.data.executionId };
  },

  getApprovals: async (executionId: string): Promise<Approval[]> => {
    const response = await apiClient.get<Approval[]>(`/api/v1/workflows/executions/${executionId}/approvals`);
    return response.data;
  },

  approve: async (approvalId: string, status: 'approved' | 'rejected', comments?: string, signature?: any): Promise<void> => {
    await apiClient.patch(`/api/v1/workflows/approvals/${approvalId}`, { status, comments, signature });
  },

  getTemplates: async (): Promise<WorkflowTemplate[]> => {
    const response = await apiClient.get<WorkflowTemplate[]>('/api/v1/workflows/templates');
    return response.data;
  },

  getTemplate: async (id: string): Promise<WorkflowTemplate> => {
    const response = await apiClient.get<WorkflowTemplate>(`/api/v1/workflows/templates/${id}`);
    return response.data;
  },

  instantiateTemplate: async (id: string, data: { name: string; description?: string; [key: string]: any }): Promise<Workflow> => {
    const response = await apiClient.post<Workflow>(`/api/v1/workflows/templates/${id}/instantiate`, data);
    return response.data;
  },

  // Approval management
  getMyPendingApprovals: async (): Promise<PendingApproval[]> => {
    const response = await apiClient.get<PendingApproval[]>('/api/v1/workflows/my-approvals');
    return response.data;
  },

  // Execution history
  getExecutions: async (options?: {
    workflowId?: string;
    entityType?: string;
    status?: string;
    limit?: number;
  }): Promise<WorkflowExecution[]> => {
    const params = new URLSearchParams();
    if (options?.workflowId) params.append('workflowId', options.workflowId);
    if (options?.entityType) params.append('entityType', options.entityType);
    if (options?.status) params.append('status', options.status);
    if (options?.limit) params.append('limit', String(options.limit));

    const response = await apiClient.get<WorkflowExecution[]>(`/api/v1/workflows/executions?${params.toString()}`);
    return response.data;
  },

  getExecutionById: async (executionId: string): Promise<WorkflowExecution> => {
    const response = await apiClient.get<WorkflowExecution>(`/api/v1/workflows/executions/${executionId}`);
    return response.data;
  },

  getSignature: async (approvalId: string): Promise<any> => {
    const response = await apiClient.get<any>(`/api/v1/workflows/approvals/${approvalId}/signature`);
    return response.data;
  },

  // Trigger Rules
  getRules: async (): Promise<WorkflowTriggerRule[]> => {
    const response = await apiClient.get<WorkflowTriggerRule[]>('/api/v1/workflows/rules');
    return response.data;
  },

  getRuleById: async (id: string): Promise<WorkflowTriggerRule> => {
    const response = await apiClient.get<WorkflowTriggerRule>(`/api/v1/workflows/rules/${id}`);
    return response.data;
  },

  createRule: async (data: CreateWorkflowTriggerRuleData): Promise<WorkflowTriggerRule> => {
    const response = await apiClient.post<WorkflowTriggerRule>('/api/v1/workflows/rules', data);
    return response.data;
  },

  updateRule: async (id: string, data: Partial<CreateWorkflowTriggerRuleData>): Promise<WorkflowTriggerRule> => {
    const response = await apiClient.patch<WorkflowTriggerRule>(`/api/v1/workflows/rules/${id}`, data);
    return response.data;
  },

  deleteRule: async (id: string): Promise<void> => {
    await apiClient.delete(`/api/v1/workflows/rules/${id}`);
  },
};

export enum RuleOperator {
  EQUALS = 'eq',
  NOT_EQUALS = 'neq',
  GREATER_THAN = 'gt',
  LESS_THAN = 'lt',
  CONTAINS = 'contains',
  IN = 'in',
}

export interface TriggerCondition {
  field: string;
  operator: RuleOperator;
  value: any;
}

export interface WorkflowTriggerRule {
  id: string;
  name: string;
  description?: string;
  entityType: string;
  trigger: string;
  conditions: TriggerCondition[];
  workflowId: string;
  workflow?: Workflow;
  priority: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateWorkflowTriggerRuleData {
  name: string;
  description?: string;
  entityType: string;
  trigger: string;
  conditions: TriggerCondition[];
  workflowId: string;
  priority?: number;
  isActive?: boolean;
}
