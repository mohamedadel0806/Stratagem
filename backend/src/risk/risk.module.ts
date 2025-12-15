import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkflowModule } from '../workflow/workflow.module';
import { GovernanceModule } from '../governance/governance.module';

// Entities
import { Risk } from './entities/risk.entity';
import { RiskCategory } from './entities/risk-category.entity';
import { RiskAssessment } from './entities/risk-assessment.entity';
import { RiskAssetLink } from './entities/risk-asset-link.entity';
import { RiskControlLink } from './entities/risk-control-link.entity';
import { RiskTreatment } from './entities/risk-treatment.entity';
import { TreatmentTask } from './entities/treatment-task.entity';
import { KRI } from './entities/kri.entity';
import { KRIMeasurement } from './entities/kri-measurement.entity';
import { KRIRiskLink } from './entities/kri-risk-link.entity';
import { RiskSettings } from './entities/risk-settings.entity';
import { RiskFindingLink } from './entities/risk-finding-link.entity';
import { RiskAssessmentRequest } from './entities/risk-assessment-request.entity';

// Import unified control for risk-control links
import { UnifiedControl } from '../governance/unified-controls/entities/unified-control.entity';
// Import finding for risk-finding links
import { Finding } from '../governance/findings/entities/finding.entity';

// Controllers
import { RiskController } from './controllers/risk.controller';
import { RiskCategoryController } from './controllers/risk-category.controller';
import { RiskAssessmentController } from './controllers/risk-assessment.controller';
import { RiskTreatmentController } from './controllers/risk-treatment.controller';
import { KRIController } from './controllers/kri.controller';
import { RiskLinksController } from './controllers/risk-links.controller';
import { RiskSettingsController } from './controllers/risk-settings.controller';
import { RiskAdvancedController } from './controllers/risk-advanced.controller';
import { RiskAssessmentRequestController } from './controllers/risk-assessment-request.controller';

// Services
import { RiskService } from './services/risk.service';
import { RiskCategoryService } from './services/risk-category.service';
import { RiskAssessmentService } from './services/risk-assessment.service';
import { RiskAssetLinkService } from './services/risk-asset-link.service';
import { RiskControlLinkService } from './services/risk-control-link.service';
import { RiskTreatmentService } from './services/risk-treatment.service';
import { KRIService } from './services/kri.service';
import { RiskSettingsService } from './services/risk-settings.service';
import { RiskAdvancedService } from './services/risk-advanced.service';
import { RiskFindingLinkService } from './services/risk-finding-link.service';
import { RiskAssessmentRequestService } from './services/risk-assessment-request.service';

const entities = [
  Risk,
  RiskCategory,
  RiskAssessment,
  RiskAssetLink,
  RiskControlLink,
  RiskTreatment,
  TreatmentTask,
  KRI,
  KRIMeasurement,
  KRIRiskLink,
  RiskSettings,
  RiskFindingLink,
  RiskAssessmentRequest,
  UnifiedControl, // Needed for risk-control links
  Finding, // Needed for risk-finding links
];

const controllers = [
  RiskController,
  RiskCategoryController,
  RiskAssessmentController,
  RiskTreatmentController,
  KRIController,
  RiskLinksController,
  RiskSettingsController,
  RiskAdvancedController,
  RiskAssessmentRequestController,
];

const services = [
  RiskService,
  RiskCategoryService,
  RiskAssessmentService,
  RiskAssetLinkService,
  RiskControlLinkService,
  RiskTreatmentService,
  KRIService,
  RiskSettingsService,
  RiskAdvancedService,
  RiskFindingLinkService,
  RiskAssessmentRequestService,
];

@Module({
  imports: [
    TypeOrmModule.forFeature(entities),
    forwardRef(() => WorkflowModule),
  ],
  controllers,
  providers: services,
  exports: [
    ...services,
    TypeOrmModule,
  ],
})
export class RiskModule {}
