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
exports.MarkReadDto = exports.NotificationQueryDto = exports.NotificationResponseDto = exports.CreateNotificationDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const notification_entity_1 = require("../entities/notification.entity");
class CreateNotificationDto {
}
exports.CreateNotificationDto = CreateNotificationDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'User ID to notify' }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateNotificationDto.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: notification_entity_1.NotificationType, description: 'Type of notification' }),
    (0, class_validator_1.IsEnum)(notification_entity_1.NotificationType),
    __metadata("design:type", String)
], CreateNotificationDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: notification_entity_1.NotificationPriority, description: 'Priority level' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(notification_entity_1.NotificationPriority),
    __metadata("design:type", String)
], CreateNotificationDto.prototype, "priority", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Notification title' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateNotificationDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Notification message' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateNotificationDto.prototype, "message", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Related entity type' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateNotificationDto.prototype, "entityType", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Related entity ID' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateNotificationDto.prototype, "entityId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Action URL' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateNotificationDto.prototype, "actionUrl", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Additional metadata' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], CreateNotificationDto.prototype, "metadata", void 0);
class NotificationResponseDto {
}
exports.NotificationResponseDto = NotificationResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], NotificationResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], NotificationResponseDto.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: notification_entity_1.NotificationType }),
    __metadata("design:type", String)
], NotificationResponseDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: notification_entity_1.NotificationPriority }),
    __metadata("design:type", String)
], NotificationResponseDto.prototype, "priority", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], NotificationResponseDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], NotificationResponseDto.prototype, "message", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Boolean)
], NotificationResponseDto.prototype, "isRead", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], NotificationResponseDto.prototype, "entityType", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], NotificationResponseDto.prototype, "entityId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], NotificationResponseDto.prototype, "actionUrl", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Object)
], NotificationResponseDto.prototype, "metadata", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], NotificationResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], NotificationResponseDto.prototype, "readAt", void 0);
class NotificationQueryDto {
}
exports.NotificationQueryDto = NotificationQueryDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Filter by read status' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], NotificationQueryDto.prototype, "isRead", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: notification_entity_1.NotificationType, description: 'Filter by type' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(notification_entity_1.NotificationType),
    __metadata("design:type", String)
], NotificationQueryDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Limit results', default: 20 }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], NotificationQueryDto.prototype, "limit", void 0);
class MarkReadDto {
}
exports.MarkReadDto = MarkReadDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Array of notification IDs to mark as read' }),
    (0, class_validator_1.IsUUID)('4', { each: true }),
    __metadata("design:type", Array)
], MarkReadDto.prototype, "notificationIds", void 0);
//# sourceMappingURL=notification.dto.js.map