import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { ArrowLeft, Camera, Save } from "lucide-react";

export default function EditProfile() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const { data: student } = useQuery({
    queryKey: ["/api/student/profile"],
  });

  const { data: universities } = useQuery({
    queryKey: ["/api/universities"],
  });

  const [formData, setFormData] = useState({
    fullName: student?.fullName || `${user?.firstName} ${user?.lastName}` || "",
    email: student?.email || user?.email || "",
    phone: student?.phone || "",
    university: student?.university || "",
    course: student?.course || "",
    studentNumber: student?.studentNumber || "",
  });

  const updateMutation = useMutation({
    mutationFn: async (data: any) => {
      if (student?.id) {
        await apiRequest("PUT", `/api/student/profile/${student.id}`, data);
      } else {
        await apiRequest("POST", "/api/student/profile", data);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/student/profile"] });
      toast({
        title: "Sucesso!",
        description: "Perfil atualizado com sucesso.",
      });
      setLocation("/profile");
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Falha ao atualizar perfil. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  const handleSave = () => {
    updateMutation.mutate(formData);
  };

  const updateField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const userInitials = formData.fullName?.split(' ').map(n => n[0]).join('') || 'U';

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <div className="bg-white px-6 py-4 border-b border-muted">
        <div className="flex items-center justify-between">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => setLocation("/profile")}
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Voltar
          </Button>
          <h2 className="font-bold text-lg">Editar Perfil</h2>
          <Button 
            size="sm"
            className="gradient-bg text-white"
            onClick={handleSave}
            disabled={updateMutation.isPending}
          >
            <Save className="h-4 w-4 mr-2" />
            {updateMutation.isPending ? "Salvando..." : "Salvar"}
          </Button>
        </div>
      </div>

      <div className="px-6 py-6 space-y-6">
        {/* Profile Photo */}
        <Card className="border border-muted shadow-sm">
          <CardContent className="p-6 text-center">
            <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-4 relative">
              <span className="font-bold text-3xl text-muted-foreground">{userInitials}</span>
              <Button 
                size="sm"
                className="absolute bottom-0 right-0 rounded-full w-8 h-8 p-0 gradient-bg text-white"
                onClick={() => toast({
                  title: "Em breve",
                  description: "Upload de foto será disponibilizado em breve.",
                })}
              >
                <Camera className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">Toque no ícone para alterar a foto</p>
          </CardContent>
        </Card>

        {/* Personal Information */}
        <Card className="border border-muted shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Informações Pessoais</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="fullName">Nome Completo</Label>
              <Input
                id="fullName"
                value={formData.fullName}
                onChange={(e) => updateField("fullName", e.target.value)}
                placeholder="Seu nome completo"
                className="rounded-xl"
              />
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => updateField("email", e.target.value)}
                placeholder="seu@email.com"
                className="rounded-xl"
              />
            </div>

            <div>
              <Label htmlFor="phone">Telefone</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => updateField("phone", e.target.value)}
                placeholder="+244 XXX XXX XXX"
                className="rounded-xl"
              />
            </div>
          </CardContent>
        </Card>

        {/* Academic Information */}
        <Card className="border border-muted shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Informações Acadêmicas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="studentNumber">Número de Estudante</Label>
              <Input
                id="studentNumber"
                value={formData.studentNumber}
                onChange={(e) => updateField("studentNumber", e.target.value)}
                placeholder="2024XXXX"
                className="rounded-xl"
              />
            </div>

            <div>
              <Label htmlFor="university">Universidade</Label>
              <Select value={formData.university} onValueChange={(value) => updateField("university", value)}>
                <SelectTrigger className="rounded-xl">
                  <SelectValue placeholder="Selecione sua universidade" />
                </SelectTrigger>
                <SelectContent>
                  {universities && universities.length > 0 ? universities.map((uni: any) => (
                    <SelectItem key={uni.id} value={uni.code}>
                      {uni.name}
                    </SelectItem>
                  )) : (
                    <SelectItem value="loading" disabled>Carregando universidades...</SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="course">Curso</Label>
              <Input
                id="course"
                value={formData.course}
                onChange={(e) => updateField("course", e.target.value)}
                placeholder="Ex: Engenharia Informática"
                className="rounded-xl"
              />
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex space-x-4">
          <Button 
            variant="outline"
            className="flex-1 border-muted"
            onClick={() => setLocation("/profile")}
          >
            Cancelar
          </Button>
          <Button 
            className="flex-1 gradient-bg text-white"
            onClick={handleSave}
            disabled={updateMutation.isPending}
          >
            {updateMutation.isPending ? "Salvando..." : "Salvar Alterações"}
          </Button>
        </div>
      </div>
    </div>
  );
}