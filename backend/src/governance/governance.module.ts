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
import { Assessment } from './assessments/entities/assessment.entity';
import { AssessmentResult } from './assessments/entities/assessment-result.entity';
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
  ],
  providers: [
    InfluencersService,
    PoliciesService,
    ControlObjectivesService,
    UnifiedControlsService,
    ControlAssetMappingService,
    AssessmentsService,
    EvidenceService,
    FindingsService,
    GovernanceDashboardService,
    GovernanceReportingService,
    GapAnalysisService,
    GovernanceTrendService,
    GovernanceScheduleService,
    RemediationTrackingService,
  ],
  exports: [
    InfluencersService,
    PoliciesService,
    ControlObjectivesService,
    UnifiedControlsService,
    ControlAssetMappingService,
    AssessmentsService,
    EvidenceService,
    FindingsService,
    GovernanceDashboardService,
    GovernanceReportingService,
    GapAnalysisService,
    GovernanceTrendService,
    GovernanceScheduleService,
    RemediationTrackingService,
  ],
})
export class GovernanceModule {}

