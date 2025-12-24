import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MulterModule } from '@nestjs/platform-express';
import { ScheduleModule } from '@nestjs/schedule';
import { CommonModule } from '../common/common.module';
import { Influencer } from './influencers/entities/influencer.entity';
import { InfluencerRevision } from './influencers/entities/influencer-revision.entity';
import { InfluencersController } from './influencers/influencers.controller';
import { InfluencersService } from './influencers/influencers.service';
import { InfluencerRevisionService } from './influencers/services/influencer-revision.service';
import { Policy } from './policies/entities/policy.entity';
import { PolicyApproval } from './policies/entities/policy-approval.entity';
import { PolicyVersion } from './policies/entities/policy-version.entity';
import { ControlObjective } from './control-objectives/entities/control-objective.entity';
import { PoliciesController } from './policies/policies.controller';
import { PoliciesService } from './policies/policies.service';
import { PolicyApprovalService } from './policies/services/policy-approval.service';
import { PolicyVersionService } from './policies/services/policy-version.service';
import { ControlObjectivesController } from './control-objectives/control-objectives.controller';
import { ControlObjectivesService } from './control-objectives/control-objectives.service';
import { Assessment } from './assessments/entities/assessment.entity';
import { AssessmentResult } from './assessments/entities/assessment-result.entity';
import { WorkflowExecution } from '../workflow/entities/workflow-execution.entity';
import { Workflow } from '../workflow/entities/workflow.entity';
import { AssessmentsController } from './assessments/assessments.controller';
import { AssessmentsService } from './assessments/assessments.service';
import { GovernanceDashboardController } from './controllers/governance-dashboard.controller';
import { GovernanceDashboardService } from './services/governance-dashboard.service';
import { GovernanceReportingController } from './controllers/governance-reporting.controller';
import { GovernanceReportingService } from './services/governance-reporting.service';
import { GapAnalysisService } from './services/gap-analysis.service';
import { TraceabilityService } from './services/traceability.service';
import { PolicyHierarchyService } from './services/policy-hierarchy.service';
import { BulkDataService } from './services/bulk-data.service';
import { GovernanceAIService } from './services/governance-ai.service';
import { GovernanceAIController } from './governance-ai.controller';
import { GovernanceTrendService } from './services/governance-trend.service';
import { GovernanceScheduleService } from './services/governance-schedule.service';
import { RemediationTrackingService } from './services/remediation-tracking.service';
import { TraceabilityController } from './traceability.controller';
import { PolicyHierarchyController } from './policy-hierarchy.controller';
import { BulkDataController } from './bulk-data.controller';
import { DashboardEmailController } from './controllers/dashboard-email.controller';
import { GovernanceMetricSnapshot } from './metrics/entities/governance-metric-snapshot.entity';
import { DashboardEmailService } from './services/dashboard-email.service';
import { RemediationTrackingController } from './controllers/remediation-tracking.controller';
import { AlertingService } from './services/alerting.service';
import { AlertRuleService } from './services/alert-rule.service';
import { AlertingController } from './controllers/alerting.controller';
import { GovernanceQueuesModule } from './queues/governance-queues.module';
import { WorkflowModule } from '../workflow/workflow.module';
import { RiskModule } from '../risk/risk.module';
import { Standard } from './standards/entities/standard.entity';
import { StandardsController } from './standards/standards.controller';
import { StandardsService } from './standards/standards.service';
import { SOP } from './sops/entities/sop.entity';
import { SOPAssignment } from './sops/entities/sop-assignment.entity';
import { SOPLog } from './sops/entities/sop-log.entity';
import { SOPTemplate } from './sops/entities/sop-template.entity';
import { SOPSchedule } from './sops/entities/sop-schedule.entity';
import { SOPFeedback } from './sops/entities/sop-feedback.entity';
import { SOPStep } from './sops/entities/sop-step.entity';
import { SOPVersion } from './sops/entities/sop-version.entity';
import { SOPsController } from './sops/sops.controller';
import { SOPsService } from './sops/sops.service';
import { SOPLogsService } from './sops/sop-logs.service';
import { SOPLogsController } from './sops/sop-logs.controller';
import { SOPTemplatesService } from './sops/services/sop-templates.service';
import { SOPSchedulesService } from './sops/services/sop-schedules.service';
import { SOPFeedbackService } from './sops/services/sop-feedback.service';
import { SOPStepsService } from './sops/services/sop-steps.service';
import { SOPVersionsService } from './sops/services/sop-versions.service';
import { SOPTemplatesController } from './sops/controllers/sop-templates.controller';
import { SOPSchedulesController } from './sops/controllers/sop-schedules.controller';
import { SOPFeedbackController } from './sops/controllers/sop-feedback.controller';
import { SOPStepsController } from './sops/controllers/sop-steps.controller';
import { SOPVersionsController } from './sops/controllers/sop-versions.controller';
import { ComplianceScorecardService } from './services/compliance-scorecard.service';
import { ComplianceFramework } from '../common/entities/compliance-framework.entity';
import { ComplianceScorecardController } from './controllers/compliance-scorecard.controller';
import { PolicyAssignment } from './policies/entities/policy-assignment.entity';
import { User } from '../users/entities/user.entity';
import { BusinessUnit } from '../common/entities/business-unit.entity';
import { GovernancePermission } from './permissions/entities/governance-permission.entity';
import { GovernanceRoleAssignment } from './permissions/entities/governance-role-assignment.entity';
import { GovernancePermissionsService } from './permissions/governance-permissions.service';
import { GovernancePermissionsController } from './permissions/governance-permissions.controller';
import { GovernancePermissionsGuard } from './permissions/guards/governance-permissions.guard';
import { PolicyException } from './policy-exceptions/entities/policy-exception.entity';
import { PolicyExceptionsService } from './policy-exceptions/policy-exceptions.service';
import { PolicyExceptionsController } from './policy-exceptions/policy-exceptions.controller';
import { PolicyReview } from './policies/entities/policy-review.entity';
import { DomainsModule } from './domains/domains.module';
import { FrameworksModule } from './frameworks/frameworks.module';
import { ObligationsModule } from './obligations/obligations.module';
import { BaselinesModule } from './baselines/baselines.module';
import { DocumentTemplatesModule } from './templates/document-templates.module';
import { GovernanceIntegrationsModule } from './integrations/governance-integrations.module';
import { EvidenceModule } from './evidence/evidence.module';
import { Evidence } from './evidence/entities/evidence.entity';
import { FindingsModule } from './findings/findings.module';
import { Finding } from './findings/entities/finding.entity';
import { RemediationTracker } from './findings/entities/remediation-tracker.entity';
import { UnifiedControlsModule } from './unified-controls/unified-controls.module';
import { UnifiedControl } from './unified-controls/entities/unified-control.entity';
import { ControlAssetMapping } from './unified-controls/entities/control-asset-mapping.entity';
import { ControlTest } from './unified-controls/entities/control-test.entity';
import { FrameworkControlMapping } from './unified-controls/entities/framework-control-mapping.entity';
import { FrameworkRequirement } from './unified-controls/entities/framework-requirement.entity';
import { DashboardEmailSchedule } from './entities/dashboard-email-schedule.entity';
import { Alert } from './entities/alert.entity';
import { AlertRule } from './entities/alert-rule.entity';
import { AlertSubscription } from './entities/alert-subscription.entity';
import { AlertLog } from './entities/alert-log.entity';
import { GovernanceFrameworkConfig } from './entities/governance-framework-config.entity';
import { GovernanceFrameworkConfigService } from './framework-config/governance-framework-config.service';
import { GovernanceFrameworkConfigController } from './framework-config/governance-framework-config.controller';
import { ComplianceReport } from './compliance-reporting/entities/compliance-report.entity';
import { ComplianceReportingService } from './compliance-reporting/services/compliance-reporting.service';
import { ComplianceReportingController } from './compliance-reporting/compliance-reporting.controller';
import { AlertEscalationChain } from './entities/alert-escalation-chain.entity';
import { AlertEscalationService } from './services/alert-escalation.service';
import { AlertEscalationController } from './controllers/alert-escalation.controller';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    TypeOrmModule.forFeature([
      Influencer,
      InfluencerRevision,
      Policy,
      ControlObjective,
      Assessment,
      AssessmentResult,
      GovernanceMetricSnapshot,
      Standard,
      SOP,
      SOPAssignment,
      SOPLog,
      SOPTemplate,
      SOPSchedule,
      SOPFeedback,
      SOPStep,
      SOPVersion,
      ComplianceFramework,
      Workflow,
      WorkflowExecution,
      PolicyAssignment,
      PolicyApproval,
      PolicyVersion,
      User,
      BusinessUnit,
      GovernancePermission,
      GovernanceRoleAssignment,
      PolicyException,
      PolicyReview,
      UnifiedControl,
      ControlAssetMapping,
      ControlTest,
      FrameworkControlMapping,
      FrameworkRequirement,
      Finding,
      RemediationTracker,
      Evidence,
       DashboardEmailSchedule,
       GovernanceFrameworkConfig,
       ComplianceReport,
        Alert,
        AlertRule,
        AlertSubscription,
        AlertLog,
        AlertEscalationChain,
     ]),
    MulterModule.register({
      dest: './uploads',
    }),
    CommonModule,
    GovernanceQueuesModule,
    WorkflowModule,
    RiskModule,
    DomainsModule,
    FrameworksModule,
    ObligationsModule,
    BaselinesModule,
    DocumentTemplatesModule,
    GovernanceIntegrationsModule,
    EvidenceModule,
    FindingsModule,
    UnifiedControlsModule,
    // AlertsModule, // TODO: Create alerts module in Story 8.3 backend phase
  ],
  controllers: [
    InfluencersController,
    PoliciesController,
    ControlObjectivesController,
    AssessmentsController,
    GovernanceDashboardController,
    GovernanceReportingController,
    RemediationTrackingController,
    StandardsController,
    SOPsController,
    SOPLogsController,
    SOPTemplatesController,
    SOPSchedulesController,
    SOPFeedbackController,
    SOPStepsController,
    SOPVersionsController,
    ComplianceScorecardController,
    GovernancePermissionsController,
    PolicyExceptionsController,
    TraceabilityController,
    PolicyHierarchyController,
    BulkDataController,
    GovernanceAIController,
    DashboardEmailController,
    GovernanceFrameworkConfigController,
    ComplianceReportingController,
    AlertingController,
    AlertEscalationController,
  ],
  providers: [
    InfluencersService,
    InfluencerRevisionService,
    PoliciesService,
    PolicyApprovalService,
    PolicyVersionService,
    ControlObjectivesService,
    AssessmentsService,
    GovernanceDashboardService,
    GovernanceReportingService,
    GapAnalysisService,
    GovernanceTrendService,
    GovernanceScheduleService,
    RemediationTrackingService,
    StandardsService,
    SOPsService,
    SOPLogsService,
    SOPTemplatesService,
    SOPSchedulesService,
    SOPFeedbackService,
    SOPStepsService,
    SOPVersionsService,
    ComplianceScorecardService,
    GovernancePermissionsService,
    GovernancePermissionsGuard,
    PolicyExceptionsService,
    TraceabilityService,
    PolicyHierarchyService,
    BulkDataService,
    GovernanceAIService,
    DashboardEmailService,
    GovernanceFrameworkConfigService,
    ComplianceReportingService,
    AlertingService,
    AlertRuleService,
    AlertEscalationService,
  ],
  exports: [
    InfluencersService,
    PoliciesService,
    PolicyApprovalService,
    PolicyVersionService,
    ControlObjectivesService,
    AssessmentsService,
    GovernanceDashboardService,
    GovernanceReportingService,
    GapAnalysisService,
    GovernanceTrendService,
    GovernanceScheduleService,
    RemediationTrackingService,
    StandardsService,
    SOPsService,
    SOPLogsService,
    SOPTemplatesService,
    SOPSchedulesService,
    SOPFeedbackService,
    SOPStepsService,
    SOPVersionsService,
    ComplianceScorecardService,
    GovernancePermissionsService,
    GovernancePermissionsGuard,
    PolicyExceptionsService,
    TraceabilityService,
    PolicyHierarchyService,
    BulkDataService,
    GovernanceAIService,
    EvidenceModule,
    FindingsModule,
    UnifiedControlsModule,
    AlertingService,
    AlertRuleService,
    AlertEscalationService,
  ],
})
export class GovernanceModule {}

