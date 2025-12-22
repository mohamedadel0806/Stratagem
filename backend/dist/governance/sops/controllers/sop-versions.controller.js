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
exports.SOPVersionsController = void 0;
const common_1 = require("@nestjs/common");
const sop_versions_service_1 = require("../services/sop-versions.service");
const sop_version_dto_1 = require("../dto/sop-version.dto");
const jwt_auth_guard_1 = require("../../../auth/guards/jwt-auth.guard");
const swagger_1 = require("@nestjs/swagger");
const audit_decorator_1 = require("../../../common/decorators/audit.decorator");
const audit_log_entity_1 = require("../../../common/entities/audit-log.entity");
let SOPVersionsController = class SOPVersionsController {
    constructor(versionsService) {
        this.versionsService = versionsService;
    }
    create(createDto, req) {
        return this.versionsService.create(createDto, req.user.id);
    }
    findAll(queryDto) {
        return this.versionsService.findAll(queryDto);
    }
    getHistory(sopId) {
        return this.versionsService.getVersionHistory(sopId);
    }
    getLatest(sopId) {
        return this.versionsService.getLatestVersion(sopId);
    }
    getPending() {
        return this.versionsService.getPendingApprovals();
    }
    getRetrainingVersions(sopId) {
        return this.versionsService.getVersionsRequiringRetraining(sopId);
    }
    findOne(id) {
        return this.versionsService.findOne(id);
    }
    update(id, updateDto, req) {
        return this.versionsService.update(id, updateDto, req.user.id);
    }
    submitApproval(id, req) {
        return this.versionsService.submitForApproval(id, req.user.id);
    }
    approve(id, approveDto, req) {
        return this.versionsService.approve(id, approveDto, req.user.id);
    }
    publish(id, req) {
        return this.versionsService.publish(id, req.user.id);
    }
    remove(id) {
        return this.versionsService.remove(id);
    }
};
exports.SOPVersionsController = SOPVersionsController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new SOP version' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Version created successfully' }),
    (0, audit_decorator_1.Audit)(audit_log_entity_1.AuditAction.CREATE, 'SOP_VERSION'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [sop_version_dto_1.CreateSOPVersionDto, Object]),
    __metadata("design:returntype", void 0)
], SOPVersionsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all SOP versions' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of versions' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [sop_version_dto_1.SOPVersionQueryDto]),
    __metadata("design:returntype", void 0)
], SOPVersionsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('sop/:sop_id/history'),
    (0, swagger_1.ApiOperation)({ summary: 'Get version history for a SOP' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Version history' }),
    __param(0, (0, common_1.Param)('sop_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SOPVersionsController.prototype, "getHistory", null);
__decorate([
    (0, common_1.Get)('sop/:sop_id/latest'),
    (0, swagger_1.ApiOperation)({ summary: 'Get latest published version of a SOP' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Latest version' }),
    __param(0, (0, common_1.Param)('sop_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SOPVersionsController.prototype, "getLatest", null);
__decorate([
    (0, common_1.Get)('pending-approval'),
    (0, swagger_1.ApiOperation)({ summary: 'Get versions pending approval' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Pending versions' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], SOPVersionsController.prototype, "getPending", null);
__decorate([
    (0, common_1.Get)('sop/:sop_id/retraining'),
    (0, swagger_1.ApiOperation)({ summary: 'Get versions requiring retraining for a SOP' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Versions requiring retraining' }),
    __param(0, (0, common_1.Param)('sop_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SOPVersionsController.prototype, "getRetrainingVersions", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get a version by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Version details' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SOPVersionsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update a version (draft only)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Version updated successfully' }),
    (0, audit_decorator_1.Audit)(audit_log_entity_1.AuditAction.UPDATE, 'SOP_VERSION'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, sop_version_dto_1.UpdateSOPVersionDto, Object]),
    __metadata("design:returntype", void 0)
], SOPVersionsController.prototype, "update", null);
__decorate([
    (0, common_1.Post)(':id/submit-approval'),
    (0, swagger_1.ApiOperation)({ summary: 'Submit version for approval' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Version submitted successfully' }),
    (0, audit_decorator_1.Audit)(audit_log_entity_1.AuditAction.UPDATE, 'SOP_VERSION'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], SOPVersionsController.prototype, "submitApproval", null);
__decorate([
    (0, common_1.Post)(':id/approve'),
    (0, swagger_1.ApiOperation)({ summary: 'Approve or reject a version' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Version approval processed' }),
    (0, audit_decorator_1.Audit)(audit_log_entity_1.AuditAction.UPDATE, 'SOP_VERSION'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, sop_version_dto_1.ApproveSOPVersionDto, Object]),
    __metadata("design:returntype", void 0)
], SOPVersionsController.prototype, "approve", null);
__decorate([
    (0, common_1.Post)(':id/publish'),
    (0, swagger_1.ApiOperation)({ summary: 'Publish an approved version' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Version published successfully' }),
    (0, audit_decorator_1.Audit)(audit_log_entity_1.AuditAction.PUBLISH, 'SOP_VERSION'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], SOPVersionsController.prototype, "publish", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a version (draft only)' }),
    (0, swagger_1.ApiResponse)({ status: 204, description: 'Version deleted successfully' }),
    (0, audit_decorator_1.Audit)(audit_log_entity_1.AuditAction.DELETE, 'SOP_VERSION'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SOPVersionsController.prototype, "remove", null);
exports.SOPVersionsController = SOPVersionsController = __decorate([
    (0, swagger_1.ApiTags)('Governance - SOP Versions'),
    (0, common_1.Controller)('governance/sops/versions'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [sop_versions_service_1.SOPVersionsService])
], SOPVersionsController);
//# sourceMappingURL=sop-versions.controller.js.map