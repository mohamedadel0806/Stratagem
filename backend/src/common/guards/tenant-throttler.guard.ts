import { Injectable, ExecutionContext } from '@nestjs/common';
import { ThrottlerGuard, ThrottlerOptions } from '@nestjs/throttler';

@Injectable()
export class TenantThrottlerGuard extends ThrottlerGuard {
    protected async getTracker(req: Record<string, any>): Promise<string> {
        // If we have a tenant context in the request, use it as part of the key
        const tenantId = req.tenantId || (req.user as any)?.tenantId;
        const ip = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress;

        if (tenantId) {
            return `throttle:tenant:${tenantId}:ip:${ip}`;
        }

        // Fallback to just IP for unauthenticated or non-tenant requests
        return `throttle:ip:${ip}`;
    }
}
