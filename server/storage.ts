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
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc, gte, lte } from "drizzle-orm";

export interface IStorage {
  // User operations (required for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
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
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
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
      .values({ ...studentData, qrCode })
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
  async getAvailableRides(): Promise<Ride[]> {
    const now = new Date();
    return await db
      .select()
      .from(rides)
      .where(
        and(
          eq(rides.status, "available"),
          gte(rides.departureTime, now)
        )
      )
      .orderBy(rides.departureTime);
  }

  async getRidesByDriver(driverId: number): Promise<Ride[]> {
    return await db
      .select()
      .from(rides)
      .where(eq(rides.driverId, driverId))
      .orderBy(desc(rides.createdAt));
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
}

export const storage = new DatabaseStorage();
