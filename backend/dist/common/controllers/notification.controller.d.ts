import { NotificationService } from '../services/notification.service';
import { NotificationResponseDto, NotificationQueryDto, MarkReadDto } from '../dto/notification.dto';
import { CurrentUserData } from '../../auth/decorators/current-user.decorator';
export declare class NotificationController {
    private readonly notificationService;
    constructor(notificationService: NotificationService);
    getMyNotifications(user: CurrentUserData, query: NotificationQueryDto): Promise<NotificationResponseDto[]>;
    getUnreadCount(user: CurrentUserData): Promise<{
        count: number;
    }>;
    markAsRead(id: string, user: CurrentUserData): Promise<{
        message: string;
    }>;
    markMultipleAsRead(dto: MarkReadDto, user: CurrentUserData): Promise<{
        message: string;
    }>;
    markAllAsRead(user: CurrentUserData): Promise<{
        message: string;
    }>;
    delete(id: string, user: CurrentUserData): Promise<{
        message: string;
    }>;
}
