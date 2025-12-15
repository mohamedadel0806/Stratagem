"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommonModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const schedule_1 = require("@nestjs/schedule");
const task_entity_1 = require("./entities/task.entity");
const compliance_framework_entity_1 = require("./entities/compliance-framework.entity");
const compliance_requirement_entity_1 = require("./entities/compliance-requirement.entity");
const notification_entity_1 = require("./entities/notification.entity");
const audit_log_entity_1 = require("./entities/audit-log.entity");
const uploaded_file_entity_1 = require("./entities/uploaded-file.entity");
const asset_requirement_mapping_entity_1 = require("./entities/asset-requirement-mapping.entity");
const compliance_validation_rule_entity_1 = require("./entities/compliance-validation-rule.entity");
const compliance_assessment_entity_1 = require("./entities/compliance-assessment.entity");
const business_unit_entity_1 = require("./entities/business-unit.entity");
const physical_asset_entity_1 = require("../asset/entities/physical-asset.entity");
const information_asset_entity_1 = require("../asset/entities/information-asset.entity");
const business_application_entity_1 = require("../asset/entities/business-application.entity");
const software_asset_entity_1 = require("../asset/entities/software-asset.entity");
const supplier_entity_1 = require("../asset/entities/supplier.entity");
const tasks_service_1 = require("./services/tasks.service");
const compliance_service_1 = require("./services/compliance.service");
const notification_service_1 = require("./services/notification.service");
const audit_log_service_1 = require("./services/audit-log.service");
const file_service_1 = require("./services/file.service");
const compliance_assessment_service_1 = require("./services/compliance-assessment.service");
const compliance_assessment_scheduler_1 = require("./schedulers/compliance-assessment.scheduler");
const tasks_controller_1 = require("./controllers/tasks.controller");
const compliance_controller_1 = require("./controllers/compliance.controller");
const notification_controller_1 = require("./controllers/notification.controller");
const audit_log_controller_1 = require("./controllers/audit-log.controller");
const file_upload_controller_1 = require("./controllers/file-upload.controller");
const compliance_assessment_controller_1 = require("./controllers/compliance-assessment.controller");
const business_unit_controller_1 = require("./controllers/business-unit.controller");
const business_unit_service_1 = require("./services/business-unit.service");
const workflow_module_1 = require("../workflow/workflow.module");
const asset_module_1 = require("../asset/asset.module");
let CommonModule = class CommonModule {
};
exports.CommonModule = CommonModule;
exports.CommonModule = CommonModule = __decorate([
    (0, common_1.Module)({
        imports: [
            schedule_1.ScheduleModule.forRoot(),
            typeorm_1.TypeOrmModule.forFeature([
                task_entity_1.Task,
                compliance_framework_entity_1.ComplianceFramework,
                compliance_requirement_entity_1.ComplianceRequirement,
                notification_entity_1.Notification,
                audit_log_entity_1.AuditLog,
                uploaded_file_entity_1.UploadedFile,
                asset_requirement_mapping_entity_1.AssetRequirementMapping,
                compliance_validation_rule_entity_1.ComplianceValidationRule,
                compliance_assessment_entity_1.ComplianceAssessment,
                business_unit_entity_1.BusinessUnit,
                physical_asset_entity_1.PhysicalAsset,
                information_asset_entity_1.InformationAsset,
                business_application_entity_1.BusinessApplication,
                software_asset_entity_1.SoftwareAsset,
                supplier_entity_1.Supplier,
            ]),
            (0, common_1.forwardRef)(() => workflow_module_1.WorkflowModule),
            (0, common_1.forwardRef)(() => asset_module_1.AssetModule),
        ],
        controllers: [
            tasks_controller_1.TasksController,
            compliance_controller_1.ComplianceController,
            notification_controller_1.NotificationController,
            audit_log_controller_1.AuditLogController,
            file_upload_controller_1.FileUploadController,
            compliance_assessment_controller_1.ComplianceAssessmentController,
            business_unit_controller_1.BusinessUnitController,
        ],
        providers: [
            tasks_service_1.TasksService,
            compliance_service_1.ComplianceService,
            notification_service_1.NotificationService,
            audit_log_service_1.AuditLogService,
            file_service_1.FileService,
            compliance_assessment_service_1.ComplianceAssessmentService,
            compliance_assessment_scheduler_1.ComplianceAssessmentScheduler,
            business_unit_service_1.BusinessUnitService,
        ],
        exports: [tasks_service_1.TasksService, compliance_service_1.ComplianceService, notification_service_1.NotificationService, audit_log_service_1.AuditLogService, file_service_1.FileService, compliance_assessment_service_1.ComplianceAssessmentService, business_unit_service_1.BusinessUnitService],
    })
], CommonModule);
//# sourceMappingURL=common.module.js.map