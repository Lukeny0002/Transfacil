import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { 
  MapPin, 
  Navigation, 
  Clock, 
  Users, 
  Phone, 
  MessageCircle,
  ArrowLeft,
  Car,
  AlertTriangle,
  CheckCircle,
  RotateCcw,
  Share,
  Shield
} from "lucide-react";

export default function LiveTracking() {
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Mock real-time tracking data
  const mockTripData = {
    id: "TF-2025-001234",
    driver: {
      name: "João Manuel Santos",
      phone: "+244 923 456 789",
      vehicle: "Toyota Corolla Branco - ABC-123",
      rating: 4.8,
      photo: null
    },
    route: {
      from: "Universidade Agostinho Neto",
      to: "Shopping Belas",
      estimatedDuration: "35 min",
      distance: "18.5 km"
    },
    timing: {
      scheduled: "14:30",
      estimated: "14:33",
      current: currentTime.toLocaleTimeString('pt-AO', { hour: '2-digit', minute: '2-digit' })
    },
    status: "en_route", // waiting, en_route, arrived, completed
    passengers: [
      { name: "Ana Costa", university: "UAN" },
      { name: "Pedro Silva", university: "UAN" },
      { name: "Maria Santos", university: "UAN" }
    ],
    currentLocation: {
      lat: -8.8387,
      lng: 13.2894,
      address: "Av. 4 de Fevereiro, próximo ao Hospital Militar"
    },
    progress: 65, // percentage
    nextStop: "Entrada do Shopping Belas",
    alerts: [
      { type: "traffic", message: "Trânsito intenso na Av. Talatona - atraso de 3 min" }
    ]
  };

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'waiting':
        return { text: 'Aguardando Partida', color: 'bg-yellow-100 text-yellow-800', icon: Clock };
      case 'en_route':
        return { text: 'Em Viagem', color: 'bg-blue-100 text-blue-800', icon: Navigation };
      case 'arrived':
        return { text: 'Chegou ao Destino', color: 'bg-green-100 text-green-800', icon: CheckCircle };
      case 'completed':
        return { text: 'Viagem Concluída', color: 'bg-gray-100 text-gray-800', icon: CheckCircle };
      default:
        return { text: status, color: 'bg-gray-100 text-gray-800', icon: Clock };
    }
  };

  const statusInfo = getStatusInfo(mockTripData.status);
  const StatusIcon = statusInfo.icon;

  const shareLocation = () => {
    const shareText = `Estou em viagem com TRANSFÁCIL. Acompanhe minha localização: ${window.location.href}`;
    if (navigator.share) {
      navigator.share({
        title: 'Minha Localização - TRANSFÁCIL',
        text: shareText,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(shareText);
      alert('Link copiado para área de transferência!');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setLocation("/rides")}
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Voltar
            </Button>
            <div className="text-center">
              <h2 className="font-bold text-lg">Rastreamento ao Vivo</h2>
              <p className="text-sm text-gray-600">Viagem #{mockTripData.id}</p>
            </div>
            <Button variant="outline" size="sm" onClick={shareLocation}>
              <Share className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Status Card */}
        <Card className="border-l-4 border-l-primary">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <StatusIcon className="h-6 w-6 text-primary" />
                <div>
                  <Badge className={statusInfo.color}>
                    {statusInfo.text}
                  </Badge>
                  <p className="text-sm text-gray-600 mt-1">Atualizado agora</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-primary">{mockTripData.timing.current}</p>
                <p className="text-sm text-gray-600">Hora atual</p>
              </div>
            </div>
            
            {/* Progress Bar */}
            <div className="mb-4">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Progresso da viagem</span>
                <span>{mockTripData.progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-primary h-3 rounded-full transition-all duration-300"
                  style={{ width: `${mockTripData.progress}%` }}
                ></div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-600">Horário previsto</p>
                <p className="font-medium">{mockTripData.timing.scheduled}</p>
              </div>
              <div>
                <p className="text-gray-600">Chegada estimada</p>
                <p className="font-medium">{mockTripData.timing.estimated}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Map Placeholder */}
        <Card>
          <CardContent className="p-0">
            <div className="h-64 bg-gradient-to-br from-blue-100 to-green-100 rounded-lg flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gray-200 opacity-20"></div>
              <div className="z-10 text-center">
                <MapPin className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-lg font-bold mb-2">Mapa em Tempo Real</h3>
                <p className="text-gray-600 mb-4">Localização: {mockTripData.currentLocation.address}</p>
                <Badge variant="outline">
                  {mockTripData.currentLocation.lat.toFixed(4)}, {mockTripData.currentLocation.lng.toFixed(4)}
                </Badge>
              </div>
              
              {/* Animated pulse effect */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div className="w-4 h-4 bg-primary rounded-full animate-pulse"></div>
                <div className="w-8 h-8 bg-primary/30 rounded-full animate-ping absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Route Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Navigation className="h-5 w-5 text-primary" />
              <span>Informações da Rota</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <div className="flex-1">
                <p className="font-medium">{mockTripData.route.from}</p>
                <p className="text-sm text-gray-600">Ponto de partida</p>
              </div>
            </div>
            
            <div className="ml-1.5 h-8 w-0.5 bg-gray-300"></div>
            
            <div className="flex items-center space-x-4">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <div className="flex-1">
                <p className="font-medium">{mockTripData.route.to}</p>
                <p className="text-sm text-gray-600">Destino final</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
              <div>
                <p className="text-sm text-gray-600">Distância</p>
                <p className="font-medium">{mockTripData.route.distance}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Duração estimada</p>
                <p className="font-medium">{mockTripData.route.estimatedDuration}</p>
              </div>
            </div>
            
            {mockTripData.nextStop && (
              <div className="bg-blue-50 p-3 rounded-lg">
                <p className="text-sm font-medium text-blue-800">Próxima parada:</p>
                <p className="text-sm text-blue-600">{mockTripData.nextStop}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Driver Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Car className="h-5 w-5 text-primary" />
              <span>Informações do Motorista</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                <span className="font-bold text-gray-600">
                  {mockTripData.driver.name.split(' ').map(n => n[0]).join('')}
                </span>
              </div>
              <div className="flex-1">
                <h3 className="font-medium">{mockTripData.driver.name}</h3>
                <p className="text-sm text-gray-600">{mockTripData.driver.vehicle}</p>
                <div className="flex items-center space-x-1 mt-1">
                  <div className="flex space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <div
                        key={i}
                        className={`w-3 h-3 rounded-full ${
                          i < Math.floor(mockTripData.driver.rating)
                            ? 'bg-yellow-400'
                            : 'bg-gray-200'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">({mockTripData.driver.rating})</span>
                </div>
              </div>
            </div>
            
            <div className="flex space-x-3 mt-4">
              <Button variant="outline" className="flex-1">
                <Phone className="h-4 w-4 mr-2" />
                Ligar
              </Button>
              <Button variant="outline" className="flex-1">
                <MessageCircle className="h-4 w-4 mr-2" />
                Mensagem
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Passengers */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-primary" />
              <span>Passageiros ({mockTripData.passengers.length})</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockTripData.passengers.map((passenger, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                    <span className="text-xs font-medium text-gray-600">
                      {passenger.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium">{passenger.name}</p>
                    <p className="text-sm text-gray-600">{passenger.university}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Alerts */}
        {mockTripData.alerts.length > 0 && (
          <Card className="border-orange-200 bg-orange-50">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-orange-800">
                <AlertTriangle className="h-5 w-5" />
                <span>Alertas da Viagem</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {mockTripData.alerts.map((alert, index) => (
                  <div key={index} className="p-3 bg-white rounded-lg border border-orange-200">
                    <p className="text-sm text-orange-800">{alert.message}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Safety Features */}
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-green-800">
              <Shield className="h-5 w-5" />
              <span>Recursos de Segurança</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-green-700">Localização compartilhada</span>
                <Badge className="bg-green-200 text-green-800">Ativo</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-green-700">Contato de emergência</span>
                <Button variant="outline" size="sm" className="border-green-300 text-green-700">
                  Configurar
                </Button>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-green-700">Botão de pânico</span>
                <Button variant="outline" size="sm" className="border-red-300 text-red-700">
                  <AlertTriangle className="h-3 w-3 mr-1" />
                  Emergência
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex space-x-4">
          <Button variant="outline" className="flex-1">
            <RotateCcw className="h-4 w-4 mr-2" />
            Atualizar
          </Button>
          <Button className="flex-1 gradient-bg text-white">
            <MessageCircle className="h-4 w-4 mr-2" />
            Chat da Viagem
          </Button>
        </div>
      </div>
    </div>
  );
}