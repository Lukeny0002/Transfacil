import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { 
  ArrowLeft, 
  HelpCircle, 
  MessageCircle, 
  Phone, 
  Mail, 
  Clock, 
  MapPin,
  CreditCard,
  Shield,
  User,
  Bus,
  Smartphone
} from "lucide-react";

export default function HelpSupport() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const handleContactSupport = (method: string) => {
    toast({
      title: "Redirecionando...",
      description: `Abrindo ${method} para contato com nosso suporte.`,
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
            onClick={() => setLocation("/profile")}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h2 className="font-bold text-lg">Ajuda e Suporte</h2>
        </div>
      </div>

      <div className="px-6 py-6">
        <Tabs defaultValue="faq" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="faq">Perguntas Frequentes</TabsTrigger>
            <TabsTrigger value="contact">Contato</TabsTrigger>
          </TabsList>
          
          <TabsContent value="faq" className="space-y-4 mt-6">
            {/* Search Help */}
            <Card className="border border-muted shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-lg">
                  <HelpCircle className="h-5 w-5 text-primary" />
                  <span>Perguntas Frequentes</span>
                </CardTitle>
              </CardHeader>
            </Card>

            {/* Account & Registration */}
            <Card className="border border-muted shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-base">
                  <User className="h-4 w-4 text-primary" />
                  <span>Conta e Cadastro</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Como me cadastrar no TRANSFÁCIL?</h4>
                  <p className="text-sm text-muted-foreground">
                    Para se cadastrar, você precisa ter um email estudantil válido e 
                    documento que comprove sua matrícula em uma universidade angolana. 
                    Clique em "Criar Nova Conta" na tela inicial e preencha todos os dados solicitados.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">Posso usar email pessoal para me cadastrar?</h4>
                  <p className="text-sm text-muted-foreground">
                    Preferencialmente, use seu email estudantil oficial. Emails pessoais 
                    podem ser aceitos mediante verificação adicional de documentos estudantis.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Esqueci minha senha, o que fazer?</h4>
                  <p className="text-sm text-muted-foreground">
                    Na tela de login, clique em "Esqueci minha senha" e siga as instruções 
                    enviadas para seu email cadastrado.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Transportation */}
            <Card className="border border-muted shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-base">
                  <Bus className="h-4 w-4 text-primary" />
                  <span>Transporte e Viagens</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Como funciona o sistema de reservas?</h4>
                  <p className="text-sm text-muted-foreground">
                    Após ativar sua assinatura, você pode reservar viagens diretamente no app. 
                    As reservas devem ser feitas com pelo menos 30 minutos de antecedência.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">Posso cancelar uma viagem reservada?</h4>
                  <p className="text-sm text-muted-foreground">
                    Sim, cancelamentos podem ser feitos até 30 minutos antes da partida. 
                    Cancelamentos frequentes podem resultar em penalidades.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">O que acontece se o ônibus atrasar?</h4>
                  <p className="text-sm text-muted-foreground">
                    Você receberá notificações em tempo real sobre atrasos. Em caso de 
                    atrasos superiores a 15 minutos, você pode solicitar reembolso ou 
                    transferência para próxima viagem.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Como funciona o rastreamento em tempo real?</h4>
                  <p className="text-sm text-muted-foreground">
                    Todos os veículos possuem GPS. Você pode acompanhar a localização 
                    exata do ônibus na aba "Mapa" do aplicativo.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Payments */}
            <Card className="border border-muted shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-base">
                  <CreditCard className="h-4 w-4 text-primary" />
                  <span>Pagamentos e Assinaturas</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Quais formas de pagamento são aceitas?</h4>
                  <p className="text-sm text-muted-foreground">
                    Aceitamos Multicaixa Express, cartões de crédito/débito e 
                    transferência bancária. Pagamentos são processados de forma segura.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">Qual a diferença entre plano semanal e mensal?</h4>
                  <p className="text-sm text-muted-foreground">
                    O plano semanal oferece até 14 viagens por semana por 1.200 AKZ. 
                    O plano mensal oferece viagens ilimitadas por 4.200 AKZ e acesso a caronas.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Posso solicitar reembolso?</h4>
                  <p className="text-sm text-muted-foreground">
                    Reembolsos são concedidos em casos de cancelamento de serviço pela empresa, 
                    problemas técnicos graves ou outras situações específicas conforme nossos termos.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Carpooling */}
            <Card className="border border-muted shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-base">
                  <MessageCircle className="h-4 w-4 text-primary" />
                  <span>Caronas Solidárias</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Como solicitar uma carona?</h4>
                  <p className="text-sm text-muted-foreground">
                    Na aba "Caronas", você pode ver caronas disponíveis e solicitar 
                    participação. O motorista decidirá se aceita sua solicitação.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">Como oferecer carona?</h4>
                  <p className="text-sm text-muted-foreground">
                    Apenas assinantes do plano mensal podem oferecer caronas. 
                    Clique em "Oferecer Carona" e preencha destino, horário e vagas disponíveis.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">É seguro pegar carona com outros estudantes?</h4>
                  <p className="text-sm text-muted-foreground">
                    Todos os usuários são verificados e possuem avaliações. 
                    Recomendamos verificar perfil e avaliações antes de aceitar caronas.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Technical */}
            <Card className="border border-muted shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-base">
                  <Smartphone className="h-4 w-4 text-primary" />
                  <span>Problemas Técnicos</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">O app não está funcionando, o que fazer?</h4>
                  <p className="text-sm text-muted-foreground">
                    Primeiro, verifique sua conexão com internet. Tente fechar e abrir 
                    o app novamente. Se o problema persistir, entre em contato conosco.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">Não consigo fazer login</h4>
                  <p className="text-sm text-muted-foreground">
                    Verifique se está usando o email correto e se sua conta foi verificada. 
                    Se esqueceu a senha, use a opção "Esqueci minha senha".
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">O código QR não está funcionando</h4>
                  <p className="text-sm text-muted-foreground">
                    Certifique-se de que sua assinatura está ativa e o código não expirou. 
                    Códigos QR são atualizados diariamente por segurança.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="contact" className="space-y-4 mt-6">
            {/* Support Hours */}
            <Card className="border border-muted shadow-sm bg-primary/5">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <Clock className="h-5 w-5 text-primary" />
                  <div>
                    <h4 className="font-semibold">Horário de Atendimento</h4>
                    <p className="text-sm text-muted-foreground">
                      Segunda a Sexta: 7h00 - 19h00<br />
                      Sábado: 8h00 - 14h00<br />
                      Domingo: Emergências apenas
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact Methods */}
            <div className="grid grid-cols-1 gap-4">
              <Card className="border border-muted shadow-sm">
                <CardContent className="p-4">
                  <Button 
                    variant="ghost"
                    className="w-full justify-start h-auto p-0"
                    onClick={() => handleContactSupport("WhatsApp")}
                  >
                    <div className="flex items-center space-x-4 w-full">
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                        <MessageCircle className="h-6 w-6 text-green-600" />
                      </div>
                      <div className="flex-1 text-left">
                        <h4 className="font-semibold">WhatsApp</h4>
                        <p className="text-sm text-muted-foreground">+244 923 456 789</p>
                        <Badge className="bg-green-100 text-green-700 hover:bg-green-100 mt-1">
                          Resposta em até 30min
                        </Badge>
                      </div>
                    </div>
                  </Button>
                </CardContent>
              </Card>

              <Card className="border border-muted shadow-sm">
                <CardContent className="p-4">
                  <Button 
                    variant="ghost"
                    className="w-full justify-start h-auto p-0"
                    onClick={() => handleContactSupport("telefone")}
                  >
                    <div className="flex items-center space-x-4 w-full">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <Phone className="h-6 w-6 text-blue-600" />
                      </div>
                      <div className="flex-1 text-left">
                        <h4 className="font-semibold">Telefone</h4>
                        <p className="text-sm text-muted-foreground">+244 222 123 456</p>
                        <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 mt-1">
                          Atendimento imediato
                        </Badge>
                      </div>
                    </div>
                  </Button>
                </CardContent>
              </Card>

              <Card className="border border-muted shadow-sm">
                <CardContent className="p-4">
                  <Button 
                    variant="ghost"
                    className="w-full justify-start h-auto p-0"
                    onClick={() => handleContactSupport("email")}
                  >
                    <div className="flex items-center space-x-4 w-full">
                      <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                        <Mail className="h-6 w-6 text-orange-600" />
                      </div>
                      <div className="flex-1 text-left">
                        <h4 className="font-semibold">Email</h4>
                        <p className="text-sm text-muted-foreground">suporte@transfacil.ao</p>
                        <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100 mt-1">
                          Resposta em 24h
                        </Badge>
                      </div>
                    </div>
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Emergency Contact */}
            <Card className="border-2 border-red-200 shadow-sm bg-red-50">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-red-700">
                  <Shield className="h-5 w-5" />
                  <span>Emergência</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-red-700 mb-3">
                  Em caso de emergência durante uma viagem (acidente, problema de segurança, etc.):
                </p>
                <Button 
                  className="w-full bg-red-600 hover:bg-red-700 text-white"
                  onClick={() => handleContactSupport("emergência")}
                >
                  <Phone className="h-4 w-4 mr-2" />
                  Ligar para Emergência: +244 924 000 911
                </Button>
              </CardContent>
            </Card>

            {/* Office Address */}
            <Card className="border border-muted shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MapPin className="h-5 w-5 text-primary" />
                  <span>Nosso Escritório</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  TRANSFÁCIL - Soluções de Transporte Estudantil<br />
                  Rua da Missão, 123, Maianga<br />
                  Luanda, Angola<br />
                  CEP: 1000-001
                </p>
                <Button 
                  variant="outline"
                  className="mt-3 w-full"
                  onClick={() => handleContactSupport("localização")}
                >
                  <MapPin className="h-4 w-4 mr-2" />
                  Ver no Mapa
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}