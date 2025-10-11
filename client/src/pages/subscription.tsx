import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import BottomNav from "@/components/bottom-nav";
import { ArrowLeft, Check, CreditCard, Smartphone, Building } from "lucide-react";

export default function Subscription() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const { data: subscription } = useQuery({
    queryKey: ["/api/subscription/active"],
  });

  const { data: plans } = useQuery({
    queryKey: ["/api/subscription/plans"],
  });

  const subscriptionMutation = useMutation({
    mutationFn: async (planData: any) => {
      await apiRequest("POST", "/api/subscription/create", planData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/subscription/active"] });
      toast({
        title: "Sucesso!",
        description: "Assinatura ativada com sucesso.",
      });
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Falha ao ativar assinatura. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  const handleSelectPlan = (planId: number) => {
    const startDate = new Date();
    const endDate = new Date();
    
    // Calculate end date based on plan type
    const plan = plans?.find((p: any) => p.id === planId);
    if (plan?.duration === "weekly") {
      endDate.setDate(startDate.getDate() + 7);
    } else if (plan?.duration === "monthly") {
      endDate.setDate(startDate.getDate() + 30);
    }

    subscriptionMutation.mutate({
      planId,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      tripsRemaining: plan?.duration === "weekly" ? 14 : null,
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-AO', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
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
            onClick={() => setLocation("/")}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h2 className="font-bold text-lg">Planos de Assinatura</h2>
        </div>
      </div>
      
      <div className="px-6 py-6 space-y-6">
        {/* Current Plan */}
        {subscription && (
          <Card className="gradient-bg border-0">
            <CardContent className="p-6 text-white">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-white/80 text-sm">Plano Atual</p>
                  <p className="font-bold text-xl">Mensal Premium</p>
                </div>
                <div className="text-right">
                  <p className="text-white/80 text-sm">Válido até</p>
                  <p className="font-bold">{formatDate(subscription.endDate)}</p>
                </div>
              </div>
              
              <div className="bg-white/20 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <span className="text-white/90">Viagens restantes</span>
                  <span className="font-bold text-xl">
                    {subscription.tripsRemaining || "Ilimitadas"}
                  </span>
                </div>
                {subscription.tripsRemaining && (
                  <div className="w-full bg-white/20 rounded-full h-2 mt-2">
                    <div 
                      className="bg-white rounded-full h-2" 
                      style={{ width: `${(subscription.tripsRemaining / 14) * 100}%` }}
                    ></div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}
        
        {/* Available Plans */}
        <div>
          <h3 className="font-bold text-lg mb-4">
            {subscription ? "Renovar ou Mudar Plano" : "Escolha seu Plano"}
          </h3>
          
          <div className="space-y-4">
            {/* Weekly Plan */}
            <Card className="border border-muted shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="font-bold text-lg">Plano Semanal</h4>
                    <p className="text-muted-foreground text-sm">Ideal para teste</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-2xl text-primary">1.200</p>
                    <p className="text-muted-foreground text-sm">AKZ/semana</p>
                  </div>
                </div>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm">
                    <Check className="h-4 w-4 text-green-500 mr-2" />
                    <span>Até 14 viagens por semana</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Check className="h-4 w-4 text-green-500 mr-2" />
                    <span>Rastreamento em tempo real</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Check className="h-4 w-4 text-green-500 mr-2" />
                    <span>Suporte via chat</span>
                  </div>
                </div>
                
                <Button 
                  variant="outline"
                  className="w-full border-primary text-primary hover:bg-primary hover:text-white"
                  onClick={() => handleSelectPlan(1)}
                  disabled={subscriptionMutation.isPending}
                >
                  Selecionar Plano
                </Button>
              </CardContent>
            </Card>
            
            {/* Monthly Plan */}
            <Card className="border-2 border-primary shadow-sm relative">
              <div className="absolute -top-3 left-6">
                <Badge className="bg-primary text-primary-foreground">
                  Recomendado
                </Badge>
              </div>
              
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="font-bold text-lg">Plano Mensal</h4>
                    <p className="text-muted-foreground text-sm">Melhor custo-benefício</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-2xl text-primary">4.200</p>
                    <p className="text-muted-foreground text-sm">AKZ/mês</p>
                    <p className="text-xs text-green-600">Economize 30%</p>
                  </div>
                </div>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm">
                    <Check className="h-4 w-4 text-green-500 mr-2" />
                    <span>Viagens ilimitadas</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Check className="h-4 w-4 text-green-500 mr-2" />
                    <span>Rastreamento em tempo real</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Check className="h-4 w-4 text-green-500 mr-2" />
                    <span>Acesso a Bloeia solidárias</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Check className="h-4 w-4 text-green-500 mr-2" />
                    <span>Suporte prioritário</span>
                  </div>
                </div>
                
                <Button 
                  className="w-full gradient-bg text-white hover:shadow-lg"
                  onClick={() => handleSelectPlan(2)}
                  disabled={subscriptionMutation.isPending}
                >
                  {subscription ? "Renovar Agora" : "Selecionar Plano"}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
        
        {/* Payment Methods */}
        <div>
          <h4 className="font-semibold mb-4">Métodos de Pagamento</h4>
          <div className="space-y-3">
            <Card className="border border-muted cursor-pointer hover:shadow-md transition-all">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <CreditCard className="h-5 w-5 text-primary" />
                    <span className="font-medium">Cartão de Crédito</span>
                  </div>
                  <span className="text-muted-foreground">→</span>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border border-muted cursor-pointer hover:shadow-md transition-all">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Smartphone className="h-5 w-5 text-primary" />
                    <span className="font-medium">Multicaixa Express</span>
                  </div>
                  <span className="text-muted-foreground">→</span>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border border-muted cursor-pointer hover:shadow-md transition-all">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Building className="h-5 w-5 text-primary" />
                    <span className="font-medium">Transferência Bancária</span>
                  </div>
                  <span className="text-muted-foreground">→</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      <BottomNav currentPage="subscription" />
    </div>
  );
}
