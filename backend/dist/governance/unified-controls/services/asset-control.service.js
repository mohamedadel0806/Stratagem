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
var AssetControlService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssetControlService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const control_asset_mapping_entity_1 = require("../entities/control-asset-mapping.entity");
const unified_control_entity_1 = require("../entities/unified-control.entity");
let AssetControlService = AssetControlService_1 = class AssetControlService {
    constructor(mappingRepository, controlRepository) {
        this.mappingRepository = mappingRepository;
        this.controlRepository = controlRepository;
        this.logger = new common_1.Logger(AssetControlService_1.name);
    }
    async mapControlToAsset(controlId, dto, userId) {
        const control = await this.controlRepository.findOne({ where: { id: controlId } });
        if (!control) {
            throw new common_1.NotFoundException(`Control ${controlId} not found`);
        }
        const existing = await this.mappingRepository.findOne({
            where: {
                unified_control_id: controlId,
                asset_id: dto.asset_id,
                asset_type: dto.asset_type,
            },
        });
        if (existing) {
            throw new common_1.BadRequestException(`Control ${controlId} is already mapped to asset ${dto.asset_id}`);
        }
        const mapping = this.mappingRepository.create({
            unified_control_id: controlId,
            asset_id: dto.asset_id,
            asset_type: dto.asset_type,
            implementation_status: dto.implementation_status || unified_control_entity_1.ImplementationStatus.NOT_IMPLEMENTED,
            implementation_notes: dto.implementation_notes,
            is_automated: dto.is_automated || false,
            mapped_by: userId,
        });
        const saved = await this.mappingRepository.save(mapping);
        this.logger.log(`Control ${controlId} mapped to asset ${dto.asset_id}`);
        return saved;
    }
    async mapControlToAssets(controlId, dto, userId) {
        const control = await this.controlRepository.findOne({ where: { id: controlId } });
        if (!control) {
            throw new common_1.NotFoundException(`Control ${controlId} not found`);
        }
        const existing = await this.mappingRepository.find({
            where: {
                unified_control_id: controlId,
                asset_id: (0, typeorm_2.In)(dto.asset_ids),
            },
        });
        if (existing.length > 0) {
            throw new common_1.BadRequestException(`Control is already mapped to ${existing.length} of the requested assets`);
        }
        const mappings = dto.asset_ids.map(assetId => this.mappingRepository.create({
            unified_control_id: controlId,
            asset_id: assetId,
            asset_type: dto.asset_type,
            implementation_status: unified_control_entity_1.ImplementationStatus.NOT_IMPLEMENTED,
            mapped_by: userId,
        }));
        const saved = await this.mappingRepository.save(mappings);
        this.logger.log(`Control ${controlId} mapped to ${saved.length} assets`);
        return saved;
    }
    async getAssetControls(assetId, assetType, page = 1, limit = 25) {
        const skip = (page - 1) * limit;
        const [mappings, total] = await this.mappingRepository.findAndCount({
            where: {
                asset_id: assetId,
                asset_type: assetType,
            },
            relations: ['unified_control'],
            order: { mapped_at: 'DESC' },
            skip,
            take: limit,
        });
        return { mappings, total };
    }
    async getControlAssets(controlId, page = 1, limit = 25) {
        const skip = (page - 1) * limit;
        const [mappings, total] = await this.mappingRepository.findAndCount({
            where: { unified_control_id: controlId },
            order: { mapped_at: 'DESC' },
            skip,
            take: limit,
        });
        return { mappings, total };
    }
    async updateMapping(controlId, assetId, dto) {
        const mapping = await this.mappingRepository.findOne({
            where: {
                unified_control_id: controlId,
                asset_id: assetId,
            },
        });
        if (!mapping) {
            throw new common_1.NotFoundException(`Mapping for control ${controlId} and asset ${assetId} not found`);
        }
        Object.assign(mapping, dto);
        const saved = await this.mappingRepository.save(mapping);
        this.logger.log(`Mapping for control ${controlId} and asset ${assetId} updated`);
        return saved;
    }
    async deleteMapping(controlId, assetId) {
        const mapping = await this.mappingRepository.findOne({
            where: {
                unified_control_id: controlId,
                asset_id: assetId,
            },
        });
        if (!mapping) {
            throw new common_1.NotFoundException(`Mapping for control ${controlId} and asset ${assetId} not found`);
        }
        await this.mappingRepository.remove(mapping);
        this.logger.log(`Mapping for control ${controlId} and asset ${assetId} deleted`);
    }
    async getAssetComplianceScore(assetId, assetType) {
        const mappings = await this.mappingRepository.find({
            where: {
                asset_id: assetId,
                asset_type: assetType,
            },
        });
        const breakdown = {
            [unified_control_entity_1.ImplementationStatus.NOT_IMPLEMENTED]: 0,
            [unified_control_entity_1.ImplementationStatus.PLANNED]: 0,
            [unified_control_entity_1.ImplementationStatus.IN_PROGRESS]: 0,
            [unified_control_entity_1.ImplementationStatus.IMPLEMENTED]: 0,
            [unified_control_entity_1.ImplementationStatus.NOT_APPLICABLE]: 0,
        };
        let implementedCount = 0;
        for (const mapping of mappings) {
            breakdown[mapping.implementation_status]++;
            if (mapping.implementation_status === unified_control_entity_1.ImplementationStatus.IMPLEMENTED) {
                implementedCount++;
            }
        }
        const applicableControls = mappings.filter(m => m.implementation_status !== unified_control_entity_1.ImplementationStatus.NOT_APPLICABLE).length;
        const compliancePercentage = applicableControls > 0 ? (implementedCount / applicableControls) * 100 : 0;
        return {
            asset_id: assetId,
            asset_type: assetType,
            total_controls: mappings.length,
            implemented_controls: implementedCount,
            compliance_percentage: Math.round(compliancePercentage * 100) / 100,
            implementation_status_breakdown: breakdown,
        };
    }
    async getControlEffectiveness(controlId) {
        const mappings = await this.mappingRepository.find({
            where: { unified_control_id: controlId },
        });
        const control = await this.controlRepository.findOne({ where: { id: controlId } });
        if (!control) {
            throw new common_1.NotFoundException(`Control ${controlId} not found`);
        }
        const breakdown = {
            [unified_control_entity_1.ImplementationStatus.NOT_IMPLEMENTED]: 0,
            [unified_control_entity_1.ImplementationStatus.PLANNED]: 0,
            [unified_control_entity_1.ImplementationStatus.IN_PROGRESS]: 0,
            [unified_control_entity_1.ImplementationStatus.IMPLEMENTED]: 0,
            [unified_control_entity_1.ImplementationStatus.NOT_APPLICABLE]: 0,
        };
        let totalEffectiveness = 0;
        let scoredMappings = 0;
        for (const mapping of mappings) {
            breakdown[mapping.implementation_status]++;
            if (mapping.effectiveness_score !== null && mapping.effectiveness_score !== undefined) {
                totalEffectiveness += mapping.effectiveness_score;
                scoredMappings++;
            }
        }
        const averageEffectiveness = scoredMappings > 0 ? totalEffectiveness / scoredMappings : 0;
        return {
            control_id: controlId,
            control_identifier: control.control_identifier,
            total_assets: mappings.length,
            average_effectiveness: Math.round(averageEffectiveness * 100) / 100,
            implementation_status_breakdown: breakdown,
        };
    }
    async getAssetControlMatrix(assetType, domain, status) {
        let query = this.mappingRepository
            .createQueryBuilder('mapping')
            .leftJoinAndSelect('mapping.unified_control', 'control');
        if (assetType) {
            query = query.where('mapping.asset_type = :assetType', { assetType });
        }
        if (domain) {
            query = query.andWhere('control.domain = :domain', { domain });
        }
        if (status) {
            query = query.andWhere('mapping.implementation_status = :status', { status });
        }
        const mappings = await query.orderBy('control.control_identifier', 'ASC').getMany();
        const controlMap = new Map();
        for (const mapping of mappings) {
            const controlId = mapping.unified_control_id;
            if (!controlMap.has(controlId)) {
                controlMap.set(controlId, {
                    control_id: controlId,
                    control_identifier: mapping.unified_control.control_identifier,
                    control_title: mapping.unified_control.title,
                });
            }
            const row = controlMap.get(controlId);
            row[mapping.asset_id] = mapping.implementation_status;
        }
        return Array.from(controlMap.values());
    }
    async getMatrixStatistics() {
        const allMappings = await this.mappingRepository.find();
        const allControls = await this.controlRepository.find();
        const byStatus = {
            [unified_control_entity_1.ImplementationStatus.NOT_IMPLEMENTED]: 0,
            [unified_control_entity_1.ImplementationStatus.PLANNED]: 0,
            [unified_control_entity_1.ImplementationStatus.IN_PROGRESS]: 0,
            [unified_control_entity_1.ImplementationStatus.IMPLEMENTED]: 0,
            [unified_control_entity_1.ImplementationStatus.NOT_APPLICABLE]: 0,
        };
        const byAssetType = {
            [control_asset_mapping_entity_1.AssetType.PHYSICAL]: 0,
            [control_asset_mapping_entity_1.AssetType.INFORMATION]: 0,
            [control_asset_mapping_entity_1.AssetType.APPLICATION]: 0,
            [control_asset_mapping_entity_1.AssetType.SOFTWARE]: 0,
            [control_asset_mapping_entity_1.AssetType.SUPPLIER]: 0,
        };
        let totalEffectiveness = 0;
        let effectivenessCount = 0;
        for (const mapping of allMappings) {
            byStatus[mapping.implementation_status]++;
            byAssetType[mapping.asset_type]++;
            if (mapping.effectiveness_score !== null && mapping.effectiveness_score !== undefined) {
                totalEffectiveness += mapping.effectiveness_score;
                effectivenessCount++;
            }
        }
        const mappedControlIds = new Set(allMappings.map(m => m.unified_control_id));
        const unmappedControls = allControls.filter(c => !mappedControlIds.has(c.id));
        return {
            total_mappings: allMappings.length,
            by_implementation_status: byStatus,
            by_asset_type: byAssetType,
            average_effectiveness: effectivenessCount > 0 ? totalEffectiveness / effectivenessCount : 0,
            unmapped_controls_count: unmappedControls.length,
            unmapped_assets_count: 0,
        };
    }
    async bulkUpdateStatus(dto, userId) {
        const result = await this.mappingRepository.update({ id: (0, typeorm_2.In)(dto.mapping_ids) }, {
            implementation_status: dto.implementation_status,
            updated_at: new Date(),
        });
        this.logger.log(`Updated ${result.affected || 0} mappings to status ${dto.implementation_status}`);
        return { updated: result.affected || 0 };
    }
    async getUnmappedControls(page = 1, limit = 25) {
        const skip = (page - 1) * limit;
        const [allControls, total] = await this.controlRepository.findAndCount({
            skip,
            take: limit,
        });
        const mappedControlIds = await this.mappingRepository
            .createQueryBuilder('mapping')
            .distinct(true)
            .select('mapping.unified_control_id')
            .getRawMany()
            .then(results => new Set(results.map(r => r.mapping_unified_control_id)));
        const unmappedControls = allControls.filter(c => !mappedControlIds.has(c.id));
        return {
            controls: unmappedControls,
            total,
        };
    }
    async getComprehensiveStatistics() {
        const allControls = await this.controlRepository.find();
        const allMappings = await this.mappingRepository.find();
        const distribution = {
            [unified_control_entity_1.ImplementationStatus.NOT_IMPLEMENTED]: 0,
            [unified_control_entity_1.ImplementationStatus.PLANNED]: 0,
            [unified_control_entity_1.ImplementationStatus.IN_PROGRESS]: 0,
            [unified_control_entity_1.ImplementationStatus.IMPLEMENTED]: 0,
            [unified_control_entity_1.ImplementationStatus.NOT_APPLICABLE]: 0,
        };
        let totalEffectiveness = 0;
        let effectivenessCount = 0;
        for (const mapping of allMappings) {
            distribution[mapping.implementation_status]++;
            if (mapping.effectiveness_score !== null && mapping.effectiveness_score !== undefined) {
                totalEffectiveness += mapping.effectiveness_score;
                effectivenessCount++;
            }
        }
        const implementedMappings = Object.entries(distribution)
            .filter(([status]) => status === unified_control_entity_1.ImplementationStatus.IMPLEMENTED)
            .reduce((sum, [, count]) => sum + count, 0);
        const applicableMappings = allMappings.filter(m => m.implementation_status !== unified_control_entity_1.ImplementationStatus.NOT_APPLICABLE).length;
        const averageCompliance = applicableMappings > 0 ? (implementedMappings / applicableMappings) * 100 : 0;
        return {
            total_controls: allControls.length,
            total_mappings: allMappings.length,
            average_compliance_score: Math.round(averageCompliance * 100) / 100,
            average_effectiveness_score: effectivenessCount > 0 ? Math.round((totalEffectiveness / effectivenessCount) * 100) / 100 : 0,
            implementation_distribution: distribution,
        };
    }
    async getComplianceByAssetType() {
        const allMappings = await this.mappingRepository.find();
        const byType = {
            [control_asset_mapping_entity_1.AssetType.PHYSICAL]: { total: 0, implemented: 0 },
            [control_asset_mapping_entity_1.AssetType.INFORMATION]: { total: 0, implemented: 0 },
            [control_asset_mapping_entity_1.AssetType.APPLICATION]: { total: 0, implemented: 0 },
            [control_asset_mapping_entity_1.AssetType.SOFTWARE]: { total: 0, implemented: 0 },
            [control_asset_mapping_entity_1.AssetType.SUPPLIER]: { total: 0, implemented: 0 },
        };
        for (const mapping of allMappings) {
            byType[mapping.asset_type].total++;
            if (mapping.implementation_status === unified_control_entity_1.ImplementationStatus.IMPLEMENTED) {
                byType[mapping.asset_type].implemented++;
            }
        }
        return Object.entries(byType).map(([type, stats]) => ({
            asset_type: type,
            total_mappings: stats.total,
            implemented: stats.implemented,
            compliance_percentage: stats.total > 0 ? Math.round((stats.implemented / stats.total) * 100 * 100) / 100 : 0,
        }));
    }
};
exports.AssetControlService = AssetControlService;
exports.AssetControlService = AssetControlService = AssetControlService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(control_asset_mapping_entity_1.ControlAssetMapping)),
    __param(1, (0, typeorm_1.InjectRepository)(unified_control_entity_1.UnifiedControl)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], AssetControlService);
//# sourceMappingURL=asset-control.service.js.map