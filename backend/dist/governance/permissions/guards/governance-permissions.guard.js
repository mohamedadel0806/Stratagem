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
exports.GovernancePermissionsGuard = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const governance_permissions_service_1 = require("../governance-permissions.service");
const governance_permission_decorator_1 = require("../decorators/governance-permission.decorator");
let GovernancePermissionsGuard = class GovernancePermissionsGuard {
    constructor(reflector, permissionsService) {
        this.reflector = reflector;
        this.permissionsService = permissionsService;
    }
    async canActivate(context) {
        const requiredPermission = this.reflector.getAllAndOverride(governance_permission_decorator_1.PERMISSION_KEY, [context.getHandler(), context.getClass()]);
        if (!requiredPermission) {
            return true;
        }
        const request = context.switchToHttp().getRequest();
        const user = request.user;
        if (!user || !user.id) {
            throw new common_1.ForbiddenException('User not authenticated');
        }
        const resourceData = this.extractResourceData(request);
        const hasPermission = await this.permissionsService.hasPermission(user.id, requiredPermission.module, requiredPermission.action, requiredPermission.resourceType, resourceData);
        if (!hasPermission) {
            throw new common_1.ForbiddenException(`You do not have permission to ${requiredPermission.action} ${requiredPermission.module}`);
        }
        return true;
    }
    extractResourceData(request) {
        var _a, _b, _c, _d;
        const resourceData = {};
        if ((_a = request.params) === null || _a === void 0 ? void 0 : _a.id) {
            resourceData.id = request.params.id;
        }
        if ((_b = request.body) === null || _b === void 0 ? void 0 : _b.business_unit_id) {
            resourceData.business_unit_id = request.body.business_unit_id;
        }
        if ((_c = request.params) === null || _c === void 0 ? void 0 : _c.businessUnitId) {
            resourceData.business_unit_id = request.params.businessUnitId;
        }
        if ((_d = request.body) === null || _d === void 0 ? void 0 : _d.owner_id) {
            resourceData.owner_id = request.body.owner_id;
        }
        return Object.keys(resourceData).length > 0 ? resourceData : undefined;
    }
};
exports.GovernancePermissionsGuard = GovernancePermissionsGuard;
exports.GovernancePermissionsGuard = GovernancePermissionsGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [core_1.Reflector,
        governance_permissions_service_1.GovernancePermissionsService])
], GovernancePermissionsGuard);
//# sourceMappingURL=governance-permissions.guard.js.map