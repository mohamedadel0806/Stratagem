import { Injectable, BadRequestException, ConflictException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { CreateTenantOnboardingDto } from './dto/create-tenant-onboarding.dto';
import { Tenant, TenantStatus, SubscriptionTier } from '../common/entities/tenant.entity';
import { BusinessUnit } from '../common/entities/business-unit.entity';
import { User, UserRole, UserStatus } from '../users/entities/user.entity';

@Injectable()
export class TenantOnboardingService {
    constructor(private readonly dataSource: DataSource) { }

    async onboardTenant(dto: CreateTenantOnboardingDto): Promise<{ tenant: Tenant; adminUser: User }> {
        return this.dataSource.transaction(async (manager) => {
            // 1. Check if tenant code exists
            const existingTenant = await manager.findOne(Tenant, { where: { code: dto.tenantCode } });
            if (existingTenant) {
                throw new ConflictException(`Tenant with code '${dto.tenantCode}' already exists`);
            }

            // 2. Check if admin email exists
            const existingUser = await manager.findOne(User, { where: { email: dto.adminEmail } });
            if (existingUser) {
                throw new ConflictException(`User with email '${dto.adminEmail}' already exists`);
            }

            // 3. Create Tenant
            const now = new Date();
            const trialDays = 14;
            const trialEndsAt = new Date(now.getTime() + trialDays * 24 * 60 * 60 * 1000);

            const tenant = manager.create(Tenant, {
                name: dto.tenantName,
                code: dto.tenantCode,
                status: dto.subscriptionTier === SubscriptionTier.STARTER ? TenantStatus.TRIAL : TenantStatus.ACTIVE,
                subscriptionTier: dto.subscriptionTier || SubscriptionTier.STARTER,
                industry: dto.industry,
                regulatoryScope: dto.regulatoryScope,
                settings: dto.settings || {},
                trialStartedAt: now,
                trialEndsAt: dto.subscriptionTier === SubscriptionTier.STARTER ? trialEndsAt : null,
                onboardingProgress: {
                    completed: [],
                    skipped: [],
                    lastUpdated: now,
                }
            });
            const savedTenant = await manager.save(Tenant, tenant);

            // 4. Create Main Business Unit
            const mainBU = manager.create(BusinessUnit, {
                name: dto.initialBusinessUnitName || 'Main Business Unit',
                code: 'MAIN', // Default code
                tenantId: savedTenant.id,
                tenant: savedTenant, // Link explicitly for correctness in transaction
            });
            const savedBU = await manager.save(BusinessUnit, mainBU);

            // 5. Create Admin User
            // Generate a random temporary password
            const tempPassword = Math.random().toString(36).slice(-8) + 'Aa1!';
            const hashedPassword = await bcrypt.hash(tempPassword, 10);

            const adminUser = manager.create(User, {
                email: dto.adminEmail,
                firstName: dto.adminFirstName,
                lastName: dto.adminLastName,
                password: hashedPassword,
                role: UserRole.ADMIN,
                status: UserStatus.ACTIVE, // Or PENDING if using email verification
                tenantId: savedTenant.id,
                tenant: savedTenant,
                businessUnitId: savedBU.id,
                emailVerified: false,
            });
            const savedUser = await manager.save(User, adminUser);

            // 6. TODO: Send Invitation Email
            // For now, log the credentials. In production, send via email service
            console.log(`\n========== NEW TENANT CREATED ==========`);
            console.log(`Organization: ${savedTenant.name} (${savedTenant.code})`);
            console.log(`Admin Email: ${savedUser.email}`);
            console.log(`Temporary Password: ${tempPassword}`);
            console.log(`Login URL: ${process.env.FRONTEND_URL || 'http://localhost:3000'}/login`);
            console.log(`========================================\n`);

            return { tenant: savedTenant, adminUser: savedUser };
        });
    }
}
