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
exports.FrameworksController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const frameworks_service_1 = require("./frameworks.service");
const create_framework_version_dto_1 = require("./dto/create-framework-version.dto");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
const audit_decorator_1 = require("../../common/decorators/audit.decorator");
const audit_log_entity_1 = require("../../common/entities/audit-log.entity");
const sync_1 = require("csv-parse/sync");
let FrameworksController = class FrameworksController {
    constructor(frameworksService) {
        this.frameworksService = frameworksService;
    }
    getAllFrameworks() {
        return this.frameworksService.getAllFrameworks();
    }
    getFramework(id) {
        return this.frameworksService.getFramework(id);
    }
    createVersion(id, createDto, req) {
        return this.frameworksService.createVersion(id, createDto, req.user.id);
    }
    getVersions(id) {
        return this.frameworksService.getVersions(id);
    }
    getVersion(id, version) {
        return this.frameworksService.getVersion(id, version);
    }
    setCurrentVersion(id, version, req) {
        return this.frameworksService.setCurrentVersion(id, version, req.user.id);
    }
    importStructure(id, importDto, req) {
        return this.frameworksService.importFrameworkStructure(Object.assign(Object.assign({}, importDto), { framework_id: id }), req.user.id);
    }
    async importStructureFromFile(id, file, body, req) {
        if (!file) {
            throw new common_1.BadRequestException('File is required');
        }
        if (file.mimetype === 'application/json' || file.originalname.endsWith('.json')) {
            const structure = JSON.parse(file.buffer.toString('utf-8'));
            return this.frameworksService.importFrameworkStructure({
                framework_id: id,
                structure,
                version: body.version,
                create_version: body.create_version === 'true',
                replace_existing: body.replace_existing === 'true',
            }, req.user.id);
        }
        if (file.mimetype === 'text/csv' || file.originalname.endsWith('.csv')) {
            const structure = await this.parseCSVToStructure(file.buffer);
            return this.frameworksService.importFrameworkStructure({
                framework_id: id,
                structure,
                version: body.version,
                create_version: body.create_version === 'true',
                replace_existing: body.replace_existing === 'true',
            }, req.user.id);
        }
        throw new common_1.BadRequestException('Unsupported file type. Please upload JSON or CSV.');
    }
    getFrameworkWithStructure(id) {
        return this.frameworksService.getFrameworkWithStructure(id);
    }
    getFrameworkRequirements(id) {
        return this.frameworksService.getFrameworkRequirements(id);
    }
    getFrameworkDomains(id) {
        return this.frameworksService.getFrameworkDomains(id);
    }
    getFrameworkCategories(id, domain) {
        return this.frameworksService.getFrameworkCategories(id, domain);
    }
    getFrameworkStatistics(id) {
        return this.frameworksService.getFrameworkStatistics(id);
    }
    isFrameworkActive(id) {
        return this.frameworksService.isFrameworkActive(id);
    }
    searchFrameworks(query) {
        return this.frameworksService.searchFrameworks(query);
    }
    async parseCSVToStructure(buffer) {
        const csvContent = buffer.toString('utf-8');
        const records = (0, sync_1.parse)(csvContent, {
            columns: true,
            skip_empty_lines: true,
        });
        const domains = new Map();
        for (const row of records) {
            const domain = row.domain || row.Domain || 'Default';
            const category = row.category || row.Category || 'Default';
            const identifier = row.identifier || row.Identifier || row.id || '';
            const title = row.title || row.Title || '';
            const text = row.text || row.Text || row.description || row.Description || '';
            if (!domains.has(domain)) {
                domains.set(domain, new Map());
            }
            const categories = domains.get(domain);
            if (!categories.has(category)) {
                categories.set(category, []);
            }
            categories.get(category).push({ identifier, title, text });
        }
        return {
            domains: Array.from(domains.entries()).map(([domainName, categories]) => ({
                name: domainName,
                categories: Array.from(categories.entries()).map(([categoryName, requirements]) => ({
                    name: categoryName,
                    requirements,
                })),
            })),
        };
    }
};
exports.FrameworksController = FrameworksController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], FrameworksController.prototype, "getAllFrameworks", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], FrameworksController.prototype, "getFramework", null);
__decorate([
    (0, common_1.Post)(':id/versions'),
    (0, audit_decorator_1.Audit)(audit_log_entity_1.AuditAction.CREATE, 'FrameworkVersion', { description: 'Created new framework version' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_framework_version_dto_1.CreateFrameworkVersionDto, Object]),
    __metadata("design:returntype", void 0)
], FrameworksController.prototype, "createVersion", null);
__decorate([
    (0, common_1.Get)(':id/versions'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], FrameworksController.prototype, "getVersions", null);
__decorate([
    (0, common_1.Get)(':id/versions/:version'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('version')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], FrameworksController.prototype, "getVersion", null);
__decorate([
    (0, common_1.Post)(':id/versions/:version/set-current'),
    (0, audit_decorator_1.Audit)(audit_log_entity_1.AuditAction.APPROVE, 'FrameworkVersion', { description: 'Set current framework version' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('version')),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", void 0)
], FrameworksController.prototype, "setCurrentVersion", null);
__decorate([
    (0, common_1.Post)(':id/import-structure'),
    (0, audit_decorator_1.Audit)(audit_log_entity_1.AuditAction.IMPORT, 'ComplianceFramework', { description: 'Imported framework structure' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", void 0)
], FrameworksController.prototype, "importStructure", null);
__decorate([
    (0, common_1.Post)(':id/import-structure-file'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    (0, audit_decorator_1.Audit)(audit_log_entity_1.AuditAction.IMPORT, 'ComplianceFramework', { description: 'Imported framework structure from file' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.UploadedFile)()),
    __param(2, (0, common_1.Body)()),
    __param(3, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], FrameworksController.prototype, "importStructureFromFile", null);
__decorate([
    (0, common_1.Get)(':id/structure'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], FrameworksController.prototype, "getFrameworkWithStructure", null);
__decorate([
    (0, common_1.Get)(':id/requirements'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], FrameworksController.prototype, "getFrameworkRequirements", null);
__decorate([
    (0, common_1.Get)(':id/domains'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], FrameworksController.prototype, "getFrameworkDomains", null);
__decorate([
    (0, common_1.Get)(':id/categories'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Query)('domain')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], FrameworksController.prototype, "getFrameworkCategories", null);
__decorate([
    (0, common_1.Get)(':id/statistics'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], FrameworksController.prototype, "getFrameworkStatistics", null);
__decorate([
    (0, common_1.Get)(':id/active'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], FrameworksController.prototype, "isFrameworkActive", null);
__decorate([
    (0, common_1.Get)('search/:query'),
    __param(0, (0, common_1.Param)('query')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], FrameworksController.prototype, "searchFrameworks", null);
exports.FrameworksController = FrameworksController = __decorate([
    (0, common_1.Controller)('governance/frameworks'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [frameworks_service_1.FrameworksService])
], FrameworksController);
//# sourceMappingURL=frameworks.controller.js.map