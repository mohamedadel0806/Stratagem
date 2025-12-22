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
exports.SOPFeedbackController = void 0;
const common_1 = require("@nestjs/common");
const sop_feedback_service_1 = require("../services/sop-feedback.service");
const sop_feedback_dto_1 = require("../dto/sop-feedback.dto");
const jwt_auth_guard_1 = require("../../../auth/guards/jwt-auth.guard");
const swagger_1 = require("@nestjs/swagger");
const audit_decorator_1 = require("../../../common/decorators/audit.decorator");
const audit_log_entity_1 = require("../../../common/entities/audit-log.entity");
let SOPFeedbackController = class SOPFeedbackController {
    constructor(feedbackService) {
        this.feedbackService = feedbackService;
    }
    create(createDto, req) {
        return this.feedbackService.create(createDto, req.user.id);
    }
    findAll(queryDto) {
        return this.feedbackService.findAll(queryDto);
    }
    getFeedbackForSOP(sopId) {
        return this.feedbackService.getFeedbackForSOP(sopId);
    }
    getMetrics(sopId) {
        return this.feedbackService.getSOPFeedbackMetrics(sopId);
    }
    getNegative() {
        return this.feedbackService.getNegativeFeedback();
    }
    getFollowUp() {
        return this.feedbackService.getFeedbackNeedingFollowUp();
    }
    findOne(id) {
        return this.feedbackService.findOne(id);
    }
    update(id, updateDto, req) {
        return this.feedbackService.update(id, updateDto, req.user.id);
    }
    remove(id) {
        return this.feedbackService.remove(id);
    }
};
exports.SOPFeedbackController = SOPFeedbackController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiOperation)({ summary: 'Create SOP feedback' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Feedback created successfully' }),
    (0, audit_decorator_1.Audit)(audit_log_entity_1.AuditAction.CREATE, 'SOP_FEEDBACK'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [sop_feedback_dto_1.CreateSOPFeedbackDto, Object]),
    __metadata("design:returntype", void 0)
], SOPFeedbackController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all SOP feedback' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of feedback' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [sop_feedback_dto_1.SOPFeedbackQueryDto]),
    __metadata("design:returntype", void 0)
], SOPFeedbackController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('sop/:sop_id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get feedback for a specific SOP' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'SOP feedback' }),
    __param(0, (0, common_1.Param)('sop_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SOPFeedbackController.prototype, "getFeedbackForSOP", null);
__decorate([
    (0, common_1.Get)('sop/:sop_id/metrics'),
    (0, swagger_1.ApiOperation)({ summary: 'Get feedback metrics for a SOP' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Feedback metrics' }),
    __param(0, (0, common_1.Param)('sop_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SOPFeedbackController.prototype, "getMetrics", null);
__decorate([
    (0, common_1.Get)('negative'),
    (0, swagger_1.ApiOperation)({ summary: 'Get negative feedback' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of negative feedback' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], SOPFeedbackController.prototype, "getNegative", null);
__decorate([
    (0, common_1.Get)('follow-up'),
    (0, swagger_1.ApiOperation)({ summary: 'Get feedback requiring follow-up' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Feedback requiring follow-up' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], SOPFeedbackController.prototype, "getFollowUp", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get feedback by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Feedback details' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SOPFeedbackController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update feedback' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Feedback updated successfully' }),
    (0, audit_decorator_1.Audit)(audit_log_entity_1.AuditAction.UPDATE, 'SOP_FEEDBACK'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, sop_feedback_dto_1.UpdateSOPFeedbackDto, Object]),
    __metadata("design:returntype", void 0)
], SOPFeedbackController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiOperation)({ summary: 'Delete feedback' }),
    (0, swagger_1.ApiResponse)({ status: 204, description: 'Feedback deleted successfully' }),
    (0, audit_decorator_1.Audit)(audit_log_entity_1.AuditAction.DELETE, 'SOP_FEEDBACK'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SOPFeedbackController.prototype, "remove", null);
exports.SOPFeedbackController = SOPFeedbackController = __decorate([
    (0, swagger_1.ApiTags)('Governance - SOP Feedback'),
    (0, common_1.Controller)('governance/sops/feedback'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [sop_feedback_service_1.SOPFeedbackService])
], SOPFeedbackController);
//# sourceMappingURL=sop-feedback.controller.js.map