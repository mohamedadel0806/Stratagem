import { GovernanceModule, GovernanceAction } from '../entities/governance-permission.entity';
export declare const PERMISSION_KEY = "governance_permission";
export interface GovernancePermissionMetadata {
    module: GovernanceModule;
    action: GovernanceAction;
    resourceType?: string;
}
export declare const RequireGovernancePermission: (module: GovernanceModule, action: GovernanceAction, resourceType?: string) => import("@nestjs/common").CustomDecorator<string>;
