"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RiskModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const workflow_module_1 = require("../workflow/workflow.module");
const risk_entity_1 = require("./entities/risk.entity");
const risk_category_entity_1 = require("./entities/risk-category.entity");
const risk_assessment_entity_1 = require("./entities/risk-assessment.entity");
const risk_asset_link_entity_1 = require("./entities/risk-asset-link.entity");
const risk_control_link_entity_1 = require("./entities/risk-control-link.entity");
const risk_treatment_entity_1 = require("./entities/risk-treatment.entity");
const treatment_task_entity_1 = require("./entities/treatment-task.entity");
const kri_entity_1 = require("./entities/kri.entity");
const kri_measurement_entity_1 = require("./entities/kri-measurement.entity");
const kri_risk_link_entity_1 = require("./entities/kri-risk-link.entity");
const risk_settings_entity_1 = require("./entities/risk-settings.entity");
const risk_finding_link_entity_1 = require("./entities/risk-finding-link.entity");
const risk_assessment_request_entity_1 = require("./entities/risk-assessment-request.entity");
const unified_control_entity_1 = require("../governance/unified-controls/entities/unified-control.entity");
const finding_entity_1 = require("../governance/findings/entities/finding.entity");
const risk_controller_1 = require("./controllers/risk.controller");
const risk_category_controller_1 = require("./controllers/risk-category.controller");
const risk_assessment_controller_1 = require("./controllers/risk-assessment.controller");
const risk_treatment_controller_1 = require("./controllers/risk-treatment.controller");
const kri_controller_1 = require("./controllers/kri.controller");
const risk_links_controller_1 = require("./controllers/risk-links.controller");
const risk_settings_controller_1 = require("./controllers/risk-settings.controller");
const risk_advanced_controller_1 = require("./controllers/risk-advanced.controller");
const risk_assessment_request_controller_1 = require("./controllers/risk-assessment-request.controller");
const risk_service_1 = require("./services/risk.service");
const risk_category_service_1 = require("./services/risk-category.service");
const risk_assessment_service_1 = require("./services/risk-assessment.service");
const risk_asset_link_service_1 = require("./services/risk-asset-link.service");
const risk_control_link_service_1 = require("./services/risk-control-link.service");
const risk_treatment_service_1 = require("./services/risk-treatment.service");
const kri_service_1 = require("./services/kri.service");
const risk_settings_service_1 = require("./services/risk-settings.service");
const risk_advanced_service_1 = require("./services/risk-advanced.service");
const risk_finding_link_service_1 = require("./services/risk-finding-link.service");
const risk_assessment_request_service_1 = require("./services/risk-assessment-request.service");
const entities = [
    risk_entity_1.Risk,
    risk_category_entity_1.RiskCategory,
    risk_assessment_entity_1.RiskAssessment,
    risk_asset_link_entity_1.RiskAssetLink,
    risk_control_link_entity_1.RiskControlLink,
    risk_treatment_entity_1.RiskTreatment,
    treatment_task_entity_1.TreatmentTask,
    kri_entity_1.KRI,
    kri_measurement_entity_1.KRIMeasurement,
    kri_risk_link_entity_1.KRIRiskLink,
    risk_settings_entity_1.RiskSettings,
    risk_finding_link_entity_1.RiskFindingLink,
    risk_assessment_request_entity_1.RiskAssessmentRequest,
    unified_control_entity_1.UnifiedControl,
    finding_entity_1.Finding,
];
const controllers = [
    risk_controller_1.RiskController,
    risk_category_controller_1.RiskCategoryController,
    risk_assessment_controller_1.RiskAssessmentController,
    risk_treatment_controller_1.RiskTreatmentController,
    kri_controller_1.KRIController,
    risk_links_controller_1.RiskLinksController,
    risk_settings_controller_1.RiskSettingsController,
    risk_advanced_controller_1.RiskAdvancedController,
    risk_assessment_request_controller_1.RiskAssessmentRequestController,
];
const services = [
    risk_service_1.RiskService,
    risk_category_service_1.RiskCategoryService,
    risk_assessment_service_1.RiskAssessmentService,
    risk_asset_link_service_1.RiskAssetLinkService,
    risk_control_link_service_1.RiskControlLinkService,
    risk_treatment_service_1.RiskTreatmentService,
    kri_service_1.KRIService,
    risk_settings_service_1.RiskSettingsService,
    risk_advanced_service_1.RiskAdvancedService,
    risk_finding_link_service_1.RiskFindingLinkService,
    risk_assessment_request_service_1.RiskAssessmentRequestService,
];
let RiskModule = class RiskModule {
};
exports.RiskModule = RiskModule;
exports.RiskModule = RiskModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature(entities),
            (0, common_1.forwardRef)(() => workflow_module_1.WorkflowModule),
        ],
        controllers,
        providers: services,
        exports: [
            ...services,
            typeorm_1.TypeOrmModule,
        ],
    })
], RiskModule);
//# sourceMappingURL=risk.module.js.map