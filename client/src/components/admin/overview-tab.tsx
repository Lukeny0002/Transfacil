import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Car, Bus as BusIcon, TrendingUp, AlertTriangle, MapPin } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";

function StatsCard({
  title,
  value,
  icon,
}: {
  title: string;
  value?: number;
  icon: React.ReactNode;
}) {
  return (
    <Card data-testid={`card-stat-${title.toLowerCase().replace(/\s+/g, '-')}`}>
      <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold" data-testid={`text-${title.toLowerCase().replace(/\s+/g, '-')}`}>{value || 0}</div>
      </CardContent>
    </Card>
  );
}

export function OverviewTab() {
  const { toast } = useToast();
  const { data: stats, isLoading, error } = useQuery({
    queryKey: ['/api/admin/stats'],
    refetchInterval: 30000,
    retry: 3,
  });

  useEffect(() => {
    if (error) {
      toast({
        title: "Erro ao carregar estatísticas",
        description: "Não foi possível carregar as estatísticas do dashboard. Tente novamente mais tarde.",
        variant: "destructive",
      });
    }
  }, [error, toast]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold">Visão Geral</h2>
        <p className="text-muted-foreground">Estatísticas gerais do sistema</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total de Usuários"
          value={stats?.totalUsers}
          icon={<Users className="w-4 h-4" />}
        />
        <StatsCard
          title="Estudantes Ativos"
          value={stats?.activeStudents}
          icon={<Users className="w-4 h-4" />}
        />
        <StatsCard
          title="Estudantes Pendentes"
          value={stats?.pendingStudents}
          icon={<AlertTriangle className="w-4 h-4 text-destructive" />}
        />
        <StatsCard
          title="Motoristas Pendentes"
          value={stats?.pendingDrivers}
          icon={<AlertTriangle className="w-4 h-4 text-destructive" />}
        />
        <StatsCard
          title="Motoristas Ativos"
          value={stats?.activeDrivers}
          icon={<Car className="w-4 h-4" />}
        />
        <StatsCard
          title="Total de Caronas"
          value={stats?.totalRides}
          icon={<TrendingUp className="w-4 h-4" />}
        />
        <StatsCard
          title="Rotas Ativas"
          value={stats?.activeRoutes}
          icon={<MapPin className="w-4 h-4" />}
        />
        <StatsCard
          title="Ônibus Ativos"
          value={stats?.activeBuses}
          icon={<BusIcon className="w-4 h-4" />}
        />
      </div>
    </div>
  );
}
