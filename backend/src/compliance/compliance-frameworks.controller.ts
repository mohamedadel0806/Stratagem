import { Controller, Get, Param, Post, Body, UseGuards } from '@nestjs/common';
import { ComplianceFrameworksService } from './compliance-frameworks.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('compliance/frameworks')
@UseGuards(JwtAuthGuard)
export class ComplianceFrameworksController {
    constructor(private readonly frameworksService: ComplianceFrameworksService) { }

    @Get('global')
    findAllGlobal() {
        return this.frameworksService.findAllGlobal();
    }

    @Get('tenant/:tenantId')
    findTenantFrameworks(@Param('tenantId') tenantId: string) {
        return this.frameworksService.getTenantFrameworks(tenantId);
    }
}
