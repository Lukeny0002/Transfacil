import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLocation } from "wouter";
import { Calendar, MapPin, Clock, Users, ArrowRight } from "lucide-react";
import BottomNav from "@/components/bottom-nav";

export default function Events() {
  const [, setLocation] = useLocation();

  // Mock data for events - will be replaced with actual API
  const events = [
    {
      id: 1,
      name: "Conferência Tecnológica UAN 2025",
      date: "2025-12-15",
      time: "09:00",
      location: "Universidade Agostinho Neto",
      description: "Grande conferência sobre tecnologia e inovação",
      transport_price_one_way: 1500,
      transport_price_round_trip: 2500,
      transport_price_return: 1500,
      available_seats: 45,
      image: "/api/placeholder/400/200",
    },
    {
      id: 2,
      name: "Festival de Música Universitária",
      date: "2025-12-20",
      time: "18:00",
      location: "Campus ISPTEC",
      description: "Festival com bandas universitárias locais",
      transport_price_one_way: 1200,
      transport_price_round_trip: 2000,
      transport_price_return: 1200,
      available_seats: 30,
      image: "/api/placeholder/400/200",
    },
    {
      id: 3,
      name: "Workshop de Empreendedorismo",
      date: "2025-12-18",
      time: "14:00",
      location: "Universidade Católica",
      description: "Aprenda sobre criação de startups e negócios",
      transport_price_one_way: 1000,
      transport_price_round_trip: 1800,
      transport_price_return: 1000,
      available_seats: 20,
      image: "/api/placeholder/400/200",
    },
  ];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-AO', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <div className="gradient-bg px-6 py-8 pb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-white text-2xl font-bold">Eventos</h1>
            <p className="text-white/80 text-sm">Transporte para eventos universitários</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 py-4 space-y-4">
        {/* Info Card */}
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-4">
            <div className="flex items-start space-x-3">
              <Calendar className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <h3 className="font-semibold text-sm mb-1">Como funciona?</h3>
                <p className="text-xs text-muted-foreground">
                  Reserve transporte para eventos universitários. Escolha entre ida, volta ou ida e volta.
                  Após aprovação do pagamento, você receberá um QR code por email.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Events List */}
        <div className="space-y-4">
          <h2 className="font-bold text-lg">Eventos Disponíveis</h2>
          
          {events.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground">
                  Nenhum evento disponível no momento
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Novos eventos serão adicionados em breve
                </p>
              </CardContent>
            </Card>
          ) : (
            events.map((event) => (
              <Card 
                key={event.id} 
                className="overflow-hidden hover-elevate active-elevate-2"
                data-testid={`card-event-${event.id}`}
              >
                <CardHeader className="p-0">
                  <div className="h-32 bg-gradient-to-r from-primary/20 to-primary/10 flex items-center justify-center">
                    <Calendar className="h-16 w-16 text-primary/40" />
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-bold text-base mb-1">{event.name}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {event.description}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span>{formatDate(event.date)}</span>
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Clock className="h-4 w-4 mr-2" />
                      <span>{event.time}</span>
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4 mr-2" />
                      <span>{event.location}</span>
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Users className="h-4 w-4 mr-2" />
                      <span>{event.available_seats} lugares disponíveis</span>
                    </div>
                  </div>

                  <div className="bg-muted/30 rounded-lg p-3 mb-3 space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Só ida</span>
                      <span className="font-semibold">{event.transport_price_one_way} AKZ</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Só volta</span>
                      <span className="font-semibold">{event.transport_price_return} AKZ</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Ida e volta</span>
                      <span className="font-semibold text-primary">{event.transport_price_round_trip} AKZ</span>
                    </div>
                  </div>

                  <Button
                    className="w-full gradient-bg text-white"
                    data-testid={`button-reserve-event-${event.id}`}
                    onClick={() => setLocation(`/events/${event.id}/reserve`)}
                  >
                    Reservar Transporte
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>

      <BottomNav currentPage="events" />
    </div>
  );
}
