"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var BulkDataService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.BulkDataService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const policy_entity_1 = require("../policies/entities/policy.entity");
const unified_control_entity_1 = require("../unified-controls/entities/unified-control.entity");
const influencer_entity_1 = require("../influencers/entities/influencer.entity");
let BulkDataService = BulkDataService_1 = class BulkDataService {
    constructor(policyRepository, controlRepository, influencerRepository) {
        this.policyRepository = policyRepository;
        this.controlRepository = controlRepository;
        this.influencerRepository = influencerRepository;
        this.logger = new common_1.Logger(BulkDataService_1.name);
    }
    async importPolicies(data, userId) {
        let created = 0;
        let skipped = 0;
        const errors = [];
        for (const item of data) {
            try {
                if (!item.title) {
                    skipped++;
                    errors.push('Skipped: Missing title');
                    continue;
                }
                const policy = this.policyRepository.create(Object.assign(Object.assign({}, item), { status: item.status || policy_entity_1.PolicyStatus.DRAFT, review_frequency: item.review_frequency || policy_entity_1.ReviewFrequency.ANNUAL, created_by: userId }));
                await this.policyRepository.save(policy);
                created++;
            }
            catch (error) {
                skipped++;
                errors.push(`Error importing "${item.title || 'Unknown'}": ${error.message}`);
            }
        }
        return { created, skipped, errors };
    }
    async importControls(data, userId) {
        let created = 0;
        let skipped = 0;
        const errors = [];
        for (const item of data) {
            try {
                if (!item.title || !item.control_identifier) {
                    skipped++;
                    errors.push(`Skipped: Missing title or identifier for "${item.title || 'Unknown'}"`);
                    continue;
                }
                const control = this.controlRepository.create(Object.assign(Object.assign({}, item), { status: item.status || unified_control_entity_1.ControlStatus.DRAFT, implementation_status: item.implementation_status || unified_control_entity_1.ImplementationStatus.NOT_IMPLEMENTED, created_by: userId }));
                await this.controlRepository.save(control);
                created++;
            }
            catch (error) {
                skipped++;
                errors.push(`Error importing "${item.control_identifier || 'Unknown'}": ${error.message}`);
            }
        }
        return { created, skipped, errors };
    }
    async exportEntities(type) {
        let data = [];
        switch (type) {
            case 'policies':
                data = await this.policyRepository.find({ where: { deleted_at: (0, typeorm_2.IsNull)() } });
                break;
            case 'controls':
                data = await this.controlRepository.find({ where: { deleted_at: (0, typeorm_2.IsNull)() } });
                break;
            case 'influencers':
                data = await this.influencerRepository.find({ where: { deleted_at: (0, typeorm_2.IsNull)() } });
                break;
        }
        return data;
    }
};
exports.BulkDataService = BulkDataService;
exports.BulkDataService = BulkDataService = BulkDataService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(policy_entity_1.Policy)),
    __param(1, (0, typeorm_1.InjectRepository)(unified_control_entity_1.UnifiedControl)),
    __param(2, (0, typeorm_1.InjectRepository)(influencer_entity_1.Influencer)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], BulkDataService);
//# sourceMappingURL=bulk-data.service.js.map