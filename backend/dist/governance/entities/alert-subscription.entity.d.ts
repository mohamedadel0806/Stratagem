import { User } from '../../users/entities/user.entity';
import { AlertType, AlertSeverity } from './alert.entity';
export declare enum NotificationChannel {
    IN_APP = "in_app",
    EMAIL = "email",
    SLACK = "slack"
}
export declare enum NotificationFrequency {
    IMMEDIATE = "immediate",
    DAILY = "daily",
    WEEKLY = "weekly"
}
export declare class AlertSubscription {
    id: string;
    userId: string;
    user: User;
    alertType: AlertType;
    severity: AlertSeverity;
    channels: NotificationChannel[];
    frequency: NotificationFrequency;
    isActive: boolean;
    filters: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}
