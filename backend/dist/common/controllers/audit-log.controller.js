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
exports.AuditLogController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const audit_log_service_1 = require("../services/audit-log.service");
const audit_log_dto_1 = require("../dto/audit-log.dto");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
const current_user_decorator_1 = require("../../auth/decorators/current-user.decorator");
let AuditLogController = class AuditLogController {
    constructor(auditLogService) {
        this.auditLogService = auditLogService;
    }
    async getEntityLogs(entityType, entityId, limit = '100') {
        const logs = await this.auditLogService.getEntityLogs(entityType, entityId, parseInt(limit));
        return logs.map(log => this.toResponseDto(log));
    }
    async getUserLogs(userId, limit = '100') {
        const logs = await this.auditLogService.getUserLogs(userId, parseInt(limit));
        return logs.map(log => this.toResponseDto(log));
    }
    async getActionLogs(action, limit = '100') {
        const logs = await this.auditLogService.getActionLogs(action, parseInt(limit));
        return logs.map(log => this.toResponseDto(log));
    }
    async search(query, limit = '100') {
        if (!query || query.length < 2) {
            throw new common_1.BadRequestException('Search query must be at least 2 characters');
        }
        const logs = await this.auditLogService.search(query, parseInt(limit));
        return logs.map(log => this.toResponseDto(log));
    }
    async getAllLogs(skip = '0', take = '50') {
        const { logs, total } = await this.auditLogService.getAllLogs(parseInt(skip), parseInt(take));
        return {
            data: logs.map(log => this.toResponseDto(log)),
            total,
            skip: parseInt(skip),
            take: parseInt(take),
        };
    }
    async getSummary() {
        return this.auditLogService.getSummary();
    }
    async exportCsv(entityType, entityId) {
        const csv = await this.auditLogService.exportToCSV(entityType, entityId);
        return {
            contentType: 'text/csv',
            content: csv,
            filename: `audit-logs-${new Date().toISOString().split('T')[0]}.csv`,
        };
    }
    async create(dto, user) {
        const auditLog = await this.auditLogService.log(dto);
        return this.toResponseDto(auditLog);
    }
    async getEntityTrail(entityType, entityIds, limit = '100') {
        if (!entityIds) {
            throw new common_1.BadRequestException('entityIds query parameter is required');
        }
        const ids = entityIds.split(',').map(id => id.trim());
        const logs = await this.auditLogService.getEntityTrail(entityType, ids, parseInt(limit));
        return logs.map(log => this.toResponseDto(log));
    }
    toResponseDto(auditLog) {
        return {
            id: auditLog.id,
            userId: auditLog.userId,
            action: auditLog.action,
            entityType: auditLog.entityType,
            entityId: auditLog.entityId,
            description: auditLog.description,
            changes: auditLog.changes,
            metadata: auditLog.metadata,
            ipAddress: auditLog.ipAddress,
            userAgent: auditLog.userAgent,
            timestamp: auditLog.timestamp.toISOString(),
        };
    }
};
exports.AuditLogController = AuditLogController;
__decorate([
    (0, common_1.Get)('entity/:entityType/:entityId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get audit logs for an entity' }),
    __param(0, (0, common_1.Param)('entityType')),
    __param(1, (0, common_1.Param)('entityId')),
    __param(2, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], AuditLogController.prototype, "getEntityLogs", null);
__decorate([
    (0, common_1.Get)('user/:userId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get audit logs for a user' }),
    __param(0, (0, common_1.Param)('userId')),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AuditLogController.prototype, "getUserLogs", null);
__decorate([
    (0, common_1.Get)('action/:action'),
    (0, swagger_1.ApiOperation)({ summary: 'Get audit logs for an action' }),
    __param(0, (0, common_1.Param)('action')),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AuditLogController.prototype, "getActionLogs", null);
__decorate([
    (0, common_1.Get)('search'),
    (0, swagger_1.ApiOperation)({ summary: 'Search audit logs' }),
    __param(0, (0, common_1.Query)('q')),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AuditLogController.prototype, "search", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all audit logs (paginated)' }),
    __param(0, (0, common_1.Query)('skip')),
    __param(1, (0, common_1.Query)('take')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AuditLogController.prototype, "getAllLogs", null);
__decorate([
    (0, common_1.Get)('summary/stats'),
    (0, swagger_1.ApiOperation)({ summary: 'Get audit log summary statistics' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AuditLogController.prototype, "getSummary", null);
__decorate([
    (0, common_1.Get)('export/csv'),
    (0, swagger_1.ApiOperation)({ summary: 'Export audit logs as CSV' }),
    __param(0, (0, common_1.Query)('entityType')),
    __param(1, (0, common_1.Query)('entityId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AuditLogController.prototype, "exportCsv", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiOperation)({ summary: 'Create an audit log entry' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [audit_log_dto_1.CreateAuditLogDto, Object]),
    __metadata("design:returntype", Promise)
], AuditLogController.prototype, "create", null);
__decorate([
    (0, common_1.Get)('trail/:entityType'),
    (0, swagger_1.ApiOperation)({ summary: 'Get audit trail for related entities' }),
    __param(0, (0, common_1.Param)('entityType')),
    __param(1, (0, common_1.Query)('entityIds')),
    __param(2, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], AuditLogController.prototype, "getEntityTrail", null);
exports.AuditLogController = AuditLogController = __decorate([
    (0, swagger_1.ApiTags)('Audit Logs'),
    (0, common_1.Controller)('audit-logs'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)('JWT'),
    __metadata("design:paramtypes", [audit_log_service_1.AuditLogService])
], AuditLogController);
//# sourceMappingURL=audit-log.controller.js.map