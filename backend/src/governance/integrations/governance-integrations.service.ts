import { Injectable, NotFoundException, Logger, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { GovernanceIntegrationHook, GovernanceIntegrationLog, HookAction } from './entities/integration-hook.entity';
import { CreateIntegrationHookDto } from './dto/create-hook.dto';
import { EvidenceService } from '../evidence/evidence.service';
import { FindingsService } from '../findings/findings.service';
import { UnifiedControlsService } from '../unified-controls/unified-controls.service';
import * as crypto from 'crypto';

@Injectable()
export class GovernanceIntegrationsService {
  private readonly logger = new Logger(GovernanceIntegrationsService.name);

  constructor(
    @InjectRepository(GovernanceIntegrationHook)
    private hookRepository: Repository<GovernanceIntegrationHook>,
    @InjectRepository(GovernanceIntegrationLog)
    private logRepository: Repository<GovernanceIntegrationLog>,
    private evidenceService: EvidenceService,
    private findingsService: FindingsService,
    private controlsService: UnifiedControlsService,
  ) {}

  async createHook(dto: CreateIntegrationHookDto, userId: string): Promise<GovernanceIntegrationHook> {
    const secretKey = crypto.randomBytes(32).toString('hex');
    const hook = this.hookRepository.create({
      ...dto,
      secretKey,
      created_by: userId,
    });
    return this.hookRepository.save(hook);
  }

  async findAll() {
    return this.hookRepository.find({
      where: { deleted_at: IsNull() },
      relations: ['creator'],
      order: { created_at: 'DESC' },
    });
  }

  async findOne(id: string) {
    const hook = await this.hookRepository.findOne({
      where: { id, deleted_at: IsNull() },
    });
    if (!hook) throw new NotFoundException('Integration hook not found');
    return hook;
  }

  async handleWebhook(secretKey: string, payload: any, ipAddress: string) {
    const hook = await this.hookRepository.findOne({
      where: { secretKey, isActive: true, deleted_at: IsNull() },
    });

    if (!hook) {
      throw new BadRequestException('Invalid or inactive webhook secret');
    }

    const log = this.logRepository.create({
      hook_id: hook.id,
      payload,
      ipAddress,
    });

    try {
      let result: any;
      switch (hook.action) {
        case HookAction.CREATE_EVIDENCE:
          result = await this.processEvidenceHook(hook, payload);
          break;
        case HookAction.CREATE_FINDING:
          result = await this.processFindingHook(hook, payload);
          break;
        default:
          throw new Error(`Unsupported action: ${hook.action}`);
      }

      log.status = 'success';
      log.result = result;
      await this.logRepository.save(log);
      return result;
    } catch (error) {
      log.status = 'failed';
      log.errorMessage = error.message;
      await this.logRepository.save(log);
      throw error;
    }
  }

  private async processEvidenceHook(hook: GovernanceIntegrationHook, payload: any) {
    // Map external payload to Evidence fields using hook.config.mapping
    const evidenceData: any = {
      title: this.mapField(hook, payload, 'title') || `External Evidence from ${hook.name}`,
      description: this.mapField(hook, payload, 'description'),
      evidence_type: this.mapField(hook, payload, 'type') || 'other',
      file_path: this.mapField(hook, payload, 'url') || 'N/A',
      status: 'approved',
      collection_date: new Date(),
    };

    return this.evidenceService.create(evidenceData, hook.created_by!);
  }

  private async processFindingHook(hook: GovernanceIntegrationHook, payload: any) {
    const findingData: any = {
      title: this.mapField(hook, payload, 'title') || `External Finding from ${hook.name}`,
      description: this.mapField(hook, payload, 'description'),
      severity: this.mapField(hook, payload, 'severity') || 'medium',
      status: 'open',
      finding_date: new Date(),
    };

    return this.findingsService.create(findingData, hook.created_by!);
  }

  private mapField(hook: GovernanceIntegrationHook, payload: any, targetField: string): any {
    const sourceField = hook.config?.mapping?.[targetField];
    if (!sourceField) return hook.config?.defaultValues?.[targetField];
    
    // Support nested access (e.g. "data.severity")
    return sourceField.split('.').reduce((obj, key) => obj?.[key], payload);
  }

  async getLogs(hookId: string) {
    return this.logRepository.find({
      where: { hook_id: hookId },
      order: { created_at: 'DESC' },
      take: 50,
    });
  }
}


