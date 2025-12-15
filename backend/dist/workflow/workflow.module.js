"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkflowModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const schedule_1 = require("@nestjs/schedule");
const workflow_controller_1 = require("./controllers/workflow.controller");
const workflow_service_1 = require("./services/workflow.service");
const workflow_templates_service_1 = require("./services/workflow-templates.service");
const deadline_workflow_scheduler_1 = require("./schedulers/deadline-workflow.scheduler");
const workflow_entity_1 = require("./entities/workflow.entity");
const workflow_execution_entity_1 = require("./entities/workflow-execution.entity");
const workflow_approval_entity_1 = require("./entities/workflow-approval.entity");
const policy_entity_1 = require("../policy/entities/policy.entity");
const risk_entity_1 = require("../risk/entities/risk.entity");
const compliance_requirement_entity_1 = require("../common/entities/compliance-requirement.entity");
const task_entity_1 = require("../common/entities/task.entity");
const notification_entity_1 = require("../common/entities/notification.entity");
const notification_service_1 = require("../common/services/notification.service");
const user_entity_1 = require("../users/entities/user.entity");
let WorkflowModule = class WorkflowModule {
};
exports.WorkflowModule = WorkflowModule;
exports.WorkflowModule = WorkflowModule = __decorate([
    (0, common_1.Module)({
        imports: [
            schedule_1.ScheduleModule.forRoot(),
            typeorm_1.TypeOrmModule.forFeature([
                workflow_entity_1.Workflow,
                workflow_execution_entity_1.WorkflowExecution,
                workflow_approval_entity_1.WorkflowApproval,
                policy_entity_1.Policy,
                risk_entity_1.Risk,
                compliance_requirement_entity_1.ComplianceRequirement,
                task_entity_1.Task,
                notification_entity_1.Notification,
                user_entity_1.User,
            ]),
        ],
        controllers: [workflow_controller_1.WorkflowController],
        providers: [workflow_service_1.WorkflowService, workflow_templates_service_1.WorkflowTemplatesService, deadline_workflow_scheduler_1.DeadlineWorkflowScheduler, notification_service_1.NotificationService],
        exports: [workflow_service_1.WorkflowService, workflow_templates_service_1.WorkflowTemplatesService],
    })
], WorkflowModule);
//# sourceMappingURL=workflow.module.js.map