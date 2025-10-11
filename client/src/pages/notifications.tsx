import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { 
  Bell, 
  ArrowLeft, 
  Clock, 
  MapPin, 
  Users, 
  Car, 
  AlertTriangle,
  CheckCircle,
  Settings,
  Trash2,
  CheckCheck,
  Filter,
  VolumeX,
  Volume2
} from "lucide-react";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'ride' | 'payment' | 'system' | 'emergency' | 'promotion';
  timestamp: string;
  read: boolean;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  actionUrl?: string;
  data?: any;
}

export default function Notifications() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [filter, setFilter] = useState<'all' | 'unread' | 'ride' | 'payment'>('all');
  const [notificationSettings, setNotificationSettings] = useState({
    rideUpdates: true,
    paymentAlerts: true,
    promotions: false,
    emergencyAlerts: true,
    chatMessages: true,
    weeklyReport: true,
    soundEnabled: true,
    vibrationEnabled: true
  });

  // Mock notifications data
  const mockNotifications: Notification[] = [
    {
      id: '1',
      title: 'Viagem confirmada',
      message: 'Sua viagem para Shopping Belas foi confirmada para hoje às 14:30',
      type: 'ride',
      timestamp: '2025-06-11T10:15:00',
      read: false,
      priority: 'normal',
      actionUrl: '/live-tracking',
      data: { rideId: 'TF-001234' }
    },
    {
      id: '2',
      title: 'Motorista a caminho',
      message: 'João Manuel está a 5 minutos do ponto de encontro',
      type: 'ride',
      timestamp: '2025-06-11T10:10:00',
      read: false,
      priority: 'high',
      actionUrl: '/live-tracking'
    },
    {
      id: '3',
      title: 'Pagamento processado',
      message: 'Sua assinatura mensal foi renovada com sucesso - 4.000 AKZ',
      type: 'payment',
      timestamp: '2025-06-11T09:30:00',
      read: true,
      priority: 'normal',
      actionUrl: '/subscription'
    },
    {
      id: '4',
      title: 'Nova promoção disponível',
      message: 'Ganhe 20% de desconto na sua próxima assinatura semanal',
      type: 'promotion',
      timestamp: '2025-06-11T08:00:00',
      read: true,
      priority: 'low',
      actionUrl: '/subscription'
    },
    {
      id: '5',
      title: 'Solicitação de Bloeia aceita',
      message: 'Maria Santos aceitou sua solicitação de Bloeia para ISPTEC',
      type: 'ride',
      timestamp: '2025-06-10T18:45:00',
      read: true,
      priority: 'normal',
      actionUrl: '/chat'
    },
    {
      id: '6',
      title: 'Manutenção programada',
      message: 'O sistema estará em manutenção amanhã das 02:00 às 04:00',
      type: 'system',
      timestamp: '2025-06-10T16:20:00',
      read: true,
      priority: 'normal'
    }
  ];

  const markAsReadMutation = useMutation({
    mutationFn: async (notificationId: string) => {
      await apiRequest("POST", `/api/notifications/${notificationId}/read`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/notifications'] });
      toast({
        title: "Notificação marcada como lida",
      });
    },
  });

  const deleteNotificationMutation = useMutation({
    mutationFn: async (notificationId: string) => {
      await apiRequest("DELETE", `/api/notifications/${notificationId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/notifications'] });
      toast({
        title: "Notificação removida",
      });
    },
  });

  const updateSettingsMutation = useMutation({
    mutationFn: async (settings: any) => {
      await apiRequest("PUT", "/api/notifications/settings", settings);
    },
    onSuccess: () => {
      toast({
        title: "Configurações atualizadas",
        description: "Suas preferências de notificação foram salvas.",
      });
    },
  });

  const filteredNotifications = mockNotifications.filter(notification => {
    if (filter === 'unread') return !notification.read;
    if (filter === 'ride') return notification.type === 'ride';
    if (filter === 'payment') return notification.type === 'payment';
    return true;
  });

  const unreadCount = mockNotifications.filter(n => !n.read).length;

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'ride': return Car;
      case 'payment': return CheckCircle;
      case 'system': return Settings;
      case 'emergency': return AlertTriangle;
      case 'promotion': return Bell;
      default: return Bell;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'border-l-red-500 bg-red-50';
      case 'high': return 'border-l-orange-500 bg-orange-50';
      case 'normal': return 'border-l-blue-500 bg-blue-50';
      case 'low': return 'border-l-gray-500 bg-gray-50';
      default: return 'border-l-gray-500 bg-gray-50';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Agora há pouco';
    if (diffInHours < 24) return `${diffInHours}h atrás`;
    return date.toLocaleDateString('pt-AO');
  };

  const toggleSetting = (key: string) => {
    const newSettings = { ...notificationSettings, [key]: !notificationSettings[key] };
    setNotificationSettings(newSettings);
    updateSettingsMutation.mutate(newSettings);
  };

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
              <h2 className="font-bold text-lg">Notificações</h2>
              {unreadCount > 0 && (
                <p className="text-sm text-gray-600">{unreadCount} não lidas</p>
              )}
            </div>
            <div className="w-16"></div>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Quick Actions */}
        <div className="flex flex-wrap gap-3">
          <Button 
            variant={filter === 'all' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setFilter('all')}
          >
            Todas ({mockNotifications.length})
          </Button>
          <Button 
            variant={filter === 'unread' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setFilter('unread')}
          >
            Não lidas ({unreadCount})
          </Button>
          <Button 
            variant={filter === 'ride' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setFilter('ride')}
          >
            <Car className="h-3 w-3 mr-1" />
            Viagens
          </Button>
          <Button 
            variant={filter === 'payment' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setFilter('payment')}
          >
            <CheckCircle className="h-3 w-3 mr-1" />
            Pagamentos
          </Button>
        </div>

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Settings className="h-5 w-5 text-primary" />
              <span>Configurações de Notificação</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="ride-updates">Atualizações de viagem</Label>
                <Switch
                  id="ride-updates"
                  checked={notificationSettings.rideUpdates}
                  onCheckedChange={() => toggleSetting('rideUpdates')}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="payment-alerts">Alertas de pagamento</Label>
                <Switch
                  id="payment-alerts"
                  checked={notificationSettings.paymentAlerts}
                  onCheckedChange={() => toggleSetting('paymentAlerts')}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="promotions">Promoções</Label>
                <Switch
                  id="promotions"
                  checked={notificationSettings.promotions}
                  onCheckedChange={() => toggleSetting('promotions')}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="emergency">Alertas de emergência</Label>
                <Switch
                  id="emergency"
                  checked={notificationSettings.emergencyAlerts}
                  onCheckedChange={() => toggleSetting('emergencyAlerts')}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="chat">Mensagens do chat</Label>
                <Switch
                  id="chat"
                  checked={notificationSettings.chatMessages}
                  onCheckedChange={() => toggleSetting('chatMessages')}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="weekly">Relatório semanal</Label>
                <Switch
                  id="weekly"
                  checked={notificationSettings.weeklyReport}
                  onCheckedChange={() => toggleSetting('weeklyReport')}
                />
              </div>
            </div>
            
            <div className="pt-4 border-t border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {notificationSettings.soundEnabled ? (
                    <Volume2 className="h-4 w-4 text-primary" />
                  ) : (
                    <VolumeX className="h-4 w-4 text-gray-400" />
                  )}
                  <Label htmlFor="sound">Som das notificações</Label>
                </div>
                <Switch
                  id="sound"
                  checked={notificationSettings.soundEnabled}
                  onCheckedChange={() => toggleSetting('soundEnabled')}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notifications List */}
        <div className="space-y-3">
          {filteredNotifications.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Nenhuma notificação
                </h3>
                <p className="text-gray-600">
                  {filter === 'unread' 
                    ? 'Todas as notificações foram lidas.' 
                    : 'Você não tem notificações no momento.'
                  }
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredNotifications.map((notification) => {
              const NotificationIcon = getNotificationIcon(notification.type);
              return (
                <Card 
                  key={notification.id} 
                  className={`border-l-4 ${getPriorityColor(notification.priority)} ${
                    !notification.read ? 'ring-1 ring-primary/20' : ''
                  }`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3 flex-1">
                        <div className={`p-2 rounded-full ${
                          notification.type === 'ride' ? 'bg-blue-100' :
                          notification.type === 'payment' ? 'bg-green-100' :
                          notification.type === 'emergency' ? 'bg-red-100' :
                          notification.type === 'promotion' ? 'bg-purple-100' :
                          'bg-gray-100'
                        }`}>
                          <NotificationIcon className={`h-4 w-4 ${
                            notification.type === 'ride' ? 'text-blue-600' :
                            notification.type === 'payment' ? 'text-green-600' :
                            notification.type === 'emergency' ? 'text-red-600' :
                            notification.type === 'promotion' ? 'text-purple-600' :
                            'text-gray-600'
                          }`} />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-1">
                            <h3 className={`font-medium ${!notification.read ? 'text-gray-900' : 'text-gray-700'}`}>
                              {notification.title}
                            </h3>
                            {!notification.read && (
                              <div className="w-2 h-2 bg-primary rounded-full"></div>
                            )}
                          </div>
                          
                          <p className="text-sm text-gray-600 mb-2">
                            {notification.message}
                          </p>
                          
                          <div className="flex items-center space-x-4 text-xs text-gray-500">
                            <span>{formatTimestamp(notification.timestamp)}</span>
                            <Badge variant="outline" className="text-xs">
                              {notification.type === 'ride' ? 'Viagem' :
                               notification.type === 'payment' ? 'Pagamento' :
                               notification.type === 'emergency' ? 'Emergência' :
                               notification.type === 'promotion' ? 'Promoção' :
                               'Sistema'}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex space-x-1 ml-4">
                        {!notification.read && (
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => markAsReadMutation.mutate(notification.id)}
                          >
                            <CheckCheck className="h-3 w-3" />
                          </Button>
                        )}
                        
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => deleteNotificationMutation.mutate(notification.id)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    
                    {notification.actionUrl && (
                      <div className="mt-3 pt-3 border-t border-gray-100">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setLocation(notification.actionUrl!)}
                        >
                          Ver detalhes
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>

        {/* Quick Actions */}
        {filteredNotifications.length > 0 && (
          <div className="flex space-x-4">
            <Button variant="outline" className="flex-1">
              <CheckCheck className="h-4 w-4 mr-2" />
              Marcar todas como lidas
            </Button>
            <Button variant="outline" className="flex-1">
              <Trash2 className="h-4 w-4 mr-2" />
              Limpar lidas
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}