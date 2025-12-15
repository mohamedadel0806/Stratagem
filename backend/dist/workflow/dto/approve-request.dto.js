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
exports.ApproveRequestDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const workflow_approval_entity_1 = require("../entities/workflow-approval.entity");
const capture_signature_dto_1 = require("./capture-signature.dto");
class ApproveRequestDto {
}
exports.ApproveRequestDto = ApproveRequestDto;
__decorate([
    (0, swagger_1.ApiProperty)({ enum: workflow_approval_entity_1.ApprovalStatus }),
    (0, class_validator_1.IsEnum)(workflow_approval_entity_1.ApprovalStatus),
    __metadata("design:type", String)
], ApproveRequestDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ApproveRequestDto.prototype, "comments", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, description: 'Digital signature data' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => capture_signature_dto_1.CaptureSignatureDto),
    __metadata("design:type", capture_signature_dto_1.CaptureSignatureDto)
], ApproveRequestDto.prototype, "signature", void 0);
//# sourceMappingURL=approve-request.dto.js.map