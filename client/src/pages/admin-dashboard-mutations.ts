import { apiRequest } from '@/lib/utils';
import type { Stats, User, Bus, Route, Ride } from './admin-dashboard-interfaces';

// Stats
export const fetchStats = async (): Promise<Stats> => {
  const response = await apiRequest('/api/admin/stats');
  return response.json();
};

// Users
export const fetchUsers = async (status: string): Promise<User[]> => {
  const response = await apiRequest(`/api/admin/users?status=${status}`);
  return response.json();
};

export const approveDriverMutation = async (userId: string) => {
  const response = await apiRequest(`/api/admin/users/${userId}/approve-driver`, {
    method: "POST",
  });
  return response.json();
};

export const revokeDriverMutation = async (userId: string) => {
  const response = await apiRequest(`/api/admin/users/${userId}/revoke-driver`, {
    method: "POST",
  });
  return response.json();
};

// Buses
export const fetchBuses = async (status: string): Promise<Bus[]> => {
  const response = await apiRequest(`/api/admin/buses?status=${status}`);
  return response.json();
};

export const updateBusStatusMutation = async (busId: string, isActive: boolean) => {
  const response = await apiRequest(`/api/admin/buses/${busId}`, {
    method: "PATCH",
    body: { isActive },
  });
  return response.json();
};

// Routes
export const fetchRoutes = async (status: string): Promise<Route[]> => {
  const response = await apiRequest(`/api/admin/routes?status=${status}`);
  return response.json();
};

export const updateRouteMutation = async (routeId: string, data: Partial<Route>) => {
  const response = await apiRequest(`/api/admin/routes/${routeId}`, {
    method: "PATCH",
    body: data,
  });
  return response.json();
};

// Rides
export const fetchRides = async (status: string): Promise<Ride[]> => {
  const response = await apiRequest(`/api/admin/rides?status=${status}`);
  return response.json();
};

// Universities
export const fetchUniversities = async () => {
  const response = await apiRequest('/api/universities');
  return response.json();
};

export const createUniversityMutation = async (data: { name: string; code: string; address?: string }) => {
  const response = await apiRequest('/api/admin/universities', {
    method: 'POST',
    body: data,
  });
  return response.json();
};

export const deleteUniversityMutation = async (id: number) => {
  const response = await apiRequest(`/api/admin/universities/${id}`, {
    method: 'DELETE',
  });
  return response.json();
};