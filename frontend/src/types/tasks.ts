export const enum TaskStatus {
  PENDING = "pending",
  IN_PROGRESS = "in-progress",
  DONE = "done",
}

export interface TaskExtras {
  priority?: string;
  tags?: string[];
  dueDate?: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  extras?: TaskExtras;
  user: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTaskRequest {
  title: string;
  description?: string;
  status?: TaskStatus;
  extras?: TaskExtras;
}

export interface UpdateTaskRequest {
  title?: string;
  description?: string;
  status?: TaskStatus;
  extras?: TaskExtras;
}

export interface TaskQuery {
  status?: TaskStatus;
  page?: number;
  limit?: number;
  sort?: string;
}

export interface TasksResponse {
  tasks: Task[];
  results: number;
  pagination: {
    currentPage: number;
    totalPages: number;
    totalTasks: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface TaskInsights {
  totalTasks: number;
  statusCounts: {
    [TaskStatus.PENDING]: number;
    [TaskStatus.IN_PROGRESS]: number;
    done: number;
  };
  completionRate: number;
  tasksByStatus: {
    [TaskStatus.PENDING]: Task[];
    [TaskStatus.IN_PROGRESS]: Task[];
    [TaskStatus.DONE]: Task[];
  };
  recentTasks: Task[];
}
