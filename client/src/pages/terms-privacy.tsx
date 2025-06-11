import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLocation } from "wouter";
import { ArrowLeft, Shield, FileText, Eye, Lock } from "lucide-react";

export default function TermsPrivacy() {
  const [, setLocation] = useLocation();

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
          <h2 className="font-bold text-lg">Termos e Privacidade</h2>
        </div>
      </div>

      <div className="px-6 py-6">
        <Tabs defaultValue="terms" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="terms">Termos de Uso</TabsTrigger>
            <TabsTrigger value="privacy">Privacidade</TabsTrigger>
          </TabsList>
          
          <TabsContent value="terms" className="space-y-4 mt-6">
            <Card className="border border-muted shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="h-5 w-5 text-primary" />
                  <span>Termos de Uso do TRANSFÁCIL</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <div>
                  <h4 className="font-semibold mb-2">1. Aceitação dos Termos</h4>
                  <p className="text-muted-foreground">
                    Ao utilizar o TRANSFÁCIL, você concorda com estes termos de uso. 
                    Se não concordar, não utilize nossos serviços.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">2. Descrição do Serviço</h4>
                  <p className="text-muted-foreground">
                    O TRANSFÁCIL é uma plataforma de transporte estudantil que conecta 
                    estudantes universitários a serviços de transporte seguro e organizado 
                    em Angola.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">3. Elegibilidade</h4>
                  <p className="text-muted-foreground">
                    Para utilizar nossos serviços, você deve:
                  </p>
                  <ul className="list-disc list-inside text-muted-foreground mt-2 space-y-1">
                    <li>Ser estudante universitário em Angola</li>
                    <li>Ter pelo menos 18 anos de idade</li>
                    <li>Fornecer informações verdadeiras e atualizadas</li>
                    <li>Possuir documento de identificação estudantil válido</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">4. Responsabilidades do Usuário</h4>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1">
                    <li>Manter suas credenciais de acesso seguras</li>
                    <li>Respeitar horários de embarque e desembarque</li>
                    <li>Tratar motoristas e outros passageiros com respeito</li>
                    <li>Reportar problemas ou irregularidades</li>
                    <li>Pagar as taxas de assinatura pontualmente</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">5. Pagamentos e Assinaturas</h4>
                  <p className="text-muted-foreground">
                    As assinaturas são cobradas antecipadamente. Reembolsos só são 
                    concedidos em casos específicos previstos em nossa política de 
                    reembolso. Preços podem ser alterados mediante aviso prévio.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">6. Cancelamentos</h4>
                  <p className="text-muted-foreground">
                    Cancelamentos de viagem devem ser feitos com pelo menos 30 minutos 
                    de antecedência. Cancelamentos frequentes podem resultar em 
                    suspensão da conta.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">7. Limitação de Responsabilidade</h4>
                  <p className="text-muted-foreground">
                    O TRANSFÁCIL não se responsabiliza por danos diretos ou indiretos 
                    resultantes do uso da plataforma, exceto quando exigido por lei.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">8. Alterações dos Termos</h4>
                  <p className="text-muted-foreground">
                    Reservamo-nos o direito de alterar estes termos a qualquer momento. 
                    Usuários serão notificados sobre mudanças significativas.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="privacy" className="space-y-4 mt-6">
            <Card className="border border-muted shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="h-5 w-5 text-primary" />
                  <span>Política de Privacidade</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <div>
                  <h4 className="font-semibold mb-2 flex items-center">
                    <Eye className="h-4 w-4 mr-2 text-primary" />
                    Informações que Coletamos
                  </h4>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1">
                    <li>Nome completo e informações de contato</li>
                    <li>Número de estudante e instituição de ensino</li>
                    <li>Dados de localização durante o uso do serviço</li>
                    <li>Histórico de viagens e preferências</li>
                    <li>Informações de pagamento (processadas por terceiros)</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold mb-2 flex items-center">
                    <Lock className="h-4 w-4 mr-2 text-primary" />
                    Como Usamos suas Informações
                  </h4>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1">
                    <li>Fornecer e melhorar nossos serviços de transporte</li>
                    <li>Processar pagamentos e assinaturas</li>
                    <li>Comunicar sobre atualizações e alterações de serviço</li>
                    <li>Garantir segurança e prevenir fraudes</li>
                    <li>Personalizar sua experiência na plataforma</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Compartilhamento de Dados</h4>
                  <p className="text-muted-foreground">
                    Não vendemos suas informações pessoais. Compartilhamos dados apenas:
                  </p>
                  <ul className="list-disc list-inside text-muted-foreground mt-2 space-y-1">
                    <li>Com motoristas para coordenação de viagens</li>
                    <li>Com processadores de pagamento licenciados</li>
                    <li>Quando exigido por lei ou autoridades competentes</li>
                    <li>Com seu consentimento explícito</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Segurança dos Dados</h4>
                  <p className="text-muted-foreground">
                    Utilizamos criptografia SSL/TLS para proteger dados em trânsito 
                    e implementamos medidas de segurança físicas e digitais para 
                    proteger informações armazenadas.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Seus Direitos</h4>
                  <p className="text-muted-foreground">Você tem direito a:</p>
                  <ul className="list-disc list-inside text-muted-foreground mt-2 space-y-1">
                    <li>Acessar suas informações pessoais</li>
                    <li>Corrigir dados incorretos ou desatualizados</li>
                    <li>Solicitar exclusão de sua conta</li>
                    <li>Retirar consentimento para processamento de dados</li>
                    <li>Receber uma cópia de seus dados</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Retenção de Dados</h4>
                  <p className="text-muted-foreground">
                    Mantemos seus dados pelo tempo necessário para fornecer nossos 
                    serviços ou conforme exigido por lei. Dados de localização são 
                    excluídos após 90 dias.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Contato</h4>
                  <p className="text-muted-foreground">
                    Para questões sobre privacidade, entre em contato:
                  </p>
                  <p className="text-muted-foreground mt-2">
                    Email: privacidade@transfacil.ao<br />
                    Telefone: +244 923 456 789
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="mt-6 text-center text-xs text-muted-foreground">
          <p>Última atualização: 11 de Junho de 2025</p>
          <p className="mt-2">© 2025 TRANSFÁCIL. Todos os direitos reservados.</p>
        </div>
      </div>
    </div>
  );
}