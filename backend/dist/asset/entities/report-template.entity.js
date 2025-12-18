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
exports.ReportTemplate = exports.ScheduleFrequency = exports.ReportFormat = exports.ReportType = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../../users/entities/user.entity");
var ReportType;
(function (ReportType) {
    ReportType["ASSET_INVENTORY"] = "asset_inventory";
    ReportType["COMPLIANCE_REPORT"] = "compliance_report";
    ReportType["SECURITY_TEST_REPORT"] = "security_test_report";
    ReportType["SOFTWARE_INVENTORY"] = "software_inventory";
    ReportType["CONTRACT_EXPIRATION"] = "contract_expiration";
    ReportType["SUPPLIER_CRITICALITY"] = "supplier_criticality";
    ReportType["CUSTOM"] = "custom";
})(ReportType || (exports.ReportType = ReportType = {}));
var ReportFormat;
(function (ReportFormat) {
    ReportFormat["EXCEL"] = "excel";
    ReportFormat["PDF"] = "pdf";
    ReportFormat["CSV"] = "csv";
})(ReportFormat || (exports.ReportFormat = ReportFormat = {}));
var ScheduleFrequency;
(function (ScheduleFrequency) {
    ScheduleFrequency["DAILY"] = "daily";
    ScheduleFrequency["WEEKLY"] = "weekly";
    ScheduleFrequency["MONTHLY"] = "monthly";
    ScheduleFrequency["QUARTERLY"] = "quarterly";
    ScheduleFrequency["YEARLY"] = "yearly";
})(ScheduleFrequency || (exports.ScheduleFrequency = ScheduleFrequency = {}));
let ReportTemplate = class ReportTemplate {
};
exports.ReportTemplate = ReportTemplate;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], ReportTemplate.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], ReportTemplate.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], ReportTemplate.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: ReportType,
    }),
    __metadata("design:type", String)
], ReportTemplate.prototype, "reportType", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: ReportFormat,
        default: ReportFormat.EXCEL,
    }),
    __metadata("design:type", String)
], ReportTemplate.prototype, "format", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true, default: '[]' }),
    __metadata("design:type", Array)
], ReportTemplate.prototype, "fieldSelection", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true }),
    __metadata("design:type", Object)
], ReportTemplate.prototype, "filters", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true }),
    __metadata("design:type", Object)
], ReportTemplate.prototype, "grouping", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], ReportTemplate.prototype, "isScheduled", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: ScheduleFrequency,
        nullable: true,
    }),
    __metadata("design:type", String)
], ReportTemplate.prototype, "scheduleFrequency", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 50, nullable: true }),
    __metadata("design:type", String)
], ReportTemplate.prototype, "scheduleCron", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'time', nullable: true }),
    __metadata("design:type", String)
], ReportTemplate.prototype, "scheduleTime", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true }),
    __metadata("design:type", String)
], ReportTemplate.prototype, "distributionListId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: true }),
    __metadata("design:type", Boolean)
], ReportTemplate.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], ReportTemplate.prototype, "isSystemTemplate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: false, nullable: true }),
    __metadata("design:type", Boolean)
], ReportTemplate.prototype, "isShared", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true }),
    __metadata("design:type", Array)
], ReportTemplate.prototype, "sharedWithUserIds", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true }),
    __metadata("design:type", Array)
], ReportTemplate.prototype, "sharedWithTeamIds", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: false, nullable: true }),
    __metadata("design:type", Boolean)
], ReportTemplate.prototype, "isOrganizationWide", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'integer', default: 1, nullable: true }),
    __metadata("design:type", Number)
], ReportTemplate.prototype, "version", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], ReportTemplate.prototype, "lastRunAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], ReportTemplate.prototype, "nextRunAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], ReportTemplate.prototype, "createdById", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User),
    (0, typeorm_1.JoinColumn)({ name: 'created_by_id' }),
    __metadata("design:type", user_entity_1.User)
], ReportTemplate.prototype, "createdBy", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], ReportTemplate.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], ReportTemplate.prototype, "updatedAt", void 0);
exports.ReportTemplate = ReportTemplate = __decorate([
    (0, typeorm_1.Entity)('report_templates')
], ReportTemplate);
//# sourceMappingURL=report-template.entity.js.map