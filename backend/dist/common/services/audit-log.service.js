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
var AuditLogService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuditLogService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const audit_log_entity_1 = require("../entities/audit-log.entity");
let AuditLogService = AuditLogService_1 = class AuditLogService {
    constructor(auditLogRepository) {
        this.auditLogRepository = auditLogRepository;
        this.logger = new common_1.Logger(AuditLogService_1.name);
    }
    async log(dto) {
        try {
            const auditLog = this.auditLogRepository.create(Object.assign(Object.assign({}, dto), { timestamp: new Date() }));
            const saved = await this.auditLogRepository.save(auditLog);
            return saved;
        }
        catch (error) {
            this.logger.error(`Failed to create audit log: ${error.message}`, error.stack);
            throw error;
        }
    }
    async logBulk(dtos) {
        if (!dtos || dtos.length === 0)
            return;
        try {
            const auditLogs = dtos.map(dto => this.auditLogRepository.create(Object.assign(Object.assign({}, dto), { timestamp: new Date() })));
            await this.auditLogRepository.save(auditLogs);
        }
        catch (error) {
            this.logger.error(`Failed to create bulk audit logs: ${error.message}`, error.stack);
            throw error;
        }
    }
    async getEntityLogs(entityType, entityId, limit = 100) {
        return this.auditLogRepository
            .createQueryBuilder('audit')
            .where('audit.entityType = :entityType', { entityType })
            .andWhere('audit.entityId = :entityId', { entityId })
            .orderBy('audit.timestamp', 'DESC')
            .take(limit)
            .getMany();
    }
    async getUserLogs(userId, limit = 100) {
        return this.auditLogRepository
            .createQueryBuilder('audit')
            .where('audit.userId = :userId', { userId })
            .orderBy('audit.timestamp', 'DESC')
            .take(limit)
            .getMany();
    }
    async getActionLogs(action, limit = 100) {
        return this.auditLogRepository
            .createQueryBuilder('audit')
            .where('audit.action = :action', { action })
            .orderBy('audit.timestamp', 'DESC')
            .take(limit)
            .getMany();
    }
    async getLogsByDateRange(startDate, endDate, limit = 100) {
        return this.auditLogRepository
            .createQueryBuilder('audit')
            .where('audit.timestamp >= :startDate', { startDate })
            .andWhere('audit.timestamp <= :endDate', { endDate })
            .orderBy('audit.timestamp', 'DESC')
            .take(limit)
            .getMany();
    }
    async getEntityTrail(entityType, entityIds, limit = 100) {
        return this.auditLogRepository
            .createQueryBuilder('audit')
            .where('audit.entityType = :entityType', { entityType })
            .andWhere('audit.entityId IN (:...entityIds)', { entityIds })
            .orderBy('audit.timestamp', 'DESC')
            .take(limit)
            .getMany();
    }
    async getAllLogs(skip = 0, take = 50) {
        const [logs, total] = await this.auditLogRepository.findAndCount({
            order: { timestamp: 'DESC' },
            skip,
            take,
        });
        return { logs, total };
    }
    async search(query, limit = 100) {
        return this.auditLogRepository
            .createQueryBuilder('audit')
            .where('audit.action ILIKE :query', { query: `%${query}%` })
            .orWhere('audit.description ILIKE :query', { query: `%${query}%` })
            .orWhere('audit.entityType ILIKE :query', { query: `%${query}%` })
            .orderBy('audit.timestamp', 'DESC')
            .take(limit)
            .getMany();
    }
    async exportToCSV(entityType, entityId) {
        let query = this.auditLogRepository.createQueryBuilder('audit');
        if (entityType && entityId) {
            query = query
                .where('audit.entityType = :entityType', { entityType })
                .andWhere('audit.entityId = :entityId', { entityId });
        }
        const logs = await query.orderBy('audit.timestamp', 'DESC').getMany();
        const headers = ['Timestamp', 'User ID', 'Action', 'Entity Type', 'Entity ID', 'Changes', 'Description'];
        const rows = logs.map(log => [
            log.timestamp.toISOString(),
            log.userId || 'SYSTEM',
            log.action,
            log.entityType,
            log.entityId,
            JSON.stringify(log.changes || {}),
            log.description || '',
        ]);
        const escapeCsvValue = (value) => {
            if (value && (value.includes(',') || value.includes('"') || value.includes('\n'))) {
                return `"${value.replace(/"/g, '""')}"`;
            }
            return value;
        };
        const csvContent = [
            headers.join(','),
            ...rows.map(row => row.map(escapeCsvValue).join(',')),
        ].join('\n');
        return csvContent;
    }
    async cleanupOldLogs(daysToKeep = 90) {
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);
        const result = await this.auditLogRepository
            .createQueryBuilder()
            .delete()
            .where('timestamp < :cutoffDate', { cutoffDate })
            .execute();
        this.logger.log(`Cleaned up ${result.affected || 0} old audit logs (older than ${daysToKeep} days)`);
        return result.affected || 0;
    }
    async getSummary() {
        const totalLogs = await this.auditLogRepository.count();
        const [uniqueUsers, uniqueActions, uniqueEntities, oldest, newest] = await Promise.all([
            this.auditLogRepository
                .createQueryBuilder('audit')
                .select('COUNT(DISTINCT audit.userId)', 'count')
                .getRawOne(),
            this.auditLogRepository
                .createQueryBuilder('audit')
                .select('COUNT(DISTINCT audit.action)', 'count')
                .getRawOne(),
            this.auditLogRepository
                .createQueryBuilder('audit')
                .select('COUNT(DISTINCT audit.entityType)', 'count')
                .getRawOne(),
            this.auditLogRepository
                .createQueryBuilder('audit')
                .select('MIN(audit.timestamp)', 'timestamp')
                .getRawOne(),
            this.auditLogRepository
                .createQueryBuilder('audit')
                .select('MAX(audit.timestamp)', 'timestamp')
                .getRawOne(),
        ]);
        return {
            totalLogs,
            uniqueUsers: parseInt((uniqueUsers === null || uniqueUsers === void 0 ? void 0 : uniqueUsers.count) || '0'),
            uniqueActions: parseInt((uniqueActions === null || uniqueActions === void 0 ? void 0 : uniqueActions.count) || '0'),
            uniqueEntities: parseInt((uniqueEntities === null || uniqueEntities === void 0 ? void 0 : uniqueEntities.count) || '0'),
            oldestLog: oldest === null || oldest === void 0 ? void 0 : oldest.timestamp,
            newestLog: newest === null || newest === void 0 ? void 0 : newest.timestamp,
        };
    }
};
exports.AuditLogService = AuditLogService;
exports.AuditLogService = AuditLogService = AuditLogService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(audit_log_entity_1.AuditLog)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], AuditLogService);
//# sourceMappingURL=audit-log.service.js.map