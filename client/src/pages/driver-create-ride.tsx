import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { ArrowLeft, MapPin, Clock, Users, DollarSign, Car, Calendar, Route, AlertCircle, Settings } from "lucide-react";

export default function DriverCreateRide() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const { data: student } = useQuery({
    queryKey: ["/api/student/profile"],
  });

  const [formData, setFormData] = useState({
    fromLocation: "",
    toLocation: "",
    departureDate: "",
    departureTime: "",
    availableSeats: "1",
    price: "",
    isRecurring: false,
    recurringDays: [] as string[],
    vehicleInfo: "", // This will be replaced by data from settings
    meetingPoint: "",
    description: "",
    requirements: "",
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
        price: parseFloat(data.price),
        isRecurring: data.isRecurring,
        recurringDays: data.recurringDays,
        // Vehicle info will be implicitly linked via the driver's settings
        description: `${data.description}\nPonto de encontro: ${data.meetingPoint}\nRequirements: ${data.requirements}`,
      };
      // Server expects rides to be created at /api/rides (authenticated)
      await apiRequest("POST", "/api/rides", rideData);
    },
    onSuccess: () => {
      // Invalidate available rides and my rides so UI updates
      queryClient.invalidateQueries({ queryKey: ["/api/rides"] });
      queryClient.invalidateQueries({ queryKey: ["/api/rides/my"] });
      toast({
        title: "Viagem criada!",
        description: "Sua oferta de viagem foi publicada com sucesso.",
      });
      setLocation("/driver");
    },
    onError: (error) => {
      console.error("Error creating ride:", error);
      toast({
        title: "Erro",
        description: error.message || "Falha ao criar viagem. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  const updateField = (field: string, value: string | boolean | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleRecurringDay = (day: string) => {
    const currentDays = formData.recurringDays;
    const newDays = currentDays.includes(day)
      ? currentDays.filter(d => d !== day)
      : [...currentDays, day];
    updateField("recurringDays", newDays);
  };

  const handleSubmit = () => {
    if (!student?.vehicleMake || !student?.vehicleModel || !student?.vehiclePlate) {
      toast({
        title: "Configure seu veículo",
        description: "Configure as informações do veículo nas configurações antes de publicar uma viagem.",
        variant: "destructive",
      });
      setLocation("/driver/settings");
      return;
    }

    if (!formData.fromLocation || !formData.toLocation || !formData.departureDate || !formData.departureTime) {
      toast({
        title: "Dados incompletos",
        description: "Preencha todos os campos obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    if (formData.isRecurring && formData.recurringDays.length === 0) {
      toast({
        title: "Dias da semana",
        description: "Selecione pelo menos um dia da semana para viagens recorrentes.",
        variant: "destructive",
      });
      return;
    }

    createRideMutation.mutate(formData);
  };

  // Generate time options
  const timeOptions = [];
  for (let hour = 5; hour <= 23; hour++) {
    for (let minute = 0; minute < 60; minute += 15) {
      const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      timeOptions.push(timeString);
    }
  }

  // Get today's date for minimum date selection
  const today = new Date().toISOString().split('T')[0];

  const weekDays = [
    { id: 'monday', label: 'Segunda' },
    { id: 'tuesday', label: 'Terça' },
    { id: 'wednesday', label: 'Quarta' },
    { id: 'thursday', label: 'Quinta' },
    { id: 'friday', label: 'Sexta' },
    { id: 'saturday', label: 'Sábado' },
    { id: 'sunday', label: 'Domingo' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLocation("/driver")}
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Voltar ao Painel
            </Button>
            <h2 className="font-bold text-lg">Nova Viagem</h2>
            <Button
              size="sm"
              className="gradient-bg text-white"
              onClick={handleSubmit}
              disabled={createRideMutation.isPending}
            >
              {createRideMutation.isPending ? "Criando..." : "Publicar Viagem"}
            </Button>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Route Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Route className="h-5 w-5 text-primary" />
              <span>Rota da Viagem</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="fromLocation">Ponto de Partida *</Label>
              <Select value={formData.fromLocation} onValueChange={(value) => updateField("fromLocation", value)}>
                <SelectTrigger className="rounded-xl">
                  <SelectValue placeholder="De onde você vai partir?" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Universidade Agostinho Neto">Universidade Agostinho Neto</SelectItem>
                  <SelectItem value="Universidade Católica de Angola">Universidade Católica de Angola</SelectItem>
                  <SelectItem value="ISPTEC">ISPTEC</SelectItem>
                  <SelectItem value="Universidade Oscar Ribas">Universidade Oscar Ribas</SelectItem>
                  <SelectItem value="UTANGA">UTANGA</SelectItem>
                  <SelectItem value="Centro da Cidade">Centro da Cidade</SelectItem>
                  <SelectItem value="Shopping Belas">Shopping Belas</SelectItem>
                  <SelectItem value="Talatona">Talatona</SelectItem>
                  <SelectItem value="Viana">Viana</SelectItem>
                  <SelectItem value="Cacuaco">Cacuaco</SelectItem>
                  <SelectItem value="Kilamba">Kilamba</SelectItem>
                  <SelectItem value="Benfica">Benfica</SelectItem>
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
                  <SelectItem value="UTANGA">UTANGA</SelectItem>
                  <SelectItem value="Centro da Cidade">Centro da Cidade</SelectItem>
                  <SelectItem value="Shopping Belas">Shopping Belas</SelectItem>
                  <SelectItem value="Talatona">Talatona</SelectItem>
                  <SelectItem value="Viana">Viana</SelectItem>
                  <SelectItem value="Cacuaco">Cacuaco</SelectItem>
                  <SelectItem value="Kilamba">Kilamba</SelectItem>
                  <SelectItem value="Benfica">Benfica</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="meetingPoint">Ponto de Encontro Específico</Label>
              <Input
                id="meetingPoint"
                value={formData.meetingPoint}
                onChange={(e) => updateField("meetingPoint", e.target.value)}
                placeholder="Ex: Portão principal da universidade, esquina com a Rua X"
                className="rounded-xl"
              />
            </div>
          </CardContent>
        </Card>

        {/* Date and Time */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-primary" />
              <span>Agendamento</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="isRecurring"
                checked={formData.isRecurring}
                onCheckedChange={(checked) => updateField("isRecurring", checked)}
              />
              <Label htmlFor="isRecurring">Viagem recorrente (repetir semanalmente)</Label>
            </div>

            {!formData.isRecurring ? (
              <div className="grid grid-cols-2 gap-4">
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
                  <Label htmlFor="departureTime">Horário de Partida *</Label>
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
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <Label>Dias da Semana *</Label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {weekDays.map(day => (
                      <div key={day.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={day.id}
                          checked={formData.recurringDays.includes(day.id)}
                          onCheckedChange={() => toggleRecurringDay(day.id)}
                        />
                        <Label htmlFor={day.id}>{day.label}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <Label htmlFor="departureTime">Horário de Partida *</Label>
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
              </div>
            )}
          </CardContent>
        </Card>

        {/* Vehicle Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Car className="h-5 w-5 text-primary" />
              <span>Informações do Veículo</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {student?.vehicleMake && student?.vehicleModel && student?.vehiclePlate ? (
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-lg">
                      {student.vehicleMake} {student.vehicleModel}
                      {student.vehicleColor && ` ${student.vehicleColor}`}
                    </p>
                    <p className="text-gray-600">Matrícula: {student.vehiclePlate}</p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setLocation("/driver/settings")}
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Editar
                  </Button>
                </div>
              </div>
            ) : (
              <div className="bg-orange-50 p-4 rounded-lg">
                <p className="text-orange-800 mb-3">Configure as informações do seu veículo antes de publicar uma viagem.</p>
                <Button
                  className="gradient-bg text-white"
                  onClick={() => setLocation("/driver/settings")}
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Configurar Veículo
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Pricing */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <DollarSign className="h-5 w-5 text-primary" />
              <span>Preço por Passageiro</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="price">Valor (AKZ) *</Label>
              <Input
                id="price"
                type="number"
                value={formData.price}
                onChange={(e) => updateField("price", e.target.value)}
                placeholder="Ex: 800"
                min="0"
                className="rounded-xl"
              />
              <p className="text-xs text-gray-500 mt-1">
                Preço sugerido: 400-1200 AKZ dependendo da distância
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Additional Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-primary" />
              <span>Informações Adicionais</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="requirements">Requisitos para Passageiros</Label>
              <Textarea
                id="requirements"
                value={formData.requirements}
                onChange={(e) => updateField("requirements", e.target.value)}
                placeholder="Ex: Estudantes universitários apenas, não fumar no carro, pontualidade"
                className="rounded-xl resize-none"
                rows={2}
              />
            </div>

            <div>
              <Label htmlFor="description">Observações da Viagem</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => updateField("description", e.target.value)}
                placeholder="Ex: Paradas adicionais no caminho, música ambiente, ar condicionado"
                className="rounded-xl resize-none"
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Safety Notice */}
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="p-4">
            <div className="flex items-start space-x-3">
              <AlertCircle className="h-5 w-5 text-orange-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-orange-800">Lembrete de Segurança</h4>
                <ul className="text-sm text-orange-700 mt-2 space-y-1">
                  <li>• Mantenha sempre seu documento de condução em dia</li>
                  <li>• Verifique se seu veículo está em boas condições</li>
                  <li>• Seja pontual e comunique qualquer atraso</li>
                  <li>• Trate todos os passageiros com respeito</li>
                  <li>• Em caso de emergência, ligue para 113</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex space-x-4">
          <Button
            variant="outline"
            className="flex-1 border-gray-300"
            onClick={() => setLocation("/driver")}
          >
            Cancelar
          </Button>
          <Button
            className="flex-1 gradient-bg text-white"
            onClick={handleSubmit}
            disabled={createRideMutation.isPending}
          >
            {createRideMutation.isPending ? "Publicando..." : "Publicar Viagem"}
          </Button>
        </div>
      </div>
    </div>
  );
}