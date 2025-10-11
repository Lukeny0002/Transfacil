import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Send, Phone, Info } from "lucide-react";

interface Message {
  id: string;
  text: string;
  sender: 'me' | 'other';
  timestamp: Date;
}

export default function Chat() {
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Olá! Gostaria de solicitar uma carona para o Campus Central hoje às 14h30. Obrigado!',
      sender: 'me',
      timestamp: new Date(Date.now() - 300000)
    },
    {
      id: '2',
      text: 'Olá! Claro, tenho uma vaga disponível. Vou buscar na Universidade Católica às 14h25. Isso serve?',
      sender: 'other',
      timestamp: new Date(Date.now() - 240000)
    },
    {
      id: '3',
      text: 'Perfeito! Vou estar esperando na entrada principal. Como vou reconhecer o carro?',
      sender: 'me',
      timestamp: new Date(Date.now() - 180000)
    },
    {
      id: '4',
      text: 'É um Toyota Corolla branco, placa ABX-123. Vou estar usando camisa azul. Meu WhatsApp é +244 923 456 789 para qualquer emergência.',
      sender: 'other',
      timestamp: new Date(Date.now() - 120000)
    },
    {
      id: '5',
      text: 'Ótimo! Obrigado pela carona. Vou estar lá pontualmente.',
      sender: 'me',
      timestamp: new Date(Date.now() - 60000)
    }
  ]);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = () => {
    if (!message.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text: message,
      sender: 'me',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newMessage]);
    setMessage("");

    // Simulate response after 2 seconds
    setTimeout(() => {
      const responses = [
        "Perfeito! Até logo.",
        "Combinado! Nos vemos lá.",
        "Ok, obrigado!",
        "Ótimo, vamos manter contato.",
        "Tudo certo por aqui."
      ];
      
      const response: Message = {
        id: (Date.now() + 1).toString(),
        text: responses[Math.floor(Math.random() * responses.length)],
        sender: 'other',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, response]);
    }, 2000);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('pt-AO', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <div className="bg-white px-6 py-4 border-b border-muted">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              size="sm"
              className="mr-4"
              onClick={() => setLocation("/rides")}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
                <span className="font-bold text-muted-foreground">MS</span>
              </div>
              <div>
                <h2 className="font-bold">Maria Santos</h2>
                <p className="text-sm text-muted-foreground">Online agora</p>
              </div>
            </div>
          </div>
          <div className="flex space-x-2">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => window.open('tel:+244923456789')}
            >
              <Phone className="h-5 w-5" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => {
                toast({
                  title: "Informações do Motorista",
                  description: "Maria Santos • 4.8★ • 23 viagens • Toyota Corolla branco ABX-123",
                });
              }}
            >
              <Info className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Trip Info Banner */}
      <div className="bg-primary/10 px-6 py-3 border-b border-muted">
        <div className="text-center">
          <p className="text-sm font-medium">Carona: UAN → Shopping Belas</p>
          <p className="text-xs text-muted-foreground">Hoje, 14:30 • 2 lugares disponíveis</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                msg.sender === 'me'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-foreground'
              }`}
            >
              <p className="text-sm">{msg.text}</p>
              <p className={`text-xs mt-1 ${
                msg.sender === 'me' 
                  ? 'text-primary-foreground/70' 
                  : 'text-muted-foreground'
              }`}>
                {formatTime(msg.timestamp)}
              </p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="bg-white border-t border-muted px-6 py-4">
        <div className="flex items-center space-x-2">
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Digite sua mensagem..."
            className="flex-1 rounded-full"
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          />
          <Button
            size="sm"
            className="rounded-full w-10 h-10 p-0 gradient-bg text-white"
            onClick={sendMessage}
            disabled={!message.trim()}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}