import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { ArrowLeft, MapPin, Clock, Users, DollarSign, Car } from "lucide-react";

export default function OfferRide() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    fromLocation: "",
    toLocation: "",
    departureDate: "",
    departureTime: "",
    availableSeats: "1",
    price: "0",
    description: "",
    vehicleInfo: "",
    meetingPoint: "",
  });

  const createRideMutation = useMutation({
    mutationFn: async (data: any) => {
      // Garante que temos uma data ISO válida combinando data e hora
      const [hours, minutes] = data.departureTime.split(':');
      const departureDate = new Date(data.departureDate);
      departureDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);
      
      const rideData = {
        fromLocation: data.fromLocation,
        toLocation: data.toLocation,
        startTime: departureDate.toISOString(),
        availableSeats: parseInt(data.availableSeats),
        price: String(parseFloat(data.price)),
        description: `${data.description}\n\nVeículo: ${data.vehicleInfo}\nPonto de encontro: ${data.meetingPoint}`,
      };
      await apiRequest("POST", "/api/rides", rideData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/rides"] });
      queryClient.invalidateQueries({ queryKey: ["/api/rides/my"] });
      toast({
        title: "Boleia criada!",
        description: "Sua oferta de Boleia foi publicada com sucesso.",
      });
      setLocation("/rides");
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Falha ao criar Bloeia. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  const updateField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    if (!formData.fromLocation || !formData.toLocation || !formData.departureDate || !formData.departureTime) {
      toast({
        title: "Dados incompletos",
        description: "Preencha todos os campos obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    createRideMutation.mutate(formData);
  };

  // Generate time options
  const timeOptions = [];
  for (let hour = 6; hour <= 22; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      timeOptions.push(timeString);
    }
  }

  // Get today's date for minimum date selection
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <div className="bg-white px-6 py-4 border-b border-muted">
        <div className="flex items-center justify-between">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => setLocation("/rides")}
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Voltar
          </Button>
          <h2 className="font-bold text-lg">Oferecer Boleia</h2>
          <Button 
            size="sm"
            className="gradient-bg text-white"
            onClick={handleSubmit}
            disabled={createRideMutation.isPending}
          >
            {createRideMutation.isPending ? "Criando..." : "Publicar"}
          </Button>
        </div>
      </div>

      <div className="px-6 py-6 space-y-6">
        {/* Route Information */}
        <Card className="border border-muted shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <MapPin className="h-5 w-5 text-primary" />
              <span>Rota da Viagem</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="fromLocation">Saída *</Label>
              <Select value={formData.fromLocation} onValueChange={(value) => updateField("fromLocation", value)}>
                <SelectTrigger className="rounded-xl">
                  <SelectValue placeholder="De onde você vai sair?" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Universidade Agostinho Neto">Universidade Agostinho Neto</SelectItem>
                  <SelectItem value="Universidade Católica de Angola">Universidade Católica de Angola</SelectItem>
                  <SelectItem value="ISPTEC">ISPTEC</SelectItem>
                  <SelectItem value="Universidade Oscar Ribas">Universidade Oscar Ribas</SelectItem>
                  <SelectItem value="Centro da Cidade">Centro da Cidade</SelectItem>
                  <SelectItem value="Shopping Belas">Shopping Belas</SelectItem>
                  <SelectItem value="Talatona">Talatona</SelectItem>
                  <SelectItem value="Viana">Viana</SelectItem>
                  <SelectItem value="Cacuaco">Cacuaco</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="toLocation">Destino *</Label>
              <Select value={formData.toLocation} onValueChange={(value) => updateField("toLocation", value)}>
                <SelectTrigger className="rounded-xl">
                  <SelectValue placeholder="Para onde você vai?" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Universidade Agostinho Neto">Universidade Agostinho Neto</SelectItem>
                  <SelectItem value="Universidade Católica de Angola">Universidade Católica de Angola</SelectItem>
                  <SelectItem value="ISPTEC">ISPTEC</SelectItem>
                  <SelectItem value="Universidade Oscar Ribas">Universidade Oscar Ribas</SelectItem>
                  <SelectItem value="Centro da Cidade">Centro da Cidade</SelectItem>
                  <SelectItem value="Shopping Belas">Shopping Belas</SelectItem>
                  <SelectItem value="Talatona">Talatona</SelectItem>
                  <SelectItem value="Viana">Viana</SelectItem>
                  <SelectItem value="Cacuaco">Cacuaco</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="meetingPoint">Ponto de Encontro</Label>
              <Input
                id="meetingPoint"
                value={formData.meetingPoint}
                onChange={(e) => updateField("meetingPoint", e.target.value)}
                placeholder="Ex: Portão principal da universidade"
                className="rounded-xl"
              />
            </div>
          </CardContent>
        </Card>

        {/* Date and Time */}
        <Card className="border border-muted shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-primary" />
              <span>Data e Horário</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="departureDate">Data da Viagem *</Label>
              <Input
                id="departureDate"
                type="date"
                value={formData.departureDate}
                onChange={(e) => updateField("departureDate", e.target.value)}
                min={today}
                className="rounded-xl"
              />
            </div>

            <div>
              <Label htmlFor="departureTime">Horário de Saída *</Label>
              <Select value={formData.departureTime} onValueChange={(value) => updateField("departureTime", value)}>
                <SelectTrigger className="rounded-xl">
                  <SelectValue placeholder="Selecione o horário" />
                </SelectTrigger>
                <SelectContent>
                  {timeOptions.map(time => (
                    <SelectItem key={time} value={time}>{time}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Vehicle and Capacity */}
        <Card className="border border-muted shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Car className="h-5 w-5 text-primary" />
              <span>Veículo e Capacidade</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="vehicleInfo">Informações do Veículo</Label>
              <Input
                id="vehicleInfo"
                value={formData.vehicleInfo}
                onChange={(e) => updateField("vehicleInfo", e.target.value)}
                placeholder="Ex: Toyota Corolla branco, placa ABC-123"
                className="rounded-xl"
              />
            </div>

            <div>
              <Label htmlFor="availableSeats">Lugares Disponíveis *</Label>
              <Select value={formData.availableSeats} onValueChange={(value) => updateField("availableSeats", value)}>
                <SelectTrigger className="rounded-xl">
                  <SelectValue placeholder="Quantos passageiros?" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 lugar</SelectItem>
                  <SelectItem value="2">2 lugares</SelectItem>
                  <SelectItem value="3">3 lugares</SelectItem>
                  <SelectItem value="4">4 lugares</SelectItem>
                  <SelectItem value="5">5 lugares</SelectItem>
                  <SelectItem value="6">6 lugares</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Pricing */}
        <Card className="border border-muted shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <DollarSign className="h-5 w-5 text-primary" />
              <span>Preço</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="price">Preço por Pessoa (AKZ)</Label>
              <Input
                id="price"
                type="number"
                value={formData.price}
                onChange={(e) => updateField("price", e.target.value)}
                placeholder="0 para Bloeia gratuita"
                min="0"
                className="rounded-xl"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Deixe em 0 para oferecer Boleia gratuita (solidária)
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Additional Information */}
        <Card className="border border-muted shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-primary" />
              <span>Informações Adicionais</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="description">Observações</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => updateField("description", e.target.value)}
                placeholder="Ex: Preferência por estudantes da mesma universidade, paradas no caminho, etc."
                className="rounded-xl resize-none"
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Terms Agreement */}
        <Card className="border border-muted shadow-sm bg-muted/20">
          <CardContent className="p-4">
            <div className="flex items-start space-x-3">
              <div className="w-4 h-4 bg-primary rounded-sm flex items-center justify-center mt-0.5">
                <span className="text-white text-xs">✓</span>
              </div>
              <div>
                <p className="text-sm">
                  Ao oferecer Boleia, você concorda em:
                </p>
                <ul className="text-xs text-muted-foreground mt-2 space-y-1">
                  <li>• Ser pontual no horário combinado</li>
                  <li>• Dirigir de forma segura e responsável</li>
                  <li>• Respeitar todos os passageiros</li>
                  <li>• Comunicar qualquer alteração ou cancelamento</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex space-x-4">
          <Button 
            variant="outline"
            className="flex-1 border-muted"
            onClick={() => setLocation("/rides")}
          >
            Cancelar
          </Button>
          <Button 
            className="flex-1 gradient-bg text-white"
            onClick={handleSubmit}
            disabled={createRideMutation.isPending}
          >
            {createRideMutation.isPending ? "Publicando..." : "Publicar Boleia"}
          </Button>
        </div>
      </div>
    </div>
  );
}