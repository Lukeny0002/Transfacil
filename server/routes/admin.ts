import { Router } from "express";
import { storage } from "../storage";
import { isAdmin } from "../auth";
import { buses, routes } from "@shared/schema";

const adminRouter = Router();

// Middleware to check if user is admin
adminRouter.use(isAdmin);

// Get admin dashboard stats
adminRouter.get("/stats", async (_req, res) => {
  try {
    const [
      totalUsers,
      activeStudents,
      pendingStudents,
      pendingDrivers,
      activeDrivers,
      totalRides,
      activeRoutes,
      activeBuses
    ] = await Promise.all([
      storage.countUsers(),
      storage.countActiveStudents(),
      storage.countPendingStudents(),
      storage.countPendingDrivers(),
      storage.countActiveDrivers(),
      storage.countTotalRides(),
      storage.countActiveRoutes(),
      storage.countActiveBuses()
    ]);

    res.json({
      totalUsers,
      activeStudents,
      pendingStudents,
      pendingDrivers,
      activeDrivers,
      totalRides,
      activeRoutes,
      activeBuses
    });
  } catch (error) {
    console.error("Error fetching admin stats:", error);
    res.status(500).json({ message: "Erro ao buscar estatísticas" });
  }
});

// Get recent users (for approval/management)
adminRouter.get("/users/recent", async (_req, res) => {
  try {
    const users = await storage.getRecentUsers();
    res.json(users);
  } catch (error) {
    console.error("Error fetching recent users:", error);
    res.status(500).json({ message: "Erro ao buscar usuários recentes" });
  }
});

// Get users (support filter query ?status=all|active|inactive|pending)
adminRouter.get('/users', async (req, res) => {
  try {
    const status = typeof req.query.status === 'string' ? req.query.status : undefined;
    const users = await storage.getAllUsers(status);
    res.json(users);
  } catch (error) {
    console.error('Error fetching users (admin):', error);
    res.status(500).json({ message: 'Erro ao buscar usuários' });
  }
});

// Approve driver status for a user
adminRouter.post("/users/:userId/approve-driver", async (req, res) => {
  try {
    const { userId } = req.params;
    await storage.updateUserDriverStatus(userId, true);
    res.json({ message: "Usuário aprovado como motorista" });
  } catch (error) {
    console.error("Error approving driver:", error);
    res.status(500).json({ message: "Erro ao aprovar motorista" });
  }
});

// Revoke driver status
adminRouter.post("/users/:userId/revoke-driver", async (req, res) => {
  try {
    const { userId } = req.params;
    await storage.updateUserDriverStatus(userId, false);
    res.json({ message: "Status de motorista revogado" });
  } catch (error) {
    console.error("Error revoking driver status:", error);
    res.status(500).json({ message: "Erro ao revogar status de motorista" });
  }
});

// Student Approval Endpoints
adminRouter.get("/students/pending", async (_req, res) => {
  try {
    const pendingStudents = await storage.getPendingStudents();
    res.json(pendingStudents);
  } catch (error) {
    console.error("Error fetching pending students:", error);
    res.status(500).json({ message: "Erro ao buscar estudantes pendentes" });
  }
});

adminRouter.post("/students/:studentId/approve", async (req: any, res) => {
  try {
    const studentId = parseInt(req.params.studentId);
    const adminUserId = req.user.claims.sub;
    
    const student = await storage.approveStudent(studentId, adminUserId);
    res.json({ message: "Estudante aprovado com sucesso", student });
  } catch (error) {
    console.error("Error approving student:", error);
    res.status(500).json({ message: "Erro ao aprovar estudante" });
  }
});

adminRouter.post("/students/:studentId/reject", async (req: any, res) => {
  try {
    const studentId = parseInt(req.params.studentId);
    const adminUserId = req.user.claims.sub;
    const { reason } = req.body;
    
    if (!reason) {
      return res.status(400).json({ message: "Motivo da rejeição é obrigatório" });
    }
    
    const student = await storage.rejectStudent(studentId, adminUserId, reason);
    res.json({ message: "Estudante rejeitado", student });
  } catch (error) {
    console.error("Error rejecting student:", error);
    res.status(500).json({ message: "Erro ao rejeitar estudante" });
  }
});

// Rotas para gerenciar universidades
adminRouter.get("/universities", async (_req, res) => {
  try {
    const universities = await storage.getAllUniversities();
    res.json(universities);
  } catch (error) {
    console.error("Erro ao buscar universidades:", error);
    res.status(500).json({ message: "Erro ao buscar universidades" });
  }
});

adminRouter.post("/universities", async (req, res) => {
  try {
    const { name, code, address } = req.body;
    if (!name || !code) {
      return res.status(400).json({ message: "Nome e código são obrigatórios" });
    }
    const university = await storage.createUniversity({ name, code, address });
    res.status(201).json(university);
  } catch (error) {
    console.error("Erro ao criar universidade:", error);
    res.status(500).json({ message: "Erro ao criar universidade" });
  }
});

// Get all rides (with filters)
adminRouter.get("/rides", async (req, res) => {
  try {
    const { status, fromDate, toDate } = req.query;
    const rides = await storage.getAllRides({ status, fromDate, toDate });
    res.json(rides);
  } catch (error) {
    console.error("Error fetching rides:", error);
    res.status(500).json({ message: "Erro ao buscar caronas" });
  }
});

// Bus Management
// Add new bus
adminRouter.post("/buses", async (req, res) => {
  try {
    const bus = await storage.createBus(req.body);
    res.json(bus);
  } catch (error) {
    console.error("Error creating bus:", error);
    res.status(500).json({ message: "Erro ao criar ônibus" });
  }
});

// Update bus status (active/inactive)
adminRouter.patch("/buses/:busId", async (req, res) => {
  try {
    const { busId } = req.params;
    const { isActive } = req.body;
    const bus = await storage.updateBusStatus(parseInt(busId), isActive);
    res.json(bus);
  } catch (error) {
    console.error("Error updating bus:", error);
    res.status(500).json({ message: "Erro ao atualizar ônibus" });
  }
});

// Get all buses (with filters)
adminRouter.get("/buses", async (req, res) => {
  try {
    const { status } = req.query;
    const buses = await storage.getAllBuses({ status });
    res.json(buses);
  } catch (error) {
    console.error("Error fetching buses:", error);
    res.status(500).json({ message: "Erro ao buscar ônibus" });
  }
});

// Route Management
// Add new route
adminRouter.post("/routes", async (req, res) => {
  try {
    const route = await storage.createRoute(req.body);
    res.json(route);
  } catch (error) {
    console.error("Error creating route:", error);
    res.status(500).json({ message: "Erro ao criar rota" });
  }
});

// Update route
adminRouter.patch("/routes/:routeId", async (req, res) => {
  try {
    const { routeId } = req.params;
    const route = await storage.updateRoute(parseInt(routeId), req.body);
    res.json(route);
  } catch (error) {
    console.error("Error updating route:", error);
    res.status(500).json({ message: "Erro ao atualizar rota" });
  }
});

// Get all routes (with filters)
adminRouter.get("/routes", async (req, res) => {
  try {
    const { status } = req.query;
    const routes = await storage.getAllRoutes({ status });
    res.json(routes);
  } catch (error) {
    console.error("Error fetching routes:", error);
    res.status(500).json({ message: "Erro ao buscar rotas" });
  }
});

// Universities management (admin)
adminRouter.get('/universities', async (_req, res) => {
  try {
    const list = await storage.getUniversities();
    res.json(list);
  } catch (error) {
    console.error('Error fetching universities (admin):', error);
    res.status(500).json({ message: 'Erro ao buscar universidades' });
  }
});

adminRouter.post('/universities', async (req, res) => {
  try {
    const { name, code, address } = req.body;
    if (!name || !code) {
      return res.status(400).json({ message: 'Nome e código são obrigatórios' });
    }
    const uni = await storage.createUniversity({ name, code, address });
    res.json(uni);
  } catch (error) {
    console.error('Error creating university:', error);
    res.status(500).json({ message: 'Erro ao criar universidade' });
  }
});

adminRouter.delete('/universities/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (Number.isNaN(id)) return res.status(400).json({ message: 'ID inválido' });
    await storage.deleteUniversity(id);
    res.json({ message: 'Universidade removida' });
  } catch (error) {
    console.error('Error deleting university:', error);
    res.status(500).json({ message: 'Erro ao remover universidade' });
  }
});

// Subscription Management
adminRouter.get('/subscriptions', async (_req, res) => {
  try {
    const subscriptions = await storage.getAllSubscriptions();
    res.json(subscriptions);
  } catch (error) {
    console.error('Error fetching subscriptions:', error);
    res.status(500).json({ message: 'Erro ao buscar assinaturas' });
  }
});

adminRouter.get('/subscriptions/student/:studentId', async (req, res) => {
  try {
    const studentId = parseInt(req.params.studentId);
    const subscriptions = await storage.getStudentSubscriptions(studentId);
    res.json(subscriptions);
  } catch (error) {
    console.error('Error fetching student subscriptions:', error);
    res.status(500).json({ message: 'Erro ao buscar assinaturas do estudante' });
  }
});

adminRouter.patch('/subscriptions/:id/status', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { isActive } = req.body;
    const subscription = await storage.updateSubscriptionStatus(id, isActive);
    res.json(subscription);
  } catch (error) {
    console.error('Error updating subscription status:', error);
    res.status(500).json({ message: 'Erro ao atualizar status da assinatura' });
  }
});

adminRouter.get('/subscription-plans', async (_req, res) => {
  try {
    const plans = await storage.getAllSubscriptionPlans();
    res.json(plans);
  } catch (error) {
    console.error('Error fetching subscription plans:', error);
    res.status(500).json({ message: 'Erro ao buscar planos de assinatura' });
  }
});

adminRouter.post('/subscription-plans', async (req, res) => {
  try {
    const plan = await storage.createSubscriptionPlan(req.body);
    res.status(201).json(plan);
  } catch (error) {
    console.error('Error creating subscription plan:', error);
    res.status(500).json({ message: 'Erro ao criar plano de assinatura' });
  }
});

adminRouter.patch('/subscription-plans/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const plan = await storage.updateSubscriptionPlan(id, req.body);
    res.json(plan);
  } catch (error) {
    console.error('Error updating subscription plan:', error);
    res.status(500).json({ message: 'Erro ao atualizar plano de assinatura' });
  }
});

// Schedule Management
adminRouter.get('/schedules', async (_req, res) => {
  try {
    const schedules = await storage.getAllSchedules();
    res.json(schedules);
  } catch (error) {
    console.error('Error fetching schedules:', error);
    res.status(500).json({ message: 'Erro ao buscar horários' });
  }
});

adminRouter.post('/schedules', async (req, res) => {
  try {
    const schedule = await storage.createSchedule(req.body);
    res.status(201).json(schedule);
  } catch (error) {
    console.error('Error creating schedule:', error);
    res.status(500).json({ message: 'Erro ao criar horário' });
  }
});

adminRouter.patch('/schedules/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const schedule = await storage.updateSchedule(id, req.body);
    res.json(schedule);
  } catch (error) {
    console.error('Error updating schedule:', error);
    res.status(500).json({ message: 'Erro ao atualizar horário' });
  }
});

adminRouter.delete('/schedules/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await storage.deleteSchedule(id);
    res.json({ message: 'Horário removido com sucesso' });
  } catch (error) {
    console.error('Error deleting schedule:', error);
    res.status(500).json({ message: 'Erro ao remover horário' });
  }
});

// Driver & Vehicle Management
adminRouter.get('/drivers', async (_req, res) => {
  try {
    const drivers = await storage.getAllDrivers();
    res.json(drivers);
  } catch (error) {
    console.error('Error fetching drivers:', error);
    res.status(500).json({ message: 'Erro ao buscar motoristas' });
  }
});

adminRouter.get('/drivers/pending', async (_req, res) => {
  try {
    const drivers = await storage.getPendingDriversTable();
    res.json(drivers);
  } catch (error) {
    console.error('Error fetching pending drivers:', error);
    res.status(500).json({ message: 'Erro ao buscar motoristas pendentes' });
  }
});

adminRouter.post('/drivers', async (req, res) => {
  try {
    const driver = await storage.createDriver(req.body);
    res.status(201).json(driver);
  } catch (error) {
    console.error('Error creating driver:', error);
    res.status(500).json({ message: 'Erro ao criar motorista' });
  }
});

adminRouter.patch('/drivers/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const driver = await storage.updateDriver(id, req.body);
    res.json(driver);
  } catch (error) {
    console.error('Error updating driver:', error);
    res.status(500).json({ message: 'Erro ao atualizar motorista' });
  }
});

adminRouter.post('/drivers/:id/approve', async (req: any, res) => {
  try {
    const id = parseInt(req.params.id);
    const adminUserId = req.user.claims.sub;
    const driver = await storage.approveDriverTable(id, adminUserId);
    res.json({ message: 'Motorista aprovado com sucesso', driver });
  } catch (error) {
    console.error('Error approving driver:', error);
    res.status(500).json({ message: 'Erro ao aprovar motorista' });
  }
});

adminRouter.post('/drivers/:id/reject', async (req: any, res) => {
  try {
    const id = parseInt(req.params.id);
    const adminUserId = req.user.claims.sub;
    const { reason } = req.body;
    if (!reason) {
      return res.status(400).json({ message: 'Motivo da rejeição é obrigatório' });
    }
    const driver = await storage.rejectDriverTable(id, adminUserId, reason);
    res.json({ message: 'Motorista rejeitado', driver });
  } catch (error) {
    console.error('Error rejecting driver:', error);
    res.status(500).json({ message: 'Erro ao rejeitar motorista' });
  }
});

adminRouter.get('/vehicles', async (_req, res) => {
  try {
    const vehicles = await storage.getAllVehicles();
    res.json(vehicles);
  } catch (error) {
    console.error('Error fetching vehicles:', error);
    res.status(500).json({ message: 'Erro ao buscar veículos' });
  }
});

adminRouter.post('/vehicles', async (req, res) => {
  try {
    const vehicle = await storage.createVehicle(req.body);
    res.status(201).json(vehicle);
  } catch (error) {
    console.error('Error creating vehicle:', error);
    res.status(500).json({ message: 'Erro ao criar veículo' });
  }
});

adminRouter.patch('/vehicles/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const vehicle = await storage.updateVehicle(id, req.body);
    res.json(vehicle);
  } catch (error) {
    console.error('Error updating vehicle:', error);
    res.status(500).json({ message: 'Erro ao atualizar veículo' });
  }
});

adminRouter.delete('/vehicles/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await storage.deleteVehicle(id);
    res.json({ message: 'Veículo removido com sucesso' });
  } catch (error) {
    console.error('Error deleting vehicle:', error);
    res.status(500).json({ message: 'Erro ao remover veículo' });
  }
});

// Event Management
adminRouter.get('/events', async (_req, res) => {
  try {
    const events = await storage.getAllEvents();
    res.json(events);
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ message: 'Erro ao buscar eventos' });
  }
});

adminRouter.post('/events', async (req, res) => {
  try {
    const event = await storage.createEvent(req.body);
    res.status(201).json(event);
  } catch (error) {
    console.error('Error creating event:', error);
    res.status(500).json({ message: 'Erro ao criar evento' });
  }
});

adminRouter.patch('/events/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const event = await storage.updateEvent(id, req.body);
    res.json(event);
  } catch (error) {
    console.error('Error updating event:', error);
    res.status(500).json({ message: 'Erro ao atualizar evento' });
  }
});

adminRouter.delete('/events/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await storage.deleteEvent(id);
    res.json({ message: 'Evento removido com sucesso' });
  } catch (error) {
    console.error('Error deleting event:', error);
    res.status(500).json({ message: 'Erro ao remover evento' });
  }
});

adminRouter.get('/event-bookings', async (req, res) => {
  try {
    const eventId = req.query.eventId ? parseInt(req.query.eventId as string) : undefined;
    const bookings = await storage.getAllEventBookings(eventId);
    res.json(bookings);
  } catch (error) {
    console.error('Error fetching event bookings:', error);
    res.status(500).json({ message: 'Erro ao buscar reservas de eventos' });
  }
});

adminRouter.get('/payment-proofs/pending', async (_req, res) => {
  try {
    const proofs = await storage.getPendingPaymentProofs();
    res.json(proofs);
  } catch (error) {
    console.error('Error fetching payment proofs:', error);
    res.status(500).json({ message: 'Erro ao buscar comprovativos de pagamento' });
  }
});

adminRouter.post('/payment-proofs/:id/approve', async (req: any, res) => {
  try {
    const id = parseInt(req.params.id);
    const adminUserId = req.user.claims.sub;
    const proof = await storage.approvePaymentProof(id, adminUserId);
    res.json({ message: 'Comprovativo aprovado com sucesso', proof });
  } catch (error) {
    console.error('Error approving payment proof:', error);
    res.status(500).json({ message: 'Erro ao aprovar comprovativo' });
  }
});

adminRouter.post('/payment-proofs/:id/reject', async (req: any, res) => {
  try {
    const id = parseInt(req.params.id);
    const adminUserId = req.user.claims.sub;
    const { reason } = req.body;
    if (!reason) {
      return res.status(400).json({ message: 'Motivo da rejeição é obrigatório' });
    }
    const proof = await storage.rejectPaymentProof(id, adminUserId, reason);
    res.json({ message: 'Comprovativo rejeitado', proof });
  } catch (error) {
    console.error('Error rejecting payment proof:', error);
    res.status(500).json({ message: 'Erro ao rejeitar comprovativo' });
  }
});

export default adminRouter;