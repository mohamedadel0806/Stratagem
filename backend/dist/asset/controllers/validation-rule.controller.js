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
exports.ValidationRuleController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
const validation_rule_service_1 = require("../services/validation-rule.service");
const create_validation_rule_dto_1 = require("../dto/create-validation-rule.dto");
const update_validation_rule_dto_1 = require("../dto/update-validation-rule.dto");
const validation_rule_entity_1 = require("../entities/validation-rule.entity");
const swagger_1 = require("@nestjs/swagger");
let ValidationRuleController = class ValidationRuleController {
    constructor(validationRuleService) {
        this.validationRuleService = validationRuleService;
    }
    async create(dto, req) {
        var _a;
        return this.validationRuleService.create(dto, (_a = req.user) === null || _a === void 0 ? void 0 : _a.id);
    }
    async findAll(assetType) {
        return this.validationRuleService.findAll(assetType);
    }
    async findOne(id) {
        return this.validationRuleService.findOne(id);
    }
    async update(id, dto) {
        return this.validationRuleService.update(id, dto);
    }
    async delete(id) {
        await this.validationRuleService.delete(id);
        return { message: 'Validation rule deleted successfully' };
    }
    async validateAsset(body) {
        return this.validationRuleService.validateAsset(body.asset, body.assetType);
    }
    async testRule(id, body) {
        return this.validationRuleService.testValidationRule(id, body.testValue);
    }
};
exports.ValidationRuleController = ValidationRuleController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new validation rule' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_validation_rule_dto_1.CreateValidationRuleDto, Object]),
    __metadata("design:returntype", Promise)
], ValidationRuleController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all validation rules' }),
    __param(0, (0, common_1.Query)('assetType')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ValidationRuleController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get a validation rule by ID' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ValidationRuleController.prototype, "findOne", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update a validation rule' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_validation_rule_dto_1.UpdateValidationRuleDto]),
    __metadata("design:returntype", Promise)
], ValidationRuleController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a validation rule' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ValidationRuleController.prototype, "delete", null);
__decorate([
    (0, common_1.Post)('validate'),
    (0, swagger_1.ApiOperation)({ summary: 'Validate an asset against all applicable rules' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ValidationRuleController.prototype, "validateAsset", null);
__decorate([
    (0, common_1.Post)(':id/test'),
    (0, swagger_1.ApiOperation)({ summary: 'Test a validation rule with a test value' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ValidationRuleController.prototype, "testRule", null);
exports.ValidationRuleController = ValidationRuleController = __decorate([
    (0, swagger_1.ApiTags)('assets'),
    (0, common_1.Controller)('assets/validation-rules'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [validation_rule_service_1.ValidationRuleService])
], ValidationRuleController);
//# sourceMappingURL=validation-rule.controller.js.map