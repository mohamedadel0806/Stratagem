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
exports.BulkDataController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const platform_express_1 = require("@nestjs/platform-express");
const bulk_data_service_1 = require("./services/bulk-data.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const user_entity_1 = require("../users/entities/user.entity");
const audit_decorator_1 = require("../common/decorators/audit.decorator");
const audit_log_entity_1 = require("../common/entities/audit-log.entity");
const sync_1 = require("csv-parse/sync");
let BulkDataController = class BulkDataController {
    constructor(bulkDataService) {
        this.bulkDataService = bulkDataService;
    }
    async importData(type, file, req) {
        if (!file) {
            throw new common_1.BadRequestException('File is required');
        }
        let items = [];
        if (file.mimetype === 'text/csv' || file.originalname.endsWith('.csv')) {
            const csvContent = file.buffer.toString('utf-8');
            items = (0, sync_1.parse)(csvContent, { columns: true, skip_empty_lines: true, trim: true });
        }
        else if (file.mimetype === 'application/json' || file.originalname.endsWith('.json')) {
            items = JSON.parse(file.buffer.toString('utf-8'));
        }
        else {
            throw new common_1.BadRequestException('Unsupported file type. Please upload CSV or JSON.');
        }
        if (type === 'policies') {
            return this.bulkDataService.importPolicies(items, req.user.id);
        }
        else if (type === 'controls') {
            return this.bulkDataService.importControls(items, req.user.id);
        }
        throw new common_1.BadRequestException(`Invalid import type: ${type}`);
    }
    async exportData(type, res) {
        const data = await this.bulkDataService.exportEntities(type);
        res.json(data);
    }
};
exports.BulkDataController = BulkDataController;
__decorate([
    (0, common_1.Post)('import/:type'),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.SUPER_ADMIN, user_entity_1.UserRole.ADMIN),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    (0, audit_decorator_1.Audit)(audit_log_entity_1.AuditAction.IMPORT, 'GovernanceData'),
    __param(0, (0, common_1.Param)('type')),
    __param(1, (0, common_1.UploadedFile)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], BulkDataController.prototype, "importData", null);
__decorate([
    (0, common_1.Get)('export/:type'),
    (0, swagger_1.ApiOperation)({ summary: 'Export governance data' }),
    __param(0, (0, common_1.Query)('type')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], BulkDataController.prototype, "exportData", null);
exports.BulkDataController = BulkDataController = __decorate([
    (0, swagger_1.ApiTags)('Governance - Data Management'),
    (0, common_1.Controller)('governance/data'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [bulk_data_service_1.BulkDataService])
], BulkDataController);
//# sourceMappingURL=bulk-data.controller.js.map