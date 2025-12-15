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
exports.RiskControlLinkService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const risk_control_link_entity_1 = require("../entities/risk-control-link.entity");
const risk_entity_1 = require("../entities/risk.entity");
const unified_control_entity_1 = require("../../governance/unified-controls/entities/unified-control.entity");
let RiskControlLinkService = class RiskControlLinkService {
    constructor(linkRepository, riskRepository, controlRepository) {
        this.linkRepository = linkRepository;
        this.riskRepository = riskRepository;
        this.controlRepository = controlRepository;
    }
    async findByRiskId(riskId) {
        const links = await this.linkRepository.find({
            where: { risk_id: riskId },
            relations: ['control', 'linker'],
            order: { linked_at: 'DESC' },
        });
        return links.map(link => this.toResponseDto(link));
    }
    async findByControlId(controlId) {
        const links = await this.linkRepository.find({
            where: { control_id: controlId },
            relations: ['risk', 'linker'],
            order: { linked_at: 'DESC' },
        });
        return links.map(link => this.toResponseDto(link));
    }
    async getRisksForControl(controlId) {
        const links = await this.linkRepository.find({
            where: { control_id: controlId },
            relations: ['risk'],
        });
        return links.map(link => ({
            link_id: link.id,
            risk_id: link.risk.id,
            risk_identifier: link.risk.risk_id,
            risk_title: link.risk.title,
            risk_level: link.risk.current_risk_level,
            risk_score: link.risk.current_risk_score,
            effectiveness_rating: link.effectiveness_rating,
            control_type_for_risk: link.control_type_for_risk,
        }));
    }
    async create(createDto, userId) {
        const risk = await this.riskRepository.findOne({ where: { id: createDto.risk_id } });
        if (!risk) {
            throw new common_1.NotFoundException(`Risk with ID ${createDto.risk_id} not found`);
        }
        const control = await this.controlRepository.findOne({ where: { id: createDto.control_id } });
        if (!control) {
            throw new common_1.NotFoundException(`Control with ID ${createDto.control_id} not found`);
        }
        const existingLink = await this.linkRepository.findOne({
            where: { risk_id: createDto.risk_id, control_id: createDto.control_id },
        });
        if (existingLink) {
            throw new common_1.ConflictException('This control is already linked to this risk');
        }
        const link = this.linkRepository.create(Object.assign(Object.assign({}, createDto), { linked_by: userId }));
        const savedLink = await this.linkRepository.save(link);
        const fullLink = await this.linkRepository.findOne({
            where: { id: savedLink.id },
            relations: ['control'],
        });
        return this.toResponseDto(fullLink);
    }
    async update(linkId, updateDto, userId) {
        const link = await this.linkRepository.findOne({
            where: { id: linkId },
            relations: ['control'],
        });
        if (!link) {
            throw new common_1.NotFoundException(`Risk-control link with ID ${linkId} not found`);
        }
        Object.assign(link, updateDto);
        if (updateDto.last_effectiveness_review) {
            link.last_effectiveness_review = new Date(updateDto.last_effectiveness_review);
        }
        const updatedLink = await this.linkRepository.save(link);
        return this.toResponseDto(updatedLink);
    }
    async remove(linkId) {
        const link = await this.linkRepository.findOne({ where: { id: linkId } });
        if (!link) {
            throw new common_1.NotFoundException(`Risk-control link with ID ${linkId} not found`);
        }
        await this.linkRepository.remove(link);
    }
    async removeByRiskAndControl(riskId, controlId) {
        const link = await this.linkRepository.findOne({
            where: { risk_id: riskId, control_id: controlId },
        });
        if (!link) {
            throw new common_1.NotFoundException('Risk-control link not found');
        }
        await this.linkRepository.remove(link);
    }
    async getControlEffectiveness(riskId) {
        const links = await this.linkRepository.find({
            where: { risk_id: riskId },
            relations: ['control'],
        });
        if (links.length === 0) {
            return {
                total_controls: 0,
                average_effectiveness: 0,
                effectiveness_by_type: [],
            };
        }
        const byType = {};
        let totalEffectiveness = 0;
        let effectivenessCount = 0;
        for (const link of links) {
            const type = link.control_type_for_risk || 'general';
            if (!byType[type]) {
                byType[type] = { count: 0, totalEffectiveness: 0 };
            }
            byType[type].count++;
            if (link.effectiveness_rating) {
                const percentage = link.effectiveness_type === 'scale'
                    ? link.effectiveness_rating * 20
                    : link.effectiveness_rating;
                byType[type].totalEffectiveness += percentage;
                totalEffectiveness += percentage;
                effectivenessCount++;
            }
        }
        return {
            total_controls: links.length,
            average_effectiveness: effectivenessCount > 0
                ? Math.round(totalEffectiveness / effectivenessCount)
                : 0,
            effectiveness_by_type: Object.entries(byType).map(([type, data]) => ({
                type,
                count: data.count,
                avg_effectiveness: data.count > 0 ? Math.round(data.totalEffectiveness / data.count) : 0,
            })),
        };
    }
    async findRisksWithoutControls() {
        const risksWithoutControls = await this.riskRepository
            .createQueryBuilder('risk')
            .leftJoin('risk_control_links', 'rcl', 'rcl.risk_id = risk.id')
            .where('rcl.id IS NULL')
            .andWhere('risk.deleted_at IS NULL')
            .andWhere("risk.status NOT IN ('closed', 'accepted')")
            .select([
            'risk.id',
            'risk.risk_id',
            'risk.title',
            'risk.current_risk_level',
            'risk.current_risk_score',
        ])
            .orderBy('risk.current_risk_score', 'DESC')
            .getRawMany();
        return risksWithoutControls;
    }
    async getControlEffectivenessForControl(controlId) {
        const links = await this.linkRepository.find({
            where: { control_id: controlId },
            relations: ['risk'],
        });
        if (links.length === 0) {
            return {
                total_risks: 0,
                average_effectiveness: 0,
                effectiveness_by_risk: [],
            };
        }
        const effectivenessByRisk = [];
        let totalEffectiveness = 0;
        let effectivenessCount = 0;
        for (const link of links) {
            if (link.effectiveness_rating != null) {
                const effectiveness = link.effectiveness_type === 'scale'
                    ? link.effectiveness_rating * 20
                    : link.effectiveness_rating;
                effectivenessByRisk.push({
                    risk_id: link.risk.id,
                    risk_title: link.risk.title,
                    effectiveness: Math.round(effectiveness),
                });
                totalEffectiveness += effectiveness;
                effectivenessCount++;
            }
        }
        return {
            total_risks: links.length,
            average_effectiveness: effectivenessCount > 0
                ? Math.round(totalEffectiveness / effectivenessCount)
                : 0,
            effectiveness_by_risk: effectivenessByRisk,
        };
    }
    toResponseDto(link) {
        var _a, _b;
        const dto = {
            id: link.id,
            risk_id: link.risk_id,
            control_id: link.control_id,
            effectiveness_rating: link.effectiveness_rating,
            effectiveness_type: link.effectiveness_type,
            effectiveness_percentage: link.effectiveness_rating
                ? (link.effectiveness_type === 'scale' ? link.effectiveness_rating * 20 : link.effectiveness_rating)
                : undefined,
            control_type_for_risk: link.control_type_for_risk,
            notes: link.notes,
            linked_by: link.linked_by,
            linked_at: (_a = link.linked_at) === null || _a === void 0 ? void 0 : _a.toISOString(),
            last_effectiveness_review: (_b = link.last_effectiveness_review) === null || _b === void 0 ? void 0 : _b.toISOString(),
        };
        if (link.control) {
            dto.control_info = {
                control_identifier: link.control.control_identifier,
                title: link.control.title,
                control_type: link.control.control_type,
                implementation_status: link.control.implementation_status,
            };
        }
        return dto;
    }
};
exports.RiskControlLinkService = RiskControlLinkService;
exports.RiskControlLinkService = RiskControlLinkService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(risk_control_link_entity_1.RiskControlLink)),
    __param(1, (0, typeorm_1.InjectRepository)(risk_entity_1.Risk)),
    __param(2, (0, typeorm_1.InjectRepository)(unified_control_entity_1.UnifiedControl)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], RiskControlLinkService);
//# sourceMappingURL=risk-control-link.service.js.map