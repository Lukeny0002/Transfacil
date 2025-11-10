import { useQuery } from "@tanstack/react-query";
import { isUnauthorizedError } from "@/lib/authUtils";

interface User {
  id: string;
  email: string;
  isAdmin?: boolean;
  isDriver?: boolean;
  firstName?: string;
  lastName?: string;
  profileImageUrl?: string;
}

export function useAuth() {
  const { data: user, isLoading, error } = useQuery<User>({
    queryKey: ["/api/auth/user"],
    retry: false,
  });

  // If we get an unauthorized error, user is not authenticated
  const isAuthError = error && isUnauthorizedError(error as Error);

  const isAdmin = user?.isAdmin ?? false;
  const isDriver = user?.isDriver ?? false;

  return {
    user,
    isLoading,
    isAuthenticated: !!user && !isAuthError,
    isAdmin,
    isDriver
  };
}
