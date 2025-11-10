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

// User storage table for Replit Auth and local auth
export const users = pgTable("users", {
  id: varchar("id").primaryKey().notNull(),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  passwordHash: varchar("password_hash"),
  authType: varchar("auth_type").default("oauth"),
  isAdmin: boolean("is_admin").default(false),
  isDriver: boolean("is_driver").default(false),
  driverPending: boolean("driver_pending").default(false),
  isActive: boolean("is_active").default(true),
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
  isActive: boolean("is_active").default(true),
  course: varchar("course"),
  phone: varchar("phone"),
  isVerified: boolean("is_verified").default(false),
  approvalStatus: varchar("approval_status").notNull().default("pending"), // pending, approved, rejected
  approvedBy: varchar("approved_by").references(() => users.id),
  approvedAt: timestamp("approved_at"),
  rejectionReason: text("rejection_reason"),
  address: text("address"),
  qrCode: varchar("qr_code").unique(),
  vehicleMake: varchar("vehicle_make"),
  vehicleModel: varchar("vehicle_model"),
  vehicleColor: varchar("vehicle_color"),
  vehiclePlate: varchar("vehicle_plate"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Driver profiles (managed by admin)
export const drivers = pgTable("drivers", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  fullName: varchar("full_name").notNull(),
  phone: varchar("phone").notNull(),
  licenseNumber: varchar("license_number").notNull().unique(),
  approvalStatus: varchar("approval_status").notNull().default("pending"), // pending, approved, rejected
  approvedBy: varchar("approved_by").references(() => users.id),
  approvedAt: timestamp("approved_at"),
  rejectionReason: text("rejection_reason"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// Vehicles (managed by admin)
export const vehicles = pgTable("vehicles", {
  id: serial("id").primaryKey(),
  driverId: integer("driver_id").references(() => drivers.id),
  make: varchar("make").notNull(),
  model: varchar("model").notNull(),
  color: varchar("color").notNull(),
  plate: varchar("plate").notNull().unique(),
  capacity: integer("capacity").notNull(),
  year: integer("year"),
  isActive: boolean("is_active").default(true),
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
  origin: varchar("origin").notNull(),
  destination: varchar("destination").notNull(),
  estimatedDuration: integer("estimated_duration"), // in minutes
  stops: jsonb("stops").notNull(), // Array of stop objects with {name, order, estimatedTime}
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
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
  qrCode: varchar("qr_code").unique(),
  qrCodeUsed: boolean("qr_code_used").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// Carpooling rides
export const rides = pgTable("rides", {
  id: serial("id").primaryKey(),
  driverId: integer("driver_id").notNull().references(() => students.id),
  fromLocation: varchar("from_location").notNull(),
  toLocation: varchar("to_location").notNull(),
  startTime: timestamp("start_time").notNull(),
  endTime: timestamp("end_time"),
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

// Bus seat reservations
export const busReservations = pgTable("bus_reservations", {
  id: serial("id").primaryKey(),
  studentId: integer("student_id").notNull().references(() => students.id),
  busId: integer("bus_id").notNull().references(() => buses.id),
  scheduleId: integer("schedule_id").references(() => schedules.id),
  reservationDate: timestamp("reservation_date").notNull().defaultNow(),
  status: varchar("status").notNull().default("active"), // active, cancelled, completed
  seatNumber: integer("seat_number"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Events (university events with transportation)
export const events = pgTable("events", {
  id: serial("id").primaryKey(),
  name: varchar("name").notNull(),
  description: text("description"),
  eventDate: timestamp("event_date").notNull(),
  eventTime: varchar("event_time").notNull(),
  location: varchar("location").notNull(),
  transportPriceOneWay: decimal("transport_price_one_way", { precision: 10, scale: 2 }).notNull(),
  transportPriceRoundTrip: decimal("transport_price_round_trip", { precision: 10, scale: 2 }).notNull(),
  transportPriceReturn: decimal("transport_price_return", { precision: 10, scale: 2 }).notNull(),
  totalSeats: integer("total_seats").notNull(),
  availableSeats: integer("available_seats").notNull(),
  bankDetails: text("bank_details"), // Bank account info for payment
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// Event bookings (transportation reservations for events)
export const eventBookings = pgTable("event_bookings", {
  id: serial("id").primaryKey(),
  eventId: integer("event_id").notNull().references(() => events.id),
  studentId: integer("student_id").notNull().references(() => students.id),
  tripType: varchar("trip_type").notNull(), // one_way, round_trip, return_only
  studentAddress: text("student_address").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  paymentStatus: varchar("payment_status").notNull().default("pending"), // pending, approved, rejected
  qrCode: varchar("qr_code").unique(),
  qrCodeUsed: boolean("qr_code_used").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// Payment proofs (for event transportation)
export const paymentProofs = pgTable("payment_proofs", {
  id: serial("id").primaryKey(),
  eventBookingId: integer("event_booking_id").notNull().references(() => eventBookings.id),
  proofImageUrl: varchar("proof_image_url").notNull(),
  uploadedAt: timestamp("uploaded_at").defaultNow(),
  approvalStatus: varchar("approval_status").notNull().default("pending"), // pending, approved, rejected
  approvedBy: varchar("approved_by").references(() => users.id),
  approvedAt: timestamp("approved_at"),
  rejectionReason: text("rejection_reason"),
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
  approvalStatus: true,
  approvedBy: true,
  approvedAt: true,
  rejectionReason: true,
});

export const insertSubscriptionSchema = createInsertSchema(subscriptions).omit({
  id: true,
  createdAt: true,
});

export const insertBookingSchema = createInsertSchema(bookings).omit({
  id: true,
  createdAt: true,
  qrCode: true,
});

export const insertDriverSchema = createInsertSchema(drivers).omit({
  id: true,
  createdAt: true,
  approvalStatus: true,
  approvedBy: true,
  approvedAt: true,
  rejectionReason: true,
});

export const insertVehicleSchema = createInsertSchema(vehicles).omit({
  id: true,
  createdAt: true,
});

export const insertEventSchema = createInsertSchema(events).omit({
  id: true,
  createdAt: true,
});

export const insertEventBookingSchema = createInsertSchema(eventBookings).omit({
  id: true,
  createdAt: true,
  qrCode: true,
  paymentStatus: true,
  qrCodeUsed: true,
});

export const insertPaymentProofSchema = createInsertSchema(paymentProofs).omit({
  id: true,
  uploadedAt: true,
  approvalStatus: true,
  approvedBy: true,
  approvedAt: true,
  rejectionReason: true,
});

// Customiza o schema para converter string ISO para Date no startTime
export const insertRideSchema = createInsertSchema(rides)
  .omit({
    id: true,
    createdAt: true,
  })
  .extend({
    startTime: z.preprocess(
      // First try to convert the input to a date if it's not already one
      (input) => {
        if (input instanceof Date) return input;
        if (typeof input === 'string') {
          try {
            const date = new Date(input);
            if (!isNaN(date.getTime())) return date;
          } catch {}
        }
        return input; // Let zod handle the validation error
      },
      // Then validate that it's actually a valid date
      z.date({
        required_error: "A data é obrigatória",
        invalid_type_error: "Data inválida. Use o formato ISO (ex: 2025-11-10T10:00:00Z)",
      })
    )
  });

export const insertRideRequestSchema = createInsertSchema(rideRequests).omit({
  id: true,
  createdAt: true,
});

export const insertBusReservationSchema = createInsertSchema(busReservations).omit({
  id: true,
  createdAt: true,
  reservationDate: true,
});

export const createBusReservationSchema = insertBusReservationSchema.pick({
  busId: true,
});

// Types
export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;
export type InsertStudent = z.infer<typeof insertStudentSchema>;
export type Student = typeof students.$inferSelect;
export type InsertDriver = z.infer<typeof insertDriverSchema>;
export type Driver = typeof drivers.$inferSelect;
export type InsertVehicle = z.infer<typeof insertVehicleSchema>;
export type Vehicle = typeof vehicles.$inferSelect;
export type University = typeof universities.$inferSelect;
export type SubscriptionPlan = typeof subscriptionPlans.$inferSelect;
export type InsertSubscription = z.infer<typeof insertSubscriptionSchema>;
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
export type InsertBusReservation = z.infer<typeof insertBusReservationSchema>;
export type BusReservation = typeof busReservations.$inferSelect;
export type InsertEvent = z.infer<typeof insertEventSchema>;
export type Event = typeof events.$inferSelect;
export type InsertEventBooking = z.infer<typeof insertEventBookingSchema>;
export type EventBooking = typeof eventBookings.$inferSelect;
export type InsertPaymentProof = z.infer<typeof insertPaymentProofSchema>;
export type PaymentProof = typeof paymentProofs.$inferSelect;
