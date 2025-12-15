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
exports.AssetTypeController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
const asset_type_service_1 = require("../services/asset-type.service");
const asset_type_entity_1 = require("../entities/asset-type.entity");
let AssetTypeController = class AssetTypeController {
    constructor(assetTypeService) {
        this.assetTypeService = assetTypeService;
    }
    async findAll(category) {
        return this.assetTypeService.findAll(category);
    }
    async findOne(id) {
        return this.assetTypeService.findOne(id);
    }
};
exports.AssetTypeController = AssetTypeController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all asset types' }),
    (0, swagger_1.ApiQuery)({
        name: 'category',
        required: false,
        enum: asset_type_entity_1.AssetCategory,
        description: 'Filter by asset category',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'List of asset types',
        type: [asset_type_entity_1.AssetType],
    }),
    __param(0, (0, common_1.Query)('category')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AssetTypeController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get asset type by ID' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Asset type details',
        type: asset_type_entity_1.AssetType,
    }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AssetTypeController.prototype, "findOne", null);
exports.AssetTypeController = AssetTypeController = __decorate([
    (0, swagger_1.ApiTags)('Asset Types'),
    (0, common_1.Controller)('assets/types'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [asset_type_service_1.AssetTypeService])
], AssetTypeController);
//# sourceMappingURL=asset-type.controller.js.map