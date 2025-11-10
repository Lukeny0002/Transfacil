
import { useState } from "react";
import { useParams, useLocation } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ArrowLeft, MapPin, Calendar, Clock, DollarSign } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function EventReserve() {
  const { id } = useParams();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [tripType, setTripType] = useState<"one_way" | "return_only" | "round_trip">("round_trip");
  const [studentAddress, setStudentAddress] = useState("");

  // Fetch event details
  const { data: events = [] } = useQuery({
    queryKey: ['/api/events/active'],
    queryFn: async () => {
      const response = await fetch('/api/events/active');
      if (!response.ok) throw new Error('Falha ao buscar eventos');
      return response.json();
    },
  });

  const event = events.find((e: any) => e.id === parseInt(id!));

  // Create booking mutation
  const createBooking = useMutation({
    mutationFn: async (bookingData: { tripType: string; studentAddress: string }) => {
      const response = await fetch(`/api/events/${id}/book`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingData),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Falha ao criar reserva');
      }
      
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Reserva criada com sucesso!",
        description: "Agora você precisa enviar o comprovante de pagamento.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/events/active'] });
      setLocation('/events');
    },
    onError: (error: Error) => {
      toast({
        title: "Erro ao criar reserva",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  if (!event) {
    return (
      <div className="min-h-screen p-6">
        <p>Evento não encontrado</p>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-AO', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  const getPriceForTripType = () => {
    switch (tripType) {
      case "one_way":
        return event.transportPriceOneWay;
      case "return_only":
        return event.transportPriceReturn;
      case "round_trip":
        return event.transportPriceRoundTrip;
      default:
        return "0";
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!studentAddress.trim()) {
      toast({
        title: "Endereço obrigatório",
        description: "Por favor, informe seu endereço para o serviço de transporte.",
        variant: "destructive",
      });
      return;
    }

    createBooking.mutate({ tripType, studentAddress });
  };

  return (
    <div className="min-h-screen pb-6">
      {/* Header */}
      <div className="gradient-bg px-6 py-8 pb-6">
        <Button
          variant="ghost"
          className="text-white mb-4 -ml-2"
          onClick={() => setLocation('/events')}
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Voltar
        </Button>
        <h1 className="text-white text-2xl font-bold">Reservar Transporte</h1>
        <p className="text-white/80 text-sm">{event.name}</p>
      </div>

      <div className="px-6 py-4 space-y-4">
        {/* Event Info */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Detalhes do Evento</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center text-sm">
              <Calendar className="h-4 w-4 mr-2 text-primary" />
              <span>{formatDate(event.eventDate)} às {event.eventTime}</span>
            </div>
            <div className="flex items-center text-sm">
              <MapPin className="h-4 w-4 mr-2 text-primary" />
              <span>{event.location}</span>
            </div>
          </CardContent>
        </Card>

        {/* Booking Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Tipo de Viagem</CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup value={tripType} onValueChange={(value: any) => setTripType(value)}>
                <div className="flex items-center justify-between p-3 border rounded-lg mb-2">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="one_way" id="one_way" />
                    <Label htmlFor="one_way" className="cursor-pointer">Só Ida</Label>
                  </div>
                  <span className="font-semibold text-primary">{event.transportPriceOneWay} AKZ</span>
                </div>
                
                <div className="flex items-center justify-between p-3 border rounded-lg mb-2">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="return_only" id="return_only" />
                    <Label htmlFor="return_only" className="cursor-pointer">Só Volta</Label>
                  </div>
                  <span className="font-semibold text-primary">{event.transportPriceReturn} AKZ</span>
                </div>
                
                <div className="flex items-center justify-between p-3 border rounded-lg bg-primary/5">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="round_trip" id="round_trip" />
                    <Label htmlFor="round_trip" className="cursor-pointer font-semibold">Ida e Volta</Label>
                  </div>
                  <span className="font-bold text-primary">{event.transportPriceRoundTrip} AKZ</span>
                </div>
              </RadioGroup>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Endereço de Recolha</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Digite seu endereço completo para recolha..."
                value={studentAddress}
                onChange={(e) => setStudentAddress(e.target.value)}
                rows={3}
                required
              />
              <p className="text-xs text-muted-foreground mt-2">
                Informe um endereço detalhado para facilitar a recolha
              </p>
            </CardContent>
          </Card>

          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <DollarSign className="h-5 w-5 text-primary mr-2" />
                  <span className="font-semibold">Total a Pagar</span>
                </div>
                <span className="text-2xl font-bold text-primary">{getPriceForTripType()} AKZ</span>
              </div>
            </CardContent>
          </Card>

          <Button
            type="submit"
            className="w-full gradient-bg text-white"
            disabled={createBooking.isPending}
          >
            {createBooking.isPending ? "Processando..." : "Confirmar Reserva"}
          </Button>
        </form>
      </div>
    </div>
  );
}
