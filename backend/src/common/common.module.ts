import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ScheduleModule } from '@nestjs/schedule';
import { Task } from './entities/task.entity';
import { ComplianceFramework } from './entities/compliance-framework.entity';
import { ComplianceRequirement } from './entities/compliance-requirement.entity';
import { Notification } from './entities/notification.entity';
import { AuditLog } from './entities/audit-log.entity';
import { UploadedFile } from './entities/uploaded-file.entity';
import { AssetRequirementMapping } from './entities/asset-requirement-mapping.entity';
import { ComplianceValidationRule } from './entities/compliance-validation-rule.entity';
import { ComplianceAssessment } from './entities/compliance-assessment.entity';
import { BusinessUnit } from './entities/business-unit.entity';
import { PhysicalAsset } from '../asset/entities/physical-asset.entity';
import { InformationAsset } from '../asset/entities/information-asset.entity';
import { BusinessApplication } from '../asset/entities/business-application.entity';
import { SoftwareAsset } from '../asset/entities/software-asset.entity';
import { Supplier } from '../asset/entities/supplier.entity';
import { TasksService } from './services/tasks.service';
import { ComplianceService } from './services/compliance.service';
import { NotificationService } from './services/notification.service';
import { AuditLogService } from './services/audit-log.service';
import { AIService } from './services/ai.service';
import { FileService } from './services/file.service';
import { ComplianceAssessmentService } from './services/compliance-assessment.service';
import { ComplianceAssessmentScheduler } from './schedulers/compliance-assessment.scheduler';
import { InformationAssetClassificationScheduler } from './schedulers/information-asset-classification.scheduler';
import { TasksController } from './controllers/tasks.controller';
import { ComplianceController } from './controllers/compliance.controller';
import { NotificationController } from './controllers/notification.controller';
import { AuditLogController } from './controllers/audit-log.controller';
import { FileUploadController } from './controllers/file-upload.controller';
import { ComplianceAssessmentController } from './controllers/compliance-assessment.controller';
import { BusinessUnitController } from './controllers/business-unit.controller';
import { BusinessUnitService } from './services/business-unit.service';
import { EncryptionService } from './services/encryption.service';
import { AuditLogInterceptor } from './interceptors/audit-log.interceptor';
import { TenantInterceptor } from './interceptors/tenant.interceptor';
import { TenantContextService } from './context/tenant-context.service';
import { TenantSubscriber } from './database/tenant.subscriber';
import { WorkflowModule } from '../workflow/workflow.module';
import { AssetModule } from '../asset/asset.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    TypeOrmModule.forFeature([
      Task,
      ComplianceFramework,
      ComplianceRequirement,
      Notification,
      AuditLog,
      UploadedFile,
      AssetRequirementMapping,
      ComplianceValidationRule,
      ComplianceAssessment,
      BusinessUnit,
      PhysicalAsset,
      InformationAsset,
      BusinessApplication,
      SoftwareAsset,
      Supplier,
    ]),
    forwardRef(() => WorkflowModule),
    forwardRef(() => AssetModule),
  ],
  controllers: [
    TasksController,
    ComplianceController,
    NotificationController,
    AuditLogController,
    FileUploadController,
    ComplianceAssessmentController,
    BusinessUnitController,
  ],
  providers: [
    TasksService,
    ComplianceService,
    NotificationService,
    AuditLogService,
    AIService,
    FileService,
    ComplianceAssessmentService,
    ComplianceAssessmentScheduler,
    InformationAssetClassificationScheduler,
    BusinessUnitService,
    {
      provide: APP_INTERCEPTOR,
      useClass: TenantInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: AuditLogInterceptor,
    },
    TenantContextService,
    TenantSubscriber,
    EncryptionService,
  ],
  exports: [TasksService, ComplianceService, NotificationService, AuditLogService, AIService, FileService, ComplianceAssessmentService, BusinessUnitService, TenantContextService, EncryptionService],
})
export class CommonModule { }