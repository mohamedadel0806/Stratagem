import { User } from '../../users/entities/user.entity';
import { Alert } from './alert.entity';
export declare enum AlertLogAction {
    CREATED = "created",
    ACKNOWLEDGED = "acknowledged",
    RESOLVED = "resolved",
    DISMISSED = "dismissed",
    ESCALATED = "escalated",
    NOTIFIED = "notified"
}
export declare class AlertLog {
    id: string;
    alertId: string;
    alert: Alert;
    action: AlertLogAction;
    userId: string;
    user: User;
    details: string;
    metadata: Record<string, any>;
    createdAt: Date;
}
