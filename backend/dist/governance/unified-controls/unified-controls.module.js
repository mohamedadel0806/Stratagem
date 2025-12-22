"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnifiedControlsModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const unified_control_entity_1 = require("./entities/unified-control.entity");
const control_asset_mapping_entity_1 = require("./entities/control-asset-mapping.entity");
const control_test_entity_1 = require("./entities/control-test.entity");
const framework_requirement_entity_1 = require("./entities/framework-requirement.entity");
const framework_control_mapping_entity_1 = require("./entities/framework-control-mapping.entity");
const unified_controls_service_1 = require("./unified-controls.service");
const unified_controls_controller_1 = require("./unified-controls.controller");
const control_asset_mapping_service_1 = require("./services/control-asset-mapping.service");
const framework_control_mapping_service_1 = require("./services/framework-control-mapping.service");
const control_tests_service_1 = require("./services/control-tests.service");
const control_tests_controller_1 = require("./control-tests.controller");
const risk_module_1 = require("../../risk/risk.module");
const domain_entity_1 = require("../domains/entities/domain.entity");
const common_module_1 = require("../../common/common.module");
let UnifiedControlsModule = class UnifiedControlsModule {
};
exports.UnifiedControlsModule = UnifiedControlsModule;
exports.UnifiedControlsModule = UnifiedControlsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                unified_control_entity_1.UnifiedControl,
                control_asset_mapping_entity_1.ControlAssetMapping,
                control_test_entity_1.ControlTest,
                framework_requirement_entity_1.FrameworkRequirement,
                framework_control_mapping_entity_1.FrameworkControlMapping,
                domain_entity_1.ControlDomain,
            ]),
            (0, common_1.forwardRef)(() => risk_module_1.RiskModule),
            common_module_1.CommonModule,
        ],
        controllers: [unified_controls_controller_1.UnifiedControlsController, control_tests_controller_1.ControlTestsController],
        providers: [
            unified_controls_service_1.UnifiedControlsService,
            control_asset_mapping_service_1.ControlAssetMappingService,
            framework_control_mapping_service_1.FrameworkControlMappingService,
            control_tests_service_1.ControlTestsService,
        ],
        exports: [
            unified_controls_service_1.UnifiedControlsService,
            control_asset_mapping_service_1.ControlAssetMappingService,
            framework_control_mapping_service_1.FrameworkControlMappingService,
            control_tests_service_1.ControlTestsService,
        ],
    })
], UnifiedControlsModule);
//# sourceMappingURL=unified-controls.module.js.map