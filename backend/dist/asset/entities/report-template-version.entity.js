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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportTemplateVersion = void 0;
const typeorm_1 = require("typeorm");
const report_template_entity_1 = require("./report-template.entity");
const user_entity_1 = require("../../users/entities/user.entity");
const report_template_entity_2 = require("./report-template.entity");
let ReportTemplateVersion = class ReportTemplateVersion {
};
exports.ReportTemplateVersion = ReportTemplateVersion;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], ReportTemplateVersion.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], ReportTemplateVersion.prototype, "templateId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => report_template_entity_1.ReportTemplate),
    (0, typeorm_1.JoinColumn)({ name: 'template_id' }),
    __metadata("design:type", report_template_entity_1.ReportTemplate)
], ReportTemplateVersion.prototype, "template", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'integer' }),
    __metadata("design:type", Number)
], ReportTemplateVersion.prototype, "versionNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], ReportTemplateVersion.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], ReportTemplateVersion.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: report_template_entity_2.ReportType,
    }),
    __metadata("design:type", String)
], ReportTemplateVersion.prototype, "reportType", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: report_template_entity_2.ReportFormat,
        default: report_template_entity_2.ReportFormat.EXCEL,
    }),
    __metadata("design:type", String)
], ReportTemplateVersion.prototype, "format", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true, default: '[]' }),
    __metadata("design:type", Array)
], ReportTemplateVersion.prototype, "fieldSelection", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true }),
    __metadata("design:type", Object)
], ReportTemplateVersion.prototype, "filters", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true }),
    __metadata("design:type", Object)
], ReportTemplateVersion.prototype, "grouping", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], ReportTemplateVersion.prototype, "isScheduled", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: report_template_entity_2.ScheduleFrequency,
        nullable: true,
    }),
    __metadata("design:type", String)
], ReportTemplateVersion.prototype, "scheduleFrequency", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 50, nullable: true }),
    __metadata("design:type", String)
], ReportTemplateVersion.prototype, "scheduleCron", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'time', nullable: true }),
    __metadata("design:type", String)
], ReportTemplateVersion.prototype, "scheduleTime", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true }),
    __metadata("design:type", String)
], ReportTemplateVersion.prototype, "distributionListId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: true }),
    __metadata("design:type", Boolean)
], ReportTemplateVersion.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], ReportTemplateVersion.prototype, "versionComment", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], ReportTemplateVersion.prototype, "createdById", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User),
    (0, typeorm_1.JoinColumn)({ name: 'created_by_id' }),
    __metadata("design:type", user_entity_1.User)
], ReportTemplateVersion.prototype, "createdBy", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], ReportTemplateVersion.prototype, "createdAt", void 0);
exports.ReportTemplateVersion = ReportTemplateVersion = __decorate([
    (0, typeorm_1.Entity)('report_template_versions')
], ReportTemplateVersion);
//# sourceMappingURL=report-template-version.entity.js.map