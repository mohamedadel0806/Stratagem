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
exports.RiskCategoryController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
const risk_category_service_1 = require("../services/risk-category.service");
const create_risk_category_dto_1 = require("../dto/category/create-risk-category.dto");
const update_risk_category_dto_1 = require("../dto/category/update-risk-category.dto");
let RiskCategoryController = class RiskCategoryController {
    constructor(categoryService) {
        this.categoryService = categoryService;
    }
    async findAll(includeInactive, hierarchical) {
        const includeInactiveFlag = includeInactive === 'true';
        if (hierarchical === 'true') {
            return this.categoryService.findAllHierarchical(includeInactiveFlag);
        }
        return this.categoryService.findAll(includeInactiveFlag);
    }
    async findOne(id) {
        return this.categoryService.findOne(id);
    }
    async findByCode(code) {
        return this.categoryService.findByCode(code);
    }
    async create(createDto, req) {
        var _a;
        return this.categoryService.create(createDto, (_a = req.user) === null || _a === void 0 ? void 0 : _a.id);
    }
    async update(id, updateDto, req) {
        var _a;
        return this.categoryService.update(id, updateDto, (_a = req.user) === null || _a === void 0 ? void 0 : _a.id);
    }
    async remove(id) {
        await this.categoryService.remove(id);
        return { message: 'Risk category deleted successfully' };
    }
    async toggleActive(id, isActive, req) {
        var _a;
        return this.categoryService.toggleActive(id, isActive, (_a = req.user) === null || _a === void 0 ? void 0 : _a.id);
    }
    async reorder(categoryOrders) {
        await this.categoryService.reorder(categoryOrders);
        return { message: 'Categories reordered successfully' };
    }
};
exports.RiskCategoryController = RiskCategoryController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('includeInactive')),
    __param(1, (0, common_1.Query)('hierarchical')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], RiskCategoryController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RiskCategoryController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)('code/:code'),
    __param(0, (0, common_1.Param)('code')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RiskCategoryController.prototype, "findByCode", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_risk_category_dto_1.CreateRiskCategoryDto, Object]),
    __metadata("design:returntype", Promise)
], RiskCategoryController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_risk_category_dto_1.UpdateRiskCategoryDto, Object]),
    __metadata("design:returntype", Promise)
], RiskCategoryController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RiskCategoryController.prototype, "remove", null);
__decorate([
    (0, common_1.Patch)(':id/toggle-active'),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)('isActive')),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Boolean, Object]),
    __metadata("design:returntype", Promise)
], RiskCategoryController.prototype, "toggleActive", null);
__decorate([
    (0, common_1.Patch)('reorder'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array]),
    __metadata("design:returntype", Promise)
], RiskCategoryController.prototype, "reorder", null);
exports.RiskCategoryController = RiskCategoryController = __decorate([
    (0, common_1.Controller)('risk-categories'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [risk_category_service_1.RiskCategoryService])
], RiskCategoryController);
//# sourceMappingURL=risk-category.controller.js.map