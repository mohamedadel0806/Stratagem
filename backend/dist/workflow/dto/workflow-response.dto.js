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
exports.WorkflowResponseDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const workflow_entity_1 = require("../entities/workflow.entity");
class WorkflowResponseDto {
}
exports.WorkflowResponseDto = WorkflowResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], WorkflowResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], WorkflowResponseDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    __metadata("design:type", String)
], WorkflowResponseDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: workflow_entity_1.WorkflowType }),
    __metadata("design:type", String)
], WorkflowResponseDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: workflow_entity_1.WorkflowStatus }),
    __metadata("design:type", String)
], WorkflowResponseDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: workflow_entity_1.WorkflowTrigger }),
    __metadata("design:type", String)
], WorkflowResponseDto.prototype, "trigger", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: workflow_entity_1.EntityType }),
    __metadata("design:type", String)
], WorkflowResponseDto.prototype, "entityType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, type: Object }),
    __metadata("design:type", Object)
], WorkflowResponseDto.prototype, "conditions", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Object }),
    __metadata("design:type", Object)
], WorkflowResponseDto.prototype, "actions", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    __metadata("design:type", Number)
], WorkflowResponseDto.prototype, "daysBeforeDeadline", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], WorkflowResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], WorkflowResponseDto.prototype, "updatedAt", void 0);
//# sourceMappingURL=workflow-response.dto.js.map