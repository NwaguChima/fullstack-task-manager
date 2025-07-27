import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import type { LoginRequest, SignupRequest, User } from "../../../../types/auth";
import { authService } from "../services/authService";
import { ROUTES } from "../../../../shared/constants/routes";

export const useLogin = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (credentials: LoginRequest) => authService.login(credentials),
    onSuccess: (data) => {
      toast.success("Login successful!");
      queryClient.setQueryData(["user"], data.data?.user);

      navigate(ROUTES.ROOT);
    },
    onError: (error: any) => {
      toast.error(error.message || "Login failed. Please try again.");
    },
  });
};

export const useSignup = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userData: SignupRequest) => authService.signup(userData),
    onSuccess: (data) => {
      toast.success("Account created successfully!");
      queryClient.setQueryData(["user"], data.data?.user);
      navigate(ROUTES.ROOT);
    },
    onError: (error: any) => {
      toast.error(error.message || "Signup failed. Please try again.");
    },
  });
};

export const useLogout = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => {
      authService.logout();
      return Promise.resolve();
    },
    onSuccess: () => {
      queryClient.clear();
      toast.success("Logged out successfully");
      navigate(`/${ROUTES.AUTH}`);
    },
  });
};

export const useUser = () => {
  // should be managed better, but this works as a quick work around.
  return useQuery<User | null>({
    queryKey: ["user"],
    queryFn: () => {
      return null;
    },
    staleTime: Infinity,
    enabled: authService.isAuthenticated(),
  });
};

export const useAuthStatus = () => {
  // would normally get the user from the backend, or send it back alongside the auth endpoints
  const { data: user } = useUser();

  return {
    isAuthenticated: authService.isAuthenticated(),
    user,
    isLoading: false,
  };
};
