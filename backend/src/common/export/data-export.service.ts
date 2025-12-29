import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { Tenant } from '../entities/tenant.entity';
import { User } from '../../users/entities/user.entity';

@Injectable()
export class DataExportService {
    private readonly logger = new Logger(DataExportService.name);

    constructor(
        @InjectEntityManager()
        private readonly entityManager: EntityManager,
        @InjectRepository(Tenant)
        private readonly tenantRepository: Repository<Tenant>,
    ) { }

    /**
     * Export all data related to a specific tenant.
     */
    async exportTenantData(tenantId: string): Promise<any> {
        this.logger.log(`Starting data export for tenant: ${tenantId}`);

        const tenant = await this.tenantRepository.findOne({ where: { id: tenantId } });
        if (!tenant) {
            throw new NotFoundException(`Tenant with ID ${tenantId} not found`);
        }

        const exportData: any = {
            metadata: {
                type: 'tenant_full_export',
                tenantId,
                tenantName: tenant.name,
                exportedAt: new Date().toISOString(),
                version: '1.0',
            },
            content: {},
        };

        // List of entities to export for the tenant
        const entitiesToExport = [
            { key: 'users', entity: 'User', tenantFilter: true },
            { key: 'assets', entity: 'Asset', tenantFilter: true },
            { key: 'risks', entity: 'Risk', tenantFilter: true },
            { key: 'policies', entity: 'Policy', tenantFilter: true },
            { key: 'controls', entity: 'UnifiedControl', tenantFilter: true },
            { key: 'assessments', entity: 'Assessment', tenantFilter: true },
            { key: 'businessUnits', entity: 'BusinessUnit', tenantFilter: true },
            { key: 'auditLogs', entity: 'TenantAuditLog', tenantFilter: true },
            { key: 'notifications', entity: 'Notification', tenantFilter: true },
            { key: 'tasks', entity: 'Task', tenantFilter: true },
        ];

        for (const item of entitiesToExport) {
            try {
                const repo = this.entityManager.getRepository(item.entity);
                const data = await repo.find({ where: { tenantId } as any });
                exportData.content[item.key] = data;
            } catch (error) {
                this.logger.warn(`Failed to export entity ${item.entity}: ${error.message}`);
                exportData.content[item.key] = []; // Fallback to empty if table doesn't exist or fails
            }
        }

        return exportData;
    }

    /**
     * Export personal data for a specific user.
     */
    async exportUserData(userId: string): Promise<any> {
        this.logger.log(`Starting data export for user: ${userId}`);

        const userRepo = this.entityManager.getRepository(User);
        const user = await userRepo.findOne({ where: { id: userId } as any, relations: ['tenant'] });

        if (!user) {
            throw new NotFoundException(`User with ID ${userId} not found`);
        }

        const exportData: any = {
            metadata: {
                type: 'user_personal_data_export',
                userId,
                email: user.email,
                exportedAt: new Date().toISOString(),
                version: '1.0',
            },
            content: {
                profile: {
                    id: user.id,
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    role: user.role,
                    status: user.status,
                    tenant: user.tenant ? { id: user.tenant.id, name: user.tenant.name } : null,
                    createdAt: user.createdAt,
                },
            },
        };

        // Aggregating user-specific data
        try {
            // Find tasks assigned to user or created by user
            const taskRepo = this.entityManager.getRepository('Task');
            exportData.content.tasks = await taskRepo.find({
                where: [
                    { assignedToId: userId },
                    { createdById: userId }
                ] as any
            });

            // User notifications
            const notificationRepo = this.entityManager.getRepository('Notification');
            exportData.content.notifications = await notificationRepo.find({ where: { userId } as any });

            // User activities from audit logs (if we have a field for actor_id)
            const auditRepo = this.entityManager.getRepository('TenantAuditLog');
            exportData.content.activities = await auditRepo.find({ where: { performedBy: userId } as any });

        } catch (error) {
            this.logger.warn(`Error gathering user-specific data: ${error.message}`);
        }

        return exportData;
    }
}
