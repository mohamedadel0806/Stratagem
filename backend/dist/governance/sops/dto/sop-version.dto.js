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
exports.SOPVersionQueryDto = exports.ApproveSOPVersionDto = exports.UpdateSOPVersionDto = exports.CreateSOPVersionDto = void 0;
const class_validator_1 = require("class-validator");
const sop_version_entity_1 = require("../entities/sop-version.entity");
class CreateSOPVersionDto {
}
exports.CreateSOPVersionDto = CreateSOPVersionDto;
__decorate([
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateSOPVersionDto.prototype, "sop_id", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateSOPVersionDto.prototype, "version_number", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(sop_version_entity_1.VersionChangeType),
    __metadata("design:type", String)
], CreateSOPVersionDto.prototype, "change_type", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateSOPVersionDto.prototype, "change_summary", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateSOPVersionDto.prototype, "change_details", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsJSON)(),
    __metadata("design:type", Object)
], CreateSOPVersionDto.prototype, "content_snapshot", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsJSON)(),
    __metadata("design:type", Object)
], CreateSOPVersionDto.prototype, "metadata_snapshot", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateSOPVersionDto.prototype, "previous_version_id", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateSOPVersionDto.prototype, "requires_retraining", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateSOPVersionDto.prototype, "is_backward_compatible", void 0);
class UpdateSOPVersionDto {
}
exports.UpdateSOPVersionDto = UpdateSOPVersionDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateSOPVersionDto.prototype, "change_summary", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateSOPVersionDto.prototype, "change_details", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(sop_version_entity_1.VersionStatus),
    __metadata("design:type", String)
], UpdateSOPVersionDto.prototype, "status", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateSOPVersionDto.prototype, "requires_retraining", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateSOPVersionDto.prototype, "is_backward_compatible", void 0);
class ApproveSOPVersionDto {
}
exports.ApproveSOPVersionDto = ApproveSOPVersionDto;
__decorate([
    (0, class_validator_1.IsEnum)(sop_version_entity_1.VersionStatus),
    __metadata("design:type", String)
], ApproveSOPVersionDto.prototype, "status", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ApproveSOPVersionDto.prototype, "approval_comments", void 0);
class SOPVersionQueryDto {
}
exports.SOPVersionQueryDto = SOPVersionQueryDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], SOPVersionQueryDto.prototype, "sop_id", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(sop_version_entity_1.VersionStatus),
    __metadata("design:type", String)
], SOPVersionQueryDto.prototype, "status", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], SOPVersionQueryDto.prototype, "page", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], SOPVersionQueryDto.prototype, "limit", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], SOPVersionQueryDto.prototype, "sort", void 0);
//# sourceMappingURL=sop-version.dto.js.map