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
exports.AssetAuditService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const asset_audit_log_entity_1 = require("../entities/asset-audit-log.entity");
let AssetAuditService = class AssetAuditService {
    constructor(auditLogRepository) {
        this.auditLogRepository = auditLogRepository;
    }
    async createLog(logData) {
        const log = this.auditLogRepository.create(logData);
        return this.auditLogRepository.save(log);
    }
    async logCreate(assetType, assetId, userId, changeReason) {
        await this.createLog({
            assetType,
            assetId,
            action: asset_audit_log_entity_1.AuditAction.CREATE,
            changedById: userId,
            changeReason,
        });
    }
    async logUpdate(assetType, assetId, changes, userId, changeReason) {
        const logs = Object.entries(changes).map(([fieldName, { old, new: newValue }]) => this.createLog({
            assetType,
            assetId,
            action: asset_audit_log_entity_1.AuditAction.UPDATE,
            fieldName,
            oldValue: this.serializeValue(old),
            newValue: this.serializeValue(newValue),
            changedById: userId,
            changeReason,
        }));
        await Promise.all(logs);
    }
    async logDelete(assetType, assetId, userId, changeReason) {
        await this.createLog({
            assetType,
            assetId,
            action: asset_audit_log_entity_1.AuditAction.DELETE,
            changedById: userId,
            changeReason,
        });
    }
    async getAuditLogs(assetType, assetId, query) {
        const page = (query === null || query === void 0 ? void 0 : query.page) || 1;
        const limit = (query === null || query === void 0 ? void 0 : query.limit) || 50;
        const skip = (page - 1) * limit;
        const queryBuilder = this.auditLogRepository
            .createQueryBuilder('log')
            .leftJoinAndSelect('log.changedBy', 'changedBy')
            .where('log.assetType = :assetType', { assetType })
            .andWhere('log.assetId = :assetId', { assetId });
        if ((query === null || query === void 0 ? void 0 : query.from) && (query === null || query === void 0 ? void 0 : query.to)) {
            const fromDate = typeof query.from === 'string' ? new Date(query.from) : query.from;
            const toDate = typeof query.to === 'string' ? new Date(query.to) : query.to;
            queryBuilder.andWhere('log.createdAt BETWEEN :from AND :to', {
                from: fromDate,
                to: toDate,
            });
        }
        else if (query === null || query === void 0 ? void 0 : query.from) {
            const fromDate = typeof query.from === 'string' ? new Date(query.from) : query.from;
            queryBuilder.andWhere('log.createdAt >= :from', { from: fromDate });
        }
        else if (query === null || query === void 0 ? void 0 : query.to) {
            const toDate = typeof query.to === 'string' ? new Date(query.to) : query.to;
            queryBuilder.andWhere('log.createdAt <= :to', { to: toDate });
        }
        if (query === null || query === void 0 ? void 0 : query.userId) {
            queryBuilder.andWhere('log.changedById = :userId', { userId: query.userId });
        }
        if (query === null || query === void 0 ? void 0 : query.action) {
            queryBuilder.andWhere('log.action = :action', { action: query.action });
        }
        const total = await queryBuilder.getCount();
        const logs = await queryBuilder
            .orderBy('log.createdAt', 'DESC')
            .skip(skip)
            .take(limit)
            .getMany();
        return {
            data: logs,
            total,
            page,
            limit,
        };
    }
    serializeValue(value) {
        if (value === null || value === undefined) {
            return '';
        }
        if (typeof value === 'object') {
            return JSON.stringify(value);
        }
        return String(value);
    }
};
exports.AssetAuditService = AssetAuditService;
exports.AssetAuditService = AssetAuditService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(asset_audit_log_entity_1.AssetAuditLog)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], AssetAuditService);
//# sourceMappingURL=asset-audit.service.js.map