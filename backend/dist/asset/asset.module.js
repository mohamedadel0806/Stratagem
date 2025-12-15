"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssetModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const platform_express_1 = require("@nestjs/platform-express");
const physical_asset_entity_1 = require("./entities/physical-asset.entity");
const information_asset_entity_1 = require("./entities/information-asset.entity");
const business_application_entity_1 = require("./entities/business-application.entity");
const software_asset_entity_1 = require("./entities/software-asset.entity");
const supplier_entity_1 = require("./entities/supplier.entity");
const import_log_entity_1 = require("./entities/import-log.entity");
const asset_dependency_entity_1 = require("./entities/asset-dependency.entity");
const asset_audit_log_entity_1 = require("./entities/asset-audit-log.entity");
const asset_type_entity_1 = require("./entities/asset-type.entity");
const business_unit_entity_1 = require("../common/entities/business-unit.entity");
const physical_asset_service_1 = require("./services/physical-asset.service");
const information_asset_service_1 = require("./services/information-asset.service");
const business_application_service_1 = require("./services/business-application.service");
const software_asset_service_1 = require("./services/software-asset.service");
const supplier_service_1 = require("./services/supplier.service");
const import_service_1 = require("./services/import.service");
const physical_asset_controller_1 = require("./controllers/physical-asset.controller");
const information_asset_controller_1 = require("./controllers/information-asset.controller");
const business_application_controller_1 = require("./controllers/business-application.controller");
const software_asset_controller_1 = require("./controllers/software-asset.controller");
const supplier_controller_1 = require("./controllers/supplier.controller");
const global_asset_search_controller_1 = require("./controllers/global-asset-search.controller");
const global_asset_search_service_1 = require("./services/global-asset-search.service");
const asset_dependency_controller_1 = require("./controllers/asset-dependency.controller");
const asset_dependency_service_1 = require("./services/asset-dependency.service");
const asset_audit_controller_1 = require("./controllers/asset-audit.controller");
const asset_audit_service_1 = require("./services/asset-audit.service");
const integration_config_entity_1 = require("./entities/integration-config.entity");
const integration_sync_log_entity_1 = require("./entities/integration-sync-log.entity");
const asset_field_config_entity_1 = require("./entities/asset-field-config.entity");
const integration_controller_1 = require("./controllers/integration.controller");
const integration_service_1 = require("./services/integration.service");
const asset_field_config_controller_1 = require("./controllers/asset-field-config.controller");
const asset_field_config_service_1 = require("./services/asset-field-config.service");
const bulk_operations_controller_1 = require("./controllers/bulk-operations.controller");
const bulk_operations_service_1 = require("./services/bulk-operations.service");
const asset_type_controller_1 = require("./controllers/asset-type.controller");
const asset_type_service_1 = require("./services/asset-type.service");
const risk_module_1 = require("../risk/risk.module");
const physical_asset_import_handler_1 = require("./services/import-handlers/physical-asset-import-handler");
const information_asset_import_handler_1 = require("./services/import-handlers/information-asset-import-handler");
const software_asset_import_handler_1 = require("./services/import-handlers/software-asset-import-handler");
const business_application_import_handler_1 = require("./services/import-handlers/business-application-import-handler");
const supplier_import_handler_1 = require("./services/import-handlers/supplier-import-handler");
let AssetModule = class AssetModule {
};
exports.AssetModule = AssetModule;
exports.AssetModule = AssetModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                physical_asset_entity_1.PhysicalAsset,
                information_asset_entity_1.InformationAsset,
                business_application_entity_1.BusinessApplication,
                software_asset_entity_1.SoftwareAsset,
                supplier_entity_1.Supplier,
                import_log_entity_1.ImportLog,
                asset_dependency_entity_1.AssetDependency,
                asset_audit_log_entity_1.AssetAuditLog,
                asset_type_entity_1.AssetType,
                business_unit_entity_1.BusinessUnit,
                integration_config_entity_1.IntegrationConfig,
                integration_sync_log_entity_1.IntegrationSyncLog,
                asset_field_config_entity_1.AssetFieldConfig,
            ]),
            platform_express_1.MulterModule.register({
                dest: './uploads/imports',
            }),
            (0, common_1.forwardRef)(() => risk_module_1.RiskModule),
        ],
        controllers: [
            physical_asset_controller_1.PhysicalAssetController,
            information_asset_controller_1.InformationAssetController,
            business_application_controller_1.BusinessApplicationController,
            software_asset_controller_1.SoftwareAssetController,
            supplier_controller_1.SupplierController,
            global_asset_search_controller_1.GlobalAssetSearchController,
            asset_dependency_controller_1.AssetDependencyController,
            asset_audit_controller_1.AssetAuditController,
            integration_controller_1.IntegrationController,
            asset_field_config_controller_1.AssetFieldConfigController,
            bulk_operations_controller_1.BulkOperationsController,
            asset_type_controller_1.AssetTypeController,
        ],
        providers: [
            physical_asset_service_1.PhysicalAssetService,
            information_asset_service_1.InformationAssetService,
            business_application_service_1.BusinessApplicationService,
            software_asset_service_1.SoftwareAssetService,
            supplier_service_1.SupplierService,
            import_service_1.ImportService,
            global_asset_search_service_1.GlobalAssetSearchService,
            asset_dependency_service_1.AssetDependencyService,
            asset_audit_service_1.AssetAuditService,
            integration_service_1.IntegrationService,
            asset_field_config_service_1.AssetFieldConfigService,
            bulk_operations_service_1.BulkOperationsService,
            asset_type_service_1.AssetTypeService,
            physical_asset_import_handler_1.PhysicalAssetImportHandler,
            information_asset_import_handler_1.InformationAssetImportHandler,
            software_asset_import_handler_1.SoftwareAssetImportHandler,
            business_application_import_handler_1.BusinessApplicationImportHandler,
            supplier_import_handler_1.SupplierImportHandler,
        ],
        exports: [
            physical_asset_service_1.PhysicalAssetService,
            information_asset_service_1.InformationAssetService,
            business_application_service_1.BusinessApplicationService,
            software_asset_service_1.SoftwareAssetService,
            supplier_service_1.SupplierService,
            import_service_1.ImportService,
            global_asset_search_service_1.GlobalAssetSearchService,
            asset_dependency_service_1.AssetDependencyService,
            asset_audit_service_1.AssetAuditService,
            integration_service_1.IntegrationService,
            asset_field_config_service_1.AssetFieldConfigService,
            asset_type_service_1.AssetTypeService,
        ],
    })
], AssetModule);
//# sourceMappingURL=asset.module.js.map