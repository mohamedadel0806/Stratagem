"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GovernanceIntegrationsModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const integration_hook_entity_1 = require("./entities/integration-hook.entity");
const governance_integrations_service_1 = require("./governance-integrations.service");
const governance_integrations_controller_1 = require("./governance-integrations.controller");
const evidence_module_1 = require("../evidence/evidence.module");
const findings_module_1 = require("../findings/findings.module");
const unified_controls_module_1 = require("../unified-controls/unified-controls.module");
let GovernanceIntegrationsModule = class GovernanceIntegrationsModule {
};
exports.GovernanceIntegrationsModule = GovernanceIntegrationsModule;
exports.GovernanceIntegrationsModule = GovernanceIntegrationsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([integration_hook_entity_1.GovernanceIntegrationHook, integration_hook_entity_1.GovernanceIntegrationLog]),
            evidence_module_1.EvidenceModule,
            findings_module_1.FindingsModule,
            unified_controls_module_1.UnifiedControlsModule,
        ],
        controllers: [governance_integrations_controller_1.GovernanceIntegrationsController],
        providers: [governance_integrations_service_1.GovernanceIntegrationsService],
        exports: [governance_integrations_service_1.GovernanceIntegrationsService],
    })
], GovernanceIntegrationsModule);
//# sourceMappingURL=governance-integrations.module.js.map