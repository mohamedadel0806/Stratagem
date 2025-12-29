import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, Req } from '@nestjs/common';
import { TenantsService } from './tenants.service';
import { Tenant, TenantStatus } from '../common/entities/tenant.entity';
// import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
// import { RolesGuard } from '../auth/guards/roles.guard';
// import { Roles } from '../common/decorators/roles.decorator';
// import { UserRole } from '../users/entities/user.entity';

import { TenantOnboardingService } from './tenant-onboarding.service';
import { CreateTenantOnboardingDto } from './dto/create-tenant-onboarding.dto';
import { UpdateTenantDto } from './dto/update-tenant.dto';
import { GetAuditLogsDto } from './dto/get-audit-logs.dto';

import { Public } from '../auth/decorators/public.decorator';
import { TenantAuditService } from './tenant-audit.service';
import { DataExportService } from '../common/export/data-export.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { SubscriptionGuard } from '../auth/guards/subscription.guard';
import { RequireFeature } from '../common/decorators/require-feature.decorator';
import { TenantFeature } from '../common/constants/tier-config';


@Controller('tenants')
@UseGuards(JwtAuthGuard, SubscriptionGuard)
export class TenantsController {
    constructor(
        private readonly tenantsService: TenantsService,
        private readonly tenantOnboardingService: TenantOnboardingService,
        private readonly tenantAuditService: TenantAuditService,
        private readonly dataExportService: DataExportService,
    ) { }

    @Get()
    // @Roles(UserRole.SUPER_ADMIN)
    findAll(): Promise<Tenant[]> {
        return this.tenantsService.findAll();
    }

    @Get(':id')
    // @Roles(UserRole.SUPER_ADMIN)
    findOne(@Param('id') id: string): Promise<Tenant> {
        return this.tenantsService.findOne(id);
    }

    @Public()
    @Post()
    // @Roles(UserRole.SUPER_ADMIN)
    create(@Body() createTenantDto: CreateTenantOnboardingDto): Promise<{ tenant: Tenant; adminUser: any }> {
        return this.tenantOnboardingService.onboardTenant(createTenantDto);
    }

    @Patch(':id')
    // @Roles(UserRole.SUPER_ADMIN)
    update(@Param('id') id: string, @Body() updateTenantDto: UpdateTenantDto): Promise<Tenant> {
        return this.tenantsService.update(id, updateTenantDto);
    }

    @Patch(':id/status')
    // @Roles(UserRole.SUPER_ADMIN)
    setStatus(@Param('id') id: string, @Body('status') status: TenantStatus): Promise<Tenant> {
        return this.tenantsService.setStatus(id, status);
    }

    @Delete(':id')
    // @Roles(UserRole.SUPER_ADMIN)
    remove(@Param('id') id: string): Promise<void> {
        return this.tenantsService.remove(id);
    }

    @Get(':id/audit-logs')
    // @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
    getAuditLogs(
        @Param('id') id: string,
        @Query() query: GetAuditLogsDto,
    ) {
        return this.tenantAuditService.getAuditLogs(id, {
            ...query,
            startDate: query.startDate ? new Date(query.startDate) : undefined,
            endDate: query.endDate ? new Date(query.endDate) : undefined,
        });
    }

    @Patch(':id/onboarding-progress')
    // @Roles(UserRole.ADMIN)
    updateOnboardingProgress(
        @Param('id') id: string,
        @Body() update: { completed?: string; skipped?: string },
        @Req() req: any,
    ) {
        return this.tenantsService.updateOnboardingProgress(id, update, req.user?.id);
    }

    @Post(':id/export')
    @RequireFeature(TenantFeature.DATA_EXPORT)
    // @Roles(UserRole.ADMIN)
    async exportData(@Param('id') id: string) {
        return this.dataExportService.exportTenantData(id);
    }
}
