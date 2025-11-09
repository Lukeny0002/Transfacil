import { eq, and, gte, lte } from "drizzle-orm";
import { DatabaseStorage } from "./storage";
import { bookings, buses, rides, routes, students, users, universities } from "@shared/schema";

interface RideFilters {
  status?: string;
  fromDate?: string;
  toDate?: string;
}

interface BusFilters {
  status?: string;
}

interface RouteFilters {
  status?: string;
}

// Storage extensions
export class AdminDatabaseStorage {
  constructor(protected db: any) {}
  // User Stats
  async countUsers() {
    const result = await this.db.select({ count: this.db.fn.count() }).from(users);
    return parseInt(result[0].count.toString());
  }

  async countActiveStudents() {
    const result = await this.db
      .select({ count: this.db.fn.count() })
      .from(students)
      .where(eq(students.isActive, true));
    return parseInt(result[0].count.toString());
  }

  async countPendingDrivers() {
    const result = await this.db
      .select({ count: this.db.fn.count() })
      .from(users)
      .where(eq(users.driverPending, true));
    return parseInt(result[0].count.toString());
  }

  async countActiveDrivers() {
    const result = await this.db
      .select({ count: this.db.fn.count() })
      .from(users)
      .where(eq(users.isDriver, true));
    return parseInt(result[0].count.toString());
  }

  // Funções para gerenciar universidades
  async getAllUniversities() {
    return await this.db.select().from(universities).orderBy(universities.name);
  }

  async createUniversity({ name, code, address }: { name: string; code: string; address?: string }) {
    const result = await this.db
      .insert(universities)
      .values({ name, code, address })
      .returning();
    return result[0];
  }

  async updateUniversity(id: number, updates: { name?: string; code?: string; address?: string }) {
    const result = await this.db
      .update(universities)
      .set(updates)
      .where(eq(universities.id, id))
      .returning();
    return result[0];
  }

  async deleteUniversity(id: number) {
    return await this.db
      .delete(universities)
      .where(eq(universities.id, id))
      .returning();
  }

  async countTotalRides() {
    const result = await this.db.select({ count: this.db.fn.count() }).from(rides);
    return parseInt(result[0].count.toString());
  }

  async countActiveRoutes() {
    const result = await this.db
      .select({ count: this.db.fn.count() })
      .from(routes)
      .where(eq(routes.isActive, true));
    return parseInt(result[0].count.toString());
  }

  async countActiveBuses() {
    const result = await this.db
      .select({ count: this.db.fn.count() })
      .from(buses)
      .where(eq(buses.isActive, true));
    return parseInt(result[0].count.toString());
  }

  // User Management
  async getRecentUsers(limit = 10) {
    return this.db.select().from(users).orderBy(users.createdAt).limit(limit);
  }

  async getAllUsers(status?: string) {
    let query = this.db.select().from(users).orderBy(users.createdAt);

    if (status === 'active') {
      query = query.where(eq(users.isActive, true));
    } else if (status === 'inactive') {
      query = query.where(eq(users.isActive, false));
    } else if (status === 'pending') {
      query = query.where(eq(users.driverPending, true));
    }

    return query;
  }

  async updateUserDriverStatus(userId: string, isApproved: boolean) {
    await this.db
      .update(users)
      .set({
        isDriver: isApproved,
        driverPending: false,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId));
  }

  // Ride Management
  async getAllRides(filters: RideFilters = {}) {
    const { status, fromDate, toDate } = filters;
    let query = this.db.select().from(rides);

    if (status) {
      query = query.where(eq(rides.status, status));
    }

    if (fromDate) {
      query = query.where(gte(rides.startTime, new Date(fromDate)));
    }

    if (toDate) {
      query = query.where(lte(rides.startTime, new Date(toDate)));
    }

    return query;
  }

  // Bus Management
  async createBus(data: any) {
    return this.db.insert(buses).values(data).returning();
  }

  async updateBusStatus(busId: number, isActive: boolean) {
    return this.db
      .update(buses)
      .set({ isActive, updatedAt: new Date() })
      .where(eq(buses.id, busId))
      .returning();
  }

  async getAllBuses(filters: BusFilters = {}) {
    const { status } = filters;
    let query = this.db.select().from(buses);

    if (status === 'active') {
      query = query.where(eq(buses.isActive, true));
    } else if (status === 'inactive') {
      query = query.where(eq(buses.isActive, false));
    }

    return query;
  }

  // Route Management
  async createRoute(data: any) {
    return this.db.insert(routes).values(data).returning();
  }

  async updateRoute(routeId: number, data: any) {
    return this.db
      .update(routes)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(routes.id, routeId))
      .returning();
  }

  async getAllRoutes(filters: RouteFilters = {}) {
    const { status } = filters;
    let query = this.db.select().from(routes);

    if (status === 'active') {
      query = query.where(eq(routes.isActive, true));
    } else if (status === 'inactive') {
      query = query.where(eq(routes.isActive, false));
    }

    return query;
  }

  // University management
  async createUniversity(data: { name: string; code: string; address?: string }) {
    const [uni] = await this.db.insert(universities).values(data).returning();
    return uni;
  }

  async deleteUniversity(id: number) {
    await this.db.delete(universities).where(eq(universities.id, id));
    return { success: true };
  }
}