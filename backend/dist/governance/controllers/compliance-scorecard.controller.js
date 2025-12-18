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
exports.ComplianceScorecardController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const compliance_scorecard_service_1 = require("../services/compliance-scorecard.service");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
let ComplianceScorecardController = class ComplianceScorecardController {
    constructor(scorecardService) {
        this.scorecardService = scorecardService;
    }
    async getScorecard(frameworkIds) {
        const ids = frameworkIds ? frameworkIds.split(',').map((id) => id.trim()) : undefined;
        return this.scorecardService.generateScorecard(ids);
    }
};
exports.ComplianceScorecardController = ComplianceScorecardController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Generate framework compliance scorecard' }),
    (0, swagger_1.ApiQuery)({ name: 'frameworkIds', required: false, type: String, description: 'Comma-separated framework IDs' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Compliance scorecard data' }),
    __param(0, (0, common_1.Query)('frameworkIds')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ComplianceScorecardController.prototype, "getScorecard", null);
exports.ComplianceScorecardController = ComplianceScorecardController = __decorate([
    (0, swagger_1.ApiTags)('Governance - Compliance Scorecard'),
    (0, common_1.Controller)('governance/scorecard'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [compliance_scorecard_service_1.ComplianceScorecardService])
], ComplianceScorecardController);
//# sourceMappingURL=compliance-scorecard.controller.js.map