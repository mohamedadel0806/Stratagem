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
Object.defineProperty(exports, "__esModule", { value: true });
exports.IntegrationService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const integration_config_entity_1 = require("../entities/integration-config.entity");
const integration_sync_log_entity_1 = require("../entities/integration-sync-log.entity");
const physical_asset_service_1 = require("./physical-asset.service");
let IntegrationService = class IntegrationService {
    constructor(integrationConfigRepository, syncLogRepository, physicalAssetService) {
        this.integrationConfigRepository = integrationConfigRepository;
        this.syncLogRepository = syncLogRepository;
        this.physicalAssetService = physicalAssetService;
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
                    if (existing) {
                        skippedRecords++;
                        continue;
                    }
                    if (config.integrationType === integration_config_entity_1.IntegrationType.CMDB || config.integrationType === integration_config_entity_1.IntegrationType.ASSET_MANAGEMENT_SYSTEM) {
                        await this.physicalAssetService.create(mappedData, config.createdById);
                        successfulSyncs++;
                    }
                }
                catch (error) {
                    failedSyncs++;
                    console.error(`Failed to sync record:`, error);
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
            await this.integrationConfigRepository.save(config);
            return this.syncLogRepository.save(savedLog);
        }
        catch (error) {
            savedLog.status = integration_sync_log_entity_1.SyncStatus.FAILED;
            savedLog.errorMessage = error.message;
            savedLog.completedAt = new Date();
            config.lastSyncError = error.message;
            await this.integrationConfigRepository.save(config);
            await this.syncLogRepository.save(savedLog);
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
        try {
            return null;
        }
        catch (_a) {
            return null;
        }
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
};
exports.IntegrationService = IntegrationService;
exports.IntegrationService = IntegrationService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(integration_config_entity_1.IntegrationConfig)),
    __param(1, (0, typeorm_1.InjectRepository)(integration_sync_log_entity_1.IntegrationSyncLog)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        physical_asset_service_1.PhysicalAssetService])
], IntegrationService);
//# sourceMappingURL=integration.service.js.map