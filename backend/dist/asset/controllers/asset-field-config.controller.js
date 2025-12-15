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
exports.AssetFieldConfigController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const asset_field_config_service_1 = require("../services/asset-field-config.service");
const create_asset_field_config_dto_1 = require("../dto/create-asset-field-config.dto");
const update_asset_field_config_dto_1 = require("../dto/update-asset-field-config.dto");
const asset_field_config_response_dto_1 = require("../dto/asset-field-config-response.dto");
const asset_field_config_entity_1 = require("../entities/asset-field-config.entity");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
const current_user_decorator_1 = require("../../auth/decorators/current-user.decorator");
const user_entity_1 = require("../../users/entities/user.entity");
let AssetFieldConfigController = class AssetFieldConfigController {
    constructor(fieldConfigService) {
        this.fieldConfigService = fieldConfigService;
    }
    async create(dto, user) {
        const config = await this.fieldConfigService.create(dto, user.id);
        return this.mapToResponseDto(config);
    }
    async findAll(assetType) {
        const configs = await this.fieldConfigService.findAll(assetType);
        return configs.map((config) => this.mapToResponseDto(config));
    }
    async getForForm(assetType) {
        const configs = await this.fieldConfigService.getFieldConfigForForm(assetType);
        return configs.map((config) => this.mapToResponseDto(config));
    }
    async findOne(id) {
        const config = await this.fieldConfigService.findOne(id);
        return this.mapToResponseDto(config);
    }
    async update(id, dto) {
        const config = await this.fieldConfigService.update(id, dto);
        return this.mapToResponseDto(config);
    }
    async delete(id) {
        await this.fieldConfigService.delete(id);
    }
    async validate(body) {
        return this.fieldConfigService.validateFieldValue(body.assetType, body.fieldName, body.value);
    }
    mapToResponseDto(config) {
        return {
            id: config.id,
            assetType: config.assetType,
            fieldName: config.fieldName,
            displayName: config.displayName,
            fieldType: config.fieldType,
            isRequired: config.isRequired,
            isEnabled: config.isEnabled,
            displayOrder: config.displayOrder,
            validationRule: config.validationRule,
            validationMessage: config.validationMessage,
            selectOptions: config.selectOptions,
            defaultValue: config.defaultValue,
            helpText: config.helpText,
            fieldDependencies: config.fieldDependencies,
            createdById: config.createdById,
            createdByName: config.createdBy
                ? `${config.createdBy.firstName} ${config.createdBy.lastName}`
                : undefined,
            createdAt: config.createdAt,
            updatedAt: config.updatedAt,
        };
    }
};
exports.AssetFieldConfigController = AssetFieldConfigController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create asset field configuration' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Field config created', type: asset_field_config_response_dto_1.AssetFieldConfigResponseDto }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_asset_field_config_dto_1.CreateAssetFieldConfigDto,
        user_entity_1.User]),
    __metadata("design:returntype", Promise)
], AssetFieldConfigController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all field configurations' }),
    (0, swagger_1.ApiQuery)({ name: 'assetType', required: false, enum: asset_field_config_entity_1.AssetTypeEnum }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of field configs', type: [asset_field_config_response_dto_1.AssetFieldConfigResponseDto] }),
    __param(0, (0, common_1.Query)('assetType')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AssetFieldConfigController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('for-form/:assetType'),
    (0, swagger_1.ApiOperation)({ summary: 'Get field configurations for form (enabled only)' }),
    (0, swagger_1.ApiParam)({ name: 'assetType', enum: asset_field_config_entity_1.AssetTypeEnum }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of enabled field configs', type: [asset_field_config_response_dto_1.AssetFieldConfigResponseDto] }),
    __param(0, (0, common_1.Param)('assetType')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AssetFieldConfigController.prototype, "getForForm", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get field configuration by ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Field config ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Field config', type: asset_field_config_response_dto_1.AssetFieldConfigResponseDto }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AssetFieldConfigController.prototype, "findOne", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update field configuration' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Field config ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Field config updated', type: asset_field_config_response_dto_1.AssetFieldConfigResponseDto }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_asset_field_config_dto_1.UpdateAssetFieldConfigDto]),
    __metadata("design:returntype", Promise)
], AssetFieldConfigController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete field configuration (or disable if has data)' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Field config ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Field config deleted or disabled' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AssetFieldConfigController.prototype, "delete", null);
__decorate([
    (0, common_1.Post)('validate'),
    (0, swagger_1.ApiOperation)({ summary: 'Validate field value' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Validation result' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AssetFieldConfigController.prototype, "validate", null);
exports.AssetFieldConfigController = AssetFieldConfigController = __decorate([
    (0, swagger_1.ApiTags)('Asset Field Configuration'),
    (0, common_1.Controller)('assets/field-configs'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [asset_field_config_service_1.AssetFieldConfigService])
], AssetFieldConfigController);
//# sourceMappingURL=asset-field-config.controller.js.map