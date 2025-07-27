import { apiClient } from "../../../../shared/api/client";
import type { ApiResponse } from "../../../../shared/api/types";
import type {
  AuthResponse,
  LoginRequest,
  SignupRequest,
} from "../../../../types/auth";

export const authService = {
  login: async (
    credentials: LoginRequest,
  ): Promise<ApiResponse<AuthResponse>> => {
    const response = await apiClient.post<AuthResponse>(
      "/v1/auth/login",
      credentials,
    );

    if (response?.token) {
      apiClient.setAuthToken(response?.token);
    }

    return response;
  },

  signup: async (
    userData: SignupRequest,
  ): Promise<ApiResponse<AuthResponse>> => {
    const response = await apiClient.post<AuthResponse>(
      "/v1/auth/signup",
      userData,
    );

    if (response?.token) {
      apiClient.setAuthToken(response?.token);
    }

    return response;
  },

  logout: () => {
    apiClient.clearAuthToken();
  },

  getStoredToken: (): string | null => {
    return localStorage.getItem("authToken");
  },

  isAuthenticated: (): boolean => {
    const token = localStorage.getItem("authToken");
    if (!token) return false;

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload.exp * 1000 > Date.now();
    } catch {
      return false;
    }
  },
};
