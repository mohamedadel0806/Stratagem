import { GovernancePermissionsService } from './governance-permissions.service';
import { CreateGovernancePermissionDto } from './dto/create-governance-permission.dto';
import { AssignRoleDto, BulkAssignRoleDto } from './dto/assign-role.dto';
export declare class GovernancePermissionsController {
    private readonly permissionsService;
    constructor(permissionsService: GovernancePermissionsService);
    createPermission(dto: CreateGovernancePermissionDto): Promise<import("./entities/governance-permission.entity").GovernancePermission>;
    getAllPermissions(role?: string): Promise<import("./entities/governance-permission.entity").GovernancePermission[]>;
    deletePermission(id: string): Promise<{
        message: string;
    }>;
    assignRole(dto: AssignRoleDto, req: any): Promise<import("./entities/governance-role-assignment.entity").GovernanceRoleAssignment>;
    bulkAssignRole(dto: BulkAssignRoleDto, req: any): Promise<import("./entities/governance-role-assignment.entity").GovernanceRoleAssignment[]>;
    getUserRoleAssignments(userId: string): Promise<import("./entities/governance-role-assignment.entity").GovernanceRoleAssignment[]>;
    removeRoleAssignment(id: string): Promise<{
        message: string;
    }>;
    testUserPermissions(userId: string): Promise<{
        userId: string;
        roles: string[];
        permissions: Array<{
            module: import("./entities/governance-permission.entity").GovernanceModule;
            action: import("./entities/governance-permission.entity").GovernanceAction;
            allowed: boolean;
            reason?: string;
        }>;
    }>;
    checkPermission(req: any, module: string, action: string, resourceType?: string): Promise<{
        hasPermission: boolean;
    }>;
}
