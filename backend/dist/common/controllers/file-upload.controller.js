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
exports.FileUploadController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const swagger_1 = require("@nestjs/swagger");
const file_service_1 = require("../services/file.service");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
const current_user_decorator_1 = require("../../auth/decorators/current-user.decorator");
let FileUploadController = class FileUploadController {
    constructor(fileService) {
        this.fileService = fileService;
    }
    async uploadFile(file, body, user) {
        return this.fileService.uploadFile(file, user.userId, {
            category: body.category,
            entityType: body.entityType,
            entityId: body.entityId,
            description: body.description,
        });
    }
    async uploadFiles(files, body, user) {
        return this.fileService.uploadFiles(files, user.userId, {
            category: body.category,
            entityType: body.entityType,
            entityId: body.entityId,
            description: body.description,
        });
    }
    async getFile(fileId) {
        return this.fileService.getFile(fileId);
    }
    async downloadFile(fileId, res) {
        const file = await this.fileService.getFile(fileId);
        const content = await this.fileService.getFileContent(fileId);
        res.setHeader('Content-Type', file.mimeType);
        res.setHeader('Content-Disposition', `attachment; filename="${file.originalName}"`);
        res.send(content);
    }
    async getEntityFiles(entityType, entityId, category) {
        return this.fileService.getEntityFiles(entityType, entityId, category);
    }
    async getUserFiles(user, limit = '50') {
        return this.fileService.getUserFiles(user.userId, parseInt(limit));
    }
    async deleteFile(fileId) {
        await this.fileService.deleteFile(fileId);
    }
    async verifyFileIntegrity(fileId) {
        const valid = await this.fileService.verifyFileIntegrity(fileId);
        return { valid };
    }
    async getStatistics() {
        return this.fileService.getStatistics();
    }
};
exports.FileUploadController = FileUploadController;
__decorate([
    (0, common_1.Post)('upload'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiOperation)({ summary: 'Upload a single file' }),
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], FileUploadController.prototype, "uploadFile", null);
__decorate([
    (0, common_1.Post)('upload-multiple'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FilesInterceptor)('files', 10)),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiOperation)({ summary: 'Upload multiple files' }),
    __param(0, (0, common_1.UploadedFiles)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array, Object, Object]),
    __metadata("design:returntype", Promise)
], FileUploadController.prototype, "uploadFiles", null);
__decorate([
    (0, common_1.Get)(':fileId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get file metadata' }),
    __param(0, (0, common_1.Param)('fileId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], FileUploadController.prototype, "getFile", null);
__decorate([
    (0, common_1.Get)(':fileId/download'),
    (0, swagger_1.ApiOperation)({ summary: 'Download file' }),
    __param(0, (0, common_1.Param)('fileId')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], FileUploadController.prototype, "downloadFile", null);
__decorate([
    (0, common_1.Get)('entity/:entityType/:entityId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get files for an entity' }),
    __param(0, (0, common_1.Param)('entityType')),
    __param(1, (0, common_1.Param)('entityId')),
    __param(2, (0, common_1.Query)('category')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], FileUploadController.prototype, "getEntityFiles", null);
__decorate([
    (0, common_1.Get)('user/my-files'),
    (0, swagger_1.ApiOperation)({ summary: "Get user's uploaded files" }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], FileUploadController.prototype, "getUserFiles", null);
__decorate([
    (0, common_1.Delete)(':fileId'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiOperation)({ summary: 'Delete file (soft delete)' }),
    __param(0, (0, common_1.Param)('fileId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], FileUploadController.prototype, "deleteFile", null);
__decorate([
    (0, common_1.Get)(':fileId/verify'),
    (0, swagger_1.ApiOperation)({ summary: 'Verify file integrity' }),
    __param(0, (0, common_1.Param)('fileId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], FileUploadController.prototype, "verifyFileIntegrity", null);
__decorate([
    (0, common_1.Get)('stats/summary'),
    (0, swagger_1.ApiOperation)({ summary: 'Get file statistics' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], FileUploadController.prototype, "getStatistics", null);
exports.FileUploadController = FileUploadController = __decorate([
    (0, swagger_1.ApiTags)('File Management'),
    (0, common_1.Controller)('files'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)('JWT'),
    __metadata("design:paramtypes", [file_service_1.FileService])
], FileUploadController);
//# sourceMappingURL=file-upload.controller.js.map