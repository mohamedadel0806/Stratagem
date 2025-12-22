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
exports.ControlTestsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const control_tests_service_1 = require("./services/control-tests.service");
const create_control_test_dto_1 = require("./dto/create-control-test.dto");
const control_test_query_dto_1 = require("./dto/control-test-query.dto");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
const audit_decorator_1 = require("../../common/decorators/audit.decorator");
const audit_log_entity_1 = require("../../common/entities/audit-log.entity");
let ControlTestsController = class ControlTestsController {
    constructor(testsService) {
        this.testsService = testsService;
    }
    create(dto, req) {
        return this.testsService.create(dto, req.user.id);
    }
    findAll(query) {
        return this.testsService.findAll(query);
    }
    findOne(id) {
        return this.testsService.findOne(id);
    }
    update(id, dto, req) {
        return this.testsService.update(id, dto, req.user.id);
    }
    remove(id) {
        return this.testsService.remove(id);
    }
};
exports.ControlTestsController = ControlTestsController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Record or schedule a control test' }),
    (0, audit_decorator_1.Audit)(audit_log_entity_1.AuditAction.CREATE, 'ControlTest'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_control_test_dto_1.CreateControlTestDto, Object]),
    __metadata("design:returntype", void 0)
], ControlTestsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all control tests with filtering' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [control_test_query_dto_1.ControlTestQueryDto]),
    __metadata("design:returntype", void 0)
], ControlTestsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get control test by ID' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ControlTestsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update control test' }),
    (0, audit_decorator_1.Audit)(audit_log_entity_1.AuditAction.UPDATE, 'ControlTest'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", void 0)
], ControlTestsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete control test' }),
    (0, audit_decorator_1.Audit)(audit_log_entity_1.AuditAction.DELETE, 'ControlTest'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ControlTestsController.prototype, "remove", null);
exports.ControlTestsController = ControlTestsController = __decorate([
    (0, swagger_1.ApiTags)('Governance - Control Testing'),
    (0, common_1.Controller)('governance/control-tests'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [control_tests_service_1.ControlTestsService])
], ControlTestsController);
//# sourceMappingURL=control-tests.controller.js.map