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
exports.RiskTreatmentController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
const risk_treatment_service_1 = require("../services/risk-treatment.service");
const create_risk_treatment_dto_1 = require("../dto/treatment/create-risk-treatment.dto");
const update_risk_treatment_dto_1 = require("../dto/treatment/update-risk-treatment.dto");
const risk_treatment_entity_1 = require("../entities/risk-treatment.entity");
let RiskTreatmentController = class RiskTreatmentController {
    constructor(treatmentService) {
        this.treatmentService = treatmentService;
    }
    async findAll(status, priority, ownerId, riskId) {
        return this.treatmentService.findAll({ status, priority, ownerId, riskId });
    }
    async getSummary() {
        return this.treatmentService.getTreatmentSummary();
    }
    async getOverdue() {
        return this.treatmentService.getOverdueTreatments();
    }
    async getDueSoon(days) {
        return this.treatmentService.getTreatmentsDueSoon(days || 7);
    }
    async findByRiskId(riskId) {
        return this.treatmentService.findByRiskId(riskId);
    }
    async findOne(id) {
        return this.treatmentService.findOne(id);
    }
    async create(createDto, req) {
        var _a, _b;
        return this.treatmentService.create(createDto, ((_a = req.user) === null || _a === void 0 ? void 0 : _a.userId) || ((_b = req.user) === null || _b === void 0 ? void 0 : _b.id));
    }
    async update(id, updateDto, req) {
        var _a, _b;
        return this.treatmentService.update(id, updateDto, ((_a = req.user) === null || _a === void 0 ? void 0 : _a.userId) || ((_b = req.user) === null || _b === void 0 ? void 0 : _b.id));
    }
    async updateProgress(id, body, req) {
        var _a, _b;
        return this.treatmentService.updateProgress(id, body.progress, body.notes, ((_a = req.user) === null || _a === void 0 ? void 0 : _a.userId) || ((_b = req.user) === null || _b === void 0 ? void 0 : _b.id));
    }
    async remove(id) {
        await this.treatmentService.remove(id);
        return { message: 'Risk treatment deleted successfully' };
    }
    async addTask(id, taskData) {
        return this.treatmentService.addTask(id, taskData);
    }
    async updateTask(taskId, taskData) {
        return this.treatmentService.updateTask(taskId, taskData);
    }
    async removeTask(taskId) {
        await this.treatmentService.removeTask(taskId);
        return { message: 'Task deleted successfully' };
    }
};
exports.RiskTreatmentController = RiskTreatmentController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('status')),
    __param(1, (0, common_1.Query)('priority')),
    __param(2, (0, common_1.Query)('ownerId')),
    __param(3, (0, common_1.Query)('riskId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String]),
    __metadata("design:returntype", Promise)
], RiskTreatmentController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('summary'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], RiskTreatmentController.prototype, "getSummary", null);
__decorate([
    (0, common_1.Get)('overdue'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], RiskTreatmentController.prototype, "getOverdue", null);
__decorate([
    (0, common_1.Get)('due-soon'),
    __param(0, (0, common_1.Query)('days')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], RiskTreatmentController.prototype, "getDueSoon", null);
__decorate([
    (0, common_1.Get)('risk/:riskId'),
    __param(0, (0, common_1.Param)('riskId', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RiskTreatmentController.prototype, "findByRiskId", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RiskTreatmentController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_risk_treatment_dto_1.CreateRiskTreatmentDto, Object]),
    __metadata("design:returntype", Promise)
], RiskTreatmentController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_risk_treatment_dto_1.UpdateRiskTreatmentDto, Object]),
    __metadata("design:returntype", Promise)
], RiskTreatmentController.prototype, "update", null);
__decorate([
    (0, common_1.Patch)(':id/progress'),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], RiskTreatmentController.prototype, "updateProgress", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RiskTreatmentController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)(':id/tasks'),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], RiskTreatmentController.prototype, "addTask", null);
__decorate([
    (0, common_1.Put)('tasks/:taskId'),
    __param(0, (0, common_1.Param)('taskId', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], RiskTreatmentController.prototype, "updateTask", null);
__decorate([
    (0, common_1.Delete)('tasks/:taskId'),
    __param(0, (0, common_1.Param)('taskId', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RiskTreatmentController.prototype, "removeTask", null);
exports.RiskTreatmentController = RiskTreatmentController = __decorate([
    (0, common_1.Controller)('risk-treatments'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [risk_treatment_service_1.RiskTreatmentService])
], RiskTreatmentController);
//# sourceMappingURL=risk-treatment.controller.js.map