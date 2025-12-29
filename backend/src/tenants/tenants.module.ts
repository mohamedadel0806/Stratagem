import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { Tenant } from '../common/entities/tenant.entity';
import { TenantAuditLog } from '../common/entities/tenant-audit-log.entity';
import { TenantsService } from './tenants.service';
import { TenantsController } from './tenants.controller';
import { NotificationSettingsController } from './notification-settings.controller';
import { TenantOnboardingService } from './tenant-onboarding.service';
import { TenantAuditService } from './tenant-audit.service';
import { CommonModule } from '../common/common.module';
import { OnboardingInterceptor } from '../common/interceptors/onboarding.interceptor';
import { DataExportModule } from '../common/export/data-export.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([Tenant, TenantAuditLog]),
        forwardRef(() => CommonModule),
        DataExportModule,
    ],
    providers: [
        TenantsService,
        TenantOnboardingService,
        TenantAuditService,
        {
            provide: APP_INTERCEPTOR,
            useClass: OnboardingInterceptor,
        },
    ],
    controllers: [TenantsController, NotificationSettingsController],
    exports: [TenantsService, TenantOnboardingService, TenantAuditService],
})
export class TenantsModule { }
