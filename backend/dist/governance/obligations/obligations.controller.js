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
exports.ObligationsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const obligations_service_1 = require("./obligations.service");
const create_obligation_dto_1 = require("./dto/create-obligation.dto");
const obligation_query_dto_1 = require("./dto/obligation-query.dto");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
const audit_decorator_1 = require("../../common/decorators/audit.decorator");
const audit_log_entity_1 = require("../../common/entities/audit-log.entity");
let ObligationsController = class ObligationsController {
    constructor(obligationsService) {
        this.obligationsService = obligationsService;
    }
    create(dto, req) {
        return this.obligationsService.create(dto, req.user.id);
    }
    findAll(query) {
        return this.obligationsService.findAll(query);
    }
    getStatistics() {
        return this.obligationsService.getStatistics();
    }
    findOne(id) {
        return this.obligationsService.findOne(id);
    }
    update(id, dto, req) {
        return this.obligationsService.update(id, dto, req.user.id);
    }
    remove(id) {
        return this.obligationsService.remove(id);
    }
};
exports.ObligationsController = ObligationsController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a compliance obligation' }),
    (0, audit_decorator_1.Audit)(audit_log_entity_1.AuditAction.CREATE, 'ComplianceObligation'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_obligation_dto_1.CreateComplianceObligationDto, Object]),
    __metadata("design:returntype", void 0)
], ObligationsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all obligations with filtering' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [obligation_query_dto_1.ObligationQueryDto]),
    __metadata("design:returntype", void 0)
], ObligationsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('statistics'),
    (0, swagger_1.ApiOperation)({ summary: 'Get obligation statistics' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ObligationsController.prototype, "getStatistics", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get obligation by ID' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ObligationsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update obligation' }),
    (0, audit_decorator_1.Audit)(audit_log_entity_1.AuditAction.UPDATE, 'ComplianceObligation'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", void 0)
], ObligationsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete obligation' }),
    (0, audit_decorator_1.Audit)(audit_log_entity_1.AuditAction.DELETE, 'ComplianceObligation'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ObligationsController.prototype, "remove", null);
exports.ObligationsController = ObligationsController = __decorate([
    (0, swagger_1.ApiTags)('Governance - Obligations'),
    (0, common_1.Controller)('governance/obligations'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [obligations_service_1.ObligationsService])
], ObligationsController);
//# sourceMappingURL=obligations.controller.js.map