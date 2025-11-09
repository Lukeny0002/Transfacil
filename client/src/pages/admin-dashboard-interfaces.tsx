// Types for admin dashboard
export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  isActive: boolean;
  isAdmin: boolean;
  isDriver: boolean;
  driverPending: boolean;
  createdAt: string;
}

export interface Bus {
  id: string;
  number: string;
  capacity: number;
  isActive: boolean;
  routeId?: string;
}

export interface Route {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  stops: RouteStop[];
}

export interface RouteStop {
  id: string;
  name: string;
  order: number;
}

export interface Ride {
  id: string;
  driverId: string;
  fromLocation: string;
  toLocation: string;
  startTime: string;
  endTime?: string;
  availableSeats: number;
  status: 'available' | 'full' | 'completed' | 'cancelled';
}

export interface Stats {
  totalUsers: number;
  activeStudents: number;
  pendingDrivers: number;
  activeDrivers: number;
  totalRides: number;
  activeRoutes: number;
  activeBuses: number;
}

export interface University {
  id: number;
  name: string;
  code: string;
  address?: string;
  createdAt: string;
}

export interface Filters {
  userStatus: string;
  busStatus: string;
  routeStatus: string;
  rideStatus: string;
}