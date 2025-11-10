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

export default adminRouter;