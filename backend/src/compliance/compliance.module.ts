import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ComplianceFrameworksController } from './compliance-frameworks.controller';
import { ComplianceFrameworksService } from './compliance-frameworks.service';
import { ComplianceFramework } from '../common/entities/compliance-framework.entity';
import { Tenant } from '../common/entities/tenant.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([ComplianceFramework, Tenant]),
    ],
    controllers: [ComplianceFrameworksController],
    providers: [ComplianceFrameworksService],
    exports: [ComplianceFrameworksService],
})
export class ComplianceModule { }