import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import BottomNav from "@/components/bottom-nav";
import { ArrowLeft, RefreshCw, Bus, MapPin, Flag, Clock, Users as UsersIcon } from "lucide-react";

export default function Map() {
  const [, setLocation] = useLocation();
  const [busPosition, setBusPosition] = useState({ x: 50, y: 50 });

  const { data: buses } = useQuery({
    queryKey: ["/api/buses"],
  });

  const { data: schedules } = useQuery({
    queryKey: ["/api/schedules"],
  });

  // Simulate bus movement
  useEffect(() => {
    const interval = setInterval(() => {
      setBusPosition(prev => ({
        x: Math.max(20, Math.min(80, prev.x + (Math.random() - 0.5) * 10)),
        y: Math.max(20, Math.min(80, prev.y + (Math.random() - 0.5) * 10)),
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const getNextTrip = () => {
    if (!schedules?.length) return null;
    const now = new Date();
    
    return schedules.find((schedule: any) => {
      const [hours, minutes] = schedule.departureTime.split(':');
      const scheduleTime = new Date();
      scheduleTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);
      return scheduleTime > now;
    });
  };

  const nextTrip = getNextTrip();

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <div className="bg-white px-6 py-4 border-b border-muted">
        <div className="flex items-center justify-between">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => setLocation("/")}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h2 className="font-bold text-lg">Localização em Tempo Real</h2>
          <Button 
            variant="ghost" 
            size="sm"
            className="text-primary"
          >
            <RefreshCw className="h-5 w-5" />
          </Button>
        </div>
      </div>
      
      {/* Map Container */}
      <div className="relative bg-gradient-to-br from-blue-50 to-green-50 h-96">
        {/* Mock map background with street pattern */}
        <div className="absolute inset-0 opacity-20">
          <svg className="w-full h-full">
            <defs>
              <pattern id="streets" patternUnits="userSpaceOnUse" width="40" height="40">
                <rect width="40" height="40" fill="#f0f0f0"/>
                <rect x="18" y="0" width="4" height="40" fill="#ddd"/>
                <rect x="0" y="18" width="40" height="4" fill="#ddd"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#streets)"/>
          </svg>
        </div>
        
        {/* Route line */}
        <svg className="absolute inset-0 w-full h-full">
          <path 
            d={`M 20 80 Q 50 50 80 20`}
            stroke="hsl(78, 71%, 57%)" 
            strokeWidth="3" 
            fill="none" 
            strokeDasharray="5,5"
            className="animate-pulse"
          />
        </svg>
        
        {/* Bus location */}
        <div 
          className="absolute transition-all duration-3000 ease-in-out"
          style={{ 
            left: `${busPosition.x}%`, 
            top: `${busPosition.y}%`,
            transform: 'translate(-50%, -50%)'
          }}
        >
          <Card className="shadow-lg">
            <CardContent className="p-3">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 gradient-bg rounded-full flex items-center justify-center animate-pulse">
                  <Bus className="h-4 w-4 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-sm">Autocarro 001</p>
                  <p className="text-xs text-muted-foreground">5 min até você</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Bus stops */}
        <div className="absolute" style={{ left: '20%', top: '80%', transform: 'translate(-50%, -50%)' }}>
          <div className="w-3 h-3 bg-blue-500 rounded-full border-2 border-white shadow-lg"></div>
        </div>
        <div className="absolute" style={{ left: '80%', top: '20%', transform: 'translate(-50%, -50%)' }}>
          <div className="w-3 h-3 bg-primary rounded-full border-2 border-white shadow-lg"></div>
        </div>
      </div>
      
      {/* Trip Info */}
      <div className="px-6 py-4 space-y-4">
        <Card className="border border-muted shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold">Próxima Viagem</h3>
              <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                Em rota
              </Badge>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <div>
                  <p className="font-medium">Parada Central</p>
                  <p className="text-sm text-muted-foreground">08:25 - Embarque</p>
                </div>
              </div>
              
              <div className="ml-1.5 w-0.5 h-6 bg-muted"></div>
              
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-primary rounded-full"></div>
                <div>
                  <p className="font-medium">Campus Central</p>
                  <p className="text-sm text-muted-foreground">08:45 - Chegada</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Other buses */}
        <Card className="border border-muted shadow-sm">
          <CardContent className="p-4">
            <h4 className="font-semibold mb-3">Outros Autocarros</h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">Autocarro 002</span>
                <span className="text-sm text-muted-foreground">12 min</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Autocarro 003</span>
                <span className="text-sm text-muted-foreground">25 min</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Live tracking info */}
        <Card className="border border-muted shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2 mb-3">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <h4 className="font-semibold">Rastreamento Ativo</h4>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Velocidade</p>
                <p className="font-medium">45 km/h</p>
              </div>
              <div>
                <p className="text-muted-foreground">Passageiros</p>
                <p className="font-medium">12/40</p>
              </div>
              <div>
                <p className="text-muted-foreground">Próxima parada</p>
                <p className="font-medium">2 min</p>
              </div>
              <div>
                <p className="text-muted-foreground">Atraso</p>
                <p className="font-medium text-green-600">No horário</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <BottomNav currentPage="map" />
    </div>
  );
}
