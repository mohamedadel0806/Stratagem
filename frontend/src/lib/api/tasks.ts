import { apiClient } from './client';

export interface Task {
  id: string;
  title: string;
  description?: string;
  taskType: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  status: 'todo' | 'in_progress' | 'review' | 'completed' | 'cancelled';
  dueDate: string;
  assignedTo?: string;
  relatedEntityType?: string;
  relatedEntityId?: string;
}

export const tasksApi = {
  getPending: async (): Promise<Task[]> => {
    try {
      const response = await apiClient.get<Task[]>('/tasks?status=pending');
      return response.data;
    } catch (error: any) {
      console.error('Failed to fetch pending tasks:', error);
      // Return empty array as fallback if API fails
      return [];
    }
  },
};

