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
Object.defineProperty(exports, "__esModule", { value: true });
exports.PolicyHierarchyController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const policy_hierarchy_service_1 = require("./services/policy-hierarchy.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
let PolicyHierarchyController = class PolicyHierarchyController {
    constructor(hierarchyService) {
        this.hierarchyService = hierarchyService;
    }
    async getPolicyHierarchy() {
        return this.hierarchyService.getPolicyHierarchy();
    }
};
exports.PolicyHierarchyController = PolicyHierarchyController;
__decorate([
    (0, common_1.Get)('policy'),
    (0, swagger_1.ApiOperation)({ summary: 'Get policy framework hierarchy' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PolicyHierarchyController.prototype, "getPolicyHierarchy", null);
exports.PolicyHierarchyController = PolicyHierarchyController = __decorate([
    (0, swagger_1.ApiTags)('Governance - Hierarchy'),
    (0, common_1.Controller)('governance/hierarchy'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [policy_hierarchy_service_1.PolicyHierarchyService])
], PolicyHierarchyController);
//# sourceMappingURL=policy-hierarchy.controller.js.map