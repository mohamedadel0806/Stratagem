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
var FrameworkControlMappingService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.FrameworkControlMappingService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const framework_control_mapping_entity_1 = require("../entities/framework-control-mapping.entity");
const unified_control_entity_1 = require("../entities/unified-control.entity");
const framework_requirement_entity_1 = require("../entities/framework-requirement.entity");
let FrameworkControlMappingService = FrameworkControlMappingService_1 = class FrameworkControlMappingService {
    constructor(mappingRepository, controlRepository, requirementRepository) {
        this.mappingRepository = mappingRepository;
        this.controlRepository = controlRepository;
        this.requirementRepository = requirementRepository;
        this.logger = new common_1.Logger(FrameworkControlMappingService_1.name);
    }
    async createMapping(controlId, requirementId, coverageLevel, mappingNotes, userId) {
        const control = await this.controlRepository.findOne({ where: { id: controlId } });
        if (!control) {
            throw new common_1.NotFoundException(`Control with ID ${controlId} not found`);
        }
        const requirement = await this.requirementRepository.findOne({
            where: { id: requirementId },
            relations: ['framework'],
        });
        if (!requirement) {
            throw new common_1.NotFoundException(`Framework requirement with ID ${requirementId} not found`);
        }
        const existing = await this.mappingRepository.findOne({
            where: {
                unified_control_id: controlId,
                framework_requirement_id: requirementId,
            },
        });
        if (existing) {
            existing.coverage_level = coverageLevel;
            existing.mapping_notes = mappingNotes || null;
            if (userId) {
                existing.mapped_by = userId;
            }
            return this.mappingRepository.save(existing);
        }
        const mapping = this.mappingRepository.create({
            unified_control_id: controlId,
            framework_requirement_id: requirementId,
            coverage_level: coverageLevel,
            mapping_notes: mappingNotes || null,
            mapped_by: userId || null,
        });
        return this.mappingRepository.save(mapping);
    }
    async getMappingsForControl(controlId) {
        return this.mappingRepository.find({
            where: { unified_control_id: controlId },
            relations: ['framework_requirement', 'framework_requirement.framework', 'mapper'],
            order: { mapped_at: 'DESC' },
        });
    }
    async getMappingsForRequirement(requirementId) {
        return this.mappingRepository.find({
            where: { framework_requirement_id: requirementId },
            relations: ['unified_control', 'mapper'],
            order: { mapped_at: 'DESC' },
        });
    }
    async bulkCreateMappings(controlId, requirementIds, coverageLevel, mappingNotes, userId) {
        const control = await this.controlRepository.findOne({ where: { id: controlId } });
        if (!control) {
            throw new common_1.NotFoundException(`Control with ID ${controlId} not found`);
        }
        const requirements = await this.requirementRepository.find({
            where: { id: (0, typeorm_2.In)(requirementIds) },
        });
        const validRequirementIds = new Set(requirements.map((r) => r.id));
        const invalidIds = requirementIds.filter((id) => !validRequirementIds.has(id));
        if (invalidIds.length > 0) {
            this.logger.warn(`Invalid requirement IDs: ${invalidIds.join(', ')}`);
        }
        const existingMappings = await this.mappingRepository.find({
            where: {
                unified_control_id: controlId,
                framework_requirement_id: (0, typeorm_2.In)(Array.from(validRequirementIds)),
            },
        });
        const existingRequirementIds = new Set(existingMappings.map((m) => m.framework_requirement_id));
        const newRequirementIds = Array.from(validRequirementIds).filter((id) => !existingRequirementIds.has(id));
        const mappings = newRequirementIds.map((requirementId) => this.mappingRepository.create({
            unified_control_id: controlId,
            framework_requirement_id: requirementId,
            coverage_level: coverageLevel,
            mapping_notes: mappingNotes || null,
            mapped_by: userId || null,
        }));
        const created = mappings.length > 0 ? await this.mappingRepository.save(mappings) : [];
        return {
            created,
            alreadyLinked: Array.from(existingRequirementIds),
        };
    }
    async updateMapping(mappingId, coverageLevel, mappingNotes) {
        const mapping = await this.mappingRepository.findOne({ where: { id: mappingId } });
        if (!mapping) {
            throw new common_1.NotFoundException(`Mapping with ID ${mappingId} not found`);
        }
        if (coverageLevel !== undefined) {
            mapping.coverage_level = coverageLevel;
        }
        if (mappingNotes !== undefined) {
            mapping.mapping_notes = mappingNotes;
        }
        return this.mappingRepository.save(mapping);
    }
    async deleteMapping(mappingId) {
        const mapping = await this.mappingRepository.findOne({ where: { id: mappingId } });
        if (!mapping) {
            throw new common_1.NotFoundException(`Mapping with ID ${mappingId} not found`);
        }
        await this.mappingRepository.remove(mapping);
    }
    async deleteMappingsForControl(controlId) {
        await this.mappingRepository.delete({ unified_control_id: controlId });
    }
    async getCoverageMatrix(frameworkId) {
        const mappings = await this.mappingRepository.find({
            where: {
                framework_requirement: {
                    framework_id: frameworkId,
                },
            },
            relations: ['framework_requirement', 'unified_control'],
        });
        return mappings.map((m) => ({
            requirementId: m.framework_requirement_id,
            requirementIdentifier: m.framework_requirement.requirement_identifier,
            requirementTitle: m.framework_requirement.title,
            controlId: m.unified_control_id,
            controlIdentifier: m.unified_control.control_identifier,
            controlTitle: m.unified_control.title,
            coverageLevel: m.coverage_level,
        }));
    }
};
exports.FrameworkControlMappingService = FrameworkControlMappingService;
exports.FrameworkControlMappingService = FrameworkControlMappingService = FrameworkControlMappingService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(framework_control_mapping_entity_1.FrameworkControlMapping)),
    __param(1, (0, typeorm_1.InjectRepository)(unified_control_entity_1.UnifiedControl)),
    __param(2, (0, typeorm_1.InjectRepository)(framework_requirement_entity_1.FrameworkRequirement)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], FrameworkControlMappingService);
//# sourceMappingURL=framework-control-mapping.service.js.map