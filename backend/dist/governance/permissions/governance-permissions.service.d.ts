import { Repository } from 'typeorm';
import { GovernancePermission, GovernanceModule, GovernanceAction } from './entities/governance-permission.entity';
import { GovernanceRoleAssignment } from './entities/governance-role-assignment.entity';
import { User } from '../../users/entities/user.entity';
import { CreateGovernancePermissionDto } from './dto/create-governance-permission.dto';
import { AssignRoleDto, BulkAssignRoleDto } from './dto/assign-role.dto';
export declare class GovernancePermissionsService {
    private permissionRepository;
    private roleAssignmentRepository;
    private userRepository;
    private readonly logger;
    constructor(permissionRepository: Repository<GovernancePermission>, roleAssignmentRepository: Repository<GovernanceRoleAssignment>, userRepository: Repository<User>);
    hasPermission(userId: string, module: GovernanceModule, action: GovernanceAction, resourceType?: string, resourceData?: Record<string, any>): Promise<boolean>;
    private checkConditions;
    createPermission(dto: CreateGovernancePermissionDto): Promise<GovernancePermission>;
    getPermissionsByRole(role: string): Promise<GovernancePermission[]>;
    getAllPermissions(): Promise<GovernancePermission[]>;
    deletePermission(id: string): Promise<void>;
    assignRole(dto: AssignRoleDto, assignedBy: string): Promise<GovernanceRoleAssignment>;
    bulkAssignRole(dto: BulkAssignRoleDto, assignedBy: string): Promise<GovernanceRoleAssignment[]>;
    getUserRoleAssignments(userId: string): Promise<GovernanceRoleAssignment[]>;
    removeRoleAssignment(id: string): Promise<void>;
    testUserPermissions(userId: string): Promise<{
        userId: string;
        roles: string[];
        permissions: Array<{
            module: GovernanceModule;
            action: GovernanceAction;
            allowed: boolean;
            reason?: string;
        }>;
    }>;
}
