import { SetMetadata } from '@nestjs/common';
import { GovernanceModule, GovernanceAction } from '../entities/governance-permission.entity';

export const PERMISSION_KEY = 'governance_permission';

export interface GovernancePermissionMetadata {
  module: GovernanceModule;
  action: GovernanceAction;
  resourceType?: string;
}

export const RequireGovernancePermission = (
  module: GovernanceModule,
  action: GovernanceAction,
  resourceType?: string,
) => SetMetadata(PERMISSION_KEY, { module, action, resourceType });


