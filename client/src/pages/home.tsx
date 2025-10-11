import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useLocation } from "wouter";
import BottomNav from "@/components/bottom-nav";
import { Bell, Bus, MapPin, Users, CreditCard, QrCode } from "lucide-react";

export default function Home() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();

  const { data: student } = useQuery({
    queryKey: ["/api/student/profile"],
  });

  const { data: schedules } = useQuery({
    queryKey: ["/api/schedules"],
  });

  const { data: bookings } = useQuery({
    queryKey: ["/api/bookings"],
  });

  const { data: subscription } = useQuery({
    queryKey: ["/api/subscription/active"],
  });

  const getNextTrip = () => {
    if (!schedules?.length) return null;
    const now = new Date();
    const today = now.toLocaleDateString();
    
    // Find next trip today
    return schedules.find((schedule: any) => {
      const [hours, minutes] = schedule.departureTime.split(':');
      const scheduleTime = new Date();
      scheduleTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);
      return scheduleTime > now;
    });
  };

  const nextTrip = getNextTrip();

  const getTodayBookings = () => {
    if (!bookings?.length) return [];
    const today = new Date().toDateString();
    return bookings.filter((booking: any) => 
      new Date(booking.bookingDate).toDateString() === today
    );
  };

  const todayBookings = getTodayBookings();

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <div className="gradient-bg px-6 py-8 pb-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
              <span className="font-bold text-primary">
                {student?.fullName?.charAt(0) || user?.firstName?.charAt(0) || "U"}
              </span>
            </div>
            <div>
              <p className="text-white text-sm opacity-90">Olá,</p>
              <p className="text-white font-semibold">
                {student?.fullName?.split(' ')[0] || user?.firstName || "Estudante"}
              </p>
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="sm"
            className="text-white hover:bg-white/20"
            onClick={() => setLocation("/notifications")}
          >
            <Bell className="h-5 w-5" />
          </Button>
        </div>
        
        {/* Quick Status */}
        <Card className="glass-effect rounded-2xl border-0">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Próxima Viagem</p>
                <p className="font-bold text-lg">
                  {nextTrip?.departureTime || "08:30"}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Destino</p>
                <p className="font-bold">Campus Central</p>
              </div>
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Content */}
      <div className="px-6 py-4 space-y-6">
        {/* Today's Schedule */}
        <div>
          <h3 className="font-bold text-lg mb-4">Horários de Hoje</h3>
          <div className="space-y-3">
            {todayBookings.length > 0 ? (
              todayBookings.map((booking: any) => (
                <Card key={booking.id} className="border border-muted shadow-sm">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                          <Bus className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <p className="font-semibold">08:30</p>
                          <p className="text-sm text-muted-foreground">Casa → Campus</p>
                        </div>
                      </div>
                      <Badge 
                        variant={booking.status === "confirmed" ? "default" : "secondary"}
                        className="bg-green-100 text-green-700 hover:bg-green-100"
                      >
                        {booking.status === "confirmed" ? "Confirmado" : "Aguardando"}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <>
                <Card className="border border-muted shadow-sm">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                          <Bus className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <p className="font-semibold">08:30</p>
                          <p className="text-sm text-muted-foreground">Casa → Campus</p>
                        </div>
                      </div>
                      <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                        Confirmado
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="border border-muted shadow-sm">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                          <Bus className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <p className="font-semibold">17:45</p>
                          <p className="text-sm text-muted-foreground">Campus → Casa</p>
                        </div>
                      </div>
                      <Badge variant="secondary" className="bg-orange-100 text-orange-700 hover:bg-orange-100">
                        Aguardando
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </div>
        </div>
        
        {/* Quick Actions */}
        <div>
          <h3 className="font-bold text-lg mb-4">Ações Rápidas</h3>
          <div className="grid grid-cols-2 gap-4">
            <Card 
              className="border border-muted shadow-sm cursor-pointer hover:shadow-md transition-all"
              onClick={() => setLocation("/map")}
            >
              <CardContent className="p-4 text-center">
                <MapPin className="h-8 w-8 text-primary mx-auto mb-2" />
                <p className="font-medium text-sm">Ver no Mapa</p>
              </CardContent>
            </Card>
            
            <Card 
              className="border border-muted shadow-sm cursor-pointer hover:shadow-md transition-all"
              onClick={() => setLocation("/rides")}
            >
              <CardContent className="p-4 text-center">
                <Users className="h-8 w-8 text-primary mx-auto mb-2" />
                <p className="font-medium text-sm">Bloeia</p>
              </CardContent>
            </Card>
            
            <Card 
              className="border border-muted shadow-sm cursor-pointer hover:shadow-md transition-all"
              onClick={() => setLocation("/subscription")}
            >
              <CardContent className="p-4 text-center">
                <CreditCard className="h-8 w-8 text-primary mx-auto mb-2" />
                <p className="font-medium text-sm">Assinatura</p>
              </CardContent>
            </Card>
            
            <Card 
              className="border border-muted shadow-sm cursor-pointer hover:shadow-md transition-all"
              onClick={() => setLocation("/qr")}
            >
              <CardContent className="p-4 text-center">
                <QrCode className="h-8 w-8 text-primary mx-auto mb-2" />
                <p className="font-medium text-sm">Meu QR</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      <BottomNav currentPage="home" />
    </div>
  );
}
