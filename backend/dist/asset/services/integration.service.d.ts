import { Repository } from 'typeorm';
import { IntegrationConfig } from '../entities/integration-config.entity';
import { IntegrationSyncLog } from '../entities/integration-sync-log.entity';
import { CreateIntegrationConfigDto } from '../dto/create-integration-config.dto';
import { UpdateIntegrationConfigDto } from '../dto/update-integration-config.dto';
import { PhysicalAssetService } from './physical-asset.service';
import { NotificationService } from '../../common/services/notification.service';
export declare class IntegrationService {
    private integrationConfigRepository;
    private syncLogRepository;
    private physicalAssetService;
    private notificationService;
    private readonly logger;
    constructor(integrationConfigRepository: Repository<IntegrationConfig>, syncLogRepository: Repository<IntegrationSyncLog>, physicalAssetService: PhysicalAssetService, notificationService: NotificationService);
    createConfig(dto: CreateIntegrationConfigDto, userId: string): Promise<IntegrationConfig>;
    findAll(): Promise<IntegrationConfig[]>;
    findOne(id: string): Promise<IntegrationConfig>;
    update(id: string, dto: UpdateIntegrationConfigDto): Promise<IntegrationConfig>;
    delete(id: string): Promise<void>;
    testConnection(id: string): Promise<{
        success: boolean;
        message: string;
    }>;
    sync(id: string): Promise<IntegrationSyncLog>;
    getSyncHistory(integrationId: string, limit?: number): Promise<IntegrationSyncLog[]>;
    private buildAuthHeaders;
    private mapFields;
    private findAssetByUniqueIdentifier;
    private mergeAssetData;
    private calculateNextSync;
    handleWebhookPayload(id: string, payload: any): Promise<IntegrationSyncLog>;
    runScheduledSyncs(): Promise<void>;
}
