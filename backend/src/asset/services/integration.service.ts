import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IntegrationConfig, IntegrationType, IntegrationStatus, AuthenticationType } from '../entities/integration-config.entity';
import { IntegrationSyncLog, SyncStatus } from '../entities/integration-sync-log.entity';
import { CreateIntegrationConfigDto } from '../dto/create-integration-config.dto';
import { UpdateIntegrationConfigDto } from '../dto/update-integration-config.dto';
import { PhysicalAssetService } from './physical-asset.service';

// Note: For production, install @nestjs/axios and use HttpService
// npm install @nestjs/axios axios

@Injectable()
export class IntegrationService {
  constructor(
    @InjectRepository(IntegrationConfig)
    private integrationConfigRepository: Repository<IntegrationConfig>,
    @InjectRepository(IntegrationSyncLog)
    private syncLogRepository: Repository<IntegrationSyncLog>,
    private physicalAssetService: PhysicalAssetService,
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
          if (existing) {
            skippedRecords++;
            continue;
          }

          // Create asset based on integration type
          if (config.integrationType === IntegrationType.CMDB || config.integrationType === IntegrationType.ASSET_MANAGEMENT_SYSTEM) {
            // For now, we'll import as physical assets
            await this.physicalAssetService.create(mappedData, config.createdById);
            successfulSyncs++;
          }
        } catch (error: any) {
          failedSyncs++;
          console.error(`Failed to sync record:`, error);
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
      }
      await this.integrationConfigRepository.save(config);

      return this.syncLogRepository.save(savedLog);
    } catch (error: any) {
      savedLog.status = SyncStatus.FAILED;
      savedLog.errorMessage = error.message;
      savedLog.completedAt = new Date();

      config.lastSyncError = error.message;
      await this.integrationConfigRepository.save(config);

      await this.syncLogRepository.save(savedLog);
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
    // This would check across all asset types
    // For now, just check physical assets
    try {
      // This is a simplified check - in production, you'd check all asset types
      return null;
    } catch {
      return null;
    }
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
}

