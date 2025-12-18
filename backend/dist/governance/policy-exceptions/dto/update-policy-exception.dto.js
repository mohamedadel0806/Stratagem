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
exports.UpdatePolicyExceptionDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const create_policy_exception_dto_1 = require("./create-policy-exception.dto");
const class_validator_1 = require("class-validator");
const swagger_2 = require("@nestjs/swagger");
const policy_exception_entity_1 = require("../entities/policy-exception.entity");
class UpdatePolicyExceptionDto extends (0, swagger_1.PartialType)(create_policy_exception_dto_1.CreatePolicyExceptionDto) {
}
exports.UpdatePolicyExceptionDto = UpdatePolicyExceptionDto;
__decorate([
    (0, swagger_2.ApiPropertyOptional)({ enum: Object.values(policy_exception_entity_1.ExceptionStatus) }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(policy_exception_entity_1.ExceptionStatus),
    __metadata("design:type", String)
], UpdatePolicyExceptionDto.prototype, "status", void 0);
__decorate([
    (0, swagger_2.ApiPropertyOptional)({ description: 'Rejection reason (if rejected)' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdatePolicyExceptionDto.prototype, "rejection_reason", void 0);
__decorate([
    (0, swagger_2.ApiPropertyOptional)({ description: 'Approval conditions' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdatePolicyExceptionDto.prototype, "approval_conditions", void 0);
//# sourceMappingURL=update-policy-exception.dto.js.map