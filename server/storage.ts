import { AdminDatabaseStorage } from "./adminStorage";
import {
  users,
  students,
  universities,
  subscriptionPlans,
  subscriptions,
  routes,
  buses,
  schedules,
  bookings,
  rides,
  rideRequests,
  busReservations,
  type User,
  type UpsertUser,
  type Student,
  type InsertStudent,
  type University,
  type SubscriptionPlan,
  type Subscription,
  type InsertSubscription,
  type Route,
  type Bus,
  type Schedule,
  type Booking,
  type InsertBooking,
  type Ride,
  type InsertRide,
  type RideRequest,
  type InsertRideRequest,
  type BusReservation,
  type InsertBusReservation,
  events,
  eventBookings,
} from "@shared/schema";
import { db, pool } from "./db";
import { eq, and, desc, gte, lte } from "drizzle-orm";
import * as schema from "@shared/schema";

export interface IStorage {
  // User operations (required for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;

  // Student operations
  getStudent(id: number): Promise<Student | undefined>;
  getStudentByUserId(userId: string): Promise<Student | undefined>;
  getStudentByQrCode(qrCode: string): Promise<Student | undefined>;
  createStudent(student: InsertStudent): Promise<Student>;
  updateStudent(id: number, updates: Partial<Student>): Promise<Student>;

  // University operations
  getUniversities(): Promise<University[]>;

  // Subscription operations
  getSubscriptionPlans(): Promise<SubscriptionPlan[]>;
  getActiveSubscription(studentId: number): Promise<Subscription | undefined>;
  createSubscription(subscription: InsertSubscription): Promise<Subscription>;

  // Route and schedule operations
  getRoutes(): Promise<Route[]>;
  getBuses(): Promise<Bus[]>;
  getSchedules(): Promise<Schedule[]>;
  getSchedulesByRoute(routeId: number): Promise<Schedule[]>;

  // Booking operations
  getStudentBookings(studentId: number): Promise<Booking[]>;
  createBooking(studentId: number, scheduleId: number, bookingDate: Date): Promise<Booking>;
  updateBooking(id: number, updates: Partial<Booking>): Promise<Booking>;

  // Ride operations
  getAvailableRides(): Promise<Ride[]>;
  getRidesByDriver(driverId: number): Promise<Ride[]>;
  createRide(ride: InsertRide): Promise<Ride>;
  getRideRequests(rideId: number): Promise<RideRequest[]>;
  createRideRequest(request: InsertRideRequest): Promise<RideRequest>;
  updateRideRequest(id: number, updates: Partial<RideRequest>): Promise<RideRequest>;

  // Bus reservation operations
  getActiveReservation(studentId: number): Promise<BusReservation | undefined>;
  createReservation(reservation: InsertBusReservation): Promise<BusReservation>;
  cancelReservation(studentId: number): Promise<void>;
  getReservationCounts(): Promise<Record<number, number>>;

  // Event operations
  getAllEvents(): Promise<any[]>;
  createEvent(eventData: any): Promise<any>;
  updateEvent(eventId: number, updates: any): Promise<any>;
  deleteEvent(eventId: number): Promise<void>;
  
  // Admin statistics
  getAdminStats(): Promise<{
    totalUsers: number;
    activeStudents: number;
    pendingStudents: number;
    pendingDrivers: number;
    activeDrivers: number;
    totalRides: number;
    activeRoutes: number;
    activeBuses: number;
  }>;
}

export class DatabaseStorage implements IStorage {
  protected adminStorage: AdminDatabaseStorage;

  constructor(protected db: any) {
    this.adminStorage = new AdminDatabaseStorage(db);
  }

  // Expose admin methods
  countUsers() { return this.adminStorage.countUsers(); }
  countActiveStudents() { return this.adminStorage.countActiveStudents(); }
  countPendingStudents() { return this.adminStorage.countPendingStudents(); }
  countPendingDrivers() { return this.adminStorage.countPendingDrivers(); }
  countActiveDrivers() { return this.adminStorage.countActiveDrivers(); }
  countTotalRides() { return this.adminStorage.countTotalRides(); }
  countActiveRoutes() { return this.adminStorage.countActiveRoutes(); }
  countActiveBuses() { return this.adminStorage.countActiveBuses(); }
  getAllUniversities() { return this.adminStorage.getAllUniversities(); }
  createUniversity(data: { name: string; code: string; address?: string }) { return this.adminStorage.createUniversity(data); }
  updateUniversity(id: number, updates: { name?: string; code?: string; address?: string }) { return this.adminStorage.updateUniversity(id, updates); }
  deleteUniversity(id: number) { return this.adminStorage.deleteUniversity(id); }
  getRecentUsers(limit?: number) { return this.adminStorage.getRecentUsers(limit); }
  getAllUsers(status?: string) { return this.adminStorage.getAllUsers(status); }
  updateUserDriverStatus(userId: string, isApproved: boolean) { return this.adminStorage.updateUserDriverStatus(userId, isApproved); }
  getPendingStudents() { return this.adminStorage.getPendingStudents(); }
  approveStudent(studentId: number, adminUserId: string) { return this.adminStorage.approveStudent(studentId, adminUserId); }
  rejectStudent(studentId: number, adminUserId: string, reason: string) { return this.adminStorage.rejectStudent(studentId, adminUserId, reason); }
  getAllRides(filters?: any) { return this.adminStorage.getAllRides(filters); }
  createBus(data: any) { return this.adminStorage.createBus(data); }
  updateBusStatus(busId: number, isActive: boolean) { return this.adminStorage.updateBusStatus(busId, isActive); }
  getAllBuses(filters?: any) { return this.adminStorage.getAllBuses(filters); }
  createRoute(data: any) { return this.adminStorage.createRoute(data); }
  updateRoute(routeId: number, data: any) { return this.adminStorage.updateRoute(routeId, data); }
  getAllRoutes(filters?: any) { return this.adminStorage.getAllRoutes(filters); }
  getAllSubscriptions() { return this.adminStorage.getAllSubscriptions(); }
  getStudentSubscriptions(studentId: number) { return this.adminStorage.getStudentSubscriptions(studentId); }
  updateSubscriptionStatus(subscriptionId: number, isActive: boolean) { return this.adminStorage.updateSubscriptionStatus(subscriptionId, isActive); }
  getAllSubscriptionPlans() { return this.adminStorage.getAllSubscriptionPlans(); }
  createSubscriptionPlan(data: any) { return this.adminStorage.createSubscriptionPlan(data); }
  updateSubscriptionPlan(planId: number, data: any) { return this.adminStorage.updateSubscriptionPlan(planId, data); }
  getAllSchedules() { return this.adminStorage.getAllSchedules(); }
  createSchedule(data: any) { return this.adminStorage.createSchedule(data); }
  updateSchedule(scheduleId: number, data: any) { return this.adminStorage.updateSchedule(scheduleId, data); }
  deleteSchedule(scheduleId: number) { return this.adminStorage.deleteSchedule(scheduleId); }
  getAllDrivers() { return this.adminStorage.getAllDrivers(); }
  getPendingDriversTable() { return this.adminStorage.getPendingDrivers(); }
  approveDriverTable(driverId: number, adminUserId: string) { return this.adminStorage.approveDriver(driverId, adminUserId); }
  rejectDriverTable(driverId: number, adminUserId: string, reason: string) { return this.adminStorage.rejectDriver(driverId, adminUserId, reason); }
  createDriver(data: any) { return this.adminStorage.createDriver(data); }
  updateDriver(driverId: number, data: any) { return this.adminStorage.updateDriver(driverId, data); }
  getAllVehicles() { return this.adminStorage.getAllVehicles(); }
  createVehicle(data: any) { return this.adminStorage.createVehicle(data); }
  updateVehicle(vehicleId: number, data: any) { return this.adminStorage.updateVehicle(vehicleId, data); }
  deleteVehicle(vehicleId: number) { return this.adminStorage.deleteVehicle(vehicleId); }
  getAllEvents() { return this.adminStorage.getAllEvents(); }
  getActiveEvents() { return this.adminStorage.getActiveEvents(); }
  createEvent(data: any) { return this.adminStorage.createEvent(data); }
  updateEvent(eventId: number, data: any) { return this.adminStorage.updateEvent(eventId, data); }
  deleteEvent(eventId: number) { return this.adminStorage.deleteEvent(eventId); }
  getAllEventBookings(eventId?: number) { return this.adminStorage.getAllEventBookings(eventId); }
  getPendingPaymentProofs() { return this.adminStorage.getPendingPaymentProofs(); }
  approvePaymentProof(proofId: number, adminUserId: string) { return this.adminStorage.approvePaymentProof(proofId, adminUserId); }
  rejectPaymentProof(proofId: number, adminUserId: string, reason: string) { return this.adminStorage.rejectPaymentProof(proofId, adminUserId, reason); }
  getBookingByQrCode(qrCode: string) { return this.adminStorage.getBookingByQrCode(qrCode); }
  markQrCodeAsUsed(bookingId: number) { return this.adminStorage.markQrCodeAsUsed(bookingId); }
  getEventBookingByQrCode(qrCode: string) { return this.adminStorage.getEventBookingByQrCode(qrCode); }
  markEventQrCodeAsUsed(eventBookingId: number) { return this.adminStorage.markEventQrCodeAsUsed(eventBookingId); }

  async getAdminStats() {
    const [
      totalUsers,
      activeStudents,
      pendingStudents,
      pendingDrivers,
      activeDrivers,
      totalRides,
      activeRoutes,
      activeBuses,
    ] = await Promise.all([
      this.adminStorage.countUsers(),
      this.adminStorage.countActiveStudents(),
      this.adminStorage.countPendingStudents(),
      this.adminStorage.countPendingDrivers(),
      this.adminStorage.countActiveDrivers(),
      this.adminStorage.countTotalRides(),
      this.adminStorage.countActiveRoutes(),
      this.adminStorage.countActiveBuses(),
    ]);

    return {
      totalUsers,
      activeStudents,
      pendingStudents,
      pendingDrivers,
      activeDrivers,
      totalRides,
      activeRoutes,
      activeBuses,
    };
  }

  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Student operations
  async getStudent(id: number): Promise<Student | undefined> {
    const [student] = await db.select().from(students).where(eq(students.id, id));
    return student;
  }

  async getStudentByUserId(userId: string): Promise<Student | undefined> {
    const [student] = await db.select().from(students).where(eq(students.userId, userId));
    return student;
  }

  async getStudentByQrCode(qrCode: string): Promise<Student | undefined> {
    const [student] = await db.select().from(students).where(eq(students.qrCode, qrCode));
    return student;
  }

  async createStudent(studentData: InsertStudent): Promise<Student> {
    const qrCode = `TF${new Date().getFullYear()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
    const [student] = await db
      .insert(students)
      .values({ ...studentData, qrCode, approvalStatus: 'pending' })
      .returning();
    return student;
  }

  async updateStudent(id: number, updates: Partial<Student>): Promise<Student> {
    const [student] = await db
      .update(students)
      .set(updates)
      .where(eq(students.id, id))
      .returning();
    return student;
  }

  // University operations
  async getUniversities(): Promise<University[]> {
    return await db.select().from(universities);
  }

  // Subscription operations
  async getSubscriptionPlans(): Promise<SubscriptionPlan[]> {
    return await db.select().from(subscriptionPlans).where(eq(subscriptionPlans.isActive, true));
  }

  async getActiveSubscription(studentId: number): Promise<Subscription | undefined> {
    const now = new Date();
    const [subscription] = await db
      .select()
      .from(subscriptions)
      .where(
        and(
          eq(subscriptions.studentId, studentId),
          eq(subscriptions.isActive, true),
          gte(subscriptions.endDate, now)
        )
      )
      .orderBy(desc(subscriptions.endDate));
    return subscription;
  }

  async createSubscription(subscriptionData: InsertSubscription): Promise<Subscription> {
    const [subscription] = await db
      .insert(subscriptions)
      .values(subscriptionData)
      .returning();
    return subscription;
  }

  // Route and schedule operations
  async getRoutes(): Promise<Route[]> {
    return await db.select().from(routes).where(eq(routes.isActive, true));
  }

  async getBuses(): Promise<Bus[]> {
    return await db.select().from(buses).where(eq(buses.isActive, true));
  }

  async getSchedules(): Promise<Schedule[]> {
    return await db.select().from(schedules).where(eq(schedules.isActive, true));
  }

  async getSchedulesByRoute(routeId: number): Promise<Schedule[]> {
    return await db
      .select()
      .from(schedules)
      .where(and(eq(schedules.routeId, routeId), eq(schedules.isActive, true)));
  }

  // Booking operations
  async getStudentBookings(studentId: number): Promise<Booking[]> {
    return await db
      .select()
      .from(bookings)
      .where(eq(bookings.studentId, studentId))
      .orderBy(desc(bookings.createdAt));
  }

  async createBooking(studentId: number, scheduleId: number, bookingDate: Date): Promise<Booking> {
    // Check if student already has a booking for this schedule and date
    const existingBooking = await db.query.bookings.findFirst({
      where: and(
        eq(schema.bookings.studentId, studentId),
        eq(schema.bookings.scheduleId, scheduleId),
        eq(schema.bookings.bookingDate, bookingDate)
      )
    });

    if (existingBooking) {
      throw new Error("Você já tem uma reserva para este horário");
    }

    const qrCode = `TF-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const [booking] = await db.insert(schema.bookings).values({
      studentId,
      scheduleId,
      bookingDate,
      qrCode,
      status: "confirmed",
    }).returning();
    return booking;
  }

  async updateBooking(id: number, updates: Partial<Booking>): Promise<Booking> {
    const [booking] = await db
      .update(bookings)
      .set(updates)
      .where(eq(bookings.id, id))
      .returning();
    return booking;
  }

  // Ride operations
  async getAvailableRides(): Promise<any[]> {
    const now = new Date();
    console.log("getAvailableRides: running raw SQL against DB, now=", now.toISOString());
    try {
        const res = await pool.query(`
          SELECT 
            r.id,
            r.driver_id as "driverId",
            r.from_location as "fromLocation",
            r.to_location as "toLocation",
            r.start_time as "startTime",
            r.start_time as "departureTime",
            r.end_time as "endTime",
            r.available_seats as "availableSeats",
            r.price,
            r.description,
            r.status,
            r.created_at as "createdAt",
            s.full_name as "driverName",
            s.phone as "driverPhone",
            u.profile_image_url as "driverPhoto",
            COALESCE(5, 5) as rating,
            COALESCE(0, 0) as trips
          FROM rides r
          INNER JOIN students s ON r.driver_id = s.id
          LEFT JOIN users u ON s.user_id = u.id
          WHERE r.start_time >= $1 AND r.status = 'available'
          ORDER BY r.start_time
        `, [now]);
      console.log(`getAvailableRides: raw query returned ${res.rowCount} rows`);
      return res.rows;
    } catch (err) {
      console.error("getAvailableRides: raw SQL failed:", err);
      throw err;
    }
  }

  async getRidesByDriver(driverId: number): Promise<any[]> {
    try {
      const res = await pool.query(`
        SELECT 
          r.id,
          r.driver_id as "driverId",
          r.from_location as "fromLocation",
          r.to_location as "toLocation",
          r.start_time as "startTime",
          r.start_time as "departureTime",
          r.end_time as "endTime",
          r.available_seats as "availableSeats",
          r.price,
          r.description,
          r.status,
          r.created_at as "createdAt",
          s.full_name as "driverName",
          s.phone as "driverPhone",
          u.profile_image_url as "driverPhoto",
          COALESCE(5, 5) as rating,
          COALESCE(0, 0) as trips
        FROM rides r
        INNER JOIN students s ON r.driver_id = s.id
        LEFT JOIN users u ON s.user_id = u.id
        WHERE r.driver_id = $1
        ORDER BY r.created_at DESC
      `, [driverId]);
      return res.rows;
    } catch (err) {
      console.error("getRidesByDriver: raw SQL failed:", err);
      throw err;
    }
  }

  async createRide(rideData: InsertRide): Promise<Ride> {
    const [ride] = await db
      .insert(rides)
      .values(rideData)
      .returning();
    return ride;
  }

  async getRideRequests(rideId: number): Promise<RideRequest[]> {
    return await db
      .select()
      .from(rideRequests)
      .where(eq(rideRequests.rideId, rideId))
      .orderBy(desc(rideRequests.createdAt));
  }

  async createRideRequest(requestData: InsertRideRequest): Promise<RideRequest> {
    const [request] = await db
      .insert(rideRequests)
      .values(requestData)
      .returning();
    return request;
  }

  async updateRideRequest(id: number, updates: Partial<RideRequest>): Promise<RideRequest> {
    const [request] = await db
      .update(rideRequests)
      .set(updates)
      .where(eq(rideRequests.id, id))
      .returning();
    return request;
  }

  // Bus reservation operations
  async getActiveReservation(studentId: number): Promise<BusReservation | undefined> {
    const [reservation] = await db
      .select()
      .from(busReservations)
      .where(
        and(
          eq(busReservations.studentId, studentId),
          eq(busReservations.status, "active")
        )
      )
      .limit(1);
    return reservation;
  }

  async createReservation(reservationData: InsertBusReservation): Promise<BusReservation> {
    const [reservation] = await db
      .insert(busReservations)
      .values(reservationData)
      .returning();
    return reservation;
  }

  async cancelReservation(studentId: number): Promise<void> {
    await db
      .update(busReservations)
      .set({ status: "cancelled" })
      .where(
        and(
          eq(busReservations.studentId, studentId),
          eq(busReservations.status, "active")
        )
      );
  }

  async getReservationCounts(): Promise<Record<number, number>> {
    const reservations = await this.db
      .select()
      .from(busReservations)
      .where(eq(busReservations.status, "active"));

    const counts: Record<number, number> = {};
    for (const reservation of reservations) {
      counts[reservation.busId] = (counts[reservation.busId] || 0) + 1;
    }
    return counts;
  }

  // Event operations
  async getActiveEvents() {
    return await db.select().from(schema.events).where(eq(schema.events.isActive, true)).orderBy(schema.events.eventDate);
  }

  async getAllEvents() {
    return await db.select().from(schema.events).orderBy(schema.events.createdAt);
  }

  async createEvent(eventData: any): Promise<any> {
    const [event] = await db.insert(events).values(eventData).returning();
    return event;
  }

  async updateEvent(eventId: number, updates: any): Promise<any> {
    const [event] = await db
      .update(events)
      .set(updates)
      .where(eq(events.id, eventId))
      .returning();
    return event;
  }

  async deleteEvent(eventId: number): Promise<void> {
    await db.delete(events).where(eq(events.id, eventId));
  }

}

export const storage = new DatabaseStorage(db);