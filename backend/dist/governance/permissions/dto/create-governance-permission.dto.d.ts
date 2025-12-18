import { GovernanceModule, GovernanceAction } from '../entities/governance-permission.entity';
export declare class CreateGovernancePermissionDto {
    module: GovernanceModule;
    action: GovernanceAction;
    role: string;
    resource_type?: string;
    conditions?: Record<string, any>;
}
