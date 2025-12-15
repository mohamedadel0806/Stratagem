"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const dashboard_controller_1 = require("./controllers/dashboard.controller");
const dashboard_service_1 = require("./services/dashboard.service");
const risk_entity_1 = require("../risk/entities/risk.entity");
const policy_entity_1 = require("../governance/policies/entities/policy.entity");
const task_entity_1 = require("../common/entities/task.entity");
const compliance_requirement_entity_1 = require("../common/entities/compliance-requirement.entity");
const physical_asset_entity_1 = require("../asset/entities/physical-asset.entity");
const information_asset_entity_1 = require("../asset/entities/information-asset.entity");
const business_application_entity_1 = require("../asset/entities/business-application.entity");
const software_asset_entity_1 = require("../asset/entities/software-asset.entity");
const supplier_entity_1 = require("../asset/entities/supplier.entity");
const asset_audit_log_entity_1 = require("../asset/entities/asset-audit-log.entity");
let DashboardModule = class DashboardModule {
};
exports.DashboardModule = DashboardModule;
exports.DashboardModule = DashboardModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                risk_entity_1.Risk,
                policy_entity_1.Policy,
                task_entity_1.Task,
                compliance_requirement_entity_1.ComplianceRequirement,
                physical_asset_entity_1.PhysicalAsset,
                information_asset_entity_1.InformationAsset,
                business_application_entity_1.BusinessApplication,
                software_asset_entity_1.SoftwareAsset,
                supplier_entity_1.Supplier,
                asset_audit_log_entity_1.AssetAuditLog,
            ]),
        ],
        controllers: [dashboard_controller_1.DashboardController],
        providers: [dashboard_service_1.DashboardService],
        exports: [dashboard_service_1.DashboardService],
    })
], DashboardModule);
//# sourceMappingURL=dashboard.module.js.map