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
exports.BulkUpdateRequirementDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const compliance_requirement_entity_1 = require("../entities/compliance-requirement.entity");
class BulkUpdateRequirementDto {
}
exports.BulkUpdateRequirementDto = BulkUpdateRequirementDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Array of requirement IDs to update', type: [String] }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsUUID)('4', { each: true }),
    __metadata("design:type", Array)
], BulkUpdateRequirementDto.prototype, "ids", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: compliance_requirement_entity_1.RequirementStatus, description: 'New status to apply to all selected requirements' }),
    (0, class_validator_1.IsEnum)(compliance_requirement_entity_1.RequirementStatus),
    __metadata("design:type", String)
], BulkUpdateRequirementDto.prototype, "status", void 0);
//# sourceMappingURL=bulk-update-requirement.dto.js.map