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
exports.GlobalAssetSearchController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const global_asset_search_service_1 = require("../services/global-asset-search.service");
const global_asset_search_dto_1 = require("../dto/global-asset-search.dto");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
let GlobalAssetSearchController = class GlobalAssetSearchController {
    constructor(globalAssetSearchService) {
        this.globalAssetSearchService = globalAssetSearchService;
    }
    async search(query) {
        return this.globalAssetSearchService.search(query);
    }
    async findAll(query) {
        return this.globalAssetSearchService.search(Object.assign(Object.assign({}, query), { q: undefined }));
    }
};
exports.GlobalAssetSearchController = GlobalAssetSearchController;
__decorate([
    (0, common_1.Get)('search'),
    (0, swagger_1.ApiOperation)({ summary: 'Global search across all asset types' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Search results across all asset types',
        type: global_asset_search_dto_1.GlobalAssetSearchResponseDto,
    }),
    (0, swagger_1.ApiQuery)({ name: 'q', required: false, description: 'Search query string' }),
    (0, swagger_1.ApiQuery)({ name: 'type', required: false, description: 'Filter by asset type', enum: ['physical', 'information', 'application', 'software', 'supplier', 'all'] }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, description: 'Page number', type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, description: 'Items per page', type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'criticality', required: false, description: 'Filter by criticality level' }),
    (0, swagger_1.ApiQuery)({ name: 'businessUnit', required: false, description: 'Filter by business unit' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [global_asset_search_dto_1.GlobalAssetSearchQueryDto]),
    __metadata("design:returntype", Promise)
], GlobalAssetSearchController.prototype, "search", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all assets (unified view)' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'List of all assets across all types',
        type: global_asset_search_dto_1.GlobalAssetSearchResponseDto,
    }),
    (0, swagger_1.ApiQuery)({ name: 'type', required: false, description: 'Filter by asset type', enum: ['physical', 'information', 'application', 'software', 'supplier', 'all'] }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, description: 'Page number', type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, description: 'Items per page', type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'criticality', required: false, description: 'Filter by criticality level' }),
    (0, swagger_1.ApiQuery)({ name: 'businessUnit', required: false, description: 'Filter by business unit' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [global_asset_search_dto_1.GlobalAssetSearchQueryDto]),
    __metadata("design:returntype", Promise)
], GlobalAssetSearchController.prototype, "findAll", null);
exports.GlobalAssetSearchController = GlobalAssetSearchController = __decorate([
    (0, swagger_1.ApiTags)('assets'),
    (0, common_1.Controller)('assets'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [global_asset_search_service_1.GlobalAssetSearchService])
], GlobalAssetSearchController);
//# sourceMappingURL=global-asset-search.controller.js.map