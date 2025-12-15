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
exports.RemediationTrackingController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const remediation_tracking_service_1 = require("../services/remediation-tracking.service");
const remediation_tracker_dto_1 = require("../dto/remediation-tracker.dto");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
let RemediationTrackingController = class RemediationTrackingController {
    constructor(remediationService) {
        this.remediationService = remediationService;
    }
    async getDashboard() {
        return this.remediationService.getDashboard();
    }
    async createTracker(findingId, data) {
        return this.remediationService.createTracker(findingId, data);
    }
    async updateTracker(trackerId, data) {
        return this.remediationService.updateTracker(trackerId, data);
    }
    async completeRemediation(trackerId, data) {
        return this.remediationService.completeRemediation(trackerId, data);
    }
    async getTrackersByFinding(findingId) {
        return this.remediationService.getTrackersByFinding(findingId);
    }
};
exports.RemediationTrackingController = RemediationTrackingController;
__decorate([
    (0, common_1.Get)('dashboard'),
    (0, swagger_1.ApiOperation)({ summary: 'Get remediation tracking dashboard metrics' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Remediation dashboard data',
        type: remediation_tracker_dto_1.RemediationDashboardDto,
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], RemediationTrackingController.prototype, "getDashboard", null);
__decorate([
    (0, common_1.Post)('finding/:findingId'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiOperation)({ summary: 'Create remediation tracker for a finding' }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Remediation tracker created',
        type: remediation_tracker_dto_1.RemediationTrackerDto,
    }),
    __param(0, (0, common_1.Param)('findingId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, remediation_tracker_dto_1.CreateRemediationTrackerDto]),
    __metadata("design:returntype", Promise)
], RemediationTrackingController.prototype, "createTracker", null);
__decorate([
    (0, common_1.Put)(':trackerId'),
    (0, swagger_1.ApiOperation)({ summary: 'Update remediation tracker progress' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Tracker updated',
        type: remediation_tracker_dto_1.RemediationTrackerDto,
    }),
    __param(0, (0, common_1.Param)('trackerId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, remediation_tracker_dto_1.UpdateRemediationTrackerDto]),
    __metadata("design:returntype", Promise)
], RemediationTrackingController.prototype, "updateTracker", null);
__decorate([
    (0, common_1.Patch)(':trackerId/complete'),
    (0, swagger_1.ApiOperation)({ summary: 'Mark remediation as complete' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Remediation marked complete',
        type: remediation_tracker_dto_1.RemediationTrackerDto,
    }),
    __param(0, (0, common_1.Param)('trackerId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, remediation_tracker_dto_1.CompleteRemediationDto]),
    __metadata("design:returntype", Promise)
], RemediationTrackingController.prototype, "completeRemediation", null);
__decorate([
    (0, common_1.Get)('finding/:findingId/trackers'),
    (0, swagger_1.ApiOperation)({ summary: 'Get remediation trackers for a finding' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'List of remediation trackers',
        type: [remediation_tracker_dto_1.RemediationTrackerDto],
    }),
    __param(0, (0, common_1.Param)('findingId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RemediationTrackingController.prototype, "getTrackersByFinding", null);
exports.RemediationTrackingController = RemediationTrackingController = __decorate([
    (0, swagger_1.ApiTags)('governance'),
    (0, common_1.Controller)('api/v1/governance/remediation'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [remediation_tracking_service_1.RemediationTrackingService])
], RemediationTrackingController);
//# sourceMappingURL=remediation-tracking.controller.js.map