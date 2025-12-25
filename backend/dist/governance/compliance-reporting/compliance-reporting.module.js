"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ComplianceReportingModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const compliance_report_entity_1 = require("./entities/compliance-report.entity");
const compliance_reporting_service_1 = require("./services/compliance-reporting.service");
const compliance_reporting_controller_1 = require("./compliance-reporting.controller");
const policy_entity_1 = require("../policies/entities/policy.entity");
const unified_control_entity_1 = require("../unified-controls/entities/unified-control.entity");
const control_asset_mapping_entity_1 = require("../unified-controls/entities/control-asset-mapping.entity");
const user_entity_1 = require("../../users/entities/user.entity");
let ComplianceReportingModule = class ComplianceReportingModule {
};
exports.ComplianceReportingModule = ComplianceReportingModule;
exports.ComplianceReportingModule = ComplianceReportingModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                compliance_report_entity_1.ComplianceReport,
                policy_entity_1.Policy,
                unified_control_entity_1.UnifiedControl,
                control_asset_mapping_entity_1.ControlAssetMapping,
                user_entity_1.User,
            ]),
        ],
        controllers: [compliance_reporting_controller_1.ComplianceReportingController],
        providers: [compliance_reporting_service_1.ComplianceReportingService],
        exports: [compliance_reporting_service_1.ComplianceReportingService],
    })
], ComplianceReportingModule);
//# sourceMappingURL=compliance-reporting.module.js.map