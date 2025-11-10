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
} from "@shared/schema";
import { db, pool } from "./db";
import { eq, and, desc, gte, lte } from "drizzle-orm";

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
  createBooking(booking: InsertBooking): Promise<Booking>;
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
}

export class DatabaseStorage implements IStorage {
  protected adminStorage: AdminDatabaseStorage;

  constructor(protected db: any) {
    this.adminStorage = new AdminDatabaseStorage(db);
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

  async createBooking(bookingData: InsertBooking): Promise<Booking> {
    const [booking] = await db
      .insert(bookings)
      .values(bookingData)
      .returning();
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

  // Admin methods delegation
  countUsers = () => this.adminStorage.countUsers();
  countActiveStudents = () => this.adminStorage.countActiveStudents();
  countPendingDrivers = () => this.adminStorage.countPendingDrivers();
  countActiveDrivers = () => this.adminStorage.countActiveDrivers();
  countTotalRides = () => this.adminStorage.countTotalRides();
  countActiveRoutes = () => this.adminStorage.countActiveRoutes();
  countActiveBuses = () => this.adminStorage.countActiveBuses();
  getRecentUsers = () => this.adminStorage.getRecentUsers();
  getAllUsers = (status?: string) => this.adminStorage.getAllUsers(status);
  updateUserDriverStatus = (userId: string, isApproved: boolean) => 
    this.adminStorage.updateUserDriverStatus(userId, isApproved);
  getAllRides = (filters?: any) => this.adminStorage.getAllRides(filters);
  createBus = (data: any) => this.adminStorage.createBus(data);
  updateBusStatus = (busId: number, isActive: boolean) => 
    this.adminStorage.updateBusStatus(busId, isActive);
  getAllBuses = (filters?: any) => this.adminStorage.getAllBuses(filters);
  createRoute = (data: any) => this.adminStorage.createRoute(data);
  updateRoute = (routeId: number, data: any) => 
    this.adminStorage.updateRoute(routeId, data);
  getAllRoutes = (filters?: any) => this.adminStorage.getAllRoutes(filters);
  createUniversity = (data: any) => this.adminStorage.createUniversity(data);
  deleteUniversity = (id: number) => this.adminStorage.deleteUniversity(id);
}

export const storage = new DatabaseStorage(db);
