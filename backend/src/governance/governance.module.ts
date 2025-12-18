import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MulterModule } from '@nestjs/platform-express';
import { ScheduleModule } from '@nestjs/schedule';
import { CommonModule } from '../common/common.module';
import { Influencer } from './influencers/entities/influencer.entity';
import { InfluencersController } from './influencers/influencers.controller';
import { InfluencersService } from './influencers/influencers.service';
import { Policy } from './policies/entities/policy.entity';
import { ControlObjective } from './control-objectives/entities/control-objective.entity';
import { PoliciesController } from './policies/policies.controller';
import { PoliciesService } from './policies/policies.service';
import { ControlObjectivesController } from './control-objectives/control-objectives.controller';
import { ControlObjectivesService } from './control-objectives/control-objectives.service';
import { UnifiedControl } from './unified-controls/entities/unified-control.entity';
import { ControlAssetMapping } from './unified-controls/entities/control-asset-mapping.entity';
import { UnifiedControlsController } from './unified-controls/unified-controls.controller';
import { UnifiedControlsService } from './unified-controls/unified-controls.service';
import { ControlAssetMappingService } from './unified-controls/services/control-asset-mapping.service';
import { FrameworkControlMappingService } from './unified-controls/services/framework-control-mapping.service';
import { Assessment } from './assessments/entities/assessment.entity';
import { AssessmentResult } from './assessments/entities/assessment-result.entity';
import { WorkflowExecution } from '../workflow/entities/workflow-execution.entity';
import { AssessmentsController } from './assessments/assessments.controller';
import { AssessmentsService } from './assessments/assessments.service';
import { Evidence } from './evidence/entities/evidence.entity';
import { EvidenceLinkage } from './evidence/entities/evidence-linkage.entity';
import { EvidenceController } from './evidence/evidence.controller';
import { EvidenceService } from './evidence/evidence.service';
import { Finding } from './findings/entities/finding.entity';
import { FindingsController } from './findings/findings.controller';
import { FindingsService } from './findings/findings.service';
import { GovernanceDashboardController } from './controllers/governance-dashboard.controller';
import { GovernanceDashboardService } from './services/governance-dashboard.service';
import { GovernanceReportingController } from './controllers/governance-reporting.controller';
import { GovernanceReportingService } from './services/governance-reporting.service';
import { GapAnalysisService } from './services/gap-analysis.service';
import { GovernanceMetricSnapshot } from './metrics/entities/governance-metric-snapshot.entity';
import { GovernanceTrendService } from './services/governance-trend.service';
import { GovernanceScheduleService } from './services/governance-schedule.service';
import { RemediationTracker } from './findings/entities/remediation-tracker.entity';
import { RemediationTrackingService } from './services/remediation-tracking.service';
import { RemediationTrackingController } from './controllers/remediation-tracking.controller';
import { GovernanceQueuesModule } from './queues/governance-queues.module';
import { WorkflowModule } from '../workflow/workflow.module';
import { RiskModule } from '../risk/risk.module';
import { Standard } from './standards/entities/standard.entity';
import { StandardsController } from './standards/standards.controller';
import { StandardsService } from './standards/standards.service';
import { SOP } from './sops/entities/sop.entity';
import { SOPAssignment } from './sops/entities/sop-assignment.entity';
import { SOPsController } from './sops/sops.controller';
import { SOPsService } from './sops/sops.service';
import { FrameworkRequirement } from './unified-controls/entities/framework-requirement.entity';
import { FrameworkControlMapping } from './unified-controls/entities/framework-control-mapping.entity';
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

@Module({
  imports: [
    ScheduleModule.forRoot(),
    TypeOrmModule.forFeature([
      Influencer,
      Policy,
      ControlObjective,
      UnifiedControl,
      ControlAssetMapping,
      Assessment,
      AssessmentResult,
      Evidence,
      EvidenceLinkage,
      Finding,
      GovernanceMetricSnapshot,
      RemediationTracker,
      Standard,
      SOP,
      SOPAssignment,
      FrameworkRequirement,
      FrameworkControlMapping,
      ComplianceFramework,
      WorkflowExecution,
      PolicyAssignment,
      User,
      BusinessUnit,
      GovernancePermission,
      GovernanceRoleAssignment,
      PolicyException,
      PolicyReview,
    ]),
    MulterModule.register({
      dest: './uploads',
    }),
    CommonModule, // For shared services (audit, notifications, etc.)
    GovernanceQueuesModule, // Bull Queue integration for async workflows
    WorkflowModule, // For workflow service integration
    RiskModule, // For risk integration
  ],
  controllers: [
    InfluencersController,
    PoliciesController,
    ControlObjectivesController,
    UnifiedControlsController,
    AssessmentsController,
    EvidenceController,
    FindingsController,
    GovernanceDashboardController,
    GovernanceReportingController,
    RemediationTrackingController,
    StandardsController,
    SOPsController,
    ComplianceScorecardController,
    GovernancePermissionsController,
    PolicyExceptionsController,
  ],
  providers: [
    InfluencersService,
    PoliciesService,
    ControlObjectivesService,
    UnifiedControlsService,
    ControlAssetMappingService,
    FrameworkControlMappingService,
    AssessmentsService,
    EvidenceService,
    FindingsService,
    GovernanceDashboardService,
    GovernanceReportingService,
    GapAnalysisService,
    GovernanceTrendService,
    GovernanceScheduleService,
    RemediationTrackingService,
    StandardsService,
    SOPsService,
    ComplianceScorecardService,
    GovernancePermissionsService,
    GovernancePermissionsGuard,
    PolicyExceptionsService,
  ],
  exports: [
    InfluencersService,
    PoliciesService,
    ControlObjectivesService,
    UnifiedControlsService,
    ControlAssetMappingService,
    FrameworkControlMappingService,
    AssessmentsService,
    EvidenceService,
    FindingsService,
    GovernanceDashboardService,
    GovernanceReportingService,
    GapAnalysisService,
    GovernanceTrendService,
    GovernanceScheduleService,
    RemediationTrackingService,
    StandardsService,
    SOPsService,
    ComplianceScorecardService,
    GovernancePermissionsService,
    GovernancePermissionsGuard,
    PolicyExceptionsService,
  ],
})
export class GovernanceModule {}

