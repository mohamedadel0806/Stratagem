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
exports.KRIController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
const kri_service_1 = require("../services/kri.service");
const create_kri_dto_1 = require("../dto/kri/create-kri.dto");
const update_kri_dto_1 = require("../dto/kri/update-kri.dto");
const kri_entity_1 = require("../entities/kri.entity");
let KRIController = class KRIController {
    constructor(kriService) {
        this.kriService = kriService;
    }
    async findAll(categoryId, status, ownerId, isActive) {
        return this.kriService.findAll({
            categoryId,
            status,
            ownerId,
            isActive: isActive === undefined ? undefined : isActive === 'true',
        });
    }
    async getStatusSummary() {
        return this.kriService.getKRIStatusSummary();
    }
    async getRequiringAttention() {
        return this.kriService.getKRIsRequiringAttention();
    }
    async getKRIsForRisk(riskId) {
        return this.kriService.getKRIsForRisk(riskId);
    }
    async findOne(id) {
        return this.kriService.findOne(id);
    }
    async getMeasurements(id, limit) {
        return this.kriService.getMeasurementHistory(id, limit || 50);
    }
    async getLinkedRisks(id) {
        return this.kriService.getLinkedRisks(id);
    }
    async create(createDto, req) {
        var _a, _b;
        return this.kriService.create(createDto, ((_a = req.user) === null || _a === void 0 ? void 0 : _a.userId) || ((_b = req.user) === null || _b === void 0 ? void 0 : _b.id));
    }
    async update(id, updateDto, req) {
        var _a, _b;
        return this.kriService.update(id, updateDto, ((_a = req.user) === null || _a === void 0 ? void 0 : _a.userId) || ((_b = req.user) === null || _b === void 0 ? void 0 : _b.id));
    }
    async remove(id) {
        await this.kriService.remove(id);
        return { message: 'KRI deleted successfully' };
    }
    async addMeasurement(id, measurementData, req) {
        var _a, _b;
        return this.kriService.addMeasurement(Object.assign(Object.assign({}, measurementData), { kri_id: id }), ((_a = req.user) === null || _a === void 0 ? void 0 : _a.userId) || ((_b = req.user) === null || _b === void 0 ? void 0 : _b.id));
    }
    async linkToRisk(id, riskId, body, req) {
        var _a, _b;
        await this.kriService.linkToRisk(id, riskId, body.relationship_type, body.notes, ((_a = req.user) === null || _a === void 0 ? void 0 : _a.userId) || ((_b = req.user) === null || _b === void 0 ? void 0 : _b.id));
        return { message: 'KRI linked to risk successfully' };
    }
    async unlinkFromRisk(id, riskId) {
        await this.kriService.unlinkFromRisk(id, riskId);
        return { message: 'KRI unlinked from risk successfully' };
    }
};
exports.KRIController = KRIController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('categoryId')),
    __param(1, (0, common_1.Query)('status')),
    __param(2, (0, common_1.Query)('ownerId')),
    __param(3, (0, common_1.Query)('isActive')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String]),
    __metadata("design:returntype", Promise)
], KRIController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('summary'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], KRIController.prototype, "getStatusSummary", null);
__decorate([
    (0, common_1.Get)('attention'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], KRIController.prototype, "getRequiringAttention", null);
__decorate([
    (0, common_1.Get)('risk/:riskId'),
    __param(0, (0, common_1.Param)('riskId', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], KRIController.prototype, "getKRIsForRisk", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], KRIController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)(':id/measurements'),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number]),
    __metadata("design:returntype", Promise)
], KRIController.prototype, "getMeasurements", null);
__decorate([
    (0, common_1.Get)(':id/risks'),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], KRIController.prototype, "getLinkedRisks", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_kri_dto_1.CreateKRIDto, Object]),
    __metadata("design:returntype", Promise)
], KRIController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_kri_dto_1.UpdateKRIDto, Object]),
    __metadata("design:returntype", Promise)
], KRIController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], KRIController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)(':id/measure'),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], KRIController.prototype, "addMeasurement", null);
__decorate([
    (0, common_1.Post)(':id/risks/:riskId'),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Param)('riskId', common_1.ParseUUIDPipe)),
    __param(2, (0, common_1.Body)()),
    __param(3, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object, Object]),
    __metadata("design:returntype", Promise)
], KRIController.prototype, "linkToRisk", null);
__decorate([
    (0, common_1.Delete)(':id/risks/:riskId'),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Param)('riskId', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], KRIController.prototype, "unlinkFromRisk", null);
exports.KRIController = KRIController = __decorate([
    (0, common_1.Controller)('kris'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [kri_service_1.KRIService])
], KRIController);
//# sourceMappingURL=kri.controller.js.map