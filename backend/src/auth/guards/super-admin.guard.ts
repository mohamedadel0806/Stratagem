import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { UserRole } from '../../users/entities/user.entity';

/**
 * Guard to restrict access to SUPER_ADMIN users only.
 * Used for tenant management and system-wide administration endpoints.
 */
@Injectable()
export class SuperAdminGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest();
        const user = request.user;

        if (!user) {
            throw new ForbiddenException('Authentication required');
        }

        if (user.role !== UserRole.SUPER_ADMIN) {
            throw new ForbiddenException('Super admin access required');
        }

        return true;
    }
}
