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
exports.BulkOperationsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const bulk_operations_service_1 = require("../services/bulk-operations.service");
const bulk_update_dto_1 = require("../dto/bulk-update.dto");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
const current_user_decorator_1 = require("../../auth/decorators/current-user.decorator");
const user_entity_1 = require("../../users/entities/user.entity");
let BulkOperationsController = class BulkOperationsController {
    constructor(bulkOperationsService) {
        this.bulkOperationsService = bulkOperationsService;
    }
    async bulkUpdate(assetType, dto, user) {
        return this.bulkOperationsService.bulkUpdate(assetType, dto, user.id);
    }
    async bulkDelete(assetType, body, user) {
        return this.bulkOperationsService.bulkDelete(assetType, body.assetIds);
    }
};
exports.BulkOperationsController = BulkOperationsController;
__decorate([
    (0, common_1.Post)(':assetType/update'),
    (0, swagger_1.ApiOperation)({ summary: 'Bulk update assets' }),
    (0, swagger_1.ApiParam)({ name: 'assetType', enum: ['physical', 'information', 'application', 'software', 'supplier'] }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Bulk update completed', type: bulk_update_dto_1.BulkUpdateResponseDto }),
    __param(0, (0, common_1.Param)('assetType')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, bulk_update_dto_1.BulkUpdateDto,
        user_entity_1.User]),
    __metadata("design:returntype", Promise)
], BulkOperationsController.prototype, "bulkUpdate", null);
__decorate([
    (0, common_1.Post)(':assetType/delete'),
    (0, swagger_1.ApiOperation)({ summary: 'Bulk delete assets' }),
    (0, swagger_1.ApiParam)({ name: 'assetType', enum: ['physical', 'information', 'application', 'software', 'supplier'] }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Bulk delete completed', type: bulk_update_dto_1.BulkUpdateResponseDto }),
    __param(0, (0, common_1.Param)('assetType')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, user_entity_1.User]),
    __metadata("design:returntype", Promise)
], BulkOperationsController.prototype, "bulkDelete", null);
exports.BulkOperationsController = BulkOperationsController = __decorate([
    (0, swagger_1.ApiTags)('Bulk Operations'),
    (0, common_1.Controller)('assets/bulk'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [bulk_operations_service_1.BulkOperationsService])
], BulkOperationsController);
//# sourceMappingURL=bulk-operations.controller.js.map