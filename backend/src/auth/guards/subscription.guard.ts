import {
    Injectable,
    CanActivate,
    ExecutionContext,
    ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { TenantsService } from '../../tenants/tenants.service';
import { TenantStatus, SubscriptionTier } from '../../common/entities/tenant.entity';
import { FEATURE_KEY } from '../../common/decorators/require-feature.decorator';
import { TIER_CONFIG, TenantFeature } from '../../common/constants/tier-config';

@Injectable()
export class SubscriptionGuard implements CanActivate {
    constructor(
        private reflector: Reflector,
        private tenantsService: TenantsService,
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const user = request.user;

        // 1. Allow public routes
        if (!user) {
            return true;
        }

        // 2. Super admins bypass subscription checks
        if (user.role === 'super_admin') {
            return true;
        }

        // 3. Allow all GET requests (read-only access)
        if (request.method === 'GET') {
            return true;
        }

        // 4. Check tenant status and trial expiration
        const tenantId = user.tenantId;
        if (!tenantId) {
            return true; // Should not happen for authenticated users
        }

        const tenant = await this.tenantsService.findOne(tenantId);

        // 5. Enforce trial expiration
        if (tenant.status === TenantStatus.TRIAL) {
            const now = new Date();
            if (tenant.trialEndsAt && new Date(tenant.trialEndsAt) < now) {
                throw new ForbiddenException({
                    message: 'Your trial period has expired. Please upgrade your subscription to continue.',
                    code: 'TRIAL_EXPIRED',
                    trialEndsAt: tenant.trialEndsAt,
                });
            }
        }

        // 6. Enforce suspended status
        if (tenant.status === TenantStatus.SUSPENDED) {
            throw new ForbiddenException({
                message: 'Your organization is suspended. Please contact support.',
                code: 'ORGANIZATION_SUSPENDED',
                reason: tenant.suspensionReason,
            });
        }

        // 7. Enforce Feature Requirements
        const requiredFeature = this.reflector.getAllAndOverride<TenantFeature>(FEATURE_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);

        if (requiredFeature) {
            const config = TIER_CONFIG[tenant.subscriptionTier];
            if (!config.features.includes(requiredFeature)) {
                throw new ForbiddenException({
                    message: `This feature (${requiredFeature}) is not included in your ${tenant.subscriptionTier} plan. Please upgrade to access it.`,
                    code: 'FEATURE_NOT_IN_PLAN',
                    requiredFeature,
                    currentTier: tenant.subscriptionTier,
                });
            }
        }

        // 8. Enforce Resource Limits (Users)
        if (request.url.includes('/users') && request.method === 'POST') {
            const config = TIER_CONFIG[tenant.subscriptionTier];
            if (tenant.userCount >= config.maxUsers) {
                throw new ForbiddenException({
                    message: `User limit reached for your ${tenant.subscriptionTier} plan (${config.maxUsers} users). Please upgrade to add more users.`,
                    code: 'USER_LIMIT_REACHED',
                    limit: config.maxUsers,
                });
            }
        }

        // 9. Enforce Resource Limits (Storage)
        if (request.url.includes('/upload') || request.url.includes('/attachments')) {
            const config = TIER_CONFIG[tenant.subscriptionTier];
            if (tenant.storageUsedMB >= config.maxStorageMB) {
                throw new ForbiddenException({
                    message: `Storage limit reached for your ${tenant.subscriptionTier} plan (${config.maxStorageMB} MB). Please upgrade or free up space.`,
                    code: 'STORAGE_LIMIT_REACHED',
                    limit: config.maxStorageMB,
                });
            }
        }

        return true;
    }
}
