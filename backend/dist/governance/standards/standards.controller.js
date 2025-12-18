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
exports.StandardsController = void 0;
const common_1 = require("@nestjs/common");
const standards_service_1 = require("./standards.service");
const create_standard_dto_1 = require("./dto/create-standard.dto");
const update_standard_dto_1 = require("./dto/update-standard.dto");
const standard_query_dto_1 = require("./dto/standard-query.dto");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
const swagger_1 = require("@nestjs/swagger");
let StandardsController = class StandardsController {
    constructor(standardsService) {
        this.standardsService = standardsService;
    }
    create(createStandardDto, req) {
        return this.standardsService.create(createStandardDto, req.user.id);
    }
    findAll(queryDto) {
        return this.standardsService.findAll(queryDto);
    }
    findOne(id) {
        return this.standardsService.findOne(id);
    }
    update(id, updateStandardDto, req) {
        return this.standardsService.update(id, updateStandardDto, req.user.id);
    }
    remove(id) {
        return this.standardsService.remove(id);
    }
};
exports.StandardsController = StandardsController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new standard' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Standard created successfully' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_standard_dto_1.CreateStandardDto, Object]),
    __metadata("design:returntype", void 0)
], StandardsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all standards with filtering and pagination' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of standards' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [standard_query_dto_1.StandardQueryDto]),
    __metadata("design:returntype", void 0)
], StandardsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get a standard by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Standard details' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Standard not found' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], StandardsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update a standard' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Standard updated successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Standard not found' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_standard_dto_1.UpdateStandardDto, Object]),
    __metadata("design:returntype", void 0)
], StandardsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a standard (soft delete)' }),
    (0, swagger_1.ApiResponse)({ status: 204, description: 'Standard deleted successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Standard not found' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], StandardsController.prototype, "remove", null);
exports.StandardsController = StandardsController = __decorate([
    (0, swagger_1.ApiTags)('Governance - Standards'),
    (0, common_1.Controller)('api/v1/governance/standards'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [standards_service_1.StandardsService])
], StandardsController);
//# sourceMappingURL=standards.controller.js.map