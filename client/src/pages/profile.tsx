import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import BottomNav from "@/components/bottom-nav";
import { 
  ArrowLeft, 
  Edit, 
  QrCode, 
  Crown, 
  Receipt, 
  UserPen, 
  Lock, 
  Bell, 
  HelpCircle, 
  FileText, 
  LogOut,
  Car
} from "lucide-react";

export default function Profile() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const { data: student } = useQuery({
    queryKey: ["/api/student/profile"],
  });

  const { data: subscription } = useQuery({
    queryKey: ["/api/subscription/active"],
  });

  const handleLogout = () => {
    window.location.href = "/api/logout";
  };

  const showComingSoon = (feature: string) => {
    toast({
      title: "Em breve",
      description: `${feature} será disponibilizado em breve.`,
    });
  };

  const userInitials = student?.fullName?.split(' ').map(n => n[0]).join('') || 
                      (user?.firstName?.[0] || '') + (user?.lastName?.[0] || '') || 
                      'U';

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <div className="gradient-bg px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <Button 
            variant="ghost" 
            size="sm"
            className="text-white hover:bg-white/20"
            onClick={() => setLocation("/")}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h2 className="font-bold text-lg text-white">Meu Perfil</h2>
          <Button 
            variant="ghost" 
            size="sm"
            className="text-white hover:bg-white/20"
            onClick={() => showComingSoon("Edição de perfil")}
          >
            <Edit className="h-5 w-5" />
          </Button>
        </div>
        
        <div className="text-center">
          <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="font-bold text-3xl text-primary">{userInitials}</span>
          </div>
          <h3 className="text-white font-bold text-xl mb-1">
            {student?.fullName || `${user?.firstName} ${user?.lastName}` || "Nome do Estudante"}
          </h3>
          <p className="text-white/80">{student?.email || user?.email || "estudante@uan.edu.ao"}</p>
        </div>
      </div>
      
      {/* Profile Content */}
      <div className="px-6 py-6 space-y-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-4">
          <Card className="border border-muted shadow-sm">
            <CardContent className="p-4 text-center">
              <p className="font-bold text-2xl text-primary">42</p>
              <p className="text-sm text-muted-foreground">Viagens</p>
            </CardContent>
          </Card>
          <Card className="border border-muted shadow-sm">
            <CardContent className="p-4 text-center">
              <p className="font-bold text-2xl text-primary">8</p>
              <p className="text-sm text-muted-foreground">Caronas</p>
            </CardContent>
          </Card>
          <Card className="border border-muted shadow-sm">
            <CardContent className="p-4 text-center">
              <p className="font-bold text-2xl text-primary">4.9</p>
              <p className="text-sm text-muted-foreground">Avaliação</p>
            </CardContent>
          </Card>
        </div>
        
        {/* Menu Options */}
        <div className="space-y-4">
          <Card className="border border-muted shadow-sm">
            <CardContent className="p-0">
              <Button 
                variant="ghost"
                className="w-full justify-between p-4 h-auto hover:bg-muted/50"
                onClick={() => setLocation("/qr")}
              >
                <div className="flex items-center space-x-3">
                  <QrCode className="h-5 w-5 text-primary" />
                  <span className="font-medium">Meu Código QR</span>
                </div>
                <span className="text-muted-foreground">→</span>
              </Button>
              
              <hr className="border-muted" />
              
              <Button 
                variant="ghost"
                className="w-full justify-between p-4 h-auto hover:bg-muted/50"
                onClick={() => setLocation("/subscription")}
              >
                <div className="flex items-center space-x-3">
                  <Crown className="h-5 w-5 text-primary" />
                  <span className="font-medium">Minha Assinatura</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                    {subscription ? "Ativa" : "Inativa"}
                  </Badge>
                  <span className="text-muted-foreground">→</span>
                </div>
              </Button>
              
              <hr className="border-muted" />
              
              <Button 
                variant="ghost"
                className="w-full justify-between p-4 h-auto hover:bg-muted/50"
                onClick={() => showComingSoon("Histórico de pagamentos")}
              >
                <div className="flex items-center space-x-3">
                  <Receipt className="h-5 w-5 text-primary" />
                  <span className="font-medium">Histórico de Pagamentos</span>
                </div>
                <span className="text-muted-foreground">→</span>
              </Button>
            </CardContent>
          </Card>
          
          <Card className="border border-muted shadow-sm">
            <CardContent className="p-0">
              <Button 
                variant="ghost"
                className="w-full justify-between p-4 h-auto hover:bg-muted/50"
                onClick={() => setLocation("/edit-profile")}
              >
                <div className="flex items-center space-x-3">
                  <UserPen className="h-5 w-5 text-primary" />
                  <span className="font-medium">Editar Perfil</span>
                </div>
                <span className="text-muted-foreground">→</span>
              </Button>
              
              <hr className="border-muted" />
              
              <Button 
                variant="ghost"
                className="w-full justify-between p-4 h-auto hover:bg-muted/50"
                onClick={() => setLocation("/driver")}
              >
                <div className="flex items-center space-x-3">
                  <Car className="h-5 w-5 text-primary" />
                  <span className="font-medium">Painel do Motorista</span>
                </div>
                <span className="text-muted-foreground">→</span>
              </Button>
              
              <hr className="border-muted" />
              
              <Button 
                variant="ghost"
                className="w-full justify-between p-4 h-auto hover:bg-muted/50"
                onClick={() => setLocation("/notifications")}
              >
                <div className="flex items-center space-x-3">
                  <Bell className="h-5 w-5 text-primary" />
                  <span className="font-medium">Notificações</span>
                </div>
                <span className="text-muted-foreground">→</span>
              </Button>
            </CardContent>
          </Card>
          
          <Card className="border border-muted shadow-sm">
            <CardContent className="p-0">
              <Button 
                variant="ghost"
                className="w-full justify-between p-4 h-auto hover:bg-muted/50"
                onClick={() => setLocation("/help-support")}
              >
                <div className="flex items-center space-x-3">
                  <HelpCircle className="h-5 w-5 text-primary" />
                  <span className="font-medium">Ajuda e Suporte</span>
                </div>
                <span className="text-muted-foreground">→</span>
              </Button>
              
              <hr className="border-muted" />
              
              <Button 
                variant="ghost"
                className="w-full justify-between p-4 h-auto hover:bg-muted/50"
                onClick={() => setLocation("/terms-privacy")}
              >
                <div className="flex items-center space-x-3">
                  <FileText className="h-5 w-5 text-primary" />
                  <span className="font-medium">Termos e Privacidade</span>
                </div>
                <span className="text-muted-foreground">→</span>
              </Button>
              
              <hr className="border-muted" />
              
              <Button 
                variant="ghost"
                className="w-full justify-between p-4 h-auto hover:bg-muted/50 text-red-600 hover:text-red-600"
                onClick={handleLogout}
              >
                <div className="flex items-center space-x-3">
                  <LogOut className="h-5 w-5" />
                  <span className="font-medium">Sair da Conta</span>
                </div>
                <span className="text-muted-foreground">→</span>
              </Button>
            </CardContent>
          </Card>
        </div>
        
        {/* App Version */}
        <div className="text-center text-muted-foreground text-sm mt-8 space-y-1">
          <p>TRANSFÁCIL v1.0.0</p>
          <p>Desenvolvido com ❤️ para estudantes angolanos</p>
        </div>
      </div>
      
      <BottomNav currentPage="profile" />
    </div>
  );
}
