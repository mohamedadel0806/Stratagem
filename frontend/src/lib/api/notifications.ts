import { apiClient } from './client';

export type NotificationType =
  | 'workflow_approval_required'
  | 'workflow_approved'
  | 'workflow_rejected'
  | 'workflow_completed'
  | 'task_assigned'
  | 'task_due_soon'
  | 'deadline_approaching'
  | 'deadline_passed'
  | 'risk_escalated'
  | 'policy_review_required'
  | 'general';

export type NotificationPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface Notification {
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

export interface NotificationQuery {
  isRead?: boolean;
  type?: NotificationType;
  limit?: number;
}

export const notificationsApi = {
  getAll: async (query?: NotificationQuery): Promise<Notification[]> => {
    const params = new URLSearchParams();
    if (query?.isRead !== undefined) params.append('isRead', String(query.isRead));
    if (query?.type) params.append('type', query.type);
    if (query?.limit) params.append('limit', String(query.limit));
    
    const response = await apiClient.get<Notification[]>(`/notifications?${params.toString()}`);
    return response.data;
  },

  getUnreadCount: async (): Promise<number> => {
    const response = await apiClient.get<{ count: number }>('/notifications/unread-count');
    return response.data.count;
  },

  markAsRead: async (notificationId: string): Promise<void> => {
    await apiClient.patch(`/notifications/${notificationId}/read`);
  },

  markMultipleAsRead: async (notificationIds: string[]): Promise<void> => {
    await apiClient.post('/notifications/mark-read', { notificationIds });
  },

  markAllAsRead: async (): Promise<void> => {
    await apiClient.post('/notifications/mark-all-read');
  },

  delete: async (notificationId: string): Promise<void> => {
    await apiClient.delete(`/notifications/${notificationId}`);
  },
};











