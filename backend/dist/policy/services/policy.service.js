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
exports.PolicyService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const policy_entity_1 = require("../entities/policy.entity");
const workflow_service_1 = require("../../workflow/services/workflow.service");
const workflow_entity_1 = require("../../workflow/entities/workflow.entity");
let PolicyService = class PolicyService {
    constructor(policyRepository, workflowService) {
        this.policyRepository = policyRepository;
        this.workflowService = workflowService;
    }
    async findAll(query) {
        const page = (query === null || query === void 0 ? void 0 : query.page) || 1;
        const limit = (query === null || query === void 0 ? void 0 : query.limit) || 20;
        const skip = (page - 1) * limit;
        let queryBuilder = this.policyRepository.createQueryBuilder('policy');
        if (query === null || query === void 0 ? void 0 : query.search) {
            queryBuilder.where('(policy.title ILIKE :search OR policy.description ILIKE :search)', { search: `%${query.search}%` });
        }
        if (query === null || query === void 0 ? void 0 : query.status) {
            queryBuilder.andWhere('policy.status = :status', { status: query.status });
        }
        if (query === null || query === void 0 ? void 0 : query.policyType) {
            queryBuilder.andWhere('policy.policyType = :policyType', { policyType: query.policyType });
        }
        const total = await queryBuilder.getCount();
        const policies = await queryBuilder
            .orderBy('policy.createdAt', 'DESC')
            .skip(skip)
            .take(limit)
            .getMany();
        return {
            data: policies.map((policy) => this.toResponseDto(policy)),
            total,
            page,
            limit,
        };
    }
    async findOne(id) {
        const policy = await this.policyRepository.findOne({ where: { id } });
        if (!policy) {
            throw new common_1.NotFoundException(`Policy with ID ${id} not found`);
        }
        return this.toResponseDto(policy);
    }
    async create(createPolicyDto, userId) {
        const policyData = {
            title: createPolicyDto.title,
            description: createPolicyDto.description,
            policyType: createPolicyDto.policyType,
            status: createPolicyDto.status || policy_entity_1.PolicyStatus.DRAFT,
            version: createPolicyDto.version || '1.0',
            effectiveDate: createPolicyDto.effectiveDate ? new Date(createPolicyDto.effectiveDate) : null,
            reviewDate: createPolicyDto.reviewDate ? new Date(createPolicyDto.reviewDate) : null,
            ownerId: userId,
        };
        const policy = this.policyRepository.create(policyData);
        const savedPolicy = await this.policyRepository.save(policy);
        try {
            await this.workflowService.checkAndTriggerWorkflows(workflow_entity_1.EntityType.POLICY, savedPolicy.id, workflow_entity_1.WorkflowTrigger.ON_CREATE, { status: savedPolicy.status, policyType: savedPolicy.policyType });
        }
        catch (error) {
            console.error('Error triggering workflows:', error);
        }
        return this.toResponseDto(savedPolicy);
    }
    async update(id, updatePolicyDto) {
        const policy = await this.policyRepository.findOne({ where: { id } });
        if (!policy) {
            throw new common_1.NotFoundException(`Policy with ID ${id} not found`);
        }
        const updateData = {};
        if (updatePolicyDto.title !== undefined)
            updateData.title = updatePolicyDto.title;
        if (updatePolicyDto.description !== undefined)
            updateData.description = updatePolicyDto.description;
        if (updatePolicyDto.policyType !== undefined)
            updateData.policyType = updatePolicyDto.policyType;
        if (updatePolicyDto.status !== undefined)
            updateData.status = updatePolicyDto.status;
        if (updatePolicyDto.version !== undefined)
            updateData.version = updatePolicyDto.version;
        if (updatePolicyDto.effectiveDate !== undefined) {
            updateData.effectiveDate = updatePolicyDto.effectiveDate ? new Date(updatePolicyDto.effectiveDate) : null;
        }
        if (updatePolicyDto.reviewDate !== undefined) {
            updateData.reviewDate = updatePolicyDto.reviewDate ? new Date(updatePolicyDto.reviewDate) : null;
        }
        if (updatePolicyDto.documentUrl !== undefined)
            updateData.documentUrl = updatePolicyDto.documentUrl;
        if (updatePolicyDto.documentName !== undefined)
            updateData.documentName = updatePolicyDto.documentName;
        if (updatePolicyDto.documentMimeType !== undefined)
            updateData.documentMimeType = updatePolicyDto.documentMimeType;
        const oldStatus = policy.status;
        Object.assign(policy, updateData);
        const updatedPolicy = await this.policyRepository.save(policy);
        try {
            await this.workflowService.checkAndTriggerWorkflows(workflow_entity_1.EntityType.POLICY, updatedPolicy.id, workflow_entity_1.WorkflowTrigger.ON_UPDATE, { status: updatedPolicy.status, policyType: updatedPolicy.policyType });
            if (oldStatus !== updatedPolicy.status) {
                await this.workflowService.checkAndTriggerWorkflows(workflow_entity_1.EntityType.POLICY, updatedPolicy.id, workflow_entity_1.WorkflowTrigger.ON_STATUS_CHANGE, { oldStatus, newStatus: updatedPolicy.status, policyType: updatedPolicy.policyType });
            }
        }
        catch (error) {
            console.error('Error triggering workflows:', error);
        }
        return this.toResponseDto(updatedPolicy);
    }
    async uploadDocument(id, file) {
        const policy = await this.policyRepository.findOne({ where: { id } });
        if (!policy) {
            throw new common_1.NotFoundException(`Policy with ID ${id} not found`);
        }
        policy.documentUrl = `/api/policies/${id}/document`;
        policy.documentName = file.originalname;
        policy.documentMimeType = file.mimetype;
        const updatedPolicy = await this.policyRepository.save(policy);
        return this.toResponseDto(updatedPolicy);
    }
    async remove(id) {
        const policy = await this.policyRepository.findOne({ where: { id } });
        if (!policy) {
            throw new common_1.NotFoundException(`Policy with ID ${id} not found`);
        }
        await this.policyRepository.remove(policy);
    }
    async bulkUpdateStatus(ids, status) {
        const policies = await this.policyRepository.find({
            where: ids.map(id => ({ id })),
        });
        if (policies.length === 0) {
            throw new common_1.NotFoundException('No policies found with the provided IDs');
        }
        policies.forEach(policy => {
            policy.status = status;
        });
        const updatedPolicies = await this.policyRepository.save(policies);
        return {
            updated: updatedPolicies.length,
            policies: updatedPolicies.map(policy => this.toResponseDto(policy)),
        };
    }
    toResponseDto(policy) {
        var _a, _b;
        return {
            id: policy.id,
            title: policy.title,
            description: policy.description,
            policyType: policy.policyType,
            status: policy.status,
            version: policy.version,
            effectiveDate: (_a = policy.effectiveDate) === null || _a === void 0 ? void 0 : _a.toISOString(),
            reviewDate: (_b = policy.reviewDate) === null || _b === void 0 ? void 0 : _b.toISOString(),
            documentUrl: policy.documentUrl,
            documentName: policy.documentName,
            documentMimeType: policy.documentMimeType,
            createdAt: policy.createdAt.toISOString(),
        };
    }
};
exports.PolicyService = PolicyService;
exports.PolicyService = PolicyService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(policy_entity_1.Policy)),
    __param(1, (0, common_1.Inject)((0, common_1.forwardRef)(() => workflow_service_1.WorkflowService))),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        workflow_service_1.WorkflowService])
], PolicyService);
//# sourceMappingURL=policy.service.js.map