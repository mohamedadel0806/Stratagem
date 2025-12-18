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
exports.GovernancePermissionsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const governance_permissions_service_1 = require("./governance-permissions.service");
const create_governance_permission_dto_1 = require("./dto/create-governance-permission.dto");
const assign_role_dto_1 = require("./dto/assign-role.dto");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../../auth/guards/roles.guard");
const roles_decorator_1 = require("../../auth/decorators/roles.decorator");
const user_entity_1 = require("../../users/entities/user.entity");
let GovernancePermissionsController = class GovernancePermissionsController {
    constructor(permissionsService) {
        this.permissionsService = permissionsService;
    }
    async createPermission(dto) {
        return this.permissionsService.createPermission(dto);
    }
    async getAllPermissions(role) {
        if (role) {
            return this.permissionsService.getPermissionsByRole(role);
        }
        return this.permissionsService.getAllPermissions();
    }
    async deletePermission(id) {
        await this.permissionsService.deletePermission(id);
        return { message: 'Permission deleted successfully' };
    }
    async assignRole(dto, req) {
        return this.permissionsService.assignRole(dto, req.user.id);
    }
    async bulkAssignRole(dto, req) {
        return this.permissionsService.bulkAssignRole(dto, req.user.id);
    }
    async getUserRoleAssignments(userId) {
        return this.permissionsService.getUserRoleAssignments(userId);
    }
    async removeRoleAssignment(id) {
        await this.permissionsService.removeRoleAssignment(id);
        return { message: 'Role assignment removed successfully' };
    }
    async testUserPermissions(userId) {
        return this.permissionsService.testUserPermissions(userId);
    }
    async checkPermission(req, module, action, resourceType) {
        const hasPermission = await this.permissionsService.hasPermission(req.user.id, module, action, resourceType);
        return { hasPermission };
    }
};
exports.GovernancePermissionsController = GovernancePermissionsController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.SUPER_ADMIN, user_entity_1.UserRole.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Create a governance permission' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Permission created successfully' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_governance_permission_dto_1.CreateGovernancePermissionDto]),
    __metadata("design:returntype", Promise)
], GovernancePermissionsController.prototype, "createPermission", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all governance permissions' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of permissions' }),
    __param(0, (0, common_1.Query)('role')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], GovernancePermissionsController.prototype, "getAllPermissions", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.SUPER_ADMIN, user_entity_1.UserRole.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a governance permission' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Permission deleted successfully' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], GovernancePermissionsController.prototype, "deletePermission", null);
__decorate([
    (0, common_1.Post)('assign-role'),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.SUPER_ADMIN, user_entity_1.UserRole.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Assign a role to a user' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Role assigned successfully' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [assign_role_dto_1.AssignRoleDto, Object]),
    __metadata("design:returntype", Promise)
], GovernancePermissionsController.prototype, "assignRole", null);
__decorate([
    (0, common_1.Post)('bulk-assign-role'),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.SUPER_ADMIN, user_entity_1.UserRole.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Bulk assign role to multiple users' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Roles assigned successfully' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [assign_role_dto_1.BulkAssignRoleDto, Object]),
    __metadata("design:returntype", Promise)
], GovernancePermissionsController.prototype, "bulkAssignRole", null);
__decorate([
    (0, common_1.Get)('user/:userId/assignments'),
    (0, swagger_1.ApiOperation)({ summary: 'Get role assignments for a user' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'User role assignments' }),
    __param(0, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], GovernancePermissionsController.prototype, "getUserRoleAssignments", null);
__decorate([
    (0, common_1.Delete)('assignments/:id'),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.SUPER_ADMIN, user_entity_1.UserRole.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Remove a role assignment' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Role assignment removed successfully' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], GovernancePermissionsController.prototype, "removeRoleAssignment", null);
__decorate([
    (0, common_1.Get)('test/:userId'),
    (0, swagger_1.ApiOperation)({ summary: 'Test permissions for a user' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Permission test results' }),
    __param(0, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], GovernancePermissionsController.prototype, "testUserPermissions", null);
__decorate([
    (0, common_1.Get)('check'),
    (0, swagger_1.ApiOperation)({ summary: 'Check if current user has permission' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Permission check result' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('module')),
    __param(2, (0, common_1.Query)('action')),
    __param(3, (0, common_1.Query)('resourceType')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, String]),
    __metadata("design:returntype", Promise)
], GovernancePermissionsController.prototype, "checkPermission", null);
exports.GovernancePermissionsController = GovernancePermissionsController = __decorate([
    (0, swagger_1.ApiTags)('Governance - Permissions'),
    (0, common_1.Controller)('api/v1/governance/permissions'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [governance_permissions_service_1.GovernancePermissionsService])
], GovernancePermissionsController);
//# sourceMappingURL=governance-permissions.controller.js.map