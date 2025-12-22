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
exports.TraceabilityController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const traceability_service_1 = require("./services/traceability.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
let TraceabilityController = class TraceabilityController {
    constructor(traceabilityService) {
        this.traceabilityService = traceabilityService;
    }
    async getGraph(rootId, rootType) {
        return this.traceabilityService.getTraceabilityGraph(rootId, rootType);
    }
};
exports.TraceabilityController = TraceabilityController;
__decorate([
    (0, common_1.Get)('graph'),
    (0, swagger_1.ApiOperation)({ summary: 'Get governance traceability graph' }),
    __param(0, (0, common_1.Query)('rootId')),
    __param(1, (0, common_1.Query)('rootType')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], TraceabilityController.prototype, "getGraph", null);
exports.TraceabilityController = TraceabilityController = __decorate([
    (0, swagger_1.ApiTags)('Governance - Traceability'),
    (0, common_1.Controller)('governance/traceability'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [traceability_service_1.TraceabilityService])
], TraceabilityController);
//# sourceMappingURL=traceability.controller.js.map