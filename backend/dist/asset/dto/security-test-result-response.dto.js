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
exports.SecurityTestResultResponseDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const security_test_result_entity_1 = require("../entities/security-test-result.entity");
class SecurityTestResultResponseDto {
}
exports.SecurityTestResultResponseDto = SecurityTestResultResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], SecurityTestResultResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: ['application', 'software'] }),
    __metadata("design:type", String)
], SecurityTestResultResponseDto.prototype, "assetType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], SecurityTestResultResponseDto.prototype, "assetId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: security_test_result_entity_1.TestType }),
    __metadata("design:type", String)
], SecurityTestResultResponseDto.prototype, "testType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], SecurityTestResultResponseDto.prototype, "testDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: security_test_result_entity_1.TestStatus }),
    __metadata("design:type", String)
], SecurityTestResultResponseDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], SecurityTestResultResponseDto.prototype, "testerName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], SecurityTestResultResponseDto.prototype, "testerCompany", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], SecurityTestResultResponseDto.prototype, "findingsCritical", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], SecurityTestResultResponseDto.prototype, "findingsHigh", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], SecurityTestResultResponseDto.prototype, "findingsMedium", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], SecurityTestResultResponseDto.prototype, "findingsLow", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], SecurityTestResultResponseDto.prototype, "findingsInfo", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: security_test_result_entity_1.SeverityLevel }),
    __metadata("design:type", String)
], SecurityTestResultResponseDto.prototype, "severity", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Number)
], SecurityTestResultResponseDto.prototype, "overallScore", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Boolean)
], SecurityTestResultResponseDto.prototype, "passed", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], SecurityTestResultResponseDto.prototype, "summary", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], SecurityTestResultResponseDto.prototype, "findings", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], SecurityTestResultResponseDto.prototype, "recommendations", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], SecurityTestResultResponseDto.prototype, "reportFileId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], SecurityTestResultResponseDto.prototype, "reportUrl", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Date)
], SecurityTestResultResponseDto.prototype, "remediationDueDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Boolean)
], SecurityTestResultResponseDto.prototype, "remediationCompleted", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Boolean)
], SecurityTestResultResponseDto.prototype, "retestRequired", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Date)
], SecurityTestResultResponseDto.prototype, "retestDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], SecurityTestResultResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], SecurityTestResultResponseDto.prototype, "updatedAt", void 0);
//# sourceMappingURL=security-test-result-response.dto.js.map