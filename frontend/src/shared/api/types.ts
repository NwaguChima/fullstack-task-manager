export interface ApiResponse<T> {
  status: "success" | "fail" | "error";
  message?: string;
  data?: T;
  token?: string;
  results?: number;
  pagination?: {
    currentPage: number;
    totalPages: number;
    totalTasks: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface ApiError {
  message: string;
  status?: number;
  code?: string;
}

export interface RequestConfig {
  headers?: Record<string, string>;
  timeout?: number;
}
