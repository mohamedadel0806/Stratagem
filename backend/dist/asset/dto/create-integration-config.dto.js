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
exports.CreateIntegrationConfigDto = void 0;
const class_validator_1 = require("class-validator");
const integration_config_entity_1 = require("../entities/integration-config.entity");
class CreateIntegrationConfigDto {
}
exports.CreateIntegrationConfigDto = CreateIntegrationConfigDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateIntegrationConfigDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(integration_config_entity_1.IntegrationType),
    __metadata("design:type", String)
], CreateIntegrationConfigDto.prototype, "integrationType", void 0);
__decorate([
    (0, class_validator_1.IsUrl)(),
    __metadata("design:type", String)
], CreateIntegrationConfigDto.prototype, "endpointUrl", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(integration_config_entity_1.AuthenticationType),
    __metadata("design:type", String)
], CreateIntegrationConfigDto.prototype, "authenticationType", void 0);
__decorate([
    (0, class_validator_1.ValidateIf)((o) => o.authenticationType === integration_config_entity_1.AuthenticationType.API_KEY),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateIntegrationConfigDto.prototype, "apiKey", void 0);
__decorate([
    (0, class_validator_1.ValidateIf)((o) => o.authenticationType === integration_config_entity_1.AuthenticationType.BEARER_TOKEN),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateIntegrationConfigDto.prototype, "bearerToken", void 0);
__decorate([
    (0, class_validator_1.ValidateIf)((o) => o.authenticationType === integration_config_entity_1.AuthenticationType.BASIC_AUTH),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateIntegrationConfigDto.prototype, "username", void 0);
__decorate([
    (0, class_validator_1.ValidateIf)((o) => o.authenticationType === integration_config_entity_1.AuthenticationType.BASIC_AUTH),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateIntegrationConfigDto.prototype, "password", void 0);
__decorate([
    (0, class_validator_1.IsObject)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], CreateIntegrationConfigDto.prototype, "fieldMapping", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateIntegrationConfigDto.prototype, "syncInterval", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(integration_config_entity_1.ConflictResolutionStrategy),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateIntegrationConfigDto.prototype, "conflictResolutionStrategy", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateIntegrationConfigDto.prototype, "notes", void 0);
//# sourceMappingURL=create-integration-config.dto.js.map