import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLocation } from "wouter";
import { ArrowLeft, Shield, FileText, Users, Eye, Lock } from "lucide-react";

export default function TermsPrivacy() {
  const [, setLocation] = useLocation();

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
          <h2 className="font-bold text-lg">Termos e Privacidade</h2>
          <div className="w-16"></div>
        </div>
      </div>

      <div className="px-6 py-6 space-y-6">
        {/* Terms of Service */}
        <Card className="border border-muted shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="h-5 w-5 text-primary" />
              <span>Termos de Serviço</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-muted-foreground">
            <div>
              <h4 className="font-semibold text-foreground mb-2">1. Aceitação dos Termos</h4>
              <p>
                Ao utilizar o TRANSFÁCIL, você concorda com estes termos de serviço. 
                Se não concordar, não utilize nossos serviços.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-foreground mb-2">2. Descrição do Serviço</h4>
              <p>
                O TRANSFÁCIL é uma plataforma que conecta estudantes universitários em Angola 
                para compartilhamento de transporte e serviços de transporte exclusivo.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-foreground mb-2">3. Responsabilidades do Usuário</h4>
              <ul className="list-disc list-inside space-y-1">
                <li>Fornecer informações verdadeiras e atualizadas</li>
                <li>Respeitar outros usuários da plataforma</li>
                <li>Cumprir horários e acordos estabelecidos</li>
                <li>Manter comportamento seguro durante as viagens</li>
                <li>Não utilizar a plataforma para atividades ilegais</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-foreground mb-2">4. Pagamentos e Reembolsos</h4>
              <p>
                Os pagamentos são processados através de métodos seguros. Reembolsos são 
                analisados caso a caso, seguindo nossa política de cancelamento.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-foreground mb-2">5. Limitação de Responsabilidade</h4>
              <p>
                O TRANSFÁCIL atua como intermediário. Não somos responsáveis por incidentes 
                que ocorram durante as viagens. Incentivamos o uso responsável da plataforma.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Privacy Policy */}
        <Card className="border border-muted shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-primary" />
              <span>Política de Privacidade</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-muted-foreground">
            <div>
              <h4 className="font-semibold text-foreground mb-2 flex items-center">
                <Eye className="h-4 w-4 mr-2" />
                Informações que Coletamos
              </h4>
              <ul className="list-disc list-inside space-y-1">
                <li>Informações de perfil (nome, email, universidade)</li>
                <li>Dados de localização para rotas de transporte</li>
                <li>Informações de pagamento (processadas com segurança)</li>
                <li>Histórico de viagens e avaliações</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-foreground mb-2 flex items-center">
                <Users className="h-4 w-4 mr-2" />
                Como Usamos suas Informações
              </h4>
              <ul className="list-disc list-inside space-y-1">
                <li>Conectar você com outros estudantes</li>
                <li>Processar pagamentos e assinaturas</li>
                <li>Melhorar nossos serviços</li>
                <li>Enviar notificações importantes</li>
                <li>Garantir a segurança da plataforma</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-foreground mb-2 flex items-center">
                <Lock className="h-4 w-4 mr-2" />
                Proteção de Dados
              </h4>
              <p>
                Utilizamos criptografia e medidas de segurança avançadas para proteger 
                suas informações pessoais. Seus dados nunca são vendidos a terceiros.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-foreground mb-2">Compartilhamento de Informações</h4>
              <p>
                Compartilhamos apenas informações necessárias entre usuários para 
                facilitar as viagens (nome, foto de perfil, avaliações).
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-foreground mb-2">Seus Direitos</h4>
              <ul className="list-disc list-inside space-y-1">
                <li>Acessar suas informações pessoais</li>
                <li>Corrigir dados incorretos</li>
                <li>Solicitar exclusão de conta</li>
                <li>Controlar notificações</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card className="border border-muted shadow-sm bg-muted/20">
          <CardContent className="p-4">
            <h4 className="font-semibold text-foreground mb-2">Contato</h4>
            <p className="text-sm text-muted-foreground">
              Para dúvidas sobre estes termos ou nossa política de privacidade, 
              entre em contato conosco através da seção "Ajuda e Suporte" ou pelo email:
            </p>
            <p className="text-sm font-medium text-primary mt-2">legal@transfacil.ao</p>
          </CardContent>
        </Card>

        {/* Last Updated */}
        <div className="text-center">
          <p className="text-xs text-muted-foreground">
            Última atualização: 11 de Junho de 2025
          </p>
        </div>
      </div>
    </div>
  );
}