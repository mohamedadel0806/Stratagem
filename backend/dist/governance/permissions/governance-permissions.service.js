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
var GovernancePermissionsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.GovernancePermissionsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const governance_permission_entity_1 = require("./entities/governance-permission.entity");
const governance_role_assignment_entity_1 = require("./entities/governance-role-assignment.entity");
const user_entity_1 = require("../../users/entities/user.entity");
let GovernancePermissionsService = GovernancePermissionsService_1 = class GovernancePermissionsService {
    constructor(permissionRepository, roleAssignmentRepository, userRepository) {
        this.permissionRepository = permissionRepository;
        this.roleAssignmentRepository = roleAssignmentRepository;
        this.userRepository = userRepository;
        this.logger = new common_1.Logger(GovernancePermissionsService_1.name);
    }
    async hasPermission(userId, module, action, resourceType, resourceData) {
        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user) {
            return false;
        }
        const roleAssignments = await this.roleAssignmentRepository
            .createQueryBuilder('assignment')
            .where('assignment.user_id = :userId', { userId })
            .andWhere('(assignment.expires_at IS NULL OR assignment.expires_at > :now)', {
            now: new Date(),
        })
            .getMany();
        const roles = [user.role, ...roleAssignments.map((ra) => ra.role)];
        for (const role of roles) {
            const permissions = await this.permissionRepository.find({
                where: {
                    role,
                    module,
                    action,
                    resource_type: resourceType || null,
                },
            });
            for (const permission of permissions) {
                if (permission.conditions) {
                    if (this.checkConditions(permission.conditions, user, resourceData, roleAssignments)) {
                        return true;
                    }
                }
                else {
                    return true;
                }
            }
        }
        return false;
    }
    checkConditions(conditions, user, resourceData, roleAssignments) {
        var _a, _b;
        if (conditions.business_unit_id) {
            const userBusinessUnitId = user.businessUnitId;
            const resourceBusinessUnitId = (resourceData === null || resourceData === void 0 ? void 0 : resourceData.business_unit_id) ||
                ((_a = resourceData === null || resourceData === void 0 ? void 0 : resourceData.owner) === null || _a === void 0 ? void 0 : _a.business_unit_id) ||
                ((_b = resourceData === null || resourceData === void 0 ? void 0 : resourceData.business_unit) === null || _b === void 0 ? void 0 : _b.id);
            if (conditions.business_unit_id === 'user.business_unit_id') {
                if (!userBusinessUnitId) {
                    return false;
                }
                if (!resourceBusinessUnitId) {
                    return false;
                }
                return userBusinessUnitId === resourceBusinessUnitId;
            }
            if (roleAssignments && roleAssignments.length > 0) {
                const matchingAssignment = roleAssignments.find((ra) => ra.business_unit_id === conditions.business_unit_id);
                if (matchingAssignment) {
                    if (resourceBusinessUnitId === conditions.business_unit_id) {
                        return true;
                    }
                }
            }
            if (userBusinessUnitId === conditions.business_unit_id) {
                if (!resourceBusinessUnitId || resourceBusinessUnitId === userBusinessUnitId) {
                    return true;
                }
            }
            return false;
        }
        return true;
    }
    async createPermission(dto) {
        const permission = this.permissionRepository.create(dto);
        return this.permissionRepository.save(permission);
    }
    async getPermissionsByRole(role) {
        return this.permissionRepository.find({
            where: { role },
            order: { module: 'ASC', action: 'ASC' },
        });
    }
    async getAllPermissions() {
        return this.permissionRepository.find({
            order: { role: 'ASC', module: 'ASC', action: 'ASC' },
        });
    }
    async deletePermission(id) {
        const permission = await this.permissionRepository.findOne({ where: { id } });
        if (!permission) {
            throw new common_1.NotFoundException(`Permission with ID ${id} not found`);
        }
        await this.permissionRepository.remove(permission);
    }
    async assignRole(dto, assignedBy) {
        const existing = await this.roleAssignmentRepository.findOne({
            where: {
                user_id: dto.user_id,
                role: dto.role,
                business_unit_id: dto.business_unit_id || null,
                expires_at: null,
            },
        });
        if (existing) {
            return existing;
        }
        const assignment = this.roleAssignmentRepository.create(Object.assign(Object.assign({}, dto), { assigned_by: assignedBy, assigned_at: new Date() }));
        return this.roleAssignmentRepository.save(assignment);
    }
    async bulkAssignRole(dto, assignedBy) {
        const assignments = dto.user_ids.map((userId) => this.roleAssignmentRepository.create({
            user_id: userId,
            role: dto.role,
            business_unit_id: dto.business_unit_id,
            assigned_by: assignedBy,
            assigned_at: new Date(),
            expires_at: dto.expires_at ? new Date(dto.expires_at) : null,
        }));
        return this.roleAssignmentRepository.save(assignments);
    }
    async getUserRoleAssignments(userId) {
        return this.roleAssignmentRepository.find({
            where: { user_id: userId },
            relations: ['business_unit', 'assigner'],
            order: { assigned_at: 'DESC' },
        });
    }
    async removeRoleAssignment(id) {
        const assignment = await this.roleAssignmentRepository.findOne({ where: { id } });
        if (!assignment) {
            throw new common_1.NotFoundException(`Role assignment with ID ${id} not found`);
        }
        await this.roleAssignmentRepository.remove(assignment);
    }
    async testUserPermissions(userId) {
        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user) {
            throw new common_1.NotFoundException(`User with ID ${userId} not found`);
        }
        const roleAssignments = await this.getUserRoleAssignments(userId);
        const roles = [user.role, ...roleAssignments.map((ra) => ra.role)];
        const allModules = Object.values(governance_permission_entity_1.GovernanceModule);
        const allActions = Object.values(governance_permission_entity_1.GovernanceAction);
        const permissions = [];
        for (const module of allModules) {
            for (const action of allActions) {
                const allowed = await this.hasPermission(userId, module, action);
                permissions.push({
                    module,
                    action,
                    allowed,
                });
            }
        }
        return {
            userId,
            roles: [...new Set(roles)],
            permissions,
        };
    }
};
exports.GovernancePermissionsService = GovernancePermissionsService;
exports.GovernancePermissionsService = GovernancePermissionsService = GovernancePermissionsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(governance_permission_entity_1.GovernancePermission)),
    __param(1, (0, typeorm_1.InjectRepository)(governance_role_assignment_entity_1.GovernanceRoleAssignment)),
    __param(2, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], GovernancePermissionsService);
//# sourceMappingURL=governance-permissions.service.js.map