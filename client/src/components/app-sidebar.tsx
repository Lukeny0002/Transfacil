import { useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import {
  BarChart3,
  Users,
  Calendar,
  CheckCircle,
  Home,
  Settings,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
} from "@/components/ui/sidebar";

const adminMenuItems = [
  {
    title: "Visão Geral",
    url: "/admin",
    icon: BarChart3,
  },
  {
    title: "Estudantes",
    url: "/admin/students",
    icon: CheckCircle,
  },
  {
    title: "Eventos",
    url: "/admin/events",
    icon: Calendar,
  },
  {
    title: "Dashboard Completo",
    url: "/admin/dashboard",
    icon: Settings,
  },
];

const userMenuItems = [
  {
    title: "Início",
    url: "/home",
    icon: Home,
  },
  {
    title: "Perfil",
    url: "/profile",
    icon: Users,
  },
  {
    title: "Configurações",
    url: "/settings",
    icon: Settings,
  },
];

export function AppSidebar() {
  const [location] = useLocation();
  const { isAdmin } = useAuth();

  const menuItems = isAdmin ? adminMenuItems : userMenuItems;

  return (
    <Sidebar>
      <SidebarHeader className="p-4 border-b">
        <h2 className="text-lg font-bold">UniTransporte</h2>
        {isAdmin && <p className="text-sm text-muted-foreground">Painel Admin</p>}
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>{isAdmin ? "Administração" : "Menu"}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={location === item.url}>
                    <a href={item.url} data-testid={`link-sidebar-${item.title.toLowerCase().replace(/\s+/g, '-')}`}>
                      <item.icon className="w-4 h-4" />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
