"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GovernanceModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const platform_express_1 = require("@nestjs/platform-express");
const schedule_1 = require("@nestjs/schedule");
const common_module_1 = require("../common/common.module");
const influencer_entity_1 = require("./influencers/entities/influencer.entity");
const influencers_controller_1 = require("./influencers/influencers.controller");
const influencers_service_1 = require("./influencers/influencers.service");
const policy_entity_1 = require("./policies/entities/policy.entity");
const control_objective_entity_1 = require("./control-objectives/entities/control-objective.entity");
const policies_controller_1 = require("./policies/policies.controller");
const policies_service_1 = require("./policies/policies.service");
const control_objectives_controller_1 = require("./control-objectives/control-objectives.controller");
const control_objectives_service_1 = require("./control-objectives/control-objectives.service");
const unified_control_entity_1 = require("./unified-controls/entities/unified-control.entity");
const control_asset_mapping_entity_1 = require("./unified-controls/entities/control-asset-mapping.entity");
const unified_controls_controller_1 = require("./unified-controls/unified-controls.controller");
const unified_controls_service_1 = require("./unified-controls/unified-controls.service");
const control_asset_mapping_service_1 = require("./unified-controls/services/control-asset-mapping.service");
const assessment_entity_1 = require("./assessments/entities/assessment.entity");
const assessment_result_entity_1 = require("./assessments/entities/assessment-result.entity");
const assessments_controller_1 = require("./assessments/assessments.controller");
const assessments_service_1 = require("./assessments/assessments.service");
const evidence_entity_1 = require("./evidence/entities/evidence.entity");
const evidence_linkage_entity_1 = require("./evidence/entities/evidence-linkage.entity");
const evidence_controller_1 = require("./evidence/evidence.controller");
const evidence_service_1 = require("./evidence/evidence.service");
const finding_entity_1 = require("./findings/entities/finding.entity");
const findings_controller_1 = require("./findings/findings.controller");
const findings_service_1 = require("./findings/findings.service");
const governance_dashboard_controller_1 = require("./controllers/governance-dashboard.controller");
const governance_dashboard_service_1 = require("./services/governance-dashboard.service");
const governance_reporting_controller_1 = require("./controllers/governance-reporting.controller");
const governance_reporting_service_1 = require("./services/governance-reporting.service");
const gap_analysis_service_1 = require("./services/gap-analysis.service");
const governance_metric_snapshot_entity_1 = require("./metrics/entities/governance-metric-snapshot.entity");
const governance_trend_service_1 = require("./services/governance-trend.service");
const governance_schedule_service_1 = require("./services/governance-schedule.service");
const remediation_tracker_entity_1 = require("./findings/entities/remediation-tracker.entity");
const remediation_tracking_service_1 = require("./services/remediation-tracking.service");
const remediation_tracking_controller_1 = require("./controllers/remediation-tracking.controller");
const governance_queues_module_1 = require("./queues/governance-queues.module");
const workflow_module_1 = require("../workflow/workflow.module");
const risk_module_1 = require("../risk/risk.module");
let GovernanceModule = class GovernanceModule {
};
exports.GovernanceModule = GovernanceModule;
exports.GovernanceModule = GovernanceModule = __decorate([
    (0, common_1.Module)({
        imports: [
            schedule_1.ScheduleModule.forRoot(),
            typeorm_1.TypeOrmModule.forFeature([
                influencer_entity_1.Influencer,
                policy_entity_1.Policy,
                control_objective_entity_1.ControlObjective,
                unified_control_entity_1.UnifiedControl,
                control_asset_mapping_entity_1.ControlAssetMapping,
                assessment_entity_1.Assessment,
                assessment_result_entity_1.AssessmentResult,
                evidence_entity_1.Evidence,
                evidence_linkage_entity_1.EvidenceLinkage,
                finding_entity_1.Finding,
                governance_metric_snapshot_entity_1.GovernanceMetricSnapshot,
                remediation_tracker_entity_1.RemediationTracker,
            ]),
            platform_express_1.MulterModule.register({
                dest: './uploads',
            }),
            common_module_1.CommonModule,
            governance_queues_module_1.GovernanceQueuesModule,
            workflow_module_1.WorkflowModule,
            risk_module_1.RiskModule,
        ],
        controllers: [
            influencers_controller_1.InfluencersController,
            policies_controller_1.PoliciesController,
            control_objectives_controller_1.ControlObjectivesController,
            unified_controls_controller_1.UnifiedControlsController,
            assessments_controller_1.AssessmentsController,
            evidence_controller_1.EvidenceController,
            findings_controller_1.FindingsController,
            governance_dashboard_controller_1.GovernanceDashboardController,
            governance_reporting_controller_1.GovernanceReportingController,
            remediation_tracking_controller_1.RemediationTrackingController,
        ],
        providers: [
            influencers_service_1.InfluencersService,
            policies_service_1.PoliciesService,
            control_objectives_service_1.ControlObjectivesService,
            unified_controls_service_1.UnifiedControlsService,
            control_asset_mapping_service_1.ControlAssetMappingService,
            assessments_service_1.AssessmentsService,
            evidence_service_1.EvidenceService,
            findings_service_1.FindingsService,
            governance_dashboard_service_1.GovernanceDashboardService,
            governance_reporting_service_1.GovernanceReportingService,
            gap_analysis_service_1.GapAnalysisService,
            governance_trend_service_1.GovernanceTrendService,
            governance_schedule_service_1.GovernanceScheduleService,
            remediation_tracking_service_1.RemediationTrackingService,
        ],
        exports: [
            influencers_service_1.InfluencersService,
            policies_service_1.PoliciesService,
            control_objectives_service_1.ControlObjectivesService,
            unified_controls_service_1.UnifiedControlsService,
            control_asset_mapping_service_1.ControlAssetMappingService,
            assessments_service_1.AssessmentsService,
            evidence_service_1.EvidenceService,
            findings_service_1.FindingsService,
            governance_dashboard_service_1.GovernanceDashboardService,
            governance_reporting_service_1.GovernanceReportingService,
            gap_analysis_service_1.GapAnalysisService,
            governance_trend_service_1.GovernanceTrendService,
            governance_schedule_service_1.GovernanceScheduleService,
            remediation_tracking_service_1.RemediationTrackingService,
        ],
    })
], GovernanceModule);
//# sourceMappingURL=governance.module.js.map