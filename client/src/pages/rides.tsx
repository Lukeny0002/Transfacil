import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useAuth } from "@/hooks/useAuth";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import BottomNav from "@/components/bottom-nav";
import { ArrowLeft, Filter, MapPin, Flag, Clock, Users as UsersIcon, Star, MessageCircle } from "lucide-react";

export default function Rides() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [filterDestination, setFilterDestination] = useState("");
  const [showFilterDialog, setShowFilterDialog] = useState(false);

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

  const filteredRides = (availableRides?.length ? availableRides : [
    {
      id: 1,
      driverName: "Maria Santos",
      rating: 4.8,
      trips: 23,
      fromLocation: "Universidade Agostinho Neto",
      toLocation: "Shopping Belas",
      departureTime: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
      availableSeats: 2,
      price: "0",
    },
    {
      id: 2,
      driverName: "João Carlos",
      rating: 4.9,
      trips: 45,
      fromLocation: "Campus Central",
      toLocation: "Zona da Maianga",
      departureTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      availableSeats: 1,
      price: "500",
    },
  ]).filter((ride: any) => {
    if (!filterDestination) return true;
    return ride.toLocation === filterDestination;
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
                        <SelectItem value="campus">Para Campus Central</SelectItem>
                        <SelectItem value="home">Para Casa</SelectItem>
                        <SelectItem value="center">Para Centro da Cidade</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setShowFilterDialog(!showFilterDialog)}
                  >
                    <Filter className="h-4 w-4" />
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
    </div>
  );
}
