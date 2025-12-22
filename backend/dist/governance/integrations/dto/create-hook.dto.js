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
exports.CreateIntegrationHookDto = void 0;
const class_validator_1 = require("class-validator");
const integration_hook_entity_1 = require("../entities/integration-hook.entity");
class CreateIntegrationHookDto {
}
exports.CreateIntegrationHookDto = CreateIntegrationHookDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateIntegrationHookDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateIntegrationHookDto.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(integration_hook_entity_1.HookType),
    __metadata("design:type", String)
], CreateIntegrationHookDto.prototype, "type", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(integration_hook_entity_1.HookAction),
    __metadata("design:type", String)
], CreateIntegrationHookDto.prototype, "action", void 0);
__decorate([
    (0, class_validator_1.IsObject)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], CreateIntegrationHookDto.prototype, "config", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], CreateIntegrationHookDto.prototype, "isActive", void 0);
//# sourceMappingURL=create-hook.dto.js.map