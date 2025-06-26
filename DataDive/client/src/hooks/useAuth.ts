import { useQuery } from "@tanstack/react-query";

interface User {
  id: number;
  email: string;
  name: string;
}

export function useAuth() {
  const { data: authData, isLoading } = useQuery<{ user: User } | null>({
    queryKey: ["/api/auth/user"],
    retry: false,
  });

  return {
    user: authData?.user || null,
    isLoading,
    isAuthenticated: !!authData?.user,
  };
}
