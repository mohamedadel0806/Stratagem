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
exports.ReportTemplateController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
const report_template_service_1 = require("../services/report-template.service");
const create_report_template_dto_1 = require("../dto/create-report-template.dto");
const swagger_1 = require("@nestjs/swagger");
let ReportTemplateController = class ReportTemplateController {
    constructor(reportTemplateService) {
        this.reportTemplateService = reportTemplateService;
    }
    async create(dto, req) {
        var _a;
        return this.reportTemplateService.create(dto, (_a = req.user) === null || _a === void 0 ? void 0 : _a.id);
    }
    async findAll(req) {
        var _a;
        try {
            return await this.reportTemplateService.findAll((_a = req.user) === null || _a === void 0 ? void 0 : _a.id);
        }
        catch (error) {
            throw error;
        }
    }
    async findOne(id) {
        return this.reportTemplateService.findOne(id);
    }
    async update(id, dto, req) {
        var _a;
        return this.reportTemplateService.update(id, dto, (_a = req.user) === null || _a === void 0 ? void 0 : _a.id, dto.versionComment);
    }
    async delete(id) {
        await this.reportTemplateService.delete(id);
        return { message: 'Report template deleted successfully' };
    }
    async generateReport(id, res) {
        try {
            const { buffer, filename, contentType } = await this.reportTemplateService.generateReport(id);
            const fileBuffer = Buffer.isBuffer(buffer) ? buffer : Buffer.from(buffer);
            res.setHeader('Content-Type', contentType);
            res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(filename)}"`);
            res.setHeader('Content-Length', fileBuffer.length);
            res.send(fileBuffer);
        }
        catch (error) {
            console.error('Error generating report:', {
                message: error.message,
                stack: error.stack,
                name: error.name,
                id,
            });
            if (!res.headersSent) {
                res.status(error.status || 500).json({
                    statusCode: error.status || 500,
                    message: error.message || 'Failed to generate report',
                    error: error.name || 'Internal Server Error',
                });
            }
        }
    }
    async previewReport(id) {
        try {
            const data = await this.reportTemplateService.previewReport(id);
            return {
                data,
                count: data.length,
            };
        }
        catch (error) {
            console.error('Error previewing report:', {
                message: error.message,
                stack: error.stack,
                name: error.name,
                id,
            });
            throw error;
        }
    }
    async getVersionHistory(id) {
        return this.reportTemplateService.getVersionHistory(id);
    }
    async restoreVersion(id, versionId, req) {
        var _a;
        const restored = await this.reportTemplateService.restoreVersion(id, versionId, (_a = req.user) === null || _a === void 0 ? void 0 : _a.id);
        return {
            message: 'Template restored successfully',
            template: restored,
        };
    }
    async updateSharing(id, sharingDto, req) {
        var _a, _b;
        const template = await this.reportTemplateService.findOne(id);
        if (template.createdById !== ((_a = req.user) === null || _a === void 0 ? void 0 : _a.id)) {
            throw new common_1.BadRequestException('Only template owner can update sharing settings');
        }
        const updateDto = {};
        if (sharingDto.isShared !== undefined) {
            updateDto.isShared = sharingDto.isShared;
        }
        if (sharingDto.sharedWithUserIds !== undefined) {
            updateDto.sharedWithUserIds = sharingDto.sharedWithUserIds;
        }
        if (sharingDto.sharedWithTeamIds !== undefined) {
            updateDto.sharedWithTeamIds = sharingDto.sharedWithTeamIds;
        }
        if (sharingDto.isOrganizationWide !== undefined) {
            updateDto.isOrganizationWide = sharingDto.isOrganizationWide;
        }
        return this.reportTemplateService.update(id, updateDto, (_b = req.user) === null || _b === void 0 ? void 0 : _b.id);
    }
    async sendReport(id) {
        await this.reportTemplateService.sendScheduledReport(id);
        return { message: 'Report sent successfully' };
    }
};
exports.ReportTemplateController = ReportTemplateController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new report template' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_report_template_dto_1.CreateReportTemplateDto, Object]),
    __metadata("design:returntype", Promise)
], ReportTemplateController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all report templates' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ReportTemplateController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get a report template by ID' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ReportTemplateController.prototype, "findOne", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update a report template' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], ReportTemplateController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a report template' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ReportTemplateController.prototype, "delete", null);
__decorate([
    (0, common_1.Post)(':id/generate'),
    (0, swagger_1.ApiOperation)({ summary: 'Generate and download a report from a template' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Report file downloaded' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ReportTemplateController.prototype, "generateReport", null);
__decorate([
    (0, common_1.Get)(':id/preview'),
    (0, swagger_1.ApiOperation)({ summary: 'Preview report data without downloading' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Report data preview' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ReportTemplateController.prototype, "previewReport", null);
__decorate([
    (0, common_1.Get)(':id/versions'),
    (0, swagger_1.ApiOperation)({ summary: 'Get version history for a template' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of template versions' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ReportTemplateController.prototype, "getVersionHistory", null);
__decorate([
    (0, common_1.Post)(':id/versions/:versionId/restore'),
    (0, swagger_1.ApiOperation)({ summary: 'Restore a template to a previous version' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Template restored successfully' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Param)('versionId', common_1.ParseUUIDPipe)),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], ReportTemplateController.prototype, "restoreVersion", null);
__decorate([
    (0, common_1.Put)(':id/sharing'),
    (0, swagger_1.ApiOperation)({ summary: 'Update template sharing settings' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Sharing settings updated' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], ReportTemplateController.prototype, "updateSharing", null);
__decorate([
    (0, common_1.Post)(':id/send'),
    (0, swagger_1.ApiOperation)({ summary: 'Manually trigger a scheduled report' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ReportTemplateController.prototype, "sendReport", null);
exports.ReportTemplateController = ReportTemplateController = __decorate([
    (0, swagger_1.ApiTags)('assets'),
    (0, common_1.Controller)('assets/report-templates'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [report_template_service_1.ReportTemplateService])
], ReportTemplateController);
//# sourceMappingURL=report-template.controller.js.map