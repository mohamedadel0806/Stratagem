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
exports.FrameworksService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const compliance_framework_entity_1 = require("../../common/entities/compliance-framework.entity");
const framework_requirement_entity_1 = require("../unified-controls/entities/framework-requirement.entity");
const framework_version_entity_1 = require("./entities/framework-version.entity");
let FrameworksService = class FrameworksService {
    constructor(frameworkRepository, requirementRepository, versionRepository) {
        this.frameworkRepository = frameworkRepository;
        this.requirementRepository = requirementRepository;
        this.versionRepository = versionRepository;
    }
    async createVersion(frameworkId, createDto, userId) {
        const framework = await this.frameworkRepository.findOne({ where: { id: frameworkId } });
        if (!framework) {
            throw new common_1.NotFoundException(`Framework with ID ${frameworkId} not found`);
        }
        const existingVersion = await this.versionRepository.findOne({
            where: { framework_id: frameworkId, version: createDto.version },
        });
        if (existingVersion) {
            throw new common_1.BadRequestException(`Version ${createDto.version} already exists for this framework`);
        }
        if (createDto.is_current) {
            await this.versionRepository.update({ framework_id: frameworkId }, { is_current: false });
        }
        const version = this.versionRepository.create(Object.assign(Object.assign({}, createDto), { framework_id: frameworkId, created_by: userId, structure: createDto.structure || framework.structure }));
        const savedVersion = await this.versionRepository.save(version);
        if (createDto.is_current) {
            await this.frameworkRepository.update(frameworkId, {
                version: createDto.version,
                structure: createDto.structure || framework.structure,
                updated_by: userId,
            });
        }
        return savedVersion;
    }
    async getVersions(frameworkId) {
        return this.versionRepository.find({
            where: { framework_id: frameworkId },
            relations: ['creator'],
            order: { created_at: 'DESC' },
        });
    }
    async getVersion(frameworkId, version) {
        const frameworkVersion = await this.versionRepository.findOne({
            where: { framework_id: frameworkId, version },
            relations: ['framework', 'creator'],
        });
        if (!frameworkVersion) {
            throw new common_1.NotFoundException(`Version ${version} not found for framework ${frameworkId}`);
        }
        return frameworkVersion;
    }
    async setCurrentVersion(frameworkId, version, userId) {
        const frameworkVersion = await this.getVersion(frameworkId, version);
        await this.versionRepository.update({ framework_id: frameworkId }, { is_current: false });
        frameworkVersion.is_current = true;
        await this.versionRepository.save(frameworkVersion);
        await this.frameworkRepository.update(frameworkId, {
            version: frameworkVersion.version,
            structure: frameworkVersion.structure,
            updated_by: userId,
        });
        return frameworkVersion;
    }
    async importFrameworkStructure(importDto, userId) {
        const framework = await this.frameworkRepository.findOne({
            where: { id: importDto.framework_id },
        });
        if (!framework) {
            throw new common_1.NotFoundException(`Framework with ID ${importDto.framework_id} not found`);
        }
        if (!importDto.structure) {
            throw new common_1.BadRequestException('Structure is required for import');
        }
        let requirementsCreated = 0;
        if (importDto.replace_existing) {
            await this.requirementRepository.delete({ framework_id: importDto.framework_id });
        }
        if (importDto.structure.domains) {
            for (const domain of importDto.structure.domains) {
                if (domain.categories) {
                    for (const category of domain.categories) {
                        if (category.requirements) {
                            for (const req of category.requirements) {
                                const existing = await this.requirementRepository.findOne({
                                    where: {
                                        framework_id: importDto.framework_id,
                                        requirement_identifier: req.identifier,
                                    },
                                });
                                if (!existing) {
                                    const requirement = this.requirementRepository.create({
                                        framework_id: importDto.framework_id,
                                        requirement_identifier: req.identifier,
                                        title: req.title,
                                        requirement_text: req.text,
                                        description: req.description,
                                        domain: domain.name,
                                        category: category.name,
                                        subcategory: req.subcategory,
                                        display_order: req.display_order,
                                    });
                                    await this.requirementRepository.save(requirement);
                                    requirementsCreated++;
                                }
                            }
                        }
                    }
                }
            }
        }
        framework.structure = importDto.structure;
        if (importDto.version) {
            framework.version = importDto.version;
        }
        framework.updated_by = userId;
        await this.frameworkRepository.save(framework);
        let version;
        if (importDto.create_version && importDto.version) {
            version = await this.createVersion(importDto.framework_id, {
                version: importDto.version,
                structure: importDto.structure,
                is_current: true,
            }, userId);
        }
        return {
            framework,
            requirementsCreated,
            version,
        };
    }
    async getFrameworkWithStructure(frameworkId) {
        const framework = await this.frameworkRepository.findOne({
            where: { id: frameworkId },
        });
        if (!framework) {
            throw new common_1.NotFoundException(`Framework with ID ${frameworkId} not found`);
        }
        const requirements = await this.requirementRepository.find({
            where: { framework_id: frameworkId },
            order: { display_order: 'ASC', requirement_identifier: 'ASC' },
        });
        return Object.assign(Object.assign({}, framework), { requirements });
    }
};
exports.FrameworksService = FrameworksService;
exports.FrameworksService = FrameworksService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(compliance_framework_entity_1.ComplianceFramework)),
    __param(1, (0, typeorm_1.InjectRepository)(framework_requirement_entity_1.FrameworkRequirement)),
    __param(2, (0, typeorm_1.InjectRepository)(framework_version_entity_1.FrameworkVersion)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], FrameworksService);
//# sourceMappingURL=frameworks.service.js.map