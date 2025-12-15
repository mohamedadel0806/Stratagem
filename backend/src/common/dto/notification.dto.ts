import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, IsUUID, IsBoolean } from 'class-validator';
import { NotificationType, NotificationPriority } from '../entities/notification.entity';

export class CreateNotificationDto {
  @ApiProperty({ description: 'User ID to notify' })
  @IsUUID()
  userId: string;

  @ApiProperty({ enum: NotificationType, description: 'Type of notification' })
  @IsEnum(NotificationType)
  type: NotificationType;

  @ApiPropertyOptional({ enum: NotificationPriority, description: 'Priority level' })
  @IsOptional()
  @IsEnum(NotificationPriority)
  priority?: NotificationPriority;

  @ApiProperty({ description: 'Notification title' })
  @IsString()
  title: string;

  @ApiProperty({ description: 'Notification message' })
  @IsString()
  message: string;

  @ApiPropertyOptional({ description: 'Related entity type' })
  @IsOptional()
  @IsString()
  entityType?: string;

  @ApiPropertyOptional({ description: 'Related entity ID' })
  @IsOptional()
  @IsUUID()
  entityId?: string;

  @ApiPropertyOptional({ description: 'Action URL' })
  @IsOptional()
  @IsString()
  actionUrl?: string;

  @ApiPropertyOptional({ description: 'Additional metadata' })
  @IsOptional()
  metadata?: Record<string, any>;
}

export class NotificationResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  userId: string;

  @ApiProperty({ enum: NotificationType })
  type: NotificationType;

  @ApiProperty({ enum: NotificationPriority })
  priority: NotificationPriority;

  @ApiProperty()
  title: string;

  @ApiProperty()
  message: string;

  @ApiProperty()
  isRead: boolean;

  @ApiPropertyOptional()
  entityType?: string;

  @ApiPropertyOptional()
  entityId?: string;

  @ApiPropertyOptional()
  actionUrl?: string;

  @ApiPropertyOptional()
  metadata?: Record<string, any>;

  @ApiProperty()
  createdAt: string;

  @ApiPropertyOptional()
  readAt?: string;
}

export class NotificationQueryDto {
  @ApiPropertyOptional({ description: 'Filter by read status' })
  @IsOptional()
  @IsBoolean()
  isRead?: boolean;

  @ApiPropertyOptional({ enum: NotificationType, description: 'Filter by type' })
  @IsOptional()
  @IsEnum(NotificationType)
  type?: NotificationType;

  @ApiPropertyOptional({ description: 'Limit results', default: 20 })
  @IsOptional()
  limit?: number;
}

export class MarkReadDto {
  @ApiProperty({ description: 'Array of notification IDs to mark as read' })
  @IsUUID('4', { each: true })
  notificationIds: string[];
}








