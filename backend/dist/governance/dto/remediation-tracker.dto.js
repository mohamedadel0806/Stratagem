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
exports.CompleteRemediationDto = exports.UpdateRemediationTrackerDto = exports.CreateRemediationTrackerDto = exports.RemediationDashboardDto = exports.RemediationTrackerDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const remediation_tracker_entity_1 = require("../findings/entities/remediation-tracker.entity");
class RemediationTrackerDto {
}
exports.RemediationTrackerDto = RemediationTrackerDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], RemediationTrackerDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], RemediationTrackerDto.prototype, "finding_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], RemediationTrackerDto.prototype, "finding_identifier", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], RemediationTrackerDto.prototype, "finding_title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: remediation_tracker_entity_1.RemediationPriority }),
    __metadata("design:type", String)
], RemediationTrackerDto.prototype, "remediation_priority", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: 'string', format: 'date' }),
    __metadata("design:type", String)
], RemediationTrackerDto.prototype, "sla_due_date", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], RemediationTrackerDto.prototype, "remediation_steps", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], RemediationTrackerDto.prototype, "assigned_to_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], RemediationTrackerDto.prototype, "assigned_to_name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], RemediationTrackerDto.prototype, "progress_percent", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], RemediationTrackerDto.prototype, "progress_notes", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: 'string', format: 'date', nullable: true }),
    __metadata("design:type", String)
], RemediationTrackerDto.prototype, "completion_date", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Boolean)
], RemediationTrackerDto.prototype, "sla_met", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ nullable: true }),
    __metadata("design:type", Number)
], RemediationTrackerDto.prototype, "days_to_completion", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ nullable: true }),
    __metadata("design:type", Number)
], RemediationTrackerDto.prototype, "days_until_due", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], RemediationTrackerDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], RemediationTrackerDto.prototype, "created_at", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], RemediationTrackerDto.prototype, "updated_at", void 0);
class RemediationDashboardDto {
}
exports.RemediationDashboardDto = RemediationDashboardDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], RemediationDashboardDto.prototype, "total_open_findings", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], RemediationDashboardDto.prototype, "findings_on_track", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], RemediationDashboardDto.prototype, "findings_at_risk", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], RemediationDashboardDto.prototype, "findings_overdue", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], RemediationDashboardDto.prototype, "average_days_to_completion", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], RemediationDashboardDto.prototype, "sla_compliance_rate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [RemediationTrackerDto] }),
    __metadata("design:type", Array)
], RemediationDashboardDto.prototype, "critical_findings", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [RemediationTrackerDto] }),
    __metadata("design:type", Array)
], RemediationDashboardDto.prototype, "overdue_findings", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [RemediationTrackerDto] }),
    __metadata("design:type", Array)
], RemediationDashboardDto.prototype, "upcoming_due", void 0);
class CreateRemediationTrackerDto {
}
exports.CreateRemediationTrackerDto = CreateRemediationTrackerDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], CreateRemediationTrackerDto.prototype, "finding_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: remediation_tracker_entity_1.RemediationPriority, required: false }),
    __metadata("design:type", String)
], CreateRemediationTrackerDto.prototype, "remediation_priority", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: 'string', format: 'date' }),
    __metadata("design:type", String)
], CreateRemediationTrackerDto.prototype, "sla_due_date", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    __metadata("design:type", String)
], CreateRemediationTrackerDto.prototype, "remediation_steps", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    __metadata("design:type", String)
], CreateRemediationTrackerDto.prototype, "assigned_to_id", void 0);
class UpdateRemediationTrackerDto {
}
exports.UpdateRemediationTrackerDto = UpdateRemediationTrackerDto;
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    __metadata("design:type", String)
], UpdateRemediationTrackerDto.prototype, "remediation_priority", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    __metadata("design:type", Number)
], UpdateRemediationTrackerDto.prototype, "progress_percent", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    __metadata("design:type", String)
], UpdateRemediationTrackerDto.prototype, "progress_notes", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    __metadata("design:type", String)
], UpdateRemediationTrackerDto.prototype, "remediation_steps", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    __metadata("design:type", String)
], UpdateRemediationTrackerDto.prototype, "assigned_to_id", void 0);
class CompleteRemediationDto {
}
exports.CompleteRemediationDto = CompleteRemediationDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], CompleteRemediationDto.prototype, "completion_notes", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    __metadata("design:type", Object)
], CompleteRemediationDto.prototype, "completion_evidence", void 0);
//# sourceMappingURL=remediation-tracker.dto.js.map