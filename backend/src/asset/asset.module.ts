import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MulterModule } from '@nestjs/platform-express';
import { ScheduleModule } from '@nestjs/schedule';
import { PhysicalAsset } from './entities/physical-asset.entity';
import { InformationAsset } from './entities/information-asset.entity';
import { BusinessApplication } from './entities/business-application.entity';
import { SoftwareAsset } from './entities/software-asset.entity';
import { Supplier } from './entities/supplier.entity';
import { ImportLog } from './entities/import-log.entity';
import { AssetDependency } from './entities/asset-dependency.entity';
import { AssetAuditLog } from './entities/asset-audit-log.entity';
import { AssetType } from './entities/asset-type.entity';
import { BusinessUnit } from '../common/entities/business-unit.entity';
import { User } from '../users/entities/user.entity';
import { UsersModule } from '../users/users.module';
import { TenantsModule } from '../tenants/tenants.module';
import { PhysicalAssetService } from './services/physical-asset.service';
import { InformationAssetService } from './services/information-asset.service';
import { BusinessApplicationService } from './services/business-application.service';
import { SoftwareAssetService } from './services/software-asset.service';
import { SupplierService } from './services/supplier.service';
import { ImportService } from './services/import.service';
import { PhysicalAssetController } from './controllers/physical-asset.controller';
import { InformationAssetController } from './controllers/information-asset.controller';
import { BusinessApplicationController } from './controllers/business-application.controller';
import { SoftwareAssetController } from './controllers/software-asset.controller';
import { SupplierController } from './controllers/supplier.controller';
import { GlobalAssetSearchController } from './controllers/global-asset-search.controller';
import { GlobalAssetSearchService } from './services/global-asset-search.service';
import { AssetDependencyController } from './controllers/asset-dependency.controller';
import { AssetDependencyService } from './services/asset-dependency.service';
import { AssetAuditController } from './controllers/asset-audit.controller';
import { AssetAuditService } from './services/asset-audit.service';
import { IntegrationConfig } from './entities/integration-config.entity';
import { IntegrationSyncLog } from './entities/integration-sync-log.entity';
import { AssetFieldConfig } from './entities/asset-field-config.entity';
import { SecurityTestResult } from './entities/security-test-result.entity';
import { ReportTemplate } from './entities/report-template.entity';
import { ReportTemplateVersion } from './entities/report-template-version.entity';
import { EmailDistributionList } from './entities/email-distribution-list.entity';
import { ValidationRule } from './entities/validation-rule.entity';
import { IntegrationController } from './controllers/integration.controller';
import { IntegrationService } from './services/integration.service';
import { AssetFieldConfigController } from './controllers/asset-field-config.controller';
import { AssetFieldConfigService } from './services/asset-field-config.service';
import { BulkOperationsController } from './controllers/bulk-operations.controller';
import { BulkOperationsService } from './services/bulk-operations.service';
import { AssetTypeController } from './controllers/asset-type.controller';
import { AssetTypeService } from './services/asset-type.service';
import { AssetConnectivityScheduler } from './schedulers/asset-connectivity.scheduler';
import { SecurityTestAlertScheduler } from './schedulers/security-test-alert.scheduler';
import { InformationAssetComplianceAlertScheduler } from './schedulers/information-asset-compliance-alert.scheduler';
import { SupplierContractAlertScheduler } from './schedulers/supplier-contract-alert.scheduler';
import { SupplierAssessmentAlertScheduler } from './schedulers/supplier-assessment-alert.scheduler';
import { ScheduledReportScheduler } from './schedulers/scheduled-report.scheduler';
import { RiskModule } from '../risk/risk.module';
import { CommonModule } from '../common/common.module';
import { PhysicalAssetImportHandler } from './services/import-handlers/physical-asset-import-handler';
import { InformationAssetImportHandler } from './services/import-handlers/information-asset-import-handler';
import { SoftwareAssetImportHandler } from './services/import-handlers/software-asset-import-handler';
import { BusinessApplicationImportHandler } from './services/import-handlers/business-application-import-handler';
import { SupplierImportHandler } from './services/import-handlers/supplier-import-handler';
import { SecurityTestResultService } from './services/security-test-result.service';
import { SecurityTestResultController } from './controllers/security-test-result.controller';
import { ReportTemplateService } from './services/report-template.service';
import { ReportTemplateController } from './controllers/report-template.controller';
import { EmailDistributionListService } from './services/email-distribution-list.service';
import { EmailDistributionListController } from './controllers/email-distribution-list.controller';
import { ValidationRuleService } from './services/validation-rule.service';
import { ValidationRuleController } from './controllers/validation-rule.controller';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    TypeOrmModule.forFeature([
      PhysicalAsset,
      InformationAsset,
      BusinessApplication,
      SoftwareAsset,
      Supplier,
      ImportLog,
      AssetDependency,
      AssetAuditLog,
      AssetType,
      BusinessUnit,
      IntegrationConfig,
      IntegrationSyncLog,
      AssetFieldConfig,
      SecurityTestResult,
      ReportTemplate,
      ReportTemplateVersion,
      EmailDistributionList,
      ValidationRule,
    ]),
    MulterModule.register({
      dest: './uploads/imports',
    }),
    forwardRef(() => RiskModule),
    forwardRef(() => CommonModule),
    UsersModule,
    forwardRef(() => TenantsModule),
  ],
  controllers: [
    PhysicalAssetController,
    InformationAssetController,
    BusinessApplicationController,
    SoftwareAssetController,
    SupplierController,
    GlobalAssetSearchController,
    AssetDependencyController,
    AssetAuditController,
    IntegrationController,
    AssetFieldConfigController,
    BulkOperationsController,
    AssetTypeController,
    SecurityTestResultController,
    ReportTemplateController,
    EmailDistributionListController,
    ValidationRuleController,
  ],
  providers: [
    PhysicalAssetService,
    InformationAssetService,
    BusinessApplicationService,
    SoftwareAssetService,
    SupplierService,
    ImportService,
    GlobalAssetSearchService,
    AssetDependencyService,
    AssetAuditService,
    IntegrationService,
    AssetFieldConfigService,
    BulkOperationsService,
    AssetTypeService,
    PhysicalAssetImportHandler,
    InformationAssetImportHandler,
    SoftwareAssetImportHandler,
    BusinessApplicationImportHandler,
    SupplierImportHandler,
    AssetConnectivityScheduler,
    SecurityTestResultService,
    SecurityTestAlertScheduler,
    InformationAssetComplianceAlertScheduler,
    SupplierContractAlertScheduler,
    SupplierAssessmentAlertScheduler,
    ScheduledReportScheduler,
    ReportTemplateService,
    EmailDistributionListService,
    ValidationRuleService,
  ],
  exports: [
    PhysicalAssetService,
    InformationAssetService,
    BusinessApplicationService,
    SoftwareAssetService,
    SupplierService,
    ImportService,
    GlobalAssetSearchService,
    AssetDependencyService,
    AssetAuditService,
    IntegrationService,
    AssetFieldConfigService,
    AssetTypeService,
    ReportTemplateService,
    EmailDistributionListService,
    ValidationRuleService,
  ],
})
export class AssetModule { }

