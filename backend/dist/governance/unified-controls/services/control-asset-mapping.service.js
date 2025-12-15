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
            alreadyLinked: Array.from(existingControlIds),
        };
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