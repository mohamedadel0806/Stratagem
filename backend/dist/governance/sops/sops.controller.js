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
exports.SOPsController = void 0;
const common_1 = require("@nestjs/common");
const sops_service_1 = require("./sops.service");
const create_sop_dto_1 = require("./dto/create-sop.dto");
const update_sop_dto_1 = require("./dto/update-sop.dto");
const sop_query_dto_1 = require("./dto/sop-query.dto");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
const swagger_1 = require("@nestjs/swagger");
const audit_decorator_1 = require("../../common/decorators/audit.decorator");
const audit_log_entity_1 = require("../../common/entities/audit-log.entity");
let SOPsController = class SOPsController {
    constructor(sopsService) {
        this.sopsService = sopsService;
    }
    create(createSOPDto, req) {
        return this.sopsService.create(createSOPDto, req.user.id);
    }
    findAll(queryDto) {
        return this.sopsService.findAll(queryDto);
    }
    findOne(id) {
        return this.sopsService.findOne(id);
    }
    update(id, updateSOPDto, req) {
        return this.sopsService.update(id, updateSOPDto, req.user.id);
    }
    remove(id) {
        return this.sopsService.remove(id);
    }
    publish(id, body, req) {
        return this.sopsService.publish(id, req.user.id, body.assign_to_user_ids, body.assign_to_role_ids);
    }
    getMyAssignedSOPs(queryDto, req) {
        return this.sopsService.getAssignedSOPs(req.user.id, queryDto);
    }
    getPublicationStatistics() {
        return this.sopsService.getPublicationStatistics();
    }
};
exports.SOPsController = SOPsController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new SOP' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'SOP created successfully' }),
    (0, audit_decorator_1.Audit)(audit_log_entity_1.AuditAction.CREATE, 'SOP'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_sop_dto_1.CreateSOPDto, Object]),
    __metadata("design:returntype", void 0)
], SOPsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all SOPs with filtering and pagination' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of SOPs' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [sop_query_dto_1.SOPQueryDto]),
    __metadata("design:returntype", void 0)
], SOPsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get a SOP by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'SOP details' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'SOP not found' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SOPsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update a SOP' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'SOP updated successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'SOP not found' }),
    (0, audit_decorator_1.Audit)(audit_log_entity_1.AuditAction.UPDATE, 'SOP'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_sop_dto_1.UpdateSOPDto, Object]),
    __metadata("design:returntype", void 0)
], SOPsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a SOP (soft delete)' }),
    (0, swagger_1.ApiResponse)({ status: 204, description: 'SOP deleted successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'SOP not found' }),
    (0, audit_decorator_1.Audit)(audit_log_entity_1.AuditAction.DELETE, 'SOP'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SOPsController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)(':id/publish'),
    (0, swagger_1.ApiOperation)({ summary: 'Publish a SOP and optionally assign to users/roles' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'SOP published successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'SOP not found' }),
    (0, audit_decorator_1.Audit)(audit_log_entity_1.AuditAction.PUBLISH, 'SOP'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", void 0)
], SOPsController.prototype, "publish", null);
__decorate([
    (0, common_1.Get)('my-assigned'),
    (0, swagger_1.ApiOperation)({ summary: 'Get SOPs assigned to the current user' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of assigned SOPs' }),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [sop_query_dto_1.SOPQueryDto, Object]),
    __metadata("design:returntype", void 0)
], SOPsController.prototype, "getMyAssignedSOPs", null);
__decorate([
    (0, common_1.Get)('statistics/publication'),
    (0, swagger_1.ApiOperation)({ summary: 'Get SOP publication statistics' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Publication statistics' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], SOPsController.prototype, "getPublicationStatistics", null);
exports.SOPsController = SOPsController = __decorate([
    (0, swagger_1.ApiTags)('Governance - SOPs'),
    (0, common_1.Controller)('governance/sops'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [sops_service_1.SOPsService])
], SOPsController);
//# sourceMappingURL=sops.controller.js.map