// hooks/useTasks.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { apiClient } from "../../../shared/api/client";
import type {
  CreateTaskRequest,
  Task,
  TaskInsights,
  TaskQuery,
  TasksResponse,
  UpdateTaskRequest,
} from "../../../types/tasks";
import type { ApiResponse } from "../../../shared/api/types";

export const useTasks = (query: TaskQuery = {}) => {
  return useQuery({
    queryKey: ["tasks", query],
    queryFn: async (): Promise<ApiResponse<TasksResponse>> => {
      const params = new URLSearchParams();

      if (query.status) params.append("status", query.status);
      if (query.page) params.append("page", query.page.toString());
      if (query.limit) params.append("limit", query.limit.toString());
      if (query.sort) params.append("sort", query.sort);

      const queryString = params.toString();
      const url = `/v1/tasks${queryString ? `?${queryString}` : ""}`;

      return apiClient.get<TasksResponse>(url);
    },
    select: (data) => data,
  });
};

// Fetch single task
export const useTask = (id: string) => {
  return useQuery({
    queryKey: ["task", id],
    queryFn: (): Promise<ApiResponse<{ task: Task }>> =>
      apiClient.get<{ task: Task }>(`/v1/tasks/${id}`),
    select: (data) => data.data?.task,
    enabled: !!id,
  });
};

// Create task
export const useCreateTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (
      taskData: CreateTaskRequest,
    ): Promise<ApiResponse<{ task: Task }>> =>
      apiClient.post<{ task: Task }>("/v1/tasks", taskData),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: ["task-insights"] });

      toast.success("Task created successfully!");
      return response.data?.task;
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to create task");
    },
  });
};

// Update task
export const useUpdateTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: UpdateTaskRequest;
    }): Promise<ApiResponse<{ task: Task }>> =>
      apiClient.patch<{ task: Task }>(`/v1/tasks/${id}`, data),
    onSuccess: (response, variables) => {
      queryClient.setQueryData(["task", variables.id], response);

      // Invalidate tasks queries to refetch
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: ["task-insights"] });

      toast.success("Task updated successfully!");
      return response.data?.task;
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to update task");
    },
  });
};

// Delete task
export const useDeleteTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string): Promise<ApiResponse<null>> =>
      apiClient.delete(`/v1/tasks/${id}`),
    onSuccess: (_, id) => {
      queryClient.removeQueries({ queryKey: ["task", id] });

      // Invalidate tasks queries to refetch
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: ["task-insights"] });

      toast.success("Task deleted successfully!");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to delete task");
    },
  });
};

// Fetch task insights
export const useTaskInsights = () => {
  return useQuery({
    queryKey: ["task-insights"],
    queryFn: (): Promise<ApiResponse<{ insights: TaskInsights }>> =>
      apiClient.get("/v1/tasks/insights"),
    select: (data) => data.data?.insights,
  });
};

export const useTaskStatusCounts = () => {
  const { data: insights } = useTaskInsights();

  return {
    pending: insights?.statusCounts.pending || 0,
    inProgress: insights?.statusCounts["in-progress"] || 0,
    done: insights?.statusCounts.done || 0,
    total: insights?.totalTasks || 0,
    completionRate: insights?.completionRate || 0,
  };
};
