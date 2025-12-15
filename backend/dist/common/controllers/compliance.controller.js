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
exports.ComplianceController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const swagger_1 = require("@nestjs/swagger");
const compliance_service_1 = require("../services/compliance.service");
const compliance_status_response_dto_1 = require("../dto/compliance-status-response.dto");
const create_framework_dto_1 = require("../dto/create-framework.dto");
const update_framework_dto_1 = require("../dto/update-framework.dto");
const create_requirement_dto_1 = require("../dto/create-requirement.dto");
const update_requirement_dto_1 = require("../dto/update-requirement.dto");
const bulk_update_requirement_dto_1 = require("../dto/bulk-update-requirement.dto");
const framework_response_dto_1 = require("../dto/framework-response.dto");
const requirement_response_dto_1 = require("../dto/requirement-response.dto");
const bulk_upload_response_dto_1 = require("../dto/bulk-upload-response.dto");
const requirement_query_dto_1 = require("../dto/requirement-query.dto");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
const csv_parser_util_1 = require("../utils/csv-parser.util");
let ComplianceController = class ComplianceController {
    constructor(complianceService) {
        this.complianceService = complianceService;
    }
    async getStatus() {
        return this.complianceService.getStatus();
    }
    async getFrameworks() {
        return this.complianceService.findAllFrameworks();
    }
    async getFramework(id) {
        return this.complianceService.findFrameworkById(id);
    }
    async createFramework(createDto) {
        return this.complianceService.createFramework(createDto);
    }
    async updateFramework(id, updateDto) {
        return this.complianceService.updateFramework(id, updateDto);
    }
    async deleteFramework(id) {
        await this.complianceService.deleteFramework(id);
        return { message: 'Framework deleted successfully' };
    }
    async getRequirements(query) {
        return this.complianceService.findAllRequirements(query);
    }
    async getRequirement(id) {
        return this.complianceService.findRequirementById(id);
    }
    async createRequirement(createDto) {
        return this.complianceService.createRequirement(createDto);
    }
    async updateRequirement(id, updateDto) {
        return this.complianceService.updateRequirement(id, updateDto);
    }
    async deleteRequirement(id) {
        await this.complianceService.deleteRequirement(id);
        return { message: 'Requirement deleted successfully' };
    }
    async bulkUpdateRequirementStatus(bulkUpdateDto) {
        return this.complianceService.bulkUpdateRequirementStatus(bulkUpdateDto.ids, bulkUpdateDto.status);
    }
    async uploadRequirements(frameworkId, file) {
        if (!file) {
            throw new common_1.BadRequestException('CSV file is required');
        }
        if (!file.mimetype.includes('csv') && !file.originalname.endsWith('.csv')) {
            throw new common_1.BadRequestException('File must be a CSV file');
        }
        try {
            const csvContent = file.buffer.toString('utf-8');
            const requirements = (0, csv_parser_util_1.parseCSVRequirements)(csvContent);
            if (requirements.length === 0) {
                throw new common_1.BadRequestException('CSV file contains no valid requirements');
            }
            const result = await this.complianceService.bulkCreateRequirements(frameworkId, requirements, true);
            return {
                success: result.errors.length === 0,
                totalRows: requirements.length,
                created: result.created,
                deleted: result.deleted || 0,
                errors: result.errors.length,
                errorMessages: result.errors.length > 0 ? result.errors : undefined,
            };
        }
        catch (error) {
            throw new common_1.BadRequestException(`Failed to process CSV: ${error.message}`);
        }
    }
};
exports.ComplianceController = ComplianceController;
__decorate([
    (0, common_1.Get)('status'),
    (0, swagger_1.ApiOperation)({ summary: 'Get compliance status overview' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Compliance status with framework breakdown',
        type: compliance_status_response_dto_1.ComplianceStatusResponseDto,
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ComplianceController.prototype, "getStatus", null);
__decorate([
    (0, common_1.Get)('frameworks'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all compliance frameworks' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of frameworks', type: [framework_response_dto_1.FrameworkResponseDto] }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ComplianceController.prototype, "getFrameworks", null);
__decorate([
    (0, common_1.Get)('frameworks/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get framework by ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Framework ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Framework details', type: framework_response_dto_1.FrameworkResponseDto }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Framework not found' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ComplianceController.prototype, "getFramework", null);
__decorate([
    (0, common_1.Post)('frameworks'),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new compliance framework' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Framework created successfully', type: framework_response_dto_1.FrameworkResponseDto }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_framework_dto_1.CreateFrameworkDto]),
    __metadata("design:returntype", Promise)
], ComplianceController.prototype, "createFramework", null);
__decorate([
    (0, common_1.Put)('frameworks/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update a compliance framework' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Framework ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Framework updated successfully', type: framework_response_dto_1.FrameworkResponseDto }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Framework not found' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_framework_dto_1.UpdateFrameworkDto]),
    __metadata("design:returntype", Promise)
], ComplianceController.prototype, "updateFramework", null);
__decorate([
    (0, common_1.Delete)('frameworks/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a compliance framework' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Framework ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Framework deleted successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Framework not found' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ComplianceController.prototype, "deleteFramework", null);
__decorate([
    (0, common_1.Get)('requirements'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all compliance requirements with filtering and search' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of requirements', type: [requirement_response_dto_1.RequirementResponseDto] }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid query parameters' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [requirement_query_dto_1.RequirementQueryDto]),
    __metadata("design:returntype", Promise)
], ComplianceController.prototype, "getRequirements", null);
__decorate([
    (0, common_1.Get)('requirements/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get requirement by ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Requirement ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Requirement details', type: requirement_response_dto_1.RequirementResponseDto }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Requirement not found' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ComplianceController.prototype, "getRequirement", null);
__decorate([
    (0, common_1.Post)('requirements'),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new compliance requirement' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Requirement created successfully', type: requirement_response_dto_1.RequirementResponseDto }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_requirement_dto_1.CreateRequirementDto]),
    __metadata("design:returntype", Promise)
], ComplianceController.prototype, "createRequirement", null);
__decorate([
    (0, common_1.Put)('requirements/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update a compliance requirement' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Requirement ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Requirement updated successfully', type: requirement_response_dto_1.RequirementResponseDto }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Requirement not found' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_requirement_dto_1.UpdateRequirementDto]),
    __metadata("design:returntype", Promise)
], ComplianceController.prototype, "updateRequirement", null);
__decorate([
    (0, common_1.Delete)('requirements/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a compliance requirement' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Requirement ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Requirement deleted successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Requirement not found' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ComplianceController.prototype, "deleteRequirement", null);
__decorate([
    (0, common_1.Patch)('requirements/bulk-update'),
    (0, swagger_1.ApiOperation)({ summary: 'Bulk update requirement status' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Requirements updated successfully', type: [requirement_response_dto_1.RequirementResponseDto] }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [bulk_update_requirement_dto_1.BulkUpdateRequirementDto]),
    __metadata("design:returntype", Promise)
], ComplianceController.prototype, "bulkUpdateRequirementStatus", null);
__decorate([
    (0, common_1.Post)('frameworks/:id/requirements/upload'),
    (0, swagger_1.ApiOperation)({ summary: 'Upload requirements via CSV file' }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Framework ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Requirements uploaded successfully', type: bulk_upload_response_dto_1.BulkUploadResponseDto }),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ComplianceController.prototype, "uploadRequirements", null);
exports.ComplianceController = ComplianceController = __decorate([
    (0, swagger_1.ApiTags)('compliance'),
    (0, common_1.Controller)('compliance'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [compliance_service_1.ComplianceService])
], ComplianceController);
//# sourceMappingURL=compliance.controller.js.map