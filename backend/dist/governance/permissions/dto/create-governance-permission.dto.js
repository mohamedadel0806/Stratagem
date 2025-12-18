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
exports.CreateGovernancePermissionDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const governance_permission_entity_1 = require("../entities/governance-permission.entity");
class CreateGovernancePermissionDto {
}
exports.CreateGovernancePermissionDto = CreateGovernancePermissionDto;
__decorate([
    (0, swagger_1.ApiProperty)({ enum: Object.values(governance_permission_entity_1.GovernanceModule), description: 'Governance module' }),
    (0, class_validator_1.IsEnum)(governance_permission_entity_1.GovernanceModule),
    __metadata("design:type", String)
], CreateGovernancePermissionDto.prototype, "module", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: Object.values(governance_permission_entity_1.GovernanceAction), description: 'Action to permit' }),
    (0, class_validator_1.IsEnum)(governance_permission_entity_1.GovernanceAction),
    __metadata("design:type", String)
], CreateGovernancePermissionDto.prototype, "action", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'User role name' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateGovernancePermissionDto.prototype, "role", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Specific resource type within module' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateGovernancePermissionDto.prototype, "resource_type", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Row-level security conditions' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], CreateGovernancePermissionDto.prototype, "conditions", void 0);
//# sourceMappingURL=create-governance-permission.dto.js.map