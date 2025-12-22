"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var GovernanceIntegrationsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.GovernanceIntegrationsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const integration_hook_entity_1 = require("./entities/integration-hook.entity");
const evidence_service_1 = require("../evidence/evidence.service");
const findings_service_1 = require("../findings/findings.service");
const unified_controls_service_1 = require("../unified-controls/unified-controls.service");
const crypto = __importStar(require("crypto"));
let GovernanceIntegrationsService = GovernanceIntegrationsService_1 = class GovernanceIntegrationsService {
    constructor(hookRepository, logRepository, evidenceService, findingsService, controlsService) {
        this.hookRepository = hookRepository;
        this.logRepository = logRepository;
        this.evidenceService = evidenceService;
        this.findingsService = findingsService;
        this.controlsService = controlsService;
        this.logger = new common_1.Logger(GovernanceIntegrationsService_1.name);
    }
    async createHook(dto, userId) {
        const secretKey = crypto.randomBytes(32).toString('hex');
        const hook = this.hookRepository.create(Object.assign(Object.assign({}, dto), { secretKey, created_by: userId }));
        return this.hookRepository.save(hook);
    }
    async findAll() {
        return this.hookRepository.find({
            where: { deleted_at: (0, typeorm_2.IsNull)() },
            relations: ['creator'],
            order: { created_at: 'DESC' },
        });
    }
    async findOne(id) {
        const hook = await this.hookRepository.findOne({
            where: { id, deleted_at: (0, typeorm_2.IsNull)() },
        });
        if (!hook)
            throw new common_1.NotFoundException('Integration hook not found');
        return hook;
    }
    async handleWebhook(secretKey, payload, ipAddress) {
        const hook = await this.hookRepository.findOne({
            where: { secretKey, isActive: true, deleted_at: (0, typeorm_2.IsNull)() },
        });
        if (!hook) {
            throw new common_1.BadRequestException('Invalid or inactive webhook secret');
        }
        const log = this.logRepository.create({
            hook_id: hook.id,
            payload,
            ipAddress,
        });
        try {
            let result;
            switch (hook.action) {
                case integration_hook_entity_1.HookAction.CREATE_EVIDENCE:
                    result = await this.processEvidenceHook(hook, payload);
                    break;
                case integration_hook_entity_1.HookAction.CREATE_FINDING:
                    result = await this.processFindingHook(hook, payload);
                    break;
                default:
                    throw new Error(`Unsupported action: ${hook.action}`);
            }
            log.status = 'success';
            log.result = result;
            await this.logRepository.save(log);
            return result;
        }
        catch (error) {
            log.status = 'failed';
            log.errorMessage = error.message;
            await this.logRepository.save(log);
            throw error;
        }
    }
    async processEvidenceHook(hook, payload) {
        const evidenceData = {
            title: this.mapField(hook, payload, 'title') || `External Evidence from ${hook.name}`,
            description: this.mapField(hook, payload, 'description'),
            evidence_type: this.mapField(hook, payload, 'type') || 'other',
            file_path: this.mapField(hook, payload, 'url') || 'N/A',
            status: 'approved',
            collection_date: new Date(),
        };
        return this.evidenceService.create(evidenceData, hook.created_by);
    }
    async processFindingHook(hook, payload) {
        const findingData = {
            title: this.mapField(hook, payload, 'title') || `External Finding from ${hook.name}`,
            description: this.mapField(hook, payload, 'description'),
            severity: this.mapField(hook, payload, 'severity') || 'medium',
            status: 'open',
            finding_date: new Date(),
        };
        return this.findingsService.create(findingData, hook.created_by);
    }
    mapField(hook, payload, targetField) {
        var _a, _b, _c, _d;
        const sourceField = (_b = (_a = hook.config) === null || _a === void 0 ? void 0 : _a.mapping) === null || _b === void 0 ? void 0 : _b[targetField];
        if (!sourceField)
            return (_d = (_c = hook.config) === null || _c === void 0 ? void 0 : _c.defaultValues) === null || _d === void 0 ? void 0 : _d[targetField];
        return sourceField.split('.').reduce((obj, key) => obj === null || obj === void 0 ? void 0 : obj[key], payload);
    }
    async getLogs(hookId) {
        return this.logRepository.find({
            where: { hook_id: hookId },
            order: { created_at: 'DESC' },
            take: 50,
        });
    }
};
exports.GovernanceIntegrationsService = GovernanceIntegrationsService;
exports.GovernanceIntegrationsService = GovernanceIntegrationsService = GovernanceIntegrationsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(integration_hook_entity_1.GovernanceIntegrationHook)),
    __param(1, (0, typeorm_1.InjectRepository)(integration_hook_entity_1.GovernanceIntegrationLog)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        evidence_service_1.EvidenceService,
        findings_service_1.FindingsService,
        unified_controls_service_1.UnifiedControlsService])
], GovernanceIntegrationsService);
//# sourceMappingURL=governance-integrations.service.js.map