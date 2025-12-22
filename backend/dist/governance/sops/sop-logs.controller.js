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
exports.SOPLogsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const sop_logs_service_1 = require("./sop-logs.service");
const create_sop_log_dto_1 = require("./dto/create-sop-log.dto");
const sop_log_query_dto_1 = require("./dto/sop-log-query.dto");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
const audit_decorator_1 = require("../../common/decorators/audit.decorator");
const audit_log_entity_1 = require("../../common/entities/audit-log.entity");
let SOPLogsController = class SOPLogsController {
    constructor(logsService) {
        this.logsService = logsService;
    }
    create(dto, req) {
        return this.logsService.create(dto, req.user.id);
    }
    findAll(query) {
        return this.logsService.findAll(query);
    }
    getStatistics() {
        return this.logsService.getStatistics();
    }
    findOne(id) {
        return this.logsService.findOne(id);
    }
    update(id, dto, req) {
        return this.logsService.update(id, dto, req.user.id);
    }
    remove(id) {
        return this.logsService.remove(id);
    }
};
exports.SOPLogsController = SOPLogsController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Record an SOP execution' }),
    (0, audit_decorator_1.Audit)(audit_log_entity_1.AuditAction.CREATE, 'SOPLog'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_sop_log_dto_1.CreateSOPLogDto, Object]),
    __metadata("design:returntype", void 0)
], SOPLogsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all SOP execution logs' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [sop_log_query_dto_1.SOPLogQueryDto]),
    __metadata("design:returntype", void 0)
], SOPLogsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('statistics'),
    (0, swagger_1.ApiOperation)({ summary: 'Get SOP execution statistics' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], SOPLogsController.prototype, "getStatistics", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get SOP log by ID' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SOPLogsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update SOP log' }),
    (0, audit_decorator_1.Audit)(audit_log_entity_1.AuditAction.UPDATE, 'SOPLog'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", void 0)
], SOPLogsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete SOP log' }),
    (0, audit_decorator_1.Audit)(audit_log_entity_1.AuditAction.DELETE, 'SOPLog'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SOPLogsController.prototype, "remove", null);
exports.SOPLogsController = SOPLogsController = __decorate([
    (0, swagger_1.ApiTags)('Governance - SOP Logs'),
    (0, common_1.Controller)('governance/sop-logs'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [sop_logs_service_1.SOPLogsService])
], SOPLogsController);
//# sourceMappingURL=sop-logs.controller.js.map