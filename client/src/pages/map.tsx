import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import BottomNav from "@/components/bottom-nav";
import { ArrowLeft, RefreshCw, Bus, MapPin, Flag, Clock, Users as UsersIcon, CheckCircle } from "lucide-react";

export default function Map() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [busPosition, setBusPosition] = useState({ x: 50, y: 50 });
  const [showReservationDialog, setShowReservationDialog] = useState(false);
  const [selectedBusId, setSelectedBusId] = useState<number | null>(null);

  const { data: buses } = useQuery({
    queryKey: ["/api/buses"],
  });

  const { data: schedules } = useQuery({
    queryKey: ["/api/schedules"],
  });

  const { data: myReservation } = useQuery({
    queryKey: ["/api/bus-reservations/my"],
  });

  const { data: reservationCounts = {} } = useQuery({
    queryKey: ["/api/bus-reservations/counts"],
  });

  const createReservationMutation = useMutation({
    mutationFn: async (busId: number) => {
      await apiRequest("POST", "/api/bus-reservations", { busId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/bus-reservations/my'] });
      queryClient.invalidateQueries({ queryKey: ['/api/bus-reservations/counts'] });
      toast({
        title: "Reserva confirmada!",
        description: "Seu lugar no autocarro foi reservado com sucesso.",
      });
      setShowReservationDialog(false);
    },
    onError: (error: any) => {
      toast({
        title: "Erro na reserva",
        description: error.message || "Não foi possível fazer a reserva.",
        variant: "destructive",
      });
    },
  });

  const cancelReservationMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("DELETE", "/api/bus-reservations/my");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/bus-reservations/my'] });
      queryClient.invalidateQueries({ queryKey: ['/api/bus-reservations/counts'] });
      toast({
        title: "Reserva cancelada",
        description: "Sua reserva foi cancelada.",
      });
    },
  });

  const handleReserveBus = (busId: number) => {
    if (myReservation) {
      toast({
        title: "Você já tem uma reserva",
        description: "Cancele sua reserva atual antes de fazer outra.",
        variant: "destructive",
      });
      return;
    }
    setSelectedBusId(busId);
    setShowReservationDialog(true);
  };

  const confirmReservation = () => {
    if (selectedBusId) {
      createReservationMutation.mutate(selectedBusId);
    }
  };

  // Calculate bus data with real reservation counts
  const busData = buses?.map((bus: any) => {
    const totalSeats = bus.capacity || 40;
    const reservedSeats = reservationCounts[bus.id] || 0;
    const availableSeats = Math.max(0, totalSeats - reservedSeats);
    
    return {
      id: bus.id,
      number: bus.busNumber,
      route: bus.routeName || "Rota Principal",
      availableSeats,
      totalSeats,
    };
  }) || [];

  // Simulate bus movement
  useEffect(() => {
    const interval = setInterval(() => {
      setBusPosition(prev => ({
        x: Math.max(20, Math.min(80, prev.x + (Math.random() - 0.5) * 10)),
        y: Math.max(20, Math.min(80, prev.y + (Math.random() - 0.5) * 10)),
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const getNextTrip = () => {
    if (!schedules?.length) return null;
    const now = new Date();
    
    return schedules.find((schedule: any) => {
      const [hours, minutes] = schedule.departureTime.split(':');
      const scheduleTime = new Date();
      scheduleTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);
      return scheduleTime > now;
    });
  };

  const nextTrip = getNextTrip();

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <div className="bg-white px-6 py-4 border-b border-muted">
        <div className="flex items-center justify-between">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => setLocation("/")}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h2 className="font-bold text-lg">Localização em Tempo Real</h2>
          <Button 
            variant="ghost" 
            size="sm"
            className="text-primary"
          >
            <RefreshCw className="h-5 w-5" />
          </Button>
        </div>
      </div>
      
      {/* Map Container */}
      <div className="relative bg-gradient-to-br from-blue-50 to-green-50 h-96">
        {/* Mock map background with street pattern */}
        <div className="absolute inset-0 opacity-20">
          <svg className="w-full h-full">
            <defs>
              <pattern id="streets" patternUnits="userSpaceOnUse" width="40" height="40">
                <rect width="40" height="40" fill="#f0f0f0"/>
                <rect x="18" y="0" width="4" height="40" fill="#ddd"/>
                <rect x="0" y="18" width="40" height="4" fill="#ddd"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#streets)"/>
          </svg>
        </div>
        
        {/* Route line */}
        <svg className="absolute inset-0 w-full h-full">
          <path 
            d={`M 20 80 Q 50 50 80 20`}
            stroke="hsl(78, 71%, 57%)" 
            strokeWidth="3" 
            fill="none" 
            strokeDasharray="5,5"
            className="animate-pulse"
          />
        </svg>
        
        {/* Bus location */}
        <div 
          className="absolute transition-all duration-3000 ease-in-out"
          style={{ 
            left: `${busPosition.x}%`, 
            top: `${busPosition.y}%`,
            transform: 'translate(-50%, -50%)'
          }}
        >
          <Card className="shadow-lg">
            <CardContent className="p-3">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 gradient-bg rounded-full flex items-center justify-center animate-pulse">
                  <Bus className="h-4 w-4 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-sm">Autocarro 001</p>
                  <p className="text-xs text-muted-foreground">5 min até você</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Bus stops */}
        <div className="absolute" style={{ left: '20%', top: '80%', transform: 'translate(-50%, -50%)' }}>
          <div className="w-3 h-3 bg-blue-500 rounded-full border-2 border-white shadow-lg"></div>
        </div>
        <div className="absolute" style={{ left: '80%', top: '20%', transform: 'translate(-50%, -50%)' }}>
          <div className="w-3 h-3 bg-primary rounded-full border-2 border-white shadow-lg"></div>
        </div>
      </div>
      
      {/* Trip Info */}
      <div className="px-6 py-4 space-y-4">
        <Card className="border border-muted shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold">Próxima Viagem</h3>
              <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                Em rota
              </Badge>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <div>
                  <p className="font-medium">Parada Central</p>
                  <p className="text-sm text-muted-foreground">08:25 - Embarque</p>
                </div>
              </div>
              
              <div className="ml-1.5 w-0.5 h-6 bg-muted"></div>
              
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-primary rounded-full"></div>
                <div>
                  <p className="font-medium">Campus Central</p>
                  <p className="text-sm text-muted-foreground">08:45 - Chegada</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* My Reservation */}
        {myReservation && (
          <Card className="border-green-200 bg-green-50 shadow-sm">
            <CardHeader>
              <CardTitle className="text-green-800 flex items-center space-x-2">
                <CheckCircle className="h-5 w-5" />
                <span>Reserva Ativa</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm text-green-700">
                  Você tem um lugar reservado no Autocarro {busData.find(b => b.id === myReservation.busId)?.number || "001"}
                </p>
                <p className="text-xs text-green-600">
                  Rota: {busData.find(b => b.id === myReservation.busId)?.route || "Campus Central"}
                </p>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="w-full mt-2 border-red-300 text-red-700 hover:bg-red-50"
                  onClick={() => cancelReservationMutation.mutate()}
                  disabled={cancelReservationMutation.isPending}
                >
                  {cancelReservationMutation.isPending ? "Cancelando..." : "Cancelar Reserva"}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Available Buses */}
        <Card className="border border-muted shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Autocarros Disponíveis</span>
              {!myReservation && (
                <Badge variant="secondary">Reserve seu lugar</Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {busData.map((bus) => (
                <div key={bus.id} className="p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <Bus className="h-4 w-4 text-primary" />
                      <span className="font-medium">Autocarro {bus.number}</span>
                    </div>
                    <Badge variant="outline" className={
                      bus.availableSeats > 10 ? "bg-green-100 text-green-700" :
                      bus.availableSeats > 5 ? "bg-yellow-100 text-yellow-700" :
                      "bg-red-100 text-red-700"
                    }>
                      {bus.availableSeats}/{bus.totalSeats} lugares
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    Rota: {bus.route}
                  </p>
                  <Button 
                    size="sm"
                    className="w-full gradient-bg text-white"
                    onClick={() => handleReserveBus(bus.id)}
                    disabled={!bus.availableSeats || !!myReservation}
                    data-testid={`button-reserve-bus-${bus.id}`}
                  >
                    {myReservation ? "Você já tem reserva" : 
                     bus.availableSeats ? "Reservar Lugar" : "Lotado"}
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Live tracking info */}
        <Card className="border border-muted shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2 mb-3">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <h4 className="font-semibold">Rastreamento Ativo</h4>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Velocidade</p>
                <p className="font-medium">45 km/h</p>
              </div>
              <div>
                <p className="text-muted-foreground">Passageiros</p>
                <p className="font-medium">12/40</p>
              </div>
              <div>
                <p className="text-muted-foreground">Próxima parada</p>
                <p className="font-medium">2 min</p>
              </div>
              <div>
                <p className="text-muted-foreground">Atraso</p>
                <p className="font-medium text-green-600">No horário</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Reservation Confirmation Dialog */}
      <Dialog open={showReservationDialog} onOpenChange={setShowReservationDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirmar Reserva</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Deseja reservar um lugar no Autocarro {busData.find(b => b.id === selectedBusId)?.number}?
            </p>
            <div className="bg-muted p-3 rounded-lg">
              <p className="text-sm font-medium mb-1">Detalhes:</p>
              <p className="text-sm text-muted-foreground">
                Rota: {busData.find(b => b.id === selectedBusId)?.route}
              </p>
              <p className="text-sm text-muted-foreground">
                Lugares disponíveis: {busData.find(b => b.id === selectedBusId)?.availableSeats}
              </p>
            </div>
            <p className="text-xs text-orange-600">
              Nota: Você só pode ter uma reserva ativa por vez.
            </p>
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => setShowReservationDialog(false)}
              >
                Cancelar
              </Button>
              <Button 
                className="flex-1 gradient-bg text-white"
                onClick={confirmReservation}
                disabled={createReservationMutation.isPending}
                data-testid="button-confirm-reservation"
              >
                {createReservationMutation.isPending ? "Confirmando..." : "Confirmar"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      
      <BottomNav currentPage="map" />
    </div>
  );
}
