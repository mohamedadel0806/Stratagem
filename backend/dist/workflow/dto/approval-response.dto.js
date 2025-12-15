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
exports.ApprovalResponseDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const workflow_approval_entity_1 = require("../entities/workflow-approval.entity");
class ApprovalResponseDto {
}
exports.ApprovalResponseDto = ApprovalResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ApprovalResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ApprovalResponseDto.prototype, "workflowExecutionId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ApprovalResponseDto.prototype, "approverId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ApprovalResponseDto.prototype, "approverName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: workflow_approval_entity_1.ApprovalStatus }),
    __metadata("design:type", String)
], ApprovalResponseDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    __metadata("design:type", String)
], ApprovalResponseDto.prototype, "comments", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], ApprovalResponseDto.prototype, "stepOrder", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    __metadata("design:type", String)
], ApprovalResponseDto.prototype, "respondedAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ApprovalResponseDto.prototype, "createdAt", void 0);
//# sourceMappingURL=approval-response.dto.js.map