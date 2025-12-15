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
exports.CaptureSignatureDto = exports.SignatureMethod = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
var SignatureMethod;
(function (SignatureMethod) {
    SignatureMethod["DRAWN"] = "drawn";
    SignatureMethod["UPLOADED"] = "uploaded";
})(SignatureMethod || (exports.SignatureMethod = SignatureMethod = {}));
class CaptureSignatureDto {
}
exports.CaptureSignatureDto = CaptureSignatureDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Base64 encoded signature image' }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CaptureSignatureDto.prototype, "signatureData", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: SignatureMethod, description: 'Method used to capture signature' }),
    (0, class_validator_1.IsEnum)(SignatureMethod),
    __metadata("design:type", String)
], CaptureSignatureDto.prototype, "signatureMethod", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Additional metadata about the signature (IP, user agent, etc.)',
        required: false
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], CaptureSignatureDto.prototype, "signatureMetadata", void 0);
//# sourceMappingURL=capture-signature.dto.js.map