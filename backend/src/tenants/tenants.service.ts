import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tenant, TenantStatus } from '../common/entities/tenant.entity';
import { TenantAuditService } from './tenant-audit.service';
import { SmtpConfig, NotificationBranding } from '../common/interfaces/notification-settings.interface';
import { UpdateNotificationSettingsDto } from './dto/notification-settings.dto';
import { EncryptionService } from '../common/services/encryption.service';

@Injectable()
export class TenantsService {
    constructor(
        @InjectRepository(Tenant)
        private readonly tenantRepository: Repository<Tenant>,
        private readonly tenantAuditService: TenantAuditService,
        private readonly encryptionService: EncryptionService,
    ) { }

    async findAll(): Promise<Tenant[]> {
        return this.tenantRepository.find();
    }

    async findOne(id: string): Promise<Tenant> {
        const tenant = await this.tenantRepository.findOne({ where: { id } });
        if (!tenant) {
            throw new NotFoundException(`Tenant with ID ${id} not found`);
        }
        return tenant;
    }

    async findByCode(code: string): Promise<Tenant | null> {
        return this.tenantRepository.findOne({ where: { code } });
    }

    async create(
        createTenantDto: { name: string; code: string; settings?: Record<string, any> },
        performedBy?: string,
    ): Promise<Tenant> {
        const existing = await this.findByCode(createTenantDto.code);
        if (existing) {
            throw new BadRequestException(`Tenant with code ${createTenantDto.code} already exists`);
        }

        const tenant = this.tenantRepository.create(createTenantDto);
        const savedTenant = await this.tenantRepository.save(tenant);

        // Log tenant creation
        if (performedBy) {
            await this.tenantAuditService.logTenantCreated(
                savedTenant.id,
                performedBy,
                createTenantDto,
            );
        }

        return savedTenant;
    }

    async update(
        id: string,
        updateTenantDto: Partial<Tenant>,
        performedBy?: string,
    ): Promise<Tenant> {
        const tenant = await this.findOne(id);
        const oldValues = { ...tenant };

        Object.assign(tenant, updateTenantDto);
        const updatedTenant = await this.tenantRepository.save(tenant);

        // Log tenant update
        if (performedBy) {
            await this.tenantAuditService.logTenantUpdated(
                id,
                performedBy,
                oldValues,
                updateTenantDto,
            );
        }

        return updatedTenant;
    }

    async setStatus(
        id: string,
        status: TenantStatus,
        reason?: string,
        performedBy?: string,
    ): Promise<Tenant> {
        const tenant = await this.findOne(id);
        const oldStatus = tenant.status;

        tenant.status = status;
        if (reason) {
            tenant.suspensionReason = reason;
        }

        const updatedTenant = await this.tenantRepository.save(tenant);

        // Log status change
        if (performedBy) {
            await this.tenantAuditService.logStatusChanged(
                id,
                performedBy,
                oldStatus,
                status,
                reason,
            );
        }

        return updatedTenant;
    }

    async remove(
        id: string,
        reason?: string,
        performedBy?: string,
    ): Promise<void> {
        const tenant = await this.findOne(id);

        await this.tenantRepository.softRemove(tenant);

        // Log tenant deletion
        if (performedBy) {
            await this.tenantAuditService.logTenantDeleted(
                id,
                performedBy,
                reason,
            );
        }
    }

    async updateOnboardingProgress(
        id: string,
        update: { completed?: string; skipped?: string },
        performedBy?: string,
    ): Promise<Tenant> {
        const tenant = await this.findOne(id);

        const progress = tenant.onboardingProgress || {
            completed: [],
            skipped: [],
            lastUpdated: new Date(),
        };

        if (update.completed && !progress.completed.includes(update.completed)) {
            progress.completed.push(update.completed);
            // Remove from skipped if it was there
            progress.skipped = progress.skipped.filter((s: string) => s !== update.completed);
        }

        if (update.skipped && !progress.skipped.includes(update.skipped)) {
            progress.skipped.push(update.skipped);
            // Remove from completed if it was there
            progress.completed = progress.completed.filter((s: string) => s !== update.skipped);
        }

        progress.lastUpdated = new Date();
        tenant.onboardingProgress = progress;

        const updatedTenant = await this.tenantRepository.save(tenant);

        if (performedBy) {
            await this.tenantAuditService.logAction(
                id,
                performedBy,
                'onboarding_updated' as any,
                { before: tenant.onboardingProgress, after: progress },
                `Onboarding progress updated: ${update.completed || update.skipped}`,
            );
        }

        return updatedTenant;
    }

    async getNotificationSettings(id: string): Promise<{ smtpConfig?: SmtpConfig; notificationBranding?: NotificationBranding }> {
        const tenant = await this.findOne(id);
        return {
            smtpConfig: tenant.smtpConfig,
            notificationBranding: tenant.notificationBranding,
        };
    }

    async updateNotificationSettings(
        id: string,
        dto: UpdateNotificationSettingsDto,
        performedBy: string,
    ): Promise<Tenant> {
        const tenant = await this.findOne(id);
        const oldValues = {
            smtpConfig: tenant.smtpConfig,
            notificationBranding: tenant.notificationBranding,
        };

        if (dto.smtpConfig) {
            const config = { ...dto.smtpConfig };
            if (config.auth?.pass) {
                config.auth.pass = this.encryptionService.encrypt(config.auth.pass);
            }
            tenant.smtpConfig = config as any;
        }
        if (dto.notificationBranding) {
            tenant.notificationBranding = dto.notificationBranding as any;
        }

        const updatedTenant = await this.tenantRepository.save(tenant);

        await this.tenantAuditService.logAction(
            id,
            performedBy,
            'notification_settings_updated' as any,
            { before: oldValues, after: dto },
            'Notification settings (SMTP/Branding) updated',
        );

        return updatedTenant;
    }
}
