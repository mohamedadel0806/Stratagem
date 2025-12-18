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
exports.BusinessApplicationQueryDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const business_application_entity_1 = require("../entities/business-application.entity");
class BusinessApplicationQueryDto {
}
exports.BusinessApplicationQueryDto = BusinessApplicationQueryDto;
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], BusinessApplicationQueryDto.prototype, "search", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, description: 'Application type (string)' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], BusinessApplicationQueryDto.prototype, "applicationType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: business_application_entity_1.CriticalityLevel, required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(business_application_entity_1.CriticalityLevel),
    __metadata("design:type", String)
], BusinessApplicationQueryDto.prototype, "criticalityLevel", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, description: 'Business unit ID (UUID)' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], BusinessApplicationQueryDto.prototype, "businessUnit", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, description: 'Owner ID (UUID)' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], BusinessApplicationQueryDto.prototype, "ownerId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, description: 'Filter applications missing version number' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Boolean),
    __metadata("design:type", Boolean)
], BusinessApplicationQueryDto.prototype, "missingVersion", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, description: 'Filter applications missing patch level' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Boolean),
    __metadata("design:type", Boolean)
], BusinessApplicationQueryDto.prototype, "missingPatch", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, description: 'Filter by security test status: no-test, overdue, failed, passed' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], BusinessApplicationQueryDto.prototype, "securityTestStatus", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, default: 1 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], BusinessApplicationQueryDto.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, default: 20 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], BusinessApplicationQueryDto.prototype, "limit", void 0);
//# sourceMappingURL=business-application-query.dto.js.map