import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GovernancePermissionsService } from '../governance-permissions.service';
export declare class GovernancePermissionsGuard implements CanActivate {
    private reflector;
    private permissionsService;
    constructor(reflector: Reflector, permissionsService: GovernancePermissionsService);
    canActivate(context: ExecutionContext): Promise<boolean>;
    private extractResourceData;
}
