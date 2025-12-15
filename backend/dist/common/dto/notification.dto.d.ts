import { NotificationType, NotificationPriority } from '../entities/notification.entity';
export declare class CreateNotificationDto {
    userId: string;
    type: NotificationType;
    priority?: NotificationPriority;
    title: string;
    message: string;
    entityType?: string;
    entityId?: string;
    actionUrl?: string;
    metadata?: Record<string, any>;
}
export declare class NotificationResponseDto {
    id: string;
    userId: string;
    type: NotificationType;
    priority: NotificationPriority;
    title: string;
    message: string;
    isRead: boolean;
    entityType?: string;
    entityId?: string;
    actionUrl?: string;
    metadata?: Record<string, any>;
    createdAt: string;
    readAt?: string;
}
export declare class NotificationQueryDto {
    isRead?: boolean;
    type?: NotificationType;
    limit?: number;
}
export declare class MarkReadDto {
    notificationIds: string[];
}
