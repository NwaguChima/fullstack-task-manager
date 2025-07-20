import axios, {
  AxiosError,
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosResponse,
} from "axios";
import { type ApiResponse, type ApiError, type RequestConfig } from "./types";

class ApiClient {
  private instance: AxiosInstance;
  private baseURL: string;

  constructor(
    baseURL: string = process.env.REACT_APP_API_URL ||
      "http://localhost:8000/api",
  ) {
    this.baseURL = baseURL;

    this.instance = axios.create({
      baseURL: this.baseURL,
      timeout: 10000,
      headers: {
        "Content-Type": "application/json",
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    this.instance.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem("authToken");
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }

        if (process.env.NODE_ENV === "development") {
          console.log(`🚀 ${config.method?.toUpperCase()} ${config.url}`);
        }

        return config;
      },
      (error) => {
        return Promise.reject(error);
      },
    );

    this.instance.interceptors.response.use(
      (response: AxiosResponse) => {
        if (process.env.NODE_ENV === "development") {
          console.log(`✅ ${response.status} ${response.config.url}`);
        }
        return response;
      },
      (error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem("authToken");
          window.location.href = "/auth";
        }

        if (process.env.NODE_ENV === "development") {
          console.error(
            `❌ ${error.response?.status} ${error.config?.url}`,
            error.response?.data,
          );
        }

        return Promise.reject(this.normalizeError(error));
      },
    );
  }

  private normalizeError(
    error: AxiosError<{ message: string; code: string }>,
  ): ApiError {
    if (error.response) {
      return {
        message:
          error.response.data?.message ||
          error.response.statusText ||
          "An error occurred",
        status: error.response.status,
        code: error.response.data?.code,
      };
    } else if (error.request) {
      return {
        message: "Network error - please check your connection",
        status: 0,
      };
    } else {
      return {
        message: error.message || "An unexpected error occurred",
      };
    }
  }

  private async request<T>(config: AxiosRequestConfig): Promise<T> {
    const response = await this.instance.request<ApiResponse<T>>(config);
    return (response.data.data ?? response.data) as T;
  }

  async get<T>(url: string, config?: RequestConfig): Promise<T> {
    return this.request<T>({
      method: "GET",
      url,
      ...config,
    });
  }

  async post<T>(url: string, data?: T, config?: RequestConfig): Promise<T> {
    return this.request<T>({
      method: "POST",
      url,
      data,
      ...config,
    });
  }

  async put<T>(url: string, data?: T, config?: RequestConfig): Promise<T> {
    return this.request<T>({
      method: "PUT",
      url,
      data,
      ...config,
    });
  }

  async patch<T>(url: string, data?: T, config?: RequestConfig): Promise<T> {
    return this.request<T>({
      method: "PATCH",
      url,
      data,
      ...config,
    });
  }

  async delete<T>(url: string, config?: RequestConfig): Promise<T> {
    return this.request<T>({
      method: "DELETE",
      url,
      ...config,
    });
  }

  setAuthToken(token: string): void {
    localStorage.setItem("authToken", token);
  }

  clearAuthToken(): void {
    localStorage.removeItem("authToken");
  }

  setBaseURL(baseURL: string): void {
    this.baseURL = baseURL;
    this.instance.defaults.baseURL = baseURL;
  }
}

export const apiClient = new ApiClient();
