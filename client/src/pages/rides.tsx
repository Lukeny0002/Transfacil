import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useAuth } from "@/hooks/useAuth";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import BottomNav from "@/components/bottom-nav";
import { ArrowLeft, Filter, MapPin, Flag, Clock, Users as UsersIcon, Star, MessageCircle, Phone, Info, Car } from "lucide-react";

export default function Rides() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [filterDestination, setFilterDestination] = useState("");
  const [selectedRide, setSelectedRide] = useState<any>(null);
  const [showInfoDialog, setShowInfoDialog] = useState(false);

  const { data: student } = useQuery({
    queryKey: ["/api/student/profile"],
  });

  const { data: availableRides } = useQuery({
    queryKey: ["/api/rides"],
  });

  const { data: myRides } = useQuery({
    queryKey: ["/api/rides/my"],
  });

  const requestRideMutation = useMutation({
    mutationFn: async ({ rideId, message }: { rideId: number; message: string }) => {
      await apiRequest("POST", `/api/rides/${rideId}/request`, { message });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/rides"] });
      toast({
        title: "Solicitação enviada!",
        description: "Sua solicitação de carona foi enviada ao motorista.",
      });
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Falha ao solicitar carona. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  const handleRequestRide = (rideId: number) => {
    requestRideMutation.mutate({ 
      rideId, 
      message: "Olá! Gostaria de solicitar uma carona. Obrigado!" 
    });
  };

  const handleOfferRide = () => {
    setLocation("/offer-ride");
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('pt-AO', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredRides = (availableRides || []).filter((ride: any) => {
    if (!filterDestination) return true;
    return ride.toLocation.toLowerCase().includes(filterDestination.toLowerCase());
  });

  const mockRideHistory = [
    {
      id: 1,
      driverName: "Ana Maria",
      date: "2024-06-15",
      fromLocation: "Campus Central",
      toLocation: "Zona da Maianga",
      status: "completed",
      rating: 5,
    },
    {
      id: 2,
      driverName: "Pedro Costa",
      date: "2024-06-12",
      fromLocation: "Universidade Católica",
      toLocation: "Centro da Cidade",
      status: "cancelled",
    },
  ];

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <div className="bg-white px-6 py-4 border-b border-muted">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              size="sm"
              className="mr-4"
              onClick={() => setLocation("/")}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h2 className="font-bold text-lg">Caronas Solidárias</h2>
          </div>
          <Button 
            className="gradient-bg text-white"
            size="sm"
            onClick={handleOfferRide}
          >
            Oferecer Carona
          </Button>
        </div>
      </div>
      
      {/* Content */}
      <div className="px-6 py-6">
        <Tabs defaultValue="available" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="available">Disponíveis</TabsTrigger>
            <TabsTrigger value="history">Histórico</TabsTrigger>
          </TabsList>
          
          <TabsContent value="available" className="space-y-4 mt-6">
            {/* Filter */}
            <Card className="border border-muted shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center space-x-4">
                  <div className="flex-1">
                    <Select value={filterDestination} onValueChange={setFilterDestination}>
                      <SelectTrigger>
                        <SelectValue placeholder="Filtrar por destino" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Todos os destinos</SelectItem>
                        <SelectItem value="Universidade Agostinho Neto">Universidade Agostinho Neto</SelectItem>
                        <SelectItem value="Universidade Católica">Universidade Católica de Angola</SelectItem>
                        <SelectItem value="ISPTEC">ISPTEC</SelectItem>
                        <SelectItem value="Centro da Cidade">Centro da Cidade</SelectItem>
                        <SelectItem value="Shopping Belas">Shopping Belas</SelectItem>
                        <SelectItem value="Talatona">Talatona</SelectItem>
                        <SelectItem value="Viana">Viana</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setFilterDestination("")}
                  >
                    Limpar
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            {/* Available Rides */}
            <div className="space-y-4">
              {filteredRides.map((ride: any) => (
                <Card key={ride.id} className="border border-muted shadow-sm">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center">
                          <span className="font-bold text-muted-foreground">
                            {ride.driverName?.split(' ').map((n: string) => n[0]).join('') || "MS"}
                          </span>
                        </div>
                        <div>
                          <p className="font-semibold">{ride.driverName}</p>
                          <div className="flex items-center text-xs text-muted-foreground">
                            <Star className="h-3 w-3 text-yellow-400 mr-1" />
                            <span>{ride.rating}</span>
                            <span className="mx-1">•</span>
                            <span>{ride.trips} viagens</span>
                          </div>
                        </div>
                      </div>
                      <span className="text-primary font-bold">
                        {ride.price === "0" ? "Gratuita" : `${ride.price} AKZ`}
                      </span>
                    </div>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm">
                        <MapPin className="h-4 w-4 text-muted-foreground mr-2" />
                        <span>{ride.fromLocation}</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <Flag className="h-4 w-4 text-muted-foreground mr-2" />
                        <span>{ride.toLocation}</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <Clock className="h-4 w-4 text-muted-foreground mr-2" />
                        <span>{formatDateTime(ride.departureTime)}</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <UsersIcon className="h-4 w-4 text-muted-foreground mr-2" />
                        <span>{ride.availableSeats} lugares disponíveis</span>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2 mb-3">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          setSelectedRide(ride);
                          setShowInfoDialog(true);
                        }}
                      >
                        <Info className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="flex space-x-3">
                      <Button 
                        variant="outline" 
                        className="flex-1 border-primary text-primary hover:bg-primary hover:text-white"
                        onClick={() => setLocation("/chat")}
                      >
                        <MessageCircle className="h-4 w-4 mr-2" />
                        Conversar
                      </Button>
                      <Button 
                        className="flex-1 gradient-bg text-white"
                        onClick={() => handleRequestRide(ride.id)}
                        disabled={requestRideMutation.isPending}
                      >
                        Solicitar
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="history" className="space-y-4 mt-6">
            {mockRideHistory.map((ride: any) => (
              <Card key={ride.id} className="border border-muted shadow-sm">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center">
                        <span className="font-bold text-muted-foreground">
                          {ride.driverName?.split(' ').map((n: string) => n[0]).join('') || "AM"}
                        </span>
                      </div>
                      <div>
                        <p className="font-semibold">{ride.driverName}</p>
                        <p className="text-xs text-muted-foreground">{ride.date}</p>
                      </div>
                    </div>
                    <Badge 
                      className={
                        ride.status === "completed" 
                          ? "bg-green-100 text-green-700 hover:bg-green-100" 
                          : "bg-red-100 text-red-700 hover:bg-red-100"
                      }
                    >
                      {ride.status === "completed" ? "Concluída" : "Cancelada"}
                    </Badge>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm">
                      <MapPin className="h-4 w-4 text-muted-foreground mr-2" />
                      <span>{ride.fromLocation}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <Flag className="h-4 w-4 text-muted-foreground mr-2" />
                      <span>{ride.toLocation}</span>
                    </div>
                  </div>
                  
                  {ride.status === "completed" ? (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="flex text-yellow-400 mr-2">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="h-3 w-3" fill={i < ride.rating ? "currentColor" : "none"} />
                          ))}
                        </div>
                        <span className="text-xs text-muted-foreground">Avaliação dada</span>
                      </div>
                      <Button variant="link" className="text-primary text-sm font-medium p-0">
                        Repetir Viagem
                      </Button>
                    </div>
                  ) : (
                    <p className="text-xs text-muted-foreground">
                      Cancelada pelo motorista - reembolso processado
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </div>
      
      <BottomNav currentPage="rides" />

      {/* Info Dialog */}
      <Dialog open={showInfoDialog} onOpenChange={setShowInfoDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Informações do Motorista</DialogTitle>
          </DialogHeader>
          {selectedRide && (
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center">
                  <span className="font-bold text-xl text-muted-foreground">
                    {selectedRide.driverName?.split(' ').map((n: string) => n[0]).join('') || "MS"}
                  </span>
                </div>
                <div>
                  <h3 className="font-bold text-lg">{selectedRide.driverName}</h3>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Star className="h-4 w-4 text-yellow-400 mr-1" />
                    <span>{selectedRide.rating} • {selectedRide.trips} viagens</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3 pt-2 border-t">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Rota</p>
                  <div className="flex items-start space-x-2 mt-1">
                    <MapPin className="h-4 w-4 text-primary mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">{selectedRide.fromLocation}</p>
                      <p className="text-xs text-muted-foreground">→ {selectedRide.toLocation}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium text-muted-foreground">Horário de Partida</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <Clock className="h-4 w-4 text-primary" />
                    <p className="text-sm">{formatDateTime(selectedRide.departureTime)}</p>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium text-muted-foreground">Disponibilidade</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <UsersIcon className="h-4 w-4 text-primary" />
                    <p className="text-sm">{selectedRide.availableSeats} lugares disponíveis</p>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium text-muted-foreground">Preço</p>
                  <p className="text-sm font-bold text-primary">
                    {selectedRide.price === "0" ? "Gratuita" : `${selectedRide.price} AKZ por pessoa`}
                  </p>
                </div>

                {selectedRide.description && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Observações</p>
                    <p className="text-sm mt-1">{selectedRide.description}</p>
                  </div>
                )}
              </div>

              <div className="flex space-x-2 pt-2">
                <Button 
                  variant="outline"
                  className="flex-1"
                  onClick={() => setShowInfoDialog(false)}
                >
                  Fechar
                </Button>
                <Button 
                  className="flex-1 gradient-bg text-white"
                  onClick={() => {
                    setShowInfoDialog(false);
                    setLocation("/chat");
                  }}
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Conversar
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
