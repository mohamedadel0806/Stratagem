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
exports.PolicyHierarchyWithStatsDto = exports.SetPolicyParentDto = exports.PolicyHierarchyDto = exports.PolicyTreeNodeDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class PolicyTreeNodeDto {
}
exports.PolicyTreeNodeDto = PolicyTreeNodeDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Policy ID' }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], PolicyTreeNodeDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Policy title' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PolicyTreeNodeDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Policy type' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PolicyTreeNodeDto.prototype, "policy_type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Policy status' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PolicyTreeNodeDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Policy version' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PolicyTreeNodeDto.prototype, "version", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Parent policy ID' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], PolicyTreeNodeDto.prototype, "parent_policy_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Child policies (immediate children only)' }),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], PolicyTreeNodeDto.prototype, "children", void 0);
class PolicyHierarchyDto {
}
exports.PolicyHierarchyDto = PolicyHierarchyDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Current policy ID' }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], PolicyHierarchyDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Policy title' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PolicyHierarchyDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Policy type' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PolicyHierarchyDto.prototype, "policy_type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Policy status' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PolicyHierarchyDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Policy version' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PolicyHierarchyDto.prototype, "version", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Parent policy info' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", PolicyTreeNodeDto)
], PolicyHierarchyDto.prototype, "parent", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Child policies (immediate children)' }),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], PolicyHierarchyDto.prototype, "children", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'All ancestor policies (from root to parent)' }),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], PolicyHierarchyDto.prototype, "ancestors", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'All descendant policies (all children, grandchildren, etc.)' }),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], PolicyHierarchyDto.prototype, "descendants", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Hierarchy level (0 for root)' }),
    __metadata("design:type", Number)
], PolicyHierarchyDto.prototype, "level", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Total descendants count' }),
    __metadata("design:type", Number)
], PolicyHierarchyDto.prototype, "descendantCount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Whether this is a root policy' }),
    __metadata("design:type", Boolean)
], PolicyHierarchyDto.prototype, "isRoot", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Whether this policy has children' }),
    __metadata("design:type", Boolean)
], PolicyHierarchyDto.prototype, "hasChildren", void 0);
class SetPolicyParentDto {
}
exports.SetPolicyParentDto = SetPolicyParentDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Parent policy ID (null to remove parent)' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], SetPolicyParentDto.prototype, "parent_policy_id", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Reason for hierarchy change' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SetPolicyParentDto.prototype, "reason", void 0);
class PolicyHierarchyWithStatsDto extends PolicyHierarchyDto {
}
exports.PolicyHierarchyWithStatsDto = PolicyHierarchyWithStatsDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Total policies in hierarchy' }),
    __metadata("design:type", Number)
], PolicyHierarchyWithStatsDto.prototype, "totalPoliciesInHierarchy", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Average depth of children' }),
    __metadata("design:type", Number)
], PolicyHierarchyWithStatsDto.prototype, "averageDepth", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Maximum depth of tree' }),
    __metadata("design:type", Number)
], PolicyHierarchyWithStatsDto.prototype, "maxDepth", void 0);
//# sourceMappingURL=policy-hierarchy.dto.js.map