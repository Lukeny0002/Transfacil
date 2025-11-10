import { Switch, Route, useLocation } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { useAuth } from "@/hooks/useAuth";
import { useEffect } from "react";
import NotFound from "@/pages/not-found";
import Login from "@/pages/login";
import Home from "@/pages/home";
import Map from "@/pages/map";
import Subscription from "@/pages/subscription";
import QRCode from "@/pages/qr-code";
import Rides from "@/pages/rides";
import Events from "@/pages/events";
import EventReserve from "@/pages/event-reserve";
import Profile from "@/pages/profile";
import EditProfile from "@/pages/edit-profile";
import TermsPrivacy from "@/pages/terms-privacy";
import HelpSupport from "@/pages/help-support";
import Chat from "@/pages/chat";
import OfferRide from "@/pages/offer-ride";
import DriverDashboard from "@/pages/driver-dashboard";
import DriverCreateRide from "@/pages/driver-create-ride";
import DriverSettings from "@/pages/driver-settings";
import AdminDashboard from "@/pages/admin-dashboard";
import AdminOverview from "@/pages/admin/overview";
import AdminEvents from "@/pages/admin/events";
import AdminStudents from "@/pages/admin/students";
import LiveTracking from "@/pages/live-tracking";
import Notifications from "@/pages/notifications";
import PaymentCenter from "@/pages/payment-center";
import BookingsHistory from "@/pages/bookings-history";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();
  const [location, setLocation] = useLocation();

  useEffect(() => {
    if (!isLoading && !isAuthenticated && location !== '/login') {
      setLocation('/login');
    }
  }, [isAuthenticated, isLoading, location, setLocation]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  const isAdminRoute = location.startsWith('/admin');

  if (!isAuthenticated) {
    return (
      <Switch>
        <Route path="/" component={Login} />
        <Route path="/login" component={Login} />
        <Route component={NotFound} />
      </Switch>
    );
  }

  if (isAdminRoute) {
    return (
      <Switch>
        <Route path="/admin" component={AdminOverview} />
        <Route path="/admin/students" component={AdminStudents} />
        <Route path="/admin/events" component={AdminEvents} />
        <Route path="/admin/dashboard" component={AdminDashboard} />
        <Route component={NotFound} />
      </Switch>
    );
  }

  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/home" component={Home} />
      <Route path="/map" component={Map} />
      <Route path="/subscription" component={Subscription} />
      <Route path="/qr" component={QRCode} />
      <Route path="/rides" component={Rides} />
      <Route path="/events" component={Events} />
      <Route path="/events/:id/reserve" component={EventReserve} />
      <Route path="/bookings" component={BookingsHistory} />
      <Route path="/profile" component={Profile} />
      <Route path="/edit-profile" component={EditProfile} />
      <Route path="/terms-privacy" component={TermsPrivacy} />
      <Route path="/help-support" component={HelpSupport} />
      <Route path="/chat" component={Chat} />
      <Route path="/offer-ride" component={OfferRide} />
      <Route path="/driver" component={DriverDashboard} />
      <Route path="/driver/create-ride" component={DriverCreateRide} />
      <Route path="/driver/settings" component={DriverSettings} />
      <Route path="/live-tracking" component={LiveTracking} />
      <Route path="/notifications" component={Notifications} />
      <Route path="/payments" component={PaymentCenter} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const [location] = useLocation();
  const isAdminRoute = location.startsWith('/admin');

  const sidebarStyle = {
    "--sidebar-width": "20rem",
    "--sidebar-width-icon": "4rem",
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        {isAdminRoute ? (
          <SidebarProvider style={sidebarStyle as React.CSSProperties}>
            <div className="flex h-screen w-full">
              <AppSidebar />
              <div className="flex flex-col flex-1">
                <header className="flex items-center justify-between p-4 border-b">
                  <SidebarTrigger data-testid="button-sidebar-toggle" />
                  <h1 className="text-lg font-semibold">Painel Administrativo</h1>
                </header>
                <main className="flex-1 overflow-auto">
                  <Router />
                </main>
              </div>
            </div>
            <Toaster />
          </SidebarProvider>
        ) : (
          <div className="w-full min-h-screen bg-white relative md:max-w-2xl lg:max-w-4xl xl:max-w-6xl mx-auto md:shadow-xl">
            <Toaster />
            <Router />
          </div>
        )}
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;