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
exports.PolicyExceptionsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const policy_exceptions_service_1 = require("./policy-exceptions.service");
const create_policy_exception_dto_1 = require("./dto/create-policy-exception.dto");
const update_policy_exception_dto_1 = require("./dto/update-policy-exception.dto");
const query_policy_exception_dto_1 = require("./dto/query-policy-exception.dto");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../../auth/guards/roles.guard");
const roles_decorator_1 = require("../../auth/decorators/roles.decorator");
const user_entity_1 = require("../../users/entities/user.entity");
const audit_decorator_1 = require("../../common/decorators/audit.decorator");
const audit_log_entity_1 = require("../../common/entities/audit-log.entity");
let PolicyExceptionsController = class PolicyExceptionsController {
    constructor(exceptionsService) {
        this.exceptionsService = exceptionsService;
    }
    async create(dto, req) {
        return this.exceptionsService.create(dto, req.user.id);
    }
    async findAll(query) {
        return this.exceptionsService.findAll(query);
    }
    async findOne(id) {
        return this.exceptionsService.findOne(id);
    }
    async update(id, dto, req) {
        return this.exceptionsService.update(id, dto, req.user.id);
    }
    async delete(id) {
        await this.exceptionsService.delete(id);
        return { message: 'Exception deleted successfully' };
    }
    async approve(id, body, req) {
        return this.exceptionsService.approve(id, req.user.id, body.conditions);
    }
    async reject(id, body, req) {
        return this.exceptionsService.reject(id, req.user.id, body.reason);
    }
};
exports.PolicyExceptionsController = PolicyExceptionsController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a policy exception request' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Exception created successfully' }),
    (0, audit_decorator_1.Audit)(audit_log_entity_1.AuditAction.CREATE, 'PolicyException'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_policy_exception_dto_1.CreatePolicyExceptionDto, Object]),
    __metadata("design:returntype", Promise)
], PolicyExceptionsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all policy exceptions' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of exceptions' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [query_policy_exception_dto_1.QueryPolicyExceptionDto]),
    __metadata("design:returntype", Promise)
], PolicyExceptionsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get a policy exception by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Exception details' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PolicyExceptionsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update a policy exception' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Exception updated successfully' }),
    (0, audit_decorator_1.Audit)(audit_log_entity_1.AuditAction.UPDATE, 'PolicyException'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_policy_exception_dto_1.UpdatePolicyExceptionDto, Object]),
    __metadata("design:returntype", Promise)
], PolicyExceptionsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.SUPER_ADMIN, user_entity_1.UserRole.ADMIN, user_entity_1.UserRole.COMPLIANCE_OFFICER),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a policy exception' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Exception deleted successfully' }),
    (0, audit_decorator_1.Audit)(audit_log_entity_1.AuditAction.DELETE, 'PolicyException'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PolicyExceptionsController.prototype, "delete", null);
__decorate([
    (0, common_1.Post)(':id/approve'),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.SUPER_ADMIN, user_entity_1.UserRole.ADMIN, user_entity_1.UserRole.COMPLIANCE_OFFICER),
    (0, swagger_1.ApiOperation)({ summary: 'Approve a policy exception' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Exception approved successfully' }),
    (0, audit_decorator_1.Audit)(audit_log_entity_1.AuditAction.APPROVE, 'PolicyException'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], PolicyExceptionsController.prototype, "approve", null);
__decorate([
    (0, common_1.Post)(':id/reject'),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.SUPER_ADMIN, user_entity_1.UserRole.ADMIN, user_entity_1.UserRole.COMPLIANCE_OFFICER),
    (0, swagger_1.ApiOperation)({ summary: 'Reject a policy exception' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Exception rejected successfully' }),
    (0, audit_decorator_1.Audit)(audit_log_entity_1.AuditAction.REJECT, 'PolicyException'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], PolicyExceptionsController.prototype, "reject", null);
exports.PolicyExceptionsController = PolicyExceptionsController = __decorate([
    (0, swagger_1.ApiTags)('Governance - Policy Exceptions'),
    (0, common_1.Controller)('governance/policy-exceptions'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [policy_exceptions_service_1.PolicyExceptionsService])
], PolicyExceptionsController);
//# sourceMappingURL=policy-exceptions.controller.js.map