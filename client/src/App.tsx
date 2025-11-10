import { Switch, Route, useLocation } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
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

  return (
    <Switch>
      {!isAuthenticated ? (
        <>
          <Route path="/" component={Login} />
          <Route path="/login" component={Login} />
        </>
      ) : (
        <>
          <Route path="/" component={Home} />
          <Route path="/home" component={Home} />
          <Route path="/map" component={Map} />
          <Route path="/subscription" component={Subscription} />
          <Route path="/qr" component={QRCode} />
          <Route path="/rides" component={Rides} />
          <Route path="/events" component={Events} />
        <Route path="/events/:id/reserve" component={EventReserve} />
          <Route path="/bookings" component={BookingsHistory} />
          <Route path="/admin" component={AdminDashboard} />
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
        </>
      )}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="w-full min-h-screen bg-white relative md:max-w-2xl lg:max-w-4xl xl:max-w-6xl mx-auto md:shadow-xl">
          <Toaster />
          <Router />
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;