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
exports.CreateWorkflowDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const workflow_entity_1 = require("../entities/workflow.entity");
class CreateWorkflowDto {
}
exports.CreateWorkflowDto = CreateWorkflowDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateWorkflowDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateWorkflowDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: workflow_entity_1.WorkflowType }),
    (0, class_validator_1.IsEnum)(workflow_entity_1.WorkflowType),
    __metadata("design:type", String)
], CreateWorkflowDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: workflow_entity_1.WorkflowTrigger }),
    (0, class_validator_1.IsEnum)(workflow_entity_1.WorkflowTrigger),
    __metadata("design:type", String)
], CreateWorkflowDto.prototype, "trigger", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: workflow_entity_1.EntityType }),
    (0, class_validator_1.IsEnum)(workflow_entity_1.EntityType),
    __metadata("design:type", String)
], CreateWorkflowDto.prototype, "entityType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, type: Object }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], CreateWorkflowDto.prototype, "conditions", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Object }),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], CreateWorkflowDto.prototype, "actions", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(365),
    __metadata("design:type", Number)
], CreateWorkflowDto.prototype, "daysBeforeDeadline", void 0);
//# sourceMappingURL=create-workflow.dto.js.map