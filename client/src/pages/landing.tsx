import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  MapPin, 
  Clock, 
  Users, 
  Star, 
  Shield, 
  Smartphone,
  Car,
  Bus,
  GraduationCap,
  CheckCircle,
  Phone,
  Mail,
  ArrowRight,
  Play,
  Download,
  Zap,
  Heart,
  Globe
} from "lucide-react";
import logoImage from "@assets/photo_2025-06-11_09-10-45_1749629528989.jpg";

export default function Landing() {
  const [email, setEmail] = useState("");

  const handleGetStarted = () => {
    window.location.href = "/api/login";
  };

  const handleNewsletterSignup = () => {
    if (email) {
      // Simulate newsletter signup
      setEmail("");
      alert("Obrigado! Entraremos em contato em breve.");
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="border-b border-gray-100 sticky top-0 bg-white/95 backdrop-blur z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <img 
                src={logoImage} 
                alt="TransFácil Logo" 
                className="w-10 h-10 object-contain rounded-lg"
              />
              <span className="text-xl font-bold text-gray-900">TRANSFÁCIL</span>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <a href="#como-funciona" className="text-gray-600 hover:text-gray-900">Como Funciona</a>
              <a href="#servicos" className="text-gray-600 hover:text-gray-900">Serviços</a>
              <a href="#universidades" className="text-gray-600 hover:text-gray-900">Universidades</a>
              <a href="#contato" className="text-gray-600 hover:text-gray-900">Contato</a>
              <Button 
                className="gradient-bg text-white"
                onClick={handleGetStarted}
              >
                Começar Agora
              </Button>
            </div>
            
            <Button 
              className="md:hidden gradient-bg text-white"
              onClick={handleGetStarted}
            >
              Entrar
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
                Novo em Luanda
              </Badge>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
                Transporte Universitário
                <span className="text-primary block">Fácil e Seguro</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Conectamos estudantes universitários em Angola através de transporte exclusivo 
                por assinatura e sistema organizado de caronas.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg" 
                  className="gradient-bg text-white text-lg px-8 py-4"
                  onClick={handleGetStarted}
                >
                  <GraduationCap className="mr-2 h-5 w-5" />
                  Começar Como Estudante
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="text-lg px-8 py-4 border-2"
                >
                  <Car className="mr-2 h-5 w-5" />
                  Sou Motorista
                </Button>
              </div>
              
              <div className="mt-8 flex items-center space-x-6 text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Gratuito para estudantes</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Totalmente seguro</span>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="relative z-10 bg-white rounded-2xl shadow-2xl p-8">
                <div className="space-y-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <MapPin className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold">11+ Universidades</h3>
                      <p className="text-gray-600">Todas as principais universidades de Luanda</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                      <Users className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Sistema de Caronas</h3>
                      <p className="text-gray-600">Conecte-se com outros estudantes</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <Bus className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Transporte Exclusivo</h3>
                      <p className="text-gray-600">Ônibus dedicados para universidades</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-purple-400/20 rounded-2xl transform rotate-3"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Como Funciona */}
      <section id="como-funciona" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Como Funciona o TRANSFÁCIL
            </h2>
            <p className="text-xl text-gray-600">
              Três passos simples para começar sua jornada
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-white">1</span>
              </div>
              <h3 className="text-xl font-bold mb-4">Cadastre-se</h3>
              <p className="text-gray-600">
                Crie sua conta usando seu email estudantil e selecione sua universidade
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-white">2</span>
              </div>
              <h3 className="text-xl font-bold mb-4">Escolha seu Plano</h3>
              <p className="text-gray-600">
                Assinatura semanal ou mensal para transporte exclusivo, ou use caronas gratuitas
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-white">3</span>
              </div>
              <h3 className="text-xl font-bold mb-4">Viaje com Segurança</h3>
              <p className="text-gray-600">
                Use seu QR code para embarcar ou conecte-se com outros estudantes
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Serviços */}
      <section id="servicos" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Nossos Serviços
            </h2>
            <p className="text-xl text-gray-600">
              Soluções completas de transporte para estudantes universitários
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <Bus className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle className="text-2xl">Transporte Exclusivo</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-6">
                  Ônibus dedicados para universidades com rotas otimizadas e horários fixos.
                  Sistema de assinatura mensal ou semanal.
                </p>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Horários garantidos</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">QR code para embarque</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Rastreamento em tempo real</span>
                  </div>
                </div>
                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">Plano Semanal</p>
                      <p className="text-2xl font-bold text-blue-600">1.200 AKZ</p>
                    </div>
                    <div>
                      <p className="font-medium">Plano Mensal</p>
                      <p className="text-2xl font-bold text-blue-600">4.000 AKZ</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-green-600" />
                </div>
                <CardTitle className="text-2xl">Sistema de Caronas</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-6">
                  Conecte-se com outros estudantes para compartilhar viagens de forma segura 
                  e econômica através do nosso sistema de caronas organizado.
                </p>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Perfis verificados</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Chat integrado</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Sistema de avaliações</span>
                  </div>
                </div>
                <div className="mt-6 p-4 bg-green-50 rounded-lg">
                  <div className="text-center">
                    <p className="font-medium">Caronas Solidárias</p>
                    <p className="text-2xl font-bold text-green-600">GRATUITO</p>
                    <p className="text-sm text-gray-600">Entre estudantes</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Universidades */}
      <section id="universidades" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Universidades Atendidas
            </h2>
            <p className="text-xl text-gray-600">
              Todas as principais instituições de ensino superior de Luanda
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[
              "Universidade Agostinho Neto (UAN)",
              "Universidade Católica de Angola (UCAN)",
              "ISPTEC",
              "Universidade Oscar Ribas (UOR)",
              "Universidade Metodista de Angola (UMA)",
              "Universidade Privada de Angola (UPRA)",
              "Instituto Superior de Ciências da Educação (ISCED)",
              "Universidade Mandume ya Ndemufayo (UMN)",
              "Instituto Superior de Ciências da Saúde (ISCISA)",
              "Universidade Lusíada de Angola (ULA)",
              "UTANGA",
              "E muitas outras..."
            ].map((university, index) => (
              <Card key={index} className="border border-gray-200 hover:shadow-md transition-shadow">
                <CardContent className="p-4 text-center">
                  <GraduationCap className="h-8 w-8 text-primary mx-auto mb-2" />
                  <p className="text-sm font-medium text-gray-900">{university}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Características */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Por que Escolher o TRANSFÁCIL?
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Shield className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold mb-4">100% Seguro</h3>
              <p className="text-gray-600">
                Motoristas verificados, veículos inspecionados e sistema de emergência 24h
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Zap className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold mb-4">Rápido e Confiável</h3>
              <p className="text-gray-600">
                Horários otimizados, rotas inteligentes e sempre no horário combinado
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Heart className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold mb-4">Feito para Estudantes</h3>
              <p className="text-gray-600">
                Preços acessíveis, horários compatíveis com aulas e comunidade estudantil
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Smartphone className="h-8 w-8 text-yellow-600" />
              </div>
              <h3 className="text-xl font-bold mb-4">App Intuitivo</h3>
              <p className="text-gray-600">
                Interface simples, chat integrado e todas as funcionalidades na palma da mão
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Star className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="text-xl font-bold mb-4">Melhor Avaliado</h3>
              <p className="text-gray-600">
                Sistema de avaliações transparente e comunidade ativa de estudantes
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Globe className="h-8 w-8 text-indigo-600" />
              </div>
              <h3 className="text-xl font-bold mb-4">100% Angolano</h3>
              <p className="text-gray-600">
                Criado em Angola, para angolanos, com foco nas necessidades locais
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-primary to-purple-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Pronto para Revolucionar seu Transporte Universitário?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Junte-se a milhares de estudantes que já descobriram uma forma melhor de se locomover em Luanda
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-white text-primary hover:bg-gray-100 text-lg px-8 py-4"
              onClick={handleGetStarted}
            >
              <GraduationCap className="mr-2 h-5 w-5" />
              Começar Agora - É Gratuito
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-white text-white hover:bg-white hover:text-primary text-lg px-8 py-4"
            >
              <Download className="mr-2 h-5 w-5" />
              Baixar App
            </Button>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-900">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-2xl font-bold text-white mb-4">
            Fique por Dentro das Novidades
          </h3>
          <p className="text-gray-400 mb-6">
            Receba atualizações sobre novas rotas, promoções e funcionalidades
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <Input
              type="email"
              placeholder="Seu email universitário"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="rounded-full"
            />
            <Button 
              onClick={handleNewsletterSignup}
              className="gradient-bg text-white rounded-full"
            >
              Inscrever-se
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contato" className="bg-gray-900 text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-3 mb-6">
                <img 
                  src={logoImage} 
                  alt="TransFácil Logo" 
                  className="w-10 h-10 object-contain rounded-lg"
                />
                <span className="text-2xl font-bold">TRANSFÁCIL</span>
              </div>
              <p className="text-gray-400 mb-6 max-w-md">
                A primeira plataforma de transporte universitário de Angola. 
                Conectando estudantes através de transporte seguro, rápido e acessível.
              </p>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4 text-primary" />
                  <span>+244 923 456 789</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4 text-primary" />
                  <span>contato@transfacil.ao</span>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-bold mb-4">Serviços</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Transporte Exclusivo</li>
                <li>Sistema de Caronas</li>
                <li>Assinaturas</li>
                <li>Rastreamento</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold mb-4">Suporte</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Centro de Ajuda</li>
                <li>Contato</li>
                <li>Termos de Uso</li>
                <li>Privacidade</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2025 TRANSFÁCIL. Todos os direitos reservados. Feito com ❤️ em Angola.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}