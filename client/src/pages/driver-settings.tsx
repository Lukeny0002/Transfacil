import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { ArrowLeft, Car, Save, Settings } from "lucide-react";

export default function DriverSettings() {
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();

  const { data: student } = useQuery({
    queryKey: ["/api/student/profile"],
  });

  const [vehicleInfo, setVehicleInfo] = useState({
    vehicleMake: student?.vehicleMake || "",
    vehicleModel: student?.vehicleModel || "",
    vehicleColor: student?.vehicleColor || "",
    vehiclePlate: student?.vehiclePlate || "",
  });

  const updateVehicleMutation = useMutation({
    mutationFn: async (data: typeof vehicleInfo) => {
      await apiRequest("PUT", "/api/student/vehicle", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/student/profile'] });
      toast({
        title: "Configurações salvas!",
        description: "Informações do veículo atualizadas com sucesso.",
      });
    },
    onError: () => {
      toast({
        title: "Erro ao salvar",
        description: "Falha ao atualizar informações do veículo.",
        variant: "destructive",
      });
    },
  });

  const handleSave = () => {
    if (!vehicleInfo.vehicleMake || !vehicleInfo.vehicleModel || !vehicleInfo.vehiclePlate) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha marca, modelo e matrícula do veículo.",
        variant: "destructive",
      });
      return;
    }
    updateVehicleMutation.mutate(vehicleInfo);
  };

  const updateField = (field: string, value: string) => {
    setVehicleInfo(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
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
            <div className="text-center">
              <h2 className="font-bold text-lg">Configurações do Motorista</h2>
              <p className="text-sm text-gray-600">Informações do veículo</p>
            </div>
            <Button 
              size="sm"
              className="gradient-bg text-white"
              onClick={handleSave}
              disabled={updateVehicleMutation.isPending}
            >
              <Save className="h-4 w-4 mr-2" />
              {updateVehicleMutation.isPending ? "Salvando..." : "Salvar"}
            </Button>
          </div>
        </div>
      </div>

      <div className="p-6 max-w-2xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Car className="h-5 w-5 text-primary" />
              <span>Informações do Veículo</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="vehicleMake">Marca *</Label>
                <Input
                  id="vehicleMake"
                  value={vehicleInfo.vehicleMake}
                  onChange={(e) => updateField("vehicleMake", e.target.value)}
                  placeholder="Ex: Toyota"
                  data-testid="input-vehicle-make"
                />
              </div>

              <div>
                <Label htmlFor="vehicleModel">Modelo *</Label>
                <Input
                  id="vehicleModel"
                  value={vehicleInfo.vehicleModel}
                  onChange={(e) => updateField("vehicleModel", e.target.value)}
                  placeholder="Ex: Corolla"
                  data-testid="input-vehicle-model"
                />
              </div>

              <div>
                <Label htmlFor="vehicleColor">Cor</Label>
                <Input
                  id="vehicleColor"
                  value={vehicleInfo.vehicleColor}
                  onChange={(e) => updateField("vehicleColor", e.target.value)}
                  placeholder="Ex: Branco"
                  data-testid="input-vehicle-color"
                />
              </div>

              <div>
                <Label htmlFor="vehiclePlate">Matrícula *</Label>
                <Input
                  id="vehiclePlate"
                  value={vehicleInfo.vehiclePlate}
                  onChange={(e) => updateField("vehiclePlate", e.target.value.toUpperCase())}
                  placeholder="Ex: ABC-123"
                  data-testid="input-vehicle-plate"
                  maxLength={10}
                />
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100">
              <p className="text-sm text-gray-600">
                * Campos obrigatórios. Estas informações serão exibidas aos estudantes quando você oferecer Bloeia.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-6">
            <div className="flex items-start space-x-3">
              <Settings className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <h4 className="font-semibold text-blue-800 mb-2">Informação Importante</h4>
                <p className="text-sm text-blue-700">
                  Mantenha as informações do veículo sempre atualizadas. Os estudantes usam estes dados para identificar seu carro no ponto de encontro.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pré-visualização</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600 mb-2">Como aparece para os estudantes:</p>
              <p className="font-medium">
                {vehicleInfo.vehicleMake && vehicleInfo.vehicleModel 
                  ? `${vehicleInfo.vehicleMake} ${vehicleInfo.vehicleModel}`
                  : "Marca Modelo"}
                {vehicleInfo.vehicleColor && ` ${vehicleInfo.vehicleColor}`}
                {vehicleInfo.vehiclePlate && ` - ${vehicleInfo.vehiclePlate}`}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
