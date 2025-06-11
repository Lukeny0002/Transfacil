import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { Home, Map, Users, User } from "lucide-react";

interface BottomNavProps {
  currentPage: string;
}

export default function BottomNav({ currentPage }: BottomNavProps) {
  const [, setLocation] = useLocation();

  const navItems = [
    { id: "home", label: "Início", icon: Home, path: "/" },
    { id: "map", label: "Mapa", icon: Map, path: "/map" },
    { id: "rides", label: "Caronas", icon: Users, path: "/rides" },
    { id: "profile", label: "Perfil", icon: User, path: "/profile" },
  ];

  return (
    <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-md bg-white border-t border-muted">
      <div className="flex items-center justify-around py-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          
          return (
            <Button
              key={item.id}
              variant="ghost"
              size="sm"
              className={`flex flex-col items-center p-3 space-y-1 ${
                isActive 
                  ? "text-primary" 
                  : "text-muted-foreground hover:text-foreground"
              }`}
              onClick={() => setLocation(item.path)}
            >
              <Icon className="h-5 w-5" />
              <span className={`text-xs ${isActive ? "font-medium" : ""}`}>
                {item.label}
              </span>
            </Button>
          );
        })}
      </div>
    </div>
  );
}
