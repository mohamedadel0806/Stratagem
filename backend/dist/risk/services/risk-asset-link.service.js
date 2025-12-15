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
Object.defineProperty(exports, "__esModule", { value: true });
exports.RiskAssetLinkService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const risk_asset_link_entity_1 = require("../entities/risk-asset-link.entity");
const risk_entity_1 = require("../entities/risk.entity");
let RiskAssetLinkService = class RiskAssetLinkService {
    constructor(linkRepository, riskRepository) {
        this.linkRepository = linkRepository;
        this.riskRepository = riskRepository;
    }
    async findByRiskId(riskId) {
        const links = await this.linkRepository.find({
            where: { risk_id: riskId },
            relations: ['linker'],
            order: { asset_type: 'ASC', linked_at: 'DESC' },
        });
        return links.map(link => this.toResponseDto(link));
    }
    async findByAsset(assetType, assetId) {
        const links = await this.linkRepository.find({
            where: { asset_type: assetType, asset_id: assetId },
            relations: ['risk', 'linker'],
            order: { linked_at: 'DESC' },
        });
        return links.map(link => this.toResponseDto(link));
    }
    async getRisksForAsset(assetType, assetId) {
        const links = await this.linkRepository.find({
            where: { asset_type: assetType, asset_id: assetId },
            relations: ['risk'],
        });
        return links.map(link => ({
            link_id: link.id,
            risk_id: link.risk.id,
            risk_identifier: link.risk.risk_id,
            risk_title: link.risk.title,
            risk_level: link.risk.current_risk_level,
            risk_score: link.risk.current_risk_score,
            impact_description: link.impact_description,
        }));
    }
    async getAssetRiskScore(assetType, assetId) {
        const links = await this.linkRepository.find({
            where: { asset_type: assetType, asset_id: assetId },
            relations: ['risk'],
        });
        const risks = links.map(l => l.risk).filter(r => r && !r.deleted_at);
        const breakdown = { critical: 0, high: 0, medium: 0, low: 0 };
        let totalScore = 0;
        let maxLevel = 'low';
        for (const risk of risks) {
            if (risk.current_risk_score) {
                totalScore += risk.current_risk_score;
            }
            if (risk.current_risk_level) {
                breakdown[risk.current_risk_level]++;
                if (this.compareLevels(risk.current_risk_level, maxLevel) > 0) {
                    maxLevel = risk.current_risk_level;
                }
            }
        }
        return {
            total_risks: risks.length,
            total_risk_score: totalScore,
            max_risk_level: maxLevel,
            risk_breakdown: Object.entries(breakdown).map(([level, count]) => ({ level, count })),
        };
    }
    async create(createDto, userId) {
        const risk = await this.riskRepository.findOne({ where: { id: createDto.risk_id } });
        if (!risk) {
            throw new common_1.NotFoundException(`Risk with ID ${createDto.risk_id} not found`);
        }
        const existingLink = await this.linkRepository.findOne({
            where: {
                risk_id: createDto.risk_id,
                asset_type: createDto.asset_type,
                asset_id: createDto.asset_id,
            },
        });
        if (existingLink) {
            throw new common_1.ConflictException('This asset is already linked to this risk');
        }
        const link = this.linkRepository.create(Object.assign(Object.assign({}, createDto), { linked_by: userId }));
        const savedLink = await this.linkRepository.save(link);
        return this.toResponseDto(savedLink);
    }
    async bulkCreate(riskId, assets, userId) {
        const risk = await this.riskRepository.findOne({ where: { id: riskId } });
        if (!risk) {
            throw new common_1.NotFoundException(`Risk with ID ${riskId} not found`);
        }
        const results = [];
        for (const asset of assets) {
            try {
                const result = await this.create({
                    risk_id: riskId,
                    asset_type: asset.asset_type,
                    asset_id: asset.asset_id,
                    impact_description: asset.impact_description,
                }, userId);
                results.push(result);
            }
            catch (error) {
                if (!(error instanceof common_1.ConflictException)) {
                    throw error;
                }
            }
        }
        return results;
    }
    async updateImpactDescription(linkId, impactDescription) {
        const link = await this.linkRepository.findOne({ where: { id: linkId } });
        if (!link) {
            throw new common_1.NotFoundException(`Risk-asset link with ID ${linkId} not found`);
        }
        link.impact_description = impactDescription;
        const updatedLink = await this.linkRepository.save(link);
        return this.toResponseDto(updatedLink);
    }
    async remove(linkId) {
        const link = await this.linkRepository.findOne({ where: { id: linkId } });
        if (!link) {
            throw new common_1.NotFoundException(`Risk-asset link with ID ${linkId} not found`);
        }
        await this.linkRepository.remove(link);
    }
    async removeByRiskAndAsset(riskId, assetType, assetId) {
        const link = await this.linkRepository.findOne({
            where: { risk_id: riskId, asset_type: assetType, asset_id: assetId },
        });
        if (!link) {
            throw new common_1.NotFoundException('Risk-asset link not found');
        }
        await this.linkRepository.remove(link);
    }
    async countByRisk(riskId) {
        const links = await this.linkRepository.find({ where: { risk_id: riskId } });
        const counts = {
            physical: 0,
            information: 0,
            software: 0,
            application: 0,
            supplier: 0,
        };
        for (const link of links) {
            counts[link.asset_type]++;
        }
        return counts;
    }
    compareLevels(a, b) {
        const order = { critical: 4, high: 3, medium: 2, low: 1 };
        return (order[a] || 0) - (order[b] || 0);
    }
    toResponseDto(link) {
        var _a;
        return {
            id: link.id,
            risk_id: link.risk_id,
            asset_type: link.asset_type,
            asset_id: link.asset_id,
            impact_description: link.impact_description,
            asset_criticality_at_link: link.asset_criticality_at_link,
            linked_by: link.linked_by,
            linked_at: (_a = link.linked_at) === null || _a === void 0 ? void 0 : _a.toISOString(),
        };
    }
};
exports.RiskAssetLinkService = RiskAssetLinkService;
exports.RiskAssetLinkService = RiskAssetLinkService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(risk_asset_link_entity_1.RiskAssetLink)),
    __param(1, (0, typeorm_1.InjectRepository)(risk_entity_1.Risk)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], RiskAssetLinkService);
//# sourceMappingURL=risk-asset-link.service.js.map