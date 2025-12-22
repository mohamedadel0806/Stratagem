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
exports.SOPStepsController = void 0;
const common_1 = require("@nestjs/common");
const sop_steps_service_1 = require("../services/sop-steps.service");
const sop_step_dto_1 = require("../dto/sop-step.dto");
const jwt_auth_guard_1 = require("../../../auth/guards/jwt-auth.guard");
const swagger_1 = require("@nestjs/swagger");
const audit_decorator_1 = require("../../../common/decorators/audit.decorator");
const audit_log_entity_1 = require("../../../common/entities/audit-log.entity");
let SOPStepsController = class SOPStepsController {
    constructor(stepsService) {
        this.stepsService = stepsService;
    }
    create(createDto, req) {
        return this.stepsService.create(createDto, req.user.id);
    }
    findAll(queryDto) {
        return this.stepsService.findAll(queryDto);
    }
    getStepsForSOP(sopId) {
        return this.stepsService.getStepsForSOP(sopId);
    }
    getCritical(sopId) {
        return this.stepsService.getCriticalSteps(sopId);
    }
    getTotalDuration(sopId) {
        return this.stepsService.getTotalEstimatedDuration(sopId);
    }
    findOne(id) {
        return this.stepsService.findOne(id);
    }
    update(id, updateDto, req) {
        return this.stepsService.update(id, updateDto, req.user.id);
    }
    reorder(sopId, body, req) {
        return this.stepsService.reorderSteps(sopId, body.step_ids, req.user.id);
    }
    remove(id) {
        return this.stepsService.remove(id);
    }
};
exports.SOPStepsController = SOPStepsController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new SOP step' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Step created successfully' }),
    (0, audit_decorator_1.Audit)(audit_log_entity_1.AuditAction.CREATE, 'SOP_STEP'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [sop_step_dto_1.CreateSOPStepDto, Object]),
    __metadata("design:returntype", void 0)
], SOPStepsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all SOP steps' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of steps' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [sop_step_dto_1.SOPStepQueryDto]),
    __metadata("design:returntype", void 0)
], SOPStepsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('sop/:sop_id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get steps for a specific SOP' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'SOP steps' }),
    __param(0, (0, common_1.Param)('sop_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SOPStepsController.prototype, "getStepsForSOP", null);
__decorate([
    (0, common_1.Get)('sop/:sop_id/critical'),
    (0, swagger_1.ApiOperation)({ summary: 'Get critical steps for a SOP' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Critical steps' }),
    __param(0, (0, common_1.Param)('sop_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SOPStepsController.prototype, "getCritical", null);
__decorate([
    (0, common_1.Get)('sop/:sop_id/duration'),
    (0, swagger_1.ApiOperation)({ summary: 'Get total estimated duration for a SOP' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Total duration in minutes' }),
    __param(0, (0, common_1.Param)('sop_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SOPStepsController.prototype, "getTotalDuration", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get a step by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Step details' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SOPStepsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update a step' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Step updated successfully' }),
    (0, audit_decorator_1.Audit)(audit_log_entity_1.AuditAction.UPDATE, 'SOP_STEP'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, sop_step_dto_1.UpdateSOPStepDto, Object]),
    __metadata("design:returntype", void 0)
], SOPStepsController.prototype, "update", null);
__decorate([
    (0, common_1.Post)('sop/:sop_id/reorder'),
    (0, swagger_1.ApiOperation)({ summary: 'Reorder steps within a SOP' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Steps reordered successfully' }),
    (0, audit_decorator_1.Audit)(audit_log_entity_1.AuditAction.UPDATE, 'SOP_STEP'),
    __param(0, (0, common_1.Param)('sop_id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", void 0)
], SOPStepsController.prototype, "reorder", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a step' }),
    (0, swagger_1.ApiResponse)({ status: 204, description: 'Step deleted successfully' }),
    (0, audit_decorator_1.Audit)(audit_log_entity_1.AuditAction.DELETE, 'SOP_STEP'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SOPStepsController.prototype, "remove", null);
exports.SOPStepsController = SOPStepsController = __decorate([
    (0, swagger_1.ApiTags)('Governance - SOP Steps'),
    (0, common_1.Controller)('governance/sops/steps'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [sop_steps_service_1.SOPStepsService])
], SOPStepsController);
//# sourceMappingURL=sop-steps.controller.js.map