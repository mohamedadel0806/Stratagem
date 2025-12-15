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
exports.RiskFindingLinkService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const risk_finding_link_entity_1 = require("../entities/risk-finding-link.entity");
const risk_entity_1 = require("../entities/risk.entity");
const finding_entity_1 = require("../../governance/findings/entities/finding.entity");
let RiskFindingLinkService = class RiskFindingLinkService {
    constructor(linkRepository, riskRepository, findingRepository) {
        this.linkRepository = linkRepository;
        this.riskRepository = riskRepository;
        this.findingRepository = findingRepository;
    }
    async findByRiskId(riskId) {
        const links = await this.linkRepository.find({
            where: { risk_id: riskId },
            relations: ['finding', 'linker'],
            order: { linked_at: 'DESC' },
        });
        return links.map(link => this.toResponseDto(link));
    }
    async findByFindingId(findingId) {
        const links = await this.linkRepository.find({
            where: { finding_id: findingId },
            relations: ['risk', 'linker'],
            order: { linked_at: 'DESC' },
        });
        return links.map(link => this.toResponseDto(link));
    }
    async getRisksForFinding(findingId) {
        const links = await this.linkRepository.find({
            where: { finding_id: findingId },
            relations: ['risk'],
        });
        return links.map(link => ({
            link_id: link.id,
            risk_id: link.risk.id,
            risk_identifier: link.risk.risk_id,
            risk_title: link.risk.title,
            risk_level: link.risk.current_risk_level,
            risk_score: link.risk.current_risk_score,
            relationship_type: link.relationship_type,
        }));
    }
    async getFindingsForRisk(riskId) {
        const links = await this.linkRepository.find({
            where: { risk_id: riskId },
            relations: ['finding'],
        });
        return links.map(link => ({
            link_id: link.id,
            finding_id: link.finding.id,
            finding_identifier: link.finding.finding_identifier,
            finding_title: link.finding.title,
            severity: link.finding.severity,
            status: link.finding.status,
            relationship_type: link.relationship_type,
        }));
    }
    async create(createDto, userId) {
        const risk = await this.riskRepository.findOne({ where: { id: createDto.risk_id } });
        if (!risk) {
            throw new common_1.NotFoundException(`Risk with ID ${createDto.risk_id} not found`);
        }
        const finding = await this.findingRepository.findOne({ where: { id: createDto.finding_id } });
        if (!finding) {
            throw new common_1.NotFoundException(`Finding with ID ${createDto.finding_id} not found`);
        }
        const existingLink = await this.linkRepository.findOne({
            where: { risk_id: createDto.risk_id, finding_id: createDto.finding_id },
        });
        if (existingLink) {
            throw new common_1.ConflictException('This finding is already linked to this risk');
        }
        const link = this.linkRepository.create(Object.assign(Object.assign({}, createDto), { linked_by: userId }));
        const savedLink = await this.linkRepository.save(link);
        const fullLink = await this.linkRepository.findOne({
            where: { id: savedLink.id },
            relations: ['risk', 'finding'],
        });
        return this.toResponseDto(fullLink);
    }
    async update(linkId, updateDto, userId) {
        const link = await this.linkRepository.findOne({
            where: { id: linkId },
            relations: ['risk', 'finding'],
        });
        if (!link) {
            throw new common_1.NotFoundException(`Risk-finding link with ID ${linkId} not found`);
        }
        Object.assign(link, updateDto);
        const updatedLink = await this.linkRepository.save(link);
        return this.toResponseDto(updatedLink);
    }
    async remove(linkId) {
        const link = await this.linkRepository.findOne({ where: { id: linkId } });
        if (!link) {
            throw new common_1.NotFoundException(`Risk-finding link with ID ${linkId} not found`);
        }
        await this.linkRepository.remove(link);
    }
    async removeByRiskAndFinding(riskId, findingId) {
        const link = await this.linkRepository.findOne({
            where: { risk_id: riskId, finding_id: findingId },
        });
        if (!link) {
            throw new common_1.NotFoundException('Risk-finding link not found');
        }
        await this.linkRepository.remove(link);
    }
    toResponseDto(link) {
        var _a;
        const dto = {
            id: link.id,
            risk_id: link.risk_id,
            finding_id: link.finding_id,
            relationship_type: link.relationship_type,
            notes: link.notes,
            linked_by: link.linked_by,
            linked_at: (_a = link.linked_at) === null || _a === void 0 ? void 0 : _a.toISOString(),
        };
        if (link.risk) {
            dto.risk_info = {
                risk_id: link.risk.risk_id,
                title: link.risk.title,
                current_risk_level: link.risk.current_risk_level,
                current_risk_score: link.risk.current_risk_score,
            };
        }
        if (link.finding) {
            dto.finding_info = {
                finding_identifier: link.finding.finding_identifier,
                title: link.finding.title,
                severity: link.finding.severity,
                status: link.finding.status,
            };
        }
        return dto;
    }
};
exports.RiskFindingLinkService = RiskFindingLinkService;
exports.RiskFindingLinkService = RiskFindingLinkService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(risk_finding_link_entity_1.RiskFindingLink)),
    __param(1, (0, typeorm_1.InjectRepository)(risk_entity_1.Risk)),
    __param(2, (0, typeorm_1.InjectRepository)(finding_entity_1.Finding)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], RiskFindingLinkService);
//# sourceMappingURL=risk-finding-link.service.js.map