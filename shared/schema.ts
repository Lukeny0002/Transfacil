import {
  pgTable,
  text,
  varchar,
  timestamp,
  jsonb,
  index,
  serial,
  integer,
  boolean,
  decimal,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table for Replit Auth
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table for Replit Auth
export const users = pgTable("users", {
  id: varchar("id").primaryKey().notNull(),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Student profiles
export const students = pgTable("students", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  fullName: varchar("full_name").notNull(),
  studentNumber: varchar("student_number").notNull().unique(),
  university: varchar("university").notNull(),
  course: varchar("course"),
  phone: varchar("phone"),
  isVerified: boolean("is_verified").default(false),
  qrCode: varchar("qr_code").unique(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Universities
export const universities = pgTable("universities", {
  id: serial("id").primaryKey(),
  name: varchar("name").notNull(),
  code: varchar("code").notNull().unique(),
  address: varchar("address"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Subscription plans
export const subscriptionPlans = pgTable("subscription_plans", {
  id: serial("id").primaryKey(),
  name: varchar("name").notNull(),
  duration: varchar("duration").notNull(), // "weekly" or "monthly"
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  features: jsonb("features").notNull(),
  isActive: boolean("is_active").default(true),
});

// Student subscriptions
export const subscriptions = pgTable("subscriptions", {
  id: serial("id").primaryKey(),
  studentId: integer("student_id").notNull().references(() => students.id),
  planId: integer("plan_id").notNull().references(() => subscriptionPlans.id),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  isActive: boolean("is_active").default(true),
  tripsRemaining: integer("trips_remaining"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Bus routes
export const routes = pgTable("routes", {
  id: serial("id").primaryKey(),
  name: varchar("name").notNull(),
  description: text("description"),
  stops: jsonb("stops").notNull(), // Array of stop objects
  isActive: boolean("is_active").default(true),
});

// Buses
export const buses = pgTable("buses", {
  id: serial("id").primaryKey(),
  number: varchar("number").notNull().unique(),
  routeId: integer("route_id").references(() => routes.id),
  capacity: integer("capacity").notNull(),
  currentLocation: jsonb("current_location"), // {lat, lng}
  isActive: boolean("is_active").default(true),
});

// Bus schedules
export const schedules = pgTable("schedules", {
  id: serial("id").primaryKey(),
  busId: integer("bus_id").notNull().references(() => buses.id),
  routeId: integer("route_id").notNull().references(() => routes.id),
  departureTime: varchar("departure_time").notNull(),
  arrivalTime: varchar("arrival_time").notNull(),
  daysOfWeek: varchar("days_of_week").notNull(), // JSON array of days
  isActive: boolean("is_active").default(true),
});

// Trip bookings
export const bookings = pgTable("bookings", {
  id: serial("id").primaryKey(),
  studentId: integer("student_id").notNull().references(() => students.id),
  scheduleId: integer("schedule_id").notNull().references(() => schedules.id),
  bookingDate: timestamp("booking_date").notNull(),
  status: varchar("status").notNull().default("confirmed"), // confirmed, cancelled, completed
  qrCodeUsed: boolean("qr_code_used").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// Carpooling rides
export const rides = pgTable("rides", {
  id: serial("id").primaryKey(),
  driverId: integer("driver_id").notNull().references(() => students.id),
  fromLocation: varchar("from_location").notNull(),
  toLocation: varchar("to_location").notNull(),
  departureTime: timestamp("departure_time").notNull(),
  availableSeats: integer("available_seats").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).default("0"),
  description: text("description"),
  status: varchar("status").notNull().default("available"), // available, full, completed, cancelled
  createdAt: timestamp("created_at").defaultNow(),
});

// Ride requests
export const rideRequests = pgTable("ride_requests", {
  id: serial("id").primaryKey(),
  rideId: integer("ride_id").notNull().references(() => rides.id),
  passengerId: integer("passenger_id").notNull().references(() => students.id),
  status: varchar("status").notNull().default("pending"), // pending, accepted, rejected
  message: text("message"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  createdAt: true,
  updatedAt: true,
});

export const insertStudentSchema = createInsertSchema(students).omit({
  id: true,
  createdAt: true,
  qrCode: true,
});

export const insertSubscriptionSchema = createInsertSchema(subscriptions).omit({
  id: true,
  createdAt: true,
});

export const insertBookingSchema = createInsertSchema(bookings).omit({
  id: true,
  createdAt: true,
});

export const insertRideSchema = createInsertSchema(rides).omit({
  id: true,
  createdAt: true,
});

export const insertRideRequestSchema = createInsertSchema(rideRequests).omit({
  id: true,
  createdAt: true,
});

// Types
export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;
export type InsertStudent = z.infer<typeof insertStudentSchema>;
export type Student = typeof students.$inferSelect;
export type University = typeof universities.$inferSelect;
export type SubscriptionPlan = typeof subscriptionPlans.$inferSelect;
export type Subscription = typeof subscriptions.$inferSelect;
export type Route = typeof routes.$inferSelect;
export type Bus = typeof buses.$inferSelect;
export type Schedule = typeof schedules.$inferSelect;
export type InsertBooking = z.infer<typeof insertBookingSchema>;
export type Booking = typeof bookings.$inferSelect;
export type InsertRide = z.infer<typeof insertRideSchema>;
export type Ride = typeof rides.$inferSelect;
export type InsertRideRequest = z.infer<typeof insertRideRequestSchema>;
export type RideRequest = typeof rideRequests.$inferSelect;
