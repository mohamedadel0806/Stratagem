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
exports.PolicyController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const swagger_1 = require("@nestjs/swagger");
const policy_service_1 = require("../services/policy.service");
const policy_response_dto_1 = require("../dto/policy-response.dto");
const create_policy_dto_1 = require("../dto/create-policy.dto");
const update_policy_dto_1 = require("../dto/update-policy.dto");
const bulk_update_policy_dto_1 = require("../dto/bulk-update-policy.dto");
const policy_query_dto_1 = require("../dto/policy-query.dto");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
const current_user_decorator_1 = require("../../auth/decorators/current-user.decorator");
const user_entity_1 = require("../../users/entities/user.entity");
const fs = require("fs");
const path = require("path");
let PolicyController = class PolicyController {
    constructor(policyService) {
        this.policyService = policyService;
    }
    async findAll(query) {
        return this.policyService.findAll(query);
    }
    async findOne(id) {
        return this.policyService.findOne(id);
    }
    async create(createPolicyDto, user) {
        return this.policyService.create(createPolicyDto, user.id);
    }
    async update(id, updatePolicyDto) {
        return this.policyService.update(id, updatePolicyDto);
    }
    async remove(id) {
        await this.policyService.remove(id);
        return { message: 'Policy deleted successfully' };
    }
    async bulkUpdateStatus(bulkUpdateDto) {
        return this.policyService.bulkUpdateStatus(bulkUpdateDto.ids, bulkUpdateDto.status);
    }
    async uploadDocument(id, file) {
        if (!file) {
            throw new common_1.BadRequestException('File is required');
        }
        const uploadDir = path.join(process.cwd(), 'uploads', 'policies');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        const fileExtension = path.extname(file.originalname);
        const fileName = `${id}${fileExtension}`;
        const filePath = path.join(uploadDir, fileName);
        fs.renameSync(file.path, filePath);
        return this.policyService.uploadDocument(id, Object.assign(Object.assign({}, file), { path: filePath }));
    }
    async getDocument(id, res) {
        const policy = await this.policyService.findOne(id);
        if (!policy.documentUrl || !policy.documentName) {
            res.status(404).json({ message: 'Document not found' });
            return;
        }
        const filePath = path.join(process.cwd(), 'uploads', 'policies', `${id}${path.extname(policy.documentName)}`);
        if (!fs.existsSync(filePath)) {
            res.status(404).json({ message: 'Document file not found' });
            return;
        }
        res.setHeader('Content-Type', policy.documentMimeType || 'application/octet-stream');
        res.setHeader('Content-Disposition', `attachment; filename="${policy.documentName}"`);
        res.sendFile(path.resolve(filePath));
    }
};
exports.PolicyController = PolicyController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all policies with filtering and search' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of policies', type: [policy_response_dto_1.PolicyResponseDto] }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [policy_query_dto_1.PolicyQueryDto]),
    __metadata("design:returntype", Promise)
], PolicyController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get policy by ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Policy ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Policy details', type: policy_response_dto_1.PolicyResponseDto }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Policy not found' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PolicyController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new policy' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Policy created successfully', type: policy_response_dto_1.PolicyResponseDto }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_policy_dto_1.CreatePolicyDto,
        user_entity_1.User]),
    __metadata("design:returntype", Promise)
], PolicyController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update a policy' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Policy ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Policy updated successfully', type: policy_response_dto_1.PolicyResponseDto }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Policy not found' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_policy_dto_1.UpdatePolicyDto]),
    __metadata("design:returntype", Promise)
], PolicyController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a policy' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Policy ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Policy deleted successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Policy not found' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PolicyController.prototype, "remove", null);
__decorate([
    (0, common_1.Patch)('bulk-update'),
    (0, swagger_1.ApiOperation)({ summary: 'Bulk update policy status' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Policies updated successfully', type: [policy_response_dto_1.PolicyResponseDto] }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [bulk_update_policy_dto_1.BulkUpdatePolicyDto]),
    __metadata("design:returntype", Promise)
], PolicyController.prototype, "bulkUpdateStatus", null);
__decorate([
    (0, common_1.Post)(':id/document'),
    (0, swagger_1.ApiOperation)({ summary: 'Upload a document for a policy' }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Policy ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Document uploaded successfully', type: policy_response_dto_1.PolicyResponseDto }),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', {
        dest: './uploads/policies',
        limits: { fileSize: 10 * 1024 * 1024 },
    })),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PolicyController.prototype, "uploadDocument", null);
__decorate([
    (0, common_1.Get)(':id/document'),
    (0, swagger_1.ApiOperation)({ summary: 'Download policy document' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Policy ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Document file' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Policy or document not found' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PolicyController.prototype, "getDocument", null);
exports.PolicyController = PolicyController = __decorate([
    (0, swagger_1.ApiTags)('policies'),
    (0, common_1.Controller)('policies'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [policy_service_1.PolicyService])
], PolicyController);
//# sourceMappingURL=policy.controller.js.map