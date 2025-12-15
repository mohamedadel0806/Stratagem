"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkflowTemplatesService = void 0;
const common_1 = require("@nestjs/common");
const workflow_entity_1 = require("../entities/workflow.entity");
let WorkflowTemplatesService = class WorkflowTemplatesService {
    getTemplates() {
        try {
            const APPROVAL = ((workflow_entity_1.WorkflowType === null || workflow_entity_1.WorkflowType === void 0 ? void 0 : workflow_entity_1.WorkflowType.APPROVAL) || 'approval');
            const ESCALATION = ((workflow_entity_1.WorkflowType === null || workflow_entity_1.WorkflowType === void 0 ? void 0 : workflow_entity_1.WorkflowType.ESCALATION) || 'escalation');
            const DEADLINE_REMINDER = ((workflow_entity_1.WorkflowType === null || workflow_entity_1.WorkflowType === void 0 ? void 0 : workflow_entity_1.WorkflowType.DEADLINE_REMINDER) || 'deadline_reminder');
            const STATUS_CHANGE = ((workflow_entity_1.WorkflowType === null || workflow_entity_1.WorkflowType === void 0 ? void 0 : workflow_entity_1.WorkflowType.STATUS_CHANGE) || 'status_change');
            const NOTIFICATION = ((workflow_entity_1.WorkflowType === null || workflow_entity_1.WorkflowType === void 0 ? void 0 : workflow_entity_1.WorkflowType.NOTIFICATION) || 'notification');
            const ON_CREATE = ((workflow_entity_1.WorkflowTrigger === null || workflow_entity_1.WorkflowTrigger === void 0 ? void 0 : workflow_entity_1.WorkflowTrigger.ON_CREATE) || 'on_create');
            const ON_STATUS_CHANGE = ((workflow_entity_1.WorkflowTrigger === null || workflow_entity_1.WorkflowTrigger === void 0 ? void 0 : workflow_entity_1.WorkflowTrigger.ON_STATUS_CHANGE) || 'on_status_change');
            const ON_DEADLINE_APPROACHING = ((workflow_entity_1.WorkflowTrigger === null || workflow_entity_1.WorkflowTrigger === void 0 ? void 0 : workflow_entity_1.WorkflowTrigger.ON_DEADLINE_APPROACHING) || 'on_deadline_approaching');
            const POLICY = ((workflow_entity_1.EntityType === null || workflow_entity_1.EntityType === void 0 ? void 0 : workflow_entity_1.EntityType.POLICY) || 'policy');
            const RISK = ((workflow_entity_1.EntityType === null || workflow_entity_1.EntityType === void 0 ? void 0 : workflow_entity_1.EntityType.RISK) || 'risk');
            const COMPLIANCE_REQUIREMENT = ((workflow_entity_1.EntityType === null || workflow_entity_1.EntityType === void 0 ? void 0 : workflow_entity_1.EntityType.COMPLIANCE_REQUIREMENT) || 'compliance_requirement');
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
                            approvers: [],
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
                            assignTo: '',
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
                            likelihood: 4,
                            impact: 4,
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
        }
        catch (error) {
            console.error('Error in WorkflowTemplatesService.getTemplates():', error);
            console.error('Error stack:', error === null || error === void 0 ? void 0 : error.stack);
            return [];
        }
    }
    getTemplateById(id) {
        return this.getTemplates().find(t => t.id === id);
    }
    getTemplatesByCategory(category) {
        return this.getTemplates().filter(t => t.category === category);
    }
};
exports.WorkflowTemplatesService = WorkflowTemplatesService;
exports.WorkflowTemplatesService = WorkflowTemplatesService = __decorate([
    (0, common_1.Injectable)()
], WorkflowTemplatesService);
//# sourceMappingURL=workflow-templates.service.js.map