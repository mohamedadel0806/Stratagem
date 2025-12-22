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
exports.SOPSchedulesController = void 0;
const common_1 = require("@nestjs/common");
const sop_schedules_service_1 = require("../services/sop-schedules.service");
const sop_schedule_dto_1 = require("../dto/sop-schedule.dto");
const jwt_auth_guard_1 = require("../../../auth/guards/jwt-auth.guard");
const swagger_1 = require("@nestjs/swagger");
const audit_decorator_1 = require("../../../common/decorators/audit.decorator");
const audit_log_entity_1 = require("../../../common/entities/audit-log.entity");
let SOPSchedulesController = class SOPSchedulesController {
    constructor(schedulesService) {
        this.schedulesService = schedulesService;
    }
    create(createDto, req) {
        return this.schedulesService.create(createDto, req.user.id);
    }
    findAll(queryDto) {
        return this.schedulesService.findAll(queryDto);
    }
    getDue() {
        return this.schedulesService.getDueSchedules();
    }
    getBySOP(sopId) {
        return this.schedulesService.getSchedulesBySOP(sopId);
    }
    findOne(id) {
        return this.schedulesService.findOne(id);
    }
    update(id, updateDto, req) {
        return this.schedulesService.update(id, updateDto, req.user.id);
    }
    markExecuted(id) {
        return this.schedulesService.markAsExecuted(id);
    }
    remove(id) {
        return this.schedulesService.remove(id);
    }
};
exports.SOPSchedulesController = SOPSchedulesController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new SOP schedule' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Schedule created successfully' }),
    (0, audit_decorator_1.Audit)(audit_log_entity_1.AuditAction.CREATE, 'SOP_SCHEDULE'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [sop_schedule_dto_1.CreateSOPScheduleDto, Object]),
    __metadata("design:returntype", void 0)
], SOPSchedulesController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all SOP schedules' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of schedules' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [sop_schedule_dto_1.SOPScheduleQueryDto]),
    __metadata("design:returntype", void 0)
], SOPSchedulesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('due'),
    (0, swagger_1.ApiOperation)({ summary: 'Get due SOP schedules' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of due schedules' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], SOPSchedulesController.prototype, "getDue", null);
__decorate([
    (0, common_1.Get)('sop/:sop_id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get schedules for a specific SOP' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'SOP schedules' }),
    __param(0, (0, common_1.Param)('sop_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SOPSchedulesController.prototype, "getBySOP", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get a schedule by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Schedule details' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SOPSchedulesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update a schedule' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Schedule updated successfully' }),
    (0, audit_decorator_1.Audit)(audit_log_entity_1.AuditAction.UPDATE, 'SOP_SCHEDULE'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, sop_schedule_dto_1.UpdateSOPScheduleDto, Object]),
    __metadata("design:returntype", void 0)
], SOPSchedulesController.prototype, "update", null);
__decorate([
    (0, common_1.Post)(':id/mark-executed'),
    (0, swagger_1.ApiOperation)({ summary: 'Mark a schedule as executed' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Schedule marked as executed' }),
    (0, audit_decorator_1.Audit)(audit_log_entity_1.AuditAction.UPDATE, 'SOP_SCHEDULE'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SOPSchedulesController.prototype, "markExecuted", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a schedule' }),
    (0, swagger_1.ApiResponse)({ status: 204, description: 'Schedule deleted successfully' }),
    (0, audit_decorator_1.Audit)(audit_log_entity_1.AuditAction.DELETE, 'SOP_SCHEDULE'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SOPSchedulesController.prototype, "remove", null);
exports.SOPSchedulesController = SOPSchedulesController = __decorate([
    (0, swagger_1.ApiTags)('Governance - SOP Schedules'),
    (0, common_1.Controller)('governance/sops/schedules'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [sop_schedules_service_1.SOPSchedulesService])
], SOPSchedulesController);
//# sourceMappingURL=sop-schedules.controller.js.map