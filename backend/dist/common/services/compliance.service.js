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
exports.ComplianceService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const compliance_framework_entity_1 = require("../entities/compliance-framework.entity");
const compliance_requirement_entity_1 = require("../entities/compliance-requirement.entity");
const workflow_service_1 = require("../../workflow/services/workflow.service");
const workflow_entity_1 = require("../../workflow/entities/workflow.entity");
let ComplianceService = class ComplianceService {
    constructor(frameworksRepository, requirementsRepository, workflowService) {
        this.frameworksRepository = frameworksRepository;
        this.requirementsRepository = requirementsRepository;
        this.workflowService = workflowService;
    }
    async getStatus(organizationId) {
        const query = this.frameworksRepository
            .createQueryBuilder('framework')
            .leftJoinAndSelect('framework.requirements', 'requirement')
            .orderBy('framework.name', 'ASC')
            .select([
            'framework.id',
            'framework.name',
            'framework.framework_code',
            'framework.version',
            'framework.status',
            'requirement.id',
            'requirement.status',
        ]);
        if (organizationId) {
            query.where('framework.organizationId = :organizationId', { organizationId });
        }
        const frameworks = await query.getMany();
        const frameworkStatuses = frameworks.map((framework) => {
            const totalRequirements = framework.requirements.length;
            const compliantRequirements = framework.requirements.filter((req) => req.status === compliance_requirement_entity_1.RequirementStatus.COMPLIANT).length;
            const inProgressRequirements = framework.requirements.filter((req) => req.status === compliance_requirement_entity_1.RequirementStatus.IN_PROGRESS).length;
            const compliancePercentage = totalRequirements > 0
                ? Math.round((compliantRequirements / totalRequirements) * 100)
                : 0;
            const trend = inProgressRequirements > 0 ? 'improving' : compliancePercentage >= 80 ? 'stable' : 'declining';
            return {
                name: framework.name,
                compliancePercentage,
                requirementsMet: compliantRequirements,
                totalRequirements,
                trend,
            };
        });
        const overallCompliance = frameworkStatuses.length > 0
            ? Math.round(frameworkStatuses.reduce((sum, fw) => sum + fw.compliancePercentage, 0) /
                frameworkStatuses.length)
            : 0;
        return {
            overallCompliance,
            frameworks: frameworkStatuses,
        };
    }
    async findAllFrameworks() {
        const frameworks = await this.frameworksRepository.find({
            order: { name: 'ASC' },
        });
        return frameworks.map((fw) => this.toFrameworkDto(fw));
    }
    async findFrameworkById(id) {
        const framework = await this.frameworksRepository.findOne({ where: { id } });
        if (!framework) {
            throw new common_1.NotFoundException(`Framework with ID ${id} not found`);
        }
        return this.toFrameworkDto(framework);
    }
    async createFramework(createDto) {
        const framework = this.frameworksRepository.create(createDto);
        const saved = await this.frameworksRepository.save(framework);
        return this.toFrameworkDto(saved);
    }
    async updateFramework(id, updateDto) {
        const framework = await this.frameworksRepository.findOne({ where: { id } });
        if (!framework) {
            throw new common_1.NotFoundException(`Framework with ID ${id} not found`);
        }
        Object.assign(framework, updateDto);
        const updated = await this.frameworksRepository.save(framework);
        return this.toFrameworkDto(updated);
    }
    async deleteFramework(id) {
        const framework = await this.frameworksRepository.findOne({ where: { id } });
        if (!framework) {
            throw new common_1.NotFoundException(`Framework with ID ${id} not found`);
        }
        await this.frameworksRepository.remove(framework);
    }
    async findAllRequirements(query) {
        const page = (query === null || query === void 0 ? void 0 : query.page) || 1;
        const limit = (query === null || query === void 0 ? void 0 : query.limit) || 20;
        const skip = (page - 1) * limit;
        let queryBuilder = this.requirementsRepository.createQueryBuilder('requirement');
        if (query === null || query === void 0 ? void 0 : query.search) {
            queryBuilder.where('(requirement.title ILIKE :search OR requirement.description ILIKE :search)', { search: `%${query.search}%` });
        }
        if (query === null || query === void 0 ? void 0 : query.frameworkId) {
            queryBuilder.andWhere('requirement.frameworkId = :frameworkId', { frameworkId: query.frameworkId });
        }
        if (query === null || query === void 0 ? void 0 : query.status) {
            queryBuilder.andWhere('requirement.status = :status', { status: query.status });
        }
        if (query === null || query === void 0 ? void 0 : query.category) {
            queryBuilder.andWhere('requirement.category = :category', { category: query.category });
        }
        const total = await queryBuilder.getCount();
        const safeLimit = Math.min(limit, 500);
        const requirements = await queryBuilder
            .orderBy('requirement.createdAt', 'DESC')
            .skip(skip)
            .take(safeLimit)
            .getMany();
        return {
            data: requirements.map((req) => this.toRequirementDto(req)),
            total,
            page,
            limit: safeLimit,
        };
    }
    async findRequirementById(id) {
        const requirement = await this.requirementsRepository.findOne({ where: { id } });
        if (!requirement) {
            throw new common_1.NotFoundException(`Requirement with ID ${id} not found`);
        }
        return this.toRequirementDto(requirement);
    }
    async createRequirement(createDto) {
        const framework = await this.frameworksRepository.findOne({ where: { id: createDto.frameworkId } });
        if (!framework) {
            throw new common_1.NotFoundException(`Framework with ID ${createDto.frameworkId} not found`);
        }
        const requirement = this.requirementsRepository.create(Object.assign(Object.assign({}, createDto), { status: createDto.status || compliance_requirement_entity_1.RequirementStatus.NOT_STARTED }));
        const saved = await this.requirementsRepository.save(requirement);
        try {
            await this.workflowService.checkAndTriggerWorkflows(workflow_entity_1.EntityType.COMPLIANCE_REQUIREMENT, saved.id, workflow_entity_1.WorkflowTrigger.ON_CREATE, { status: saved.status, frameworkId: saved.frameworkId, category: saved.category });
        }
        catch (error) {
            console.error('Error triggering workflows:', error);
        }
        return this.toRequirementDto(saved);
    }
    async updateRequirement(id, updateDto) {
        const requirement = await this.requirementsRepository.findOne({ where: { id } });
        if (!requirement) {
            throw new common_1.NotFoundException(`Requirement with ID ${id} not found`);
        }
        if (updateDto.frameworkId && updateDto.frameworkId !== requirement.frameworkId) {
            const framework = await this.frameworksRepository.findOne({ where: { id: updateDto.frameworkId } });
            if (!framework) {
                throw new common_1.NotFoundException(`Framework with ID ${updateDto.frameworkId} not found`);
            }
        }
        const oldStatus = requirement.status;
        Object.assign(requirement, updateDto);
        const updated = await this.requirementsRepository.save(requirement);
        try {
            await this.workflowService.checkAndTriggerWorkflows(workflow_entity_1.EntityType.COMPLIANCE_REQUIREMENT, updated.id, workflow_entity_1.WorkflowTrigger.ON_UPDATE, { status: updated.status, frameworkId: updated.frameworkId, category: updated.category });
            if (oldStatus !== updated.status) {
                await this.workflowService.checkAndTriggerWorkflows(workflow_entity_1.EntityType.COMPLIANCE_REQUIREMENT, updated.id, workflow_entity_1.WorkflowTrigger.ON_STATUS_CHANGE, { oldStatus, newStatus: updated.status, frameworkId: updated.frameworkId });
            }
        }
        catch (error) {
            console.error('Error triggering workflows:', error);
        }
        return this.toRequirementDto(updated);
    }
    async deleteRequirement(id) {
        const requirement = await this.requirementsRepository.findOne({ where: { id } });
        if (!requirement) {
            throw new common_1.NotFoundException(`Requirement with ID ${id} not found`);
        }
        await this.requirementsRepository.remove(requirement);
    }
    async bulkUpdateRequirementStatus(ids, status) {
        const requirements = await this.requirementsRepository.find({
            where: ids.map(id => ({ id })),
        });
        if (requirements.length === 0) {
            throw new common_1.NotFoundException('No requirements found with the provided IDs');
        }
        requirements.forEach(requirement => {
            requirement.status = status;
        });
        const updatedRequirements = await this.requirementsRepository.save(requirements);
        return {
            updated: updatedRequirements.length,
            requirements: updatedRequirements.map(req => this.toRequirementDto(req)),
        };
    }
    toFrameworkDto(framework) {
        return {
            id: framework.id,
            name: framework.name,
            code: framework.code,
            description: framework.description,
            region: framework.region,
            createdAt: framework.created_at.toISOString(),
            updatedAt: framework.updated_at.toISOString(),
        };
    }
    async bulkCreateRequirements(frameworkId, requirements, clearExisting = true) {
        const framework = await this.frameworksRepository.findOne({ where: { id: frameworkId } });
        if (!framework) {
            throw new common_1.NotFoundException(`Framework with ID ${frameworkId} not found`);
        }
        let deleted = 0;
        if (clearExisting) {
            const existingRequirements = await this.requirementsRepository.find({
                where: { frameworkId },
            });
            if (existingRequirements.length > 0) {
                await this.requirementsRepository.remove(existingRequirements);
                deleted = existingRequirements.length;
            }
        }
        const errors = [];
        let created = 0;
        for (const reqData of requirements) {
            try {
                const requirement = this.requirementsRepository.create({
                    title: reqData.title,
                    description: reqData.description,
                    requirementCode: reqData.requirementCode,
                    category: reqData.category,
                    complianceDeadline: reqData.complianceDeadline,
                    applicability: reqData.applicability,
                    frameworkId,
                    status: reqData.status || compliance_requirement_entity_1.RequirementStatus.NOT_STARTED,
                });
                await this.requirementsRepository.save(requirement);
                created++;
            }
            catch (error) {
                errors.push(`Failed to create "${reqData.title}": ${error.message}`);
            }
        }
        return { created, errors, deleted };
    }
    toRequirementDto(requirement) {
        return {
            id: requirement.id,
            title: requirement.title,
            description: requirement.description,
            requirementCode: requirement.requirementCode,
            category: requirement.category,
            complianceDeadline: requirement.complianceDeadline,
            applicability: requirement.applicability,
            frameworkId: requirement.frameworkId,
            status: requirement.status,
            createdAt: requirement.createdAt.toISOString(),
            updatedAt: requirement.updatedAt.toISOString(),
        };
    }
};
exports.ComplianceService = ComplianceService;
exports.ComplianceService = ComplianceService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(compliance_framework_entity_1.ComplianceFramework)),
    __param(1, (0, typeorm_1.InjectRepository)(compliance_requirement_entity_1.ComplianceRequirement)),
    __param(2, (0, common_1.Inject)((0, common_1.forwardRef)(() => workflow_service_1.WorkflowService))),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        workflow_service_1.WorkflowService])
], ComplianceService);
//# sourceMappingURL=compliance.service.js.map