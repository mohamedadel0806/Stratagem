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
var ControlAssetMappingService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ControlAssetMappingService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const control_asset_mapping_entity_1 = require("../entities/control-asset-mapping.entity");
const unified_control_entity_1 = require("../entities/unified-control.entity");
let ControlAssetMappingService = ControlAssetMappingService_1 = class ControlAssetMappingService {
    constructor(mappingRepository, controlRepository) {
        this.mappingRepository = mappingRepository;
        this.controlRepository = controlRepository;
        this.logger = new common_1.Logger(ControlAssetMappingService_1.name);
    }
    async create(controlId, createDto, userId) {
        const control = await this.controlRepository.findOne({ where: { id: controlId } });
        if (!control) {
            throw new common_1.NotFoundException(`Unified control with ID ${controlId} not found`);
        }
        const existingMapping = await this.mappingRepository.findOne({
            where: {
                unified_control_id: controlId,
                asset_type: createDto.asset_type,
                asset_id: createDto.asset_id,
            },
        });
        if (existingMapping) {
            throw new common_1.ConflictException(`Control is already linked to this ${createDto.asset_type} asset`);
        }
        const mapping = this.mappingRepository.create(Object.assign(Object.assign({ unified_control_id: controlId }, createDto), { mapped_by: userId }));
        return this.mappingRepository.save(mapping);
    }
    async bulkCreate(controlId, bulkDto, userId) {
        const control = await this.controlRepository.findOne({ where: { id: controlId } });
        if (!control) {
            throw new common_1.NotFoundException(`Unified control with ID ${controlId} not found`);
        }
        const existingMappings = await this.mappingRepository.find({
            where: {
                unified_control_id: controlId,
                asset_type: bulkDto.asset_type,
                asset_id: (0, typeorm_2.In)(bulkDto.asset_ids),
            },
        });
        const existingAssetIds = new Set(existingMappings.map(m => m.asset_id));
        const newAssetIds = bulkDto.asset_ids.filter(id => !existingAssetIds.has(id));
        if (newAssetIds.length === 0) {
            throw new common_1.ConflictException('All selected assets are already linked to this control');
        }
        const mappings = newAssetIds.map(assetId => this.mappingRepository.create({
            unified_control_id: controlId,
            asset_type: bulkDto.asset_type,
            asset_id: assetId,
            implementation_date: bulkDto.implementation_date ? new Date(bulkDto.implementation_date) : null,
            implementation_status: bulkDto.implementation_status,
            implementation_notes: bulkDto.implementation_notes,
            mapped_by: userId,
        }));
        return this.mappingRepository.save(mappings);
    }
    async findAll(controlId, queryDto) {
        const where = {
            unified_control_id: controlId,
        };
        if (queryDto.asset_type) {
            where.asset_type = queryDto.asset_type;
        }
        if (queryDto.asset_id) {
            where.asset_id = queryDto.asset_id;
        }
        if (queryDto.implementation_status) {
            where.implementation_status = queryDto.implementation_status;
        }
        const mappings = await this.mappingRepository.find({
            where,
            relations: ['mapper'],
            order: { mapped_at: 'DESC' },
        });
        return mappings;
    }
    async findOne(controlId, mappingId) {
        const mapping = await this.mappingRepository.findOne({
            where: {
                id: mappingId,
                unified_control_id: controlId,
            },
            relations: ['mapper'],
        });
        if (!mapping) {
            throw new common_1.NotFoundException(`Control-asset mapping with ID ${mappingId} not found for control ${controlId}`);
        }
        return mapping;
    }
    async update(controlId, mappingId, updateDto) {
        const mapping = await this.findOne(controlId, mappingId);
        Object.assign(mapping, Object.assign(Object.assign({}, updateDto), { implementation_date: updateDto.implementation_date
                ? new Date(updateDto.implementation_date)
                : mapping.implementation_date, last_test_date: updateDto.last_test_date
                ? new Date(updateDto.last_test_date)
                : mapping.last_test_date }));
        return this.mappingRepository.save(mapping);
    }
    async remove(controlId, mappingId) {
        const mapping = await this.findOne(controlId, mappingId);
        await this.mappingRepository.remove(mapping);
    }
    async removeByAsset(controlId, assetType, assetId) {
        const mapping = await this.mappingRepository.findOne({
            where: {
                unified_control_id: controlId,
                asset_type: assetType,
                asset_id: assetId,
            },
        });
        if (!mapping) {
            throw new common_1.NotFoundException(`Control-asset mapping not found for ${assetType} asset ${assetId}`);
        }
        await this.mappingRepository.remove(mapping);
    }
    async bulkRemove(controlId, mappingIds) {
        const mappings = await this.mappingRepository.find({
            where: {
                id: (0, typeorm_2.In)(mappingIds),
                unified_control_id: controlId,
            },
        });
        const foundIds = new Set(mappings.map(m => m.id));
        const notFound = mappingIds.filter(id => !foundIds.has(id));
        if (mappings.length > 0) {
            await this.mappingRepository.remove(mappings);
        }
        return {
            deleted: mappings.length,
            notFound,
        };
    }
    async getAssetsByControl(controlId) {
        return this.mappingRepository.find({
            where: { unified_control_id: controlId },
            relations: ['mapper'],
            order: { mapped_at: 'DESC' },
        });
    }
    async getControlsByAsset(assetType, assetId) {
        return this.mappingRepository.find({
            where: {
                asset_type: assetType,
                asset_id: assetId,
            },
            relations: ['unified_control', 'mapper'],
            order: { mapped_at: 'DESC' },
        });
    }
    async linkControlsToAsset(assetType, assetId, controlIds, implementationStatus, implementationNotes, userId) {
        const existingMappings = await this.mappingRepository.find({
            where: {
                asset_type: assetType,
                asset_id: assetId,
                unified_control_id: (0, typeorm_2.In)(controlIds),
            },
        });
        const existingControlIds = new Set(existingMappings.map(m => m.unified_control_id));
        const newControlIds = controlIds.filter(id => !existingControlIds.has(id));
        const controls = await this.controlRepository.find({
            where: { id: (0, typeorm_2.In)(newControlIds) },
        });
        const validControlIds = new Set(controls.map(c => c.id));
        const validNewControlIds = newControlIds.filter(id => validControlIds.has(id));
        const mappings = validNewControlIds.map(controlId => this.mappingRepository.create({
            unified_control_id: controlId,
            asset_type: assetType,
            asset_id: assetId,
            implementation_status: implementationStatus || unified_control_entity_1.ImplementationStatus.NOT_IMPLEMENTED,
            implementation_notes: implementationNotes,
            mapped_by: userId,
        }));
        const created = mappings.length > 0 ? await this.mappingRepository.save(mappings) : [];
        return {
            created,
            alreadyLinked: controlIds.filter(id => existingControlIds.has(id)),
        };
    }
    async getAssetCompliancePosture(assetType, assetId) {
        const mappings = await this.mappingRepository.find({
            where: { asset_type: assetType, asset_id: assetId },
            relations: ['unified_control'],
            order: { mapped_at: 'DESC' },
        });
        const totalControls = mappings.length;
        let implementedControls = 0;
        let partialControls = 0;
        let notImplementedControls = 0;
        const controls = mappings.map(mapping => {
            switch (mapping.implementation_status) {
                case unified_control_entity_1.ImplementationStatus.IMPLEMENTED:
                    implementedControls++;
                    break;
                case unified_control_entity_1.ImplementationStatus.IN_PROGRESS:
                    partialControls++;
                    break;
                case unified_control_entity_1.ImplementationStatus.NOT_IMPLEMENTED:
                    notImplementedControls++;
                    break;
            }
            return {
                controlId: mapping.unified_control.id,
                controlIdentifier: mapping.unified_control.control_identifier,
                title: mapping.unified_control.title,
                implementationStatus: mapping.implementation_status,
                effectivenessScore: mapping.effectiveness_score,
                lastTestDate: mapping.last_test_date,
                implementationDate: mapping.implementation_date,
            };
        });
        const complianceScore = totalControls > 0
            ? Math.round(((implementedControls * 1.0 + partialControls * 0.5) / totalControls) * 100)
            : 0;
        return {
            assetId,
            assetType,
            totalControls,
            implementedControls,
            partialControls,
            notImplementedControls,
            complianceScore,
            controls,
        };
    }
    async getAssetTypeComplianceOverview(assetType) {
        const assetMappings = await this.mappingRepository
            .createQueryBuilder('mapping')
            .select('DISTINCT mapping.asset_id', 'assetId')
            .where('mapping.asset_type = :assetType', { assetType })
            .getRawMany();
        const assetIds = assetMappings.map(m => m.assetId);
        const totalAssets = assetIds.length;
        if (totalAssets === 0) {
            return {
                assetType,
                totalAssets: 0,
                assetsWithControls: 0,
                assetsWithoutControls: 0,
                averageComplianceScore: 0,
                complianceDistribution: { excellent: 0, good: 0, fair: 0, poor: 0 },
                topCompliantAssets: [],
            };
        }
        const assetCompliances = await Promise.all(assetIds.map(assetId => this.getAssetCompliancePosture(assetType, assetId)));
        const assetsWithControls = assetCompliances.length;
        const assetsWithoutControls = 0;
        const totalScore = assetCompliances.reduce((sum, asset) => sum + asset.complianceScore, 0);
        const averageComplianceScore = Math.round(totalScore / assetsWithControls);
        const distribution = { excellent: 0, good: 0, fair: 0, poor: 0 };
        assetCompliances.forEach(asset => {
            if (asset.complianceScore >= 90)
                distribution.excellent++;
            else if (asset.complianceScore >= 70)
                distribution.good++;
            else if (asset.complianceScore >= 50)
                distribution.fair++;
            else
                distribution.poor++;
        });
        const topCompliantAssets = assetCompliances
            .sort((a, b) => b.complianceScore - a.complianceScore)
            .slice(0, 5)
            .map(asset => ({
            assetId: asset.assetId,
            complianceScore: asset.complianceScore,
            totalControls: asset.totalControls,
        }));
        return {
            assetType,
            totalAssets,
            assetsWithControls,
            assetsWithoutControls,
            averageComplianceScore,
            complianceDistribution: distribution,
            topCompliantAssets,
        };
    }
    async getControlAssetMatrix(filters) {
        const { assetType, controlDomain, implementationStatus } = filters || {};
        let controlQuery = this.controlRepository.createQueryBuilder('control')
            .select([
            'control.id',
            'control.control_identifier',
            'control.title',
            'control.domain',
        ]);
        if (controlDomain) {
            controlQuery = controlQuery.where('control.domain = :domain', { domain: controlDomain });
        }
        const controls = await controlQuery.getMany();
        let assetQuery = this.mappingRepository
            .createQueryBuilder('mapping')
            .select('DISTINCT mapping.asset_id', 'assetId')
            .addSelect('mapping.asset_type', 'assetType');
        if (assetType) {
            assetQuery = assetQuery.where('mapping.asset_type = :assetType', { assetType });
        }
        const assetResults = await assetQuery.getRawMany();
        const assets = await Promise.all(assetResults.map(async (asset) => {
            const compliance = await this.getAssetCompliancePosture(asset.assetType, asset.assetId);
            return {
                id: asset.assetId,
                type: asset.assetType,
                complianceScore: compliance.complianceScore,
                totalControls: compliance.totalControls,
            };
        }));
        const matrix = [];
        for (const control of controls) {
            for (const asset of assets) {
                const mapping = await this.mappingRepository.findOne({
                    where: {
                        unified_control_id: control.id,
                        asset_type: asset.type,
                        asset_id: asset.id,
                    },
                });
                if (mapping) {
                    matrix.push({
                        controlId: control.id,
                        assetId: asset.id,
                        implementationStatus: mapping.implementation_status,
                        effectivenessScore: mapping.effectiveness_score,
                    });
                }
            }
        }
        const controlsWithCounts = await Promise.all(controls.map(async (control) => {
            const mappings = await this.mappingRepository.find({
                where: { unified_control_id: control.id },
            });
            let implementedAssets = 0;
            let partialAssets = 0;
            let notImplementedAssets = 0;
            mappings.forEach(mapping => {
                switch (mapping.implementation_status) {
                    case unified_control_entity_1.ImplementationStatus.IMPLEMENTED:
                        implementedAssets++;
                        break;
                    case unified_control_entity_1.ImplementationStatus.IN_PROGRESS:
                        partialAssets++;
                        break;
                    case unified_control_entity_1.ImplementationStatus.NOT_IMPLEMENTED:
                        notImplementedAssets++;
                        break;
                }
            });
            return {
                id: control.id,
                identifier: control.control_identifier,
                title: control.title,
                domain: control.domain,
                totalAssets: mappings.length,
                implementedAssets,
                partialAssets,
                notImplementedAssets,
            };
        }));
        return {
            controls: controlsWithCounts,
            assets,
            matrix,
        };
    }
    async getControlEffectivenessSummary(controlId) {
        const mappings = await this.mappingRepository.find({
            where: { unified_control_id: controlId },
            order: { updated_at: 'DESC' },
        });
        const totalAssets = mappings.length;
        const assetEffectiveness = mappings.map(mapping => ({
            assetId: mapping.asset_id,
            assetType: mapping.asset_type,
            effectivenessScore: mapping.effectiveness_score,
            lastTestDate: mapping.last_test_date,
            implementationStatus: mapping.implementation_status,
        }));
        const scoredAssets = assetEffectiveness.filter(a => a.effectivenessScore !== null);
        const averageEffectiveness = scoredAssets.length > 0
            ? Math.round(scoredAssets.reduce((sum, a) => sum + (a.effectivenessScore || 0), 0) / scoredAssets.length)
            : 0;
        const distribution = { excellent: 0, good: 0, fair: 0, poor: 0 };
        scoredAssets.forEach(asset => {
            const score = asset.effectivenessScore || 0;
            if (score >= 90)
                distribution.excellent++;
            else if (score >= 70)
                distribution.good++;
            else if (score >= 50)
                distribution.fair++;
            else
                distribution.poor++;
        });
        return {
            controlId,
            totalAssets,
            averageEffectiveness,
            effectivenessDistribution: distribution,
            assetEffectiveness,
        };
    }
    async bulkUpdateImplementationStatus(updates, userId) {
        const result = { updated: 0, notFound: 0, errors: [] };
        for (const update of updates) {
            try {
                const mapping = await this.mappingRepository.findOne({
                    where: {
                        unified_control_id: update.controlId,
                        asset_type: update.assetType,
                        asset_id: update.assetId,
                    },
                });
                if (!mapping) {
                    result.notFound++;
                    continue;
                }
                Object.assign(mapping, {
                    implementation_status: update.implementationStatus,
                    implementation_notes: update.implementationNotes,
                    effectiveness_score: update.effectivenessScore,
                    updated_at: new Date(),
                });
                await this.mappingRepository.save(mapping);
                result.updated++;
            }
            catch (error) {
                result.errors.push({
                    controlId: update.controlId,
                    assetId: update.assetId,
                    error: error instanceof Error ? error.message : 'Unknown error',
                });
            }
        }
        return result;
    }
};
exports.ControlAssetMappingService = ControlAssetMappingService;
exports.ControlAssetMappingService = ControlAssetMappingService = ControlAssetMappingService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(control_asset_mapping_entity_1.ControlAssetMapping)),
    __param(1, (0, typeorm_1.InjectRepository)(unified_control_entity_1.UnifiedControl)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], ControlAssetMappingService);
//# sourceMappingURL=control-asset-mapping.service.js.map