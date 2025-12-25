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
var PolicyVersionService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PolicyVersionService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const policy_version_entity_1 = require("../entities/policy-version.entity");
const policy_entity_1 = require("../entities/policy.entity");
const user_entity_1 = require("../../../users/entities/user.entity");
let PolicyVersionService = PolicyVersionService_1 = class PolicyVersionService {
    constructor(versionRepository, policyRepository, userRepository) {
        this.versionRepository = versionRepository;
        this.policyRepository = policyRepository;
        this.userRepository = userRepository;
        this.logger = new common_1.Logger(PolicyVersionService_1.name);
    }
    async createVersion(policyId, content, version, versionNumber, changeSummary, userId) {
        const policy = await this.policyRepository.findOne({
            where: { id: policyId, deleted_at: null },
        });
        if (!policy) {
            throw new common_1.NotFoundException(`Policy with ID ${policyId} not found`);
        }
        if (userId) {
            const user = await this.userRepository.findOne({
                where: { id: userId },
            });
            if (!user) {
                throw new common_1.NotFoundException(`User with ID ${userId} not found`);
            }
        }
        const policyVersion = this.versionRepository.create({
            policy_id: policyId,
            content,
            version,
            version_number: versionNumber,
            change_summary: changeSummary,
            created_by: userId,
        });
        const savedVersion = await this.versionRepository.save(policyVersion);
        this.logger.log(`Created policy version: ${savedVersion.id} (v${versionNumber}) for policy ${policyId}`);
        return savedVersion;
    }
    async getVersionsByPolicy(policyId) {
        const policy = await this.policyRepository.findOne({
            where: { id: policyId, deleted_at: null },
        });
        if (!policy) {
            throw new common_1.NotFoundException(`Policy with ID ${policyId} not found`);
        }
        return this.versionRepository.find({
            where: { policy_id: policyId },
            relations: ['creator'],
            order: { version_number: 'DESC' },
        });
    }
    async getVersion(versionId) {
        const version = await this.versionRepository.findOne({
            where: { id: versionId },
            relations: ['policy', 'creator'],
        });
        if (!version) {
            throw new common_1.NotFoundException(`Policy version with ID ${versionId} not found`);
        }
        return version;
    }
    async getLatestVersion(policyId) {
        const version = await this.versionRepository.findOne({
            where: { policy_id: policyId },
            relations: ['creator'],
            order: { version_number: 'DESC' },
        });
        if (!version) {
            throw new common_1.NotFoundException(`No versions found for policy with ID ${policyId}`);
        }
        return version;
    }
    async getVersionByNumber(policyId, versionNumber) {
        const version = await this.versionRepository.findOne({
            where: { policy_id: policyId, version_number: versionNumber },
            relations: ['creator'],
        });
        if (!version) {
            throw new common_1.NotFoundException(`Policy version ${versionNumber} not found for policy ${policyId}`);
        }
        return version;
    }
    async deleteVersion(versionId) {
        const version = await this.versionRepository.findOne({
            where: { id: versionId },
            relations: ['policy'],
        });
        if (!version) {
            throw new common_1.NotFoundException(`Policy version with ID ${versionId} not found`);
        }
        const versionCount = await this.versionRepository.count({
            where: { policy_id: version.policy_id },
        });
        if (versionCount <= 1) {
            throw new common_1.BadRequestException('Cannot delete the only version of a policy');
        }
        await this.versionRepository.remove(version);
        this.logger.log(`Deleted policy version: ${versionId}`);
    }
    async compareVersions(versionId1, versionId2) {
        const version1 = await this.getVersion(versionId1);
        const version2 = await this.getVersion(versionId2);
        const differences = [];
        if (version1.content !== version2.content) {
            differences.push('Content has changed');
        }
        if (version1.change_summary !== version2.change_summary) {
            differences.push('Change summary differs');
        }
        return {
            version1,
            version2,
            differences,
        };
    }
    async getVersionHistory(policyId) {
        const versions = await this.getVersionsByPolicy(policyId);
        return versions.map((v) => {
            var _a;
            return ({
                versionNumber: v.version_number,
                version: v.version,
                createdAt: v.created_at,
                createdBy: ((_a = v.creator) === null || _a === void 0 ? void 0 : _a.id) || 'System',
                changeSummary: v.change_summary || 'No summary provided',
            });
        });
    }
    async rollbackToVersion(policyId, versionNumber, userId) {
        const targetVersion = await this.getVersionByNumber(policyId, versionNumber);
        const currentPolicy = await this.policyRepository.findOne({
            where: { id: policyId, deleted_at: null },
        });
        if (!currentPolicy) {
            throw new common_1.NotFoundException(`Policy with ID ${policyId} not found`);
        }
        const newVersionNumber = Math.max(currentPolicy.version_number || 1, versionNumber) + 1;
        const newVersion = `${Math.floor(newVersionNumber / 10)}.${newVersionNumber % 10}`;
        const rollbackVersion = await this.createVersion(policyId, targetVersion.content, newVersion, newVersionNumber, `Rolled back to version ${versionNumber}`, userId);
        this.logger.log(`Rolled back policy ${policyId} to version ${versionNumber}`);
        return rollbackVersion;
    }
};
exports.PolicyVersionService = PolicyVersionService;
exports.PolicyVersionService = PolicyVersionService = PolicyVersionService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(policy_version_entity_1.PolicyVersion)),
    __param(1, (0, typeorm_1.InjectRepository)(policy_entity_1.Policy)),
    __param(2, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], PolicyVersionService);
//# sourceMappingURL=policy-version.service.js.map