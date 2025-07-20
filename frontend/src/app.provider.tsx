import { type ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "react-query";

interface AppProviderProps {
  children?: ReactNode;
}

export function AppProviders({ children }: AppProviderProps) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 2 * 60 * 1000,
      },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
