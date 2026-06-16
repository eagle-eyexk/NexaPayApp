import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";

import NotFound from "@/pages/not-found";
import LandingPage from "@/pages/LandingPage";
import WhitepaperPage from "@/pages/WhitepaperPage";
import ApiDocsPage from "@/pages/ApiDocsPage";
import ExplorerPage from "@/pages/ExplorerPage";
import AnalyticsPage from "@/pages/AnalyticsPage";
import TokenPage from "@/pages/TokenPage";
import GovernancePage from "@/pages/GovernancePage";
import LoginPage from "@/pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";
import UserDashboard from "@/pages/UserDashboard";
import SendPage from "@/pages/SendPage";
import ReceivePage from "@/pages/ReceivePage";
import NexaWalletPage from "@/pages/NexaWalletPage";
import SettingsPage from "@/pages/SettingsPage";
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
      <Route path="/whitepaper" component={() => <PublicLayout><WhitepaperPage /></PublicLayout>} />
      <Route path="/docs" component={() => <PublicLayout><ApiDocsPage /></PublicLayout>} />
      <Route path="/explorer" component={() => <PublicLayout noWrap><ExplorerPage /></PublicLayout>} />
      <Route path="/analytics" component={() => <PublicLayout noWrap><AnalyticsPage /></PublicLayout>} />
      <Route path="/token" component={() => <PublicLayout noWrap><TokenPage /></PublicLayout>} />
      <Route path="/governance" component={() => <PublicLayout noWrap><GovernancePage /></PublicLayout>} />
      <Route path="/login" component={LoginPage} />
      <Route path="/register" component={RegisterPage} />
      <Route path="/pay/:code" component={PayPage} />
      <Route path="/dashboard" component={() => <AppLayout><UserDashboard /></AppLayout>} />
      <Route path="/dashboard/send" component={() => <AppLayout><SendPage /></AppLayout>} />
      <Route path="/dashboard/receive" component={() => <AppLayout><ReceivePage /></AppLayout>} />
      <Route path="/dashboard/nexa" component={() => <AppLayout><NexaWalletPage /></AppLayout>} />
      <Route path="/dashboard/settings" component={() => <AppLayout><SettingsPage /></AppLayout>} />
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
