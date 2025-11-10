import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Stats, User, Bus, Route, Ride } from './admin-dashboard-interfaces';

// API Functions
export const fetchStats = async (): Promise<Stats> => {
  const response = await apiRequest('/api/admin/stats', 'GET');
  return response.json();
};

export const fetchUsers = async (status: string): Promise<User[]> => {
  const response = await apiRequest(`/api/admin/users?status=${status}`, 'GET');
  return response.json();
};

export const fetchBuses = async (status: string): Promise<Bus[]> => {
  const response = await apiRequest(`/api/admin/buses?status=${status}`, 'GET');
  return response.json();
};

export const fetchRoutes = async (status: string): Promise<Route[]> => {
  const response = await apiRequest(`/api/admin/routes?status=${status}`, 'GET');
  return response.json();
};

export const fetchRides = async (status: string): Promise<Ride[]> => {
  const response = await apiRequest(`/api/admin/rides?status=${status}`, 'GET');
  return response.json();
};

// Mutation Functions
export const approveDriverMutation = {
  mutationFn: async (userId: number): Promise<User> => {
    const response = await apiRequest(`/api/admin/users/${userId}/approve-driver`, 'POST');
    return response.json();
  },
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ["users"] });
    queryClient.invalidateQueries({ queryKey: ["adminStats"] });
    const { toast } = useToast();
    toast({
      title: "Motorista aprovado",
      description: "O usuário agora é um motorista.",
    });
  },
};

export const revokeDriverMutation = {
  mutationFn: async (userId: number): Promise<User> => {
    const response = await apiRequest(`/api/admin/users/${userId}/revoke-driver`, 'POST');
    return response.json();
  },
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ["users"] });
    queryClient.invalidateQueries({ queryKey: ["adminStats"] });
    const { toast } = useToast();
    toast({
      title: "Status de motorista revogado",
      description: "O usuário não é mais um motorista.",
    });
  },
};

export const updateBusStatusMutation = {
  mutationFn: async ({ busId, isActive }: { busId: number; isActive: boolean }): Promise<Bus> => {
    const response = await apiRequest(`/api/admin/buses/${busId}`, 'PATCH', { isActive });
    return response.json();
  },
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ["buses"] });
    queryClient.invalidateQueries({ queryKey: ["adminStats"] });
    const { toast } = useToast();
    toast({
      title: "Status atualizado",
      description: "O status do ônibus foi atualizado com sucesso.",
    });
  },
};

export const updateRouteMutation = {
  mutationFn: async ({
    routeId,
    data,
  }: {
    routeId: number;
    data: Partial<Route>;
  }): Promise<Route> => {
    const response = await apiRequest(`/api/admin/routes/${routeId}`, 'PATCH', data);
    return response.json();
  },
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ["routes"] });
    queryClient.invalidateQueries({ queryKey: ["adminStats"] });
    const { toast } = useToast();
    toast({
      title: "Rota atualizada",
      description: "A rota foi atualizada com sucesso.",
    });
  },
};

export const fetchUniversities = async () => {
  const response = await apiRequest('/api/admin/universities', 'GET');
  return response.json();
};

export const createUniversityMutation = async (data: { name: string; code: string; address: string }) => {
  const response = await apiRequest('/api/admin/universities', 'POST', data);
  return response.json();
};

export const deleteUniversityMutation = async (id: number) => {
  const response = await apiRequest(`/api/admin/universities/${id}`, 'DELETE');
  return response.json();
};