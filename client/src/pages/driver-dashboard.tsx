import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { 
  Car, 
  Users, 
  Clock, 
  MapPin, 
  Star, 
  TrendingUp, 
  Calendar,
  MessageCircle,
  Phone,
  Navigation,
  Settings,
  Plus,
  Eye,
  CheckCircle,
  XCircle
} from "lucide-react";
import logoImage from "@assets/1000077720.jpg";

export default function DriverDashboard() {
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<'overview' | 'rides' | 'requests' | 'earnings'>('overview');

  // Driver stats query
  const { data: driverStats } = useQuery({
    queryKey: ['/api/driver/stats'],
    retry: false,
  });

  // Active rides query
  const { data: activeRides = [] } = useQuery({
    queryKey: ['/api/driver/rides/active'],
    retry: false,
  });

  // Ride requests query
  const { data: rideRequests = [] } = useQuery({
    queryKey: ['/api/driver/requests'],
    retry: false,
  });

  const acceptRequestMutation = useMutation({
    mutationFn: async (requestId: number) => {
      await apiRequest("POST", `/api/ride-requests/${requestId}/accept`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/driver/requests'] });
      queryClient.invalidateQueries({ queryKey: ['/api/driver/rides/active'] });
      toast({
        title: "Solicitação aceita!",
        description: "O passageiro foi notificado.",
      });
    },
  });

  const rejectRequestMutation = useMutation({
    mutationFn: async (requestId: number) => {
      await apiRequest("POST", `/api/ride-requests/${requestId}/reject`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/driver/requests'] });
      toast({
        title: "Solicitação rejeitada",
        description: "O passageiro foi notificado.",
      });
    },
  });

  const mockStats = {
    totalRides: 47,
    averageRating: 4.8,
    totalEarnings: 12450,
    activeRides: 3
  };

  const mockActiveRides = [
    {
      id: 1,
      fromLocation: "UAN Campus Central",
      toLocation: "Shopping Belas",
      departureTime: "2025-06-11T14:30:00",
      passengers: 2,
      maxSeats: 4,
      price: 800,
      status: "confirmed"
    },
    {
      id: 2,
      fromLocation: "ISPTEC",
      toLocation: "Talatona",
      departureTime: "2025-06-11T16:00:00",
      passengers: 1,
      maxSeats: 3,
      price: 1200,
      status: "waiting"
    },
    {
      id: 3,
      fromLocation: "UCAN",
      toLocation: "Centro da Cidade",
      departureTime: "2025-06-12T07:30:00",
      passengers: 3,
      maxSeats: 4,
      price: 600,
      status: "confirmed"
    }
  ];

  const mockRequests = [
    {
      id: 1,
      rideId: 1,
      passengerName: "Ana Costa",
      passengerRating: 4.7,
      requestTime: "2025-06-11T10:15:00",
      message: "Olá! Gostaria de uma Bloeia para o Shopping Belas hoje às 14:30. Sou pontual e educada. Obrigada!"
    },
    {
      id: 2,
      rideId: 2,
      passengerName: "João Silva",
      passengerRating: 4.9,
      requestTime: "2025-06-11T10:30:00",
      message: "Preciso de Bloeia para Talatona. Posso ajudar com combustível."
    }
  ];

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('pt-AO', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'waiting': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'confirmed': return 'Confirmada';
      case 'waiting': return 'Aguardando';
      case 'cancelled': return 'Cancelada';
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
                <p className="text-sm text-gray-600">Painel do Motorista</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  toast({
                    title: "Em breve",
                    description: "Configurações avançadas estarão disponíveis em breve.",
                  });
                }}
              >
                <Settings className="h-4 w-4 mr-2" />
                Configurações
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setLocation("/")}
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
              { id: 'overview', label: 'Visão Geral', icon: TrendingUp },
              { id: 'rides', label: 'Minhas Viagens', icon: Car },
              { id: 'requests', label: 'Solicitações', icon: MessageCircle },
              { id: 'earnings', label: 'Ganhos', icon: Star }
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
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total de Viagens</p>
                      <p className="text-2xl font-bold text-gray-900">{mockStats.totalRides}</p>
                    </div>
                    <Car className="h-8 w-8 text-primary" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Avaliação Média</p>
                      <p className="text-2xl font-bold text-gray-900">{mockStats.averageRating}</p>
                    </div>
                    <Star className="h-8 w-8 text-yellow-500" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Ganhos Totais</p>
                      <p className="text-2xl font-bold text-gray-900">{mockStats.totalEarnings.toLocaleString()} AKZ</p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Viagens Ativas</p>
                      <p className="text-2xl font-bold text-gray-900">{mockStats.activeRides}</p>
                    </div>
                    <Clock className="h-8 w-8 text-blue-500" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Ações Rápidas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button 
                    className="h-24 gradient-bg text-white flex flex-col items-center justify-center"
                    onClick={() => setLocation("/driver/create-ride")}
                  >
                    <Plus className="h-6 w-6 mb-2" />
                    <span className="font-medium">Nova Viagem</span>
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="h-24 flex flex-col items-center justify-center relative"
                    onClick={() => setActiveTab('requests')}
                  >
                    <MessageCircle className="h-6 w-6 mb-2" />
                    <span className="font-medium">Ver Solicitações</span>
                    {mockRequests.length > 0 && (
                      <Badge className="absolute top-2 right-2 bg-red-500 text-white">{mockRequests.length}</Badge>
                    )}
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="h-24 flex flex-col items-center justify-center"
                    onClick={() => setActiveTab('rides')}
                  >
                    <Navigation className="h-6 w-6 mb-2" />
                    <span className="font-medium">Navegação</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'rides' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Minhas Viagens</h2>
              <Button 
                className="gradient-bg text-white"
                onClick={() => setLocation("/driver/create-ride")}
              >
                <Plus className="h-4 w-4 mr-2" />
                Nova Viagem
              </Button>
            </div>

            <div className="grid gap-6">
              {mockActiveRides.map((ride) => (
                <Card key={ride.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-4 mb-4">
                          <Badge className={getStatusColor(ride.status)}>
                            {getStatusText(ride.status)}
                          </Badge>
                          <span className="text-sm text-gray-500">
                            {formatTime(ride.departureTime)}
                          </span>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <MapPin className="h-4 w-4 text-green-600" />
                            <span className="font-medium">{ride.fromLocation}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <MapPin className="h-4 w-4 text-red-600" />
                            <span className="font-medium">{ride.toLocation}</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-6 mt-4 text-sm text-gray-600">
                          <div className="flex items-center space-x-1">
                            <Users className="h-4 w-4" />
                            <span>{ride.passengers}/{ride.maxSeats} passageiros</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <span className="font-medium text-green-600">{ride.price} AKZ</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setLocation("/live-tracking")}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          Ver
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setLocation("/chat")}
                        >
                          <MessageCircle className="h-4 w-4 mr-1" />
                          Chat
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'requests' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Solicitações de Bloeia</h2>
              <Badge variant="secondary">{mockRequests.length} pendentes</Badge>
            </div>

            <div className="grid gap-6">
              {mockRequests.map((request) => (
                <Card key={request.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-4 mb-3">
                          <div className="flex items-center space-x-2">
                            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                              <span className="font-bold text-primary">
                                {request.passengerName.split(' ').map(n => n[0]).join('')}
                              </span>
                            </div>
                            <div>
                              <p className="font-medium">{request.passengerName}</p>
                              <div className="flex items-center space-x-1">
                                <Star className="h-3 w-3 text-yellow-500 fill-current" />
                                <span className="text-sm text-gray-600">{request.passengerRating}</span>
                              </div>
                            </div>
                          </div>
                          <Badge variant="outline">
                            {formatTime(request.requestTime)}
                          </Badge>
                        </div>
                        
                        <p className="text-gray-700 mb-4">{request.message}</p>
                        
                        <div className="text-sm text-gray-500">
                          Viagem #{request.rideId}
                        </div>
                      </div>
                      
                      <div className="flex space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => rejectRequestMutation.mutate(request.id)}
                          disabled={rejectRequestMutation.isPending}
                        >
                          <XCircle className="h-4 w-4 mr-1" />
                          Rejeitar
                        </Button>
                        <Button 
                          size="sm"
                          className="bg-green-600 hover:bg-green-700 text-white"
                          onClick={() => acceptRequestMutation.mutate(request.id)}
                          disabled={acceptRequestMutation.isPending}
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Aceitar
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              {mockRequests.length === 0 && (
                <Card>
                  <CardContent className="p-12 text-center">
                    <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Nenhuma solicitação pendente
                    </h3>
                    <p className="text-gray-600">
                      Quando estudantes solicitarem suas Bloeia, elas aparecerão aqui.
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        )}

        {activeTab === 'earnings' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Relatório de Ganhos</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-medium text-gray-900 mb-2">Esta Semana</h3>
                  <p className="text-2xl font-bold text-green-600">2,850 AKZ</p>
                  <p className="text-sm text-gray-600">+15% vs semana anterior</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-medium text-gray-900 mb-2">Este Mês</h3>
                  <p className="text-2xl font-bold text-green-600">8,450 AKZ</p>
                  <p className="text-sm text-gray-600">+8% vs mês anterior</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-medium text-gray-900 mb-2">Total Acumulado</h3>
                  <p className="text-2xl font-bold text-green-600">12,450 AKZ</p>
                  <p className="text-sm text-gray-600">Desde o cadastro</p>
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Histórico Recente</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { date: '11/06/2025', route: 'UAN → Shopping Belas', passengers: 3, amount: 2400 },
                    { date: '10/06/2025', route: 'ISPTEC → Talatona', passengers: 2, amount: 2400 },
                    { date: '09/06/2025', route: 'UCAN → Centro', passengers: 4, amount: 2400 },
                    { date: '08/06/2025', route: 'UAN → Viana', passengers: 2, amount: 1600 },
                  ].map((earning, index) => (
                    <div key={index} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                      <div>
                        <p className="font-medium">{earning.route}</p>
                        <p className="text-sm text-gray-600">{earning.date} • {earning.passengers} passageiros</p>
                      </div>
                      <p className="font-bold text-green-600">+{earning.amount} AKZ</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}