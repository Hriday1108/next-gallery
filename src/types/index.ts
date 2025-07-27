export type TaskStatus = 'To Do' | 'In Progress' | 'Completed';
export type TaskPriority = 'High' | 'Medium' | 'Low';

export interface Task {
  id: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
}

export const PRIORITIES: readonly TaskPriority[] = ['High', 'Medium', 'Low'];
export const STATUSES: readonly TaskStatus[] = ['To Do', 'In Progress', 'Completed'];
