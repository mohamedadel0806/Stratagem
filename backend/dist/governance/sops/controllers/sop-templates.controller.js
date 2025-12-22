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
exports.SOPTemplatesController = void 0;
const common_1 = require("@nestjs/common");
const sop_templates_service_1 = require("../services/sop-templates.service");
const sop_template_dto_1 = require("../dto/sop-template.dto");
const jwt_auth_guard_1 = require("../../../auth/guards/jwt-auth.guard");
const swagger_1 = require("@nestjs/swagger");
const audit_decorator_1 = require("../../../common/decorators/audit.decorator");
const audit_log_entity_1 = require("../../../common/entities/audit-log.entity");
let SOPTemplatesController = class SOPTemplatesController {
    constructor(templatesService) {
        this.templatesService = templatesService;
    }
    create(createDto, req) {
        return this.templatesService.create(createDto, req.user.id);
    }
    findAll(queryDto) {
        return this.templatesService.findAll(queryDto);
    }
    getActive() {
        return this.templatesService.getActiveTemplates();
    }
    getByCategory(category) {
        return this.templatesService.getTemplatesByCategory(category);
    }
    findOne(id) {
        return this.templatesService.findOne(id);
    }
    update(id, updateDto, req) {
        return this.templatesService.update(id, updateDto, req.user.id);
    }
    clone(id, body, req) {
        return this.templatesService.cloneTemplate(id, body.new_key, req.user.id);
    }
    remove(id) {
        return this.templatesService.remove(id);
    }
};
exports.SOPTemplatesController = SOPTemplatesController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new SOP template' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Template created successfully' }),
    (0, audit_decorator_1.Audit)(audit_log_entity_1.AuditAction.CREATE, 'SOP_TEMPLATE'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [sop_template_dto_1.CreateSOPTemplateDto, Object]),
    __metadata("design:returntype", void 0)
], SOPTemplatesController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all SOP templates' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of templates' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [sop_template_dto_1.SOPTemplateQueryDto]),
    __metadata("design:returntype", void 0)
], SOPTemplatesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('active'),
    (0, swagger_1.ApiOperation)({ summary: 'Get active SOP templates' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of active templates' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], SOPTemplatesController.prototype, "getActive", null);
__decorate([
    (0, common_1.Get)('category/:category'),
    (0, swagger_1.ApiOperation)({ summary: 'Get templates by category' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Templates in category' }),
    __param(0, (0, common_1.Param)('category')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SOPTemplatesController.prototype, "getByCategory", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get a template by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Template details' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SOPTemplatesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update a template' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Template updated successfully' }),
    (0, audit_decorator_1.Audit)(audit_log_entity_1.AuditAction.UPDATE, 'SOP_TEMPLATE'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, sop_template_dto_1.UpdateSOPTemplateDto, Object]),
    __metadata("design:returntype", void 0)
], SOPTemplatesController.prototype, "update", null);
__decorate([
    (0, common_1.Post)(':id/clone'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiOperation)({ summary: 'Clone a template' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Template cloned successfully' }),
    (0, audit_decorator_1.Audit)(audit_log_entity_1.AuditAction.CREATE, 'SOP_TEMPLATE'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", void 0)
], SOPTemplatesController.prototype, "clone", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a template' }),
    (0, swagger_1.ApiResponse)({ status: 204, description: 'Template deleted successfully' }),
    (0, audit_decorator_1.Audit)(audit_log_entity_1.AuditAction.DELETE, 'SOP_TEMPLATE'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SOPTemplatesController.prototype, "remove", null);
exports.SOPTemplatesController = SOPTemplatesController = __decorate([
    (0, swagger_1.ApiTags)('Governance - SOP Templates'),
    (0, common_1.Controller)('governance/sops/templates'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [sop_templates_service_1.SOPTemplatesService])
], SOPTemplatesController);
//# sourceMappingURL=sop-templates.controller.js.map