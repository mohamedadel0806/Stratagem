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
exports.EmailDistributionListController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
const email_distribution_list_service_1 = require("../services/email-distribution-list.service");
const create_email_distribution_list_dto_1 = require("../dto/create-email-distribution-list.dto");
const update_email_distribution_list_dto_1 = require("../dto/update-email-distribution-list.dto");
const swagger_1 = require("@nestjs/swagger");
let EmailDistributionListController = class EmailDistributionListController {
    constructor(distributionListService) {
        this.distributionListService = distributionListService;
    }
    async create(dto, req) {
        var _a;
        return this.distributionListService.create(dto, (_a = req.user) === null || _a === void 0 ? void 0 : _a.id);
    }
    async findAll() {
        return this.distributionListService.findAll();
    }
    async findOne(id) {
        return this.distributionListService.findOne(id);
    }
    async update(id, dto) {
        return this.distributionListService.update(id, dto);
    }
    async delete(id) {
        await this.distributionListService.delete(id);
        return { message: 'Email distribution list deleted successfully' };
    }
};
exports.EmailDistributionListController = EmailDistributionListController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new email distribution list' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_email_distribution_list_dto_1.CreateEmailDistributionListDto, Object]),
    __metadata("design:returntype", Promise)
], EmailDistributionListController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all email distribution lists' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], EmailDistributionListController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get an email distribution list by ID' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], EmailDistributionListController.prototype, "findOne", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update an email distribution list' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_email_distribution_list_dto_1.UpdateEmailDistributionListDto]),
    __metadata("design:returntype", Promise)
], EmailDistributionListController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete an email distribution list' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], EmailDistributionListController.prototype, "delete", null);
exports.EmailDistributionListController = EmailDistributionListController = __decorate([
    (0, swagger_1.ApiTags)('assets'),
    (0, common_1.Controller)('assets/email-distribution-lists'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [email_distribution_list_service_1.EmailDistributionListService])
], EmailDistributionListController);
//# sourceMappingURL=email-distribution-list.controller.js.map