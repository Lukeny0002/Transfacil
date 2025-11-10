import { eq, and, gte, lte, desc } from "drizzle-orm";
import { DatabaseStorage } from "./storage";
import { 
  bookings, buses, rides, routes, students, users, universities,
  subscriptions, subscriptionPlans, schedules, drivers, vehicles,
  events, eventBookings, paymentProofs
} from "@shared/schema";

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

  async countPendingStudents() {
    const result = await this.db
      .select({ count: this.db.fn.count() })
      .from(students)
      .where(eq(students.approvalStatus, 'pending'));
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

  // Student Approval Management
  async getPendingStudents() {
    return this.db
      .select()
      .from(students)
      .where(eq(students.approvalStatus, 'pending'))
      .orderBy(students.createdAt);
  }

  async approveStudent(studentId: number, adminUserId: string) {
    const result = await this.db
      .update(students)
      .set({
        approvalStatus: 'approved',
        approvedBy: adminUserId,
        approvedAt: new Date(),
      })
      .where(eq(students.id, studentId))
      .returning();
    return result[0];
  }

  async rejectStudent(studentId: number, adminUserId: string, reason: string) {
    const result = await this.db
      .update(students)
      .set({
        approvalStatus: 'rejected',
        approvedBy: adminUserId,
        approvedAt: new Date(),
        rejectionReason: reason,
      })
      .where(eq(students.id, studentId))
      .returning();
    return result[0];
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
      .set(data)
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

  // Subscription Management
  async getAllSubscriptions() {
    return this.db
      .select()
      .from(subscriptions)
      .orderBy(desc(subscriptions.createdAt));
  }

  async getStudentSubscriptions(studentId: number) {
    return this.db
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.studentId, studentId))
      .orderBy(desc(subscriptions.createdAt));
  }

  async updateSubscriptionStatus(subscriptionId: number, isActive: boolean) {
    return this.db
      .update(subscriptions)
      .set({ isActive })
      .where(eq(subscriptions.id, subscriptionId))
      .returning();
  }

  async getAllSubscriptionPlans() {
    return this.db.select().from(subscriptionPlans).orderBy(subscriptionPlans.name);
  }

  async createSubscriptionPlan(data: any) {
    return this.db.insert(subscriptionPlans).values(data).returning();
  }

  async updateSubscriptionPlan(planId: number, data: any) {
    return this.db
      .update(subscriptionPlans)
      .set(data)
      .where(eq(subscriptionPlans.id, planId))
      .returning();
  }

  // Schedule Management
  async getAllSchedules() {
    return this.db.select().from(schedules).orderBy(schedules.departureTime);
  }

  async createSchedule(data: any) {
    return this.db.insert(schedules).values(data).returning();
  }

  async updateSchedule(scheduleId: number, data: any) {
    return this.db
      .update(schedules)
      .set(data)
      .where(eq(schedules.id, scheduleId))
      .returning();
  }

  async deleteSchedule(scheduleId: number) {
    return this.db
      .delete(schedules)
      .where(eq(schedules.id, scheduleId))
      .returning();
  }

  // Driver & Vehicle Management
  async getAllDrivers() {
    return this.db.select().from(drivers).orderBy(desc(drivers.createdAt));
  }

  async getPendingDrivers() {
    return this.db
      .select()
      .from(drivers)
      .where(eq(drivers.approvalStatus, 'pending'))
      .orderBy(drivers.createdAt);
  }

  async approveDriver(driverId: number, adminUserId: string) {
    return this.db
      .update(drivers)
      .set({
        approvalStatus: 'approved',
        approvedBy: adminUserId,
        approvedAt: new Date(),
      })
      .where(eq(drivers.id, driverId))
      .returning();
  }

  async rejectDriver(driverId: number, adminUserId: string, reason: string) {
    return this.db
      .update(drivers)
      .set({
        approvalStatus: 'rejected',
        approvedBy: adminUserId,
        approvedAt: new Date(),
        rejectionReason: reason,
      })
      .where(eq(drivers.id, driverId))
      .returning();
  }

  async createDriver(data: any) {
    return this.db.insert(drivers).values(data).returning();
  }

  async updateDriver(driverId: number, data: any) {
    return this.db
      .update(drivers)
      .set(data)
      .where(eq(drivers.id, driverId))
      .returning();
  }

  async getAllVehicles() {
    return this.db.select().from(vehicles).orderBy(vehicles.plate);
  }

  async createVehicle(data: any) {
    return this.db.insert(vehicles).values(data).returning();
  }

  async updateVehicle(vehicleId: number, data: any) {
    return this.db
      .update(vehicles)
      .set(data)
      .where(eq(vehicles.id, vehicleId))
      .returning();
  }

  async deleteVehicle(vehicleId: number) {
    return this.db
      .delete(vehicles)
      .where(eq(vehicles.id, vehicleId))
      .returning();
  }

  // Event Management
  async getAllEvents() {
    return this.db.select().from(events).orderBy(desc(events.eventDate));
  }

  async getActiveEvents() {
    const now = new Date();
    return this.db
      .select()
      .from(events)
      .where(and(
        eq(events.isActive, true),
        gte(events.eventDate, now)
      ))
      .orderBy(events.eventDate);
  }

  async createEvent(data: any) {
    return this.db.insert(events).values(data).returning();
  }

  async updateEvent(eventId: number, data: any) {
    return this.db
      .update(events)
      .set(data)
      .where(eq(events.id, eventId))
      .returning();
  }

  async deleteEvent(eventId: number) {
    return this.db
      .delete(events)
      .where(eq(events.id, eventId))
      .returning();
  }

  async getAllEventBookings(eventId?: number) {
    if (eventId) {
      return this.db
        .select()
        .from(eventBookings)
        .where(eq(eventBookings.eventId, eventId))
        .orderBy(desc(eventBookings.createdAt));
    }
    return this.db
      .select()
      .from(eventBookings)
      .orderBy(desc(eventBookings.createdAt));
  }

  async getPendingPaymentProofs() {
    return this.db
      .select()
      .from(paymentProofs)
      .where(eq(paymentProofs.approvalStatus, 'pending'))
      .orderBy(paymentProofs.uploadedAt);
  }

  async approvePaymentProof(proofId: number, adminUserId: string) {
    return this.db
      .update(paymentProofs)
      .set({
        approvalStatus: 'approved',
        approvedBy: adminUserId,
        approvedAt: new Date(),
      })
      .where(eq(paymentProofs.id, proofId))
      .returning();
  }

  async rejectPaymentProof(proofId: number, adminUserId: string, reason: string) {
    return this.db
      .update(paymentProofs)
      .set({
        approvalStatus: 'rejected',
        approvedBy: adminUserId,
        approvedAt: new Date(),
        rejectionReason: reason,
      })
      .where(eq(paymentProofs.id, proofId))
      .returning();
  }

  // Booking with QR Code
  async getBookingByQrCode(qrCode: string) {
    return this.db
      .select()
      .from(bookings)
      .where(eq(bookings.qrCode, qrCode));
  }

  async markQrCodeAsUsed(bookingId: number) {
    return this.db
      .update(bookings)
      .set({ qrCodeUsed: true, status: 'completed' })
      .where(eq(bookings.id, bookingId))
      .returning();
  }

  async getEventBookingByQrCode(qrCode: string) {
    return this.db
      .select()
      .from(eventBookings)
      .where(eq(eventBookings.qrCode, qrCode));
  }

  async markEventQrCodeAsUsed(eventBookingId: number) {
    return this.db
      .update(eventBookings)
      .set({ qrCodeUsed: true })
      .where(eq(eventBookings.id, eventBookingId))
      .returning();
  }
}