import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { hashPassword, comparePassword, generateUserId, isAuthenticatedAny } from "./localAuth";
import { upload } from "./upload";
import { insertStudentSchema, insertSubscriptionSchema, insertBookingSchema, insertRideSchema, insertRideRequestSchema, createBusReservationSchema } from "@shared/schema";
import { z } from "zod";
// Assume `authenticateUser` and `db` are available and correctly imported/configured elsewhere in your project.
// For the purpose of this example, let's mock them.
const authenticateUser = (req: any, res: any, next: () => void) => {
  // Mock authentication - In a real app, this would verify a JWT or session.
  req.user = { id: "mockUserId" }; // Replace with actual user ID extraction
  next();
};
const db = {
  query: {
    rideRequests: {
      findFirst: async ({ where, with: include }: any) => {
        // Mock implementation: return a dummy request
        if (where.id === 1) {
          return {
            id: 1,
            rideId: 10,
            passengerId: 2,
            status: "pending",
            ride: { id: 10, driverId: 1, status: "available" },
            passenger: { userId: "mockPassengerUserId", id: 2 }
          };
        }
        return null;
      }
    },
    students: {
      findFirst: async ({ where }: any) => {
        // Mock implementation: return a dummy student
        if (where.userId === "mockUserId") {
          return { id: 1, userId: "mockUserId", fullName: "Driver Name" };
        }
        if (where.userId === "mockPassengerUserId") {
          return { id: 2, userId: "mockPassengerUserId", fullName: "Passenger Name" };
        }
        return null;
      }
    }
  },
  update: async (table: any, { set, where }: any) => {
    console.log(`Mock update on ${table}: set=${JSON.stringify(set)}, where=${JSON.stringify(where)}`);
    return { count: 1 };
  },
  insert: async (table: any, { values }: any) => {
    console.log(`Mock insert into ${table}: values=${JSON.stringify(values)}`);
    return { id: 1, ...values };
  }
};
const notifications = "notifications"; // Mock table name

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Local authentication routes
  const registerSchema = z.object({
    email: z.string().email("Email inválido"),
    password: z.string().min(8, "Senha deve ter no mínimo 8 caracteres"),
    fullName: z.string().min(1, "Nome completo é obrigatório"),
    studentNumber: z.string().min(1, "Número de estudante é obrigatório"),
    university: z.string().min(1, "Universidade é obrigatória"),
    phone: z.string().optional(),
  });

  const loginSchema = z.object({
    email: z.string().email("Email inválido"),
    password: z.string().min(1, "Senha é obrigatória"),
  });

  app.post('/api/auth/register', async (req, res) => {
    try {
      // Validate input
      const validationResult = registerSchema.safeParse(req.body);
      if (!validationResult.success) {
        const firstError = validationResult.error.errors[0];
        return res.status(400).json({ message: firstError.message });
      }

      const { email, password, fullName, studentNumber, university, phone } = validationResult.data;

      // Check if user already exists
      const existingUser = await storage.getUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({ message: "Usuário já existe com este email" });
      }

      // Hash password and create user
      const passwordHash = await hashPassword(password);
      const userId = generateUserId();

      const user = await storage.upsertUser({
        id: userId,
        email,
        firstName: fullName.split(' ')[0],
        lastName: fullName.split(' ').slice(1).join(' ') || '',
        passwordHash,
        authType: "local",
      });

      // Create student profile (required for all local registrations)
      await storage.createStudent({
        userId: user.id,
        fullName,
        studentNumber,
        university,
        phone: phone || '',
      });

      // Regenerate session to prevent session fixation
      req.session.regenerate((err) => {
        if (err) {
          console.error("Session regeneration error:", err);
          return res.status(500).json({ message: "Erro ao criar sessão" });
        }

        // Set session
        (req.session as any).userId = user.id;

        res.json({
          message: "Conta criada com sucesso",
          user: { id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName }
        });
      });
    } catch (error: any) {
      console.error("Error in registration:", error);

      // Handle unique constraint violations
      if (error.code === '23505') {
        return res.status(400).json({ message: "Número de estudante já cadastrado" });
      }

      res.status(500).json({ message: "Erro ao criar conta" });
    }
  });

  app.post('/api/auth/login', async (req, res) => {
    try {
      // Validate input
      const validationResult = loginSchema.safeParse(req.body);
      if (!validationResult.success) {
        const firstError = validationResult.error.errors[0];
        return res.status(400).json({ message: firstError.message });
      }

      const { email, password } = validationResult.data;

      const user = await storage.getUserByEmail(email);
      if (!user || !user.passwordHash) {
        return res.status(401).json({ message: "Email ou senha incorretos" });
      }

      const isValid = await comparePassword(password, user.passwordHash);
      if (!isValid) {
        return res.status(401).json({ message: "Email ou senha incorretos" });
      }

      // Regenerate session to prevent session fixation
      req.session.regenerate((err) => {
        if (err) {
          console.error("Session regeneration error:", err);
          return res.status(500).json({ message: "Erro ao criar sessão" });
        }

        // Set session
        (req.session as any).userId = user.id;

        res.json({
          message: "Login realizado com sucesso",
          user: { id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName }
        });
      });
    } catch (error) {
      console.error("Error in login:", error);
      res.status(500).json({ message: "Erro ao fazer login" });
    }
  });

  app.post('/api/auth/logout', (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Erro ao fazer logout" });
      }
      res.json({ message: "Logout realizado com sucesso" });
    });
  });

  // Upload profile image
  app.post('/api/upload/profile-image', isAuthenticatedAny, upload.single('profileImage'), async (req: any, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "Nenhum arquivo foi enviado" });
      }

      const userId = req.user.claims.sub;
      const imageUrl = `/uploads/profiles/${req.file.filename}`;

      // Update user profile image
      await storage.upsertUser({
        id: userId,
        profileImageUrl: imageUrl,
      });

      res.json({
        message: "Foto de perfil atualizada com sucesso",
        imageUrl
      });
    } catch (error) {
      console.error("Error uploading profile image:", error);
      res.status(500).json({ message: "Erro ao fazer upload da imagem" });
    }
  });

  // Auth routes - Now using combined authentication
  app.get('/api/auth/user', isAuthenticatedAny, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);

      if (!user) {
        return res.status(404).json({ message: "Usuário não encontrado" });
      }

      // Remove sensitive fields before sending to client
      const { passwordHash, ...safeUserData } = user;
      res.json(safeUserData);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Falha ao buscar usuário" });
    }
  });

  // Student profile routes
  app.get('/api/student/profile', isAuthenticatedAny, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const student = await storage.getStudentByUserId(userId);
      res.json(student);
    } catch (error) {
      console.error("Error fetching student profile:", error);
      res.status(500).json({ message: "Falha ao buscar perfil de estudante" });
    }
  });

  app.post('/api/student/profile', isAuthenticatedAny, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const studentData = insertStudentSchema.parse({ ...req.body, userId });
      const student = await storage.createStudent(studentData);
      res.json(student);
    } catch (error) {
      console.error("Error creating student profile:", error);
      res.status(400).json({ message: "Falha ao criar perfil de estudante" });
    }
  });

  app.put('/api/student/profile/:id', isAuthenticatedAny, async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = req.body;
      const student = await storage.updateStudent(id, updates);
      res.json(student);
    } catch (error) {
      console.error("Error updating student profile:", error);
      res.status(400).json({ message: "Falha ao atualizar perfil de estudante" });
    }
  });

  app.put('/api/student/vehicle', isAuthenticatedAny, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const student = await storage.getStudentByUserId(userId);

      if (!student) {
        return res.status(404).json({ message: "Perfil de estudante não encontrado" });
      }

      const vehicleSchema = z.object({
        vehicleMake: z.string().optional(),
        vehicleModel: z.string().optional(),
        vehicleColor: z.string().optional(),
        vehiclePlate: z.string().optional(),
      });

      const vehicleData = vehicleSchema.parse(req.body);
      const updatedStudent = await storage.updateStudent(student.id, vehicleData);
      res.json(updatedStudent);
    } catch (error) {
      console.error("Error updating vehicle information:", error);
      res.status(400).json({ message: "Falha ao atualizar informações do veículo" });
    }
  });

  // Universities
  app.get('/api/universities', async (req, res) => {
    try {
      const universities = await storage.getUniversities();
      res.json(universities);
    } catch (error) {
      console.error("Error fetching universities:", error);
      res.status(500).json({ message: "Falha ao buscar universidades" });
    }
  });

  // Subscription routes
  app.get('/api/subscription/plans', async (req, res) => {
    try {
      const plans = await storage.getSubscriptionPlans();
      res.json(plans);
    } catch (error) {
      console.error("Error fetching subscription plans:", error);
      res.status(500).json({ message: "Falha ao buscar planos de assinatura" });
    }
  });

  app.get('/api/subscription/active', isAuthenticatedAny, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const student = await storage.getStudentByUserId(userId);
      if (!student) {
        return res.status(404).json({ message: "Perfil de estudante não encontrado" });
      }
      const subscription = await storage.getActiveSubscription(student.id);
      res.json(subscription);
    } catch (error) {
      console.error("Error fetching active subscription:", error);
      res.status(500).json({ message: "Falha ao buscar assinatura ativa" });
    }
  });

  app.post('/api/subscription/create', isAuthenticatedAny, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const student = await storage.getStudentByUserId(userId);
      if (!student) {
        return res.status(404).json({ message: "Perfil de estudante não encontrado" });
      }

      const subscriptionData = insertSubscriptionSchema.parse({
        ...req.body,
        studentId: student.id,
      });

      const subscription = await storage.createSubscription(subscriptionData);
      res.json(subscription);
    } catch (error) {
      console.error("Error creating subscription:", error);
      res.status(400).json({ message: "Falha ao criar assinatura" });
    }
  });

  // Routes and schedules
  app.get('/api/routes', async (req, res) => {
    try {
      const routes = await storage.getRoutes();
      res.json(routes);
    } catch (error) {
      console.error("Error fetching routes:", error);
      res.status(500).json({ message: "Falha ao buscar rotas" });
    }
  });

  app.get('/api/buses', async (req, res) => {
    try {
      const buses = await storage.getBuses();
      res.json(buses);
    } catch (error) {
      console.error("Error fetching buses:", error);
      res.status(500).json({ message: "Falha ao buscar autocarros" });
    }
  });

  app.get('/api/schedules', async (req, res) => {
    try {
      const routeId = req.query.routeId ? parseInt(req.query.routeId as string) : undefined;
      const schedules = routeId
        ? await storage.getSchedulesByRoute(routeId)
        : await storage.getSchedules();
      res.json(schedules);
    } catch (error) {
      console.error("Error fetching schedules:", error);
      res.status(500).json({ message: "Falha ao buscar horários" });
    }
  });

  // Booking routes
  app.get('/api/bookings', isAuthenticatedAny, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const student = await storage.getStudentByUserId(userId);
      if (!student) {
        return res.status(404).json({ message: "Perfil de estudante não encontrado" });
      }
      const bookings = await storage.getStudentBookings(student.id);
      res.json(bookings);
    } catch (error) {
      console.error("Error fetching bookings:", error);
      res.status(500).json({ message: "Falha ao buscar reservas" });
    }
  });

  app.post('/api/bookings', isAuthenticatedAny, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const student = await storage.getStudentByUserId(userId);
      if (!student) {
        return res.status(404).json({ message: "Perfil de estudante não encontrado" });
      }

      const bookingData = insertBookingSchema.parse({
        ...req.body,
        studentId: student.id,
      });

      const booking = await storage.createBooking(bookingData);
      res.json(booking);
    } catch (error) {
      console.error("Error creating booking:", error);
      res.status(400).json({ message: "Falha ao criar reserva" });
    }
  });

  // Rides routes
  app.get('/api/rides', async (req, res) => {
    try {
      const rides = await storage.getAvailableRides();
      res.json(rides);
    } catch (error) {
      console.error("Error fetching rides:", error);
      res.status(500).json({ message: "Falha ao buscar boleias" });
    }
  });

  app.get('/api/rides/my', isAuthenticatedAny, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const student = await storage.getStudentByUserId(userId);
      if (!student) {
        return res.status(404).json({ message: "Perfil de estudante não encontrado" });
      }
      const rides = await storage.getRidesByDriver(student.id);
      res.json(rides);
    } catch (error) {
      console.error("Error fetching user rides:", error);
      res.status(500).json({ message: "Falha ao buscar suas boleias" });
    }
  });

  app.post('/api/rides', isAuthenticatedAny, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const student = await storage.getStudentByUserId(userId);
      if (!student) {
        return res.status(404).json({ message: "Perfil de estudante não encontrado" });
      }

      const rideData = insertRideSchema.parse({
        fromLocation: req.body.fromLocation,
        toLocation: req.body.toLocation,
        departureTime: new Date(req.body.departureTime),
        availableSeats: req.body.availableSeats,
        price: String(req.body.price),
        description: req.body.description,
        driverId: student.id,
        status: "available",
      });

      const ride = await storage.createRide(rideData);
      res.json(ride);
    } catch (error) {
      console.error("Error creating ride:", error);
      res.status(400).json({ message: "Falha ao criar boleia" });
    }
  });

  app.post('/api/rides/:id/request', isAuthenticatedAny, async (req: any, res) => {
    try {
      const rideId = parseInt(req.params.id);
      const userId = req.user.claims.sub;
      const student = await storage.getStudentByUserId(userId);
      if (!student) {
        return res.status(404).json({ message: "Perfil de estudante não encontrado" });
      }

      const requestData = insertRideRequestSchema.parse({
        rideId,
        passengerId: student.id,
        message: req.body.message,
      });

      const request = await storage.createRideRequest(requestData);
      res.json(request);
    } catch (error) {
      console.error("Error creating ride request:", error);
      res.status(400).json({ message: "Falha ao criar pedido de boleia" });
    }
  });

  app.get('/api/rides/:id/requests', isAuthenticatedAny, async (req: any, res) => {
    try {
      const rideId = parseInt(req.params.id);
      const requests = await storage.getRideRequests(rideId);
      res.json(requests);
    } catch (error) {
      console.error("Error fetching ride requests:", error);
      res.status(500).json({ message: "Falha ao buscar pedidos de boleia" });
    }
  });

  // QR Code verification
  app.get('/api/student/qr/:code', async (req, res) => {
    try {
      const qrCode = req.params.code;
      const student = await storage.getStudentByQrCode(qrCode);
      if (!student) {
        return res.status(404).json({ message: "Código QR inválido" });
      }
      res.json(student);
    } catch (error) {
      console.error("Error verifying QR code:", error);
      res.status(500).json({ message: "Falha ao verificar código QR" });
    }
  });

  // Bus reservation routes
  app.get('/api/bus-reservations/my', isAuthenticatedAny, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const student = await storage.getStudentByUserId(userId);
      if (!student) {
        return res.status(404).json({ message: "Perfil de estudante não encontrado" });
      }
      const reservation = await storage.getActiveReservation(student.id);
      res.json(reservation);
    } catch (error) {
      console.error("Error fetching reservation:", error);
      res.status(500).json({ message: "Falha ao buscar reserva" });
    }
  });

  app.get('/api/bus-reservations/counts', async (req, res) => {
    try {
      const counts = await storage.getReservationCounts();
      res.json(counts);
    } catch (error) {
      console.error("Error fetching reservation counts:", error);
      res.status(500).json({ message: "Falha ao buscar contagens de reservas" });
    }
  });

  app.post('/api/bus-reservations', isAuthenticatedAny, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const student = await storage.getStudentByUserId(userId);
      if (!student) {
        return res.status(404).json({ message: "Perfil de estudante não encontrado" });
      }

      // Validate request body
      const validationResult = createBusReservationSchema.safeParse(req.body);
      if (!validationResult.success) {
        const firstError = validationResult.error.errors[0];
        return res.status(400).json({ message: firstError.message });
      }

      const { busId } = validationResult.data;

      // Check if student already has an active reservation
      const existingReservation = await storage.getActiveReservation(student.id);
      if (existingReservation) {
        return res.status(400).json({ message: "Você já tem uma reserva ativa" });
      }

      const reservation = await storage.createReservation({
        studentId: student.id,
        busId,
        status: "active",
      });
      res.json(reservation);
    } catch (error) {
      console.error("Error creating reservation:", error);
      res.status(400).json({ message: "Falha ao criar reserva" });
    }
  });

  app.delete('/api/bus-reservations/my', isAuthenticatedAny, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const student = await storage.getStudentByUserId(userId);
      if (!student) {
        return res.status(404).json({ message: "Perfil de estudante não encontrado" });
      }

      await storage.cancelReservation(student.id);
      res.json({ message: "Reserva cancelada com sucesso" });
    } catch (error) {
      console.error("Error cancelling reservation:", error);
      res.status(400).json({ message: "Falha ao cancelar reserva" });
    }
  });

  // Accept ride request
  app.post("/api/ride-requests/:id/accept", authenticateUser, async (req, res) => {
    try {
      const requestId = parseInt(req.params.id);
      const userId = req.user!.id;

      // Check if the request exists and belongs to a ride owned by this driver
      const request = await db.query.rideRequests.findFirst({
        where: eq(rideRequests.id, requestId),
        with: { ride: true, passenger: true }
      });

      if (!request) {
        return res.status(404).json({ message: "Solicitação não encontrada" });
      }

      // Verify the driver owns the ride
      const driver = await db.query.students.findFirst({
        where: eq(students.userId, userId)
      });

      if (!driver || request.ride.driverId !== driver.id) {
        return res.status(403).json({ message: "Não autorizado" });
      }

      // Update request status
      await db.update(rideRequests)
        .set({ status: "accepted" })
        .where(eq(rideRequests.id, requestId));

      // Create notification for passenger
      await db.insert(notifications).values({
        userId: request.passenger.userId,
        type: "ride_accepted",
        title: "Bloeia Aceita! 🎉",
        message: `Seu pedido de Bloeia foi aceito! Prepare-se para a viagem.`,
        relatedId: request.rideId,
        read: false,
      });

      res.json({ message: "Solicitação aceita com sucesso" });
    } catch (error) {
      console.error("Error accepting request:", error);
      res.status(500).json({ message: "Erro ao aceitar solicitação" });
    }
  });

  // Reject ride request
  app.post("/api/ride-requests/:id/reject", authenticateUser, async (req, res) => {
    try {
      const requestId = parseInt(req.params.id);
      const userId = req.user!.id;

      // Check if the request exists and belongs to a ride owned by this driver
      const request = await db.query.rideRequests.findFirst({
        where: eq(rideRequests.id, requestId),
        with: { ride: true, passenger: true }
      });

      if (!request) {
        return res.status(404).json({ message: "Solicitação não encontrada" });
      }

      // Verify the driver owns the ride
      const driver = await db.query.students.findFirst({
        where: eq(students.userId, userId)
      });

      if (!driver || request.ride.driverId !== driver.id) {
        return res.status(403).json({ message: "Não autorizado" });
      }

      // Update request status
      await db.update(rideRequests)
        .set({ status: "rejected" })
        .where(eq(rideRequests.id, requestId));

      // Create notification for passenger
      await db.insert(notifications).values({
        userId: request.passenger.userId,
        type: "ride_rejected",
        title: "Pedido de Bloeia Recusado",
        message: `Seu pedido de Bloeia foi recusado. Tente outra viagem disponível.`,
        relatedId: request.rideId,
        read: false,
      });

      res.json({ message: "Solicitação rejeitada" });
    } catch (error) {
      console.error("Error rejecting request:", error);
      res.status(500).json({ message: "Erro ao rejeitar solicitação" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}