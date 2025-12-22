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
exports.GovernanceAIController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const governance_ai_service_1 = require("./services/governance-ai.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
let GovernanceAIController = class GovernanceAIController {
    constructor(aiService) {
        this.aiService = aiService;
    }
    async suggestMappings(influencerId) {
        return this.aiService.suggestMappings(influencerId);
    }
    async predictEffectiveness(controlId) {
        return this.aiService.predictControlEffectiveness(controlId);
    }
    async simulatePolicyImpact(policyId, proposedChanges) {
        return this.aiService.simulatePolicyImpact(policyId, proposedChanges);
    }
};
exports.GovernanceAIController = GovernanceAIController;
__decorate([
    (0, common_1.Get)('suggest-mappings/:influencerId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get AI-powered mapping suggestions for an influencer' }),
    __param(0, (0, common_1.Param)('influencerId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], GovernanceAIController.prototype, "suggestMappings", null);
__decorate([
    (0, common_1.Get)('predict-effectiveness/:controlId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get AI-powered effectiveness prediction for a control' }),
    __param(0, (0, common_1.Param)('controlId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], GovernanceAIController.prototype, "predictEffectiveness", null);
__decorate([
    (0, common_1.Post)('simulate-policy-impact/:policyId'),
    (0, swagger_1.ApiOperation)({ summary: 'Simulate the impact of proposed policy changes' }),
    __param(0, (0, common_1.Param)('policyId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], GovernanceAIController.prototype, "simulatePolicyImpact", null);
exports.GovernanceAIController = GovernanceAIController = __decorate([
    (0, swagger_1.ApiTags)('Governance - AI'),
    (0, common_1.Controller)('governance/ai'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [governance_ai_service_1.GovernanceAIService])
], GovernanceAIController);
//# sourceMappingURL=governance-ai.controller.js.map