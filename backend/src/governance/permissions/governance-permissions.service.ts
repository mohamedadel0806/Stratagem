import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { GovernancePermission, GovernanceModule, GovernanceAction } from './entities/governance-permission.entity';
import { GovernanceRoleAssignment } from './entities/governance-role-assignment.entity';
import { User, UserRole } from '../../users/entities/user.entity';
import { CreateGovernancePermissionDto } from './dto/create-governance-permission.dto';
import { AssignRoleDto, BulkAssignRoleDto } from './dto/assign-role.dto';

@Injectable()
export class GovernancePermissionsService {
  private readonly logger = new Logger(GovernancePermissionsService.name);

  constructor(
    @InjectRepository(GovernancePermission)
    private permissionRepository: Repository<GovernancePermission>,
    @InjectRepository(GovernanceRoleAssignment)
    private roleAssignmentRepository: Repository<GovernanceRoleAssignment>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  /**
   * Check if a user has permission for a specific action
   */
  async hasPermission(
    userId: string,
    module: GovernanceModule,
    action: GovernanceAction,
    resourceType?: string,
    resourceData?: Record<string, any>,
  ): Promise<boolean> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      return false;
    }

    // Get all roles for the user (including custom role assignments)
    const roleAssignments = await this.roleAssignmentRepository
      .createQueryBuilder('assignment')
      .where('assignment.user_id = :userId', { userId })
      .andWhere('(assignment.expires_at IS NULL OR assignment.expires_at > :now)', {
        now: new Date(),
      })
      .getMany();

    const roles = [user.role, ...roleAssignments.map((ra) => ra.role)];

    // Check permissions for each role
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
        // Check row-level security conditions
        if (permission.conditions) {
          if (this.checkConditions(permission.conditions, user, resourceData, roleAssignments)) {
            return true;
          }
        } else {
          // No conditions, permission granted
          return true;
        }
      }
    }

    return false;
  }

  /**
   * Check row-level security conditions
   */
  private checkConditions(
    conditions: Record<string, any>,
    user: User,
    resourceData?: Record<string, any>,
    roleAssignments?: GovernanceRoleAssignment[],
  ): boolean {
    // Check business unit restrictions
    if (conditions.business_unit_id) {
      const userBusinessUnitId = user.businessUnitId;
      const resourceBusinessUnitId =
        resourceData?.business_unit_id ||
        resourceData?.owner?.business_unit_id ||
        resourceData?.business_unit?.id;

      // If condition is 'user.business_unit_id', check if user's BU matches resource BU
      if (conditions.business_unit_id === 'user.business_unit_id') {
        if (!userBusinessUnitId) {
          return false; // User has no BU, can't match
        }
        if (!resourceBusinessUnitId) {
          return false; // Resource has no BU, can't match
        }
        return userBusinessUnitId === resourceBusinessUnitId;
      }

      // If condition is a specific BU ID, check role assignment
      if (roleAssignments && roleAssignments.length > 0) {
        const matchingAssignment = roleAssignments.find(
          (ra) => ra.business_unit_id === conditions.business_unit_id,
        );
        if (matchingAssignment) {
          // User has role assignment for this specific BU
          if (resourceBusinessUnitId === conditions.business_unit_id) {
            return true; // Resource belongs to the assigned BU
          }
        }
      }

      // If user's primary BU matches the condition
      if (userBusinessUnitId === conditions.business_unit_id) {
        if (!resourceBusinessUnitId || resourceBusinessUnitId === userBusinessUnitId) {
          return true;
        }
      }

      return false; // No match found
    }

    // Add more condition checks as needed
    return true;
  }

  /**
   * Create a permission
   */
  async createPermission(dto: CreateGovernancePermissionDto): Promise<GovernancePermission> {
    const permission = this.permissionRepository.create(dto);
    return this.permissionRepository.save(permission);
  }

  /**
   * Get all permissions for a role
   */
  async getPermissionsByRole(role: string): Promise<GovernancePermission[]> {
    return this.permissionRepository.find({
      where: { role },
      order: { module: 'ASC', action: 'ASC' },
    });
  }

  /**
   * Get all permissions
   */
  async getAllPermissions(): Promise<GovernancePermission[]> {
    return this.permissionRepository.find({
      order: { role: 'ASC', module: 'ASC', action: 'ASC' },
    });
  }

  /**
   * Delete a permission
   */
  async deletePermission(id: string): Promise<void> {
    const permission = await this.permissionRepository.findOne({ where: { id } });
    if (!permission) {
      throw new NotFoundException(`Permission with ID ${id} not found`);
    }
    await this.permissionRepository.remove(permission);
  }

  /**
   * Assign a role to a user
   */
  async assignRole(dto: AssignRoleDto, assignedBy: string): Promise<GovernanceRoleAssignment> {
    // Check if assignment already exists
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

    const assignment = this.roleAssignmentRepository.create({
      ...dto,
      assigned_by: assignedBy,
      assigned_at: new Date(),
    });

    return this.roleAssignmentRepository.save(assignment);
  }

  /**
   * Bulk assign role to multiple users
   */
  async bulkAssignRole(dto: BulkAssignRoleDto, assignedBy: string): Promise<GovernanceRoleAssignment[]> {
    const assignments = dto.user_ids.map((userId) =>
      this.roleAssignmentRepository.create({
        user_id: userId,
        role: dto.role,
        business_unit_id: dto.business_unit_id,
        assigned_by: assignedBy,
        assigned_at: new Date(),
        expires_at: dto.expires_at ? new Date(dto.expires_at) : null,
      }),
    );

    return this.roleAssignmentRepository.save(assignments);
  }

  /**
   * Get role assignments for a user
   */
  async getUserRoleAssignments(userId: string): Promise<GovernanceRoleAssignment[]> {
    return this.roleAssignmentRepository.find({
      where: { user_id: userId },
      relations: ['business_unit', 'assigner'],
      order: { assigned_at: 'DESC' },
    });
  }

  /**
   * Remove a role assignment
   */
  async removeRoleAssignment(id: string): Promise<void> {
    const assignment = await this.roleAssignmentRepository.findOne({ where: { id } });
    if (!assignment) {
      throw new NotFoundException(`Role assignment with ID ${id} not found`);
    }
    await this.roleAssignmentRepository.remove(assignment);
  }

  /**
   * Test permissions for a user
   */
  async testUserPermissions(userId: string): Promise<{
    userId: string;
    roles: string[];
    permissions: Array<{
      module: GovernanceModule;
      action: GovernanceAction;
      allowed: boolean;
      reason?: string;
    }>;
  }> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    const roleAssignments = await this.getUserRoleAssignments(userId);
    const roles = [user.role, ...roleAssignments.map((ra) => ra.role)];

    const allModules = Object.values(GovernanceModule);
    const allActions = Object.values(GovernanceAction);

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
}
