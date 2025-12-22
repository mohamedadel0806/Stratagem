import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GovernancePermissionsService } from '../governance-permissions.service';
import { GovernanceModule, GovernanceAction } from '../entities/governance-permission.entity';
import { PERMISSION_KEY } from '../decorators/governance-permission.decorator';

@Injectable()
export class GovernancePermissionsGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private permissionsService: GovernancePermissionsService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermission = this.reflector.getAllAndOverride<{
      module: GovernanceModule;
      action: GovernanceAction;
      resourceType?: string;
    }>(PERMISSION_KEY, [context.getHandler(), context.getClass()]);

    if (!requiredPermission) {
      return true; // No permission requirement, allow access
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user || !user.id) {
      throw new ForbiddenException('User not authenticated');
    }

    // Extract resource data from request if available
    const resourceData = this.extractResourceData(request);

    const hasPermission = await this.permissionsService.hasPermission(
      user.id,
      requiredPermission.module,
      requiredPermission.action,
      requiredPermission.resourceType,
      resourceData,
    );

    if (!hasPermission) {
      throw new ForbiddenException(
        `You do not have permission to ${requiredPermission.action} ${requiredPermission.module}`,
      );
    }

    return true;
  }

  private extractResourceData(request: any): Record<string, any> | undefined {
    // Extract resource data from request params, body, or query
    const resourceData: Record<string, any> = {};

    // Get resource ID from params
    if (request.params?.id) {
      resourceData.id = request.params.id;
    }

    // Get business unit from body or params
    if (request.body?.business_unit_id) {
      resourceData.business_unit_id = request.body.business_unit_id;
    }
    if (request.params?.businessUnitId) {
      resourceData.business_unit_id = request.params.businessUnitId;
    }

    // Get owner from body
    if (request.body?.owner_id) {
      resourceData.owner_id = request.body.owner_id;
    }

    return Object.keys(resourceData).length > 0 ? resourceData : undefined;
  }
}


