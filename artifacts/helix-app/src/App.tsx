import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";

import NotFound from "@/pages/not-found";
import LandingPage from "@/pages/LandingPage";
import LoginPage from "@/pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";
import UserDashboard from "@/pages/UserDashboard";
import SendPage from "@/pages/SendPage";
import ReceivePage from "@/pages/ReceivePage";
import MerchantDashboard from "@/pages/MerchantDashboard";
import PosPage from "@/pages/PosPage";
import PaymentLinksPage from "@/pages/PaymentLinksPage";
import RevenuePage from "@/pages/RevenuePage";
import PayPage from "@/pages/PayPage";

import PublicLayout from "@/components/layout/PublicLayout";
import AppLayout from "@/components/layout/AppLayout";
import MerchantLayout from "@/components/layout/MerchantLayout";

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 1, staleTime: 30_000 } },
});

function Router() {
  return (
    <Switch>
      <Route path="/" component={() => <PublicLayout><LandingPage /></PublicLayout>} />
      <Route path="/login" component={LoginPage} />
      <Route path="/register" component={RegisterPage} />
      <Route path="/pay/:code" component={PayPage} />
      <Route path="/dashboard" component={() => <AppLayout><UserDashboard /></AppLayout>} />
      <Route path="/dashboard/send" component={() => <AppLayout><SendPage /></AppLayout>} />
      <Route path="/dashboard/receive" component={() => <AppLayout><ReceivePage /></AppLayout>} />
      <Route path="/merchant" component={() => <MerchantLayout><MerchantDashboard /></MerchantLayout>} />
      <Route path="/merchant/pos" component={() => <MerchantLayout><PosPage /></MerchantLayout>} />
      <Route path="/merchant/links" component={() => <MerchantLayout><PaymentLinksPage /></MerchantLayout>} />
      <Route path="/merchant/revenue" component={() => <MerchantLayout><RevenuePage /></MerchantLayout>} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <Router />
          </WouterRouter>
          <Toaster />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
