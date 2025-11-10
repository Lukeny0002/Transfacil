import { apiRequest as apiReq } from '@/lib/queryClient';
import type { Stats, User, Bus, Route, Ride } from './admin-dashboard-interfaces';

// Helper to handle GET requests
const get = async (url: string) => {
  const res = await fetch(url, { credentials: 'include' });
  if (!res.ok) throw new Error(`${res.status}: ${res.statusText}`);
  return res.json();
};

// Stats
export const fetchStats = async (): Promise<Stats> => {
  return get('/api/admin/stats');
};

// Users
export const fetchUsers = async (status: string): Promise<User[]> => {
  return get(`/api/admin/users?status=${status}`);
};

export const approveDriverMutation = async (userId: string) => {
  await apiReq("POST", `/api/admin/users/${userId}/approve-driver`);
};

export const revokeDriverMutation = async (userId: string) => {
  await apiReq("POST", `/api/admin/users/${userId}/revoke-driver`);
};

// Buses
export const fetchBuses = async (status: string): Promise<Bus[]> => {
  return get(`/api/admin/buses?status=${status}`);
};

export const updateBusStatusMutation = async (busId: string, isActive: boolean) => {
  await apiReq("PATCH", `/api/admin/buses/${busId}`, { isActive });
};

// Routes
export const fetchRoutes = async (status: string): Promise<Route[]> => {
  return get(`/api/admin/routes?status=${status}`);
};

export const updateRouteMutation = async (routeId: string, data: Partial<Route>) => {
  await apiReq("PATCH", `/api/admin/routes/${routeId}`, data);
};

// Rides
export const fetchRides = async (status: string): Promise<Ride[]> => {
  return get(`/api/admin/rides?status=${status}`);
};

// Universities
export const fetchUniversities = async () => {
  return get('/api/universities');
};

export const createUniversityMutation = async (data: { name: string; code: string; address?: string }) => {
  await apiReq('POST', '/api/admin/universities', data);
};

export const deleteUniversityMutation = async (id: number) => {
  await apiReq('DELETE', `/api/admin/universities/${id}`);
};

// Students
export const fetchPendingStudents = async () => {
  return get('/api/admin/students/pending');
};

export const approveStudentMutation = async (studentId: number) => {
  await apiReq('POST', `/api/admin/students/${studentId}/approve`);
};

export const rejectStudentMutation = async (studentId: number, reason: string) => {
  await apiReq('POST', `/api/admin/students/${studentId}/reject`, { reason });
};