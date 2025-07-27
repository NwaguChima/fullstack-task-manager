import { createElement, useEffect, type FC } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStatus } from "../../features/auth/api/hooks/use-auth";

export function withAuthGuard<T>(Component: FC<any>) {
  return function WrappedComponent(props: T) {
    const { isAuthenticated } = useAuthStatus();
    const navigate = useNavigate();

    useEffect(() => {
      if (!isAuthenticated) {
        navigate("/auth", { replace: true });
      }
    }, [isAuthenticated, navigate]);

    return isAuthenticated ? createElement(Component, props) : null;
  };
}
