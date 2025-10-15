import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useLocation } from "wouter";
import BottomNav from "@/components/bottom-nav";
import { generateQRCode } from "@/lib/qr-generator";
import { ArrowLeft, RefreshCw, Edit, Crown } from "lucide-react";

export default function QRCode() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();

  const { data: student } = useQuery({
    queryKey: ["/api/student/profile"],
  });

  const qrCodeData = student?.qrCode || `TF${new Date().getFullYear()}-DEMO-001`;
  const qrCodeSVG = generateQRCode(qrCodeData);

  const refreshQR = () => {
    // In a real app, this would generate a new QR code
    window.location.reload();
  };

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <div className="bg-white px-6 py-4 border-b border-muted">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            size="sm"
            className="mr-4"
            onClick={() => setLocation("/profile")}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h2 className="font-bold text-lg">Meu Código QR</h2>
        </div>
      </div>
      
      {/* QR Code Section */}
      <div className="px-6 py-8 text-center space-y-6">
        <Card className="shadow-lg">
          <CardContent className="p-6">
            <p className="text-muted-foreground mb-4">Mostre este código ao motorista</p>
            
            {/* QR Code Display */}
            <div className="w-48 h-48 mx-auto mb-4 bg-white p-4 rounded-lg border">
              <div 
                className="w-full h-full qr-pattern rounded"
                dangerouslySetInnerHTML={{ __html: qrCodeSVG }}
              />
            </div>
            
            <p className="font-mono text-lg font-bold mb-2">{qrCodeData}</p>
            <p className="text-sm text-muted-foreground">Código válido até 23:59 hoje</p>
            
            <Button 
              variant="outline"
              className="mt-4"
              onClick={refreshQR}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Atualizar Código
            </Button>
          </CardContent>
        </Card>
        
        {/* Student Info */}
        <Card className="shadow-sm text-left">
          <CardContent className="p-6">
            <h3 className="font-bold mb-4">Dados do Estudante</h3>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center">
                  <span className="font-bold text-xl text-muted-foreground">
                    {student?.fullName?.charAt(0) || user?.firstName?.charAt(0) || "U"}
                  </span>
                </div>
                <div>
                  <p className="font-semibold text-lg">
                    {student?.fullName || `${user?.firstName} ${user?.lastName}` || "Nome do Estudante"}
                  </p>
                  <p className="text-muted-foreground">
                    Estudante #{student?.studentNumber || "2024001"}
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{student?.email || user?.email || "estudante@uan.edu.ao"}</p>
                </div>
                
                <div>
                  <p className="text-sm text-muted-foreground">Universidade</p>
                  <p className="font-medium">{student?.university || "Universidade Agostinho Neto"}</p>
                </div>
                
                <div>
                  <p className="text-sm text-muted-foreground">Curso</p>
                  <p className="font-medium">{student?.course || "Engenharia Informática"}</p>
                </div>
                
                <div>
                  <p className="text-sm text-muted-foreground">Status da Conta</p>
                  <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                    {student?.isVerified ? "Verificada" : "Ativa"}
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4">
          <Card 
            className="shadow-sm cursor-pointer hover:shadow-md transition-all"
            onClick={() => setLocation("/profile")}
          >
            <CardContent className="p-4 text-center">
              <Edit className="h-8 w-8 text-primary mx-auto mb-2" />
              <p className="text-sm font-medium">Editar Perfil</p>
            </CardContent>
          </Card>
          
          <Card 
            className="shadow-sm cursor-pointer hover:shadow-md transition-all"
            onClick={() => setLocation("/subscription")}
          >
            <CardContent className="p-4 text-center">
              <Crown className="h-8 w-8 text-primary mx-auto mb-2" />
              <p className="text-sm font-medium">Ver Planos</p>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <BottomNav currentPage="qr" />
    </div>
  );
}
