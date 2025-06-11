import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import Login from "@/pages/login";
import Home from "@/pages/home";
import Map from "@/pages/map";
import Subscription from "@/pages/subscription";
import QRCode from "@/pages/qr-code";
import Rides from "@/pages/rides";
import Profile from "@/pages/profile";
import EditProfile from "@/pages/edit-profile";
import TermsPrivacy from "@/pages/terms-privacy";
import HelpSupport from "@/pages/help-support";
import Chat from "@/pages/chat";
import OfferRide from "@/pages/offer-ride";
import DriverDashboard from "@/pages/driver-dashboard";
import DriverCreateRide from "@/pages/driver-create-ride";
import Landing from "@/pages/landing";
import AdminDashboard from "@/pages/admin-dashboard";
import LiveTracking from "@/pages/live-tracking";
import Notifications from "@/pages/notifications";
import PaymentCenter from "@/pages/payment-center";
import NotFound from "@/pages/not-found";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <Switch>
      {!isAuthenticated ? (
        <Route path="/" component={Login} />
      ) : (
        <>
          <Route path="/" component={Home} />
          <Route path="/map" component={Map} />
          <Route path="/subscription" component={Subscription} />
          <Route path="/qr" component={QRCode} />
          <Route path="/rides" component={Rides} />
          <Route path="/profile" component={Profile} />
          <Route path="/edit-profile" component={EditProfile} />
          <Route path="/terms-privacy" component={TermsPrivacy} />
          <Route path="/help-support" component={HelpSupport} />
          <Route path="/chat" component={Chat} />
          <Route path="/offer-ride" component={OfferRide} />
          <Route path="/driver" component={DriverDashboard} />
          <Route path="/driver/create-ride" component={DriverCreateRide} />
          <Route path="/admin" component={AdminDashboard} />
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
        <div className="max-w-md mx-auto bg-white min-h-screen shadow-xl relative">
          <Toaster />
          <Router />
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
