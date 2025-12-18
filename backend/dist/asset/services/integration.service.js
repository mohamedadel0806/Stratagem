"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var IntegrationService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.IntegrationService = void 0;
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const integration_config_entity_1 = require("../entities/integration-config.entity");
const integration_sync_log_entity_1 = require("../entities/integration-sync-log.entity");
const physical_asset_service_1 = require("./physical-asset.service");
const notification_service_1 = require("../../common/services/notification.service");
const notification_entity_1 = require("../../common/entities/notification.entity");
let IntegrationService = IntegrationService_1 = class IntegrationService {
    constructor(integrationConfigRepository, syncLogRepository, physicalAssetService, notificationService) {
        this.integrationConfigRepository = integrationConfigRepository;
        this.syncLogRepository = syncLogRepository;
        this.physicalAssetService = physicalAssetService;
        this.notificationService = notificationService;
        this.logger = new common_1.Logger(IntegrationService_1.name);
    }
    async createConfig(dto, userId) {
        const config = this.integrationConfigRepository.create(Object.assign(Object.assign({}, dto), { createdById: userId, status: integration_config_entity_1.IntegrationStatus.INACTIVE }));
        return this.integrationConfigRepository.save(config);
    }
    async findAll() {
        return this.integrationConfigRepository.find({
            relations: ['createdBy'],
            order: { createdAt: 'DESC' },
        });
    }
    async findOne(id) {
        const config = await this.integrationConfigRepository.findOne({
            where: { id },
            relations: ['createdBy'],
        });
        if (!config) {
            throw new common_1.NotFoundException(`Integration config with ID ${id} not found`);
        }
        return config;
    }
    async update(id, dto) {
        const config = await this.findOne(id);
        Object.assign(config, dto);
        return this.integrationConfigRepository.save(config);
    }
    async delete(id) {
        const config = await this.findOne(id);
        await this.integrationConfigRepository.remove(config);
    }
    async testConnection(id) {
        const config = await this.findOne(id);
        try {
            const headers = this.buildAuthHeaders(config);
            const response = await fetch(config.endpointUrl, {
                method: 'GET',
                headers,
                signal: AbortSignal.timeout(30000),
            });
            return {
                success: response.ok,
                message: response.ok ? 'Connection successful' : `Connection failed: ${response.statusText}`,
            };
        }
        catch (error) {
            return {
                success: false,
                message: error.message || 'Connection failed',
            };
        }
    }
    async sync(id) {
        const config = await this.findOne(id);
        if (config.status !== integration_config_entity_1.IntegrationStatus.ACTIVE) {
            throw new common_1.BadRequestException('Integration is not active');
        }
        const syncLog = this.syncLogRepository.create({
            integrationConfigId: config.id,
            status: integration_sync_log_entity_1.SyncStatus.RUNNING,
            startedAt: new Date(),
        });
        const savedLog = await this.syncLogRepository.save(syncLog);
        try {
            const headers = this.buildAuthHeaders(config);
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
            for (const record of externalData) {
                try {
                    const mappedData = this.mapFields(record, config.fieldMapping || {});
                    const existing = await this.findAssetByUniqueIdentifier(mappedData.uniqueIdentifier);
                    const conflictStrategy = config.conflictResolutionStrategy || integration_config_entity_1.ConflictResolutionStrategy.SKIP;
                    if (existing) {
                        if (conflictStrategy === integration_config_entity_1.ConflictResolutionStrategy.SKIP) {
                            skippedRecords++;
                            continue;
                        }
                        else if (conflictStrategy === integration_config_entity_1.ConflictResolutionStrategy.OVERWRITE) {
                            await this.physicalAssetService.update(existing.id, mappedData, config.createdById);
                            successfulSyncs++;
                            continue;
                        }
                        else if (conflictStrategy === integration_config_entity_1.ConflictResolutionStrategy.MERGE) {
                            const mergedData = this.mergeAssetData(existing, mappedData);
                            await this.physicalAssetService.update(existing.id, mergedData, config.createdById);
                            successfulSyncs++;
                            continue;
                        }
                    }
                    if (config.integrationType === integration_config_entity_1.IntegrationType.CMDB ||
                        config.integrationType === integration_config_entity_1.IntegrationType.ASSET_MANAGEMENT_SYSTEM) {
                        await this.physicalAssetService.create(mappedData, config.createdById);
                        successfulSyncs++;
                    }
                }
                catch (error) {
                    failedSyncs++;
                    this.logger.error(`Failed to sync record for integration ${config.id}`, (error === null || error === void 0 ? void 0 : error.stack) || (error === null || error === void 0 ? void 0 : error.message));
                }
            }
            savedLog.status = failedSyncs === 0 ? integration_sync_log_entity_1.SyncStatus.COMPLETED : integration_sync_log_entity_1.SyncStatus.PARTIAL;
            savedLog.totalRecords = externalData.length;
            savedLog.successfulSyncs = successfulSyncs;
            savedLog.failedSyncs = failedSyncs;
            savedLog.skippedRecords = skippedRecords;
            savedLog.completedAt = new Date();
            config.lastSyncAt = new Date();
            config.lastSyncError = null;
            if (config.syncInterval) {
                config.nextSyncAt = this.calculateNextSync(config.syncInterval);
            }
            else {
                config.nextSyncAt = null;
            }
            await this.integrationConfigRepository.save(config);
            return this.syncLogRepository.save(savedLog);
        }
        catch (error) {
            savedLog.status = integration_sync_log_entity_1.SyncStatus.FAILED;
            savedLog.errorMessage = error.message;
            savedLog.completedAt = new Date();
            config.lastSyncError = error.message;
            if (config.syncInterval) {
                const backoffMinutes = 15;
                const now = new Date();
                config.nextSyncAt = new Date(now.getTime() + backoffMinutes * 60 * 1000);
            }
            await this.integrationConfigRepository.save(config);
            await this.syncLogRepository.save(savedLog);
            try {
                await this.notificationService.create({
                    userId: config.createdById,
                    type: notification_entity_1.NotificationType.GENERAL,
                    priority: notification_entity_1.NotificationPriority.HIGH,
                    title: `Integration sync failed: ${config.name}`,
                    message: `The integration "${config.name}" (type: ${config.integrationType}) failed to sync: ${(error === null || error === void 0 ? void 0 : error.message) || 'Unknown error'}`,
                    entityType: 'integration',
                    entityId: config.id,
                    actionUrl: '/dashboard/integrations',
                    metadata: {
                        integrationId: config.id,
                        integrationName: config.name,
                        integrationType: config.integrationType,
                    },
                });
            }
            catch (notifyError) {
                this.logger.error(`Failed to create admin notification for integration ${config.id}: ${(notifyError === null || notifyError === void 0 ? void 0 : notifyError.message) || 'Unknown error'}`, notifyError === null || notifyError === void 0 ? void 0 : notifyError.stack);
            }
            this.logger.error(`Sync failed for integration ${config.id}: ${(error === null || error === void 0 ? void 0 : error.message) || 'Unknown error'}`, error === null || error === void 0 ? void 0 : error.stack);
            throw error;
        }
    }
    async getSyncHistory(integrationId, limit = 20) {
        return this.syncLogRepository.find({
            where: { integrationConfigId: integrationId },
            order: { completedAt: 'DESC' },
            take: limit,
            relations: ['integrationConfig'],
        });
    }
    buildAuthHeaders(config) {
        const headers = {
            'Content-Type': 'application/json',
        };
        switch (config.authenticationType) {
            case integration_config_entity_1.AuthenticationType.API_KEY:
                headers['X-API-Key'] = config.apiKey || '';
                break;
            case integration_config_entity_1.AuthenticationType.BEARER_TOKEN:
                headers['Authorization'] = `Bearer ${config.bearerToken}`;
                break;
            case integration_config_entity_1.AuthenticationType.BASIC_AUTH:
                const credentials = Buffer.from(`${config.username}:${config.password}`).toString('base64');
                headers['Authorization'] = `Basic ${credentials}`;
                break;
        }
        return headers;
    }
    mapFields(externalRecord, fieldMapping) {
        const mapped = {};
        for (const [externalField, internalField] of Object.entries(fieldMapping)) {
            if (externalRecord[externalField] !== undefined) {
                mapped[internalField] = externalRecord[externalField];
            }
        }
        return mapped;
    }
    async findAssetByUniqueIdentifier(identifier) {
        var _a;
        if (!identifier) {
            return null;
        }
        try {
            const existing = await ((_a = this.physicalAssetService['assetRepository']) === null || _a === void 0 ? void 0 : _a.findOne({
                where: { uniqueIdentifier: identifier },
            }));
            return existing || null;
        }
        catch (error) {
            this.logger.warn(`Duplicate check failed for identifier "${identifier}": ${(error === null || error === void 0 ? void 0 : error.message) || 'Unknown error'}`);
            return null;
        }
    }
    mergeAssetData(existing, newData) {
        const merged = {};
        for (const key in newData) {
            if (newData[key] !== null && newData[key] !== undefined && newData[key] !== '') {
                merged[key] = newData[key];
            }
            else if (existing[key] !== null && existing[key] !== undefined) {
                merged[key] = existing[key];
            }
        }
        for (const key in existing) {
            if (!(key in merged) && existing[key] !== null && existing[key] !== undefined) {
                merged[key] = existing[key];
            }
        }
        return merged;
    }
    calculateNextSync(interval) {
        const now = new Date();
        const match = interval.match(/^(\d+)([hdm])$/);
        if (!match) {
            return new Date(now.getTime() + 24 * 60 * 60 * 1000);
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
    async handleWebhookPayload(id, payload) {
        const config = await this.findOne(id);
        if (config.integrationType !== integration_config_entity_1.IntegrationType.WEBHOOK && config.integrationType !== integration_config_entity_1.IntegrationType.ASSET_MANAGEMENT_SYSTEM) {
            throw new common_1.BadRequestException('Integration is not configured for webhook-based sync');
        }
        const syncLog = this.syncLogRepository.create({
            integrationConfigId: config.id,
            status: integration_sync_log_entity_1.SyncStatus.RUNNING,
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
                    const conflictStrategy = config.conflictResolutionStrategy || integration_config_entity_1.ConflictResolutionStrategy.SKIP;
                    if (existing) {
                        if (conflictStrategy === integration_config_entity_1.ConflictResolutionStrategy.SKIP) {
                            skippedRecords++;
                            continue;
                        }
                        else if (conflictStrategy === integration_config_entity_1.ConflictResolutionStrategy.OVERWRITE) {
                            await this.physicalAssetService.update(existing.id, mappedData, config.createdById);
                            successfulSyncs++;
                            continue;
                        }
                        else if (conflictStrategy === integration_config_entity_1.ConflictResolutionStrategy.MERGE) {
                            const mergedData = this.mergeAssetData(existing, mappedData);
                            await this.physicalAssetService.update(existing.id, mergedData, config.createdById);
                            successfulSyncs++;
                            continue;
                        }
                    }
                    await this.physicalAssetService.create(mappedData, config.createdById);
                    successfulSyncs++;
                }
                catch (error) {
                    failedSyncs++;
                    this.logger.error(`Failed to process webhook record for integration ${config.id}`, (error === null || error === void 0 ? void 0 : error.stack) || (error === null || error === void 0 ? void 0 : error.message));
                }
            }
            savedLog.status = failedSyncs === 0 ? integration_sync_log_entity_1.SyncStatus.COMPLETED : integration_sync_log_entity_1.SyncStatus.PARTIAL;
            savedLog.totalRecords = externalData.length;
            savedLog.successfulSyncs = successfulSyncs;
            savedLog.failedSyncs = failedSyncs;
            savedLog.skippedRecords = skippedRecords;
            savedLog.completedAt = new Date();
            return this.syncLogRepository.save(savedLog);
        }
        catch (error) {
            savedLog.status = integration_sync_log_entity_1.SyncStatus.FAILED;
            savedLog.errorMessage = error.message;
            savedLog.completedAt = new Date();
            await this.syncLogRepository.save(savedLog);
            this.logger.error(`Webhook sync failed for integration ${config.id}: ${(error === null || error === void 0 ? void 0 : error.message) || 'Unknown error'}`, error === null || error === void 0 ? void 0 : error.stack);
            throw error;
        }
    }
    async runScheduledSyncs() {
        const now = new Date();
        const dueConfigs = await this.integrationConfigRepository.find({
            where: {
                status: integration_config_entity_1.IntegrationStatus.ACTIVE,
                nextSyncAt: { $lte: now },
            },
        });
        if (!dueConfigs.length) {
            return;
        }
        for (const config of dueConfigs) {
            try {
                this.logger.log(`Running scheduled sync for integration ${config.id} (${config.name})`);
                await this.sync(config.id);
            }
            catch (error) {
                this.logger.error(`Scheduled sync failed for integration ${config.id}: ${(error === null || error === void 0 ? void 0 : error.message) || 'Unknown error'}`, error === null || error === void 0 ? void 0 : error.stack);
            }
        }
    }
};
exports.IntegrationService = IntegrationService;
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_5_MINUTES),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], IntegrationService.prototype, "runScheduledSyncs", null);
exports.IntegrationService = IntegrationService = IntegrationService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(integration_config_entity_1.IntegrationConfig)),
    __param(1, (0, typeorm_1.InjectRepository)(integration_sync_log_entity_1.IntegrationSyncLog)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        physical_asset_service_1.PhysicalAssetService,
        notification_service_1.NotificationService])
], IntegrationService);
//# sourceMappingURL=integration.service.js.map