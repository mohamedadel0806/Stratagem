import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ComplianceFramework, FrameworkStatus } from '../common/entities/compliance-framework.entity';
import { Tenant } from '../common/entities/tenant.entity';

@Injectable()
export class ComplianceFrameworksService {
    constructor(
        @InjectRepository(ComplianceFramework)
        private readonly frameworkRepository: Repository<ComplianceFramework>,
        @InjectRepository(Tenant)
        private readonly tenantRepository: Repository<Tenant>,
    ) { }

    async findAllGlobal(): Promise<ComplianceFramework[]> {
        return this.frameworkRepository.find({
            where: { tenantId: null, status: FrameworkStatus.ACTIVE },
            order: { name: 'ASC' },
        });
    }

    async findById(id: string): Promise<ComplianceFramework> {
        const framework = await this.frameworkRepository.findOne({ where: { id } });
        if (!framework) {
            throw new NotFoundException(`Framework with ID ${id} not found`);
        }
        return framework;
    }

    async getTenantFrameworks(tenantId: string): Promise<ComplianceFramework[]> {
        return this.frameworkRepository.find({
            where: { tenantId: tenantId },
            order: { name: 'ASC' },
        });
    }
}
