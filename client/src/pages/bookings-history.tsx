
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import BottomNav from "@/components/bottom-nav";
import { ArrowLeft, Bus, Calendar, MapPin, CheckCircle, XCircle, Clock } from "lucide-react";
import type { Booking } from "@shared/schema";

export default function BookingsHistory() {
  const [, setLocation] = useLocation();

  const { data: bookingHistory, isLoading } = useQuery<Booking[]>({
    queryKey: ["/api/bookings/history"],
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'completed':
        return { 
          icon: CheckCircle, 
          color: 'bg-green-100 text-green-700',
          label: 'Concluída' 
        };
      case 'cancelled':
        return { 
          icon: XCircle, 
          color: 'bg-red-100 text-red-700',
          label: 'Cancelada' 
        };
      default:
        return { 
          icon: Clock, 
          color: 'bg-blue-100 text-blue-700',
          label: 'Confirmada' 
        };
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <div className="bg-white px-6 py-4 border-b border-muted">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            size="sm"
            className="mr-4"
            onClick={() => setLocation("/")}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h2 className="font-bold text-lg">Histórico de Reservas</h2>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 py-6">
        {bookingHistory && bookingHistory.length > 0 ? (
          <div className="space-y-4">
            {bookingHistory.map((booking: any) => {
              const statusInfo = getStatusInfo(booking.status);
              const StatusIcon = statusInfo.icon;

              return (
                <Card key={booking.id} className="border border-muted shadow-sm">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                          <Bus className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold">
                            {booking.schedule?.route?.name || 'Rota de Ônibus'}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            ID: {booking.qrCode || booking.id}
                          </p>
                        </div>
                      </div>
                      <Badge className={statusInfo.color}>
                        <StatusIcon className="h-3 w-3 mr-1" />
                        {statusInfo.label}
                      </Badge>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center text-sm">
                        <Calendar className="h-4 w-4 text-muted-foreground mr-2" />
                        <span>{formatDate(booking.bookingDate)}</span>
                      </div>

                      {booking.schedule?.route && (
                        <div className="flex items-start text-sm">
                          <MapPin className="h-4 w-4 text-muted-foreground mr-2 mt-0.5" />
                          <div>
                            <p>{booking.schedule.route.origin}</p>
                            <p className="text-xs text-muted-foreground">
                              → {booking.schedule.route.destination}
                            </p>
                          </div>
                        </div>
                      )}

                      {booking.qrCodeUsed && (
                        <div className="flex items-center text-xs text-green-600 bg-green-50 rounded-md px-2 py-1 mt-2">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          QR Code utilizado
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card className="border border-muted shadow-sm">
            <CardContent className="p-12 text-center">
              <Bus className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Nenhuma reserva encontrada</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Você ainda não fez nenhuma reserva de viagem.
              </p>
              <Button 
                className="gradient-bg text-white"
                onClick={() => setLocation("/subscription")}
              >
                Fazer Primeira Reserva
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      <BottomNav currentPage="home" />
    </div>
  );
}
