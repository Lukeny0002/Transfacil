import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { 
  Users, 
  Car, 
  Bus, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle,
  XCircle,
  Eye,
  Edit,
  Settings,
  BarChart3,
  Calendar,
  MapPin,
  DollarSign,
  Clock,
  Search,
  Filter,
  Download,
  Mail,
  Phone
} from "lucide-react";
import logoImage from "@assets/1000077720.jpg";

export default function AdminDashboard() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'rides' | 'routes' | 'reports'>('overview');
  const [searchTerm, setSearchTerm] = useState("");

  // Admin stats queries
  const { data: adminStats } = useQuery({
    queryKey: ['/api/admin/stats'],
    retry: false,
  });

  const { data: users = [] } = useQuery({
    queryKey: ['/api/admin/users'],
    retry: false,
  });

  const { data: rides = [] } = useQuery({
    queryKey: ['/api/admin/rides'],
    retry: false,
  });

  const { data: routes = [] } = useQuery({
    queryKey: ['/api/admin/routes'],
    retry: false,
  });

  const suspendUserMutation = useMutation({
    mutationFn: async (userId: string) => {
      await apiRequest("POST", `/api/admin/users/${userId}/suspend`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/users'] });
      toast({
        title: "Usuário suspenso",
        description: "O usuário foi suspenso com sucesso.",
      });
    },
  });

  // Mock data for demonstration
  const mockStats = {
    totalUsers: 2847,
    activeStudents: 2234,
    activeDrivers: 186,
    totalRides: 1523,
    completedRides: 1401,
    cancelledRides: 122,
    totalRevenue: 45678,
    monthlyGrowth: 23.5
  };

  const mockUsers = [
    {
      id: "1",
      fullName: "Ana Costa Silva",
      email: "ana.costa@uan.edu.ao",
      university: "UAN",
      role: "student",
      status: "active",
      joinDate: "2025-01-15",
      ridesCount: 45
    },
    {
      id: "2", 
      fullName: "João Manuel",
      email: "joao.manuel@ucan.edu.ao",
      university: "UCAN",
      role: "driver",
      status: "active",
      joinDate: "2025-02-01",
      ridesCount: 128
    },
    {
      id: "3",
      fullName: "Maria Santos",
      email: "maria.santos@isptec.edu.ao", 
      university: "ISPTEC",
      role: "student",
      status: "suspended",
      joinDate: "2025-01-20",
      ridesCount: 12
    }
  ];

  const mockRides = [
    {
      id: 1,
      driver: "João Manuel",
      from: "UAN Campus Central",
      to: "Shopping Belas",
      date: "2025-06-11T14:30:00",
      passengers: 3,
      maxSeats: 4,
      price: 800,
      status: "completed"
    },
    {
      id: 2,
      driver: "Pedro Silva",
      from: "ISPTEC",
      to: "Talatona", 
      date: "2025-06-11T16:00:00",
      passengers: 2,
      maxSeats: 3,
      price: 1200,
      status: "active"
    },
    {
      id: 3,
      driver: "Carlos Alberto",
      from: "UCAN",
      to: "Centro da Cidade",
      date: "2025-06-11T18:30:00",
      passengers: 1,
      maxSeats: 4,
      price: 600,
      status: "cancelled"
    }
  ];

  const mockRoutes = [
    {
      id: 1,
      name: "UAN → Shopping Belas",
      frequency: "Daily",
      avgDuration: "35 min",
      popularity: 92,
      status: "active"
    },
    {
      id: 2,
      name: "ISPTEC → Talatona",
      frequency: "Weekdays",
      avgDuration: "25 min", 
      popularity: 78,
      status: "active"
    },
    {
      id: 3,
      name: "UCAN → Centro",
      frequency: "Daily",
      avgDuration: "40 min",
      popularity: 65,
      status: "maintenance"
    }
  ];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-AO');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'suspended': return 'bg-red-100 text-red-800';
      case 'cancelled': return 'bg-gray-100 text-gray-800';
      case 'maintenance': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Ativo';
      case 'completed': return 'Completada';
      case 'suspended': return 'Suspenso';
      case 'cancelled': return 'Cancelada';
      case 'maintenance': return 'Manutenção';
      default: return status;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-primary rounded-lg p-2">
                <img 
                  src={logoImage} 
                  alt="TransFácil" 
                  className="w-8 h-8 object-contain"
                />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">TRANSFÁCIL</h1>
                <p className="text-sm text-gray-600">Painel Administrativo</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Configurações
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => window.location.href = "/api/logout"}
              >
                Sair
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-6">
          <div className="flex space-x-8">
            {[
              { id: 'overview', label: 'Visão Geral', icon: BarChart3 },
              { id: 'users', label: 'Usuários', icon: Users },
              { id: 'rides', label: 'Viagens', icon: Car },
              { id: 'routes', label: 'Rotas', icon: MapPin },
              { id: 'reports', label: 'Relatórios', icon: TrendingUp }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 py-4 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total de Usuários</p>
                      <p className="text-2xl font-bold text-gray-900">{mockStats.totalUsers.toLocaleString()}</p>
                      <p className="text-xs text-green-600">+{mockStats.monthlyGrowth}% este mês</p>
                    </div>
                    <Users className="h-8 w-8 text-primary" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Viagens Completadas</p>
                      <p className="text-2xl font-bold text-gray-900">{mockStats.completedRides.toLocaleString()}</p>
                      <p className="text-xs text-gray-500">{mockStats.totalRides} total</p>
                    </div>
                    <CheckCircle className="h-8 w-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Motoristas Ativos</p>
                      <p className="text-2xl font-bold text-gray-900">{mockStats.activeDrivers}</p>
                      <p className="text-xs text-gray-500">Verificados</p>
                    </div>
                    <Car className="h-8 w-8 text-blue-500" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Receita Total</p>
                      <p className="text-2xl font-bold text-gray-900">{mockStats.totalRevenue.toLocaleString()} AKZ</p>
                      <p className="text-xs text-green-600">Este mês</p>
                    </div>
                    <DollarSign className="h-8 w-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Atividade Recente</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { action: "Nova viagem completada", user: "João Manuel", time: "há 5 min", type: "success" },
                    { action: "Usuário cadastrado", user: "Ana Costa", time: "há 12 min", type: "info" },
                    { action: "Viagem cancelada", user: "Carlos Silva", time: "há 30 min", type: "warning" },
                    { action: "Nova rota ativada", user: "Sistema", time: "há 1 hora", type: "info" },
                  ].map((activity, index) => (
                    <div key={index} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                      <div className="flex items-center space-x-3">
                        <div className={`w-2 h-2 rounded-full ${
                          activity.type === 'success' ? 'bg-green-500' :
                          activity.type === 'warning' ? 'bg-yellow-500' :
                          'bg-blue-500'
                        }`} />
                        <div>
                          <p className="font-medium">{activity.action}</p>
                          <p className="text-sm text-gray-600">{activity.user}</p>
                        </div>
                      </div>
                      <span className="text-sm text-gray-500">{activity.time}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Gerenciar Usuários</h2>
              <div className="flex space-x-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Buscar usuários..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-64"
                  />
                </div>
                <Button variant="outline">
                  <Filter className="h-4 w-4 mr-2" />
                  Filtros
                </Button>
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Exportar
                </Button>
              </div>
            </div>

            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b">
                      <tr>
                        <th className="text-left p-4 font-medium text-gray-900">Usuário</th>
                        <th className="text-left p-4 font-medium text-gray-900">Universidade</th>
                        <th className="text-left p-4 font-medium text-gray-900">Tipo</th>
                        <th className="text-left p-4 font-medium text-gray-900">Status</th>
                        <th className="text-left p-4 font-medium text-gray-900">Viagens</th>
                        <th className="text-left p-4 font-medium text-gray-900">Cadastro</th>
                        <th className="text-left p-4 font-medium text-gray-900">Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mockUsers.map((user) => (
                        <tr key={user.id} className="border-b hover:bg-gray-50">
                          <td className="p-4">
                            <div>
                              <p className="font-medium">{user.fullName}</p>
                              <p className="text-sm text-gray-600">{user.email}</p>
                            </div>
                          </td>
                          <td className="p-4">{user.university}</td>
                          <td className="p-4">
                            <Badge variant={user.role === 'driver' ? 'default' : 'secondary'}>
                              {user.role === 'driver' ? 'Motorista' : 'Estudante'}
                            </Badge>
                          </td>
                          <td className="p-4">
                            <Badge className={getStatusColor(user.status)}>
                              {getStatusText(user.status)}
                            </Badge>
                          </td>
                          <td className="p-4">{user.ridesCount}</td>
                          <td className="p-4">{formatDate(user.joinDate)}</td>
                          <td className="p-4">
                            <div className="flex space-x-2">
                              <Button variant="outline" size="sm">
                                <Eye className="h-3 w-3" />
                              </Button>
                              <Button variant="outline" size="sm">
                                <Edit className="h-3 w-3" />
                              </Button>
                              {user.status === 'active' && (
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => suspendUserMutation.mutate(user.id)}
                                >
                                  <XCircle className="h-3 w-3" />
                                </Button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'rides' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Gerenciar Viagens</h2>
              <div className="flex space-x-3">
                <Button variant="outline">
                  <Calendar className="h-4 w-4 mr-2" />
                  Filtrar por Data
                </Button>
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Exportar
                </Button>
              </div>
            </div>

            <div className="grid gap-6">
              {mockRides.map((ride) => (
                <Card key={ride.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-4 mb-4">
                          <Badge className={getStatusColor(ride.status)}>
                            {getStatusText(ride.status)}
                          </Badge>
                          <span className="text-sm text-gray-500">
                            {new Date(ride.date).toLocaleString('pt-AO')}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <p className="font-medium mb-2">Motorista: {ride.driver}</p>
                            <div className="space-y-1 text-sm">
                              <div className="flex items-center space-x-2">
                                <MapPin className="h-3 w-3 text-green-600" />
                                <span>{ride.from}</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <MapPin className="h-3 w-3 text-red-600" />
                                <span>{ride.to}</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="text-sm">
                            <p><strong>Passageiros:</strong> {ride.passengers}/{ride.maxSeats}</p>
                            <p><strong>Preço:</strong> {ride.price} AKZ</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-1" />
                          Ver Detalhes
                        </Button>
                        <Button variant="outline" size="sm">
                          <Phone className="h-4 w-4 mr-1" />
                          Contato
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'routes' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Gerenciar Rotas</h2>
              <Button className="gradient-bg text-white">
                <MapPin className="h-4 w-4 mr-2" />
                Nova Rota
              </Button>
            </div>

            <div className="grid gap-6">
              {mockRoutes.map((route) => (
                <Card key={route.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-4 mb-2">
                          <h3 className="text-lg font-medium">{route.name}</h3>
                          <Badge className={getStatusColor(route.status)}>
                            {getStatusText(route.status)}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                          <div>
                            <Clock className="h-4 w-4 inline mr-1" />
                            <strong>Frequência:</strong> {route.frequency}
                          </div>
                          <div>
                            <Clock className="h-4 w-4 inline mr-1" />
                            <strong>Duração Média:</strong> {route.avgDuration}
                          </div>
                          <div>
                            <TrendingUp className="h-4 w-4 inline mr-1" />
                            <strong>Popularidade:</strong> {route.popularity}%
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          <BarChart3 className="h-4 w-4 mr-1" />
                          Estatísticas
                        </Button>
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4 mr-1" />
                          Editar
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'reports' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Relatórios e Analytics</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Relatórios Disponíveis</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { name: "Relatório de Usuários", description: "Dados de cadastros e atividade" },
                    { name: "Relatório de Viagens", description: "Estatísticas de viagens completadas" },
                    { name: "Relatório Financeiro", description: "Receitas e transações" },
                    { name: "Relatório de Rotas", description: "Performance das rotas" }
                  ].map((report, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-medium">{report.name}</h4>
                        <p className="text-sm text-gray-600">{report.description}</p>
                      </div>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-1" />
                        Baixar
                      </Button>
                    </div>
                  ))}
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Métricas Principais</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Taxa de Conclusão de Viagens</span>
                      <span className="font-medium">92%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Tempo Médio de Resposta</span>
                      <span className="font-medium">3.2 min</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Avaliação Média</span>
                      <span className="font-medium">4.7/5</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Crescimento Mensal</span>
                      <span className="font-medium text-green-600">+23.5%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}