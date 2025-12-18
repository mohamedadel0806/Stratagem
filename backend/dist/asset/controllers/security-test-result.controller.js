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
exports.SecurityTestResultController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const swagger_1 = require("@nestjs/swagger");
const security_test_result_service_1 = require("../services/security-test-result.service");
const create_security_test_result_dto_1 = require("../dto/create-security-test-result.dto");
const security_test_result_response_dto_1 = require("../dto/security-test-result-response.dto");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
const current_user_decorator_1 = require("../../auth/decorators/current-user.decorator");
const user_entity_1 = require("../../users/entities/user.entity");
const file_service_1 = require("../../common/services/file.service");
let SecurityTestResultController = class SecurityTestResultController {
    constructor(testResultService, fileService) {
        this.testResultService = testResultService;
        this.fileService = fileService;
    }
    async create(dto, user) {
        return this.testResultService.create(dto, user.id);
    }
    async uploadAndCreate(file, body, user) {
        if (!file) {
            throw new Error('File is required');
        }
        const allowedMimeTypes = [
            'application/pdf',
            'text/csv',
            'application/vnd.ms-excel',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'application/xml',
            'text/xml',
        ];
        if (!allowedMimeTypes.includes(file.mimetype)) {
            throw new Error(`File type ${file.mimetype} not allowed. Allowed types: PDF, CSV, XLS, XLSX, XML`);
        }
        const uploadedFile = await this.fileService.uploadFile(file, user.id, {
            category: 'security_test_report',
            entityType: body.assetType,
            entityId: body.assetId,
            description: `Security test report for ${body.assetType} ${body.assetId}`,
        });
        const dto = {
            assetType: body.assetType,
            assetId: body.assetId,
            testType: body.testType,
            testDate: body.testDate,
            status: body.status,
            testerName: body.testerName,
            testerCompany: body.testerCompany,
            findingsCritical: body.findingsCritical ? parseInt(body.findingsCritical) : undefined,
            findingsHigh: body.findingsHigh ? parseInt(body.findingsHigh) : undefined,
            findingsMedium: body.findingsMedium ? parseInt(body.findingsMedium) : undefined,
            findingsLow: body.findingsLow ? parseInt(body.findingsLow) : undefined,
            findingsInfo: body.findingsInfo ? parseInt(body.findingsInfo) : undefined,
            severity: body.severity,
            overallScore: body.overallScore ? parseFloat(body.overallScore) : undefined,
            passed: body.passed === 'true' || body.passed === true,
            summary: body.summary,
            findings: body.findings,
            recommendations: body.recommendations,
            reportFileId: uploadedFile.id,
            reportUrl: `/api/v1/files/${uploadedFile.id}/download`,
            remediationDueDate: body.remediationDueDate,
            retestRequired: body.retestRequired === 'true' || body.retestRequired === true,
            retestDate: body.retestDate,
        };
        return this.testResultService.create(dto, user.id);
    }
    async findByAsset(assetType, assetId) {
        return this.testResultService.findByAsset(assetType, assetId);
    }
    async findOne(id) {
        return this.testResultService.findOne(id);
    }
    async findFailedTests(days) {
        const daysThreshold = days ? parseInt(days) : 30;
        return this.testResultService.findFailedTests(daysThreshold);
    }
    async findOverdueTests() {
        return this.testResultService.findOverdueTests();
    }
};
exports.SecurityTestResultController = SecurityTestResultController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new security test result' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Security test result created', type: security_test_result_response_dto_1.SecurityTestResultResponseDto }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Asset not found' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_security_test_result_dto_1.CreateSecurityTestResultDto,
        user_entity_1.User]),
    __metadata("design:returntype", Promise)
], SecurityTestResultController.prototype, "create", null);
__decorate([
    (0, common_1.Post)('upload'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiOperation)({ summary: 'Upload security test report and create test result' }),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                file: {
                    type: 'string',
                    format: 'binary',
                },
                assetType: {
                    type: 'string',
                    enum: ['application', 'software'],
                },
                assetId: { type: 'string' },
                testType: { type: 'string' },
                testDate: { type: 'string', format: 'date' },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Test result created with uploaded file', type: security_test_result_response_dto_1.SecurityTestResultResponseDto }),
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, user_entity_1.User]),
    __metadata("design:returntype", Promise)
], SecurityTestResultController.prototype, "uploadAndCreate", null);
__decorate([
    (0, common_1.Get)('asset/:assetType/:assetId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all security test results for an asset' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of security test results', type: [security_test_result_response_dto_1.SecurityTestResultResponseDto] }),
    __param(0, (0, common_1.Param)('assetType', new common_1.ParseEnumPipe(['application', 'software']))),
    __param(1, (0, common_1.Param)('assetId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], SecurityTestResultController.prototype, "findByAsset", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get a specific security test result' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Security test result', type: security_test_result_response_dto_1.SecurityTestResultResponseDto }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Test result not found' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SecurityTestResultController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)('reports/failed'),
    (0, swagger_1.ApiOperation)({ summary: 'Get failed security tests' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of failed tests', type: [security_test_result_response_dto_1.SecurityTestResultResponseDto] }),
    __param(0, (0, common_1.Query)('days')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SecurityTestResultController.prototype, "findFailedTests", null);
__decorate([
    (0, common_1.Get)('reports/overdue'),
    (0, swagger_1.ApiOperation)({ summary: 'Get overdue security tests requiring retest' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of overdue tests', type: [security_test_result_response_dto_1.SecurityTestResultResponseDto] }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SecurityTestResultController.prototype, "findOverdueTests", null);
exports.SecurityTestResultController = SecurityTestResultController = __decorate([
    (0, swagger_1.ApiTags)('Security Test Results'),
    (0, common_1.Controller)('assets/security-tests'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [security_test_result_service_1.SecurityTestResultService,
        file_service_1.FileService])
], SecurityTestResultController);
//# sourceMappingURL=security-test-result.controller.js.map