import { Injectable } from '@nestjs/common';
import { CreateWorkflowDto } from '../dto/create-workflow.dto';
import { WorkflowType, WorkflowTrigger, EntityType } from '../entities/workflow.entity';

export interface WorkflowTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  workflow: Omit<CreateWorkflowDto, 'name' | 'description'>;
}

@Injectable()
export class WorkflowTemplatesService {
  getTemplates(): WorkflowTemplate[] {
    try {
      // Use enum values directly with type assertions
      const APPROVAL = (WorkflowType?.APPROVAL || 'approval') as WorkflowType;
      const ESCALATION = (WorkflowType?.ESCALATION || 'escalation') as WorkflowType;
      const DEADLINE_REMINDER = (WorkflowType?.DEADLINE_REMINDER || 'deadline_reminder') as WorkflowType;
      const STATUS_CHANGE = (WorkflowType?.STATUS_CHANGE || 'status_change') as WorkflowType;
      const NOTIFICATION = (WorkflowType?.NOTIFICATION || 'notification') as WorkflowType;
      
      const ON_CREATE = (WorkflowTrigger?.ON_CREATE || 'on_create') as WorkflowTrigger;
      const ON_STATUS_CHANGE = (WorkflowTrigger?.ON_STATUS_CHANGE || 'on_status_change') as WorkflowTrigger;
      const ON_DEADLINE_APPROACHING = (WorkflowTrigger?.ON_DEADLINE_APPROACHING || 'on_deadline_approaching') as WorkflowTrigger;
      
      const POLICY = (EntityType?.POLICY || 'policy') as EntityType;
      const RISK = (EntityType?.RISK || 'risk') as EntityType;
      const COMPLIANCE_REQUIREMENT = (EntityType?.COMPLIANCE_REQUIREMENT || 'compliance_requirement') as EntityType;

      return [
      {
        id: 'policy-approval',
        name: 'Policy Approval Workflow',
        description: 'Automatically require manager approval when a new policy is created in draft status',
        category: 'Policy Management',
        workflow: {
          type: APPROVAL,
          trigger: ON_CREATE,
          entityType: POLICY,
          conditions: {
            status: 'draft',
          },
          actions: {
            approvers: [], // Will be configured by user
            changeStatus: 'under_review',
          },
        },
      },
      {
        id: 'risk-escalation',
        name: 'Critical Risk Escalation',
        description: 'Automatically escalate critical risks to CISO and create urgent task',
        category: 'Risk Management',
        workflow: {
          type: ESCALATION,
          trigger: ON_STATUS_CHANGE,
          entityType: RISK,
          conditions: {
            newStatus: 'critical',
          },
          actions: {
            assignTo: '', // Will be configured by user
            createTask: {
              title: 'Urgent: Review Critical Risk',
              description: 'A critical risk requires immediate attention',
              priority: 'critical',
            },
            notify: [],
          },
        },
      },
      {
        id: 'compliance-deadline-reminder',
        name: 'Compliance Deadline Reminder',
        description: 'Send reminder 30 days before compliance requirement deadline',
        category: 'Compliance Management',
        workflow: {
          type: DEADLINE_REMINDER,
          trigger: ON_DEADLINE_APPROACHING,
          entityType: COMPLIANCE_REQUIREMENT,
          daysBeforeDeadline: 30,
          actions: {
            createTask: {
              title: 'Compliance Deadline Approaching',
              description: 'A compliance requirement deadline is approaching',
              priority: 'high',
            },
            notify: [],
          },
        },
      },
      {
        id: 'policy-review-automation',
        name: 'Policy Review Automation',
        description: 'Automatically change policy status to "under_review" when review date approaches',
        category: 'Policy Management',
        workflow: {
          type: STATUS_CHANGE,
          trigger: ON_DEADLINE_APPROACHING,
          entityType: POLICY,
          daysBeforeDeadline: 7,
          actions: {
            changeStatus: 'under_review',
            createTask: {
              title: 'Policy Review Due',
              description: 'Policy review is due soon',
              priority: 'medium',
            },
          },
        },
      },
      {
        id: 'requirement-compliance-notification',
        name: 'Requirement Compliance Notification',
        description: 'Notify stakeholders when a compliance requirement becomes compliant',
        category: 'Compliance Management',
        workflow: {
          type: NOTIFICATION,
          trigger: ON_STATUS_CHANGE,
          entityType: COMPLIANCE_REQUIREMENT,
          conditions: {
            newStatus: 'compliant',
          },
          actions: {
            notify: [],
          },
        },
      },
      {
        id: 'risk-mitigation-task',
        name: 'Risk Mitigation Task Creation',
        description: 'Automatically create a mitigation task when a high-risk is identified',
        category: 'Risk Management',
        workflow: {
          type: NOTIFICATION,
          trigger: ON_CREATE,
          entityType: RISK,
          conditions: {
            likelihood: 4, // High likelihood
            impact: 4, // High impact
          },
          actions: {
            createTask: {
              title: 'Mitigate High-Risk Item',
              description: 'A high-risk item requires mitigation planning',
              priority: 'high',
            },
          },
        },
      },
    ];
    } catch (error) {
      console.error('Error in WorkflowTemplatesService.getTemplates():', error);
      console.error('Error stack:', error?.stack);
      // Return empty array if there's an error (e.g., enum not defined)
      return [];
    }
  }

  getTemplateById(id: string): WorkflowTemplate | undefined {
    return this.getTemplates().find(t => t.id === id);
  }

  getTemplatesByCategory(category: string): WorkflowTemplate[] {
    return this.getTemplates().filter(t => t.category === category);
  }
}

