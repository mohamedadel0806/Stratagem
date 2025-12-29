import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TenantAuditLog, TenantAuditAction } from '../common/entities/tenant-audit-log.entity';
import { Request } from 'express';

@Injectable()
export class TenantAuditService {
    constructor(
        @InjectRepository(TenantAuditLog)
        private readonly auditLogRepository: Repository<TenantAuditLog>,
    ) { }

    /**
     * Log a tenant-related action
     */
    async logAction(
        tenantId: string,
        performedBy: string,
        action: TenantAuditAction,
        changes?: Record<string, any>,
        description?: string,
        ipAddress?: string,
    ): Promise<TenantAuditLog> {
        const auditLog = this.auditLogRepository.create({
            tenantId,
            performedBy,
            action,
            changes,
            description,
            ipAddress,
        });

        return this.auditLogRepository.save(auditLog);
    }

    /**
     * Get audit logs for a specific tenant
     */
    async getAuditLogs(
        tenantId: string,
        options?: {
            limit?: number;
            offset?: number;
            action?: TenantAuditAction;
            performedBy?: string;
            startDate?: Date;
            endDate?: Date;
        },
    ): Promise<{ logs: TenantAuditLog[]; total: number }> {
        const query = this.auditLogRepository
            .createQueryBuilder('audit')
            .where('audit.tenantId = :tenantId', { tenantId })
            .leftJoinAndSelect('audit.performedByUser', 'user')
            .orderBy('audit.createdAt', 'DESC');

        if (options?.action) {
            query.andWhere('audit.action = :action', { action: options.action });
        }

        if (options?.performedBy) {
            query.andWhere('audit.performedBy = :performedBy', { performedBy: options.performedBy });
        }

        if (options?.startDate) {
            query.andWhere('audit.createdAt >= :startDate', { startDate: options.startDate });
        }

        if (options?.endDate) {
            query.andWhere('audit.createdAt <= :endDate', { endDate: options.endDate });
        }

        const total = await query.getCount();

        if (options?.limit) {
            query.take(options.limit);
        }

        if (options?.offset) {
            query.skip(options.offset);
        }

        const logs = await query.getMany();

        return { logs, total };
    }

    /**
     * Extract IP address from request
     */
    getIpAddress(request: Request): string {
        return (
            (request.headers['x-forwarded-for'] as string)?.split(',')[0] ||
            (request.headers['x-real-ip'] as string) ||
            request.connection?.remoteAddress ||
            request.socket?.remoteAddress ||
            'unknown'
        );
    }

    /**
     * Log tenant creation
     */
    async logTenantCreated(
        tenantId: string,
        performedBy: string,
        tenantData: Record<string, any>,
        ipAddress?: string,
    ): Promise<TenantAuditLog> {
        return this.logAction(
            tenantId,
            performedBy,
            TenantAuditAction.CREATED,
            { tenantData },
            `Tenant created: ${tenantData.name}`,
            ipAddress,
        );
    }

    /**
     * Log tenant update
     */
    async logTenantUpdated(
        tenantId: string,
        performedBy: string,
        oldValues: Record<string, any>,
        newValues: Record<string, any>,
        ipAddress?: string,
    ): Promise<TenantAuditLog> {
        return this.logAction(
            tenantId,
            performedBy,
            TenantAuditAction.UPDATED,
            { before: oldValues, after: newValues },
            'Tenant settings updated',
            ipAddress,
        );
    }

    /**
     * Log status change
     */
    async logStatusChanged(
        tenantId: string,
        performedBy: string,
        oldStatus: string,
        newStatus: string,
        reason?: string,
        ipAddress?: string,
    ): Promise<TenantAuditLog> {
        return this.logAction(
            tenantId,
            performedBy,
            TenantAuditAction.STATUS_CHANGED,
            { oldStatus, newStatus, reason },
            `Status changed from ${oldStatus} to ${newStatus}${reason ? `: ${reason}` : ''}`,
            ipAddress,
        );
    }

    /**
     * Log subscription change
     */
    async logSubscriptionChanged(
        tenantId: string,
        performedBy: string,
        oldTier: string,
        newTier: string,
        ipAddress?: string,
    ): Promise<TenantAuditLog> {
        return this.logAction(
            tenantId,
            performedBy,
            TenantAuditAction.SUBSCRIPTION_CHANGED,
            { oldTier, newTier },
            `Subscription changed from ${oldTier} to ${newTier}`,
            ipAddress,
        );
    }

    /**
     * Log user added to tenant
     */
    async logUserAdded(
        tenantId: string,
        performedBy: string,
        userId: string,
        userEmail: string,
        ipAddress?: string,
    ): Promise<TenantAuditLog> {
        return this.logAction(
            tenantId,
            performedBy,
            TenantAuditAction.USER_ADDED,
            { userId, userEmail },
            `User added: ${userEmail}`,
            ipAddress,
        );
    }

    /**
     * Log user removed from tenant
     */
    async logUserRemoved(
        tenantId: string,
        performedBy: string,
        userId: string,
        userEmail: string,
        ipAddress?: string,
    ): Promise<TenantAuditLog> {
        return this.logAction(
            tenantId,
            performedBy,
            TenantAuditAction.USER_REMOVED,
            { userId, userEmail },
            `User removed: ${userEmail}`,
            ipAddress,
        );
    }

    /**
     * Log tenant deletion
     */
    async logTenantDeleted(
        tenantId: string,
        performedBy: string,
        reason?: string,
        ipAddress?: string,
    ): Promise<TenantAuditLog> {
        return this.logAction(
            tenantId,
            performedBy,
            TenantAuditAction.DELETED,
            { reason },
            `Tenant deleted${reason ? `: ${reason}` : ''}`,
            ipAddress,
        );
    }
}
