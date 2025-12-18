import { Injectable, BadRequestException, NotFoundException, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IntegrationConfig, IntegrationType, IntegrationStatus, AuthenticationType, ConflictResolutionStrategy } from '../entities/integration-config.entity';
import { IntegrationSyncLog, SyncStatus } from '../entities/integration-sync-log.entity';
import { CreateIntegrationConfigDto } from '../dto/create-integration-config.dto';
import { UpdateIntegrationConfigDto } from '../dto/update-integration-config.dto';
import { PhysicalAssetService } from './physical-asset.service';
import { NotificationService } from '../../common/services/notification.service';
import { NotificationPriority, NotificationType } from '../../common/entities/notification.entity';

// Note: For production, install @nestjs/axios and use HttpService
// npm install @nestjs/axios axios

@Injectable()
export class IntegrationService {
  private readonly logger = new Logger(IntegrationService.name);

  constructor(
    @InjectRepository(IntegrationConfig)
    private integrationConfigRepository: Repository<IntegrationConfig>,
    @InjectRepository(IntegrationSyncLog)
    private syncLogRepository: Repository<IntegrationSyncLog>,
    private physicalAssetService: PhysicalAssetService,
    private notificationService: NotificationService,
  ) {}

  async createConfig(dto: CreateIntegrationConfigDto, userId: string): Promise<IntegrationConfig> {
    const config = this.integrationConfigRepository.create({
      ...dto,
      createdById: userId,
      status: IntegrationStatus.INACTIVE,
    });

    return this.integrationConfigRepository.save(config);
  }

  async findAll(): Promise<IntegrationConfig[]> {
    return this.integrationConfigRepository.find({
      relations: ['createdBy'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<IntegrationConfig> {
    const config = await this.integrationConfigRepository.findOne({
      where: { id },
      relations: ['createdBy'],
    });

    if (!config) {
      throw new NotFoundException(`Integration config with ID ${id} not found`);
    }

    return config;
  }

  async update(id: string, dto: UpdateIntegrationConfigDto): Promise<IntegrationConfig> {
    const config = await this.findOne(id);
    Object.assign(config, dto);
    return this.integrationConfigRepository.save(config);
  }

  async delete(id: string): Promise<void> {
    const config = await this.findOne(id);
    await this.integrationConfigRepository.remove(config);
  }

  async testConnection(id: string): Promise<{ success: boolean; message: string }> {
    const config = await this.findOne(id);

    try {
      const headers = this.buildAuthHeaders(config);
      // Using native fetch (Node 18+) - for production, use @nestjs/axios HttpService
      const response = await fetch(config.endpointUrl, {
        method: 'GET',
        headers,
        signal: AbortSignal.timeout(30000),
      });

      return {
        success: response.ok,
        message: response.ok ? 'Connection successful' : `Connection failed: ${response.statusText}`,
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || 'Connection failed',
      };
    }
  }

  async sync(id: string): Promise<IntegrationSyncLog> {
    const config = await this.findOne(id);

    if (config.status !== IntegrationStatus.ACTIVE) {
      throw new BadRequestException('Integration is not active');
    }

    // Create sync log
    const syncLog = this.syncLogRepository.create({
      integrationConfigId: config.id,
      status: SyncStatus.RUNNING,
      startedAt: new Date(),
    });
    const savedLog = await this.syncLogRepository.save(syncLog);

    try {
      // Fetch data from external system
      const headers = this.buildAuthHeaders(config);
      // Using native fetch (Node 18+) - for production, use @nestjs/axios HttpService
      const response = await fetch(config.endpointUrl, {
        method: 'GET',
        headers,
        signal: AbortSignal.timeout(30000),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const externalData = Array.isArray(data) ? data : [data];

      let successfulSyncs = 0;
      let failedSyncs = 0;
      let skippedRecords = 0;

      // Process each record
      for (const record of externalData) {
        try {
          // Map external fields to internal fields
          const mappedData = this.mapFields(record, config.fieldMapping || {});

          // Check for duplicates (by unique identifier)
          const existing = await this.findAssetByUniqueIdentifier(mappedData.uniqueIdentifier);
          const conflictStrategy = config.conflictResolutionStrategy || ConflictResolutionStrategy.SKIP;

          if (existing) {
            if (conflictStrategy === ConflictResolutionStrategy.SKIP) {
              skippedRecords++;
              continue;
            } else if (conflictStrategy === ConflictResolutionStrategy.OVERWRITE) {
              // Update existing asset with new data
              await this.physicalAssetService.update(existing.id, mappedData, config.createdById);
              successfulSyncs++;
              continue;
            } else if (conflictStrategy === ConflictResolutionStrategy.MERGE) {
              // Merge: prefer non-null values from new data, keep existing values where new data is null
              const mergedData = this.mergeAssetData(existing, mappedData);
              await this.physicalAssetService.update(existing.id, mergedData, config.createdById);
              successfulSyncs++;
              continue;
            }
          }

          // Create asset based on integration type
          if (
            config.integrationType === IntegrationType.CMDB ||
            config.integrationType === IntegrationType.ASSET_MANAGEMENT_SYSTEM
          ) {
            // For now, we'll import as physical assets
            await this.physicalAssetService.create(mappedData, config.createdById);
            successfulSyncs++;
          }
        } catch (error: any) {
          failedSyncs++;
          this.logger.error(`Failed to sync record for integration ${config.id}`, error?.stack || error?.message);
        }
      }

      // Update sync log
      savedLog.status = failedSyncs === 0 ? SyncStatus.COMPLETED : SyncStatus.PARTIAL;
      savedLog.totalRecords = externalData.length;
      savedLog.successfulSyncs = successfulSyncs;
      savedLog.failedSyncs = failedSyncs;
      savedLog.skippedRecords = skippedRecords;
      savedLog.completedAt = new Date();

      // Update config
      config.lastSyncAt = new Date();
      config.lastSyncError = null;
      if (config.syncInterval) {
        config.nextSyncAt = this.calculateNextSync(config.syncInterval);
      } else {
        config.nextSyncAt = null;
      }
      await this.integrationConfigRepository.save(config);

      return this.syncLogRepository.save(savedLog);
    } catch (error: any) {
      savedLog.status = SyncStatus.FAILED;
      savedLog.errorMessage = error.message;
      savedLog.completedAt = new Date();

      config.lastSyncError = error.message;
      // Simple retry/backoff: if syncInterval is set, schedule nextSyncAt sooner (e.g., 15 minutes)
      if (config.syncInterval) {
        const backoffMinutes = 15;
        const now = new Date();
        config.nextSyncAt = new Date(now.getTime() + backoffMinutes * 60 * 1000);
      }
      await this.integrationConfigRepository.save(config);

      await this.syncLogRepository.save(savedLog);

      // Admin notifications for sync failures: create a high-priority GENERAL notification
      // for the integration owner (createdById) so admins can see failures in the UI.
      try {
        await this.notificationService.create({
          userId: config.createdById,
          type: NotificationType.GENERAL,
          priority: NotificationPriority.HIGH,
          title: `Integration sync failed: ${config.name}`,
          message: `The integration "${config.name}" (type: ${config.integrationType}) failed to sync: ${
            error?.message || 'Unknown error'
          }`,
          entityType: 'integration',
          entityId: config.id,
          actionUrl: '/dashboard/integrations',
          metadata: {
            integrationId: config.id,
            integrationName: config.name,
            integrationType: config.integrationType,
          },
        });
      } catch (notifyError: any) {
        this.logger.error(
          `Failed to create admin notification for integration ${config.id}: ${
            notifyError?.message || 'Unknown error'
          }`,
          notifyError?.stack,
        );
      }

      this.logger.error(
        `Sync failed for integration ${config.id}: ${error?.message || 'Unknown error'}`,
        error?.stack,
      );
      throw error;
    }
  }

  async getSyncHistory(integrationId: string, limit: number = 20): Promise<IntegrationSyncLog[]> {
    return this.syncLogRepository.find({
      where: { integrationConfigId: integrationId },
      order: { completedAt: 'DESC' },
      take: limit,
      relations: ['integrationConfig'],
    });
  }

  private buildAuthHeaders(config: IntegrationConfig): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    switch (config.authenticationType) {
      case AuthenticationType.API_KEY:
        headers['X-API-Key'] = config.apiKey || '';
        break;
      case AuthenticationType.BEARER_TOKEN:
        headers['Authorization'] = `Bearer ${config.bearerToken}`;
        break;
      case AuthenticationType.BASIC_AUTH:
        const credentials = Buffer.from(`${config.username}:${config.password}`).toString('base64');
        headers['Authorization'] = `Basic ${credentials}`;
        break;
    }

    return headers;
  }

  private mapFields(externalRecord: Record<string, any>, fieldMapping: Record<string, string>): any {
    const mapped: any = {};

    for (const [externalField, internalField] of Object.entries(fieldMapping)) {
      if (externalRecord[externalField] !== undefined) {
        mapped[internalField] = externalRecord[externalField];
      }
    }

    return mapped;
  }

  private async findAssetByUniqueIdentifier(identifier: string): Promise<any> {
    if (!identifier) {
      return null;
    }

    // TODO: Extend this to check other asset types as needed
    try {
      const existing = await this.physicalAssetService['assetRepository']?.findOne({
        where: { uniqueIdentifier: identifier },
      });
      return existing || null;
    } catch (error) {
      this.logger.warn(
        `Duplicate check failed for identifier "${identifier}": ${error?.message || 'Unknown error'}`,
      );
      return null;
    }
  }

  private mergeAssetData(existing: any, newData: any): any {
    const merged: any = {};
    // Merge strategy: prefer new non-null values, keep existing values where new is null/undefined
    for (const key in newData) {
      if (newData[key] !== null && newData[key] !== undefined && newData[key] !== '') {
        merged[key] = newData[key];
      } else if (existing[key] !== null && existing[key] !== undefined) {
        merged[key] = existing[key];
      }
    }
    // Also include existing fields that aren't in newData
    for (const key in existing) {
      if (!(key in merged) && existing[key] !== null && existing[key] !== undefined) {
        merged[key] = existing[key];
      }
    }
    return merged;
  }

  private calculateNextSync(interval: string): Date {
    const now = new Date();
    const match = interval.match(/^(\d+)([hdm])$/);
    if (!match) {
      return new Date(now.getTime() + 24 * 60 * 60 * 1000); // Default to 24h
    }

    const value = parseInt(match[1]);
    const unit = match[2];

    let milliseconds = 0;
    switch (unit) {
      case 'h':
        milliseconds = value * 60 * 60 * 1000;
        break;
      case 'd':
        milliseconds = value * 24 * 60 * 60 * 1000;
        break;
      case 'm':
        milliseconds = value * 60 * 1000;
        break;
    }

    return new Date(now.getTime() + milliseconds);
  }

  /**
   * Handle webhook-based integrations where the external system pushes
   * asset data to our API instead of us polling their REST API.
   *
   * This reuses the same mapping, duplicate prevention, and logging patterns
   * as the regular sync method, but operates directly on the webhook payload.
   */
  async handleWebhookPayload(id: string, payload: any): Promise<IntegrationSyncLog> {
    const config = await this.findOne(id);

    if (config.integrationType !== IntegrationType.WEBHOOK && config.integrationType !== IntegrationType.ASSET_MANAGEMENT_SYSTEM) {
      throw new BadRequestException('Integration is not configured for webhook-based sync');
    }

    // Create sync log entry for this webhook invocation
    const syncLog = this.syncLogRepository.create({
      integrationConfigId: config.id,
      status: SyncStatus.RUNNING,
      startedAt: new Date(),
      syncDetails: { source: 'webhook' },
    });
    const savedLog = await this.syncLogRepository.save(syncLog);

    try {
      const externalData = Array.isArray(payload) ? payload : [payload];

      let successfulSyncs = 0;
      let failedSyncs = 0;
      let skippedRecords = 0;

      for (const record of externalData) {
        try {
          const mappedData = this.mapFields(record, config.fieldMapping || {});

          const existing = await this.findAssetByUniqueIdentifier(mappedData.uniqueIdentifier);
          const conflictStrategy = config.conflictResolutionStrategy || ConflictResolutionStrategy.SKIP;

          if (existing) {
            if (conflictStrategy === ConflictResolutionStrategy.SKIP) {
              skippedRecords++;
              continue;
            } else if (conflictStrategy === ConflictResolutionStrategy.OVERWRITE) {
              await this.physicalAssetService.update(existing.id, mappedData, config.createdById);
              successfulSyncs++;
              continue;
            } else if (conflictStrategy === ConflictResolutionStrategy.MERGE) {
              const mergedData = this.mergeAssetData(existing, mappedData);
              await this.physicalAssetService.update(existing.id, mergedData, config.createdById);
              successfulSyncs++;
              continue;
            }
          }

          await this.physicalAssetService.create(mappedData, config.createdById);
          successfulSyncs++;
        } catch (error: any) {
          failedSyncs++;
          this.logger.error(`Failed to process webhook record for integration ${config.id}`, error?.stack || error?.message);
        }
      }

      savedLog.status = failedSyncs === 0 ? SyncStatus.COMPLETED : SyncStatus.PARTIAL;
      savedLog.totalRecords = externalData.length;
      savedLog.successfulSyncs = successfulSyncs;
      savedLog.failedSyncs = failedSyncs;
      savedLog.skippedRecords = skippedRecords;
      savedLog.completedAt = new Date();

      return this.syncLogRepository.save(savedLog);
    } catch (error: any) {
      savedLog.status = SyncStatus.FAILED;
      savedLog.errorMessage = error.message;
      savedLog.completedAt = new Date();
      await this.syncLogRepository.save(savedLog);

      this.logger.error(
        `Webhook sync failed for integration ${config.id}: ${error?.message || 'Unknown error'}`,
        error?.stack,
      );
      throw error;
    }
  }

  /**
   * Scheduled task that periodically scans for active integrations
   * with nextSyncAt in the past and triggers sync for each.
   *
   * Uses a coarse cron (every 5 minutes) and relies on per-config
   * nextSyncAt to control actual frequency.
   */
  @Cron(CronExpression.EVERY_5_MINUTES)
  async runScheduledSyncs(): Promise<void> {
    const now = new Date();
    const dueConfigs = await this.integrationConfigRepository.find({
      where: {
        status: IntegrationStatus.ACTIVE,
        nextSyncAt: { $lte: now } as any, // TypeORM-compatible operator depending on driver
      } as any,
    });

    if (!dueConfigs.length) {
      return;
    }

    for (const config of dueConfigs) {
      try {
        this.logger.log(`Running scheduled sync for integration ${config.id} (${config.name})`);
        await this.sync(config.id);
      } catch (error: any) {
        this.logger.error(
          `Scheduled sync failed for integration ${config.id}: ${error?.message || 'Unknown error'}`,
          error?.stack,
        );
      }
    }
  }
}

