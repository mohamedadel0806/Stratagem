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
exports.CreateReportTemplateDto = void 0;
const class_validator_1 = require("class-validator");
const report_template_entity_1 = require("../entities/report-template.entity");
class CreateReportTemplateDto {
}
exports.CreateReportTemplateDto = CreateReportTemplateDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateReportTemplateDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateReportTemplateDto.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(report_template_entity_1.ReportType),
    __metadata("design:type", String)
], CreateReportTemplateDto.prototype, "reportType", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(report_template_entity_1.ReportFormat),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateReportTemplateDto.prototype, "format", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], CreateReportTemplateDto.prototype, "fieldSelection", void 0);
__decorate([
    (0, class_validator_1.IsObject)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], CreateReportTemplateDto.prototype, "filters", void 0);
__decorate([
    (0, class_validator_1.IsObject)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], CreateReportTemplateDto.prototype, "grouping", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], CreateReportTemplateDto.prototype, "isScheduled", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(report_template_entity_1.ScheduleFrequency),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateReportTemplateDto.prototype, "scheduleFrequency", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateReportTemplateDto.prototype, "scheduleCron", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateReportTemplateDto.prototype, "scheduleTime", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateReportTemplateDto.prototype, "distributionListId", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], CreateReportTemplateDto.prototype, "isShared", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], CreateReportTemplateDto.prototype, "sharedWithUserIds", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], CreateReportTemplateDto.prototype, "sharedWithTeamIds", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], CreateReportTemplateDto.prototype, "isOrganizationWide", void 0);
//# sourceMappingURL=create-report-template.dto.js.map