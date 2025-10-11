import { useQuery } from "@tanstack/react-query";
import { isUnauthorizedError } from "@/lib/authUtils";

export function useAuth() {
  const { data: user, isLoading, error } = useQuery({
    queryKey: ["/api/auth/user"],
    retry: false,
  });

  // If we get an unauthorized error, user is not authenticated
  const isAuthError = error && isUnauthorizedError(error as Error);

  return {
    user,
    isLoading,
    isAuthenticated: !!user && !isAuthError,
  };
}
