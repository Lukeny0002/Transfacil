import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, HelpCircle, MessageSquare, Phone, Mail, Clock, ChevronDown, ChevronRight } from "lucide-react";

export default function HelpSupport() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });

  const faqItems = [
    {
      question: "Como funciona o sistema de assinaturas?",
      answer: "Oferecemos planos semanais (1000-1500 AKZ) e mensais (3500-4500 AKZ) que dão acesso ao transporte exclusivo para universidades. Após a assinatura, você recebe um QR code para embarque nos autocarros."
    },
    {
      question: "Como solicitar uma Bloeia?",
      answer: "Na seção 'Bloeia', você pode ver todas as viagens disponíveis. Clique em 'Solicitar' na Bloeia desejada e aguarde a confirmação do motorista. Você pode conversar diretamente com o motorista através do chat."
    },
    {
      question: "Posso cancelar minha assinatura?",
      answer: "Sim, você pode cancelar a qualquer momento nas configurações do seu perfil. O acesso continuará até o final do período já pago."
    },
    {
      question: "Como oferecer uma Bloeia?",
      answer: "Clique no botão 'Oferecer Bloeia' no painel do motorista, preencha os detalhes da viagem (origem, destino, horário, preço) e publique. Outros estudantes poderão solicitar sua Bloeia."
    },
    {
      question: "É seguro usar o TRANSFÁCIL?",
      answer: "Sim! Verificamos todos os motoristas e mantemos um sistema de avaliações. Recomendamos sempre verificar as avaliações antes de aceitar ou solicitar Bloeia."
    },
    {
      question: "Quais universidades são atendidas?",
      answer: "Atendemos todas as principais universidades de Luanda: UAN, UCAN, ISPTEC, UOR, UMA, UPRA, ISCED, UMN, ISCISA, ULA e UTANGA."
    },
    {
      question: "Como funciona o pagamento das Boleia?",
      answer: "Os valores são combinados diretamente entre motorista e passageiro. Incentivamos Boleia solidárias (gratuitas) entre estudantes quando possível."
    },
    {
      question: "Preciso ter carro para usar o app?",
      answer: "Não! Você pode usar tanto para pedir Boleia quanto para usar nosso transporte exclusivo por assinatura. Ter carro é opcionall para oferecer Bloeia."
    }
  ];

  const toggleFaq = (index: number) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  const updateContactForm = (field: string, value: string) => {
    setContactForm(prev => ({ ...prev, [field]: value }));
  };

  const submitContactForm = () => {
    if (!contactForm.name || !contactForm.email || !contactForm.message) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha nome, email e mensagem para enviar.",
        variant: "destructive",
      });
      return;
    }

    // Simulate form submission
    toast({
      title: "Mensagem enviada!",
      description: "Entraremos em contato em até 24 horas.",
    });
    
    setContactForm({ name: "", email: "", subject: "", message: "" });
  };

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
          <h2 className="font-bold text-lg">Ajuda e Suporte</h2>
          <div className="w-16"></div>
        </div>
      </div>

      <div className="px-6 py-6 space-y-6">
        {/* Quick Contact Options */}
        <Card className="border border-muted shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Phone className="h-5 w-5 text-primary" />
              <span>Contato Rápido</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-primary" />
                <div>
                  <p className="font-medium">WhatsApp</p>
                  <p className="text-sm text-muted-foreground">+244 923 456 789</p>
                </div>
              </div>
              <Button size="sm" variant="outline">Chamar</Button>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-primary" />
                <div>
                  <p className="font-medium">Email</p>
                  <p className="text-sm text-muted-foreground">suporte@transfacil.ao</p>
                </div>
              </div>
              <Button size="sm" variant="outline">Enviar</Button>
            </div>

            <div className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
              <div className="flex items-center space-x-3">
                <Clock className="h-4 w-4 text-primary" />
                <div>
                  <p className="font-medium">Horário de Atendimento</p>
                  <p className="text-sm text-muted-foreground">Seg-Sex: 7h-19h | Sáb: 8h-15h</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* FAQ Section */}
        <Card className="border border-muted shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <HelpCircle className="h-5 w-5 text-primary" />
              <span>Perguntas Frequentes</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {faqItems.map((item, index) => (
              <div key={index} className="border border-muted rounded-lg">
                <Button
                  variant="ghost"
                  className="w-full justify-between p-4 h-auto text-left"
                  onClick={() => toggleFaq(index)}
                >
                  <span className="font-medium">{item.question}</span>
                  {expandedFaq === index ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </Button>
                {expandedFaq === index && (
                  <div className="px-4 pb-4">
                    <p className="text-sm text-muted-foreground">{item.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Contact Form */}
        <Card className="border border-muted shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <MessageSquare className="h-5 w-5 text-primary" />
              <span>Enviar Mensagem</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Nome *</Label>
                <Input
                  id="name"
                  value={contactForm.name}
                  onChange={(e) => updateContactForm("name", e.target.value)}
                  placeholder="Seu nome completo"
                  className="rounded-xl"
                />
              </div>
              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={contactForm.email}
                  onChange={(e) => updateContactForm("email", e.target.value)}
                  placeholder="seu@email.com"
                  className="rounded-xl"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="subject">Assunto</Label>
              <Input
                id="subject"
                value={contactForm.subject}
                onChange={(e) => updateContactForm("subject", e.target.value)}
                placeholder="Resumo da sua dúvida"
                className="rounded-xl"
              />
            </div>

            <div>
              <Label htmlFor="message">Mensagem *</Label>
              <Textarea
                id="message"
                value={contactForm.message}
                onChange={(e) => updateContactForm("message", e.target.value)}
                placeholder="Descreva sua dúvida ou problema em detalhes..."
                className="rounded-xl resize-none"
                rows={4}
              />
            </div>

            <Button 
              className="w-full gradient-bg text-white"
              onClick={submitContactForm}
            >
              Enviar Mensagem
            </Button>
          </CardContent>
        </Card>

        {/* Emergency Contact */}
        <Card className="border border-red-200 shadow-sm bg-red-50">
          <CardContent className="p-4">
            <h4 className="font-semibold text-red-800 mb-2">Emergência Durante Viagem</h4>
            <p className="text-sm text-red-700 mb-3">
              Se você estiver em uma situação de emergência durante uma viagem, 
              ligue imediatamente para:
            </p>
            <div className="space-y-2">
              <Button variant="destructive" className="w-full">
                <Phone className="h-4 w-4 mr-2" />
                Emergência: 113
              </Button>
              <Button variant="outline" className="w-full border-red-300 text-red-700">
                <Phone className="h-4 w-4 mr-2" />
                Suporte 24h: +244 923 456 789
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Tips Section */}
        <Card className="border border-muted shadow-sm bg-muted/20">
          <CardContent className="p-4">
            <h4 className="font-semibold text-foreground mb-2">Dicas para uma Experiência Segura</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Sempre verifique as avaliações do motorista</li>
              <li>• Compartilhe detalhes da viagem com um amigo</li>
              <li>• Confirme local e horário pelo chat antes da viagem</li>
              <li>• Mantenha o app atualizado para novas funcionalidades</li>
              <li>• Avalie sua experiência após cada viagem</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}