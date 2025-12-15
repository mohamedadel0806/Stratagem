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
exports.TaskResponseDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const task_entity_1 = require("../entities/task.entity");
class TaskResponseDto {
}
exports.TaskResponseDto = TaskResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], TaskResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], TaskResponseDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    __metadata("design:type", String)
], TaskResponseDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: task_entity_1.TaskType }),
    __metadata("design:type", String)
], TaskResponseDto.prototype, "taskType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: task_entity_1.TaskPriority }),
    __metadata("design:type", String)
], TaskResponseDto.prototype, "priority", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: task_entity_1.TaskStatus }),
    __metadata("design:type", String)
], TaskResponseDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], TaskResponseDto.prototype, "dueDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    __metadata("design:type", String)
], TaskResponseDto.prototype, "assignedTo", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    __metadata("design:type", String)
], TaskResponseDto.prototype, "relatedEntityType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    __metadata("design:type", String)
], TaskResponseDto.prototype, "relatedEntityId", void 0);
//# sourceMappingURL=task-response.dto.js.map