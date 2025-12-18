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
exports.BulkAssignRoleDto = exports.AssignRoleDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class AssignRoleDto {
}
exports.AssignRoleDto = AssignRoleDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'User ID' }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], AssignRoleDto.prototype, "user_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Role name' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AssignRoleDto.prototype, "role", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Business unit ID for row-level security' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], AssignRoleDto.prototype, "business_unit_id", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Expiration date' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], AssignRoleDto.prototype, "expires_at", void 0);
class BulkAssignRoleDto {
}
exports.BulkAssignRoleDto = BulkAssignRoleDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Array of user IDs', type: [String] }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsUUID)(undefined, { each: true }),
    __metadata("design:type", Array)
], BulkAssignRoleDto.prototype, "user_ids", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Role name' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], BulkAssignRoleDto.prototype, "role", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Business unit ID for row-level security' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], BulkAssignRoleDto.prototype, "business_unit_id", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Expiration date' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], BulkAssignRoleDto.prototype, "expires_at", void 0);
//# sourceMappingURL=assign-role.dto.js.map