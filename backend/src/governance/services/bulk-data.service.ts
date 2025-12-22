import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull, In } from 'typeorm';
import { Policy, PolicyStatus, ReviewFrequency } from '../policies/entities/policy.entity';
import { UnifiedControl, ControlStatus, ImplementationStatus, ControlType } from '../unified-controls/entities/unified-control.entity';
import { Influencer } from '../influencers/entities/influencer.entity';
import { parse } from 'csv-parse/sync';

@Injectable()
export class BulkDataService {
  private readonly logger = new Logger(BulkDataService.name);

  constructor(
    @InjectRepository(Policy)
    private policyRepository: Repository<Policy>,
    @InjectRepository(UnifiedControl)
    private controlRepository: Repository<UnifiedControl>,
    @InjectRepository(Influencer)
    private influencerRepository: Repository<Influencer>,
  ) {}

  async importPolicies(data: any[], userId: string) {
    let created = 0;
    let skipped = 0;
    const errors: string[] = [];

    for (const item of data) {
      try {
        if (!item.title) {
          skipped++;
          errors.push('Skipped: Missing title');
          continue;
        }

        const policy = this.policyRepository.create({
          ...item,
          status: item.status || PolicyStatus.DRAFT,
          review_frequency: item.review_frequency || ReviewFrequency.ANNUAL,
          created_by: userId,
        });

        await this.policyRepository.save(policy);
        created++;
      } catch (error) {
        skipped++;
        errors.push(`Error importing "${item.title || 'Unknown'}": ${error.message}`);
      }
    }

    return { created, skipped, errors };
  }

  async importControls(data: any[], userId: string) {
    let created = 0;
    let skipped = 0;
    const errors: string[] = [];

    for (const item of data) {
      try {
        if (!item.title || !item.control_identifier) {
          skipped++;
          errors.push(`Skipped: Missing title or identifier for "${item.title || 'Unknown'}"`);
          continue;
        }

        const control = this.controlRepository.create({
          ...item,
          status: item.status || ControlStatus.DRAFT,
          implementation_status: item.implementation_status || ImplementationStatus.NOT_IMPLEMENTED,
          created_by: userId,
        });

        await this.controlRepository.save(control);
        created++;
      } catch (error) {
        skipped++;
        errors.push(`Error importing "${item.control_identifier || 'Unknown'}": ${error.message}`);
      }
    }

    return { created, skipped, errors };
  }

  async exportEntities(type: 'policies' | 'controls' | 'influencers') {
    let data = [];
    switch (type) {
      case 'policies':
        data = await this.policyRepository.find({ where: { deleted_at: IsNull() } });
        break;
      case 'controls':
        data = await this.controlRepository.find({ where: { deleted_at: IsNull() } });
        break;
      case 'influencers':
        data = await this.influencerRepository.find({ where: { deleted_at: IsNull() } });
        break;
    }
    return data;
  }
}


