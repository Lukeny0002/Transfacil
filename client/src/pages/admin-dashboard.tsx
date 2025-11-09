'use client';

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Users,
  Car,
  Bus as BusIcon,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Eye,
  Edit,
  BarChart3,
  MapPin,
  School
} from "lucide-react";

import { UniversitiesTab } from "@/components/universities-tab";

import type { User, Bus, Route, Ride, Stats, Filters, University } from './admin-dashboard-interfaces';
import {
  fetchStats,
  fetchUsers,
  fetchBuses,
  fetchRoutes,
  fetchRides,
  approveDriverMutation,
  revokeDriverMutation,
  updateBusStatusMutation,
  updateRouteMutation
} from './admin-dashboard-mutations';
import {
  fetchUniversities,
  createUniversityMutation,
  deleteUniversityMutation,
} from './admin-dashboard-mutations';

function StatsCard({
  title,
  value,
  icon,
}: {
  title: string;
  value?: number;
  icon: React.ReactNode;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value || 0}</div>
      </CardContent>
    </Card>
  );
}

export default function AdminDashboard() {
  const queryClient = useQueryClient();
  const { isAdmin } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("overview");
  const [newUniName, setNewUniName] = useState("");
  const [newUniCode, setNewUniCode] = useState("");
  const [newUniAddress, setNewUniAddress] = useState("");
    const [filters, setFilters] = useState<Filters>({
      userStatus: "all",
      busStatus: "all",
      routeStatus: "all",
      rideStatus: "all",
    });
  const { toast } = useToast();

  // Redireciona usuários não-admin
  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Acesso Negado</h1>
          <p>Você precisa ser um administrador para acessar esta página.</p>
        </div>
      </div>
    );
  }
  
  // Queries com retry e staleTime
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['admin', 'stats'],
    queryFn: fetchStats,
    refetchInterval: 30000, // Atualiza a cada 30 segundos
    retry: 3, // Tenta 3 vezes em caso de erro
    staleTime: 10000, // Considera os dados frescos por 10 segundos
    enabled: isAdmin // Só executa se o usuário for admin
  });
  
  // Mutations para usuários
  const { mutate: approveDriver } = useMutation({
    mutationFn: approveDriverMutation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'stats'] });
      toast({
        title: "Motorista aprovado",
        description: "O usuário foi aprovado como motorista"
      });
    },
    onError: (error: Error) => {
      console.error('Erro ao aprovar motorista:', error);
      toast({
        title: "Erro",
        description: error.message || "Erro ao aprovar motorista",
        variant: "destructive"
      });
    }
  });

  const { mutate: revokeDriver } = useMutation({
    mutationFn: revokeDriverMutation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'stats'] });
      toast({
        title: "Status revogado",
        description: "O status de motorista foi revogado"
      });
    },
    onError: (error: Error) => {
      console.error('Erro ao revogar status:', error);
      toast({
        title: "Erro",
        description: error.message || "Erro ao revogar status de motorista",
        variant: "destructive"
      });
    }
  });

  const { data: users, isLoading: usersLoading } = useQuery({
    queryKey: ['admin', 'users', filters.userStatus],
    queryFn: () => fetchUsers(filters.userStatus),
    refetchInterval: 30000,
    retry: 3,
    staleTime: 10000,
    enabled: isAdmin
  });

  // Mutations para ônibus
  const { mutate: updateBusStatus } = useMutation({
    mutationFn: updateBusStatusMutation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'buses'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'stats'] });
      toast({
        title: "Ônibus atualizado",
        description: "O status do ônibus foi atualizado com sucesso"
      });
    },
    onError: (error: Error) => {
      console.error('Erro ao atualizar ônibus:', error);
      toast({
        title: "Erro",
        description: error.message || "Erro ao atualizar status do ônibus",
        variant: "destructive"
      });
    }
  });

  const { data: buses, isLoading: busesLoading } = useQuery({
    queryKey: ['admin', 'buses', filters.busStatus],
    queryFn: () => fetchBuses(filters.busStatus),
    refetchInterval: 30000,
    retry: 3,
    staleTime: 10000,
    enabled: isAdmin,
    onError: (error) => {
      console.error('Erro ao carregar ônibus:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar a lista de ônibus",
        variant: "destructive"
      });
    }
  });

  const { data: routes, isLoading: routesLoading } = useQuery({
    queryKey: ['admin', 'routes', filters.routeStatus],
    queryFn: () => fetchRoutes(filters.routeStatus),
    refetchInterval: 30000,
    retry: 3,
    staleTime: 10000,
    enabled: isAdmin,
    onError: (error) => {
      console.error('Erro ao carregar rotas:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar a lista de rotas",
        variant: "destructive"
      });
    }
  });

  const { data: rides, isLoading: ridesLoading } = useQuery({
    queryKey: ['admin', 'rides', filters.rideStatus],
    queryFn: () => fetchRides(filters.rideStatus),
    refetchInterval: 30000,
    retry: 3,
    staleTime: 10000,
    enabled: isAdmin,
    onError: (error) => {
      console.error('Erro ao carregar corridas:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar a lista de corridas",
        variant: "destructive"
      });
    }
  });

  const { data: universities, isLoading: universitiesLoading } = useQuery({
    queryKey: ['admin', 'universities'],
    queryFn: fetchUniversities,
    refetchInterval: 30000,
    retry: 3,
    staleTime: 10000,
    enabled: isAdmin,
    onError: (error) => {
      console.error('Erro ao carregar universidades:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar a lista de universidades",
        variant: "destructive"
      });
    }
  });
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedBus, setSelectedBus] = useState<Bus | null>(null);
  const [selectedRoute, setSelectedRoute] = useState<Route | null>(null);
  const [selectedUniversity, setSelectedUniversity] = useState<University | null>(null);
  const [newUniversity, setNewUniversity] = useState({ name: "", code: "", address: "" });
  const [showNewUniversityDialog, setShowNewUniversityDialog] = useState(false);
  

  // Mutations para universidades
  const { mutate: createUniversity } = useMutation({
    mutationFn: createUniversityMutation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'universities'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'stats'] });
      setShowNewUniversityDialog(false);
      setNewUniversity({ name: "", code: "", address: "" });
      toast({
        title: "Universidade criada",
        description: "A universidade foi criada com sucesso"
      });
    },
    onError: (error: Error) => {
      console.error('Erro ao criar universidade:', error);
      toast({
        title: "Erro",
        description: error.message || "Erro ao criar universidade",
        variant: "destructive"
      });
    }
  });

  const { mutate: deleteUniversity } = useMutation({
    mutationFn: deleteUniversityMutation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'universities'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'stats'] });
      toast({
        title: "Universidade removida",
        description: "A universidade foi removida com sucesso"
      });
    },
    onError: (error: Error) => {
      console.error('Erro ao remover universidade:', error);
      toast({
        title: "Erro",
        description: error.message || "Erro ao remover universidade",
        variant: "destructive"
      });
    }
  });

  const updateRouteMut = useMutation({
    mutationFn: updateRouteMutation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'routes'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'stats'] });
      toast({
        title: "Rota atualizada",
        description: "A rota foi atualizada com sucesso.",
      });
    },
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'available':
        return 'Disponível';
      case 'full':
        return 'Lotada';
      case 'completed':
        return 'Concluída';
      case 'cancelled':
        return 'Cancelada';
      default:
        return status;
    }
  };

  if (statsLoading || usersLoading || ridesLoading || busesLoading || routesLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Painel Administrativo</h1>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-6 mb-6">
          <TabsTrigger value="overview">
            <BarChart3 className="w-4 h-4 mr-2" />
            Visão Geral
          </TabsTrigger>
          <TabsTrigger value="users">
            <Users className="w-4 h-4 mr-2" />
            Usuários
          </TabsTrigger>
          <TabsTrigger value="buses">
            <BusIcon className="w-4 h-4 mr-2" />
            Ônibus
          </TabsTrigger>
          <TabsTrigger value="routes">
            <MapPin className="w-4 h-4 mr-2" />
            Rotas
          </TabsTrigger>
          <TabsTrigger value="rides">
            <Car className="w-4 h-4 mr-2" />
            Corridas
          </TabsTrigger>
          <TabsTrigger value="universities">
            <School className="w-4 h-4 mr-2" />
            Universidades
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatsCard
              title="Total de Usuários"
              value={stats?.totalUsers}
              icon={<Users className="w-4 h-4" />}
            />
            <StatsCard
              title="Estudantes Ativos"
              value={stats?.activeStudents}
              icon={<Users className="w-4 h-4" />}
            />
            <StatsCard
              title="Motoristas Pendentes"
              value={stats?.pendingDrivers}
              icon={<AlertTriangle className="w-4 h-4" />}
            />
            <StatsCard
              title="Motoristas Ativos"
              value={stats?.activeDrivers}
              icon={<Car className="w-4 h-4" />}
            />
            <StatsCard
              title="Total de Caronas"
              value={stats?.totalRides}
              icon={<TrendingUp className="w-4 h-4" />}
            />
            <StatsCard
              title="Rotas Ativas"
              value={stats?.activeRoutes}
              icon={<MapPin className="w-4 h-4" />}
            />
            <StatsCard
              title="Ônibus Ativos"
              value={stats?.activeBuses}
              icon={<BusIcon className="w-4 h-4" />}
            />
          </div>
        </TabsContent>

        <TabsContent value="users">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex gap-2">
                <Input
                  placeholder="Buscar usuários..."
                  className="w-[300px]"
                  type="search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Select
                  value={filters.userStatus}
                  onValueChange={(value) =>
                    setFilters((prev) => ({ ...prev, userStatus: value }))
                  }
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="active">Ativos</SelectItem>
                    <SelectItem value="inactive">Inativos</SelectItem>
                    <SelectItem value="pending">Pendentes</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Data de Cadastro</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users?.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        {user.firstName} {user.lastName}
                      </TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        {user.driverPending && (
                          <Badge variant="warning">Pendente</Badge>
                        )}
                        {user.isDriver && <Badge variant="success">Motorista</Badge>}
                        {!user.isActive && (
                          <Badge variant="destructive">Inativo</Badge>
                        )}
                      </TableCell>
                      <TableCell>{formatDate(user.createdAt)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {user.driverPending && (
                            <>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => approveDriver(user.id)}
                              >
                                <CheckCircle className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => revokeDriver(user.id)}
                              >
                                <XCircle className="w-4 h-4" />
                              </Button>
                            </>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedUser(user)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            {/* Universities management (admin) */}
            <div className="mt-6 border rounded-md p-4">
              <h3 className="text-lg font-medium mb-3">Universidades</h3>
              <div className="mb-3 flex gap-2 items-center">
                <Input placeholder="Nome" value={newUniName} onChange={(e) => setNewUniName((e.target as HTMLInputElement).value)} />
                <Input placeholder="Código" value={newUniCode} onChange={(e) => setNewUniCode((e.target as HTMLInputElement).value)} />
                <Input placeholder="Endereço (opcional)" value={newUniAddress} onChange={(e) => setNewUniAddress((e.target as HTMLInputElement).value)} />
                <Button onClick={() => createUniversity({ name: newUniName, code: newUniCode, address: newUniAddress })} disabled={!newUniName || !newUniCode}>Adicionar</Button>
              </div>
              <div>
                {universities?.length === 0 && <p className="text-sm text-muted-foreground">Nenhuma universidade cadastrada.</p>}
                <ul>
                  {universities?.map((u: any) => (
                    <li key={u.id} className="flex items-center justify-between py-2 border-b">
                      <div>
                        <div className="font-medium">{u.name} <span className="text-sm text-muted-foreground">({u.code})</span></div>
                        {u.address && <div className="text-sm text-muted-foreground">{u.address}</div>}
                      </div>
                      <div>
                        <Button variant="destructive" size="sm" onClick={() => deleteUniversity(u.id)}>Remover</Button>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="transport">
          <div className="space-y-6">
            {/* Buses Management */}
            <div>
              <h3 className="text-lg font-medium mb-4">Ônibus</h3>
              <div className="flex gap-2 mb-4">
                <Select
                  value={filters.busStatus}
                  onValueChange={(value) =>
                    setFilters((prev) => ({ ...prev, busStatus: value }))
                  }
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="active">Ativos</SelectItem>
                    <SelectItem value="inactive">Inativos</SelectItem>
                  </SelectContent>
                </Select>
                <Button>
                  <BusIcon className="w-4 h-4 mr-2" />
                  Adicionar Ônibus
                </Button>
              </div>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Número</TableHead>
                      <TableHead>Capacidade</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {buses?.map((bus) => (
                      <TableRow key={bus.id}>
                        <TableCell>{bus.number}</TableCell>
                        <TableCell>{bus.capacity}</TableCell>
                        <TableCell>
                          <Badge
                            variant={bus.isActive ? "success" : "destructive"}
                          >
                            {bus.isActive ? "Ativo" : "Inativo"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                updateBusStatusMut.mutate({
                                  busId: bus.id,
                                  isActive: !bus.isActive,
                                })
                              }
                            >
                              {bus.isActive ? (
                                <XCircle className="w-4 h-4" />
                              ) : (
                                <CheckCircle className="w-4 h-4" />
                              )}
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setSelectedBus(bus)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>

            {/* Routes Management */}
            <div>
              <h3 className="text-lg font-medium mb-4">Rotas</h3>
              <div className="flex gap-2 mb-4">
                <Select
                  value={filters.routeStatus}
                  onValueChange={(value) =>
                    setFilters((prev) => ({ ...prev, routeStatus: value }))
                  }
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas</SelectItem>
                    <SelectItem value="active">Ativas</SelectItem>
                    <SelectItem value="inactive">Inativas</SelectItem>
                  </SelectContent>
                </Select>
                <Button>
                  <MapPin className="w-4 h-4 mr-2" />
                  Adicionar Rota
                </Button>
              </div>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>Descrição</TableHead>
                      <TableHead>Paradas</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {routes?.map((route) => (
                      <TableRow key={route.id}>
                        <TableCell>{route.name}</TableCell>
                        <TableCell>{route.description}</TableCell>
                        <TableCell>{route.stops.length} paradas</TableCell>
                        <TableCell>
                          <Badge
                            variant={route.isActive ? "success" : "destructive"}
                          >
                            {route.isActive ? "Ativa" : "Inativa"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                updateRouteMut.mutate({
                                  routeId: route.id,
                                  data: { isActive: !route.isActive },
                                })
                              }
                            >
                              {route.isActive ? (
                                <XCircle className="w-4 h-4" />
                              ) : (
                                <CheckCircle className="w-4 h-4" />
                              )}
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setSelectedRoute(route)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="rides">
          <div className="space-y-4">
            <div className="flex gap-2">
              <Select
                value={filters.rideStatus}
                onValueChange={(value) =>
                  setFilters((prev) => ({ ...prev, rideStatus: value }))
                }
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  <SelectItem value="available">Disponíveis</SelectItem>
                  <SelectItem value="full">Lotadas</SelectItem>
                  <SelectItem value="completed">Concluídas</SelectItem>
                  <SelectItem value="cancelled">Canceladas</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>De</TableHead>
                    <TableHead>Para</TableHead>
                    <TableHead>Data/Hora</TableHead>
                    <TableHead>Vagas</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rides?.map((ride) => (
                    <TableRow key={ride.id}>
                      <TableCell>{ride.fromLocation}</TableCell>
                      <TableCell>{ride.toLocation}</TableCell>
                      <TableCell>{formatDate(ride.startTime)}</TableCell>
                      <TableCell>{ride.availableSeats}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            ride.status === "available"
                              ? "success"
                              : ride.status === "full"
                              ? "warning"
                              : ride.status === "completed"
                              ? "default"
                              : "destructive"
                          }
                        >
                          {getStatusText(ride.status)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* User details dialog */}
      <Dialog open={!!selectedUser} onOpenChange={() => setSelectedUser(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Detalhes do Usuário</DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium">Nome</h4>
                <p>
                  {selectedUser.firstName} {selectedUser.lastName}
                </p>
              </div>
              <div>
                <h4 className="text-sm font-medium">Email</h4>
                <p>{selectedUser.email}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium">Status</h4>
                <div className="flex gap-2 mt-1">
                  {selectedUser.isAdmin && (
                    <Badge variant="default">Administrador</Badge>
                  )}
                  {selectedUser.isDriver && (
                    <Badge variant="success">Motorista</Badge>
                  )}
                  {selectedUser.driverPending && (
                    <Badge variant="warning">Pendente</Badge>
                  )}
                  {!selectedUser.isActive && (
                    <Badge variant="destructive">Inativo</Badge>
                  )}
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium">Data de Cadastro</h4>
                <p>{formatDate(selectedUser.createdAt)}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Bus edit dialog */}
      <Dialog open={!!selectedBus} onOpenChange={() => setSelectedBus(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Ônibus</DialogTitle>
          </DialogHeader>
          {selectedBus && (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Número</label>
                <Input value={selectedBus.number} />
              </div>
              <div>
                <label className="text-sm font-medium">Capacidade</label>
                <Input type="number" value={selectedBus.capacity} />
              </div>
              <div>
                <label className="text-sm font-medium">Rota</label>
                <Select value={selectedBus.routeId?.toString()}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma rota" />
                  </SelectTrigger>
                  <SelectContent>
                    {routes?.map((route) => (
                      <SelectItem key={route.id} value={route.id.toString()}>
                        {route.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setSelectedBus(null)}>
                  Cancelar
                </Button>
                <Button>Salvar</Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Route edit dialog */}
      <Dialog open={!!selectedRoute} onOpenChange={() => setSelectedRoute(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Rota</DialogTitle>
          </DialogHeader>
          {selectedRoute && (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Nome</label>
                <Input value={selectedRoute.name} />
              </div>
              <div>
                <label className="text-sm font-medium">Descrição</label>
                <Input value={selectedRoute.description} />
              </div>
              <div>
                <label className="text-sm font-medium">Paradas</label>
                {/* TODO: Add stops management UI */}
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setSelectedRoute(null)}>
                  Cancelar
                </Button>
                <Button>Salvar</Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}