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
const influencer_revision_entity_1 = require("./influencers/entities/influencer-revision.entity");
const influencers_controller_1 = require("./influencers/influencers.controller");
const influencers_service_1 = require("./influencers/influencers.service");
const influencer_revision_service_1 = require("./influencers/services/influencer-revision.service");
const policy_entity_1 = require("./policies/entities/policy.entity");
const policy_approval_entity_1 = require("./policies/entities/policy-approval.entity");
const policy_version_entity_1 = require("./policies/entities/policy-version.entity");
const control_objective_entity_1 = require("./control-objectives/entities/control-objective.entity");
const policies_controller_1 = require("./policies/policies.controller");
const policies_service_1 = require("./policies/policies.service");
const policy_approval_service_1 = require("./policies/services/policy-approval.service");
const policy_version_service_1 = require("./policies/services/policy-version.service");
const control_objectives_controller_1 = require("./control-objectives/control-objectives.controller");
const control_objectives_service_1 = require("./control-objectives/control-objectives.service");
const assessment_entity_1 = require("./assessments/entities/assessment.entity");
const assessment_result_entity_1 = require("./assessments/entities/assessment-result.entity");
const workflow_execution_entity_1 = require("../workflow/entities/workflow-execution.entity");
const workflow_entity_1 = require("../workflow/entities/workflow.entity");
const assessments_controller_1 = require("./assessments/assessments.controller");
const assessments_service_1 = require("./assessments/assessments.service");
const governance_dashboard_controller_1 = require("./controllers/governance-dashboard.controller");
const governance_dashboard_service_1 = require("./services/governance-dashboard.service");
const governance_reporting_controller_1 = require("./controllers/governance-reporting.controller");
const governance_reporting_service_1 = require("./services/governance-reporting.service");
const gap_analysis_service_1 = require("./services/gap-analysis.service");
const traceability_service_1 = require("./services/traceability.service");
const policy_hierarchy_service_1 = require("./services/policy-hierarchy.service");
const bulk_data_service_1 = require("./services/bulk-data.service");
const governance_ai_service_1 = require("./services/governance-ai.service");
const governance_ai_controller_1 = require("./governance-ai.controller");
const governance_trend_service_1 = require("./services/governance-trend.service");
const governance_schedule_service_1 = require("./services/governance-schedule.service");
const remediation_tracking_service_1 = require("./services/remediation-tracking.service");
const traceability_controller_1 = require("./traceability.controller");
const policy_hierarchy_controller_1 = require("./policy-hierarchy.controller");
const bulk_data_controller_1 = require("./bulk-data.controller");
const dashboard_email_controller_1 = require("./controllers/dashboard-email.controller");
const governance_metric_snapshot_entity_1 = require("./metrics/entities/governance-metric-snapshot.entity");
const dashboard_email_service_1 = require("./services/dashboard-email.service");
const remediation_tracking_controller_1 = require("./controllers/remediation-tracking.controller");
const alerting_service_1 = require("./services/alerting.service");
const alert_rule_service_1 = require("./services/alert-rule.service");
const alerting_controller_1 = require("./controllers/alerting.controller");
const governance_queues_module_1 = require("./queues/governance-queues.module");
const workflow_module_1 = require("../workflow/workflow.module");
const risk_module_1 = require("../risk/risk.module");
const standard_entity_1 = require("./standards/entities/standard.entity");
const standards_controller_1 = require("./standards/standards.controller");
const standards_service_1 = require("./standards/standards.service");
const sop_entity_1 = require("./sops/entities/sop.entity");
const sop_assignment_entity_1 = require("./sops/entities/sop-assignment.entity");
const sop_log_entity_1 = require("./sops/entities/sop-log.entity");
const sop_template_entity_1 = require("./sops/entities/sop-template.entity");
const sop_schedule_entity_1 = require("./sops/entities/sop-schedule.entity");
const sop_feedback_entity_1 = require("./sops/entities/sop-feedback.entity");
const sop_step_entity_1 = require("./sops/entities/sop-step.entity");
const sop_version_entity_1 = require("./sops/entities/sop-version.entity");
const sops_controller_1 = require("./sops/sops.controller");
const sops_service_1 = require("./sops/sops.service");
const sop_logs_service_1 = require("./sops/sop-logs.service");
const sop_logs_controller_1 = require("./sops/sop-logs.controller");
const sop_templates_service_1 = require("./sops/services/sop-templates.service");
const sop_schedules_service_1 = require("./sops/services/sop-schedules.service");
const sop_feedback_service_1 = require("./sops/services/sop-feedback.service");
const sop_steps_service_1 = require("./sops/services/sop-steps.service");
const sop_versions_service_1 = require("./sops/services/sop-versions.service");
const sop_templates_controller_1 = require("./sops/controllers/sop-templates.controller");
const sop_schedules_controller_1 = require("./sops/controllers/sop-schedules.controller");
const sop_feedback_controller_1 = require("./sops/controllers/sop-feedback.controller");
const sop_steps_controller_1 = require("./sops/controllers/sop-steps.controller");
const sop_versions_controller_1 = require("./sops/controllers/sop-versions.controller");
const compliance_scorecard_service_1 = require("./services/compliance-scorecard.service");
const compliance_framework_entity_1 = require("../common/entities/compliance-framework.entity");
const compliance_scorecard_controller_1 = require("./controllers/compliance-scorecard.controller");
const policy_assignment_entity_1 = require("./policies/entities/policy-assignment.entity");
const user_entity_1 = require("../users/entities/user.entity");
const business_unit_entity_1 = require("../common/entities/business-unit.entity");
const governance_permission_entity_1 = require("./permissions/entities/governance-permission.entity");
const governance_role_assignment_entity_1 = require("./permissions/entities/governance-role-assignment.entity");
const governance_permissions_service_1 = require("./permissions/governance-permissions.service");
const governance_permissions_controller_1 = require("./permissions/governance-permissions.controller");
const governance_permissions_guard_1 = require("./permissions/guards/governance-permissions.guard");
const policy_exception_entity_1 = require("./policy-exceptions/entities/policy-exception.entity");
const policy_exceptions_service_1 = require("./policy-exceptions/policy-exceptions.service");
const policy_exceptions_controller_1 = require("./policy-exceptions/policy-exceptions.controller");
const policy_review_entity_1 = require("./policies/entities/policy-review.entity");
const domains_module_1 = require("./domains/domains.module");
const frameworks_module_1 = require("./frameworks/frameworks.module");
const obligations_module_1 = require("./obligations/obligations.module");
const baselines_module_1 = require("./baselines/baselines.module");
const document_templates_module_1 = require("./templates/document-templates.module");
const governance_integrations_module_1 = require("./integrations/governance-integrations.module");
const evidence_module_1 = require("./evidence/evidence.module");
const evidence_entity_1 = require("./evidence/entities/evidence.entity");
const findings_module_1 = require("./findings/findings.module");
const finding_entity_1 = require("./findings/entities/finding.entity");
const remediation_tracker_entity_1 = require("./findings/entities/remediation-tracker.entity");
const unified_controls_module_1 = require("./unified-controls/unified-controls.module");
const unified_control_entity_1 = require("./unified-controls/entities/unified-control.entity");
const control_asset_mapping_entity_1 = require("./unified-controls/entities/control-asset-mapping.entity");
const control_test_entity_1 = require("./unified-controls/entities/control-test.entity");
const framework_control_mapping_entity_1 = require("./unified-controls/entities/framework-control-mapping.entity");
const framework_requirement_entity_1 = require("./unified-controls/entities/framework-requirement.entity");
const dashboard_email_schedule_entity_1 = require("./entities/dashboard-email-schedule.entity");
const alert_entity_1 = require("./entities/alert.entity");
const alert_rule_entity_1 = require("./entities/alert-rule.entity");
const alert_subscription_entity_1 = require("./entities/alert-subscription.entity");
const alert_log_entity_1 = require("./entities/alert-log.entity");
const governance_framework_config_entity_1 = require("./entities/governance-framework-config.entity");
const governance_framework_config_service_1 = require("./framework-config/governance-framework-config.service");
const governance_framework_config_controller_1 = require("./framework-config/governance-framework-config.controller");
const compliance_report_entity_1 = require("./compliance-reporting/entities/compliance-report.entity");
const compliance_reporting_service_1 = require("./compliance-reporting/services/compliance-reporting.service");
const compliance_reporting_controller_1 = require("./compliance-reporting/compliance-reporting.controller");
const alert_escalation_chain_entity_1 = require("./entities/alert-escalation-chain.entity");
const alert_escalation_service_1 = require("./services/alert-escalation.service");
const alert_escalation_controller_1 = require("./controllers/alert-escalation.controller");
let GovernanceModule = class GovernanceModule {
};
exports.GovernanceModule = GovernanceModule;
exports.GovernanceModule = GovernanceModule = __decorate([
    (0, common_1.Module)({
        imports: [
            schedule_1.ScheduleModule.forRoot(),
            typeorm_1.TypeOrmModule.forFeature([
                influencer_entity_1.Influencer,
                influencer_revision_entity_1.InfluencerRevision,
                policy_entity_1.Policy,
                control_objective_entity_1.ControlObjective,
                assessment_entity_1.Assessment,
                assessment_result_entity_1.AssessmentResult,
                governance_metric_snapshot_entity_1.GovernanceMetricSnapshot,
                standard_entity_1.Standard,
                sop_entity_1.SOP,
                sop_assignment_entity_1.SOPAssignment,
                sop_log_entity_1.SOPLog,
                sop_template_entity_1.SOPTemplate,
                sop_schedule_entity_1.SOPSchedule,
                sop_feedback_entity_1.SOPFeedback,
                sop_step_entity_1.SOPStep,
                sop_version_entity_1.SOPVersion,
                compliance_framework_entity_1.ComplianceFramework,
                workflow_entity_1.Workflow,
                workflow_execution_entity_1.WorkflowExecution,
                policy_assignment_entity_1.PolicyAssignment,
                policy_approval_entity_1.PolicyApproval,
                policy_version_entity_1.PolicyVersion,
                user_entity_1.User,
                business_unit_entity_1.BusinessUnit,
                governance_permission_entity_1.GovernancePermission,
                governance_role_assignment_entity_1.GovernanceRoleAssignment,
                policy_exception_entity_1.PolicyException,
                policy_review_entity_1.PolicyReview,
                unified_control_entity_1.UnifiedControl,
                control_asset_mapping_entity_1.ControlAssetMapping,
                control_test_entity_1.ControlTest,
                framework_control_mapping_entity_1.FrameworkControlMapping,
                framework_requirement_entity_1.FrameworkRequirement,
                finding_entity_1.Finding,
                remediation_tracker_entity_1.RemediationTracker,
                evidence_entity_1.Evidence,
                dashboard_email_schedule_entity_1.DashboardEmailSchedule,
                governance_framework_config_entity_1.GovernanceFrameworkConfig,
                compliance_report_entity_1.ComplianceReport,
                alert_entity_1.Alert,
                alert_rule_entity_1.AlertRule,
                alert_subscription_entity_1.AlertSubscription,
                alert_log_entity_1.AlertLog,
                alert_escalation_chain_entity_1.AlertEscalationChain,
            ]),
            platform_express_1.MulterModule.register({
                dest: './uploads',
            }),
            common_module_1.CommonModule,
            governance_queues_module_1.GovernanceQueuesModule,
            workflow_module_1.WorkflowModule,
            risk_module_1.RiskModule,
            domains_module_1.DomainsModule,
            frameworks_module_1.FrameworksModule,
            obligations_module_1.ObligationsModule,
            baselines_module_1.BaselinesModule,
            document_templates_module_1.DocumentTemplatesModule,
            governance_integrations_module_1.GovernanceIntegrationsModule,
            evidence_module_1.EvidenceModule,
            findings_module_1.FindingsModule,
            unified_controls_module_1.UnifiedControlsModule,
        ],
        controllers: [
            influencers_controller_1.InfluencersController,
            policies_controller_1.PoliciesController,
            control_objectives_controller_1.ControlObjectivesController,
            assessments_controller_1.AssessmentsController,
            governance_dashboard_controller_1.GovernanceDashboardController,
            governance_reporting_controller_1.GovernanceReportingController,
            remediation_tracking_controller_1.RemediationTrackingController,
            standards_controller_1.StandardsController,
            sops_controller_1.SOPsController,
            sop_logs_controller_1.SOPLogsController,
            sop_templates_controller_1.SOPTemplatesController,
            sop_schedules_controller_1.SOPSchedulesController,
            sop_feedback_controller_1.SOPFeedbackController,
            sop_steps_controller_1.SOPStepsController,
            sop_versions_controller_1.SOPVersionsController,
            compliance_scorecard_controller_1.ComplianceScorecardController,
            governance_permissions_controller_1.GovernancePermissionsController,
            policy_exceptions_controller_1.PolicyExceptionsController,
            traceability_controller_1.TraceabilityController,
            policy_hierarchy_controller_1.PolicyHierarchyController,
            bulk_data_controller_1.BulkDataController,
            governance_ai_controller_1.GovernanceAIController,
            dashboard_email_controller_1.DashboardEmailController,
            governance_framework_config_controller_1.GovernanceFrameworkConfigController,
            compliance_reporting_controller_1.ComplianceReportingController,
            alerting_controller_1.AlertingController,
            alert_escalation_controller_1.AlertEscalationController,
        ],
        providers: [
            influencers_service_1.InfluencersService,
            influencer_revision_service_1.InfluencerRevisionService,
            policies_service_1.PoliciesService,
            policy_approval_service_1.PolicyApprovalService,
            policy_version_service_1.PolicyVersionService,
            control_objectives_service_1.ControlObjectivesService,
            assessments_service_1.AssessmentsService,
            governance_dashboard_service_1.GovernanceDashboardService,
            governance_reporting_service_1.GovernanceReportingService,
            gap_analysis_service_1.GapAnalysisService,
            governance_trend_service_1.GovernanceTrendService,
            governance_schedule_service_1.GovernanceScheduleService,
            remediation_tracking_service_1.RemediationTrackingService,
            standards_service_1.StandardsService,
            sops_service_1.SOPsService,
            sop_logs_service_1.SOPLogsService,
            sop_templates_service_1.SOPTemplatesService,
            sop_schedules_service_1.SOPSchedulesService,
            sop_feedback_service_1.SOPFeedbackService,
            sop_steps_service_1.SOPStepsService,
            sop_versions_service_1.SOPVersionsService,
            compliance_scorecard_service_1.ComplianceScorecardService,
            governance_permissions_service_1.GovernancePermissionsService,
            governance_permissions_guard_1.GovernancePermissionsGuard,
            policy_exceptions_service_1.PolicyExceptionsService,
            traceability_service_1.TraceabilityService,
            policy_hierarchy_service_1.PolicyHierarchyService,
            bulk_data_service_1.BulkDataService,
            governance_ai_service_1.GovernanceAIService,
            dashboard_email_service_1.DashboardEmailService,
            governance_framework_config_service_1.GovernanceFrameworkConfigService,
            compliance_reporting_service_1.ComplianceReportingService,
            alerting_service_1.AlertingService,
            alert_rule_service_1.AlertRuleService,
            alert_escalation_service_1.AlertEscalationService,
        ],
        exports: [
            influencers_service_1.InfluencersService,
            policies_service_1.PoliciesService,
            policy_approval_service_1.PolicyApprovalService,
            policy_version_service_1.PolicyVersionService,
            control_objectives_service_1.ControlObjectivesService,
            assessments_service_1.AssessmentsService,
            governance_dashboard_service_1.GovernanceDashboardService,
            governance_reporting_service_1.GovernanceReportingService,
            gap_analysis_service_1.GapAnalysisService,
            governance_trend_service_1.GovernanceTrendService,
            governance_schedule_service_1.GovernanceScheduleService,
            remediation_tracking_service_1.RemediationTrackingService,
            standards_service_1.StandardsService,
            sops_service_1.SOPsService,
            sop_logs_service_1.SOPLogsService,
            sop_templates_service_1.SOPTemplatesService,
            sop_schedules_service_1.SOPSchedulesService,
            sop_feedback_service_1.SOPFeedbackService,
            sop_steps_service_1.SOPStepsService,
            sop_versions_service_1.SOPVersionsService,
            compliance_scorecard_service_1.ComplianceScorecardService,
            governance_permissions_service_1.GovernancePermissionsService,
            governance_permissions_guard_1.GovernancePermissionsGuard,
            policy_exceptions_service_1.PolicyExceptionsService,
            traceability_service_1.TraceabilityService,
            policy_hierarchy_service_1.PolicyHierarchyService,
            bulk_data_service_1.BulkDataService,
            governance_ai_service_1.GovernanceAIService,
            evidence_module_1.EvidenceModule,
            findings_module_1.FindingsModule,
            unified_controls_module_1.UnifiedControlsModule,
            alerting_service_1.AlertingService,
            alert_rule_service_1.AlertRuleService,
            alert_escalation_service_1.AlertEscalationService,
        ],
    })
], GovernanceModule);
//# sourceMappingURL=governance.module.js.map