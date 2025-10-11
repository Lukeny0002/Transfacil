import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { 
  CreditCard, 
  ArrowLeft, 
  DollarSign, 
  Calendar, 
  CheckCircle,
  XCircle,
  Clock,
  Download,
  Receipt,
  Smartphone,
  Building2,
  Wallet,
  History,
  Plus,
  Star,
  AlertCircle,
  Lock,
  Banknote
} from "lucide-react";

interface PaymentMethod {
  id: string;
  type: 'multicaixa' | 'card' | 'mobile' | 'bank';
  name: string;
  details: string;
  isDefault: boolean;
  status: 'active' | 'expired' | 'blocked';
}

interface Transaction {
  id: string;
  amount: number;
  type: 'subscription' | 'ride' | 'refund' | 'fee';
  status: 'completed' | 'pending' | 'failed' | 'cancelled';
  description: string;
  date: string;
  paymentMethod: string;
  reference?: string;
}

export default function PaymentCenter() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<'overview' | 'methods' | 'history' | 'add'>('overview');
  const [selectedAmount, setSelectedAmount] = useState<string>('');
  const [customAmount, setCustomAmount] = useState<string>('');

  // Mock payment data
  const mockPaymentMethods: PaymentMethod[] = [
    {
      id: '1',
      type: 'multicaixa',
      name: 'Multicaixa Express',
      details: '•••• 4567',
      isDefault: true,
      status: 'active'
    },
    {
      id: '2',
      type: 'mobile',
      name: 'Unitel Money',
      details: '+244 923 ••• 789',
      isDefault: false,
      status: 'active'
    },
    {
      id: '3',
      type: 'card',
      name: 'Cartão Visa',
      details: '•••• •••• •••• 1234',
      isDefault: false,
      status: 'active'
    },
    {
      id: '4',
      type: 'bank',
      name: 'Transferência BAI',
      details: 'Conta corrente',
      isDefault: false,
      status: 'active'
    }
  ];

  const mockTransactions: Transaction[] = [
    {
      id: 'TXN-001',
      amount: 4000,
      type: 'subscription',
      status: 'completed',
      description: 'Assinatura mensal - Junho 2025',
      date: '2025-06-11T09:30:00',
      paymentMethod: 'Multicaixa Express',
      reference: 'MC240611093045'
    },
    {
      id: 'TXN-002',
      amount: 800,
      type: 'ride',
      status: 'completed',
      description: 'Bloeia UAN → Shopping Belas',
      date: '2025-06-10T14:30:00',
      paymentMethod: 'Unitel Money'
    },
    {
      id: 'TXN-003',
      amount: 1200,
      type: 'subscription',
      status: 'pending',
      description: 'Assinatura semanal - Semana 24',
      date: '2025-06-10T10:15:00',
      paymentMethod: 'Cartão Visa'
    },
    {
      id: 'TXN-004',
      amount: 600,
      type: 'refund',
      status: 'completed',
      description: 'Reembolso - Bloeia cancelada',
      date: '2025-06-09T16:20:00',
      paymentMethod: 'Multicaixa Express'
    }
  ];

  const totalSpent = mockTransactions
    .filter(t => t.status === 'completed' && t.type !== 'refund')
    .reduce((sum, t) => sum + t.amount, 0);

  const pendingAmount = mockTransactions
    .filter(t => t.status === 'pending')
    .reduce((sum, t) => sum + t.amount, 0);

  const processPaymentMutation = useMutation({
    mutationFn: async (data: { amount: number; methodId: string; type: string }) => {
      await apiRequest("POST", "/api/payments/process", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/payments'] });
      toast({
        title: "Pagamento processado",
        description: "Seu pagamento foi processado com sucesso.",
      });
    },
    onError: () => {
      toast({
        title: "Erro no pagamento",
        description: "Falha ao processar pagamento. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  const getPaymentMethodIcon = (type: string) => {
    switch (type) {
      case 'multicaixa': return Banknote;
      case 'mobile': return Smartphone;
      case 'card': return CreditCard;
      case 'bank': return Building2;
      default: return Wallet;
    }
  };

  const getTransactionStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'cancelled': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTransactionStatusText = (status: string) => {
    switch (status) {
      case 'completed': return 'Concluído';
      case 'pending': return 'Pendente';
      case 'failed': return 'Falhou';
      case 'cancelled': return 'Cancelado';
      default: return status;
    }
  };

  const formatAmount = (amount: number, type: string) => {
    const prefix = type === 'refund' ? '+' : '-';
    return `${prefix}${amount.toLocaleString()} AKZ`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-AO', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleQuickPayment = (amount: string) => {
    const numAmount = parseInt(amount);
    const defaultMethod = mockPaymentMethods.find(m => m.isDefault);
    
    if (defaultMethod) {
      processPaymentMutation.mutate({
        amount: numAmount,
        methodId: defaultMethod.id,
        type: 'subscription'
      });
    }
  };

  const predefinedAmounts = ['1200', '4000', '6000', '8000'];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setLocation("/profile")}
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Voltar
            </Button>
            <div className="text-center">
              <h2 className="font-bold text-lg">Centro de Pagamentos</h2>
              <p className="text-sm text-gray-600">Gerencie seus pagamentos</p>
            </div>
            <Button variant="outline" size="sm">
              <Receipt className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-6">
          <div className="flex space-x-8">
            {[
              { id: 'overview', label: 'Visão Geral', icon: DollarSign },
              { id: 'methods', label: 'Métodos', icon: CreditCard },
              { id: 'history', label: 'Histórico', icon: History },
              { id: 'add', label: 'Adicionar', icon: Plus }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 py-4 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Balance Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Gasto Total</p>
                      <p className="text-2xl font-bold text-gray-900">{totalSpent.toLocaleString()} AKZ</p>
                      <p className="text-xs text-green-600">Este mês</p>
                    </div>
                    <DollarSign className="h-8 w-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Pagamentos Pendentes</p>
                      <p className="text-2xl font-bold text-gray-900">{pendingAmount.toLocaleString()} AKZ</p>
                      <p className="text-xs text-yellow-600">Aguardando processamento</p>
                    </div>
                    <Clock className="h-8 w-8 text-yellow-500" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Métodos Ativos</p>
                      <p className="text-2xl font-bold text-gray-900">{mockPaymentMethods.length}</p>
                      <p className="text-xs text-blue-600">Configurados</p>
                    </div>
                    <CreditCard className="h-8 w-8 text-blue-500" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Payment */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Wallet className="h-5 w-5 text-primary" />
                  <span>Pagamento Rápido</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {predefinedAmounts.map((amount) => (
                    <Button
                      key={amount}
                      variant="outline"
                      className="h-16 text-center"
                      onClick={() => handleQuickPayment(amount)}
                      disabled={processPaymentMutation.isPending}
                    >
                      <div>
                        <p className="font-bold">{parseInt(amount).toLocaleString()}</p>
                        <p className="text-xs text-gray-600">AKZ</p>
                      </div>
                    </Button>
                  ))}
                </div>
                
                <div className="flex space-x-3">
                  <Input
                    placeholder="Valor personalizado"
                    value={customAmount}
                    onChange={(e) => setCustomAmount(e.target.value)}
                    type="number"
                    className="flex-1"
                  />
                  <Button 
                    className="gradient-bg text-white"
                    onClick={() => customAmount && handleQuickPayment(customAmount)}
                    disabled={!customAmount || processPaymentMutation.isPending}
                  >
                    Pagar
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Recent Transactions Preview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <History className="h-5 w-5 text-primary" />
                    <span>Transações Recentes</span>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => setActiveTab('history')}>
                    Ver todas
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockTransactions.slice(0, 3).map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-full ${
                          transaction.type === 'subscription' ? 'bg-blue-100' :
                          transaction.type === 'ride' ? 'bg-green-100' :
                          transaction.type === 'refund' ? 'bg-purple-100' :
                          'bg-gray-100'
                        }`}>
                          <DollarSign className={`h-4 w-4 ${
                            transaction.type === 'subscription' ? 'text-blue-600' :
                            transaction.type === 'ride' ? 'text-green-600' :
                            transaction.type === 'refund' ? 'text-purple-600' :
                            'text-gray-600'
                          }`} />
                        </div>
                        <div>
                          <p className="font-medium">{transaction.description}</p>
                          <p className="text-sm text-gray-600">{formatDate(transaction.date)}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`font-bold ${
                          transaction.type === 'refund' ? 'text-green-600' : 'text-gray-900'
                        }`}>
                          {formatAmount(transaction.amount, transaction.type)}
                        </p>
                        <Badge className={getTransactionStatusColor(transaction.status)}>
                          {getTransactionStatusText(transaction.status)}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'methods' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Métodos de Pagamento</h2>
              <Button className="gradient-bg text-white" onClick={() => setActiveTab('add')}>
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Método
              </Button>
            </div>

            <div className="grid gap-4">
              {mockPaymentMethods.map((method) => {
                const MethodIcon = getPaymentMethodIcon(method.type);
                return (
                  <Card key={method.id} className={method.isDefault ? 'ring-2 ring-primary' : ''}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="p-3 bg-gray-100 rounded-full">
                            <MethodIcon className="h-6 w-6 text-gray-600" />
                          </div>
                          <div>
                            <h3 className="font-medium flex items-center space-x-2">
                              <span>{method.name}</span>
                              {method.isDefault && (
                                <Badge className="bg-primary/10 text-primary">Padrão</Badge>
                              )}
                            </h3>
                            <p className="text-sm text-gray-600">{method.details}</p>
                            <Badge className={`mt-1 ${
                              method.status === 'active' ? 'bg-green-100 text-green-800' :
                              method.status === 'expired' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {method.status === 'active' ? 'Ativo' :
                               method.status === 'expired' ? 'Expirado' : 'Bloqueado'}
                            </Badge>
                          </div>
                        </div>
                        
                        <div className="flex space-x-2">
                          {!method.isDefault && (
                            <Button variant="outline" size="sm">
                              Definir como padrão
                            </Button>
                          )}
                          <Button variant="outline" size="sm">
                            Editar
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === 'history' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Histórico de Transações</h2>
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Exportar
              </Button>
            </div>

            <div className="space-y-3">
              {mockTransactions.map((transaction) => (
                <Card key={transaction.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className={`p-3 rounded-full ${
                          transaction.type === 'subscription' ? 'bg-blue-100' :
                          transaction.type === 'ride' ? 'bg-green-100' :
                          transaction.type === 'refund' ? 'bg-purple-100' :
                          'bg-gray-100'
                        }`}>
                          <DollarSign className={`h-6 w-6 ${
                            transaction.type === 'subscription' ? 'text-blue-600' :
                            transaction.type === 'ride' ? 'text-green-600' :
                            transaction.type === 'refund' ? 'text-purple-600' :
                            'text-gray-600'
                          }`} />
                        </div>
                        <div>
                          <h3 className="font-medium">{transaction.description}</h3>
                          <p className="text-sm text-gray-600">
                            {formatDate(transaction.date)} • {transaction.paymentMethod}
                          </p>
                          {transaction.reference && (
                            <p className="text-xs text-gray-500">Ref: {transaction.reference}</p>
                          )}
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <p className={`text-xl font-bold ${
                          transaction.type === 'refund' ? 'text-green-600' : 'text-gray-900'
                        }`}>
                          {formatAmount(transaction.amount, transaction.type)}
                        </p>
                        <Badge className={getTransactionStatusColor(transaction.status)}>
                          {getTransactionStatusText(transaction.status)}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'add' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Adicionar Método de Pagamento</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="p-6 text-center">
                  <Banknote className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="font-bold mb-2">Multicaixa Express</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Cartão Multicaixa para pagamentos instantâneos
                  </p>
                  <Button className="w-full">Adicionar Multicaixa</Button>
                </CardContent>
              </Card>

              <Card className="cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="p-6 text-center">
                  <Smartphone className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="font-bold mb-2">Carteira Móvel</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Unitel Money, Orange Money ou M-Kesh
                  </p>
                  <Button className="w-full">Adicionar Carteira</Button>
                </CardContent>
              </Card>

              <Card className="cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="p-6 text-center">
                  <CreditCard className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="font-bold mb-2">Cartão de Crédito/Débito</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Visa, Mastercard ou cartões locais
                  </p>
                  <Button className="w-full">Adicionar Cartão</Button>
                </CardContent>
              </Card>

              <Card className="cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="p-6 text-center">
                  <Building2 className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="font-bold mb-2">Transferência Bancária</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    BAI, BFA, BIC ou outros bancos
                  </p>
                  <Button className="w-full">Configurar Transferência</Button>
                </CardContent>
              </Card>
            </div>

            <Card className="border-blue-200 bg-blue-50">
              <CardContent className="p-6">
                <div className="flex items-start space-x-3">
                  <Lock className="h-5 w-5 text-blue-600 mt-1" />
                  <div>
                    <h4 className="font-medium text-blue-800 mb-2">Segurança dos Pagamentos</h4>
                    <ul className="text-sm text-blue-700 space-y-1">
                      <li>• Todos os dados são criptografados com SSL/TLS</li>
                      <li>• Nunca armazenamos dados sensíveis do cartão</li>
                      <li>• Conformidade com padrões PCI DSS</li>
                      <li>• Autenticação em duas etapas disponível</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}