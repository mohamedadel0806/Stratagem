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
exports.BulkUpdatePolicyDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const policy_entity_1 = require("../entities/policy.entity");
class BulkUpdatePolicyDto {
}
exports.BulkUpdatePolicyDto = BulkUpdatePolicyDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Array of policy IDs to update', type: [String] }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsUUID)('4', { each: true }),
    __metadata("design:type", Array)
], BulkUpdatePolicyDto.prototype, "ids", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: policy_entity_1.PolicyStatus, description: 'New status to apply to all selected policies' }),
    (0, class_validator_1.IsEnum)(policy_entity_1.PolicyStatus),
    __metadata("design:type", String)
], BulkUpdatePolicyDto.prototype, "status", void 0);
//# sourceMappingURL=bulk-update-policy.dto.js.map