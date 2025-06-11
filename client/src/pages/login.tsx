import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Eye, EyeOff } from "lucide-react";

export default function Login() {
  const [isRegistering, setIsRegistering] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    studentNumber: "",
    university: "",
    phone: "",
    password: "",
  });

  const { toast } = useToast();

  const { data: universities } = useQuery({
    queryKey: ["/api/universities"],
  });

  const updateField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleLogin = () => {
    window.location.href = "/api/login";
  };

  const registerMutation = useMutation({
    mutationFn: async () => {
      // First authenticate with Replit
      window.location.href = "/api/login";
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Falha ao fazer login. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <div className="gradient-bg px-6 pt-12 pb-8 text-center">
        <div className="bg-white rounded-2xl p-4 inline-block mb-4">
          <div className="w-16 h-16 gradient-bg rounded-xl flex items-center justify-center">
            <span className="text-white font-bold text-2xl">T</span>
          </div>
        </div>
        <h1 className="text-white text-2xl font-bold mb-2">TRANSFÁCIL</h1>
        <p className="text-white/90 text-sm">fácil e seguro</p>
      </div>

      {/* Content */}
      <div className="flex-1 px-6 py-8">
        {!isRegistering ? (
          <Card className="border-0 shadow-none">
            <CardHeader className="px-0">
              <h2 className="text-2xl font-bold mb-2">Bem-vindo!</h2>
              <p className="text-muted-foreground">Entre na sua conta para continuar</p>
            </CardHeader>
            <CardContent className="px-0 space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="email">Email ou Número</Label>
                  <Input
                    id="email"
                    type="text"
                    placeholder="exemplo@estudante.com"
                    className="rounded-xl"
                    value={formData.email}
                    onChange={(e) => updateField("email", e.target.value)}
                  />
                </div>
                
                <div>
                  <Label htmlFor="password">Senha</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className="rounded-xl pr-12"
                      value={formData.password}
                      onChange={(e) => updateField("password", e.target.value)}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      )}
                    </Button>
                  </div>
                </div>
              </div>
              
              <Button 
                className="w-full gradient-bg text-white font-semibold py-6 rounded-xl hover:shadow-lg"
                onClick={handleLogin}
              >
                Entrar
              </Button>
              
              <div className="text-center space-y-4">
                <Button variant="link" className="text-primary font-medium">
                  Esqueci minha senha
                </Button>
                
                <div className="flex items-center">
                  <hr className="flex-1 border-muted" />
                  <span className="px-4 text-muted-foreground text-sm">ou</span>
                  <hr className="flex-1 border-muted" />
                </div>
                
                <Button 
                  variant="outline"
                  className="w-full border-2 border-primary text-primary font-semibold py-6 rounded-xl hover:bg-primary hover:text-white"
                  onClick={() => setIsRegistering(true)}
                >
                  Criar Nova Conta
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="border-0 shadow-none">
            <CardHeader className="px-0">
              <div className="flex items-center mb-6">
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="mr-4 p-0"
                  onClick={() => setIsRegistering(false)}
                >
                  ←
                </Button>
                <h2 className="text-xl font-bold">Criar Conta</h2>
              </div>
            </CardHeader>
            <CardContent className="px-0 space-y-4">
              <div>
                <Label htmlFor="fullName">Nome Completo</Label>
                <Input
                  id="fullName"
                  type="text"
                  placeholder="Seu nome completo"
                  className="rounded-xl"
                  value={formData.fullName}
                  onChange={(e) => updateField("fullName", e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor="emailReg">Email Estudantil</Label>
                <Input
                  id="emailReg"
                  type="email"
                  placeholder="nome@universidade.edu.ao"
                  className="rounded-xl"
                  value={formData.email}
                  onChange={(e) => updateField("email", e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor="studentNumber">Número de Estudante</Label>
                <Input
                  id="studentNumber"
                  type="text"
                  placeholder="2024XXXX"
                  className="rounded-xl"
                  value={formData.studentNumber}
                  onChange={(e) => updateField("studentNumber", e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor="university">Universidade</Label>
                <Select value={formData.university} onValueChange={(value) => updateField("university", value)}>
                  <SelectTrigger className="rounded-xl">
                    <SelectValue placeholder="Selecione sua universidade" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="uan">Universidade Agostinho Neto</SelectItem>
                    <SelectItem value="ucan">Universidade Católica de Angola</SelectItem>
                    <SelectItem value="isptec">Instituto Superior Politécnico</SelectItem>
                    {universities?.map((uni: any) => (
                      <SelectItem key={uni.id} value={uni.code}>
                        {uni.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="phone">Telefone</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+244 XXX XXX XXX"
                  className="rounded-xl"
                  value={formData.phone}
                  onChange={(e) => updateField("phone", e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor="passwordReg">Senha</Label>
                <Input
                  id="passwordReg"
                  type="password"
                  placeholder="Mínimo 8 caracteres"
                  className="rounded-xl"
                  value={formData.password}
                  onChange={(e) => updateField("password", e.target.value)}
                />
              </div>
              
              <Button 
                className="w-full gradient-bg text-white font-semibold py-6 rounded-xl mt-6"
                onClick={() => registerMutation.mutate()}
                disabled={registerMutation.isPending}
              >
                {registerMutation.isPending ? "Criando..." : "Criar Conta"}
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
